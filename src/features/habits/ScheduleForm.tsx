import React, { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';

export function ScheduleForm({ onAdd }: { onAdd?: (item: any) => void }) {
  const [subject, setSubject] = useState('Mathematics');
  const [goal, setGoal] = useState('');
  const [startTime, setStartTime] = useState('17:00');
  const [endTime, setEndTime] = useState('18:00');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!goal.trim()) return;
    if (onAdd) {
      onAdd({ subject, goal, startTime, endTime });
    }
    setGoal('');
  };

  const subjectOptions = [
    { value: 'Mathematics', label: 'Mathematics' },
    { value: 'Physics', label: 'Physics' },
    { value: 'Chemistry', label: 'Chemistry' },
    { value: 'Biology', label: 'Biology' },
    { value: 'English', label: 'English' }
  ];

  return (
    <Card title="Add New Study Session">
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <Select
          label="Subject"
          options={subjectOptions}
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
        />
        <Input
          label="Study Goal / Topic"
          placeholder="e.g. Solve Chapter 2 exercises"
          value={goal}
          onChange={(e) => setGoal(e.target.value)}
        />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <Input
            label="Start Time"
            type="time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
          />
          <Input
            label="End Time"
            type="time"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
          />
        </div>
        <Button type="submit" variant="primary" style={{ marginTop: '8px' }}>
          Add Session to Schedule
        </Button>
      </form>
    </Card>
  );
}
