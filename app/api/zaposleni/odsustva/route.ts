
import { db } from "@/db";
import { eq, desc } from "drizzle-orm";
import { NextResponse } from "next/server";
import { getAuthCookie, verifyAuthToken } from "@/lib/auth/jwt";
import { korisnik } from "@/db/schema/korisnik";
import { zaposleni } from "@/db/schema/zaposleni";
import { zahtevZaOdsustvo } from "@/db/schema/zahtev_za_odsustvo";


type CreateZahtevBody = {
  datumOd?: string;
  datumDo?: string;
  razlog?: string;
};

export async function GET() {
  const token = await getAuthCookie();
  if (!token) return NextResponse.json({ error: "Nije ulogovan" }, { status: 401 });

  const payload = await verifyAuthToken(token);

  const emp = await db
    .select({ id: zaposleni.id })
    .from(zaposleni)
    .innerJoin(korisnik, eq(korisnik.id, zaposleni.korisnikId))
    .where(eq(korisnik.id, payload.korisnikId))
    .limit(1);

  if (!emp.length) return NextResponse.json({ error: "Zaposleni ne postoji" }, { status: 404 });

  const rows = await db
    .select()
    .from(zahtevZaOdsustvo)
    .where(eq(zahtevZaOdsustvo.zaposleniId, emp[0].id))
    .orderBy(desc(zahtevZaOdsustvo.datumKreiranja));

  return NextResponse.json(rows, { status: 200 });
}

export async function POST(req: Request) {
  try {
    const token = await getAuthCookie();
    if (!token) {
      return NextResponse.json({ error: "Nije ulogovan" }, { status: 401 });
    }

    const payload = await verifyAuthToken(token);
    let body: CreateZahtevBody | null = null;
    try {
      body = (await req.json()) as CreateZahtevBody;
    } catch {
      body = null;
    }

    const datumOd = body?.datumOd;
    const datumDo = body?.datumDo;
    const razlog = body?.razlog?.trim();

    if (!datumOd || !datumDo || !razlog) {
      return NextResponse.json({ error: "Neispravni podaci" }, { status: 400 });
    }
    if (razlog.length > 500) {
      return NextResponse.json({ error: "Razlog je predugačak (max 500)" }, { status: 400 });
    }

    const dOd = new Date(datumOd);
    const dDo = new Date(datumDo);

    if (Number.isNaN(dOd.getTime()) || Number.isNaN(dDo.getTime())) {
      return NextResponse.json({ error: "Neispravan format datuma" }, { status: 400 });
    }
    if (dDo < dOd) {
      return NextResponse.json({ error: "Datum do ne može biti pre datuma od" }, { status: 400 });
    }

    const empRows = await db
      .select({
        zaposleniId: zaposleni.id,
        statusZaposlenja: zaposleni.statusZaposlenja,
        statusNaloga: korisnik.statusNaloga,
      })
      .from(zaposleni)
      .innerJoin(korisnik, eq(korisnik.id, zaposleni.korisnikId))
      .where(eq(korisnik.id, payload.korisnikId))
      .limit(1);

    if (empRows.length === 0) {
      return NextResponse.json({ error: "Zaposleni ne postoji" }, { status: 404 });
    }

    const emp = empRows[0];

    if (!emp.statusNaloga) {
      return NextResponse.json({ error: "Korisnički nalog je deaktiviran" }, { status: 403 });
    }
    if (!emp.statusZaposlenja) {
      return NextResponse.json({ error: "Zaposleni nije aktivan" }, { status: 403 });
    }

    const inserted = await db
      .insert(zahtevZaOdsustvo)
      .values({
        zaposleniId: emp.zaposleniId,
        statusId: 1,
        datumOd,
        datumDo,
        razlog,
      })
      .returning({
        id: zahtevZaOdsustvo.id,
        datumOd: zahtevZaOdsustvo.datumOd,
        datumDo: zahtevZaOdsustvo.datumDo,
        razlog: zahtevZaOdsustvo.razlog,
        datumKreiranja: zahtevZaOdsustvo.datumKreiranja,
        datumAzuriranja: zahtevZaOdsustvo.datumAzuriranja,
        statusId: zahtevZaOdsustvo.statusId,
      });

    return NextResponse.json(inserted[0], { status: 201 });
  } catch (e) {
    console.error("POST /api/zaposleni/odsustva failed:", e);
    return NextResponse.json({ error: "Server greška" }, { status: 500 });
  }
}