import { migrate } from "drizzle-orm/postgres-js/migrator";

import { getMigrationDb } from "./db";

(async () => {
  await migrate(getMigrationDb(), { migrationsFolder: "drizzle" });
  process.exit(0);
})();
