"use client";

import { motion } from "framer-motion";
import { Play } from "lucide-react";
import Tilt from "react-parallax-tilt";
import { PL_TESTIMONIALS } from "@/lib/data/placeholder";

export function YouTubeEmbedSection() {
  return (
    <section className="section bg-[#0C0C0C]">
      <div className="container">
        <div className="flex items-center gap-4 mb-10">
          <div className="w-10 h-10 rounded-full bg-[#D4A017]/10 flex items-center justify-center border border-[#D4A017]/30 text-[#D4A017]">
            <Play size={18} fill="currentColor" />
          </div>
          <h2 className="text-3xl font-[family-name:var(--font-heading)] text-[#FAFAF8]">Watch Our Work</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="group relative rounded-xl overflow-hidden cursor-pointer aspect-video bg-[#141414] border border-[#D4A017]/10"
            >
              <img
                src={`https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=800&q=80`}
                alt="Video thumbnail"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-80 group-hover:opacity-100"
              />
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors" />

              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-16 h-16 rounded-full bg-[#D4A017] flex items-center justify-center transform transition-transform group-hover:scale-110 shadow-[0_0_20px_rgba(212,160,23,0.4)]">
                  <Play size={24} fill="#060606" className="ml-1 text-[#060606]" />
                </div>
              </div>

              <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
                <h3 className="text-white font-medium text-lg drop-shadow-md">The Grand Symphony • 4K</h3>
                <span className="bg-black/80 backdrop-blur-sm text-white text-xs px-2 py-1 rounded font-[family-name:var(--font-mono)]">
                  04:20
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Testimonials() {
  return (
    <section className="section bg-[#060606] relative">
      <div className="container relative z-10">
        <div className="text-center mb-16">
          <span className="text-[#D4A017] text-sm uppercase tracking-widest font-semibold mb-4 block">— Client Love</span>
          <h2 className="text-4xl md:text-5xl font-[family-name:var(--font-heading)] text-[#FAFAF8]">What Our Clients Say</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {PL_TESTIMONIALS.map((test, i) => (
            <Tilt
              key={test.id}
              tiltMaxAngleX={10}
              tiltMaxAngleY={10}
              glareEnable={true}
              glareMaxOpacity={0.05}
              className="h-full"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="glass rounded-[20px] p-8 h-full border border-[#D4A017]/20 flex flex-col relative"
              >
                <div className="text-[#D4A017] text-4xl font-serif leading-none absolute top-6 right-8 opacity-20">"</div>

                <div className="flex gap-1 mb-6">
                  {[1,2,3,4,5].map(star => <span key={star} className="text-[#D4A017] text-lg">★</span>)}
                </div>

                <p className="font-[family-name:var(--font-heading)] text-lg md:text-xl italic text-[#FAFAF8] mb-8 flex-grow leading-relaxed">
                  "{test.text}"
                </p>

                <div className="flex items-center gap-4 mt-auto">
                  <div className="w-12 h-12 rounded-full border border-[#D4A017] flex items-center justify-center bg-[#D4A017]/10 text-[#D4A017] font-semibold">
                    {test.initials}
                  </div>
                  <div>
                    <h4 className="text-[#FAFAF8] font-semibold">{test.name}</h4>
                    <span className="text-[#6B6358] text-sm">{test.event}</span>
                  </div>
                </div>
              </motion.div>
            </Tilt>
          ))}
        </div>
      </div>
    </section>
  );
}