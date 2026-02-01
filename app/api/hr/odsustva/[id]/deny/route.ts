import { db } from "@/db";
import { zahtevZaOdsustvo } from "@/db/schema/zahtev_za_odsustvo";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { requireHrAdmin } from "@/lib/auth/requireHrAdmin";
import { apiError } from "@/lib/api/apiError";

export async function PATCH(
  _req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await requireHrAdmin();

    await db
      .update(zahtevZaOdsustvo)
      .set({
        statusId: 3, // ODBIJEN
        datumAzuriranja: new Date(),
      })
      .where(eq(zahtevZaOdsustvo.id, Number(params.id)));

    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (e) {
    return apiError(e);
  }
}
