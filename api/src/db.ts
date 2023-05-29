import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

if (process.env.DATABASE_URL == null) {
  throw "DATABASE_URL environment variable must be defined!";
}

export const db = drizzle(postgres(process.env.DATABASE_URL), { logger: true });

export function getMigrationDb() {
  // eslint-disable-next-line  @typescript-eslint/no-non-null-assertion
  return drizzle(postgres(process.env.DATABASE_URL!, { max: 1 }));
}
