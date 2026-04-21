"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Loader2, Save, ArrowRight, ArrowLeft, CheckCircle2, AlertCircle } from "lucide-react";
import { Step, StepperProvider, StepperIndicators, StepperContent, useStepper } from "./Stepper";
import BorderGlow from "./BorderGlow";
import CustomDropdown from "./CustomDropdown";
import CustomDatePicker from "./CustomDatePicker";
import { createEvent, createEquipment, createStaff, updateEvent, updateEquipment, updateStaff } from "@/actions/admin";
import { toast } from "sonner";

type ModalType = "event" | "equipment" | "staff";

interface CreationModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: ModalType;
  editData?: any; // Data for editing
}

const typeConfig = {
  event: {
    createTitle: "Set Up Event",
    editTitle: "Refine Event Mapping",
    subtitle: "Orchestrate cinematic photography and videography for upcoming events",
    steps: ["Client Info", "Event Setup", "Review"]
  },
  equipment: {
    createTitle: "Add Equipment",
    editTitle: "Refine Asset Metadata",
    subtitle: "Integrate or update technical units in the studio vault",
    steps: ["Profile", "Condition", "Review"]
  },
  staff: {
    createTitle: "Integrate Personnel",
    editTitle: "Update Identity",
    subtitle: "Onboard or manage high-fidelity talent on the active roster",
    steps: ["Identity", "specialization", "Review"]
  }
};

export default function CreationModal({ isOpen, onClose, type, editData }: CreationModalProps) {
  const config = typeConfig[type];
  const [formData, setFormData] = useState<any>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  // Initialize form data when editing or opening
  useEffect(() => {
    if (isOpen) {
      if (editData) {
        // If it's a timestamp from Firebase, we might need to convert it for the date input
        const data = { ...editData };
        if (data.date && typeof data.date === 'number') {
            data.date = new Date(data.date).toISOString().split('T')[0];
        }
        const standardTypes = ["wedding", "photography", "videography", "full-package", "drone"];
        if (type === "event" && data.type && !standardTypes.includes(data.type)) {
            data.customType = data.type;
            data.type = "custom";
        }
        const standardCategories = ["camera", "lens", "light", "audio"];
        if (type === "equipment" && data.category && !standardCategories.includes(data.category)) {
            data.customCategory = data.category;
            data.category = "custom";
        }
        setFormData(data);
      } else {
        setFormData({});
      }
      setValidationErrors({});
    }
  }, [isOpen, editData, type]);

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev: any) => ({ ...prev, [field]: value }));
    // Clear error for this field if it's being corrected
    if (validationErrors[field]) {
        const newErrors = { ...validationErrors };
        delete newErrors[field];
        setValidationErrors(newErrors);
    }
  };

  const validateStep = (step: number): boolean => {
    const errors: Record<string, string> = {};
    
    if (type === "event" && step === 0) {
      if (!formData.name) errors.name = "Event title is required";
      if (!formData.clientName) errors.clientName = "Client name is required";
      if (!formData.clientPhone) {
        errors.clientPhone = "Client contact number is required";
      } else {
        const phoneStrip = formData.clientPhone.replace(/[\s-()]/g, '');
        if (!/^\+?[0-9]{10,15}$/.test(phoneStrip)) {
           errors.clientPhone = "Invalid phone number format";
        }
      }
      if (!formData.date) errors.date = "Event date is required";
    }
    if (type === "event" && step === 1) {
      if (formData.type === "custom" && !formData.customType) {
        errors.customType = "Custom Sector is required";
      }
    }
    
    if (type === "equipment" && step === 0) {
      if (!formData.name) errors.name = "Asset Name is required";
      if (!formData.category) errors.category = "Category is required";
      if (formData.category === "custom" && !formData.customCategory) {
         errors.customCategory = "Custom Category Name is required";
      }
    }
    
    if (type === "staff" && step === 0) {
      if (!formData.name) errors.name = "Staff Identity is required";
      if (!formData.email) errors.email = "Electronic Mail is required";
      if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) errors.email = "Invalid Email format";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      let res;
      const id = editData?.id;
      
      const payload = { ...formData };
      if (payload.date) payload.date = new Date(payload.date).getTime();

      if (type === "event" && payload.type === "custom") {
          payload.type = payload.customType || "other";
      }
      delete payload.customType;

      if (type === "equipment" && payload.category === "custom") {
          payload.category = payload.customCategory || "other";
      }
      delete payload.customCategory;

      if (type === "event") {
        res = id ? await updateEvent(id, payload) : await createEvent(payload);
      } else if (type === "equipment") {
        res = id ? await updateEquipment(id, payload) : await createEquipment(payload);
      } else {
        res = id ? await updateStaff(id, payload) : await createStaff(payload);
      }

      if (res.success) {
        toast.success(`${type.charAt(0).toUpperCase() + type.slice(1)} ${id ? 'updated' : 'deployed'} successfully!`);
        onClose();
      } else {
        toast.error("Process failed: " + res.error);
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
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.8)", backdropFilter: "blur(10px)" }}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            style={{ width: "100%", maxWidth: "600px", zIndex: 1001, position: "relative" }}
          >
            <BorderGlow glowColor="232 85 10" backgroundColor="rgba(18, 15, 23, 0.98)" borderRadius={24}>
              <div style={{ padding: "40px", position: "relative" }}>
                <button 
                  onClick={onClose}
                  style={{ position: "absolute", top: 24, right: 24, background: "transparent", border: "none", color: "rgba(255,255,255,0.3)", cursor: "pointer" }}
                >
                  <X size={20} />
                </button>

                <div style={{ marginBottom: "32px" }}>
                  <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "1.75rem", color: "white", marginBottom: "8px" }}>
                    {editData ? config.editTitle : config.createTitle}
                  </h2>
                  <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>{config.subtitle}</p>
                </div>

                <StepperProvider onFinalStepCompleted={handleSubmit}>
                  <StepperIndicators />
                  
                  <div style={{ marginTop: "24px" }}>
                    <StepperContent>
                      <Step>
                        <StepContent type={type} step={0} formData={formData} onChange={handleInputChange} errors={validationErrors} />
                      </Step>
                      <Step>
                        <StepContent type={type} step={1} formData={formData} onChange={handleInputChange} errors={validationErrors} />
                      </Step>
                      <Step>
                        <StepContent type={type} step={2} formData={formData} onChange={handleInputChange} isSubmitting={isSubmitting} />
                      </Step>
                    </StepperContent>
                  </div>

                  <ModalFooter isSubmitting={isSubmitting} validateStep={validateStep} errors={validationErrors} />
                </StepperProvider>
              </div>
            </BorderGlow>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

function ModalFooter({ isSubmitting, validateStep, errors }: { isSubmitting: boolean; validateStep: (s: number) => boolean; errors: Record<string, string> }) {
  const { currentStep, totalSteps, nextStep, prevStep } = useStepper();
  const isFinalStep = currentStep === totalSteps;
  const errorMessages = Object.values(errors);

  const handleNext = () => {
    if (validateStep(currentStep - 1)) {
        nextStep();
    } else {
        toast.error("Please complete all required fields.");
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px", marginTop: "40px" }}>
      {errorMessages.length > 0 && (
        <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ display: "flex", alignItems: "center", gap: 8, padding: "12px", background: "rgba(239, 68, 68, 0.1)", borderRadius: "10px", border: "1px solid rgba(239, 68, 68, 0.2)" }}
        >
            <AlertCircle size={16} color="#ef4444" />
            <span style={{ fontSize: "0.8rem", color: "#ef4444", fontWeight: 500 }}>{errorMessages[0]}</span>
        </motion.div>
      )}

      <div style={{ display: "flex", justifyContent: "space-between", gap: "16px" }}>
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
          onClick={handleNext}
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
            isFinalStep ? <><Save size={18} /> Finish</> : <><ArrowRight size={18} /> Next</>
          )}
        </button>
      </div>
    </div>
  );
}

function StepContent({ type, step, formData, onChange, isSubmitting, errors }: any) {
  const hasError = (field: string) => !!errors[field];

  if (type === "event") {
    if (step === 0) return (
      <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
        <Input label="Event Title *" value={formData.name} onChange={(v: string) => onChange("name", v)} placeholder="e.g. Mehta Wedding" error={hasError("name")} />
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
            <Input label="Client Name *" value={formData.clientName} onChange={(v: string) => onChange("clientName", v)} placeholder="Full Name" error={hasError("clientName")} />
            <Input label="Client Phone *" value={formData.clientPhone} onChange={(v: string) => onChange("clientPhone", v)} placeholder="+91 XXXX" error={hasError("clientPhone")} />
        </div>
        <CustomDatePicker label="Event Date *" value={formData.date} onChange={(v: string) => onChange("date", v)} error={hasError("date")} />
      </div>
    );
    if (step === 1) return (
      <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
        <LabelWrapper label="Primary Sector">
          <CustomDropdown 
            options={[
              { value: "wedding", label: "Traditional Wedding" },
              { value: "photography", label: "Photography Only" },
              { value: "videography", label: "Cinematic Videography" },
              { value: "full-package", label: "Full Media Package" },
              { value: "drone", label: "Aerial Photography" },
              { value: "custom", label: "Other / Custom" }
            ]}
            value={formData.type || "wedding"}
            onChange={(v: any) => onChange("type", v)}
          />
        </LabelWrapper>
        {formData.type === "custom" && (
           <Input label="Custom Sector Name *" value={formData.customType} onChange={(v: string) => onChange("customType", v)} placeholder="e.g. Birthday, Concert..." error={hasError("customType")} />
        )}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
            <Input label="Event Location & Venue" value={formData.location} onChange={(v: string) => onChange("location", v)} placeholder="Venue Name, City" />
            <Input label="Google Maps Link" value={formData.locationLink} onChange={(v: string) => onChange("locationLink", v)} placeholder="https://maps.google.com/..." />
        </div>
        <Input label="Google Drive Album Link" value={formData.googleDriveAlbumLink} onChange={(v: string) => onChange("googleDriveAlbumLink", v)} placeholder="https://drive.google.com/..." />
        <LabelWrapper label="Status">
          <CustomDropdown 
            options={[
              { value: "planned", label: "Planned" },
              { value: "confirmed", label: "Confirmed" },
              { value: "in-progress", label: "In Progress" },
              { value: "completed", label: "Completed" }
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
        <Input label="Asset Name *" value={formData.name} onChange={(v: string) => onChange("name", v)} placeholder="e.g. Sony A7S III" error={hasError("name")} />
        <LabelWrapper label="Technical Category *">
          <CustomDropdown 
            options={[
              { value: "camera", label: "Camera Body" },
              { value: "lens", label: "Optics / Lens" },
              { value: "light", label: "Lighting Rig" },
              { value: "audio", label: "Audio Gear" },
              { value: "custom", label: "Other / Custom" }
            ]}
            value={formData.category || "camera"}
            onChange={(v: any) => onChange("category", v)}
          />
        </LabelWrapper>
        {formData.category === "custom" && (
           <Input label="Custom Category Name *" value={formData.customCategory} onChange={(v: string) => onChange("customCategory", v)} placeholder="e.g. Drone, Stylist Kit..." error={hasError("customCategory")} />
        )}
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
        <Input label="Photo URL (Optional)" value={formData.imageUrl} onChange={(v: string) => onChange("imageUrl", v)} placeholder="https://example.com/photo.jpg" />
      </div>
    );
  }

  if (type === "staff") {
    if (step === 0) return (
      <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
        <Input label="Staff Identity *" value={formData.name} onChange={(v: string) => onChange("name", v)} placeholder="Legal Name" error={hasError("identity")} />
        <Input label="Electronic Mail *" value={formData.email} onChange={(v: string) => onChange("email", v)} type="email" placeholder="email@company.com" error={hasError("mail")} />
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
        <p style={{ color: "var(--text-muted)", fontSize: "0.8rem" }}>Ensure all technical details are correct before completion.</p>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
        {Object.entries(formData)
            .filter(([k]) => !['id', 'createdAt', 'updatedAt', 'customType', 'customCategory'].includes(k))
            .map(([key, val]: any) => {
            const getLabel = (k: string) => {
                const map: Record<string, string> = {
                    name: "Title", clientName: "Client Name", clientPhone: "Phone", 
                    date: "Date", type: "Sector", location: "Location", 
                    locationLink: "Map Link", googleDriveAlbumLink: "Album Link",
                    status: "Status", category: "Category", condition: "Condition",
                    quantity: "Quantity", serialNumber: "Serial No", email: "Email",
                    position: "Role", skills: "Skills", phone: "Phone", imageUrl: "Photo Link"
                };
                return map[k] || k;
            };
            let displayVal = val;
            if (key === 'type' && val === 'custom') displayVal = formData.customType;
            if (key === 'category' && val === 'custom') displayVal = formData.customCategory;
            return (
                <div key={key}>
                    <div style={{ fontSize: "0.6rem", color: "var(--text-muted)", textTransform: "uppercase" }}>{getLabel(key)}</div>
                    <div style={{ fontSize: "0.85rem", color: "white", fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis" }}>{String(displayVal || "—")}</div>
                </div>
            );
        })}
      </div>
    </div>
  );
}

function Input({ label, value, onChange, type = "text", error, ...rest }: any) {
  return (
    <div>
      <label style={{ display: "block", fontSize: "0.65rem", color: error ? "#ef4444" : "var(--text-muted)", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "8px" }}>{label}</label>
      <input 
        type={type} value={value || ""} onChange={e => onChange(e.target.value)}
        style={{ 
          width: "100%", padding: "14px", background: "rgba(255,255,255,0.03)", 
          borderRadius: "10px", border: `1px solid ${error ? "#ef4444" : "rgba(255,255,255,0.1)"}`,
          fontSize: "0.9rem", color: "white", outline: "none",
          transition: "all 0.2s ease"
        }}
        {...rest}
      />
    </div>
  );
}

function LabelWrapper({ label, children, error }: any) {
  return (
    <div>
      <label style={{ display: "block", fontSize: "0.65rem", color: error ? "#ef4444" : "var(--text-muted)", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "8px" }}>{label}</label>
      {children}
    </div>
  );
}
