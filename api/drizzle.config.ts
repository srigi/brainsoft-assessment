import type { Config } from "drizzle-kit";

export default {
  schema: "./src/models/index.ts",
  out: "./drizzle",
} satisfies Config;
