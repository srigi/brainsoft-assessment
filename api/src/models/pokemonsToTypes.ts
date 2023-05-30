import { index, pgTable, uuid } from "drizzle-orm/pg-core";

import { pokemons } from "./pokemons";
import { types } from "./types";

export const pokemonsToTypes = pgTable(
  "pokemonsToTypes",
  {
    pokemonUuid: uuid("pokemon_uuid")
      .notNull()
      .references(() => pokemons.uuid),
    typeUuid: uuid("type_uuid")
      .notNull()
      .references(() => types.uuid),
  },
  (table) => ({
    pokemonIdIdx: index("index_pokemon_id").on(table.pokemonUuid),
    typeIdIdx: index("index_type_id").on(table.typeUuid),
  })
);
