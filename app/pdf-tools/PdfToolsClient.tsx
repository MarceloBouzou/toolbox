"use client";

import { useState, useRef } from 'react';
import { Header } from '@/components/Header';
import { ShareButton } from '@/components/ShareButton';
import { VisitCounter } from '@/components/VisitCounter';
import { PrivacyBadge } from '@/components/PrivacyBadge';
import { Upload, X, Download, FileText, RefreshCw, Scissors, Layers } from 'lucide-react';
import { PDFDocument } from 'pdf-lib';
import JSZip from 'jszip';

type Mode = 'merge' | 'split';

interface PdfFile {
    id: string;
    file: File;
    name: string;
}

export default function PdfToolsClient() {
    const [mode, setMode] = useState<Mode>('merge');
    const [files, setFiles] = useState<PdfFile[]>([]);
    const [isProcessing, setIsProcessing] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFiles = (newFiles: File[]) => {
        const pdFiles = newFiles
            .filter(f => f.type === 'application/pdf')
            .map(f => ({
                id: Math.random().toString(36).substr(2, 9),
                file: f,
                name: f.name
            }));

        if (mode === 'split') {
            // For split mode, we only allow one file at a time effectively for simplicity in this version,
            // or we replace the current one. Let's replace for split mode.
            setFiles(pdFiles.slice(0, 1));
        } else {
            // For merge, we append
            setFiles(prev => [...prev, ...pdFiles]);
        }
    };

    const removeFile = (id: string) => {
        setFiles(prev => prev.filter(f => f.id !== id));
    };

    const mergePdfs = async () => {
        if (files.length < 2) return;
        setIsProcessing(true);

        try {
            const mergedPdf = await PDFDocument.create();

            for (const pdfFile of files) {
                const arrayBuffer = await pdfFile.file.arrayBuffer();
                const pdf = await PDFDocument.load(arrayBuffer);
                const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
                copiedPages.forEach((page) => mergedPdf.addPage(page));
            }

            const pdfBytes = await mergedPdf.save();
            downloadBlob(new Blob([pdfBytes], { type: 'application/pdf' }), 'unido.pdf');
        } catch (error) {
            console.error('Error merging PDFs:', error);
            alert('Hubo un error al unir los PDFs. Asegúrate de que no estén protegidos con contraseña.');
        } finally {
            setIsProcessing(false);
        }
    };

    const splitPdf = async () => {
        if (files.length === 0) return;
        setIsProcessing(true);

        try {
            const pdfFile = files[0];
            const arrayBuffer = await pdfFile.file.arrayBuffer();
            const pdf = await PDFDocument.load(arrayBuffer);
            const pageCount = pdf.getPageCount();

            const zip = new JSZip();
            const folder = zip.folder("paginas_pdf");

            for (let i = 0; i < pageCount; i++) {
                const newPdf = await PDFDocument.create();
                const [page] = await newPdf.copyPages(pdf, [i]);
                newPdf.addPage(page);
                const pdfBytes = await newPdf.save();
                folder?.file(`pagina_${i + 1}.pdf`, pdfBytes);
            }

            const content = await zip.generateAsync({ type: "blob" });
            downloadBlob(content, `${pdfFile.name.replace('.pdf', '')}_paginas.zip`);

        } catch (error) {
            console.error('Error splitting PDF:', error);
            alert('Hubo un error al dividir el PDF.');
        } finally {
            setIsProcessing(false);
        }
    };

    const downloadBlob = (blob: Blob, filename: string) => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    return (
        <div className="min-h-screen bg-background text-foreground transition-colors duration-300 flex flex-col">
            <Header title="Herramientas PDF" showBack>
                <div className="mr-4">
                    <ShareButton />
                </div>
            </Header>
            <div className="flex justify-center pb-2 bg-background border-b border-border/50">
                <VisitCounter pageKey="pdf_tools" />
            </div>

            <main className="flex-1 max-w-5xl mx-auto w-full p-4 sm:p-6 lg:p-8 flex flex-col gap-8">

                {/* Tabs */}
                <div className="flex bg-muted p-1 rounded-xl self-center">
                    <button
                        onClick={() => { setMode('merge'); setFiles([]); }}
                        className={`px-6 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${mode === 'merge'
                            ? 'bg-background shadow-sm text-primary'
                            : 'text-muted-foreground hover:text-foreground'
                            }`}
                    >
                        <Layers size={18} /> Unir PDFs
                    </button>
                    <button
                        onClick={() => { setMode('split'); setFiles([]); }}
                        className={`px-6 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${mode === 'split'
                            ? 'bg-background shadow-sm text-primary'
                            : 'text-muted-foreground hover:text-foreground'
                            }`}
                    >
                        <Scissors size={18} /> Dividir PDF
                    </button>
                </div>

                {/* Info */}
                <div className="text-center space-y-2 animate-fade-in">
                    <h2 className="text-2xl font-bold">
                        {mode === 'merge' ? 'Unir Múltiples Archivos PDF' : 'Dividir PDF en Páginas'}
                    </h2>
                    <p className="text-muted-foreground max-w-lg mx-auto">
                        {mode === 'merge'
                            ? 'Ordena tus archivos y únelos en un solo documento. Procesamiento 100% privado en tu navegador.'
                            : 'Extrae todas las páginas de tu documento PDF en archivos separados. Rápido y seguro.'}
                    </p>
                </div>

                {/* Upload Zone */}
                {files.length === 0 ? (
                    <div
                        onClick={() => fileInputRef.current?.click()}
                        className="border-3 border-dashed border-muted-foreground/20 hover:border-primary/50 hover:bg-muted/30 rounded-3xl p-12 text-center cursor-pointer transition-all duration-300 group animate-fade-in-up"
                    >
                        <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                            <FileText className="text-muted-foreground w-10 h-10" />
                        </div>
                        <h3 className="text-xl font-bold mb-2">Selecciona tus archivos PDF</h3>
                        <p className="text-muted-foreground mb-6">Haz clic para buscar en tu dispositivo</p>
                        <div className="flex justify-center">
                            <PrivacyBadge />
                        </div>
                    </div>
                ) : (
                    <div className="space-y-6 animate-fade-in-up">
                        <div className="space-y-2">
                            {files.map((file, index) => (
                                <div key={file.id} className="bg-card border border-border rounded-xl p-4 flex items-center justify-between shadow-sm animate-fade-in">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 bg-red-100 dark:bg-red-900/30 text-red-600 rounded-lg flex items-center justify-center">
                                            <FileText size={20} />
                                        </div>
                                        <div>
                                            <p className="font-medium truncate max-w-[200px] sm:max-w-md">{file.name}</p>
                                            <p className="text-xs text-muted-foreground">{(file.file.size / 1024 / 1024).toFixed(2)} MB</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => removeFile(file.id)}
                                        className="p-2 hover:bg-destructive/10 text-muted-foreground hover:text-destructive rounded-lg transition-colors"
                                    >
                                        <X size={18} />
                                    </button>
                                </div>
                            ))}
                        </div>

                        <div className="flex justify-center gap-4">
                            <button
                                onClick={() => fileInputRef.current?.click()}
                                className="px-6 py-2.5 bg-secondary text-secondary-foreground hover:bg-secondary/80 rounded-xl font-medium transition-colors flex items-center gap-2"
                            >
                                <Upload size={18} /> {mode === 'merge' ? 'Agregar más' : 'Cambiar archivo'}
                            </button>
                            <button
                                onClick={mode === 'merge' ? mergePdfs : splitPdf}
                                disabled={isProcessing}
                                className="px-6 py-2.5 bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl font-bold transition-colors shadow-lg shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                            >
                                {isProcessing ? <RefreshCw className="animate-spin" size={18} /> : (mode === 'merge' ? <Layers size={18} /> : <Scissors size={18} />)}
                                {isProcessing ? 'Procesando...' : (mode === 'merge' ? 'Unir PDFs' : 'Dividir PDF')}
                            </button>
                        </div>
                    </div>
                )}

                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={(e) => e.target.files && handleFiles(Array.from(e.target.files))}
                    className="hidden"
                    accept="application/pdf"
                    multiple={mode === 'merge'}
                />

            </main>
        </div>
    );
}
