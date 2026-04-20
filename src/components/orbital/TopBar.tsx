"use client";

import React from 'react';
import { MagneticButton } from './MagneticButton';

interface TopBarProps {
  currentView: string;
  onViewChange: (view: string) => void;
}

export const TopBar: React.FC<TopBarProps> = ({ currentView, onViewChange }) => {
  const views = ['Month', 'Week', 'Day', 'Agenda'];

  return (
    <header className="top-bar">
      <div className="left">
        <span className="logo">⬡ Orbital Command</span>
      </div>
      
      <div className="center">
        <div className="view-switcher">
          {views.map(view => (
            <button
              key={view}
              className={`view-btn ${currentView.toLowerCase() === view.toLowerCase() ? 'active' : ''}`}
              onClick={() => onViewChange(view.toLowerCase())}
            >
              {view}
            </button>
          ))}
        </div>
      </div>

      <div className="right">
        <div className="status">
          <div className="live-dot"></div>
          <span className="live-label">LIVE SYNC</span>
        </div>
        <MagneticButton onClick={() => {}}>
          New Deployment
        </MagneticButton>
      </div>

      <style jsx>{`
        .top-bar {
          height: 56px;
          position: relative;
          z-index: 100;
          background: rgba(8, 10, 14, 0.8);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border-bottom: 1px solid var(--border);
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 20px;
        }

        .logo {
          font-family: var(--font-head);
          font-size: 13px;
          font-weight: 700;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: var(--sienna);
        }

        .view-switcher {
          display: flex;
          gap: 4px;
          padding: 2px;
          background: rgba(255, 255, 255, 0.02);
          border-radius: 6px;
          border: 1px solid var(--border);
        }

        .view-btn {
          background: transparent;
          border: none;
          color: var(--sub);
          font-family: var(--font-body);
          font-size: 11px;
          padding: 6px 14px;
          border-radius: 4px;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .view-btn:hover {
          color: var(--text);
          background: rgba(255, 255, 255, 0.05);
        }

        .view-btn.active {
          background: var(--sienna-dim);
          border: 1px solid var(--sienna);
          color: var(--sienna);
        }

        .right {
          display: flex;
          align-items: center;
          gap: 24px;
        }

        .status {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .live-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: var(--green);
          box-shadow: 0 0 8px var(--green);
          animation: pulse 2s infinite;
        }

        .live-label {
          font-family: var(--font-body);
          font-size: 10px;
          color: var(--sub);
          letter-spacing: 0.06em;
          font-weight: 500;
        }

        @keyframes pulse {
          0% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(0.9); }
          100% { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </header>
  );
};
