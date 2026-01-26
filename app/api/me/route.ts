import { db } from "@/db";
import { eq } from "drizzle-orm";
import { korisnik } from "@/db/schema";
import { getAuthCookie, verifyAuthToken } from "@/lib/auth/jwt";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const token = await getAuthCookie();

        if (!token) {
            return NextResponse.json({ error: "Nije ulogovan" }, { status: 401 });
        }

        const payload = await verifyAuthToken(token);

        const rows = await db
            .select({
                id: korisnik.id,
                email: korisnik.email,
                ulogaId: korisnik.ulogaId,
                statusNaloga: korisnik.statusNaloga,
            })
            .from(korisnik)
            .where(eq(korisnik.id, payload.korisnikId))
            .limit(1);

        if (rows.length === 0) {
            return NextResponse.json({ error: "Korisnik ne postoji" }, { status: 401 });
        }

        const k = rows[0];

        if (!k.statusNaloga) {
            return NextResponse.json({ error: "Korisnik deaktiviran" }, { status: 403 });
        }

        return NextResponse.json({ korisnik: k }, { status: 200 });
    } catch {
        return NextResponse.json({ error: "Nevalidan token" }, { status: 401 });
    }
}