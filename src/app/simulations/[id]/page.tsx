'use client';

import React, { useEffect, useState, use } from 'react';
import Link from 'next/link';
import { DashboardLayout } from '@/layouts/DashboardLayout';
import { SimulationViewer } from '@/features/simulations/SimulationViewer';
import { getSimulationById } from '@/services/simulationsService';
import { Simulation } from '@/data/mockSimulations';
import { Button } from '@/components/ui/Button';

export default function SimulationPlayerPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [simulation, setSimulation] = useState<Simulation | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getSimulationById(id).then((sim) => {
      setSimulation(sim);
      setLoading(false);
    });
  }, [id]);

  if (loading) {
    return (
      <DashboardLayout title="Loading Simulation...">
        <div className="loader-container">
          <div className="spinner" style={{ width: '36px', height: '36px' }} />
        </div>
      </DashboardLayout>
    );
  }

  if (!simulation) {
    return (
      <DashboardLayout title="Simulation Not Found">
        <div className="empty-state">
          <div className="empty-state-icon">⚡</div>
          <h3 className="empty-state-title">Simulation Not Found</h3>
          <p className="empty-state-description">The simulation you're looking for doesn't exist or has been archived.</p>
          <Link href="/simulations">
            <Button variant="primary">Back to Simulations</Button>
          </Link>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title={simulation.title}>
      <div style={{ marginBottom: '12px' }}>
        <Link href="/simulations" style={{ fontSize: '0.875rem', color: 'var(--text-muted)', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
          ← Back to All Simulations
        </Link>
      </div>
      <SimulationViewer simulation={simulation} />
    </DashboardLayout>
  );
}
