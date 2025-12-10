"use client";

import { useState, useRef, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Header } from '@/components/Header';
import { ShareButton } from '@/components/ShareButton';
import { VisitCounter } from '@/components/VisitCounter';
import { PrivacyBadge } from '@/components/PrivacyBadge';
import { Download, Link as LinkIcon, Type, Wifi, Mail, QrCode, AlignCenter, User } from 'lucide-react';

type QrType = 'url' | 'text' | 'wifi' | 'email';

export default function QrGeneratorClient() {
    const [type, setType] = useState<QrType>('url');
    const [value, setValue] = useState('https://example.com');
    const [fgColor, setFgColor] = useState('#000000');
    const [bgColor, setBgColor] = useState('#ffffff');
    const [size, setSize] = useState(256);

    // Labels & Watermark
    const [topLabel, setTopLabel] = useState('');
    const [bottomLabel, setBottomLabel] = useState('');
    const [showWatermark, setShowWatermark] = useState(true);

    // Wifi specific state
    const [wifiSsid, setWifiSsid] = useState('');
    const [wifiPassword, setWifiPassword] = useState('');
    const [wifiEncryption, setWifiEncryption] = useState('WPA');

    // Email specific state
    const [email, setEmail] = useState('');
    const [subject, setSubject] = useState('');
    const [body, setBody] = useState('');

    const WATERMARK_TEXT = [
        "Creado por Marcelo Bouzou",
        "Arquitecto de Soluciones y Procesos de Negocio",
        "Cel. 549 11 3246-5634 | marcelobouzou@gmail.com"
    ];

    const getQrValue = () => {
        switch (type) {
            case 'wifi':
                return `WIFI:T:${wifiEncryption};S:${wifiSsid};P:${wifiPassword};;`;
            case 'email':
                return `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
            case 'url':
            case 'text':
            default:
                return value;
        }
    };

    /**
     * Generates a combined PNG with QR + Text using Canvas
     */
    const downloadPng = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Configurations
        const padding = 40;
        const fontBaseSize = 16;
        const qrSize = 1024; // High res for print

        // Calculate dimensions
        // Scale everything relative to qrSize (assuming 256 screen size -> 4x scale)
        const scale = 4;
        const labelHeight = topLabel || bottomLabel ? 60 * scale : 0; // Space for labels
        const watermarkLineHeight = 35;
        const watermarkHeight = showWatermark ? (WATERMARK_TEXT.length * watermarkLineHeight) + 40 : 0;

        // Total Text Heights
        let topOffset = padding;
        if (topLabel) topOffset += 80; // Space for top label

        const contentHeight = topOffset + qrSize + (bottomLabel ? 80 : 0) + watermarkHeight + padding;
        const width = qrSize + (padding * 2);

        canvas.width = width;
        canvas.height = contentHeight;

        // 1. Background
        ctx.fillStyle = bgColor;
        ctx.fillRect(0, 0, width, contentHeight);

        // 2. Top Label
        if (topLabel) {
            ctx.fillStyle = fgColor;
            ctx.font = `bold ${32}px sans-serif`;
            ctx.textAlign = 'center';
            ctx.fillText(topLabel, width / 2, padding + 40);
        }

        // 3. QR Code
        // We need to render the QR to an image first or get it from the DOM
        // Since we have the SVG in DOM, we can serialize it
        const svgElement = document.getElementById('qr-main-svg');
        if (svgElement) {
            const xml = new XMLSerializer().serializeToString(svgElement);
            const svg64 = btoa(unescape(encodeURIComponent(xml)));
            const b64Start = 'data:image/svg+xml;base64,';
            const image64 = b64Start + svg64;

            const img = new Image();
            img.onload = () => {
                const qrY = topLabel ? topOffset : padding;
                ctx.drawImage(img, padding, qrY, qrSize, qrSize);

                // 4. Bottom Label
                let bottomY = qrY + qrSize + 60;
                if (bottomLabel) {
                    ctx.fillStyle = fgColor;
                    ctx.font = `bold ${32}px sans-serif`;
                    ctx.textAlign = 'center';
                    ctx.fillText(bottomLabel, width / 2, bottomY);
                    bottomY += 40;
                }

                // 5. Watermark
                if (showWatermark) {
                    bottomY += 40; // Spacing before watermark
                    ctx.fillStyle = fgColor; // Or a muted color? Let's use fgColor but maybe smaller or distinct
                    // Only the first line bold?

                    WATERMARK_TEXT.forEach((line, index) => {
                        ctx.font = index === 0 ? `bold ${24}px sans-serif` : `${22}px sans-serif`;
                        // ctx.fillStyle = index === 0 ? fgColor : '#666666'; // Canvas doesn't support named gray easily if bgcolor changes. sticking to fgColor/black mix could be tricky if bg is black.
                        // Let's stick to fgColor for consistency, or calculate contrast. 
                        // Simple: Use fgColor.
                        ctx.fillText(line, width / 2, bottomY + (index * watermarkLineHeight));
                    });
                }

                // Download
                const link = document.createElement('a');
                link.download = 'qrcode.png';
                link.href = canvas.toDataURL('image/png');
                link.click();
            };
            img.src = image64;
        }
    };

    /**
     * For SVG, we just download the QR content. 
     * Adding text to SVG programmatically is possible but complex for "download a complete poster".
     * For now, let's keep SVG as just the QR code (pure) or wrapping it. 
     * Providing a specific "Do you want just the QR or the full card?"
     * Let's make "SVG" Just the QR (as vectors usually are used for design intake) and "PNG" the "Social Share Card".
     * OR: We can simulate the text in SVG.
     * 
     * Let's stick to: SVG = Just QR (Clean), PNG = Full Card (With Text).
     * This is standard behavior for generators.
     */
    const downloadSvg = () => {
        const svg = document.getElementById('qr-main-svg');
        if (!svg) return;
        const svgData = new XMLSerializer().serializeToString(svg);
        const blob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'qrcode.svg';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="min-h-screen bg-background text-foreground transition-colors duration-300 flex flex-col">
            <Header title="Generador de QR" showBack>
                <div className="mr-4">
                    <ShareButton />
                </div>
            </Header>
            <div className="flex justify-center pb-2 bg-background border-b border-border/50">
                <VisitCounter pageKey="qr_generator" />
            </div>

            <main className="flex-1 max-w-6xl mx-auto w-full p-4 sm:p-6 lg:p-8 flex flex-col xl:flex-row gap-8">

                {/* Left Side: Inputs */}
                <div className="flex-1 space-y-6">

                    {/* Type Selector */}
                    <div className="bg-card border border-border rounded-xl p-4 shadow-sm">
                        <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3 block">1. Tipo de Contenido</label>
                        <div className="flex flex-wrap gap-2">
                            <button onClick={() => setType('url')} className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${type === 'url' ? 'bg-primary text-primary-foreground' : 'bg-muted hover:bg-muted/80'}`}>
                                <LinkIcon size={16} /> URL
                            </button>
                            <button onClick={() => setType('text')} className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${type === 'text' ? 'bg-primary text-primary-foreground' : 'bg-muted hover:bg-muted/80'}`}>
                                <Type size={16} /> Texto
                            </button>
                            <button onClick={() => setType('wifi')} className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${type === 'wifi' ? 'bg-primary text-primary-foreground' : 'bg-muted hover:bg-muted/80'}`}>
                                <Wifi size={16} /> WiFi
                            </button>
                            <button onClick={() => setType('email')} className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${type === 'email' ? 'bg-primary text-primary-foreground' : 'bg-muted hover:bg-muted/80'}`}>
                                <Mail size={16} /> Email
                            </button>
                        </div>
                    </div>

                    {/* Data Inputs */}
                    <div className="bg-card border border-border rounded-xl p-6 shadow-sm animate-fade-in">
                        <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-4 block">2. Datos</label>

                        {type === 'url' && (
                            <div className="space-y-3">
                                <label className="font-bold">Dirección Web (URL)</label>
                                <input
                                    type="url"
                                    className="w-full p-3 rounded-xl border border-border bg-background focus:ring-2 focus:ring-primary/50 outline-none transition-all"
                                    placeholder="https://www.ejemplo.com"
                                    value={value}
                                    onChange={(e) => setValue(e.target.value)}
                                />
                            </div>
                        )}

                        {type === 'text' && (
                            <div className="space-y-3">
                                <label className="font-bold">Texto Libre</label>
                                <textarea
                                    className="w-full p-3 rounded-xl border border-border bg-background focus:ring-2 focus:ring-primary/50 outline-none h-32 transition-all"
                                    placeholder="Escribe algo aquí..."
                                    value={value}
                                    onChange={(e) => setValue(e.target.value)}
                                />
                            </div>
                        )}

                        {type === 'wifi' && (
                            <div className="space-y-4">
                                <div>
                                    <label className="font-bold block mb-1">Nombre de la Red (SSID)</label>
                                    <input
                                        type="text"
                                        className="w-full p-3 rounded-xl border border-border bg-background focus:ring-2 focus:ring-primary/50 outline-none transition-all"
                                        placeholder="MiCasa_WIFI"
                                        value={wifiSsid}
                                        onChange={(e) => setWifiSsid(e.target.value)}
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="font-bold block mb-1">Contraseña</label>
                                        <input
                                            type="text"
                                            className="w-full p-3 rounded-xl border border-border bg-background focus:ring-2 focus:ring-primary/50 outline-none transition-all"
                                            placeholder="pass123"
                                            value={wifiPassword}
                                            onChange={(e) => setWifiPassword(e.target.value)}
                                        />
                                    </div>
                                    <div>
                                        <label className="font-bold block mb-1">Encriptación</label>
                                        <select
                                            className="w-full p-3 rounded-xl border border-border bg-background focus:ring-2 focus:ring-primary/50 outline-none transition-all"
                                            value={wifiEncryption}
                                            onChange={(e) => setWifiEncryption(e.target.value)}
                                        >
                                            <option value="WPA">WPA/WPA2</option>
                                            <option value="WEP">WEP</option>
                                            <option value="nopass">Sin Contraseña</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        )}

                        {type === 'email' && (
                            <div className="space-y-4">
                                <div>
                                    <label className="font-bold block mb-1">Email Destino</label>
                                    <input
                                        type="email"
                                        className="w-full p-3 rounded-xl border border-border bg-background focus:ring-2 focus:ring-primary/50 outline-none transition-all"
                                        placeholder="usuario@ejemplo.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label className="font-bold block mb-1">Asunto</label>
                                    <input
                                        type="text"
                                        className="w-full p-3 rounded-xl border border-border bg-background focus:ring-2 focus:ring-primary/50 outline-none transition-all"
                                        placeholder="Consulta importante"
                                        value={subject}
                                        onChange={(e) => setSubject(e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label className="font-bold block mb-1">Mensaje</label>
                                    <textarea
                                        className="w-full p-3 rounded-xl border border-border bg-background focus:ring-2 focus:ring-primary/50 outline-none h-24 transition-all"
                                        placeholder="Hola, quería consultar sobre..."
                                        value={body}
                                        onChange={(e) => setBody(e.target.value)}
                                    />
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Styling & Labels */}
                    <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
                        <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-4 block">3. Personalización</label>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                            <div>
                                <label className="block text-sm font-bold mb-2">Color QR</label>
                                <div className="flex items-center gap-3">
                                    <input
                                        type="color"
                                        value={fgColor}
                                        onChange={(e) => setFgColor(e.target.value)}
                                        className="w-12 h-12 rounded-lg cursor-pointer border border-border p-1"
                                    />
                                    <span className="font-mono text-xs p-2 bg-muted rounded border">{fgColor}</span>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-bold mb-2">Fondo</label>
                                <div className="flex items-center gap-3">
                                    <input
                                        type="color"
                                        value={bgColor}
                                        onChange={(e) => setBgColor(e.target.value)}
                                        className="w-12 h-12 rounded-lg cursor-pointer border border-border p-1"
                                    />
                                    <span className="font-mono text-xs p-2 bg-muted rounded border">{bgColor}</span>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4 pt-4 border-t border-border/50">
                            <div>
                                <label className="block text-sm font-bold mb-2 flex items-center gap-2">
                                    <AlignCenter size={16} /> Texto Superior
                                </label>
                                <input
                                    type="text"
                                    className="w-full p-2.5 rounded-lg border border-border bg-background focus:ring-2 focus:ring-primary/50 outline-none text-sm"
                                    placeholder="Ej: Menú Digital"
                                    value={topLabel}
                                    onChange={(e) => setTopLabel(e.target.value)}
                                    maxLength={30}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold mb-2 flex items-center gap-2">
                                    <AlignCenter size={16} /> Texto Inferior
                                </label>
                                <input
                                    type="text"
                                    className="w-full p-2.5 rounded-lg border border-border bg-background focus:ring-2 focus:ring-primary/50 outline-none text-sm"
                                    placeholder="Ej: Escanea para ver"
                                    value={bottomLabel}
                                    onChange={(e) => setBottomLabel(e.target.value)}
                                    maxLength={30}
                                />
                            </div>

                            <div className="flex items-center gap-3 pt-2">
                                <input
                                    type="checkbox"
                                    id="watermark"
                                    checked={showWatermark}
                                    onChange={(e) => setShowWatermark(e.target.checked)}
                                    className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary"
                                />
                                <label htmlFor="watermark" className="text-sm font-medium cursor-pointer flex items-center gap-2">
                                    <User size={16} /> Incluir firma de creador
                                </label>
                            </div>
                        </div>
                    </div>

                </div>

                {/* Right Side: Preview */}
                <div className="xl:w-[450px] flex flex-col gap-6">
                    <div className="bg-card border border-border rounded-2xl p-6 shadow-lg flex flex-col items-center justify-center sticky top-6">
                        <h2 className="text-xl font-bold mb-6 flex items-center gap-2 w-full pb-4 border-b border-border">
                            <QrCode className="text-primary" /> Vista Previa
                        </h2>

                        {/* Visual Preview Container - Mimics Result */}
                        <div
                            className="p-6 rounded-xl shadow-inner flex flex-col items-center text-center transition-colors duration-200"
                            style={{ backgroundColor: bgColor }}
                        >
                            {topLabel && (
                                <p className="mb-4 font-bold text-lg break-words max-w-[280px]" style={{ color: fgColor }}>
                                    {topLabel}
                                </p>
                            )}

                            <div className="bg-white p-1">
                                <QRCodeSVG
                                    id="qr-main-svg"
                                    value={getQrValue()}
                                    size={250}
                                    fgColor={fgColor}
                                    bgColor={bgColor} // Actually SVG bg usually transparent if container has bg, but let's match
                                    level={'H'}
                                    includeMargin={false}
                                />
                            </div>

                            {bottomLabel && (
                                <p className="mt-4 font-bold text-lg break-words max-w-[280px]" style={{ color: fgColor }}>
                                    {bottomLabel}
                                </p>
                            )}

                            {showWatermark && (
                                <div className="mt-8 pt-4 border-t border-black/10 text-xs opacity-70 leading-tight space-y-1" style={{ color: fgColor }}>
                                    {WATERMARK_TEXT.map((line, i) => (
                                        <p key={i} className={i === 0 ? "font-bold" : ""}>{line}</p>
                                    ))}
                                </div>
                            )}
                        </div>

                        <p className="text-xs text-muted-foreground mt-4 text-center">
                            * La descarga PNG incluirá todos los textos y firma. <br />
                            * El SVG contendrá solo el código QR vectorial.
                        </p>

                        <div className="flex gap-3 w-full mt-6">
                            <button
                                onClick={downloadPng}
                                className="flex-1 bg-primary text-primary-foreground py-3 px-4 rounded-xl font-bold hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2 active:scale-95"
                            >
                                <Download size={18} /> Descargar PNG
                            </button>
                            <button
                                onClick={downloadSvg}
                                className="flex-1 bg-secondary text-secondary-foreground py-3 px-4 rounded-xl font-bold hover:bg-secondary/80 transition-all flex items-center justify-center gap-2 active:scale-95"
                            >
                                <Download size={18} /> Solo QR (SVG)
                            </button>
                        </div>

                        <div className="mt-8 w-full flex justify-center">
                            <PrivacyBadge />
                        </div>
                    </div>
                </div>

            </main>
        </div>
    );
}
