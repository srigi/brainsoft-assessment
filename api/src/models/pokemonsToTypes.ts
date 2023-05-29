import { index, pgTable, uuid } from "drizzle-orm/pg-core";

import { pokemons } from "./pokemons";
import { types } from "./types";

export const pokemonsToTypes = pgTable(
  "pokemonsToTypes",
  {
    pokemonId: uuid("pokemon_id")
      .notNull()
      .references(() => pokemons.uuid),
    typeId: uuid("type_id")
      .notNull()
      .references(() => types.uuid),
  },
  (table) => ({
    pokemonIdIdx: index("index_pokemon_id").on(table.pokemonId),
    typeIdIdx: index("index_type_id").on(table.typeId),
  })
);
