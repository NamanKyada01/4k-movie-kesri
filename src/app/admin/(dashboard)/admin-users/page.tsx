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
    <div style={{ paddingBottom: "100px" }}>
      <div style={{ marginBottom: "var(--space-10)" }}>
        <h1 style={{ fontSize: "3rem", fontWeight: 800, letterSpacing: "-0.04em", marginBottom: 4, fontFamily: "Epilogue, sans-serif", textTransform: "uppercase" }}>Users</h1>
        <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", maxWidth: "600px" }}>Manage administrative access and studio permissions.</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-10)" }} className="manager-layout">
        
        {/* Add Form */}
        <div style={{ 
          background: "rgba(25, 25, 25, 0.4)", 
          backdropFilter: "blur(40px)", 
          padding: "var(--space-8)", 
          borderRadius: "var(--radius-xl)",
          border: "1px solid rgba(255, 255, 255, 0.03)",
          alignSelf: "start",
          position: "sticky",
          top: "calc(var(--nav-height) + 20px)"
        }}>
          <h3 style={{ fontSize: "1.2rem", fontWeight: 700, marginBottom: "var(--space-6)", color: "var(--accent)", fontFamily: "Epilogue, sans-serif", textTransform: "uppercase", letterSpacing: "0.05em" }}>Grant Access</h3>

          {adminData?.role !== "owner" && (
            <div style={{ padding: "14px", background: "rgba(232, 85, 10, 0.1)", color: "var(--accent)", borderRadius: "var(--radius-lg)", fontSize: "0.8rem", display: "flex", gap: 10, marginBottom: "var(--space-6)", border: "1px solid rgba(232, 85, 10, 0.2)" }}>
               <ShieldAlert size={18} style={{ flexShrink: 0 }} /> 
               Master Owner privileges required to authorize new personnel.
            </div>
          )}
          
          <form onSubmit={handleAddUser} style={{ display: "flex", flexDirection: "column", gap: "var(--space-6)", opacity: adminData?.role === "owner" ? 1 : 0.4, pointerEvents: adminData?.role === "owner" ? "auto" : "none" }}>
            <div>
              <label style={{ display: "block", fontSize: "0.7rem", fontWeight: 600, marginBottom: 8, color: "var(--text-muted)", textTransform: "uppercase" }}>Professional Email</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} required style={{ width: "100%", padding: "10px 0", background: "transparent", border: "none", borderBottom: "1px solid rgba(255,255,255,0.1)", color: "var(--text-primary)", fontSize: "1rem", outline: "none" }} placeholder="personnel@4kmoviekesri.com" />
            </div>

            <div>
              <label style={{ display: "block", fontSize: "0.7rem", fontWeight: 600, marginBottom: 8, color: "var(--text-muted)", textTransform: "uppercase" }}>Full Legal Name</label>
              <input type="text" value={name} onChange={e => setName(e.target.value)} required style={{ width: "100%", padding: "10px 0", background: "transparent", border: "none", borderBottom: "1px solid rgba(255,255,255,0.1)", color: "var(--text-primary)", fontSize: "1rem", outline: "none" }} />
            </div>

            <div>
              <label style={{ display: "block", fontSize: "0.7rem", fontWeight: 600, marginBottom: 8, color: "var(--text-muted)", textTransform: "uppercase" }}>Authority Tier</label>
              <CustomDropdown 
                options={roleOptions}
                value={role}
                onChange={(val) => setRole(val as any)}
              />
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: "100%", padding: "14px", fontWeight: 700, borderRadius: "100px", background: "linear-gradient(135deg, #E8550A, #C9A84C)", marginTop: "var(--space-2)" }} disabled={isSubmitting}>
              {isSubmitting ? <><Loader2 size={18} className="animate-spin-slow" /> Authorizing...</> : "Authorize Access"}
            </button>
          </form>
        </div>

        {/* Users List */}
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-6)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
             <h3 style={{ fontSize: "0.9rem", textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--text-muted)" }}>Authorized Personnel ({users.length})</h3>
          </div>

          {isLoading ? (
            <div style={{ display: "flex", justifyContent: "center", padding: "var(--space-10)" }}>
              <Loader2 size={40} className="animate-spin-slow" color="var(--accent)" />
            </div>
          ) : users.length === 0 ? (
            <div style={{ textAlign: "center", padding: "var(--space-10)", color: "var(--text-muted)", background: "rgba(25,25,25,0.4)", borderRadius: "var(--radius-xl)", border: "1px solid rgba(255,255,255,0.03)" }}>
               <UserCog size={40} style={{ margin: "0 auto 16px", opacity: 0.1 }} />
               <p>No personnel listed.</p>
            </div>
          ) : (
            <div style={{ display: "grid", gap: "var(--space-4)" }}>
              {users.map((u) => (
                <div key={u.id} style={{ 
                  padding: "var(--space-6)", 
                  background: "rgba(25, 25, 25, 0.4)", 
                  backdropFilter: "blur(40px)",
                  borderRadius: "var(--radius-xl)", 
                  border: "1px solid rgba(255, 255, 255, 0.03)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between"
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                    <div style={{ width: 44, height: 44, borderRadius: "50%", background: "rgba(255,255,255,0.05)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.2rem", fontWeight: 700, color: "var(--accent)" }}>
                      {u.name.charAt(0)}
                    </div>
                    <div>
                      <div style={{ fontWeight: 700, color: "var(--text-primary)", fontSize: "1rem" }}>{u.name}</div>
                      <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginTop: 2 }}>{u.email}</div>
                    </div>
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
                    <span 
                      style={{ 
                        textTransform: "uppercase", 
                        fontSize: "0.65rem", 
                        fontWeight: 800, 
                        letterSpacing: "0.1em",
                        padding: "4px 12px",
                        borderRadius: "100px",
                        background: u.role === "owner" ? "rgba(201, 168, 76, 0.2)" : "rgba(255,255,255,0.05)",
                        color: u.role === "owner" ? "var(--gold)" : "var(--text-muted)",
                        border: u.role === "owner" ? "1px solid var(--gold)" : "1px solid transparent",
                        boxShadow: u.role === "owner" ? "0 0 10px rgba(201, 168, 76, 0.3)" : "none"
                      }}
                    >
                      {u.role}
                    </span>

                    {u.role !== "owner" && (
                      <button 
                        onClick={() => handleDelete(u.email, u.role)} 
                        disabled={adminData?.role !== "owner"}
                        style={{ 
                          background: "transparent", 
                          border: "none", 
                          color: "var(--error)", 
                          cursor: adminData?.role === "owner" ? "pointer" : "not-allowed", 
                          opacity: adminData?.role === "owner" ? 0.6 : 0.1,
                          transition: "opacity 0.2s"
                        }}
                        className="revoke-btn"
                      >
                        <Trash2 size={18} />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

      <style>{`
        .revoke-btn:hover { opacity: 1 !important; }
        @media (max-width: 1000px) {
          .manager-layout { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
