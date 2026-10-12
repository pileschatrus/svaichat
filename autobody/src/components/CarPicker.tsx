import { useMemo, useRef, useState } from "react";
import { ChevronDown, Search, X } from "lucide-react";
import { BRANDS, BRAND_BY_SLUG, modelClass, type Brand, type Model } from "../data/cars";
import { CAR_CLASSES, CLASS_ORDER, type ClassId } from "../data/pricing";

export type Car = { brand?: string; model?: string; cls: ClassId };

const norm = (s: string) => s.toLowerCase().replace(/ё/g, "е").replace(/[\s\-_.]+/g, "");

type Hit = { brand: Brand; model?: Model; score: number };

function search(q: string): Hit[] {
  const n = norm(q);
  if (!n) return [];
  const hits: Hit[] = [];
  for (const b of BRANDS) {
    const bn = [norm(b.name), norm(b.ru)];
    const bMatch = bn.some((x) => x.startsWith(n)) ? 3 : bn.some((x) => x.includes(n)) ? 1 : 0;
    if (bMatch) hits.push({ brand: b, score: bMatch + 0.5 });
    for (const md of b.models) {
      const keys = [norm(md.name), norm(md.ru), norm(b.name + md.name), norm(b.ru + md.ru), norm(b.ru + md.name), norm(b.name + md.ru)];
      const s = keys.some((x) => x.startsWith(n)) ? 3 : keys.some((x) => x.includes(n)) ? 1 : 0;
      if (s) hits.push({ brand: b, model: md, score: s + (md.pop ? 0.4 : 0) });
    }
  }
  return hits.sort((a, b) => b.score - a.score).slice(0, 8);
}

export default function CarPicker({ car, onChange }: { car: Car; onChange: (c: Car) => void }) {
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [manual, setManual] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const hits = useMemo(() => search(q), [q]);
  const brand = car.brand ? BRAND_BY_SLUG[car.brand] : undefined;
  const model = brand?.models.find((m) => m.slug === car.model);

  const pick = (b: Brand, md?: Model) => {
    onChange({ brand: b.slug, model: md?.slug, cls: md ? modelClass(b, md) : b.cls });
    setQ("");
    setOpen(false);
    setManual(false);
  };

  return (
    <div>
      {/* поиск */}
      <div className="relative">
        <Search className="pointer-events-none absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 text-fog-500" />
        <input
          ref={inputRef}
          value={q}
          onChange={(e) => {
            setQ(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onBlur={() => setTimeout(() => setOpen(false), 150)}
          placeholder="Марка или модель: Rio, Веста, Камри…"
          className="field !rounded-2xl !py-4 !pl-12 text-[16px]"
          aria-label="Поиск марки и модели автомобиля"
          autoComplete="off"
        />
        {q && (
          <button onClick={() => setQ("")} className="absolute top-1/2 right-3 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-full text-fog-400 hover:bg-white/10" aria-label="Очистить">
            <X className="h-4 w-4" />
          </button>
        )}
        {open && hits.length > 0 && (
          <div className="absolute inset-x-0 top-full z-30 mt-2 overflow-hidden rounded-2xl border border-white/10 bg-ink-800 shadow-2xl">
            {hits.map((h) => {
              const cls = h.model ? modelClass(h.brand, h.model) : h.brand.cls;
              return (
                <button
                  key={h.brand.slug + (h.model?.slug ?? "")}
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => pick(h.brand, h.model)}
                  className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left transition-colors hover:bg-white/5"
                >
                  <span className="text-[15px] text-white">
                    {h.brand.name} <span className="font-semibold">{h.model?.name ?? ""}</span>
                    {!h.model && <span className="text-fog-400"> — все модели</span>}
                  </span>
                  <span className="shrink-0 rounded-full bg-white/5 px-2.5 py-1 text-[11px] text-fog-300">{CAR_CLASSES[cls].label}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* быстрый выбор */}
      {!brand && !manual && (
        <div className="mt-4">
          <div className="mb-2 text-[12px] text-fog-500">Популярные марки</div>
          <div className="flex flex-wrap gap-2">
            {BRANDS.filter((b) => b.top).map((b) => (
              <button key={b.slug} className="chip" onClick={() => onChange({ brand: b.slug, cls: b.cls })}>
                {b.name}
              </button>
            ))}
            <button className="chip !border-dashed" onClick={() => setManual(true)}>
              Другая / не знаю
            </button>
          </div>
        </div>
      )}

      {brand && (
        <div className="mt-4 rounded-2xl border border-white/8 bg-white/[0.02] p-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <div className="text-[12px] text-fog-500">Ваш автомобиль</div>
              <div className="font-display text-lg font-bold text-white">
                {brand.name} {model?.name ?? ""}
              </div>
            </div>
            <button className="chip" onClick={() => onChange({ cls: car.cls })}>
              Изменить <ChevronDown className="h-3.5 w-3.5" />
            </button>
          </div>
          {!model && (
            <div className="mt-3">
              <div className="mb-2 text-[12px] text-fog-500">Выберите модель</div>
              <div className="no-scrollbar -mx-1 flex max-h-40 flex-wrap gap-2 overflow-y-auto px-1">
                {brand.models.map((md) => (
                  <button key={md.slug} className="chip" onClick={() => pick(brand, md)}>
                    {md.name}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {(manual || brand) && (
        <div className="mt-4">
          <div className="mb-2 flex items-baseline justify-between gap-2 text-[12px] text-fog-500">
            <span>{brand ? "Класс определён автоматически — можно поправить" : "Выберите класс автомобиля"}</span>
          </div>
          <div className="no-scrollbar -mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
            {CLASS_ORDER.map((c) => (
              <button
                key={c}
                aria-pressed={car.cls === c}
                onClick={() => onChange({ ...car, cls: c })}
                className="chip shrink-0 flex-col !items-start !gap-0 !rounded-2xl !px-3.5 !py-2 text-left"
                title={CAR_CLASSES[c].examples}
              >
                <span className="font-semibold">{CAR_CLASSES[c].label}</span>
                <span className="text-[10.5px] text-fog-400">×{String(CAR_CLASSES[c].k).replace(".", ",")}</span>
              </button>
            ))}
          </div>
          <div className="mt-2 text-[12px] text-fog-500">Например: {CAR_CLASSES[car.cls].examples}</div>
        </div>
      )}
    </div>
  );
}
