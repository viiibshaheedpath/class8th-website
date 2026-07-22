import React from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Simulation } from '@/data/mockSimulations';

interface SimulationCardProps {
  simulation: Simulation;
}

export function SimulationCard({ simulation }: SimulationCardProps) {
  const getDifficultyBadge = (diff: string) => {
    switch (diff) {
      case 'Easy': return <Badge variant="success">Easy</Badge>;
      case 'Medium': return <Badge variant="warning">Medium</Badge>;
      case 'Hard': return <Badge variant="danger">Hard</Badge>;
      default: return <Badge variant="secondary">{diff}</Badge>;
    }
  };

  return (
    <Card className="simulation-card">
      <div className="simulation-card-banner">
        <span className="simulation-icon">⚡</span>
        {getDifficultyBadge(simulation.difficulty)}
      </div>
      <div className="simulation-card-body">
        <span className="subject-tag">{simulation.subject}</span>
        <h3 className="sim-title">{simulation.title}</h3>
        <p className="sim-desc">{simulation.description}</p>
        {simulation.openInNewTab && simulation.embedUrl ? (
          <a
            href={simulation.embedUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{ display: 'block', marginTop: 'auto', textDecoration: 'none' }}
          >
            <Button variant="primary" style={{ width: '100%' }}>
              Launch in New Tab ↗
            </Button>
          </a>
        ) : (
          <Link href={`/simulations/${simulation.id}`} style={{ display: 'block', marginTop: 'auto' }}>
            <Button variant="primary" style={{ width: '100%' }}>
              Open Simulation
            </Button>
          </Link>
        )}
      </div>
    </Card>
  );
}
