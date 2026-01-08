import { defineConfig } from "drizzle-kit";

const tablePrefix = process.env.DB_TABLE_PREFIX ?? "";

export default defineConfig({
  schema: "./src/server/db/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
  tablesFilter: tablePrefix ? [`${tablePrefix}*`] : undefined,
});
