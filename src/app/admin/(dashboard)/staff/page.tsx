"use client";

import { useState, useEffect } from "react";
import { Users, Plus, Loader2, Trash2 } from "lucide-react";
import { db } from "@/lib/firebase";
import { collection, addDoc, getDocs, deleteDoc, doc, query, orderBy, updateDoc } from "firebase/firestore";
import type { Staff } from "@/types";
import { toast } from "sonner";

export default function StaffManagerPage() {
  const [staff, setStaff] = useState<Staff[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [name, setName] = useState("");
  const [position, setPosition] = useState("photographer");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [salary, setSalary] = useState<number | "">("");

  useEffect(() => {
    fetchStaff();
  }, []);

  const fetchStaff = async () => {
    try {
      const q = query(collection(db, "staff"), orderBy("createdAt", "desc"));
      const snap = await getDocs(q);
      const data = snap.docs.map(d => ({ id: d.id, ...d.data() })) as Staff[];
      setStaff(data);
    } catch (err) {
      toast.error("Failed to fetch staff details.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddStaff = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !phone) return toast.error("Please fill required fields.");

    setIsSubmitting(true);
    try {
      const newStaff: Omit<Staff, "id"> = {
        name,
        position: position as any,
        email,
        phone,
        salary: Number(salary) || 0,
        skills: [],
        assignedEquipmentIds: [],
        availability: { mon: true, tue: true, wed: true, thu: true, fri: true, sat: true, sun: true },
        isActive: true,
        createdAt: Date.now()
      };

      const docRef = await addDoc(collection(db, "staff"), newStaff);
      setStaff(prev => [{ id: docRef.id, ...newStaff }, ...prev]);
      
      toast.success("Staff member added!");
      setName("");
      setEmail("");
      setPhone("");
      setSalary("");
      
    } catch (error) {
      toast.error("Failed to add staff");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to remove this staff member?")) return;
    try {
      await deleteDoc(doc(db, "staff", id));
      setStaff(p => p.filter(s => s.id !== id));
      toast.success("Staff member deleted");
    } catch (error) {
       toast.error("Failed to remove staff");
    }
  };

  const toggleActive = async (id: string, currentVal: boolean) => {
    try {
      await updateDoc(doc(db, "staff", id), { isActive: !currentVal });
      setStaff(p => p.map(s => s.id === id ? { ...s, isActive: !currentVal } : s));
      toast.success("Status updated");
    } catch (error) {
       toast.error("Failed to update status");
    }
  };

  return (
    <div>
      <div style={{ marginBottom: "var(--space-8)" }}>
        <h1 style={{ fontSize: "1.6rem", marginBottom: 4 }}>Staff Management</h1>
        <p style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>Manage your team of videographers, photographers, and editors.</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "350px 1fr", gap: "var(--space-6)" }} className="manager-layout">
        
        {/* Add Form */}
        <div className="card" style={{ alignSelf: "start", position: "sticky", top: "calc(var(--nav-height) + 20px)" }}>
          <h3 style={{ fontSize: "1rem", marginBottom: "var(--space-5)", display: "flex", alignItems: "center", gap: 8 }}>
            <Plus size={18} color="var(--accent)" />
            Add Team Member
          </h3>
          
          <form onSubmit={handleAddStaff} style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
            <div>
              <label style={{ display: "block", fontSize: "0.75rem", marginBottom: 6, color: "var(--text-muted)" }}>Full Name</label>
              <input type="text" value={name} onChange={e => setName(e.target.value)} required style={{ width: "100%", padding: "10px 12px", background: "var(--bg-elevated)", border: "1px solid var(--border)", borderRadius: "var(--radius-md)", color: "var(--text-primary)" }} />
            </div>

            <div>
              <label style={{ display: "block", fontSize: "0.75rem", marginBottom: 6, color: "var(--text-muted)" }}>Position</label>
              <select value={position} onChange={e => setPosition(e.target.value)} style={{ width: "100%", padding: "10px 12px", background: "var(--bg-elevated)", border: "1px solid var(--border)", borderRadius: "var(--radius-md)", color: "var(--text-primary)" }}>
                <option value="photographer">Photographer</option>
                <option value="videographer">Videographer</option>
                <option value="editor">Video Editor</option>
                <option value="assistant">Assistant</option>
                <option value="stylist">Stylist / Makeup</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label style={{ display: "block", fontSize: "0.75rem", marginBottom: 6, color: "var(--text-muted)" }}>Email</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} required style={{ width: "100%", padding: "10px 12px", background: "var(--bg-elevated)", border: "1px solid var(--border)", borderRadius: "var(--radius-md)", color: "var(--text-primary)" }} />
            </div>

            <div>
              <label style={{ display: "block", fontSize: "0.75rem", marginBottom: 6, color: "var(--text-muted)" }}>Phone Number</label>
              <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} required style={{ width: "100%", padding: "10px 12px", background: "var(--bg-elevated)", border: "1px solid var(--border)", borderRadius: "var(--radius-md)", color: "var(--text-primary)" }} />
            </div>

            <div>
              <label style={{ display: "block", fontSize: "0.75rem", marginBottom: 6, color: "var(--text-muted)" }}>Salary / Contract Pay (₹)</label>
              <input type="number" value={salary} onChange={e => setSalary(Number(e.target.value))} style={{ width: "100%", padding: "10px 12px", background: "var(--bg-elevated)", border: "1px solid var(--border)", borderRadius: "var(--radius-md)", color: "var(--text-primary)" }} placeholder="Optional" />
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: "100%", marginTop: "var(--space-2)" }} disabled={isSubmitting}>
              {isSubmitting ? <><Loader2 size={16} className="animate-spin-slow" /> Saving...</> : "Add Staff"}
            </button>
          </form>
        </div>

        {/* Staff List */}
        <div className="card">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--space-6)" }}>
             <h3 style={{ fontSize: "1rem" }}>Current Team ({staff.length})</h3>
          </div>

          {isLoading ? (
            <div style={{ display: "flex", justifyContent: "center", padding: "var(--space-10)" }}>
              <Loader2 size={32} className="animate-spin-slow" color="var(--text-muted)" />
            </div>
          ) : staff.length === 0 ? (
            <div style={{ textAlign: "center", padding: "var(--space-10)", color: "var(--text-muted)", background: "var(--bg-elevated)", borderRadius: "var(--radius-lg)" }}>
              <Users size={32} style={{ margin: "0 auto 12px", opacity: 0.2 }} />
              <p>No staff added yet.</p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
              {staff.map(s => (
                <div key={s.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "var(--space-4)", background: "var(--bg-elevated)", border: "1px solid var(--border)", borderRadius: "var(--radius-lg)" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "var(--space-4)" }}>
                    <div style={{ width: 44, height: 44, borderRadius: "50%", background: "var(--accent)", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.2rem", fontWeight: 700 }}>
                      {s.name[0]}
                    </div>
                    <div>
                      <div style={{ fontWeight: 600, color: "var(--text-primary)", display: "flex", gap: 8, alignItems: "center" }}>
                        {s.name}
                        {!s.isActive && <span style={{ fontSize: "0.6rem", padding: "2px 6px", background: "rgba(239, 68, 68, 0.1)", color: "var(--error)", borderRadius: 4, textTransform: "uppercase" }}>Inactive</span>}
                      </div>
                      <div style={{ fontSize: "0.75rem", color: "var(--accent)", marginTop: 2, textTransform: "capitalize" }}>{s.position}</div>
                      <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: 2 }}>{s.phone} • {s.email}</div>
                    </div>
                  </div>
                  
                  <div style={{ display: "flex", gap: 8 }}>
                    <button onClick={() => toggleActive(s.id, s.isActive)} className={s.isActive ? "btn btn-ghost btn-sm" : "btn btn-primary btn-sm"} style={{ fontSize: "0.7rem", padding: "4px 8px" }}>
                      {s.isActive ? "Deactivate" : "Activate"}
                    </button>
                    <button onClick={() => handleDelete(s.id)} style={{ background: "transparent", border: "none", color: "var(--error)", cursor: "pointer", padding: "4px" }}>
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

      <style>{`
        @media (max-width: 900px) {
          .manager-layout { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
