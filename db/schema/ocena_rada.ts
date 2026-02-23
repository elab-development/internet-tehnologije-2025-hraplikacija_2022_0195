import {
  pgTable,
  serial,
  integer,
  date,
  varchar,
  timestamp,
} from "drizzle-orm/pg-core";
import { zaposleni } from "./zaposleni";

export const ocenaRada = pgTable("ocena_rada", {
  id: serial("id").primaryKey(),

  autorId: integer("autor_id")
    .notNull()
    .references(() => zaposleni.id, {
      onDelete: "restrict",
      onUpdate: "cascade",
    }),

  ocenjeniId: integer("ocenjeni_id")
    .notNull()
    .references(() => zaposleni.id, {
      onDelete: "restrict",
      onUpdate: "cascade",
    }),

  datumOd: date("datum_od").notNull(),
  datumDo: date("datum_do").notNull(),

  ocena: integer("ocena").notNull(),

  komentar: varchar("komentar", { length: 1000 }),

  datumKreiranja: timestamp("datum_kreiranja")
    .notNull()
    .defaultNow(),
});