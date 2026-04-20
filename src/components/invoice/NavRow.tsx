"use client";

import React from "react";
import { ArrowRight, ArrowLeft } from "lucide-react";

interface NavRowProps {
  onBack: () => void;
  onNext: () => void;
  canNext: boolean;
  isFirst: boolean;
  isLast: boolean;
}

export default function NavRow({ onBack, onNext, canNext, isFirst, isLast }: NavRowProps) {
  return (
    <div style={{ 
      display: "flex", 
      justifyContent: "space-between", 
      alignItems: "center", 
      marginTop: "3rem", 
      paddingTop: "2rem",
      borderTop: "1px solid rgba(255,255,255,0.08)"
    }}>
      {!isFirst ? (
        <button 
          onClick={onBack}
          style={{
            background: "transparent",
            border: "1px solid rgba(255,255,255,0.15)",
            color: "var(--text-muted)",
            padding: "12px 24px",
            borderRadius: "12px",
            cursor: "pointer",
            fontSize: "0.9rem",
            fontWeight: 500,
            display: "flex",
            alignItems: "center",
            gap: "8px",
            transition: "all 0.2s"
          }}
          onMouseEnter={(e) => { e.currentTarget.style.borderColor = "var(--text-primary)"; e.currentTarget.style.color = "var(--text-primary)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.15)"; e.currentTarget.style.color = "var(--text-muted)"; }}
        >
          <ArrowLeft size={16} /> Back
        </button>
      ) : <div />}

      {!isLast && (
        <button 
          onClick={onNext}
          disabled={!canNext}
          className="btn btn-primary"
          style={{
            padding: "14px 32px",
            borderRadius: "12px",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            opacity: canNext ? 1 : 0.5,
            cursor: canNext ? "pointer" : "not-allowed",
            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
            boxShadow: canNext ? "0 4px 20px rgba(var(--accent-rgb), 0.3)" : "none"
          }}
        >
          Continue <ArrowRight size={16} />
        </button>
      )}
    </div>
  );
}
