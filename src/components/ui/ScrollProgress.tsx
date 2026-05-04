"use client";

import { useEffect, useState } from "react";
import { motion, useScroll, useSpring } from "framer-motion";

export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <motion.div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        height: "2px",
        background: "linear-gradient(90deg, var(--accent) 0%, var(--gold) 60%, var(--accent) 100%)",
        transformOrigin: "left",
        scaleX,
        zIndex: 9999,
        pointerEvents: "none",
        boxShadow: "0 0 8px rgba(212,160,23,0.6)",
      }}
    />
  );
}

export function useScrollPercent() {
  const [percent, setPercent] = useState(0);
  useEffect(() => {
    const handler = () => {
      const doc = document.documentElement;
      const scrollTop = window.scrollY;
      const scrollHeight = doc.scrollHeight - doc.clientHeight;
      setPercent(scrollHeight > 0 ? Math.round((scrollTop / scrollHeight) * 100) : 0);
    };
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);
  return percent;
}
