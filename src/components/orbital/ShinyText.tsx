"use client";

import React from 'react';

interface ShinyTextProps {
  text: string;
  className?: string;
}

export const ShinyText: React.FC<ShinyTextProps> = ({ text, className }) => {
  return (
    <span className={`shiny-text ${className || ''}`}>
      {text}
      <style jsx>{`
        .shiny-text {
          background: linear-gradient(90deg, 
            var(--sub) 0%, 
            var(--text) 30%, 
            var(--text) 50%, 
            rgba(255,255,255,0.95) 60%, 
            var(--text) 70%, 
            var(--sub) 100%
          );
          background-size: 200% auto;
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: shiny-move 3s linear infinite;
          display: inline-block;
        }

        @keyframes shiny-move {
          to { background-position: 200% center; }
        }
      `}</style>
    </span>
  );
};
