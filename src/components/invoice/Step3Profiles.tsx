"use client";

import React, { useState, useEffect } from "react";
import { Invoice, BusinessProfile } from "@/types/invoice";
import { getBusinessProfiles, saveBusinessProfile } from "@/actions/invoice";
import { useAuth } from "@/contexts/AuthContext";
import { Check, Edit3, Plus, Info, X, Building2, Phone, Mail, MapPin, CreditCard } from "lucide-react";
import { toast } from "sonner";

interface Step3Props {
  invoice: Partial<Invoice>;
  update: (patch: Partial<Invoice>) => void;
}

export default function Step3Profiles({ invoice, update }: Step3Props) {
  const { user } = useAuth();
  const [profiles, setProfiles] = useState<BusinessProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [formData, setFormData] = useState({
    brandName: "",
    brandAddress: "",
    brandPhone: "",
    brandEmail: "",
    gstNumber: "",
    panNumber: "",
  });

  useEffect(() => {
    if (user?.uid) {
      loadProfiles();
    }
  }, [user]);

  async function loadProfiles() {
    setLoading(true);
    const res = await getBusinessProfiles(user!.uid);
    if (res.success && res.profiles) {
      setProfiles(res.profiles);
    }
    setLoading(false);
  }

  const selectProfile = (p: BusinessProfile) => {
    update({ businessDetails: p });
    toast.success(`${p.brandName} selected as sender`);
  };

  const handleCreateProfile = async () => {
    if (!formData.brandName || !formData.brandEmail) {
      toast.error("Name and Email are required");
      return;
    }

    setIsSaving(true);
    const res = await saveBusinessProfile(user!.uid, {
      ...formData,
      showLogo: true,
    });

    if (res.success) {
      toast.success("Identity created successfully");
      setShowModal(false);
      setFormData({ brandName: "", brandAddress: "", brandPhone: "", brandEmail: "", gstNumber: "", panNumber: "" });
      loadProfiles();
    } else {
      toast.error("Failed to save: " + res.error);
    }
    setIsSaving(false);
  };

  const inputStyle = {
    width: "100%",
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: "12px",
    padding: "12px 16px",
    color: "white",
    fontSize: "0.9rem",
    outline: "none",
    marginBottom: "12px"
  };

  return (
    <div style={{ animation: "fadeIn 0.5s ease", position: "relative" }}>
      <p style={{ 
        fontSize: "11px", 
        letterSpacing: "0.15rem", 
        textTransform: "uppercase", 
        color: "var(--accent)",
        marginBottom: "1rem",
        fontWeight: 600
      }}>Origin</p>
      <h3 style={{ 
        fontFamily: "'Playfair Display', serif", 
        fontSize: "2rem", 
        color: "white", 
        marginBottom: "2.5rem" 
      }}>Business Identity</h3>

      {loading ? (
        <div style={{ padding: "40px", textAlign: "center", color: "var(--text-muted)" }}>Loading identities...</div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "16px", marginBottom: "3rem" }}>
          {profiles.length === 0 && (
            <div style={{ 
              padding: "40px", 
              textAlign: "center", 
              background: "rgba(255,255,255,0.02)", 
              border: "1px dashed rgba(255,255,255,0.1)", 
              borderRadius: "20px" 
            }}>
              <Building2 size={32} style={{ opacity: 0.2, marginBottom: "16px" }} />
              <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>No identities found. Create your first one to continue.</p>
            </div>
          )}

          {profiles.map((p) => {
            const isSelected = invoice.businessDetails?.id === p.id;
            
            return (
              <div 
                key={p.id}
                onClick={() => selectProfile(p)}
                style={{
                  padding: "24px",
                  background: isSelected ? "rgba(var(--accent-rgb), 0.05)" : "rgba(255,255,255,0.02)",
                  border: isSelected ? "1.5px solid var(--accent)" : "1.5px solid rgba(255,255,255,0.08)",
                  borderRadius: "20px",
                  cursor: "pointer",
                  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                  display: "flex",
                  alignItems: "center",
                  gap: "20px",
                }}
              >
                <div style={{
                  width: "56px",
                  height: "56px",
                  borderRadius: "14px",
                  background: isSelected ? "var(--accent)" : "rgba(255,255,255,0.05)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: isSelected ? "#000" : "rgba(255,255,255,0.2)",
                  fontSize: "1.2rem",
                  fontWeight: 900
                }}>
                  {p.brandName[0]}
                </div>

                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                    <span style={{ fontSize: "1.1rem", fontWeight: 700, color: isSelected ? "white" : "rgba(255,255,255,0.8)" }}>
                      {p.brandName}
                    </span>
                    {isSelected && <Check size={16} color="var(--accent)" strokeWidth={3} />}
                  </div>
                  <div style={{ fontSize: "0.85rem", color: "var(--text-muted)", lineHeight: 1.4 }}>
                    {p.brandAddress}
                  </div>
                </div>

                <div style={{ opacity: isSelected ? 1 : 0.4 }}>
                    <Edit3 size={18} color="var(--text-muted)" />
                </div>
              </div>
            );
          })}
        </div>
      )}

      <button
        onClick={() => setShowModal(true)}
        style={{
          width: "100%",
          padding: "1.5rem",
          background: "transparent",
          border: "1px dashed rgba(255,255,255,0.15)",
          borderRadius: "20px",
          color: "var(--text-muted)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "12px",
          fontSize: "0.9rem",
          fontWeight: 500,
          cursor: "pointer",
          transition: "all 0.2s"
        }}
        onMouseEnter={(e) => { e.currentTarget.style.borderColor = "var(--accent)"; e.currentTarget.style.color = "white"; }}
        onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.15)"; e.currentTarget.style.color = "var(--text-muted)"; }}
      >
        <Plus size={20} /> Add New Business Profile
      </button>

      {/* Modal - Simple implementation */}
      {showModal && (
        <div style={{
          position: "fixed",
          top: 0, left: 0, right: 0, bottom: 0,
          background: "rgba(0,0,0,0.85)",
          backdropFilter: "blur(10px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1000,
          padding: "20px"
        }}>
          <div style={{
            background: "#111",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: "24px",
            width: "100%",
            maxWidth: "500px",
            padding: "32px",
            position: "relative"
          }}>
            <button 
              onClick={() => setShowModal(false)}
              style={{ position: "absolute", top: "20px", right: "20px", background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer" }}
            >
              <X size={20} />
            </button>

            <h4 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.5rem", color: "white", marginBottom: "24px" }}>New Identity</h4>
            
            <div style={{ marginBottom: "20px" }}>
                <label style={{ fontSize: "10px", textTransform: "uppercase", color: "var(--accent)", marginBottom: "8px", display: "block" }}>Brand Details</label>
                <div style={{ position: "relative" }}>
                   <Building2 size={16} style={{ position: "absolute", left: "14px", top: "14px", color: "rgba(255,255,255,0.2)" }} />
                   <input 
                      style={{ ...inputStyle, paddingLeft: "42px" }} 
                      placeholder="Brand Name" 
                      value={formData.brandName} 
                      onChange={e => setFormData({...formData, brandName: e.target.value})} 
                   />
                </div>
                <div style={{ position: "relative" }}>
                   <MapPin size={16} style={{ position: "absolute", left: "14px", top: "14px", color: "rgba(255,255,255,0.2)" }} />
                   <textarea 
                      style={{ ...inputStyle, paddingLeft: "42px", minHeight: "80px", resize: "none" }} 
                      placeholder="Business Address" 
                      value={formData.brandAddress} 
                      onChange={e => setFormData({...formData, brandAddress: e.target.value})} 
                   />
                </div>
            </div>

            <div style={{ marginBottom: "20px" }}>
                <label style={{ fontSize: "10px", textTransform: "uppercase", color: "var(--accent)", marginBottom: "8px", display: "block" }}>Contact Info</label>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                   <div style={{ position: "relative" }}>
                      <Phone size={16} style={{ position: "absolute", left: "14px", top: "14px", color: "rgba(255,255,255,0.2)" }} />
                      <input 
                        style={{ ...inputStyle, paddingLeft: "42px" }} 
                        placeholder="Phone" 
                        value={formData.brandPhone} 
                        onChange={e => setFormData({...formData, brandPhone: e.target.value})} 
                      />
                   </div>
                   <div style={{ position: "relative" }}>
                      <Mail size={16} style={{ position: "absolute", left: "14px", top: "14px", color: "rgba(255,255,255,0.2)" }} />
                      <input 
                        style={{ ...inputStyle, paddingLeft: "42px" }} 
                        placeholder="Email" 
                        value={formData.brandEmail} 
                        onChange={e => setFormData({...formData, brandEmail: e.target.value})} 
                      />
                   </div>
                </div>
            </div>

            <div style={{ marginBottom: "32px" }}>
                <label style={{ fontSize: "10px", textTransform: "uppercase", color: "var(--accent)", marginBottom: "8px", display: "block" }}>Tax Identifiers</label>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                   <div style={{ position: "relative" }}>
                      <CreditCard size={16} style={{ position: "absolute", left: "14px", top: "14px", color: "rgba(255,255,255,0.2)" }} />
                      <input 
                        style={{ ...inputStyle, paddingLeft: "42px" }} 
                        placeholder="GST (Optional)" 
                        value={formData.gstNumber} 
                        onChange={e => setFormData({...formData, gstNumber: e.target.value})} 
                      />
                   </div>
                   <div style={{ position: "relative" }}>
                      <CreditCard size={16} style={{ position: "absolute", left: "14px", top: "14px", color: "rgba(255,255,255,0.2)" }} />
                      <input 
                        style={{ ...inputStyle, paddingLeft: "42px" }} 
                        placeholder="PAN (Optional)" 
                        value={formData.panNumber} 
                        onChange={e => setFormData({...formData, panNumber: e.target.value})} 
                      />
                   </div>
                </div>
            </div>

            <button 
                onClick={handleCreateProfile}
                disabled={isSaving}
                className="btn btn-primary"
                style={{ width: "100%", padding: "16px", borderRadius: "12px", fontWeight: 700 }}
            >
                {isSaving ? "Saving..." : "Create Business Profile"}
            </button>
          </div>
        </div>
      )}

      {/* Info Box */}
      <div style={{ 
        marginTop: "3rem",
        padding: "1.5rem",
        background: "rgba(var(--accent-rgb), 0.03)",
        borderRadius: "16px",
        border: "1px solid rgba(var(--accent-rgb), 0.1)",
        display: "flex",
        gap: "16px"
      }}>
        <Info size={20} color="var(--accent)" style={{ flexShrink: 0 }} />
        <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", lineHeight: 1.6, margin: 0 }}>
          Selecting a profile will automatically populate your brand details, logo, and contact information on the final invoice.
        </p>
      </div>
    </div>
  );
}
