import { db } from "@/db";
import { zahtevZaOdsustvo } from "@/db/schema/zahtev_za_odsustvo";
import { NextResponse } from "next/server";
import { requireHrAdmin } from "@/lib/auth/requireHrAdmin";
import { apiError } from "@/lib/api/apiError";

export async function GET() {
  try {
    await requireHrAdmin();
    const data = await db.select().from(zahtevZaOdsustvo);
    return NextResponse.json(data);
  } catch (e) {
    return apiError(e);
  }
}
