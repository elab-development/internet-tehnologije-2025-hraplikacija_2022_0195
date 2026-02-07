
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { zaposleni } from "@/db/schema/zaposleni";
import { korisnik } from "@/db/schema/korisnik";
import { eq } from "drizzle-orm";

type ZaposleniUpdateData = {
  ime?: string;
  prezime?: string;
  email?: string;             
  pozicija?: string;
  plata?: string;             
  datumRodjenja?: string;     
  datumZaposlenja?: string;  
};

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: idString } = await params;
    console.log("Params idString:", idString);
    const id = Number(idString);
    console.log("Parsed ID:", id);
    if (!id || Number.isNaN(id))
      return NextResponse.json({ error: "Nevalidan ID" }, { status: 400 });

    const body: ZaposleniUpdateData = await req.json();
    console.log("Body received:", body);

  
    const rows = await db.select().from(zaposleni).where(eq(zaposleni.id, id));
    const existing = rows[0];
    if (!existing)
      return NextResponse.json({ error: "Zaposleni nije pronađen" }, { status: 404 });

  
    const zaposleniData: Partial<ZaposleniUpdateData> = {
      ime: body.ime,
      prezime: body.prezime,
      pozicija: body.pozicija,
      plata: body.plata !== undefined ? body.plata.toString() : undefined,
      datumRodjenja: body.datumRodjenja,
      datumZaposlenja: body.datumZaposlenja,
    };

   
    const zaposleniPayload = Object.fromEntries(
      Object.entries(zaposleniData).filter(([_, v]) => v !== undefined)
    );

 
    if (Object.keys(zaposleniPayload).length > 0) {
      await db.update(zaposleni).set(zaposleniPayload).where(eq(zaposleni.id, id));
    }

    
    if (body.email !== undefined) {
      const korisnikId = existing.korisnikId;
      if (!korisnikId)
        return NextResponse.json({ error: "Korisnik ID nije pronađen" }, { status: 500 });

      await db.update(korisnik).set({ email: body.email }).where(eq(korisnik.id, korisnikId));
    }

    return NextResponse.json({ message: "Uspešno ažurirano" });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Greška pri ažuriranju" }, { status: 500 });
  }
}
