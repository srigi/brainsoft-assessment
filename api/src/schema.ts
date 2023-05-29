import { queryType, intArg, makeSchema, nonNull } from "nexus";

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
        t.int("add", {
          args: { x: nonNull(intArg()), y: nonNull(intArg()) },
          resolve: (_, { x, y }) => x + y,
        });
      },
    }),
  ],
});
