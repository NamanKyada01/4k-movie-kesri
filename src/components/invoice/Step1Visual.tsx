"use client";

import React, { useState } from "react";
import { Invoice, GlobalTheme } from "@/types/invoice";

const THEMES: GlobalTheme[] = [
  { id: "obsidian", name: "Obsidian", layoutType: "editorial", primaryColor: "#C9A96E", createdAt: Date.now() },
  { id: "alabaster", name: "Alabaster", layoutType: "minimalist", primaryColor: "#1A1A1A", createdAt: Date.now() },
  { id: "cobalt", name: "Cobalt", layoutType: "modern", primaryColor: "#4A90D9", createdAt: Date.now() },
  { id: "ivory", name: "Ivory & Sage", layoutType: "editorial", primaryColor: "#5C7A5A", createdAt: Date.now() },
  { id: "graphite", name: "Graphite", layoutType: "modern", primaryColor: "#E8E8E8", createdAt: Date.now() },
  { id: "blush", name: "Blush Linen", layoutType: "editorial", primaryColor: "#C4715A", createdAt: Date.now() },
];

const THEME_VISUALS = {
  obsidian: { bg: "#0A0A0B", text: "#F5F0E8", sub: "#888" },
  alabaster: { bg: "#FAF9F7", text: "#111", sub: "#999" },
  cobalt: { bg: "#0D1B2A", text: "#E8F4FD", sub: "#6A9EC2" },
  ivory: { bg: "#F5F1EA", text: "#2C2C2C", sub: "#888" },
  graphite: { bg: "#1C1C1E", text: "#FAFAFA", sub: "#888" },
  blush: { bg: "#FDF8F5", text: "#2A1F1A", sub: "#999" },
};

const PALETTES: Record<string, string[]> = {
  warm: ["#C9A96E", "#C4715A", "#D4956A", "#B8956A", "#A07040"],
  cool: ["#4A90D9", "#5C7A9A", "#6B8E9F", "#7A9BB5", "#3D7AB5"],
  neutral: ["#1A1A1A", "#5C7A5A", "#888", "#444", "#2C2C2C"],
  bold: ["#E84545", "#7C3AED", "#059669", "#D97706", "#0891B2"],
};

interface Step1Props {
  invoice: Partial<Invoice>;
  update: (patch: Partial<Invoice>) => void;
}

export default function Step1Visual({ invoice, update }: Step1Props) {
  const [activePaletteGroup, setActivePaletteGroup] = useState("warm");

  const selectTheme = (theme: GlobalTheme) => {
    update({ themeDetails: theme });
  };

  const selectAccent = (color: string) => {
    if (invoice.themeDetails) {
      update({ themeDetails: { ...invoice.themeDetails, primaryColor: color } });
    }
  };

  return (
    <div style={{ animation: "fadeIn 0.5s ease" }}>
      <p style={{ 
        fontSize: "11px", 
        letterSpacing: "0.15rem", 
        textTransform: "uppercase", 
        color: "var(--accent)",
        marginBottom: "1rem",
        fontWeight: 600
      }}>Foundation</p>
      <h3 style={{ 
        fontFamily: "'Playfair Display', serif", 
        fontSize: "2rem", 
        color: "white", 
        marginBottom: "2.5rem" 
      }}>Visual Identity</h3>

      {/* Theme Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1.5rem", marginBottom: "3rem" }}>
        {THEMES.map((theme) => {
          const visual = THEME_VISUALS[theme.id as keyof typeof THEME_VISUALS];
          const isSelected = invoice.themeDetails?.id === theme.id;
          
          return (
            <div 
              key={theme.id}
              onClick={() => selectTheme(theme)}
              style={{
                background: visual.bg,
                border: isSelected ? `2px solid ${theme.primaryColor}` : "1px solid rgba(255,255,255,0.08)",
                borderRadius: "16px",
                padding: "24px",
                cursor: "pointer",
                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                transform: isSelected ? "scale(1.03)" : "scale(1)",
                boxShadow: isSelected ? `0 0 20px rgba(${theme.primaryColor}, 0.2)` : "none",
                display: "flex",
                flexDirection: "column",
                gap: "12px"
              }}
            >
              <div style={{ 
                width: "32px", 
                height: "32px", 
                borderRadius: "50%", 
                background: theme.primaryColor,
                boxShadow: `0 0 10px ${theme.primaryColor}44`
              }} />
              <div style={{ fontSize: "12px", fontWeight: 700, color: visual.text, letterSpacing: "0.05em", textTransform: "uppercase" }}>
                {theme.name}
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "6px", marginTop: "4px" }}>
                <div style={{ height: "4px", width: "100%", background: visual.text, opacity: 0.1, borderRadius: "2px" }} />
                <div style={{ height: "4px", width: "70%", background: visual.text, opacity: 0.05, borderRadius: "2px" }} />
                <div style={{ height: "4px", width: "85%", background: visual.text, opacity: 0.05, borderRadius: "2px" }} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Palette Picker */}
      <div style={{ marginBottom: "3rem" }}>
        <p style={{ 
          fontSize: "10px", 
          letterSpacing: "0.1em", 
          textTransform: "uppercase", 
          color: "var(--text-muted)",
          marginBottom: "1.5rem"
        }}>Custom Accent Palette</p>
        
        <div style={{ display: "flex", gap: "8px", marginBottom: "1.5rem" }}>
          {Object.keys(PALETTES).map(group => (
            <button
              key={group}
              onClick={() => setActivePaletteGroup(group)}
              style={{
                background: activePaletteGroup === group ? "var(--accent)" : "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: "20px",
                padding: "6px 16px",
                fontSize: "10px",
                fontWeight: 600,
                color: activePaletteGroup === group ? "#000" : "var(--text-muted)",
                cursor: "pointer",
                textTransform: "uppercase",
                transition: "all 0.2s"
              }}
            >
              {group}
            </button>
          ))}
        </div>

        <div style={{ display: "flex", gap: "12px" }}>
          {PALETTES[activePaletteGroup].map(color => (
            <div 
              key={color}
              onClick={() => selectAccent(color)}
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "50%",
                background: color,
                cursor: "pointer",
                border: invoice.themeDetails?.primaryColor === color ? "3px solid white" : "none",
                boxShadow: invoice.themeDetails?.primaryColor === color ? `0 0 0 3px ${color}` : "none",
                transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)"
              }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = "scale(1.1)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = "scale(1)"; }}
            />
          ))}
        </div>
      </div>

      {/* Options */}
      <div style={{ 
        padding: "24px", 
        background: "rgba(255,255,255,0.02)", 
        borderRadius: "16px",
        border: "1px solid rgba(255,255,255,0.05)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between"
      }}>
        <div>
          <h4 style={{ color: "white", fontSize: "0.95rem", marginBottom: "4px" }}>Brand Mark</h4>
          <p style={{ color: "var(--text-muted)", fontSize: "0.8rem" }}>Enable logo display in the header</p>
        </div>
        
        <div 
          onClick={() => update({ businessDetails: { ...invoice.businessDetails!, showLogo: !invoice.businessDetails?.showLogo } as any })}
          style={{
            width: "52px",
            height: "28px",
            background: invoice.businessDetails?.showLogo ? "var(--accent)" : "rgba(255,255,255,0.1)",
            borderRadius: "14px",
            padding: "3px",
            cursor: "pointer",
            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
            position: "relative"
          }}
        >
          <div style={{
            width: "22px",
            height: "22px",
            background: "white",
            borderRadius: "50%",
            transform: invoice.businessDetails?.showLogo ? "translateX(24px)" : "translateX(0)",
            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
            boxShadow: "0 2px 4px rgba(0,0,0,0.2)"
          }} />
        </div>
      </div>
    </div>
  );
}
