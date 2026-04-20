"use client";

import React from 'react';
import { ShinyText } from './ShinyText';
import { CalendarGrid } from './CalendarGrid';
import { OrbitalEvent } from '@/types/event';

interface MasterTimelineProps {
  currentDate: Date;
  view: 'month' | 'week' | 'day' | 'agenda';
  events: OrbitalEvent[];
  onDateChange: (date: Date) => void;
}

export const MasterTimeline: React.FC<MasterTimelineProps> = ({ currentDate, view, events, onDateChange }) => {
  const formatHeader = () => {
    return currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  const nav = (offset: number) => {
    const next = new Date(currentDate);
    if (view === 'month') next.setMonth(currentDate.getMonth() + offset);
    else if (view === 'week') next.setDate(currentDate.getDate() + (offset * 7));
    else next.setDate(currentDate.getDate() + offset);
    onDateChange(next);
  };

  return (
    <section className="master-timeline">
      <header className="timeline-header">
        <div className="title-area">
          <span className="micro-label">Master Timeline</span>
          <h1 className="shiny-title">
            <ShinyText text="Timeline Hub" />
          </h1>
        </div>
        
        <div className="nav-controls">
          <div className="month-selector">
            <button className="nav-btn" onClick={() => nav(-1)}>‹</button>
            <span className="current-month">{formatHeader()}</span>
            <button className="nav-btn" onClick={() => nav(1)}>›</button>
          </div>
          <button className="today-btn" onClick={() => onDateChange(new Date())}>Today</button>
        </div>
      </header>

      <CalendarGrid 
        currentDate={currentDate}
        view={view}
        events={events}
      />

      <style jsx>{`
        .master-timeline {
          flex: 1;
          height: 100%;
          display: flex;
          flex-direction: column;
          background: var(--onyx);
        }

        .timeline-header {
          padding: 20px 24px;
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          background: rgba(8, 10, 14, 0.5);
          backdrop-filter: blur(10px);
          border-bottom: 1px solid var(--border);
        }

        .micro-label {
          display: block;
          font-size: 9px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: var(--sienna);
          margin-bottom: 4px;
        }

        .shiny-title {
          font-family: var(--font-head);
          font-weight: 900;
          font-size: 24px;
          margin: 0;
        }

        .nav-controls {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .month-selector {
          display: flex;
          align-items: center;
          gap: 12px;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid var(--border);
          border-radius: 4px;
          padding: 4px 12px;
        }

        .nav-btn {
          background: transparent;
          border: none;
          color: var(--sub);
          font-size: 18px;
          cursor: pointer;
          padding: 0 4px;
          line-height: 1;
        }

        .nav-btn:hover {
          color: var(--sienna);
        }

        .current-month {
          font-family: var(--font-body);
          font-size: 11px;
          font-weight: 600;
          color: var(--text);
          min-width: 120px;
          text-align: center;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .today-btn {
          background: transparent;
          border: 1px solid var(--border);
          color: var(--sub);
          font-family: var(--font-body);
          font-size: 11px;
          font-weight: 600;
          padding: 6px 16px;
          border-radius: 4px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .today-btn:hover {
          border-color: var(--sub);
          color: var(--text);
          background: rgba(255, 255, 255, 0.05);
        }
      `}</style>
    </section>
  );
};
