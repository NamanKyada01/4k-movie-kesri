"use client";

import React from "react";
import InvoiceManager from "@/components/invoice/InvoiceManager";

export default function CreateInvoicePage() {
  return (
    <div className="container mx-auto">
      <InvoiceManager mode="create" />
    </div>
  );
}
