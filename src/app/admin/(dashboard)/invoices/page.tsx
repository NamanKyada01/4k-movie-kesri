"use client";

import { useEffect, useState } from "react";
import { getInvoices } from "@/actions/invoice";
import { auth } from "@/lib/firebase";
import { Invoice } from "@/types/invoice";
import { Plus, Search, Filter, Loader2, Sparkles, FileStack } from "lucide-react";
import Link from "next/link";
import { InvoiceListCard } from "@/components/invoices/invoice-list-card";
import { motion, AnimatePresence } from "framer-motion";

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchInvoices = async () => {
      // Need a small timeout to ensure auth.currentUser is populated on client
      let attempts = 0;
      const checkAndFetch = async () => {
        if (auth.currentUser) {
          const res = await getInvoices(auth.currentUser.uid);
          if (res.success && res.invoices) {
            setInvoices(res.invoices);
          }
          setLoading(false);
        } else if (attempts < 10) {
          attempts++;
          setTimeout(checkAndFetch, 500);
        } else {
          setLoading(false);
        }
      };
      checkAndFetch();
    };
    fetchInvoices();
  }, []);

  const filteredInvoices = invoices.filter(inv => 
    inv.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    inv.invoiceNumber?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <div className="relative">
        <Loader2 className="animate-spin text-accent" size={48} />
        <div className="absolute inset-0 blur-xl bg-accent/20 animate-pulse" />
      </div>
      <p className="mt-6 text-muted font-black uppercase tracking-widest text-[0.7rem] animate-pulse">Decrypting Invoice Vault...</p>
    </div>
  );

  return (
    <div className="animate-fade-up max-w-[1400px] mx-auto">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-12 mb-24">
        <div className="space-y-4">
          <div className="flex items-center gap-4 mb-6">
            <span className="w-12 h-[1px] bg-accent" />
            <span className="text-xs font-black text-accent uppercase tracking-[0.4em]">Financial Intelligence</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-black text-white uppercase tracking-tighter leading-none">Invoice Ledger</h1>
          <p className="text-muted text-base max-w-lg leading-relaxed">Manage your cinematic service receipts and studio branding profiles in one central command center.</p>
        </div>
        
        <Link href="/admin/invoices/create" className="group relative">
          <div className="absolute -inset-1 bg-gradient-to-r from-accent to-orange-600 rounded-xl blur opacity-25 group-hover:opacity-60 transition duration-1000 group-hover:duration-200" />
          <button className="relative flex items-center gap-3 bg-accent hover:bg-orange-600 text-white font-black uppercase tracking-tighter px-10 py-5 rounded-xl transition-all active:scale-95 text-sm">
            <Plus size={18} strokeWidth={3} />
            Generate Invoice
          </button>
        </Link>
      </div>

      {/* Stats Bar (Subtle) */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-16">
        <div className="card !p-10 border-white/5 flex flex-col justify-center bg-white/[0.01]">
            <p className="text-[0.65rem] font-bold text-muted uppercase tracking-[0.2em] mb-3">Active Ledger</p>
            <p className="text-3xl font-black text-white tracking-tighter">{invoices.length} Documents</p>
        </div>
        <div className="card !p-10 border-white/5 flex flex-col justify-center bg-white/[0.01]">
            <p className="text-[0.65rem] font-bold text-muted uppercase tracking-[0.2em] mb-3">Total Revenue</p>
            <p className="text-3xl font-black text-accent tracking-tighter">₹{invoices.reduce((sum, i) => sum + i.total, 0).toLocaleString()}</p>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-6 mb-16">
        <div className="relative flex-1 group">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-muted group-focus-within:text-accent transition-colors" size={20} />
          <input 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by client or invoice ID..."
            className="input-field !pl-16 !py-6 h-16 !rounded-3xl border-white/5 focus:border-accent/40 bg-white/2 text-base"
          />
        </div>
        <button className="btn btn-ghost !h-16 !px-10 !rounded-3xl !border-white/5 hover:!bg-white/5 flex items-center gap-3">
           <Filter size={20} />
           <span className="text-[0.65rem] font-black uppercase tracking-[0.2em]">Filter Archive</span>
        </button>
      </div>

      {/* Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {filteredInvoices.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="col-span-full py-64 flex flex-col items-center justify-center text-center opacity-30 h-full"
            >
              <FileStack size={80} strokeWidth={1} className="mb-10 text-muted mx-auto" />
              <h3 className="text-3xl font-black uppercase tracking-[0.25em]">No Records Found</h3>
              <p className="text-[0.6rem] mt-6 max-w-sm mx-auto uppercase font-black tracking-[0.3em] leading-loose text-accent">The ledger is currently empty. Initiate a new generation to begin building your archive.</p>
            </motion.div>
          ) : (
            filteredInvoices.map((invoice, idx) => (
              <motion.div
                key={invoice.id}
                layout
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.4, delay: idx * 0.05 }}
              >
                <InvoiceListCard invoice={invoice} />
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
