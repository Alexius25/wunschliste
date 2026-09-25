"use server"

import { db } from "@/lib/db"
import { wishesTable } from "@/lib/db/schema"
import { hasWishlistEditAccess } from "@/lib/auth"
import { and, eq } from "drizzle-orm"

export async function createWish(
    wishlistId: number,
    name: string,
    description: string,
    icon: string,
    url: string,
    price: number | null
) {
    const hasAccess = await hasWishlistEditAccess(wishlistId)

    if (!hasAccess) {
        throw new Error("Nicht autorisiert.")
    }

    const result = await db
        .insert(wishesTable)
        .values({
            wishlist_id: wishlistId,
            name,
            description: description || null,
            icon: icon || null,
            url: url || null,
            price,
        })
        .returning()

    return result[0]
}

export async function updateWish(
    wishlistId: number,
    wishId: number,
    name: string,
    description: string,
    icon: string,
    url: string,
    price: number | null
) {
    const hasAccess = await hasWishlistEditAccess(wishlistId)

    if (!hasAccess) {
        throw new Error("Nicht autorisiert.")
    }

    const result = await db
        .update(wishesTable)
        .set({
            name,
            description: description || null,
            icon: icon || null,
            url: url || null,
            price,
        })
        .where(
            and(
                eq(wishesTable.id, wishId),
                eq(wishesTable.wishlist_id, wishlistId)
            )
        )
        .returning()

    return result[0]
}

export async function deleteWish(wishlistId: number, wishId: number) {
    const hasAccess = await hasWishlistEditAccess(wishlistId)

    if (!hasAccess) {
        throw new Error("Nicht autorisiert.")
    }

    await db
        .delete(wishesTable)
        .where(
            and(
                eq(wishesTable.id, wishId),
                eq(wishesTable.wishlist_id, wishlistId)
            )
        )
}
