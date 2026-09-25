"use client";

import { useEffect, useRef, useState } from "react";
import QRCode from "qrcode";
import { QrCode } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

interface QRCodeDialogProps {
    code: string;
}

export function QRCodeDialog({
    code,
}: QRCodeDialogProps) {
    const [open, setOpen] = useState(false);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        if (!open) {
            return;
        }

        const url = `${window.location.origin}/w/${code}`;

        const timeout = setTimeout(() => {
            if (!canvasRef.current) {
                return;
            }

            QRCode.toCanvas(
                canvasRef.current,
                url,
                {
                    width: 280,
                    margin: 2,
                },
                (error) => {
                    if (error) {
                        console.error(
                            "QR-Code konnte nicht erstellt werden:",
                            error
                        );
                    }
                }
            );
        }, 50);

        return () => clearTimeout(timeout);
    }, [open, code]);

    return (
        <>
            <Button
                variant="outline"
                size="sm"
                onClick={() => setOpen(true)}
            >
                <QrCode className="mr-2 size-4" />
                QR-Code
            </Button>

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="sm:max-w-sm">
                    <DialogHeader>
                        <DialogTitle>
                            Wunschliste teilen
                        </DialogTitle>

                        <DialogDescription>
                            Scanne diesen QR-Code, um die
                            Wunschliste zu öffnen.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="flex justify-center py-4">
                        <canvas
                            ref={canvasRef}
                            width={280}
                            height={280}
                            className="rounded-lg"
                        />
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
}