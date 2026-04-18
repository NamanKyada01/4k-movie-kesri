"use client";

import { useState, useEffect } from "react";
import { Camera, Plus, Loader2, Trash2 } from "lucide-react";
import { db } from "@/lib/firebase";
import { collection, addDoc, getDocs, deleteDoc, doc, query, orderBy, updateDoc } from "firebase/firestore";
import type { Equipment } from "@/types";
import { toast } from "sonner";

export default function EquipmentManagerPage() {
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [name, setName] = useState("");
  const [category, setCategory] = useState("camera");
  const [condition, setCondition] = useState("available");
  const [quantity, setQuantity] = useState<number | "">(1);

  useEffect(() => {
    fetchEquipment();
  }, []);

  const fetchEquipment = async () => {
    try {
      const q = query(collection(db, "equipment"), orderBy("createdAt", "desc"));
      const snap = await getDocs(q);
      const data = snap.docs.map(d => ({ id: d.id, ...d.data() })) as Equipment[];
      setEquipment(data);
    } catch (err) {
      toast.error("Failed to fetch equipment details.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddEquipment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !quantity) return toast.error("Please fill required fields.");

    setIsSubmitting(true);
    try {
      const newEquip: Omit<Equipment, "id"> = {
        name,
        category: category as any,
        condition: condition as any,
        quantity: Number(quantity) || 1,
        images: [],
        createdAt: Date.now()
      };

      const docRef = await addDoc(collection(db, "equipment"), newEquip);
      setEquipment(prev => [{ id: docRef.id, ...newEquip }, ...prev]);
      
      toast.success("Equipment logged successfully!");
      setName("");
      setQuantity(1);
      
    } catch (error) {
      toast.error("Failed to add equipment");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Remove this equipment from inventory?")) return;
    try {
      await deleteDoc(doc(db, "equipment", id));
      setEquipment(p => p.filter(e => e.id !== id));
      toast.success("Equipment deleted");
    } catch (error) {
       toast.error("Failed to delete equipment");
    }
  };

  const updateCondition = async (id: string, newCondition: string) => {
    try {
      await updateDoc(doc(db, "equipment", id), { condition: newCondition });
      setEquipment(p => p.map(e => e.id === id ? { ...e, condition: newCondition as any } : e));
      toast.success("Condition updated");
    } catch (error) {
       toast.error("Failed to update condition");
    }
  };

  return (
    <div>
      <div style={{ marginBottom: "var(--space-8)" }}>
        <h1 style={{ fontSize: "1.6rem", marginBottom: 4 }}>Equipment Management</h1>
        <p style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>Log your studio gear, cameras, and lenses to track inventory.</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "350px 1fr", gap: "var(--space-6)" }} className="manager-layout">
        
        {/* Add Form */}
        <div className="card" style={{ alignSelf: "start", position: "sticky", top: "calc(var(--nav-height) + 20px)" }}>
          <h3 style={{ fontSize: "1rem", marginBottom: "var(--space-5)", display: "flex", alignItems: "center", gap: 8 }}>
            <Plus size={18} color="var(--accent)" />
            Add Gear
          </h3>
          
          <form onSubmit={handleAddEquipment} style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
            <div>
              <label style={{ display: "block", fontSize: "0.75rem", marginBottom: 6, color: "var(--text-muted)" }}>Item Name / Model</label>
              <input type="text" value={name} onChange={e => setName(e.target.value)} required style={{ width: "100%", padding: "10px 12px", background: "var(--bg-elevated)", border: "1px solid var(--border)", borderRadius: "var(--radius-md)", color: "var(--text-primary)" }} placeholder="e.g. Sony a7S III" />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-4)" }}>
              <div>
                <label style={{ display: "block", fontSize: "0.75rem", marginBottom: 6, color: "var(--text-muted)" }}>Category</label>
                <select value={category} onChange={e => setCategory(e.target.value)} style={{ width: "100%", padding: "10px 12px", background: "var(--bg-elevated)", border: "1px solid var(--border)", borderRadius: "var(--radius-md)", color: "var(--text-primary)" }}>
                  <option value="camera">Camera</option>
                  <option value="lens">Lens</option>
                  <option value="light">Lighting</option>
                  <option value="drone">Drone</option>
                  <option value="audio">Audio/Mic</option>
                  <option value="accessory">Accessory</option>
                </select>
              </div>
              <div>
                <label style={{ display: "block", fontSize: "0.75rem", marginBottom: 6, color: "var(--text-muted)" }}>Quantity</label>
                <input type="number" min={1} value={quantity} onChange={e => setQuantity(Number(e.target.value))} required style={{ width: "100%", padding: "10px 12px", background: "var(--bg-elevated)", border: "1px solid var(--border)", borderRadius: "var(--radius-md)", color: "var(--text-primary)" }} />
              </div>
            </div>

            <div>
              <label style={{ display: "block", fontSize: "0.75rem", marginBottom: 6, color: "var(--text-muted)" }}>Current Condition</label>
              <select value={condition} onChange={e => setCondition(e.target.value)} style={{ width: "100%", padding: "10px 12px", background: "var(--bg-elevated)", border: "1px solid var(--border)", borderRadius: "var(--radius-md)", color: "var(--text-primary)" }}>
                <option value="available">Available / Working</option>
                <option value="in-repair">In Repair</option>
                <option value="sold">Sold / Lost</option>
              </select>
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: "100%", marginTop: "var(--space-2)" }} disabled={isSubmitting}>
              {isSubmitting ? <><Loader2 size={16} className="animate-spin-slow" /> Adding...</> : "Add to Inventory"}
            </button>
          </form>
        </div>

        {/* Equipment List */}
        <div className="card" style={{ padding: 0, overflow: "hidden" }}>
          <div style={{ padding: "var(--space-5) var(--space-6)", borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
             <h3 style={{ fontSize: "1rem", margin: 0 }}>Inventory ({equipment.length})</h3>
          </div>

          {isLoading ? (
            <div style={{ display: "flex", justifyContent: "center", padding: "var(--space-10)" }}>
              <Loader2 size={32} className="animate-spin-slow" color="var(--text-muted)" />
            </div>
          ) : equipment.length === 0 ? (
            <div style={{ textAlign: "center", padding: "var(--space-10)", color: "var(--text-muted)" }}>
              <Camera size={32} style={{ margin: "0 auto 12px", opacity: 0.2 }} />
              <p>No equipment logged yet.</p>
            </div>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.85rem" }}>
                <thead>
                  <tr style={{ borderBottom: "1px solid var(--border)", background: "var(--bg-elevated)" }}>
                    <th style={{ padding: "var(--space-3) var(--space-4)", textAlign: "left", color: "var(--text-muted)", fontWeight: 600 }}>Item Name</th>
                    <th style={{ padding: "var(--space-3) var(--space-4)", textAlign: "left", color: "var(--text-muted)", fontWeight: 600 }}>Category</th>
                    <th style={{ padding: "var(--space-3) var(--space-4)", textAlign: "center", color: "var(--text-muted)", fontWeight: 600 }}>Qty</th>
                    <th style={{ padding: "var(--space-3) var(--space-4)", textAlign: "left", color: "var(--text-muted)", fontWeight: 600 }}>Condition</th>
                    <th style={{ padding: "var(--space-3) var(--space-4)", textAlign: "right", color: "var(--text-muted)", fontWeight: 600 }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {equipment.map((item) => (
                    <tr key={item.id} style={{ borderBottom: "1px solid var(--border)" }}>
                      <td style={{ padding: "var(--space-4)", fontWeight: 600 }}>
                        {item.name}
                      </td>
                      <td style={{ padding: "var(--space-4)", textTransform: "capitalize", color: "var(--text-secondary)" }}>{item.category}</td>
                      <td style={{ padding: "var(--space-4)", textAlign: "center", color: "var(--text-secondary)" }}>{item.quantity}</td>
                      <td style={{ padding: "var(--space-4)" }}>
                        <select 
                          value={item.condition}
                          onChange={(e) => updateCondition(item.id, e.target.value)}
                          style={{ padding: "4px 8px", background: item.condition === "available" ? "rgba(16, 185, 129, 0.1)" : item.condition === "in-repair" ? "rgba(239, 172, 68, 0.1)" : "rgba(239, 68, 68, 0.1)", border: "1px solid var(--border)", borderRadius: "var(--radius-sm)", color: item.condition === "available" ? "rgb(16, 185, 129)" : item.condition === "in-repair" ? "rgb(239, 172, 68)" : "var(--error)", fontSize: "0.75rem", fontWeight: 600 }}
                        >
                          <option value="available">Available</option>
                          <option value="in-repair">In Repair</option>
                          <option value="sold">Sold/Lost</option>
                        </select>
                      </td>
                      <td style={{ padding: "var(--space-4)", textAlign: "right" }}>
                        <button onClick={() => handleDelete(item.id)} style={{ background: "transparent", border: "none", color: "var(--text-muted)", cursor: "pointer", padding: "4px" }} title="Delete Gear">
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
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
