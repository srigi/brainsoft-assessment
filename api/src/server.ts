import cors from "@fastify/cors";
import fastify, {
  FastifyInstance,
  FastifyListenOptions,
  FastifyServerOptions,
} from "fastify";
import mercurius from "mercurius";

import { db } from "./db";
import { schema } from "./schema";

async function createServer(
  opts: FastifyServerOptions = {}
): Promise<FastifyInstance> {
  const server = fastify(opts);

  await server.register(cors, {
    origin: "*",
    methods: "GET, POST",
  });

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
  const server = await createServer({
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
