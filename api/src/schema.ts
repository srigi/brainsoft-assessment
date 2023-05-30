import { asc, like, sql, and, eq, gte } from "drizzle-orm";
import {
  queryType,
  intArg,
  makeSchema,
  nonNull,
  objectType,
  list,
  stringArg,
} from "nexus";

import { pokemons, types } from "./models";

const PokemonType = objectType({
  name: "Pokemon",
  definition(t) {
    t.field("id", { type: nonNull("String") });
    t.field("name", { type: nonNull("String") });
    t.field("classification", { type: nonNull("String") });
    t.field("types", {
      type: list("String"),
    });
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

const PokemonTypeType = objectType({
  name: "PokemonType",
  definition(t) {
    t.field("name", { type: nonNull("String") });
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
        t.nonNull.boolean("healthy", {
          resolve: () => true,
        });

        t.nullable.field("pokemon", {
          type: PokemonType,
          args: {
            findById: stringArg(),
            findByName: stringArg(),
          },
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          resolve: async (_parent, { findById, findByName }, { db }) => {
            const pokemon = await db.query.pokemons.findFirst({
              with: {
                pokemonsToTypes: {
                  columns: { pokemonUuid: false, typeUuid: false },
                  with: { type: { columns: { name: true } } },
                },
              },
              where: and(
                findById != null ? eq(pokemons.id, findById) : undefined,
                findByName != null
                  ? like(pokemons.name, `${findByName}%`)
                  : undefined
              ),
            });

            if (pokemon != null) {
              return {
                ...pokemon,
                types: pokemon.pokemonsToTypes.map(
                  (ptt: unknown) =>
                    (ptt as unknown as { type: { name: string } }).type.name
                ),
              };
            }
          },
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
            findByName: stringArg(),
            cursor: stringArg(),
            pageSize: intArg(),
          },
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          resolve: async (
            _parent,
            { findByName, cursor, pageSize = 10 },
            { db }
          ) => {
            if (pageSize == null) {
              return {
                edges: [],
                pageInfo: { nextCursor: null, pageSize },
                totalCount: 0,
              };
            }

            const criteria = and(
              findByName != null
                ? like(pokemons.name, `${findByName}%`)
                : undefined
            );
            const { totalCount } = (
              await db
                .select({ totalCount: sql<number>`count(*)` })
                .from(pokemons)
                .where(criteria)
            )[0];
            const items = await db.query.pokemons.findMany({
              with: {
                pokemonsToTypes: {
                  columns: { pokemonUuid: false, typeUuid: false },
                  with: { type: { columns: { name: true } } },
                },
              },
              where: and(
                criteria,
                cursor != null ? gte(pokemons.id, cursor) : undefined
              ),
              orderBy: asc(pokemons.id),
              limit: pageSize + 1,
            });

            let nextCursor: string | undefined = undefined;
            if (items.length > pageSize) {
              // Remove the last item and use it as next cursor
              const lastItem = items.pop()!; // eslint-disable-line @typescript-eslint/no-non-null-assertion
              nextCursor = lastItem.id;
            }

            return {
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-ignore
              edges: items.map((i) => ({
                ...i,
                types: i.pokemonsToTypes.map(
                  (ptt: unknown) =>
                    (ptt as unknown as { type: { name: string } }).type.name
                ),
              })),
              pageInfo: {
                nextCursor,
                pageSize,
              },
              totalCount,
            };
          },
        });

        t.field("pokemonTypes", {
          type: objectType({
            name: "PokemonTypesList",
            definition: (t) => {
              t.field("edges", { type: list(PokemonTypeType) });
              t.field("pageInfo", {
                type: objectType({
                  name: "PokemonTypesListPageInfo",
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
            findByName: stringArg(),
            cursor: stringArg(),
            pageSize: intArg(),
          },
          resolve: async (
            _parent,
            { findByName, cursor, pageSize = 10 },
            { db }
          ) => {
            if (pageSize == null) {
              return {
                edges: [],
                pageInfo: { nextCursor: null, pageSize },
                totalCount: 0,
              };
            }

            const criteria = and(
              findByName != null
                ? like(types.name, `${findByName}%`)
                : undefined
            );
            const { totalCount } = (
              await db
                .select({ totalCount: sql<number>`count(*)` })
                .from(types)
                .where(criteria)
            )[0];
            const items = await db
              .select()
              .from(types)
              .where(
                and(
                  criteria,
                  cursor != null ? gte(pokemons.id, cursor) : undefined
                )
              )
              .orderBy(asc(types.name))
              .limit(pageSize + 1);

            let nextCursor: string | undefined = undefined;
            if (items.length > pageSize) {
              // Remove the last item and use it as next cursor
              const lastItem = items.pop()!; // eslint-disable-line @typescript-eslint/no-non-null-assertion
              nextCursor = lastItem.name;
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
    PokemonTypeType,
  ],
});
