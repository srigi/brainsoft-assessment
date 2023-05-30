import { asc, like, sql, and, eq, gte } from "drizzle-orm";
import {
  booleanArg,
  intArg,
  list,
  makeSchema,
  mutationType,
  nonNull,
  objectType,
  queryType,
  stringArg,
} from "nexus";

import { pokemons, types } from "./models";

const PokemonType = objectType({
  name: "Pokemon",
  definition(t) {
    t.nonNull.string("id");
    t.nonNull.string("name");
    t.nonNull.string("classification");
    t.field("types", {
      type: list("String"),
    });
    t.nonNull.field("height", {
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
    t.nonNull.field("weight", {
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
    t.nonNull.float("fleeRate");
    t.nonNull.float("maxCP");
    t.nonNull.float("maxHP");
    t.boolean("favourite");
  },
});

const PokemonTypeType = objectType({
  name: "PokemonType",
  definition(t) {
    t.nonNull.string("name");
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

    mutationType({
      definition(t) {
        t.field("setFavourite", {
          type: PokemonType,
          args: {
            id: nonNull(stringArg()),
            value: nonNull(booleanArg()),
          },
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          resolve: async (_parent, { id, value }, { db }) => {
            const { uuid } = (
              await db
                .update(pokemons)
                .set({ favourite: value })
                .where(eq(pokemons.id, id))
                .returning({ uuid: pokemons.uuid })
            )[0];
            const pokemon = await db.query.pokemons.findFirst({
              with: {
                pokemonsToTypes: {
                  columns: { pokemonUuid: false, typeUuid: false },
                  with: { type: { columns: { name: true } } },
                },
              },
              where: eq(pokemons.uuid, uuid),
            });

            return {
              ...pokemon,
              types: pokemon?.pokemonsToTypes.map(
                (ptt: unknown) =>
                  (ptt as unknown as { type: { name: string } }).type.name
              ),
            };
          },
        });
      },
    }),

    PokemonType,
    PokemonTypeType,
  ],
});
