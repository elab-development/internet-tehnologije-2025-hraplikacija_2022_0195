import {
  pgTable,
  serial,
  integer,
  date,
  varchar,
  timestamp,
} from "drizzle-orm/pg-core";
import { zaposleni } from "./zaposleni";
import { statusZahteva } from "./status_zahteva";

export const zahtevZaOdsustvo = pgTable("zahtev_za_odsustvo", {
  id: serial("id").primaryKey(),

  zaposleniId: integer("zaposleni_id")
    .notNull()
    .references(() => zaposleni.id, {
      onDelete: "restrict",
      onUpdate: "cascade",
    }),

  statusId: integer("status_id")
    .notNull()
    .references(() => statusZahteva.id, {
      onDelete: "restrict",
      onUpdate: "cascade",
    }),

  datumOd: date("datum_od").notNull(),
  datumDo: date("datum_do").notNull(),

  razlog: varchar("razlog", { length: 500 }).notNull(),

  datumKreiranja: timestamp("datum_kreiranja")
    .notNull()
    .defaultNow(),

  datumAzuriranja: timestamp("datum_azuriranja")
    .notNull()
    .defaultNow(),
});
