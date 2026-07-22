import React from 'react';

export function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="public-layout">
      {/* Header and Footer will be added in public pages step */}
      <main className="public-main">{children}</main>
    </div>
  );
}
