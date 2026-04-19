"use client";

import { Invoice, InvoiceItem, GlobalTheme, BusinessProfile } from "@/types/invoice";
import { Plus, Trash2, ArrowLeft, Eye } from "lucide-react";
import { InvoicePreview } from "../invoice-preview";
import { useStepper } from "@/components/ui/Stepper";

interface InvoiceDetailsStepProps {
  invoice: Partial<Invoice>;
  businessProfile: BusinessProfile;
  theme: GlobalTheme;
  setInvoice: (invoice: Partial<Invoice>) => void;
  onBack: () => void;
  onNext: () => void;
}

export function InvoiceDetailsStep({
  invoice,
  businessProfile,
  theme,
  setInvoice,
  onBack,
  onNext,
}: InvoiceDetailsStepProps) {
  const { nextStep, prevStep } = useStepper();
  const addItem = () => {
    const newItem: InvoiceItem = {
      id: Date.now().toString(),
      description: "",
      quantity: 1,
      rate: 0,
      duration: 1,
      amount: 0,
      customFields: {},
    };
    setInvoice({
      ...invoice,
      items: [...(invoice.items || []), newItem],
    });
  };

  const removeItem = (id: string) => {
    const updatedItems = invoice.items?.filter((item) => item.id !== id) || [];
    const subtotal = updatedItems.reduce((sum, item) => sum + item.amount, 0);
    setInvoice({
      ...invoice,
      items: updatedItems,
      subtotal,
      total: subtotal,
    });
  };

  const updateItem = (id: string, field: keyof InvoiceItem, value: any) => {
    const updatedItems =
      invoice.items?.map((item) => {
        if (item.id === id) {
          const updatedItem = { ...item, [field]: value };
          updatedItem.amount =
            updatedItem.quantity * updatedItem.rate * updatedItem.duration;
          return updatedItem;
        }
        return item;
      }) || [];

    const subtotal = updatedItems.reduce((sum, item) => sum + item.amount, 0);
    setInvoice({
      ...invoice,
      items: updatedItems,
      subtotal,
      total: subtotal,
    });
  };

  const updateCustomField = (id: string, fieldId: string, value: string) => {
    const updatedItems =
      invoice.items?.map((item) => {
        if (item.id === id) {
          return {
            ...item,
            customFields: { ...(item.customFields || {}), [fieldId]: value },
          };
        }
        return item;
      }) || [];
    setInvoice({ ...invoice, items: updatedItems });
  };

  const handleInputChange = (field: keyof Invoice, value: any) => {
    setInvoice({ ...invoice, [field]: value });
  };

  const isValid =
    invoice.customerName &&
    invoice.invoiceNumber &&
    invoice.items &&
    invoice.items.length > 0;

  const cols = invoice.columns || [
    { id: "description", label: "Description", visible: true, isPermanent: true, isMovable: false },
    { id: "quantity", label: "Qty", visible: true, isPermanent: true, isMovable: true },
    { id: "rate", label: "Rate", visible: true, isPermanent: true, isMovable: true },
    { id: "duration", label: "Duration", visible: true, isPermanent: false, isMovable: true },
    { id: "amount", label: "Amount", visible: true, isPermanent: true, isMovable: true },
  ];

  return (
    <div className="animate-fade-up max-w-[1700px] mx-auto pb-40 px-8">
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-24 items-start">
        {/* Form Entry Panel */}
        <div className="xl:col-span-12 2xl:col-span-7 space-y-20">
          {/* Section Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-10 border-b border-white/5 pb-12">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-3 text-accent bg-accent/5 px-6 py-2 rounded-full border border-accent/10">
                <Plus size={18} />
                <span className="text-[0.65rem] font-black uppercase tracking-[0.3em]">Phase 04: Data Entry</span>
              </div>
              <h2 className="text-5xl lg:text-7xl font-black uppercase tracking-tighter leading-none text-white">Event Particulars</h2>
            </div>
            <div className="bg-white/5 px-10 py-6 rounded-[2rem] border border-white/5 flex items-center gap-8 shadow-2xl">
               <div className="text-right">
                <p className="text-[0.6rem] font-black text-muted/40 uppercase tracking-[0.2em] leading-none mb-2">Items in Batch</p>
                <p className="font-black text-3xl text-white leading-none">{invoice.items?.length || 0}</p>
               </div>
               <div className="w-[1px] h-12 bg-white/10"></div>
               <div className="text-right">
                <p className="text-[0.6rem] font-black text-muted/40 uppercase tracking-[0.2em] leading-none mb-2">Archive ID</p>
                <p className="font-black text-2xl text-accent leading-none">#{invoice.invoiceNumber?.slice(-6) || 'MASTER'}</p>
               </div>
            </div>
          </div>

          <div className="space-y-20">
            {/* Customer Information Section */}
            <section className="space-y-12">
              <div className="flex items-center gap-6">
                <span className="w-12 h-[1px] bg-accent/30"></span>
                <h3 className="text-xs font-black uppercase tracking-[0.3em] text-muted/60">Client & Venue Profile</h3>
              </div>
              
              <div className="card !p-16 bg-black/40 border-white/5 backdrop-blur-md shadow-3xl !rounded-[3rem]">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
                  <div className="space-y-4">
                    <label className="text-xs font-black text-muted/40 uppercase tracking-[0.3em] pl-2">Client Full Name *</label>
                    <input
                      value={invoice.customerName || ""}
                      onChange={(e) => handleInputChange("customerName", e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-[1.5rem] px-8 py-5 text-white font-black text-lg focus:border-accent focus:ring-4 focus:ring-accent/10 transition-all outline-none placeholder:opacity-5"
                      placeholder="e.g. Rahul Sharma"
                      required
                    />
                  </div>
                  <div className="space-y-4">
                    <label className="text-xs font-black text-muted/40 uppercase tracking-[0.3em] pl-2">Document Index *</label>
                    <input
                      value={invoice.invoiceNumber || ""}
                      onChange={(e) => handleInputChange("invoiceNumber", e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-[1.5rem] px-8 py-5 text-white font-black text-lg focus:border-accent focus:ring-4 focus:ring-accent/10 transition-all outline-none"
                      required
                    />
                  </div>
                  <div className="space-y-4">
                    <label className="text-xs font-black text-muted/40 uppercase tracking-[0.3em] pl-2">Contact Terminal</label>
                    <input
                      type="tel"
                      value={invoice.customerPhone || ""}
                      onChange={(e) => handleInputChange("customerPhone", e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-[1.5rem] px-8 py-5 text-white font-black text-lg focus:border-accent focus:ring-4 focus:ring-accent/10 transition-all outline-none placeholder:opacity-5"
                      placeholder="+91 00000 00000"
                    />
                  </div>
                  <div className="space-y-4">
                    <label className="text-xs font-black text-muted/40 uppercase tracking-[0.3em] pl-2">Digital Correspondence</label>
                    <input
                      type="email"
                      value={invoice.customerEmail || ""}
                      onChange={(e) => handleInputChange("customerEmail", e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-[1.5rem] px-8 py-5 text-white font-black text-lg focus:border-accent focus:ring-4 focus:ring-accent/10 transition-all outline-none placeholder:opacity-5"
                      placeholder="client@mail.com"
                    />
                  </div>
                  <div className="md:col-span-2 space-y-4">
                    <label className="text-xs font-black text-muted/40 uppercase tracking-[0.3em] pl-2">Shoot / Event Logistics Address</label>
                    <input
                      value={invoice.customerAddress || ""}
                      onChange={(e) => handleInputChange("customerAddress", e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-[1.5rem] px-8 py-5 text-white font-black text-lg focus:border-accent focus:ring-4 focus:ring-accent/10 transition-all outline-none placeholder:opacity-5"
                      placeholder="Full Venue Coordinates"
                    />
                  </div>
                </div>
              </div>
            </section>

            {/* Line Items Section */}
            <section className="space-y-12">
              <div className="flex justify-between items-center bg-black/40 p-10 rounded-[2.5rem] border border-white/5">
                <div className="flex items-center gap-6">
                  <span className="w-12 h-[1px] bg-accent/30"></span>
                  <h3 className="text-xs font-black uppercase tracking-[0.3em] text-muted/60">Service Inventory</h3>
                </div>
                <button
                  type="button"
                  onClick={addItem}
                  className="group flex items-center gap-4 bg-accent text-white px-10 py-5 rounded-[2rem] hover:scale-105 transition-all duration-500 shadow-3xl shadow-accent/20"
                >
                  <Plus size={22} strokeWidth={3} className="group-hover:rotate-90 transition-transform" />
                  <span className="text-[0.7rem] font-black uppercase tracking-[0.2em]">Append Service</span>
                </button>
              </div>

              {invoice.items?.length === 0 ? (
                <div 
                  className="py-24 border-2 border-dashed border-white/10 rounded-[2.5rem] flex flex-col items-center justify-center text-center px-8 bg-white/[0.01] hover:bg-white/[0.02] hover:border-accent/40 transition-all cursor-pointer group" 
                  onClick={addItem}
                >
                  <div className="w-20 h-20 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center mb-8 text-muted group-hover:scale-110 group-hover:bg-accent group-hover:text-white shadow-2xl transition-all duration-500">
                    <Plus size={32} />
                  </div>
                  <h4 className="text-2xl font-black text-white/40 uppercase tracking-tighter group-hover:text-white transition-colors">No Services Itemized</h4>
                  <p className="text-sm text-muted max-w-xs mt-3 leading-relaxed">Begin populating your cinematic package by adding individual service line items.</p>
                </div>
              ) : (
                <div className="space-y-10">
                  {invoice.items?.map((item, idx) => (
                    <div
                      key={item.id}
                      className="group relative card !p-12 bg-black/40 border-white/5 hover:border-accent/30 transition-all duration-700 shadow-3xl !rounded-[3rem]"
                    >
                      <div className="absolute top-8 right-8 z-20">
                         <button
                           type="button"
                           onClick={() => removeItem(item.id)}
                           className="w-14 h-14 bg-error/5 text-error/30 rounded-2xl flex items-center justify-center hover:bg-error hover:text-white transition-all shadow-lg border border-error/10"
                         >
                           <Trash2 size={24} />
                         </button>
                      </div>

                      <div className="flex items-center gap-6 mb-12">
                         <span className="text-[0.7rem] font-black text-accent bg-accent/5 px-6 py-2 rounded-full uppercase tracking-[0.3em] border border-accent/10 shadow-lg">Line Object #{idx + 1}</span>
                         <div className="h-[1px] flex-1 bg-white/5"></div>
                      </div>

                      <div className="grid grid-cols-12 gap-x-12 gap-y-10">
                        {cols.map((col) => {
                          if (!col.visible) return null;

                          if (col.id === "description") {
                            return (
                              <div key={col.id} className="col-span-12 lg:col-span-12 space-y-4">
                                <label className="text-xs font-black text-muted/40 uppercase tracking-[0.3em] pl-2">{col.label}</label>
                                <input
                                  value={item.description}
                                  onChange={(e) => updateItem(item.id, "description", e.target.value)}
                                  placeholder="Package / Service Name"
                                  className="w-full bg-white/5 border border-white/5 rounded-[1.5rem] px-8 py-6 text-white font-black tracking-tighter text-2xl outline-none focus:border-accent transition-all placeholder:opacity-5"
                                />
                              </div>
                            );
                          }
                          
                          const inputCols = "col-span-6 md:col-span-3 lg:col-span-3";
                          
                          if (col.id === "quantity" || col.id === "rate" || col.id === "duration") {
                            return (
                              <div key={col.id} className={`${inputCols} space-y-4`}>
                                <label className="text-xs font-black text-muted/40 uppercase tracking-[0.3em] pl-2">{col.label}</label>
                                <div className="relative">
                                  <input
                                    type="number"
                                    value={item[col.id as keyof InvoiceItem] as number}
                                    onChange={(e) => updateItem(item.id, col.id as keyof InvoiceItem, parseFloat(e.target.value) || 0)}
                                    className="w-full bg-white/5 border border-white/5 rounded-2xl px-6 py-4 text-white font-black text-xl text-center outline-none focus:border-accent hover:bg-white/[0.08] transition-all"
                                  />
                                </div>
                              </div>
                            );
                          }

                          if (col.id === "amount") {
                             return (
                               <div key={col.id} className="col-span-12 lg:col-span-3 space-y-4 flex flex-col items-end justify-end">
                                 <label className="text-xs font-black text-accent uppercase tracking-[0.3em]">{col.label}</label>
                                 <div className="text-3xl font-black text-white bg-accent/10 ring-2 ring-accent/20 px-8 py-4 rounded-[1.5rem] shadow-3xl w-full text-center lg:text-right border border-accent/20">
                                   ₹{item.amount.toLocaleString()}
                                 </div>
                                </div>
                             );
                          }

                          return (
                            <div key={col.id} className={`${inputCols} space-y-4`}>
                              <label className="text-xs font-black text-muted/40 uppercase tracking-[0.3em] pl-2">{col.label}</label>
                              <input
                                value={item.customFields?.[col.id] || ""}
                                onChange={(e) => updateCustomField(item.id, col.id, e.target.value)}
                                placeholder="..."
                                className="w-full bg-white/5 border border-white/5 rounded-2xl px-6 py-4 text-white font-black text-lg outline-none focus:border-accent transition-all placeholder:opacity-5"
                              />
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* Subtotal Section */}
            <section className="bg-accent shadow-[0_40px_100px_rgba(232,85,10,0.3)] p-20 rounded-[4rem] flex flex-col md:flex-row justify-between items-center gap-12 relative overflow-hidden group">
               <div className="absolute top-0 right-0 w-[40rem] h-[40rem] bg-white/10 rounded-full -mr-40 -mt-40 blur-[100px] group-hover:bg-white/20 transition-all duration-1000"></div>
               <div className="relative z-10 space-y-2 text-center md:text-left">
                  <p className="text-[0.8rem] font-black text-white/50 uppercase tracking-[0.5em] leading-none">Net Document Valuation</p>
                  <p className="text-6xl lg:text-9xl font-black text-white tracking-tighter drop-shadow-3xl">₹{invoice.total?.toLocaleString()}</p>
               </div>
               <div className="relative z-10 hidden md:block text-right">
                  <div className="bg-black/20 backdrop-blur-xl px-10 py-6 rounded-[2.5rem] border border-white/10 shadow-2xl">
                    <p className="text-[0.7rem] font-black text-white/40 uppercase tracking-[0.3em] leading-none mb-3">Itemised Batch</p>
                    <p className="font-black text-4xl text-white">{invoice.items?.length || 0} SECTIONS</p>
                  </div>
               </div>
            </section>
          </div>

          <div className="flex flex-col md:flex-row items-center gap-8 pt-24 pb-40">
            <button 
              onClick={prevStep} 
              className="flex-1 btn btn-ghost !p-8 !rounded-[2.5rem] border-white/5 uppercase font-black tracking-widest text-xs"
            >
              Previous Perspective
            </button>
            <button 
              onClick={() => { onNext(); nextStep(); }} 
              disabled={!isValid}
              className="flex-[2] btn btn-primary !p-8 !rounded-[2.5rem] shadow-3xl shadow-accent/20 disabled:opacity-5 uppercase font-black tracking-widest text-xs"
            >
              Live Mastering & Sync
            </button>
          </div>
        </div>

        {/* Live Preview Panel */}
        <div className="xl:col-span-12 2xl:col-span-5 relative">
          <div className="sticky top-24 bg-[#050505] rounded-[3rem] border border-white/5 p-1 flex flex-col items-center overflow-hidden shadow-[0_50px_100px_rgba(0,0,0,0.9)]">
             <div className="w-full bg-white/[0.03] px-12 py-8 flex items-center justify-between border-b border-white/5">
                <div className="flex items-center gap-4">
                   <div className="w-3 h-3 rounded-full bg-accent animate-pulse shadow-[0_0_15px_rgba(232,85,10,0.8)]"></div>
                   <span className="text-[0.7rem] font-black uppercase tracking-[0.4em] text-white/50">Mastering Authority</span>
                </div>
                <div className="flex items-center gap-6 text-white/30 font-mono text-[0.65rem] tracking-[0.2em]">
                   <span className="hidden lg:block">1:1 ENGINE SIMULATION</span>
                   <Eye size={14} className="text-accent" />
                </div>
             </div>
             
             <div className="p-16 lg:p-24 w-full flex justify-center bg-[radial-gradient(circle_at_center,rgba(232,85,10,0.05)_0%,transparent_70%)] relative">
               <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')] opacity-10 pointer-events-none"></div>
               <div className="scale-[0.45] xl:scale-[0.6] 2xl:scale-[0.55] origin-top transform-gpu shadow-[0_60px_120px_rgba(0,0,0,0.9)] rounded-[2px] ring-1 ring-white/10 overflow-hidden bg-white">
                  <InvoicePreview 
                    businessProfile={businessProfile}
                    invoice={invoice}
                    theme={theme}
                  />
               </div>
             </div>
             
             <div className="bg-black/60 backdrop-blur-2xl w-full p-10 border-t border-white/5 text-center">
                <p className="text-[0.65rem] text-muted/40 uppercase tracking-[0.4em] leading-relaxed italic max-w-sm mx-auto">Archival Studio Master — Version 2.0</p>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
