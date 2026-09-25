import { drizzle } from "drizzle-orm/libsql";
import { loadEnvConfig } from "@next/env";

loadEnvConfig(process.cwd());

let dbInstance: ReturnType<typeof drizzle> | null = null;

function createDb() {
    if (!dbInstance) {
        dbInstance = drizzle(process.env.DB_FILE_NAME!);
    }

    return dbInstance;
}

export const db = new Proxy({} as ReturnType<typeof drizzle>, {
    get(_target, property) {
        return createDb()[property as keyof ReturnType<typeof drizzle>];
    },
});