'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

const WORDS = [
  'Honesty',
  'Loyalty',
  'Bravery',
  'Self-Discipline',
  'Fortitude',
  'Adaptability',
  'Commitment',
  'Excellence',
  'Unity',
  'Faith',
  'Sacrifice',
  'Learning',
  'Curiosity'
];

export default function LandingPage() {
  const { user, profile } = useAuth();
  const userName = profile?.name || (user?.email ? user.email.split('@')[0] : null);
  useEffect(() => {
    const REDUCE = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // 1) Values Scroll Engine
    const section = document.getElementById('valuesSection');
    const column = document.getElementById('valuesColumn');
    const arrow = document.getElementById('valuesArrow');
    const intro = document.getElementById('vIntro');
    const outro = document.getElementById('vOutro');
    const counter = document.getElementById('vCounter');
    const vNum = document.getElementById('vNum');
    const vWord = document.getElementById('vWord');

    const LAST = WORDS.length - 1;
    let els: HTMLElement[] = [];

    if (column) {
      els = Array.from(column.children) as HTMLElement[];
      // Fallback if empty
      if (els.length === 0) {
        els = WORDS.map((w) => {
          const el = document.createElement('p');
          el.className = 'value-word';
          el.textContent = w;
          column.appendChild(el);
          return el;
        });
      }
    }

    if (REDUCE) {
      document.body.classList.add('reduce');
    } else if (section && column && els.length > 0) {
      const INTRO_HOLD = 0.45;
      const INTRO_FADE = 0.55;
      const VALUES_ANCHOR = INTRO_HOLD + INTRO_FADE;
      const VALUE_STEP = 0.70;
      const VALUES_END = VALUES_ANCHOR + LAST * VALUE_STEP;
      const HOLD_LAST = 0.45;
      const OUTRO_FADE = 0.55;
      const OUTRO_HOLD = 0.60;
      const TOTAL = VALUES_END + HOLD_LAST + OUTRO_FADE + OUTRO_HOLD;

      const X_SKEW = 22;
      const BLUR_PER = 7;
      const BLUR_MAX = 16;

      let gap = 120;
      let fontPx = 80;

      const layout = () => {
        section.style.height = `${(1 + TOTAL) * 100}vh`;
        if (els[0]) {
          fontPx = parseFloat(window.getComputedStyle(els[0]).fontSize) || 80;
        }
        gap = Math.min(220, Math.max(80, fontPx * 1.55));
      };

      const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);

      const update = () => {
        const V = window.innerHeight;
        const rect = section.getBoundingClientRect();
        const max = Math.max(rect.height - V, 0);
        const pinned = Math.min(Math.max(-rect.top, 0), max);

        const vf = (pinned - VALUES_ANCHOR * V) / (VALUE_STEP * V);

        const inStart = INTRO_HOLD * V;
        const inEnd = VALUES_ANCHOR * V;
        const outStart = (VALUES_END + HOLD_LAST) * V;
        const outEnd = outStart + OUTRO_FADE * V;

        let valuesOp: number;
        if (pinned < inStart) valuesOp = 0;
        else if (pinned < inEnd) valuesOp = (pinned - inStart) / (inEnd - inStart);
        else if (pinned < outStart) valuesOp = 1;
        else if (pinned < outEnd) valuesOp = 1 - (pinned - outStart) / (outEnd - outStart);
        else valuesOp = 0;

        const introOp =
          pinned <= INTRO_HOLD * V
            ? 1
            : pinned >= inEnd
            ? 0
            : 1 - (pinned - INTRO_HOLD * V) / (inEnd - INTRO_HOLD * V);

        const outroOp =
          pinned <= outStart
            ? 0
            : pinned >= outEnd
            ? 1
            : (pinned - outStart) / (outEnd - outStart);

        if (intro) intro.style.opacity = clamp01(introOp).toFixed(3);
        if (outro) outro.style.opacity = clamp01(outroOp).toFixed(3);
        if (column) column.style.opacity = clamp01(valuesOp).toFixed(3);
        if (arrow) arrow.style.opacity = clamp01(valuesOp).toFixed(3);
        if (counter) counter.style.opacity = clamp01(valuesOp).toFixed(3);

        for (let i = 0; i < els.length; i++) {
          const d = i - vf;
          const ad = Math.abs(d);
          const y = d * gap;
          const x = d * X_SKEW;
          const sc = Math.max(0.8, 1 - Math.min(ad, 2) * 0.07);
          const blur = Math.min(BLUR_MAX, ad * BLUR_PER);
          const op = Math.max(0, 1 - ad * 0.5);

          const el = els[i];
          el.style.transform = `translateY(-50%) translate(${x.toFixed(1)}px,${y.toFixed(
            1
          )}px) scale(${sc.toFixed(3)})`;
          el.style.filter = `blur(${blur.toFixed(1)}px)`;
          el.style.opacity = op.toFixed(3);
          el.style.zIndex = String(100 - Math.round(ad));
        }

        const focused = Math.min(LAST, Math.max(0, Math.round(vf)));
        if (vNum) vNum.textContent = String(focused + 1).padStart(2, '0');
        if (vWord) vWord.textContent = WORDS[focused];
      };

      let ticking = false;
      const req = () => {
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(() => {
          update();
          ticking = false;
        });
      };

      layout();
      update();
      window.addEventListener('scroll', req, { passive: true });
      window.addEventListener('resize', () => {
        layout();
        req();
      });

      if (document.fonts && document.fonts.ready) {
        document.fonts.ready.then(() => {
          layout();
          update();
        });
      }
    }

    // 2) Floating Particles
    const field = document.getElementById('particles');
    if (field && !field.hasChildNodes()) {
      const COUNT = window.innerWidth < 640 ? 16 : 30;
      for (let i = 0; i < COUNT; i++) {
        const m = document.createElement('span');
        m.className = 'mote';
        const size = (Math.random() * 5 + 2).toFixed(1);
        const left = (Math.random() * 100).toFixed(2);
        const top = (Math.random() * 100).toFixed(2);
        const dur = (Math.random() * 14 + 12).toFixed(1);
        const delay = -(Math.random() * 26).toFixed(1);
        const dx = (Math.random() * 90 - 45).toFixed(0);
        const op = (Math.random() * 0.5 + 0.35).toFixed(2);

        m.style.width = `${size}px`;
        m.style.height = `${size}px`;
        m.style.left = `${left}%`;
        m.style.top = `${top}%`;
        m.style.setProperty('--dx', `${dx}px`);
        m.style.setProperty('--o', op);
        m.style.animationDuration = `${dur}s`;
        m.style.animationDelay = `${delay}s`;
        if (REDUCE) m.style.display = 'none';
        field.appendChild(m);
      }
    }

    // 3) Classroom Parallax
    const scene = document.getElementById('classroom');
    let animId: number | null = null;
    if (scene && !REDUCE) {
      let targetX = 0;
      let targetY = 0;
      let curX = 0;
      let curY = 0;
      let hasPointer = false;

      const onPointerMove = (e: PointerEvent) => {
        const r = scene.getBoundingClientRect();
        targetX = (e.clientX - r.left) / r.width - 0.5;
        targetY = (e.clientY - r.top) / r.height - 0.5;
        hasPointer = true;
      };

      const onPointerLeave = () => {
        hasPointer = false;
      };

      scene.addEventListener('pointermove', onPointerMove, { passive: true });
      scene.addEventListener('pointerleave', onPointerLeave);

      const tick = (now: number) => {
        const t = now / 6000;
        const gx = hasPointer ? targetX : Math.sin(t) * 0.045;
        const gy = hasPointer ? targetY : Math.cos(t * 0.8) * 0.035;
        curX += (gx - curX) * 0.06;
        curY += (gy - curY) * 0.06;

        scene.style.setProperty('--px', curX.toFixed(4));
        scene.style.setProperty('--py', curY.toFixed(4));
        animId = requestAnimationFrame(tick);
      };

      animId = requestAnimationFrame(tick);
    }

    // 4) Navbar Background on Scroll
    const nav = document.getElementById('navbar');
    const onNavScroll = () => {
      if (nav) {
        if (window.scrollY > 40) nav.classList.add('scrolled');
        else nav.classList.remove('scrolled');
      }
    };
    onNavScroll();
    window.addEventListener('scroll', onNavScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', onNavScroll);
      if (animId) cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <div className="landing-wrapper">
      {/* Fontsource Poppins Fonts */}
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@fontsource/poppins/400.css" />
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@fontsource/poppins/500.css" />
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@fontsource/poppins/600.css" />
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@fontsource/poppins/700.css" />
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@fontsource/poppins/800.css" />

      <style>{`
        *, *::before, *::after { box-sizing: border-box; }
        .landing-wrapper {
          font-family: "Poppins", system-ui, -apple-system, Segoe UI, Roboto, sans-serif;
          background: #000; color: #fff; position: relative; overflow: visible; -webkit-font-smoothing: antialiased;
        }

        .navbar {
          position: fixed; top: 0; left: 0; right: 0; z-index: 1000;
          display: flex; align-items: center; justify-content: space-between; gap: 16px;
          padding: 14px clamp(18px, 4vw, 56px);
          transition: background .3s ease, backdrop-filter .3s ease, border-color .3s ease, padding .3s ease;
          border-bottom: 1px solid transparent;
        }
        .navbar.scrolled {
          background: rgba(8, 10, 22, .55);
          backdrop-filter: blur(14px); -webkit-backdrop-filter: blur(14px);
          border-bottom: 1px solid rgba(255,255,255,.08);
          padding-top: 10px; padding-bottom: 10px;
        }
        .brand {
          display: flex; align-items: center; gap: 10px;
          font-weight: 700; letter-spacing: .3px; font-size: clamp(15px, 1.5vw, 19px);
          text-shadow: 0 2px 14px rgba(0,0,0,.6); text-decoration: none; color: #fff;
        }
        .brand .dot {
          width: 30px; height: 30px; border-radius: 9px;
          background: linear-gradient(135deg, #7c5cff, #22d3ee);
          box-shadow: 0 6px 18px rgba(124,92,255,.5);
          display: grid; place-items: center; font-size: 15px;
        }
        .nav-auth { display: flex; align-items: center; gap: 10px; }

        .btn {
          border: 0; cursor: pointer; font-family: inherit; font-weight: 600;
          padding: 10px 18px; border-radius: 999px; font-size: 13.5px;
          transition: transform .18s ease, box-shadow .25s ease, background .25s;
          text-decoration: none; display: inline-flex; align-items: center; gap: 8px;
        }
        .btn:active { transform: translateY(1px) scale(.98); }
        .btn-ghost {
          background: rgba(255,255,255,.10); color: #fff;
          border: 1px solid rgba(255,255,255,.25); backdrop-filter: blur(8px);
        }
        .btn-ghost:hover { background: rgba(255,255,255,.18); transform: translateY(-2px); }
        .btn-primary {
          color: #fff;
          background: linear-gradient(135deg, #7c5cff 0%, #4f8bff 50%, #22d3ee 100%);
          box-shadow: 0 10px 26px rgba(79,139,255,.45);
        }
        .btn-primary:hover { transform: translateY(-2px); box-shadow: 0 14px 34px rgba(79,139,255,.6); }

        .values-section {
          position: relative; background: #000; height: 1200vh; width: 100%; overflow: visible;
        }
        .values-stage {
          position: sticky; top: 0; height: 100vh; width: 100%; overflow: hidden; z-index: 10;
          --word-left: 24%;
          background: radial-gradient(120% 80% at 50% 50%, rgba(124,92,255,.06), transparent 60%), #000;
        }

        .v-overlay {
          position: absolute; inset: 0;
          display: flex; flex-direction: column; align-items: center; justify-content: center;
          text-align: center; padding: 90px clamp(22px, 7vw, 80px) 80px; gap: 14px;
          will-change: opacity;
        }
        .v-overlay .kicker {
          font-size: 12px; letter-spacing: 4px; text-transform: uppercase;
          color: #b794ff; font-weight: 600;
        }
        .v-overlay h2 {
          margin: 0; font-size: clamp(26px, 5vw, 58px); line-height: 1.08;
          font-weight: 800; letter-spacing: -1px; max-width: 18ch;
        }
        .v-overlay h2 .accent {
          background: linear-gradient(100deg, #ffd27a, #ff9ec4 45%, #9ec5ff 80%, #7df0ff);
          -webkit-background-clip: text; background-clip: text; color: transparent;
        }
        .v-overlay p {
          margin: 0; max-width: 46ch; font-size: clamp(14px, 1.5vw, 18px); line-height: 1.7; color: rgba(255,255,255,.72);
        }
        .v-overlay .hint {
          margin-top: 8px; font-size: 12.5px; letter-spacing: 1px; color: rgba(255,255,255,.5);
          display: inline-flex; align-items: center; gap: 8px;
        }
        .v-overlay .hint .arrow-down { display: inline-block; animation: bob 1.6s ease-in-out infinite; }
        @keyframes bob { 0%,100%{ transform: translateY(0);} 50%{ transform: translateY(5px);} }

        .values-column { position: absolute; inset: 0; opacity: 0; }
        .value-word {
          position: absolute; top: 50%; left: var(--word-left); margin: 0;
          font-weight: 800; letter-spacing: -1.5px; line-height: 1; white-space: nowrap;
          color: #fff; font-size: clamp(28px, 7vw, 84px); transform-origin: left center;
          transform: translateY(-50%); opacity: 0; filter: blur(0px);
          will-change: transform, opacity, filter; text-shadow: 0 4px 30px rgba(0,0,0,.5);
        }

        .values-arrow {
          position: absolute; top: 50%; left: var(--word-left);
          transform: translateY(-50%) translateX(calc(-100% - 16px));
          font-size: clamp(28px, 5vw, 64px); font-weight: 300; color: #fff;
          opacity: 0; will-change: opacity; pointer-events: none;
        }

        .v-counter {
          position: absolute; top: clamp(78px, 11vh, 116px); left: 50%;
          transform: translateX(-50%); display: flex; align-items: baseline; gap: 8px;
          font-variant-numeric: tabular-nums; opacity: 0; will-change: opacity; pointer-events: none;
        }
        .v-counter #vNum { font-size: 15px; font-weight: 700; letter-spacing: 1px; color: #fff; }
        .v-counter .v-counter-sep { color: rgba(255,255,255,.35); font-weight: 500; }
        .v-counter .v-counter-total { font-size: 13px; color: rgba(255,255,255,.45); }
        .v-counter .v-counter-word {
          margin-left: 8px; font-size: 12px; letter-spacing: 3px; text-transform: uppercase;
          color: #b794ff; font-weight: 600;
        }

        .v-tag {
          position: absolute; bottom: 22px;
          font-size: 11px; letter-spacing: 2px; text-transform: uppercase; color: #b794ff; opacity: .85;
        }
        .v-tag.left { left: clamp(18px, 4vw, 56px); }
        .v-tag.right { right: clamp(18px, 4vw, 56px); color: rgba(255,255,255,.45); }

        .scene {
          position: relative; width: 100%; min-height: 100svh;
          overflow: hidden; isolation: isolate; background: #0b1020;
          --px: 0; --py: 0;
        }
        .layer { position: absolute; inset: 0; pointer-events: none; }

        .bg-parallax {
          z-index: 1; transform: translate3d(calc(var(--px) * -16px), calc(var(--py) * -16px), 0);
          will-change: transform; transition: transform .25s ease-out;
        }
        .bg-image {
          position: absolute; inset: -6%;
          background-image: url("/images/classroom-poster.jpg");
          background-size: cover; background-position: center 35%; background-repeat: no-repeat;
          animation: kenburns 32s ease-in-out infinite alternate; will-change: transform;
        }
        @keyframes kenburns {
          0% { transform: scale(1.06) translate3d(0,0,0); }
          50% { transform: scale(1.13) translate3d(-1.5%,-1%,0); }
          100% { transform: scale(1.18) translate3d(1.5%,-2.5%,0); }
        }

        .bg-tint {
          z-index: 2;
          background:
            radial-gradient(120% 90% at 50% 120%, rgba(8,12,28,.55), transparent 60%),
            radial-gradient(140% 120% at 50% 50%, transparent 45%, rgba(6,9,22,.55) 100%),
            linear-gradient(180deg, rgba(8,12,28,.66) 0%, rgba(8,12,28,.20) 32%, rgba(8,12,28,.12) 55%, rgba(8,12,28,.62) 100%),
            linear-gradient(90deg, rgba(8,12,28,.5) 0%, transparent 45%);
        }

        .rays-parallax {
          z-index: 3; transform: translate3d(calc(var(--px) * 10px), calc(var(--py) * 10px), 0);
          will-change: transform; transition: transform .25s ease-out;
        }
        .rays {
          position: absolute; top: -25%; right: -10%; width: 80%; height: 150%;
          background: repeating-linear-gradient(105deg,
            rgba(255,236,179,0) 0px, rgba(255,236,179,0) 26px,
            rgba(255,236,179,.16) 40px, rgba(255,236,179,0) 70px);
          filter: blur(6px); mix-blend-mode: screen; transform-origin: top right;
          opacity: .55; animation: raypulse 9s ease-in-out infinite alternate;
          -webkit-mask-image: radial-gradient(70% 70% at 80% 20%, #000 0%, transparent 75%);
          mask-image: radial-gradient(70% 70% at 80% 20%, #000 0%, transparent 75%);
        }
        @keyframes raypulse {
          0% { opacity: .35; transform: rotate(-2deg) scaleY(1); }
          100% { opacity: .75; transform: rotate(2deg) scaleY(1.06); }
        }

        .particles-parallax {
          z-index: 4; transform: translate3d(calc(var(--px) * 26px), calc(var(--py) * 26px), 0);
          will-change: transform; transition: transform .25s ease-out;
        }
        .particles { position: absolute; inset: 0; overflow: hidden; }
        .mote {
          position: absolute; top: 100%; border-radius: 50%;
          background: radial-gradient(circle at 35% 35%, #fff7e0, rgba(255,240,200,.25) 60%, transparent 70%);
          box-shadow: 0 0 6px rgba(255,240,200,.6);
          animation-name: floatUp; animation-timing-function: linear;
          animation-iteration-count: infinite; will-change: transform, opacity;
        }
        @keyframes floatUp {
          0% { transform: translate3d(0,0,0) scale(.8); opacity: 0; }
          12% { opacity: var(--o,.8); }
          85% { opacity: var(--o,.8); }
          100% { transform: translate3d(var(--dx,20px), -120vh, 0) scale(1.1); opacity: 0; }
        }

        .fg-parallax {
          z-index: 5; transform: translate3d(calc(var(--px) * -7px), calc(var(--py) * -7px), 0);
          will-change: transform; transition: transform .25s ease-out; pointer-events: none;
        }
        .hero {
          position: absolute; inset: 0;
          display: flex; flex-direction: column; justify-content: center; align-items: flex-start;
          gap: clamp(14px, 2vw, 22px);
          padding: clamp(110px, 16vh, 170px) clamp(20px, 6vw, 90px) clamp(70px, 12vh, 120px);
          max-width: 1200px; margin: 0 auto; width: 100%;
        }
        .badge {
          pointer-events: auto; display: inline-flex; align-items: center; gap: 8px;
          padding: 7px 14px; border-radius: 999px;
          background: rgba(255,255,255,.10); border: 1px solid rgba(255,255,255,.22);
          backdrop-filter: blur(8px); font-size: 12.5px; font-weight: 500; letter-spacing: .4px;
          animation: floaty 5s ease-in-out infinite, rise .8s ease both;
        }
        .badge .pulse {
          width: 8px; height: 8px; border-radius: 50%; background: #34d399;
          box-shadow: 0 0 0 0 rgba(52,211,153,.7); animation: ping 2s ease-out infinite;
        }
        @keyframes ping { 0%{box-shadow:0 0 0 0 rgba(52,211,153,.6);} 100%{box-shadow:0 0 0 12px rgba(52,211,153,0);} }
        @keyframes floaty { 0%,100%{transform:translateY(0);} 50%{transform:translateY(-6px);} }

        .hero h1 {
          margin: 0; font-size: clamp(34px, 6.4vw, 76px); line-height: 1.02;
          font-weight: 800; letter-spacing: -1.5px;
          text-shadow: 0 6px 30px rgba(0,0,0,.55); max-width: 16ch;
        }
        .hero h1 .grad {
          background: linear-gradient(100deg, #ffd27a, #ff9ec4 40%, #9ec5ff 75%, #7df0ff);
          -webkit-background-clip: text; background-clip: text; color: transparent;
        }
        .hero h1 .word { display: inline-block; opacity: 0; transform: translateY(22px); animation: rise .7s cubic-bezier(.2,.7,.2,1) forwards; }
        .hero h1 .word:nth-child(1){ animation-delay:.10s }
        .hero h1 .word:nth-child(2){ animation-delay:.20s }
        .hero h1 .word:nth-child(3){ animation-delay:.30s }
        .hero h1 .word:nth-child(4){ animation-delay:.40s }
        .hero h1 .word:nth-child(5){ animation-delay:.50s }
        @keyframes rise { to { opacity: 1; transform: translateY(0); } }

        .hero p {
          margin: 0; font-size: clamp(15px, 1.5vw, 19px); line-height: 1.6;
          color: rgba(255,255,255,.9); max-width: 56ch;
          text-shadow: 0 2px 16px rgba(0,0,0,.5);
          opacity: 0; animation: rise .8s ease .6s forwards;
        }
        .hero .cta { display: flex; flex-wrap: wrap; gap: 14px; margin-top: 6px; opacity: 0; animation: rise .8s ease .75s forwards; pointer-events: auto; }
        .hero .cta .btn { padding: 13px 26px; font-size: 15px; }

        .stats { display: flex; flex-wrap: wrap; gap: 12px; margin-top: 8px; opacity: 0; animation: rise .8s ease .9s forwards; pointer-events: auto; }
        .chip-link { text-decoration: none; color: inherit; }
        .chip {
          display: flex; align-items: center; gap: 10px;
          padding: 10px 16px; border-radius: 14px;
          background: rgba(255,255,255,.08); border: 1px solid rgba(255,255,255,.16);
          backdrop-filter: blur(10px); font-size: 13px; font-weight: 500;
          transition: transform .2s ease, background .2s ease, border-color .2s ease;
        }
        .chip-link:hover .chip { transform: translateY(-3px); background: rgba(255,255,255,.16); border-color: rgba(255,255,255,.3); }
        .chip .ic { font-size: 16px; }

        .scroll-cue {
          position: absolute; left: 50%; bottom: 22px; transform: translateX(-50%);
          z-index: 5; display: flex; flex-direction: column; align-items: center; gap: 8px;
          color: rgba(255,255,255,.75); font-size: 11px; letter-spacing: 2px; text-transform: uppercase;
          pointer-events: none;
        }
        .mouse { width: 22px; height: 36px; border: 2px solid rgba(255,255,255,.6); border-radius: 14px; position: relative; }
        .mouse::after {
          content: ""; position: absolute; left: 50%; top: 7px; width: 3px; height: 7px;
          background: #fff; border-radius: 3px; transform: translateX(-50%);
          animation: wheel 1.6s ease-in-out infinite;
        }
        @keyframes wheel { 0%{opacity:0;transform:translate(-50%,0)} 30%{opacity:1} 100%{opacity:0;transform:translate(-50%,12px)} }

        .site-footer {
          position: relative; background: linear-gradient(180deg, #070a16 0%, #05060f 100%);
          border-top: 1px solid rgba(255,255,255,.07);
          padding: clamp(48px, 7vw, 84px) clamp(20px, 5vw, 64px) 28px;
          color: rgba(255,255,255,.78);
        }
        .footer-top {
          max-width: 1200px; margin: 0 auto;
          display: grid; grid-template-columns: 1.6fr repeat(4, 1fr);
          gap: clamp(28px, 4vw, 56px);
        }
        .footer-brand .brand { font-size: 20px; margin-bottom: 14px; }
        .footer-brand p { margin: 0 0 18px; max-width: 34ch; font-size: 14px; line-height: 1.7; color: rgba(255,255,255,.6); }
        .footer-values { display: flex; flex-wrap: wrap; gap: 8px; max-width: 40ch; }
        .footer-values span {
          font-size: 11.5px; padding: 5px 11px; border-radius: 999px;
          background: rgba(124,92,255,.12); border: 1px solid rgba(124,92,255,.28); color: #cdbcff;
        }
        .footer-col h4 {
          margin: 0 0 16px; font-size: 12px; letter-spacing: 2px; text-transform: uppercase;
          color: #fff; font-weight: 700;
        }
        .footer-col ul { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 11px; }
        .footer-col a {
          text-decoration: none; color: rgba(255,255,255,.62); font-size: 14px;
          position: relative; width: fit-content; transition: color .2s;
        }
        .footer-col a::after {
          content: ""; position: absolute; left: 0; bottom: -3px; height: 2px; width: 0;
          background: linear-gradient(90deg,#7c5cff,#22d3ee); transition: width .25s ease;
        }
        .footer-col a:hover { color: #fff; }
        .footer-col a:hover::after { width: 100%; }
        .footer-bottom {
          max-width: 1200px; margin: clamp(36px, 5vw, 60px) auto 0;
          padding-top: 22px; border-top: 1px solid rgba(255,255,255,.08);
          display: flex; flex-wrap: wrap; gap: 12px; align-items: center; justify-content: space-between;
          font-size: 12.5px; color: rgba(255,255,255,.5);
        }

        @media (max-width: 900px) {
          .footer-top { grid-template-columns: 1fr 1fr; }
          .footer-brand { grid-column: 1 / -1; }
        }
        @media (max-width: 520px) {
          .footer-top { grid-template-columns: 1fr 1fr; gap: 24px; }
          .values-stage { --word-left: 13%; }
        }

        body.reduce .values-section { height: auto !important; }
        body.reduce .values-stage {
          position: static; height: auto; min-height: 100vh; overflow: visible;
          display: flex; flex-direction: column; align-items: center;
          gap: 36px; padding: 120px 22px 80px;
        }
        body.reduce .v-overlay { position: static; inset: auto; opacity: 1 !important; padding: 0; }
        body.reduce #vOutro { opacity: 1 !important; }
        body.reduce .values-column {
          position: static; inset: auto; opacity: 1 !important;
          display: flex; flex-direction: column; align-items: flex-start;
          gap: 4px; width: 100%; max-width: 760px;
        }
        body.reduce .value-word {
          position: static !important; transform: none !important;
          filter: none !important; opacity: 1 !important;
          font-size: clamp(22px, 5vw, 48px);
        }
        body.reduce .values-arrow,
        body.reduce .v-counter,
        body.reduce .v-tag { display: none; }
      `}</style>

      {/* NAVBAR */}
      <nav className="navbar" id="navbar" aria-label="Primary">
        <Link href="/" className="brand">
          <span className="dot">✦</span> Class&nbsp;8&nbsp;Hub
        </Link>
        {userName ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '0.88rem', color: 'rgba(255,255,255,0.9)', fontWeight: 600 }}>
              Welcome back, <strong style={{ color: '#22d3ee' }}>{userName}</strong> 👋
            </span>
            <Link href="/dashboard" className="btn btn-primary">
              Go to Dashboard 🚀
            </Link>
          </div>
        ) : (
          <div className="nav-auth">
            <Link href="/auth" className="btn btn-ghost">
              Log in
            </Link>
            <Link href="/auth" className="btn btn-primary">
              Sign up
            </Link>
          </div>
        )}
      </nav>

      <span id="top" />

      {/* SECTION 1 — VALUES SCROLL-BLUR INTRO */}
      <section className="values-section" id="valuesSection" aria-label="Our thirteen values">
        <div className="values-stage">
          {/* Low Brightness 3.mp4 Video Background */}
          <video
            autoPlay
            muted
            loop
            playsInline
            src="/3.mp4"
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              filter: 'brightness(0.36) contrast(1.12) saturate(0.9)',
              zIndex: 0,
              pointerEvents: 'none'
            }}
          />
          {/* Dark Tint Overlay */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background:
                'radial-gradient(120% 100% at 50% 50%, rgba(7, 8, 20, 0.4), rgba(5, 6, 15, 0.82)), linear-gradient(180deg, rgba(5,6,15,0.6) 0%, transparent 50%, rgba(5,6,15,0.85) 100%)',
              zIndex: 1,
              pointerEvents: 'none'
            }}
          />

          {/* INTRO OVERLAY */}
          <div className="v-overlay" id="vIntro" style={{ zIndex: 2 }}>
            <span className="kicker">We the students of PRIYESH Sir</span>
            <h2>
              We stand for <span className="accent">thirteen values</span> that shape everything we do.
            </h2>
            <p>
              One classroom. One promise. Thirteen ideas we live by — every lesson, every simulation, every quiz.
            </p>
            <span className="hint">
              <span className="arrow-down">↓</span> Scroll to move through them, one by one
            </span>
          </div>

          {/* VALUES COLUMN */}
          <div className="values-column" id="valuesColumn" aria-hidden="true" style={{ zIndex: 2 }}>
            {WORDS.map((w, idx) => (
              <p key={idx} className="value-word">
                {w}
              </p>
            ))}
          </div>

          <div className="values-arrow" id="valuesArrow" style={{ zIndex: 2 }}>
            →
          </div>

          {/* LIVE COUNTER */}
          <div className="v-counter" id="vCounter" aria-hidden="true" style={{ zIndex: 2 }}>
            <span id="vNum">01</span>
            <span className="v-counter-sep">/</span>
            <span className="v-counter-total">13</span>
            <span className="v-counter-word" id="vWord">
              Honesty
            </span>
          </div>

          {/* OUTRO OVERLAY */}
          <div className="v-overlay" id="vOutro" style={{ opacity: 0, zIndex: 2 }}>
            <span className="kicker">Thirteen values · one class</span>
            <h2>That's who we are.</h2>
            <p>Built on the basics. Done well.</p>
            <a
              href="#classroom"
              className="btn btn-primary"
              style={{ marginTop: 14, pointerEvents: 'auto' }}
            >
              Enter the classroom →
            </a>
          </div>

          <span className="v-tag left" style={{ zIndex: 2 }}>Thirteen Values</span>
          <span className="v-tag right" style={{ zIndex: 2 }}>Class 8 · 2026</span>
        </div>
      </section>

      {/* SECTION 2 — CLASSROOM HERO */}
      <section className="scene" id="classroom" aria-label="Animated classroom hero">
        <div className="layer bg-parallax">
          <div className="bg-image" />
        </div>
        <div className="layer bg-tint" />
        <div className="layer rays-parallax">
          <div className="rays" />
        </div>
        <div className="layer particles-parallax">
          <div className="particles" id="particles" />
        </div>

        <div className="layer fg-parallax">
          <div className="hero">
            <span className="badge">
              <span className="pulse" /> Class 8 · Thirteen Values · 2026 cohort
            </span>

            <h1>
              <span className="word">Built</span>{' '}
              <span className="word">for</span>{' '}
              <span className="word">Class&nbsp;8,</span>{' '}
              <span className="word">fueled&nbsp;by</span>{' '}
              <span className="word grad">curiosity.</span>
            </h1>

            <p>
              Welcome to PRIYESH Sir's learning space. Run interactive simulations, read your
              books and notes, track your daily study habits, attempt quizzes and explore
              curated articles — all inside one calm, animated classroom built around the
              thirteen values we stand for.
            </p>

            {userName ? (
              <div className="cta">
                <Link href="/dashboard" className="btn btn-primary">
                  Go to Dashboard ({userName}) →
                </Link>
                <a href="#valuesSection" className="btn btn-ghost">
                  See our values
                </a>
              </div>
            ) : (
              <div className="cta">
                <Link href="/auth" className="btn btn-primary">
                  Start learning →
                </Link>
                <a href="#valuesSection" className="btn btn-ghost">
                  See our values
                </a>
              </div>
            )}

            {/* FEATURE CHIPS CONNECTED TO ALL SITE PAGES */}
            <div className="stats">
              <Link href="/simulations" className="chip-link">
                <div className="chip">
                  <span className="ic">🧪</span> Interactive Simulations
                </div>
              </Link>
              <Link href="/library" className="chip-link">
                <div className="chip">
                  <span className="ic">📚</span> Books &amp; Notes
                </div>
              </Link>
              <Link href="/habits" className="chip-link">
                <div className="chip">
                  <span className="ic">🔥</span> Daily Habit Tracker
                </div>
              </Link>
              <Link href="/quizzes" className="chip-link">
                <div className="chip">
                  <span className="ic">✍️</span> Live Quizzes
                </div>
              </Link>
              <Link href="/reading" className="chip-link">
                <div className="chip">
                  <span className="ic">📖</span> Curated Reading
                </div>
              </Link>
            </div>
          </div>
        </div>

        <div className="scroll-cue" aria-hidden="true">
          <div className="mouse" /> explore
        </div>
      </section>

      {/* FOOTER */}
      <footer className="site-footer" aria-label="Site footer">
        <div className="footer-top">
          <div className="footer-brand">
            <Link href="/" className="brand">
              <span className="dot">✦</span> Class&nbsp;8&nbsp;Hub
            </Link>
            <p>
              An animated learning home for PRIYESH Sir's Class 8 — simulations, books,
              habits, quizzes and reading, held together by thirteen values.
            </p>
            <div className="footer-values" aria-label="Our thirteen values">
              {WORDS.map((w, i) => (
                <span key={i}>{w}</span>
              ))}
            </div>
          </div>

          <div className="footer-col">
            <h4>Learn</h4>
            <ul>
              <li>
                <Link href="/simulations">Simulations</Link>
              </li>
              <li>
                <Link href="/library">Library</Link>
              </li>
              <li>
                <Link href="/habits">Habit Tracker</Link>
              </li>
              <li>
                <Link href="/quizzes">Quizzes</Link>
              </li>
              <li>
                <Link href="/reading">Reading</Link>
              </li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>Account</h4>
            <ul>
              <li>
                <Link href="/auth">Log in</Link>
              </li>
              <li>
                <Link href="/auth">Sign up</Link>
              </li>
              <li>
                <Link href="/dashboard">Dashboard</Link>
              </li>
              <li>
                <Link href="/settings">Settings</Link>
              </li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>Class</h4>
            <ul>
              <li>
                <a href="#valuesSection">Our Values</a>
              </li>
              <li>
                <a href="#classroom">The Classroom</a>
              </li>
              <li>
                <Link href="/dashboard">Overview</Link>
              </li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>More</h4>
            <ul>
              <li>
                <Link href="/admin">Admin Panel</Link>
              </li>
              <li>
                <Link href="/design-system-preview">Design System</Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <span>© 2026 Class 8 Hub · PRIYESH Sir's classroom. All rights reserved.</span>
          <span className="made">Built on the basics. Done well. ✦</span>
        </div>
      </footer>
    </div>
  );
}
