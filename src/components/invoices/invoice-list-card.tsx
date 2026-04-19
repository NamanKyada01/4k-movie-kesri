"use client";

import { useRef, useState } from "react";
import { Invoice } from "@/types/invoice";
import { FileText, Printer, Maximize2, Calendar, User, IndianRupee } from "lucide-react";
import { format } from "date-fns";
import { InvoicePreview } from "./invoice-preview";
import { useReactToPrint } from "react-to-print";
import { SpotlightCard } from "@/components/ui/SpotlightCard";
import { motion, AnimatePresence } from "framer-motion";

interface InvoiceListCardProps {
  invoice: Invoice;
}

export function InvoiceListCard({ invoice }: InvoiceListCardProps) {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const componentRef = useRef<HTMLDivElement>(null);

  const handlePrint = useReactToPrint({
    contentRef: componentRef,
    documentTitle: `Invoice-${invoice.invoiceNumber}`,
  });

  return (
    <>
      <SpotlightCard 
        className="card group cursor-pointer h-full flex flex-col !p-0 overflow-hidden"
        spotlightColor="rgba(232, 85, 10, 0.08)"
        onClick={() => setIsPreviewOpen(true)}
      >
        <div className="flex flex-row h-full">
          {/* Thumbnail Section */}
          <div className="w-[120px] sm:w-[150px] shrink-0 bg-neutral-900 border-r border-white/5 relative overflow-hidden flex items-center justify-center p-2 isolate min-h-[160px]">
             <div
                className="absolute top-2 left-2 z-0 bg-white shadow-sm ring-1 ring-black/10 origin-top-left flex pointer-events-none opacity-80 group-hover:opacity-100 transition-opacity"
                style={{
                  transform: "scale(0.12)",
                  width: "210mm",
                  minHeight: "297mm",
                }}
              >
                {invoice.businessDetails && invoice.themeDetails ? (
                  <InvoicePreview
                    invoice={invoice}
                    businessProfile={invoice.businessDetails}
                    theme={invoice.themeDetails}
                  />
                ) : (
                  <div className="flex-1 flex items-center justify-center bg-neutral-950">
                    <FileText className="w-40 h-40 text-neutral-800" />
                  </div>
                )}
              </div>
              <div className="absolute inset-0 z-10 bg-gradient-to-tr from-black/20 to-transparent group-hover:bg-black/0 transition-all" />
              <div className="absolute bottom-2 right-2 z-20 w-8 h-8 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center border border-white/10 opacity-0 group-hover:opacity-100 transition-all scale-75 group-hover:scale-100">
                 <Maximize2 size={12} className="text-accent" />
              </div>
          </div>

          {/* Details Section */}
          <div className="flex-1 p-5 flex flex-col justify-between min-w-0">
            <div>
              <div className="flex justify-between items-start mb-1">
                <span className="text-[0.6rem] font-black text-accent uppercase tracking-widest">{invoice.invoiceNumber}</span>
                <span className="text-[0.6rem] font-bold text-muted uppercase tracking-[0.1em]">{format(invoice.date, "MMM dd, yyyy")}</span>
              </div>
              
              <h3 className="text-lg font-black text-white truncate mb-4 uppercase tracking-tighter leading-tight" title={invoice.customerName}>
                {invoice.customerName}
              </h3>

              <div className="flex items-center gap-2 mb-2">
                 <div className="w-5 h-5 rounded-full bg-accent/10 flex items-center justify-center text-accent">
                    <IndianRupee size={10} strokeWidth={3} />
                 </div>
                 <p className="text-2xl font-black text-white tracking-tighter">
                   {invoice.total.toLocaleString()}
                 </p>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-white/5">
               <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
                  <span className="text-[0.55rem] font-bold text-muted uppercase tracking-widest">Archived</span>
               </div>
               <button 
                onClick={(e) => { e.stopPropagation(); handlePrint(); }}
                className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-muted hover:text-white transition-all border border-transparent hover:border-white/10"
               >
                 <Printer size={14} />
               </button>
            </div>
          </div>
        </div>
      </SpotlightCard>

      {/* Cinematic Modal (AnimatePresence) */}
      <AnimatePresence>
        {isPreviewOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-10 pointer-events-none">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsPreviewOpen(false)}
              className="absolute inset-0 bg-black/90 backdrop-blur-xl pointer-events-auto"
            />
            
            <motion.div
              layoutId={`invoice-${invoice.id}`}
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-6xl max-h-full bg-neutral-900 rounded-[2rem] border border-white/10 shadow-2xl overflow-hidden flex flex-col pointer-events-auto"
            >
              {/* Modal Header */}
              <div className="p-6 border-b border-white/5 flex justify-between items-center bg-black/20 backdrop-blur-md">
                <div>
                  <div className="flex items-center gap-3">
                    <h2 className="text-xl font-black uppercase tracking-tighter text-white">{invoice.invoiceNumber}</h2>
                    <span className="badge badge-accent">Production Quality</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1 font-medium tracking-wide">{invoice.customerName} • {format(invoice.date, "PPP")}</p>
                </div>
                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => handlePrint()}
                    className="btn btn-primary !py-2.5 !px-6 shadow-xl shadow-accent/20"
                  >
                    <Printer size={16} className="mr-2" /> Download Document
                  </button>
                  <button 
                    onClick={() => setIsPreviewOpen(false)}
                    className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-white/5 transition-colors"
                  >
                    <span className="sr-only">Close</span>
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M15 5L5 15M5 5L15 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                </div>
              </div>

              {/* Modal Body (Scrollable) */}
              <div className="flex-1 overflow-auto bg-[#1a1a1a] p-6 md:p-12 custom-scrollbar">
                <div className="max-w-fit mx-auto shadow-[0_0_100px_rgba(0,0,0,0.5)] rounded-sm overflow-hidden">
                  {invoice.businessDetails && invoice.themeDetails ? (
                    <InvoicePreview
                      ref={componentRef}
                      invoice={invoice}
                      businessProfile={invoice.businessDetails}
                      theme={invoice.themeDetails}
                    />
                  ) : (
                    <div className="bg-white p-20 text-center text-neutral-800">
                      <FileText size={64} className="mx-auto mb-4 opacity-10" />
                      <p className="font-bold">Missing Layout Engine Data</p>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
