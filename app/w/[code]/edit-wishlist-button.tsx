"use client";

import { useState } from "react";
import { Pencil } from "lucide-react";

import { Button } from "@/components/ui/button";
import { EditWishlistDialog } from "./edit-wishlist-dialog";

interface EditWishlistButtonProps {
    wishlistId: number;
    name: string;
    description: string | null;
}

export function EditWishlistButton({
    wishlistId,
    name,
    description,
}: EditWishlistButtonProps) {
    const [open, setOpen] = useState(false);

    return (
        <>
            <Button
                variant="ghost"
                size="icon"
                title="Wunschliste bearbeiten"
                onClick={() => setOpen(true)}
            >
                <Pencil className="size-4" />
            </Button>

            <EditWishlistDialog
                wishlistId={wishlistId}
                name={name}
                description={description}
                open={open}
                onOpenChange={setOpen}
            />
        </>
    );
}