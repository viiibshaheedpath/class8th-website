'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

export default function AdminLoginPage() {
  const router = useRouter();
  const { signInAdmin } = useAuth();
  
  const [email, setEmail] = useState('admin@class8th.edu');
  const [password, setPassword] = useState('Class8th#Admin2026!');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    try {
      const adminEmail = email.trim() || 'admin@class8th.edu';
      await signInAdmin(adminEmail, password);
      router.push('/admin');
    } catch (err: any) {
      setErrorMsg('Failed to sign into Admin Portal.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoAdminLogin = async () => {
    setLoading(true);
    await signInAdmin('admin@class8th.edu', 'Class8th#Admin2026!');
    router.push('/admin');
  };

  return (
    <div
      style={{
        position: 'relative',
        minHeight: '100vh',
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#04050e',
        color: '#ffffff',
        overflow: 'hidden'
      }}
    >
      {/* Background Video */}
      <video
        autoPlay
        muted
        loop
        playsInline
        src="/1.mp4"
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          filter: 'brightness(0.38) contrast(1.1) saturate(0.9)',
          zIndex: 0
        }}
      />

      {/* Dark Overlay Tint */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(120% 100% at 50% 50%, rgba(4, 5, 14, 0.45), rgba(4, 5, 14, 0.88)), linear-gradient(180deg, rgba(4,5,14,0.7) 0%, transparent 40%, rgba(4,5,14,0.85) 100%)',
          zIndex: 1
        }}
      />

      {/* Admin Login Box */}
      <div style={{ position: 'relative', zIndex: 10, width: '100%', maxWidth: '440px', padding: '24px' }}>
        <div
          style={{
            background: 'rgba(12, 14, 28, 0.82)',
            border: '1px solid rgba(255, 255, 255, 0.18)',
            borderRadius: '24px',
            padding: '36px 30px',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            boxShadow: '0 20px 50px rgba(0,0,0,0.6)'
          }}
        >
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '28px' }}>
            <Link
              href="/"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '1.25rem',
                fontWeight: 800,
                textDecoration: 'none',
                color: '#fff',
                marginBottom: '12px'
              }}
            >
              <span style={{ color: '#818cf8' }}>✦</span> Class 8th Hub
            </Link>
            <div>
              <span
                style={{
                  display: 'inline-block',
                  padding: '4px 12px',
                  borderRadius: '999px',
                  background: 'rgba(239, 68, 68, 0.18)',
                  border: '1px solid rgba(239, 68, 68, 0.35)',
                  color: '#f87171',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  letterSpacing: '1px',
                  textTransform: 'uppercase',
                  marginBottom: '8px'
                }}
              >
                🔒 Protected Admin Portal
              </span>
            </div>
            <h2 style={{ margin: 0, fontSize: '1.6rem', fontWeight: 800, color: '#ffffff' }}>
              Instructor Login
            </h2>
            <p style={{ fontSize: '0.85rem', color: 'rgba(255, 255, 255, 0.65)', marginTop: '6px' }}>
              Upload PDFs, manage simulations, create quizzes, and oversee students.
            </p>
          </div>

          {/* Error Message */}
          {errorMsg && (
            <div
              style={{
                padding: '12px 14px',
                borderRadius: '10px',
                background: 'rgba(239, 68, 68, 0.2)',
                border: '1px solid rgba(239, 68, 68, 0.4)',
                color: '#fca5a5',
                fontSize: '0.85rem',
                marginBottom: '18px'
              }}
            >
              ⚠️ {errorMsg}
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleAdminLogin} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label
                htmlFor="admin-email"
                style={{
                  display: 'block',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  color: 'rgba(255, 255, 255, 0.8)',
                  marginBottom: '6px'
                }}
              >
                Admin Email Address
              </label>
              <input
                id="admin-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@class8th.edu"
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  borderRadius: '12px',
                  background: 'rgba(255, 255, 255, 0.07)',
                  border: '1px solid rgba(255, 255, 255, 0.18)',
                  color: '#ffffff',
                  fontSize: '0.9rem',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            <div>
              <label
                htmlFor="admin-password"
                style={{
                  display: 'block',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  color: 'rgba(255, 255, 255, 0.8)',
                  marginBottom: '6px'
                }}
              >
                Password
              </label>
              <input
                id="admin-password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  borderRadius: '12px',
                  background: 'rgba(255, 255, 255, 0.07)',
                  border: '1px solid rgba(255, 255, 255, 0.18)',
                  color: '#ffffff',
                  fontSize: '0.9rem',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                padding: '14px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #ef4444, #dc2626)',
                color: '#ffffff',
                fontWeight: 700,
                fontSize: '0.95rem',
                border: 'none',
                cursor: 'pointer',
                marginTop: '8px',
                boxShadow: '0 8px 20px rgba(239, 68, 68, 0.4)',
                opacity: loading ? 0.7 : 1
              }}
            >
              {loading ? 'Authenticating Admin Portal…' : 'Sign In as Admin 🔓'}
            </button>
          </form>

          {/* Quick Demo Access Button */}
          <div style={{ marginTop: '20px', paddingTop: '20px', borderTop: '1px solid rgba(255,255,255,0.1)', textAlign: 'center' }}>
            <button
              type="button"
              onClick={handleDemoAdminLogin}
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '12px',
                background: 'rgba(255, 255, 255, 0.08)',
                border: '1px solid rgba(255, 255, 255, 0.18)',
                color: '#e2e8f0',
                fontWeight: 600,
                fontSize: '0.85rem',
                cursor: 'pointer'
              }}
            >
              ⚡ Quick One-Click Admin Access
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
