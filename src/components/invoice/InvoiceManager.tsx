"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Invoice, InvoiceItem, BusinessProfile, GlobalTheme, InvoiceColumns, InvoiceStatus } from "@/types/invoice";
import { saveInvoice } from "@/actions/invoice";
import StepIndicator from "./StepIndicator";
import NavRow from "./NavRow";
import Step1Visual from "./Step1Visual";
import Step2Columns from "./Step2Columns";
import Step3Profiles from "./Step3Profiles";
import Step4Details from "./Step4Details";
import Step5Preview from "./Step5Preview";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

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
  const router = useRouter();
  const [step, setStep] = useState(1);
  
  const [invoice, setInvoice] = useState<Partial<Invoice>>(() => {
    // Attempt local storage sync for "create" mode
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

  // Persist to local storage
  useEffect(() => {
    if (mode === "create" && typeof window !== "undefined") {
      localStorage.setItem("invoix_draft", JSON.stringify(invoice));
    }
  }, [invoice, mode]);

  const updateInvoice = useCallback((patch: Partial<Invoice>) => {
    setInvoice(prev => ({ ...prev, ...patch }));
  }, []);

  const totalSteps = 5;

  const handleNext = () => {
    if (step < totalSteps) setStep(s => s + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(s => s - 1);
  };

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
    <div style={{ maxWidth: "1000px", margin: "0 auto", paddingBottom: "100px" }}>
      <div style={{ marginBottom: "3rem" }}>
        <h2 style={{ 
          fontFamily: "'Playfair Display', serif", 
          fontSize: "2rem", 
          color: "var(--text-primary)",
          marginBottom: "0.5rem"
        }}>
          {mode === "create" ? "Create New Invoice" : `Edit Invoice ${invoice.invoiceNumber}`}
        </h2>
        <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>
          Step {step} of 5: {getStepTitle(step)}
        </p>
      </div>

      <StepIndicator currentStep={step} totalSteps={totalSteps} />

      <div style={{ 
        background: "rgba(255, 255, 255, 0.02)", 
        border: "1px solid rgba(255, 255, 255, 0.05)",
        borderRadius: "24px",
        padding: "2.5rem",
        minHeight: "400px",
        backdropFilter: "blur(10px)"
      }}>
        {currentStepComponent}
      </div>

      <NavRow 
        onBack={handleBack} 
        onNext={handleNext} 
        canNext={canNext} 
        isFirst={step === 1} 
        isLast={step === totalSteps} 
      />
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
