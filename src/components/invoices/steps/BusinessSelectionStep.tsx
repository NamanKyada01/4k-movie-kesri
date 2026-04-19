"use client";

import { useState, useEffect } from "react";
import { BusinessProfile, GlobalTheme } from "@/types/invoice";
import {
  getBusinessProfiles,
  saveBusinessProfile,
  deleteBusinessProfile,
} from "@/actions/invoice";
import { auth } from "@/lib/firebase";
import { toast } from "sonner";
import {
  Loader2,
  Plus,
  Trash2,
  Edit2,
  Check,
  Building2,
  Upload,
} from "lucide-react";
import { InvoicePreview } from "../invoice-preview";
import { useStepper } from "@/components/ui/Stepper";

interface BusinessSelectionStepProps {
  onNext: (profile: BusinessProfile) => void;
  onBack?: () => void;
  selectedTheme: GlobalTheme;
  showLogo: boolean;
}

export function BusinessSelectionStep({
  onNext,
  onBack,
  selectedTheme,
  showLogo,
}: BusinessSelectionStepProps) {
  const { nextStep, prevStep } = useStepper();
  const [loading, setLoading] = useState(true);
  const [profiles, setProfiles] = useState<BusinessProfile[]>([]);
  const [selectedProfileId, setSelectedProfileId] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editingProfile, setEditingProfile] = useState<Partial<BusinessProfile>>({
    brandName: "",
    brandAddress: "",
    brandEmail: "",
    brandPhone: "",
    selectedThemeId: selectedTheme.id,
  });
  const [isUploading, setIsUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  const fetchProfiles = async () => {
    if (auth.currentUser) {
      setLoading(true);
      const res = await getBusinessProfiles(auth.currentUser.uid);
      if (res.success && res.profiles) {
        setProfiles(res.profiles);
        if (res.profiles.length > 0 && !selectedProfileId) {
          setSelectedProfileId(res.profiles[0].id);
        }
      }
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfiles();
  }, []);

  const handleAddNew = () => {
    setEditingProfile({
      brandName: "",
      brandAddress: "",
      brandEmail: "",
      brandPhone: "",
      selectedThemeId: selectedTheme.id,
    });
    setIsEditing(true);
    setSelectedProfileId(null);
  };

  const handleEdit = (profile: BusinessProfile) => {
    setEditingProfile(profile);
    setIsEditing(true);
  };

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm("Delete this cinematic business profile?")) return;
    if (auth.currentUser) {
      const res = await deleteBusinessProfile(auth.currentUser.uid, id);
      if (res.success) {
        toast.success("Profile archived");
        fetchProfiles();
        if (selectedProfileId === id) setSelectedProfileId(null);
      }
    }
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setIsUploading(true);
      
      try {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("folder", "invoice-logos");

        const res = await fetch("/api/admin/upload", {
          method: "POST",
          body: formData,
        });

        const data = await res.json();
        if (res.ok && data.results?.[0]) {
          setEditingProfile(prev => ({ ...prev, logoUrl: data.results[0].secure_url }));
          toast.success("Logo uploaded successfully");
        } else {
          throw new Error(data.error || "Upload failed");
        }
      } catch (err: any) {
        toast.error(err.message);
      } finally {
        setIsUploading(false);
      }
    }
  };

  const handleSave = async () => {
    if (!auth.currentUser) return;
    if (!editingProfile.brandName) return toast.error("Brand Name is required");

    setSaving(true);
    const res = await saveBusinessProfile(auth.currentUser.uid, editingProfile as BusinessProfile);

    if (res.success) {
      toast.success("Business profile saved");
      setIsEditing(false);
      fetchProfiles();
    } else {
      toast.error("Failed to save profile");
    }
    setSaving(false);
  };

  const handleContinue = () => {
    const profile = profiles.find((p) => p.id === selectedProfileId);
    if (profile) {
      onNext(profile);
      nextStep();
    } else {
      toast.error("Please select a studio profile");
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center py-20">
      <Loader2 className="animate-spin text-accent mb-4" size={40} />
      <p className="text-muted text-sm font-medium">Synchronizing Studio Profiles...</p>
    </div>
  );

  if (isEditing) {
    return (
      <div className="animate-fade-up max-w-[1400px] mx-auto pb-40 px-6">
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-24 items-start">
          <div className="xl:col-span-12 2xl:col-span-12 lg:col-span-12 xl:col-span-7 space-y-16">
            <div className="flex items-center justify-between border-b border-white/5 pb-10">
               <div className="space-y-3">
                 <div className="inline-flex items-center gap-4 text-gold bg-gold/5 px-6 py-2 rounded-full border border-gold/10">
                    <Building2 size={18} />
                    <span className="text-xs font-black uppercase tracking-[0.3em]">Phase 03: Registry Editor</span>
                 </div>
                 <h3 className="text-5xl font-black uppercase tracking-tighter text-white">Studio Identity Profile</h3>
               </div>
               <button onClick={() => setIsEditing(false)} className="text-[0.7rem] font-black uppercase tracking-[0.3em] text-muted/60 hover:text-white transition-colors border-b border-white/5 pb-1">Discard Changes</button>
            </div>
            
            <div className="card !p-16 bg-black/40 border-white/5 backdrop-blur-lg shadow-3xl space-y-16 !rounded-[3rem]">
              {/* Logo Section */}
              <section className="space-y-8">
                <label className="text-xs font-black text-muted/40 uppercase tracking-[0.4em] pl-2">Visual Trademark (Logo)</label>
                <div className="flex flex-col md:flex-row items-center gap-12">
                  <div className="w-48 h-48 rounded-[2.5rem] border-2 border-dashed border-white/10 overflow-hidden bg-white/5 flex items-center justify-center relative group/logo shadow-inner transition-all hover:border-accent/40 hover:bg-accent/5">
                    {editingProfile.logoUrl ? (
                      <img src={editingProfile.logoUrl} alt="Logo" className="w-full h-full object-contain p-8 transition-transform group-hover/logo:scale-110 duration-700" />
                    ) : (
                      <Upload className="text-muted/20 group-hover/logo:text-accent transition-colors" size={48} />
                    )}
                    <input type="file" onChange={handleLogoUpload} className="absolute inset-0 opacity-0 cursor-pointer" accept="image/*" disabled={isUploading} />
                    {isUploading && <div className="absolute inset-0 bg-black/90 flex items-center justify-center backdrop-blur-md transition-all"><Loader2 className="animate-spin text-accent" size={40} /></div>}
                  </div>
                  <div className="flex-1 space-y-4">
                    <p className="text-xl font-black text-white tracking-tighter uppercase">Master Asset Authority</p>
                    <p className="text-sm text-muted/60 leading-relaxed max-w-sm">Upload your studio&apos;s high-resolution brand mark. PNG or SVG preferred for transparent cinematic overlays on archival documents.</p>
                  </div>
                </div>
              </section>

              {/* Identity Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
                <div className="space-y-4">
                  <label className="text-xs font-black text-muted/40 uppercase tracking-[0.4em] pl-2">Production House Designation</label>
                  <input 
                    value={editingProfile.brandName}
                    onChange={e => setEditingProfile({...editingProfile, brandName: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-[1.5rem] px-8 py-5 text-white focus:border-accent transition-all outline-none font-black text-lg placeholder:opacity-5 placeholder:text-white/40"
                    placeholder="e.g. 4K Movie Kesri"
                  />
                </div>

                <div className="space-y-4">
                  <label className="text-xs font-black text-muted/40 uppercase tracking-[0.4em] pl-2">Global HQ Base Address</label>
                  <input 
                    value={editingProfile.brandAddress}
                    onChange={e => setEditingProfile({...editingProfile, brandAddress: e.target.value})}
                    className="w-full bg-white/5 border border-white/5 rounded-[1.5rem] px-8 py-5 text-white focus:border-accent transition-all outline-none font-black text-lg placeholder:opacity-5 placeholder:text-white"
                    placeholder="Physical Location"
                  />
                </div>

                <div className="space-y-4">
                  <label className="text-xs font-black text-muted/40 uppercase tracking-[0.4em] pl-2">Digital Mail Protocol</label>
                  <input 
                    type="email"
                    value={editingProfile.brandEmail}
                    onChange={e => setEditingProfile({...editingProfile, brandEmail: e.target.value})}
                    className="w-full bg-white/5 border border-white/5 rounded-[1.5rem] px-8 py-5 text-white focus:border-accent transition-all outline-none font-black text-lg placeholder:opacity-5 placeholder:text-white"
                    placeholder="studio@mail.com"
                  />
                </div>

                <div className="space-y-4">
                  <label className="text-xs font-black text-muted/40 uppercase tracking-[0.4em] pl-2">Secure Communication Line</label>
                  <input 
                    type="tel"
                    value={editingProfile.brandPhone}
                    onChange={e => setEditingProfile({...editingProfile, brandPhone: e.target.value})}
                    className="w-full bg-white/5 border border-white/5 rounded-[1.5rem] px-8 py-5 text-white focus:border-accent transition-all outline-none font-black text-lg placeholder:opacity-5 placeholder:text-white"
                    placeholder="+91 ..."
                  />
                </div>
              </div>
            </div>

            <div className="flex flex-col md:flex-row gap-6 pt-10">
              <button 
                onClick={handleSave} 
                disabled={saving} 
                className="flex-[2] py-8 bg-accent rounded-[2rem] text-white font-black uppercase tracking-[0.3em] text-[0.8rem] shadow-3xl shadow-accent/30 transition-all hover:translate-y-[-2px] hover:shadow-accent/40 active:translate-y-0 flex items-center justify-center gap-4"
              >
                {saving ? <Loader2 className="animate-spin" size={24} /> : <Check size={24} strokeWidth={3} />}
                Lock Registry Profile
              </button>
            </div>
          </div>

          <div className="hidden xl:flex xl:col-span-12 2xl:col-span-5 flex-col items-center sticky top-32">
             <div className="bg-[#080808] rounded-[2.5rem] border border-white/5 p-1 flex flex-col items-center overflow-hidden shadow-2xl w-full">
                <div className="w-full bg-white/5 px-8 py-5 flex items-center justify-between border-b border-white/5">
                   <div className="flex items-center gap-3">
                      <div className="w-2.5 h-2.5 rounded-full bg-gold animate-pulse"></div>
                      <span className="text-[0.65rem] font-black uppercase tracking-[0.2em] text-muted">Trademark Verification</span>
                   </div>
                </div>
                <div className="p-12 lg:p-16 w-full flex justify-center bg-[radial-gradient(circle_at_center,rgba(201,168,76,0.03)_0%,transparent_70%)]">
                   <div className="scale-[0.4] xl:scale-[0.5] origin-top transform-gpu shadow-2xl rounded-sm ring-1 ring-white/10">
                      <InvoicePreview 
                        theme={selectedTheme}
                        businessProfile={{ ...editingProfile, showLogo } as BusinessProfile}
                        invoice={{}}
                      />
                   </div>
                </div>
             </div>
          </div>
        </div>
      </div>
    );
  }

  const selectedProfile = profiles.find(p => p.id === selectedProfileId);

  return (
    <div className="animate-fade-up max-w-[1400px] mx-auto px-6 pb-40">
      {/* Header */}
      <div className="text-center mb-24">
        <div className="inline-flex items-center gap-4 text-accent bg-accent/5 px-8 py-3 rounded-full mb-10 border border-accent/10 shadow-[0_0_20px_rgba(232,85,10,0.05)]">
          <Building2 size={22} />
          <span className="text-xs font-black uppercase tracking-[0.3em]">Phase 03: Studio Archive</span>
        </div>
        <h2 className="text-5xl lg:text-7xl font-black uppercase tracking-tighter mb-8 leading-none text-white">Select Production House</h2>
        <p className="text-muted text-lg max-w-2xl mx-auto leading-relaxed">Choose an existing studio profile or create a new cinematic identity for this archival document.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
        {/* New Profile Card */}
        <div 
          onClick={handleAddNew}
          className="group card border-2 border-dashed border-white/10 bg-black/40 hover:border-accent/60 hover:bg-accent/[0.05] flex flex-col items-center justify-center py-24 !rounded-[3rem] cursor-pointer transition-all duration-700 shadow-3xl"
        >
          <div className="w-24 h-24 bg-white/10 rounded-3xl flex items-center justify-center mb-8 border border-white/10 group-hover:scale-110 group-hover:bg-accent group-hover:text-white transition-all duration-700 shadow-2xl">
            <Plus size={40} strokeWidth={3} />
          </div>
          <h4 className="font-black text-2xl uppercase tracking-tighter text-white/50 group-hover:text-white transition-colors">New Identity</h4>
          <p className="text-[0.65rem] font-black uppercase tracking-[0.3em] text-accent mt-3 opacity-60">Initialize Studio Base</p>
        </div>

        {/* Existing Profiles */}
        {profiles.map(profile => (
          <div 
            key={profile.id}
            onClick={() => setSelectedProfileId(profile.id)}
            className={`group card relative overflow-hidden cursor-pointer transition-all duration-700 border-2 !p-12 !rounded-[3rem] shadow-3xl ${
              selectedProfileId === profile.id 
                ? "border-accent bg-accent/[0.05] shadow-accent/20 translate-y-[-10px] scale-[1.03]" 
                : "border-white/10 bg-black/40 hover:border-accent/30 hover:bg-white/[0.04]"
            }`}
          >
            <div className="flex flex-col items-center text-center gap-10">
              <div className="w-32 h-32 bg-white/[0.03] rounded-[2rem] border border-white/10 flex items-center justify-center overflow-hidden shrink-0 shadow-3xl group-hover:scale-105 transition-all duration-700">
                {profile.logoUrl ? (
                  <img src={profile.logoUrl} alt="Logo" className="w-full h-full object-contain p-6" />
                ) : (
                  <Building2 className="text-white/20" size={48} />
                )}
              </div>
              <div className="flex-1 w-full flex flex-col items-center">
                <h4 className="font-black text-2xl lg:text-3xl uppercase tracking-tighter text-white truncate w-full mb-3">{profile.brandName}</h4>
                <div className="space-y-2 flex flex-col items-center w-full">
                  <div className="text-[0.65rem] font-black text-white/50 uppercase tracking-[0.3em] flex items-center gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-accent"></div>
                    {profile.brandEmail || "SECURE-MAIL-UNKNOWN"}
                  </div>
                  <div className="text-[0.65rem] font-black text-white/50 uppercase tracking-[0.3em] flex items-center gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-accent"></div>
                    {profile.brandPhone || "COMM-LINE-NONE"}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 mt-10 pt-6 border-t border-white/5 opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-500">
              <button 
                onClick={(e) => { e.stopPropagation(); handleEdit(profile); }} 
                className="flex-1 btn btn-ghost !py-3 !rounded-xl !text-xs !bg-white/5 hover:!bg-white/10"
              >
                <Edit2 size={14} className="mr-2" /> Modify Profile
              </button>
              <button 
                onClick={(e) => handleDelete(profile.id, e)}
                className="p-3 text-muted hover:text-error transition-all hover:bg-error/10 rounded-xl"
              >
                <Trash2 size={16} />
              </button>
            </div>

            {selectedProfileId === profile.id && (
              <div className="absolute top-4 right-4 w-8 h-8 bg-accent rounded-full flex items-center justify-center shadow-lg animate-fade-in ring-4 ring-accent/20">
                <Check size={18} className="text-white" />
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-32 flex flex-col md:flex-row items-center gap-8 bg-black/40 p-12 rounded-[3.5rem] border border-white/5 backdrop-blur-xl shadow-3xl">
        <button 
          onClick={prevStep} 
          className="flex-1 btn btn-ghost !p-8 !rounded-[2rem] border-white/5 hover:bg-white/5 uppercase font-black tracking-widest text-xs"
        >
          Return to Dimension 02
        </button>
        <button 
          onClick={handleContinue} 
          disabled={!selectedProfileId}
          className="flex-[2] btn btn-primary !p-8 !rounded-[2rem] shadow-3xl shadow-accent/30 disabled:opacity-5 uppercase font-black tracking-widest text-xs"
        >
          Initialize Final Particulars
        </button>
      </div>
    </div>
  );
}
