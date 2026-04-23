"use client";

import React, { useRef, useEffect } from 'react';

export const ParticleCanvas: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let animationFrameId: number;
        let w: number;
        let h: number;

        // Sparks: small white dots that drift slowly and twinkle
        const sparks: { x: number; y: number; vx: number; vy: number; r: number; a: number; da: number }[] = [];
        const SPARK_COUNT = 80;

        const resize = () => {
            w = canvas.width = window.innerWidth;
            h = canvas.height = window.innerHeight;
        };

        const init = () => {
            resize();
            sparks.length = 0;
            for (let i = 0; i < SPARK_COUNT; i++) {
                sparks.push({
                    x: Math.random() * w,
                    y: Math.random() * h,
                    vx: (Math.random() - 0.5) * 0.12,
                    vy: (Math.random() - 0.5) * 0.12,
                    r: Math.random() * 1.0 + 0.3,
                    a: Math.random() * 0.35 + 0.05,
                    da: (Math.random() - 0.5) * 0.004, // twinkle speed
                });
            }
        };

        const draw = () => {
            ctx.clearRect(0, 0, w, h);

            for (const p of sparks) {
                // Move
                p.x += p.vx;
                p.y += p.vy;

                // Wrap edges
                if (p.x < 0) p.x = w;
                if (p.x > w) p.x = 0;
                if (p.y < 0) p.y = h;
                if (p.y > h) p.y = 0;

                // Twinkle
                p.a += p.da;
                if (p.a > 0.4 || p.a < 0.04) p.da *= -1;

                // Draw white spark dot
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(255, 255, 255, ${p.a})`;
                ctx.fill();
            }

            animationFrameId = requestAnimationFrame(draw);
        };

        init();
        draw();

        window.addEventListener('resize', resize);
        return () => {
            cancelAnimationFrame(animationFrameId);
            window.removeEventListener('resize', resize);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                zIndex: 0,
                pointerEvents: 'none',
                opacity: 0.5,
            }}
        />
    );
};
