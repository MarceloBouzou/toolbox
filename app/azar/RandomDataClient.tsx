'use client';

import { useState } from 'react';
import { Header } from '@/components/Header';
import { ShareButton } from '@/components/ShareButton';
import { VisitCounter } from '@/components/VisitCounter';
import { RefreshCw, Copy, Check, Dices, Hash, AlignLeft, Grid, Calculator } from 'lucide-react';

type Tab = 'numbers' | 'uuids';

export default function RandomDataClient() {
    const [activeTab, setActiveTab] = useState<Tab>('numbers');

    // --- STATE: NUMBERS ---
    const [numMode, setNumMode] = useState<'range' | 'length'>('range');
    const [min, setMin] = useState<string>('1');
    const [max, setMax] = useState<string>('100');
    const [length, setLength] = useState<string>('6');
    const [quantity, setQuantity] = useState<string>('1');
    const [allowDuplicates, setAllowDuplicates] = useState(false);
    const [sort, setSort] = useState<'none' | 'asc' | 'desc'>('none');
    const [generatedNumbers, setGeneratedNumbers] = useState<string[]>([]);

    // --- STATE: UUIDS ---
    const [uuidQty, setUuidQty] = useState<string>('5');
    const [uuidUppercase, setUuidUppercase] = useState(false);
    const [generatedUuids, setGeneratedUuids] = useState<string[]>([]);

    const [copied, setCopied] = useState(false);

    // --- LOGIC: NUMBERS ---
    const generateNumbers = () => {
        let qty = parseInt(quantity);
        if (isNaN(qty) || qty < 1) {
            alert('La cantidad mínima es 1.');
            return;
        }
        if (qty > 10000) {
            alert('Por seguridad, el máximo de números a generar es 10,000.');
            qty = 10000;
            setQuantity('10000');
        }

        let result: number[] = [];

        if (numMode === 'range') {
            let minVal = parseInt(min);
            let maxVal = parseInt(max);

            if (isNaN(minVal) || isNaN(maxVal)) {
                alert('Ingresa valores numéricos válidos.');
                return;
            }

            // Safety limits for values
            const SAFE_LIMIT = 1000000000; // 1 Billion
            if (Math.abs(minVal) > SAFE_LIMIT || Math.abs(maxVal) > SAFE_LIMIT) {
                alert(`Los valores no pueden exceder +/- ${SAFE_LIMIT}.`);
                return;
            }

            if (minVal >= maxVal) {
                alert('El mínimo debe ser menor que el máximo.');
                return;
            }

            const rangeSize = maxVal - minVal + 1;
            if (!allowDuplicates && qty > rangeSize) {
                alert(`No se pueden generar ${qty} números únicos en un rango de ${rangeSize}. El máximo posible es ${rangeSize}.`);
                return;
            }

            if (!allowDuplicates) {
                // If the range is small enough relative to qty, use Set
                // If range is huge but qty is small, Set is fine.
                // If range is huge and qty is huge, Set is fine (max 10k).
                const set = new Set<number>();
                // Panic button equivalent logic: 
                // If we fail to find unique numbers after too many tries, stop.
                let attempts = 0;
                const maxAttempts = qty * 10;

                while (set.size < qty && attempts < maxAttempts) {
                    const rnd = Math.floor(Math.random() * (maxVal - minVal + 1)) + minVal;
                    set.add(rnd);
                    attempts++;
                }

                if (set.size < qty) {
                    alert('No se pudieron encontrar suficientes números únicos en intentos razonables.');
                }

                result = Array.from(set);
            } else {
                for (let i = 0; i < qty; i++) {
                    result.push(Math.floor(Math.random() * (maxVal - minVal + 1)) + minVal);
                }
            }

        } else {
            // Length mode
            let len = parseInt(length);
            if (isNaN(len) || len < 1) {
                alert('La longitud mínima es 1 dígito.');
                return;
            }
            if (len > 15) {
                alert('El máximo de largo es 15 dígitos (para mantener precisión segura).');
                len = 15;
                setLength('15');
            }

            const minVal = Math.pow(10, len - 1);
            const maxVal = Math.pow(10, len) - 1;

            if (!allowDuplicates) {
                const set = new Set<number>();
                let attempts = 0;
                const maxAttempts = qty * 10;

                while (set.size < qty && attempts < maxAttempts) {
                    const rnd = Math.floor(Math.random() * (maxVal - minVal + 1)) + minVal;
                    set.add(rnd);
                    attempts++;
                }
                result = Array.from(set);
            } else {
                for (let i = 0; i < qty; i++) {
                    result.push(Math.floor(Math.random() * (maxVal - minVal + 1)) + minVal);
                }
            }
        }

        // Sort
        if (sort === 'asc') result.sort((a, b) => a - b);
        if (sort === 'desc') result.sort((a, b) => b - a);

        setGeneratedNumbers(result.map(n => n.toString()));
    };

    // --- LOGIC: UUIDS ---
    const generateUuids = () => {
        let qty = parseInt(uuidQty);
        if (isNaN(qty) || qty < 1) qty = 1;
        if (qty > 1000) { // Limit to 1000 UUIDs
            alert('El máximo de UUIDs es 1000.');
            qty = 1000;
            setUuidQty('1000');
        }

        const res: string[] = [];

        for (let i = 0; i < qty; i++) {
            let uuid = crypto.randomUUID();
            if (uuidUppercase) uuid = uuid.toUpperCase();
            res.push(uuid);
        }
        setGeneratedUuids(res);
    };

    // --- UTILS ---
    const copyResult = (text: string) => {
        navigator.clipboard.writeText(text).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    };

    return (
        <div className="min-h-screen bg-background text-foreground transition-colors duration-300 flex flex-col">
            <Header title="Generador de Azar" showBack>
                <div className="mr-4">
                    <ShareButton />
                </div>
            </Header>
            <div className="flex justify-center pb-2 bg-background border-b border-border/50">
                <VisitCounter pageKey="random_data" />
            </div>

            <main className="flex-1 max-w-4xl mx-auto w-full p-4 sm:p-6 lg:p-8 flex flex-col gap-8">

                {/* Intro */}
                <div className="text-center space-y-2 animate-fade-in">
                    <h2 className="text-2xl font-bold flex items-center justify-center gap-2">
                        <Dices className="text-primary" /> Datos Aleatorios
                    </h2>
                    <p className="text-muted-foreground text-sm max-w-md mx-auto">
                        Genera secuencias de números, sorteos o identificadores únicos (UUID/GUID) para tus pruebas.
                    </p>
                </div>

                {/* Tabs */}
                <div className="flex justify-center mb-6 animate-fade-in delay-100">
                    <div className="bg-muted p-1 rounded-xl inline-flex">
                        <button
                            onClick={() => setActiveTab('numbers')}
                            className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'numbers' ? 'bg-background shadow text-primary' : 'text-muted-foreground hover:text-foreground'
                                }`}
                        >
                            Números
                        </button>
                        <button
                            onClick={() => setActiveTab('uuids')}
                            className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'uuids' ? 'bg-background shadow text-primary' : 'text-muted-foreground hover:text-foreground'
                                }`}
                        >
                            UUIDs / GUIDs
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="bg-card border border-border rounded-2xl shadow-sm p-6 animate-fade-in-up">

                    {/* --- TAB: NUMBERS --- */}
                    {activeTab === 'numbers' && (
                        <div className="space-y-6">
                            {/* Controls */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <label className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Modo</label>
                                    <div className="flex gap-4">
                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <input type="radio" checked={numMode === 'range'} onChange={() => setNumMode('range')} className="accent-primary" />
                                            <span>Por Rango</span>
                                        </label>
                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <input type="radio" checked={numMode === 'length'} onChange={() => setNumMode('length')} className="accent-primary" />
                                            <span>Por Longitud</span>
                                        </label>
                                    </div>

                                    {numMode === 'range' ? (
                                        <div className="flex gap-4">
                                            <div className="flex-1">
                                                <span className="text-xs text-muted-foreground">Mínimo</span>
                                                <input type="number" value={min} onChange={e => setMin(e.target.value)} className="w-full bg-muted/50 border border-border rounded p-2 mt-1" />
                                            </div>
                                            <div className="flex-1">
                                                <span className="text-xs text-muted-foreground">Máximo</span>
                                                <input type="number" value={max} onChange={e => setMax(e.target.value)} className="w-full bg-muted/50 border border-border rounded p-2 mt-1" />
                                            </div>
                                        </div>
                                    ) : (
                                        <div>
                                            <span className="text-xs text-muted-foreground">Dígitos</span>
                                            <input type="number" value={length} onChange={e => setLength(e.target.value)} className="w-full bg-muted/50 border border-border rounded p-2 mt-1" />
                                        </div>
                                    )}
                                </div>

                                <div className="space-y-4">
                                    <label className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Opciones</label>
                                    <div>
                                        <span className="text-xs text-muted-foreground">Cantidad</span>
                                        <input type="number" value={quantity} onChange={e => setQuantity(e.target.value)} className="w-full bg-muted/50 border border-border rounded p-2 mt-1" />
                                    </div>
                                    <div className="flex flex-col gap-2 mt-2">
                                        <label className="flex items-center gap-2 cursor-pointer text-sm">
                                            <input type="checkbox" checked={allowDuplicates} onChange={e => setAllowDuplicates(e.target.checked)} className="accent-primary" />
                                            Permitir duplicados
                                        </label>
                                        <label className="flex items-center gap-2 cursor-pointer text-sm">
                                            <input type="checkbox" checked={sort !== 'none'} onChange={e => setSort(e.target.checked ? 'asc' : 'none')} className="accent-primary" />
                                            Ordenar resultados
                                        </label>
                                        {sort !== 'none' && (
                                            <div className="flex gap-2 ml-6">
                                                <button onClick={() => setSort('asc')} className={`text-xs px-2 py-1 rounded ${sort === 'asc' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>Asc</button>
                                                <button onClick={() => setSort('desc')} className={`text-xs px-2 py-1 rounded ${sort === 'desc' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>Desc</button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <button onClick={generateNumbers} className="w-full bg-primary text-primary-foreground font-bold py-3 rounded-xl hover:bg-primary/90 transition-colors flex items-center justify-center gap-2">
                                <RefreshCw size={20} /> Generar Números
                            </button>

                            {/* Results */}
                            {generatedNumbers.length > 0 && (
                                <div className="mt-6 animate-fade-in">
                                    <div className="flex justify-between items-center mb-2">
                                        <h3 className="font-bold">Resultados ({generatedNumbers.length})</h3>
                                        <button onClick={() => copyResult(generatedNumbers.join(', '))} className="text-xs text-primary hover:underline flex items-center gap-1">
                                            {copied ? <Check size={14} /> : <Copy size={14} />} Copiar Todo
                                        </button>
                                    </div>
                                    <div className="bg-muted/30 p-4 rounded-xl border border-border font-mono text-lg break-all max-h-60 overflow-y-auto">
                                        {generatedNumbers.join(', ')}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* --- TAB: UUIDS --- */}
                    {activeTab === 'uuids' && (
                        <div className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <span className="text-xs text-muted-foreground">Cantidad (Máx 100)</span>
                                    <input
                                        type="number"
                                        value={uuidQty}
                                        min="1" max="100"
                                        onChange={e => setUuidQty(e.target.value)}
                                        className="w-full bg-muted/50 border border-border rounded p-2 mt-1"
                                    />
                                </div>
                                <div className="flex items-center h-full pt-4">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input type="checkbox" checked={uuidUppercase} onChange={e => setUuidUppercase(e.target.checked)} className="accent-primary" />
                                        <span>Mayúsculas</span>
                                    </label>
                                </div>
                            </div>

                            <button onClick={generateUuids} className="w-full bg-primary text-primary-foreground font-bold py-3 rounded-xl hover:bg-primary/90 transition-colors flex items-center justify-center gap-2">
                                <Hash size={20} /> Generar UUIDs
                            </button>

                            {generatedUuids.length > 0 && (
                                <div className="mt-6 animate-fade-in">
                                    <div className="flex justify-between items-center mb-2">
                                        <h3 className="font-bold">Resultados</h3>
                                        <button onClick={() => copyResult(generatedUuids.join('\n'))} className="text-xs text-primary hover:underline flex items-center gap-1">
                                            {copied ? <Check size={14} /> : <Copy size={14} />} Copiar Todo
                                        </button>
                                    </div>
                                    <div className="bg-muted/30 p-4 rounded-xl border border-border font-mono text-sm overflow-y-auto max-h-80">
                                        {generatedUuids.map((u, i) => (
                                            <div key={i} className="border-b border-border/50 py-1 last:border-0">{u}</div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                </div>
            </main>
        </div>
    );
}
