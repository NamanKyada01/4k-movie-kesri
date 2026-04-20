"use client";

import React from "react";
import { InvoiceStatus } from "@/types/invoice";

interface InvoiceStatusBadgeProps {
  status: InvoiceStatus;
}

const statusConfig = {
  draft: {
    label: "Draft",
    bg: "rgba(255, 255, 255, 0.05)",
    text: "rgba(255, 255, 255, 0.4)",
    border: "rgba(255, 255, 255, 0.1)",
  },
  sent: {
    label: "Sent",
    bg: "rgba(59, 130, 246, 0.1)",
    text: "#60a5fa",
    border: "rgba(59, 130, 246, 0.2)",
  },
  paid: {
    label: "Paid",
    bg: "rgba(16, 185, 129, 0.1)",
    text: "#34d399",
    border: "rgba(16, 185, 129, 0.2)",
  },
  overdue: {
    label: "Overdue",
    bg: "rgba(239, 68, 68, 0.1)",
    text: "#f87171",
    border: "rgba(239, 68, 68, 0.2)",
  },
};

export default function InvoiceStatusBadge({ status }: InvoiceStatusBadgeProps) {
  const config = statusConfig[status];

  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        padding: "4px 10px",
        borderRadius: "6px",
        fontSize: "10px",
        fontWeight: 600,
        letterSpacing: "0.05em",
        textTransform: "uppercase",
        background: config.bg,
        color: config.text,
        border: `1px solid ${config.border}`,
        transition: "all 0.2s ease",
      }}
    >
      <div
        style={{
          width: 5,
          height: 5,
          borderRadius: "50%",
          background: config.text,
          marginRight: 6,
          boxShadow: `0 0 8px ${config.text}`,
        }}
      />
      {config.label}
    </div>
  );
}
