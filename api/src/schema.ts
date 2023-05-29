import { asc, gte, sql } from "drizzle-orm";
import {
  queryType,
  intArg,
  makeSchema,
  nonNull,
  objectType,
  list,
  stringArg,
} from "nexus";

import { pokemons } from "./models";

const PokemonType = objectType({
  name: "Pokemon",
  definition(t) {
    t.field("id", { type: nonNull("String") });
    t.field("name", { type: nonNull("String") });
    t.field("classification", { type: nonNull("String") });
    t.field("height", {
      type: nonNull(
        objectType({
          name: "Height",
          definition(t) {
            t.string("minimum");
            t.string("maximum");
          },
        })
      ),
    });
    t.field("weight", {
      type: nonNull(
        objectType({
          name: "Weight",
          definition(t) {
            t.string("minimum");
            t.string("maximum");
          },
        })
      ),
    });
    t.field("fleeRate", { type: nonNull("Float") });
    t.field("maxCP", { type: nonNull("Float") });
    t.field("maxHP", { type: nonNull("Float") });
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
          type: objectType({
            name: "PokemonsList",
            definition: (t) => {
              t.field("edges", { type: list(PokemonType) });
              t.field("pageInfo", {
                type: objectType({
                  name: "PokemonListPageInfo",
                  definition(t) {
                    t.string("nextCursor");
                    t.int("pageSize");
                  },
                }),
              });
              t.int("totalCount");
            },
          }),
          args: {
            cursor: stringArg(),
            pageSize: intArg(),
          },
          resolve: async (_parent, { cursor, pageSize = 10 }, { db }) => {
            if (pageSize == null) {
              return {
                edges: [],
                pageInfo: { nextCursor: null, pageSize },
                totalCount: 0,
              };
            }

            const { totalCount } = (
              await db
                .select({ totalCount: sql<number>`count(*)` })
                .from(pokemons)
            )[0];
            const items = await db
              .select()
              .from(pokemons)
              .where(cursor != null ? gte(pokemons.id, cursor) : undefined)
              .orderBy(asc(pokemons.id))
              .limit(pageSize + 1);

            let nextCursor: string | undefined = undefined;
            if (items.length > pageSize) {
              // Remove the last item and use it as next cursor

              const lastItem = items.pop()!; // eslint-disable-line @typescript-eslint/no-non-null-assertion
              nextCursor = lastItem.id;
            }

            return {
              edges: items,
              pageInfo: {
                nextCursor,
                pageSize,
              },
              totalCount,
            };
          },
        });
      },
    }),

    PokemonType,
  ],
});
