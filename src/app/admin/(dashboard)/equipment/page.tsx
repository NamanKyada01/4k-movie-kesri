"use client";

import React, { useState, useMemo } from "react";
import { Plus, Search, Loader2, HardDrive } from "lucide-react";
import { useLiveCollection } from "@/hooks/useLiveCollection";
import { orderBy } from "firebase/firestore";
import { Equipment } from "@/types";
import { createEquipment, updateEquipment } from "@/actions/admin"; // Add deleteEquipment if needed
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import EquipmentCard from "@/components/invoice/EquipmentCard";

export default function EquipmentManagementPage() {
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [isCreating, setIsCreating] = useState(false);

  // Real-time synchronization
  const { data: inventory, loading } = useLiveCollection<Equipment>("equipment", [
    orderBy("createdAt", "desc")
  ]);

  const filteredInventory = useMemo(() => {
    return inventory.filter(i => {
        const matchesSearch = i.name.toLowerCase().includes(search.toLowerCase()) || 
                             i.serialNumber?.toLowerCase().includes(search.toLowerCase());
        const matchesCat = categoryFilter === "all" || i.category === categoryFilter;
        return matchesSearch && matchesCat;
    });
  }, [inventory, search, categoryFilter]);

  const handleCreateDummy = async () => {
    setIsCreating(true);
    const res = await createEquipment({
        name: "New Cinema Rig",
        category: "camera",
        quantity: 1,
        condition: "available",
        serialNumber: "SN-" + Math.floor(Math.random() * 100000),
        images: [],
    });
    setIsCreating(false);
    if (!res.success) toast.error("Deployment failed");
    else toast.success("New asset added to vault");
  };

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
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "2.75rem", color: "white", marginBottom: "0.5rem" }}>Inventory</h1>
          <p style={{ color: "var(--text-muted)", fontSize: "0.95rem", letterSpacing: "0.05em" }}>Monitor and manage the high-fidelity technical assets of the studio</p>
        </div>
        
        <button 
           onClick={handleCreateDummy}
           disabled={isCreating}
           className="btn btn-primary" 
           style={{ display: "flex", alignItems: "center", gap: 10, padding: "14px 28px" }}
        >
          {isCreating ? <Loader2 size={18} className="animate-spin" /> : <Plus size={18} />} Add Equipment
        </button>
      </div>

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
        <div style={{ textAlign: "center", padding: "100px 0", color: "var(--text-muted)" }}>
          <HardDrive size={48} opacity={0.1} style={{ margin: "0 auto 20px" }} />
          <p>No active assets discovered in this segment.</p>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "2rem" }}>
          <AnimatePresence>
            {filteredInventory.map((item) => (
                <EquipmentCard 
                    key={item.id} 
                    item={item} 
                    onEdit={() => toast.info("Opening Asset Editor...")}
                    onDelete={() => toast.warning("Delete action pending logic...")}
                />
            ))}
          </AnimatePresence>
        </div>
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
