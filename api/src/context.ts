import { PostgresJsDatabase } from "drizzle-orm/postgres-js";
import { FastifyReply, FastifyRequest } from "fastify";

export interface Context {
  db: PostgresJsDatabase;
  request: FastifyRequest;
  reply: FastifyReply;
}
