"use client";

import { motion } from "framer-motion";

interface BlurTextProps {
  text: string;
  delay?: number;
  className?: string;
  animateBy?: "words" | "letters";
  direction?: "top" | "bottom";
}

const BlurText: React.FC<BlurTextProps> = ({
  text,
  delay = 0.05,
  className = "",
  animateBy = "words",
  direction = "top",
}) => {
  const elements = animateBy === "words" ? text.split(" ") : text.split("");

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: delay,
      },
    },
  };

  const childVariants = {
    hidden: {
      opacity: 0,
      filter: "blur(10px)",
      y: direction === "top" ? -20 : 20,
    },
    visible: {
      opacity: 1,
      filter: "blur(0px)",
      y: 0,
      transition: {
        type: "spring",
        damping: 15,
        stiffness: 100,
      },
    },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      className={`flex flex-wrap ${className}`}
    >
      {elements.map((el, i) => (
        <motion.span
          key={i}
          variants={childVariants}
          className="inline-block"
          style={{ marginRight: animateBy === "words" ? "0.35em" : "0" }}
        >
          {el === "" ? "\u00A0" : el}
        </motion.span>
      ))}
    </motion.div>
  );
};

export default BlurText;
