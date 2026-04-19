export interface GlobalTheme {
  id: string;
  name: string;
  primaryColor?: string; // Optional - user selects during invoice creation
  layoutType: "modern";
  previewUrl?: string; // URL to an image showing the theme
  createdAt: number;
  updatedAt?: number;
}

export interface InvoiceColumn {
  id: string;
  label: string;
  visible: boolean;
  isPermanent: boolean;
  isMovable: boolean;
}

export type InvoiceColumns = InvoiceColumn[];

export interface BusinessProfile {
  id: string; // Unique ID for the profile
  userId: string;
  brandName: string;
  brandAddress?: string;
  brandEmail?: string;
  brandPhone?: string;
  logoUrl?: string;
  showLogo?: boolean; // Controls whether logo appears on invoice
  selectedThemeId: string; // ID of the GlobalTheme
  updatedAt: number;
}

export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  rate: number;
  duration: number; // in days, default 1
  amount: number;
  customFields?: Record<string, string | number>;
}

export interface Invoice {
  id: string;
  userId: string;
  invoiceNumber: string;

  // Snapshots of data at the time of creation
  businessDetails: Omit<BusinessProfile, "userId" | "updatedAt">;
  themeDetails: GlobalTheme;
  columns?: InvoiceColumns;

  customerName: string;
  customerAddress?: string;
  customerPhone?: string;
  customerEmail?: string;

  items: InvoiceItem[];
  subtotal: number;
  taxRate?: number;
  taxAmount?: number;
  total: number;

  date: number;
  dueDate?: number;
  notes?: string;
  createdAt: number;
}
