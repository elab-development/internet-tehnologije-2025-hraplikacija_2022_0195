import { db } from "@/db";
import { zahtevZaOdsustvo } from "@/db/schema/zahtev_za_odsustvo";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { requireHrAdmin } from "@/lib/auth/requireHrAdmin";
import { apiError } from "@/lib/api/apiError";

export async function PATCH(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireHrAdmin();

    const { id } = await params;

    await db
      .update(zahtevZaOdsustvo)
      .set({
        statusId: 2, // ODOBREN
        datumAzuriranja: new Date(),
      })
      .where(eq(zahtevZaOdsustvo.id, Number(id)));

    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (e) {
    return apiError(e);
  }
}
