"use client";

import { useState } from "react";
import { Invoice, BusinessProfile, GlobalTheme, InvoiceColumns } from "@/types/invoice";
import Stepper, { Step } from "@/components/ui/Stepper";
import { ThemeSelectionStep } from "@/components/invoices/steps/ThemeSelectionStep";
import { InvoiceColumnsStep } from "@/components/invoices/steps/InvoiceColumnsStep";
import { BusinessSelectionStep } from "@/components/invoices/steps/BusinessSelectionStep";
import { InvoiceDetailsStep } from "@/components/invoices/steps/InvoiceDetailsStep";
import { InvoicePreviewStep } from "@/components/invoices/steps/InvoicePreviewStep";

export default function CreateInvoicePage() {
  const [selectedTheme, setSelectedTheme] = useState<GlobalTheme | null>(null);
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [showLogo, setShowLogo] = useState(true);
  const [businessProfile, setBusinessProfile] = useState<BusinessProfile | null>(null);

  const [columns, setColumns] = useState<InvoiceColumns>([
    { id: "description", label: "Description", visible: true, isPermanent: true, isMovable: false },
    { id: "quantity", label: "Qty", visible: true, isPermanent: true, isMovable: true },
    { id: "rate", label: "Rate", visible: true, isPermanent: true, isMovable: true },
    { id: "duration", label: "Duration", visible: true, isPermanent: false, isMovable: true },
    { id: "amount", label: "Amount", visible: true, isPermanent: true, isMovable: true },
  ]);

  const [invoice, setInvoice] = useState<Partial<Invoice>>({
    invoiceNumber: `INV-${Date.now().toString().slice(-6)}`,
    customerName: "",
    customerAddress: "",
    customerPhone: "",
    customerEmail: "",
    date: Date.now(),
    items: [],
    subtotal: 0,
    total: 0,
    columns,
  });

  // Since Stepper is used as a UI shell, we manage transitions via ref or internal callbacks
  // But for simple "controlled" behavior, we might need to tweak the Stepper component
  // For now, I'll pass props that allow the steps to trigger the next step via the Stepper's footer (if possible)
  // or I'll customize the footer.

  return (
    <div className="container py-24 md:py-32 max-w-[1600px] min-h-screen">
      <div className="mb-32 px-4 space-y-10">
        <div className="space-y-6">
          <div className="flex items-center gap-6">
            <div className="h-[2px] w-16 bg-accent shadow-[0_0_15px_rgba(232,85,10,0.6)]"></div>
            <span className="text-xs font-black uppercase tracking-[0.5em] text-accent">Studio Operations</span>
          </div>
          <h1 className="text-6xl md:text-8xl font-black uppercase tracking-tighter leading-none">Generate <span className="text-white/20">Master</span> Invoice</h1>
          <p className="text-muted text-xl max-w-3xl leading-relaxed">Archive your cinematic production data into a professional studio-standard document.</p>
        </div>
      </div>

      <Stepper
        disableStepIndicators={false}
        footerClassName="hidden" // We use custom buttons inside steps for better control
      >
        {/* Step 1: Branding */}
        <Step>
          <ThemeSelectionStep 
            onNext={(theme, color, logoPref) => {
              setSelectedTheme(theme);
              setSelectedColor(color);
              setShowLogo(logoPref);
              // The Stepper component handles the actual "Next" globally if we click its footer button
              // But here we want our custom button to trigger it. 
              // I'll update the Stepper's goToStep if I can, or just use the footer buttons.
            }} 
          />
        </Step>

        {/* Step 2: Columns */}
        <Step>
          <InvoiceColumnsStep
            columns={columns}
            setColumns={(cols) => {
               setColumns(cols);
               setInvoice(prev => ({ ...prev, columns: cols }));
            }}
            onBack={() => {}} // Stepper footer handles this if enabled
            onNext={() => {}}
          />
        </Step>

        {/* Step 3: Business Profile */}
        <Step>
          {selectedTheme && (
            <BusinessSelectionStep
              selectedTheme={{ ...selectedTheme, primaryColor: selectedColor }}
              showLogo={showLogo}
              onNext={(profile) => setBusinessProfile(profile)}
            />
          )}
        </Step>

        {/* Step 4: Invoice Details */}
        <Step>
          {businessProfile && selectedTheme && (
            <InvoiceDetailsStep
              invoice={invoice}
              businessProfile={businessProfile}
              theme={{ ...selectedTheme, primaryColor: selectedColor }}
              setInvoice={setInvoice}
              onBack={() => {}}
              onNext={() => {}}
            />
          )}
        </Step>

        {/* Step 5: Final Preview */}
        <Step>
          {businessProfile && selectedTheme && (
            <InvoicePreviewStep
              invoice={invoice as Invoice}
              businessProfile={businessProfile}
              theme={{ ...selectedTheme, primaryColor: selectedColor }}
              onBack={() => {}}
            />
          )}
        </Step>
      </Stepper>
    </div>
  );
}
