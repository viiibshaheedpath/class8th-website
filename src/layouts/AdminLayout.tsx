'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { DashboardLayout } from './DashboardLayout';

interface AdminLayoutProps {
  title?: string;
  children: React.ReactNode;
}

export function AdminLayout({ title = 'Admin Panel', children }: AdminLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { profile, loading } = useAuth();

  // Strict Admin Authorization Check
  const isAdminAuthorized = React.useMemo(() => {
    if (typeof window !== 'undefined') {
      const adminSession = localStorage.getItem('class8th_admin_session');
      if (adminSession) {
        try {
          const parsed = JSON.parse(adminSession);
          if (parsed.profile?.role === 'admin') return true;
        } catch (e) {}
      }
    }
    return profile?.role === 'admin';
  }, [profile]);

  useEffect(() => {
    if (!loading && !isAdminAuthorized) {
      router.replace('/admin/login');
    }
  }, [loading, isAdminAuthorized, router]);

  if (!loading && !isAdminAuthorized) {
    return (
      <DashboardLayout title="Access Denied" isAdmin={false}>
        <div style={{ padding: '40px', textAlign: 'center', color: '#fff' }}>
          <span style={{ fontSize: '3rem', display: 'block', marginBottom: '12px' }}>🔒</span>
          <h2>Admin Access Required</h2>
          <p style={{ color: 'var(--text-muted)' }}>
            This page is restricted to system administrators. Redirecting to login…
          </p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title={`Admin • ${title}`} isAdmin={true}>
      {/* Admin Sub-navigation Tabs */}
      <div
        className="admin-tabs-bar"
        style={{
          marginBottom: '24px',
          display: 'flex',
          gap: '8px',
          borderBottom: '1px solid var(--border-color)',
          paddingBottom: '12px',
          overflowX: 'auto'
        }}
      >
        {adminNavItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`btn ${isActive ? 'btn-primary' : 'btn-ghost'}`}
              style={{ padding: '8px 16px', fontSize: '0.875rem', whiteSpace: 'nowrap' }}
            >
              <span style={{ marginRight: '6px' }}>{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </div>

      {children}
    </DashboardLayout>
  );
}

const adminNavItems = [
  { label: 'Overview', href: '/admin', icon: '📊' },
  { label: 'Simulations', href: '/admin/simulations', icon: '⚡' },
  { label: 'Library', href: '/admin/library', icon: '📚' },
  { label: 'Quizzes', href: '/admin/quizzes', icon: '📝' },
  { label: 'Reading Sources', href: '/admin/reading', icon: '📰' },
  { label: 'Students', href: '/admin/students', icon: '👥' }
];
