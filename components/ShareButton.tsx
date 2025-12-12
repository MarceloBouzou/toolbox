"use client";

import { useState } from 'react';
import { Share2, Copy, Linkedin, Facebook, MessageCircle } from 'lucide-react';

export function ShareButton() {
    const [showMenu, setShowMenu] = useState(false);
    const [copied, setCopied] = useState(false);

    const handleShare = async () => {
        const shareData = {
            title: 'La Caja de Herramientas Digital',
            text: '¡Mira estas herramientas increíbles!',
            url: window.location.href,
        };

        if (navigator.share) {
            try {
                await navigator.share(shareData);
            } catch (err) {
                // If user cancelled or failed, show manual menu
                setShowMenu(true);
            }
        } else {
            setShowMenu(true);
        }
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(window.location.href)
            .then(() => {
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
                setTimeout(() => setShowMenu(false), 2000);
            })
            .catch(err => {
                console.error("Failed to copy", err);
                // Fallback?
            });
    };

    return (
        <>
            <button
                onClick={handleShare}
                className="p-2.5 rounded-full bg-card border border-border text-foreground hover:bg-muted hover:text-primary transition-all shadow-sm"
                title="Compartir"
            >
                <Share2 size={20} />
            </button>

            {/* Modal Overlay for Desktop/Fallback */}
            {showMenu && (
                <div className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
                    <div
                        className="bg-card dark:bg-slate-900 border border-border p-6 rounded-2xl shadow-2xl max-w-sm w-full animate-in zoom-in-95 duration-200"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h3 className="text-lg font-bold mb-4 text-center">Compartir Herramienta</h3>

                        <div className="flex flex-col gap-3">
                            <a
                                href={`https://wa.me/?text=${encodeURIComponent('¡Mira esto! ' + window.location.href)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-3 p-3 bg-green-500/10 hover:bg-green-500/20 text-green-700 dark:text-green-400 rounded-xl transition-colors font-medium"
                                onClick={() => setShowMenu(false)}
                            >
                                <MessageCircle size={20} /> WhatsApp
                            </a>

                            <a
                                href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-3 p-3 bg-blue-600/10 hover:bg-blue-600/20 text-blue-700 dark:text-blue-400 rounded-xl transition-colors font-medium"
                                onClick={() => setShowMenu(false)}
                            >
                                <Linkedin size={20} /> LinkedIn
                            </a>

                            <a
                                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-3 p-3 bg-blue-500/10 hover:bg-blue-500/20 text-blue-600 dark:text-blue-400 rounded-xl transition-colors font-medium"
                                onClick={() => setShowMenu(false)}
                            >
                                <Facebook size={20} /> Facebook
                            </a>

                            <hr className="border-border my-1" />

                            <button
                                onClick={copyToClipboard}
                                className="flex items-center gap-3 p-3 bg-muted hover:bg-muted/80 text-foreground rounded-xl transition-colors font-medium w-full text-left"
                            >
                                <Copy size={20} className={copied ? "text-green-500" : "text-muted-foreground"} />
                                {copied ? '¡Enlace Copiado!' : 'Copiar Enlace'}
                            </button>
                        </div>

                        <button
                            onClick={() => setShowMenu(false)}
                            className="mt-6 w-full py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                        >
                            Cerrar
                        </button>
                    </div>

                    {/* Background click close */}
                    <div
                        className="absolute inset-0 -z-10"
                        onClick={() => setShowMenu(false)}
                    />
                </div>
            )}
        </>
    );
}
