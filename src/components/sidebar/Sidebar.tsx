'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface SidebarProps {
  isAdmin?: boolean;
  onCloseMobile?: () => void;
}

export function Sidebar({ isAdmin = false, onCloseMobile }: SidebarProps) {
  const pathname = usePathname();

  const navItems = [
    { label: 'Home', href: '/', icon: '🏠' },
    { label: 'Overview', href: '/dashboard', icon: '📊' },
    { label: 'Simulations', href: '/simulations', icon: '⚡' },
    { label: 'Library', href: '/library', icon: '📚' },
    { label: 'Habit Tracker', href: '/habits', icon: '🔥' },
    { label: 'Quizzes', href: '/quizzes', icon: '📝' },
    { label: 'Reading', href: '/reading', icon: '📰' },
    { label: 'Settings', href: '/settings', icon: '⚙️' }
  ];

  if (isAdmin) {
    navItems.push({ label: 'Admin Panel', href: '/admin', icon: '👑' });
  }

  return (
    <aside className="dashboard-sidebar">
      <div className="sidebar-header">
        <Link href="/" className="sidebar-logo" onClick={onCloseMobile}>
          <span className="logo-icon">✦</span>
          <span className="logo-text">Class 8th Hub</span>
        </Link>
        {onCloseMobile && (
          <button className="sidebar-close-btn mobile-only" onClick={onCloseMobile}>
            &times;
          </button>
        )}
      </div>

      <nav className="sidebar-nav">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== '/' && item.href !== '/dashboard' && pathname?.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`sidebar-link ${isActive ? 'sidebar-link-active' : ''}`}
              onClick={onCloseMobile}
            >
              <span className="sidebar-icon">{item.icon}</span>
              <span className="sidebar-label">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
