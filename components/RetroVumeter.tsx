'use client';

import { useEffect, useRef } from 'react';

// Paleta "Fairlight Gold"
const THEME_COLORS = [
    "#221100", "#331a00", "#442200", "#553300",
    "#774400", "#996600", "#bb8800", "#ddaa00",
    "#ffcc00", "#ffdd44", "#ffee88", "#ffffaa",
    "#ffffff"
];

export const RetroVumeter = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    // Métricas visuales (0.0 a 1.0)
    const metrics = useRef({
        mouse: 0,
        scroll: 0,
        clicks: 0,
        total: 0
    });

    const lastPos = useRef({ x: 0, y: 0 });
    const lastScroll = useRef(0);

    useEffect(() => {
        // 1. Captura de Eventos (Solo Mouse y Scroll)
        const handleMouseMove = (e: MouseEvent) => {
            const dist = Math.hypot(e.clientX - lastPos.current.x, e.clientY - lastPos.current.y);
            metrics.current.mouse = Math.min(metrics.current.mouse + (dist / 500), 1);
            lastPos.current = { x: e.clientX, y: e.clientY };
        };

        const handleScroll = () => {
            const currentScroll = window.scrollY;
            const diff = Math.abs(currentScroll - lastScroll.current);
            metrics.current.scroll = Math.min(metrics.current.scroll + (diff / 50), 1);
            lastScroll.current = currentScroll;
        };

        const handleClick = () => { metrics.current.clicks = 1.0; };

        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('scroll', handleScroll);
        window.addEventListener('click', handleClick);

        // 2. Loop de Renderizado
        let animationFrameId: number;
        let colorOffset = 0;

        const render = () => {
            const canvas = canvasRef.current;
            if (!canvas) return;
            const ctx = canvas.getContext('2d');
            if (!ctx) return;

            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Decaimiento
            metrics.current.mouse *= 0.92;
            metrics.current.scroll *= 0.90;
            metrics.current.clicks *= 0.85;

            // Promedio de actividad
            metrics.current.total = (
                metrics.current.mouse + metrics.current.scroll + metrics.current.clicks
            ) / 3;

            const values = [
                metrics.current.mouse,
                metrics.current.scroll,
                metrics.current.clicks,
                metrics.current.total
            ];

            const barWidth = 8;
            const gap = 4;
            const maxHeight = canvas.height;
            colorOffset += 0.2;

            values.forEach((val, i) => {
                const x = i * (barWidth + gap);
                const rawHeight = val * maxHeight;
                const height = Math.floor(rawHeight / 2) * 2;

                for (let y = 0; y < maxHeight; y += 2) {
                    const invertedY = maxHeight - y;
                    if (y < height) {
                        const colorIdx = Math.floor((y + (colorOffset * 2)) / 4) % THEME_COLORS.length;
                        ctx.fillStyle = THEME_COLORS[colorIdx];
                        ctx.fillRect(x, invertedY, barWidth, 1);
                    } else {
                        ctx.fillStyle = "rgba(50, 30, 0, 0.2)";
                        ctx.fillRect(x, invertedY, barWidth, 1);
                    }
                }
            });

            animationFrameId = requestAnimationFrame(render);
        };

        render();

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('scroll', handleScroll);
            window.removeEventListener('click', handleClick);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return (
        <div className="fixed bottom-4 right-4 z-50 pointer-events-none hidden md:block opacity-60 hover:opacity-100 transition-opacity duration-500">
            <div className="bg-black/90 p-2 rounded border border-yellow-900/30 shadow-2xl backdrop-blur-sm">
                {/* Ancho ajustado para 4 barras */}
                <canvas ref={canvasRef} width={48} height={40} className="block" />
                <div className="flex justify-between items-center mt-1 px-1">
                    <span className="text-[8px] text-yellow-700 font-mono tracking-widest">SYS.MON</span>
                    <div className="w-1 h-1 rounded-full bg-green-500 animate-pulse"></div>
                </div>
            </div>
        </div>
    );
};
