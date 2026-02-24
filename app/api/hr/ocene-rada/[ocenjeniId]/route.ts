import { db } from "@/db";
import { desc, eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { getAuthCookie, verifyAuthToken } from "@/lib/auth/jwt";
import { korisnik } from "@/db/schema/korisnik";
import { zaposleni } from "@/db/schema/zaposleni";
import { ocenaRada } from "@/db/schema/ocena_rada";
import { alias } from "drizzle-orm/pg-core";

type CreateOcenaBody = {
  datumOd?: string;
  datumDo?: string;
  ocena?: number;
  komentar?: string;
};

const EMPLOYEE_ROLE_ID = 3;

function isValidDateString(s: string) {
  const d = new Date(s);
  return !Number.isNaN(d.getTime());
}

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ ocenjeniId: string }> }
) {
  try {
    const token = await getAuthCookie();
    if (!token) return NextResponse.json({ error: "Nije ulogovan" }, { status: 401 });

    const payload = await verifyAuthToken(token);

    const { ocenjeniId } = await params;
    const ocenjeniIdNum = Number(ocenjeniId);
    if (!Number.isFinite(ocenjeniIdNum)) {
      return NextResponse.json({ error: "Neispravan ocenjeniId" }, { status: 400 });
    }

    const me = await db
      .select({
        korisnikId: korisnik.id,
        ulogaId: korisnik.ulogaId,
        statusNaloga: korisnik.statusNaloga,
        zaposleniId: zaposleni.id,
        statusZaposlenja: zaposleni.statusZaposlenja,
      })
      .from(korisnik)
      .innerJoin(zaposleni, eq(zaposleni.korisnikId, korisnik.id))
      .where(eq(korisnik.id, payload.korisnikId))
      .limit(1);

    if (me.length === 0) {
      return NextResponse.json({ error: "Zaposleni ne postoji" }, { status: 404 });
    }

    if (!me[0].statusNaloga) {
      return NextResponse.json({ error: "Korisnički nalog je deaktiviran" }, { status: 403 });
    }
    if (!me[0].statusZaposlenja) {
      return NextResponse.json({ error: "Zaposleni nije aktivan" }, { status: 403 });
    }
    if (me[0].ulogaId === EMPLOYEE_ROLE_ID) {
      return NextResponse.json({ error: "Nemate pristup" }, { status: 403 });
    }

    const ocenjeniExists = await db
      .select({ id: zaposleni.id })
      .from(zaposleni)
      .where(eq(zaposleni.id, ocenjeniIdNum))
      .limit(1);

    if (ocenjeniExists.length === 0) {
      return NextResponse.json({ error: "Ocenjeni zaposleni ne postoji" }, { status: 404 });
    }

    const autor = alias(zaposleni, "autor");
    const autorKorisnik = alias(korisnik, "autor_korisnik");

    const rows = await db
      .select({
        id: ocenaRada.id,
        autorId: ocenaRada.autorId,
        ocenjeniId: ocenaRada.ocenjeniId,
        datumOd: ocenaRada.datumOd,
        datumDo: ocenaRada.datumDo,
        ocena: ocenaRada.ocena,
        komentar: ocenaRada.komentar,
        datumKreiranja: ocenaRada.datumKreiranja,
        autorIme: autor.ime,
        autorPrezime: autor.prezime,
        autorEmail: autorKorisnik.email,
      })
      .from(ocenaRada)
      .innerJoin(autor, eq(autor.id, ocenaRada.autorId))
      .innerJoin(autorKorisnik, eq(autorKorisnik.id, autor.korisnikId))
      .where(eq(ocenaRada.ocenjeniId, ocenjeniIdNum))
      .orderBy(desc(ocenaRada.datumKreiranja));

    return NextResponse.json(rows, { status: 200 });
  } catch (e) {
    console.error("GET /api/hr/ocene-rada/[ocenjeniId] failed:", e);
    return NextResponse.json({ error: "Server greška" }, { status: 500 });
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ ocenjeniId: string }> }
) {
  try {
    const token = await getAuthCookie();
    if (!token) return NextResponse.json({ error: "Nije ulogovan" }, { status: 401 });

    const payload = await verifyAuthToken(token);

    const { ocenjeniId } = await params;
    const ocenjeniIdNum = Number(ocenjeniId);
    if (!Number.isFinite(ocenjeniIdNum)) {
      return NextResponse.json({ error: "Neispravan ocenjeniId" }, { status: 400 });
    }

    let body: CreateOcenaBody | null = null;
    try {
      body = (await req.json()) as CreateOcenaBody;
    } catch {
      body = null;
    }

    const datumOd = body?.datumOd;
    const datumDo = body?.datumDo;
    const ocena = body?.ocena;
    const komentar = body?.komentar?.trim();

    if (!datumOd || !datumDo || ocena === undefined || ocena === null) {
      return NextResponse.json({ error: "Neispravni podaci" }, { status: 400 });
    }

    if (!isValidDateString(datumOd) || !isValidDateString(datumDo)) {
      return NextResponse.json({ error: "Neispravan format datuma" }, { status: 400 });
    }

    const dOd = new Date(datumOd);
    const dDo = new Date(datumDo);
    if (dDo < dOd) {
      return NextResponse.json({ error: "Datum do ne može biti pre datuma od" }, { status: 400 });
    }
    const today = new Date();
    if (dDo > today) {
      return NextResponse.json(
        { error: "Datum do ne može biti u budućnosti" },
        { status: 400 }
      );
    }

    if (!Number.isInteger(ocena) || ocena < 1 || ocena > 5) {
      return NextResponse.json({ error: "Ocena mora biti ceo broj od 1 do 5" }, { status: 400 });
    }

    if (komentar && komentar.length > 1000) {
      return NextResponse.json({ error: "Komentar je predugačak (max 1000)" }, { status: 400 });
    }

    const me = await db
      .select({
        korisnikId: korisnik.id,
        ulogaId: korisnik.ulogaId,
        statusNaloga: korisnik.statusNaloga,
        zaposleniId: zaposleni.id,
        statusZaposlenja: zaposleni.statusZaposlenja,
      })
      .from(korisnik)
      .innerJoin(zaposleni, eq(zaposleni.korisnikId, korisnik.id))
      .where(eq(korisnik.id, payload.korisnikId))
      .limit(1);

    if (me.length === 0) {
      return NextResponse.json({ error: "Zaposleni ne postoji" }, { status: 404 });
    }

    if (!me[0].statusNaloga) {
      return NextResponse.json({ error: "Korisnički nalog je deaktiviran" }, { status: 403 });
    }
    if (!me[0].statusZaposlenja) {
      return NextResponse.json({ error: "Zaposleni nije aktivan" }, { status: 403 });
    }
    if (me[0].ulogaId === EMPLOYEE_ROLE_ID) {
      return NextResponse.json({ error: "Nemate pristup" }, { status: 403 });
    }

    const autorId = me[0].zaposleniId;

    if (autorId === ocenjeniIdNum) {
      return NextResponse.json({ error: "Ne možeš da oceniš samog sebe" }, { status: 400 });
    }

    const ocenjeniExists = await db
      .select({
        id: zaposleni.id,
        statusZaposlenja: zaposleni.statusZaposlenja,
      })
      .from(zaposleni)
      .where(eq(zaposleni.id, ocenjeniIdNum))
      .limit(1);

    if (ocenjeniExists.length === 0) {
      return NextResponse.json({ error: "Ocenjeni zaposleni ne postoji" }, { status: 404 });
    }

    if (ocenjeniExists[0].statusZaposlenja !== true) {
      return NextResponse.json(
        { error: "Ocenjeni zaposleni nije aktivan" },
        { status: 400 }
      );
    }

    const inserted = await db
      .insert(ocenaRada)
      .values({
        autorId,
        ocenjeniId: ocenjeniIdNum,
        datumOd,
        datumDo,
        ocena,
        komentar: komentar ? komentar : null,
      })
      .returning({
        id: ocenaRada.id,
        autorId: ocenaRada.autorId,
        ocenjeniId: ocenaRada.ocenjeniId,
        datumOd: ocenaRada.datumOd,
        datumDo: ocenaRada.datumDo,
        ocena: ocenaRada.ocena,
        komentar: ocenaRada.komentar,
        datumKreiranja: ocenaRada.datumKreiranja,
      });

    return NextResponse.json(inserted[0], { status: 201 });
  } catch (e) {
    console.error("POST /api/hr/ocene-rada/[ocenjeniId] failed:", e);
    return NextResponse.json({ error: "Server greška" }, { status: 500 });
  }
}