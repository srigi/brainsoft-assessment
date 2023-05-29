import { sql } from "drizzle-orm";
import {
  integer,
  jsonb,
  pgTable,
  real,
  varchar,
  uuid,
} from "drizzle-orm/pg-core";

export const pokemons = pgTable("pokemons", {
  id: uuid("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  name: varchar("name").notNull(),
  classification: varchar("classification").notNull(),
  weight: jsonb("weight")
    .notNull()
    .default(sql`'{ "minimum":"1.0kg", "maximum": "2.0kg" }'::jsonb`),
  height: jsonb("height")
    .notNull()
    .default(sql`'{ "minimum":"0.15m", "maximum": "0.25m" }'::jsonb`),
  fleeRate: real("flee_rate").notNull(),
  maxCP: integer("max_cp").notNull(),
  maxHP: integer("max_hp").notNull(),
});
