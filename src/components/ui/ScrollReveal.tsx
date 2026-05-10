"use client";

import { motion } from "framer-motion";

interface ScrollRevealProps {
  children: React.ReactNode;
  delay?: number;
  direction?: "up" | "down" | "left" | "right" | "scale";
  blur?: boolean;
  once?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

const INITIAL: Record<string, object> = {
  up:    { opacity: 0, y: 40 },
  down:  { opacity: 0, y: -40 },
  left:  { opacity: 0, x: -50 },
  right: { opacity: 0, x: 50 },
  scale: { opacity: 0, scale: 0.88 },
};

const ANIMATE: Record<string, object> = {
  up:    { opacity: 1, y: 0 },
  down:  { opacity: 1, y: 0 },
  left:  { opacity: 1, x: 0 },
  right: { opacity: 1, x: 0 },
  scale: { opacity: 1, scale: 1 },
};

export function ScrollReveal({
  children,
  delay = 0,
  direction = "up",
  blur = false,
  once = true,
  className,
  style,
}: ScrollRevealProps) {
  const blurStart = blur ? { filter: "blur(8px)" } : {};
  const blurEnd   = blur ? { filter: "blur(0px)" } : {};

  return (
    <motion.div
      initial={{ ...INITIAL[direction], ...blurStart }}
      whileInView={{ ...ANIMATE[direction], ...blurEnd }}
      viewport={{ once, margin: "-60px" }}
      transition={{ duration: 0.72, delay, ease: [0.16, 1, 0.3, 1] }}
      className={className}
      style={style}
    >
      {children}
    </motion.div>
  );
}
