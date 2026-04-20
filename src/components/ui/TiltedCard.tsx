"use client";

import React, { useRef, useState } from "react";

interface TiltedCardProps {
  children: React.ReactNode;
}

export default function TiltedCard({ children }: TiltedCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotate, setRotate] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    // Max rotation 10 degrees
    const rotateX = (y - centerY) / 10;
    const rotateY = (centerX - x) / 10;
    
    setRotate({ x: rotateX, y: rotateY });
  };

  const handleMouseLeave = () => {
    setRotate({ x: 0, y: 0 });
  };

  return (
    <div 
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        perspective: "1000px",
        transition: "transform 0.1s ease-out",
        borderRadius: "inherit",
        width: "100%"
      }}
    >
      <div style={{
        transform: `rotateX(${rotate.x}deg) rotateY(${rotate.y}deg)`,
        transition: "transform 0.1s ease-out",
        transformStyle: "preserve-3d",
        borderRadius: "inherit",
        width: "100%"
      }}>
        {children}
      </div>
    </div>
  );
}
