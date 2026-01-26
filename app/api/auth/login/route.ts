import { setAuthCookie } from "@/lib/auth/jwt";
import { loginWithEmailPassword } from "@/lib/auth/login";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const email = String(body.email ?? "").trim();
        const lozinka = String(body.lozinka ?? "");

        if (!email || !lozinka) {
            return NextResponse.json({ error: "Greska pri validaciji", }, { status: 422 });
        }

        const { korisnik, token } = await loginWithEmailPassword(email, lozinka);
        const res = NextResponse.json({ korisnik }, { status: 200 });
        setAuthCookie(res, token);

        return res;
    } catch (e: any) {
        const code = e?.message;

        if (code === "Pogresni parametri") {
            return NextResponse.json({ error: "Pogresni parametri" }, { status: 401 });
        }
        if (code === "Korisnik deaktiviran") {
            return NextResponse.json({ error: "Korisnik deaktiviran" }, { status: 403 });
        }

        return NextResponse.json({ error: "Serverska greska" }, { status: 500 });
    }
}