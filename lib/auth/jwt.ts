import { jwtVerify, SignJWT } from "jose";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const COOKIE_NAME = "token";
const ONE_WEEK_SECONDS = 60 * 60 * 24 * 7;

function getSecretKey() {
    const secret = process.env.JWT_SECRET;
    if (!secret) throw new Error("JWT_SECRET is not set");
    return new TextEncoder().encode(secret);
}

export type AuthTokenPayload = {
    korisnikId: number,
    ulogaId: number
};

export async function signAuthToken(payload: AuthTokenPayload) {
    return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256"})
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(getSecretKey());
}

export async function verifyAuthToken(token: string){
    const { payload } = await jwtVerify<AuthTokenPayload>(token, getSecretKey());
    return payload;
}

export function setAuthCookie(res: NextResponse, token: string) {
  res.cookies.set(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: ONE_WEEK_SECONDS,
  });
}

export function clearAuthCookie(res: NextResponse) {
  res.cookies.set(COOKIE_NAME, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });
}

export async function getAuthCookie() {
  const cookieStore = await cookies();
  return cookieStore.get(COOKIE_NAME)?.value ?? null;
}