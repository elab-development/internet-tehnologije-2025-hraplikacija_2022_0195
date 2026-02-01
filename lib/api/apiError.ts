import { NextResponse } from "next/server";

export function apiError(e: any) {
  if (e.message === "UNAUTHORIZED") {
    return NextResponse.json({ error: "Korisnik nije ulogovan" }, { status: 401 });
  }
  if (e.message === "DEACTIVATED") {
    return NextResponse.json({ error: "Korisnik je deaktiviran" }, { status: 403 });
  }
  if (e.message === "FORBIDDEN") {
    return NextResponse.json({ error: "Nemate dozvolu" }, { status: 403 });
  }

  return NextResponse.json({ error: "Serverska greska" }, { status: 500 });
}
