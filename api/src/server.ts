import fastify, { FastifyInstance, FastifyServerOptions } from "fastify";
import mercurius from "mercurius";

import { schema } from "./schema";

function createServer(opts: FastifyServerOptions = {}): FastifyInstance {
  const server = fastify(opts);

  server.get("/ping", async (_req, _res) => {
    return { message: "pong!" };
  });
  server.register(mercurius, {
    graphiql: process.env.NODE_ENV !== "production",
    path: "/graphql",
    schema,
  });

  return server;
}

export async function startServer() {
  const server = createServer({
    logger: true,
  });

  try {
    await server.listen(process.env.PORT || 3000);
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
}
