import { db } from "@/db";
import { zaposleni } from "@/db/schema/zaposleni";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { requireHrAdmin } from "@/lib/auth/requireHrAdmin";
import { apiError } from "@/lib/api/apiError";

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await requireHrAdmin();
    const body = await req.json();

    await db
      .update(zaposleni)
      .set(body)
      .where(eq(zaposleni.id, Number(params.id)));

    return NextResponse.json({ ok: true });
  } catch (e) {
    return apiError(e);
  }
}
