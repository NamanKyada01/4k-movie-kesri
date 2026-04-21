"use client";

import * as React from "react";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, CheckCircle, AlertCircle, AlertTriangle, Info, Bell } from "lucide-react";
import BorderGlow from "./BorderGlow";

export type AlertType = "success" | "error" | "warning" | "info" | "cinematic" | "confirm";

export interface CustomAlertProps {
  id?: string;
  type: AlertType;
  title: string;
  message: string;
  duration?: number; // milliseconds, 0 for persistent
  onClose?: () => void;
  showCloseButton?: boolean;
  position?: "top-right" | "top-left" | "bottom-right" | "bottom-left" | "top-center" | "bottom-center" | "center";
  showIcon?: boolean;
  borderGlow?: boolean;
  glowColor?: string;
  primaryActionLabel?: string;
  secondaryActionLabel?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
}

const alertConfig = {
  success: {
    icon: CheckCircle,
    iconColor: "var(--success)",
    bgColor: "var(--success-bg)",
    borderColor: "rgba(34, 197, 94, 0.2)",
    textColor: "var(--success)",
    glowHSL: "142 70 45",
    meshColors: ["#22C55E", "#16A34A", "#15803D"],
  },
  error: {
    icon: AlertCircle,
    iconColor: "var(--error)",
    bgColor: "var(--error-bg)",
    borderColor: "rgba(239, 68, 68, 0.2)",
    textColor: "var(--error)",
    glowHSL: "0 84 60",
    meshColors: ["#EF4444", "#DC2626", "#B91C1C"],
  },
  warning: {
    icon: AlertTriangle,
    iconColor: "var(--warning)",
    bgColor: "var(--warning-bg)",
    borderColor: "rgba(245, 158, 11, 0.2)",
    textColor: "var(--warning)",
    glowHSL: "38 92 50",
    meshColors: ["#F59E0B", "#D97706", "#B45309"],
  },
  info: {
    icon: Info,
    iconColor: "var(--info)",
    bgColor: "var(--info-bg)",
    borderColor: "rgba(59, 130, 246, 0.2)",
    textColor: "var(--info)",
    glowHSL: "217 91 60",
    meshColors: ["#3B82F6", "#2563EB", "#1D4ED8"],
  },
  cinematic: {
    icon: Bell,
    iconColor: "var(--accent)",
    bgColor: "var(--accent-muted)",
    borderColor: "rgba(232, 85, 10, 0.3)",
    textColor: "var(--accent)",
    glowHSL: "21 92 48",
    meshColors: ["#E8550A", "#FF6B1A", "#FF8C3A"],
  },
  confirm: {
    icon: AlertCircle,
    iconColor: "var(--accent)",
    bgColor: "rgba(18, 15, 23, 0.95)",
    borderColor: "rgba(255, 255, 255, 0.1)",
    textColor: "white",
    glowHSL: "21 92 48",
    meshColors: ["#E8550A", "#FF6B1A", "#C9A84C"],
  },
};

export default function CustomAlert({
  id,
  type = "info",
  title,
  message,
  duration,
  onClose,
  showCloseButton = true,
  position = "top-right",
  showIcon = true,
  borderGlow = true,
  glowColor,
  primaryActionLabel = "Confirm",
  secondaryActionLabel = "Cancel",
  onConfirm,
  onCancel,
}: CustomAlertProps) {
  const [isVisible, setIsVisible] = useState(true);
  const isConfirmType = type === "confirm";
  const finalDuration = duration !== undefined ? duration : (isConfirmType ? 0 : 5000);
  
  const config = alertConfig[type];
  const Icon = config.icon;
  const customGlowColor = glowColor || config.glowColor;

  useEffect(() => {
    if (finalDuration > 0) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        setTimeout(() => onClose?.(), 300); // Wait for animation to complete
      }, finalDuration);
      return () => clearTimeout(timer);
    }
  }, [finalDuration, onClose]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => onClose?.(), 300);
  };

  const handleConfirm = () => {
    onConfirm?.();
    handleClose();
  };

  const handleCancel = () => {
    onCancel?.();
    handleClose();
  };

  const positionStyles = {
    "top-right": { top: "20px", right: "20px" },
    "top-left": { top: "20px", left: "20px" },
    "bottom-right": { bottom: "20px", right: "20px" },
    "bottom-left": { bottom: "20px", left: "20px" },
    "top-center": { top: "20px", left: "50%", transform: "translateX(-50%)" },
    "bottom-center": { bottom: "20px", left: "50%", transform: "translateX(-50%)" },
    "center": { top: "50%", left: "50%" },
  };

  const finalPosition = isConfirmType ? "center" : position;
  const isCentered = finalPosition === "center";

  const alertContent = (
    <div
      style={{
        background: config.bgColor,
        border: `1px solid ${config.borderColor}`,
        borderRadius: "var(--radius-xl)",
        padding: isConfirmType ? "var(--space-6)" : "var(--space-4) var(--space-5)",
        boxShadow: "var(--shadow-lg)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        display: "flex",
        gap: "var(--space-4)",
        flexDirection: isConfirmType ? "column" : "row",
        alignItems: isConfirmType ? "center" : "flex-start",
        textAlign: isConfirmType ? "center" : "left",
        width: "100%",
        height: "100%",
        position: "relative",
        zIndex: 2
      }}
    >
      {showIcon && (
        <div style={{ flexShrink: 0, marginTop: isConfirmType ? 0 : 2 }}>
          <Icon size={isConfirmType ? 32 : 20} color={config.iconColor} />
        </div>
      )}

      <div style={{ flex: 1 }}>
        <div
          style={{
            fontSize: isConfirmType ? "1.25rem" : "0.95rem",
            fontWeight: 700,
            color: config.textColor,
            marginBottom: "var(--space-2)",
            fontFamily: "var(--font-heading)",
            letterSpacing: "-0.01em",
          }}
        >
          {title}
        </div>
        <div
          style={{
            fontSize: isConfirmType ? "0.95rem" : "0.85rem",
            color: "var(--text-secondary)",
            lineHeight: 1.6,
          }}
        >
          {message}
        </div>
      </div>

      {isConfirmType && (
        <div style={{ display: "flex", gap: "var(--space-3)", width: "100%", marginTop: "var(--space-2)" }}>
          <button
            onClick={handleCancel}
            style={{
              flex: 1,
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.1)",
              color: "var(--text-primary)",
              padding: "12px",
              borderRadius: "12px",
              fontSize: "0.85rem",
              fontWeight: 600,
              cursor: "pointer",
              transition: "all 0.2s ease"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(255,255,255,0.1)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "rgba(255,255,255,0.05)";
            }}
          >
            {secondaryActionLabel}
          </button>
          <button
            onClick={handleConfirm}
            style={{
              flex: 1,
              background: "var(--accent)",
              border: "none",
              color: "white",
              padding: "12px",
              borderRadius: "12px",
              fontSize: "0.85rem",
              fontWeight: 600,
              cursor: "pointer",
              boxShadow: "0 4px 12px var(--accent-glow)",
              transition: "all 0.2s ease"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow = "0 6px 16px var(--accent-glow)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 4px 12px var(--accent-glow)";
            }}
          >
            {primaryActionLabel}
          </button>
        </div>
      )}

      {showCloseButton && !isConfirmType && (
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
  );

  return (
    <AnimatePresence>
      {isVisible && (
        <div style={{ position: "fixed", inset: 0, zIndex: 9999, pointerEvents: "none" }}>
          {/* Backdrop */}
          {isConfirmType && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{
                position: "fixed",
                inset: 0,
                background: "rgba(0,0,0,0.4)", // Darker backdrop
                backdropFilter: "blur(12px)", // Stronger blur for better separation
                WebkitBackdropFilter: "blur(12px)",
                zIndex: 10,
                pointerEvents: "auto"
              }}
              onClick={handleCancel}
            />
          )}

          {/* Alert Container */}
          <motion.div
            initial={{ 
              opacity: 0, 
              scale: 0.9, 
              x: isCentered ? "-50%" : 0,
              y: isCentered ? "-50%" : (isConfirmType ? 0 : -20) 
            }}
            animate={{ 
              opacity: 1, 
              scale: 1, 
              x: isCentered ? "-50%" : 0,
              y: isCentered ? "-50%" : 0 
            }}
            exit={{ 
              opacity: 0, 
              scale: 0.9, 
              x: isCentered ? "-50%" : 0,
              y: isCentered ? "-50%" : (isConfirmType ? 0 : -20) 
            }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            style={{
              position: "fixed",
              zIndex: 20,
              pointerEvents: "auto",
              minWidth: isConfirmType ? "420px" : "320px",
              maxWidth: isConfirmType ? "550px" : "400px",
              ...positionStyles[finalPosition],
            }}
          >
            {borderGlow ? (
              <BorderGlow 
                glowColor={config.glowHSL} 
                backgroundColor={config.bgColor}
                borderRadius={16}
                colors={config.meshColors}
                animated={isConfirmType}
                glowIntensity={isConfirmType ? 1.2 : 0.8}
                edgeSensitivity={isConfirmType ? 50 : 30}
              >
                {alertContent}
              </BorderGlow>
            ) : (
              alertContent
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}