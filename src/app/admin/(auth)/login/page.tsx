"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { sendOtp, verifyOtp } from "@/actions/auth";
import { signInWithCustomToken } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Lock, ArrowRight, ArrowLeft, Camera, Loader2, ShieldCheck } from "lucide-react";
import Particles from "@/components/ui/Particles";
import { StarBorder } from "@/components/ui/StarBorder";
import DecryptedText from "@/components/ui/DecryptedText";
import { Magnet } from "@/components/ui/Magnet";

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
        background: "#080808",
        padding: "var(--space-4)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Cinematic Particles */}
      <div style={{ position: "absolute", inset: 0, zIndex: 0 }}>
        <Particles
          particleCount={100}
          particleColors={["#ffffff", "#E8550A", "#C9A84C"]}
          moveSpeed={0.5}
          sizeRange={[1, 3]}
          alphaRange={[0.1, 0.4]}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
        style={{ position: "relative", zIndex: 1, width: "100%", maxWidth: 900 }}
      >
        <StarBorder 
          as="div" 
          color="#E8550A" 
          speed="4s"
          style={{ 
            borderRadius: "var(--radius-2xl)", 
            overflow: "hidden",
            boxShadow: "0 20px 50px rgba(0, 0, 0, 0.5)"
          }}
        >
          <div
            style={{
              width: "100%",
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              background: "rgba(13, 13, 13, 0.95)",
              backdropFilter: "blur(10px)",
            }}
            className="login-grid"
          >
            {/* Left Panel — Branding */}
            <div
              style={{
                background: `linear-gradient(160deg, rgba(232, 85, 10, 0.05) 0%, rgba(14, 14, 14, 0) 50%)`,
                padding: "var(--space-12)",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                position: "relative",
                borderRight: "1px solid rgba(255, 255, 255, 0.05)"
              }}
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
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
                    marginBottom: "var(--space-8)",
                    background: "rgba(232, 85, 10, 0.1)",
                  }}
                >
                  <Camera size={28} color="var(--accent)" />
                </div>

                {/* Brand name */}
                <div style={{ marginBottom: "var(--space-8)" }}>
                  <DecryptedText 
                    text="4K MOVIE"
                    className="branding-title"
                    animateOn="view"
                    speed={80}
                    style={{ 
                      fontFamily: "var(--font-heading)", 
                      fontWeight: 900, 
                      fontSize: "2rem", 
                      color: "var(--text-primary)", 
                      lineHeight: 1, 
                      letterSpacing: "-0.03em"
                    }}
                  />
                  <br />
                  <DecryptedText 
                    text="KESRI SURAT"
                    animateOn="view"
                    speed={100}
                    style={{ 
                      fontFamily: "var(--font-heading)", 
                      fontWeight: 900, 
                      fontSize: "1.6rem", 
                      color: "var(--text-primary)", 
                      lineHeight: 1, 
                      letterSpacing: "-0.03em"
                    }}
                  />
                  <div style={{ fontSize: "0.65rem", color: "var(--accent)", letterSpacing: "0.15em", textTransform: "uppercase", marginTop: 8, fontWeight: 700 }}>
                    Command Center
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
                  <p style={{ fontSize: "1.05rem", color: "var(--text-muted)", fontStyle: "italic", lineHeight: 1.6, margin: 0 }}>
                    &ldquo;Every Frame Tells a Story&rdquo;
                  </p>
                </blockquote>

                {/* Security notice */}
                <div style={{ display: "flex", alignItems: "center", gap: "var(--space-3)", opacity: 0.6 }}>
                  <ShieldCheck size={16} color="var(--accent)" />
                  <span style={{ fontSize: "0.72rem", color: "var(--text-muted)", fontWeight: 500 }}>Secured Access Layer v2.4</span>
                </div>
              </motion.div>
            </div>

            {/* Right Panel — Form */}
            <div
              style={{
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
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: -20, opacity: 0 }}
                    transition={{ duration: 0.4 }}
                  >
                    <DecryptedText 
                      text="Welcome Back"
                      className="step-title"
                      style={{ fontSize: "1.75rem", fontWeight: 800, marginBottom: "var(--space-2)" }}
                    />
                    <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginBottom: "var(--space-10)" }}>
                      Identify your administrative credentials to request access.
                    </p>

                    <form onSubmit={handleEmailSubmit} style={{ display: "flex", flexDirection: "column", gap: "var(--space-6)" }}>
                      <div className="form-field">
                        <label style={{ display: "block", fontSize: "0.7rem", fontWeight: 700, color: "var(--accent)", marginBottom: "var(--space-3)", letterSpacing: "0.1em", textTransform: "uppercase" }}>
                          Admin Identifier
                        </label>
                        <div style={{ position: "relative" }}>
                          <Mail size={16} style={{ position: "absolute", left: 0, top: "50%", transform: "translateY(-50%)", color: "var(--accent)", opacity: 0.5 }} />
                          <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Email address..."
                            className="admin-login-input"
                            autoFocus
                          />
                        </div>
                      </div>

                      {error && (
                        <motion.div 
                          initial={{ opacity: 0, y: -10 }} 
                          animate={{ opacity: 1, y: 0 }}
                          style={{ color: "var(--error)", fontSize: "0.8rem", background: "rgba(239, 68, 68, 0.1)", padding: "10px 14px", borderRadius: "var(--radius-md)", border: "1px solid rgba(239, 68, 68, 0.2)" }}
                        >
                          {error}
                        </motion.div>
                      )}

                      <Magnet padding={40} magnetStrength={3}>
                        <button
                          type="submit"
                          disabled={loading}
                          className="btn btn-primary btn-xl"
                          style={{ width: "100%", height: "56px", fontSize: "0.9rem" }}
                        >
                          {loading ? (
                            <><Loader2 size={16} className="animate-spin" /> Verifying...</>
                          ) : (
                            <>Initialize Access <ArrowRight size={16} /></>
                          )}
                        </button>
                      </Magnet>
                    </form>
                  </motion.div>
                )}

                {/* Step 2: OTP */}
                {step === "otp" && (
                  <motion.div
                    key="otp"
                    initial={{ x: 20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: 20, opacity: 0 }}
                    transition={{ duration: 0.4 }}
                  >
                    <div style={{ width: 52, height: 52, borderRadius: "50%", background: "rgba(232, 85, 10, 0.1)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "var(--space-5)" }}>
                      <Lock size={22} color="var(--accent)" />
                    </div>
                    <h2 style={{ fontSize: "1.75rem", marginBottom: "var(--space-1)", fontWeight: 800 }}>
                      Verify Sequence
                    </h2>
                    <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginBottom: "var(--space-10)" }}>
                      Enter the multi-factor code sent to your terminal.
                    </p>

                    <form onSubmit={handleOtpSubmit} style={{ display: "flex", flexDirection: "column", gap: "var(--space-8)" }}>
                      {/* OTP boxes */}
                      <div style={{ display: "flex", gap: "var(--space-3)", justifyContent: "center" }} onPaste={handleOtpPaste}>
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
                            className="otp-field-premium"
                            autoFocus={i === 0}
                          />
                        ))}
                      </div>

                      {error && (
                        <div style={{ color: "var(--error)", fontSize: "0.8rem", background: "rgba(239, 68, 68, 0.1)", padding: "10px 14px", borderRadius: "var(--radius-md)", border: "1px solid rgba(239, 68, 68, 0.2)" }}>
                          {error}
                        </div>
                      )}

                      <Magnet padding={40} magnetStrength={3}>
                        <button
                          type="submit"
                          disabled={loading || otp.join("").length < 6}
                          className="btn btn-primary btn-xl"
                          style={{ width: "100%", height: "56px" }}
                        >
                          {loading ? (
                            <><Loader2 size={16} className="animate-spin" /> Authenticating...</>
                          ) : (
                            <>Complete Protocol <ArrowRight size={16} /></>
                          )}
                        </button>
                      </Magnet>

                      <button
                        type="button"
                        onClick={() => { setStep("email"); setError(""); setOtp(Array(6).fill("")); }}
                        style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer", fontSize: "0.82rem", display: "flex", alignItems: "center", gap: 6, justifyContent: "center", opacity: 0.7 }}
                      >
                        <ArrowLeft size={14} /> Reset Identifier
                      </button>
                    </form>
                  </motion.div>
                )}
              </AnimatePresence>

              <div style={{ textAlign: "center", marginTop: "var(--space-12)", opacity: 0.3 }}>
                <p style={{ fontSize: "0.6rem", letterSpacing: "0.15em", textTransform: "uppercase" }}>
                  Surat · Gujarat · India
                </p>
              </div>
            </div>
          </div>
        </StarBorder>
      </motion.div>

      <style>{`
        .admin-login-input {
          width: 100%;
          padding: 14px 0 14px 30px;
          background: transparent;
          border: none;
          border-bottom: 2px solid rgba(255, 255, 255, 0.05);
          color: white;
          font-family: var(--font-body);
          font-size: 1rem;
          transition: border-color 0.4s ease;
          outline: none;
        }
        .admin-login-input:focus {
          border-bottom-color: var(--accent);
        }
        
        .otp-field-premium {
          width: 44px;
          height: 56px;
          text-align: center;
          font-size: 1.5rem;
          font-weight: 800;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          color: var(--accent);
          outline: none;
          transition: all 0.3s ease;
        }
        .otp-field-premium:focus {
          background: rgba(232, 85, 10, 0.05);
          border-color: var(--accent);
          box-shadow: 0 0 20px rgba(232, 85, 10, 0.2);
          transform: translateY(-2px);
        }

        @media (max-width: 768px) {
          .login-grid { 
            grid-template-columns: 1fr !important; 
          }
          .login-grid > div:first-child { 
            display: none !important; 
          }
        }
        .animate-spin { animation: spin 1s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
