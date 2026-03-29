"use client";

import { Suspense, lazy, useRef, useEffect, useState } from "react";
import type { Application } from "@splinetool/runtime";

const Spline = lazy(() => import("@splinetool/react-spline"));

type SplineSceneProps = {
  sceneUrl: string;
  fallbackSrc: string;
  fallbackAlt: string;
  className?: string;
  onLoad?: (spline: Application) => void;
};

export function SplineScene({
  sceneUrl,
  fallbackSrc,
  fallbackAlt,
  className = "",
  onLoad,
}: SplineSceneProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const splineRef = useRef<Application | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
    setPrefersReducedMotion(
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    );
  }, []);

  // Pause/play when off-screen
  useEffect(() => {
    if (isMobile || prefersReducedMotion || !containerRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (splineRef.current) {
          if (entry.isIntersecting) {
            splineRef.current.play?.();
          } else {
            splineRef.current.stop?.();
          }
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [isMobile, prefersReducedMotion]);

  const handleLoad = (spline: Application) => {
    splineRef.current = spline;
    onLoad?.(spline);
  };

  // Show static fallback on mobile or reduced motion
  if (isMobile || prefersReducedMotion) {
    return (
      <div ref={containerRef} className={className}>
        <img
          src={fallbackSrc}
          alt={fallbackAlt}
          className="w-full h-full object-contain"
          loading="lazy"
        />
      </div>
    );
  }

  return (
    <div ref={containerRef} className={className}>
      <Suspense
        fallback={
          <div className="w-full h-full flex items-center justify-center">
            <div className="w-12 h-12 rounded-full border-2 border-lavender border-t-transparent animate-spin" />
          </div>
        }
      >
        <Spline scene={sceneUrl} onLoad={handleLoad} />
      </Suspense>
    </div>
  );
}
