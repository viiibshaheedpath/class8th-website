'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabaseClient';

export default function AuthPage() {
  const router = useRouter();
  const { user, signIn, signUp, loading: authLoading } = useAuth();

  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [activeTab, setActiveTab] = useState<'login' | 'signup'>('login');

  // Login form inputs
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [showLoginPassword, setShowLoginPassword] = useState(false);

  // Signup form inputs
  const [suName, setSuName] = useState('');
  const [suEmail, setSuEmail] = useState('');
  const [suPassword, setSuPassword] = useState('');
  const [suConfirm, setSuConfirm] = useState('');
  const [showSuPassword, setShowSuPassword] = useState(false);
  const [showSuConfirm, setShowSuConfirm] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);

  // Concise Terms & Conditions Modal
  const [termsModalOpen, setTermsModalOpen] = useState(false);

  // Inline Forgot Password
  const [forgotOpen, setForgotOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSending, setForgotSending] = useState(false);
  const [forgotNote, setForgotNote] = useState<{ type: 'ok' | 'err'; msg: string } | null>(null);

  // Banner status
  const [banner, setBanner] = useState<{ type: 'ok' | 'err'; msg: string } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Field validation flags
  const [errors, setErrors] = useState<Record<string, boolean>>({});

  // Mascot References for Cursor Eye Tracking
  const mascotsRef = useRef<HTMLDivElement>(null);

  // Helper: Password validation rules (6+ chars AND at least 1 special symbol)
  const validatePasswordRules = (pw: string) => {
    const hasMinLen = pw.length >= 6;
    const hasSymbol = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~`]/.test(pw);
    return {
      hasMinLen,
      hasSymbol,
      isValid: hasMinLen && hasSymbol
    };
  };

  // Auto-redirect ONLY if an active user or admin session exists in localStorage
  useEffect(() => {
    if (!authLoading && user) {
      const hasUserSession =
        typeof window !== 'undefined' &&
        (localStorage.getItem('class8th_user_session') || localStorage.getItem('class8th_admin_session'));
      if (hasUserSession) {
        router.push('/dashboard');
      }
    }
  }, [user, authLoading, router]);

  // Load theme and REMEMBERED CREDENTIALS FOR 30 DAYS from localStorage
  useEffect(() => {
    try {
      const storedTheme = localStorage.getItem('c8-theme') as 'dark' | 'light';
      if (storedTheme === 'light' || storedTheme === 'dark') {
        setTheme(storedTheme);
      }

      // Check 30-day Remember Me state
      const remExp = localStorage.getItem('c8-remember-exp');
      const remEmail = localStorage.getItem('c8-remember-email');
      const remPass = localStorage.getItem('c8-remember-password');

      if (remEmail && remExp) {
        const now = Date.now();
        const expTime = Number(remExp);

        if (now < expTime) {
          // Credentials still valid within 30 days!
          setLoginEmail(remEmail);
          if (remPass) setLoginPassword(remPass);
          setRememberMe(true);
        } else {
          // 30 days expired -> clear saved credentials
          localStorage.removeItem('c8-remember-email');
          localStorage.removeItem('c8-remember-password');
          localStorage.removeItem('c8-remember-exp');
        }
      }
    } catch (e) {}
  }, []);

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    try {
      localStorage.setItem('c8-theme', next);
    } catch (e) {}
  };

  // Eye-tracking animation loop for mascots
  useEffect(() => {
    const mascots = mascotsRef.current;
    if (!mascots) return;

    const REDUCE = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const eyeEls = Array.from(mascots.querySelectorAll('.eye')) as HTMLElement[];
    const state = eyeEls.map((el) => {
      const pupil = el.querySelector('.pupil') as HTMLElement;
      return { el, pupil, cx: 0, cy: 0, maxD: 4 };
    });

    let mx = window.innerWidth / 2;
    let my = window.innerHeight / 2;

    const onPointerMove = (e: PointerEvent) => {
      mx = e.clientX;
      my = e.clientY;
    };
    window.addEventListener('pointermove', onPointerMove, { passive: true });

    const measure = () => {
      state.forEach((o) => {
        if (!o.el || !o.pupil) return;
        const er = o.el.getBoundingClientRect();
        const pr = o.pupil.getBoundingClientRect();
        o.maxD = Math.max(1, (er.width - pr.width) / 2 - 1);
      });
    };
    measure();
    window.addEventListener('resize', measure);

    let animFrameId: number;
    const loop = () => {
      const peek = mascots.classList.contains('peek');
      const rects = state.map((o) => o.el.getBoundingClientRect());
      for (let i = 0; i < state.length; i++) {
        const o = state[i];
        const r = rects[i];
        if (!o.pupil) continue;
        const ex = r.left + r.width / 2;
        const ey = r.top + r.height / 2;
        let tx: number, ty: number;

        if (peek) {
          tx = 0;
          ty = o.maxD * 0.8;
        } else {
          const dx = mx - ex;
          const dy = my - ey;
          const a = Math.atan2(dy, dx);
          const d = Math.min(Math.hypot(dx, dy) * 0.12, o.maxD);
          tx = Math.cos(a) * d;
          ty = Math.sin(a) * d;
        }
        o.cx += (tx - o.cx) * 0.22;
        o.cy += (ty - o.cy) * 0.22;
        o.pupil.style.transform = `translate(calc(-50% + ${o.cx.toFixed(
          2
        )}px), calc(-50% + ${o.cy.toFixed(2)}px))`;
      }
      animFrameId = requestAnimationFrame(loop);
    };
    animFrameId = requestAnimationFrame(loop);

    let blinkTimeout: NodeJS.Timeout;
    if (!REDUCE) {
      const blink = () => {
        if (eyeEls.length > 0) {
          const eye = eyeEls[Math.floor(Math.random() * eyeEls.length)];
          eye.classList.add('blink');
          setTimeout(() => eye.classList.remove('blink'), 130);
        }
        blinkTimeout = setTimeout(blink, 2200 + Math.random() * 3200);
      };
      blink();
    }

    return () => {
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('resize', measure);
      cancelAnimationFrame(animFrameId);
      if (blinkTimeout) clearTimeout(blinkTimeout);
    };
  }, []);

  // Update mascot peek/typing state based on focused field
  const handleFocus = (isPassword = false, isRevealed = false) => {
    if (!mascotsRef.current) return;
    mascotsRef.current.classList.add('typing');
    if (isPassword && !isRevealed) {
      mascotsRef.current.classList.add('peek');
    } else {
      mascotsRef.current.classList.remove('peek');
    }
  };

  const handleBlur = () => {
    if (!mascotsRef.current) return;
    mascotsRef.current.classList.remove('typing', 'peek');
  };

  // Clear single field error on input
  const clearError = (field: string) => {
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: false }));
    }
    if (banner) setBanner(null);
  };

  // Handle Login Submit
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBanner(null);
    const email = loginEmail.trim();
    const pass = loginPassword;
    const okE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    const pRules = validatePasswordRules(pass);

    setErrors({ loginEmail: !okE, loginPassword: !pRules.isValid });

    if (!okE) {
      setBanner({ type: 'err', msg: 'Please enter a valid email address.' });
      return;
    }
    if (!pRules.isValid) {
      setBanner({
        type: 'err',
        msg: 'Password must be at least 6 characters long and contain at least 1 special symbol (e.g. @, #, $, !).'
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const { error } = await signIn(email, pass);
      if (error) {
        setBanner({ type: 'err', msg: error.message || 'Invalid email or password.' });
      } else {
        // Save/Clear 30-day Remember Me
        if (rememberMe) {
          const thirtyDaysInMs = 30 * 24 * 60 * 60 * 1000;
          const expiryTime = Date.now() + thirtyDaysInMs;
          localStorage.setItem('c8-remember-email', email);
          localStorage.setItem('c8-remember-password', pass);
          localStorage.setItem('c8-remember-exp', String(expiryTime));
        } else {
          localStorage.removeItem('c8-remember-email');
          localStorage.removeItem('c8-remember-password');
          localStorage.removeItem('c8-remember-exp');
        }

        setBanner({ type: 'ok', msg: 'Welcome back! Taking you to your dashboard…' });
        setTimeout(() => router.push('/dashboard'), 600);
      }
    } catch (err: any) {
      setBanner({ type: 'err', msg: err?.message || 'Invalid email or password.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Signup Submit
  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBanner(null);
    const name = suName.trim();
    const email = suEmail.trim();
    const pass = suPassword;
    const conf = suConfirm;

    const okN = name.length > 0;
    const okE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    const pRules = validatePasswordRules(pass);
    const okC = conf.length > 0 && conf === pass;

    setErrors({ suName: !okN, suEmail: !okE, suPassword: !pRules.isValid, suConfirm: !okC });

    if (!agreeTerms) {
      setBanner({ type: 'err', msg: 'Please accept the Terms & Privacy to continue.' });
      return;
    }
    if (!okN || !okE) {
      setBanner({ type: 'err', msg: 'Please fill in all required fields correctly.' });
      return;
    }
    if (!pRules.isValid) {
      setBanner({
        type: 'err',
        msg: 'Password must be at least 6 characters long and contain at least 1 special symbol (e.g. @, #, $, !).'
      });
      return;
    }
    if (!okC) {
      setBanner({ type: 'err', msg: 'Passwords do not match.' });
      return;
    }

    setIsSubmitting(true);
    try {
      const { error } = await signUp(email, pass, name);
      if (error) {
        setBanner({ type: 'err', msg: error.message || 'Could not create account.' });
      } else {
        setBanner({
          type: 'ok',
          msg: 'Account created & saved in Supabase! Redirecting to dashboard…'
        });
        setTimeout(() => router.push('/dashboard'), 800);
      }
    } catch (err: any) {
      setBanner({ type: 'err', msg: err?.message || 'Could not create account.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Inline Forgot Password Reset
  const handleForgotSend = async () => {
    const email = forgotEmail.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setForgotNote({ type: 'err', msg: 'Enter a valid email address.' });
      return;
    }
    setForgotSending(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth`
      });
      if (error) throw error;
      setForgotNote({ type: 'ok', msg: 'Reset link sent — check your inbox.' });
    } catch (err: any) {
      setForgotNote({ type: 'err', msg: err?.message || 'Something went wrong.' });
    } finally {
      setForgotSending(false);
    }
  };

  return (
    <div className="auth-root" data-theme={theme}>
      {/* Fonts from Fontsource CDN */}
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@fontsource/inter/400.css" />
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@fontsource/inter/500.css" />
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@fontsource/inter/600.css" />
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@fontsource/inter/700.css" />
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@fontsource/inter/800.css" />

      <style>{`
        :root {
          --c-purple:#6d2bf0; --c-black:#262626; --c-yellow:#e2e24c; --c-orange:#ef8a5e;
          --left-1:#ececf0; --left-2:#d2d2d8;
          --brand-ink:#16161c; --brand-box:rgba(0,0,0,.06);
          --pupil:#1a1a1a;
          --ease:cubic-bezier(.2,.7,.2,1);
        }
        [data-theme="dark"] {
          --right:#0a0a0b;
          --text:#ffffff; --muted:#9a9aa4; --faint:#6b6b75;
          --field:#141416; --field-bd:#27272c; --field-tx:#fff; --field-ph:#6b6b75;
          --field-focus:#3a3a42;
          --btn:#e7e7ea; --btn-tx:#0a0a0b; --btn-hover:#ffffff;
          --link:#ffffff; --check-bd:#3a3a40;
          --toggle-bg:rgba(255,255,255,.08); --toggle-bd:rgba(255,255,255,.14); --toggle-tx:#fff;
          --err-bg:rgba(255,80,80,.10); --err-bd:rgba(255,80,80,.35); --err-tx:#ff9a9a;
          --ok-bg:rgba(52,211,153,.10); --ok-bd:rgba(52,211,153,.35); --ok-tx:#7ef0c4;
          --divider:rgba(255,255,255,.10);
        }
        [data-theme="light"] {
          --left-1:#f4f2ff; --left-2:#e8eaf6;
          --right:#ffffff;
          --text:#15151c; --muted:#6b6b78; --faint:#9a9aa6;
          --field:#f4f4f8; --field-bd:#e3e3ec; --field-tx:#15151c; --field-ph:#9a9aa6;
          --field-focus:#c9c9d6;
          --btn:#15151c; --btn-tx:#ffffff; --btn-hover:#000000;
          --link:#15151c; --check-bd:#cfcfd8;
          --toggle-bg:rgba(0,0,0,.05); --toggle-bd:rgba(0,0,0,.10); --toggle-tx:#15151c;
          --err-bg:rgba(220,38,38,.08); --err-bd:rgba(220,38,38,.30); --err-tx:#c0392b;
          --ok-bg:rgba(16,150,90,.08); --ok-bd:rgba(16,150,90,.30); --ok-tx:#0f8a55;
          --divider:rgba(0,0,0,.08);
        }

        .auth-root {
          font-family: "Inter", system-ui, -apple-system, sans-serif;
          background: var(--right); color: var(--text);
          min-height: 100vh; -webkit-font-smoothing: antialiased;
        }

        .auth { display: grid; grid-template-columns: 1fr 1fr; min-height: 100vh; }

        .panel-left {
          position: relative; overflow: hidden;
          background: radial-gradient(120% 90% at 80% 10%, rgba(255,255,255,.65), transparent 55%),
                      linear-gradient(135deg, var(--left-1), var(--left-2));
        }
        .brand {
          position: absolute; top: 26px; left: 30px; z-index: 6;
          display: flex; align-items: center; gap: 11px;
          font-weight: 700; font-size: 18px; color: var(--brand-ink); letter-spacing: -.2px;
          text-decoration: none;
        }
        .brand .mark {
          width: 34px; height: 34px; border-radius: 10px; background: var(--brand-box);
          display: grid; place-items: center; color: var(--brand-ink);
        }
        .brand .mark svg { width: 18px; height: 18px; }

        .mascots { position: absolute; left: 0; right: 0; bottom: 0; height: 62%; min-height: 300px; }
        .char {
          position: absolute; bottom: 0;
          box-shadow: 0 18px 40px rgba(0,0,0,.10);
          animation: bob 6s var(--ease) infinite;
          background: var(--c);
        }
        .char.purple { --c:var(--c-purple); left:23%; width:clamp(108px,15vw,158px); height:clamp(208px,40vh,318px); border-radius:26px 26px 10px 10px; z-index:1; animation-delay:-1.2s; }
        .char.black  { --c:var(--c-black);  left:42%; width:clamp(82px,11vw,120px);  height:clamp(150px,29vh,222px); border-radius:20px 20px 8px 8px;  z-index:2; animation-delay:-2.6s; }
        .char.yellow { --c:var(--c-yellow); left:57%; width:clamp(92px,12vw,132px);  height:clamp(120px,24vh,182px); border-radius:64px 64px 10px 10px; z-index:3; animation-delay:-.4s; }
        .char.orange { --c:var(--c-orange); left:9%;  width:clamp(140px,19vw,202px); height:clamp(72px,13vh,102px);  border-radius:50% 50% 8px 8px / 100% 100% 8px 8px; z-index:4; animation-delay:-3.4s; }
        @keyframes bob { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }

        .eyes { position: absolute; left: 0; right: 0; display: flex; justify-content: center; }
        .purple .eyes { top: 16%; gap: 18px; }
        .black .eyes  { top: 14%; gap: 14px; }
        .yellow .eyes { top: 30%; gap: 20px; }
        .orange .eyes { top: 42%; gap: 26px; }

        .eye {
          position: relative; width: clamp(15px,1.9vw,22px); height: clamp(15px,1.9vw,22px);
          background: #fff; border-radius: 50%; overflow: hidden; flex: 0 0 auto;
        }
        .eye.dot { background: transparent; }
        .pupil {
          position: absolute; left: 50%; top: 50%; width: 46%; height: 46%;
          background: var(--pupil); border-radius: 50%; transform: translate(-50%,-50%);
          will-change: transform;
        }
        .eye.dot .pupil { width: 78%; height: 78%; }
        .lid {
          position: absolute; inset: -1px; background: var(--c); border-radius: 50%;
          transform: translateY(-102%); transition: transform .22s var(--ease);
        }
        .mascots.peek .eye .lid { transform: translateY(-22%); }
        .eye.blink .lid { transform: translateY(0) !important; }

        .mouth {
          position: absolute; top: 60%; left: 50%; width: 40px; height: 4px; border-radius: 4px;
          background: rgba(0,0,0,.72); transform: translateX(-50%); transition: all .2s var(--ease);
        }
        .mascots.typing .mouth { width: 22px; height: 14px; border-radius: 0 0 14px 14px; }

        .panel-right {
          position: relative; background: var(--right);
          display: flex; align-items: center; justify-content: center;
          padding: clamp(28px,5vw,64px); overflow-y: auto;
        }
        .theme-toggle {
          position: absolute; top: 22px; right: 26px; z-index: 5;
          width: 42px; height: 42px; border-radius: 12px;
          background: var(--toggle-bg); border: 1px solid var(--toggle-bd); color: var(--toggle-tx);
          display: grid; place-items: center; cursor: pointer;
          transition: transform .18s var(--ease), background .2s;
        }
        .theme-toggle:hover { transform: translateY(-2px); }
        .theme-toggle svg { width: 19px; height: 19px; }

        .form-wrap { width: 100%; max-width: 420px; }
        .head { text-align: center; margin-bottom: 34px; }
        .head h1 { margin: 0 0 8px; font-size: clamp(28px,3.4vw,38px); font-weight: 800; letter-spacing: -1px; }
        .head p { margin: 0; color: var(--muted); font-size: 15px; }

        .banner {
          display: flex; align-items: center; gap: 10px;
          padding: 12px 14px; border-radius: 12px; font-size: 13.5px; margin-bottom: 18px;
          border: 1px solid transparent;
        }
        .banner.err { background: var(--err-bg); border-color: var(--err-bd); color: var(--err-tx); }
        .banner.ok  { background: var(--ok-bg);  border-color: var(--ok-bd);  color: var(--ok-tx); }
        .banner svg { width: 17px; height: 17px; flex: 0 0 auto; }

        .field { margin-bottom: 18px; }
        .field > label { display: block; font-size: 13px; font-weight: 700; margin-bottom: 8px; letter-spacing: .2px; }
        .control { position: relative; }
        .control input {
          width: 100%; padding: 14px 16px;
          background: var(--field); border: 1px solid var(--field-bd); border-radius: 12px;
          color: var(--field-tx); font-size: 15px; outline: none;
          transition: border-color .2s, box-shadow .2s, background .2s;
        }
        .control input::placeholder { color: var(--field-ph); }
        .control input:focus { border-color: var(--field-focus); box-shadow: 0 0 0 4px rgba(124,92,255,.14); }
        .control input.invalid { border-color: var(--err-bd); }
        .control.has-toggle input { padding-right: 48px; }

        .pw-toggle {
          position: absolute; top: 50%; right: 10px; transform: translateY(-50%);
          width: 34px; height: 34px; border: 0; background: transparent; cursor: pointer;
          color: var(--muted); display: grid; place-items: center; border-radius: 8px;
          transition: color .2s, background .2s;
        }
        .pw-toggle:hover { color: var(--text); background: var(--toggle-bg); }
        .pw-toggle svg { width: 19px; height: 19px; }

        .err-msg { color: var(--err-tx); font-size: 12.5px; margin-top: 7px; }

        .row { display: flex; align-items: center; justify-content: space-between; gap: 12px; margin: 4px 0 22px; }
        .check { display: inline-flex; align-items: center; gap: 9px; cursor: pointer; font-size: 14px; color: var(--text); user-select: none; }
        .check input { position: absolute; opacity: 0; width: 0; height: 0; }
        .box {
          width: 18px; height: 18px; border-radius: 6px; border: 1.5px solid var(--check-bd);
          display: grid; place-items: center; transition: background .18s, border-color .18s; flex: 0 0 auto;
        }
        .box svg { width: 12px; height: 12px; color: #fff; opacity: 0; transform: scale(.5); transition: .18s var(--ease); }
        .check input:checked + .box { background: var(--c-purple); border-color: var(--c-purple); }
        .check input:checked + .box svg { opacity: 1; transform: scale(1); }

        .link-btn { background: none; border: 0; padding: 0; cursor: pointer; color: var(--link); font-weight: 700; font-size: 14px; }
        .link-btn:hover { text-decoration: underline; }

        .submit {
          width: 100%; padding: 14px; border: 0; border-radius: 12px; cursor: pointer;
          background: var(--btn); color: var(--btn-tx);
          font-size: 15px; font-weight: 700; letter-spacing: .2px;
          display: flex; align-items: center; justify-content: center; gap: 10px;
          transition: transform .16s var(--ease), background .2s, box-shadow .2s;
        }
        .submit:hover { background: var(--btn-hover); transform: translateY(-2px); box-shadow: 0 12px 26px rgba(0,0,0,.18); }
        .submit:disabled { opacity: .7; cursor: default; transform: none; box-shadow: none; }

        .spinner {
          width: 18px; height: 18px; border-radius: 50%;
          border: 2.5px solid currentColor; border-top-color: transparent;
          animation: spin .7s linear infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }

        .switch { text-align: center; margin-top: 24px; color: var(--muted); font-size: 14px; }
        .switch button { background: none; border: 0; padding: 0; cursor: pointer; color: var(--link); font-weight: 700; font-size: 14px; }
        .switch button:hover { text-decoration: underline; }

        .forgot-box {
          overflow: hidden; transition: all .3s var(--ease); margin-top: 14px;
          padding: 12px; background: var(--field); border: 1px solid var(--field-bd); border-radius: 12px;
        }
        .forgot-box .mini { display: flex; gap: 10px; }
        .forgot-box input {
          flex: 1; padding: 10px 14px; background: var(--right); border: 1px solid var(--field-bd);
          border-radius: 8px; color: var(--field-tx); font-size: 14px; outline: none;
        }
        .forgot-box button {
          padding: 0 16px; border: 0; border-radius: 8px; cursor: pointer;
          background: var(--btn); color: var(--btn-tx); font-weight: 600; font-size: 13.5px;
        }

        @media (max-width: 880px) {
          .auth { grid-template-columns: 1fr; }
          .panel-left { height: 34vh; min-height: 230px; }
          .mascots { height: 80%; }
          .panel-right { padding: 34px 22px 48px; }
          .brand { top: 18px; left: 20px; }
        }
      `}</style>

      <main className="auth">
        {/* LEFT PANEL — MASCOTS */}
        <section className="panel-left" aria-hidden="true">
          <Link href="/" className="brand">
            <span className="mark">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 3l1.9 4.6L18.5 9l-4.6 1.9L12 15l-1.9-4.1L5.5 9l4.6-1.4z" />
                <path d="M19 14l.8 2 2 .8-2 .8-.8 2-.8-2-2-.8 2-.8z" />
              </svg>
            </span>
            Class&nbsp;8&nbsp;Hub
          </Link>

          <div className="mascots" id="mascots" ref={mascotsRef}>
            <div className="char purple">
              <div className="eyes">
                <span className="eye"><span className="pupil" /><span className="lid" /></span>
                <span className="eye"><span className="pupil" /><span className="lid" /></span>
              </div>
            </div>
            <div className="char black">
              <div className="eyes">
                <span className="eye"><span className="pupil" /><span className="lid" /></span>
                <span className="eye"><span className="pupil" /><span className="lid" /></span>
              </div>
            </div>
            <div className="char yellow">
              <div className="eyes">
                <span className="eye dot"><span className="pupil" /><span className="lid" /></span>
                <span className="eye dot"><span className="pupil" /><span className="lid" /></span>
              </div>
              <span className="mouth" />
            </div>
            <div className="char orange">
              <div className="eyes">
                <span className="eye dot"><span className="pupil" /><span className="lid" /></span>
                <span className="eye dot"><span className="pupil" /><span className="lid" /></span>
              </div>
            </div>
          </div>
        </section>

        {/* RIGHT PANEL — FORMS */}
        <section className="panel-right">
          <button
            className="theme-toggle"
            type="button"
            onClick={toggleTheme}
            aria-label="Toggle light/dark theme"
          >
            {theme === 'dark' ? (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="4" />
                <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
              </svg>
            )}
          </button>

          <div className="form-wrap">
            <div className="head">
              <h1>{activeTab === 'login' ? 'Welcome back!' : 'Create your account'}</h1>
              <p>
                {activeTab === 'login'
                  ? 'Please enter your details'
                  : "Join PRIYESH Sir's Class 8 hub"}
              </p>
            </div>

            {banner && (
              <div className={`banner ${banner.type}`}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="9" />
                  <path d="M12 8v5M12 16h.01" />
                </svg>
                <span>{banner.msg}</span>
              </div>
            )}

            {/* LOGIN FORM */}
            {activeTab === 'login' && (
              <form onSubmit={handleLoginSubmit} noValidate>
                <div className="field">
                  <label htmlFor="loginEmail">Email</label>
                  <div className="control">
                    <input
                      id="loginEmail"
                      type="email"
                      className={errors.loginEmail ? 'invalid' : ''}
                      placeholder="anna@gmail.com"
                      value={loginEmail}
                      onChange={(e) => {
                        setLoginEmail(e.target.value);
                        clearError('loginEmail');
                      }}
                      onFocus={() => handleFocus(false)}
                      onBlur={handleBlur}
                    />
                  </div>
                  {errors.loginEmail && <div className="err-msg">Please enter a valid email address.</div>}
                </div>

                <div className="field">
                  <label htmlFor="loginPassword">Password</label>
                  <div className="control has-toggle">
                    <input
                      id="loginPassword"
                      type={showLoginPassword ? 'text' : 'password'}
                      className={errors.loginPassword ? 'invalid' : ''}
                      placeholder="••••••••"
                      value={loginPassword}
                      onChange={(e) => {
                        setLoginPassword(e.target.value);
                        clearError('loginPassword');
                      }}
                      onFocus={() => handleFocus(true, showLoginPassword)}
                      onBlur={handleBlur}
                    />
                    <button
                      type="button"
                      className="pw-toggle"
                      onClick={() => {
                        const next = !showLoginPassword;
                        setShowLoginPassword(next);
                        handleFocus(true, next);
                      }}
                    >
                      {showLoginPassword ? (
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M9.9 5.1A9.8 9.8 0 0 1 12 5c6.5 0 10 7 10 7a17 17 0 0 1-3.2 4M6.3 6.3A17 17 0 0 0 2 12s3.5 7 10 7a9.7 9.7 0 0 0 4-.8" />
                          <path d="M3 3l18 18" />
                          <path d="M9.5 9.6a3 3 0 0 0 4.2 4.2" />
                        </svg>
                      ) : (
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z" />
                          <circle cx="12" cy="12" r="3" />
                        </svg>
                      )}
                    </button>
                  </div>

                  {/* Password requirement rule indicators */}
                  <div style={{ marginTop: '7px', fontSize: '11.5px', color: 'var(--muted)', display: 'flex', flexDirection: 'column', gap: '3px' }}>
                    <span style={{ color: loginPassword.length >= 6 ? '#34d399' : errors.loginPassword ? '#f87171' : 'var(--muted)', transition: 'color 0.2s' }}>
                      {loginPassword.length >= 6 ? '✓' : '•'} Minimum 6 characters long
                    </span>
                    <span style={{ color: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~`]/.test(loginPassword) ? '#34d399' : errors.loginPassword ? '#f87171' : 'var(--muted)', transition: 'color 0.2s' }}>
                      {/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~`]/.test(loginPassword) ? '✓' : '•'} At least 1 special symbol (e.g. @, #, $, !)
                    </span>
                  </div>
                </div>

                <div className="row">
                  <label className="check">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                    />
                    <span className="box">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M5 12l4 4 10-10" />
                      </svg>
                    </span>
                    Remember password for 30 days
                  </label>
                  <button
                    type="button"
                    className="link-btn"
                    onClick={() => setForgotOpen(!forgotOpen)}
                  >
                    Forgot password?
                  </button>
                </div>

                {forgotOpen && (
                  <div className="forgot-box">
                    <div className="mini">
                      <input
                        type="email"
                        placeholder="Your email"
                        value={forgotEmail}
                        onChange={(e) => setForgotEmail(e.target.value)}
                      />
                      <button type="button" onClick={handleForgotSend} disabled={forgotSending}>
                        {forgotSending ? 'Sending…' : 'Send link'}
                      </button>
                    </div>
                    {forgotNote && (
                      <div
                        style={{
                          fontSize: '12.5px',
                          marginTop: '8px',
                          color: forgotNote.type === 'ok' ? 'var(--ok-tx)' : 'var(--err-tx)'
                        }}
                      >
                        {forgotNote.msg}
                      </div>
                    )}
                  </div>
                )}

                <button type="submit" className="submit" disabled={isSubmitting || authLoading}>
                  {isSubmitting ? (
                    <>
                      <span className="spinner" />
                      <span>Logging in…</span>
                    </>
                  ) : (
                    <span>Log in</span>
                  )}
                </button>

                <div style={{ marginTop: '16px', textAlign: 'center', fontSize: '12px', color: 'var(--muted)' }}>
                  By logging in, you agree to our{' '}
                  <button
                    type="button"
                    onClick={() => setTermsModalOpen(true)}
                    style={{ background: 'none', border: 'none', padding: 0, color: 'var(--link)', textDecoration: 'underline', cursor: 'pointer', fontWeight: 600 }}
                  >
                    Terms &amp; Conditions
                  </button>
                </div>

                <p className="switch">
                  Don't have an account?{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab('signup');
                      setBanner(null);
                      setErrors({});
                    }}
                  >
                    Sign up
                  </button>
                </p>
              </form>
            )}

            {/* SIGNUP FORM */}
            {activeTab === 'signup' && (
              <form onSubmit={handleSignupSubmit} noValidate>
                <div className="field">
                  <label htmlFor="suName">Full name</label>
                  <div className="control">
                    <input
                      id="suName"
                      type="text"
                      className={errors.suName ? 'invalid' : ''}
                      placeholder="Anna Sharma"
                      value={suName}
                      onChange={(e) => {
                        setSuName(e.target.value);
                        clearError('suName');
                      }}
                      onFocus={() => handleFocus(false)}
                      onBlur={handleBlur}
                    />
                  </div>
                  {errors.suName && <div className="err-msg">Please enter your name.</div>}
                </div>

                <div className="field">
                  <label htmlFor="suEmail">Email</label>
                  <div className="control">
                    <input
                      id="suEmail"
                      type="email"
                      className={errors.suEmail ? 'invalid' : ''}
                      placeholder="anna@gmail.com"
                      value={suEmail}
                      onChange={(e) => {
                        setSuEmail(e.target.value);
                        clearError('suEmail');
                      }}
                      onFocus={() => handleFocus(false)}
                      onBlur={handleBlur}
                    />
                  </div>
                  {errors.suEmail && <div className="err-msg">Please enter a valid email address.</div>}
                </div>

                <div className="field">
                  <label htmlFor="suPassword">Password</label>
                  <div className="control has-toggle">
                    <input
                      id="suPassword"
                      type={showSuPassword ? 'text' : 'password'}
                      className={errors.suPassword ? 'invalid' : ''}
                      placeholder="Create a password"
                      value={suPassword}
                      onChange={(e) => {
                        setSuPassword(e.target.value);
                        clearError('suPassword');
                      }}
                      onFocus={() => handleFocus(true, showSuPassword)}
                      onBlur={handleBlur}
                    />
                    <button
                      type="button"
                      className="pw-toggle"
                      onClick={() => {
                        const next = !showSuPassword;
                        setShowSuPassword(next);
                        handleFocus(true, next);
                      }}
                    >
                      {showSuPassword ? (
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M9.9 5.1A9.8 9.8 0 0 1 12 5c6.5 0 10 7 10 7a17 17 0 0 1-3.2 4M6.3 6.3A17 17 0 0 0 2 12s3.5 7 10 7a9.7 9.7 0 0 0 4-.8" />
                          <path d="M3 3l18 18" />
                          <path d="M9.5 9.6a3 3 0 0 0 4.2 4.2" />
                        </svg>
                      ) : (
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z" />
                          <circle cx="12" cy="12" r="3" />
                        </svg>
                      )}
                    </button>
                  </div>

                  {/* Password requirement rule indicators */}
                  <div style={{ marginTop: '7px', fontSize: '11.5px', color: 'var(--muted)', display: 'flex', flexDirection: 'column', gap: '3px' }}>
                    <span style={{ color: suPassword.length >= 6 ? '#34d399' : errors.suPassword ? '#f87171' : 'var(--muted)', transition: 'color 0.2s' }}>
                      {suPassword.length >= 6 ? '✓' : '•'} Minimum 6 characters long
                    </span>
                    <span style={{ color: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~`]/.test(suPassword) ? '#34d399' : errors.suPassword ? '#f87171' : 'var(--muted)', transition: 'color 0.2s' }}>
                      {/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~`]/.test(suPassword) ? '✓' : '•'} At least 1 special symbol (e.g. @, #, $, !)
                    </span>
                  </div>
                </div>

                <div className="field">
                  <label htmlFor="suConfirm">Confirm password</label>
                  <div className="control has-toggle">
                    <input
                      id="suConfirm"
                      type={showSuConfirm ? 'text' : 'password'}
                      className={errors.suConfirm ? 'invalid' : ''}
                      placeholder="Repeat your password"
                      value={suConfirm}
                      onChange={(e) => {
                        setSuConfirm(e.target.value);
                        clearError('suConfirm');
                      }}
                      onFocus={() => handleFocus(true, showSuConfirm)}
                      onBlur={handleBlur}
                    />
                    <button
                      type="button"
                      className="pw-toggle"
                      onClick={() => {
                        const next = !showSuConfirm;
                        setShowSuConfirm(next);
                        handleFocus(true, next);
                      }}
                    >
                      {showSuConfirm ? (
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M9.9 5.1A9.8 9.8 0 0 1 12 5c6.5 0 10 7 10 7a17 17 0 0 1-3.2 4M6.3 6.3A17 17 0 0 0 2 12s3.5 7 10 7a9.7 9.7 0 0 0 4-.8" />
                          <path d="M3 3l18 18" />
                          <path d="M9.5 9.6a3 3 0 0 0 4.2 4.2" />
                        </svg>
                      ) : (
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z" />
                          <circle cx="12" cy="12" r="3" />
                        </svg>
                      )}
                    </button>
                  </div>
                  {errors.suConfirm && <div className="err-msg">Passwords do not match.</div>}
                </div>

                <div className="row" style={{ marginBottom: 22 }}>
                  <label className="check">
                    <input
                      type="checkbox"
                      checked={agreeTerms}
                      onChange={(e) => setAgreeTerms(e.target.checked)}
                    />
                    <span className="box">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M5 12l4 4 10-10" />
                      </svg>
                    </span>
                    I agree to the{' '}
                  </label>
                  <button
                    type="button"
                    className="link-btn"
                    onClick={() => setTermsModalOpen(true)}
                    style={{ fontSize: '14px', marginLeft: '-6px' }}
                  >
                    Terms &amp; Conditions
                  </button>
                </div>

                <button type="submit" className="submit" disabled={isSubmitting || authLoading}>
                  {isSubmitting ? (
                    <>
                      <span className="spinner" />
                      <span>Creating account…</span>
                    </>
                  ) : (
                    <span>Create account</span>
                  )}
                </button>

                <p className="switch">
                  Already have an account?{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab('login');
                      setBanner(null);
                      setErrors({});
                    }}
                  >
                    Log in
                  </button>
                </p>
              </form>
            )}
          </div>
        </section>
      </main>

      {/* CONCISE TERMS & CONDITIONS MODAL */}
      {termsModalOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 70,
            background: 'rgba(5, 5, 12, 0.82)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px'
          }}
        >
          <div
            style={{
              width: '100%',
              maxWidth: '440px',
              background: 'var(--right)',
              border: '1px solid var(--field-bd)',
              borderRadius: '16px',
              padding: '24px',
              boxShadow: '0 20px 50px rgba(0,0,0,0.8)',
              display: 'flex',
              flexDirection: 'column',
              gap: '14px',
              color: 'var(--text)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 700 }}>
                📜 Terms &amp; Conditions
              </h3>
              <button
                type="button"
                onClick={() => setTermsModalOpen(false)}
                style={{ background: 'none', border: 'none', color: 'var(--muted)', fontSize: '18px', cursor: 'pointer' }}
              >
                ✕
              </button>
            </div>

            <div style={{ fontSize: '13px', color: 'var(--muted)', lineHeight: 1.6, display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <p style={{ margin: 0 }}>
                Welcome to <b>Class 8 Hub</b>. Please review our concise terms of service:
              </p>

              <div style={{ background: 'var(--field)', padding: '10px 12px', borderRadius: '10px', display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                <span style={{ fontSize: '16px' }}>🎓</span>
                <div>
                  <b style={{ color: 'var(--text)' }}>Academic Purpose:</b> Class 8 Hub is built for personal study tracking, revision, and student skill growth.
                </div>
              </div>

              <div style={{ background: 'var(--field)', padding: '10px 12px', borderRadius: '10px', display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                <span style={{ fontSize: '16px' }}>🛡️</span>
                <div>
                  <b style={{ color: 'var(--text)' }}>Account Security:</b> Keep your credentials secure. You are responsible for all activities performed under your profile.
                </div>
              </div>

              <div style={{ background: 'var(--field)', padding: '10px 12px', borderRadius: '10px', display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                <span style={{ fontSize: '16px' }}>🔒</span>
                <div>
                  <b style={{ color: 'var(--text)' }}>Privacy &amp; Data:</b> Your study logs and quiz records are kept strictly private for your account. We never sell student data.
                </div>
              </div>

              <div style={{ background: 'var(--field)', padding: '10px 12px', borderRadius: '10px', display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                <span style={{ fontSize: '16px' }}>⚖️</span>
                <div>
                  <b style={{ color: 'var(--text)' }}>Platform Conduct:</b> Respectful behavior is required. Automated spamming or platform manipulation is prohibited.
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                setAgreeTerms(true);
                setTermsModalOpen(false);
              }}
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '10px',
                background: 'var(--btn)',
                color: 'var(--btn-tx)',
                fontWeight: 700,
                fontSize: '14px',
                border: 0,
                cursor: 'pointer',
                marginTop: '6px'
              }}
            >
              I Accept &amp; Agree
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
