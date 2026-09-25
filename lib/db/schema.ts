import { int, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";

export const wishlistsTable = sqliteTable("wishlists", {
    id: int("id").primaryKey({ autoIncrement: true }),

    code: text("code").notNull().unique(),

    name: text("name").notNull(),
    description: text("description"),

    edit_password_hash: text("edit_password_hash").notNull(),

    created_at: int("created_at")
        .notNull()
        .default(sql`(unixepoch())`),

    updated_at: int("updated_at")
        .notNull()
        .default(sql`(unixepoch())`)
});

export const wishesTable = sqliteTable("wishes", {
    id: int("id").primaryKey({ autoIncrement: true }),

    wishlist_id: int("wishlist_id")
        .notNull()
        .references(() => wishlistsTable.id, {
            onDelete: "cascade"
        }),

    name: text("name").notNull(),
    description: text("description"),
    icon: text("icon"),
    url: text("url"),

    // Preis in Cent
    price: int("price"),

    position: int("position")
        .notNull()
        .default(0),

    created_at: int("created_at")
        .notNull()
        .default(sql`(unixepoch())`),

    updated_at: int("updated_at")
        .notNull()
        .default(sql`(unixepoch())`)
});

export const reservationsTable = sqliteTable("reservations", {
    id: int("id").primaryKey({ autoIncrement: true }),

    wish_id: int("wish_id")
        .notNull()
        .unique()
        .references(() => wishesTable.id, {
            onDelete: "cascade"
        }),

    name: text("name").notNull(),

    token_hash: text("token_hash")
        .notNull()
        .unique(),

    created_at: int("created_at")
        .notNull()
        .default(sql`(unixepoch())`)
});

export const wishlistEditSessionsTable = sqliteTable(
    "wishlist_edit_sessions",
    {
        id: int("id").primaryKey({ autoIncrement: true }),

        wishlist_id: int("wishlist_id")
            .notNull()
            .references(() => wishlistsTable.id, {
                onDelete: "cascade",
            }),

        token_hash: text("token_hash")
            .notNull()
            .unique(),

        expires_at: int("expires_at").notNull(),

        created_at: int("created_at")
            .notNull()
            .default(sql`(unixepoch())`),
    }
);