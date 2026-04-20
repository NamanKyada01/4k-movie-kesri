"use client";

import React, { useCallback, useMemo } from "react";
import { Invoice, InvoiceItem } from "@/types/invoice";
import { Plus, Trash2, Calendar as CalendarIcon, User, Layers } from "lucide-react";

interface Step4Props {
  invoice: Partial<Invoice>;
  update: (patch: Partial<Invoice>) => void;
}

export default function Step4Details({ invoice, update }: Step4Props) {
  const items = invoice.items || [];
  const columns = invoice.columns || [];
  const visibleColumns = columns.filter(c => c.visible);

  const addItem = () => {
    const newItem: InvoiceItem = {
      id: Date.now().toString(),
      description: "",
      quantity: 1,
      rate: 0,
      amount: 0,
      duration: 0,
    };
    update({ items: [...items, newItem] });
  };

  const removeItem = (id: string) => {
    if (items.length > 1) {
      update({ items: items.filter(it => it.id !== id) });
    }
  };

  const updateItem = (id: string, field: string, value: any) => {
    const nextItems = items.map(it => {
      if (it.id === id) {
        const updated = { ...it, [field]: value };
        // Recalculate amount if qty/rate changes
        if (field === "quantity" || field === "rate") {
          updated.amount = (Number(updated.quantity) || 0) * (Number(updated.rate) || 0);
        }
        return updated;
      }
      return it;
    });
    update({ items: nextItems });
  };

  const totals = useMemo(() => {
    const subtotal = items.reduce((sum, it) => sum + (it.amount || 0), 0);
    const tax = subtotal * ((invoice.taxRate || 18) / 100);
    return { subtotal, tax, total: subtotal + tax };
  }, [items, invoice.taxRate]);

  // Sync totals
  React.useEffect(() => {
    update({ 
      subtotal: totals.subtotal, 
      taxAmount: totals.tax, 
      total: totals.total 
    });
  }, [totals, update]);

  const inputStyle = {
    width: "100%",
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: "10px",
    padding: "12px 14px",
    color: "white",
    fontSize: "0.9rem",
    outline: "none",
    transition: "border-color 0.2s",
  };

  const sectionLabelStyle = {
    fontSize: "11px",
    letterSpacing: "0.1em",
    textTransform: "uppercase" as const,
    color: "var(--accent)",
    marginBottom: "1.25rem",
    fontWeight: 700,
    display: "flex",
    alignItems: "center",
    gap: "8px"
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
      }}>Logistics</p>
      <h3 style={{ 
        fontFamily: "'Playfair Display', serif", 
        fontSize: "2rem", 
        color: "white", 
        marginBottom: "2.5rem" 
      }}>Invoice Details</h3>

      {/* 1. Reference Grid */}
      <div style={{ marginBottom: "3.5rem" }}>
        <h4 style={sectionLabelStyle}><CalendarIcon size={14} /> [1] Invoice Reference</h4>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
          <div>
            <label style={{ display: "block", fontSize: "0.75rem", color: "var(--text-muted)", marginBottom: "8px" }}>Invoice Number</label>
            <input 
              style={inputStyle} 
              value={invoice.invoiceNumber || ""} 
              onChange={e => update({ invoiceNumber: e.target.value })} 
              placeholder="INV-001"
            />
          </div>
          <div>
            <label style={{ display: "block", fontSize: "0.75rem", color: "var(--text-muted)", marginBottom: "8px" }}>PO Number (Optional)</label>
            <input 
              style={inputStyle} 
              value={invoice.notes?.split('\n')[0] || ""} 
              onChange={e => update({ notes: e.target.value })} 
              placeholder="PO-2024-X"
            />
          </div>
          <div>
            <label style={{ display: "block", fontSize: "0.75rem", color: "var(--text-muted)", marginBottom: "8px" }}>Issue Date</label>
            <input 
              type="date"
              style={inputStyle} 
              value={invoice.date ? new Date(invoice.date).toISOString().split('T')[0] : ""} 
              onChange={e => update({ date: new Date(e.target.value).getTime() })} 
            />
          </div>
          <div>
            <label style={{ display: "block", fontSize: "0.75rem", color: "var(--text-muted)", marginBottom: "8px" }}>Due Date</label>
            <input 
              type="date"
              style={inputStyle} 
              value={invoice.dueDate ? new Date(invoice.dueDate).toISOString().split('T')[0] : ""} 
              onChange={e => update({ dueDate: new Date(e.target.value).getTime() })} 
            />
          </div>
        </div>
      </div>

      {/* 2. Client Details */}
      <div style={{ marginBottom: "3.5rem" }}>
        <h4 style={sectionLabelStyle}><User size={14} /> [2] Client Details</h4>
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <input 
            style={inputStyle} 
            value={invoice.customerName || ""} 
            onChange={e => update({ customerName: e.target.value })} 
            placeholder="Client / Company Name"
          />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            <input 
              style={inputStyle} 
              value={invoice.customerEmail || ""} 
              onChange={e => update({ customerEmail: e.target.value })} 
              placeholder="Email address"
            />
            <input 
              style={inputStyle} 
              value={invoice.customerPhone || ""} 
              onChange={e => update({ customerPhone: e.target.value })} 
              placeholder="Phone number"
            />
          </div>
          <textarea 
            style={{ ...inputStyle, minHeight: "80px", resize: "vertical" }} 
            value={invoice.customerAddress || ""} 
            onChange={e => update({ customerAddress: e.target.value })} 
            placeholder="Billing Address"
          />
        </div>
      </div>

      {/* 3. Line Items */}
      <div style={{ marginBottom: "3rem" }}>
        <h4 style={sectionLabelStyle}><Layers size={14} /> [3] Line Items</h4>
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          {items.map((item, idx) => (
            <div 
              key={item.id}
              style={{
                background: "rgba(255,255,255,0.02)",
                border: "1px solid rgba(255,255,255,0.06)",
                borderRadius: "16px",
                padding: "24px",
                position: "relative"
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px" }}>
                <span style={{ fontSize: "11px", fontWeight: 800, color: "var(--accent)", letterSpacing: "0.1em" }}>LINE ITEM {idx + 1}</span>
                {items.length > 1 && (
                  <button 
                    onClick={() => removeItem(item.id)}
                    style={{ background: "none", border: "none", color: "rgba(239, 68, 68, 0.4)", cursor: "pointer" }}
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </div>
              
              {/* Dynamic Column Inputs */}
              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                {visibleColumns.map(col => {
                  if (col.id === "amount") {
                    return (
                      <div key={col.id}>
                        <label style={{ fontSize: "10px", color: "var(--text-muted)", marginBottom: "6px", display: "block", fontWeight: 600 }}>{col.label}</label>
                        <div style={{ ...inputStyle, background: "rgba(var(--accent-rgb), 0.05)", border: "1px solid rgba(var(--accent-rgb), 0.15)", color: "var(--accent)", fontWeight: 700 }}>
                          ₹{(item.amount || 0).toLocaleString("en-IN")}
                        </div>
                      </div>
                    );
                  }

                  return (
                    <div key={col.id}>
                      <label style={{ fontSize: "10px", color: "var(--text-muted)", marginBottom: "6px", display: "block", fontWeight: 600 }}>{col.label}</label>
                      <input 
                        type={(col.id === "quantity" || col.id === "rate" || col.id === "duration") ? "number" : "text"}
                        style={inputStyle} 
                        value={item[col.id] || ""}
                        onChange={e => updateItem(item.id, col.id, e.target.value)}
                        placeholder={`Enter ${col.label.toLowerCase()}...`}
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
          
          <button 
            onClick={addItem}
            style={{
              padding: "1.25rem",
              background: "transparent",
              border: "1px dashed rgba(255,255,255,0.15)",
              borderRadius: "12px",
              color: "var(--text-muted)",
              cursor: "pointer",
              fontSize: "0.85rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "10px",
              fontWeight: 600,
              transition: "all 0.2s"
            }}
            onMouseEnter={e => { e.currentTarget.style.border = "1px solid var(--accent)"; e.currentTarget.style.color = "white"; }}
            onMouseLeave={e => { e.currentTarget.style.border = "1px dashed rgba(255,255,255,0.15)"; e.currentTarget.style.color = "var(--text-muted)"; }}
          >
            <Plus size={18} /> Add Line Item
          </button>
        </div>
      </div>

      {/* Totals Block */}
      <div style={{ 
        background: "rgba(255,255,255,0.03)", 
        borderRadius: "20px", 
        border: "1px solid rgba(255,255,255,0.08)",
        padding: "24px",
        display: "flex",
        flexDirection: "column",
        gap: "12px"
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.9rem", color: "var(--text-muted)" }}>
          <span>Subtotal</span>
          <span>₹{totals.subtotal.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.9rem", color: "var(--text-muted)", paddingBottom: "12px", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
          <span>GST ({invoice.taxRate || 18}%)</span>
          <span>₹{totals.tax.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: "4px" }}>
          <span style={{ fontSize: "1.1rem", fontWeight: 700, color: "white" }}>Total Due</span>
          <span style={{ fontSize: "1.75rem", fontWeight: 800, color: "var(--accent)" }}>
            ₹{totals.total.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
          </span>
        </div>
      </div>
    </div>
  );
}
