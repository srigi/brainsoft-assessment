import { migrate } from "drizzle-orm/postgres-js/migrator";

process.env.MAX_DB_CONNECTIONS = "1";
import { db } from "../src/db";

(async () => {
  await migrate(db, { migrationsFolder: "drizzle" });
  process.exit(0);
})();
