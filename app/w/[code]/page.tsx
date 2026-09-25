import { db } from "@/lib/db"
import { wishlistsTable, wishesTable } from "@/lib/db/schema"
import { eq } from "drizzle-orm"
import { notFound } from "next/navigation"

import { hasWishlistEditAccess } from "@/lib/auth"
import { WishlistAccessButton } from "./wishlist-access-button"
import { AddWishButton } from "./add-wish-button"
import { WishCard } from "./wish-card"
import { EditWishlistButton } from "./edit-wishlist-button"

import { cookies } from "next/headers"
import { createHash } from "node:crypto"
import { reservationsTable } from "@/lib/db/schema"

interface WishlistPageProps {
    params: Promise<{
        code: string
    }>
}

export default async function WishlistPage({ params }: WishlistPageProps) {
    const { code } = await params

    const wishlist = await db
        .select()
        .from(wishlistsTable)
        .where(eq(wishlistsTable.code, code))
        .get()

    if (!wishlist) {
        notFound()
    }

    const canEdit = await hasWishlistEditAccess(wishlist.id)

    const wishes = await db
        .select()
        .from(wishesTable)
        .where(eq(wishesTable.wishlist_id, wishlist.id))
        .orderBy(wishesTable.position)

    const reservations = await db.select().from(reservationsTable)

    const cookieStore = await cookies()

    const wishesWithReservation = wishes.map((wish) => {
        const reservation = reservations.find(
            (reservation) => reservation.wish_id === wish.id
        )

        let ownReservation = false

        if (reservation) {
            const token = cookieStore.get(`wish_reservation_${wish.id}`)?.value

            if (token) {
                const tokenHash = createHash("sha256")
                    .update(token)
                    .digest("hex")

                ownReservation = tokenHash === reservation.token_hash
            }
        }

        return {
            ...wish,
            isReserved: !!reservation,
            ownReservation,
        }
    })

    return (
        <div className="flex min-h-screen flex-col items-center justify-center px-4 py-2">
            <div className="w-full rounded-lg border border-muted-foreground/10 bg-muted-foreground/5 p-4 text-center sm:w-2/3 lg:w-1/2">
                <div className="mb-2 flex items-center justify-between">
                    <h1 className="text-2xl font-bold">{wishlist.name}</h1>

                    <div className="flex items-center gap-2">
                        <WishlistAccessButton
                            code={wishlist.code}
                            canEdit={canEdit}
                        />

                        {canEdit && (
                            <EditWishlistButton
                                wishlistId={wishlist.id}
                                name={wishlist.name}
                                description={wishlist.description}
                            />
                        )}
                    </div>
                </div>

                <hr className="my-4" />

                {wishlist.description && (
                    <p className="text-left text-muted-foreground">
                        {wishlist.description}
                    </p>
                )}

                <div className="mt-6 space-y-3">
                    {wishes.length === 0 ? (
                        <div className="rounded-xl border border-dashed p-8 text-center">
                            <p className="text-muted-foreground">
                                Noch keine Wünsche vorhanden.
                            </p>
                        </div>
                    ) : (
                        wishesWithReservation.map((wish) => (
                            <WishCard
                                key={wish.id}
                                wishlistId={wishlist.id}
                                id={wish.id}
                                name={wish.name}
                                description={wish.description}
                                icon={wish.icon}
                                url={wish.url}
                                price={wish.price}
                                canEdit={canEdit}
                                isReserved={wish.isReserved}
                                ownReservation={wish.ownReservation}
                            />
                        ))
                    )}
                </div>

                <hr className="my-4" />

                <p className="text-sm text-muted-foreground">
                    Code: {wishlist.code}
                </p>

                {canEdit && (
                    <div className="mt-4 flex justify-center gap-2">
                        <AddWishButton wishlistId={wishlist.id} />
                    </div>
                )}

                {canEdit && (
                    <p className="mt-4 text-sm text-green-600">
                        Bearbeitungsmodus aktiv
                    </p>
                )}
            </div>
        </div>
    )
}
