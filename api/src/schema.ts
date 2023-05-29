import {
  queryType,
  intArg,
  makeSchema,
  nonNull,
  objectType,
  list,
} from "nexus";
import { pokemons } from "./models";

const PokemonType = objectType({
  name: "Pokemon",
  definition(t) {
    t.field({ name: "id", type: nonNull("String") });
    t.field({ name: "name", type: nonNull("String") });
    t.field({ name: "classification", type: nonNull("String") });
    t.field({ name: "fleeRate", type: nonNull("Float") });
    t.field({ name: "maxCP", type: nonNull("Float") });
    t.field({ name: "maxHP", type: nonNull("Float") });
  },
});

export const schema = makeSchema({
  outputs: {
    schema: __dirname + "/../schema.graphql",
    typegen: __dirname + "/nexus.ts",
  },

  contextType: {
    module: require.resolve("./context"),
    export: "Context",
  },

  types: [
    queryType({
      definition(t) {
        t.boolean("healthy", {
          resolve: () => true,
        });

        t.field("pokemons", {
          type: list(PokemonType),
          args: {
            limit: intArg({ default: 10 }),
          },
          resolve: async (_parent, { limit }, { db }) =>
            db
              .select()
              .from(pokemons)
              .limit(limit as number),
        });

        t.int("add", {
          args: { x: nonNull(intArg()), y: nonNull(intArg()) },
          resolve: (_, { x, y }) => x + y,
        });
      },
    }),

    PokemonType,
  ],
});
