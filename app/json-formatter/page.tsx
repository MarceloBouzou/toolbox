"use client";

import { useState } from 'react';
import Link from 'next/link';
import { ThemeSwitcher } from '@/components/ThemeSwitcher';

export default function JsonFormatterPage() {
    const [input, setInput] = useState('');
    const [output, setOutput] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [copied, setCopied] = useState(false);

    const handleFormat = () => {
        try {
            if (!input.trim()) {
                setError('Por favor ingresa un JSON para formatear.');
                return;
            }
            const parsed = JSON.parse(input);
            setOutput(JSON.stringify(parsed, null, 2));
            setError(null);
        } catch (err) {
            setError((err as Error).message);
            setOutput('');
        }
    };

    const handleMinify = () => {
        try {
            if (!input.trim()) {
                setError('Por favor ingresa un JSON para minificar.');
                return;
            }
            const parsed = JSON.parse(input);
            setOutput(JSON.stringify(parsed));
            setError(null);
        } catch (err) {
            setError((err as Error).message);
            setOutput('');
        }
    };

    const handleClear = () => {
        setInput('');
        setOutput('');
        setError(null);
        setCopied(false);
    };

    const handleCopy = () => {
        if (!output) return;
        navigator.clipboard.writeText(output);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
            {/* Header */}
            <header className="border-b border-border bg-card">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/" className="text-muted-foreground hover:text-primary transition-colors">
                            &larr; Volver
                        </Link>
                        <h1 className="text-xl font-bold">Formateador JSON</h1>
                    </div>
                    <ThemeSwitcher />
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[calc(100vh-12rem)]">
                    {/* Input Section */}
                    <div className="flex flex-col gap-4">
                        <div className="flex justify-between items-center">
                            <label htmlFor="json-input" className="font-medium text-muted-foreground">
                                Entrada JSON
                            </label>
                            <button
                                onClick={handleClear}
                                className="text-sm text-red-500 hover:text-red-600 font-medium transition-colors"
                            >
                                Limpiar todo
                            </button>
                        </div>
                        <textarea
                            id="json-input"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Pega tu JSON aquí..."
                            className="flex-1 w-full p-4 rounded-xl border border-border bg-card font-mono text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none resize-none transition-all shadow-sm"
                            spellCheck={false}
                        />
                        <div className="flex gap-3">
                            <button
                                onClick={handleFormat}
                                className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90 py-2.5 px-4 rounded-lg font-medium transition-all shadow-sm active:scale-95"
                            >
                                Formatear (Beautify)
                            </button>
                            <button
                                onClick={handleMinify}
                                className="flex-1 bg-secondary text-secondary-foreground hover:bg-secondary/80 py-2.5 px-4 rounded-lg font-medium transition-all shadow-sm active:scale-95"
                            >
                                Minificar
                            </button>
                        </div>
                    </div>

                    {/* Output Section */}
                    <div className="flex flex-col gap-4">
                        <div className="flex justify-between items-center">
                            <span className="font-medium text-muted-foreground">Resultado</span>
                            {output && (
                                <button
                                    onClick={handleCopy}
                                    className={`text-sm font-medium transition-colors ${copied ? 'text-green-500' : 'text-primary hover:text-primary/80'
                                        }`}
                                >
                                    {copied ? '¡Copiado!' : 'Copiar resultado'}
                                </button>
                            )}
                        </div>

                        <div className="relative flex-1">
                            {error ? (
                                <div className="absolute inset-0 p-4 rounded-xl border border-red-200 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 font-mono text-sm overflow-auto">
                                    <p className="font-bold mb-2">Error de Sintaxis:</p>
                                    {error}
                                </div>
                            ) : (
                                <textarea
                                    readOnly
                                    value={output}
                                    placeholder="El resultado aparecerá aquí..."
                                    className="w-full h-full p-4 rounded-xl border border-border bg-muted/50 font-mono text-sm focus:outline-none resize-none text-muted-foreground"
                                />
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
