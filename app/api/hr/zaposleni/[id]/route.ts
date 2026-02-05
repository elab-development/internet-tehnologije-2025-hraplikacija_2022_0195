// app/api/hr/zaposleni/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { zaposleni } from "@/db/schema";
import { eq } from "drizzle-orm";

type ZaposleniUpdateData = {
  ime?: string;
  prezime?: string;
  pozicija?: string;
  plata?: string;             // numeric se mora slati kao string
  datumRodjenja?: string;     // "YYYY-MM-DD"
  datumZaposlenja?: string;  // "YYYY-MM-DD"
};

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  console.log("Params received:", params);
  try {
      // šta Next.js stvarno dobija
    const id = Number(params.id);
    console.log("Parsed ID:", id);
    if (!id) return NextResponse.json({ error: "Nevalidan ID" }, { status: 400 });

    const body: ZaposleniUpdateData = await req.json();
    console.log("Body received:", body);

    const updateData: ZaposleniUpdateData = {
      ...body,
      plata: body.plata !== undefined ? body.plata.toString() : undefined,
    };

    await db.update(zaposleni).set(updateData).where(eq(zaposleni.id, id));

    return NextResponse.json({ message: "Uspešno ažurirano" });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Greška pri ažuriranju" }, { status: 500 });
  }
}
