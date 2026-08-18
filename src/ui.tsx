import { useEffect, useRef, useState, type ReactNode } from "react";
import { fmt } from "./data";

export function usePrefersReducedMotion() {
  const [rm, setRm] = useState(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );
  useEffect(() => {
    const m = window.matchMedia("(prefers-reduced-motion: reduce)");
    const f = () => setRm(m.matches);
    m.addEventListener("change", f);
    return () => m.removeEventListener("change", f);
  }, []);
  return rm;
}

export function useAnimatedNumber(target: number, duration = 700) {
  const [val, setVal] = useState(target);
  const fromRef = useRef(target);
  const rm = usePrefersReducedMotion();
  useEffect(() => {
    if (rm) {
      fromRef.current = target;
      setVal(target);
      return;
    }
    const from = fromRef.current;
    if (from === target) return;
    const t0 = performance.now();
    let raf = 0;
    const step = (t: number) => {
      const p = Math.min(1, (t - t0) / duration);
      const e = 1 - Math.pow(1 - p, 3);
      setVal(Math.round(from + (target - from) * e));
      if (p < 1) raf = requestAnimationFrame(step);
      else fromRef.current = target;
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [target, duration, rm]);
  return val;
}

export function Reveal({
  children,
  className = "",
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [on, setOn] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setOn(true);
          io.disconnect();
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <div
      ref={ref}
      className={`rv ${on ? "on" : ""} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

export function Counter({
  value,
  suffix = "",
  className = "",
}: {
  value: number;
  suffix?: string;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setInView(true);
          io.disconnect();
        }
      },
      { threshold: 0.4 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  const n = useAnimatedNumber(inView ? value : 0, 1100);
  return (
    <span ref={ref} className={className}>
      {fmt(n)}
      {suffix}
    </span>
  );
}

export function SectionHead({
  index,
  kicker,
  title,
  note,
  dark = false,
}: {
  index: string;
  kicker: string;
  title: ReactNode;
  note?: string;
  dark?: boolean;
}) {
  return (
    <Reveal className="mb-10 grid gap-6 lg:mb-14 lg:grid-cols-[auto_1fr] lg:items-end">
      <div className="flex items-baseline gap-4">
        <span
          className={`font-mono text-xs tracking-[0.25em] ${
            dark ? "text-safety-400" : "text-safety-600"
          }`}
        >
          {index}
        </span>
        <span className="font-mono text-xs uppercase tracking-[0.25em] text-steel-500">
          {kicker}
        </span>
      </div>
      <div className="lg:flex lg:items-end lg:justify-between lg:gap-10">
        <h2
          className={`font-display text-2xl font-bold uppercase leading-tight sm:text-3xl xl:text-4xl ${
            dark ? "text-steel-100" : "text-ink-950"
          }`}
        >
          {title}
        </h2>
        {note && (
          <p
            className={`mt-4 max-w-sm text-sm leading-relaxed lg:mt-0 lg:text-right ${
              dark ? "text-steel-400" : "text-steel-500"
            }`}
          >
            {note}
          </p>
        )}
      </div>
    </Reveal>
  );
}
