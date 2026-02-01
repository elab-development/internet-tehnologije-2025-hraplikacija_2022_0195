import { db } from "@/db";
import { zaposleni } from "@/db/schema/zaposleni";
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
      .update(zaposleni)
      .set({ statusZaposlenja: false })
      .where(eq(zaposleni.id, Number(params.id)));

    return NextResponse.json({ ok: true });
  } catch (e) {
    return apiError(e);
  }
}
