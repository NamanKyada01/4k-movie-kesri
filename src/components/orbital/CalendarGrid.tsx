"use client";

import React from 'react';
import { OrbitalEvent } from '@/types/event';

interface CalendarGridProps {
  currentDate: Date;
  view: 'month' | 'week' | 'day' | 'agenda';
  events: OrbitalEvent[];
}

export const CalendarGrid: React.FC<CalendarGridProps> = ({ currentDate, view, events }) => {
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    return { firstDay, daysInMonth };
  };

  const renderMonth = () => {
    const { firstDay, daysInMonth } = getDaysInMonth(currentDate);
    const cells = [];
    const today = new Date();

    // Start with last month's trailing days
    const prevMonthDays = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0).getDate();
    for (let i = firstDay - 1; i >= 0; i--) {
      cells.push(<div key={`prev-${i}`} className="cell other-month">{prevMonthDays - i}</div>);
    }

    // Current month days
    for (let d = 1; d <= daysInMonth; d++) {
      const isToday = today.getDate() === d && today.getMonth() === currentDate.getMonth() && today.getFullYear() === currentDate.getFullYear();
      const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      const dayEvents = events.filter(e => e.date === dateStr);

      cells.push(
        <div key={d} className={`cell ${isToday ? 'today' : ''}`}>
          <div className="day-number">{d}</div>
          <div className="day-events">
            {dayEvents.slice(0, 2).map((e, idx) => (
              <div key={idx} className={`event-pill type-${e.type}`}>
                {e.title}
              </div>
            ))}
            {dayEvents.length > 2 && (
              <span className="more-label">+{dayEvents.length - 2} more</span>
            )}
          </div>
        </div>
      );
    }

    return (
      <div className="orbital-month-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', width: '100%', minWidth: '700px' }}>
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="grid-h-cell" style={{ textAlign: 'center', padding: '12px', borderBottom: '1px solid var(--border)', borderRight: '1px solid var(--border)', fontSize: '10px', fontWeight: 800, textTransform: 'uppercase', color: 'var(--sub2)' }}>{day}</div>
        ))}
        {cells}
      </div>
    );
  };

  const renderWeek = () => {
    const startOfWeek = new Date(currentDate);
    startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());
    
    return (
      <div className="orbital-week-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', width: '100%', minWidth: '700px' }}>
        {Array.from({ length: 7 }).map((_, i) => {
          const date = new Date(startOfWeek);
          date.setDate(startOfWeek.getDate() + i);
          const dateStr = date.toISOString().split('T')[0];
          const dayEvents = events.filter(e => e.date === dateStr);
          
          return (
            <div key={i} className="week-col" style={{ borderRight: '1px solid var(--border)', minHeight: '600px' }}>
              <div className="grid-h-cell" style={{ display: 'flex', flexDirection: 'column', gap: '4px', textAlign: 'left', padding: '12px', borderBottom: '1px solid var(--border)', borderRight: '1px solid var(--border)' }}>
                <span style={{ fontSize: '10px', color: 'var(--sub2)', fontWeight: 700 }}>{date.toLocaleDateString('en-US', { weekday: 'short' })}</span>
                <span className="h-date" style={{ fontFamily: 'var(--font-head)', fontSize: '16px', fontWeight: 800, color: 'var(--text)' }}>{date.getDate()}</span>
              </div>
              <div className="week-events" style={{ padding: '12px 6px' }}>
                {dayEvents.map((e, idx) => (
                  <div key={idx} className={`event-pill large type-${e.type}`} style={{ marginBottom: '8px' }}>
                    <span className="e-time">{e.time}</span>
                    <span className="e-title">{e.title}</span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const renderDay = () => {
    const dateStr = currentDate.toISOString().split('T')[0];
    const dayEvents = events.filter(e => e.date === dateStr);

    return (
      <div className="day-view">
        <div className="day-header">
          {currentDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
        </div>
        <div className="day-list">
          {dayEvents.length > 0 ? (
            dayEvents.map((e, idx) => (
              <div key={idx} className={`day-item type-${e.type}`}>
                <div className="item-time">{e.time} ({e.dur})</div>
                <div className="item-title">{e.title}</div>
                <div className="item-meta">Role: {e.type.toUpperCase()} | Value: ₹{e.value?.toLocaleString('en-IN')}</div>
              </div>
            ))
          ) : (
            <div className="empty-day">No events scheduled for this day.</div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="calendar-grid-container scrollbar-hidden">
      {view === 'month' && renderMonth()}
      {view === 'week' && renderWeek()}
      {(view === 'day' || view === 'agenda') && renderDay()}

      <style jsx>{`
        .calendar-grid-container {
          flex: 1;
          overflow-y: auto;
          background: var(--onyx);
          width: 100%;
        }

        .orbital-month-grid, .orbital-week-grid {
          display: grid;
          grid-template-columns: repeat(7, 1fr) !important;
          width: 100%;
          min-width: 700px;
          border-left: 1px solid var(--border);
          border-top: 1px solid var(--border);
        }

        .grid-h-cell {
          background: rgba(255, 255, 255, 0.02);
        }

        .cell {
          min-height: 120px;
          padding: 10px;
          border-right: 1px solid var(--border);
          border-bottom: 1px solid var(--border);
          transition: background 0.2s ease;
          cursor: pointer;
          position: relative;
        }

        .cell:hover {
          background: rgba(255, 255, 255, 0.04);
        }

        .cell.other-month {
          background: rgba(0, 0, 0, 0.2);
          opacity: 0.3;
        }

        .cell.today {
          background: rgba(232, 85, 10, 0.08);
        }

        .cell.today::after {
          content: "";
          position: absolute;
          top: 0; left: 0; width: 100%; height: 2px;
          background: var(--sienna);
        }

        .day-number {
          font-family: var(--font-head);
          font-size: 13px;
          color: var(--sub);
          margin-bottom: 12px;
          font-weight: 800;
          display: inline-block;
        }

        .today .day-number {
          background: var(--sienna);
          color: #fff;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .day-events {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .event-pill {
          font-size: 9px;
          font-weight: 700;
          padding: 2px 6px;
          border-radius: 3px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .event-pill.large {
          font-size: 10px;
          padding: 6px 10px;
          display: flex;
          flex-direction: column;
          gap: 2px;
          margin-bottom: 6px;
        }

        .e-time { font-size: 8px; opacity: 0.7; }

        .type-shoot { background: rgba(232, 85, 10, 0.2); color: #FF6B1A; border-left: 2px solid var(--sienna); }
        .type-consult { background: rgba(59, 130, 246, 0.15); color: #60a5fa; border-left: 2px solid var(--blue); }
        .type-edit { background: rgba(245, 158, 11, 0.15); color: #fbbf24; border-left: 2px solid var(--amber); }
        .type-deliver { background: rgba(34, 197, 94, 0.15); color: #4ade80; border-left: 2px solid var(--green); }

        .more-label {
          font-size: 8px;
          color: var(--sub2);
          font-weight: 600;
          margin-top: 2px;
        }

        .week-col {
          border-right: 1px solid var(--border);
          min-height: 600px;
        }

        .week-events {
          padding: 12px 6px;
        }

        .day-view {
          padding: 40px;
          max-width: 800px;
          margin: 0 auto;
        }

        .day-header {
          font-family: var(--font-head);
          font-size: 32px;
          font-weight: 900;
          color: var(--text);
          margin-bottom: 40px;
          border-bottom: 1px solid var(--border);
          padding-bottom: 20px;
        }

        .day-item {
          padding: 20px;
          border-radius: 8px;
          background: var(--panel2);
          border: 1px solid var(--border);
          margin-bottom: 16px;
        }

        .item-time {
          font-size: 11px;
          color: var(--sub);
          margin-bottom: 4px;
        }

        .item-title {
          font-family: var(--font-head);
          font-size: 18px;
          font-weight: 800;
          color: var(--text);
        }

        .item-meta {
          font-size: 11px;
          color: var(--sub2);
          margin-top: 8px;
        }

        .empty-day {
          padding: 40px;
          text-align: center;
          color: var(--sub2);
          border: 2px dashed var(--border);
          border-radius: 12px;
        }
      `}</style>
    </div>
  );
};
