"use client";

import React, { useState } from "react";
import { Invoice, InvoiceColumns, InvoiceColumn } from "@/types/invoice";
import { ArrowUp, ArrowDown, Plus, Trash2, Layout } from "lucide-react";
import { toast } from "sonner";

interface Step2Props {
  invoice: Partial<Invoice>;
  update: (patch: Partial<Invoice>) => void;
}

export default function Step2Columns({ invoice, update }: Step2Props) {
  const columns = invoice.columns || [];
  const [newColLabel, setNewColLabel] = useState("");

  const toggleColumn = (id: string) => {
    const nextCols = columns.map(col => 
      (col.id === id && !col.isPermanent) ? { ...col, visible: !col.visible } : col
    );
    update({ columns: nextCols as InvoiceColumns });
  };

  const addCustomColumn = () => {
    if (!newColLabel.trim()) return;
    if (columns.length >= 7) {
      toast.error("Maximum 7 columns allowed for optimal design.");
      return;
    }

    const newCol: InvoiceColumn = {
      id: `custom_${Date.now()}`,
      label: newColLabel.trim(),
      visible: true,
      isPermanent: false,
      isMovable: true,
      isCustom: true
    };

    update({ columns: [...columns, newCol] });
    setNewColLabel("");
    toast.success(`Column "${newColLabel}" added.`);
  };

  const removeColumn = (id: string) => {
    update({ columns: columns.filter(c => c.id !== id) });
    toast.success("Column removed.");
  };

  const moveColumn = (index: number, direction: 'up' | 'down') => {
    const nextIndex = direction === 'up' ? index - 1 : index + 1;
    
    // Constraints:
    // 1. Cannot move out of bounds
    // 2. Cannot move anything above index 0 (Description)
    // 3. Description is immovable
    if (nextIndex < 1 || nextIndex >= columns.length || index < 1) return;

    const nextCols = [...columns];
    const item = nextCols[index];
    nextCols.splice(index, 1);
    nextCols.splice(nextIndex, 0, item);
    
    update({ columns: nextCols as InvoiceColumns });
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
      }}>Configuration</p>
      <h3 style={{ 
        fontFamily: "'Playfair Display', serif", 
        fontSize: "2rem", 
        color: "white", 
        marginBottom: "2.5rem" 
      }}>Table Architecture</h3>

      {/* Main List */}
      <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "3rem" }}>
        {columns.map((col, idx) => (
          <div 
            key={col.id}
            style={{
              padding: "16px 20px",
              background: col.visible ? "rgba(var(--accent-rgb, 232, 85, 10), 0.05)" : "rgba(255,255,255,0.01)",
              border: `1px solid ${col.visible ? "var(--accent)" : "rgba(255,255,255,0.06)"}`,
              borderRadius: "16px",
              display: "flex",
              alignItems: "center",
              gap: "20px",
              transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
              opacity: col.visible ? 1 : 0.6
            }}
          >
            {/* Reorder Buttons */}
            <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
              <button 
                disabled={!col.isMovable || idx <= 1}
                onClick={() => moveColumn(idx, 'up')}
                style={{ 
                  background: "none", border: "none", color: "white", padding: 0, 
                  cursor: (col.isMovable && idx > 1) ? "pointer" : "not-allowed",
                  opacity: (col.isMovable && idx > 1) ? 0.6 : 0.1
                }}
              >
                <ArrowUp size={14} />
              </button>
              <button 
                disabled={!col.isMovable || idx === columns.length - 1}
                onClick={() => moveColumn(idx, 'down')}
                style={{ 
                  background: "none", border: "none", color: "white", padding: 0,
                  cursor: (col.isMovable && idx < columns.length - 1) ? "pointer" : "not-allowed",
                  opacity: (col.isMovable && idx < columns.length - 1) ? 0.6 : 0.1
                }}
              >
                <ArrowDown size={14} />
              </button>
            </div>

            <div style={{ flex: 1 }} onClick={() => toggleColumn(col.id)}>
              <div style={{ fontSize: "0.95rem", fontWeight: 600, color: col.visible ? "white" : "var(--text-muted)" }}>
                {col.label}
              </div>
              {col.isPermanent && (
                <div style={{ fontSize: "9px", color: "var(--accent)", marginTop: "2px", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                  Fixed at Start
                </div>
              )}
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
              {col.isCustom && (
                <button 
                  onClick={(e) => { e.stopPropagation(); removeColumn(col.id); }}
                  style={{ background: "none", border: "none", color: "rgba(239, 68, 68, 0.4)", cursor: "pointer" }}
                  onMouseEnter={e => e.currentTarget.style.color = "var(--error)"}
                  onMouseLeave={e => e.currentTarget.style.color = "rgba(239, 68, 68, 0.4)"}
                >
                  <Trash2 size={16} />
                </button>
              )}
              
              <div 
                onClick={() => toggleColumn(col.id)}
                style={{
                  width: "40px",
                  height: "22px",
                  background: col.visible ? "var(--accent)" : "rgba(255,255,255,0.08)",
                  borderRadius: "12px",
                  padding: "2px",
                  cursor: col.isPermanent ? "not-allowed" : "pointer",
                  position: "relative"
                }}
              >
                <div style={{
                  width: "18px",
                  height: "18px",
                  background: "white",
                  borderRadius: "50%",
                  transform: col.visible ? "translateX(18px)" : "translateX(0)",
                  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
                }} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Custom Section */}
      {columns.length < 7 && (
        <div style={{ 
          padding: "24px", 
          background: "rgba(255,255,255,0.02)", 
          borderRadius: "16px",
          border: "1px dashed rgba(255,255,255,0.1)",
          marginBottom: "3rem"
        }}>
          <p style={{ fontSize: "11px", color: "var(--accent)", marginBottom: "12px", textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 700 }}>
            <Plus size={12} style={{ display: "inline", marginRight: "4px", marginBottom: "2px" }} /> Add New Tab / Column
          </p>
          <div style={{ display: "flex", gap: "10px" }}>
            <input 
              placeholder="e.g. HSN Code, Tax Rate..."
              value={newColLabel}
              onChange={(e) => setNewColLabel(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addCustomColumn()}
              style={{
                flex: 1,
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "8px",
                padding: "10px 14px",
                fontSize: "0.85rem",
                color: "white",
                outline: "none"
              }}
            />
            <button 
              onClick={addCustomColumn}
              style={{
                background: "var(--accent)",
                color: "black",
                border: "none",
                borderRadius: "8px",
                padding: "0 20px",
                fontSize: "0.85rem",
                fontWeight: 700,
                cursor: "pointer"
              }}
            >
              Add
            </button>
          </div>
        </div>
      )}

      {/* Preview */}
      <div style={{ 
        padding: "24px", 
        background: "rgba(255,255,255,0.02)", 
        borderRadius: "16px",
        border: "1px solid rgba(255,255,255,0.05)",
      }}>
        <p style={{ fontSize: "11px", color: "var(--text-muted)", marginBottom: "12px", textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 600 }}>
          Live Architecture Preview
        </p>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
          {columns.filter(c => c.visible).map((c, i) => (
            <React.Fragment key={c.id}>
              <div style={{ fontSize: "1rem", color: i === 0 ? "var(--accent)" : "white", fontWeight: 500 }}>
                {c.label}
              </div>
              {i < columns.filter(c => c.visible).length - 1 && <span style={{ opacity: 0.2 }}>•</span>}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
}
