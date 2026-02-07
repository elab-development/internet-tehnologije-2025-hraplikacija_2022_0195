import { NextResponse } from "next/server";
import { db } from "@/db";
import { zaposleni } from "@/db/schema/zaposleni";
import { korisnik } from "@/db/schema/korisnik";
import { eq } from "drizzle-orm";
import { requireSistemAdmin } from "@/lib/auth/requireSistemAdmin";
import bcrypt from "bcryptjs";
 
export async function GET() {
  try {
    await requireSistemAdmin();
 
    const rows = await db
      .select({
        id: zaposleni.id,
        ime: zaposleni.ime,
        prezime: zaposleni.prezime,
        pozicija: zaposleni.pozicija,
        plata: zaposleni.plata,
        datumRodjenja: zaposleni.datumRodjenja,
        datumZaposlenja: zaposleni.datumZaposlenja,
        statusZaposlenja: zaposleni.statusZaposlenja,
        korisnik: {
          id: korisnik.id,
          email: korisnik.email,
          statusNaloga: korisnik.statusNaloga,
          ulogaId: korisnik.ulogaId,
        },
      })
      .from(zaposleni)
      .innerJoin(korisnik, eq(zaposleni.korisnikId, korisnik.id))
      .where(eq(korisnik.ulogaId, 2));
 
    return NextResponse.json(rows);
  } catch (err: any) {
    const msg = String(err?.message || "");
    if (msg === "UNAUTHORIZED") return NextResponse.json({ error: msg }, { status: 401 });
    if (msg === "FORBIDDEN") return NextResponse.json({ error: msg }, { status: 403 });
    if (msg === "DEACTIVATED") return NextResponse.json({ error: msg }, { status: 403 });
    return NextResponse.json({ error: "Greška" }, { status: 500 });
  }
}
 
export async function POST(req: Request) {
  try {
    await requireSistemAdmin();
 
    const body = await req.json();
    const email = String(body.email || "").trim().toLowerCase();
    const lozinka = String(body.lozinka || "");
    const ime = String(body.ime || "HR");
    const prezime = String(body.prezime || "Admin");
 
    if (!email.includes("@")) {
      return NextResponse.json({ error: "Email nije validan" }, { status: 400 });
    }
    if (lozinka.length < 6) {
      return NextResponse.json({ error: "Lozinka mora imati najmanje 6 karaktera" }, { status: 400 });
    }
 
    const postoji = await db.select({ id: korisnik.id }).from(korisnik).where(eq(korisnik.email, email)).limit(1);
    if (postoji.length > 0) {
      return NextResponse.json({ error: "Email već postoji" }, { status: 409 });
    }
 
    const passHash = await bcrypt.hash(lozinka, 12);
 
 
    const dummyDatumRodjenja = "1990-01-01";
    const dummyDatumZaposlenja = "2024-01-01";
    const dummyPozicija = "HR Administrator";
    const dummyPlata = "0.00";
 
    const created = await db.transaction(async (tx) => {
      const insertedUsers = await tx
        .insert(korisnik)
        .values({
          email,
          lozinkaHash: passHash,
          statusNaloga: true,
          ulogaId: 2,
        })
        .returning({ id: korisnik.id });
 
      const userId = insertedUsers[0].id;
 
      const insertedEmp = await tx
        .insert(zaposleni)
        .values({
          ime,
          prezime,
          datumRodjenja: dummyDatumRodjenja,
          pozicija: dummyPozicija,
          plata: dummyPlata,
          datumZaposlenja: dummyDatumZaposlenja,
          statusZaposlenja: true,
          korisnikId: userId,
        })
        .returning({ id: zaposleni.id });
 
      return { korisnikId: userId, zaposleniId: insertedEmp[0].id };
    });
 
    return NextResponse.json({ message: "HR admin kreiran", ...created }, { status: 201 });
  } catch (err: any) {
    const msg = String(err?.message || "");
    if (msg === "UNAUTHORIZED") return NextResponse.json({ error: msg }, { status: 401 });
    if (msg === "FORBIDDEN") return NextResponse.json({ error: msg }, { status: 403 });
    if (msg === "DEACTIVATED") return NextResponse.json({ error: msg }, { status: 403 });
    return NextResponse.json({ error: "Greška pri kreiranju" }, { status: 500 });
  }
}