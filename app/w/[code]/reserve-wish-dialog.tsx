"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { reserveWish } from "@/app/actions/reservation";
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

interface ReserveWishDialogProps {
    wishId: number;
    wishName: string;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function ReserveWishDialog({
    wishId,
    wishName,
    open,
    onOpenChange,
}: ReserveWishDialogProps) {
    const router = useRouter();

    const [name, setName] = useState("");
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function handleSubmit(
        event: React.FormEvent<HTMLFormElement>
    ) {
        event.preventDefault();

        if (!name.trim()) {
            return;
        }

        setSaving(true);
        setError(null);

        try {
            await reserveWish(wishId, name.trim());

            setName("");
            onOpenChange(false);
            router.refresh();
        } catch (error) {
            console.error(error);

            setError(
                error instanceof Error
                    ? error.message
                    : "Reservierung fehlgeschlagen."
            );
        } finally {
            setSaving(false);
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>Wunsch reservieren</DialogTitle>

                        <DialogDescription>
                            Du möchtest „{wishName}“ reservieren.
                            Gib deinen Namen ein, damit klar ist,
                            wer die Reservierung vorgenommen hat.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="py-4">
                        <Field>
                            <FieldLabel htmlFor="reservation-name">
                                Dein Name
                            </FieldLabel>

                            <Input
                                id="reservation-name"
                                value={name}
                                onChange={(event) =>
                                    setName(event.target.value)
                                }
                                placeholder="Max"
                                autoFocus
                                required
                            />
                        </Field>

                        {error && (
                            <p className="mt-2 text-sm text-destructive">
                                {error}
                            </p>
                        )}
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
                            disabled={saving || !name.trim()}
                        >
                            {saving
                                ? "Reserviere..."
                                : "Reservieren"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}