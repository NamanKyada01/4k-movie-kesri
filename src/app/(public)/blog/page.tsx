"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PL_BLOG } from "@/lib/data/placeholder";
import { useState } from "react";

export default function BlogPage() {
  const [activeCategory, setActiveCategory] = useState("All");

  // Use the first post as featured, the rest for the grid.
  const featuredPost = PL_BLOG[0];
  const gridPosts = PL_BLOG.slice(1);
  const categories = ["All", ...Array.from(new Set(PL_BLOG.map(p => p.category)))];

  const filteredGridPosts = activeCategory === "All"
    ? gridPosts
    : gridPosts.filter(p => p.category === activeCategory);

  return (
    <main className="bg-[#060606] min-h-screen text-[#FAFAF8]">
      {/* Hero Section */}
      <section className="pt-40 pb-16 relative overflow-hidden text-center">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(212,160,23,0.08),transparent_50%)] pointer-events-none" />

        <div className="container relative z-10 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-[#D4A017] text-sm font-semibold uppercase tracking-[0.2em] mb-4 block">
              Journal
            </span>
            <h1 className="font-[family-name:var(--font-heading)] text-5xl md:text-7xl mb-8">
              News & <span className="italic text-transparent bg-clip-text bg-gradient-to-r from-[#D4A017] to-[#F5D76E]">Stories</span>
            </h1>
            <p className="font-[family-name:var(--font-body)] text-[#C8C0B0] text-lg font-light max-w-2xl mx-auto">
              Behind the scenes of our cinematic productions, wedding guides, and industry insights from Surat's premier studio.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Featured Post (Full Width) */}
      {activeCategory === "All" && featuredPost && (
        <section className="pb-16 px-4 md:px-8">
          <div className="container max-w-7xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="group flex flex-col lg:flex-row bg-[#141414] rounded-2xl overflow-hidden border border-[#D4A017]/10 hover:border-[#D4A017]/30 transition-colors"
            >
              {/* Image (60%) */}
              <div className="w-full lg:w-[60%] h-[300px] lg:h-[500px] relative overflow-hidden">
                <div className="absolute inset-0 bg-[#060606]/20 group-hover:bg-transparent transition-colors duration-500 z-10" />
                <img
                  src={featuredPost.image}
                  alt={featuredPost.title}
                  className="w-full h-full object-cover transform transition-transform duration-[1.5s] group-hover:scale-[1.03]"
                />
              </div>

              {/* Content (40%) */}
              <div className="w-full lg:w-[40%] p-8 md:p-12 lg:p-16 flex flex-col justify-center">
                <div className="flex items-center gap-4 mb-6">
                  <span className="bg-[#D4A017]/10 text-[#D4A017] border border-[#D4A017]/30 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider">
                    {featuredPost.category}
                  </span>
                  <span className="font-[family-name:var(--font-mono)] text-[#6B6358] text-sm">
                    {new Date(featuredPost.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                  </span>
                </div>

                <h2 className="font-[family-name:var(--font-heading)] text-3xl md:text-4xl text-[#FAFAF8] mb-6 leading-tight group-hover:text-[#D4A017] transition-colors">
                  {featuredPost.title}
                </h2>

                <p className="font-[family-name:var(--font-body)] text-[#C8C0B0] text-lg mb-10 leading-relaxed">
                  {featuredPost.excerpt}
                </p>

                <Link
                  href={`/blog/${featuredPost.id}`}
                  className="inline-flex items-center gap-2 text-[#D4A017] font-medium uppercase tracking-widest text-sm hover:gap-4 transition-all"
                >
                  Read Post <ArrowRight size={16} />
                </Link>
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* Categories Horizontal Strip */}
      <section className="py-8 border-y border-[#D4A017]/10 bg-[#0C0C0C]">
        <div className="container">
          <div className="flex overflow-x-auto hide-scrollbar gap-3 pb-2 md:pb-0 md:justify-center">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`whitespace-nowrap px-6 py-2 rounded-full text-sm font-medium transition-all ${
                  activeCategory === cat
                    ? 'bg-[#D4A017] text-[#0A0800] shadow-[0_0_15px_rgba(212,160,23,0.3)]'
                    : 'bg-[#141414] text-[#C8C0B0] border border-[#D4A017]/20 hover:border-[#D4A017]/50'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Article Grid */}
      <section className="py-16 md:py-24 bg-[#060606]">
        <div className="container max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredGridPosts.map((post, i) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <Link
                  href={`/blog/${post.id}`}
                  className="group flex flex-col h-full bg-[#141414] rounded-2xl overflow-hidden border border-[#D4A017]/10 hover:border-[#D4A017]/40 hover:-translate-y-1 transition-all duration-300"
                >
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-transparent to-transparent opacity-80" />
                    <div className="absolute bottom-4 left-4">
                      <span className="bg-[#D4A017] text-[#0A0800] px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-lg">
                        {post.category}
                      </span>
                    </div>
                  </div>

                  <div className="p-8 flex flex-col flex-grow">
                    <span className="font-[family-name:var(--font-mono)] text-[#6B6358] text-xs mb-4 block">
                      {new Date(post.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>

                    <h3 className="font-[family-name:var(--font-heading)] text-xl text-[#FAFAF8] mb-3 group-hover:text-[#D4A017] transition-colors line-clamp-2">
                      {post.title}
                    </h3>

                    <p className="font-[family-name:var(--font-body)] text-[#C8C0B0] text-sm mb-6 line-clamp-3 flex-grow">
                      {post.excerpt}
                    </p>

                    <span className="inline-flex items-center gap-2 text-[#D4A017] font-medium text-sm mt-auto group-hover:gap-3 transition-all">
                      Read Post <ArrowRight size={16} />
                    </span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>

          {filteredGridPosts.length === 0 && (
             <div className="text-center py-20">
               <p className="text-[#6B6358] text-lg">No articles found in this category.</p>
             </div>
          )}
        </div>
      </section>

      <style jsx>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </main>
  );
}