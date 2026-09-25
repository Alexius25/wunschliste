"use server";

import { cookies } from "next/headers";
import { randomBytes, createHash } from "node:crypto";
import argon2 from "argon2";
import { eq } from "drizzle-orm";

import { db } from "@/lib/db";
import {
    wishlistsTable,
    wishlistEditSessionsTable,
} from "@/lib/db/schema";

export async function authenticateWishlist(
    code: string,
    password: string
) {
    const wishlist = await db
        .select()
        .from(wishlistsTable)
        .where(eq(wishlistsTable.code, code))
        .get();

    if (!wishlist) {
        return {
            success: false,
            error: "Wunschliste nicht gefunden.",
        };
    }

    const passwordValid = await argon2.verify(
        wishlist.edit_password_hash,
        password
    );

    if (!passwordValid) {
        return {
            success: false,
            error: "Falsches Passwort.",
        };
    }

    const token = randomBytes(32).toString("hex");

    const tokenHash = createHash("sha256")
        .update(token)
        .digest("hex");

    const expiresAt =
        Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7;

    await db.insert(wishlistEditSessionsTable).values({
        wishlist_id: wishlist.id,
        token_hash: tokenHash,
        expires_at: expiresAt,
    });

    const cookieStore = await cookies();

    cookieStore.set("wishlist_edit_session", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        expires: new Date(expiresAt * 1000),
        path: "/",
    });

    return {
        success: true,
    };
}