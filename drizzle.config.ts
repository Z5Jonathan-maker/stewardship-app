import type { Config } from "drizzle-kit";

/**
 * Drizzle Kit config — generates SQL migrations from lib/data/schema.ts.
 * Uses the unpooled connection for DDL. Run with:
 *   npx drizzle-kit generate   # create migration SQL from the schema
 *   npx drizzle-kit migrate    # apply to the database
 */
export default {
  schema: "./lib/data/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL_UNPOOLED ?? process.env.DATABASE_URL ?? "",
  },
} satisfies Config;
