import { cookies } from "next/headers";
import { createHash } from "node:crypto";
import { and, eq, gt } from "drizzle-orm";

import { db } from "@/lib/db";
import { wishlistEditSessionsTable } from "@/lib/db/schema";

export async function hasWishlistEditAccess(
    wishlistId: number
): Promise<boolean> {
    const cookieStore = await cookies();

    const token = cookieStore.get("wishlist_edit_session")?.value;

    if (!token) {
        return false;
    }

    const tokenHash = createHash("sha256")
        .update(token)
        .digest("hex");

    const session = await db
        .select()
        .from(wishlistEditSessionsTable)
        .where(
            and(
                eq(
                    wishlistEditSessionsTable.wishlist_id,
                    wishlistId
                ),
                eq(
                    wishlistEditSessionsTable.token_hash,
                    tokenHash
                ),
                gt(
                    wishlistEditSessionsTable.expires_at,
                    Math.floor(Date.now() / 1000)
                )
            )
        )
        .get();

    return !!session;
}