"use client";

import { useState, useEffect } from "react";
import { UserCog, Plus, Loader2, Trash2, ShieldAlert } from "lucide-react";
import { getAllAdminUsers, addAdminUser, deleteAdminUser } from "@/actions/auth";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import CustomDropdown from "@/components/ui/CustomDropdown";

const roleOptions = [
    { value: 'admin', label: 'Admin (Can edit Content)' },
    { value: 'viewer', label: 'Viewer (Read-only)' }
];

export default function AdminUsersPage() {
  const { adminData } = useAuth();
  const [users, setUsers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState<"admin" | "viewer">("admin");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const data = await getAllAdminUsers();
      setUsers(data);
    } catch (err) {
      toast.error("Failed to load admin users.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !name) return toast.error("Please fill required fields.");

    // Prevent non-owners from adding admins
    if (adminData?.role !== "owner") {
      return toast.error("Only the system owner can add new admins.");
    }

    setIsSubmitting(true);
    try {
      const result = await addAdminUser(email.toLowerCase(), name, role);
      if (result.success) {
        toast.success(`Access granted to ${email}`);
        setEmail("");
        setName("");
        fetchUsers(); // Refresh list to get exact timestamp
      } else {
        toast.error("Failed to add user.");
      }
    } catch (error) {
       toast.error("Failed to process request.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (userEmail: string, userRole: string) => {
    if (adminData?.role !== "owner") {
      return toast.error("Only the system owner can remove admins.");
    }
    if (userRole === "owner") {
      return toast.error("You cannot delete the master owner account.");
    }
    if (!confirm(`Are you sure you want to completely revoke dashboard access for ${userEmail}?`)) return;
    
    try {
      const res = await deleteAdminUser(userEmail);
      if (res.success) {
        setUsers(p => p.filter(u => u.email !== userEmail));
        toast.success("Access revoked entirely.");
      } else {
        toast.error(res.error || "Failed to remove user");
      }
    } catch (error) {
       toast.error("Failed to delete user");
    }
  };

  return (
    <div>
      <div style={{ marginBottom: "var(--space-8)" }}>
        <h1 style={{ fontSize: "1.6rem", marginBottom: 4 }}>System Access</h1>
        <p style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>Manage who can log into the dashboard using OTP authentication.</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "350px 1fr", gap: "var(--space-6)" }} className="manager-layout">
        
        {/* Add Form */}
        <div className="card" style={{ alignSelf: "start", position: "sticky", top: "calc(var(--nav-height) + 20px)" }}>
          <h3 style={{ fontSize: "1rem", marginBottom: "var(--space-5)", display: "flex", alignItems: "center", gap: 8 }}>
            <Plus size={18} color="var(--accent)" />
            Grant Access
          </h3>

          {adminData?.role !== "owner" && (
            <div style={{ padding: "10px", background: "rgba(239, 172, 68, 0.1)", color: "rgb(239, 172, 68)", borderRadius: "var(--radius-sm)", fontSize: "0.75rem", display: "flex", gap: 8, marginBottom: "var(--space-4)" }}>
               <ShieldAlert size={16} style={{ flexShrink: 0 }} /> 
               You must be the Master Owner to grant dashboard access to new employees.
            </div>
          )}
          
          <form onSubmit={handleAddUser} style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)", opacity: adminData?.role === "owner" ? 1 : 0.5, pointerEvents: adminData?.role === "owner" ? "auto" : "none" }}>
            <div>
              <label style={{ display: "block", fontSize: "0.75rem", marginBottom: 6, color: "var(--text-muted)" }}>Employee Email</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} required style={{ width: "100%", padding: "10px 12px", background: "var(--bg-elevated)", border: "1px solid var(--border)", borderRadius: "var(--radius-md)", color: "var(--text-primary)" }} placeholder="staff@example.com" />
            </div>

            <div>
              <label style={{ display: "block", fontSize: "0.75rem", marginBottom: 6, color: "var(--text-muted)" }}>Full Name</label>
              <input type="text" value={name} onChange={e => setName(e.target.value)} required style={{ width: "100%", padding: "10px 12px", background: "var(--bg-elevated)", border: "1px solid var(--border)", borderRadius: "var(--radius-md)", color: "var(--text-primary)" }} />
            </div>

            <div>
              <label style={{ display: "block", fontSize: "0.75rem", marginBottom: 6, color: "var(--text-muted)" }}>Role</label>
              <CustomDropdown 
                options={roleOptions}
                value={role}
                onChange={(val) => setRole(val as any)}
              />
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: "100%", marginTop: "var(--space-2)" }} disabled={isSubmitting}>
              {isSubmitting ? <><Loader2 size={16} className="animate-spin-slow" /> Granting...</> : "Grant Access"}
            </button>
          </form>
        </div>

        {/* Users List */}
        <div className="card" style={{ padding: 0, overflow: "hidden" }}>
          <div style={{ padding: "var(--space-5) var(--space-6)", borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
             <h3 style={{ fontSize: "1rem", margin: 0 }}>Authorized Operators ({users.length})</h3>
          </div>

          {isLoading ? (
            <div style={{ display: "flex", justifyContent: "center", padding: "var(--space-10)" }}>
              <Loader2 size={32} className="animate-spin-slow" color="var(--text-muted)" />
            </div>
          ) : users.length === 0 ? (
            <div style={{ textAlign: "center", padding: "var(--space-10)", color: "var(--text-muted)" }}>
               <UserCog size={32} style={{ margin: "0 auto 12px", opacity: 0.2 }} />
               <p>No admins found.</p>
            </div>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.85rem" }}>
                <thead>
                  <tr style={{ borderBottom: "1px solid var(--border)", background: "var(--bg-elevated)" }}>
                    <th style={{ padding: "var(--space-3) var(--space-4)", textAlign: "left", color: "var(--text-muted)", fontWeight: 600 }}>Employee</th>
                    <th style={{ padding: "var(--space-3) var(--space-4)", textAlign: "left", color: "var(--text-muted)", fontWeight: 600 }}>System Role</th>
                    <th style={{ padding: "var(--space-3) var(--space-4)", textAlign: "right", color: "var(--text-muted)", fontWeight: 600 }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u.id} style={{ borderBottom: "1px solid var(--border)" }}>
                      <td style={{ padding: "var(--space-4)" }}>
                        <div style={{ fontWeight: 600, color: "var(--text-primary)" }}>{u.name}</div>
                        <div style={{ fontSize: "0.75rem", color: "var(--text-secondary)", marginTop: 2 }}>{u.email}</div>
                      </td>
                      <td style={{ padding: "var(--space-4)" }}>
                         <span className={u.role === "owner" ? "badge badge-gold" : "badge badge-accent"} style={{ textTransform: "uppercase", fontSize: "0.6rem" }}>
                           {u.role}
                         </span>
                      </td>
                      <td style={{ padding: "var(--space-4)", textAlign: "right" }}>
                        {u.role !== "owner" && (
                          <button onClick={() => handleDelete(u.email, u.role)} style={{ background: "transparent", border: "none", color: "var(--error)", cursor: adminData?.role === "owner" ? "pointer" : "not-allowed", padding: "4px", opacity: adminData?.role === "owner" ? 1 : 0.3 }} title="Revoke Access">
                            <Trash2 size={16} />
                          </button>
                        )}
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
