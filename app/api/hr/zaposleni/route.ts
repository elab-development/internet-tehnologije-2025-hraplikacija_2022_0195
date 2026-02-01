import { db } from "@/db";
import { zaposleni } from "@/db/schema/zaposleni";
import { NextResponse } from "next/server";
import { requireHrAdmin } from "@/lib/auth/requireHrAdmin";
import { apiError } from "@/lib/api/apiError";

export async function GET() {
  try {
    await requireHrAdmin();
    const data = await db.select().from(zaposleni);
    return NextResponse.json(data);
  } catch (e) {
    return apiError(e);
  }
}

export async function POST(req: Request) {
  try {
    await requireHrAdmin();
    const body = await req.json();

    await db.insert(zaposleni).values({
      ime: body.ime,
      prezime: body.prezime,
      datumRodjenja: body.datumRodjenja,
      pozicija: body.pozicija,
      plata: body.plata,
      datumZaposlenja: body.datumZaposlenja,
      korisnikId: body.korisnikId,
    });

    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (e) {
    return apiError(e);
  }
}
