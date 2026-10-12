import { Link, useParams } from "react-router-dom";
import { ArrowRight, Calculator as CalcIcon, Check, Lightbulb, Phone } from "lucide-react";
import { SITE, links, track } from "../config";
import { metaFor, modelFaq, modelPath } from "../seo";
import { SERVICES, SERVICE_BY_SLUG } from "../data/services";
import { BRANDS, BRAND_BY_SLUG, modelClass } from "../data/cars";
import { ARTICLES, ARTICLE_BY_SLUG } from "../data/articles";
import { FAQ } from "../data/faq";
import { CAR_CLASSES, CLASS_ORDER, EXTRAS, PART_BY_ID, fmt, priceForClass } from "../data/pricing";
import Calculator from "../components/Calculator";
import {
  ArticlesTeaser,
  BrandsCloud,
  ContactsBlock,
  CtaBand,
  FaqList,
  PriceMatrix,
  ProcessLine,
  QualityGrid,
  SERVICE_ICON,
  Section,
  ServiceCard,
  ServicesGrid,
  WorksBlock,
} from "../components/Blocks";
import { Breadcrumbs, Reveal, SectionHead } from "../components/ui";

function PageHero({ path, title, lead, children, eyebrow }: { path: string; title: string; lead?: string; children?: React.ReactNode; eyebrow?: string }) {
  const meta = metaFor(path);
  return (
    <section className="relative overflow-hidden pt-[72px]">
      <div className="bg-grid pointer-events-none absolute inset-0" />
      <div className="glow-lava pointer-events-none absolute -top-20 right-0 h-[360px] w-[560px] opacity-70" />
      <div className="relative mx-auto max-w-[1320px] px-4 pt-10 pb-6 sm:px-6 sm:pt-14">
        <Breadcrumbs crumbs={meta.crumbs} />
        {eyebrow && <div className="eyebrow mb-4">{eyebrow}</div>}
        <h1 className="h-display chrome max-w-4xl text-[30px] sm:text-[44px] lg:text-[54px]">{title}</h1>
        {lead && <p className="mt-5 max-w-3xl text-[16.5px] leading-relaxed text-fog-300 sm:text-[17.5px]">{lead}</p>}
        {children}
      </div>
    </section>
  );
}

function HeroCtas({ calcHref = "#calc" }: { calcHref?: string }) {
  return (
    <div className="mt-8 flex flex-col gap-3 sm:flex-row">
      <a href={calcHref} className="btn btn-lava">
        <CalcIcon className="h-5 w-5" /> Рассчитать онлайн
      </a>
      <a href={links.tel} onClick={() => track("call")} className="btn btn-ghost">
        <Phone className="h-5 w-5" /> {SITE.phoneHuman}
      </a>
    </div>
  );
}

/* ---------------- Калькулятор ---------------- */
export function CalculatorPage() {
  return (
    <>
      <PageHero
        path="/kalkulyator/"
        title="Калькулятор кузовного ремонта и покраски"
        lead="Три шага: выберите автомобиль, нажмите на повреждённые детали на схеме и опишите, что случилось. Калькулятор подберёт технологию ремонта, учтёт класс авто и тип краски и соберёт заказ-наряд — его можно сохранить в PDF, распечатать или отправить нам."
      />
      <Section id="calc" className="!pt-6">
        <Calculator />
      </Section>
      <Section className="!pt-0">
        <div className="grid gap-10 lg:grid-cols-2">
          <div>
            <SectionHead title="Как считается цена" />
            <div className="prose-dark mt-6">
              <p>
                Базовая стоимость работ указана для автомобилей эконом-класса и умножается на коэффициент класса: комфорт ×1,15, бизнес ×1,35, премиум ×1,7, люкс и большие внедорожники ×2,2.
              </p>
              <p>Для покраски учитывается тип краски: металлик +10%, трёхслойный перламутр +30%, матовые краски +45%. При покраске от 3 элементов действует скидка за объём.</p>
              <p>Итог — ориентировочный: точную стоимость мастер зафиксирует после бесплатного осмотра. Обычно она отличается не более чем на 10–15%.</p>
            </div>
          </div>
          <FaqList items={FAQ.filter((f) => f.group === "Цены")} />
        </div>
      </Section>
    </>
  );
}

/* ---------------- Услуги ---------------- */
export function ServicesPage() {
  return (
    <>
      <PageHero path="/uslugi/" title={`Услуги кузовного ремонта и покраски ${SITE.cityIn}`} lead="Выберите услугу, чтобы узнать подробности, цены и технологию. Или сразу посчитайте стоимость своего ремонта в калькуляторе." />
      <Section className="!pt-8">
        <ServicesGrid />
      </Section>
      <Section className="!pt-0">
        <CtaBand title="Не знаете, какая услуга нужна?" sub="Отметьте повреждение на схеме — калькулятор сам подберёт способ ремонта." />
      </Section>
    </>
  );
}

function ClassPriceTable({ rows }: { rows: { name: string; base: number; unit?: string; flat?: boolean }[] }) {
  return (
    <div className="card overflow-hidden rounded-[24px]">
      <div className="scroll-thin overflow-x-auto">
        <table className="w-full min-w-[620px] text-[14px]">
          <thead>
            <tr className="border-b border-white/8 text-left">
              <th className="px-5 py-4 text-[12px] font-semibold tracking-wider text-fog-400 uppercase">Работа</th>
              {CLASS_ORDER.map((c) => (
                <th key={c} className="px-4 py-4 text-right text-[12px] font-semibold tracking-wider text-fog-400 uppercase">
                  {CAR_CLASSES[c].label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.name} className="border-b border-white/5 last:border-0">
                <td className="px-5 py-3.5 text-fog-200">{r.name}</td>
                {CLASS_ORDER.map((c) => (
                  <td key={c} className="px-4 py-3.5 text-right whitespace-nowrap text-fog-300 tabular-nums">
                    {r.base === 0 ? (r.unit ?? "бесплатно") : `${r.unit === "от" ? "от " : ""}${fmt(r.flat ? r.base : priceForClass(r.base, c))}`}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function ServicePage() {
  const { slug = "" } = useParams();
  const s = SERVICE_BY_SLUG[slug];
  if (!s) return <NotFound />;
  const path = `/uslugi/${s.slug}/`;
  const models = BRANDS.flatMap((b) => b.models.filter((m) => m.pop).map((m) => ({ b, m }))).slice(0, 18);
  return (
    <>
      <PageHero path={path} title={s.h1} lead={s.lead} eyebrow={s.priceFrom ? `${s.name} · от ${fmt(s.priceFrom)} ${s.priceUnit}` : s.name}>
        <HeroCtas />
      </PageHero>

      <Section className="!pt-8">
        <div className="grid gap-5 lg:grid-cols-[1fr_1.2fr]">
          <Reveal>
            <div className="card h-full rounded-[28px] p-6 sm:p-8">
              <div className="flex items-center gap-3">
                <span className="grid h-11 w-11 place-items-center rounded-xl bg-lava-500/12 text-lava-400 [&>svg]:h-5 [&>svg]:w-5">{SERVICE_ICON[s.icon]}</span>
                <h2 className="font-display text-xl font-bold text-white">Когда нужна услуга</h2>
              </div>
              <ul className="mt-6 grid gap-3">
                {s.when.map((w) => (
                  <li key={w} className="flex items-start gap-3 text-[15px] text-fog-200">
                    <Check className="mt-0.5 h-5 w-5 shrink-0 text-mint-400" /> {w}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
          <Reveal delay={80}>
            <div className="card h-full rounded-[28px] p-6 sm:p-8">
              <h2 className="font-display text-xl font-bold text-white">Как мы это делаем</h2>
              <ol className="mt-6 grid gap-4 sm:grid-cols-2">
                {s.steps.map((st, i) => (
                  <li key={st.t} className="flex gap-3">
                    <span className="font-mono text-[12px] tracking-widest text-lava-400">0{i + 1}</span>
                    <span>
                      <span className="block font-semibold text-white">{st.t}</span>
                      <span className="mt-1 block text-[13.5px] leading-relaxed text-fog-400">{st.d}</span>
                    </span>
                  </li>
                ))}
              </ol>
            </div>
          </Reveal>
        </div>
      </Section>

      <Section className="!pt-0">
        <SectionHead title={`Цены: ${s.name.toLowerCase()} ${SITE.cityIn}`} sub="Стоимость по классам автомобилей. Металлик +10%, перламутр +30%." />
        <div className="mt-8">
          <ClassPriceTable rows={s.prices} />
        </div>
      </Section>

      <Section id="calc" className="!pt-0">
        <SectionHead title="Рассчитайте стоимость для своего авто" sub="Мы уже отметили типичный случай — поправьте его под себя." />
        <div className="mt-8">
          <Calculator scenario={s.scenario} />
        </div>
      </Section>

      <Section className="!pt-0">
        <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr]">
          <article className="prose-dark">
            {s.body.map((b) => (
              <div key={b.h}>
                <h2>{b.h}</h2>
                {b.p.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
            ))}
          </article>
          <aside>
            <div className="eyebrow mb-4">Популярные модели</div>
            <div className="flex flex-wrap gap-2">
              {models.map(({ b, m }) => (
                <Link key={b.slug + m.slug} to={modelPath(b.slug, m.slug)} className="chip">
                  {s.name} {b.name} {m.name}
                </Link>
              ))}
            </div>
          </aside>
        </div>
      </Section>

      <Section className="!pt-0">
        <SectionHead title="Частые вопросы" />
        <div className="mt-8">
          <FaqList items={s.faq} />
        </div>
      </Section>

      <Section className="!pt-0">
        <SectionHead title="Смотрите также" />
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {s.related.map((r, i) => SERVICE_BY_SLUG[r] && <ServiceCard key={r} s={SERVICE_BY_SLUG[r]} i={i} />)}
        </div>
      </Section>
    </>
  );
}

/* ---------------- Цены ---------------- */
export function PricesPage() {
  return (
    <>
      <PageHero path="/ceny/" title={`Цены на кузовной ремонт и покраску ${SITE.cityIn}`} lead="Прайс-лист для всех классов автомобилей. Стоимость конкретного ремонта с учётом повреждений и типа краски — в онлайн-калькуляторе.">
        <HeroCtas calcHref="/kalkulyator/" />
      </PageHero>
      <Section className="!pt-8">
        <h2 className="h-display chrome mb-6 text-[24px] sm:text-[30px]">Покраска элементов</h2>
        <PriceMatrix />
        <div className="mt-12 grid gap-10">
          {SERVICES.filter((s) => s.prices.length > 1).map((s) => (
            <div key={s.slug}>
              <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
                <h2 className="font-display text-[20px] font-bold text-white">{s.name}</h2>
                <Link to={`/uslugi/${s.slug}/`} className="text-[13px] font-semibold text-lava-300 hover:text-lava-400">
                  Подробнее об услуге →
                </Link>
              </div>
              <ClassPriceTable rows={s.prices} />
            </div>
          ))}
          <div>
            <h2 className="mb-4 font-display text-[20px] font-bold text-white">Дополнительные услуги</h2>
            <ClassPriceTable rows={EXTRAS.map((e) => ({ name: e.title, base: e.base, flat: !e.scaled }))} />
          </div>
        </div>
      </Section>
      <Section className="!pt-0">
        <h2 className="h-display chrome mb-6 text-[24px] sm:text-[30px]">Классы автомобилей</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {CLASS_ORDER.map((c) => (
            <div key={c} className="card rounded-[22px] p-5">
              <div className="font-display text-lg font-bold text-white">{CAR_CLASSES[c].label}</div>
              <div className="mt-1 font-mono text-[12px] text-lava-400">×{String(CAR_CLASSES[c].k).replace(".", ",")}</div>
              <div className="mt-3 text-[13px] leading-relaxed text-fog-400">{CAR_CLASSES[c].examples}</div>
            </div>
          ))}
        </div>
      </Section>
    </>
  );
}

/* ---------------- Марки ---------------- */
export function BrandsPage() {
  return (
    <>
      <PageHero path="/marki/" title={`Кузовной ремонт и покраска по маркам ${SITE.cityIn}`} lead="Выберите марку автомобиля — покажем цены на покраску и ремонт для её моделей." />
      <Section className="!pt-8">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {BRANDS.map((b, i) => (
            <Reveal key={b.slug} delay={(i % 4) * 40}>
              <Link to={`/marki/${b.slug}/`} className="card card-hover flex items-center justify-between rounded-[20px] p-5">
                <span>
                  <span className="block font-display text-[16px] font-bold text-white">{b.name}</span>
                  <span className="text-[12.5px] text-fog-400">
                    {b.models.length} моделей · {CAR_CLASSES[b.cls].label}
                  </span>
                </span>
                <ArrowRight className="h-4 w-4 text-fog-500" />
              </Link>
            </Reveal>
          ))}
        </div>
      </Section>
    </>
  );
}

export function BrandPage() {
  const { brand = "" } = useParams();
  const b = BRAND_BY_SLUG[brand];
  if (!b) return <NotFound />;
  const path = `/marki/${b.slug}/`;
  return (
    <>
      <PageHero
        path={path}
        title={`Кузовной ремонт и покраска ${b.name} ${SITE.cityIn}`}
        lead={`Ремонтируем и красим все модели ${b.name} (${b.ru}): от локальной покраски бампера до восстановления после ДТП. Покраска элемента — от ${fmt(priceForClass(7500, b.cls))}, удаление вмятин без покраски — от ${fmt(priceForClass(2000, b.cls))}.`}
      >
        <HeroCtas />
      </PageHero>
      <Section className="!pt-8">
        <h2 className="h-display chrome mb-6 text-[24px] sm:text-[30px]">Модели {b.name}</h2>
        <div className="flex flex-wrap gap-2">
          {b.models.map((m) =>
            m.pop ? (
              <Link key={m.slug} to={modelPath(b.slug, m.slug)} className="chip !px-4 !py-2.5 text-[14px]">
                {b.name} {m.name} <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            ) : (
              <span key={m.slug} className="chip !px-4 !py-2.5 text-[14px] !text-fog-400">
                {b.name} {m.name} · {CAR_CLASSES[modelClass(b, m)].label}
              </span>
            ),
          )}
        </div>
      </Section>
      <Section id="calc" className="!pt-0">
        <SectionHead title={`Калькулятор для ${b.name}`} sub="Выберите модель и отметьте повреждения." />
        <div className="mt-8">
          <Calculator brand={b.slug} />
        </div>
      </Section>
      <Section className="!pt-0">
        <SectionHead title={`Цены на покраску ${b.name}`} sub={`Большинство моделей ${b.name} относятся к классу «${CAR_CLASSES[b.cls].label}».`} />
        <div className="mt-8">
          <PriceMatrix highlight={b.cls} />
        </div>
      </Section>
    </>
  );
}

export function ModelPage() {
  const { brand = "", model = "" } = useParams();
  const b = BRAND_BY_SLUG[brand];
  const m = b?.models.find((x) => x.slug === model);
  if (!b || !m) return <NotFound />;
  const cls = modelClass(b, m);
  const nm = `${b.name} ${m.name}`;
  const path = modelPath(b.slug, m.slug);
  const P = (id: string) => fmt(priceForClass(PART_BY_ID[id].paint, cls));
  const rows: [string, string][] = [
    ["Покраска переднего бампера", P("bumper_f")],
    ["Покраска заднего бампера", P("bumper_r")],
    ["Покраска капота", P("hood")],
    ["Покраска двери", P("door_fl")],
    ["Покраска переднего крыла", P("fender_fl")],
    ["Покраска заднего крыла", P("quarter_l")],
    ["Покраска крыши", P("roof")],
    ["Покраска крышки багажника", P("trunk")],
    ["Покраска порога", P("sill_l")],
    ["Покраска зеркала", P("mirror_l")],
    ["Локальная покраска (небольшая зона)", fmt(priceForClass(Math.round(PART_BY_ID.bumper_f.paint * 0.55), cls))],
    ["Удаление вмятины без покраски", fmt(priceForClass(2000, cls))],
    ["Ремонт трещины бампера", fmt(priceForClass(2000, cls))],
    ["Полировка кузова", fmt(priceForClass(9000, cls))],
  ];
  return (
    <>
      <PageHero
        path={path}
        title={`Кузовной ремонт и покраска ${nm} ${SITE.cityIn}`}
        eyebrow={`${b.ru} ${m.ru} · класс «${CAR_CLASSES[cls].label}»`}
        lead={`Покраска элементов ${nm} — от ${P("fender_fl")}, бампера — от ${P("bumper_f")}. Подбираем цвет по коду ${b.name}, красим в камере и полируем переходы так, чтобы ремонт был незаметен.`}
      >
        <HeroCtas />
      </PageHero>
      <Section className="!pt-8">
        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="card overflow-hidden rounded-[24px]">
            <div className="border-b border-white/8 px-5 py-4 font-display font-bold text-white">Цены на ремонт {nm}</div>
            <table className="w-full text-[14px]">
              <tbody>
                {rows.map(([n, p]) => (
                  <tr key={n} className="border-b border-white/5 last:border-0">
                    <td className="px-5 py-3 text-fog-200">{n}</td>
                    <td className="px-5 py-3 text-right font-semibold whitespace-nowrap text-white tabular-nums">от {p}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="border-t border-white/6 px-5 py-3 text-[12px] text-fog-500">Неметаллик. Металлик +10%, перламутр +30%.</div>
          </div>
          <div className="grid content-start gap-4">
            {m.note && (
              <div className="card rounded-[24px] p-6">
                <div className="flex items-center gap-2 font-display font-bold text-white">
                  <Lightbulb className="h-5 w-5 text-lava-400" /> Слабые места кузова {nm}
                </div>
                <p className="mt-3 text-[14.5px] leading-relaxed text-fog-300">{m.note}</p>
              </div>
            )}
            <div className="card rounded-[24px] p-6">
              <div className="font-display font-bold text-white">Что важно при ремонте {nm}</div>
              <ul className="mt-3 grid gap-2 text-[14px] text-fog-300">
                <li className="flex gap-2"><Check className="mt-0.5 h-4 w-4 shrink-0 text-mint-400" /> Подбор цвета по коду краски {b.name} и спектрофотометру</li>
                <li className="flex gap-2"><Check className="mt-0.5 h-4 w-4 shrink-0 text-mint-400" /> Аккуратная разборка: клипсы, датчики, подсветка</li>
                <li className="flex gap-2"><Check className="mt-0.5 h-4 w-4 shrink-0 text-mint-400" /> Оригинальные и качественные аналоговые запчасти</li>
                <li className="flex gap-2"><Check className="mt-0.5 h-4 w-4 shrink-0 text-mint-400" /> Контроль зазоров и толщины покрытия при выдаче</li>
              </ul>
            </div>
          </div>
        </div>
      </Section>
      <Section id="calc" className="!pt-0">
        <SectionHead title={`Калькулятор ремонта ${nm}`} sub="Модель уже выбрана — отметьте повреждения на схеме." />
        <div className="mt-8">
          <Calculator brand={b.slug} model={m.slug} />
        </div>
      </Section>
      <Section className="!pt-0">
        <SectionHead title={`Вопросы о ремонте ${nm}`} />
        <div className="mt-8">
          <FaqList items={modelFaq(nm, cls)} />
        </div>
      </Section>
      <Section className="!pt-0">
        <div className="eyebrow mb-4">Другие модели {b.name}</div>
        <div className="flex flex-wrap gap-2">
          {b.models
            .filter((x) => x.pop && x.slug !== m.slug)
            .map((x) => (
              <Link key={x.slug} to={modelPath(b.slug, x.slug)} className="chip">
                {b.name} {x.name}
              </Link>
            ))}
          <Link to={`/marki/${b.slug}/`} className="chip">
            Все модели {b.name} →
          </Link>
        </div>
        <div className="eyebrow mt-10 mb-4">Услуги</div>
        <div className="flex flex-wrap gap-2">
          {SERVICES.slice(0, 10).map((s) => (
            <Link key={s.slug} to={`/uslugi/${s.slug}/`} className="chip">
              {s.name}
            </Link>
          ))}
        </div>
      </Section>
    </>
  );
}

/* ---------------- Работы ---------------- */
export function WorksPage() {
  return (
    <>
      <PageHero path="/raboty/" title="Наши работы: до и после" lead="Каждый автомобиль — это история: парковочная царапина, серьёзное ДТП или просто уставший лак. Смотрите, как кузов возвращается к заводскому виду." />
      <Section className="!pt-8">
        <WorksBlock />
      </Section>
      <Section className="!pt-0">
        <SectionHead title="Почему результат не видно" />
        <div className="mt-8">
          <QualityGrid />
        </div>
      </Section>
      <Section className="!pt-0">
        <CtaBand title="Хотите так же?" sub="Посчитайте стоимость ремонта вашего автомобиля за минуту." />
      </Section>
    </>
  );
}

/* ---------------- Статьи ---------------- */
export function ArticlesPage() {
  return (
    <>
      <PageHero path="/stati/" title="Статьи о кузовном ремонте и покраске" lead="Простым языком о ценах, технологиях и о том, как не переплатить за ремонт автомобиля." />
      <Section className="!pt-8">
        <ArticlesTeaser limit={ARTICLES.length} />
      </Section>
    </>
  );
}

const fmtDate = (iso: string) => {
  const [y, mo, d] = iso.split("-");
  const M = ["января", "февраля", "марта", "апреля", "мая", "июня", "июля", "августа", "сентября", "октября", "ноября", "декабря"];
  return `${+d} ${M[+mo - 1]} ${y}`;
};

export function ArticlePage() {
  const { slug = "" } = useParams();
  const a = ARTICLE_BY_SLUG[slug];
  if (!a) return <NotFound />;
  return (
    <>
      <PageHero path={`/stati/${a.slug}/`} title={a.h1} eyebrow={`${a.tag} · ${a.read} мин чтения · ${fmtDate(a.date)}`} />
      <Section className="!pt-6">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_340px]">
          <article className="prose-dark max-w-3xl">
            <p className="!text-[18.5px] !text-fog-200">{a.intro}</p>
            {a.sections.map((s) => (
              <div key={s.h}>
                <h2>{s.h}</h2>
                {s.p?.map((p, i) => <p key={i}>{p}</p>)}
                {s.list && (
                  <ul>
                    {s.list.map((l) => (
                      <li key={l}>{l}</li>
                    ))}
                  </ul>
                )}
                {s.tip && (
                  <div className="my-6 flex gap-3 rounded-2xl border border-lava-500/25 bg-lava-500/[0.07] p-5 text-[15px] leading-relaxed text-fog-200">
                    <Lightbulb className="mt-0.5 h-5 w-5 shrink-0 text-lava-400" />
                    {s.tip}
                  </div>
                )}
              </div>
            ))}
          </article>
          <aside className="grid content-start gap-4 lg:sticky lg:top-24">
            <div className="card rounded-[24px] p-6">
              <div className="font-display text-lg font-bold text-white">Узнайте цену своего ремонта</div>
              <p className="mt-2 text-[14px] text-fog-400">Отметьте повреждения на схеме автомобиля — смета за минуту.</p>
              <Link to="/kalkulyator/" className="btn btn-lava mt-5 w-full">
                <CalcIcon className="h-4 w-4" /> Открыть калькулятор
              </Link>
            </div>
            <div className="card rounded-[24px] p-6">
              <div className="eyebrow mb-3">Услуги по теме</div>
              <div className="grid gap-2">
                {a.services.map((s) =>
                  SERVICE_BY_SLUG[s] ? (
                    <Link key={s} to={`/uslugi/${s}/`} className="flex items-center justify-between rounded-xl px-3 py-2.5 text-[14px] text-fog-200 hover:bg-white/5">
                      {SERVICE_BY_SLUG[s].name}
                      <ArrowRight className="h-4 w-4 text-fog-500" />
                    </Link>
                  ) : null,
                )}
              </div>
            </div>
          </aside>
        </div>
      </Section>
      <Section className="!pt-0">
        <SectionHead title="Читайте также" />
        <div className="mt-8">
          <ArticlesTeaser exclude={a.slug} />
        </div>
      </Section>
    </>
  );
}

/* ---------------- FAQ ---------------- */
export function FaqPage() {
  const groups = [...new Set(FAQ.map((f) => f.group))];
  return (
    <>
      <PageHero path="/voprosy/" title="Вопросы и ответы" lead="Собрали самые частые вопросы о ценах, сроках и качестве кузовного ремонта." />
      <Section className="!pt-8">
        <div className="grid gap-12">
          {groups.map((g) => (
            <div key={g} className="grid gap-6 lg:grid-cols-[260px_1fr]">
              <h2 className="font-display text-xl font-bold text-white">{g}</h2>
              <FaqList items={FAQ.filter((f) => f.group === g)} />
            </div>
          ))}
        </div>
      </Section>
      <Section className="!pt-0">
        <CtaBand title="Остались вопросы?" sub="Позвоните или напишите — мастер ответит и подскажет, как сэкономить на ремонте." />
      </Section>
    </>
  );
}

/* ---------------- Контакты ---------------- */
export function ContactsPage() {
  return (
    <>
      <PageHero path="/kontakty/" title="Контакты" lead={`${SITE.city}, ${SITE.street}. ${SITE.hours}. Приезжайте на бесплатный осмотр — или сначала посчитайте стоимость онлайн.`} />
      <Section className="!pt-8">
        <ContactsBlock />
      </Section>
      <Section className="!pt-0">
        <SectionHead title="Как проходит ремонт" />
        <div className="mt-8">
          <ProcessLine />
        </div>
      </Section>
    </>
  );
}

/* ---------------- Политика ---------------- */
export function PrivacyPage() {
  return (
    <>
      <PageHero path="/politika/" title="Политика обработки персональных данных" />
      <Section className="!pt-6">
        <div className="prose-dark max-w-3xl">
          <p>
            Настоящая политика определяет порядок обработки персональных данных пользователей сайта {SITE.url.replace("https://", "")} (далее — Сайт) в соответствии с Федеральным законом № 152-ФЗ «О персональных данных».
          </p>
          <h2>1. Какие данные мы обрабатываем</h2>
          <p>Имя, номер телефона, комментарий к заявке и данные о повреждениях автомобиля, которые пользователь добровольно указывает в формах Сайта, а также технические данные (cookie, IP-адрес, сведения о браузере) для статистики посещений.</p>
          <h2>2. Цели обработки</h2>
          <p>Связь с пользователем для консультации, расчёта стоимости и записи на ремонт; улучшение работы Сайта.</p>
          <h2>3. Срок и порядок обработки</h2>
          <p>Данные хранятся не дольше, чем этого требуют цели обработки, и не передаются третьим лицам, кроме случаев, предусмотренных законодательством РФ.</p>
          <h2>4. Права пользователя</h2>
          <p>
            Пользователь вправе запросить сведения об обработке своих данных, потребовать их уточнения или удаления, а также отозвать согласие, направив обращение по телефону {SITE.phoneHuman}
            {SITE.email ? ` или на e-mail ${SITE.email}` : ""}.
          </p>
          <h2>5. Оператор</h2>
          <p>
            {SITE.name}, {SITE.city}, {SITE.street}. {/* TODO: реквизиты оператора (ИП/ООО, ИНН, ОГРН) */}
          </p>
        </div>
      </Section>
    </>
  );
}

export function NotFound() {
  return (
    <section className="pt-[72px]">
      <div className="mx-auto max-w-3xl px-4 py-28 text-center">
        <div className="h-display lava-text text-[88px]">404</div>
        <h1 className="mt-4 font-display text-2xl font-bold text-white">Страница не найдена</h1>
        <p className="mt-3 text-fog-400">Возможно, она переехала. Зато калькулятор на месте.</p>
        <div className="mt-8 flex justify-center gap-3">
          <Link to="/" className="btn btn-ghost">
            На главную
          </Link>
          <Link to="/kalkulyator/" className="btn btn-lava">
            Калькулятор
          </Link>
        </div>
        <div className="mt-14">
          <BrandsCloud />
        </div>
      </div>
    </section>
  );
}

