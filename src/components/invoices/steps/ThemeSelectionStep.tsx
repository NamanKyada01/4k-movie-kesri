"use client";

import { useState } from "react";
import { GlobalTheme } from "@/types/invoice";
import { 
  Palette, 
  Check, 
  Monitor, 
  Smartphone, 
  Layout, 
  Sun, 
  Moon, 
  CloudRain, 
  Sunset, 
  Circle,
  Eye
} from "lucide-react";
import { InvoicePreview } from "../invoice-preview";
import { useStepper } from "@/components/ui/Stepper";

interface ThemeSelectionStepProps {
  onNext: (
    theme: GlobalTheme,
    selectedColor: string,
    showLogo: boolean
  ) => void;
}

const PRESET_COLORS = [
  { name: "Saffron", value: "#E8550A" },
  { name: "Gold",    value: "#C9A84C" },
  { name: "Sky",     value: "#0ea5e9" },
  { name: "Purple",  value: "#8b5cf6" },
  { name: "Emerald", value: "#10b981" },
  { name: "Noir",    value: "#222222" },
];

const STATIC_THEMES: GlobalTheme[] = [
  { id: "modern", name: "Modern Cinematic", layoutType: "modern", createdAt: Date.now() },
];

const dummyBusinessProfile = {
  brandName: "4K Movie Kesri",
  brandAddress: "Surat, Gujarat, India",
  brandEmail: "hello@4kmoviekesri.com",
};

const dummyInvoice = {
  invoiceNumber: "INV-PREVIEW",
  date: Date.now(),
  customerName: "Valued Client",
  items: [
    { id: "1", description: "Cinematic Event Coverage", quantity: 1, rate: 25000, amount: 25000, duration: 1 },
    { id: "2", description: "Post-Production (4K Editing)", quantity: 1, rate: 15000, amount: 15000, duration: 1 },
  ],
  subtotal: 40000,
  total: 40000,
};

export function ThemeSelectionStep({ onNext }: ThemeSelectionStepProps) {
  const { nextStep } = useStepper();
  const [selectedThemeId, setSelectedThemeId] = useState<string>(STATIC_THEMES[0].id);
  const [selectedColor, setSelectedColor] = useState<string>(PRESET_COLORS[0].value);
  const [showLogo, setShowLogo] = useState(true);

  const handleContinue = () => {
    const theme = STATIC_THEMES.find((t) => t.id === selectedThemeId);
    if (theme) {
      onNext(theme, selectedColor, showLogo);
      nextStep();
    }
  };

  return (
    <div className="animate-fade-up max-w-[1400px] mx-auto px-6">
      {/* Step Header */}
      <div className="text-center mb-24 lg:mb-32">
        <div className="inline-flex items-center gap-4 text-accent bg-accent/5 px-8 py-3 rounded-full mb-10 border border-accent/10 shadow-[0_0_20px_rgba(232,85,10,0.05)]">
          <Palette size={22} />
          <span className="text-xs font-black uppercase tracking-[0.3em]">Phase 01: Visual Identity</span>
        </div>
        <h2 className="text-5xl lg:text-7xl font-black uppercase tracking-tighter mb-8 leading-none text-white">Your Cinematic Brand</h2>
        <p className="text-muted text-lg max-w-2xl mx-auto leading-relaxed">Define the aesthetic of your studio&apos;s financial documents. Choose a core theme and signature accent color for your high-fidelity exports.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-24 items-start">
        {/* Settings Panel */}
        <div className="lg:col-span-12 xl:col-span-5 space-y-16">
          
          {/* Accent Color Section */}
          <section className="space-y-10">
            <div className="flex items-center gap-6">
              <span className="w-12 h-[1px] bg-accent/30"></span>
              <h3 className="text-xs font-black uppercase tracking-[0.2em] text-muted/60">Signature Accent</h3>
            </div>
            
            <div className="card !p-12 !rounded-[2.5rem] bg-black/40 border-white/5 backdrop-blur-md shadow-2xl">
              <div className="flex flex-wrap gap-6">
                {PRESET_COLORS.map((color) => (
                  <button
                    key={color.value}
                    type="button"
                    onClick={() => setSelectedColor(color.value)}
                    className={`w-14 h-14 rounded-2xl transition-all flex items-center justify-center border-2 ${
                      selectedColor === color.value ? "scale-110 shadow-2xl" : "border-transparent opacity-30 hover:opacity-100 hover:scale-105"
                    }`}
                    style={{ 
                      backgroundColor: color.value,
                      borderColor: selectedColor === color.value ? "white" : "transparent",
                      boxShadow: selectedColor === color.value ? `0 15px 40px ${color.value}50` : "none"
                    }}
                    title={color.name}
                  >
                    {selectedColor === color.value && <Check size={24} className="text-white drop-shadow-md" strokeWidth={3} />}
                  </button>
                ))}
              </div>
              
              <div className="mt-12 pt-10 border-t border-white/5">
                 <label className="flex items-center gap-6 cursor-pointer group">
                   <div className={`w-8 h-8 rounded-xl border-2 transition-all flex items-center justify-center ${showLogo ? 'bg-accent border-accent shadow-lg shadow-accent/20' : 'border-white/10 hover:border-accent'}`}>
                     {showLogo && <Check size={18} className="text-white" strokeWidth={3} />}
                   </div>
                   <input 
                     type="checkbox" 
                     className="hidden" 
                     checked={showLogo} 
                     onChange={(e) => setShowLogo(e.target.checked)}
                   />
                   <div className="flex flex-col gap-1">
                     <span className="text-base font-black text-white tracking-tight group-hover:text-accent transition-colors">Include Studio Branding</span>
                     <span className="text-xs text-muted/60 font-medium font-body uppercase tracking-[0.05em]">Feature your uploaded logo on the generated PDF</span>
                   </div>
                 </label>
              </div>
            </div>
          </section>

          {/* Layout Selection Section */}
          <section className="space-y-10">
            <div className="flex items-center gap-6">
              <span className="w-12 h-[1px] bg-accent/30"></span>
              <h3 className="text-xs font-black uppercase tracking-[0.2em] text-muted/60">Template Layout</h3>
            </div>
            
            <div className="grid grid-cols-1 gap-6">
              {STATIC_THEMES.map((theme) => (
                <div
                  key={theme.id}
                  onClick={() => setSelectedThemeId(theme.id)}
                  className={`group p-8 rounded-3xl border-2 transition-all cursor-pointer flex items-center justify-between ${
                    selectedThemeId === theme.id 
                      ? "border-accent bg-accent/5 shadow-2xl shadow-accent/10 scale-[1.02]" 
                      : "border-white/5 bg-black/40 hover:border-white/20"
                  }`}
                >
                  <div className="flex items-center gap-8">
                    <div className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-all ${selectedThemeId === theme.id ? 'bg-accent text-white shadow-xl shadow-accent/20' : 'bg-white/5 text-muted group-hover:bg-white/10'}`}>
                      <Layout size={28} />
                    </div>
                    <div>
                      <h4 className={`font-black text-xl uppercase tracking-tighter transition-colors ${selectedThemeId === theme.id ? 'text-white' : 'text-muted'}`}>{theme.name}</h4>
                      <p className="text-[0.65rem] text-muted/40 font-bold uppercase tracking-widest mt-1">{theme.layoutType} Editorial Format</p>
                    </div>
                  </div>
                  <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all ${selectedThemeId === theme.id ? 'bg-accent border-accent shadow-lg' : 'border-white/10'}`}>
                    {selectedThemeId === theme.id && <Check size={18} className="text-white" strokeWidth={3} />}
                  </div>
                </div>
              ))}
            </div>
          </section>

          <div className="pt-12">
            <button onClick={handleContinue} className="btn btn-primary btn-xl w-full !rounded-[2rem] group py-8 shadow-3xl shadow-accent/20">
              <span className="text-lg font-black uppercase tracking-widest">Next Dimension: Configuration</span>
              <Check className="ml-4 opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all" size={24} strokeWidth={3} />
            </button>
          </div>
        </div>

        {/* Live Preview Panel */}
        <div className="lg:col-span-12 xl:col-span-7 xl:sticky xl:top-24">
          <div className="card !p-0 bg-[#050505] border-white/5 overflow-hidden shadow-[0_40px_100px_rgba(0,0,0,0.8)] !rounded-[3rem]">
            <div className="bg-white/[0.03] px-12 py-8 border-b border-white/5 flex items-center justify-between">
               <div className="flex items-center gap-4">
                 <div className="w-2.5 h-2.5 rounded-full bg-accent animate-pulse shadow-[0_0_15px_rgba(232,85,10,0.8)]"></div>
                 <span className="text-[0.75rem] font-black uppercase tracking-[0.4em] text-white/50">Master Dynamic Preview</span>
               </div>
               <div className="flex items-center gap-6">
                 <div className="h-6 w-[1px] bg-white/10 hidden sm:block"></div>
                 <span className="text-[0.65rem] text-muted/40 font-mono tracking-widest hidden sm:block uppercase">Reference Layer 01</span>
                 <span className="text-[0.6rem] text-accent/60 font-black tracking-[0.2em] uppercase bg-accent/5 px-3 py-1 rounded-md border border-accent/10">15.4" Engine</span>
               </div>
            </div>
            
            <div className="p-16 lg:p-24 flex justify-center bg-[radial-gradient(circle_at_center,rgba(232,85,10,0.05)_0%,transparent_70%)] relative">
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')] opacity-10 pointer-events-none"></div>
              <div className="scale-[0.55] md:scale-[0.75] lg:scale-[0.9] origin-center transform-gpu shadow-[0_50px_100px_rgba(0,0,0,0.9)] rounded-[2px] ring-1 ring-white/10 overflow-hidden bg-white">
                 <InvoicePreview
                   theme={{
                     ...STATIC_THEMES[0],
                     primaryColor: selectedColor,
                   }}
                   businessProfile={{ ...dummyBusinessProfile, showLogo }}
                   invoice={dummyInvoice}
                 />
              </div>
            </div>

            <div className="bg-white/[0.02] py-8 border-t border-white/5 text-center">
              <p className="text-[0.65rem] text-muted/40 font-black uppercase tracking-[0.4em]">Cinematic Simulation — Version 2.0</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
