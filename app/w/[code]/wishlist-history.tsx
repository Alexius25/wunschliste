"use client"

import { useEffect } from "react"

interface WishlistHistoryProps {
    code: string
    name: string
}

interface VisitedWishlist {
    code: string
    name: string
    visitedAt: number
}

export function WishlistHistory({ code, name }: WishlistHistoryProps) {
    useEffect(() => {
        const key = "visited_wishlists"

        let wishlists: VisitedWishlist[] = []

        try {
            const stored = localStorage.getItem(key)
            wishlists = stored ? JSON.parse(stored) : []
        } catch {
            wishlists = []
        }

        // Diese Liste entfernen, falls sie schon vorhanden ist
        wishlists = wishlists.filter((wishlist) => wishlist.code !== code)

        // Aktuellen Besuch hinzufügen
        wishlists.unshift({
            code,
            name,
            visitedAt: Date.now(),
        })

        // Optional: nur die letzten 25 Listen behalten
        wishlists = wishlists.slice(0, 25)

        localStorage.setItem(key, JSON.stringify(wishlists))
    }, [code, name])

    return null
}
