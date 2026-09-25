import Link from "next/link"

export default function Page() {
    return (
        <main className="flex min-h-dvh w-full items-center justify-center px-10 py-10">
            <div className="w-full max-w-xl text-center">
                <h1 className="text-2xl font-bold">Wunschliste</h1>

                <p className="mt-2 text-muted-foreground">
                    Erstelle deine Wunschliste und teile sie mit deinen Freunden
                    und Familie.
                </p>

                <div className="mt-6 flex justify-center">
                    <Link
                        href="/c"
                        className="rounded-md bg-primary px-4 py-2 text-white hover:bg-primary/90 dark:bg-white dark:text-black dark:hover:bg-primary/90"
                    >
                        Wunschliste erstellen
                    </Link>
                </div>
            </div>
        </main>
    )
}