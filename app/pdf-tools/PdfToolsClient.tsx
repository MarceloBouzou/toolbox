"use client";

import { useState, useRef, useEffect } from 'react';
import { Header } from '@/components/Header';
import { ShareButton } from '@/components/ShareButton';
import { VisitCounter } from '@/components/VisitCounter';
import { PrivacyBadge } from '@/components/PrivacyBadge';
import { Upload, X, Download, FileText, RefreshCw, Scissors, Layers, RotateCw, Image as ImageIcon, ArrowLeft, ArrowRight, RotateCcw } from 'lucide-react';
import { PDFDocument, degrees } from 'pdf-lib';
import JSZip from 'jszip';
// Import pdfjs-dist dynamically to avoid SSR issues if possible, but standard import is usually fine for client components
// We need to set the worker source
// pdfjs-dist will be imported dynamically to avoid SSR issues with DOMMatrix


type Mode = 'merge' | 'split' | 'rotate' | 'to-image';

interface PdfFile {
    id: string;
    file: File;
    name: string;
}

export default function PdfToolsClient() {
    const [mode, setMode] = useState<Mode>('merge');
    const [files, setFiles] = useState<PdfFile[]>([]);
    const [isProcessing, setIsProcessing] = useState(false);

    // Rotate specific state
    const [rotationAngle, setRotationAngle] = useState(0); // 0, 90, 180, 270 relative to original

    // To Image specific state
    const [imageFormat, setImageFormat] = useState<'png' | 'jpeg'>('png');

    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFiles = (newFiles: File[]) => {
        const validExtensions = ['.pdf'];
        const validInputFiles = newFiles.filter(file =>
            validExtensions.some(ext => file.name.toLowerCase().endsWith(ext))
        );

        if (validInputFiles.length !== newFiles.length) {
            alert("Solo se permiten archivos PDF (.pdf). Los archivos no válidos fueron ignorados.");
        }

        const pdFiles = validInputFiles
            .filter(f => {
                // Determine if strict mime check works for user. Keeping it but secondary to extension now.
                // Actually user asked for strict extension.
                // We keep the logic mostly but using validInputFiles as source.
                if (f.type !== 'application/pdf' && !f.name.toLowerCase().endsWith('.pdf')) return false;

                const MAX_SIZE = 50 * 1024 * 1024; // 50MB
                if (f.size > MAX_SIZE) {
                    alert(`El archivo "${f.name}" es demasiado grande (>50MB). Se ha omitido para evitar problemas de memoria.`);
                    return false;
                }
                return true;
            })
            .map(f => ({
                id: Math.random().toString(36).substr(2, 9),
                file: f,
                name: f.name
            }));

        const singleMode = mode === 'split' || mode === 'rotate' || mode === 'to-image';

        if (singleMode) {
            // Take the first one if multiple dropped
            if (pdFiles.length > 0) {
                setFiles(pdFiles.slice(0, 1));
                setRotationAngle(0);
            }
        } else {
            // For merge, we append
            setFiles(prev => [...prev, ...pdFiles]);
        }
    };

    const removeFile = (id: string) => {
        setFiles(prev => prev.filter(f => f.id !== id));
    };

    const [isDragging, setIsDragging] = useState(false);

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        if (e.dataTransfer.files) {
            handleFiles(Array.from(e.dataTransfer.files));
        }
    };

    // --- LOGIC: MERGE ---
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
            downloadBlob(new Blob([pdfBytes as any], { type: 'application/pdf' }), 'unido.pdf');
        } catch (error) {
            console.error('Error merging PDFs:', error);
            alert('Hubo un error al unir los PDFs. Asegúrate de que no estén protegidos con contraseña.');
        } finally {
            setIsProcessing(false);
        }
    };

    // --- LOGIC: SPLIT ---
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

    // --- LOGIC: ROTATE ---
    const rotatePdf = async () => {
        if (files.length === 0) return;
        setIsProcessing(true);

        try {
            const pdfFile = files[0];
            const arrayBuffer = await pdfFile.file.arrayBuffer();
            const pdf = await PDFDocument.load(arrayBuffer);
            const pages = pdf.getPages();

            // Apply rotation to all pages
            // Note: getRotation() returns current rotation. We add to it.
            // But user UI expects absolute rotation relative to "current view".
            // Implementation: simple +90 degrees logic for all pages
            for (const page of pages) {
                const currentRotation = page.getRotation().angle;
                page.setRotation(degrees(currentRotation + rotationAngle));
            }

            // Correct:
            const savedBytes = await pdf.save();

            downloadBlob(new Blob([savedBytes as any], { type: 'application/pdf' }), `${pdfFile.name.replace('.pdf', '')}_rotado.pdf`);

            // Reset after success? or keep?
            // setRotationAngle(0); 
        } catch (error) {
            console.error('Error rotating PDF:', error);
            alert('Hubo un error al rotar el PDF.');
        } finally {
            setIsProcessing(false);
        }
    };

    const addToRotation = (angle: number) => {
        setRotationAngle(prev => (prev + angle) % 360);
    };


    const pdfToImages = async () => {
        if (files.length === 0) return;
        setIsProcessing(true);

        try {
            const pdfFile = files[0];
            const arrayBuffer = await pdfFile.file.arrayBuffer();

            // Dynamic import
            const pdfjsLib = await import('pdfjs-dist');
            // Use local worker to avoid CDN/CORS issues
            pdfjsLib.GlobalWorkerOptions.workerSrc = window.location.origin + '/pdf.worker.min.mjs';

            // Loading document
            const loadingTask = pdfjsLib.getDocument(new Uint8Array(arrayBuffer));
            const pdf = await loadingTask.promise;

            const totalPages = pdf.numPages;

            // Smart Download: If single page, download image directly
            if (totalPages === 1) {
                const page = await pdf.getPage(1);
                const viewport = page.getViewport({ scale: 2.0 });
                const canvas = document.createElement('canvas');
                const context = canvas.getContext('2d');
                canvas.height = viewport.height;
                canvas.width = viewport.width;

                if (context) {
                    await page.render({
                        canvasContext: context,
                        viewport: viewport
                    } as any).promise;

                    const blob = await new Promise<Blob | null>(resolve =>
                        canvas.toBlob(resolve, imageFormat === 'png' ? 'image/png' : 'image/jpeg', 0.9)
                    );

                    if (blob) {
                        const ext = imageFormat === 'png' ? 'png' : 'jpg';
                        downloadBlob(blob, `${pdfFile.name.replace('.pdf', '')}_pagina_1.${ext}`);
                    }
                }
                setIsProcessing(false);
                return;
            }

            // Multiple pages -> ZIP
            const zip = new JSZip();
            const folder = zip.folder("imagenes_pdf");

            for (let i = 1; i <= totalPages; i++) {
                const page = await pdf.getPage(i);

                // Scale 2.0 = Good quality for viewing
                const viewport = page.getViewport({ scale: 2.0 });

                const canvas = document.createElement('canvas');
                const context = canvas.getContext('2d');
                canvas.height = viewport.height;
                canvas.width = viewport.width;

                if (context) {
                    await page.render({
                        canvasContext: context,
                        viewport: viewport
                    } as any).promise;

                    // Convert to blob
                    const blob = await new Promise<Blob | null>(resolve =>
                        canvas.toBlob(resolve, imageFormat === 'png' ? 'image/png' : 'image/jpeg', 0.9)
                    );

                    if (blob) {
                        const ext = imageFormat === 'png' ? 'png' : 'jpg';
                        folder?.file(`pagina_${i}.${ext}`, blob);
                    }
                }
            }

            const content = await zip.generateAsync({ type: "blob" });
            downloadBlob(content, `${pdfFile.name.replace('.pdf', '')}_imagenes.zip`);

        } catch (error: any) {
            console.error('Error converting PDF to images:', error);
            // Show the actual error message to the user
            alert(`Error: ${error.message || error}`);
        } finally {
            setIsProcessing(false);
        }
    };


    const downloadBlob = (blob: Blob, filename: string) => {
        try {
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            setTimeout(() => URL.revokeObjectURL(url), 100);
        } catch (e: any) { // Type 'any' to avoid TS error
            console.error("Download failed:", e);
            alert(`Error al descargar: ${e.message}`);
        }
    };

    return (
        <div className="min-h-screen bg-background text-foreground transition-colors duration-300 flex flex-col">
            <Header title="Kit de Herramientas PDF" showBack>
                <div className="mr-4">
                    <ShareButton />
                </div>
            </Header>
            <div className="flex justify-center pb-2 bg-background border-b border-border/50">
                <VisitCounter pageKey="pdf_tools" />
            </div>

            <main className="flex-1 max-w-5xl mx-auto w-full p-4 sm:p-6 lg:p-8 flex flex-col gap-8">

                {/* Tabs */}
                <div className="flex flex-wrap gap-2 bg-muted p-1 rounded-xl self-center justify-center">
                    <button
                        onClick={() => { setMode('merge'); setFiles([]); }}
                        className={`px-4 sm:px-6 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${mode === 'merge'
                            ? 'bg-background shadow-sm text-primary'
                            : 'text-muted-foreground hover:text-foreground'
                            }`}
                    >
                        <Layers size={18} /> Unir PDFs
                    </button>
                    <button
                        onClick={() => { setMode('split'); setFiles([]); }}
                        className={`px-4 sm:px-6 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${mode === 'split'
                            ? 'bg-background shadow-sm text-primary'
                            : 'text-muted-foreground hover:text-foreground'
                            }`}
                    >
                        <Scissors size={18} /> Dividir PDF
                    </button>
                    <button
                        onClick={() => { setMode('rotate'); setFiles([]); }}
                        className={`px-4 sm:px-6 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${mode === 'rotate'
                            ? 'bg-background shadow-sm text-primary'
                            : 'text-muted-foreground hover:text-foreground'
                            }`}
                    >
                        <RotateCw size={18} /> Rotar PDF
                    </button>
                    <button
                        onClick={() => { setMode('to-image'); setFiles([]); }}
                        className={`px-4 sm:px-6 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${mode === 'to-image'
                            ? 'bg-background shadow-sm text-primary'
                            : 'text-muted-foreground hover:text-foreground'
                            }`}
                    >
                        <ImageIcon size={18} /> PDF a Imágenes
                    </button>
                </div>

                {/* Info */}
                <div className="text-center space-y-2 animate-fade-in">
                    <h2 className="text-2xl font-bold">
                        {mode === 'merge' && 'Unir Múltiples Archivos PDF'}
                        {mode === 'split' && 'Dividir PDF en Páginas'}
                        {mode === 'rotate' && 'Rotar Páginas PDF'}
                        {mode === 'to-image' && 'Convertir PDF a Imágenes'}
                    </h2>
                    <p className="text-muted-foreground max-w-lg mx-auto">
                        {mode === 'merge' && '¿Tienes reportes sueltos? Combina múltiples archivos en un solo documento maestro ordenado.'}
                        {mode === 'split' && 'Saca solo las páginas importantes o separa un archivo grande en documentos individuales.'}
                        {mode === 'rotate' && 'Gira el documento completo para corregir la orientación de escaneo.'}
                        {mode === 'to-image' && 'Extrae cada página de tu PDF como una imagen de alta calidad.'}
                    </p>
                </div>

                {/* Main Content Area */}

                {/* Upload Zone */}
                {files.length === 0 ? (
                    <div
                        onDragOver={handleDragOver}
                        onDragEnter={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                        onClick={() => fileInputRef.current?.click()}
                        className={`border-3 border-dashed rounded-3xl p-12 text-center cursor-pointer transition-all duration-300 group animate-fade-in-up ${isDragging
                            ? 'border-primary bg-primary/10 scale-[1.02]'
                            : 'border-muted-foreground/20 hover:border-primary/50 hover:bg-muted/30'
                            }`}
                    >
                        <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                            {mode === 'rotate' ? <RotateCw className="text-muted-foreground w-10 h-10" /> :
                                mode === 'to-image' ? <ImageIcon className="text-muted-foreground w-10 h-10" /> :
                                    <FileText className="text-muted-foreground w-10 h-10" />}
                        </div>
                        <h3 className="text-xl font-bold mb-2">Selecciona tus archivos PDF</h3>
                        <p className="text-muted-foreground mb-6">Haz clic o arrastra tus archivos aquí</p>
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

                        {/* Controls for ROTATE */}
                        {mode === 'rotate' && files.length > 0 && (
                            <div className="bg-card border border-border rounded-xl p-6 shadow-sm flex flex-col items-center gap-4">
                                <label className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Opciones de Rotación</label>
                                <div className="flex items-center gap-6">
                                    <button onClick={() => addToRotation(-90)} className="p-3 bg-muted hover:bg-muted/80 rounded-full transition-colors" title="Girar Izquierda">
                                        <RotateCcw size={24} />
                                    </button>
                                    <div className="text-2xl font-bold w-20 text-center">{rotationAngle}°</div>
                                    <button onClick={() => addToRotation(90)} className="p-3 bg-muted hover:bg-muted/80 rounded-full transition-colors" title="Girar Derecha">
                                        <RotateCw size={24} />
                                    </button>
                                </div>
                                <p className="text-sm text-muted-foreground">Se aplicará a todas las páginas</p>
                            </div>
                        )}

                        {/* Controls for TO IMAGE */}
                        {mode === 'to-image' && files.length > 0 && (
                            <div className="bg-card border border-border rounded-xl p-6 shadow-sm flex flex-col items-center gap-4">
                                <label className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Formato de Salida</label>
                                <div className="flex items-center gap-4 bg-muted p-1 rounded-lg">
                                    <button
                                        onClick={() => setImageFormat('png')}
                                        className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${imageFormat === 'png' ? 'bg-background shadow text-primary' : 'text-muted-foreground'}`}
                                    >
                                        PNG (Mejor Calidad)
                                    </button>
                                    <button
                                        onClick={() => setImageFormat('jpeg')}
                                        className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${imageFormat === 'jpeg' ? 'bg-background shadow text-primary' : 'text-muted-foreground'}`}
                                    >
                                        JPG (Menor Peso)
                                    </button>
                                </div>
                            </div>
                        )}


                        <div className="flex justify-center gap-4">
                            <button
                                onClick={() => fileInputRef.current?.click()}
                                className="px-6 py-2.5 bg-secondary text-secondary-foreground hover:bg-secondary/80 rounded-xl font-medium transition-colors flex items-center gap-2"
                            >
                                <Upload size={18} /> {mode === 'merge' ? 'Agregar más' : 'Cambiar archivo'}
                            </button>
                            <button
                                onClick={
                                    mode === 'merge' ? mergePdfs :
                                        mode === 'split' ? splitPdf :
                                            mode === 'rotate' ? rotatePdf :
                                                pdfToImages
                                }
                                disabled={isProcessing}
                                className="px-6 py-2.5 bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl font-bold transition-colors shadow-lg shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                            >
                                {isProcessing ? <RefreshCw className="animate-spin" size={18} /> :
                                    (mode === 'merge' ? <Layers size={18} /> :
                                        mode === 'rotate' ? <RotateCw size={18} /> :
                                            mode === 'to-image' ? <ImageIcon size={18} /> :
                                                <Scissors size={18} />)}

                                {isProcessing ? 'Procesando...' :
                                    (mode === 'merge' ? 'Unir PDFs' :
                                        mode === 'split' ? 'Dividir PDF' :
                                            mode === 'rotate' ? 'Aplicar y Descargar' :
                                                'Convertir a Imágenes')}
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
