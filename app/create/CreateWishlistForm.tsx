"use client"

import { useState } from "react"
import { createWishlist } from "@/app/actions/wishlist"

import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    Field,
    FieldDescription,
    FieldGroup,
    FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { useRouter } from "next/navigation"

export default function CreateWishlistForm({
    className,
    ...props
}: React.ComponentProps<"div">) {
    const router = useRouter()

    const [name, setName] = useState("")
    const [description, setDescription] = useState("")
    const [password, setPassword] = useState("")

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()

        try {
            const code = await createWishlist(name, description, password)

            router.push(`/w/${code}`)
        } catch (error) {
            console.error(error)
        }
    }

    return (
        <Card className={className} {...props}>
            <CardHeader>
                <CardTitle>Wunschliste erstellen</CardTitle>
                <CardDescription>
                    Erstelle eine neue Wunschliste.
                </CardDescription>
            </CardHeader>

            <CardContent>
                <form onSubmit={handleSubmit}>
                    <FieldGroup>
                        <Field>
                            <FieldLabel htmlFor="name">Name</FieldLabel>
                            <Input
                                id="name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                        </Field>

                        <Field>
                            <FieldLabel htmlFor="description">
                                Beschreibung
                            </FieldLabel>
                            <Input
                                id="description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                            />
                        </Field>

                        <Field>
                            <FieldLabel htmlFor="password">
                                Bearbeitungspasswort
                            </FieldLabel>
                            <Input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                            <FieldDescription>
                                Dieses Passwort wird benötigt, um die
                                Wunschliste zu bearbeiten.
                            </FieldDescription>
                        </Field>

                        <Button type="submit">Erstellen</Button>
                    </FieldGroup>
                </form>
            </CardContent>
        </Card>
    )
}
