'use client';

import React from 'react';
import { DashboardLayout } from '@/layouts/DashboardLayout';

export default function ComingSoonPage() {
  return (
    <DashboardLayout title="Coming Soon">
      {/* PURE BLACK CONTAINER WRAPPER */}
      <div
        style={{
          position: 'relative',
          borderRadius: 'var(--radius-lg)',
          overflow: 'hidden',
          minHeight: '85vh',
          background: '#000000',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '24px',
          color: '#ffffff'
        }}
      >
        {/* NATIVE 1:1 HEX FIELD CANVAS ANIMATION IFRAME FROM animation.html */}
        <iframe
          src="/animation.html"
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            border: 'none',
            zIndex: 1,
            pointerEvents: 'none',
            background: '#000000'
          }}
          title="Hex Field Animation"
        />

        {/* OVERLAY CONTAINER SIT AT Z-INDEX 10 ABOVE THE ANIMATED CANVAS */}
        <div
          style={{
            position: 'relative',
            zIndex: 10,
            maxWidth: '680px',
            textAlign: 'center'
          }}
        >
          <blockquote className="monochrome-italic-quote">
            “The masons work in silence beyond the veil; soon, the corridors will stretch into uncharted wings, the tapestries will part to reveal hidden instruments, and the very foundations will hum with a swifter, quieter magic.”
          </blockquote>
        </div>

        <style jsx global>{`
          /* SMALL, ELEGANT BLACK & WHITE ITALIC QUOTE */
          .monochrome-italic-quote {
            margin: 0;
            font-family: Georgia, 'Playfair Display', 'Times New Roman', serif;
            font-style: italic;
            font-size: clamp(13px, 1.4vw, 16px);
            font-weight: 400;
            line-height: 1.7;
            letter-spacing: 0.3px;
            color: #ffffff;
            text-align: center;
            opacity: 0;
            /* APPEARS ONLY ONCE WHEN OPENED, FADES IN, HOLDS, THEN DISAPPEARS ONCE */
            animation: singleFadeOnce 8.5s cubic-bezier(0.4, 0, 0.2, 1) 0.4s 1 forwards;
          }

          @keyframes singleFadeOnce {
            0% {
              opacity: 0;
              transform: translateY(8px);
              filter: blur(6px);
            }
            18% {
              opacity: 1;
              transform: translateY(0);
              filter: blur(0px);
            }
            76% {
              opacity: 1;
              transform: translateY(0);
              filter: blur(0px);
            }
            100% {
              opacity: 0;
              transform: translateY(-8px);
              filter: blur(8px);
              visibility: hidden;
            }
          }
        `}</style>
      </div>
    </DashboardLayout>
  );
}
