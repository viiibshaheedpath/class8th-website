import React from 'react';
import Link from 'next/link';

export function Footer() {
  return (
    <footer className="footer-section">
      <div className="footer-container">
        <div className="footer-brand">
          <Link href="/" className="footer-logo">
            <span className="logo-icon">✦</span>
            <span className="logo-text">Class 8th Hub</span>
          </Link>
          <p className="footer-desc">
            A complete student learning platform for interactive learning, study consistency, and curated reading.
          </p>
        </div>

        <div className="footer-links-group">
          <div className="footer-column">
            <h4>Platform</h4>
            <a href="#features">Simulations</a>
            <a href="#features">Library & Books</a>
            <a href="#features">Habit Tracker</a>
            <a href="#features">Quizzes</a>
          </div>

          <div className="footer-column">
            <h4>Company</h4>
            <Link href="#">About Us</Link>
            <Link href="#">Contact</Link>
            <Link href="#">Careers</Link>
          </div>

          <div className="footer-column">
            <h4>Legal & Admin</h4>
            <Link href="/terms">Terms &amp; Conditions</Link>
            <Link href="/admin/login">Admin Login 🔒</Link>
            <Link href="#">Privacy Policy</Link>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} Class 8th Hub. All rights reserved.</p>
      </div>
    </footer>
  );
}
