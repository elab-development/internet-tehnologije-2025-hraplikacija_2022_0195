// app/api/zaposleni/me/route.ts
import { db } from "@/db";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { getAuthCookie, verifyAuthToken } from "@/lib/auth/jwt";
import { korisnik, zaposleni } from "@/db/schema";

export async function GET() {
  try {
    const token = await getAuthCookie();
    if (!token) return NextResponse.json({ error: "Nije ulogovan" }, { status: 401 });

    const payload = await verifyAuthToken(token);

    const rows = await db
      .select({
        korisnikId: korisnik.id,
        email: korisnik.email,
        ulogaId: korisnik.ulogaId,
        statusNaloga: korisnik.statusNaloga,
        zaposleniId: zaposleni.id,
        ime: zaposleni.ime,
        prezime: zaposleni.prezime,
        datumRodjenja: zaposleni.datumRodjenja,
        pozicija: zaposleni.pozicija,
        plata: zaposleni.plata,
        datumZaposlenja: zaposleni.datumZaposlenja,
        statusZaposlenja: zaposleni.statusZaposlenja,
      })
      .from(korisnik)
      .innerJoin(zaposleni, eq(zaposleni.korisnikId, korisnik.id))
      .where(eq(korisnik.id, payload.korisnikId))
      .limit(1);

    if (!rows.length) return NextResponse.json({ error: "Zaposleni ne postoji" }, { status: 404 });
    const me = rows[0];

    if (!me.statusNaloga) return NextResponse.json({ error: "Korisnik deaktiviran" }, { status: 403 });

    // (opciono) ograniči samo uloge koje smeju: HR + zaposleni
    // if (![2,3].includes(me.ulogaId)) return NextResponse.json({ error: "Zabranjeno" }, { status: 403 });

    return NextResponse.json({ me }, { status: 200 });
  } catch {
    return NextResponse.json({ error: "Nevalidan token" }, { status: 401 });
  }
}
