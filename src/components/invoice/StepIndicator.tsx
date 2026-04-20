"use client";

import React from "react";
import { Check } from "lucide-react";

interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
}

const steps = [
  "Identity",
  "Columns",
  "Profile",
  "Details",
  "Preview"
];

export default function StepIndicator({ currentStep, totalSteps }: StepIndicatorProps) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "4rem", padding: "0 1rem" }}>
      {steps.map((label, index) => {
        const stepNum = index + 1;
        const isActive = stepNum === currentStep;
        const isCompleted = stepNum < currentStep;
        
        return (
          <React.Fragment key={label}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "12px", position: "relative" }}>
              <div 
                style={{
                  width: isActive ? "40px" : "32px",
                  height: isActive ? "40px" : "32px",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: (isActive || isCompleted) ? "var(--accent)" : "transparent",
                  border: `2px solid ${(isActive || isCompleted) ? "var(--accent)" : "rgba(255,255,255,0.1)"}`,
                  color: (isActive || isCompleted) ? "#000" : "rgba(255,255,255,0.3)",
                  fontSize: isActive ? "14px" : "12px",
                  fontWeight: 700,
                  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                  transform: isActive ? "scale(1.1)" : "scale(1)",
                  boxShadow: isActive ? "0 0 0 6px rgba(var(--accent-rgb), 0.15)" : "none",
                  zIndex: 2,
                  cursor: isCompleted ? "pointer" : "default"
                }}
              >
                {isCompleted ? <Check size={16} strokeWidth={3} /> : stepNum}
              </div>
              <span style={{
                fontSize: "10px",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: isActive ? "var(--accent)" : "var(--text-muted)",
                fontWeight: isActive ? 700 : 400,
                transition: "color 0.3s ease",
                position: "absolute",
                top: "100%",
                marginTop: "12px",
                whiteSpace: "nowrap"
              }}>
                {label}
              </span>
            </div>
            
            {stepNum < totalSteps && (
              <div style={{
                flex: 1,
                height: "2px",
                background: "rgba(255,255,255,0.05)",
                margin: "0 1.5rem",
                position: "relative",
                overflow: "hidden"
              }}>
                <div style={{
                  position: "absolute",
                  left: 0,
                  top: 0,
                  height: "100%",
                  width: isCompleted ? "100%" : "0%",
                  background: "var(--accent)",
                  transition: "width 0.4s cubic-bezier(0.4, 0, 0.2, 1)"
                }} />
              </div>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}
