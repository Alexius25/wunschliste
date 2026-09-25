"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { updateWishlist } from "@/app/actions/wishlist";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface EditWishlistDialogProps {
    wishlistId: number;
    name: string;
    description: string | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function EditWishlistDialog({
    wishlistId,
    name,
    description,
    open,
    onOpenChange,
}: EditWishlistDialogProps) {
    const router = useRouter();

    const [wishlistName, setWishlistName] = useState(name);
    const [wishlistDescription, setWishlistDescription] = useState(
        description ?? ""
    );
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (open) {
            setWishlistName(name);
            setWishlistDescription(description ?? "");
        }
    }, [open, name, description]);

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        if (!wishlistName.trim()) {
            return;
        }

        setSaving(true);

        try {
            await updateWishlist(
                wishlistId,
                wishlistName.trim(),
                wishlistDescription.trim()
            );

            onOpenChange(false);
            router.refresh();
        } catch (error) {
            console.error(error);
        } finally {
            setSaving(false);
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>Wunschliste bearbeiten</DialogTitle>
                        <DialogDescription>
                            Ändere den Namen oder die Beschreibung deiner
                            Wunschliste.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4 py-4">
                        <Field>
                            <FieldLabel htmlFor="wishlist-name">
                                Name
                            </FieldLabel>

                            <Input
                                id="wishlist-name"
                                value={wishlistName}
                                onChange={(event) =>
                                    setWishlistName(event.target.value)
                                }
                                placeholder="Meine Wunschliste"
                                required
                            />
                        </Field>

                        <Field>
                            <FieldLabel htmlFor="wishlist-description">
                                Beschreibung
                            </FieldLabel>

                            <Textarea
                                id="wishlist-description"
                                value={wishlistDescription}
                                onChange={(event) =>
                                    setWishlistDescription(
                                        event.target.value
                                    )
                                }
                                placeholder="Hier kannst du etwas über deine Wunschliste schreiben..."
                                rows={4}
                            />
                        </Field>
                    </div>

                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                            disabled={saving}
                        >
                            Abbrechen
                        </Button>

                        <Button
                            type="submit"
                            disabled={saving || !wishlistName.trim()}
                        >
                            {saving ? "Speichern..." : "Speichern"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}