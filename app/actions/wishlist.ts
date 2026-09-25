"use server";

import { db } from "@/lib/db";
import { wishlistsTable } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import argon2 from "argon2";
import { randomInt } from "node:crypto";
import { hasWishlistEditAccess } from "@/lib/auth";

export async function createWishlist(
    name: string,
    description: string,
    edit_password: string
) {
    const edit_password_hash = await argon2.hash(edit_password);

    let code = "";

    while (true) {
        code = generateRandomCode(8);

        const existingWishlist = await db
            .select()
            .from(wishlistsTable)
            .where(eq(wishlistsTable.code, code))
            .get();

        if (!existingWishlist) {
            break;
        }
    }

    await db
        .insert(wishlistsTable)
        .values({
            code,
            name,
            description,
            edit_password_hash,
        })
        .returning();

        return code;
}

function generateRandomCode(length: number): string {
    const characters = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

    let result = "";

    for (let i = 0; i < length; i++) {
        result += characters[randomInt(characters.length)];
    }

    return result;
}

export async function updateWishlist(
    wishlistId: number,
    name: string,
    description: string
) {
    const hasAccess = await hasWishlistEditAccess(wishlistId);

    if (!hasAccess) {
        throw new Error("Nicht autorisiert.");
    }

    const result = await db
        .update(wishlistsTable)
        .set({
            name,
            description: description || null,
        })
        .where(eq(wishlistsTable.id, wishlistId))
        .returning();

    return result[0];
}