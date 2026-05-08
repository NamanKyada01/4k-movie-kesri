"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { MapPin, Phone, Mail, Clock, ArrowRight } from "lucide-react";
import Link from "next/link";

function FloatingInput({ label, type = "text", value, onChange, required = false, as = "input", rows }: any) {
  const [focused, setFocused] = useState(false);
  const isActive = focused || value.length > 0;

  const InputComponent = as;

  return (
    <div className="relative mb-8">
      <InputComponent
        type={type}
        value={value}
        onChange={onChange}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        required={required}
        rows={rows}
        className={`w-full bg-transparent border-b ${isActive ? 'border-[#D4A017]' : 'border-[#333333]'} py-3 text-[#FAFAF8] outline-none transition-colors duration-300 ${as === 'textarea' ? 'resize-none' : ''}`}
      />
      <label
        className={`absolute left-0 pointer-events-none transition-all duration-300 font-[family-name:var(--font-body)] ${
          isActive
            ? '-top-6 text-xs text-[#D4A017] uppercase tracking-widest font-semibold'
            : 'top-3 text-[#6B6358] text-base'
        }`}
      >
        {label} {required && <span className="text-[#C8102E]">*</span>}
      </label>
    </div>
  );
}

export default function ContactPage() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    inquiryType: "Wedding",
    message: ""
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      alert("Inquiry submitted successfully. We will be in touch soon.");
      setFormData({ firstName: "", lastName: "", email: "", phone: "", inquiryType: "Wedding", message: "" });
    }, 1500);
  };

  const handleChange = (e: any) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <main className="bg-[#060606] min-h-screen text-[#FAFAF8]">
      {/* Hero Section */}
      <section className="pt-40 pb-16 relative overflow-hidden text-center">
        <div className="container relative z-10 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-[#D4A017] text-sm font-semibold uppercase tracking-[0.2em] mb-4 block">
              Connect With Us
            </span>
            <h1 className="font-[family-name:var(--font-heading)] text-5xl md:text-7xl mb-6">
              Let's Frame Your <br className="hidden md:block" />
              <span
                className="text-transparent"
                style={{ WebkitTextStroke: "1.5px #D4A017" }}
              >
                Story
              </span>
            </h1>
            <p className="font-[family-name:var(--font-body)] text-[#C8C0B0] text-lg font-light max-w-2xl mx-auto">
              Every cinematic journey begins with a conversation. Share your vision with us, and we'll craft the visual narrative it deserves.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="pb-32 px-4 md:px-8">
        <div className="container max-w-7xl">
          <div className="flex flex-col lg:flex-row gap-12 lg:gap-24">
            
            {/* LEFT: Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="w-full lg:w-[55%] glass p-8 md:p-12 rounded-[24px] border border-[#D4A017]/10 relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#D4A017] to-transparent opacity-30" />

              <form onSubmit={handleSubmit} className="relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 mt-6">
                  <FloatingInput
                    label="First Name"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                  />
                  <FloatingInput
                    label="Last Name"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
                  <FloatingInput
                    label="Email Address"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                  <FloatingInput
                    label="Phone Number"
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="mb-10 mt-2">
                  <label className="block text-xs text-[#D4A017] uppercase tracking-widest font-semibold mb-3">
                    Nature of Inquiry
                  </label>
                  <div className="relative">
                    <select
                      name="inquiryType"
                      value={formData.inquiryType}
                      onChange={handleChange}
                      className="w-full bg-transparent border-b border-[#333333] py-3 text-[#FAFAF8] outline-none transition-colors duration-300 appearance-none font-[family-name:var(--font-body)] cursor-pointer focus:border-[#D4A017]"
                    >
                      <option value="Wedding" className="bg-[#141414]">Wedding</option>
                      <option value="Pre-Wedding" className="bg-[#141414]">Pre-Wedding</option>
                      <option value="Corporate" className="bg-[#141414]">Corporate Event</option>
                      <option value="Portrait" className="bg-[#141414]">Portrait Session</option>
                      <option value="Other" className="bg-[#141414]">Other</option>
                    </select>
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none text-[#D4A017]">
                      <ChevronDown size={16} />
                    </div>
                  </div>
                </div>

                <FloatingInput
                  label="Tell us your vision..."
                  as="textarea"
                  name="message"
                  rows={5}
                  value={formData.message}
                  onChange={handleChange}
                  required
                />

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full h-[60px] mt-4 rounded-full font-bold text-lg text-[#0A0800] bg-gradient-to-r from-[#D4A017] via-[#F5D76E] to-[#D4A017] bg-[length:200%_auto] hover:bg-[position:right_center] transition-all duration-500 flex items-center justify-center gap-2 shadow-[0_4px_20px_rgba(212,160,23,0.3)] hover:shadow-[0_8px_30px_rgba(212,160,23,0.5)] disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? "Sending..." : "Send Request"} <ArrowRight size={20} />
                </button>
              </form>
            </motion.div>

            {/* RIGHT: Studio Info */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="w-full lg:w-[45%] flex flex-col pt-4"
            >
              <h2 className="font-[family-name:var(--font-heading)] text-3xl md:text-4xl text-[#FAFAF8] mb-10">
                Inside the Studio
              </h2>

              <div className="space-y-8 flex-grow">
                {[
                  { icon: MapPin, title: "Headquarters", text: "VIP Road, Vesu, Surat, Gujarat 395007" },
                  { icon: Phone, title: "Call Us", text: "+91 98765 43210" },
                  { icon: Mail, title: "Email", text: "hello@4kmoviekesri.com" },
                  { icon: Clock, title: "Availability", text: "Monday–Sunday, 10AM–8PM IST" }
                ].map((info, idx) => (
                  <div key={idx} className="flex items-start gap-5">
                    <div className="w-12 h-12 rounded-full border border-[#D4A017]/30 bg-[#D4A017]/10 flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(212,160,23,0.1)]">
                      <info.icon size={20} className="text-[#D4A017]" />
                    </div>
                    <div>
                      <h4 className="text-sm uppercase tracking-widest text-[#D4A017] font-semibold mb-1">{info.title}</h4>
                      <p className="font-[family-name:var(--font-body)] text-[#C8C0B0] text-lg">{info.text}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Map Placeholder */}
              <div className="mt-12 h-[200px] rounded-2xl border border-[#D4A017]/10 overflow-hidden relative grayscale hover:grayscale-0 transition-all duration-700 bg-[#141414]">
                <img
                  src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=800"
                  alt="Surat Map Context"
                  className="w-full h-full object-cover opacity-50"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#060606] via-transparent to-[#060606]/30 pointer-events-none" />
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-12 h-12 bg-[#C8102E]/20 backdrop-blur-md rounded-full flex items-center justify-center border border-[#C8102E]/50 animate-pulse">
                     <MapPin className="text-[#C8102E]" size={20} />
                  </div>
                </div>
              </div>

              {/* Portfolio Link CTA */}
              <Link href="/portfolio" className="mt-8 block">
                <div className="p-6 rounded-2xl border border-dashed border-[#D4A017]/30 bg-[#D4A017]/5 hover:bg-[#D4A017]/10 transition-colors flex items-center justify-between group">
                  <p className="font-[family-name:var(--font-body)] text-[#FAFAF8] text-sm">
                    Looking for our portfolio? <br className="hidden sm:block" />
                    <span className="text-[#D4A017] font-medium group-hover:underline">Browse our latest exhibitions</span>
                  </p>
                  <ArrowRight size={20} className="text-[#D4A017] transform transition-transform group-hover:translate-x-1" />
                </div>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>
    </main>
  );
}

// Minimal Chevron Component to avoid extra lucide imports inline
function ChevronDown({ size = 24 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m6 9 6 6 6-6"/>
    </svg>
  );
}