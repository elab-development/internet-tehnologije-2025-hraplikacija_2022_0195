import { pgTable, serial, varchar, boolean, integer } from "drizzle-orm/pg-core";
import { ulogaKorisnika } from "./uloga_korisnika";

export const korisnik = pgTable("korisnik", {
  id: serial("id").primaryKey(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  lozinkaHash: varchar("lozinka_hash", { length: 255 }).notNull(),
  statusNaloga: boolean("status_naloga").notNull().default(true),

  ulogaId: integer("uloga_id")
    .notNull()
    .references(() => ulogaKorisnika.id, { onDelete: "restrict", onUpdate: "cascade" }),
});
