import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ArrowDown, Check, ListPlus, Pencil, RotateCcw, Sparkles } from "lucide-react";
import { SITE, track } from "../config";
import { BRAND_BY_SLUG } from "../data/cars";
import {
  CAR_CLASSES,
  DAMAGE_BY_ID,
  EXTRAS,
  PAINT_TYPES,
  PART_BY_ID,
  SIZES,
  estimate,
  fmt,
  priceForClass,
  type PaintType,
  type Selection,
} from "../data/pricing";
import { SCENARIOS, SCENARIO_BY_ID } from "../data/scenarios";
import BodyMap, { MAP_ORDER } from "./BodyMap";
import CarPicker, { type Car } from "./CarPicker";
import DamagePicker from "./DamagePicker";
import OrderDoc from "./OrderDoc";
import { useAnimatedNumber } from "./ui";

type State = { car: Car; paint: PaintType; sel: Selection[]; extras: string[] };

const encode = (s: State) => {
  const c = [s.car.brand ?? "", s.car.model ?? "", s.car.cls, s.paint, s.sel.map((x) => [x.partId, x.damage, x.size, x.option].join(".")).join("~"), s.extras.join("~")];
  return btoa(c.join("|")).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
};
const decode = (h: string): State | null => {
  try {
    const [brand, model, cls, paint, sel, extras] = atob(h.replace(/-/g, "+").replace(/_/g, "/")).split("|");
    if (!(cls in CAR_CLASSES)) return null;
    return {
      car: { brand: brand || undefined, model: model || undefined, cls: cls as Car["cls"] },
      paint: (PAINT_TYPES.some((p) => p.id === paint) ? paint : "metallic") as PaintType,
      sel: sel
        ? sel.split("~").map((x) => {
            const [partId, damage, size, option] = x.split(".");
            return { partId, damage, size, option } as Selection;
          }).filter((x) => PART_BY_ID[x.partId] && DAMAGE_BY_ID[x.damage])
        : [],
      extras: extras ? extras.split("~") : [],
    };
  } catch {
    return null;
  }
};

export default function Calculator({
  brand,
  model,
  scenario,
}: {
  brand?: string;
  model?: string;
  scenario?: string;
}) {
  const initCar = (): Car => {
    const b = brand ? BRAND_BY_SLUG[brand] : undefined;
    const md = b?.models.find((x) => x.slug === model);
    return { brand: b?.slug, model: md?.slug, cls: md?.cls ?? b?.cls ?? "comfort" };
  };
  const sc = scenario ? SCENARIO_BY_ID[scenario] : undefined;
  const [state, setState] = useState<State>(() => ({
    car: initCar(),
    paint: "metallic",
    sel: sc?.sel ?? [],
    extras: sc?.extras ?? [],
  }));
  const [active, setActive] = useState<string | null>(null);
  const [listOpen, setListOpen] = useState(false);
  const docRef = useRef<HTMLDivElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  const touched = useRef(false);

  // восстановление сметы из ссылки
  useEffect(() => {
    const m = window.location.hash.match(/^#s=([\w-]+)/);
    if (m) {
      const s = decode(m[1]);
      if (s) {
        setState(s);
        setTimeout(() => docRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 300);
      }
    }
  }, []);

  useEffect(() => {
    const el = rootRef.current;
    if (!el || !("IntersectionObserver" in window)) return;
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const set = useCallback((p: Partial<State>) => {
    if (!touched.current) {
      touched.current = true;
      track("calc_start");
    }
    setState((s) => ({ ...s, ...p }));
  }, []);

  const { car, paint, sel, extras } = state;
  const sorted = useMemo(() => [...sel].sort((a, b) => MAP_ORDER.indexOf(a.partId) - MAP_ORDER.indexOf(b.partId)), [sel]);
  const est = useMemo(() => estimate(sorted, car.cls, paint, extras), [sorted, car.cls, paint, extras]);
  const total = useAnimatedNumber(est.total);

  const b = car.brand ? BRAND_BY_SLUG[car.brand] : undefined;
  const md = b?.models.find((x) => x.slug === car.model);
  const carName = b ? `${b.name}${md ? " " + md.name : ""}` : `Автомобиль класса «${CAR_CLASSES[car.cls].label}»`;

  const recommended = useMemo(() => {
    const r = new Set<string>();
    if (est.paintedCount >= 2) r.add("polishFull");
    if (sel.some((s) => (s.partId === "hood" || s.partId === "bumper_f") && est.rows.find((x) => x.part.id === s.partId)?.lines.some((l) => l.kind === "paint"))) r.add("ppf");
    if (sel.some((s) => s.damage === "rust")) r.add("anticor");
    if (sel.filter((s) => s.partId.startsWith("wheel_")).length >= 2) r.add("wheels");
    if (est.paintedCount >= 1) r.add("ceramic");
    return r;
  }, [sel, est]);

  const extrasSorted = useMemo(() => [...EXTRAS].sort((a, b) => Number(recommended.has(b.id)) - Number(recommended.has(a.id))), [recommended]);

  const save = (s: Selection) => {
    set({ sel: [...sel.filter((x) => x.partId !== s.partId), s] });
    setActive(null);
    track("calc_add");
  };
  const remove = (id: string) => {
    set({ sel: sel.filter((x) => x.partId !== id) });
    setActive(null);
  };

  const shareUrl = typeof window !== "undefined" ? `${window.location.origin}/kalkulyator/#s=${encode(state)}` : `${SITE.url}/kalkulyator/`;

  const applyScenario = (id: string) => {
    const s = SCENARIO_BY_ID[id];
    set({ sel: s.sel, extras: s.extras ?? [] });
    track("calc_scenario");
  };

  return (
    <div ref={rootRef}>
            <div className="grid grid-cols-1 gap-5 lg:grid-cols-[minmax(0,1fr)_400px] lg:items-start xl:gap-7">
        {/* левая колонка */}
        <div className="grid min-w-0 grid-cols-1 gap-5">
          <div className="card min-w-0 rounded-[28px] p-5 sm:p-7">
            <StepTitle n={1} title="Ваш автомобиль" sub="От класса авто зависит стоимость работ" />
            <CarPicker car={car} onChange={(c) => set({ car: c })} />
            <div className="mt-6">
              <div className="mb-2 text-[13px] font-semibold text-fog-200">Цвет кузова</div>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                {PAINT_TYPES.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => set({ paint: p.id })}
                    aria-pressed={paint === p.id}
                    className={`rounded-2xl border p-3 text-left transition-all ${paint === p.id ? "border-lava-500 bg-lava-500/10" : "border-white/8 bg-white/[0.02] hover:border-white/20"}`}
                  >
                    <PaintSwatch id={p.id} />
                    <div className="mt-2 text-[13.5px] font-semibold text-white">{p.label}</div>
                    <div className="mt-0.5 text-[11px] leading-tight text-fog-400">{p.hint}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="card min-w-0 rounded-[28px] p-5 sm:p-7">
            <StepTitle n={2} title="Отметьте повреждения" sub="Нажмите на деталь на схеме — мышкой или пальцем" />
            <div className="no-scrollbar -mx-5 mb-5 flex gap-2 overflow-x-auto px-5 sm:mx-0 sm:flex-wrap sm:px-0">
              {SCENARIOS.map((s) => (
                <button key={s.id} onClick={() => applyScenario(s.id)} className="chip shrink-0 !rounded-2xl !py-2 text-left">
                  <Sparkles className="h-3.5 w-3.5 shrink-0 text-lava-400" />
                  <span>
                    <span className="block text-[12.5px] font-semibold text-white">{s.title}</span>
                    <span className="block text-[11px] text-fog-400">{s.hint}</span>
                  </span>
                </button>
              ))}
            </div>
            <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_200px]">
              <BodyMap selections={sorted} active={active} onPick={setActive} />
              <div className="flex flex-col gap-4">
                <div className="rounded-2xl border border-white/8 bg-white/[0.02] p-4">
                  <div className="text-[12px] font-semibold text-fog-200">Как пользоваться</div>
                  <ol className="mt-2 space-y-1.5 text-[12.5px] leading-snug text-fog-400">
                    <li>1. Нажмите на повреждённую деталь</li>
                    <li>2. Выберите, что с ней случилось</li>
                    <li>3. Цена появится сразу</li>
                  </ol>
                </div>
                <div className="hidden xl:block">
                  <div className="mb-2 text-[11px] tracking-wider text-fog-500 uppercase">Обозначения</div>
                  <div className="space-y-1.5">
                    {["scratch", "deep", "dent", "dentPaint", "rust", "crack", "replace", "paint"].map((id) => {
                      const d = DAMAGE_BY_ID[id as keyof typeof DAMAGE_BY_ID];
                      return (
                        <div key={id} className="flex items-center gap-2 text-[12px] text-fog-300">
                          <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: d.color }} />
                          {d.title}
                        </div>
                      );
                    })}
                  </div>
                </div>
                <button onClick={() => setListOpen((v) => !v)} className="chip justify-center !rounded-2xl">
                  <ListPlus className="h-4 w-4" /> Выбрать из списка
                </button>
              </div>
            </div>
            {listOpen && (
              <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3" style={{ animation: "fade-in .25s both" }}>
                {MAP_ORDER.map((id) => {
                  const on = sel.some((s) => s.partId === id);
                  return (
                    <button key={id} onClick={() => setActive(id)} aria-pressed={on} className="chip justify-start !rounded-xl text-left">
                      {on && <Check className="h-3.5 w-3.5 text-lava-400" />}
                      {PART_BY_ID[id].name}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* правая колонка — смета */}
        <aside className="card min-w-0 rounded-[28px] p-5 sm:p-7 lg:sticky lg:top-24">
          <div className="flex items-center justify-between">
            <StepTitle n={3} title="Ваша смета" sub={carName} compact />
            {sel.length > 0 && (
              <button onClick={() => set({ sel: [], extras: [] })} className="grid h-9 w-9 place-items-center rounded-full text-fog-400 hover:bg-white/5 hover:text-white" aria-label="Очистить смету" title="Очистить">
                <RotateCcw className="h-4 w-4" />
              </button>
            )}
          </div>

          {sorted.length === 0 ? (
            <div className="mt-4 rounded-2xl border border-dashed border-white/12 p-5 text-center text-[13.5px] text-fog-400">
              Отметьте повреждения на схеме или выберите готовую ситуацию — смета соберётся автоматически.
              <div className="mt-3 text-[12px] text-fog-500">
                Покраска элемента для класса «{CAR_CLASSES[car.cls].label}» — от {fmt(priceForClass(7500, car.cls))}
              </div>
            </div>
          ) : (
            <ul className="scroll-thin mt-4 max-h-[340px] space-y-2 overflow-y-auto pr-1">
              {est.rows.map((r, i) => (
                <li key={r.part.id}>
                  <button onClick={() => setActive(r.part.id)} className="group flex w-full items-start gap-3 rounded-2xl border border-white/6 bg-white/[0.02] p-3 text-left transition-colors hover:border-white/20">
                    <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full text-[11px] font-extrabold text-ink-950" style={{ background: r.damage.color }}>
                      {i + 1}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-[13.5px] font-semibold text-white">{r.part.name}</span>
                      <span className="block text-[12px] text-fog-400">
                        {r.option.title}
                        {r.damage.sized ? ` · ${SIZES.find((s) => s.id === r.size)!.label.toLowerCase()}` : ""}
                      </span>
                    </span>
                    <span className="shrink-0 text-right">
                      <span className="block text-[13.5px] font-bold whitespace-nowrap text-white">{fmt(r.total)}</span>
                      <Pencil className="ml-auto mt-1 h-3.5 w-3.5 text-fog-500 opacity-0 transition-opacity group-hover:opacity-100" />
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}

          <div className="mt-5">
            <div className="mb-2 text-[12px] font-semibold tracking-wider text-fog-500 uppercase">Дополнительно</div>
            <div className="scroll-thin max-h-[260px] space-y-1.5 overflow-y-auto pr-1">
              {extrasSorted.map((e) => {
                const on = extras.includes(e.id);
                const price = e.scaled ? priceForClass(e.base, car.cls) : e.base;
                const rec = recommended.has(e.id);
                return (
                  <label key={e.id} className={`flex cursor-pointer items-start gap-3 rounded-2xl border p-3 transition-colors ${on ? "border-lava-500/60 bg-lava-500/8" : rec ? "border-mint-400/30 bg-mint-400/[0.04]" : "border-white/6 hover:border-white/15"}`}>
                    <input
                      type="checkbox"
                      className="mt-1 h-4 w-4 shrink-0 accent-[#ff5a1f]"
                      checked={on}
                      onChange={() => set({ extras: on ? extras.filter((x) => x !== e.id) : [...extras, e.id] })}
                    />
                    <span className="min-w-0 flex-1">
                      <span className="block text-[13px] leading-snug font-semibold text-white">
                        {e.title}
                        {rec && !on && <span className="ml-1.5 rounded-full bg-mint-400/15 px-1.5 py-0.5 align-middle text-[9.5px] font-bold tracking-wide text-mint-400 uppercase">совет</span>}
                      </span>
                      <span className="block text-[11.5px] leading-snug text-fog-400">{e.note}</span>
                    </span>
                    <span className="shrink-0 text-[12.5px] font-semibold whitespace-nowrap text-fog-200">{fmt(price)}</span>
                  </label>
                );
              })}
            </div>
          </div>

          <div className="mt-5 border-t border-white/8 pt-5">
            {est.discount > 0 && (
              <div className="mb-2 flex justify-between text-[13px] text-mint-400">
                <span>Скидка за объём {est.discountPct}%</span>
                <span>−{fmt(est.discount)}</span>
              </div>
            )}
            {est.paintedCount > 0 && est.paintedCount < 3 && (
              <div className="mb-2 text-[12px] text-fog-500">Ещё {3 - est.paintedCount} элемент(а) в покраску — скидка 5%</div>
            )}
            <div className="flex items-end justify-between gap-3">
              <div>
                <div className="text-[12px] text-fog-400">Итого ориентировочно</div>
                <div className="font-display text-[34px] leading-none font-bold text-white tabular-nums">{fmt(total)}</div>
              </div>
              {est.total > 0 && (
                <div className="text-right text-[11.5px] text-fog-500">
                  срок
                  <div className="text-[13px] font-semibold text-fog-200">
                    {est.hours[0]}–{est.hours[1]} дн.
                  </div>
                </div>
              )}
            </div>
            <button
              disabled={est.total === 0}
              onClick={() => {
                docRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
                track("calc_order");
              }}
              className="btn btn-lava mt-4 w-full disabled:pointer-events-none disabled:opacity-40"
            >
              Сформировать заказ-наряд <ArrowDown className="h-4 w-4" />
            </button>
          </div>
        </aside>
      </div>

      <div ref={docRef} className="scroll-mt-24 pt-10">
        {est.rows.length > 0 || est.extras.length > 0 ? (
          <>
            <div className="mb-5 flex items-center gap-3">
              <span className="grid h-8 w-8 place-items-center rounded-full bg-lava-500 font-display text-sm font-bold text-white">4</span>
              <div className="font-display text-xl font-bold text-white sm:text-2xl">Заказ-наряд готов</div>
            </div>
            <OrderDoc carName={carName} cls={car.cls} paint={paint} est={est} shareUrl={shareUrl} />
          </>
        ) : null}
      </div>

      {active && (
        <DamagePicker
          key={active}
          partId={active}
          current={sel.find((s) => s.partId === active)}
          cls={car.cls}
          paint={paint}
          onSave={save}
          onRemove={() => remove(active)}
          onClose={() => setActive(null)}
        />
      )}

      {/* мобильная плашка с итогом */}
      {inView && est.total > 0 && !active && (
        <div className="no-print fixed inset-x-3 bottom-[76px] z-50 sm:bottom-3 flex items-center justify-between gap-3 rounded-2xl border border-white/10 bg-ink-800/95 p-3 pl-4 shadow-2xl backdrop-blur lg:hidden" style={{ animation: "sheet-up .4s var(--ease-out-expo) both" }}>
          <div>
            <div className="text-[11px] text-fog-400">{est.rows.length} работ(ы) · итого</div>
            <div className="font-display text-lg font-bold text-white tabular-nums">{fmt(total)}</div>
          </div>
          <button onClick={() => docRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })} className="btn btn-lava btn-sm">
            Смета <ArrowDown className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
}

function StepTitle({ n, title, sub, compact = false }: { n: number; title: string; sub?: string; compact?: boolean }) {
  return (
    <div className={`flex items-start gap-3 ${compact ? "" : "mb-5"}`}>
      <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-lava-500/40 bg-lava-500/10 font-display text-sm font-bold text-lava-400">{n}</span>
      <div>
        <div className="font-display text-[17px] font-bold text-white sm:text-lg">{title}</div>
        {sub && <div className="text-[12.5px] text-fog-400">{sub}</div>}
      </div>
    </div>
  );
}

function PaintSwatch({ id }: { id: PaintType }) {
  const bg: Record<PaintType, string> = {
    solid: "linear-gradient(135deg,#e11d48,#9f1239)",
    metallic: "radial-gradient(circle at 30% 30%,#e5e7eb 0 2px,transparent 3px),radial-gradient(circle at 70% 60%,#fff 0 1.5px,transparent 2.5px),linear-gradient(135deg,#94a3b8,#334155)",
    pearl: "linear-gradient(135deg,#f8fafc,#c7d2fe 40%,#fbcfe8 70%,#e2e8f0)",
    matte: "linear-gradient(135deg,#3f3f46,#27272a)",
  };
  return <span className="block h-7 w-full rounded-lg border border-white/10" style={{ background: bg[id] }} />;
}
