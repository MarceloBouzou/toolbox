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
                console.log('Error sharing:', err);
            }
        } else {
            setShowMenu(!showMenu);
        }
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(window.location.href);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
        setTimeout(() => setShowMenu(false), 2000);
    };

    return (
        <div className="relative inline-block">
            <button
                onClick={handleShare}
                className="p-2.5 rounded-full bg-card border border-border text-foreground hover:bg-muted hover:text-primary transition-all shadow-sm"
                title="Compartir"
            >
                <Share2 size={20} />
            </button>

            {showMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-card dark:bg-slate-900 border border-border p-2 z-50 rounded-xl shadow-xl animate-in fade-in zoom-in-95 duration-200">
                    <div className="flex flex-col gap-1">
                        <a
                            href={`https://wa.me/?text=${encodeURIComponent('¡Mira esto! ' + window.location.href)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 p-2 hover:bg-muted rounded-lg text-sm text-foreground transition-colors"
                            onClick={() => setShowMenu(false)}
                        >
                            <MessageCircle size={16} className="text-green-500" /> WhatsApp
                        </a>
                        <a
                            href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 p-2 hover:bg-muted rounded-lg text-sm text-foreground transition-colors"
                            onClick={() => setShowMenu(false)}
                        >
                            <Linkedin size={16} className="text-blue-600" /> LinkedIn
                        </a>
                        <a
                            href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 p-2 hover:bg-muted rounded-lg text-sm text-foreground transition-colors"
                            onClick={() => setShowMenu(false)}
                        >
                            <Facebook size={16} className="text-blue-500" /> Facebook
                        </a>
                        <button
                            onClick={copyToClipboard}
                            className="flex items-center gap-2 p-2 hover:bg-muted rounded-lg text-sm text-foreground transition-colors w-full text-left"
                        >
                            <Copy size={16} className={copied ? "text-green-500" : "text-muted-foreground"} />
                            {copied ? '¡Copiado!' : 'Copiar Enlace'}
                        </button>
                    </div>
                </div>
            )}

            {/* Backdrop to close menu */}
            {showMenu && (
                <div
                    className="fixed inset-0 z-40 bg-transparent"
                    onClick={() => setShowMenu(false)}
                />
            )}
        </div>
    );
}
