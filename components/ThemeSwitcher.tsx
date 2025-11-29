"use client";

import { useTheme } from "./ThemeProvider";

export function ThemeSwitcher() {
    const { theme, setTheme } = useTheme();

    const themes = [
        { id: "light", name: "Claro", color: "bg-white border-gray-200" },
        { id: "dark", name: "Oscuro", color: "bg-slate-900 border-slate-700" },
        { id: "dim", name: "Tenue", color: "bg-slate-700 border-slate-600" },
        { id: "sepia", name: "Lectura", color: "bg-amber-100 border-amber-300" },
    ] as const;

    return (
        <div className="flex items-center gap-2 bg-card border border-border rounded-full p-1 shadow-sm">
            {themes.map((t) => (
                <button
                    key={t.id}
                    onClick={() => setTheme(t.id)}
                    className={`w-8 h-8 rounded-full border transition-all ${t.color
                        } ${theme === t.id
                            ? "ring-2 ring-primary ring-offset-2 ring-offset-background scale-110"
                            : "hover:scale-105 opacity-70 hover:opacity-100"
                        }`}
                    title={`Tema ${t.name}`}
                    aria-label={`Cambiar a tema ${t.name}`}
                />
            ))}
        </div>
    );
}
