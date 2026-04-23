"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Loader2, Save, ArrowRight, ArrowLeft, CheckCircle2, AlertCircle, Sparkles, Image as ImageIcon } from "lucide-react";
import { Step, StepperProvider, StepperIndicators, StepperContent, useStepper } from "./Stepper";
import BorderGlow from "./BorderGlow";
import CustomDropdown from "./CustomDropdown";
import CustomDatePicker from "./CustomDatePicker";
import ImageUpload from "./ImageUpload";
import { 
  createEvent, createEquipment, createStaff, createGalleryPhoto, createBlogPost,
  updateEvent, updateEquipment, updateStaff, updateGalleryPhoto, updateBlogPost,
  generateAIContent 
} from "@/actions/admin";
import { toast } from "sonner";

type ModalType = "event" | "equipment" | "staff" | "gallery" | "blog";

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
    createTitle: "Add Staff Member",
    editTitle: "Update Staff Profile",
    subtitle: "Onboard or manage the creative talent on the active roster",
    steps: ["Profile", "Role", "Review"]
  },
  gallery: {
    createTitle: "Upload Photos",
    editTitle: "Update Photo Info",
    subtitle: "Add new cinematic assets to your professional showcase",
    steps: ["Select Media", "Category", "Review"]
  },
  blog: {
    createTitle: "Write Article",
    editTitle: "Update Post",
    subtitle: "Publish cinematic stories and drive organic studio traffic",
    steps: ["SEO & Title", "Content & Category", "Review"]
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
        if (type === "gallery") {
            data.url = data.cloudinaryUrl;
            data.isFeatured = data.featured;
        }
        setFormData(data);
      } else {
        // Initialize with default values so validation matches UI view
        const defaults: any = {};
        if (type === "event") {
            defaults.type = "wedding";
            defaults.status = "planned";
        } else if (type === "equipment") {
            defaults.category = "camera";
            defaults.condition = "available";
            defaults.quantity = "1";
        } else if (type === "staff") {
            defaults.position = "photographer";
        } else if (type === "gallery") {
            defaults.category = "wedding";
            defaults.isFeatured = false;
        } else if (type === "blog") {
            defaults.category = "news";
            defaults.status = "draft";
            defaults.views = 0;
        }
        setFormData(defaults);
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
      if (!formData.name) errors.name = "Staff Name is required";
      if (!formData.email) errors.email = "Email address is required";
      if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) errors.email = "Invalid Email format";
    }

    if (type === "gallery" && step === 0) {
      if (!formData.url && !formData.selectedFiles) errors.url = "Please select at least one photo";
    }

    if (type === "blog" && step === 0) {
      if (!formData.title) errors.title = "Post Title is required";
      if (!formData.slug) errors.slug = "Slug is required for SEO";
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

      if (type === "gallery") {
          payload.cloudinaryUrl = payload.url;
          payload.featured = !!payload.isFeatured;
          delete payload.url;
          delete payload.isFeatured;
      }

      if (type === "blog") {
          res = id ? await updateBlogPost(id, payload) : await createBlogPost(payload);
      } else if (type === "event") {
        res = id ? await updateEvent(id, payload) : await createEvent(payload);
      } else if (type === "equipment") {
        res = id ? await updateEquipment(id, payload) : await createEquipment(payload);
      } else if (type === "gallery") {
        // Gallery might have bulk upload if we use the same modal, 
        // but for now let's handle the specific image selected in ImageUpload
        res = id ? await updateGalleryPhoto(id, payload) : await createGalleryPhoto(payload);
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
  const [isAILoading, setIsAILoading] = useState(false);

  const handleAIGenerate = async () => {
    if (!formData.title) return toast.error("Please enter a topic/title first");
    setIsAILoading(true);
    const res = await generateAIContent(formData.title);
    if (res.success) {
      onChange("content", res.content);
      if (res.content && !formData.excerpt) {
        const textOnly = res.content.replace(/<[^>]*>/g, "").slice(0, 150) + "...";
        onChange("excerpt", textOnly);
      }
      toast.success("AI Generation Complete!");
    } else {
      toast.error(res.error || "AI failed to generate content");
    }
    setIsAILoading(false);
  };

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
        <ImageUpload 
          value={formData.imageUrl} 
          onChange={(v: string) => onChange("imageUrl", v)} 
          folder="equipment" 
        />
      </div>
    );
  }

  if (type === "staff") {
    if (step === 0) return (
      <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
        <Input label="Staff Name *" value={formData.name} onChange={(v: string) => onChange("name", v)} placeholder="Full Name" error={hasError("name")} />
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
            <Input label="Email Address *" value={formData.email} onChange={(v: string) => onChange("email", v)} type="email" placeholder="email@company.com" error={hasError("email")} />
            <Input label="Phone Number" value={formData.phone} onChange={(v: string) => onChange("phone", v)} placeholder="+91 XXXX XXXX" />
        </div>
        <ImageUpload 
          value={formData.profilePhoto} 
          onChange={(v: string) => onChange("profilePhoto", v)} 
          folder="staff" 
          label="Profile Photo"
        />
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

  if (type === "gallery") {
    if (step === 0) return (
      <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
        <ImageUpload 
          value={formData.url} 
          onChange={(v: string) => onChange("url", v)} 
          folder="4kmoviekesri-gallery" 
          label="Gallery Image"
        />
        <Input label="Short Title (Optional)" value={formData.title} onChange={(v: string) => onChange("title", v)} placeholder="e.g. Dreamy Couple Logout" />
      </div>
    );
    if (step === 1) return (
      <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
        <LabelWrapper label="Gallery Category">
          <CustomDropdown 
            options={[
              { value: "wedding", label: "Wedding" },
              { value: "engagement", label: "Engagement" },
              { value: "portrait", label: "Portrait" },
              { value: "corporate", label: "Corporate" }
            ]}
            value={formData.category || "wedding"}
            onChange={(v: any) => onChange("category", v)}
          />
        </LabelWrapper>
        <div style={{ display: "flex", alignItems: "center", gap: "12px", background: "rgba(255,255,255,0.02)", padding: "16px", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.05)" }}>
            <input 
                type="checkbox" id="isFeatured" checked={formData.isFeatured || false} 
                onChange={e => onChange("isFeatured", e.target.checked)} 
                style={{ width: "18px", height: "18px", accentColor: "var(--accent)" }} 
            />
            <label htmlFor="isFeatured" style={{ fontSize: "0.9rem", color: "var(--text-secondary)", cursor: "pointer" }}>Highlight this in Showcase?</label>
        </div>
      </div>
    );
  }

  if (type === "blog") {
    if (step === 0) return (
      <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
        <div style={{ display: "flex", alignItems: "flex-end", gap: "12px" }}>
          <div style={{ flex: 1 }}>
            <Input
              label="Article Topic / Title *"
              value={formData.title}
              onChange={(v: string) => {
                onChange("title", v);
                const slug = v.toLowerCase().replace(/\s+/g, "-").replace(/[^\w-]+/g, "");
                onChange("slug", slug);
              }}
              placeholder="e.g. The Art of Cinematic Wedding Lighting"
              error={hasError("title")}
            />
          </div>
          <div style={{ display: "flex", gap: "8px" }}>
            <button
              type="button"
              onClick={handleAIGenerate}
              disabled={isAILoading}
              title="Generate AI Text"
              style={{
                height: "48px", padding: "0 15px", borderRadius: "10px",
                background: "rgba(232, 85, 10, 0.1)",
                border: "1px solid rgba(232, 85, 10, 0.3)", color: "var(--accent)", fontSize: "0.85rem", fontWeight: 700,
                display: "flex", alignItems: "center", gap: "8px", cursor: isAILoading ? "wait" : "pointer"
              }}
            >
              {isAILoading ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
            </button>
            <button
              type="button"
              onClick={() => {
                if (!formData.title) return toast.error("Please enter a title first");
                const prompt = encodeURIComponent(`${formData.title} cinematic photography, professional wedding lighting, 8k luxury studio style`);
                const url = `https://pollinations.ai/p/${prompt}?width=1280&height=720&seed=${Math.floor(Math.random() * 1000000)}&nologo=true`;
                onChange("coverImage", url);
                toast.success("Cinematic Cover Generated!");
              }}
              title="Generate AI Cover"
              style={{
                height: "48px", padding: "0 15px", borderRadius: "10px",
                background: "linear-gradient(135deg, var(--accent) 0%, #ff8c00 100%)",
                border: "none", color: "white", fontSize: "0.85rem", fontWeight: 700,
                display: "flex", alignItems: "center", gap: "8px", cursor: "pointer"
              }}
            >
              <ImageIcon size={16} />
            </button>
          </div>
        </div>
        <Input label="Slug (SEO URL) *" value={formData.slug} onChange={(v: string) => onChange("slug", v)} placeholder="the-art-of-lighting" error={hasError("slug")} />
        <TextArea label="Brief Excerpt (SEO Summary) *" value={formData.excerpt} onChange={(v: string) => onChange("excerpt", v)} placeholder="In this professional guide, we explore..." rows={2} />
      </div>
    );
    if (step === 1) return (
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                <LabelWrapper label="Primary Category">
                    <CustomDropdown 
                        options={[
                            { value: "news", label: "Studio News" },
                            { value: "tips", label: "Master Tips" },
                            { value: "weddings", label: "Wedding Stories" },
                            { value: "equipment", label: "Gear Reviews" }
                        ]}
                        value={formData.category || "news"}
                        onChange={(v: any) => onChange("category", v)}
                    />
                </LabelWrapper>
                <LabelWrapper label="Publishing Status">
                    <CustomDropdown 
                        options={[
                            { value: "draft", label: "Keep as Draft" },
                            { value: "published", label: "Publish Locally" }
                        ]}
                        value={formData.status || "draft"}
                        onChange={(v: any) => onChange("status", v)}
                    />
                </LabelWrapper>
            </div>
            <TextArea 
                label="Article Content (HTML Supported) *" 
                value={formData.content} 
                onChange={(v: string) => onChange("content", v)} 
                placeholder="<h2>Introduction</h2><p>Begin your cinematic journey here...</p>" 
                rows={10} 
            />
            <ImageUpload 
                label="Cover Image (Optional)"
                value={formData.coverImage}
                onChange={(v: string) => onChange("coverImage", v)}
                folder="blogs"
            />
        </div>
    );
  }

  // Final Step: Review
  return (
    <div style={{ background: "rgba(255,255,255,0.02)", padding: "32px", borderRadius: "16px", border: "1px solid rgba(255,255,255,0.05)", position: "relative", overflow: "hidden" }}>
      {/* Decorative Background Glow */}
      <div style={{ position: "absolute", top: -50, left: "50%", transform: "translateX(-50%)", width: 200, height: 100, background: "var(--accent)", filter: "blur(80px)", opacity: 0.15, borderRadius: "50%" }} />

      <div style={{ textAlign: "center", marginBottom: "32px", position: "relative" }}>
        <motion.div initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.4, ease: "easeOut" }}>
          <CheckCircle2 size={48} color="var(--accent)" style={{ marginBottom: "16px", margin: "0 auto", filter: "drop-shadow(0 0 12px var(--accent-glow))" }} />
        </motion.div>
        <h4 style={{ fontFamily: "var(--font-heading)", fontSize: "1.5rem", color: "white", margin: "0 0 8px 0", letterSpacing: "1px" }}>Review Metadata</h4>
        <p style={{ color: "var(--text-muted)", fontSize: "0.85rem", maxWidth: "80%", margin: "0 auto" }}>Ensure all technical elements are aligned before final deployment.</p>
      </div>

      {(formData.imageUrl || formData.profilePhoto) && (
        <div style={{ marginBottom: "24px", display: "flex", justifyContent: "center" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={formData.imageUrl || formData.profilePhoto} alt="Asset Preview" style={{ width: "100%", maxWidth: "200px", height: "120px", objectFit: "cover", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.1)" }} />
        </div>
      )}

      <div style={{ 
          display: "grid", 
          gridTemplateColumns: "1fr 1fr", 
          gap: "16px", 
          background: "rgba(0,0,0,0.3)", 
          padding: "20px", 
          borderRadius: "12px",
          maxHeight: "350px",
          overflowY: "auto",
          border: "1px solid rgba(255,255,255,0.05)"
      }} className="custom-scrollbar">
        {Object.entries(formData)
            .filter(([k]) => !['id', 'createdAt', 'updatedAt', 'customType', 'customCategory', 'imageUrl', 'profilePhoto'].includes(k))
            .map(([key, val]: any) => {
            const getLabel = (k: string) => {
                const map: Record<string, string> = {
                    name: "Title / Identity", clientName: "Client Name", clientPhone: "Phone", 
                    date: "Date", type: "Sector", location: "Location", 
                    locationLink: "Map Link", googleDriveAlbumLink: "Album Link",
                    status: "Status", category: "Category", condition: "Condition",
                    quantity: "Quantity", serialNumber: "Serial No", email: "Email",
                    position: "Role", skills: "Skills", phone: "Phone", profilePhoto: "Profile Photo"
                };
                return map[k] || k;
            };
            let displayVal = val;
            if (key === 'type' && val === 'custom') displayVal = formData.customType;
            if (key === 'category' && val === 'custom') displayVal = formData.customCategory;
            return (
                <div key={key} style={{ display: "flex", flexDirection: "column", gap: "6px", borderBottom: "1px solid rgba(255,255,255,0.03)", paddingBottom: "8px" }}>
                    <div style={{ fontSize: "0.6rem", color: "var(--accent)", textTransform: "uppercase", letterSpacing: "1px", fontWeight: 700 }}>{getLabel(key)}</div>
                    <div style={{ fontSize: "0.85rem", color: "white", fontWeight: 400, wordBreak: "break-all" }}>{String(displayVal || "—")}</div>
                </div>
            );
        })}
      </div>
      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: rgba(0,0,0,0.1); }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: var(--accent); borderRadius: 10px; }
      `}</style>
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

function TextArea({ label, value, onChange, rows = 4, error, ...rest }: any) {
    return (
      <div>
        <label style={{ display: "block", fontSize: "0.65rem", color: error ? "#ef4444" : "var(--text-muted)", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "8px" }}>{label}</label>
        <textarea 
          value={value || ""} onChange={e => onChange(e.target.value)} rows={rows}
          style={{ 
            width: "100%", padding: "14px", background: "rgba(255,255,255,0.03)", 
            borderRadius: "10px", border: `1px solid ${error ? "#ef4444" : "rgba(255,255,255,0.1)"}`,
            fontSize: "0.9rem", color: "white", outline: "none", resize: "vertical",
            transition: "all 0.2s ease"
          }}
          {...rest}
        />
      </div>
    );
}
