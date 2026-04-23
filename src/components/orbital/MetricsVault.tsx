"use client";

import React from 'react';
import { SpotlightCard } from './SpotlightCard';

export const MetricsVault: React.FC<any> = ({ metrics, loading }) => {
  const StatCard = ({ label, value, sub, progress, delta, color = 'var(--sienna)' }: any) => (
    <SpotlightCard className="metric-card">
      <div className="card-inner">
        <span className="metric-label">{label}</span>
        <h3 className="metric-value">{loading ? '---' : value}</h3>
        <p className="metric-sub">{sub}</p>
        <div className="progress-container">
          <div 
            className="progress-fill" 
            style={{ 
              width: `${progress}%`,
              background: color === 'blue' ? 'var(--blue)' : 'linear-gradient(90deg, var(--sienna), var(--sienna2))'
            }}
          />
        </div>
        {delta && <span className="delta">{delta}</span>}
      </div>
    </SpotlightCard>
  );

  return (
    <aside className="metrics-vault scrollbar-hidden">
      <header className="panel-header">
        <span className="micro-label">Overview</span>
        <h2 className="panel-title">Stats</h2>
      </header>

      <div className="mini-stats">
        <div className="mini-card">
          <span className="mini-val">{metrics.totalShoots}</span>
          <span className="mini-lbl">TOTAL SHOOTS</span>
        </div>
        <div className="mini-card">
          <span className="mini-val">{metrics.confirmedCount}</span>
          <span className="mini-lbl">CONFIRMED</span>
        </div>
        <div className="mini-card">
          <span className="mini-val">{metrics.pendingCount}</span>
          <span className="mini-lbl">PENDING</span>
        </div>
      </div>

      <div className="spotlight-grid">
        <StatCard 
          label="Monthly Revenue Target" 
          value={`₹${(metrics.revenueTotal / 100000).toFixed(1)}L`} 
          sub="78% of monthly goal"
          progress={78}
          delta="+10.5%"
        />
        <StatCard 
          label="Confirmed Bookings" 
          value={`${metrics.confirmedCount}/24`} 
          sub="Slots filled"
          progress={75}
        />
        <StatCard 
          label="Pipeline Value" 
          value="₹6.8L" 
          sub="Potential conversion"
          progress={60}
          color="blue"
          delta="Potential leads"
        />
        <StatCard 
          label="Team Availability" 
          value="94%" 
          sub="Team members active"
          progress={94}
        />
      </div>

      <div className="revenue-matrix">
        <h4 className="matrix-title">REVENUE MATRIX</h4>
        <div className="matrix-table">
          {[
            { label: 'Weddings', value: '₹2.4L' },
            { label: 'Corporate', value: '₹1.2L' },
            { label: 'Portraits', value: '₹0.8L' },
            { label: 'Events', value: '₹0.4L' },
            { label: 'Total', value: '₹4.8L', isTotal: true }
          ].map(row => (
            <div key={row.label} className={`matrix-row ${row.isTotal ? 'total' : ''}`}>
              <span>{row.label}</span>
              <span>{row.value}</span>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .metrics-vault {
          width: 260px;
          height: 100%;
          background: var(--onyx2);
          border-right: 1px solid var(--border);
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
          color: var(--sienna);
          margin-bottom: 4px;
        }

        .panel-title {
          font-family: var(--font-head);
          font-weight: 800;
          font-size: 18px;
          color: var(--text);
        }

        .mini-stats {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          padding: 0 12px;
          margin-bottom: 20px;
        }

        .mini-card {
          padding: 10px 4px;
          text-align: center;
          background: var(--panel);
          border-radius: 6px;
          border: 1px solid var(--border);
        }

        .mini-val {
          display: block;
          font-family: var(--font-head);
          font-size: 16px;
          font-weight: 900;
          color: var(--text);
        }

        .mini-lbl {
          font-size: 8px;
          text-transform: uppercase;
          color: var(--sub);
          letter-spacing: 0.05em;
        }

        .spotlight-grid {
          padding: 0 12px;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        :global(.metric-card) {
          padding: 14px;
        }

        .metric-label {
          display: block;
          font-size: 9px;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: var(--sub);
          margin-bottom: 8px;
        }

        .metric-value {
          font-family: var(--font-head);
          font-size: 26px;
          font-weight: 900;
          color: var(--text);
          line-height: 1;
        }

        .metric-sub {
          font-size: 11px;
          color: var(--sub);
          margin-top: 4px;
          margin-bottom: 12px;
        }

        .progress-container {
          height: 2px;
          background: rgba(255, 255, 255, 0.06);
          border-radius: 1px;
          overflow: hidden;
        }

        .progress-fill {
          height: 100%;
          border-radius: 1px;
          transition: width 1s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .delta {
          display: block;
          font-size: 10px;
          color: var(--green);
          margin-top: 8px;
          font-weight: 600;
        }

        .revenue-matrix {
          margin-top: 32px;
          padding: 0 12px 24px;
        }

        .matrix-title {
          font-size: 9px;
          letter-spacing: 0.2em;
          color: var(--sub2);
          margin-bottom: 12px;
        }

        .matrix-row {
          display: flex;
          justify-content: space-between;
          padding: 8px 0;
          font-family: var(--font-head);
          font-size: 12px;
          font-weight: 700;
          color: var(--sub);
          border-bottom: 1px solid rgba(255, 255, 255, 0.04);
        }

        .matrix-row.total {
          color: var(--green);
          border-bottom: none;
          padding-top: 12px;
        }
      `}</style>
    </aside>
  );
};
