"use client";

import React, { useEffect, useState, use } from "react";
import InvoiceManager from "@/components/invoice/InvoiceManager";
import { getInvoiceById } from "@/actions/invoice";
import { Invoice } from "@/types/invoice";
import { toast } from "sonner";
import DashboardSkeleton from "@/components/invoice/DashboardSkeleton";

export default function EditInvoicePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
       loadInvoice(id);
    }
  }, [id]);

  async function loadInvoice(invoiceId: string) {
    const res = await getInvoiceById(invoiceId);
    if (res.success && res.invoice) {
      setInvoice(res.invoice);
    } else {
      toast.error("Invoice not found");
    }
    setLoading(false);
  }

  if (loading) return (
    <div className="container mx-auto">
      <div style={{ marginBottom: "2rem" }}>
        <div style={{ width: "200px", height: "40px", background: "rgba(255,255,255,0.05)", borderRadius: "8px", marginBottom: "1rem" }} />
        <div style={{ width: "300px", height: "20px", background: "rgba(255,255,255,0.03)", borderRadius: "4px" }} />
      </div>
      <DashboardSkeleton />
    </div>
  );

  return (
    <div className="container mx-auto">
      <InvoiceManager mode="edit" initialData={invoice} />
    </div>
  );
}
