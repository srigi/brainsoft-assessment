import { relations, sql } from "drizzle-orm";
import { pgTable, varchar, uniqueIndex, uuid } from "drizzle-orm/pg-core";

import { pokemonsToTypes } from "./pokemonsToTypes";

export const types = pgTable(
  "types",
  {
    uuid: uuid("uuid")
      .primaryKey()
      .default(sql`gen_random_uuid()`),
    name: varchar("name").notNull(),
  },
  (table) => ({
    id: uniqueIndex("uqindex_name").on(table.name),
  })
);

export const typesRelations = relations(types, ({ many }) => ({
  pokemonsToTypes: many(pokemonsToTypes),
}));
