'use client';

import React, { useEffect, useRef } from 'react';

export type WaveFieldProps = {
  lineCount?: number;
  glow?: number;
  speed?: number;
  className?: string;
};

export function WaveField({
  lineCount = 18,
  glow = 1.0,
  speed = 1.0,
  className
}: WaveFieldProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    const TAU = Math.PI * 2;
    const rand = (a: number, b: number) => a + Math.random() * (b - a);
    const clamp = (v: number, lo: number, hi: number) => (v < lo ? lo : v > hi ? hi : v);
    const grey = (l: number, a: number) => `hsla(0,0%,${l.toFixed(0)}%,${a})`;

    let W = 0, H = 0, DPR = 1;
    let lines: any[] = [];

    function envelope(nx: number) {
      const g1 = Math.exp(-Math.pow((nx - 0.62) / 0.3, 2));
      const g2 = 0.5 * Math.exp(-Math.pow((nx - 0.18) / 0.22, 2));
      return clamp(g1 + g2, 0, 1.4);
    }

    function yAt(L: any, nx: number, t: number, pmod: number) {
      const a1 = nx * L.freq * TAU + L.phase + t * L.spd + pmod;
      const a2 = nx * L.freq * 2.3 * TAU + L.phase * 1.7 + t * L.spd * 0.7 + pmod;
      const wave = 0.7 * Math.sin(a1) + 0.3 * Math.sin(a2);
      const sway = Math.sin(t * 0.25 + L.swayPhase) * H * 0.02;
      return L.baseY + L.ampF * H * envelope(nx) * wave + sway;
    }

    function buildLines() {
      lines = [];
      for (let i = 0; i < lineCount; i++) {
        const sparks: any[] = [];
        const sc = Math.floor(rand(1, 4));
        for (let k = 0; k < sc; k++) {
          sparks.push({
            p: Math.random(),
            speed: rand(0.015, 0.05) * (Math.random() < 0.5 ? -1 : 1),
            size: rand(1.4, 3.2)
          });
        }
        lines.push({
          ampF: 0.13 * rand(0.6, 1.5),
          baseY: 0,
          baseFrac: (i - (lineCount - 1) / 2) * 0.013,
          freq: rand(0.8, 2.0),
          phase: rand(0, TAU),
          spd: rand(0.15, 0.42) * (Math.random() < 0.5 ? -1 : 1),
          l: rand(72, 94),
          bright: rand(0.7, 1.25),
          swayPhase: rand(0, TAU),
          sparks
        });
      }
    }

    function resize() {
      if (!canvas || !ctx) return;
      DPR = Math.min(window.devicePixelRatio || 1, 2);
      W = canvas.clientWidth;
      H = canvas.clientHeight;
      canvas.width = Math.floor(W * DPR);
      canvas.height = Math.floor(H * DPR);
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
      for (let i = 0; i < lines.length; i++) {
        lines[i].baseY = H * 0.5 + lines[i].baseFrac * H;
      }
    }

    const ptr = { x: 0, y: 0, cx: 0, cy: 0, active: false, last: 0 };
    const onPointer = (e: PointerEvent) => {
      ptr.x = e.clientX / window.innerWidth - 0.5;
      ptr.y = e.clientY / window.innerHeight - 0.5;
      ptr.active = true;
      ptr.last = performance.now();
    };
    window.addEventListener('pointermove', onPointer, { passive: true });

    const PASSES = [
      { w: 16, a: 0.022 },
      { w: 7, a: 0.055 },
      { w: 2.6, a: 0.2 },
      { w: 1.1, a: 0.85 }
    ];

    let rafId = 0;
    let running = true;

    function draw(t: number) {
      if (!ctx) return;
      const idle = !ptr.active || performance.now() - ptr.last > 1400;
      const autoX = Math.sin(t * 0.13) * 0.05;
      const autoY = Math.cos(t * 0.1) * 0.04;
      const gx = (idle ? autoX : ptr.x) * 0.55;
      const gy = (idle ? autoY : ptr.y) * 0.55;
      ptr.cx += (gx - ptr.cx) * 0.06;
      ptr.cy += (gy - ptr.cy) * 0.06;

      const pmod = ptr.cx * 0.9;
      const offX = ptr.cx * 26;
      const offY = ptr.cy * 18;

      ctx.clearRect(0, 0, W, H);
      ctx.globalCompositeOperation = 'lighter';
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      const segs = Math.max(40, Math.floor(W / 9));

      for (let i = 0; i < lines.length; i++) {
        const L = lines[i];
        const path = new Path2D();
        const pts: any[] = [];

        for (let s = 0; s <= segs; s++) {
          const nx = s / segs;
          const x = nx * W + offX;
          const y = yAt(L, nx, t, pmod) + offY;
          if (s === 0) path.moveTo(x, y);
          else path.lineTo(x, y);
          pts.push({ x, y });
        }

        for (let p = 0; p < PASSES.length; p++) {
          const ps = PASSES[p];
          ctx.strokeStyle = grey(L.l, ps.a * L.bright * glow);
          ctx.lineWidth = ps.w;
          ctx.stroke(path);
        }

        if (pts.length > 0 && L.sparks && L.sparks.length) {
          for (let q = 0; q < L.sparks.length; q++) {
            const sp = L.sparks[q];
            sp.p += sp.speed * 0.016 * speed;
            if (sp.p > 1) sp.p -= 1;
            else if (sp.p < 0) sp.p += 1;
            const idx = Math.min(pts.length - 1, Math.max(0, Math.floor(sp.p * (pts.length - 1))));
            const pt = pts[idx];
            const r = sp.size * 2.4;
            const g = ctx.createRadialGradient(pt.x, pt.y, 0, pt.x, pt.y, r);
            g.addColorStop(0, `rgba(255,255,255,${(0.9 * glow).toFixed(2)})`);
            g.addColorStop(0.4, `rgba(220,220,220,${(0.55 * glow).toFixed(2)})`);
            g.addColorStop(1, 'rgba(255,255,255,0)');
            ctx.fillStyle = g;
            ctx.beginPath();
            ctx.arc(pt.x, pt.y, r, 0, TAU);
            ctx.fill();
          }
        }
      }

      ctx.globalCompositeOperation = 'source-over';
    }

    function frame(now: number) {
      if (!running) return;
      draw((now / 1000) * speed);
      rafId = requestAnimationFrame(frame);
    }

    buildLines();
    resize();
    rafId = requestAnimationFrame(frame);

    window.addEventListener('resize', resize);

    const io = new IntersectionObserver(([entry]) => {
      running = entry.isIntersecting;
      if (running && rafId === 0) rafId = requestAnimationFrame(frame);
    });
    io.observe(canvas);

    return () => {
      running = false;
      if (rafId) cancelAnimationFrame(rafId);
      window.removeEventListener('pointermove', onPointer);
      window.removeEventListener('resize', resize);
      io.disconnect();
    };
  }, [lineCount, glow, speed]);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{ display: 'block', width: '100%', height: '100%' }}
      aria-hidden="true"
    />
  );
}
