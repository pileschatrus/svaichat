import { useMemo, useState, type CSSProperties } from "react";
import { LENGTHS, PILES, fmt } from "../data";
import { MaxIcon } from "../icons";
import { useLead } from "../LeadModal";
import { Reveal, SectionHead, useAnimatedNumber } from "../ui";

function Toggle({
  on,
  onChange,
  label,
  sub,
}: {
  on: boolean;
  onChange: (v: boolean) => void;
  label: string;
  sub: string;
}) {
  return (
    <button
      role="switch"
      aria-checked={on}
      onClick={() => onChange(!on)}
      className="flex w-full items-center justify-between gap-4 border border-ink-700 px-4 py-3.5 text-left transition-colors hover:border-steel-500"
    >
      <span>
        <span className={`block text-sm font-bold ${on ? "text-steel-100" : "text-steel-400"}`}>{label}</span>
        <span className="mt-0.5 block text-xs text-steel-500">{sub}</span>
      </span>
      <span
        className={`relative h-6 w-11 shrink-0 border transition-colors duration-300 ${
          on ? "border-safety-500 bg-safety-500" : "border-ink-600 bg-ink-800"
        }`}
      >
        <span
          className={`absolute top-0.5 h-[18px] w-[18px] bg-ink-950 transition-all duration-300 ${
            on ? "left-[22px]" : "left-0.5 bg-steel-500"
          }`}
        />
      </span>
    </button>
  );
}

export default function Calculator() {
  const { openLead } = useLead();
  const [diam, setDiam] = useState("108");
  const [len, setLen] = useState(2500);
  const [qty, setQty] = useState(20);
  const [montazh, setMontazh] = useState(true);
  const [heads, setHeads] = useState(true);

  const pile = PILES.find((p) => p.id === diam)!;
  const unit = useMemo(() => Math.round((pile.base * (len / 2500)) / 10) * 10, [pile, len]);
  const headUnit = pile.head;

  const sumPiles = unit * qty;
  const sumMontazh = montazh ? pile.montazh * qty : 0;
  const sumHeads = heads ? headUnit * qty : 0;
  const total = sumPiles + sumMontazh + sumHeads;
  const animated = useAnimatedNumber(total, 600);
  const days = Math.max(1, Math.ceil(qty / 14));

  const fill = ((qty - 4) / (80 - 4)) * 100;

  return (
    <section id="calculator" className="bg-blueprint relative scroll-mt-20 bg-ink-950 py-20 sm:py-28">
      <div className="hazard absolute inset-x-0 top-0 h-1.5 opacity-80" />
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHead
          dark
          index="02"
          kicker="Калькулятор"
          title={
            <>
              Прикиньте фундамент <span className="text-safety-400">за минуту</span>
            </>
          }
          note="Предварительный расчёт по средним ценам заводов-партнёров России. Точную смету зафиксируют менеджеры Свайчат после бесплатного выезда на участок."
        />

        <div className="grid gap-8 lg:grid-cols-[1fr_420px]">
          {/* controls */}
          <Reveal className="space-y-9 border border-ink-700 bg-ink-900/70 p-6 sm:p-9">
            {/* diameter */}
            <div>
              <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.24em] text-steel-500">
                01 · Диаметр сваи
              </p>
              <div className="flex flex-wrap gap-2">
                {PILES.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => setDiam(p.id)}
                    className={`border px-4 py-3 text-left transition-all duration-200 ${
                      diam === p.id
                        ? "border-safety-500 bg-safety-500/10 text-steel-100"
                        : "border-ink-700 text-steel-400 hover:-translate-y-0.5 hover:border-steel-500 hover:text-steel-200"
                    }`}
                  >
                    <span className="block font-display text-sm font-bold">Ø{p.id}</span>
                    <span className="mt-0.5 block font-mono text-[9px] uppercase tracking-wider text-steel-500">
                      {p.load}
                    </span>
                  </button>
                ))}
              </div>
              <p className="mt-3 text-xs text-steel-500">
                {pile.label} — {pile.use.toLowerCase()}
              </p>
            </div>

            {/* length */}
            <div>
              <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.24em] text-steel-500">
                02 · Длина ствола
              </p>
              <div className="flex flex-wrap gap-2">
                {LENGTHS.map((l) => (
                  <button
                    key={l}
                    onClick={() => setLen(l)}
                    className={`border px-4 py-2.5 font-mono text-xs transition-all duration-200 ${
                      len === l
                        ? "border-steel-100 bg-steel-100 font-bold text-ink-950"
                        : "border-ink-700 text-steel-400 hover:-translate-y-0.5 hover:border-steel-500 hover:text-steel-200"
                    }`}
                  >
                    {fmt(l)} мм
                  </button>
                ))}
              </div>
            </div>

            {/* quantity */}
            <div>
              <div className="mb-3 flex items-end justify-between">
                <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-steel-500">
                  03 · Количество свай
                </p>
                <p className="font-display text-3xl font-extrabold text-steel-100">
                  {qty}
                  <span className="ml-1 text-xs font-normal text-steel-500">шт</span>
                </p>
              </div>
              <input
                type="range"
                min={4}
                max={80}
                step={2}
                value={qty}
                onChange={(e) => setQty(Number(e.target.value))}
                style={{ "--fill": `${fill}%` } as CSSProperties}
                aria-label="Количество свай"
              />
              <div className="mt-2 flex justify-between font-mono text-[10px] text-steel-500">
                <span>4 · беседка</span>
                <span>40 · дом 8×10</span>
                <span>80 · ангар</span>
              </div>
            </div>

            {/* extras */}
            <div>
              <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.24em] text-steel-500">
                04 · Работы и комплектация
              </p>
              <div className="space-y-2">
                <Toggle
                  on={montazh}
                  onChange={setMontazh}
                  label="Монтаж под ключ"
                  sub={`Завинчивание с контролем момента, подрезка, бетонирование · ${fmt(pile.montazh)} ₽/шт`}
                />
                <Toggle
                  on={heads}
                  onChange={setHeads}
                  label="Оголовки 200×200"
                  sub={`Приварка в уровень по лазеру · ${fmt(headUnit)} ₽/шт`}
                />
              </div>
            </div>
          </Reveal>

          {/* result */}
          <Reveal delay={120} className="lg:sticky lg:top-24 lg:self-start">
            <div className="border border-ink-700 bg-ink-900 p-6 sm:p-8">
              <div className="flex items-center justify-between border-b border-ink-700 pb-4">
                <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-steel-500">
                  Предварительная смета
                </p>
                <span className="h-2 w-2 bg-safety-500" />
              </div>

              <p className="mt-5 font-display text-xl font-bold text-steel-100">
                {pile.label} × {fmt(len)} мм
              </p>
              <p className="mt-1 text-xs text-steel-500">{pile.use}</p>

              <div className="mt-6 space-y-0 text-sm">
                <div className="flex items-baseline justify-between border-b border-ink-800 py-3">
                  <span className="text-steel-400">
                    Сваи · {qty} × {fmt(unit)} ₽
                  </span>
                  <span className="font-mono font-bold text-steel-200">{fmt(sumPiles)} ₽</span>
                </div>
                {montazh && (
                  <div className="flex items-baseline justify-between border-b border-ink-800 py-3">
                    <span className="text-steel-400">
                      Монтаж · {qty} × {fmt(pile.montazh)} ₽
                    </span>
                    <span className="font-mono font-bold text-steel-200">{fmt(sumMontazh)} ₽</span>
                  </div>
                )}
                {heads && (
                  <div className="flex items-baseline justify-between border-b border-ink-800 py-3">
                    <span className="text-steel-400">
                      Оголовки · {qty} × {fmt(headUnit)} ₽
                    </span>
                    <span className="font-mono font-bold text-steel-200">{fmt(sumHeads)} ₽</span>
                  </div>
                )}
              </div>

              <div className="mt-6 flex items-end justify-between gap-4">
                <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-steel-500">Итого</p>
                <p className="font-display text-[2rem] font-extrabold leading-none text-safety-400 sm:text-[2.4rem]">
                  {fmt(animated)} ₽
                </p>
              </div>
              <p className="mt-3 border-l-2 border-bp-400 pl-3 text-xs leading-relaxed text-steel-400">
                ≈ {days} {days === 1 ? "рабочий день" : days < 5 ? "рабочих дня" : "рабочих дней"} монтажа
                бригадой из 3 человек, без заезда тяжёлой техники.
              </p>

              <button
                onClick={() =>
                  openLead({
                    title: "Получить точную смету на фундамент",
                    subtitle: "Менеджер Свайчат уточнит доставку в ваш регион и зафиксирует цену до начала работ.",
                    cta: "Получить смету",
                    comment: `${pile.label} × ${fmt(len)} мм, ${qty} шт${montazh ? ", монтаж под ключ" : ""}${heads ? ", с оголовками" : ""}. Предварительно: ${fmt(total)} ₽.`,
                  })
                }
                className="group mt-6 flex w-full items-center justify-center gap-3 bg-safety-500 px-6 py-4 font-display text-[11px] font-bold uppercase tracking-widest text-ink-950 transition-all hover:bg-safety-400"
              >
                <MaxIcon className="h-5 w-5 transition-transform group-hover:rotate-6" />
                Точная смета за 15 минут
              </button>
              <p className="mt-4 font-mono text-[10px] leading-relaxed text-steel-500">
                Бесплатно. Расчёт — по средним ценам заводов-партнёров России,
                точную смету подтвердит менеджер Свайчат.
              </p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
