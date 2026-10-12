import { useEffect, useRef, useState, type ReactNode, type SVGProps } from "react";
import { Link } from "react-router-dom";
import type { Crumb } from "../seo";

type IconProps = SVGProps<SVGSVGElement>;

export const TelegramIcon = (p: IconProps) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...p}>
    <path d="M21.94 4.3 18.8 19.1c-.24 1.05-.86 1.31-1.74.82l-4.8-3.54-2.32 2.23c-.26.26-.47.47-.96.47l.34-4.87 8.87-8.01c.39-.34-.08-.53-.6-.19L6.62 13.2l-4.72-1.47c-1.03-.32-1.05-1.03.21-1.52l18.45-7.11c.85-.32 1.6.19 1.38 1.2Z" />
  </svg>
);

export const MaxIcon = (p: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden {...p}>
    <path
      d="M12 2.5c5.25 0 9.5 3.97 9.5 8.87 0 4.9-4.25 8.88-9.5 8.88-1.12 0-2.2-.18-3.2-.51L4 21.5l1.2-4.18A8.5 8.5 0 0 1 2.5 11.37C2.5 6.47 6.75 2.5 12 2.5Z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinejoin="round"
    />
    <path d="M7.5 14.5V8.6l4.5 4.2 4.5-4.2v5.9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const InstagramIcon = (p: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden {...p}>
    <rect x="3" y="3" width="18" height="18" rx="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
  </svg>
);

export function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <span className="flex items-center gap-3">
      <svg viewBox="0 0 40 40" className="h-9 w-9 shrink-0" aria-hidden>
        <defs>
          <linearGradient id="lg-l" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#ffb08a" />
            <stop offset=".5" stopColor="#ff5a1f" />
            <stop offset="1" stopColor="#b33306" />
          </linearGradient>
        </defs>
        <rect x="1" y="1" width="38" height="38" rx="11" fill="#141519" stroke="rgba(255,255,255,.1)" />
        <path d="M8 25c2.5-6 6-9.5 12-9.5S29.5 19 32 25" stroke="url(#lg-l)" strokeWidth="3.2" fill="none" strokeLinecap="round" />
        <circle cx="13" cy="27" r="2.6" fill="#fff" />
        <circle cx="27" cy="27" r="2.6" fill="#fff" />
        <path d="M14 13.5 20 9l6 4.5" stroke="#fff" strokeOpacity=".5" strokeWidth="2" fill="none" strokeLinecap="round" />
      </svg>
      {!compact && (
        <span className="leading-none">
          <span className="block font-display text-[12px] font-bold tracking-[0.08em] whitespace-nowrap text-white uppercase sm:text-[13px]">Кузовной центр</span>
          <span className="mt-1 block font-mono text-[9px] tracking-[0.16em] whitespace-nowrap text-fog-400 uppercase sm:text-[9.5px] sm:tracking-[0.2em]">Чебоксары · Водопроводная 2А</span>
        </span>
      )}
    </span>
  );
}

export function Reveal({ children, className = "", delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [on, setOn] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!("IntersectionObserver" in window)) return setOn(true);
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setOn(true);
          io.disconnect();
        }
      },
      { threshold: 0.08, rootMargin: "0px 0px -40px 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <div ref={ref} className={`rv ${on ? "on" : ""} ${className}`} style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  );
}

export function SectionHead({
  eyebrow,
  title,
  sub,
  center = false,
  as: H = "h2",
}: {
  eyebrow?: string;
  title: ReactNode;
  sub?: ReactNode;
  center?: boolean;
  as?: "h1" | "h2";
}) {
  return (
    <div className={center ? "mx-auto max-w-3xl text-center" : "max-w-3xl"}>
      {eyebrow && (
        <div className={`eyebrow mb-4 flex items-center gap-3 ${center ? "justify-center" : ""}`}>
          <span className="h-px w-8 bg-lava-500" />
          {eyebrow}
        </div>
      )}
      <H className="h-display chrome text-[30px] sm:text-[40px] lg:text-[48px]">{title}</H>
      {sub && <p className="mt-5 text-[16.5px] leading-relaxed text-fog-300">{sub}</p>}
    </div>
  );
}

export function Breadcrumbs({ crumbs }: { crumbs: Crumb[] }) {
  return (
    <nav aria-label="Хлебные крошки" className="mb-6 flex flex-wrap items-center gap-2 text-[13px] text-fog-500">
      {crumbs.map((c, i) => (
        <span key={c.path} className="flex items-center gap-2">
          {i > 0 && <span className="text-ink-500">/</span>}
          {i < crumbs.length - 1 ? (
            <Link to={c.path} className="transition-colors hover:text-white">
              {c.name}
            </Link>
          ) : (
            <span className="text-fog-300">{c.name}</span>
          )}
        </span>
      ))}
    </nav>
  );
}

export function useToast() {
  const [msg, setMsg] = useState<string | null>(null);
  const t = useRef<number>();
  const show = (m: string) => {
    setMsg(m);
    window.clearTimeout(t.current);
    t.current = window.setTimeout(() => setMsg(null), 2600);
  };
  const node = msg ? (
    <div
      role="status"
      className="no-print fixed bottom-24 left-1/2 z-[80] -translate-x-1/2 rounded-full border border-white/10 bg-ink-800/95 px-5 py-3 text-sm text-white shadow-2xl backdrop-blur"
      style={{ animation: "fade-in .2s both" }}
    >
      {msg}
    </div>
  ) : null;
  return { show, node };
}

export function useAnimatedNumber(target: number, duration = 650) {
  const [val, setVal] = useState(target);
  const cur = useRef(target);
  useEffect(() => {
    const start = cur.current;
    if (start === target) return;
    const t0 = performance.now();
    let raf = 0;
    const step = (t: number) => {
      const p = Math.min(1, (t - t0) / duration);
      const e = 1 - Math.pow(1 - p, 3);
      cur.current = Math.round(start + (target - start) * e);
      setVal(cur.current);
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [target, duration]);
  return val;
}
