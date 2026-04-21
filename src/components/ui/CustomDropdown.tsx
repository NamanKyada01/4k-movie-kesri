import React, { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface DropdownOption {
  value: string;
  label: string;
}

interface CustomDropdownProps {
  value: string;
  options: DropdownOption[];
  onChange: (value: string) => void;
  placeholder?: string;
  width?: string | number;
}

export default function CustomDropdown({
  value,
  options,
  onChange,
  placeholder = "Select an option",
  width = "220px",
}: CustomDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [popoverPos, setPopoverPos] = useState({ top: 0, left: 0, width: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((opt) => opt.value === value);

  useEffect(() => {
    if (isOpen && triggerRef.current) {
        const rect = triggerRef.current.getBoundingClientRect();
        setPopoverPos({
            top: rect.bottom + window.scrollY + 5,
            left: rect.left + window.scrollX,
            width: rect.width
        });
    }
  }, [isOpen]);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        const portalContent = document.getElementById("dropdown-portal-root");
        if (portalContent && !portalContent.contains(event.target as Node)) {
          setIsOpen(false);
        }
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div 
      ref={containerRef} 
      style={{ 
        position: "relative", 
        width: width,
        userSelect: "none"
      }}
    >
      {/* Trigger Button */}
      <div
        ref={triggerRef}
        onClick={() => setIsOpen(!isOpen)}
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          background: "rgba(255,255,255,0.03)",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: "12px",
          padding: "12px 16px",
          color: "white",
          fontSize: "0.9rem",
          cursor: "pointer",
          transition: "all 0.2s ease",
          boxShadow: isOpen ? "0 0 0 2px rgba(232, 85, 10, 0.2)" : "none",
          borderColor: isOpen ? "rgba(232, 85, 10, 0.4)" : "rgba(255,255,255,0.08)",
        }}
      >
        <span style={{ 
          whiteSpace: "nowrap", 
          overflow: "hidden", 
          textOverflow: "ellipsis",
          marginRight: "10px"
        }}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown 
          size={18} 
          style={{ 
            transition: "transform 0.3s ease", 
            transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
            color: "rgba(255,255,255,0.5)",
            flexShrink: 0
          }} 
        />
      </div>

      {/* Dropdown Menu */}
      {typeof document !== "undefined" && createPortal(
        <AnimatePresence>
          {isOpen && (
            <motion.div
              id="dropdown-portal-root"
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              style={{
                position: "absolute",
                top: popoverPos.top,
                left: popoverPos.left,
                width: popoverPos.width,
                background: "rgba(20, 20, 22, 0.98)",
                backdropFilter: "blur(25px)",
                border: "1px solid rgba(255, 255, 255, 0.12)",
                borderRadius: "14px",
                overflow: "hidden",
                zIndex: 10000,
                boxShadow: "0 15px 40px rgba(0,0,0,0.6)",
              }}
            >
              <div style={{ padding: "6px" }}>
                {options.map((option) => (
                  <div
                    key={option.value}
                    onClick={() => {
                      onChange(option.value);
                      setIsOpen(false);
                    }}
                    style={{
                      padding: "10px 14px",
                      borderRadius: "8px",
                      fontSize: "0.85rem",
                      color: value === option.value ? "white" : "rgba(255,255,255,0.7)",
                      background: value === option.value 
                        ? "rgba(232, 85, 10, 0.15)" 
                        : "transparent",
                      cursor: "pointer",
                      transition: "all 0.15s ease",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between"
                    }}
                    onMouseEnter={(e) => {
                      if (value !== option.value) {
                        e.currentTarget.style.background = "rgba(255,255,255,0.05)";
                        e.currentTarget.style.color = "white";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (value !== option.value) {
                        e.currentTarget.style.background = "transparent";
                        e.currentTarget.style.color = "rgba(255,255,255,0.7)";
                      }
                    }}
                  >
                    {option.label}
                    {value === option.value && (
                      <div style={{ 
                        width: "6px", 
                        height: "6px", 
                        borderRadius: "50%", 
                        background: "var(--accent)" 
                      }} />
                    )}
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </div>
  );
}
