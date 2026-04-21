"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Loader2, Save, ArrowRight, ArrowLeft, CheckCircle2 } from "lucide-react";
import { Step, StepperProvider, StepperIndicators, StepperContent, useStepper } from "./Stepper";
import BorderGlow from "./BorderGlow";
import CustomDropdown from "./CustomDropdown";
import { createEvent, createEquipment, createStaff } from "@/actions/admin";
import { toast } from "sonner";

type ModalType = "event" | "equipment" | "staff";

interface CreationModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: ModalType;
}

const typeConfig = {
  event: {
    title: "Deploy Production",
    subtitle: "Register a new cinematic production slot in the registry",
    steps: ["Details", "Logistics", "Review"]
  },
  equipment: {
    title: "Catalog Asset",
    subtitle: "Integrate a new technical unit into the studio vault",
    steps: ["Profile", "Condition", "Review"]
  },
  staff: {
    title: "Integrate Personnel",
    subtitle: "Onboard a new high-fidelity talent to the active roster",
    steps: ["Identity", "specialization", "Review"]
  }
};

export default function CreationModal({ isOpen, onClose, type }: CreationModalProps) {
  const config = typeConfig[type];
  const [formData, setFormData] = useState<any>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev: any) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      let res;
      if (type === "event") {
        res = await createEvent({
          name: formData.name || "Untitled Production",
          clientName: formData.clientName || "Unknown Client",
          date: new Date(formData.date || Date.now()).getTime(),
          type: formData.type || "wedding",
          status: formData.status || "planned",
          location: formData.location || "Surat, Gujarat"
        });
      } else if (type === "equipment") {
        res = await createEquipment({
          name: formData.name || "Untitled Asset",
          category: formData.category || "camera",
          quantity: Number(formData.quantity) || 1,
          condition: formData.condition || "available",
          serialNumber: formData.serialNumber || "",
          images: []
        });
      } else {
        res = await createStaff({
          name: formData.name || "New Member",
          position: formData.position || "photographer",
          email: formData.email || "",
          phone: formData.phone || "",
          skills: formData.skills ? formData.skills.split(",").map((s: string) => s.trim()) : [],
          isActive: true,
          assignedEquipmentIds: [],
          availability: { mon: true, tue: true, wed: true, thu: true, fri: true, sat: true, sun: true }
        });
      }

      if (res.success) {
        toast.success(`${type.charAt(0).toUpperCase() + type.slice(1)} deployed successfully!`);
        onClose();
        setFormData({});
      } else {
        toast.error("Deployment failed: " + res.error);
      }
    } catch (error: any) {
      toast.error("Critical failure: " + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div style={{ position: "fixed", inset: 0, zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }}>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.8)", backdropFilter: "blur(10px)" }}
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            style={{ width: "100%", maxWidth: "600px", zIndex: 1001, position: "relative" }}
          >
            <BorderGlow glowColor="232 85 10" backgroundColor="rgba(18, 15, 23, 0.98)" borderRadius={24}>
              <div style={{ padding: "40px", position: "relative" }}>
                {/* Close Button */}
                <button 
                  onClick={onClose}
                  style={{ position: "absolute", top: 24, right: 24, background: "transparent", border: "none", color: "rgba(255,255,255,0.3)", cursor: "pointer" }}
                >
                  <X size={20} />
                </button>

                {/* Header */}
                <div style={{ marginBottom: "32px" }}>
                  <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "1.75rem", color: "white", marginBottom: "8px" }}>{config.title}</h2>
                  <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>{config.subtitle}</p>
                </div>

                {/* Stepper Content */}
                <StepperProvider onFinalStepCompleted={handleSubmit}>
                  <StepperIndicators />
                  <div style={{ marginTop: "24px" }}>
                    <StepperContent>
                      <Step>
                        <StepContent type={type} step={0} formData={formData} onChange={handleInputChange} />
                      </Step>
                      <Step>
                        <StepContent type={type} step={1} formData={formData} onChange={handleInputChange} />
                      </Step>
                      <Step>
                        <StepContent type={type} step={2} formData={formData} onChange={handleInputChange} isSubmitting={isSubmitting} />
                      </Step>
                    </StepperContent>
                  </div>

                  {/* Footer Controls */}
                  <ModalFooter isSubmitting={isSubmitting} />
                </StepperProvider>
              </div>
            </BorderGlow>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

function ModalFooter({ isSubmitting }: { isSubmitting: boolean }) {
  const { currentStep, totalSteps, nextStep, prevStep } = useStepper();
  const isFinalStep = currentStep === totalSteps;

  return (
    <div style={{ display: "flex", justifyContent: "space-between", marginTop: "40px", gap: "16px" }}>
      {currentStep > 1 ? (
        <button 
          onClick={prevStep}
          type="button"
          disabled={isSubmitting}
          style={{ 
            display: "flex", alignItems: "center", gap: 8, padding: "12px 24px", 
            background: "rgba(255,255,255,0.05)", borderRadius: "12px", border: "none",
            color: "white", fontSize: "0.9rem", fontWeight: 600, cursor: "pointer" 
          }}
        >
          <ArrowLeft size={18} /> Back
        </button>
      ) : <div />}

      <button 
        onClick={nextStep}
        type="button"
        disabled={isSubmitting}
        style={{ 
          display: "flex", alignItems: "center", gap: 8, padding: "12px 32px", 
          background: isFinalStep ? "var(--accent)" : "rgba(255,255,255,0.1)", 
          borderRadius: "12px", border: "none",
          color: "white", fontSize: "0.9rem", fontWeight: 700, cursor: "pointer",
          boxShadow: isFinalStep ? "0 4px 12px var(--accent-glow)" : "none"
        }}
      >
        {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : (
          isFinalStep ? <><Save size={18} /> Deploy</> : <><ArrowRight size={18} /> Next</>
        )}
      </button>
    </div>
  );
}

function StepContent({ type, step, formData, onChange, isSubmitting }: any) {
  if (type === "event") {
    if (step === 0) return (
      <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
        <Input label="Production Title" value={formData.name} onChange={(v: string) => onChange("name", v)} placeholder="e.g. Mehta & Shah Wedding" />
        <Input label="Client Identity" value={formData.clientName} onChange={(v: string) => onChange("clientName", v)} placeholder="Full Name" />
        <Input label="Production Date" value={formData.date} onChange={(v: string) => onChange("date", v)} type="date" />
      </div>
    );
    if (step === 1) return (
      <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
        <LabelWrapper label="Cinema Sector">
          <CustomDropdown 
            options={[
              { value: "wedding", label: "Wedding Film" },
              { value: "pre-wedding", label: "Pre-Wedding" },
              { value: "corporate", label: "Corporate" }
            ]}
            value={formData.type || "wedding"}
            onChange={(v: any) => onChange("type", v)}
          />
        </LabelWrapper>
        <Input label="Location" value={formData.location} onChange={(v: string) => onChange("location", v)} placeholder="Venue & City" />
        <LabelWrapper label="Initial Status">
          <CustomDropdown 
            options={[
              { value: "planned", label: "Planned" },
              { value: "confirmed", label: "Confirmed" }
            ]}
            value={formData.status || "planned"}
            onChange={(v: any) => onChange("status", v)}
          />
        </LabelWrapper>
      </div>
    );
  }

  if (type === "equipment") {
    if (step === 0) return (
      <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
        <Input label="Asset Name" value={formData.name} onChange={(v: string) => onChange("name", v)} placeholder="e.g. Sony A7S III" />
        <LabelWrapper label="Technical Category">
          <CustomDropdown 
            options={[
              { value: "camera", label: "Camera Body" },
              { value: "lens", label: "Optics / Lens" },
              { value: "light", label: "Lighting Rig" },
              { value: "audio", label: "Audio Gear" }
            ]}
            value={formData.category || "camera"}
            onChange={(v: any) => onChange("category", v)}
          />
        </LabelWrapper>
        <Input label="Serial Number" value={formData.serialNumber} onChange={(v: string) => onChange("serialNumber", v)} placeholder="ID Key" />
      </div>
    );
    if (step === 1) return (
      <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
        <Input label="Quantity" value={formData.quantity} onChange={(v: string) => onChange("quantity", v)} type="number" min="1" />
        <LabelWrapper label="Asset Condition">
          <CustomDropdown 
            options={[
              { value: "available", label: "Pristine / Available" },
              { value: "in-use", label: "Deployed / In Use" },
              { value: "maintenance", label: "Under Maintenance" }
            ]}
            value={formData.condition || "available"}
            onChange={(v: any) => onChange("condition", v)}
          />
        </LabelWrapper>
      </div>
    );
  }

  if (type === "staff") {
    if (step === 0) return (
      <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
        <Input label="Staff Identity" value={formData.name} onChange={(v: string) => onChange("name", v)} placeholder="Legal Name" />
        <Input label="Electronic Mail" value={formData.email} onChange={(v: string) => onChange("email", v)} type="email" placeholder="email@company.com" />
        <Input label="Phone Matrix" value={formData.phone} onChange={(v: string) => onChange("phone", v)} placeholder="+91 XXXX XXXX" />
      </div>
    );
    if (step === 1) return (
      <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
        <LabelWrapper label="Professional Role">
          <CustomDropdown 
            options={[
              { value: "photographer", label: "Cinematographer" },
              { value: "videographer", label: "Director of Photography" },
              { value: "editor", label: "Master Editor" }
            ]}
            value={formData.position || "photographer"}
            onChange={(v: any) => onChange("position", v)}
          />
        </LabelWrapper>
        <Input label="Skill Matrix (Comma separated)" value={formData.skills} onChange={(v: string) => onChange("skills", v)} placeholder="Light, Color, Framing..." />
      </div>
    );
  }

  // Final Step: Review
  return (
    <div style={{ background: "rgba(255,255,255,0.02)", padding: "24px", borderRadius: "16px", border: "1px solid rgba(255,255,255,0.05)" }}>
      <div style={{ textAlign: "center", marginBottom: "24px" }}>
        <CheckCircle2 size={40} color="var(--accent)" style={{ marginBottom: "12px" }} />
        <h4 style={{ color: "white", margin: 0 }}>Review Metadata</h4>
        <p style={{ color: "var(--text-muted)", fontSize: "0.8rem" }}>Ensure all technical details are correct before deployment.</p>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
        {Object.entries(formData).map(([key, val]: any) => (
          <div key={key}>
             <div style={{ fontSize: "0.6rem", color: "var(--text-muted)", textTransform: "uppercase" }}>{key}</div>
             <div style={{ fontSize: "0.85rem", color: "white", fontWeight: 600 }}>{String(val || "—")}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Input({ label, value, onChange, type = "text", ...rest }: any) {
  return (
    <div>
      <label style={{ display: "block", fontSize: "0.65rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "8px" }}>{label}</label>
      <input 
        type={type} value={value || ""} onChange={e => onChange(e.target.value)}
        style={{ 
          width: "100%", padding: "14px", background: "rgba(255,255,255,0.03)", 
          borderRadius: "10px", border: "1px solid rgba(255,255,255,0.1)",
          fontSize: "0.9rem", color: "white", outline: "none"
        }}
        {...rest}
      />
    </div>
  );
}

function LabelWrapper({ label, children }: any) {
  return (
    <div>
      <label style={{ display: "block", fontSize: "0.65rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "8px" }}>{label}</label>
      {children}
    </div>
  );
}
