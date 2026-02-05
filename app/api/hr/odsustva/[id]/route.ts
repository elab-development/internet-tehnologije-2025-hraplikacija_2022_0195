import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { zahtevZaOdsustvo } from "@/db/schema/zahtev_za_odsustvo";
import { eq } from "drizzle-orm";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: rawId } = await params;
    console.log("GET /api/hr/odsustva/[id] called with params.id=", rawId);
    const employeeId = Number(rawId);
    if (Number.isNaN(employeeId)) {
      return NextResponse.json({ error: "Nevalidan ID", received: rawId }, { status: 400 });
    }

    const sviZahtevi = await db
      .select()
      .from(zahtevZaOdsustvo)
      .where(eq(zahtevZaOdsustvo.zaposleniId, employeeId));

    const podneti = sviZahtevi.filter((z) => z.statusId === 1);
    const zavrseni = sviZahtevi.filter((z) => z.statusId === 2 || z.statusId === 3);

    return NextResponse.json({ podneti, zavrseni });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Greška pri učitavanju odsustava" }, { status: 500 });
  }
}
