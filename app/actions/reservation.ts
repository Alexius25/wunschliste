"use server";

import { cookies } from "next/headers";
import { createHash, randomBytes } from "node:crypto";
import { eq } from "drizzle-orm";

import { db } from "@/lib/db";
import {
    reservationsTable,
    wishesTable,
} from "@/lib/db/schema";

function hashToken(token: string) {
    return createHash("sha256")
        .update(token)
        .digest("hex");
}

export async function reserveWish(
    wishId: number,
    name: string
) {
    if (!name.trim()) {
        throw new Error("Name erforderlich.");
    }

    const wish = await db
        .select()
        .from(wishesTable)
        .where(eq(wishesTable.id, wishId))
        .get();

    if (!wish) {
        throw new Error("Wunsch nicht gefunden.");
    }

    const existingReservation = await db
        .select()
        .from(reservationsTable)
        .where(eq(reservationsTable.wish_id, wishId))
        .get();

    if (existingReservation) {
        throw new Error("Dieser Wunsch wurde bereits reserviert.");
    }

    const token = randomBytes(32).toString("hex");
    const tokenHash = hashToken(token);

    await db.insert(reservationsTable).values({
        wish_id: wishId,
        name: name.trim(),
        token_hash: tokenHash,
    });

    const cookieStore = await cookies();

    cookieStore.set(
        `wish_reservation_${wishId}`,
        token,
        {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
        }
    );

    return {
        success: true,
    };
}

export async function cancelReservation(
    wishId: number
) {
    const cookieStore = await cookies();

    const token = cookieStore.get(
        `wish_reservation_${wishId}`
    )?.value;

    if (!token) {
        throw new Error("Keine Reservierung gefunden.");
    }

    const tokenHash = hashToken(token);

    const reservation = await db
        .select()
        .from(reservationsTable)
        .where(eq(reservationsTable.token_hash, tokenHash))
        .get();

    if (!reservation || reservation.wish_id !== wishId) {
        throw new Error("Reservierung nicht gefunden.");
    }

    await db
        .delete(reservationsTable)
        .where(eq(reservationsTable.id, reservation.id));

    cookieStore.delete(`wish_reservation_${wishId}`);

    return {
        success: true,
    };
}

export async function hasOwnReservation(
    wishId: number
) {
    const cookieStore = await cookies();

    const token = cookieStore.get(
        `wish_reservation_${wishId}`
    )?.value;

    if (!token) {
        return false;
    }

    const tokenHash = hashToken(token);

    const reservation = await db
        .select()
        .from(reservationsTable)
        .where(eq(reservationsTable.token_hash, tokenHash))
        .get();

    return !!reservation;
}