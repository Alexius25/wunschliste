"use client"

import { useEffect, useState } from "react"
import Link from "next/link"

interface VisitedWishlist {
    code: string
    name: string
    visitedAt: number
}

export function VisitedWishlists() {
    const [wishlists, setWishlists] = useState<VisitedWishlist[]>([])

    useEffect(() => {
        try {
            const stored = localStorage.getItem("visited_wishlists")

            if (stored) {
                setWishlists(JSON.parse(stored))
            }
        } catch {
            setWishlists([])
        }
    }, [])

    if (wishlists.length === 0) {
        return null
    }

    return (
        <div className="mt-10 text-left">
            <h2 className="text-lg font-semibold">Zuletzt besucht</h2>

            <div className="mt-3 space-y-2">
                {wishlists.map((wishlist) => (
                    <Link
                        key={wishlist.code}
                        href={`/w/${wishlist.code}`}
                        className="block rounded-lg border p-4 transition hover:bg-muted"
                    >
                        <div className="font-medium">
                            {wishlist.name}
                        </div>

                        <div className="mt-1 text-sm text-muted-foreground">
                            Zuletzt besucht:{" "}
                            {new Date(
                                wishlist.visitedAt
                            ).toLocaleString("de-DE")}
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    )
}