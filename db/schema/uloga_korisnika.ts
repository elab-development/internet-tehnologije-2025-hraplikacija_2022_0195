import { pgTable, serial, varchar } from "drizzle-orm/pg-core";

export const ulogaKorisnika = pgTable("uloga_korisnika", {
  id: serial("id").primaryKey(),
  naziv: varchar("naziv", { length: 50 }).notNull().unique(),
});
