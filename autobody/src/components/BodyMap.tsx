import { useState, type ReactNode } from "react";
import { DAMAGE_BY_ID, PART_BY_ID, type Selection } from "../data/pricing";

// Развёрнутая схема кузова: автомобиль «раскрыт» как коробка.
// В центре — вид сверху (перед смотрит вверх), по бокам — левый и правый борт,
// сверху — вид спереди, снизу — вид сзади. Одна деталь может присутствовать
// на нескольких видах (например, бампер) — подсвечивается везде одновременно.

type Shape = {
  part: string;
  d?: string;
  circle?: [number, number, number];
  label?: { x: number; y: number; rot?: number; text?: string; size?: number };
  badge?: [number, number];
};

const W = 520;

// Левый борт. Правый получается зеркальным отражением.
const sideShapes = (s: "l" | "r"): Shape[] => {
  const f = s === "l" ? "fl" : "fr";
  const r = s === "l" ? "rl" : "rr";
  return [
    { part: "bumper_f", d: "M44 182 L44 166 C44 157 51 152 60 152 L106 152 C114 152 120 157 120 165 L120 182 Z" },
    {
      part: `fender_${f}`,
      d: "M44 186 L122 186 C126 186 128 188 128 192 L128 330 L44 330 L44 290 A40 40 0 0 0 44 210 Z",
      label: { x: 107, y: 252, rot: -90 },
      badge: [100, 312],
    },
    { part: `door_${f}`, d: "M48 334 L128 334 L128 452 L44 452 L44 338 C44 336 46 334 48 334 Z", label: { x: 86, y: 404 }, badge: [86, 372] },
    { part: `door_${r}`, d: "M44 456 L128 456 L128 564 L48 564 C46 564 44 562 44 560 Z", label: { x: 86, y: 522 }, badge: [86, 490] },
    {
      part: `quarter_${s}`,
      d: "M44 568 L128 568 L128 668 C128 672 125 674 121 674 L44 674 L44 652 A40 40 0 0 0 44 572 Z",
      label: { x: 107, y: 612, rot: -90 },
      badge: [100, 662],
    },
    { part: "bumper_r", d: "M44 678 L120 678 L120 690 C120 698 114 704 106 704 L60 704 C51 704 44 699 44 690 Z" },
    { part: `sill_${s}`, d: "M30 334 L40 334 L40 564 L30 564 C28 564 26 562 26 560 L26 338 C26 336 28 334 30 334 Z", label: { x: 33, y: 449, rot: -90, size: 9 }, badge: [33, 400] },
    { part: `mirror_${s}`, d: "M131 326 L151 329 C157 331 160 337 158 343 L153 352 L131 350 Z", badge: [146, 339] },
    { part: `wheel_${f}`, circle: [44, 250, 30], badge: [44, 250] },
    { part: `wheel_${r}`, circle: [44, 612, 30], badge: [44, 612] },
  ];
};

const sideGlass = [
  "M132 338 L132 452 L157 452 L157 384 Z",
  "M132 456 L157 456 L157 538 L132 562 Z",
];

const topShapes: Shape[] = [
  { part: "bumper_f", d: "M184 182 C184 160 196 152 222 151 L298 151 C324 152 336 160 336 182 Z", label: { x: 260, y: 168, text: "Бампер" }, badge: [318, 168] },
  { part: "hood", d: "M184 186 L336 186 C340 230 341 280 340 320 L180 320 C179 280 180 230 184 186 Z", label: { x: 260, y: 268 }, badge: [260, 236] },
  { part: "roof", d: "M194 378 L326 378 C329 430 329 478 326 528 L194 528 C191 478 191 430 194 378 Z", label: { x: 260, y: 468 }, badge: [260, 436] },
  { part: "trunk", d: "M184 572 L336 572 C339 600 339 625 336 648 L184 648 C181 625 181 600 184 572 Z", label: { x: 260, y: 622 }, badge: [260, 594] },
  { part: "bumper_r", d: "M184 652 L336 652 C336 674 326 681 300 682 L220 682 C194 681 184 674 184 652 Z", label: { x: 260, y: 667, text: "Бампер" }, badge: [318, 666] },
];
const topGlass = ["M181 324 L339 324 L327 374 L193 374 Z", "M194 532 L326 532 L336 568 L184 568 Z"];

// Вид спереди (как если стоять перед автомобилем: левая сторона авто — справа)
const frontShapes: Shape[] = [
  { part: "hood", d: "M192 62 L328 62 L338 76 L182 76 Z" },
  { part: "head_l", d: "M302 80 L342 78 C345 78 346 80 346 83 L344 94 L306 97 Z", badge: [325, 88] },
  { part: "head_r", d: "M218 80 L178 78 C175 78 174 80 174 83 L176 94 L214 97 Z", badge: [195, 88] },
  { part: "bumper_f", d: "M174 101 L346 101 L350 120 C351 127 346 132 339 132 L181 132 C174 132 169 127 170 120 Z", label: { x: 260, y: 117, text: "Передний бампер" } },
  { part: "mirror_l", d: "M336 50 L357 44 C363 43 366 50 362 55 L340 60 Z" },
  { part: "mirror_r", d: "M184 50 L163 44 C157 43 154 50 158 55 L180 60 Z" },
];
const frontGlass = ["M210 22 L310 22 L326 58 L194 58 Z"];

// Вид сзади (левая сторона авто — слева)
const rearShapes: Shape[] = [
  { part: "trunk", d: "M190 750 L330 750 L340 780 L180 780 Z" },
  { part: "bumper_r", d: "M174 800 L346 800 L350 819 C351 826 346 831 339 831 L181 831 C174 831 169 826 170 819 Z", label: { x: 260, y: 816, text: "Задний бампер" } },
];
const rearGlass = ["M210 718 L310 718 L324 746 L196 746 Z"];

export const MAP_ORDER = [
  "bumper_f", "hood", "roof", "trunk", "bumper_r",
  "fender_fl", "door_fl", "door_rl", "quarter_l", "sill_l", "mirror_l", "head_l", "wheel_fl", "wheel_rl",
  "fender_fr", "door_fr", "door_rr", "quarter_r", "sill_r", "mirror_r", "head_r", "wheel_fr", "wheel_rr",
];

export default function BodyMap({
  selections,
  active,
  onPick,
}: {
  selections: Selection[];
  active: string | null;
  onPick: (partId: string) => void;
}) {
  const [hover, setHover] = useState<string | null>(null);
  const selIndex = new Map(selections.map((s, i) => [s.partId, i]));

  const renderShape = (sh: Shape, key: string, mirror: boolean, labels: ReactNode[], badges: ReactNode[]) => {
    const sel = selIndex.has(sh.part) ? selections[selIndex.get(sh.part)!] : null;
    const color = sel ? DAMAGE_BY_ID[sel.damage].color : undefined;
    const part = PART_BY_ID[sh.part];
    const cls = `part ${active === sh.part ? "is-active" : ""} ${hover === sh.part ? "is-hover" : ""}`;
    const style = color && active !== sh.part ? { fill: color + "40", stroke: color, strokeWidth: 1.8 } : undefined;
    const common = {
      className: cls,
      style,
      onClick: () => onPick(sh.part),
      onMouseEnter: () => setHover(sh.part),
      onMouseLeave: () => setHover(null),
      role: "button",
      tabIndex: 0,
      "aria-label": part.name + (sel ? ` — ${DAMAGE_BY_ID[sel.damage].title}` : ""),
      onKeyDown: (e: React.KeyboardEvent) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onPick(sh.part);
        }
      },
    };
    const mx = (x: number) => (mirror ? W - x : x);
    if (sh.label) {
      const { x, y, rot = 0, text, size } = sh.label;
      const rr = mirror ? -rot : rot;
      labels.push(
        <text
          key={key + "-l"}
          className="part-label"
          x={mx(x)}
          y={y}
          transform={rr ? `rotate(${rr} ${mx(x)} ${y})` : undefined}
          style={size ? { fontSize: size } : undefined}
        >
          {text ?? part.label}
        </text>,
      );
    }
    if (sh.badge && sel) {
      const [bx, by] = sh.badge;
      badges.push(
        <g key={key + "-b-" + sel.damage} className="anim-pop" style={{ pointerEvents: "none" }}>
          <circle cx={mx(bx)} cy={by} r={10} fill={color} stroke="#0e0f12" strokeWidth={2} />
          <text x={mx(bx)} y={by + 0.5} textAnchor="middle" dominantBaseline="middle" fontSize="10.5" fontWeight="800" fill="#0e0f12">
            {selIndex.get(sh.part)! + 1}
          </text>
        </g>,
      );
    }
    if (sh.circle) {
      const [cx, cy, r] = sh.circle;
      return (
        <g key={key}>
          <circle cx={cx} cy={cy} r={r} {...common} />
          <circle cx={cx} cy={cy} r={r * 0.55} fill="none" stroke="rgba(255,255,255,.22)" strokeWidth={1} pointerEvents="none" />
          <circle cx={cx} cy={cy} r={3} fill="rgba(255,255,255,.35)" pointerEvents="none" />
        </g>
      );
    }
    return <path key={key} d={sh.d} {...common} />;
  };

  const labels: ReactNode[] = [];
  const badges: ReactNode[] = [];
  const glass = (d: string, k: string) => <path key={k} d={d} className="glass-part" />;

  return (
    <div className="relative">
      <svg viewBox={`0 0 ${W} 840`} className="mx-auto block h-auto w-full max-w-[520px] touch-manipulation select-none" role="group" aria-label="Схема кузова автомобиля">
        <defs>
          <radialGradient id="bm-floor" cx="50%" cy="50%" r="50%">
            <stop offset="0" stopColor="rgba(255,90,31,.10)" />
            <stop offset="1" stopColor="rgba(255,90,31,0)" />
          </radialGradient>
        </defs>
        <ellipse cx={260} cy={420} rx={250} ry={400} fill="url(#bm-floor)" />

        {/* подписи сторон */}
        <text x={10} y={449} transform="rotate(-90 10 449)" className="part-label" style={{ fontSize: 9, letterSpacing: "0.25em", fill: "rgba(255,255,255,.35)" }}>
          ЛЕВЫЙ БОРТ
        </text>
        <text x={510} y={449} transform="rotate(90 510 449)" className="part-label" style={{ fontSize: 9, letterSpacing: "0.25em", fill: "rgba(255,255,255,.35)" }}>
          ПРАВЫЙ БОРТ
        </text>
        <text x={260} y={8} className="part-label" style={{ fontSize: 9, letterSpacing: "0.25em", fill: "rgba(255,255,255,.35)" }}>
          ВИД СПЕРЕДИ
        </text>
        <text x={260} y={710} className="part-label" style={{ fontSize: 9, letterSpacing: "0.25em", fill: "rgba(255,255,255,.35)" }}>
          ВИД СЗАДИ
        </text>
        <text x={80} y={140} className="part-label" style={{ fontSize: 9, fill: "rgba(255,255,255,.35)" }}>
          ▲ перед
        </text>
        <text x={440} y={140} className="part-label" style={{ fontSize: 9, fill: "rgba(255,255,255,.35)" }}>
          ▲ перед
        </text>

        {/* вид спереди */}
        <g>
          {frontGlass.map((d, i) => glass(d, "fg" + i))}
          <rect x={228} y={83} width={64} height={14} rx={4} fill="none" stroke="rgba(255,255,255,.2)" />
          {frontShapes.map((s, i) => renderShape(s, "f" + i, false, labels, badges))}
        </g>

        {/* вид сверху */}
        <g>
          {topGlass.map((d, i) => glass(d, "tg" + i))}
          {topShapes.map((s, i) => renderShape(s, "t" + i, false, labels, badges))}
        </g>

        {/* левый борт */}
        <g>
          {sideGlass.map((d, i) => glass(d, "lg" + i))}
          <path d="M161 384 L161 540" stroke="rgba(255,255,255,.18)" strokeWidth={6} strokeLinecap="round" />
          {sideShapes("l").map((s, i) => renderShape(s, "l" + i, false, labels, badges))}
        </g>

        {/* правый борт — зеркально */}
        <g transform={`translate(${W} 0) scale(-1 1)`}>
          {sideGlass.map((d, i) => glass(d, "rg" + i))}
          <path d="M161 384 L161 540" stroke="rgba(255,255,255,.18)" strokeWidth={6} strokeLinecap="round" />
          {sideShapes("r").map((s, i) => renderShape(s, "r" + i, true, [], []))}
        </g>

        {/* вид сзади */}
        <g>
          {rearGlass.map((d, i) => glass(d, "bg" + i))}
          <path d="M178 784 L214 784 L212 795 L180 795 Z M342 784 L306 784 L308 795 L340 795 Z" fill="rgba(239,68,68,.25)" stroke="rgba(239,68,68,.5)" />
          {rearShapes.map((s, i) => renderShape(s, "b" + i, false, labels, badges))}
        </g>

        {labels}
        {/* подписи и бейджи правого борта (без зеркального текста) */}
        {(() => {
          const rl: ReactNode[] = [];
          const rb: ReactNode[] = [];
          sideShapes("r").forEach((s, i) => {
            const sel = selIndex.has(s.part);
            if (s.label) {
              const { x, y, rot = 0, size } = s.label;
              const X = W - x;
              rl.push(
                <text key={"rl" + i} className="part-label" x={X} y={y} transform={rot ? `rotate(${-rot} ${X} ${y})` : undefined} style={size ? { fontSize: size } : undefined}>
                  {PART_BY_ID[s.part].label}
                </text>,
              );
            }
            if (s.badge && sel) {
              const se = selections[selIndex.get(s.part)!];
              const color = DAMAGE_BY_ID[se.damage].color;
              const [bx, by] = s.badge;
              rb.push(
                <g key={"rb" + i + se.damage} className="anim-pop" style={{ pointerEvents: "none" }}>
                  <circle cx={W - bx} cy={by} r={10} fill={color} stroke="#0e0f12" strokeWidth={2} />
                  <text x={W - bx} y={by + 0.5} textAnchor="middle" dominantBaseline="middle" fontSize="10.5" fontWeight="800" fill="#0e0f12">
                    {selIndex.get(s.part)! + 1}
                  </text>
                </g>,
              );
            }
          });
          return [...rl, ...rb];
        })()}
        {badges}
      </svg>
      {hover && (
        <div className="pointer-events-none absolute top-2 left-1/2 hidden -translate-x-1/2 rounded-full border border-white/10 bg-ink-800/95 px-3 py-1.5 text-xs font-semibold text-white shadow-xl md:block">
          {PART_BY_ID[hover].name}
        </div>
      )}
    </div>
  );
}
