'use client';

import React, { useEffect, useRef, useState } from 'react';
import { DashboardLayout } from '@/layouts/DashboardLayout';

const UPCOMING_FEATURES = [
  {
    icon: '🤖',
    title: 'AI Personal Study Assistant',
    badge: 'In Development',
    category: 'AI & Machine Learning',
    description: '24/7 intelligent tutor offering instant step-by-step math solutions, concept breakdowns, and personalized study schedules.'
  },
  {
    icon: '🎮',
    title: 'Live Multiplayer Quiz Arena',
    badge: 'Q3 2026',
    category: 'Gamification',
    description: 'Challenge classmates in real-time speed quizzes, climb school leaderboards, and win seasonal trophy badges.'
  },
  {
    icon: '🔬',
    title: '3D Virtual Science Lab',
    badge: 'Beta Coming Soon',
    category: 'Interactive Physics & Chemistry',
    description: 'Perform virtual chemical reactions, circuit building, and optics experiments directly in your browser with full 3D interaction.'
  },
  {
    icon: '🎙️',
    title: 'Voice Notes & Smart Summarizer',
    badge: 'Planned',
    category: 'Productivity',
    description: 'Record audio study notes and automatically convert them into structured bullet-point summaries and revision flashcards.'
  },
  {
    icon: '🏆',
    title: 'Gamified Scholar Guilds',
    badge: 'Planned',
    category: 'Social Learning',
    description: 'Form study groups with friends, tackle collective weekly learning quests, and unlock custom avatar themes together.'
  },
  {
    icon: '📊',
    title: 'Smart Predictive Analytics',
    badge: 'Research Phase',
    category: 'AI Analytics',
    description: 'Advanced diagnostic algorithms that detect your weak topics before exams and recommend targeted practice questions.'
  }
];

export default function ComingSoonPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [notifyEmail, setNotifyEmail] = useState('');
  const [notified, setNotified] = useState(false);

  // HEX FIELD ANIMATION (Exact canvas animation logic from animation.html)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const REDUCE = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const MONO = "ui-monospace, 'SFMono-Regular', 'SF Mono', Menlo, Consolas, 'Liberation Mono', monospace";
    const CHARS = '0123456789ABCDEF';

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
      const parent = canvas.parentElement || document.body;
      W = parent.clientWidth || window.innerWidth;
      H = parent.clientHeight || window.innerHeight;
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

  const handleNotify = (e: React.FormEvent) => {
    e.preventDefault();
    if (!notifyEmail.trim()) return;
    setNotified(true);
    setNotifyEmail('');
  };

  return (
    <DashboardLayout title="Coming Soon Features">
      <div
        style={{
          position: 'relative',
          borderRadius: 'var(--radius-lg)',
          overflow: 'hidden',
          minHeight: '85vh',
          background: '#000000',
          padding: '32px 24px',
          color: '#ffffff'
        }}
      >
        {/* ========================================================== */}
        {/* HEX DATA FIELD ANIMATION CANVAS (RUNS IN BACKGROUND)       */}
        {/* ========================================================== */}
        <canvas
          ref={canvasRef}
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            zIndex: 0,
            pointerEvents: 'none',
            display: 'block'
          }}
          aria-hidden="true"
        />

        {/* OVERLAY TINT FOR CONTENT READABILITY */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'radial-gradient(100% 80% at 50% 30%, rgba(0,0,0,0.4), rgba(0,0,0,0.85)), linear-gradient(180deg, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.85) 100%)',
            zIndex: 1,
            pointerEvents: 'none'
          }}
        />

        {/* UI OVERLAY CONTENT (SITS ABOVE CANVAS ANIMATION) */}
        <div
          style={{
            position: 'relative',
            zIndex: 10,
            maxWidth: '1080px',
            margin: '0 auto'
          }}
        >
          {/* HEADER HERO */}
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '6px 16px',
                borderRadius: '999px',
                background: 'rgba(168, 85, 247, 0.14)',
                border: '1px solid rgba(168, 85, 247, 0.35)',
                color: '#e9d5ff',
                fontSize: '12px',
                fontWeight: 700,
                letterSpacing: '1px',
                textTransform: 'uppercase',
                marginBottom: '16px'
              }}
            >
              <span>✨</span> Next-Gen Innovations
            </div>

            <h1
              style={{
                margin: 0,
                fontSize: 'clamp(28px, 4vw, 46px)',
                fontWeight: 800,
                letterSpacing: '-1px',
                background: 'linear-gradient(135deg, #ffffff 30%, #a855f7 70%, #ec4899 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}
            >
              Coming Soon Features
            </h1>

            <p
              style={{
                maxWidth: '640px',
                margin: '12px auto 0',
                color: '#b6b2cc',
                fontSize: '15px',
                lineHeight: 1.6
              }}
            >
              We are actively developing powerful AI tools, interactive 3D science labs, and real-time multiplayer features to elevate your learning experience to the next level.
            </p>
          </div>

          {/* UPCOMING FEATURES CARDS GRID */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
              gap: '20px',
              marginBottom: '48px'
            }}
          >
            {UPCOMING_FEATURES.map((feat) => (
              <div
                key={feat.title}
                style={{
                  position: 'relative',
                  background: 'linear-gradient(160deg, rgba(26,22,38,0.72), rgba(36,30,52,0.65))',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  backdropFilter: 'blur(16px)',
                  WebkitBackdropFilter: 'blur(16px)',
                  borderRadius: '20px',
                  padding: '22px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                  boxShadow: '0 16px 40px -20px rgba(0,0,0,0.9)',
                  transition: 'transform 0.25s ease, border-color 0.25s ease'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '32px' }}>{feat.icon}</span>
                  <span
                    style={{
                      fontSize: '11px',
                      fontWeight: 700,
                      padding: '4px 10px',
                      borderRadius: '999px',
                      background: 'rgba(168, 85, 247, 0.18)',
                      color: '#a855f7',
                      border: '1px solid rgba(168, 85, 247, 0.3)'
                    }}
                  >
                    {feat.badge}
                  </span>
                </div>

                <div>
                  <span style={{ fontSize: '11px', color: '#857fa0', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 700 }}>
                    {feat.category}
                  </span>
                  <h3 style={{ margin: '4px 0 0 0', fontSize: '18px', fontWeight: 700, color: '#ffffff' }}>
                    {feat.title}
                  </h3>
                </div>

                <p style={{ margin: 0, fontSize: '13px', color: '#b6b2cc', lineHeight: 1.55 }}>
                  {feat.description}
                </p>
              </div>
            ))}
          </div>

          {/* EARLY ACCESS / NOTIFY ME CARD */}
          <div
            style={{
              background: 'linear-gradient(135deg, rgba(168,85,247,0.18), rgba(99,102,241,0.18))',
              border: '1px solid rgba(168,85,247,0.35)',
              backdropFilter: 'blur(20px)',
              borderRadius: '24px',
              padding: '32px 24px',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '16px'
            }}
          >
            <span style={{ fontSize: '36px' }}>🚀</span>
            <h2 style={{ margin: 0, fontSize: '22px', fontWeight: 800, color: '#ffffff' }}>
              Want Early Access to New Features?
            </h2>
            <p style={{ margin: 0, fontSize: '13.5px', color: '#b6b2cc', maxWidth: '520px', lineHeight: 1.5 }}>
              Enter your email to get notified the minute new AI tools, 3D science labs, and multiplayer quizzes are launched.
            </p>

            {notified ? (
              <div
                style={{
                  background: 'rgba(52, 211, 153, 0.15)',
                  border: '1px solid #34d399',
                  color: '#34d399',
                  padding: '12px 24px',
                  borderRadius: '12px',
                  fontWeight: 700,
                  fontSize: '14px'
                }}
              >
                🎉 Thank you! You're on the early access VIP list.
              </div>
            ) : (
              <form
                onSubmit={handleNotify}
                style={{
                  display: 'flex',
                  gap: '10px',
                  maxWidth: '460px',
                  width: '100%',
                  flexWrap: 'wrap'
                }}
              >
                <input
                  type="email"
                  placeholder="Enter your student email..."
                  value={notifyEmail}
                  onChange={(e) => setNotifyEmail(e.target.value)}
                  style={{
                    flex: 1,
                    minWidth: '220px',
                    padding: '12px 16px',
                    borderRadius: '12px',
                    background: 'rgba(255, 255, 255, 0.08)',
                    border: '1px solid rgba(255, 255, 255, 0.18)',
                    color: '#ffffff',
                    fontSize: '13.5px',
                    outline: 'none'
                  }}
                  required
                />
                <button
                  type="submit"
                  style={{
                    padding: '12px 22px',
                    borderRadius: '12px',
                    background: 'linear-gradient(135deg, #a855f7, #6366f1)',
                    border: 'none',
                    color: '#ffffff',
                    fontWeight: 700,
                    fontSize: '13.5px',
                    cursor: 'pointer',
                    boxShadow: '0 4px 16px rgba(168,85,247,0.4)',
                    transition: 'transform 0.15s ease'
                  }}
                >
                  Notify Me ⚡
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
