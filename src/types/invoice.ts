export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  rate: number;
  amount: number;
  duration: number; // For cinematic services (days/hours)
}

export interface BusinessProfile {
  id: string;
  brandName: string;
  brandAddress: string;
  brandPhone: string;
  brandEmail: string;
  logoUrl?: string;
  showLogo: boolean;
  gstNumber?: string;
  panNumber?: string;
  createdAt: number;
}

export interface GlobalTheme {
  id: string;
  name: string;
  layoutType: 'classic' | 'modern' | 'minimalist' | 'editorial';
  primaryColor: string;
  createdAt: number;
}

export interface InvoiceColumn {
  id: string;
  label: string;
  visible: boolean;
  isPermanent: boolean;
  isMovable: boolean;
}

export type InvoiceColumns = InvoiceColumn[];

export interface Invoice {
  id: string;
  invoiceNumber: string;
  businessDetails: BusinessProfile;
  themeDetails: GlobalTheme;
  columns: InvoiceColumns;
  customerName: string;
  customerAddress: string;
  customerPhone: string;
  customerEmail: string;
  items: InvoiceItem[];
  subtotal: number;
  taxRate: number;
  taxAmount: number;
  total: number;
  date: number;
  dueDate: number;
  notes: string;
  status: 'draft' | 'sent' | 'paid' | 'overdue';
  createdAt: number;
}
