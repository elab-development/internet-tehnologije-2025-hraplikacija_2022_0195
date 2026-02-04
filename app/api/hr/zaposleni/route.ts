import { NextResponse } from "next/server";
import { db } from "@/db";
import { zaposleni } from "@/db/schema/zaposleni";
import { korisnik } from "@/db/schema/korisnik";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";

/* =========================
   GET – lista zaposlenih
   ========================= */
export async function GET() {
  try {
    const result = await db
      .select({
        id: zaposleni.id,
        ime: zaposleni.ime,
        prezime: zaposleni.prezime,
        pozicija: zaposleni.pozicija,
        plata: zaposleni.plata,
        korisnik: {
          id: korisnik.id,
          email: korisnik.email,
          statusNaloga: korisnik.statusNaloga,
        },
      })
      .from(zaposleni)
      .innerJoin(korisnik, eq(zaposleni.korisnikId, korisnik.id));

    return NextResponse.json(result);
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Greška pri čitanju zaposlenih" },
      { status: 500 }
    );
  }
}

/* =========================
   POST – dodavanje zaposlenog
   ========================= */
export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      email,
      lozinka,
      ime,
      prezime,
      datumRodjenja,
      pozicija,
      plata,
      datumZaposlenja,
    } = body;

    if (
      !email ||
      !lozinka ||
      !ime ||
      !prezime ||
      !datumRodjenja ||
      !pozicija ||
      !plata ||
      !datumZaposlenja
    ) {
      return NextResponse.json(
        { error: "Nedostaju podaci" },
        { status: 400 }
      );
    }

    const lozinkaHash = await bcrypt.hash(lozinka, 12);

    await db.transaction(async (tx) => {
      const [newUser] = await tx
        .insert(korisnik)
        .values({
          email,
          lozinkaHash,
          ulogaId: 3,
        })
        .returning({ id: korisnik.id });

      await tx.insert(zaposleni).values({
        ime,
        prezime,
        datumRodjenja,
        pozicija,
        plata,
        datumZaposlenja,
        korisnikId: newUser.id,
      });
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Greška pri dodavanju zaposlenog" },
      { status: 500 }
    );
  }
}
