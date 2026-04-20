"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Invoice, InvoiceColumns, InvoiceStatus } from "@/types/invoice";
import StepIndicator from "./StepIndicator";
import NavRow from "./NavRow";
import Step1Visual from "./Step1Visual";
import Step2Columns from "./Step2Columns";
import Step3Profiles from "./Step3Profiles";
import Step4Details from "./Step4Details";
import Step5Preview from "./Step5Preview";
import InvoiceDocument from "./InvoiceDocument";
import { Eye, EyeOff, Layout } from "lucide-react";

interface InvoiceManagerProps {
  initialData?: Invoice | null;
  mode: "create" | "edit";
}

const DEFAULT_ITEMS = [{ id: "1", description: "", quantity: 1, rate: 0, amount: 0, duration: 0 }];

const DEFAULT_COLUMNS: InvoiceColumns = [
  { id: "description", label: "Description", visible: true, isPermanent: true, isMovable: false },
  { id: "quantity", label: "Qty", visible: true, isPermanent: false, isMovable: true },
  { id: "rate", label: "Rate", visible: true, isPermanent: false, isMovable: true },
  { id: "amount", label: "Amount", visible: true, isPermanent: true, isMovable: false },
];

export default function InvoiceManager({ initialData, mode }: InvoiceManagerProps) {
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [showMobilePreview, setShowMobilePreview] = useState(false);
  
  const [invoice, setInvoice] = useState<Partial<Invoice>>(() => {
    if (mode === "create" && typeof window !== "undefined") {
      const saved = localStorage.getItem("invoix_draft");
      if (saved) return JSON.parse(saved);
    }
    return initialData || {
      invoiceNumber: `INV-${Date.now().toString().slice(-6)}`,
      items: DEFAULT_ITEMS,
      columns: DEFAULT_COLUMNS,
      status: "draft" as InvoiceStatus,
      date: Date.now(),
      dueDate: Date.now() + 7 * 24 * 60 * 60 * 1000,
      taxRate: 18,
    };
  });

  useEffect(() => {
    if (mode === "create" && typeof window !== "undefined") {
      localStorage.setItem("invoix_draft", JSON.stringify(invoice));
    }
  }, [invoice, mode]);

  const updateInvoice = useCallback((patch: Partial<Invoice>) => {
    setInvoice(prev => ({ ...prev, ...patch }));
  }, []);

  const totalSteps = 5;
  const isLastStep = step === totalSteps;

  const currentStepComponent = useMemo(() => {
    switch (step) {
      case 1: return <Step1Visual invoice={invoice} update={updateInvoice} />;
      case 2: return <Step2Columns invoice={invoice} update={updateInvoice} />;
      case 3: return <Step3Profiles invoice={invoice} update={updateInvoice} />;
      case 4: return <Step4Details invoice={invoice} update={updateInvoice} />;
      case 5: return <Step5Preview invoice={invoice} update={updateInvoice} mode={mode} />;
      default: return null;
    }
  }, [step, invoice, updateInvoice, mode]);

  const canNext = useMemo(() => {
    if (step === 1) return !!invoice.themeDetails;
    if (step === 3) return !!invoice.businessDetails;
    return true;
  }, [step, invoice]);

  return (
    <div style={{ maxWidth: "1400px", margin: "0 auto", padding: "0 20px 100px 20px" }}>
      {/* Header Area */}
      <div style={{ marginBottom: "3rem", display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
        <div>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "2.25rem", color: "white", marginBottom: "0.5rem" }}>
            {mode === "create" ? "Drafting Statement" : `Refining ${invoice.invoiceNumber}`}
          </h2>
          <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", letterSpacing: "0.05em" }}>
            Step {step} of 5 — {getStepTitle(step)}
          </p>
        </div>
        
        {/* Mobile Toggle Button */}
        <button 
          onClick={() => setShowMobilePreview(!showMobilePreview)}
          style={{
            display: "none", // Will be shown via CSS media query if we had a stylesheet, using inline style fallback check
            background: showMobilePreview ? "var(--accent)" : "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: "12px",
            padding: "10px 16px",
            color: showMobilePreview ? "black" : "white",
            alignItems: "center",
            gap: "8px",
            cursor: "pointer",
            fontSize: "0.85rem",
            fontWeight: 700
          }}
          className="mobile-preview-toggle"
        >
          {showMobilePreview ? <><EyeOff size={16} /> Hide Preview</> : <><Eye size={16} /> Live Preview</>}
        </button>
      </div>

      <StepIndicator currentStep={step} totalSteps={totalSteps} />

      <div style={{ 
        display: "grid", 
        gridTemplateColumns: isLastStep ? "1fr" : "minmax(0, 1fr) 420px",
        gap: "3rem",
        alignItems: "start",
        position: "relative"
      }} className="editor-grid">
        
        {/* Left Column: ACTIVE STEP */}
        <div style={{ 
          background: "rgba(255, 255, 255, 0.02)", 
          border: "1px solid rgba(255, 255, 255, 0.05)",
          borderRadius: "24px",
          padding: "2.5rem",
          minHeight: "500px",
        }}>
          {currentStepComponent}
          
          <NavRow 
            onBack={() => setStep(s => s - 1)} 
            onNext={() => setStep(s => s + 1)} 
            canNext={canNext} 
            isFirst={step === 1} 
            isLast={isLastStep} 
          />
        </div>

        {/* Right Column: MINI PREVIEW (Desktop Only or Mobile Visible) */}
        {!isLastStep && (
          <aside style={{ 
            position: "sticky", 
            top: "100px", 
            transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)"
          }} className="preview-sidebar">
            <div style={{ 
              marginBottom: "1rem", 
              display: "flex", 
              justifyContent: "space-between", 
              alignItems: "center" 
            }}>
              <span style={{ fontSize: "10px", color: "var(--accent)", letterSpacing: "0.2em", fontWeight: 800, textTransform: "uppercase", display: "flex", alignItems: "center", gap: "6px" }}>
                <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "var(--accent)", animation: "pulse 1.5s infinite" }} />
                Real-Time Preview
              </span>
              <span style={{ fontSize: "10px", color: "rgba(255,255,255,0.2)", textTransform: "uppercase" }}>A4 Scaled 0.6x</span>
            </div>
            
            <div style={{ 
              borderRadius: "12px",
              boxShadow: "0 30px 60px rgba(0,0,0,0.4)",
              background: "rgba(0,0,0,0.92)",
              zIndex: 2000,
              overflow: "hidden",
            }}>
              <div style={{ transform: "scale(0.65)", transformOrigin: "top left", width: "153.8%" /* (1 / 0.65) * 100 */ }}>
                <InvoiceDocument invoice={invoice} />
              </div>
            </div>

            <div style={{ 
              marginTop: "1.5rem", 
              padding: "1rem", 
              background: "rgba(255,255,255,0.02)", 
              borderRadius: "12px", 
              border: "1px solid rgba(255,255,255,0.05)",
              fontSize: "0.8rem",
              color: "var(--text-muted)",
              lineHeight: 1.5
            }}>
                <Layout size={14} style={{ marginBottom: "8px", color: "var(--accent)" }} />
                <p>This is a live representation of your final document. Reach **Step 5** for the full-resolution review and PDF export.</p>
            </div>
          </aside>
        )}
      </div>

      {/* Global CSS for responsiveness and animations */}
      <style jsx global>{`
        @keyframes pulse {
          0% { opacity: 0.4; transform: scale(0.8); }
          50% { opacity: 1; transform: scale(1.1); }
          100% { opacity: 0.4; transform: scale(0.8); }
        }
        
        @media (max-width: 1024px) {
          .editor-grid {
            grid-template-columns: 1fr !important;
          }
          .preview-sidebar {
            display: ${showMobilePreview ? "block" : "none"};
            position: fixed !important;
            top: 0 !important;
            left: 0 !important;
            right: 0 !important;
            bottom: 0 !important;
            background: #000 !important;
            z-index: 2000;
            padding: 40px 20px !important;
            overflow-y: auto;
          }
          .mobile-preview-toggle {
            display: flex !important;
          }
        }
      `}</style>
    </div>
  );
}

function getStepTitle(step: number) {
  switch (step) {
    case 1: return "Visual Identity";
    case 2: return "Table Architecture";
    case 3: return "Business Profile";
    case 4: return "Invoice Details";
    case 5: return "Review & Finalize";
    default: return "";
  }
}
