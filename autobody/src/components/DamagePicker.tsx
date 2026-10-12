import { useEffect, useMemo, useState } from "react";
import { Check, Trash2, X } from "lucide-react";
import {
  DAMAGES,
  PART_BY_ID,
  REPAIRS,
  SIZES,
  estimate,
  fmt,
  type ClassId,
  type DamageId,
  type PaintType,
  type Selection,
  type Size,
} from "../data/pricing";

// Простые пиктограммы повреждений — чтобы человек узнал «своё» без терминов
export function DamageGlyph({ id, color }: { id: DamageId; color: string }) {
  const s = { stroke: color, strokeWidth: 2.2, fill: "none", strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  const g: Record<DamageId, JSX.Element> = {
    scratch: <><path d="M6 26 L26 8" {...s} strokeOpacity={0.5} /><path d="M10 28 L28 13" {...s} /></>,
    deep: <><path d="M6 26 L26 8" {...s} /><circle cx="16" cy="17" r="3.5" fill={color} /></>,
    dent: <><path d="M4 12 Q16 30 28 12" {...s} /><path d="M4 8 L28 8" {...s} strokeOpacity={0.35} /></>,
    dentPaint: <><path d="M4 12 Q16 30 28 12" {...s} /><path d="M13 16 l3 3 l-2 3 M19 15 l-2 4" {...s} /></>,
    rust: <><circle cx="11" cy="13" r="4" fill={color} /><circle cx="21" cy="19" r="5" fill={color} fillOpacity={0.6} /><circle cx="22" cy="9" r="2" fill={color} /><circle cx="10" cy="24" r="2.4" fill={color} fillOpacity={0.7} /></>,
    crack: <path d="M5 8 L12 15 L9 19 L17 24 L15 28 M12 15 L21 12 L27 16" {...s} />,
    replace: <><path d="M7 12 h16 l-4 -4 M25 20 H9 l4 4" {...s} /></>,
    paint: <><rect x="9" y="12" width="12" height="15" rx="2" {...s} /><path d="M12 12 V8 h6 v4 M23 8 h3 M24 4 v3 M26 11 l2 1" {...s} /></>,
    curb: <><circle cx="16" cy="16" r="11" {...s} /><circle cx="16" cy="16" r="4" {...s} /><path d="M22 25 l3 -3" {...s} strokeWidth={3.5} /></>,
    wheelPaint: <><circle cx="16" cy="16" r="11" {...s} /><path d="M16 5 V12 M16 20 V27 M5 16 H12 M20 16 H27" {...s} /></>,
    dull: <><path d="M6 10 Q16 4 26 10 V22 Q16 28 6 22 Z" {...s} /><path d="M10 14 h12 M10 18 h8" {...s} strokeOpacity={0.45} /></>,
    film: <path d="M16 4 L26 8 V16 C26 22 21 26 16 28 C11 26 6 22 6 16 V8 Z" {...s} />,
  };
  return (
    <svg viewBox="0 0 32 32" className="h-8 w-8 shrink-0" aria-hidden>
      {g[id]}
    </svg>
  );
}

const SIZE_DOT: Record<Size, number> = { s: 5, m: 9, l: 13 };

export default function DamagePicker({
  partId,
  current,
  cls,
  paint,
  onSave,
  onRemove,
  onClose,
}: {
  partId: string;
  current?: Selection;
  cls: ClassId;
  paint: PaintType;
  onSave: (s: Selection) => void;
  onRemove: () => void;
  onClose: () => void;
}) {
  const part = PART_BY_ID[partId];
  const list = DAMAGES.filter((d) => d.for.includes(part.material));
  const [damage, setDamage] = useState<DamageId | null>(current?.damage ?? null);
  const [size, setSize] = useState<Size>(current?.size ?? "m");
  const [option, setOption] = useState<string | null>(current?.option ?? null);

  const dmg = list.find((d) => d.id === damage);
  const opts = damage ? REPAIRS[damage] : [];
  const opt = opts.find((o) => o.id === option) ?? opts[0];

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [onClose]);

  const priceOf = useMemo(
    () => (opId: string) =>
      damage ? estimate([{ partId, damage, size, option: opId }], cls, paint, []).total : 0,
    [partId, damage, size, cls, paint],
  );

  return (
    <div className="no-print fixed inset-0 z-[70] flex items-end justify-center md:items-center" role="dialog" aria-modal="true" aria-label={part.name}>
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} style={{ animation: "fade-in .2s both" }} />
      <div
        className="relative flex max-h-[92vh] w-full flex-col overflow-hidden rounded-t-[28px] border border-white/10 bg-ink-900 shadow-2xl md:max-w-2xl md:rounded-[28px]"
        style={{ animation: "sheet-up .45s var(--ease-out-expo) both" }}
      >
        <div className="mx-auto mt-3 h-1.5 w-12 rounded-full bg-white/15 md:hidden" />
        <div className="flex items-start justify-between gap-4 px-5 pt-4 pb-3 sm:px-7 sm:pt-6">
          <div>
            <div className="eyebrow">Выбранная деталь</div>
            <div className="mt-1 font-display text-xl font-bold text-white sm:text-2xl">{part.name}</div>
          </div>
          <button onClick={onClose} className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-white/5 text-fog-300 hover:bg-white/10 hover:text-white" aria-label="Закрыть">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="scroll-thin flex-1 overflow-y-auto px-5 pb-5 sm:px-7">
          <div className="mb-3 text-sm font-semibold text-fog-200">1. Что случилось с деталью?</div>
          <div className="grid gap-2 sm:grid-cols-2">
            {list.map((d) => (
              <button
                key={d.id}
                onClick={() => {
                  setDamage(d.id);
                  setOption(null);
                }}
                aria-pressed={damage === d.id}
                className={`flex items-center gap-3 rounded-2xl border p-3 text-left transition-all ${
                  damage === d.id ? "border-transparent bg-white/[0.07] ring-2" : "border-white/8 bg-white/[0.02] hover:border-white/20 hover:bg-white/[0.04]"
                }`}
                style={damage === d.id ? ({ "--tw-ring-color": d.color } as React.CSSProperties) : undefined}
              >
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl" style={{ background: d.color + "1f" }}>
                  <DamageGlyph id={d.id} color={d.color} />
                </span>
                <span>
                  <span className="block text-[14.5px] leading-tight font-semibold text-white">{d.title}</span>
                  <span className="mt-1 block text-[12.5px] leading-snug text-fog-400">{d.hint}</span>
                </span>
              </button>
            ))}
          </div>

          {dmg?.sized && (
            <div className="mt-6" style={{ animation: "fade-in .3s both" }}>
              <div className="mb-3 text-sm font-semibold text-fog-200">2. Насколько большое повреждение?</div>
              <div className="grid grid-cols-3 gap-2">
                {SIZES.map((sz) => (
                  <button
                    key={sz.id}
                    onClick={() => setSize(sz.id)}
                    aria-pressed={size === sz.id}
                    className={`flex flex-col items-center gap-2 rounded-2xl border px-2 py-3 text-center transition-all ${
                      size === sz.id ? "border-lava-500 bg-lava-500/10" : "border-white/8 bg-white/[0.02] hover:border-white/20"
                    }`}
                  >
                    <span className="grid h-8 place-items-center">
                      <span className="block rounded-full" style={{ width: SIZE_DOT[sz.id] * 2, height: SIZE_DOT[sz.id] * 2, background: dmg.color, opacity: 0.85 }} />
                    </span>
                    <span className="text-[13.5px] font-semibold text-white">{sz.label}</span>
                    <span className="text-[11.5px] leading-tight text-fog-400">{sz.hint}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {dmg && (
            <div className="mt-6" style={{ animation: "fade-in .3s both" }}>
              <div className="mb-3 text-sm font-semibold text-fog-200">{dmg.sized ? "3" : "2"}. Как будем ремонтировать</div>
              <div className="grid gap-2">
                {opts.map((o, i) => {
                  const on = (opt?.id ?? opts[0].id) === o.id;
                  return (
                    <button
                      key={o.id}
                      onClick={() => setOption(o.id)}
                      aria-pressed={on}
                      className={`flex items-start gap-3 rounded-2xl border p-4 text-left transition-all ${
                        on ? "border-lava-500 bg-lava-500/10" : "border-white/8 bg-white/[0.02] hover:border-white/20"
                      }`}
                    >
                      <span className={`mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full border ${on ? "border-lava-500 bg-lava-500" : "border-white/25"}`}>
                        {on && <Check className="h-3 w-3 text-white" strokeWidth={3} />}
                      </span>
                      <span className="flex-1">
                        <span className="flex flex-wrap items-center gap-2">
                          <span className="text-[14.5px] font-semibold text-white">{o.title}</span>
                          {i === 0 && opts.length > 1 && (
                            <span className="rounded-full bg-mint-400/15 px-2 py-0.5 text-[10.5px] font-bold tracking-wide text-mint-400 uppercase">Рекомендуем</span>
                          )}
                        </span>
                        <span className="mt-1 block text-[12.5px] leading-snug text-fog-400">{o.note}</span>
                      </span>
                      <span className="shrink-0 font-display text-[15px] font-bold whitespace-nowrap text-white">{fmt(priceOf(o.id))}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center gap-3 border-t border-white/8 bg-ink-850 px-5 py-4 sm:px-7">
          {current && (
            <button onClick={onRemove} className="btn btn-ghost btn-sm !px-4" aria-label="Убрать из сметы">
              <Trash2 className="h-4 w-4" />
              <span className="hidden sm:inline">Убрать</span>
            </button>
          )}
          <div className="ml-auto text-right">
            {dmg && opt && (
              <>
                <div className="text-[11px] text-fog-400">Ориентировочно</div>
                <div className="font-display text-lg font-bold text-white">{fmt(priceOf(opt.id))}</div>
              </>
            )}
          </div>
          <button
            disabled={!dmg}
            onClick={() => dmg && opt && onSave({ partId, damage: dmg.id, size: dmg.sized ? size : "m", option: opt.id })}
            className="btn btn-lava disabled:pointer-events-none disabled:opacity-40"
          >
            {current ? "Сохранить" : "В смету"}
          </button>
        </div>
      </div>
    </div>
  );
}
