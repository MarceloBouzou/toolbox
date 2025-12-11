"use client";

import { useState } from 'react';
import * as XLSX from 'xlsx';
import Link from 'next/link';
import { ThemeSwitcher } from '@/components/ThemeSwitcher';
import { ShareButton } from '@/components/ShareButton';
import { VisitCounter } from '@/components/VisitCounter';
import { PrivacyBadge } from '@/components/PrivacyBadge';

type ConsolidationMode = 'multiple-files' | 'multiple-sheets';

export default function ConsolidarExcelClient() {
    const [mode, setMode] = useState<ConsolidationMode>('multiple-files');

    // Estado para modo "Múltiples Archivos"
    const [files, setFiles] = useState<File[]>([]);
    const [isProcessing, setIsProcessing] = useState(false);
    const [status, setStatus] = useState('');

    // Estado para modo "Múltiples Hojas"
    const [singleFile, setSingleFile] = useState<File | null>(null);
    const [isProcessingSheets, setIsProcessingSheets] = useState(false);
    const [statusSheets, setStatusSheets] = useState('');

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            setFiles(Array.from(event.target.files));
            setStatus('');
        }
    };

    const handleSingleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            setSingleFile(event.target.files[0]);
            setStatusSheets('');
        }
    };

    const handleConsolidate = async () => {
        if (files.length === 0) return;
        setIsProcessing(true);
        setStatus('Iniciando motor de procesamiento...');

        try {
            const allData: any[] = [];

            for (const file of files) {
                // Safety: Limit file size to 25MB to prevent browser crash
                const MAX_SIZE = 25 * 1024 * 1024;
                if (file.size > MAX_SIZE) {
                    const confirmLoad = confirm(`El archivo "${file.name}" pesa más de 25MB (${(file.size / 1024 / 1024).toFixed(1)}MB). Procesarlo podría congelar el navegador. ¿Deseas continuar bajo tu propio riesgo?`);
                    if (!confirmLoad) {
                        setStatus(`Saltado: ${file.name} (Muy pesado)`);
                        continue;
                    }
                }

                setStatus(`Leyendo: ${file.name}...`);
                const data = await file.arrayBuffer();
                const workbook = XLSX.read(data);

                workbook.SheetNames.forEach((sheetName) => {
                    const worksheet = workbook.Sheets[sheetName];
                    const jsonData = XLSX.utils.sheet_to_json(worksheet, { defval: "" });

                    const rowsWithSource = jsonData.map((row: any) => ({
                        ...row,
                        Fuente_Archivo: file.name,
                        Fuente_Hoja: sheetName
                    }));
                    allData.push(...rowsWithSource);
                });
            }

            setStatus('Unificando datos y generando Excel...');

            if (allData.length === 0) {
                alert('No se pudieron extraer datos de los archivos seleccionados.');
                setIsProcessing(false);
                return;
            }

            const newWorksheet = XLSX.utils.json_to_sheet(allData);
            const newWorkbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(newWorkbook, newWorksheet, "Consolidado");
            XLSX.writeFile(newWorkbook, "Consolidado_Master.xlsx");

            setStatus('¡Éxito! Tu archivo se ha descargado.');

        } catch (error) {
            console.error(error);
            setStatus('Error crítico: Revisa el formato de tus archivos.');
        } finally {
            setIsProcessing(false);
        }
    };

    const handleConsolidateSheets = async () => {
        if (!singleFile) return;
        setIsProcessingSheets(true);
        setStatusSheets('Leyendo archivo y sus hojas...');

        try {
            // Safety: Limit file size to 25MB
            const MAX_SIZE = 25 * 1024 * 1024;
            if (singleFile.size > MAX_SIZE) {
                const confirmLoad = confirm(`El archivo pesa ${(singleFile.size / 1024 / 1024).toFixed(1)}MB. Procesarlo podría congelar el navegador. ¿Continuar?`);
                if (!confirmLoad) {
                    setIsProcessingSheets(false);
                    setStatusSheets('');
                    return;
                }
            }

            const data = await singleFile.arrayBuffer();
            const workbook = XLSX.read(data);
            const allData: any[] = [];

            if (workbook.SheetNames.length === 0) {
                alert('El archivo no contiene hojas.');
                setIsProcessingSheets(false);
                return;
            }

            setStatusSheets(`Procesando ${workbook.SheetNames.length} hoja(s)...`);

            workbook.SheetNames.forEach((sheetName) => {
                const worksheet = workbook.Sheets[sheetName];
                const jsonData = XLSX.utils.sheet_to_json(worksheet, { defval: "" });

                const rowsWithSource = jsonData.map((row: any) => ({
                    ...row,
                    Fuente_Hoja: sheetName
                }));
                allData.push(...rowsWithSource);
            });

            setStatusSheets('Generando Excel consolidado...');

            if (allData.length === 0) {
                alert('Las hojas parecen estar vacías.');
                setIsProcessingSheets(false);
                return;
            }

            const newWorksheet = XLSX.utils.json_to_sheet(allData);
            const newWorkbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(newWorkbook, newWorksheet, "Hojas_Consolidadas");

            const fileName = singleFile.name.replace(/\.(xlsx|xls)$/i, '_Consolidado.xlsx');
            XLSX.writeFile(newWorkbook, fileName);

            setStatusSheets('¡Éxito! Tu archivo se ha descargado.');

        } catch (error) {
            console.error(error);
            setStatusSheets('Error crítico: Revisa el formato del archivo.');
        } finally {
            setIsProcessingSheets(false);
        }
    };

    return (
        <div className="min-h-screen bg-background transition-colors duration-300 py-12">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Header Navigation */}
                <div className="flex justify-between items-center mb-6">
                    <Link href="/" className="text-muted-foreground hover:text-primary flex items-center text-sm font-medium transition-colors">
                        &larr; Volver al inicio
                    </Link>
                    <div className="flex items-center gap-2">
                        <ShareButton />
                        <ThemeSwitcher />
                    </div>
                </div>
                <div className="mb-4">
                    <VisitCounter pageKey="excel_consolidator" />
                </div>

                <div className="bg-card rounded-2xl shadow-xl overflow-hidden border border-border">

                    {/* Header de la Herramienta */}
                    <div className="bg-primary px-8 py-10 text-center text-primary-foreground">
                        <h1 className="text-3xl font-bold">Unificador de Excel</h1>
                        <p className="mt-2 text-primary-foreground/90 text-lg">
                            Unifica múltiples archivos o múltiples hojas en una sola tabla maestra.
                        </p>
                    </div>

                    {/* Tabs */}
                    <div className="border-b border-border bg-muted/30">
                        <div className="flex">
                            <button
                                onClick={() => setMode('multiple-files')}
                                className={`flex-1 px-6 py-4 text-sm font-semibold transition-all ${mode === 'multiple-files'
                                    ? 'bg-card text-primary border-b-2 border-primary'
                                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                                    }`}
                            >
                                Unir varios Archivos
                            </button>
                            <button
                                onClick={() => setMode('multiple-sheets')}
                                className={`flex-1 px-6 py-4 text-sm font-semibold transition-all ${mode === 'multiple-sheets'
                                    ? 'bg-card text-primary border-b-2 border-primary'
                                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                                    }`}
                            >
                                Unir Pestañas (Hojas)
                            </button>
                        </div>
                    </div>

                    <div className="p-8">
                        {/* Modo: Múltiples Archivos */}
                        {mode === 'multiple-files' && (
                            <>
                                <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg">
                                    <p className="text-sm text-blue-900 dark:text-blue-100">
                                        <strong>Modo:</strong> Ideal para juntar reportes sueltos (ej: Enero.xlsx, Febrero.xlsx) en un solo listado. La herramienta creará una tabla única con toda la información. Además, etiquetamos cada fila con el nombre del archivo original para que sepas de dónde vino cada dato.
                                    </p>
                                </div>

                                <div className="mb-8">
                                    <label htmlFor="dropzone-file" className="group flex flex-col items-center justify-center w-full h-48 border-2 border-border border-dashed rounded-xl cursor-pointer bg-muted/50 hover:bg-muted hover:border-primary transition-all duration-200">
                                        <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center">
                                            <svg className="w-12 h-12 mb-4 text-muted-foreground group-hover:text-primary transition-colors" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2" />
                                            </svg>
                                            <p className="mb-2 text-lg text-foreground font-medium">Haz clic o arrastra tus archivos aquí</p>
                                            <p className="text-sm text-muted-foreground">Soporta archivos .xlsx y .xls</p>
                                            <div className="flex justify-center mt-4">
                                                <PrivacyBadge />
                                            </div>
                                        </div>
                                        <input id="dropzone-file" type="file" className="hidden" multiple accept=".xlsx, .xls" onChange={handleFileChange} />
                                    </label>
                                </div>

                                {files.length > 0 && (
                                    <div className="mb-8 bg-muted rounded-lg p-4 border border-border">
                                        <h3 className="text-sm font-bold text-foreground uppercase tracking-wide mb-3">
                                            Archivos seleccionados ({files.length})
                                        </h3>
                                        <ul className="space-y-2 max-h-40 overflow-y-auto pr-2">
                                            {files.map((file, index) => (
                                                <li key={index} className="flex items-center text-sm text-foreground bg-card p-2 rounded border border-border shadow-sm">
                                                    <span className="mr-2 text-green-500">✓</span> {file.name}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                <div className="flex flex-col items-center">
                                    {status && (
                                        <div className={`mb-4 px-4 py-2 rounded-full text-sm font-medium ${status.includes('Error') ? 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-100' :
                                            status.includes('Éxito') ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-100' : 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-100'
                                            }`}>
                                            {status}
                                        </div>
                                    )}

                                    <button
                                        onClick={handleConsolidate}
                                        disabled={files.length === 0 || isProcessing}
                                        className="w-full sm:w-auto px-10 py-4 bg-primary text-primary-foreground font-bold rounded-xl shadow-lg shadow-primary/30
                               hover:bg-primary/90 hover:shadow-xl hover:-translate-y-0.5
                               disabled:bg-muted disabled:text-muted-foreground disabled:shadow-none disabled:cursor-not-allowed disabled:translate-y-0
                               transition-all duration-200 text-lg"
                                    >
                                        {isProcessing ? (
                                            <span className="flex items-center">
                                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                Procesando...
                                            </span>
                                        ) : (
                                            'Consolidar Archivos'
                                        )}
                                    </button>
                                </div>
                            </>
                        )}

                        {/* Modo: Múltiples Hojas */}
                        {mode === 'multiple-sheets' && (
                            <>
                                <div className="mb-6 p-4 bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800 rounded-lg">
                                    <p className="text-sm text-purple-900 dark:text-purple-100">
                                        <strong>Modo:</strong> ¿Tienes un archivo con muchas pestañas? Esta opción toma todas las hojas de tu libro de Excel y las apila una debajo de otra en una única hoja maestra. Perfecto para consolidar datos que vienen separados por categorías o fechas.
                                    </p>
                                </div>

                                <div className="mb-8">
                                    <label htmlFor="single-file" className="group flex flex-col items-center justify-center w-full h-48 border-2 border-border border-dashed rounded-xl cursor-pointer bg-muted/50 hover:bg-muted hover:border-primary transition-all duration-200">
                                        <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center">
                                            <svg className="w-12 h-12 mb-4 text-muted-foreground group-hover:text-primary transition-colors" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2" />
                                            </svg>
                                            <p className="mb-2 text-lg text-foreground font-medium">Haz clic o arrastra un archivo aquí</p>
                                            <p className="text-sm text-muted-foreground">Soporta archivos .xlsx y .xls</p>
                                            <div className="flex justify-center mt-4">
                                                <PrivacyBadge />
                                            </div>
                                        </div>
                                        <input id="single-file" type="file" className="hidden" accept=".xlsx, .xls" onChange={handleSingleFileChange} />
                                    </label>
                                </div>

                                {singleFile && (
                                    <div className="mb-8 bg-muted rounded-lg p-4 border border-border">
                                        <h3 className="text-sm font-bold text-foreground uppercase tracking-wide mb-3">
                                            Archivo seleccionado
                                        </h3>
                                        <div className="flex items-center text-sm text-foreground bg-card p-2 rounded border border-border shadow-sm">
                                            <span className="mr-2 text-green-500">✓</span> {singleFile.name}
                                        </div>
                                    </div>
                                )}

                                <div className="flex flex-col items-center">
                                    {statusSheets && (
                                        <div className={`mb-4 px-4 py-2 rounded-full text-sm font-medium ${statusSheets.includes('Error') ? 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-100' :
                                            statusSheets.includes('Éxito') ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-100' : 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-100'
                                            }`}>
                                            {statusSheets}
                                        </div>
                                    )}

                                    <button
                                        onClick={handleConsolidateSheets}
                                        disabled={!singleFile || isProcessingSheets}
                                        className="w-full sm:w-auto px-10 py-4 bg-primary text-primary-foreground font-bold rounded-xl shadow-lg shadow-primary/30
                               hover:bg-primary/90 hover:shadow-xl hover:-translate-y-0.5
                               disabled:bg-muted disabled:text-muted-foreground disabled:shadow-none disabled:cursor-not-allowed disabled:translate-y-0
                               transition-all duration-200 text-lg"
                                    >
                                        {isProcessingSheets ? (
                                            <span className="flex items-center">
                                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                Procesando...
                                            </span>
                                        ) : (
                                            'Consolidar Hojas'
                                        )}
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
