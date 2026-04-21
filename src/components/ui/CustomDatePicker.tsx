import React, { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { format, addMonths, subMonths, startOfMonth, endOfMonth, startOfWeek, endOfWeek, isSameMonth, isSameDay, addDays, getDay } from "date-fns";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface CustomDatePickerProps {
  value: string | number | undefined;
  onChange: (value: string) => void;
  label?: string;
  error?: boolean;
}

export default function CustomDatePicker({ value, onChange, label, error }: CustomDatePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentDate, setCurrentDate] = useState(value ? new Date(value) : new Date());
  const [popoverPos, setPopoverPos] = useState({ top: 0, left: 0, width: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);

  const selectedDate = value ? new Date(value) : null;
  const displayValue = selectedDate ? format(selectedDate, "PPP") : "Select Production Date";

  useEffect(() => {
    if (isOpen && triggerRef.current) {
        const rect = triggerRef.current.getBoundingClientRect();
        setPopoverPos({
            top: rect.bottom + window.scrollY + 8,
            left: rect.left + window.scrollX,
            width: rect.width
        });
    }
  }, [isOpen]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        // Check if the click was also outside the portal content
        const portalContent = document.getElementById("calendar-portal-root");
        if (portalContent && !portalContent.contains(event.target as Node)) {
             setIsOpen(false);
        }
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const renderHeader = () => {
    return (
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <button 
          onClick={() => setCurrentDate(subMonths(currentDate, 1))}
          style={{ background: "rgba(255,255,255,0.05)", border: "none", color: "white", padding: "8px", borderRadius: "8px", cursor: "pointer" }}
        >
          <ChevronLeft size={18} />
        </button>
        <span style={{ fontWeight: 700, fontSize: "0.9rem", color: "white", textTransform: "uppercase", letterSpacing: "1px" }}>
          {format(currentDate, "MMMM yyyy")}
        </span>
        <button 
          onClick={() => setCurrentDate(addMonths(currentDate, 1))}
          style={{ background: "rgba(255,255,255,0.05)", border: "none", color: "white", padding: "8px", borderRadius: "8px", cursor: "pointer" }}
        >
          <ChevronRight size={18} />
        </button>
      </div>
    );
  };

  const renderDays = () => {
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    return (
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", marginBottom: "10px" }}>
        {days.map(day => (
          <div key={day} style={{ textAlign: "center", fontSize: "0.65rem", color: "var(--text-muted)", fontWeight: 700, textTransform: "uppercase" }}>
            {day}
          </div>
        ))}
      </div>
    );
  };

  const renderCells = () => {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const rows = [];
    let days = [];
    let day = startDate;
    let formattedDate = "";

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        formattedDate = format(day, "d");
        const cloneDay = day;
        const isSelected = selectedDate && isSameDay(day, selectedDate);
        const isCurrentMonth = isSameMonth(day, monthStart);
        const isToday = isSameDay(day, new Date());

        days.push(
          <div
            key={day.toString()}
            onClick={() => {
              onChange(format(cloneDay, "yyyy-MM-dd"));
              setIsOpen(false);
            }}
            style={{
              height: "40px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              borderRadius: "8px",
              fontSize: "0.85rem",
              transition: "all 0.2s ease",
              color: isSelected ? "black" : isCurrentMonth ? "white" : "rgba(255,255,255,0.15)",
              background: isSelected ? "var(--accent)" : "transparent",
              fontWeight: isSelected || isToday ? 700 : 400,
              border: isToday && !isSelected ? "1px solid rgba(232, 85, 10, 0.3)" : "none",
            }}
            onMouseEnter={(e) => {
              if (!isSelected) {
                e.currentTarget.style.background = "rgba(255,255,255,0.05)";
              }
            }}
            onMouseLeave={(e) => {
              if (!isSelected) {
                e.currentTarget.style.background = "transparent";
              }
            }}
          >
            {formattedDate}
          </div>
        );
        day = addDays(day, 1);
      }
      rows.push(
        <div key={day.toString()} style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)" }}>
          {days}
        </div>
      );
      days = [];
    }
    return <div>{rows}</div>;
  };

  return (
    <div ref={containerRef} style={{ position: "relative", width: "100%" }}>
      {label && (
        <label style={{ display: "block", fontSize: "0.65rem", color: error ? "#ef4444" : "var(--text-muted)", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "8px" }}>
          {label}
        </label>
      )}
      
      <div 
        ref={triggerRef}
        onClick={() => setIsOpen(!isOpen)}
        style={{ 
          width: "100%", padding: "14px", 
          background: "rgba(255,255,255,0.03)", 
          borderRadius: "10px", 
          border: `1px solid ${error ? "#ef4444" : "rgba(255,255,255,0.1)"}`,
          fontSize: "0.9rem", color: selectedDate ? "white" : "rgba(255,255,255,0.3)", 
          outline: "none",
          display: "flex", alignItems: "center", gap: "12px",
          cursor: "pointer",
          transition: "all 0.2s ease"
        }}
      >
        <CalendarIcon size={18} color="var(--accent)" />
        {displayValue}
        {selectedDate && (
          <X 
            size={14} 
            style={{ marginLeft: "auto", opacity: 0.3 }} 
            onClick={(e) => {
              e.stopPropagation();
              onChange("");
            }}
          />
        )}
      </div>

      {typeof document !== "undefined" && createPortal(
        <AnimatePresence>
          {isOpen && (
            <motion.div
              id="calendar-portal-root"
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              style={{ 
                position: "absolute", 
                top: popoverPos.top, 
                left: popoverPos.left, 
                width: "320px", 
                zIndex: 9999,
                background: "rgba(18, 15, 23, 0.98)",
                backdropFilter: "blur(25px)",
                border: "1.5px solid rgba(255,255,255,0.1)",
                borderRadius: "20px",
                padding: "24px",
                boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
                color: "white"
              }}
            >
              {renderHeader()}
              {renderDays()}
              {renderCells()}
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </div>
  );
}
