"use client"

import { ExternalLink, Pencil, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useState } from "react"
import { AddWishDialog } from "./add-wish-dialog"

import { deleteWish } from "@/app/actions/wish"
import { useRouter } from "next/navigation"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

import { CalendarCheck, CalendarPlus } from "lucide-react"

import { ReserveWishDialog } from "./reserve-wish-dialog"

import { cancelReservation } from "@/app/actions/reservation"

interface WishCardProps {
    wishlistId: number
    id: number
    name: string
    description: string | null
    icon: string | null
    url: string | null
    price: number | null
    canEdit: boolean
    isReserved: boolean
    ownReservation: boolean
}

export function WishCard({
    wishlistId,
    id,
    name,
    description,
    icon,
    url,
    price,
    canEdit,
    isReserved,
    ownReservation,
}: WishCardProps) {
    const [editOpen, setEditOpen] = useState(false)
    const router = useRouter()
    const [deleteOpen, setDeleteOpen] = useState(false)
    const [deleting, setDeleting] = useState(false)
    const [reserveOpen, setReserveOpen] = useState(false)
    const [canceling, setCanceling] = useState(false)

    async function handleDelete() {
        setDeleting(true)

        try {
            await deleteWish(wishlistId, id)

            setDeleteOpen(false)
            router.refresh()
        } catch (error) {
            console.error(error)
        } finally {
            setDeleting(false)
        }
    }

    async function handleCancelReservation() {
        setCanceling(true)

        try {
            await cancelReservation(id)
            router.refresh()
        } catch (error) {
            console.error(error)
        } finally {
            setCanceling(false)
        }
    }

    return (
        <>
            <Card className="transition-shadow hover:shadow-md">
                <CardContent className="flex items-center gap-4 p-4">
                    {/* Icon */}
                    <div className="flex size-14 shrink-0 items-center justify-center rounded-xl bg-muted text-3xl">
                        {icon || "🎁"}
                    </div>

                    {/* Inhalt */}
                    <div className="min-w-0 flex-1 text-left">
                        <h2 className="truncate font-semibold">{name}</h2>

                        {description && (
                            <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                                {description}
                            </p>
                        )}

                        {url && (
                            <a
                                href={url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="mt-2 inline-flex items-center gap-1 text-sm text-primary hover:underline"
                            >
                                Zum Produkt
                                <ExternalLink className="size-3.5" />
                            </a>
                        )}
                    </div>

                    {/* Preis + Aktionen */}
                    <div className="flex shrink-0 flex-col items-end gap-2">
                        {price !== null && (
                            <span className="text-lg font-semibold">
                                {(price / 100).toLocaleString("de-DE", {
                                    style: "currency",
                                    currency: "EUR",
                                })}
                            </span>
                        )}

                        {canEdit && (
                            <div className="flex gap-1">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    title="Wunsch bearbeiten"
                                    onClick={() => setEditOpen(true)}
                                >
                                    <Pencil className="size-4" />
                                </Button>

                                <Button
                                    variant="ghost"
                                    size="icon"
                                    title="Wunsch löschen"
                                    onClick={() => setDeleteOpen(true)}
                                >
                                    <Trash2 className="size-4" />
                                </Button>
                            </div>
                        )}

                        {!isReserved && (
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setReserveOpen(true)}
                            >
                                <CalendarPlus className="mr-2 size-4" />
                                Reservieren
                            </Button>
                        )}

                        {isReserved && !ownReservation && (
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <CalendarCheck className="size-4" />
                                Reserviert
                            </div>
                        )}

                        {ownReservation && (
                            <div className="flex items-center gap-2">
                                <span className="text-sm text-green-600">
                                    Meine Reservierung
                                </span>

                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={handleCancelReservation}
                                    disabled={canceling}
                                >
                                    {canceling
                                        ? "Wird aufgehoben..."
                                        : "Aufheben"}
                                </Button>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>

            <AddWishDialog
                wishlistId={wishlistId}
                wish={{
                    id,
                    name,
                    description,
                    icon,
                    url,
                    price,
                }}
                open={editOpen}
                onOpenChange={setEditOpen}
            />

            <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Wunsch löschen?</AlertDialogTitle>

                        <AlertDialogDescription>
                            Möchtest du „{name}“ wirklich löschen? Diese Aktion
                            kann nicht rückgängig gemacht werden.
                        </AlertDialogDescription>
                    </AlertDialogHeader>

                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={deleting}>
                            Abbrechen
                        </AlertDialogCancel>

                        <AlertDialogAction
                            onClick={handleDelete}
                            disabled={deleting}
                        >
                            {deleting ? "Wird gelöscht..." : "Löschen"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            <ReserveWishDialog
                wishId={id}
                wishName={name}
                open={reserveOpen}
                onOpenChange={setReserveOpen}
            />
        </>
    )
}
