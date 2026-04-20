"use client";

import React, { useState } from 'react';
import { ParticleCanvas } from './ParticleCanvas';
import { MagneticButton } from './MagneticButton';
import { OrbitalEvent } from '@/types/event';

// ── Mock Data ──────────────────────────────────────────────────────────────
const MOCK_EVENTS: OrbitalEvent[] = [
  { id: '1', date: '2026-04-20', title: 'Royal Wedding Shoot', type: 'shoot', status: 'confirmed', time: '10:00', dur: '8h', value: 85000, category: 'Weddings', clientName: 'Sharma Family' },
  { id: '2', date: '2026-04-20', title: 'Draft Review Session', type: 'edit', status: 'pending', time: '19:00', dur: '3h', value: 0 },
  { id: '3', date: '2026-04-21', title: 'Corporate Interview: TechCorp', type: 'shoot', status: 'confirmed', time: '14:00', dur: '4h', value: 45000, category: 'Corporate', clientName: 'TechCorp Ltd.' },
  { id: '4', date: '2026-04-22', title: 'Project Zenith Delivery', type: 'deliver', status: 'completed', time: '09:00', dur: '1h', value: 0 },
  { id: '5', date: '2026-04-22', title: 'Mehta Family Portraits', type: 'shoot', status: 'pending', time: '16:00', dur: '2h', value: 15000, category: 'Portraits', clientName: 'Mehta Family' },
  { id: '6', date: '2026-04-23', title: 'Post-Production: Royal Wedding', type: 'edit', status: 'pending', time: '10:00', dur: '6h', value: 0 },
  { id: '7', date: '2026-04-24', title: 'Client Consultation: Stellar Ads', type: 'consult', status: 'confirmed', time: '11:30', dur: '1h', value: 5000, category: 'Corporate', clientName: 'Stellar Media' },
  { id: '8', date: '2026-04-25', title: 'Product Launch: Nexus 9', type: 'shoot', status: 'confirmed', time: '18:00', dur: '5h', value: 65000, category: 'Corporate', clientName: 'Nexus Corp' },
  { id: '9', date: '2026-04-26', title: 'Final Export: Nexus 9', type: 'edit', status: 'pending', time: '09:00', dur: '4h', value: 0 },
  { id: '10', date: '2026-04-27', title: 'Delivery: TechCorp Reel', type: 'deliver', status: 'pending', time: '10:00', dur: '1h', value: 0 },
  { id: '11', date: '2026-04-15', title: 'Anniversary Shoot: Patels', type: 'shoot', status: 'confirmed', time: '17:00', dur: '3h', value: 25000, category: 'Portraits', clientName: 'Patel Couple' },
  { id: '12', date: '2026-04-28', title: 'Pre-Wedding Consultation', type: 'consult', status: 'confirmed', time: '12:00', dur: '1.5h', value: 5000, category: 'Weddings', clientName: 'Singh Family' },
];

// ── Type Colors ──────────────────────────────────────────────────────────
const TYPE_CONFIG: Record<string, { bg: string; text: string; border: string; label: string }> = {
  shoot:   { bg: 'rgba(232,85,10,0.15)',   text: '#FF6B1A', border: '#E8550A', label: 'SHOOT' },
  consult: { bg: 'rgba(59,130,246,0.12)',  text: '#60a5fa', border: '#3B82F6', label: 'CONSULT' },
  edit:    { bg: 'rgba(245,158,11,0.12)',  text: '#fbbf24', border: '#F59E0B', label: 'EDIT' },
  deliver: { bg: 'rgba(34,197,94,0.12)',   text: '#4ade80', border: '#22C55E', label: 'DELIVER' },
};

// ── Helpers ──────────────────────────────────────────────────────────────
const toDateStr = (d: Date) => `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;

const isToday = (d: Date) => {
  const t = new Date();
  return d.getDate() === t.getDate() && d.getMonth() === t.getMonth() && d.getFullYear() === t.getFullYear();
};

const formatShortDate = (dateStr: string) => {
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' });
};

// ── Sub-Components ────────────────────────────────────────────────────────

const EventPill: React.FC<{ event: OrbitalEvent; large?: boolean }> = ({ event, large }) => {
  const cfg = TYPE_CONFIG[event.type] || TYPE_CONFIG.shoot;
  return (
    <div style={{
      background: cfg.bg,
      color: cfg.text,
      borderLeft: `2px solid ${cfg.border}`,
      borderRadius: 3,
      padding: large ? '6px 8px' : '2px 6px',
      fontSize: large ? 11 : 9,
      fontWeight: 700,
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      marginBottom: large ? 6 : 3,
      fontFamily: 'var(--font-body)',
    }}>
      {large && <div style={{ fontSize: 8, opacity: 0.7, marginBottom: 2 }}>{event.time}</div>}
      {event.title}
    </div>
  );
};

const TodayEventCard: React.FC<{ event: OrbitalEvent }> = ({ event }) => {
  const cfg = TYPE_CONFIG[event.type];
  return (
    <div style={{ position: 'relative', paddingLeft: 16, marginBottom: 20 }}>
      <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 2, background: cfg.border, borderRadius: 1 }} />
      <div style={{ fontSize: 9, fontWeight: 700, color: cfg.text, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 4, fontFamily: 'var(--font-body)' }}>
        {event.time} — {cfg.label}
      </div>
      <div style={{ fontFamily: 'var(--font-head)', fontWeight: 800, fontSize: 14, color: 'var(--text)', lineHeight: 1.3, marginBottom: 4 }}>
        {event.title}
      </div>
      {event.clientName && (
        <div style={{ fontSize: 10, color: 'var(--sub)', fontFamily: 'var(--font-body)' }}>
          {event.clientName}
        </div>
      )}
    </div>
  );
};

// ── Month View ────────────────────────────────────────────────────────────
const MonthView: React.FC<{ date: Date; events: OrbitalEvent[]; onSelectDay: (d: string) => void; selectedDay: string | null }> = ({ date, events, onSelectDay, selectedDay }) => {
  const year = date.getFullYear();
  const month = date.getMonth();
  const firstDayOfWeek = new Date(year, month, 1).getDay(); // 0=Sun
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const prevMonthDays = new Date(year, month, 0).getDate();

  const cells: React.ReactNode[] = [];
  const DAYS = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];

  // header
  DAYS.forEach(d => (
    cells.push(
      <div key={`h-${d}`} style={{ padding: '10px 12px', fontSize: 9, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.14em', color: 'var(--sub2)', borderBottom: '1px solid var(--border)', textAlign: 'center', borderRight: '1px solid var(--border)', fontFamily: 'var(--font-body)' }}>
        {d}
      </div>
    )
  ));

  // prev month padding
  for (let i = firstDayOfWeek - 1; i >= 0; i--) {
    const day = prevMonthDays - i;
    cells.push(
      <div key={`prev-${i}`} style={{ minHeight: 120, padding: 10, borderRight: '1px solid var(--border)', borderBottom: '1px solid var(--border)', opacity: 0.2, background: 'rgba(0,0,0,0.2)' }}>
        <span style={{ fontFamily: 'var(--font-head)', fontSize: 14, fontWeight: 800, color: 'var(--sub)' }}>{day}</span>
      </div>
    );
  }

  // current month
  for (let d = 1; d <= daysInMonth; d++) {
    const thisDate = new Date(year, month, d);
    const dateStr = toDateStr(thisDate);
    const dayEvents = events.filter(e => e.date === dateStr);
    const today = isToday(thisDate);
    const selected = selectedDay === dateStr;

    cells.push(
      <div
        key={`d-${d}`}
        onClick={() => onSelectDay(dateStr)}
        style={{
          minHeight: 120,
          padding: 10,
          borderRight: '1px solid var(--border)',
          borderBottom: '1px solid var(--border)',
          cursor: 'pointer',
          background: today ? 'rgba(232,85,10,0.06)' : selected ? 'rgba(255,255,255,0.03)' : 'transparent',
          position: 'relative',
          transition: 'background 0.15s',
        }}
        onMouseEnter={e => { if (!today) (e.currentTarget as HTMLDivElement).style.background = 'rgba(255,255,255,0.025)'; }}
        onMouseLeave={e => { if (!today && !selected) (e.currentTarget as HTMLDivElement).style.background = 'transparent'; else if (today) (e.currentTarget as HTMLDivElement).style.background = 'rgba(232,85,10,0.06)'; }}
      >
        {today && <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: 'var(--sienna)' }} />}
        <div style={{
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          width: 26, height: 26, borderRadius: today ? '50%' : 4,
          background: today ? 'var(--sienna)' : 'transparent',
          fontFamily: 'var(--font-head)', fontSize: 14, fontWeight: 800,
          color: today ? '#fff' : 'var(--sub)',
          marginBottom: 8,
        }}>
          {d}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {dayEvents.slice(0, 2).map((ev, idx) => <EventPill key={idx} event={ev} />)}
          {dayEvents.length > 2 && (
            <div style={{ fontSize: 8, color: 'var(--sub2)', fontWeight: 600, marginTop: 1 }}>+{dayEvents.length - 2} more</div>
          )}
        </div>
      </div>
    );
  }

  // fill last row
  const totalCells = cells.length - 7; // subtract headers
  const remainder = totalCells % 7;
  if (remainder > 0) {
    for (let n = 1; n <= 7 - remainder; n++) {
      cells.push(
        <div key={`next-${n}`} style={{ minHeight: 120, padding: 10, borderRight: '1px solid var(--border)', borderBottom: '1px solid var(--border)', opacity: 0.15 }}>
          <span style={{ fontFamily: 'var(--font-head)', fontSize: 14, fontWeight: 800, color: 'var(--sub)' }}>{n}</span>
        </div>
      );
    }
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', width: '100%', borderLeft: '1px solid var(--border)', borderTop: '1px solid var(--border)' }}>
      {cells}
    </div>
  );
};

// ── Week View ─────────────────────────────────────────────────────────────
const WeekView: React.FC<{ date: Date; events: OrbitalEvent[] }> = ({ date, events }) => {
  const startOfWeek = new Date(date);
  startOfWeek.setDate(date.getDate() - date.getDay());

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', width: '100%', borderLeft: '1px solid var(--border)', borderTop: '1px solid var(--border)' }}>
      {Array.from({ length: 7 }).map((_, i) => {
        const d = new Date(startOfWeek);
        d.setDate(startOfWeek.getDate() + i);
        const dateStr = toDateStr(d);
        const dayEvents = events.filter(e => e.date === dateStr);
        const today = isToday(d);
        const isWeekend = d.getDay() === 0 || d.getDay() === 6;

        return (
          <div key={i} style={{ borderRight: '1px solid var(--border)', minHeight: 600, opacity: isWeekend ? 0.6 : 1 }}>
            {/* header */}
            <div style={{
              padding: '12px',
              borderBottom: '1px solid var(--border)',
              background: today ? 'rgba(232,85,10,0.06)' : 'rgba(255,255,255,0.02)',
              position: 'relative',
            }}>
              {today && <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: 'var(--sienna)' }} />}
              <div style={{ fontSize: 9, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.14em', color: today ? 'var(--sienna)' : 'var(--sub2)', marginBottom: 4, fontFamily: 'var(--font-body)' }}>
                {d.toLocaleDateString('en-US', { weekday: 'short' })}
              </div>
              <div style={{
                fontFamily: 'var(--font-head)', fontSize: 22, fontWeight: 900,
                color: today ? 'var(--sienna)' : 'var(--text)',
              }}>
                {d.getDate()}
              </div>
            </div>
            {/* events */}
            <div style={{ padding: '12px 8px' }}>
              {dayEvents.map((ev, idx) => <EventPill key={idx} event={ev} large />)}
              {dayEvents.length === 0 && (
                <div style={{ height: 40, border: '1px dashed rgba(255,255,255,0.05)', borderRadius: 4, marginTop: 4 }} />
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

// ── Day View ──────────────────────────────────────────────────────────────
const DayView: React.FC<{ date: Date; events: OrbitalEvent[] }> = ({ date, events }) => {
  const dateStr = toDateStr(date);
  const dayEvents = events.filter(e => e.date === dateStr).sort((a,b) => a.time.localeCompare(b.time));

  return (
    <div style={{ padding: '32px 40px', maxWidth: 700 }}>
      <div style={{ fontFamily: 'var(--font-head)', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.18em', color: 'var(--sienna)', marginBottom: 8 }}>
        {date.toLocaleDateString('en-US', { weekday: 'long' })}
      </div>
      <div style={{ fontFamily: 'var(--font-head)', fontSize: 40, fontWeight: 900, color: 'var(--text)', lineHeight: 1, marginBottom: 32, borderBottom: '1px solid var(--border)', paddingBottom: 20 }}>
        {date.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
      </div>

      {dayEvents.length === 0 && (
        <div style={{ padding: '40px 20px', textAlign: 'center', border: '1px dashed var(--border)', borderRadius: 8, color: 'var(--sub2)', fontSize: 12 }}>
          No events scheduled
        </div>
      )}

      {dayEvents.map((ev, idx) => {
        const cfg = TYPE_CONFIG[ev.type];
        return (
          <div key={idx} style={{ display: 'flex', gap: 20, marginBottom: 16 }}>
            <div style={{ width: 60, flexShrink: 0, paddingTop: 4 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--sub)', fontFamily: 'var(--font-body)' }}>{ev.time}</div>
              <div style={{ fontSize: 9, color: 'var(--sub2)', marginTop: 2 }}>{ev.dur}</div>
            </div>
            <div style={{
              flex: 1, padding: '16px 20px', borderRadius: 8,
              background: cfg.bg, borderLeft: `3px solid ${cfg.border}`,
              border: '1px solid var(--border)', borderLeftWidth: 3, borderLeftColor: cfg.border,
            }}>
              <div style={{ fontSize: 9, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.12em', color: cfg.text, marginBottom: 6 }}>
                {cfg.label}
                {ev.status === 'confirmed' && <span style={{ marginLeft: 8, color: 'var(--green)' }}>● CONFIRMED</span>}
              </div>
              <div style={{ fontFamily: 'var(--font-head)', fontSize: 16, fontWeight: 800, color: 'var(--text)', marginBottom: 4 }}>{ev.title}</div>
              {ev.clientName && <div style={{ fontSize: 11, color: 'var(--sub)', fontFamily: 'var(--font-body)' }}>{ev.clientName}</div>}
              {ev.value && ev.value > 0 && (
                <div style={{ marginTop: 10, fontSize: 10, color: 'var(--sub2)', fontFamily: 'var(--font-body)' }}>
                  Value: <span style={{ color: 'var(--green)', fontWeight: 700 }}>₹{ev.value.toLocaleString('en-IN')}</span>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

// ── Root Component ────────────────────────────────────────────────────────
export const OrbitalCommandCenter: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<'month' | 'week' | 'day' | 'agenda'>('month');
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const events = MOCK_EVENTS;

  const todayStr = toDateStr(new Date());
  const todayEvents = events.filter(e => e.date === (selectedDay || todayStr)).sort((a, b) => a.time.localeCompare(b.time));

  const navigate = (dir: number) => {
    const next = new Date(currentDate);
    if (view === 'month') next.setMonth(currentDate.getMonth() + dir);
    else if (view === 'week') next.setDate(currentDate.getDate() + dir * 7);
    else next.setDate(currentDate.getDate() + dir);
    setCurrentDate(next);
  };

  const headerTitle = () => {
    if (view === 'month') return currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    if (view === 'week') {
      const s = new Date(currentDate); s.setDate(currentDate.getDate() - currentDate.getDay());
      const e = new Date(s); e.setDate(s.getDate() + 6);
      return `${s.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} – ${e.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;
    }
    return currentDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
  };

  const upcomingEvents = events.filter(e => e.date >= todayStr).sort((a, b) => a.date.localeCompare(b.date));
  const totalShoots = events.filter(e => e.type === 'shoot').length;
  const confirmed = events.filter(e => e.status === 'confirmed').length;
  const pending = events.filter(e => e.status === 'pending').length;
  const revenue = events.reduce((s, e) => s + (e.value || 0), 0);

  const displayEvents = selectedDay ? events.filter(e => e.date === selectedDay) : todayEvents;
  const sidebarTitle = selectedDay
    ? new Date(selectedDay + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    : 'Today';

  return (
    <>
      <style>{`
        :root {
          --onyx: #080A0E;
          --onyx2: #0D1017;
          --panel: #0F1219;
          --panel2: #141820;
          --border: rgba(255,255,255,0.06);
          --border2: rgba(255,255,255,0.10);
          --sienna: #E8550A;
          --sienna2: #FF6B1A;
          --sienna-dim: rgba(232,85,10,0.15);
          --text: #F0EDE8;
          --sub: #8A8F9A;
          --sub2: #5A5F6A;
          --green: #22C55E;
          --amber: #F59E0B;
          --blue: #3B82F6;
          --font-head: 'Epilogue', sans-serif;
          --font-body: 'Plus Jakarta Sans', sans-serif;
        }
        .orbital-root * { box-sizing: border-box; }
        .orbital-root .scrollbar-hide::-webkit-scrollbar { display: none; }
        .orbital-root .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
        @keyframes fadein { from { opacity:0; transform:translateY(6px); } to { opacity:1;transform:none; } }
        @keyframes pulse-dot { 0%,100%{opacity:1;} 50%{opacity:0.4;} }
      `}</style>

      <div className="orbital-root" style={{ position: 'fixed', top: 0, left: 'var(--sidebar-width, 260px)', right: 0, bottom: 0, background: 'var(--onyx)', color: 'var(--text)', fontFamily: 'var(--font-body)', display: 'grid', gridTemplateRows: '56px 1fr', overflow: 'hidden', zIndex: 50 }}>
        {/* HUD scanline */}
        <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 2, background: 'repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,0,0,0.03) 2px,rgba(0,0,0,0.03) 4px)', opacity: 0.4 }} />
        <ParticleCanvas />

        {/* ── TOP BAR ── */}
        <header style={{ height: 56, zIndex: 100, background: 'rgba(8,10,14,0.85)', backdropFilter: 'blur(20px)', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 20px', gap: 16 }}>
          <div style={{ fontFamily: 'var(--font-head)', fontSize: 12, fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--sienna)', flexShrink: 0 }}>
            ⬡ Orbital Command
          </div>

          {/* view switcher */}
          <div style={{ display: 'flex', gap: 3, background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)', borderRadius: 6, padding: 3 }}>
            {(['month','week','day','agenda'] as const).map(v => (
              <button key={v} onClick={() => setView(v)} style={{
                background: view === v ? 'var(--sienna-dim)' : 'transparent',
                border: view === v ? '1px solid var(--sienna)' : '1px solid transparent',
                color: view === v ? 'var(--sienna)' : 'var(--sub)',
                borderRadius: 4, padding: '5px 14px',
                fontSize: 11, fontWeight: 600, fontFamily: 'var(--font-body)',
                cursor: 'pointer', textTransform: 'capitalize', transition: 'all 0.2s',
              }}>
                {v.charAt(0).toUpperCase() + v.slice(1)}
              </button>
            ))}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--green)', boxShadow: '0 0 8px var(--green)', animation: 'pulse-dot 2s infinite' }} />
              <span style={{ fontSize: 10, color: 'var(--sub)', letterSpacing: '0.06em', fontFamily: 'var(--font-body)' }}>LIVE SYNC</span>
            </div>
            <MagneticButton onClick={() => {}}>New Deployment</MagneticButton>
          </div>
        </header>

        {/* ── BODY ── */}
        <div style={{ display: 'flex', height: '100%', overflow: 'hidden', animation: 'fadein 0.5s ease-out' }}>

          {/* ─── LEFT: METRICS VAULT ─── */}
          <aside className="scrollbar-hide" style={{ width: 240, flexShrink: 0, background: 'var(--onyx2)', borderRight: '1px solid var(--border)', overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
            {/* sticky header */}
            <div style={{ padding: '18px 16px 12px', position: 'sticky', top: 0, background: 'rgba(13,16,23,0.96)', backdropFilter: 'blur(10px)', zIndex: 5, borderBottom: '1px solid var(--border)' }}>
              <div style={{ fontSize: 9, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--sienna)', marginBottom: 3 }}>Fleet Operations</div>
              <div style={{ fontFamily: 'var(--font-head)', fontWeight: 800, fontSize: 16, color: 'var(--text)' }}>Metrics Vault</div>
            </div>

            {/* mini stat row */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 1, padding: '12px 12px 0', marginBottom: 16 }}>
              {[['Shoots', totalShoots], ['Confirmed', confirmed], ['Pending', pending]].map(([label, val]) => (
                <div key={label as string} style={{ background: 'var(--panel)', border: '1px solid var(--border)', borderRadius: 5, padding: '8px 6px', textAlign: 'center' }}>
                  <div style={{ fontFamily: 'var(--font-head)', fontSize: 18, fontWeight: 900, color: 'var(--text)' }}>{val}</div>
                  <div style={{ fontSize: 7, textTransform: 'uppercase', color: 'var(--sub)', letterSpacing: '0.05em' }}>{label}</div>
                </div>
              ))}
            </div>

            {/* spotlight stat cards */}
            <div style={{ padding: '0 12px', display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[
                { label: 'Monthly Revenue', value: `₹${(revenue/100000).toFixed(1)}L`, sub: '78% of goal', prog: 78, delta: '+10.5%' },
                { label: 'Confirmed Bookings', value: `${confirmed}/24`, sub: 'Active slots', prog: 75 },
                { label: 'Pipeline Value', value: '₹6.8L', sub: 'Potential conversions', prog: 60, blue: true },
                { label: 'Crew Utilization', value: '94%', sub: 'Primary crew active', prog: 94 },
              ].map(({ label, value, sub, prog, delta, blue }) => (
                <div key={label} style={{ background: 'var(--panel2)', border: '1px solid var(--border)', borderRadius: 8, padding: 12, position: 'relative', overflow: 'hidden' }}>
                  <div style={{ fontSize: 8, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--sub)', marginBottom: 6 }}>{label}</div>
                  <div style={{ fontFamily: 'var(--font-head)', fontSize: 22, fontWeight: 900, color: 'var(--text)', lineHeight: 1, marginBottom: 4 }}>{value}</div>
                  <div style={{ fontSize: 10, color: 'var(--sub)', marginBottom: 10 }}>{sub}</div>
                  <div style={{ height: 2, background: 'rgba(255,255,255,0.06)', borderRadius: 1 }}>
                    <div style={{ height: 2, width: `${prog}%`, borderRadius: 1, background: blue ? 'var(--blue)' : 'linear-gradient(90deg,var(--sienna),var(--sienna2))' }} />
                  </div>
                  {delta && <div style={{ marginTop: 6, fontSize: 10, color: 'var(--green)', fontWeight: 600 }}>{delta}</div>}
                </div>
              ))}
            </div>

            {/* Revenue Matrix */}
            <div style={{ margin: '20px 12px 24px', background: 'var(--panel)', border: '1px solid var(--border)', borderRadius: 8, overflow: 'hidden' }}>
              <div style={{ padding: '10px 12px', borderBottom: '1px solid var(--border)' }}>
                <div style={{ fontSize: 9, letterSpacing: '0.18em', color: 'var(--sub2)', textTransform: 'uppercase', fontWeight: 700 }}>Revenue Matrix</div>
              </div>
              {[['Weddings','₹2.4L'],['Corporate','₹1.2L'],['Portraits','₹0.8L'],['Events','₹0.4L']].map(([k,v]) => (
                <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 12px', borderBottom: '1px solid rgba(255,255,255,0.04)', fontSize: 11 }}>
                  <span style={{ color: 'var(--sub)', fontFamily: 'var(--font-body)' }}>{k}</span>
                  <span style={{ fontFamily: 'var(--font-head)', fontWeight: 700, color: 'var(--text)' }}>{v}</span>
                </div>
              ))}
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 12px', fontSize: 12 }}>
                <span style={{ fontFamily: 'var(--font-head)', fontWeight: 800, color: 'var(--green)' }}>Total</span>
                <span style={{ fontFamily: 'var(--font-head)', fontWeight: 800, color: 'var(--green)' }}>₹4.8L</span>
              </div>
            </div>
          </aside>

          {/* ─── CENTER: CALENDAR ─── */}
          <section style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', minWidth: 0 }}>
            {/* calendar header */}
            <div style={{ padding: '14px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(8,10,14,0.6)', backdropFilter: 'blur(12px)', borderBottom: '1px solid var(--border)', flexShrink: 0 }}>
              <div>
                <div style={{ fontSize: 9, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--sienna)', marginBottom: 2, fontFamily: 'var(--font-body)', fontWeight: 700 }}>Master Timeline</div>
                <div style={{ fontFamily: 'var(--font-head)', fontWeight: 900, fontSize: 20, color: 'var(--text)' }}>{headerTitle()}</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <button onClick={() => navigate(-1)} style={{ width: 30, height: 30, borderRadius: 4, background: 'var(--panel2)', border: '1px solid var(--border)', color: 'var(--sub)', cursor: 'pointer', fontSize: 16, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>‹</button>
                <button onClick={() => { setCurrentDate(new Date()); setSelectedDay(null); }} style={{ padding: '5px 14px', borderRadius: 4, background: 'transparent', border: '1px solid var(--border)', color: 'var(--sub)', cursor: 'pointer', fontSize: 11, fontFamily: 'var(--font-body)', fontWeight: 600 }}>Today</button>
                <button onClick={() => navigate(1)} style={{ width: 30, height: 30, borderRadius: 4, background: 'var(--panel2)', border: '1px solid var(--border)', color: 'var(--sub)', cursor: 'pointer', fontSize: 16, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>›</button>
              </div>
            </div>

            {/* calendar grid */}
            <div className="scrollbar-hide" style={{ flex: 1, overflowY: 'auto', background: 'var(--onyx)' }}>
              {view === 'month' && <MonthView date={currentDate} events={events} onSelectDay={d => setSelectedDay(d === selectedDay ? null : d)} selectedDay={selectedDay} />}
              {view === 'week' && <WeekView date={currentDate} events={events} />}
              {(view === 'day' || view === 'agenda') && <DayView date={currentDate} events={events} />}
            </div>
          </section>

          {/* ─── RIGHT: TODAY / SELECTED DAY PANEL ─── */}
          <aside className="scrollbar-hide" style={{ width: 260, flexShrink: 0, background: 'var(--onyx2)', borderLeft: '1px solid var(--border)', overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
            {/* sticky header */}
            <div style={{ padding: '18px 16px 14px', position: 'sticky', top: 0, background: 'rgba(13,16,23,0.96)', backdropFilter: 'blur(10px)', zIndex: 5, borderBottom: '1px solid var(--border)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: 9, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--sub)', marginBottom: 3 }}>Schedule</div>
                  <div style={{ fontFamily: 'var(--font-head)', fontWeight: 800, fontSize: 16, color: 'var(--text)' }}>
                    {sidebarTitle === 'Today' ? 'Today' : sidebarTitle}
                  </div>
                </div>
                <span style={{ background: 'rgba(232,85,10,0.12)', color: 'var(--sienna)', fontSize: 9, fontWeight: 800, padding: '3px 8px', borderRadius: 20, letterSpacing: '0.1em' }}>
                  {displayEvents.length} EVENTS
                </span>
              </div>
              {selectedDay && (
                <button onClick={() => setSelectedDay(null)} style={{ marginTop: 8, fontSize: 9, color: 'var(--sub)', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline', padding: 0 }}>
                  ← Back to Today
                </button>
              )}
            </div>

            {/* event list */}
            <div style={{ padding: '16px 16px 8px' }}>
              {displayEvents.length === 0 && (
                <div style={{ padding: '24px 12px', textAlign: 'center', border: '1px dashed var(--border)', borderRadius: 8, color: 'var(--sub2)', fontSize: 11 }}>
                  No events scheduled
                </div>
              )}
              {displayEvents.map((ev, idx) => <TodayEventCard key={idx} event={ev} />)}
            </div>

            {/* Upcoming queue */}
            <div style={{ marginTop: 12, borderTop: '1px solid var(--border)' }}>
              <div style={{ padding: '12px 16px 8px' }}>
                <div style={{ fontSize: 9, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--sub2)', marginBottom: 10, fontWeight: 700 }}>Production Queue</div>
                {upcomingEvents.slice(0, 8).map((ev, idx) => {
                  const cfg = TYPE_CONFIG[ev.type];
                  return (
                    <div key={idx} style={{ display: 'flex', gap: 10, marginBottom: 10, padding: '8px 10px', background: 'var(--panel2)', borderRadius: 6, border: '1px solid var(--border)', borderLeft: `3px solid ${cfg.border}`, cursor: 'pointer', transition: 'all 0.15s' }}
                      onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.transform = 'translateX(2px)'; (e.currentTarget as HTMLDivElement).style.borderColor = 'var(--border2)'; }}
                      onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.transform = ''; (e.currentTarget as HTMLDivElement).style.borderColor = 'var(--border)'; }}
                    >
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 8, color: 'var(--sub2)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 2 }}>{formatShortDate(ev.date)}</div>
                        <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text)', fontFamily: 'var(--font-head)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{ev.title}</div>
                        <div style={{ marginTop: 4, display: 'flex', alignItems: 'center', gap: 6 }}>
                          <span style={{ fontSize: 8, fontWeight: 700, background: cfg.bg, color: cfg.text, padding: '1px 5px', borderRadius: 3 }}>{cfg.label}</span>
                          <span style={{ fontSize: 9, color: 'var(--sub2)' }}>{ev.time}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </>
  );
};
