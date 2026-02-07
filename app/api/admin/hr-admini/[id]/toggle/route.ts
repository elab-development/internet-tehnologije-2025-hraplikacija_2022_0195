import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { zaposleni } from "@/db/schema/zaposleni";
import { korisnik } from "@/db/schema/korisnik";
import { eq } from "drizzle-orm";
import { requireSistemAdmin } from "@/lib/auth/requireSistemAdmin";
 
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const me = await requireSistemAdmin();
 
    const { id: idString } = await params;
    const id = Number(idString);
    if (!id || Number.isNaN(id)) {
      return NextResponse.json({ error: "Nevalidan ID" }, { status: 400 });
    }
 
    const rows = await db
      .select({
        id: zaposleni.id,
        statusZaposlenja: zaposleni.statusZaposlenja,
        korisnikId: zaposleni.korisnikId,
      })
      .from(zaposleni)
      .where(eq(zaposleni.id, id))
      .limit(1);
 
    const existing = rows[0];
    if (!existing) return NextResponse.json({ error: "HR admin nije pronađen" }, { status: 404 });
 
 
    if (existing.korisnikId === me.id) {
      return NextResponse.json({ error: "Ne možeš deaktivirati samog sebe" }, { status: 400 });
    }
 
 
    const targetUser = await db
      .select({ id: korisnik.id, ulogaId: korisnik.ulogaId })
      .from(korisnik)
      .where(eq(korisnik.id, existing.korisnikId))
      .limit(1);
 
    if (targetUser.length === 0) {
      return NextResponse.json({ error: "Korisnik ne postoji" }, { status: 404 });
    }
    if (targetUser[0].ulogaId !== 2) {
      return NextResponse.json({ error: "Target nije HR admin" }, { status: 400 });
    }
 
    const newStatus = !existing.statusZaposlenja;
 
    await db.transaction(async (tx) => {
      await tx.update(zaposleni).set({ statusZaposlenja: newStatus }).where(eq(zaposleni.id, id));
      await tx.update(korisnik).set({ statusNaloga: newStatus }).where(eq(korisnik.id, existing.korisnikId));
    });
 
    return NextResponse.json({ message: "Status promenjen", status: newStatus });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Greška pri promeni statusa" }, { status: 500 });
  }
}