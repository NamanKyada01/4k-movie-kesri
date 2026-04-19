import { Invoice, BusinessProfile, GlobalTheme } from "@/types/invoice";
import React from "react";
import { ModernLayout } from "./invoice-layouts";

interface InvoicePreviewProps {
  invoice?: Partial<Invoice>;
  businessProfile: Partial<BusinessProfile>;
  theme: GlobalTheme;
}

export const InvoicePreview = React.forwardRef<
  HTMLDivElement,
  InvoicePreviewProps
>(({ invoice, businessProfile, theme }, ref) => {
  // Respect showLogo setting
  const profileForPreview = {
    ...businessProfile,
    logoUrl: businessProfile.showLogo === false ? undefined : businessProfile.logoUrl,
  };

  const themeWithColor = {
    ...theme,
    primaryColor: theme.primaryColor || "#E8550A",
  };

  return (
    <div ref={ref} className="print:w-full print:h-full bg-transparent overflow-auto">
      <div className="min-w-fit flex justify-center py-8 print:py-0 print:block">
        <ModernLayout
          invoice={invoice}
          businessProfile={profileForPreview}
          theme={themeWithColor}
        />
      </div>
    </div>
  );
});

InvoicePreview.displayName = "InvoicePreview";
