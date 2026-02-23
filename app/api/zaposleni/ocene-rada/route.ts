import { db } from "@/db";
import { eq, desc } from "drizzle-orm";
import { NextResponse } from "next/server";
import { getAuthCookie, verifyAuthToken } from "@/lib/auth/jwt";
import { korisnik } from "@/db/schema/korisnik";
import { zaposleni } from "@/db/schema/zaposleni";
import { ocenaRada } from "@/db/schema/ocena_rada";
import { alias } from "drizzle-orm/pg-core";

export async function GET() {
  try {
    const token = await getAuthCookie();
    if (!token) {
      return NextResponse.json({ error: "Nije ulogovan" }, { status: 401 });
    }
    const payload = await verifyAuthToken(token);
    const emp = await db
      .select({ id: zaposleni.id })
      .from(zaposleni)
      .innerJoin(korisnik, eq(korisnik.id, zaposleni.korisnikId))
      .where(eq(korisnik.id, payload.korisnikId))
      .limit(1);

    if (!emp.length) {
      return NextResponse.json({ error: "Zaposleni ne postoji" }, { status: 404 });
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
      .where(eq(ocenaRada.ocenjeniId, emp[0].id))
      .orderBy(desc(ocenaRada.datumKreiranja));

    return NextResponse.json(rows, { status: 200 });
  } catch (e) {
    console.error("GET /api/zaposleni/ocene-rada failed:", e);
    return NextResponse.json({ error: "Server greška" }, { status: 500 });
  }
}