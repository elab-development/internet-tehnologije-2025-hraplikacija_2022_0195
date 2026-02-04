import { db } from "@/db";
import { zaposleni } from "@/db/schema/zaposleni";
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
      .update(zaposleni)
      .set({ statusZaposlenja: false })
      .where(eq(zaposleni.id, Number(id)));

    return NextResponse.json({ ok: true });
  } catch (e) {
    return apiError(e);
  }
}
