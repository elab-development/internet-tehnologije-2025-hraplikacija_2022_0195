import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { zaposleni } from "@/db/schema/zaposleni";
import { korisnik } from "@/db/schema/korisnik";
import { eq } from "drizzle-orm";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: idString } = await params;
    const id = Number(idString);
    if (!id || Number.isNaN(id)) return NextResponse.json({ error: "Nevalidan ID" }, { status: 400 });

    const rows = await db.select().from(zaposleni).where(eq(zaposleni.id, id));
    const existing = rows[0];
    if (!existing) return NextResponse.json({ error: "Zaposleni nije pronađen" }, { status: 404 });

    const korisnikId = existing.korisnikId;
    if (!korisnikId) return NextResponse.json({ error: "Korisnik ID nije pronađen" }, { status: 500 });

    const newStatus = !existing.statusZaposlenja;
    console.log(`Toggling status for zaposleni ID ${id} to ${newStatus}`);
    await db.transaction(async (tx) => {
      await tx.update(zaposleni).set({ statusZaposlenja: newStatus }).where(eq(zaposleni.id, id));
      await tx.update(korisnik).set({ statusNaloga: newStatus }).where(eq(korisnik.id, korisnikId));
    });

    return NextResponse.json({ message: "Status uspešno promenjen", status: newStatus });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Greška pri promeni statusa" }, { status: 500 });
  }
}