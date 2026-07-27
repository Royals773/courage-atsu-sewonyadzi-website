"use client";

import { useEffect, useRef, useState } from "react";

interface CountUpProps {
  /** e.g. "15+", "10,000+", "98%" — non-numeric values like "[X]+" render as-is, unanimated. */
  value: string;
  durationMs?: number;
  className?: string;
}

/**
 * Animates the leading number in a stat string on first scroll into view.
 * Falls back to a static render for placeholder values with no leading
 * digit (e.g. "[X]+") and for prefers-reduced-motion.
 */
export function CountUp({ value, durationMs = 1400, className }: CountUpProps) {
  const match = value.match(/^([\d,]+)(.*)$/);
  const [display, setDisplay] = useState(match ? match[1] : value);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const m = value.match(/^([\d,]+)(.*)$/);
    if (!m) return;

    const target = Number(m[1].replace(/,/g, ""));
    const node = ref.current;
    if (!Number.isFinite(target) || target <= 0 || !node) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const hasCommas = m[1].includes(",");
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        setDisplay("0");
        const start = performance.now();

        function tick(now: number) {
          const progress = Math.min((now - start) / durationMs, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          const current = Math.round(target * eased);
          setDisplay(hasCommas ? current.toLocaleString("en-GB") : String(current));
          if (progress < 1) requestAnimationFrame(tick);
        }
        requestAnimationFrame(tick);
      },
      { threshold: 0.4 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [value, durationMs]);

  return (
    <span ref={ref} className={className}>
      {display}
      {match ? match[2] : ""}
    </span>
  );
}
