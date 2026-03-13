import { useEffect, useRef, useState, type RefObject } from "react";

/**
 * Intersection Observer hook for scroll-triggered reveal animations.
 * Returns a ref to attach to the element and a boolean `visible`.
 */
export function useScrollReveal<T extends HTMLElement = HTMLDivElement>(
  options?: IntersectionObserverInit
): [RefObject<T | null>, boolean] {
  const ref = useRef<T | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.unobserve(el); // only trigger once
        }
      },
      { threshold: 0.1, rootMargin: "0px 0px -40px 0px", ...options }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [options]);

  return [ref, visible];
}

/**
 * Convenience component for scroll-triggered reveal.
 * Applies CSS class-based animation (no framer-motion needed).
 */
export function Reveal({
  children,
  className = "",
  variant = "up",
  delay = 0,
  ...rest
}: {
  children: React.ReactNode;
  className?: string;
  variant?: "up" | "left" | "scale";
  delay?: number;
} & React.HTMLAttributes<HTMLDivElement>) {
  const [ref, visible] = useScrollReveal();

  const variantClass = {
    up: "nova-reveal",
    left: "nova-reveal-left",
    scale: "nova-reveal-scale",
  }[variant];

  return (
    <div
      ref={ref}
      className={`${variantClass} ${visible ? "visible" : ""} ${className}`}
      style={{ transitionDelay: `${delay}ms`, ...rest.style }}
      {...rest}
    >
      {children}
    </div>
  );
}

/**
 * Stagger container — children appear one-by-one on scroll.
 */
export function StaggerReveal({
  children,
  className = "",
  ...rest
}: {
  children: React.ReactNode;
  className?: string;
} & React.HTMLAttributes<HTMLDivElement>) {
  const [ref, visible] = useScrollReveal();

  return (
    <div
      ref={ref}
      className={`nova-stagger ${visible ? "visible" : ""} ${className}`}
      {...rest}
    >
      {children}
    </div>
  );
}
