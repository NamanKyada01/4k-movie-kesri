"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { useCallback, useEffect, useState } from "react";
import Tilt from "react-parallax-tilt";
import { PL_SERVICES } from "@/lib/data/placeholder";

export function ServiceCardsGrid() {
  return (
    <section className="section bg-[#0C0C0C] relative overflow-hidden">
      <div className="absolute top-10 right-0 text-[12vw] font-[family-name:var(--font-heading)] font-black text-white/5 pointer-events-none select-none">
        SERVICES
      </div>

      <div className="container relative z-10">
        <div className="mb-12">
          <span className="text-[#D4A017] text-sm uppercase tracking-widest font-semibold mb-2 block">— Our Expertise</span>
          <h2 className="text-4xl md:text-5xl font-[family-name:var(--font-heading)] text-[#FAFAF8]">
            What We Do <span className="italic text-[#D4A017]">Best.</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {PL_SERVICES.map((service, i) => (
            <Tilt
              key={service.id}
              tiltMaxAngleX={5}
              tiltMaxAngleY={5}
              glareEnable={true}
              glareMaxOpacity={0.1}
              glareColor="#D4A017"
              glarePosition="all"
              className="h-full"
            >
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="group relative h-full bg-[#141414] rounded-[20px] border border-[#D4A017]/10 overflow-hidden cursor-pointer"
              >
                {/* Spotlight Background */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_var(--x,50%)_var(--y,50%),rgba(212,160,23,0.1)_0%,transparent_50%)] opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

                <div className="h-[220px] w-full relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-[#141414] to-transparent z-10" />
                  <img
                    src={`https://images.unsplash.com/photo-${i % 2 === 0 ? '1511285560929-80b456fea0bc' : '1540575467063-178a50c2df87'}?auto=format&fit=crop&w=800&q=80`}
                    alt={service.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute top-4 left-4 z-20">
                    <span className="bg-[#060606]/80 backdrop-blur-md text-[#D4A017] font-[family-name:var(--font-mono)] text-xs px-3 py-1.5 rounded-full border border-[#D4A017]/30">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                  </div>
                  {i === 0 && (
                    <div className="absolute top-4 right-4 z-20">
                      <span className="bg-[#C8102E]/90 text-white text-xs px-3 py-1.5 rounded-full font-semibold uppercase tracking-wider shadow-[0_0_15px_rgba(200,16,46,0.5)]">
                        Most Popular
                      </span>
                    </div>
                  )}
                </div>

                <div className="p-6 relative z-10">
                  <h3 className="text-xl font-[family-name:var(--font-heading)] text-[#FAFAF8] mb-2">{service.title}</h3>
                  <p className="text-[#C8C0B0] text-sm mb-6 line-clamp-2">{service.description}</p>

                  <Link href={`/services#${service.id}`} className="text-[#D4A017] flex items-center gap-2 text-sm font-semibold group/link">
                    Explore
                    <ArrowRight size={16} className="transition-transform group-hover/link:translate-x-1" />
                  </Link>
                </div>
              </motion.div>
            </Tilt>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link href="/services" className="btn btn-ghost rounded-full border-[#D4A017]/30">
            View All Services →
          </Link>
        </div>
      </div>
    </section>
  );
}

export function CarouselShowcase() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: "center" }, [Autoplay({ delay: 4000 })]);

  return (
    <section className="py-24 bg-[#060606] relative overflow-hidden">
      <div className="container relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-[family-name:var(--font-heading)] text-[#FAFAF8]">Featured Showreels</h2>
        </div>

        <div className="relative max-w-5xl mx-auto">
           {/* Gold border glow frame */}
          <div className="absolute inset-0 rounded-2xl border border-[#D4A017]/30 shadow-[0_0_30px_rgba(212,160,23,0.15)] pointer-events-none z-20" />

          <div className="overflow-hidden rounded-2xl" ref={emblaRef}>
            <div className="flex touch-pan-y">
              {[1,2,3,4].map((item) => (
                <div key={item} className="flex-[0_0_100%] min-w-0 relative h-[400px] md:h-[600px]">
                  <img
                    src={`https://images.unsplash.com/photo-${item % 2 === 0 ? '1606800052052-a08af7148866' : '1511285560929-80b456fea0bc'}?auto=format&fit=crop&w=1600&q=80`}
                    className="w-full h-full object-cover"
                    alt="Showreel"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  <div className="absolute bottom-10 left-10 text-left">
                    <h3 className="text-3xl font-[family-name:var(--font-heading)] text-white mb-2">Cinematic Elegance</h3>
                    <p className="text-white/80 max-w-md">The perfect blend of tradition and modern storytelling.</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}