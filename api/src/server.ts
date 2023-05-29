import fastify, {
  FastifyInstance,
  FastifyListenOptions,
  FastifyServerOptions,
} from "fastify";
import mercurius from "mercurius";

import { db } from "./db";
import { schema } from "./schema";

function createServer(opts: FastifyServerOptions = {}): FastifyInstance {
  const server = fastify(opts);

  server.get("/ping", async () => {
    return "pong!";
  });
  server.register(mercurius, {
    context: (request, reply) => ({ db, request, reply }),
    graphiql: process.env.NODE_ENV !== "production",
    path: "/graphql",
    schema,
  });

  return server;
}

(async () => {
  const server = createServer({
    logger: true,
  });

  try {
    await server.listen({
      port: process.env.PORT || 3000,
    } as FastifyListenOptions);
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
})();
