import React from 'react';
import { Card } from '@/components/ui/Card';

export function StreakCounter({ streakDays = 7 }: { streakDays?: number }) {
  return (
    <Card className="streak-counter-card">
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '8px' }}>
        <div style={{ fontSize: '2.5rem' }}>🔥</div>
        <div>
          <h2 style={{ margin: 0, fontSize: '1.8rem', lineHeight: 1.1 }}>{streakDays} Days</h2>
          <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)' }}>Active Study Streak</p>
        </div>
      </div>
    </Card>
  );
}
