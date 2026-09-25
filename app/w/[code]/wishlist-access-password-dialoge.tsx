"use client"

import { useState } from "react"

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Field, FieldLabel } from "@/components/ui/field"

import { authenticateWishlist } from "@/app/actions/auth"

interface WishlistAccessPasswordDialogProps {
    code: string
    open: boolean
    onOpenChange: (open: boolean) => void
}

export function WishlistAccessPasswordDialog({
    code,
    open,
    onOpenChange,
}: WishlistAccessPasswordDialogProps) {
    const [password, setPassword] = useState("")

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()

        const result = await authenticateWishlist(code, password)

        if (!result.success) {
            console.error(result.error)
            return
        }

        console.log("Authentifiziert!")

        onOpenChange(false)
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Wunschliste bearbeiten</DialogTitle>
                    <DialogDescription>
                        Gib dein Bearbeitungspasswort ein, um die Wunschliste zu
                        bearbeiten.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit}>
                    <Field>
                        <FieldLabel htmlFor="edit-password">
                            Passwort
                        </FieldLabel>

                        <Input
                            id="edit-password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            autoFocus
                            required
                        />
                    </Field>

                    <DialogFooter className="mt-6">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                        >
                            Abbrechen
                        </Button>

                        <Button type="submit">Bearbeiten</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
