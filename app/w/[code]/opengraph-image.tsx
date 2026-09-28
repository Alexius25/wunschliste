import { ImageResponse } from "next/og"
import { db } from "@/lib/db"
import { wishlistsTable } from "@/lib/db/schema"
import { eq } from "drizzle-orm"

export const alt = "Wunschliste"
export const size = {
    width: 1200,
    height: 630,
}
export const contentType = "image/png"

interface Props {
    params: Promise<{
        code: string
    }>
}

export default async function Image({ params }: Props) {
    const { code } = await params

    const wishlist = await db
        .select()
        .from(wishlistsTable)
        .where(eq(wishlistsTable.code, code))
        .get()

    const name = (wishlist?.name ?? "Wunschliste").slice(0, 80)

    const description = (
        wishlist?.description ?? "Eine geteilte Wunschliste"
    ).slice(0, 160)

    return new ImageResponse(
        <div
            style={{
                width: "100%",
                height: "100%",
                display: "flex",
                position: "relative",
                overflow: "hidden",
                alignItems: "center",
                justifyContent: "center",
                background: "linear-gradient(135deg, #fafafa 0%, #f1f5f9 100%)",
                fontFamily: "sans-serif",
            }}
        >
            {/* Decorative blobs */}
            <div
                style={{
                    position: "absolute",
                    width: 500,
                    height: 500,
                    borderRadius: 9999,
                    background: "#ddd6fe",
                    opacity: 0.45,
                    top: -220,
                    right: -120,
                }}
            />

            <div
                style={{
                    position: "absolute",
                    width: 400,
                    height: 400,
                    borderRadius: 9999,
                    background: "#bae6fd",
                    opacity: 0.4,
                    bottom: -220,
                    left: -120,
                }}
            />

            {/* Main card */}
            <div
                style={{
                    width: 1040,
                    height: 470,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    padding: "64px 72px",
                    borderRadius: 36,
                    background: "rgba(255, 255, 255, 0.85)",
                    border: "1px solid rgba(255, 255, 255, 0.9)",
                    boxShadow: "0 24px 80px rgba(15, 23, 42, 0.12)",
                }}
            >
                {/* Header */}
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 16,
                        fontSize: 28,
                        fontWeight: 600,
                        color: "#64748b",
                    }}
                >
                    <div
                        style={{
                            width: 54,
                            height: 54,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            borderRadius: 16,
                            background: "#ede9fe",
                            fontSize: 30,
                        }}
                    >
                        🎁
                    </div>
                    Wunschliste
                </div>

                {/* Title */}
                <div
                    style={{
                        marginTop: 32,
                        fontSize: 64,
                        fontWeight: 700,
                        lineHeight: 1.1,
                        color: "#0f172a",
                        maxWidth: 900,
                        overflow: "hidden",
                    }}
                >
                    {name}
                </div>

                {/* Description */}
                <div
                    style={{
                        marginTop: 24,
                        fontSize: 28,
                        lineHeight: 1.35,
                        color: "#64748b",
                        maxWidth: 850,
                        overflow: "hidden",
                    }}
                >
                    {description}
                </div>

                {/* Footer */}
                <div
                    style={{
                        display: "flex",
                        marginTop: 40,
                        fontSize: 22,
                        color: "#94a3b8",
                    }}
                >
                    Gemeinsam Wünsche teilen
                </div>
            </div>
        </div>,
        size
    )
}
