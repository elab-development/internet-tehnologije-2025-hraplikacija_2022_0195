import "dotenv/config";
import { eq } from "drizzle-orm";
import { db } from "./index";
import { korisnik, ulogaKorisnika } from "./schema";
import { error } from "console";
import bcrypt from "bcryptjs";


async function main() {
    const uloge = ['SISTEM_ADMIN', 'HR_ADMIN', 'ZAPOSLENI'];

    for (const uloga of uloge) {
        const postoji = await db.select({id: ulogaKorisnika.id}).from(ulogaKorisnika).where(eq(ulogaKorisnika.naziv, uloga)).limit(1);

        if (postoji.length === 0){
            await db.insert(ulogaKorisnika).values({ naziv: uloga });
            console.log(`Dodata uloga: ${uloga}`);
        }
    }

    const uloga_sistem_admin_postoji = await db.select({id: ulogaKorisnika.id}).from(ulogaKorisnika).where(eq(ulogaKorisnika.naziv, "SISTEM_ADMIN")).limit(1);
    if (uloga_sistem_admin_postoji.length === 0) throw new Error("SISTEM_ADMIN uloga fali");

    const adminEmail = "admin@fon.test";
    const adminPassword = "admin";
    const passHash = await bcrypt.hash(adminPassword, 12);

    const postoji_admin = await db.select({id: korisnik.id}).from(korisnik).where(eq(korisnik.email, adminEmail)).limit(1);

    if(postoji_admin.length === 0){
        await db.insert(korisnik).values({
            email: adminEmail,
            lozinkaHash: passHash,
            statusNaloga: true,
            ulogaId: uloga_sistem_admin_postoji[0].id
        });
        console.log(`Ubacen sistem admin: ${adminEmail}`);
    }
    else{
        console.log(`Sistem admin vec postoji: ${adminEmail}`);
    }
}

main().then(()=> process.exit(0)).catch((e) => {
    console.error(e);
    process.exit(1);
});