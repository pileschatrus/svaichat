import { useEffect, useMemo, useState } from "react";
import { fmt } from "../data";
import { ArrowUpRight, CheckIcon, MaxIcon, PinIcon, TruckIcon, WrenchIcon } from "../icons";
import { useLead } from "../LeadModal";
import {
  PRICE_JB,
  PRICE_VINT,
  REGIONS,
  applySeo,
  findRegion,
  regionDescription,
  regionFaq,
  regionH1,
  regionIntro,
  regionKeywords,
  regionLink,
  regionTitle,
  type Region,
} from "../regions";
import { Reveal } from "../ui";

function NotFound() {
  return (
    <div className="mx-auto max-w-3xl px-5 pb-32 pt-40 text-center sm:px-8">
      <p className="font-mono text-xs uppercase tracking-[0.3em] text-steel-500">Ошибка 404</p>
      <h1 className="mt-4 font-display text-3xl font-extrabold uppercase text-steel-100">
        Регион не найден
      </h1>
      <p className="mt-4 text-steel-400">
        Такой страницы нет, но мы работаем в 47 регионах России — выберите свой на главной.
      </p>
      <a
        href="#/"
        className="mt-8 inline-flex items-center gap-2 bg-safety-500 px-6 py-3.5 font-display text-[11px] font-bold uppercase tracking-widest text-ink-950 transition-all hover:bg-safety-400"
      >
        На главную
      </a>
    </div>
  );
}

function FaqItem({ q, a, i, open, onToggle }: { q: string; a: string; i: number; open: boolean; onToggle: () => void }) {
  return (
    <div className="border-b border-ink-800">
      <button onClick={onToggle} aria-expanded={open} className="group flex w-full items-center justify-between gap-5 py-5 text-left">
        <span className="flex items-baseline gap-4">
          <span className="font-mono text-[11px] font-bold text-safety-400">{String(i + 1).padStart(2, "0")}</span>
          <span className={`font-display text-sm font-bold uppercase leading-snug transition-colors sm:text-base ${open ? "text-safety-400" : "text-steel-100 group-hover:text-safety-400"}`}>
            {q}
          </span>
        </span>
        <span className={`relative h-5 w-5 shrink-0 transition-transform duration-300 ${open ? "rotate-45" : ""}`}>
          <span className="absolute left-1/2 top-0 h-full w-[2px] -translate-x-1/2 bg-steel-300" />
          <span className="absolute left-0 top-1/2 h-[2px] w-full -translate-y-1/2 bg-steel-300" />
        </span>
      </button>
      <div className={`acc-body ${open ? "open" : ""}`}>
        <div className="acc-inner">
          <p className="max-w-2xl pb-6 pl-9 text-sm leading-relaxed text-steel-400">{a}</p>
        </div>
      </div>
    </div>
  );
}

export default function RegionPage({ slug }: { slug: string }) {
  const region = findRegion(slug);
  const [faqOpen, setFaqOpen] = useState(0);
  const { openLead } = useLead();

  const neighbors = useMemo(() => {
    if (!region) return [];
    const idx = REGIONS.findIndex((r) => r.slug === region.slug);
    const list: Region[] = [];
    for (let d = 1; list.length < 8 && d <= REGIONS.length; d++) {
      list.push(REGIONS[(idx + d) % REGIONS.length]);
      if (list.length < 8) list.push(REGIONS[(idx - d + REGIONS.length) % REGIONS.length]);
    }
    return list.slice(0, 8);
  }, [region]);

  useEffect(() => {
    window.scrollTo(0, 0);
    if (!region) {
      applySeo({ title: "Регион не найден | Свайчат", description: "", keywords: "" });
      return;
    }
    applySeo({
      title: regionTitle(region),
      description: regionDescription(region),
      keywords: regionKeywords(region),
    });
    // structured data
    const ld = {
      "@context": "https://schema.org",
      "@type": "ItemList",
      name: `Винтовые и ЖБ сваи — ${region.name}`,
      description: regionDescription(region),
      itemListElement: PRICE_VINT.slice(0, 6).map((v, i) => ({
        "@type": "ListItem",
        position: i + 1,
        item: {
          "@type": "Product",
          name: `Винтовая свая ${v.type.replace(" (лопасть", " лопасть").replace(")", "")}×${v.len}`,
          offers: { "@type": "Offer", price: v.pile + v.montazh, priceCurrency: "RUB" },
        },
      })),
    };
    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.text = JSON.stringify(ld);
    document.head.appendChild(script);
    return () => {
      script.remove();
    };
  }, [region]);

  if (!region) return <NotFound />;

  const r = region;
  const intro = regionIntro(r);
  const faq = regionFaq(r);
  const totalBuilders = REGIONS.reduce((a, x) => a + x.count, 0);

  return (
    <div className="bg-blueprint bg-ink-950">
      {/* ---------- lead ---------- */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute -right-40 -top-40 h-[520px] w-[520px] rounded-full bg-safety-500/[0.07] blur-3xl" />
        <div className="relative mx-auto max-w-7xl px-5 pb-14 pt-28 sm:px-8 lg:pt-36">
          <nav className="font-mono text-[10px] uppercase tracking-[0.22em] text-steel-500">
            <a href="#/" className="transition-colors hover:text-safety-400">Главная</a>
            <span className="mx-2 text-steel-600">/</span>
            <a href="#/regions" className="transition-colors hover:text-safety-400">География</a>
            <span className="mx-2 text-steel-600">/</span>
            <span className="text-steel-300">{r.name}</span>
          </nav>

          <div className="mt-8 grid gap-12 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
            <div>
              <p className="flex flex-wrap items-center gap-3 font-mono text-[11px] uppercase tracking-[0.24em] text-steel-400">
                <span className="dot-live inline-block h-2 w-2 rounded-full bg-green-400" />
                {r.count} подрядчиков в чате · регион №{REGIONS.findIndex((x) => x.slug === r.slug) + 1} из {REGIONS.length}
              </p>
              <h1 className="mt-5 font-display text-3xl font-extrabold uppercase leading-[1.1] text-steel-100 sm:text-4xl xl:text-[3rem]">
                {regionH1(r)}
              </h1>
              <div className="mt-7 max-w-2xl space-y-4 text-base leading-relaxed text-steel-300">
                <p>{intro[0]}</p>
                <p>{intro[1]}</p>
              </div>
            </div>

            {/* quick facts */}
            <div className="grid grid-cols-2 border border-ink-700 bg-ink-900/70">
              {[
                { k: "СВС-108×2500", v: "от 4 895 ₽", s: "с монтажом" },
                { k: "ЖБ С30.15", v: "от 4 935 ₽", s: "с забивкой" },
                { k: "Доставка", v: r.cities[0], s: `и ещё ${r.cities.length - 1} городов` },
                { k: "Смета", v: "за 1 день", s: "фиксация до работ" },
              ].map((f, i) => (
                <div key={f.k} className={`p-5 ${i % 2 === 0 ? "border-r border-ink-700" : ""} ${i < 2 ? "border-b border-ink-700" : ""}`}>
                  <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-steel-500">{f.k}</p>
                  <p className="mt-2 font-display text-lg font-bold text-safety-400">{f.v}</p>
                  <p className="mt-1 text-[11px] text-steel-500">{f.s}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="hazard h-1.5 opacity-70" />
      </section>

      {/* ---------- screw piles price ---------- */}
      <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-20">
        <Reveal>
          <p className="flex items-baseline gap-4">
            <span className="font-mono text-xs tracking-[0.25em] text-safety-400">01</span>
            <span className="font-mono text-xs uppercase tracking-[0.25em] text-steel-500">Прайс-лист</span>
          </p>
          <h2 className="mt-4 max-w-3xl font-display text-2xl font-bold uppercase leading-tight text-steel-100 sm:text-3xl">
            Цены на винтовые сваи {r.prep}
          </h2>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-steel-400">
            Средние цены заводов-партнёров по России, отгрузка со складов. Сталь Ст3, стенка
            3–4 мм, эпоксидное покрытие «Стандарт» включено в цену. «С монтажом» — свая +
            завинчивание с контролем момента, подрезкой и бетонированием. Точную стоимость
            {` ${r.dat}`} уточняйте у менеджера Свайчат.
          </p>
        </Reveal>

        <Reveal delay={80} className="thin-scroll mt-8 overflow-x-auto">
          <table className="w-full min-w-[640px] border-collapse text-left text-sm">
            <thead>
              <tr className="border-b-2 border-ink-600 font-mono text-[10px] uppercase tracking-[0.18em] text-steel-500">
                <th className="py-3.5 pr-4 font-medium">Типоразмер</th>
                <th className="py-3.5 pr-4 font-medium">Длина</th>
                <th className="py-3.5 pr-4 font-medium">Без монтажа</th>
                <th className="py-3.5 pr-4 font-medium">Монтаж</th>
                <th className="py-3.5 pr-4 font-medium">С монтажом</th>
                <th className="py-3.5 font-medium">Оголовок</th>
              </tr>
            </thead>
            <tbody>
              {PRICE_VINT.map((v) => (
                <tr
                  key={`${v.type}-${v.len}`}
                  className={`group border-b border-ink-800 transition-colors hover:bg-ink-900 ${v.hit ? "bg-safety-500/[0.06]" : ""}`}
                >
                  <td className="py-3.5 pr-4 font-semibold text-steel-200">
                    {v.type}
                    {v.hit && (
                      <span className="ml-2 bg-safety-500 px-1.5 py-0.5 font-mono text-[9px] font-bold uppercase tracking-wider text-ink-950">
                        хит
                      </span>
                    )}
                  </td>
                  <td className="py-3.5 pr-4 font-mono text-steel-400">{fmt(v.len)} мм</td>
                  <td className="py-3.5 pr-4 font-mono text-steel-200">{fmt(v.pile)} ₽</td>
                  <td className="py-3.5 pr-4 font-mono text-steel-400">{fmt(v.montazh)} ₽</td>
                  <td className="py-3.5 pr-4 font-mono font-bold text-safety-400">
                    {fmt(v.pile + v.montazh)} ₽
                  </td>
                  <td className="py-3.5 font-mono text-steel-400">{fmt(v.head)} ₽</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Reveal>
        <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.14em] text-steel-500">
          * Средние цены по России, позиция со скидкой −10%. Точную смету {r.dat} считаем после пробного завинчивания — уточняйте у менеджера Свайчат.
        </p>
      </section>

      {/* ---------- jb price + steps ---------- */}
      <section className="border-y border-ink-800 bg-ink-900/50">
        <div className="mx-auto grid max-w-7xl gap-14 px-5 py-16 sm:px-8 sm:py-20 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <Reveal>
              <p className="flex items-baseline gap-4">
                <span className="font-mono text-xs tracking-[0.25em] text-safety-400">02</span>
                <span className="font-mono text-xs uppercase tracking-[0.25em] text-steel-500">Железобетон</span>
              </p>
              <h2 className="mt-4 font-display text-2xl font-bold uppercase leading-tight text-steel-100 sm:text-3xl">
                ЖБ сваи {r.prep} — цены с забивкой
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-steel-400">
                Мини-сваи 150×150 и 200×200 забиваем мини-копром — без грязи и вибраций, подходит
                для плотной застройки. Несущая способность 4–10 т на сваю, бетон В25–В30,
                арматура А800.
              </p>
            </Reveal>
            <Reveal delay={80} className="mt-7">
              <div className="border border-ink-700">
                {PRICE_JB.map((j, i) => (
                  <div
                    key={j.type + j.len}
                    className={`flex items-center justify-between gap-4 px-4 py-3.5 transition-colors hover:bg-ink-800 ${i !== PRICE_JB.length - 1 ? "border-b border-ink-700" : ""}`}
                  >
                    <div>
                      <p className="text-sm font-semibold text-steel-200">ЖБ свая {j.type}</p>
                      <p className="font-mono text-[10px] uppercase tracking-wider text-steel-500">
                        длина {fmt(j.len)} мм
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-mono font-bold text-safety-400">{fmt(j.pile + j.montazh)} ₽</p>
                      <p className="font-mono text-[10px] text-steel-500">с забивкой</p>
                    </div>
                  </div>
                ))}
              </div>
              <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.14em] text-steel-500">
                * Свая по средней цене заводов-партнёров + забивка мини-копром. Отказная запись — по запросу.
              </p>
            </Reveal>
          </div>

          <div>
            <Reveal>
              <p className="flex items-baseline gap-4">
                <span className="font-mono text-xs tracking-[0.25em] text-safety-400">03</span>
                <span className="font-mono text-xs uppercase tracking-[0.25em] text-steel-500">Регламент</span>
              </p>
              <h2 className="mt-4 font-display text-2xl font-bold uppercase leading-tight text-steel-100 sm:text-3xl">
                Монтаж свайного фундамента {r.prep}
              </h2>
            </Reveal>
            <div className="mt-8 space-y-0 border-l-2 border-ink-700">
              {[
                { t: "Заявка и смета", d: `Отвечаем в день обращения: уточняем объект ${r.dat} и считаем предварительную смету по средним ценам заводов-партнёров.` },
                { t: "Пробное завинчивание", d: `Бригада выезжает на участок, крутит контрольную сваю и определяет реальную несущую способность — с учётом грунтов «${r.soil}».` },
                { t: "Монтаж за 1 день", d: "Завинчивание с контролем момента, подрезка в уровень по лазеру, бетонирование стволов и приварка оголовков. Дом до 40 свай — за один день." },
                { t: "Сдача и гарантия", d: "Передаём исполнительную схему свайного поля и договорную гарантию на работы. Спорные случаи разбирает сообщество." },
              ].map((s, i) => (
                <Reveal key={s.t} delay={i * 80}>
                  <div className="group relative pb-8 pl-7 last:pb-0">
                    <span className="absolute -left-[9px] top-1 h-4 w-4 border-2 border-safety-500 bg-ink-950 transition-colors group-hover:bg-safety-500" />
                    <h3 className="font-display text-base font-bold uppercase text-steel-100">
                      <span className="mr-3 font-mono text-xs text-safety-400">{String(i + 1).padStart(2, "0")}</span>
                      {s.t}
                    </h3>
                    <p className="mt-2 max-w-xl text-sm leading-relaxed text-steel-400">{s.d}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ---------- geography + why ---------- */}
      <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-20">
        <div className="grid gap-14 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <Reveal>
              <p className="flex items-baseline gap-4">
                <span className="font-mono text-xs tracking-[0.25em] text-safety-400">04</span>
                <span className="font-mono text-xs uppercase tracking-[0.25em] text-steel-500">Логистика</span>
              </p>
              <h2 className="mt-4 font-display text-2xl font-bold uppercase leading-tight text-steel-100 sm:text-3xl">
                Доставка и зона выезда {r.dat}
              </h2>
              <p className="mt-4 max-w-xl text-sm leading-relaxed text-steel-400">
                Местные бригады базируются в крупных городах региона, поэтому доставка свай и
                выезд на замер не съедают смету. Работаем и в частном секторе, и на удалённых
                участках — {r.winter}.
              </p>
            </Reveal>
            <Reveal delay={80} className="mt-7 flex flex-wrap gap-2">
              {r.cities.map((c) => (
                <span
                  key={c}
                  className="flex items-center gap-2 border border-ink-700 bg-ink-900/70 px-4 py-2.5 text-sm font-semibold text-steel-200 transition-all hover:-translate-y-0.5 hover:border-safety-500"
                >
                  <PinIcon className="h-4 w-4 text-safety-400" />
                  {c}
                </span>
              ))}
              <span className="flex items-center gap-2 border border-dashed border-ink-600 px-4 py-2.5 text-sm text-steel-500">
                <TruckIcon className="h-4 w-4" />и весь регион целиком
              </span>
            </Reveal>
          </div>

          <div>
            <Reveal>
              <p className="flex items-baseline gap-4">
                <span className="font-mono text-xs tracking-[0.25em] text-safety-400">05</span>
                <span className="font-mono text-xs uppercase tracking-[0.25em] text-steel-500">Почему мы</span>
              </p>
              <h2 className="mt-4 font-display text-2xl font-bold uppercase leading-tight text-steel-100 sm:text-3xl">
                Почему {r.prep} выбирают Свайчат
              </h2>
            </Reveal>
            <ul className="mt-8 space-y-4">
              {[
                "Свои бригады в регионе — знаете, кто крутит, и можете позвонить прошлым заказчикам",
                "Цены заводов-партнёров без наценок посредников — средние по России и ниже при объёме",
                "Пробное завинчивание до договора: несущая способность точки, а не «в среднем по больнице»",
                `${totalBuilders}+ подрядчиков сообщества отвечают за каждого`,
                "Договор, исполнительная схема и гарантийный срок на монтаж",
              ].map((b, i) => (
                <Reveal key={b} delay={i * 60}>
                  <li className="flex items-start gap-3.5 text-sm leading-relaxed text-steel-300">
                    <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center bg-safety-500/15">
                      <CheckIcon className="h-3.5 w-3.5 text-safety-400" />
                    </span>
                    {b}
                  </li>
                </Reveal>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ---------- FAQ ---------- */}
      <section className="border-t border-ink-800 bg-ink-900/50">
        <div className="mx-auto grid max-w-7xl gap-12 px-5 py-16 sm:px-8 sm:py-20 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <Reveal>
              <p className="flex items-baseline gap-4">
                <span className="font-mono text-xs tracking-[0.25em] text-safety-400">06</span>
                <span className="font-mono text-xs uppercase tracking-[0.25em] text-steel-500">Вопросы</span>
              </p>
              <h2 className="mt-4 font-display text-2xl font-bold uppercase leading-tight text-steel-100 sm:text-3xl">
                Частые вопросы по сваям {r.gen}
              </h2>
              <p className="mt-4 max-w-sm text-sm leading-relaxed text-steel-400">
                Не нашли ответ? Оставьте заявку — модератор-строитель ответит в течение
                12 минут, пока вы пьёте чай.
              </p>
              <button
                onClick={() =>
                  openLead({
                    title: `Вопрос по сваям — ${r.name}`,
                    subtitle: "Модератор-строитель уточнит грунт и объект, ответит и пришлёт фото похожих работ в регионе.",
                    cta: "Задать вопрос",
                    comment: `Регион: ${r.name}. Вопрос: `,
                  })
                }
                className="mt-7 inline-flex items-center gap-3 bg-safety-500 px-6 py-3.5 font-display text-[11px] font-bold uppercase tracking-widest text-ink-950 transition-all hover:-translate-y-0.5 hover:bg-safety-400"
              >
                <MaxIcon className="h-5 w-5" />
                Задать вопрос
              </button>
            </Reveal>
          </div>
          <Reveal delay={100}>
            {faq.map((f, i) => (
              <FaqItem key={f.q} q={f.q} a={f.a} i={i} open={faqOpen === i} onToggle={() => setFaqOpen(faqOpen === i ? -1 : i)} />
            ))}
          </Reveal>
        </div>
      </section>

      {/* ---------- internal links ---------- */}
      <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-20">
        <Reveal className="flex flex-wrap items-center justify-between gap-4 border border-safety-500/60 bg-safety-500/[0.06] p-6 sm:p-8">
          <div className="flex items-center gap-4">
            <WrenchIcon className="h-8 w-8 shrink-0 text-safety-400" />
            <div>
              <p className="font-display text-lg font-bold uppercase text-steel-100">
                Нужен фундамент {r.prep}?
              </p>
              <p className="mt-1 text-sm text-steel-400">
                Отправьте проект или план участка — вернём смету с доставкой до конца дня.
              </p>
            </div>
          </div>
          <button
            onClick={() =>
              openLead({
                title: `Получить смету на фундамент — ${r.name}`,
                subtitle: "Бригада вашего региона посчитает доставку и монтаж, зафиксирует цену до начала работ.",
                cta: "Получить смету",
                comment: `Нужен фундамент: ${r.name}. `,
              })
            }
            className="group inline-flex items-center gap-3 bg-safety-500 px-7 py-4 font-display text-[11px] font-bold uppercase tracking-widest text-ink-950 transition-all hover:bg-safety-400"
          >
            <MaxIcon className="h-5 w-5 transition-transform group-hover:rotate-6" />
            Получить смету
          </button>
        </Reveal>

        <Reveal delay={100} className="mt-14">
          <h3 className="font-mono text-xs uppercase tracking-[0.24em] text-steel-500">
            Сваи в соседних регионах
          </h3>
          <div className="mt-5 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
            {neighbors.map((n) => (
              <a
                key={n.slug}
                href={regionLink(n.slug)}
                className="group flex items-center justify-between gap-3 border border-ink-700 px-4 py-3.5 text-sm font-semibold text-steel-300 transition-all hover:-translate-y-0.5 hover:border-safety-500 hover:text-steel-100"
              >
                {n.name}
                <ArrowUpRight className="h-4 w-4 shrink-0 text-steel-500 transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-safety-400" />
              </a>
            ))}
          </div>
        </Reveal>
      </section>
    </div>
  );
}
