"use client";

import React, { useRef, useState } from 'react';

interface MagneticButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  style?: React.CSSProperties;
}

export const MagneticButton: React.FC<MagneticButtonProps> = ({ children, onClick, className, style }) => {
  const btnRef = useRef<HTMLButtonElement>(null);
  const [transform, setTransform] = useState('');

  const handleMouseMove = (e: React.MouseEvent) => {
    const btn = btnRef.current;
    if (!btn) return;

    const rect = btn.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = (e.clientX - cx) * 0.3;
    const dy = (e.clientY - cy) * 0.3;

    setTransform(`translate(${dx}px, ${dy}px) scale(1.04)`);
  };

  const handleMouseLeave = () => {
    setTransform('');
  };

  return (
    <button
      ref={btnRef}
      className={`magnetic-btn ${className || ''}`}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        ...style,
        transform,
        transition: transform ? 'none' : 'transform 0.15s ease'
      }}
    >
      {children}
      <style jsx>{`
        .magnetic-btn {
          background: var(--sienna);
          color: #fff;
          border: none;
          padding: 7px 16px;
          border-radius: 4px;
          font-family: var(--font-head);
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          cursor: pointer;
          position: relative;
          z-index: 10;
        }
        .magnetic-btn:hover {
          box-shadow: 0 0 24px rgba(232, 85, 10, 0.5);
        }
      `}</style>
    </button>
  );
};
