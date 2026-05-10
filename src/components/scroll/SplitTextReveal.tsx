"use client";

import { motion } from "framer-motion";


interface SplitTextRevealProps {
  text: string;
  className?: string;
  delay?: number;
  stagger?: number;
  as?: "h1" | "h2" | "h3" | "p" | "span";
}

export function SplitTextReveal({
  text,
  className,
  delay = 0,
  stagger = 0.08,
  as: Tag = "span",
}: SplitTextRevealProps) {

  const words = text.split(" ");

  return (
    <Tag
      className={className}
      aria-label={text}
      style={{ display: "inline-block" }}
    >
      {words.map((word, i) => (
        <span key={i} style={{ display: "inline-block", overflow: "hidden", padding: "0.2em 0", margin: "-0.2em 0", marginRight: "0.28em" }}>
          <motion.span
            style={{ 
              display: "inline-block",
              WebkitBackgroundClip: "inherit",
              WebkitTextFillColor: "inherit",
              backgroundClip: "inherit",
            }}
            initial={{ y: "100%", opacity: 0 }}
            animate={{ y: "0%", opacity: 1 }}
            transition={{
              duration: 0.75,
              delay: delay + i * stagger,
              ease: [0.16, 1, 0.3, 1],
            }}
          >
            {word}

          </motion.span>
        </span>
      ))}
    </Tag>
  );
}
