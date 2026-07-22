'use client';

import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '@/layouts/DashboardLayout';
import { SimulationCard } from '@/components/cards/SimulationCard';
import { WaveField } from '@/components/ui/wave-field';
import { getSimulations } from '@/services/simulationsService';
import { Simulation } from '@/data/mockSimulations';

const SUBJECTS = ['All', 'Physics', 'Chemistry', 'Mathematics'];

export default function SimulationsPage() {
  const [simulations, setSimulations] = useState<Simulation[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeSubject, setActiveSubject] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    getSimulations().then((data) => {
      setSimulations(data);
      setLoading(false);
    });
  }, []);

  const filtered = simulations.filter((s) => {
    const matchesSubject = activeSubject === 'All' || s.subject === activeSubject;
    const query = searchQuery.toLowerCase();
    const matchesSearch =
      !query ||
      s.title.toLowerCase().includes(query) ||
      s.description.toLowerCase().includes(query);
    return matchesSubject && matchesSearch;
  });

  return (
    <DashboardLayout title="Interactive Simulations">
      {/* Simulation Section Container with wave.html WaveField Canvas Background */}
      <div
        style={{
          position: 'relative',
          borderRadius: 'var(--radius-lg)',
          overflow: 'hidden',
          padding: '28px 24px',
          minHeight: '85vh',
          background: '#000000'
        }}
      >
        {/* WaveField Canvas Animation (from wave.html) */}
        <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
          <WaveField lineCount={20} glow={1.1} speed={1.0} className="w-full h-full" />
        </div>

        {/* Dark Vignette Overlay */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'radial-gradient(120% 100% at 50% 50%, rgba(0,0,0,0.35), rgba(0,0,0,0.85)), linear-gradient(180deg, rgba(0,0,0,0.6) 0%, transparent 40%, rgba(0,0,0,0.8) 100%)',
            zIndex: 1,
            pointerEvents: 'none'
          }}
        />

        {/* Content sitting above WaveField Canvas */}
        <div style={{ position: 'relative', zIndex: 10 }}>
          {/* Search + Filter Bar */}
          <div
            style={{
              display: 'flex',
              gap: '12px',
              marginBottom: '28px',
              flexWrap: 'wrap',
              alignItems: 'center'
            }}
          >
            {/* Search input */}
            <div style={{ position: 'relative', flex: '1 1 240px', minWidth: '200px' }}>
              <span
                style={{
                  position: 'absolute',
                  left: '14px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  fontSize: '1rem',
                  color: 'rgba(255, 255, 255, 0.6)',
                  pointerEvents: 'none'
                }}
              >
                🔍
              </span>
              <input
                id="sim-search"
                type="search"
                placeholder="Search simulations…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 14px 12px 42px',
                  background: 'rgba(15, 23, 42, 0.78)',
                  border: '1px solid rgba(255, 255, 255, 0.18)',
                  borderRadius: 'var(--radius-md)',
                  color: '#ffffff',
                  fontSize: '0.92rem',
                  backdropFilter: 'blur(16px)',
                  WebkitBackdropFilter: 'blur(16px)',
                  outline: 'none',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.4)'
                }}
              />
            </div>

            {/* Subject filter pills */}
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {SUBJECTS.map((sub) => (
                <button
                  key={sub}
                  onClick={() => setActiveSubject(sub)}
                  className={`btn ${activeSubject === sub ? 'btn-primary' : 'btn-outline'}`}
                  style={{ padding: '6px 16px', fontSize: '0.85rem', backdropFilter: 'blur(10px)' }}
                >
                  {sub}
                </button>
              ))}
            </div>
          </div>

          {/* Results */}
          {loading ? (
            <div className="loader-container">
              <div className="spinner" style={{ width: '32px', height: '32px' }} />
            </div>
          ) : filtered.length > 0 ? (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
                gap: '24px'
              }}
            >
              {filtered.map((sim) => (
                <SimulationCard key={sim.id} simulation={sim} />
              ))}
            </div>
          ) : (
            <div
              className="empty-state"
              style={{
                background: 'rgba(15, 23, 42, 0.75)',
                backdropFilter: 'blur(16px)',
                borderColor: 'rgba(255, 255, 255, 0.15)'
              }}
            >
              <div className="empty-state-icon">⚡</div>
              <h3 className="empty-state-title" style={{ color: '#fff' }}>
                No Simulations Found
              </h3>
              <p className="empty-state-description" style={{ color: 'rgba(255,255,255,0.7)' }}>
                {searchQuery
                  ? `No results for "${searchQuery}"${activeSubject !== 'All' ? ` in ${activeSubject}` : ''}.`
                  : `No simulations available for "${activeSubject}".`}
              </p>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
