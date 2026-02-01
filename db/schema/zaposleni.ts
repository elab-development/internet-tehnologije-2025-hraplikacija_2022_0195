import {
  pgTable,
  serial,
  varchar,
  date,
  boolean,
  integer,
  numeric,
} from "drizzle-orm/pg-core";
import { korisnik } from "./korisnik";

export const zaposleni = pgTable("zaposleni", {
  id: serial("id").primaryKey(),

  ime: varchar("ime", { length: 100 }).notNull(),
  prezime: varchar("prezime", { length: 100 }).notNull(),

  datumRodjenja: date("datum_rodjenja").notNull(),

  pozicija: varchar("pozicija", { length: 150 }).notNull(),

  plata: numeric("plata", { precision: 10, scale: 2 }).notNull(),

  datumZaposlenja: date("datum_zaposlenja").notNull(),

  statusZaposlenja: boolean("status_zaposlenja")
    .notNull()
    .default(true),

  korisnikId: integer("korisnik_id")
    .notNull()
    .unique()
    .references(() => korisnik.id, {
      onDelete: "restrict",
      onUpdate: "cascade",
    }),
});
