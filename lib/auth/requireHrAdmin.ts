import { db } from "@/db";
import { eq } from "drizzle-orm";
import { korisnik } from "@/db/schema";
import { getAuthCookie, verifyAuthToken } from "@/lib/auth/jwt";

export async function requireHrAdmin() {
  const token = await getAuthCookie();
  if (!token) {
    throw new Error("UNAUTHORIZED");
  }

  const payload = await verifyAuthToken(token);

  const rows = await db
    .select({
      id: korisnik.id,
      ulogaId: korisnik.ulogaId,
      statusNaloga: korisnik.statusNaloga,
    })
    .from(korisnik)
    .where(eq(korisnik.id, payload.korisnikId))
    .limit(1);

  if (rows.length === 0) {
    throw new Error("UNAUTHORIZED");
  }

  const k = rows[0];

  if (!k.statusNaloga) {
    throw new Error("DEACTIVATED");
  }


  if (k.ulogaId !== 2) {
    throw new Error("FORBIDDEN");
  }

  return k;
}
