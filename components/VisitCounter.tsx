"use client";

import { useEffect, useState } from 'react';

export function VisitCounter() {
    const [count, setCount] = useState<number | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Namespace specific to this app to avoid collisions
        const namespace = 'toolbox-marcelo-app';
        const key = 'visits';

        const fetchCount = async () => {
            try {
                // First try to hit the up endpoint to increment
                const upRes = await fetch(`https://api.counterapi.dev/v1/${namespace}/${key}/up`);

                if (upRes.ok) {
                    const data = await upRes.json();
                    setCount(data.count);
                } else {
                    // If it fails (maybe first time), try to get info or create
                    // For this simple API, usually just hitting up works if namespace exists or is auto-created.
                    // If it fails, we might just show nothing or retry with a get
                    const getRes = await fetch(`https://api.counterapi.dev/v1/${namespace}/${key}/`);
                    if (getRes.ok) {
                        const data = await getRes.json();
                        setCount(data.count);
                    }
                }
            } catch (error) {
                console.error('Error fetching visit count:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchCount();
    }, []);

    if (loading || count === null) return null;

    return (
        <div className="flex items-center justify-center gap-2 text-[10px] text-muted-foreground/40 mt-4 opacity-50 hover:opacity-100 transition-opacity duration-300">
            <span className="font-mono"># {count.toLocaleString()}</span>
        </div>
    );
}
