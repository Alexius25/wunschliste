import CreateWishlistForm from "./create-wishlist-form"

export default function CreatePage() {
    return (
        <div className="flex min-h-dvh flex-col items-center justify-center py-2">
            <CreateWishlistForm className="w-full max-w-md" />
        </div>
    )
}