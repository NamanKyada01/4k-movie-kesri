"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, X, ChevronLeft, ChevronRight } from "lucide-react";
import { PL_GALLERY } from "@/lib/data/placeholder";

export default function GalleryPage() {
  const [activeFilter, setActiveFilter] = useState("All");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const categories = ["All", ...Array.from(new Set(PL_GALLERY.map(p => p.category)))];
  const filteredPhotos = activeFilter === "All" ? PL_GALLERY : PL_GALLERY.filter(p => p.category === activeFilter);

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    setLightboxIndex(null);
    document.body.style.overflow = 'auto';
  };

  const nextPhoto = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (lightboxIndex !== null) {
      setLightboxIndex((lightboxIndex + 1) % filteredPhotos.length);
    }
  };

  const prevPhoto = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (lightboxIndex !== null) {
      setLightboxIndex((lightboxIndex - 1 + filteredPhotos.length) % filteredPhotos.length);
    }
  };

  return (
    <main className="bg-[#060606] min-h-screen text-[#FAFAF8]">
      {/* Hero Section */}
      <section className="pt-40 pb-16 relative overflow-hidden text-center">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(212,160,23,0.1),transparent_60%)] pointer-events-none" />

        <div className="container relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-[#D4A017] text-sm font-semibold uppercase tracking-[0.2em] mb-4 block">
              Visual Archive
            </span>
            <h1 className="font-[family-name:var(--font-heading)] text-5xl md:text-7xl mb-12">
              The Gallery
            </h1>

            {/* Filter Bar */}
            <div className="flex flex-wrap justify-center gap-3 max-w-4xl mx-auto">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveFilter(cat)}
                  className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${
                    activeFilter === cat
                      ? 'bg-[#D4A017] text-[#0A0800] shadow-[0_0_20px_rgba(212,160,23,0.4)]'
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

      {/* Masonry Grid */}
      <section className="pb-32 px-4 md:px-8">
        <div className="max-w-[1600px] mx-auto">
          <motion.div
            layout
            className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6"
          >
            <AnimatePresence>
              {filteredPhotos.map((photo, i) => (
                <motion.div
                  key={photo.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.4 }}
                  className="break-inside-avoid"
                >
                  <div
                    className="group relative rounded-xl overflow-hidden cursor-pointer border border-transparent hover:border-[#D4A017]/60 hover:shadow-[0_0_0_2px_rgba(212,160,23,0.6)] transition-all duration-300 bg-[#141414]"
                    onClick={() => openLightbox(i)}
                  >
                    <img
                      src={photo.image}
                      alt={photo.title}
                      className="w-full h-auto object-cover transform transition-transform duration-700 group-hover:scale-105"
                      loading="lazy"
                    />

                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#060606]/90 via-[#060606]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                      <span className="text-[#D4A017] text-xs font-semibold uppercase tracking-wider mb-2">
                        {photo.category}
                      </span>
                      <div className="flex justify-between items-end">
                        <h3 className="font-[family-name:var(--font-heading)] text-xl text-white drop-shadow-md">
                          {photo.title}
                        </h3>
                        <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 delay-100">
                          <ArrowRight size={18} className="text-white" />
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>

      {/* Lightbox Overlay */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] flex items-center justify-center p-4 md:p-10"
            onClick={closeLightbox}
          >
            {/* Blurred Dark Overlay */}
            <div className="absolute inset-0 bg-[#060606]/95 backdrop-blur-xl" />

            {/* Close Button */}
            <button
              className="absolute top-6 right-6 z-50 w-12 h-12 rounded-full bg-[#141414] border border-[#D4A017]/30 flex items-center justify-center text-[#D4A017] hover:bg-[#D4A017] hover:text-[#060606] transition-colors shadow-[0_0_20px_rgba(212,160,23,0.15)]"
              onClick={closeLightbox}
            >
              <X size={24} />
            </button>

            {/* Navigation Arrows */}
            <button
              className="absolute left-6 top-1/2 -translate-y-1/2 z-50 w-12 h-12 rounded-full bg-[#141414] border border-[#D4A017]/30 flex items-center justify-center text-[#D4A017] hover:bg-[#D4A017] hover:text-[#060606] transition-colors shadow-[0_0_20px_rgba(212,160,23,0.15)] hidden md:flex"
              onClick={prevPhoto}
            >
              <ChevronLeft size={24} />
            </button>
            <button
              className="absolute right-6 top-1/2 -translate-y-1/2 z-50 w-12 h-12 rounded-full bg-[#141414] border border-[#D4A017]/30 flex items-center justify-center text-[#D4A017] hover:bg-[#D4A017] hover:text-[#060606] transition-colors shadow-[0_0_20px_rgba(212,160,23,0.15)] hidden md:flex"
              onClick={nextPhoto}
            >
              <ChevronRight size={24} />
            </button>

            {/* Main Image Container */}
            <div
              className="relative z-10 max-w-6xl w-full max-h-full flex flex-col items-center justify-center pointer-events-none"
              onClick={(e) => e.stopPropagation()}
            >
              <motion.img
                key={lightboxIndex}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                src={filteredPhotos[lightboxIndex].image}
                alt={filteredPhotos[lightboxIndex].title}
                className="max-h-[80vh] w-auto object-contain rounded-lg shadow-2xl pointer-events-auto"
              />

              {/* Image Info */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="mt-6 text-center pointer-events-auto"
              >
                <h3 className="font-[family-name:var(--font-heading)] text-2xl md:text-3xl text-white mb-2">
                  {filteredPhotos[lightboxIndex].title}
                </h3>
                <span className="text-[#D4A017] text-sm uppercase tracking-widest">
                  {filteredPhotos[lightboxIndex].category}
                </span>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}