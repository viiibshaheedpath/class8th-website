import React from 'react';
import { Card } from '@/components/ui/Card';
import { ProgressBar } from '@/components/ui/ProgressBar';

interface ProgressSummaryProps {
  completedPercent?: number;
  totalMinutes?: number;
}

export function ProgressSummary({ completedPercent = 85, totalMinutes = 140 }: ProgressSummaryProps) {
  return (
    <Card className="progress-summary-card" title="Weekly Study Summary">
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '6px' }}>
            <span>Weekly Goal Progress</span>
            <strong>{completedPercent}%</strong>
          </div>
          <ProgressBar value={completedPercent} />
        </div>
        <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
          ⏱️ Total Study Time: <strong>{totalMinutes} mins</strong> logged this week.
        </div>
      </div>
    </Card>
  );
}
