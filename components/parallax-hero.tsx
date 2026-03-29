"use client";

import { useRef, useEffect, type ReactNode } from "react";
import { SplineScene } from "./spline-scene";

type ParallaxHeroProps = {
  sceneUrl: string;
  fallbackSrc: string;
  fallbackAlt: string;
  children: ReactNode;
};

export function ParallaxHero({
  sceneUrl,
  fallbackSrc,
  fallbackAlt,
  children,
}: ParallaxHeroProps) {
  const bgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (bgRef.current) {
        const scrollY = window.scrollY;
        bgRef.current.style.transform = `translateY(${scrollY * 0.5}px)`;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="parallax-hero">
      <div ref={bgRef} className="hero-bg">
        <SplineScene
          sceneUrl={sceneUrl}
          fallbackSrc={fallbackSrc}
          fallbackAlt={fallbackAlt}
          className="w-full h-full"
        />
      </div>
      <div className="hero-content">{children}</div>
    </div>
  );
}
