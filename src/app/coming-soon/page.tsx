'use client';

import React, { useEffect, useRef } from 'react';
import { DashboardLayout } from '@/layouts/DashboardLayout';

export default function ComingSoonPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // HEX FIELD ANIMATION (Exact canvas animation logic from animation.html)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const REDUCE = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const MONO = "ui-monospace, 'SFMono-Regular', 'SF Mono', Menlo, Consolas, 'Liberation Mono', monospace";
    const CHARS = '0123456789ABCDEF';

    // Color Tints: 0 = cool white (dominant), 1 = muted indigo, 2 = muted gold
    const COLORS = [
      { r: 226, g: 226, b: 236, bloom: 0.7 },
      { r: 96, g: 116, b: 214, bloom: 0.5 },
      { r: 212, g: 168, b: 78, bloom: 0.5 }
    ];

    let DPR = 1;
    let W = 0;
    let H = 0;
    let fontSize = 12;
    let cellW = 14;
    let cellH = 20;
    let pad = 8;
    let sw = 0;
    let sh = 0;
    let cols = 0;
    let rows = 0;

    interface Cell {
      cx: number;
      cy: number;
      vig: number;
      color: number;
      base: number;
      blink: boolean;
      jit: number;
      fs: number;
      fp: number;
      glyph: number;
      next: number;
      gapFast: boolean;
      dx: number;
      dy: number;
    }

    let cells: Cell[] = [];
    let sprites: HTMLCanvasElement[][] = [];

    const rand = (a: number, b: number) => a + Math.random() * (b - a);
    const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);

    function buildSprites() {
      sprites = [];
      for (let c = 0; c < COLORS.length; c++) {
        const row: HTMLCanvasElement[] = [];
        const col = COLORS[c];
        const css = `rgb(${col.r},${col.g},${col.b})`;
        for (let g = 0; g < CHARS.length; g++) {
          const cv = document.createElement('canvas');
          cv.width = Math.max(1, Math.round(sw * DPR));
          cv.height = Math.max(1, Math.round(sh * DPR));
          const x = cv.getContext('2d');
          if (x) {
            x.setTransform(DPR, 0, 0, DPR, 0, 0);
            x.font = `600 ${fontSize}px ${MONO}`;
            x.textAlign = 'center';
            x.textBaseline = 'middle';
            x.shadowColor = css;
            x.shadowBlur = fontSize * col.bloom;
            x.fillStyle = css;
            x.fillText(CHARS.charAt(g), sw / 2, sh / 2 + 0.5);
          }
          row.push(cv);
        }
        sprites.push(row);
      }
    }

    function buildGrid() {
      cells = [];
      for (let r = 0; r < rows; r++) {
        for (let cI = 0; cI < cols; cI++) {
          const cx = (cI + 0.5) / cols;
          const cy = (r + 0.5) / rows;
          const nx = (cx - 0.5) * 2;
          const ny = (cy - 0.5) * 2;
          const r2 = nx * nx * 0.72 + ny * ny;
          const vig = clamp01(1.15 - r2 * 0.9);

          const roll = Math.random();
          const color = roll < 0.025 ? 1 : roll < 0.05 ? 2 : 0;

          let base = 0;
          let blink = false;
          if (color !== 0) {
            base = rand(0.06, 0.2);
          } else if (Math.random() < 0.14) {
            base = rand(0.04, 0.13);
            blink = Math.random() < 0.45;
          }

          const jit = rand(0.55, 1.45);
          const fast = Math.random() < 0.3;

          cells.push({
            cx,
            cy,
            vig,
            color,
            base,
            blink,
            jit,
            fs: rand(blink ? 2.4 : 1.1, blink ? 5.0 : 3.2),
            fp: rand(0, 6.283),
            glyph: (Math.random() * 16) | 0,
            next: rand(0.2, 2.5),
            gapFast: fast,
            dx: cI * cellW + cellW / 2 - sw / 2,
            dy: r * cellH + cellH / 2 - sh / 2
          });
        }
      }
    }

    function resize() {
      if (!canvas) return;
      DPR = Math.min(window.devicePixelRatio || 1, REDUCE ? 1.5 : 2);
      W = window.innerWidth;
      H = window.innerHeight;
      canvas.width = Math.max(1, Math.round(W * DPR));
      canvas.height = Math.max(1, Math.round(H * DPR));
      canvas.style.width = W + 'px';
      canvas.style.height = H + 'px';
      ctx?.setTransform(DPR, 0, 0, DPR, 0, 0);

      fontSize = Math.max(11, Math.min(16, Math.round(W / 110)));
      cellW = Math.round(fontSize * 1.15);
      cellH = Math.round(fontSize * 1.7);
      pad = Math.round(fontSize * 0.6);
      sw = cellW + pad * 2;
      sh = cellH + pad * 2;
      cols = Math.max(1, Math.ceil(W / cellW));
      rows = Math.max(1, Math.ceil(H / cellH));

      buildSprites();
      buildGrid();
    }

    function gauss(nx: number, ny: number, bx: number, by: number, rx: number, ry: number) {
      const dx = (nx - bx) / rx;
      const dy = (ny - by) / ry;
      return Math.exp(-(dx * dx + dy * dy) * 2.2);
    }

    function revealAt(nx: number, ny: number, t: number) {
      const b0x = 0.5 + 0.34 * Math.sin(t * 0.13);
      const b0y = 0.5 + 0.3 * Math.sin(t * 0.1 + 1.3);
      const b1x = 0.5 + 0.38 * Math.sin(t * 0.085 + 2.2);
      const b1y = 0.5 + 0.27 * Math.cos(t * 0.115 + 0.5);
      const b2x = b0x + 0.07 * Math.sin(t * 0.5 + 0.7);
      const b2y = b0y + 0.06 * Math.cos(t * 0.62);
      let r =
        1.1 * gauss(nx, ny, b0x, b0y, 0.36, 0.32) +
        0.9 * gauss(nx, ny, b1x, b1y, 0.32, 0.28) +
        1.35 * gauss(nx, ny, b2x, b2y, 0.14, 0.12);
      if (r > 1) r = 1;
      return r * (0.92 + 0.08 * Math.sin(t * 0.7));
    }

    function render(t: number) {
      if (!ctx) return;
      ctx.clearRect(0, 0, W, H);
      for (let i = 0; i < cells.length; i++) {
        const c = cells[i];
        const rev = revealAt(c.cx, c.cy, t);
        let f = 0.5 + 0.5 * Math.sin(t * c.fs + c.fp);
        if (c.blink) f = f * f * f;
        let a = (c.base + rev * c.jit) * (0.4 + 0.6 * f) * c.vig;
        if (a < 0.015) continue;
        if (a > 1) a = 1;
        ctx.globalAlpha = a;
        if (sprites[c.color] && sprites[c.color][c.glyph]) {
          ctx.drawImage(sprites[c.color][c.glyph], c.dx, c.dy, sw, sh);
        }
      }
      ctx.globalAlpha = 1;
    }

    function mutate(t: number) {
      for (let i = 0; i < cells.length; i++) {
        const c = cells[i];
        if (t >= c.next) {
          c.glyph = (Math.random() * 16) | 0;
          c.next = t + (c.gapFast ? rand(0.2, 0.9) : rand(1.0, 4.0));
        }
      }
    }

    let clock = 0;
    let last = 0;
    let acc = 0;
    let animFrameId: number;
    const STEP = 1 / 45;

    function frame(now: number) {
      let dt = last ? (now - last) / 1000 : 0;
      last = now;
      if (dt > 0.1) dt = 0.1;
      acc += dt;
      if (acc >= STEP) {
        mutate(clock + acc);
        clock += acc;
        render(clock);
        acc = 0;
      }
      animFrameId = requestAnimationFrame(frame);
    }

    resize();
    if (REDUCE) {
      mutate(10);
      render(10);
    } else {
      animFrameId = requestAnimationFrame(frame);
    }

    let rT: NodeJS.Timeout;
    const handleResize = () => {
      clearTimeout(rT);
      rT = setTimeout(() => {
        resize();
        if (REDUCE) {
          mutate(10);
          render(10);
        }
      }, 140);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animFrameId) cancelAnimationFrame(animFrameId);
    };
  }, []);

  return (
    <DashboardLayout title="Coming Soon">
      {/* FIXED FULLSCREEN BACKGROUND CANVAS - EXACTLY LIKE ANIMATION.HTML */}
      <canvas
        ref={canvasRef}
        style={{
          position: 'fixed',
          inset: 0,
          width: '100vw',
          height: '100vh',
          zIndex: 0,
          pointerEvents: 'none',
          display: 'block',
          background: '#000000'
        }}
        aria-hidden="true"
      />

      {/* OVERLAY CONTAINER ON PURE BLACK */}
      <div
        style={{
          position: 'relative',
          zIndex: 10,
          minHeight: '82vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '24px'
        }}
      >
        <div style={{ maxWidth: '680px', textAlign: 'center' }}>
          <blockquote className="monochrome-italic-quote">
            “The masons work in silence beyond the veil; soon, the corridors will stretch into uncharted wings, the tapestries will part to reveal hidden instruments, and the very foundations will hum with a swifter, quieter magic.”
          </blockquote>
        </div>
      </div>

      <style jsx global>{`
        /* SMALL, ELEGANT BLACK & WHITE ITALIC QUOTE */
        .monochrome-italic-quote {
          margin: 0;
          font-family: Georgia, 'Playfair Display', 'Times New Roman', serif;
          font-style: italic;
          font-size: clamp(13px, 1.4vw, 17px);
          font-weight: 400;
          line-height: 1.7;
          letter-spacing: 0.3px;
          color: #ffffff;
          text-align: center;
          opacity: 0;
          /* APPEARS ONLY ONCE WHEN OPENED, FADES IN, HOLDS, THEN DISAPPEARS ONCE */
          animation: singleFadeOnce 8.5s cubic-bezier(0.4, 0, 0.2, 1) 0.4s 1 forwards;
        }

        @keyframes singleFadeOnce {
          0% {
            opacity: 0;
            transform: translateY(8px);
            filter: blur(6px);
          }
          18% {
            opacity: 1;
            transform: translateY(0);
            filter: blur(0px);
          }
          76% {
            opacity: 1;
            transform: translateY(0);
            filter: blur(0px);
          }
          100% {
            opacity: 0;
            transform: translateY(-8px);
            filter: blur(8px);
            visibility: hidden;
          }
        }
      `}</style>
    </DashboardLayout>
  );
}
