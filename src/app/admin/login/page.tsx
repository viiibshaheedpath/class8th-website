'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

export default function AdminLoginPage() {
  const router = useRouter();
  const { signInAdmin } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    try {
      const adminEmail = email.trim();
      if (!adminEmail || !password) {
        setErrorMsg('Please enter your admin email and password.');
        setLoading(false);
        return;
      }

      await signInAdmin(adminEmail, password);
      router.push('/admin');
    } catch (err: any) {
      setErrorMsg('Failed to sign into Admin Portal. Check your credentials.');
    } finally {
      setLoading(false);
    }
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
      {/* Background Video 1.mp4 */}
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
          filter: 'brightness(0.3) contrast(1.15)',
          zIndex: 0
        }}
      />

      {/* Dark Overlay Tint */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(120% 100% at 50% 50%, rgba(4, 5, 14, 0.5), rgba(4, 5, 14, 0.9)), linear-gradient(180deg, rgba(4,5,14,0.7) 0%, transparent 50%, rgba(4,5,14,0.9) 100%)',
          zIndex: 1,
          pointerEvents: 'none'
        }}
      />

      {/* Glassmorphic Admin Card */}
      <div
        style={{
          position: 'relative',
          zIndex: 10,
          width: '100%',
          maxWidth: '440px',
          margin: '20px',
          padding: '36px 32px',
          background: 'rgba(15, 23, 42, 0.85)',
          border: '1px solid rgba(255, 255, 255, 0.16)',
          borderRadius: '24px',
          backdropFilter: 'blur(20px)',
          boxShadow: '0 20px 50px rgba(0,0,0,0.6)'
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <Link
            href="/"
            style={{
              textDecoration: 'none',
              color: '#818cf8',
              fontSize: '0.85rem',
              fontWeight: 600,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              marginBottom: '16px'
            }}
          >
            ← Back to Main Platform
          </Link>
          <div
            style={{
              width: '56px',
              height: '56px',
              borderRadius: '16px',
              background: 'linear-gradient(135deg, #ef4444, #dc2626)',
              margin: '0 auto 16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.8rem',
              boxShadow: '0 8px 24px rgba(239, 68, 68, 0.4)'
            }}
          >
            👑
          </div>
          <h1 style={{ margin: '0 0 6px 0', fontSize: '1.6rem', fontWeight: 800 }}>Admin Portal Sign In</h1>
          <p style={{ margin: 0, fontSize: '0.85rem', color: 'rgba(255, 255, 255, 0.65)' }}>
            Restricted access for system administrators &amp; teachers
          </p>
        </div>

        {errorMsg && (
          <div
            style={{
              padding: '12px 16px',
              borderRadius: '12px',
              background: 'rgba(239, 68, 68, 0.2)',
              border: '1px solid #ef4444',
              color: '#fca5a5',
              fontSize: '0.85rem',
              marginBottom: '20px',
              textAlign: 'center'
            }}
          >
            ⚠️ {errorMsg}
          </div>
        )}

        <form onSubmit={handleAdminLogin} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          <div>
            <label
              htmlFor="admin-email"
              style={{
                display: 'block',
                fontSize: '0.82rem',
                fontWeight: 600,
                color: 'rgba(255, 255, 255, 0.8)',
                marginBottom: '6px'
              }}
            >
              Admin Email
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
                fontSize: '0.82rem',
                fontWeight: 600,
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
      </div>
    </div>
  );
}
