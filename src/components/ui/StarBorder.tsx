"use client";

import React from "react";

interface StarBorderProps {
  as?: React.ElementType;
  className?: string;
  color?: string;
  speed?: string;
  thickness?: number;
  children?: React.ReactNode;
  style?: React.CSSProperties;
}

export const StarBorder = ({
  as: Component = 'div',
  className = '',
  color = 'var(--accent)',
  speed = '6s',
  thickness = 2,
  children,
  style,
  ...rest
}: StarBorderProps) => {
  return (
    <Component 
      className={`relative inline-block overflow-hidden rounded-[var(--radius-xl)] ${className}`} 
      style={{ padding: thickness, ...style }}
      {...rest}
    >
      {/* Animated Gradient Layers */}
      <div
        className="absolute w-[300%] h-[300%] opacity-40 bottom-[-100%] right-[-100%] rounded-full animate-star-movement-bottom pointer-events-none"
        style={{
          background: `radial-gradient(circle, ${color}, transparent 20%)`,
          animationDuration: speed,
          zIndex: 0
        }}
      />
      <div
        className="absolute w-[300%] h-[300%] opacity-40 top-[-100%] left-[-100%] rounded-full animate-star-movement-top pointer-events-none"
        style={{
          background: `radial-gradient(circle, ${color}, transparent 20%)`,
          animationDuration: speed,
          zIndex: 0
        }}
      />
      
      {/* Content wrapper to keep it above the animation */}
      <div className="relative z-10 w-full h-full bg-transparent rounded-[calc(var(--radius-xl)-2px)]">
        {children}
      </div>

      <style jsx global>{`
        @keyframes star-movement-bottom {
          0% { transform: translate(0, 0) rotate(0deg); }
          100% { transform: translate(-50%, -50%) rotate(360deg); }
        }
        @keyframes star-movement-top {
          0% { transform: translate(0, 0) rotate(0deg); }
          100% { transform: translate(50%, 50%) rotate(-360deg); }
        }
        .animate-star-movement-bottom {
          animation: star-movement-bottom linear infinite;
        }
        .animate-star-movement-top {
          animation: star-movement-top linear infinite;
        }
      `}</style>
    </Component>
  );
};

export default StarBorder;
