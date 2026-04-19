"use client";

import { CSSProperties, FC } from "react";

interface ShinyTextProps {
  text: string;
  disabled?: boolean;
  speed?: number;
  className?: string;
  style?: CSSProperties;
}

const ShinyText: FC<ShinyTextProps> = ({
  text,
  disabled = false,
  speed = 5,
  className = "",
  style,
}) => {
  const animationDuration = `${speed}s`;

  return (
    <span
      className={`shiny-text-wrap ${disabled ? "" : "animate-shiny"} ${className}`}
      style={{
        "--animation-duration": animationDuration,
        color: "rgba(255, 255, 255, 0.55)",
        background:
          "linear-gradient(120deg, rgba(255,255,255,0) 40%, rgba(255,255,255,0.85) 50%, rgba(255,255,255,0) 60%)",
        backgroundSize: "200% 100%",
        WebkitBackgroundClip: "text",
        backgroundClip: "text",
        display: "inline-block",
        ...style,
      } as CSSProperties}
    >
      {text}
    </span>
  );
};

export default ShinyText;
