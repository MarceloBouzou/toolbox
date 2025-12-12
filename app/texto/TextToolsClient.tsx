"use client";

import { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { ShareButton } from '@/components/ShareButton';
import { VisitCounter } from '@/components/VisitCounter';
import { Copy, Trash2, Wand2, Scissors, Mail, Link as LinkIcon, Hash } from 'lucide-react';

export default function TextToolsClient() {
    const [input, setInput] = useState(`<div>   hOLA!   este  TEXTO   necesita   aYuDa. </div>
Hay   demasiados    espacios... y etiquetas HTML.
Contáctanos a soporte@toolbox.com o visita https://miweb.io/app.
Código de error: 404. Precio: $99.`);

    const [output, setOutput] = useState('');
    const [stats, setStats] = useState({ chars: 0, words: 0, lines: 0 });
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        setStats({
            chars: input.length,
            words: input.trim() ? input.trim().split(/\s+/).length : 0,
            lines: input ? input.split(/\r\n|\r|\n/).length : 0,
        });
    }, [input]);

    const handleCopy = () => {
        if (!output) return;
        navigator.clipboard.writeText(output);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const processText = (action: string) => {
        let result = input;
        switch (action) {
            // Format
            case 'uppercase':
                result = input.toUpperCase();
                break;
            case 'lowercase':
                result = input.toLowerCase();
                break;
            case 'titlecase':
                result = input.toLowerCase().replace(/(?:^|\s)\w/g, (match) => match.toUpperCase());
                break;
            case 'capitalize':
                result = input.replace(/(^\w|\.\s+\w)/gm, (match) => match.toUpperCase());
                break;

            // Clean
            case 'trim':
                result = input.replace(/\s+/g, ' ').trim();
                break;
            case 'nolinebreaks':
                result = input.replace(/(\r\n|\n|\r)/gm, ' ');
                break;
            case 'striphtml':
                const parser = new DOMParser();
                const doc = parser.parseFromString(input, 'text/html');
                // Remove scripts and styles
                const scripts = doc.querySelectorAll('script, style');
                scripts.forEach(script => script.remove());
                result = doc.body.textContent || '';
                break;

            // Extract
            case 'emails':
                const emails = input.match(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/gi);
                result = emails ? emails.join('\n') : 'No se encontraron emails.';
                break;
            case 'urls':
                const urls = input.match(/(https?:\/\/[^\s]+)/g);
                result = urls ? urls.join('\n') : 'No se encontraron URLs.';
                break;
            case 'numbers':
                const numbers = input.match(/\d+/g);
                result = numbers ? numbers.join('\n') : 'No se encontraron números.';
                break;
        }
        setOutput(result);
    };

    return (
        <div className="min-h-screen bg-background text-foreground transition-colors duration-300 flex flex-col">
            <div className="relative">
                <Header title="Herramientas de Texto" showBack />
                <div className="absolute top-4 right-4 z-50">
                    <ShareButton />
                </div>
            </div>
            <div className="-mt-4 mb-4">
                <VisitCounter pageKey="text_tools" />
            </div>

            <main className="flex-1 max-w-7xl mx-auto w-full p-4 sm:p-6 lg:p-8 grid grid-cols-1 lg:grid-cols-2 gap-6 h-[calc(100vh-4rem)]">

                {/* Input Section */}
                <div className="flex flex-col gap-4 h-full overflow-hidden">
                    <div className="flex justify-between items-center shrink-0">
                        <label className="font-bold text-lg">Texto Original</label>
                        <button
                            onClick={() => { setInput(''); setOutput(''); }}
                            className="text-sm text-red-500 hover:text-red-600 font-medium flex items-center gap-1"
                        >
                            <Trash2 size={16} /> Limpiar
                        </button>
                    </div>
                    <textarea
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Escribe o pega tu texto aquí..."
                        className="flex-1 w-full p-4 rounded-xl border border-border bg-card font-mono text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none resize-none transition-all shadow-sm"
                    />
                    <div className="flex gap-4 text-xs text-muted-foreground font-mono shrink-0 bg-muted/30 p-2 rounded-lg border border-border/50">
                        <span>Caracteres: {stats.chars}</span>
                        <span>Palabras: {stats.words}</span>
                        <span>Líneas: {stats.lines}</span>
                    </div>
                </div>

                {/* Tools & Output Section */}
                <div className="flex flex-col gap-4 h-full overflow-hidden">

                    {/* Toolbar */}
                    <div className="bg-card rounded-xl border border-border p-4 shrink-0 shadow-sm space-y-4">

                        {/* Format Group */}
                        <div>
                            <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2 block">Formato</span>
                            <div className="flex flex-wrap gap-2">
                                <button onClick={() => processText('uppercase')} className="px-3 py-1.5 bg-muted hover:bg-primary/10 hover:text-primary rounded-lg text-sm font-medium transition-colors">MAYÚSCULAS</button>
                                <button onClick={() => processText('lowercase')} className="px-3 py-1.5 bg-muted hover:bg-primary/10 hover:text-primary rounded-lg text-sm font-medium transition-colors">minúsculas</button>
                                <button onClick={() => processText('titlecase')} className="px-3 py-1.5 bg-muted hover:bg-primary/10 hover:text-primary rounded-lg text-sm font-medium transition-colors">Título</button>
                                <button onClick={() => processText('capitalize')} className="px-3 py-1.5 bg-muted hover:bg-primary/10 hover:text-primary rounded-lg text-sm font-medium transition-colors">Oraciones</button>
                            </div>
                        </div>

                        <div className="h-px bg-border/50" />

                        {/* Clean Group */}
                        <div>
                            <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2 block flex items-center gap-1"><Scissors size={12} /> Limpieza</span>
                            <div className="flex flex-wrap gap-2">
                                <button onClick={() => processText('trim')} className="px-3 py-1.5 bg-muted hover:bg-primary/10 hover:text-primary rounded-lg text-sm font-medium transition-colors">Espacios Extra</button>
                                <button onClick={() => processText('nolinebreaks')} className="px-3 py-1.5 bg-muted hover:bg-primary/10 hover:text-primary rounded-lg text-sm font-medium transition-colors">Saltos de Línea</button>
                                <button onClick={() => processText('striphtml')} className="px-3 py-1.5 bg-muted hover:bg-primary/10 hover:text-primary rounded-lg text-sm font-medium transition-colors">Eliminar HTML</button>
                            </div>
                        </div>

                        <div className="h-px bg-border/50" />

                        {/* Extract Group */}
                        <div>
                            <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2 block flex items-center gap-1"><Wand2 size={12} /> Extraer</span>
                            <div className="flex flex-wrap gap-2">
                                <button onClick={() => processText('emails')} className="px-3 py-1.5 bg-muted hover:bg-primary/10 hover:text-primary rounded-lg text-sm font-medium transition-colors flex items-center gap-1"><Mail size={14} /> Emails</button>
                                <button onClick={() => processText('urls')} className="px-3 py-1.5 bg-muted hover:bg-primary/10 hover:text-primary rounded-lg text-sm font-medium transition-colors flex items-center gap-1"><LinkIcon size={14} /> URLs</button>
                                <button onClick={() => processText('numbers')} className="px-3 py-1.5 bg-muted hover:bg-primary/10 hover:text-primary rounded-lg text-sm font-medium transition-colors flex items-center gap-1"><Hash size={14} /> Números</button>
                            </div>
                        </div>

                    </div>

                    {/* Output Area */}
                    <div className="flex flex-col gap-2 flex-1 overflow-hidden">
                        <div className="flex justify-between items-center shrink-0">
                            <label className="font-bold text-lg">Resultado</label>
                            {output && (
                                <button
                                    onClick={handleCopy}
                                    className={`text-sm font-medium transition-colors flex items-center gap-1 ${copied ? 'text-green-500' : 'text-primary hover:text-primary/80'
                                        }`}
                                >
                                    <Copy size={16} /> {copied ? '¡Copiado!' : 'Copiar'}
                                </button>
                            )}
                        </div>
                        <textarea
                            readOnly
                            value={output}
                            placeholder="El resultado aparecerá aquí..."
                            className="flex-1 w-full p-4 rounded-xl border border-border bg-muted/30 font-mono text-sm focus:outline-none resize-none text-muted-foreground"
                        />
                    </div>

                </div>
            </main>
        </div>
    );
}
