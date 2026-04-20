"use client";

import React, { useState, useMemo } from 'react';
import { ParticleCanvas } from './ParticleCanvas';
import { TopBar } from './TopBar';
import { MetricsVault } from './MetricsVault';
import { MasterTimeline } from './MasterTimeline';
import { ProductionQueue } from './ProductionQueue';
import { OrbitalEvent } from '@/types/event';

// Initial Mock Data
const MOCK_EVENTS: OrbitalEvent[] = [
  { id: '1', date: '2026-04-20', title: 'Royal Wedding Shoot', type: 'shoot', status: 'confirmed', time: '10:00', dur: '8h', value: 85000, category: 'Weddings' },
  { id: '2', date: '2026-04-21', title: 'Corporate Interview: TechCorp', type: 'shoot', status: 'confirmed', time: '14:00', dur: '4h', value: 45000, category: 'Corporate' },
  { id: '3', date: '2026-04-22', title: 'Project Zenith Delivery', type: 'deliver', status: 'completed', time: '09:00', dur: '1h', value: 0 },
  { id: '4', date: '2026-04-22', title: 'Portrait Session: Mehta Family', type: 'shoot', status: 'pending', time: '16:00', dur: '2h', value: 15000, category: 'Portraits' },
  { id: '5', date: '2026-04-23', title: 'Post-Production: Royal Wedding', type: 'edit', status: 'pending', time: '10:00', dur: '6h', value: 0 },
  { id: '6', date: '2026-04-24', title: 'Client Consultation: Stellar Ads', type: 'consult', status: 'confirmed', time: '11:30', dur: '1h', value: 5000, category: 'Corporate' },
  { id: '7', date: '2026-04-25', title: 'Product Launch: Nexus 9', type: 'shoot', status: 'confirmed', time: '18:00', dur: '5h', value: 65000, category: 'Corporate' },
  { id: '8', date: '2026-04-20', title: 'Draft Review: TechCorp', type: 'edit', status: 'pending', time: '17:00', dur: '3h', value: 0 },
  { id: '9', date: '2026-04-26', title: 'Final Export: Nexus 9', type: 'edit', status: 'pending', time: '09:00', dur: '4h', value: 0 },
  { id: '10', date: '2026-04-27', title: 'Delivery: TechCorp Video', type: 'deliver', status: 'pending', time: '10:00', dur: '1h', value: 0 },
];

export const OrbitalCommandCenter: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [currentView, setCurrentView] = useState<'month' | 'week' | 'day' | 'agenda'>('month');
  const [loading] = useState(false);
  const [events] = useState<OrbitalEvent[]>(MOCK_EVENTS);

  const metrics = useMemo(() => {
    return {
      totalShoots: events.filter(e => e.type === 'shoot').length,
      confirmedCount: events.filter(e => e.status === 'confirmed').length,
      pendingCount: events.filter(e => e.status === 'pending').length,
      revenueTotal: events.reduce((sum, e) => sum + (e.value || 0), 0),
    };
  }, [events]);

  return (
    <div className="orbital-root">
      {/* Design System Tokens */}
      <style jsx global>{`
        :root {
          --onyx: #080A0E;
          --onyx2: #0D1017;
          --panel: #0F1219;
          --panel2: #141820;
          --border: rgba(255, 255, 255, 0.06);
          --border2: rgba(255, 255, 255, 0.10);
          --sienna: #E8550A;
          --sienna2: #FF6B1A;
          --sienna-dim: rgba(232, 85, 10, 0.15);
          --text: #F0EDE8;
          --sub: #8A8F9A;
          --sub2: #5A5F6A;
          --green: #22C55E;
          --amber: #F59E0B;
          --blue: #3B82F6;
          --font-head: 'Epilogue', sans-serif;
          --font-body: 'Plus Jakarta Sans', sans-serif;
        }

        .scrollbar-hidden::-webkit-scrollbar { display: none; }
        .scrollbar-hidden { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
      
      <style jsx>{`
        .orbital-root {
          position: fixed;
          inset: 0;
          background: var(--onyx);
          color: var(--text);
          font-family: var(--font-body);
          display: grid;
          grid-template-rows: 56px 1fr;
          overflow: hidden;
          z-index: 1000;
        }

        .hud-scanlines {
          position: fixed;
          inset: 0;
          pointer-events: none;
          z-index: 2;
          background: repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.03) 2px, rgba(0,0,0,0.03) 4px);
          opacity: 0.4;
        }

        .main-layout {
          display: flex;
          height: calc(100vh - 56px);
          width: 100vw;
          overflow: hidden;
          animation: fadein 0.8s ease-out;
        }

        .panel-l, .panel-r {
          flex-shrink: 0;
          width: 260px;
          height: 100%;
        }

        .panel-c {
          flex: 1;
          height: 100%;
          overflow: hidden;
          display: flex;
          flex-direction: column;
        }

        @keyframes fadein {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: none; }
        }

        .panel-l { animation-delay: 0.05s; }
        .panel-c { animation-delay: 0.10s; }
        .panel-r { animation-delay: 0.15s; }
      `}</style>

      <div className="hud-scanlines" />
      <ParticleCanvas />
      
      <TopBar 
        currentView={currentView} 
        onViewChange={(v: any) => setCurrentView(v)} 
      />

      <main className="main-layout">
        <div className="panel-l"><MetricsVault metrics={metrics} loading={loading} /></div>
        <div className="panel-c">
          <MasterTimeline 
            currentDate={currentDate} 
            view={currentView} 
            events={events}
            onDateChange={setCurrentDate}
          />
        </div>
        <div className="panel-r"><ProductionQueue events={events} loading={loading} /></div>
      </main>
    </div>
  );
};
