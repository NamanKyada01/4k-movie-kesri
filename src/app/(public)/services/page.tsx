"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Camera, Film, ArrowRight, CheckCircle2, ChevronDown, ChevronUp } from "lucide-react";
import Tilt from "react-parallax-tilt";
import { PL_SERVICES, PL_FAQ } from "@/lib/data/placeholder";

function FAQAccordion({ faq, index }: { faq: any, index: number }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.08 }}
      className="bg-[#141414] border border-[#D4A017]/10 rounded-[16px] overflow-hidden cursor-pointer"
      onClick={() => setIsOpen(!isOpen)}
    >
      <div className="p-6 flex justify-between items-center group">
        <h4 className="font-[family-name:var(--font-heading)] text-lg text-[#FAFAF8] group-hover:text-[#D4A017] transition-colors">
          {faq.question}
        </h4>
        <div className={`text-[#D4A017] transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
          {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </div>
      </div>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="px-6 pb-6"
          >
            <p className="font-[family-name:var(--font-body)] text-[#C8C0B0] text-sm leading-relaxed">
              {faq.answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function ServicesPage() {
  const [activeFilter, setActiveFilter] = useState("All");

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const categories = ["All", ...Array.from(new Set(PL_SERVICES.map(s => s.category)))];
  const filteredServices = activeFilter === "All" ? PL_SERVICES : PL_SERVICES.filter(s => s.category === activeFilter);

  return (
    <main className="bg-[#060606] min-h-screen">
      {/* Hero */}
      <section className="pt-[140px] pb-[40px] text-center bg-[#060606] relative">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(212,160,23,0.1),transparent_50%)]" />
        <div className="container relative z-10">
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span className="text-[#D4A017] text-xs font-semibold uppercase tracking-[0.15em] mb-4 block">
              The Repository
            </span>
            <h1 className="font-[family-name:var(--font-heading)] text-5xl md:text-6xl text-[#FAFAF8] mb-6">
              Our Professional <span className="italic text-[#D4A017]">Services</span>
            </h1>
            <p className="max-w-[600px] mx-auto text-[#C8C0B0] text-lg font-light mb-10">
              High-fidelity media services backed by cinema-grade equipment and decades of narrative expertise.
            </p>

            <div className="flex flex-wrap justify-center gap-2 max-w-3xl mx-auto">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveFilter(cat)}
                  className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
                    activeFilter === cat
                      ? 'bg-[#D4A017] text-[#0A0800] shadow-[0_0_15px_rgba(212,160,23,0.4)]'
                      : 'bg-[#141414] text-[#C8C0B0] border border-[#D4A017]/20 hover:border-[#D4A017]/50'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* 3D Grid */}
      <section className="py-16 bg-[#060606]">
        <div className="container">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 gap-8"
          >
            <AnimatePresence mode="popLayout">
              {filteredServices.map((svc, i) => (
                <Tilt
                  key={svc.id}
                  tiltMaxAngleX={4}
                  tiltMaxAngleY={4}
                  glareEnable={true}
                  glareMaxOpacity={0.05}
                  className="h-full"
                >
                  <motion.div
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3 }}
                    className="group glass rounded-[24px] p-8 md:p-10 relative overflow-hidden h-full border border-[#D4A017]/10 hover:border-[#D4A017]/30 transition-colors"
                  >
                    {/* Giant Ghost Icon */}
                    <div className="absolute -bottom-10 -right-10 opacity-[0.03] text-[#D4A017] pointer-events-none group-hover:scale-110 transition-transform duration-700">
                      <Camera size={240} />
                    </div>

                    <div className="w-14 h-14 rounded-full bg-[#1A1A1A] border border-[#D4A017]/30 flex items-center justify-center mb-8 relative z-10 shadow-[0_0_20px_rgba(212,160,23,0.1)]">
                      <Film size={24} className="text-[#D4A017]" />
                    </div>

                    <div className="relative z-10">
                      <h3 className="font-[family-name:var(--font-heading)] text-2xl text-[#FAFAF8] mb-4">
                        {svc.title}
                      </h3>
                      <p className="font-[family-name:var(--font-body)] text-[#C8C0B0] text-sm leading-relaxed mb-8">
                        {svc.description}
                      </p>

                      <div className="space-y-3 mb-8">
                        {svc.features.map((feat, j) => (
                          <div key={j} className="flex items-center gap-3">
                            <CheckCircle2 size={16} className="text-[#D4A017]" />
                            <span className="font-[family-name:var(--font-mono)] text-xs text-[#FAFAF8]/80 uppercase tracking-wider">{feat}</span>
                          </div>
                        ))}
                      </div>

                      <Link
                        href={`/contact?service=${svc.title}`}
                        className="inline-flex items-center gap-2 text-[#D4A017] text-sm font-semibold uppercase tracking-widest group/btn"
                      >
                        Enquire Now <ArrowRight size={16} className="transition-transform group-hover/btn:translate-x-1" />
                      </Link>
                    </div>

                    {/* Bottom Accent Bar */}
                    <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#D4A017] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  </motion.div>
                </Tilt>
              ))}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24 bg-[#0C0C0C] border-t border-[#D4A017]/10">
        <div className="container max-w-3xl">
          <div className="text-center mb-16">
            <span className="text-[#D4A017] text-xs font-semibold uppercase tracking-[0.15em] mb-4 block">Knowledge Base</span>
            <h2 className="font-[family-name:var(--font-heading)] text-4xl text-[#FAFAF8]">Frequently Asked Questions</h2>
          </div>

          <div className="space-y-4">
            {PL_FAQ.map((faq, i) => (
              <FAQAccordion key={i} faq={faq} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-[#060606] text-center relative overflow-hidden border-t border-[#D4A017]/10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(212,160,23,0.1)_0%,transparent_60%)]" />
        <div className="container relative z-10 max-w-2xl">
          <h2 className="font-[family-name:var(--font-heading)] text-4xl text-[#FAFAF8] mb-6">Ready to Get Started?</h2>
          <p className="text-[#C8C0B0] mb-10 text-lg">Let's discuss how we can bring your vision to life with uncompromising quality.</p>
          <Link href="/contact" className="btn btn-primary btn-xl rounded-full shadow-[0_0_30px_rgba(212,160,23,0.2)]">
            Book a Free Consultation →
          </Link>
        </div>
      </section>
    </main>
  );
}