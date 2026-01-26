import { NextResponse } from "next/server";
import { clearAuthCookie } from "@/lib/auth/jwt";

export async function POST() {
  const res = NextResponse.json({ ok: true }, { status: 200 });
  clearAuthCookie(res);
  return res;
}
