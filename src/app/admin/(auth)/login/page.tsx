"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { sendOtp, verifyOtp } from "@/actions/auth";
import { signInWithCustomToken } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Lock, ArrowRight, ArrowLeft, Camera, Loader2, ShieldCheck } from "lucide-react";

export default function AdminLoginPage() {
  const [step, setStep]       = useState<"email" | "otp">("email");
  const [email, setEmail]     = useState("");
  const [otp, setOtp]         = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");
  const router = useRouter();

  // ─── Handle Email Submit ────────────────────────────────────────────────
  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await sendOtp(email);
    setLoading(false);
    if (res.success) {
      toast.success("OTP sent to your email!", { duration: 5000 });
      setStep("otp");
    } else {
      setError(res.error || "Failed to send OTP");
    }
  };

  // ─── Handle OTP Input ───────────────────────────────────────────────────
  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    // Auto-advance
    if (value && index < 5) {
      const next = document.getElementById(`otp-${index + 1}`);
      next?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      const prev = document.getElementById(`otp-${index - 1}`);
      prev?.focus();
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent) => {
    const pasted = e.clipboardData.getData("text").slice(0, 6).split("");
    setOtp([...pasted, ...Array(6 - pasted.length).fill("")]);
    document.getElementById(`otp-5`)?.focus();
  };

  // ─── Handle OTP Verify ──────────────────────────────────────────────────
  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const otpStr = otp.join("");
    if (otpStr.length < 6) { setError("Enter all 6 digits"); return; }
    setLoading(true);
    setError("");

    const res = await verifyOtp(email, otpStr);
    if (res.success && res.token) {
      try {
        await signInWithCustomToken(auth, res.token);
        toast.success("Welcome back! Redirecting...");
        setTimeout(() => router.push("/admin/dashboard"), 800);
      } catch {
        setError("Sign-in failed. Please try again.");
        setLoading(false);
      }
    } else {
      setError(res.error || "Invalid OTP");
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100svh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "var(--bg-primary)",
        padding: "var(--space-4)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background orbs */}
      <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none" }}>
        <div style={{ position: "absolute", top: "-20%", left: "-10%", width: "50vw", height: "50vw", borderRadius: "50%", background: "radial-gradient(circle, rgba(232,85,10,0.08) 0%, transparent 70%)", filter: "blur(80px)" }} />
        <div style={{ position: "absolute", bottom: "-20%", right: "-10%", width: "40vw", height: "40vw", borderRadius: "50%", background: "radial-gradient(circle, rgba(201,168,76,0.06) 0%, transparent 70%)", filter: "blur(80px)" }} />
      </div>

      <div
        style={{
          width: "100%",
          maxWidth: 900,
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          borderRadius: "var(--radius-2xl)",
          overflow: "hidden",
          border: "1px solid var(--border)",
          boxShadow: "var(--shadow-lg)",
          position: "relative",
          zIndex: 1,
        }}
        className="login-grid"
      >
        {/* Left Panel — Branding */}
        <div
          style={{
            background: `linear-gradient(160deg, #1a0800 0%, #0E0E0E 50%, #0a0500 100%)`,
            padding: "var(--space-12)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Decorative circles */}
          <div style={{ position: "absolute", top: -60, right: -60, width: 200, height: 200, borderRadius: "50%", border: "1px solid rgba(232,85,10,0.15)" }} />
          <div style={{ position: "absolute", top: -30, right: -30, width: 140, height: 140, borderRadius: "50%", border: "1px solid rgba(232,85,10,0.08)" }} />
          <div style={{ position: "absolute", bottom: -40, left: -40, width: 160, height: 160, borderRadius: "50%", border: "1px solid rgba(232,85,10,0.1)" }} />

          {/* Icon */}
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: "50%",
              border: "2px solid var(--accent)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: "var(--space-6)",
              background: "var(--accent-muted)",
            }}
          >
            <Camera size={28} color="var(--accent)" />
          </div>

          {/* Brand name */}
          <div style={{ marginBottom: "var(--space-6)" }}>
            <div style={{ fontFamily: "var(--font-heading)", fontWeight: 900, fontSize: "1.6rem", color: "var(--text-primary)", lineHeight: 1.1, letterSpacing: "-0.03em", marginBottom: 4 }}>
              4K MOVIE<br />KESRI SURAT
            </div>
            <div style={{ fontSize: "0.65rem", color: "var(--accent)", letterSpacing: "0.15em", textTransform: "uppercase" }}>
              Admin Panel
            </div>
          </div>

          {/* Quote */}
          <blockquote
            style={{
              borderLeft: "3px solid var(--accent)",
              paddingLeft: "var(--space-4)",
              marginBottom: "var(--space-8)",
            }}
          >
            <p style={{ fontSize: "1.05rem", color: "var(--text-secondary)", fontStyle: "italic", lineHeight: 1.6, margin: 0 }}>
              &ldquo;Every Frame<br />Tells a Story&rdquo;
            </p>
          </blockquote>

          {/* Security notice */}
          <div style={{ display: "flex", alignItems: "center", gap: "var(--space-2)" }}>
            <ShieldCheck size={14} color="var(--text-muted)" />
            <span style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>Secured with 2-Factor Authentication</span>
          </div>
        </div>

        {/* Right Panel — Form */}
        <div
          style={{
            background: "var(--bg-card)",
            padding: "var(--space-12)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <AnimatePresence mode="wait">
            {/* Step 1: Email */}
            {step === "email" && (
              <motion.div
                key="email"
                initial={{ x: -30, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -30, opacity: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
              >
                <h2 style={{ fontSize: "1.75rem", marginBottom: "var(--space-1)" }}>
                  Welcome Back
                </h2>
                <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginBottom: "var(--space-8)" }}>
                  Enter your admin email to continue. An OTP will be sent.
                </p>

                <form onSubmit={handleEmailSubmit} style={{ display: "flex", flexDirection: "column", gap: "var(--space-5)" }}>
                  <div>
                    <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 600, color: "var(--text-muted)", marginBottom: "var(--space-2)", letterSpacing: "0.04em", textTransform: "uppercase" }}>
                      Email Address
                    </label>
                    <div style={{ position: "relative" }}>
                      <Mail size={16} style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="admin@4kmoviekesri.com"
                        className="input-field"
                        style={{ paddingLeft: 44 }}
                        id="admin-email"
                        autoFocus
                      />
                    </div>
                  </div>

                  {error && (
                    <div className="badge badge-error" style={{ padding: "8px 14px", borderRadius: "var(--radius-lg)", width: "100%", justifyContent: "flex-start", fontSize: "0.8rem" }}>
                      {error}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="btn btn-primary btn-lg"
                    style={{ width: "100%", justifyContent: "center" }}
                    id="send-otp-btn"
                  >
                    {loading ? (
                      <><Loader2 size={16} className="animate-spin" /> Sending OTP...</>
                    ) : (
                      <>Continue <ArrowRight size={16} /></>
                    )}
                  </button>
                </form>
              </motion.div>
            )}

            {/* Step 2: OTP */}
            {step === "otp" && (
              <motion.div
                key="otp"
                initial={{ x: 30, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: 30, opacity: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
              >
                <div style={{ width: 52, height: 52, borderRadius: "50%", background: "var(--success-bg)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "var(--space-5)" }}>
                  <Lock size={22} color="var(--success)" />
                </div>
                <h2 style={{ fontSize: "1.75rem", marginBottom: "var(--space-1)" }}>
                  Verify OTP
                </h2>
                <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginBottom: "var(--space-8)" }}>
                  Enter the 6-digit code sent to{" "}
                  <span style={{ color: "var(--text-primary)", fontWeight: 600 }}>{email}</span>
                </p>

                <form onSubmit={handleOtpSubmit} style={{ display: "flex", flexDirection: "column", gap: "var(--space-5)" }}>
                  {/* OTP boxes */}
                  <div style={{ display: "flex", gap: "var(--space-2)", justifyContent: "center" }} onPaste={handleOtpPaste}>
                    {otp.map((digit, i) => (
                      <input
                        key={i}
                        id={`otp-${i}`}
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleOtpChange(i, e.target.value)}
                        onKeyDown={(e) => handleOtpKeyDown(i, e)}
                        style={{
                          width: 48,
                          height: 56,
                          textAlign: "center",
                          fontSize: "1.5rem",
                          fontWeight: 700,
                          fontFamily: "var(--font-mono)",
                          background: "var(--bg-elevated)",
                          border: `2px solid ${digit ? "var(--accent)" : "var(--border)"}`,
                          borderRadius: "var(--radius-lg)",
                          color: "var(--text-primary)",
                          outline: "none",
                          transition: "border-color var(--transition-fast)",
                        }}
                        autoFocus={i === 0}
                      />
                    ))}
                  </div>

                  {error && (
                    <div className="badge badge-error" style={{ padding: "8px 14px", borderRadius: "var(--radius-lg)", width: "100%", justifyContent: "flex-start", fontSize: "0.8rem" }}>
                      {error}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={loading || otp.join("").length < 6}
                    className="btn btn-primary btn-lg"
                    style={{ width: "100%", justifyContent: "center" }}
                    id="verify-otp-btn"
                  >
                    {loading ? (
                      <><Loader2 size={16} /> Verifying...</>
                    ) : (
                      <>Verify & Login <ArrowRight size={16} /></>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => { setStep("email"); setError(""); setOtp(Array(6).fill("")); }}
                    style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer", fontSize: "0.82rem", display: "flex", alignItems: "center", gap: 6, justifyContent: "center" }}
                  >
                    <ArrowLeft size={14} /> Back to Email
                  </button>
                </form>
              </motion.div>
            )}
          </AnimatePresence>

          <p style={{ fontSize: "0.72rem", color: "var(--text-muted)", textAlign: "center", marginTop: "var(--space-8)" }}>
            Session persists for 30 days · Secure 2FA
          </p>
        </div>
      </div>

      <style>{`
        .login-grid { grid-template-columns: 1fr 1fr !important; }
        @media (max-width: 640px) {
          .login-grid { grid-template-columns: 1fr !important; }
          .login-grid > div:first-child { display: none !important; }
        }
        .animate-spin { animation: spin 1s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
