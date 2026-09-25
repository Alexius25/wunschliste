"use client"

import { useState } from "react"
import { Check, Share2 } from "lucide-react"

import { Button } from "@/components/ui/button"

interface ShareWishlistButtonProps {
    code: string
}

export function ShareWishlistButton({ code }: ShareWishlistButtonProps) {
    const [copied, setCopied] = useState(false)

    const url =
        typeof window !== "undefined"
            ? `${window.location.origin}/w/${code}`
            : ""

    async function handleShare() {
        if (!url) {
            return
        }

        try {
            if (navigator.share) {
                await navigator.share({
                    title: "Meine Wunschliste",
                    url,
                })

                return
            }

            if (navigator.clipboard) {
                await navigator.clipboard.writeText(url)
            } else {
                const textarea = document.createElement("textarea")

                textarea.value = url
                textarea.style.position = "fixed"
                textarea.style.opacity = "0"

                document.body.appendChild(textarea)

                textarea.focus()
                textarea.select()

                const successful = document.execCommand("copy")

                document.body.removeChild(textarea)

                if (!successful) {
                    throw new Error("Kopieren fehlgeschlagen.")
                }
            }

            setCopied(true)

            setTimeout(() => {
                setCopied(false)
            }, 2000)
        } catch (error) {
            console.error(error)
        }
    }

    return (
        <Button variant="outline" size="sm" onClick={handleShare}>
            {copied ? (
                <>
                    <Check className="mr-2 size-4" />
                    Kopiert
                </>
            ) : (
                <>
                    <Share2 className="mr-2 size-4" />
                    Teilen
                </>
            )}
        </Button>
    )
}
