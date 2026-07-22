'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { Avatar } from '@/components/ui/Avatar';
import { DropdownMenu } from '@/components/ui/DropdownMenu';
import { ProfileSettingsModal } from '@/components/ui/ProfileSettingsModal';

interface TopBarProps {
  title?: string;
  onToggleMobileSidebar?: () => void;
  userName?: string;
  userRole?: string;
  onSignOut?: () => void;
}

export function TopBar({
  title = 'Dashboard',
  onToggleMobileSidebar,
  userName,
  userRole,
  onSignOut
}: TopBarProps) {
  const router = useRouter();
  const { profile, signOut } = useAuth();
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'profile' | 'security'>('profile');

  const displayName = userName || profile?.name || 'Student';
  const displayRole = userRole || (profile?.role === 'admin' ? 'Admin' : 'Student');

  const handleLogout = async () => {
    if (onSignOut) {
      onSignOut();
    } else {
      await signOut();
      router.push('/auth');
    }
  };

  const handleOpenProfile = () => {
    setActiveTab('profile');
    setIsProfileModalOpen(true);
  };

  const handleOpenSecurity = () => {
    setActiveTab('security');
    setIsProfileModalOpen(true);
  };

  const userDropdownItems = [
    { label: '👤 View Profile', onClick: handleOpenProfile },
    { label: '⚙️ Account Settings & Security', onClick: handleOpenSecurity },
    { label: '🚪 Log Out', onClick: handleLogout }
  ];

  return (
    <>
      <header className="topbar-header">
        <div className="topbar-left">
          {onToggleMobileSidebar && (
            <button
              className="topbar-mobile-toggle mobile-only"
              onClick={onToggleMobileSidebar}
              aria-label="Open Sidebar Menu"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            </button>
          )}
          <h1 className="topbar-title">{title}</h1>
        </div>

        <div className="topbar-center desktop-only">
          <div className="topbar-search">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input type="text" placeholder="Search simulations, books, quizzes..." className="topbar-search-input" />
          </div>
        </div>

        <div className="topbar-right">
          <button className="topbar-icon-btn" aria-label="Notifications">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
              <path d="M13.73 21a2 2 0 0 1-3.46 0" />
            </svg>
            <span className="topbar-badge-dot" />
          </button>

          <div className="topbar-user-profile">
            <DropdownMenu
              trigger={
                <div className="topbar-user-trigger">
                  <Avatar fallbackText={profile?.avatar_url || displayName} />
                  <div className="topbar-user-info desktop-only">
                    <span className="user-name">{displayName}</span>
                    <span className="user-role">{displayRole}</span>
                  </div>
                </div>
              }
              items={userDropdownItems}
            />
          </div>
        </div>
      </header>

      {/* Profile & Account Settings Modal */}
      {isProfileModalOpen && (
        <ProfileSettingsModal
          isOpen={isProfileModalOpen}
          onClose={() => setIsProfileModalOpen(false)}
          initialTab={activeTab}
        />
      )}
    </>
  );
}
