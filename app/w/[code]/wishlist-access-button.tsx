"use client"

import { useState } from "react"
import { Lock, LockOpen } from "lucide-react"

import { Button } from "@/components/ui/button"
import { WishlistAccessPasswordDialog } from "./wishlist-access-password-dialoge"

interface WishlistAccessButtonProps {
    code: string
    canEdit: boolean
}

export function WishlistAccessButton({ code, canEdit }: WishlistAccessButtonProps) {
    const [open, setOpen] = useState(false)

    return (
        <>
            <Button variant="ghost" size="icon" disabled={canEdit} onClick={() => setOpen(true)}>
                {canEdit ? (
                    <LockOpen className="size-4 " />
                ) : (
                    <Lock className="size-4" />
                )}
            </Button>

            <WishlistAccessPasswordDialog
                code={code}
                open={open}
                onOpenChange={setOpen}
            />
        </>
    )
}
