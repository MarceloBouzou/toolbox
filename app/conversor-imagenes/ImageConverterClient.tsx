"use client";

import { useState, useRef } from 'react';
import { Header } from '@/components/Header';
import { ShareButton } from '@/components/ShareButton';
import { VisitCounter } from '@/components/VisitCounter';
import { PrivacyBadge } from '@/components/PrivacyBadge';
import { Upload, X, Download, FileImage, RefreshCw } from 'lucide-react';
import JSZip from 'jszip';

type ImageFormat = 'png' | 'jpeg' | 'webp';

interface ProcessedImage {
    id: string;
    originalName: string;
    preview: string;
    blob: Blob | null;
    status: 'pending' | 'converting' | 'done' | 'error';
    format: ImageFormat;
}

export default function ImageConverterClient() {
    const [images, setImages] = useState<ProcessedImage[]>([]);
    const [targetFormat, setTargetFormat] = useState<ImageFormat>('webp');
    const [isDragging, setIsDragging] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

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

    const handleFiles = (files: File[]) => {
        const validExtensions = ['.png', '.jpg', '.jpeg', '.webp', '.gif', '.bmp', '.tiff'];
        const validFiles = files.filter(file =>
            validExtensions.some(ext => file.name.toLowerCase().endsWith(ext))
        );

        if (validFiles.length !== files.length) {
            alert("Solo se permiten archivos de imagen (PNG, JPG, WEBP, etc).");
        }

        const imageFiles = validFiles.filter(f => f.type.startsWith('image/'));

        const newImages: ProcessedImage[] = imageFiles.map(file => ({
            id: Math.random().toString(36).substr(2, 9),
            originalName: file.name,
            preview: URL.createObjectURL(file),
            blob: null,
            status: 'pending',
            format: targetFormat
        }));

        setImages(prev => [...prev, ...newImages]);
    };

    const convertImages = async () => {
        setIsProcessing(true);
        // Process mainly sequentially to allow state updates to reflect progress clearly
        const indicesToProcess = images.map((img, idx) => img.status !== 'done' ? idx : -1).filter(i => i !== -1);

        for (const i of indicesToProcess) {
            // Update status to converting
            setImages(prev => prev.map((img, idx) =>
                idx === i ? { ...img, status: 'converting' } : img
            ));

            try {
                const img = images[i];
                const blob = await convertSingleImage(img.preview, targetFormat);

                // Update to done
                setImages(prev => prev.map((item, idx) =>
                    idx === i ? { ...item, status: 'done', blob: blob, format: targetFormat } : item
                ));
            } catch (error) {
                console.error(error);
                setImages(prev => prev.map((item, idx) =>
                    idx === i ? { ...item, status: 'error' } : item
                ));
            }
        }
        setIsProcessing(false);
    };

    const convertSingleImage = (url: string, format: ImageFormat): Promise<Blob> => {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement('canvas');
                canvas.width = img.width;
                canvas.height = img.height;
                const ctx = canvas.getContext('2d');
                if (!ctx) {
                    reject(new Error('Could not get canvas context'));
                    return;
                }
                ctx.drawImage(img, 0, 0);
                canvas.toBlob((blob) => {
                    if (blob) resolve(blob);
                    else reject(new Error('Conversion failed'));
                }, `image/${format}`, 0.9);
            };
            img.onerror = reject;
            img.src = url;
        });
    };

    const removeImage = (id: string) => {
        setImages(prev => prev.filter(img => img.id !== id));
    };

    const downloadImage = (img: ProcessedImage) => {
        if (!img.blob) {
            alert('Error: La imagen no se generó correctamente. Intenta convertirla de nuevo.');
            return;
        }
        const url = URL.createObjectURL(img.blob);
        const a = document.createElement('a');
        a.href = url;
        const nameWithoutExt = img.originalName.substring(0, img.originalName.lastIndexOf('.')) || img.originalName;
        a.download = `${nameWithoutExt}_converted.${img.format}`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        setTimeout(() => URL.revokeObjectURL(url), 100);
    };

    const downloadAll = async () => {
        const doneImages = images.filter(img => img.status === 'done' && img.blob);

        if (doneImages.length === 0) return;

        // Smart Download: Single file -> Direct download
        if (doneImages.length === 1) {
            downloadImage(doneImages[0]);
            return;
        }

        // Multiple files -> ZIP
        const zip = new JSZip();

        doneImages.forEach(img => {
            const nameWithoutExt = img.originalName.substring(0, img.originalName.lastIndexOf('.')) || img.originalName;
            zip.file(`${nameWithoutExt}.${img.format}`, img.blob!);
        });

        const content = await zip.generateAsync({ type: "blob" });
        const url = URL.createObjectURL(content);
        const a = document.createElement('a');
        a.href = url;
        a.download = "imagenes_convertidas.zip";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    return (
        <div className="min-h-screen bg-background text-foreground transition-colors duration-300 flex flex-col">
            <Header title="Conversor de Imágenes" showBack>
                <div className="mr-4">
                    <ShareButton />
                </div>
            </Header>
            <div className="flex justify-center pb-2 bg-background border-b border-border/50">
                <VisitCounter pageKey="image_converter" />
            </div>

            <main className="flex-1 max-w-5xl mx-auto w-full p-4 sm:p-6 lg:p-8 flex flex-col gap-8">

                {/* Controls */}
                <div className="bg-card rounded-2xl shadow-sm border border-border p-6 animate-fade-in-up">
                    <div className="flex flex-col sm:flex-row gap-6 items-center justify-between">

                        <div className="flex items-center gap-4">
                            <span className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">Convertir a:</span>
                            <div className="flex bg-muted p-1 rounded-lg">
                                {(['webp', 'png', 'jpeg'] as ImageFormat[]).map((fmt) => (
                                    <button
                                        key={fmt}
                                        onClick={() => setTargetFormat(fmt)}
                                        className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${targetFormat === fmt
                                            ? 'bg-background shadow-sm text-primary'
                                            : 'text-muted-foreground hover:text-foreground'
                                            }`}
                                    >
                                        {fmt.toUpperCase()}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="flex gap-3 w-full sm:w-auto">
                            <button
                                onClick={() => fileInputRef.current?.click()}
                                className="flex-1 sm:flex-none px-6 py-2.5 bg-secondary text-secondary-foreground hover:bg-secondary/80 rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
                            >
                                <Upload size={18} /> Agregar
                            </button>
                            <button
                                onClick={convertImages}
                                disabled={isProcessing || images.length === 0}
                                className="flex-1 sm:flex-none px-6 py-2.5 bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl font-medium transition-colors shadow-lg shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {isProcessing ? <RefreshCw className="animate-spin" size={18} /> : <RefreshCw size={18} />}
                                {isProcessing ? 'Convirtiendo...' : 'Convertir'}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Upload Zone */}
                {images.length === 0 ? (
                    <div
                        onDragOver={handleDragOver}
                        onDragEnter={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                        onClick={() => fileInputRef.current?.click()}
                        className={`border-3 border-dashed rounded-3xl p-12 text-center cursor-pointer transition-all duration-300 group ${isDragging
                            ? 'border-primary bg-primary/5 scale-[1.02]'
                            : 'border-muted-foreground/20 hover:border-primary/50 hover:bg-muted/30'
                            }`}
                    >
                        <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                            <Upload className="text-muted-foreground w-10 h-10" />
                        </div>
                        <h3 className="text-xl font-bold mb-2">Arrastra tus imágenes aquí</h3>
                        <p className="text-muted-foreground mb-6">o haz clic para seleccionar archivos</p>
                        <div className="flex justify-center">
                            <PrivacyBadge />
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {images.map((img) => (
                            <div key={img.id} className="group relative bg-card rounded-xl border border-border p-3 flex gap-4 items-center animate-fade-in hover:shadow-md transition-shadow">
                                <button
                                    onClick={() => removeImage(img.id)}
                                    className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity shadow-sm z-10"
                                >
                                    <X size={14} />
                                </button>

                                <div className="w-16 h-16 shrink-0 rounded-lg overflow-hidden bg-muted border border-border relative">
                                    <img src={img.preview} alt="" className="w-full h-full object-cover" />
                                </div>

                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium truncate" title={img.originalName}>{img.originalName}</p>
                                    <div className="flex items-center gap-2 mt-1">
                                        {img.status === 'pending' && <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground">Pendiente</span>}
                                        {img.status === 'converting' && <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 animate-pulse">Procesando...</span>}
                                        {img.status === 'done' && <span className="text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300">Listo ({img.format.toUpperCase()})</span>}
                                        {img.status === 'error' && <span className="text-xs px-2 py-0.5 rounded-full bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300">Error</span>}
                                    </div>
                                </div>

                                {img.status === 'done' && (
                                    <button
                                        onClick={() => downloadImage(img)}
                                        className="p-2 bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground rounded-lg transition-colors"
                                        title="Descargar"
                                    >
                                        <Download size={18} />
                                    </button>
                                )}
                            </div>
                        ))}

                        {/* Add More Card */}
                        <div
                            onDragOver={handleDragOver}
                            onDragEnter={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onDrop={handleDrop}
                            onClick={() => fileInputRef.current?.click()}
                            className={`border-2 border-dashed border-border rounded-xl flex flex-col items-center justify-center cursor-pointer transition-all min-h-[5rem] ${isDragging
                                ? 'border-primary bg-primary/5 scale-[1.02]'
                                : 'hover:border-primary/50 hover:bg-muted/30'
                                }`}
                        >
                            <Upload className="text-muted-foreground mb-1" size={20} />
                            <span className="text-xs font-medium text-muted-foreground">Agregar más</span>
                        </div>
                    </div>
                )}

                {images.some(img => img.status === 'done') && (
                    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 animate-fade-in-up">
                        <button
                            onClick={downloadAll}
                            className="px-6 py-3 bg-foreground text-background rounded-full font-bold shadow-2xl hover:scale-105 transition-transform flex items-center gap-2"
                        >
                            <Download size={20} />
                            {images.filter(i => i.status === 'done').length === 1 ? 'Descargar Imagen' : 'Descargar Todo (ZIP)'}
                        </button>
                    </div>
                )}

                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={(e) => e.target.files && handleFiles(Array.from(e.target.files))}
                    className="hidden"
                    accept="image/png, image/jpeg, image/webp"
                    multiple
                />

            </main>
        </div>
    );
}
