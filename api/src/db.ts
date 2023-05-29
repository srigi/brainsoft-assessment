import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

if (process.env.DATABASE_URL == null) {
  throw "DATABASE_URL environment variable must be defined!";
}

export const db = drizzle(
  postgres(process.env.DATABASE_URL, {
    ...(process.env.MAX_DB_CONNECTIONS != null && {
      max: parseInt(process.env.MAX_DB_CONNECTIONS, 10),
    }),
  }),
  {
    logger: true,
  }
);
