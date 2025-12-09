"use client";

import { useState } from 'react';
import Link from 'next/link';
import { ThemeSwitcher } from '@/components/ThemeSwitcher';
import { ShareButton } from '@/components/ShareButton';
import { VisitCounter } from '@/components/VisitCounter';

type Mode = 'format' | 'csv-to-json' | 'json-to-csv';
type Delimiter = ',' | ';' | '\t' | '|';

export default function JsonFormatterClient() {
    const [mode, setMode] = useState<Mode>('format');

    // Format JSON mode state
    const [input, setInput] = useState('{"id":1,"proyecto":"Caja Digital","estado":"Activo","metricas":{"visitas":1500,"tiempo_medio":"2m"},"tags":["dev","tools","nextjs"]}');
    const [output, setOutput] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [copied, setCopied] = useState(false);

    // CSV to JSON mode state
    const [csvInput, setCsvInput] = useState(`ID,Nombre,Rol,Ciudad
101,Marcelo,Arquitecto,Buenos Aires
102,Ana,Desarrolladora,Madrid
103,Carlos,Analista,Bogotá`);
    const [csvDelimiter, setCsvDelimiter] = useState<Delimiter>(',');
    const [csvHasHeaders, setCsvHasHeaders] = useState(true);
    const [csvOutput, setCsvOutput] = useState('');
    const [csvError, setCsvError] = useState<string | null>(null);

    // JSON to CSV mode state
    const [jsonInput, setJsonInput] = useState(`[
  {
    "Producto": "Laptop Gamer",
    "Precio": 1500,
    "Stock": true
  },
  {
    "Producto": "Mouse Inalámbrico",
    "Precio": 25,
    "Stock": false
  },
  {
    "Producto": "Monitor 4K",
    "Precio": 300,
    "Stock": true
  }
]`);
    const [csvOutputDelimiter, setCsvOutputDelimiter] = useState<Delimiter>(',');
    const [csvIncludeHeaders, setCsvIncludeHeaders] = useState(true);
    const [csvResult, setCsvResult] = useState('');
    const [jsonError, setJsonError] = useState<string | null>(null);

    // Format JSON functions
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

    // CSV to JSON functions
    const csvToJson = () => {
        try {
            if (!csvInput.trim()) {
                setCsvError('Por favor ingresa datos CSV.');
                return;
            }

            const lines = csvInput.trim().split(/\r?\n/);
            if (lines.length === 0) {
                setCsvError('El CSV está vacío.');
                return;
            }

            const delimiter = csvDelimiter === '\t' ? '\t' : csvDelimiter;
            let headers: string[] = [];
            let dataLines: string[] = [];

            if (csvHasHeaders && lines.length > 0) {
                headers = lines[0].split(delimiter).map(h => h.trim());
                dataLines = lines.slice(1);
            } else {
                // Generate numeric headers
                const firstLine = lines[0].split(delimiter);
                headers = firstLine.map((_, i) => `column_${i}`);
                dataLines = lines;
            }

            const result = dataLines.map(line => {
                const values = line.split(delimiter);
                const obj: Record<string, string> = {};
                headers.forEach((header, i) => {
                    obj[header] = values[i]?.trim() || '';
                });
                return obj;
            });

            setCsvOutput(JSON.stringify(result, null, 2));
            setCsvError(null);
        } catch (err) {
            setCsvError((err as Error).message);
            setCsvOutput('');
        }
    };

    const handleCsvCopy = () => {
        if (!csvOutput) return;
        navigator.clipboard.writeText(csvOutput);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleCsvDownload = () => {
        if (!csvOutput) return;
        const blob = new Blob([csvOutput], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'converted.json';
        a.click();
        URL.revokeObjectURL(url);
    };

    const handleCsvClear = () => {
        setCsvInput('');
        setCsvOutput('');
        setCsvError(null);
        setCopied(false);
    };

    // JSON to CSV functions
    const jsonToCsv = () => {
        try {
            if (!jsonInput.trim()) {
                setJsonError('Por favor ingresa un JSON.');
                return;
            }

            const parsed = JSON.parse(jsonInput);

            if (!Array.isArray(parsed)) {
                setJsonError('El JSON debe ser un array de objetos.');
                return;
            }

            if (parsed.length === 0) {
                setJsonError('El array está vacío.');
                return;
            }

            const delimiter = csvOutputDelimiter === '\t' ? '\t' : csvOutputDelimiter;
            const headers = Object.keys(parsed[0]);

            let csv = '';

            if (csvIncludeHeaders) {
                csv = headers.join(delimiter) + '\n';
            }

            parsed.forEach(obj => {
                const row = headers.map(header => {
                    const value = obj[header];
                    // Handle values with commas or quotes
                    if (typeof value === 'string' && (value.includes(delimiter) || value.includes('"'))) {
                        return `"${value.replace(/"/g, '""')}"`;
                    }
                    return value ?? '';
                });
                csv += row.join(delimiter) + '\n';
            });

            setCsvResult(csv);
            setJsonError(null);
        } catch (err) {
            setJsonError((err as Error).message);
            setCsvResult('');
        }
    };

    const handleJsonCopy = () => {
        if (!csvResult) return;
        navigator.clipboard.writeText(csvResult);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleJsonDownload = () => {
        if (!csvResult) return;
        const blob = new Blob([csvResult], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'converted.csv';
        a.click();
        URL.revokeObjectURL(url);
    };

    const handleJsonClear = () => {
        setJsonInput('');
        setCsvResult('');
        setJsonError(null);
        setCopied(false);
    };

    return (
        <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
            {/* Header */}
            <header className="border-b border-border bg-card">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/" className="text-muted-foreground hover:text-primary transition-colors">
                            &larr; Volver
                        </Link>
                        <div>
                            <h1 className="text-xl font-bold">Transformador de Datos</h1>
                            <p className="text-xs text-muted-foreground">Valida, formatea y convierte estructuras de datos entre JSON y CSV.</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <ShareButton />
                        <ThemeSwitcher />
                    </div>
                </div>
                <div className="flex justify-center pb-2">
                    <VisitCounter pageKey="json_formatter" />
                </div>
            </header>

            {/* Tabs */}
            <div className="border-b border-border bg-muted/30">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex">
                        <button
                            onClick={() => setMode('format')}
                            className={`px-6 py-4 text-sm font-semibold transition-all ${mode === 'format'
                                ? 'bg-card text-primary border-b-2 border-primary'
                                : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                                }`}
                        >
                            📝 Formatear JSON
                        </button>
                        <button
                            onClick={() => setMode('csv-to-json')}
                            className={`px-6 py-4 text-sm font-semibold transition-all ${mode === 'csv-to-json'
                                ? 'bg-card text-primary border-b-2 border-primary'
                                : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                                }`}
                        >
                            📊 CSV → JSON
                        </button>
                        <button
                            onClick={() => setMode('json-to-csv')}
                            className={`px-6 py-4 text-sm font-semibold transition-all ${mode === 'json-to-csv'
                                ? 'bg-card text-primary border-b-2 border-primary'
                                : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                                }`}
                        >
                            📄 JSON → CSV
                        </button>
                    </div>
                </div>
            </div>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Format JSON Mode */}
                {mode === 'format' && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[calc(100vh-16rem)]">
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
                                placeholder={'{"ejemplo":"Pega tu JSON sucio aquí","estado":"desordenado","numeros":[1,2,3]}'}
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
                )}

                {/* CSV to JSON Mode */}
                {mode === 'csv-to-json' && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[calc(100vh-16rem)]">
                        {/* Input Section */}
                        <div className="flex flex-col gap-4">
                            <div className="flex justify-between items-center">
                                <label className="font-medium text-muted-foreground">Entrada CSV</label>
                                <button
                                    onClick={handleCsvClear}
                                    className="text-sm text-red-500 hover:text-red-600 font-medium transition-colors"
                                >
                                    Limpiar todo
                                </button>
                            </div>

                            {/* Options */}
                            <div className="bg-muted/30 p-4 rounded-xl border border-border/50 space-y-3">
                                <div className="flex items-center gap-4">
                                    <label className="text-sm font-medium">Delimitador:</label>
                                    <select
                                        value={csvDelimiter}
                                        onChange={(e) => setCsvDelimiter(e.target.value as Delimiter)}
                                        className="px-3 py-1.5 rounded-lg border border-border bg-card text-sm focus:ring-2 focus:ring-primary outline-none"
                                    >
                                        <option value=",">Coma (,)</option>
                                        <option value=";">Punto y coma (;)</option>
                                        <option value="\t">Tabulación (Tab)</option>
                                        <option value="|">Pipe (|)</option>
                                    </select>
                                </div>
                                <label className="flex items-center gap-2 text-sm cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={csvHasHeaders}
                                        onChange={(e) => setCsvHasHeaders(e.target.checked)}
                                        className="w-4 h-4 rounded border-border text-primary focus:ring-2 focus:ring-primary"
                                    />
                                    Primera fila como encabezados
                                </label>
                            </div>

                            <textarea
                                value={csvInput}
                                onChange={(e) => setCsvInput(e.target.value)}
                                placeholder="Nombre,Edad,Ciudad&#10;Marcelo,45,Buenos Aires&#10;Juan,30,Madrid&#10;Ana,28,Bogotá"
                                className="flex-1 w-full p-4 rounded-xl border border-border bg-card font-mono text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none resize-none transition-all shadow-sm"
                                spellCheck={false}
                            />

                            <button
                                onClick={csvToJson}
                                className="w-full bg-primary text-primary-foreground hover:bg-primary/90 py-2.5 px-4 rounded-lg font-medium transition-all shadow-sm active:scale-95"
                            >
                                Convertir a JSON
                            </button>
                        </div>

                        {/* Output Section */}
                        <div className="flex flex-col gap-4">
                            <div className="flex justify-between items-center">
                                <span className="font-medium text-muted-foreground">Resultado JSON</span>
                                <div className="flex gap-2">
                                    {csvOutput && (
                                        <>
                                            <button
                                                onClick={handleCsvCopy}
                                                className={`text-sm font-medium transition-colors ${copied ? 'text-green-500' : 'text-primary hover:text-primary/80'
                                                    }`}
                                            >
                                                {copied ? '¡Copiado!' : 'Copiar'}
                                            </button>
                                            <button
                                                onClick={handleCsvDownload}
                                                className="text-sm font-medium text-primary hover:text-primary/80 transition-colors"
                                            >
                                                Descargar JSON
                                            </button>
                                        </>
                                    )}
                                </div>
                            </div>

                            <div className="relative flex-1">
                                {csvError ? (
                                    <div className="absolute inset-0 p-4 rounded-xl border border-red-200 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 font-mono text-sm overflow-auto">
                                        <p className="font-bold mb-2">Error:</p>
                                        {csvError}
                                    </div>
                                ) : (
                                    <textarea
                                        readOnly
                                        value={csvOutput}
                                        placeholder="El JSON convertido aparecerá aquí..."
                                        className="w-full h-full p-4 rounded-xl border border-border bg-muted/50 font-mono text-sm focus:outline-none resize-none text-muted-foreground"
                                    />
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* JSON to CSV Mode */}
                {mode === 'json-to-csv' && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[calc(100vh-16rem)]">
                        {/* Input Section */}
                        <div className="flex flex-col gap-4">
                            <div className="flex justify-between items-center">
                                <label className="font-medium text-muted-foreground">Entrada JSON</label>
                                <button
                                    onClick={handleJsonClear}
                                    className="text-sm text-red-500 hover:text-red-600 font-medium transition-colors"
                                >
                                    Limpiar todo
                                </button>
                            </div>

                            {/* Options */}
                            <div className="bg-muted/30 p-4 rounded-xl border border-border/50 space-y-3">
                                <div className="flex items-center gap-4">
                                    <label className="text-sm font-medium">Delimitador:</label>
                                    <select
                                        value={csvOutputDelimiter}
                                        onChange={(e) => setCsvOutputDelimiter(e.target.value as Delimiter)}
                                        className="px-3 py-1.5 rounded-lg border border-border bg-card text-sm focus:ring-2 focus:ring-primary outline-none"
                                    >
                                        <option value=",">Coma (,)</option>
                                        <option value=";">Punto y coma (;)</option>
                                        <option value="\t">Tabulación (Tab)</option>
                                        <option value="|">Pipe (|)</option>
                                    </select>
                                </div>
                                <label className="flex items-center gap-2 text-sm cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={csvIncludeHeaders}
                                        onChange={(e) => setCsvIncludeHeaders(e.target.checked)}
                                        className="w-4 h-4 rounded border-border text-primary focus:ring-2 focus:ring-primary"
                                    />
                                    Incluir encabezados
                                </label>
                            </div>

                            <textarea
                                value={jsonInput}
                                onChange={(e) => setJsonInput(e.target.value)}
                                placeholder={'[\n  {\n    "Producto": "Laptop",\n    "Precio": 1500,\n    "Stock": true\n  },\n  {\n    "Producto": "Mouse",\n    "Precio": 20,\n    "Stock": false\n  }\n]'}
                                className="flex-1 w-full p-4 rounded-xl border border-border bg-card font-mono text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none resize-none transition-all shadow-sm"
                                spellCheck={false}
                            />

                            <button
                                onClick={jsonToCsv}
                                className="w-full bg-primary text-primary-foreground hover:bg-primary/90 py-2.5 px-4 rounded-lg font-medium transition-all shadow-sm active:scale-95"
                            >
                                Convertir a CSV
                            </button>
                        </div>

                        {/* Output Section */}
                        <div className="flex flex-col gap-4">
                            <div className="flex justify-between items-center">
                                <span className="font-medium text-muted-foreground">Resultado CSV</span>
                                <div className="flex gap-2">
                                    {csvResult && (
                                        <>
                                            <button
                                                onClick={handleJsonCopy}
                                                className={`text-sm font-medium transition-colors ${copied ? 'text-green-500' : 'text-primary hover:text-primary/80'
                                                    }`}
                                            >
                                                {copied ? '¡Copiado!' : 'Copiar'}
                                            </button>
                                            <button
                                                onClick={handleJsonDownload}
                                                className="text-sm font-medium text-primary hover:text-primary/80 transition-colors"
                                            >
                                                Descargar CSV
                                            </button>
                                        </>
                                    )}
                                </div>
                            </div>

                            <div className="relative flex-1">
                                {jsonError ? (
                                    <div className="absolute inset-0 p-4 rounded-xl border border-red-200 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 font-mono text-sm overflow-auto">
                                        <p className="font-bold mb-2">Error:</p>
                                        {jsonError}
                                    </div>
                                ) : (
                                    <textarea
                                        readOnly
                                        value={csvResult}
                                        placeholder="El CSV convertido aparecerá aquí..."
                                        className="w-full h-full p-4 rounded-xl border border-border bg-muted/50 font-mono text-sm focus:outline-none resize-none text-muted-foreground"
                                    />
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}
