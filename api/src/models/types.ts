import { sql } from "drizzle-orm";
import { pgTable, varchar, uniqueIndex, uuid } from "drizzle-orm/pg-core";

export const types = pgTable(
  "types",
  {
    uuid: uuid("uuid")
      .primaryKey()
      .default(sql`gen_random_uuid()`),
    name: varchar("name").notNull(),
  },
  (table) => ({
    id: uniqueIndex("uqindex_name").on(table.name),
  })
);
