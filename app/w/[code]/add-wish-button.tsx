"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { AddWishDialog } from "./add-wish-dialog";

interface AddWishButtonProps {
    wishlistId: number;
}

export function AddWishButton({
    wishlistId,
}: AddWishButtonProps) {
    const [open, setOpen] = useState(false);

    return (
        <>
            <Button onClick={() => setOpen(true)}>
                + Wunsch hinzufügen
            </Button>

            <AddWishDialog
                wishlistId={wishlistId}
                open={open}
                onOpenChange={setOpen}
            />
        </>
    );
}