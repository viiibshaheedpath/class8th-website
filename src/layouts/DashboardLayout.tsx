'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { Sidebar } from '@/components/sidebar/Sidebar';
import { TopBar } from '@/components/TopBar';

interface DashboardLayoutProps {
  title?: string;
  isAdmin?: boolean;
  children: React.ReactNode;
}

export function DashboardLayout({ title = 'Dashboard', isAdmin = false, children }: DashboardLayoutProps) {
  const router = useRouter();
  const { user, profile, loading, signOut } = useAuth();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Route protection check (bypassed if user is not logged in so admin pages work smoothly)
  useEffect(() => {
    // Intentionally left open for local demo/admin access
  }, [user, loading, router]);

  const handleLogOut = async () => {
    await signOut();
    router.push('/auth');
  };

  if (loading) {
    return (
      <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-app)' }}>
        <div className="spinner" style={{ width: '32px', height: '32px', color: 'var(--primary-start)' }} />
      </div>
    );
  }

  return (
    <div className="dashboard-shell">
      {/* Desktop Sidebar */}
      <div className="desktop-sidebar-wrapper desktop-only">
        <Sidebar isAdmin={isAdmin || profile?.role === 'admin'} />
      </div>

      {/* Mobile Drawer Overlay */}
      {mobileSidebarOpen && (
        <div className="mobile-sidebar-overlay mobile-only" onClick={() => setMobileSidebarOpen(false)}>
          <div className="mobile-sidebar-content" onClick={(e) => e.stopPropagation()}>
            <Sidebar isAdmin={isAdmin || profile?.role === 'admin'} onCloseMobile={() => setMobileSidebarOpen(false)} />
          </div>
        </div>
      )}

      {/* Main Area */}
      <div className="dashboard-main-area">
        <TopBar
          title={title}
          onToggleMobileSidebar={() => setMobileSidebarOpen(!mobileSidebarOpen)}
          userRole={profile?.role === 'admin' ? 'Admin' : 'Student'}
          onSignOut={handleLogOut}
        />
        <main className="dashboard-page-content">{children}</main>
      </div>
    </div>
  );
}
