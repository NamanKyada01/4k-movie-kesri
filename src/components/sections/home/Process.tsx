"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

const steps = [
  { num: "01", title: "Consultation", desc: "Understanding your vision and specific requirements.", icon: "💬", gradient: "from-[#D4A017]/10" },
  { num: "02", title: "Planning", desc: "Crafting the shot list, scouting, and logistics.", icon: "📋", gradient: "from-[#C8102E]/10" },
  { num: "03", title: "Production", desc: "Executing with cinema-grade gear and direction.", icon: "🎬", gradient: "from-[#D4A017]/10" },
  { num: "04", title: "Delivery", desc: "Color grading and finalizing your 4K masterpiece.", icon: "✨", gradient: "from-[#C8102E]/10" },
];

export function ProcessSection() {
  return (
    <section className="section relative bg-[#060606] overflow-hidden">
      {/* Ghost Watermark */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[15vw] font-[family-name:var(--font-heading)] font-black text-white/5 whitespace-nowrap pointer-events-none select-none z-0">
        PROCESS
      </div>

      <div className="container relative z-10">
        <div className="text-center mb-16">
          <span className="text-[#D4A017] text-sm uppercase tracking-widest font-semibold mb-4 block">— How It Works</span>
          <h2 className="text-4xl md:text-5xl font-[family-name:var(--font-heading)] text-[#FAFAF8]">The Cinematic Journey</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          {/* Connecting Line */}
          <div className="hidden lg:block absolute top-[50px] left-[10%] right-[10%] h-[1px] bg-gradient-to-r from-transparent via-[#D4A017]/30 to-transparent z-0" />

          {steps.map((step, i) => (
            <motion.div
              key={step.num}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.7, delay: i * 0.15 }}
              className="relative z-10 group"
            >
              <div className={`glass rounded-[20px] p-8 h-full bg-gradient-to-b ${step.gradient} to-transparent border-t-2 border-t-[#D4A017] overflow-hidden relative transition-transform duration-500 hover:-translate-y-2`}>

                {/* Number Watermark */}
                <div className="absolute -bottom-4 -right-4 text-8xl font-[family-name:var(--font-heading)] font-bold text-white/5 pointer-events-none transition-transform duration-500 group-hover:scale-110">
                  {step.num}
                </div>

                <div className="mb-6 flex justify-between items-start relative z-10">
                  <span className="text-4xl bg-[#141414] w-16 h-16 rounded-2xl flex items-center justify-center border border-[#D4A017]/20 shadow-lg">{step.icon}</span>
                  <span className="font-[family-name:var(--font-mono)] text-[#D4A017] font-medium tracking-wider text-sm">Step {step.num}</span>
                </div>

                <h3 className="text-2xl font-[family-name:var(--font-heading)] text-[#FAFAF8] mb-3 relative z-10">{step.title}</h3>
                <p className="font-[family-name:var(--font-body)] text-[#C8C0B0] text-sm leading-relaxed relative z-10">{step.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <Link href="/contact" className="inline-flex items-center gap-2 text-[#FAFAF8] hover:text-[#D4A017] transition-colors font-medium border-b border-[#D4A017]/30 hover:border-[#D4A017] pb-1">
            Start Your Journey <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}