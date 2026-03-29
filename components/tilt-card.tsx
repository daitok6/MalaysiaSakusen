"use client";

import { useRef, useCallback, type ReactNode, type MouseEvent } from "react";

type TiltCardProps = {
  children: ReactNode;
  className?: string;
  tiltDegree?: number;
};

export function TiltCard({ children, className = "", tiltDegree = 8 }: TiltCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = useCallback(
    (e: MouseEvent<HTMLDivElement>) => {
      const card = cardRef.current;
      if (!card) return;
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      card.style.transform = `perspective(1000px) rotateY(${x * tiltDegree}deg) rotateX(${-y * tiltDegree}deg) translateY(-4px)`;
    },
    [tiltDegree]
  );

  const handleMouseLeave = useCallback(() => {
    const card = cardRef.current;
    if (card) {
      card.style.transform = "perspective(1000px) rotateY(0deg) rotateX(0deg) translateY(0px)";
    }
  }, []);

  return (
    <div
      ref={cardRef}
      className={`glass tilt-card ${className}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {children}
    </div>
  );
}
