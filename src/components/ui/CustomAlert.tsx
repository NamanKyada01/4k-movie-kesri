"use client";

import * as React from "react";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, CheckCircle, AlertCircle, AlertTriangle, Info, Bell } from "lucide-react";
import BorderGlow from "./BorderGlow";

export type AlertType = "success" | "error" | "warning" | "info" | "cinematic";

export interface CustomAlertProps {
  id?: string;
  type: AlertType;
  title: string;
  message: string;
  duration?: number; // milliseconds, 0 for persistent
  onClose?: () => void;
  showCloseButton?: boolean;
  position?: "top-right" | "top-left" | "bottom-right" | "bottom-left" | "top-center" | "bottom-center";
  showIcon?: boolean;
  borderGlow?: boolean;
  glowColor?: string;
}

const alertConfig = {
  success: {
    icon: CheckCircle,
    iconColor: "var(--success)",
    bgColor: "var(--success-bg)",
    borderColor: "var(--success)",
    textColor: "var(--success)",
    glowColor: "var(--success)",
  },
  error: {
    icon: AlertCircle,
    iconColor: "var(--error)",
    bgColor: "var(--error-bg)",
    borderColor: "var(--error)",
    textColor: "var(--error)",
    glowColor: "var(--error)",
  },
  warning: {
    icon: AlertTriangle,
    iconColor: "var(--warning)",
    bgColor: "var(--warning-bg)",
    borderColor: "var(--warning)",
    textColor: "var(--warning)",
    glowColor: "var(--warning)",
  },
  info: {
    icon: Info,
    iconColor: "var(--info)",
    bgColor: "var(--info-bg)",
    borderColor: "var(--info)",
    textColor: "var(--info)",
    glowColor: "var(--info)",
  },
  cinematic: {
    icon: Bell,
    iconColor: "var(--accent)",
    bgColor: "var(--accent-muted)",
    borderColor: "var(--accent)",
    textColor: "var(--accent)",
    glowColor: "var(--accent)",
  },
};

export default function CustomAlert({
  id,
  type = "info",
  title,
  message,
  duration = 5000,
  onClose,
  showCloseButton = true,
  position = "top-right",
  showIcon = true,
  borderGlow = true,
  glowColor,
}: CustomAlertProps) {
  const [isVisible, setIsVisible] = useState(true);
  const config = alertConfig[type];
  const Icon = config.icon;
  const customGlowColor = glowColor || config.glowColor;

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        setTimeout(() => onClose?.(), 300); // Wait for animation to complete
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => onClose?.(), 300);
  };

  const positionStyles = {
    "top-right": { top: "20px", right: "20px" },
    "top-left": { top: "20px", left: "20px" },
    "bottom-right": { bottom: "20px", right: "20px" },
    "bottom-left": { bottom: "20px", left: "20px" },
    "top-center": { top: "20px", left: "50%", transform: "translateX(-50%)" },
    "bottom-center": { bottom: "20px", left: "50%", transform: "translateX(-50%)" },
  };

  const alertContent = (
    <motion.div
      initial={{ opacity: 0, y: -20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.95 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
      style={{
        position: "fixed",
        zIndex: "var(--z-toast)",
        minWidth: "320px",
        maxWidth: "400px",
        ...positionStyles[position],
      }}
    >
      <div
        style={{
          background: config.bgColor,
          border: `1px solid ${config.borderColor}`,
          borderRadius: "var(--radius-xl)",
          padding: "var(--space-4) var(--space-5)",
          boxShadow: "var(--shadow-lg)",
          backdropFilter: "blur(10px)",
          WebkitBackdropFilter: "blur(10px)",
          display: "flex",
          gap: "var(--space-3)",
          alignItems: "flex-start",
        }}
      >
        {showIcon && (
          <div style={{ flexShrink: 0, marginTop: 2 }}>
            <Icon size={20} color={config.iconColor} />
          </div>
        )}

        <div style={{ flex: 1 }}>
          <div
            style={{
              fontSize: "0.95rem",
              fontWeight: 600,
              color: config.textColor,
              marginBottom: "var(--space-1)",
              fontFamily: "var(--font-heading)",
              letterSpacing: "-0.01em",
            }}
          >
            {title}
          </div>
          <div
            style={{
              fontSize: "0.85rem",
              color: "var(--text-secondary)",
              lineHeight: 1.5,
            }}
          >
            {message}
          </div>
        </div>

        {showCloseButton && (
          <button
            onClick={handleClose}
            style={{
              background: "transparent",
              border: "none",
              color: "var(--text-muted)",
              cursor: "pointer",
              padding: "var(--space-1)",
              borderRadius: "var(--radius-sm)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "color var(--transition-fast)",
              flexShrink: 0,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = "var(--text-primary)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = "var(--text-muted)";
            }}
            aria-label="Close alert"
          >
            <X size={16} />
          </button>
        )}
      </div>
    </motion.div>
  );

  return (
    <AnimatePresence>
      {isVisible && (
        <>
          {borderGlow ? (
            <BorderGlow color={customGlowColor} duration="4s" padding="1px" active={true}>
              {alertContent}
            </BorderGlow>
          ) : (
            alertContent
          )}
        </>
      )}
    </AnimatePresence>
  );
}