"use client";

import { useRef, useState } from "react";
import { Invoice, BusinessProfile, GlobalTheme } from "@/types/invoice";
import { ArrowLeft, Printer, Save, Loader2, CheckCircle2 } from "lucide-react";
import { InvoicePreview } from "../invoice-preview";
import { useReactToPrint } from "react-to-print";
import { saveInvoice } from "@/actions/invoice";
import { auth } from "@/lib/firebase";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useStepper } from "@/components/ui/Stepper";

interface InvoicePreviewStepProps {
  invoice: Invoice;
  businessProfile: BusinessProfile;
  theme: GlobalTheme;
  onBack: () => void;
}

export function InvoicePreviewStep({
  invoice,
  businessProfile,
  theme,
  onBack,
}: InvoicePreviewStepProps) {
  const { prevStep } = useStepper();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const componentRef = useRef<HTMLDivElement>(null);

  const handlePrint = useReactToPrint({
    contentRef: componentRef,
    documentTitle: `Invoice-${invoice.invoiceNumber}`,
  });

  const handleSave = async () => {
    if (!auth.currentUser) return toast.error("Please login to save invoices.");

    setLoading(true);
    try {
      const { id, ...dataToSave } = invoice;
      
      const invoiceData = {
        ...dataToSave,
        businessDetails: businessProfile,
        themeDetails: theme,
      };

      const res = await saveInvoice(auth.currentUser.uid, invoiceData as any);
      if (res.success) {
        toast.success("Invoice archived in the vault");
        setIsSaved(true);
      } else {
        toast.error("Failed to save invoice");
      }
    } catch (error) {
      toast.error("Something went wrong");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (isSaved) {
    return (
      <div className="animate-fade-up flex flex-col items-center justify-center py-40 text-center px-6">
        <div className="w-32 h-32 bg-success/5 rounded-[2.5rem] flex items-center justify-center mb-12 text-success shadow-[0_20px_50px_rgba(16,185,129,0.1)] border border-success/10 animate-pulse-glow">
          <CheckCircle2 size={56} strokeWidth={3} />
        </div>
        <h2 className="text-5xl lg:text-7xl font-black uppercase tracking-tighter mb-6 text-white">Registry Secured</h2>
        <p className="text-muted text-xl max-w-xl mb-16 leading-relaxed">Your cinematic invoice has been successfully archived in the master vault. You may now initiate the high-fidelity PDF export or return to operations.</p>
        
        <div className="flex flex-col sm:flex-row gap-6 w-full max-w-2xl">
           <button onClick={() => handlePrint()} className="flex-1 btn btn-ghost !p-8 !rounded-[2rem] border-white/5 uppercase font-black tracking-widest text-xs">
             <Printer size={20} className="mr-3" /> Forge PDF Master
           </button>
           <button onClick={() => router.push("/admin/dashboard")} className="flex-1 btn btn-primary !p-8 !rounded-[2rem] shadow-3xl shadow-accent/20 uppercase font-black tracking-widest text-xs">
             Return to Dashboard
           </button>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-up max-w-[1400px] mx-auto pb-40 px-6">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-12 mb-24 border-b border-white/5 pb-16">
        <div className="space-y-4">
          <div className="inline-flex items-center gap-3 text-gold bg-gold/5 px-6 py-2 rounded-full border border-gold/10">
            <CheckCircle2 size={20} />
            <span className="text-xs font-black uppercase tracking-[0.3em]">Phase 05: Quality Assurance</span>
          </div>
          <h2 className="text-5xl lg:text-7xl font-black uppercase tracking-tighter leading-none text-white">Document Master</h2>
          <p className="text-muted text-lg max-w-2xl leading-relaxed">Final review of your cinematic document master. Every pixel represents your studio&apos;s professional standard and archival integrity.</p>
        </div>
        
        <div className="flex flex-wrap gap-6 w-full lg:w-auto">
          <button
            onClick={() => handlePrint()}
            className="flex-1 lg:flex-none py-6 px-12 bg-white/5 border border-white/10 rounded-[2rem] text-white font-black uppercase tracking-[0.2em] text-[0.7rem] hover:bg-white/10 hover:border-accent transition-all flex items-center justify-center gap-4 group shadow-xl"
          >
            <Printer size={22} className="text-muted group-hover:text-accent transition-colors" />
            <span>Forge PDF Master</span>
          </button>
          
          <button 
            onClick={handleSave} 
            disabled={loading}
            className="flex-1 lg:flex-none py-6 px-16 bg-accent rounded-[2rem] text-white font-black uppercase tracking-[0.3em] text-[0.7rem] shadow-3xl shadow-accent/30 hover:translate-y-[-2px] hover:shadow-accent/40 active:translate-y-0 transition-all flex items-center justify-center gap-4 disabled:opacity-5"
          >
            {loading ? (
              <Loader2 size={22} className="animate-spin" />
            ) : (
              <Save size={22} />
            )}
            <span>Archive to Vault</span>
          </button>
        </div>
      </div>

      {/* Document Canvas */}
      <div className="bg-[#050505] rounded-[4rem] border border-white/5 p-16 md:p-32 lg:p-48 overflow-x-auto min-h-[1000px] flex justify-center items-start shadow-[0_50px_100px_rgba(0,0,0,0.8)] relative group/canvas">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(232,85,10,0.05)_0%,transparent_70%)] opacity-0 group-hover/canvas:opacity-100 transition-opacity duration-1000"></div>
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')] opacity-10 pointer-events-none"></div>
        <div className="relative z-10 shadow-[0_80px_200px_rgba(0,0,0,1)] rounded-[2px] transform-gpu hover:scale-[1.02] transition-transform duration-1000 bg-white ring-1 ring-white/10">
          <InvoicePreview
            ref={componentRef}
            invoice={invoice}
            businessProfile={businessProfile}
            theme={theme}
          />
        </div>
      </div>

      <div className="mt-24 flex justify-center">
        <button 
          onClick={prevStep} 
          className="group flex flex-col items-center gap-4 text-muted/40 hover:text-white transition-all duration-500"
        >
          <div className="w-16 h-16 rounded-full border border-white/5 flex items-center justify-center group-hover:border-accent group-hover:bg-accent/5 group-hover:text-accent transition-all duration-500 shadow-xl group-hover:shadow-accent/20">
            <ArrowLeft size={24} strokeWidth={3} />
          </div>
          <span className="text-[0.65rem] font-black uppercase tracking-[0.4em]">Return to Fine-Tuning Logistics</span>
        </button>
      </div>
    </div>
  );
}
