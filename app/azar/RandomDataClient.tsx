'use client';

import { useState } from 'react';
import { Header } from '@/components/Header';
import { ShareButton } from '@/components/ShareButton';
import { VisitCounter } from '@/components/VisitCounter';
import { RefreshCw, Copy, Check, Dices, Hash, AlignLeft, Grid, Calculator } from 'lucide-react';

type Tab = 'numbers' | 'uuids' | 'sequences';

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

    // --- STATE: SEQUENCES ---
    const [seqStart, setSeqStart] = useState<string>('1');
    const [seqEnd, setSeqEnd] = useState<string>('100');
    const [seqStep, setSeqStep] = useState<string>('1');
    const [seqPadding, setSeqPadding] = useState<string>('');
    const [seqPrefix, setSeqPrefix] = useState<string>('');
    const [seqSuffix, setSeqSuffix] = useState<string>('');
    const [generatedSequence, setGeneratedSequence] = useState<string[]>([]);

    const [copied, setCopied] = useState(false);

    // --- LOGIC: NUMBERS ---
    const generateNumbers = () => {
        let qty = parseInt(quantity);
        if (isNaN(qty) || qty < 1) qty = 1;

        // Strict Limit
        if (qty > 1000) {
            alert('El límite seguro es de 1000 elementos.');
            qty = 1000;
            setQuantity('1000');
        }

        let result: number[] = [];

        if (numMode === 'range') {
            let minVal = parseInt(min);
            let maxVal = parseInt(max);

            if (isNaN(minVal) || isNaN(maxVal)) {
                alert('Ingresa valores numéricos válidos.');
                return;
            }

            // Swap if min > max
            if (minVal > maxVal) {
                const temp = minVal;
                minVal = maxVal;
                maxVal = temp;
                setMin(minVal.toString());
                setMax(maxVal.toString());
            }

            // Safety limits
            const SAFE_LIMIT = 1000000000;
            if (Math.abs(minVal) > SAFE_LIMIT || Math.abs(maxVal) > SAFE_LIMIT) {
                alert(`Los valores deben estar entre -${SAFE_LIMIT} y ${SAFE_LIMIT}.`);
                return;
            }

            const rangeSize = maxVal - minVal + 1;
            if (!allowDuplicates && qty > rangeSize) {
                alert(`No es posible generar ${qty} números únicos en un rango de ${rangeSize} (del ${minVal} al ${maxVal}).`);
                return;
            }

            if (!allowDuplicates) {
                const set = new Set<number>();
                let attempts = 0;
                // Safety break
                while (set.size < qty && attempts < qty * 50) {
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

        } else {
            // Length mode
            let len = parseInt(length);
            if (isNaN(len) || len < 1) len = 1;
            if (len > 15) {
                alert('Máximo 15 dígitos.');
                len = 15;
                setLength('15');
            }

            const minVal = Math.pow(10, len - 1);
            const maxVal = Math.pow(10, len) - 1;

            if (!allowDuplicates) {
                const set = new Set<number>();
                let attempts = 0;
                while (set.size < qty && attempts < qty * 50) {
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

    // --- LOGIC: SEQUENCES ---
    const generateSequence = () => {
        const start = parseInt(seqStart);
        const end = parseInt(seqEnd);
        const step = parseInt(seqStep);
        const padding = parseInt(seqPadding) || 0;

        if (isNaN(start) || isNaN(end) || isNaN(step)) {
            alert('Por favor, ingresa valores numéricos válidos.');
            return;
        }

        if (step <= 0) {
            alert('El paso debe ser mayor a 0.');
            return;
        }

        // Safety calculation
        // Avoid potential infinite loop logic issues by strictly checking math
        // If start < end, step must be positive (already checked > 0)
        // If start > end, we might want to allow negative steps? 
        // User request says: "Lista de números secuenciales (ej: 10, 15, 20...)". Usually implies ascending.
        // User requirements: "Paso (Step): (Cada cuánto salta, por defecto 1)".
        // User requirements validation: "Validación 1: Si paso es menor o igual a 0, mostrar error."
        // This implies the user expects an ascending sequence or handles direction via logic, but "step <= 0" error
        // implies we only support positive steps.
        // If start > end and step is positive, the loop won't run or we should error?
        // Let's assume standard for loop logic: for (let i = start; i <= end; i += step).
        // If start > end, this produces nothing. That is safe.
        // But let's check count just in case end is huge.

        if (start > end) {
            alert('El valor de Inicio debe ser menor o igual al valor de Fin.');
            return;
        }

        const count = Math.floor((end - start) / step) + 1;

        if (count > 10000) {
            alert('El límite de seguridad es de 10.000 líneas para no congelar el navegador.');
            return;
        }

        const res: string[] = [];
        for (let i = start; i <= end; i += step) {
            let valStr = i.toString();
            if (padding > 0) {
                valStr = valStr.padStart(padding, '0');
            }
            res.push(`${seqPrefix}${valStr}${seqSuffix}`);
        }
        setGeneratedSequence(res);
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
                        <button
                            onClick={() => setActiveTab('sequences')}
                            className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'sequences' ? 'bg-background shadow text-primary' : 'text-muted-foreground hover:text-foreground'
                                }`}
                        >
                            Secuencias
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
                                        min="1" max="1000"
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

                    {/* --- TAB: SEQUENCES --- */}
                    {activeTab === 'sequences' && (
                        <div className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <label className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Parámetros</label>
                                    <div className="flex gap-4">
                                        <div className="flex-1">
                                            <span className="text-xs text-muted-foreground">Inicio</span>
                                            <input type="number" value={seqStart} onChange={e => setSeqStart(e.target.value)} className="w-full bg-muted/50 border border-border rounded p-2 mt-1" />
                                        </div>
                                        <div className="flex-1">
                                            <span className="text-xs text-muted-foreground">Fin</span>
                                            <input type="number" value={seqEnd} onChange={e => setSeqEnd(e.target.value)} className="w-full bg-muted/50 border border-border rounded p-2 mt-1" />
                                        </div>
                                    </div>
                                    <div>
                                        <span className="text-xs text-muted-foreground">Paso (Step)</span>
                                        <input type="number" value={seqStep} onChange={e => setSeqStep(e.target.value)} className="w-full bg-muted/50 border border-border rounded p-2 mt-1" />
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <label className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Formato</label>
                                    <div>
                                        <span className="text-xs text-muted-foreground">Relleno (Ceros a la izquierda)</span>
                                        <input
                                            type="number"
                                            placeholder="Ej: 3 para 005"
                                            value={seqPadding}
                                            onChange={e => setSeqPadding(e.target.value)}
                                            className="w-full bg-muted/50 border border-border rounded p-2 mt-1"
                                        />
                                        <p className="text-[10px] text-muted-foreground mt-1">Dígitos totales. Si es 0 o vacío, no se aplica relleno.</p>
                                    </div>
                                    <div className="flex gap-4">
                                        <div className="flex-1">
                                            <span className="text-xs text-muted-foreground">Prefijo</span>
                                            <input
                                                type="text"
                                                placeholder="Ej: ID-"
                                                value={seqPrefix}
                                                onChange={e => setSeqPrefix(e.target.value)}
                                                className="w-full bg-muted/50 border border-border rounded p-2 mt-1"
                                            />
                                        </div>
                                        <div className="flex-1">
                                            <span className="text-xs text-muted-foreground">Sufijo</span>
                                            <input
                                                type="text"
                                                placeholder="Ej: -A"
                                                value={seqSuffix}
                                                onChange={e => setSeqSuffix(e.target.value)}
                                                className="w-full bg-muted/50 border border-border rounded p-2 mt-1"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <button onClick={generateSequence} className="w-full bg-primary text-primary-foreground font-bold py-3 rounded-xl hover:bg-primary/90 transition-colors flex items-center justify-center gap-2">
                                <AlignLeft size={20} /> Generar Secuencia
                            </button>

                            {generatedSequence.length > 0 && (
                                <div className="mt-6 animate-fade-in">
                                    <div className="flex justify-between items-center mb-2">
                                        <h3 className="font-bold">Resultados ({generatedSequence.length})</h3>
                                        <button onClick={() => copyResult(generatedSequence.join('\n'))} className="text-xs text-primary hover:underline flex items-center gap-1">
                                            {copied ? <Check size={14} /> : <Copy size={14} />} Copiar Todo
                                        </button>
                                    </div>
                                    <div className="bg-muted/30 p-4 rounded-xl border border-border font-mono text-sm overflow-y-auto max-h-80">
                                        {generatedSequence.map((item, i) => (
                                            <div key={i} className="border-b border-border/50 py-1 last:border-0">{item}</div>
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
