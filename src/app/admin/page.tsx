'use client';

import React from 'react';
import Link from 'next/link';
import { AdminLayout } from '@/layouts/AdminLayout';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

export default function AdminOverviewPage() {
  return (
    <AdminLayout title="System Overview">
      {/* Metric Cards Grid */}
      <div className="metrics-grid">
        <Card className="stat-card">
          <div className="stat-icon-wrapper" style={{ background: 'var(--primary-shadow)', color: 'var(--primary-start)' }}>
            ⚡
          </div>
          <div>
            <div className="stat-value">6</div>
            <div className="stat-label">Active Simulations</div>
          </div>
        </Card>

        <Card className="stat-card">
          <div className="stat-icon-wrapper" style={{ background: 'var(--color-info-bg)', color: 'var(--color-info)' }}>
            📚
          </div>
          <div>
            <div className="stat-value">14</div>
            <div className="stat-label">Library Documents</div>
          </div>
        </Card>

        <Card className="stat-card">
          <div className="stat-icon-wrapper" style={{ background: 'var(--color-success-bg)', color: 'var(--color-success)' }}>
            📝
          </div>
          <div>
            <div className="stat-value">8</div>
            <div className="stat-label">Published Quizzes</div>
          </div>
        </Card>

        <Card className="stat-card">
          <div className="stat-icon-wrapper" style={{ background: 'var(--color-warning-bg)', color: 'var(--color-warning)' }}>
            👥
          </div>
          <div>
            <div className="stat-value">124</div>
            <div className="stat-label">Registered Students</div>
          </div>
        </Card>
      </div>

      {/* Quick Action Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px', marginTop: '24px' }}>
        <Card title="Simulations Management" subtitle="Upload Z Code or embed HTML simulations">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <p style={{ fontSize: '0.875rem' }}>Upload, publish, or archive physics and chemistry simulation packages.</p>
            <Link href="/admin/simulations">
              <Button variant="primary" style={{ width: '100%' }}>Manage Simulations</Button>
            </Link>
          </div>
        </Card>

        <Card title="Library Documents" subtitle="Manage PDFs, Notes & Syllabus">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <p style={{ fontSize: '0.875rem' }}>Set document view permissions and toggle student PDF download access.</p>
            <Link href="/admin/library">
              <Button variant="primary" style={{ width: '100%' }}>Manage Library</Button>
            </Link>
          </div>
        </Card>

        <Card title="Quiz & Question Builder" subtitle="Manage MCQ, True/False & Short Answer">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <p style={{ fontSize: '0.875rem' }}>Configure time limits, passing scores, explanations, and question pools.</p>
            <Link href="/admin/quizzes">
              <Button variant="primary" style={{ width: '100%' }}>Manage Quizzes</Button>
            </Link>
          </div>
        </Card>
      </div>
    </AdminLayout>
  );
}
