import React from 'react';

export function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="auth-layout">
      <main className="auth-main">{children}</main>
    </div>
  );
}
