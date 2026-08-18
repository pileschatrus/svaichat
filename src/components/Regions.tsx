import { useMemo, useState } from "react";
import { REGIONS, regionLink } from "../regions";
import { ArrowUpRight, PinIcon, SearchIcon } from "../icons";
import { useLead } from "../LeadModal";
import { Reveal } from "../ui";

export default function Regions() {
  const [q, setQ] = useState("");
  const { openLead } = useLead();

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    return s ? REGIONS.filter((r) => r.name.toLowerCase().includes(s)) : REGIONS;
  }, [q]);

  const totalBuilders = useMemo(() => REGIONS.reduce((a, r) => a + r.count, 0), []);

  return (
    <section id="regions" className="bg-blueprint-light relative scroll-mt-20 bg-paper-50 py-20 text-ink-950 sm:py-28">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="grid gap-12 lg:grid-cols-[340px_1fr] lg:gap-16">
          {/* sticky intro */}
          <div className="lg:sticky lg:top-28 lg:self-start">
            <Reveal>
              <p className="flex items-baseline gap-4">
                <span className="font-mono text-xs tracking-[0.25em] text-safety-600">03</span>
                <span className="font-mono text-xs uppercase tracking-[0.25em] text-steel-500">География</span>
              </p>
              <h2 className="mt-5 font-display text-2xl font-bold uppercase leading-tight sm:text-3xl xl:text-4xl">
                От Калининграда до&nbsp;Хабаровска
              </h2>
              <p className="mt-5 text-sm leading-relaxed text-steel-500">
                В каждом регионе — свои бригады, свои грунты и свои заводы рядом.
                Заказ уходит подрядчикам поблизости, поэтому доставка и выезд
                на замер не съедают смету.
              </p>

              <div className="relative mt-7">
                <SearchIcon className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-steel-500" />
                <input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Найти регион…"
                  className="w-full border border-paper-300 bg-paper-100 py-3.5 pl-11 pr-4 font-mono text-sm text-ink-950 outline-none transition-colors placeholder:text-steel-400 focus:border-ink-950"
                />
              </div>
              <p className="mt-3 font-mono text-[11px] uppercase tracking-[0.18em] text-steel-500">
                Найдено {filtered.length} из {REGIONS.length}
              </p>

              <button
                onClick={() =>
                  openLead({
                    title: "Подобрать бригаду в моём регионе",
                    subtitle: "Менеджер Свайчат передаст заявку подрядчикам поблизости — получите 2–3 сметы и фото их объектов.",
                    cta: "Подобрать бригаду",
                  })
                }
                className="group mt-7 flex w-full items-start justify-between gap-4 bg-ink-950 p-6 text-left text-paper-50 transition-transform hover:-translate-y-1"
              >
                <div>
                  <p className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-steel-400">
                    <span className="dot-live inline-block h-1.5 w-1.5 rounded-full bg-green-400" />
                    Сейчас онлайн
                  </p>
                  <p className="mt-3 font-display text-2xl font-bold">52 строителя</p>
                  <p className="mt-1 text-xs text-steel-400">
                    и 9 заводов отвечают в среднем за 12 минут
                  </p>
                </div>
                <ArrowUpRight className="h-5 w-5 shrink-0 text-safety-400 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
              </button>
            </Reveal>
          </div>

          {/* chips */}
          <Reveal delay={100}>
            <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
              {filtered.map((r) => (
                <a
                  key={r.slug}
                  href={regionLink(r.slug)}
                  className="group flex items-center justify-between gap-3 border border-paper-300 bg-paper-100/60 px-4 py-3.5 transition-all duration-200 hover:-translate-y-0.5 hover:border-ink-950 hover:bg-ink-950"
                >
                  <span className="flex items-center gap-2.5 text-sm font-semibold text-ink-900 transition-colors group-hover:text-paper-50">
                    <PinIcon className="h-4 w-4 shrink-0 text-safety-600 transition-colors group-hover:text-safety-400" />
                    {r.name}
                  </span>
                  <span className="flex shrink-0 items-center gap-2">
                    <span className="border border-paper-300 px-2 py-0.5 font-mono text-[10px] font-bold text-steel-500 transition-colors group-hover:border-safety-500 group-hover:text-safety-400">
                      {r.count}
                    </span>
                    <ArrowUpRight className="h-3.5 w-3.5 text-steel-400 opacity-0 transition-all group-hover:translate-x-0.5 group-hover:opacity-100 group-hover:text-safety-400" />
                  </span>
                </a>
              ))}
            </div>

            {filtered.length === 0 && (
              <div className="mt-10 border border-dashed border-paper-300 p-10 text-center">
                <p className="font-display text-lg font-bold uppercase">Ничего не нашли</p>
                <p className="mt-2 text-sm text-steel-500">
                  По запросу «{q}» регионов нет. Напишите нам — подключим ближайших подрядчиков.
                </p>
              </div>
            )}

            <p className="mt-8 border-l-2 border-safety-500 pl-4 font-mono text-[11px] uppercase tracking-[0.16em] leading-relaxed text-steel-500">
              {totalBuilders} подрядчиков в реестре · ваш регион подключим за 1–2 дня
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
