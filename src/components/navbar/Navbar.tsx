'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <header className="navbar-header">
      <div className="navbar-container">
        {/* Brand Logo */}
        <Link href="/" className="navbar-logo">
          <span className="logo-icon">✦</span>
          <span className="logo-text">Class 8th Hub</span>
        </Link>

        {/* Desktop Nav Links */}
        <nav className="navbar-nav desktop-only">
          <a href="#features" className="nav-link">Features</a>
          <a href="#how-it-works" className="nav-link">How It Works</a>
          <Link href="/reading" className="nav-link">Curated Reading</Link>
        </nav>

        {/* Desktop Auth Buttons */}
        <div className="navbar-actions desktop-only">
          <Link href="/auth">
            <Button variant="ghost">Log In</Button>
          </Link>
          <Link href="/auth">
            <Button variant="primary">Get Started</Button>
          </Link>
        </div>

        {/* Mobile Hamburger Toggle */}
        <button 
          className="mobile-toggle-btn mobile-only" 
          onClick={toggleMobileMenu}
          aria-label="Toggle Navigation Menu"
        >
          {mobileMenuOpen ? (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          ) : (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="mobile-drawer animate-fade-in">
          <nav className="mobile-nav">
            <a href="#features" className="mobile-nav-link" onClick={() => setMobileMenuOpen(false)}>Features</a>
            <a href="#how-it-works" className="mobile-nav-link" onClick={() => setMobileMenuOpen(false)}>How It Works</a>
            <Link href="/reading" className="mobile-nav-link" onClick={() => setMobileMenuOpen(false)}>Curated Reading</Link>
            <div className="mobile-actions">
              <Link href="/auth" onClick={() => setMobileMenuOpen(false)} style={{ width: '100%' }}>
                <Button variant="outline" style={{ width: '100%' }}>Log In</Button>
              </Link>
              <Link href="/auth" onClick={() => setMobileMenuOpen(false)} style={{ width: '100%' }}>
                <Button variant="primary" style={{ width: '100%' }}>Get Started</Button>
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
