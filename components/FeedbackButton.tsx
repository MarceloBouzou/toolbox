"use client";

import { MessageSquarePlus } from 'lucide-react';
import { useState } from 'react';

export function FeedbackButton() {
    // This is a placeholder URL. In a real scenario, the user would provide their Google Form URL.
    // For now, I will use a generic structure or a placeholder that clearly indicates what to do.
    const GOOGLE_FORM_URL = "https://forms.gle/WXsaX6qooRTtnm7V6";

    const handleFeedback = () => {
        window.open(GOOGLE_FORM_URL, '_blank', 'noopener,noreferrer');
    };

    return (
        <button
            onClick={handleFeedback}
            className="group relative inline-flex items-center gap-2 px-4 py-2 bg-background border border-border/50 hover:border-primary/50 text-muted-foreground hover:text-primary rounded-full text-sm font-medium transition-all duration-300 hover:shadow-sm"
            title="Danos tu opinión"
        >
            <MessageSquarePlus size={16} className="group-hover:scale-110 transition-transform" />
            <span>¿Ideas?</span>
            <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-primary"></span>
            </span>
        </button>
    );
}
