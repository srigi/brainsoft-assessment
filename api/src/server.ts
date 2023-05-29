import fastify, { FastifyInstance } from "fastify";
import { Server, IncomingMessage, ServerResponse } from "http";

const server: FastifyInstance<Server, IncomingMessage, ServerResponse> =
  fastify({ logger: true });

server.get("/", async (_req, _res) => {
  return { hello: "world" };
});

(async () => {
  try {
    await server.listen(process.env.PORT || 3000);
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
})();
