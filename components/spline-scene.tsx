"use client";

import { Component, Suspense, lazy, useRef, useEffect, useState, type ReactNode, type ErrorInfo } from "react";
import type { Application } from "@splinetool/runtime";

const Spline = lazy(() => import("@splinetool/react-spline"));

// Error boundary to catch Spline runtime crashes
class SplineErrorBoundary extends Component<
  { fallback: ReactNode; children: ReactNode },
  { hasError: boolean }
> {
  constructor(props: { fallback: ReactNode; children: ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.warn("Spline scene failed to load, showing fallback:", error.message);
  }

  render() {
    if (this.state.hasError) return this.props.fallback;
    return this.props.children;
  }
}

type SplineSceneProps = {
  sceneUrl: string;
  fallbackSrc: string;
  fallbackAlt: string;
  className?: string;
  onLoad?: (spline: Application) => void;
};

function FallbackImage({ src, alt }: { src: string; alt: string }) {
  return (
    <img
      src={src}
      alt={alt}
      className="w-full h-full object-contain"
      loading="lazy"
    />
  );
}

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
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
    setPrefersReducedMotion(
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    );

    // Pre-check if the scene file exists
    fetch(sceneUrl, { method: "HEAD" })
      .then((res) => {
        if (!res.ok) setHasError(true);
      })
      .catch(() => setHasError(true));
  }, [sceneUrl]);

  // Pause/play when off-screen
  useEffect(() => {
    if (isMobile || prefersReducedMotion || hasError || !containerRef.current) return;

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
  }, [isMobile, prefersReducedMotion, hasError]);

  const handleLoad = (spline: Application) => {
    splineRef.current = spline;
    onLoad?.(spline);
  };

  // Show static fallback on mobile, reduced motion, or error
  if (isMobile || prefersReducedMotion || hasError) {
    return (
      <div ref={containerRef} className={className}>
        <FallbackImage src={fallbackSrc} alt={fallbackAlt} />
      </div>
    );
  }

  const fallbackNode = <FallbackImage src={fallbackSrc} alt={fallbackAlt} />;

  return (
    <div ref={containerRef} className={className}>
      <SplineErrorBoundary fallback={fallbackNode}>
        <Suspense
          fallback={
            <div className="w-full h-full flex items-center justify-center">
              <div className="w-12 h-12 rounded-full border-2 border-lavender border-t-transparent animate-spin" />
            </div>
          }
        >
          <Spline scene={sceneUrl} onLoad={handleLoad} />
        </Suspense>
      </SplineErrorBoundary>
    </div>
  );
}
