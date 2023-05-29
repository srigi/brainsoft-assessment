import fastify, { FastifyInstance, FastifyServerOptions } from "fastify";

function createServer(opts: FastifyServerOptions = {}): FastifyInstance {
  const server = fastify(opts);

  server.get("/", async (_req, _res) => {
    return { hello: "world" };
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
