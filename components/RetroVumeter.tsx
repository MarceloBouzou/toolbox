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

    // Métricas
    const metrics = useRef({
        dx: 0,
        dy: 0,
        scroll: 0,
        clicks: 0
    });

    const lastPos = useRef({ x: 0, y: 0 });
    const lastScroll = useRef(0);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            const dx = Math.abs(e.clientX - lastPos.current.x);
            const dy = Math.abs(e.clientY - lastPos.current.y);

            // Sensibilidad
            metrics.current.dx = Math.min(metrics.current.dx + (dx / 50), 1);
            metrics.current.dy = Math.min(metrics.current.dy + (dy / 50), 1);

            lastPos.current = { x: e.clientX, y: e.clientY };
        };

        const handleScroll = () => {
            const currentScroll = window.scrollY;
            const diff = Math.abs(currentScroll - lastScroll.current);
            metrics.current.scroll = Math.min(metrics.current.scroll + (diff / 30), 1);
            lastScroll.current = currentScroll;
        };

        const handleClick = () => { metrics.current.clicks = 1.0; };

        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('scroll', handleScroll);
        window.addEventListener('click', handleClick);

        let animationFrameId: number;
        let colorOffset = 0;

        const render = () => {
            const canvas = canvasRef.current;
            if (!canvas) return;
            const ctx = canvas.getContext('2d');
            if (!ctx) return;

            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Decaimiento Rápido (Snappy)
            metrics.current.dx *= 0.80;
            metrics.current.dy *= 0.80;
            metrics.current.scroll *= 0.80;
            metrics.current.clicks *= 0.85;

            // Magnitud Vectorial (Velocidad General)
            const magnitude = Math.min(Math.sqrt(
                metrics.current.dx ** 2 +
                metrics.current.dy ** 2 +
                metrics.current.scroll ** 2
            ), 1);

            const values = [
                metrics.current.dx,    // H
                metrics.current.dy,    // V
                metrics.current.scroll,// S
                magnitude,             // Mag
                metrics.current.clicks // Clk
            ];

            const barWidth = 8;
            const gap = 4;
            const maxHeight = canvas.height;
            colorOffset += 0.5; // Más rápido el ciclo de color

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
                {/* Ancho ajustado para 5 barras: 5 * (8+4) - 4 = 56 approx -> 60 safe */}
                <canvas ref={canvasRef} width={60} height={40} className="block" />
                <div className="flex justify-between items-center mt-1 px-1">
                    <span className="text-[8px] text-yellow-700 font-mono tracking-widest">SYS.MON</span>
                    <div className="w-1 h-1 rounded-full bg-green-500 animate-pulse"></div>
                </div>
            </div>
        </div>
    );
};
