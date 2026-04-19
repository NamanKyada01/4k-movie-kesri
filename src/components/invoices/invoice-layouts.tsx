import { Invoice, BusinessProfile, GlobalTheme } from "@/types/invoice";
import { format } from "date-fns";
import React from "react";

interface InvoiceLayoutProps {
  invoice?: Partial<Invoice>;
  businessProfile: Partial<BusinessProfile>;
  theme: GlobalTheme;
}

export const ModernLayout = ({
  invoice,
  businessProfile,
  theme,
}: InvoiceLayoutProps) => {
  const invoiceNumber = invoice?.invoiceNumber || "INV-000000";
  const date = invoice?.date || Date.now();
  const items = invoice?.items || [];
  const subtotal = invoice?.subtotal || 0;
  const total = invoice?.total || 0;
  const customerName = invoice?.customerName || "Customer Name";
  
  const cols = invoice?.columns || [
    { id: "description", label: "Description", visible: true, isPermanent: true, isMovable: false },
    { id: "quantity", label: "Qty", visible: true, isPermanent: true, isMovable: true },
    { id: "rate", label: "Rate", visible: true, isPermanent: true, isMovable: true },
    { id: "duration", label: "Duration", visible: true, isPermanent: false, isMovable: true },
    { id: "amount", label: "Amount", visible: true, isPermanent: true, isMovable: true },
  ];

  const primaryColor = theme.primaryColor || "#E8550A";

  return (
    <div className="p-20 bg-white text-black min-h-[297mm] w-[210mm] mx-auto shadow-2xl print:shadow-none print:p-12 print:w-full print:h-full flex flex-col font-sans relative overflow-hidden">
      {/* Cinematic Watermark / Accent */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[radial-gradient(circle_at_top_right,var(--primary-color),transparent_70%)] opacity-[0.03] pointer-events-none" style={{ '--primary-color': primaryColor } as any}></div>
      
      {/* Header Area */}
      <div className="flex justify-between items-start mb-20 border-b pb-16" style={{ borderColor: `${primaryColor}20` }}>
        <div className="flex items-center gap-10">
          {businessProfile.logoUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={businessProfile.logoUrl}
              alt="Logo"
              className="h-24 w-auto object-contain grayscale hover:grayscale-0 transition-all duration-700"
            />
          )}
          <div className="space-y-3">
            <h1 className="text-4xl font-black tracking-tighter uppercase leading-none" style={{ color: primaryColor }}>
              {businessProfile.brandName || "Your Business Name"}
            </h1>
            <div className="text-[0.7rem] text-gray-400 mt-2 space-y-1 uppercase tracking-[0.2em] font-black italic">
              {businessProfile.brandAddress && <p className="opacity-60">{businessProfile.brandAddress}</p>}
              <div className="flex gap-6">
                {businessProfile.brandEmail && <p>{businessProfile.brandEmail}</p>}
                {businessProfile.brandPhone && <p>{businessProfile.brandPhone}</p>}
              </div>
            </div>
          </div>
        </div>
        <div className="text-right">
          <h2 className="text-6xl font-black text-gray-100/30 leading-none mb-6 tracking-tighter">INVOICE</h2>
          <div className="space-y-2">
            <p className="font-black text-2xl tracking-tighter">#{invoiceNumber}</p>
            <p className="text-[0.75rem] text-gray-400 font-black uppercase tracking-widest">{format(date, "MMMM dd, yyyy")}</p>
          </div>
        </div>
      </div>

      {/* Info Grid */}
      <div className="grid grid-cols-2 gap-20 mb-20 px-4">
        <div className="space-y-6">
          <h3 className="text-[0.65rem] font-black text-gray-300 uppercase tracking-[0.4em] mb-4">
            Production Recipient
          </h3>
          <p className="font-black text-3xl mb-2 tracking-tighter text-gray-900 leading-none">{customerName}</p>
          <div className="text-[0.75rem] text-gray-500 space-y-2 uppercase tracking-widest font-bold">
            {invoice?.customerAddress && <p className="leading-relaxed whitespace-pre-line">{invoice.customerAddress}</p>}
            <div className="flex gap-6 pt-2">
              {invoice?.customerPhone && <p>{invoice.customerPhone}</p>}
              {invoice?.customerEmail && <p>{invoice.customerEmail}</p>}
            </div>
          </div>
        </div>
        <div className="text-right flex flex-col justify-end items-end space-y-2">
           <div className="w-16 h-1 bg-gray-100 mb-4" style={{ backgroundColor: `${primaryColor}30` }}></div>
           <p className="text-[0.6rem] font-black text-gray-300 uppercase tracking-[0.5em] mb-2">Registry Record</p>
           <p className="text-sm font-black text-gray-400 font-mono tracking-tighter bg-gray-50 px-3 py-1 rounded">AUTH_ID: {invoiceNumber.slice(-8)}</p>
        </div>
      </div>

      {/* Items Table */}
      <div className="flex-grow">
        <table className="w-full">
          <thead>
            <tr className="border-b-2" style={{ borderColor: primaryColor }}>
              {cols.map((col) => {
                if (!col.visible) return null;
                
                let alignClass = "text-left";
                if (["quantity", "duration"].includes(col.id)) alignClass = "text-center";
                if (["rate", "amount"].includes(col.id)) alignClass = "text-right";

                return (
                  <th key={col.id} className={`${alignClass} py-4 text-[0.7rem] font-bold uppercase tracking-widest text-gray-400`}>
                    {col.label}
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {items.length > 0 ? (
              items.map((item) => (
                <tr key={item.id} className="border-b border-gray-50 group hover:bg-gray-50/30 transition-colors">
                  {cols.map((col) => {
                    if (!col.visible) return null;
                    
                    if (col.id === "description") return <td key={col.id} className="py-8 text-left font-black text-gray-900 tracking-tight text-lg">{item.description}</td>;
                    if (col.id === "quantity") return <td key={col.id} className="text-center py-8 font-black text-gray-400">{item.quantity}</td>;
                    if (col.id === "rate") return <td key={col.id} className="text-right py-8 font-bold text-gray-500">₹{item.rate.toLocaleString()}</td>;
                    if (col.id === "duration") return <td key={col.id} className="text-center py-8 font-bold text-gray-500">{item.duration} {item.duration === 1 ? "day" : "days"}</td>;
                    if (col.id === "amount") return <td key={col.id} className="text-right py-8 font-black text-gray-900 text-xl tracking-tighter">₹{item.amount.toLocaleString()}</td>;
                    
                    return <td key={col.id} className="py-8 text-left text-gray-500 text-[0.75rem] font-bold uppercase tracking-widest">{item.customFields?.[col.id] || "—"}</td>;
                  })}
                </tr>
              ))
            ) : (
              <tr className="border-b border-gray-100 text-gray-300 italic">
                 {cols.map((col) => {
                    if (!col.visible) return null;
                    if (col.id === "description") return <td key={col.id} className="py-8 text-left">Sample Professional Service</td>;
                    if (col.id === "quantity") return <td key={col.id} className="text-center py-8">1</td>;
                    if (col.id === "rate") return <td key={col.id} className="text-right py-8">₹0</td>;
                    if (col.id === "duration") return <td key={col.id} className="text-center py-8">1 day</td>;
                    if (col.id === "amount") return <td key={col.id} className="text-right py-8">₹0</td>;
                    return <td key={col.id} className="py-8 text-left">...</td>;
                 })}
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Totals Section */}
      <div className="flex justify-end mt-20 pt-12 border-t-2 border-gray-50 px-4">
        <div className="w-96 space-y-6">
          <div className="flex justify-between text-gray-400 font-black uppercase tracking-[0.2em] text-[0.7rem]">
            <span>Net Subtotal</span>
            <span className="text-gray-900 text-lg tracking-tighter">₹{subtotal.toLocaleString()}</span>
          </div>
          {invoice?.taxAmount !== undefined && invoice.taxAmount > 0 && (
            <div className="flex justify-between text-gray-400 font-black uppercase tracking-[0.2em] text-[0.7rem]">
              <span>Tax Valuation ({invoice.taxRate}%)</span>
              <span className="text-gray-900 text-lg tracking-tighter">₹{invoice.taxAmount.toLocaleString()}</span>
            </div>
          )}
          <div
            className="flex justify-between font-black text-5xl border-t-8 pt-6 mt-6 transition-transform hover:scale-105 duration-700"
            style={{
              color: primaryColor,
              borderColor: primaryColor,
            }}
          >
            <span className="text-[0.65rem] self-center uppercase tracking-[0.4em] text-gray-300 translate-y-2">Studio Valuation</span>
            <span className="tracking-tighter">₹{total.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-auto pt-16 border-t border-gray-50 flex justify-between items-end px-4">
        <div className="text-[0.7rem] text-gray-300 space-y-2 uppercase tracking-widest font-black">
          <p className="font-black text-gray-400 mb-4 tracking-[0.3em]">Operational Protocol</p>
          <p>Archival Document / System Synchronized</p>
          <p>Studio Headquarters Representative Sign-off Not Required</p>
        </div>
        <div className="text-right text-[0.7rem] text-gray-500 flex flex-col gap-2">
           <p className="font-black text-gray-200 transform -rotate-1 origin-bottom-right mb-6 text-2xl tracking-tighter italic font-serif opacity-40">&ldquo;Every Frame Tells a Story&rdquo;</p>
           {invoice?.notes && <p className="mt-4 text-gray-400 font-medium max-w-sm whitespace-pre-wrap italic">NOTES: {invoice.notes}</p>}
        </div>
      </div>
    </div>
  );
};
