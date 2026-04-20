"use client";

import React, { useRef } from 'react';

interface SpotlightCardProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export const SpotlightCard: React.FC<SpotlightCardProps> = ({ children, className, style }) => {
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    card.style.setProperty('--mx', `${x}px`);
    card.style.setProperty('--my', `${y}px`);
  };

  return (
    <div
      ref={cardRef}
      className={`spotlight-card ${className || ''}`}
      onMouseMove={handleMouseMove}
      style={style}
    >
      {children}
      <style jsx>{`
        .spotlight-card {
          position: relative;
          overflow: hidden;
          background: var(--panel2);
          border: 1px solid var(--border);
          border-radius: 8px;
          cursor: default;
          --mx: 50%;
          --my: 50%;
        }

        .spotlight-card::before {
          content: "";
          position: absolute;
          width: 180px;
          height: 180px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(232, 85, 10, 0.12) 0%, transparent 70%);
          pointer-events: none;
          transform: translate(-50%, -50%);
          left: var(--mx);
          top: var(--my);
          z-index: 1;
        }

        .spotlight-card:hover {
          border-color: rgba(232, 85, 10, 0.25);
        }
      `}</style>
    </div>
  );
};
