import { eq } from "drizzle-orm";
import { db } from "@/db";
import { korisnik } from "@/db/schema";
import bcrypt from "bcryptjs";
import { signAuthToken } from "./jwt";

export type LoginResult = {
    korisnik: {
        id: number,
        email: string,
        ulogaId: number
    },
    token: string
};

export async function loginWithEmailPassword(email: string, lozinka: string): Promise<LoginResult> {
    const rows = await db
    .select({
        id: korisnik.id,
        email: korisnik.email,
        lozinkaHash: korisnik.lozinkaHash,
        statusNaloga: korisnik.statusNaloga,
        ulogaId: korisnik.ulogaId
    })
    .from(korisnik)
    .where(eq(korisnik.email, email))
    .limit(1);

    if(rows.length === 0){
        throw new Error("Pogresni parametri");
    }

    const k = rows[0];

    if(!k.statusNaloga){
        throw new Error("Korisnik deaktiviran");
    }

    const ok = await bcrypt.compare(lozinka, k.lozinkaHash);

    if(!ok) {
        throw new Error("Pogresni parametri");
    }

    const token = await signAuthToken({ korisnikId: k.id, ulogaId: k.ulogaId});

    return {
        korisnik: { id: k.id, email: k.email, ulogaId: k.ulogaId },
        token
    };
}