"use client";

import React from 'react';
import { OrbitalEvent } from '@/types/event';

interface ProductionQueueProps {
  events: OrbitalEvent[];
  loading: boolean;
}

export const ProductionQueue: React.FC<ProductionQueueProps> = ({ events, loading }) => {
  const upcoming = events
    .filter(e => new Date(e.date) >= new Date())
    .sort((a, b) => a.date.localeCompare(b.date));

  return (
    <aside className="production-queue scrollbar-hidden">
      <header className="panel-header">
        <span className="micro-label">Upcoming Deployments</span>
        <h2 className="panel-title">Production Queue</h2>
        <div className="live-status">
          <div className="status-dot"></div>
          <span className="status-txt">{loading ? '---' : upcoming.length} events this month</span>
        </div>
      </header>

      <div className="queue-list">
        {upcoming.map((e, idx) => (
          <div key={e.id || idx} className="queue-item" style={{ animationDelay: `${idx * 0.05}s` }}>
            <div className={`type-strip type-${e.type}`}></div>
            <div className="q-content">
              <span className="q-date">{new Date(e.date).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' })}</span>
              <h4 className="q-title">{e.title}</h4>
              <div className="q-meta">
                <span className={`q-badge badge-${e.type}`}>{e.type}</span>
                <span className="q-time">{e.time}</span>
              </div>
            </div>
          </div>
        ))}
        {upcoming.length === 0 && !loading && (
          <div className="empty-queue">No upcoming deployments.</div>
        )}
      </div>

      <style jsx>{`
        .production-queue {
          width: 260px;
          height: 100%;
          background: var(--onyx2);
          border-left: 1px solid var(--border);
          overflow-y: auto;
          display: flex;
          flex-direction: column;
        }

        .panel-header {
          padding: 20px;
          background: rgba(13, 16, 23, 0.95);
          backdrop-filter: blur(10px);
          position: sticky;
          top: 0;
          z-index: 10;
        }

        .micro-label {
          display: block;
          font-size: 9px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: var(--sub);
          margin-bottom: 4px;
        }

        .panel-title {
          font-family: var(--font-head);
          font-weight: 800;
          font-size: 18px;
          color: var(--text);
        }

        .live-status {
          display: flex;
          align-items: center;
          gap: 6px;
          margin-top: 8px;
        }

        .status-dot {
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: var(--green);
        }

        .status-txt {
          font-size: 10px;
          color: var(--sub);
          letter-spacing: 0.02em;
        }

        .queue-list {
          padding: 8px 0;
        }

        .queue-item {
          margin: 8px 12px;
          border-radius: 8px;
          padding: 12px;
          background: var(--panel2);
          border: 1px solid var(--border);
          cursor: pointer;
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          overflow: hidden;
          animation: slideIn 0.4s ease-out both;
        }

        .queue-item:hover {
          background: rgba(20, 24, 32, 0.9);
          border-color: var(--border2);
          transform: translateX(3px);
        }

        .type-strip {
          position: absolute;
          left: 0;
          top: 0;
          bottom: 0;
          width: 3px;
          border-radius: 3px 0 0 3px;
        }

        .type-shoot { background: var(--sienna); }
        .type-consult { background: var(--blue); }
        .type-edit { background: var(--amber); }
        .type-deliver { background: var(--green); }

        .q-date {
          display: block;
          font-size: 9px;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: var(--sub);
          margin-bottom: 4px;
        }

        .q-title {
          font-family: var(--font-head);
          font-size: 12px;
          font-weight: 700;
          color: var(--text);
          margin: 0 0 8px 0;
          line-height: 1.3;
        }

        .q-meta {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .q-badge {
          font-size: 8px;
          text-transform: uppercase;
          font-weight: 700;
          padding: 2px 6px;
          border-radius: 3px;
        }

        .badge-shoot { background: var(--sienna-dim); color: var(--sienna); }
        .badge-consult { background: rgba(59, 130, 246, 0.1); color: #60a5fa; }
        .badge-edit { background: rgba(245, 158, 11, 0.1); color: #fbbf24; }
        .badge-deliver { background: rgba(34, 197, 94, 0.1); color: #4ade80; }

        .q-time {
          font-size: 10px;
          color: var(--sub2);
        }

        @keyframes slideIn {
          from { opacity: 0; transform: translateX(10px); }
          to { opacity: 1; transform: translateX(0); }
        }

        .empty-queue {
          padding: 40px 20px;
          text-align: center;
          font-size: 11px;
          color: var(--sub2);
        }
      `}</style>
    </aside>
  );
};
