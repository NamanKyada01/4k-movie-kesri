"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useRef } from "react";
import { PL_PORTFOLIO } from "@/lib/data/placeholder";

function ProjectCard({ project, index }: { project: any, index: number }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "center center"]
  });

  const imageScale = useTransform(scrollYProgress, [0, 1], [1.2, 1]);
  const imageOpacity = useTransform(scrollYProgress, [0, 1], [0.5, 1]);
  const textY = useTransform(scrollYProgress, [0, 1], [50, 0]);
  const textOpacity = useTransform(scrollYProgress, [0, 1], [0, 1]);

  const isEven = index % 2 === 0;

  return (
    <div ref={containerRef} className="relative py-12 md:py-24 border-b border-[#D4A017]/10 last:border-b-0">
      <div className={`flex flex-col ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'} gap-8 md:gap-16 items-center`}>

        {/* Image Panel (1.2fr) */}
        <div className="w-full md:w-[55%] lg:w-[60%] overflow-hidden rounded-[20px] relative aspect-[4/3] group">
          <motion.div
            style={{ scale: imageScale, opacity: imageOpacity }}
            className="w-full h-full relative"
          >
            <div className="absolute inset-0 bg-[#060606]/20 group-hover:bg-[#060606]/40 transition-colors duration-700 z-10" />
            <img
              src={project.image}
              alt={project.title}
              className="w-full h-full object-cover transition-transform duration-[1.5s] ease-out group-hover:scale-[1.03]"
            />
          </motion.div>
        </div>

        {/* Content Panel (1fr) */}
        <div className="w-full md:w-[45%] lg:w-[40%] flex flex-col justify-center">
          <motion.div
            style={{ y: textY, opacity: textOpacity }}
            className={`flex flex-col ${isEven ? 'md:items-start md:text-left' : 'md:items-end md:text-right'} items-center text-center`}
          >
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#D4A017] border border-[#D4A017]/30 px-4 py-1.5 rounded-full mb-6 bg-[#D4A017]/5">
              {project.category}
            </span>

            <h2 className="font-[family-name:var(--font-heading)] text-3xl md:text-4xl lg:text-5xl text-[#FAFAF8] mb-6 leading-tight">
              {project.title}
            </h2>

            <p className="font-[family-name:var(--font-body)] text-[#C8C0B0] text-lg mb-10 max-w-md font-light">
              {project.description}
            </p>

            <Link
              href="/gallery"
              className="group inline-flex items-center justify-center gap-3 px-8 py-4 rounded-full border border-[#D4A017]/30 text-[#FAFAF8] hover:border-[#D4A017] hover:bg-[#D4A017]/5 transition-all"
            >
              <span className="font-medium text-sm tracking-wide uppercase">View Full Collection</span>
              <ArrowRight size={18} className="text-[#D4A017] transition-transform group-hover:translate-x-1" />
            </Link>
          </motion.div>
        </div>

      </div>
    </div>
  );
}

export default function PortfolioPage() {
  return (
    <main className="bg-[#060606] min-h-screen text-[#FAFAF8]">
      {/* Hero Section */}
      <section className="pt-40 pb-20 relative overflow-hidden text-center">
        {/* Background ambient light */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-gradient-radial from-[#D4A017]/10 to-transparent blur-3xl pointer-events-none" />

        <div className="container relative z-10 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <span className="text-[#D4A017] text-sm font-semibold uppercase tracking-[0.2em] mb-6 block">
              Featured Collections
            </span>
            <h1 className="font-[family-name:var(--font-heading)] text-5xl md:text-7xl lg:text-[80px] leading-tight mb-8">
              Cinematic <span className="italic text-transparent bg-clip-text bg-gradient-to-r from-[#D4A017] to-[#F5D76E]">Portfolio</span>
            </h1>
            <p className="font-[family-name:var(--font-body)] text-[#C8C0B0] text-lg md:text-xl font-light max-w-2xl mx-auto">
              Dive deep into our featured cinematic highlights and full photography case studies. Each project is a testament to our commitment to visual storytelling.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Editorial Case Studies Grid */}
      <section className="pb-32 bg-[#060606]">
        <div className="container max-w-7xl">
          {PL_PORTFOLIO.map((project, idx) => (
            <ProjectCard key={project.id} project={project} index={idx} />
          ))}
        </div>
      </section>

      {/* CTA Footer */}
      <section className="py-24 border-t border-[#D4A017]/10 bg-[#0C0C0C] text-center">
        <div className="container max-w-2xl">
          <h2 className="font-[family-name:var(--font-heading)] text-3xl md:text-4xl text-[#FAFAF8] mb-6">
            Ready to frame your own legacy?
          </h2>
          <Link href="/contact" className="btn btn-primary rounded-full px-8 py-4 text-lg shadow-[0_0_20px_rgba(212,160,23,0.3)]">
            Start the Conversation
          </Link>
        </div>
      </section>
    </main>
  );
}