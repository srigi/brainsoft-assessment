import { relations, sql } from "drizzle-orm";
import {
  boolean,
  index,
  integer,
  jsonb,
  pgTable,
  real,
  varchar,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";

import { pokemonsToTypes } from "./pokemonsToTypes";

export const pokemons = pgTable(
  "pokemons",
  {
    uuid: uuid("uuid")
      .primaryKey()
      .default(sql`gen_random_uuid()`),
    id: varchar("id").notNull(),
    name: varchar("name").notNull(),
    classification: varchar("classification").notNull(),
    weight: jsonb("weight")
      .notNull()
      .$type<{ minimum: string; maximum: string }>(),
    height: jsonb("height")
      .notNull()
      .$type<{ minimum: string; maximum: string }>(),
    fleeRate: real("flee_rate").notNull(),
    maxCP: integer("max_cp").notNull(),
    maxHP: integer("max_hp").notNull(),
    favourite: boolean("favourite"),
  },
  (table) => ({
    id: uniqueIndex("uqindex_id").on(table.id),
    favourite: index("index_favourite").on(table.favourite),
  })
);

export const pokemonsRelations = relations(pokemons, ({ many }) => ({
  pokemonsToTypes: many(pokemonsToTypes),
}));
