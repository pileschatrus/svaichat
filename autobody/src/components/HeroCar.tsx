import { useEffect, useRef, useState } from "react";
import { MoveHorizontal } from "lucide-react";

// Интерактивная «до / после»: слева — повреждённый кузов в грунте,
// справа — свежая покраска. Ползунок тянется мышкой или пальцем.

const BODY =
  "M60 222 C50 222 42 214 44 200 L50 170 C52 160 60 154 80 150 L190 140 C240 100 300 72 380 66 C450 62 500 66 540 88 L610 130 C660 136 720 146 748 162 C760 170 764 186 760 200 C758 214 750 222 736 222 L690 222 A60 60 0 0 0 570 222 L250 222 A60 60 0 0 0 130 222 Z";
const GLASS = "M262 134 C300 104 340 88 390 84 L470 82 C498 83 516 90 528 100 L572 130 Z";

function Wheel({ cx }: { cx: number }) {
  return (
    <g>
      <circle cx={cx} cy={222} r={50} fill="#0b0c0e" stroke="#26282d" strokeWidth={3} />
      <circle cx={cx} cy={222} r={34} fill="url(#rim)" />
      <g>
        {Array.from({ length: 10 }).map((_, i) => (
          <rect key={i} x={cx - 2} y={192} width={4} height={26} rx={2} fill="#2c2f36" transform={`rotate(${i * 36} ${cx} 222)`} />
        ))}
      </g>
      <circle cx={cx} cy={222} r={9} fill="#16181c" stroke="#3a3d45" />
      <path d={`M${cx - 26} 208 A30 30 0 0 1 ${cx + 8} 193`} stroke="#ff5a1f" strokeWidth={6} fill="none" strokeLinecap="round" opacity={0.9} />
    </g>
  );
}

export default function HeroCar() {
  const [pos, setPos] = useState(58);
  const [user, setUser] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const drag = useRef(false);

  useEffect(() => {
    if (user) return;
    let raf = 0;
    const t0 = performance.now();
    const loop = (t: number) => {
      const p = (t - t0) / 1000;
      setPos(52 + Math.sin(p * 0.9) * 22);
      raf = requestAnimationFrame(loop);
    };
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!reduce) raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [user]);

  const move = (clientX: number) => {
    const r = ref.current?.getBoundingClientRect();
    if (!r) return;
    setPos(Math.max(4, Math.min(96, ((clientX - r.left) / r.width) * 100)));
  };

  const x = (pos / 100) * 800;

  return (
    <div
      ref={ref}
      className="relative w-full cursor-ew-resize touch-pan-y select-none"
      onPointerDown={(e) => {
        drag.current = true;
        setUser(true);
        (e.target as Element).setPointerCapture?.(e.pointerId);
        move(e.clientX);
      }}
      onPointerMove={(e) => {
        if (drag.current) move(e.clientX);
        else if (e.pointerType === "mouse" && user) move(e.clientX);
      }}
      onPointerUp={() => (drag.current = false)}
      onPointerCancel={() => (drag.current = false)}
      onMouseEnter={() => setUser(true)}
      role="slider"
      aria-label="Сравнение: до и после ремонта"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(pos)}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "ArrowLeft") (setUser(true), setPos((p) => Math.max(4, p - 4)));
        if (e.key === "ArrowRight") (setUser(true), setPos((p) => Math.min(96, p + 4)));
      }}
    >
      <svg viewBox="0 0 800 300" className="block h-auto w-full overflow-visible" aria-hidden>
        <defs>
          <linearGradient id="paint" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#ffb08a" />
            <stop offset=".28" stopColor="#ff5a1f" />
            <stop offset=".62" stopColor="#c2300a" />
            <stop offset="1" stopColor="#5a1503" />
          </linearGradient>
          <linearGradient id="primer" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#7d8088" />
            <stop offset=".6" stopColor="#55585f" />
            <stop offset="1" stopColor="#34363b" />
          </linearGradient>
          <linearGradient id="spec" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#fff" stopOpacity="0" />
            <stop offset=".5" stopColor="#fff" stopOpacity=".75" />
            <stop offset="1" stopColor="#fff" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="glassG" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#3b4250" />
            <stop offset=".5" stopColor="#0d0f13" />
            <stop offset="1" stopColor="#1d222b" />
          </linearGradient>
          <radialGradient id="rim" cx=".4" cy=".35" r=".8">
            <stop offset="0" stopColor="#d4d6dc" />
            <stop offset=".6" stopColor="#6b6f78" />
            <stop offset="1" stopColor="#2b2e34" />
          </radialGradient>
          <radialGradient id="floor" cx=".5" cy=".5" r=".5">
            <stop offset="0" stopColor="#ff5a1f" stopOpacity=".35" />
            <stop offset="1" stopColor="#ff5a1f" stopOpacity="0" />
          </radialGradient>
          <clipPath id="bodyClip">
            <path d={BODY} />
          </clipPath>
          <clipPath id="afterClip">
            <rect x={x} y={0} width={800 - x} height={300} />
          </clipPath>
          <clipPath id="beforeClip">
            <rect x={0} y={0} width={x} height={300} />
          </clipPath>
          <filter id="blur6">
            <feGaussianBlur stdDeviation="6" />
          </filter>
        </defs>

        <ellipse cx={400} cy={276} rx={380} ry={26} fill="url(#floor)" />
        <ellipse cx={400} cy={272} rx={330} ry={10} fill="#000" opacity={0.75} filter="url(#blur6)" />

        {/* ДО */}
        <g clipPath="url(#beforeClip)">
          <path d={BODY} fill="url(#primer)" />
          <g clipPath="url(#bodyClip)">
            <path d="M80 168 C300 150 500 150 745 172" stroke="#2a2c31" strokeWidth={2} fill="none" />
            <ellipse cx={330} cy={182} rx={46} ry={20} fill="#1f2125" opacity={0.55} />
            <ellipse cx={322} cy={176} rx={30} ry={10} fill="#9a9da5" opacity={0.25} />
            <path d="M420 170 l60 18 M430 160 l70 24 M445 156 l40 14" stroke="#c9ccd2" strokeWidth={1.4} opacity={0.75} />
            <circle cx={160} cy={198} r={9} fill="#8a4a1a" opacity={0.8} />
            <circle cx={176} cy={206} r={6} fill="#a35a20" opacity={0.75} />
            <circle cx={150} cy={210} r={4} fill="#6d3410" opacity={0.85} />
            <path d="M600 190 h70 v24 h-70z" fill="#5f6168" opacity={0.6} />
            <path d="M700 196 l18 6 l-6 8 l14 4" stroke="#1a1b1e" strokeWidth={2} fill="none" />
          </g>
        </g>

        {/* ПОСЛЕ */}
        <g clipPath="url(#afterClip)">
          <path d={BODY} fill="url(#paint)" />
          <g clipPath="url(#bodyClip)">
            <path d="M80 168 C300 150 500 150 745 172" stroke="#ffd2bd" strokeOpacity={0.55} strokeWidth={1.6} fill="none" />
            <path d="M60 150 C300 120 520 120 760 160 L760 150 C520 108 300 108 60 140 Z" fill="#fff" opacity={0.18} />
            <rect x={-200} y={0} width={140} height={300} fill="url(#spec)" opacity={0.55} style={{ animation: "sheen 5.5s cubic-bezier(.4,0,.2,1) infinite" }} />
          </g>
        </g>

        {/* общие детали */}
        <path d={GLASS} fill="url(#glassG)" stroke="#000" strokeOpacity={0.4} />
        <path d="M300 112 C340 92 380 86 420 84" stroke="#fff" strokeOpacity={0.25} strokeWidth={3} strokeLinecap="round" fill="none" />
        <path d="M432 82 L436 130" stroke="#0a0b0d" strokeWidth={7} />
        <path d="M434 136 L430 214 M572 132 L566 214" stroke="#000" strokeOpacity={0.35} strokeWidth={1.4} />
        <path d="M712 160 L754 171 L750 180 L708 171 Z" fill="#fff" opacity={0.9} />
        <path d="M712 160 L754 171" stroke="#7dd3fc" strokeWidth={2} />
        <path d="M50 160 L94 154 L92 163 L52 169 Z" fill="#ef4444" />
        <path d="M486 140 h22" stroke="#000" strokeOpacity={0.5} strokeWidth={3} strokeLinecap="round" />
        <path d="M352 142 h22" stroke="#000" strokeOpacity={0.5} strokeWidth={3} strokeLinecap="round" />
        <Wheel cx={190} />
        <Wheel cx={630} />

        {/* разделитель */}
        <line x1={x} y1={20} x2={x} y2={290} stroke="#fff" strokeWidth={2} />
        <line x1={x} y1={20} x2={x} y2={290} stroke="#ff5a1f" strokeWidth={8} opacity={0.25} />
      </svg>

      <div className="pointer-events-none absolute top-[2%] bottom-[2%] -translate-x-1/2" style={{ left: `${pos}%` }}>
        <div className="absolute top-1/2 left-1/2 grid h-12 w-12 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-white/40 bg-white/15 text-white shadow-[0_10px_40px_-5px_rgba(255,90,31,.8)] backdrop-blur-md">
          <MoveHorizontal className="h-5 w-5" />
        </div>
      </div>
      <div className="pointer-events-none absolute top-0 left-2 rounded-full border border-white/10 bg-black/40 px-3 py-1 font-mono text-[10px] tracking-[0.2em] text-fog-300 uppercase backdrop-blur">
        до
      </div>
      <div className="pointer-events-none absolute top-0 right-2 rounded-full border border-lava-500/40 bg-lava-500/15 px-3 py-1 font-mono text-[10px] tracking-[0.2em] text-lava-300 uppercase backdrop-blur">
        после
      </div>
    </div>
  );
}
