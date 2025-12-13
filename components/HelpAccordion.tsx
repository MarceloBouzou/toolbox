"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, HelpCircle } from "lucide-react";

interface HelpAccordionProps {
    title?: string;
    items: string[];
}

export function HelpAccordion({ title = "¿Cómo funciona?", items }: HelpAccordionProps) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="w-full max-w-lg mx-auto mb-6">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors bg-muted/30 px-4 py-2 rounded-lg mx-auto"
                aria-expanded={isOpen}
                aria-controls="help-content"
            >
                <HelpCircle size={16} />
                {title}
                {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>

            {isOpen && (
                <div
                    id="help-content"
                    className="mt-2 bg-card border border-border rounded-xl p-4 shadow-sm text-sm text-muted-foreground animate-in slide-in-from-top-2 duration-200"
                >
                    <ul className="list-disc list-inside space-y-1 text-left">
                        {items.map((item, idx) => (
                            <li key={idx}>{item}</li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}
