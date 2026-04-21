"use client";

import React, { useState, useMemo } from "react";
import { Plus, Search, Loader2, Users } from "lucide-react";
import { useLiveCollection } from "@/hooks/useLiveCollection";
import { orderBy } from "firebase/firestore";
import { Staff } from "@/types";
import { createStaff, deleteStaff, updateStaff } from "@/actions/admin";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { useAlert } from "@/contexts/AlertContext";
import StaffCard from "@/components/invoice/StaffCard";

export default function StaffManagementPage() {
  const [search, setSearch] = useState("");
  const [positionFilter, setPositionFilter] = useState("all");
  const [isCreating, setIsCreating] = useState(false);
  const { confirm } = useAlert();

  // Real-time synchronization
  const { data: team, loading } = useLiveCollection<Staff>("staff", [
    orderBy("createdAt", "desc")
  ]);

  const filteredTeam = useMemo(() => {
    return team.filter(s => {
        const matchesSearch = s.name.toLowerCase().includes(search.toLowerCase()) || 
                             s.email.toLowerCase().includes(search.toLowerCase());
        const matchesPos = positionFilter === "all" || s.position === positionFilter;
        return matchesSearch && matchesPos;
    });
  }, [team, search, positionFilter]);

  const handleDelete = async (id: string, name: string) => {
    const isConfirmed = await confirm(
        "Purge Identity?",
        `Are you sure you want to remove ${name} from the active roster? This action is irreversible.`,
        { primaryActionLabel: "Purge Identity", glowColor: "239 68 68" }
    );

    if (isConfirmed) {
        const res = await deleteStaff(id);
        if (res.success) toast.success("Identity purged");
        else toast.error("Action failed");
    }
  };

  const handleCreateDummy = async () => {
    setIsCreating(true);
    const res = await createStaff({
        name: "New Team Member",
        position: "photographer",
        email: "staff@4kmoviekesri.com",
        phone: "+91 00000 00000",
        skills: ["Photography", "Lighting"],
        isActive: true,
        assignedEquipmentIds: [],
        availability: { mon: true, tue: true, wed: true, thu: true, fri: true, sat: true, sun: true }
    });
    setIsCreating(false);
    if (!res.success) toast.error("Deployment failed");
    else toast.success("New identity registered");
  };

  if (loading) return (
      <div style={{ height: "60vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "20px" }}>
          <Loader2 size={40} className="animate-spin" color="var(--accent)" />
          <p style={{ color: "var(--text-muted)", letterSpacing: "0.1em", fontSize: "0.8rem", textTransform: "uppercase" }}>Synchronizing Roster...</p>
      </div>
  );

  return (
    <div style={{ animation: "fadeIn 0.5s ease", paddingBottom: "100px" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "3rem" }}>
        <div>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "2.75rem", color: "white", marginBottom: "0.5rem" }}>Personnel</h1>
          <p style={{ color: "var(--text-muted)", fontSize: "0.95rem", letterSpacing: "0.05em" }}>Manage the high-fidelity technical team behind the production</p>
        </div>
        
        <button 
           onClick={handleCreateDummy}
           disabled={isCreating}
           className="btn btn-primary" 
           style={{ display: "flex", alignItems: "center", gap: 10, padding: "14px 28px" }}
        >
          {isCreating ? <Loader2 size={18} className="animate-spin" /> : <Plus size={18} />} Integrate Staff
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
            placeholder="Search identities, skills, or emails..."
            value={search} onChange={e => setSearch(e.target.value)}
            style={{ width: "100%", background: "transparent", border: "none", padding: "12px 12px 12px 44px", color: "white", outline: "none" }}
          />
        </div>
        <div style={{ display: "flex", gap: "10px" }}>
            {["all", "photographer", "videographer", "editor"].map(pos => (
                <button 
                    key={pos} onClick={() => setPositionFilter(pos)}
                    style={{ 
                        background: positionFilter === pos ? "rgba(255,255,255,0.1)" : "transparent",
                        border: "none", color: positionFilter === pos ? "white" : "var(--text-muted)",
                        padding: "6px 16px", borderRadius: "8px", fontSize: "0.75rem", fontWeight: 700,
                        textTransform: "uppercase", letterSpacing: "0.05em", cursor: "pointer"
                    }}
                >
                    {pos}
                </button>
            ))}
        </div>
      </div>

      {/* Grid */}
      {filteredTeam.length === 0 ? (
        <div style={{ textAlign: "center", padding: "100px 0", color: "var(--text-muted)" }}>
          <Users size={48} opacity={0.1} style={{ margin: "0 auto 20px" }} />
          <p>No active identities in this segment.</p>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(480px, 1fr))", gap: "2rem" }}>
          <AnimatePresence>
            {filteredTeam.map((staff) => (
                <StaffCard 
                    key={staff.id} 
                    staff={staff} 
                    onEdit={() => toast.info("Opening Identity Editor...")}
                    onDelete={() => handleDelete(staff.id, staff.name)}
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
