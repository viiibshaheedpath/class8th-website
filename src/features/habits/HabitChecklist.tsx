import React, { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

export function HabitChecklist() {
  const [tasks, setTasks] = useState([
    { id: '1', subject: 'Physics', goal: 'Revise Forces & Motion', time: '17:00 - 18:00', completed: true },
    { id: '2', subject: 'Mathematics', goal: 'Solve Rational Numbers Exercise 1.2', time: '18:30 - 19:30', completed: false },
    { id: '3', subject: 'Chemistry', goal: 'Acid-Base simulation practice', time: '20:00 - 20:45', completed: false }
  ]);

  const toggleTask = (id: string) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  return (
    <Card title="Today's Daily Checklist">
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {tasks.map((task) => (
          <div
            key={task.id}
            onClick={() => toggleTask(task.id)}
            style={{
              padding: '14px 16px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-color)',
              background: task.completed ? 'var(--color-success-bg)' : 'var(--bg-app)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() => {}}
                style={{ width: '18px', height: '18px', accentColor: 'var(--color-success)', cursor: 'pointer' }}
              />
              <div>
                <div style={{
                  fontWeight: 600,
                  fontSize: '0.95rem',
                  textDecoration: task.completed ? 'line-through' : 'none',
                  color: task.completed ? 'var(--color-success)' : 'var(--text-main)'
                }}>
                  {task.subject}: {task.goal}
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{task.time}</div>
              </div>
            </div>
            <Badge variant={task.completed ? 'success' : 'secondary'}>
              {task.completed ? 'Completed' : 'Pending'}
            </Badge>
          </div>
        ))}
      </div>
    </Card>
  );
}
