import { pgTable, serial, varchar } from "drizzle-orm/pg-core";

export const statusZahteva = pgTable("status_zahteva", {
  id: serial("id").primaryKey(),

  naziv: varchar("naziv", { length: 50 })
    .notNull()
    .unique(),
});
