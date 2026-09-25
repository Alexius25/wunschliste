"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

import { createWish, updateWish } from "@/app/actions/wish"

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"

import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

interface Wish {
    id: number
    name: string
    description: string | null
    icon: string | null
    url: string | null
    price: number | null
}

interface AddWishDialogProps {
    wishlistId: number
    wish?: Wish
    open: boolean
    onOpenChange: (open: boolean) => void
}

export function AddWishDialog({
    wishlistId,
    wish,
    open,
    onOpenChange,
}: AddWishDialogProps) {
    const router = useRouter()

    const [name, setName] = useState("")
    const [description, setDescription] = useState("")
    const [price, setPrice] = useState("")
    const [url, setUrl] = useState("")
    const [icon, setIcon] = useState("")
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if (wish) {
            setName(wish.name)
            setDescription(wish.description ?? "")
            setPrice(
                wish.price !== null
                    ? (wish.price / 100).toFixed(2).replace(".", ",")
                    : ""
            )
            setUrl(wish.url ?? "")
            setIcon(wish.icon ?? "")
        } else {
            setName("")
            setDescription("")
            setPrice("")
            setUrl("")
            setIcon("")
        }
    }, [wish, open])

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()

        setLoading(true)

        try {
            const priceInCents = price
                ? Math.round(parseFloat(price.replace(",", ".")) * 100)
                : null

            if (wish) {
                await updateWish(
                    wishlistId,
                    wish.id,
                    name,
                    description,
                    icon,
                    url,
                    priceInCents
                )
            } else {
                await createWish(
                    wishlistId,
                    name,
                    description,
                    icon,
                    url,
                    priceInCents
                )
            }

            onOpenChange(false)
            router.refresh()
        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        {wish ? "Wunsch bearbeiten" : "Wunsch hinzufügen"}
                    </DialogTitle>

                    <DialogDescription>
                        {wish
                            ? "Ändere die Daten deines Wunsches."
                            : "Füge einen neuen Wunsch zu deiner Wunschliste hinzu."}
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit}>
                    <FieldGroup>
                        <Field>
                            <FieldLabel htmlFor="wish-name">Name</FieldLabel>

                            <Input
                                id="wish-name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                        </Field>

                        <Field>
                            <FieldLabel htmlFor="wish-description">
                                Beschreibung
                            </FieldLabel>

                            <Input
                                id="wish-description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                            />
                        </Field>

                        <Field>
                            <FieldLabel htmlFor="wish-price">Preis</FieldLabel>

                            <Input
                                id="wish-price"
                                type="text"
                                inputMode="decimal"
                                placeholder="z. B. 29,99"
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
                            />
                        </Field>

                        <Field>
                            <FieldLabel htmlFor="wish-url">Link</FieldLabel>

                            <Input
                                id="wish-url"
                                type="url"
                                placeholder="https://..."
                                value={url}
                                onChange={(e) => setUrl(e.target.value)}
                            />
                        </Field>

                        <Field>
                            <FieldLabel htmlFor="wish-icon">Icon</FieldLabel>

                            <Input
                                id="wish-icon"
                                placeholder="🎧"
                                value={icon}
                                onChange={(e) => setIcon(e.target.value)}
                            />
                        </Field>
                    </FieldGroup>

                    <DialogFooter className="mt-6">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                            disabled={loading}
                        >
                            Abbrechen
                        </Button>

                        <Button type="submit" disabled={loading}>
                            {loading
                                ? "Wird gespeichert..."
                                : wish
                                  ? "Speichern"
                                  : "Hinzufügen"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
