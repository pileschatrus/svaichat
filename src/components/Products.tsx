import { useState } from "react";
import { HEAD_ROWS, JB_ROWS, PILES, TECH_ROWS, fmt } from "../data";
import { ArrowUpRight } from "../icons";
import { useLead } from "../LeadModal";
import { Reveal, SectionHead } from "../ui";

type Tab = "screw" | "jb" | "heads" | "tech";

const TABS: { id: Tab; label: string }[] = [
  { id: "screw", label: "Винтовые сваи" },
  { id: "jb", label: "ЖБ сваи" },
  { id: "heads", label: "Оголовки и обвязка" },
  { id: "tech", label: "Спецтехника" },
];

function OrderBtn({ name, price }: { name: string; price: string }) {
  const { openLead } = useLead();
  return (
    <button
      onClick={() =>
        openLead({
          title: `Заказать: ${name}`,
          subtitle: `Ориентир — ${price}. Менеджер уточнит наличие на складе, доставку в ваш регион и скидку за объём.`,
          cta: "Заказать",
          comment: `Интересует: ${name} (ориентир ${price}).`,
        })
      }
      aria-label={`Заказать: ${name}`}
      className="grid h-10 w-10 shrink-0 place-items-center border border-ink-950 text-ink-950 transition-all hover:bg-safety-500 hover:border-safety-500 hover:text-ink-950 sm:opacity-0 sm:group-hover:opacity-100"
    >
      <ArrowUpRight className="h-4 w-4" />
    </button>
  );
}

function Row({
  name,
  sub,
  use,
  param,
  price,
  old,
  badge,
  delay,
}: {
  name: string;
  sub?: string;
  use: string;
  param: string;
  price: string;
  old?: string;
  badge?: string;
  delay: number;
}) {
  return (
    <Reveal delay={delay}>
      <div className="group grid grid-cols-[1fr_auto] items-center gap-x-6 gap-y-1 border-b border-paper-300 py-5 transition-all duration-300 hover:bg-paper-50 hover:pl-3 sm:grid-cols-[1.5fr_1fr_auto_auto]">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <p className="font-display text-sm font-bold text-ink-950 sm:text-base">{name}</p>
            {badge && (
              <span className="bg-safety-500 px-2 py-0.5 font-mono text-[9px] font-bold uppercase tracking-widest text-ink-950">
                {badge}
              </span>
            )}
          </div>
          {sub && <p className="mt-1 text-xs text-steel-500">{sub}</p>}
        </div>
        <p className="col-start-1 text-xs leading-relaxed text-steel-500 sm:col-start-2 sm:text-sm">{use}</p>
        <p className="col-start-1 mt-1 font-mono text-xs text-ink-900 sm:col-start-3 sm:mt-0 sm:text-sm sm:font-bold">
          {param}
        </p>
        <div className="col-start-2 row-span-2 flex items-center gap-3 justify-self-end sm:col-start-4 sm:row-span-1">
          <p className="text-right font-mono text-sm font-bold text-ink-950 sm:text-base">
            {old && <span className="mr-2 text-xs font-normal text-steel-400 line-through">{old}</span>}
            {price}
          </p>
          <OrderBtn name={name} price={price} />
        </div>
      </div>
    </Reveal>
  );
}

export default function Products() {
  const [tab, setTab] = useState<Tab>("screw");
  const { openLead } = useLead();

  return (
    <section id="prices" className="bg-blueprint-light relative scroll-mt-20 bg-paper-100 py-20 text-ink-950 sm:py-28">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHead
          index="01"
          kicker="Прайс-лист"
          title={
            <>
              Цены заводов <span className="text-safety-600">без посредников</span>
            </>
          }
          note="Средние цены заводов-партнёров по России. Точную смету с доставкой в ваш регион посчитают менеджеры Свайчат за 15 минут."
        />

        {/* tabs */}
        <Reveal className="mb-2 flex flex-wrap gap-2">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`border px-4 py-3 font-mono text-[11px] uppercase tracking-[0.16em] transition-all duration-300 sm:px-5 ${
                tab === t.id
                  ? "border-ink-950 bg-ink-950 text-paper-50"
                  : "border-paper-300 text-steel-500 hover:-translate-y-0.5 hover:border-ink-950 hover:text-ink-950"
              }`}
            >
              {t.label}
            </button>
          ))}
        </Reveal>

        {/* header row (desktop) */}
        <div className="hidden grid-cols-[1.5fr_1fr_auto_auto] gap-x-6 border-b-2 border-ink-950 pb-3 pt-6 font-mono text-[10px] uppercase tracking-[0.22em] text-steel-500 sm:grid">
          <span>Наименование</span>
          <span>Применение</span>
          <span className="w-24">Параметр</span>
          <span className="w-40 text-right">Цена</span>
        </div>

        <div key={tab}>
          {tab === "screw" &&
            PILES.map((p, i) => (
              <Row
                key={p.id}
                name={`${p.label} · ствол Ø${p.id} мм`}
                sub={`Лопасть ${p.blade}, сталь Ст20, стенка 3,5 мм, антикор-покрытие`}
                use={p.use}
                param={p.load}
                price={`${fmt(p.base)} ₽`}
                old={p.hit ? "3 450 ₽" : undefined}
                badge={p.hit ? "−10%" : undefined}
                delay={i * 60}
              />
            ))}
          {tab === "jb" &&
            JB_ROWS.map((r, i) => (
              <Row key={r.name} name={r.name} use={r.use} param="забивные" price={r.price} delay={i * 60} />
            ))}
          {tab === "heads" &&
            HEAD_ROWS.map((r, i) => (
              <Row key={r.name} name={r.name} use={r.use} param="в наличии" price={r.price} delay={i * 60} />
            ))}
          {tab === "tech" &&
            TECH_ROWS.map((r, i) => (
              <Row key={r.name} name={r.name} use={r.use} param="аренда" price={r.price} delay={i * 60} />
            ))}
        </div>

        <Reveal delay={120}>
          <p className="mt-4 font-mono text-[11px] text-steel-500">
            * Цены средние по России за ствол 2500 мм, со скидкой −10%. Другие длины, оцинковка и
            литые наконечники — в калькуляторе; точную стоимость уточняйте у менеджера Свайчат.
          </p>
        </Reveal>

        {/* wholesale strip */}
        <Reveal delay={100} className="mt-12">
          <div className="flex flex-col items-start justify-between gap-6 bg-ink-950 p-7 text-paper-50 sm:flex-row sm:items-center sm:p-9">
            <div>
              <p className="font-display text-lg font-bold uppercase sm:text-xl">
                Партия от 20 штук?
              </p>
              <p className="mt-2 max-w-xl text-sm leading-relaxed text-steel-400">
                Заводы сообщества отгружают напрямую со склада: резка в размер,
                маркировка, паспорта на каждую сваю и доставка манипулятором до участка.
              </p>
            </div>
            <button
              onClick={() =>
                openLead({
                  title: "Оптовая цена на партию свай",
                  subtitle: "Завод-партнёр посчитает партию от 20 штук с резкой в размер, паспортами и доставкой манипулятором.",
                  cta: "Запросить оптовую цену",
                })
              }
              className="group inline-flex shrink-0 items-center gap-3 bg-safety-500 px-6 py-4 font-display text-[11px] font-bold uppercase tracking-widest text-ink-950 transition-all hover:-translate-y-0.5 hover:bg-safety-400"
            >
              Запросить оптовую цену
              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
