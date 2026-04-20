"use client";

import React, { Suspense } from 'react';
import { OrbitalCommandCenter } from '@/components/orbital/OrbitalCommandCenter';

export default function CalendarPage() {
  return (
    <Suspense fallback={<div className="loading-shimmer">Loading Command Center...</div>}>
      <OrbitalCommandCenter />
      <style jsx>{`
        .loading-shimmer {
          position: fixed;
          inset: 0;
          background: #080A0E;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #8A8F9A;
          font-family: 'Epilogue', sans-serif;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          font-size: 11px;
        }
      `}</style>
    </Suspense>
  );
}
