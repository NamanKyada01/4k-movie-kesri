"use client";

import React, { useState, useMemo } from "react";
import { Plus, Search, Loader2, HardDrive } from "lucide-react";
import { useLiveCollection } from "@/hooks/useLiveCollection";
import { orderBy } from "firebase/firestore";
import { Equipment } from "@/types";
import { createEquipment, updateEquipment, deleteEquipment } from "@/actions/admin";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { useAlert } from "@/contexts/AlertContext";
import EquipmentCard from "@/components/invoice/EquipmentCard";
import CreationModal from "@/components/ui/CreationModal";
import EquipmentQuickViewModal from "@/components/invoice/EquipmentQuickViewModal";

export default function EquipmentManagementPage() {
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editItem, setEditItem] = useState<Equipment | null>(null);
  const [quickViewItem, setQuickViewItem] = useState<Equipment | null>(null);
  const { confirm } = useAlert();

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditItem(null);
  };

  const handleEdit = (item: Equipment) => {
    setEditItem(item);
    setIsModalOpen(true);
  };

  // Real-time synchronization
  const { data: inventory, loading } = useLiveCollection<Equipment>("equipment", [
    orderBy("createdAt", "desc")
  ]);

  const handleDelete = async (id: string, name: string) => {
    const isConfirmed = await confirm(
        "Delete Equipment?",
        `Are you sure you want to permanently remove ${name}? This action cannot be reversed.`,
        { primaryActionLabel: "Delete", glowColor: "239 68 68" }
    );

    if (isConfirmed) {
        toast.loading("Deleting equipment...", { id: `del-${id}` });
        const res = await deleteEquipment(id);
        if (res.success) {
            toast.success("Equipment deleted successfully", { id: `del-${id}` });
        } else {
            toast.error("Failed to delete equipment", { id: `del-${id}` });
        }
    }
  };

  const filteredInventory = useMemo(() => {
    return inventory.filter(i => {
        const matchesSearch = i.name.toLowerCase().includes(search.toLowerCase()) || 
                             i.serialNumber?.toLowerCase().includes(search.toLowerCase());
        const matchesCat = categoryFilter === "all" || i.category === categoryFilter;
        return matchesSearch && matchesCat;
    });
  }, [inventory, search, categoryFilter]);


  if (loading) return (
      <div style={{ height: "60vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "20px" }}>
          <Loader2 size={40} className="animate-spin" color="var(--accent)" />
          <p style={{ color: "var(--text-muted)", letterSpacing: "0.1em", fontSize: "0.8rem", textTransform: "uppercase" }}>Synchronizing Inventory...</p>
      </div>
  );

  return (
    <div style={{ animation: "fadeIn 0.5s ease", paddingBottom: "100px" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "3rem" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "8px" }}>
            <HardDrive size={20} color="var(--accent)" />
            <span style={{ color: "var(--accent)", fontSize: "0.7rem", fontWeight: 800, textTransform: "uppercase", letterSpacing: "2px" }}>Technical Assets</span>
          </div>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "3.5rem", lineHeight: 1, color: "white", margin: 0 }}>Inventory</h1>
          <p style={{ color: "var(--text-muted)", fontSize: "0.95rem", letterSpacing: "0.05em", marginTop: "12px" }}>Monitor and manage the high-fidelity technical assets of the studio</p>
        </div>
        
        <button 
           onClick={() => setIsModalOpen(true)}
           className="btn btn-primary" 
           style={{ display: "flex", alignItems: "center", gap: 10, padding: "16px 32px", fontSize: "0.95rem", fontWeight: 700, borderRadius: "14px" }}
        >
          <Plus size={20} /> Add Equipment
        </button>
      </div>

      <CreationModal 
        isOpen={isModalOpen} 
        onClose={handleCloseModal} 
        type="equipment" 
        editData={editItem}
      />

      {/* Toolbar */}
      <div style={{ 
        display: "flex", gap: "1.25rem", marginBottom: "3rem",
        padding: "1rem", background: "rgba(255,255,255,0.015)", borderRadius: "16px", border: "1px solid rgba(255,255,255,0.05)"
      }}>
        <div style={{ flex: 1, position: "relative" }}>
          <Search size={16} style={{ position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)", color: "rgba(255,255,255,0.2)" }} />
          <input 
            placeholder="Search equipment, labels, or serial keys..."
            value={search} onChange={e => setSearch(e.target.value)}
            style={{ width: "100%", background: "transparent", border: "none", padding: "12px 12px 12px 44px", color: "white", outline: "none" }}
          />
        </div>
        <div style={{ display: "flex", gap: "10px" }}>
            {["all", "camera", "lens", "light", "audio"].map(cat => (
                <button 
                    key={cat} onClick={() => setCategoryFilter(cat)}
                    style={{ 
                        background: categoryFilter === cat ? "rgba(255,255,255,0.1)" : "transparent",
                        border: "none", color: categoryFilter === cat ? "white" : "var(--text-muted)",
                        padding: "6px 16px", borderRadius: "8px", fontSize: "0.75rem", fontWeight: 700,
                        textTransform: "uppercase", letterSpacing: "0.05em", cursor: "pointer"
                    }}
                >
                    {cat}
                </button>
            ))}
        </div>
      </div>

      {/* Grid */}
      {filteredInventory.length === 0 ? (
        <div style={{ 
            textAlign: "center", 
            padding: "100px 0", 
            color: "var(--text-muted)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center"
        }}>
          <HardDrive size={48} opacity={0.1} style={{ marginBottom: "20px" }} />
          <p>No active assets discovered in this segment.</p>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(480px, 1fr))", gap: "2rem" }}>
          <AnimatePresence>
            {filteredInventory.map((item) => (
                <EquipmentCard 
                    key={item.id} 
                    item={item} 
                    onEdit={() => handleEdit(item)}
                    onDelete={() => handleDelete(item.id, item.name)}
                    onQuickView={() => setQuickViewItem(item)}
                />
            ))}
          </AnimatePresence>
        </div>
      )}

      {quickViewItem && (
          <EquipmentQuickViewModal 
             item={quickViewItem} 
             onClose={() => setQuickViewItem(null)} 
          />
      )}

      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
