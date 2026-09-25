import CreateWishlistForm from "./CreateWishlistForm";


export default function CreatePage() {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center py-2">
            <CreateWishlistForm className="w-full max-w-md" />
        </div>
    );
}