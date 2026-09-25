import { loadEnvConfig } from "@next/env";
import { drizzle } from "drizzle-orm/libsql"

loadEnvConfig(process.cwd());

export const db = drizzle(process.env.DB_FILE_NAME!);