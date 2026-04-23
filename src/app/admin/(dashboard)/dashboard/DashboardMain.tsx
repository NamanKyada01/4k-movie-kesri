"use client";

import React from "react";
import Link from "next/link";
import { 
  CalendarDays, 
  Camera, 
  MessageSquare, 
  TrendingUp, 
  ArrowRight, 
  HardDrive,
  Users,
  LayoutDashboard,
  ShieldCheck,
  Plus
} from "lucide-react";
import { motion } from "framer-motion";
import type { Event, ContactInquiry } from "@/types";
import { SpotlightCard } from "@/components/ui/SpotlightCard";
import TiltedCard from "@/components/ui/TiltedCard";

interface DashboardMainProps {
  stats: {
    totalEvents: number;
    totalPhotos: number;
    pendingInquiries: number;
  };
  upcomingEvents: Event[];
  recentInquiries: ContactInquiry[];
  greeting: string;
}

const containerVars = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVars: any = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } }
};

export default function DashboardMain({ stats, upcomingEvents, recentInquiries, greeting }: DashboardMainProps) {
  const dateStr = new Date().toLocaleDateString("en-IN", { 
    weekday: "long", day: "numeric", month: "long", year: "numeric" 
  });

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVars}
      style={{ paddingBottom: "100px" }}
    >
      {/* Cinematic Header */}
      <motion.div variants={itemVars} style={{ marginBottom: "4rem", display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
        <div>
          <h1 style={{ 
            fontFamily: "'Playfair Display', serif", 
            fontSize: "3.5rem", 
            color: "white", 
            margin: 0,
            lineHeight: 1.1
          }}>
            {greeting}
          </h1>
          <p style={{ color: "var(--text-muted)", fontSize: "1rem", letterSpacing: "0.15em", textTransform: "uppercase", marginTop: "1rem", fontWeight: 700 }}>
            {dateStr} · Command Center
          </p>
        </div>
        
        <div style={{ display: "flex", gap: "10px" }}>
             <Link href="/admin/invoices/new" className="btn btn-primary" style={{ padding: "14px 24px", display: "flex", alignItems: "center", gap: "10px" }}>
                <Plus size={18} /> New Invoice
             </Link>
        </div>
      </motion.div>

      {/* Stats Vault */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "2rem", marginBottom: "4rem" }}>
         {[
           { title: "Production Events", val: stats.totalEvents, icon: CalendarDays, sub: "Scheduled Archives" },
           { title: "Asset Vault", val: stats.totalPhotos, icon: Camera, sub: "High-Res Deliverables" },
           { title: "Incoming Queries", val: stats.pendingInquiries, icon: MessageSquare, sub: "Pending Responses", urgent: stats.pendingInquiries > 0 },
           { title: "Studio Growth", val: "—", icon: TrendingUp, sub: "Month-over-Month" },
         ].map((s, i) => (
           <motion.div key={i} variants={itemVars}>
             <SpotlightCard
               style={{ 
                 padding: "30px", 
                 background: "rgba(255,255,255,0.02)", 
                 border: "1px solid rgba(255,255,255,0.06)",
                 borderRadius: "24px" 
               }}
               spotlightColor={s.urgent ? "rgba(239, 68, 68, 0.1)" : "rgba(255, 255, 255, 0.05)"}
             >
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px" }}>
                    <s.icon size={24} color={s.urgent ? "#ff4444" : "var(--accent)"} />
                    <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: s.urgent ? "#ff4444" : "var(--accent)" }} />
                </div>
                <div style={{ fontSize: "2.5rem", fontWeight: 900, color: "white", marginBottom: "4px" }}>{s.val}</div>
                <div style={{ color: "var(--text-muted)", fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 700 }}>{s.title}</div>
                <div style={{ color: "rgba(255,255,255,0.15)", fontSize: "0.65rem", marginTop: "12px", fontWeight: 600 }}>{s.sub}</div>
             </SpotlightCard>
           </motion.div>
         ))}
      </div>

      {/* Secondary Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "1.2fr 0.8fr", gap: "3rem" }}>
         
         {/* Live Production Feed */}
         <motion.div variants={itemVars}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
                <h3 style={{ fontSize: "1.25rem", color: "white", fontWeight: 800, margin: 0 }}>Upcoming Productions</h3>
                <Link href="/admin/event-management" style={{ color: "var(--accent)", fontSize: "0.85rem", fontWeight: 700, textDecoration: "none", display: "flex", alignItems: "center", gap: "6px" }}>
                    Archives <ArrowRight size={14} />
                </Link>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                {upcomingEvents.length === 0 ? (
                    <div style={{ padding: "60px", background: "rgba(255,255,255,0.015)", borderRadius: "20px", border: "1px dashed rgba(255,255,255,0.05)", textAlign: "center" }}>
                        <p style={{ color: "var(--text-muted)", margin: 0 }}>The event ledger is currently empty.</p>
                    </div>
                ) : (
                    upcomingEvents.map(ev => (
                        <div key={ev.id} style={{ 
                            padding: "20px 24px", 
                            background: "rgba(255,255,255,0.02)", 
                            border: "1px solid rgba(255,255,255,0.05)", 
                            borderRadius: "16px",
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center"
                        }}>
                            <div>
                                <div style={{ fontSize: "0.65rem", color: "var(--accent)", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "4px" }}>
                                    {new Date(ev.date).toLocaleDateString("en-IN", { day: '2-digit', month: 'short' })} · {ev.type}
                                </div>
                                <div style={{ fontSize: "1rem", fontWeight: 800, color: "white" }}>{ev.name}</div>
                                <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginTop: "2px" }}>{ev.clientName}</div>
                            </div>
                            <Link href={`/admin/event-management?id=${ev.id}`} style={{ 
                                width: "40px", height: "40px", borderRadius: "10px", 
                                background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)",
                                display: "flex", alignItems: "center", justifyContent: "center", color: "white"
                            }}>
                                <ArrowRight size={16} />
                            </Link>
                        </div>
                    ))
                )}
            </div>
         </motion.div>

         {/* Studio Integrity */}
         <motion.div variants={itemVars}>
             <h3 style={{ fontSize: "1.25rem", color: "white", fontWeight: 800, marginBottom: "2rem" }}>Studio Integrity</h3>
             
             <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                <SpotlightCard style={{ padding: "24px", background: "rgba(255,255,255,0.02)", borderRadius: "18px", border: "1px solid rgba(255,255,255,0.05)" }}>
                    <div style={{ display: "flex", gap: "16px", marginBottom: "20px" }}>
                        <div style={{ width: "40px", height: "40px", background: "rgba(232, 85, 10, 0.1)", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--accent)" }}>
                            <ShieldCheck size={20} />
                        </div>
                        <div>
                            <div style={{ fontSize: "0.95rem", color: "white", fontWeight: 800 }}>System Health</div>
                            <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "2px" }}>Single Studio Mode Active</div>
                        </div>
                    </div>
                    <div style={{ height: "4px", background: "rgba(255,255,255,0.05)", borderRadius: "2px", overflow: "hidden" }}>
                        <div style={{ width: "98%", height: "100%", background: "var(--accent)" }} />
                    </div>
                </SpotlightCard>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                    <Link href="/admin/staff" style={{ textDecoration: "none" }}>
                        <div style={{ padding: "20px", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: "16px", textAlign: "center" }}>
                            <Users size={20} color="var(--accent)" style={{ marginBottom: "10px" }} />
                            <div style={{ fontSize: "0.85rem", color: "white", fontWeight: 700 }}>Personnel</div>
                        </div>
                    </Link>
                    <Link href="/admin/equipment" style={{ textDecoration: "none" }}>
                        <div style={{ padding: "20px", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: "16px", textAlign: "center" }}>
                            <HardDrive size={20} color="var(--accent)" style={{ marginBottom: "10px" }} />
                            <div style={{ fontSize: "0.85rem", color: "white", fontWeight: 700 }}>Inventory</div>
                        </div>
                    </Link>
                </div>
             </div>
         </motion.div>
      </div>
    </motion.div>
  );
}
