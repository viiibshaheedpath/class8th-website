'use client';

import React from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/navbar/Navbar';
import { Footer } from '@/components/Footer';

export default function TermsPage() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#060814', color: '#ffffff' }}>
      <Navbar />

      <main style={{ flex: 1, maxWidth: '860px', width: '100%', margin: '0 auto', padding: '60px 24px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '32px' }}>
          <span style={{ fontSize: '0.8rem', color: '#818cf8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '2px' }}>
            Legal & Governance
          </span>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 800, margin: 0, background: 'linear-gradient(100deg,#ffd27a,#ff9ec4 45%,#9ec5ff)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Terms & Conditions
          </h1>
          <p style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.95rem' }}>
            Last updated: July 22, 2026 • Class 8th Hub Platform
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', lineHeight: 1.7, fontSize: '0.96rem', color: 'rgba(255, 255, 255, 0.85)' }}>
          <section style={{ padding: '24px', background: 'rgba(15, 23, 42, 0.75)', borderRadius: '16px', border: '1px solid rgba(255, 255, 255, 0.12)' }}>
            <h2 style={{ fontSize: '1.25rem', color: '#ffffff', marginTop: 0 }}>1. Acceptance of Terms</h2>
            <p>
              By accessing and using Class 8th Hub, including our interactive simulations, digital library, habit tracker, and quizzes, you agree to comply with and be bound by these Terms & Conditions.
            </p>
          </section>

          <section style={{ padding: '24px', background: 'rgba(15, 23, 42, 0.75)', borderRadius: '16px', border: '1px solid rgba(255, 255, 255, 0.12)' }}>
            <h2 style={{ fontSize: '1.25rem', color: '#ffffff', marginTop: 0 }}>2. Student Code of Conduct & Thirteen Values</h2>
            <p>
              All students and users are expected to embody the Thirteen Values: Honesty, Loyalty, Bravery, Self-Discipline, Fortitude, Adaptability, Commitment, Excellence, Unity, Faith, Sacrifice, Learning, and Curiosity.
            </p>
          </section>

          <section style={{ padding: '24px', background: 'rgba(15, 23, 42, 0.75)', borderRadius: '16px', border: '1px solid rgba(255, 255, 255, 0.12)' }}>
            <h2 style={{ fontSize: '1.25rem', color: '#ffffff', marginTop: 0 }}>3. Data Privacy & Habit Analytics</h2>
            <p>
              Your study time, habit logs, and quiz scores are securely stored in Supabase under your unique account ID. Your personal study statistics are private to you and course instructors.
            </p>
          </section>

          <section style={{ padding: '24px', background: 'rgba(15, 23, 42, 0.75)', borderRadius: '16px', border: '1px solid rgba(255, 255, 255, 0.12)' }}>
            <h2 style={{ fontSize: '1.25rem', color: '#ffffff', marginTop: 0 }}>4. Academic Content & Intellectual Property</h2>
            <p>
              All study materials, simulations, and reading contents on Class 8th Hub are curated for educational purposes under PRIYESH Sir's guidance. Materials may not be redistributed without permission.
            </p>
          </section>

          <div style={{ marginTop: '20px', display: 'flex', gap: '16px', alignItems: 'center' }}>
            <Link href="/" className="btn btn-primary" style={{ padding: '10px 20px' }}>
              ← Return to Home Page
            </Link>
            <Link href="/auth" className="btn btn-ghost" style={{ padding: '10px 20px' }}>
              Go to Student Login
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
