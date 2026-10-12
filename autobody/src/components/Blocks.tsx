import { useRef, useState, type ReactNode } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  BadgeCheck,
  Car,
  ChevronDown,
  Clock,
  Disc3,
  Frame,
  Gauge,
  Hammer,
  Layers,
  MapPin,
  Palette,
  Phone,
  ScanLine,
  Shield,
  ShieldCheck,
  Sparkles,
  SprayCan,
  Target,
  Wrench,
  Zap,
} from "lucide-react";
import { META_DISCLAIMER, SITE, links, mapsLinks, track } from "../config";
import { SERVICES, type Service } from "../data/services";
import { BRANDS } from "../data/cars";
import { ARTICLES } from "../data/articles";
import { WORKS, type Work } from "../data/works";
import { CAR_CLASSES, CLASS_ORDER, PARTS, fmt, priceForClass, type ClassId } from "../data/pricing";
import { InstagramIcon, Reveal, SectionHead } from "./ui";
import { LeadForm, Messengers } from "./Lead";

export const SERVICE_ICON: Record<string, ReactNode> = {
  hammer: <Hammer />,
  spray: <SprayCan />,
  target: <Target />,
  car: <Car />,
  bumper: <Layers />,
  dent: <Gauge />,
  crash: <Zap />,
  frame: <Frame />,
  rust: <Wrench />,
  shield: <Shield />,
  sparkle: <Sparkles />,
  wheel: <Disc3 />,
  palette: <Palette />,
};

export function ServiceCard({ s, i = 0 }: { s: Service; i?: number }) {
  return (
    <Reveal delay={(i % 4) * 60}>
      <Link to={`/uslugi/${s.slug}/`} className="card card-hover group relative flex h-full flex-col overflow-hidden rounded-[24px] p-6">
        <div className="pointer-events-none absolute -top-16 -right-16 h-40 w-40 rounded-full bg-lava-500/0 blur-3xl transition-all duration-700 group-hover:bg-lava-500/25" />
        <div className="grid h-12 w-12 place-items-center rounded-2xl border border-white/10 bg-white/[0.04] text-lava-400 [&>svg]:h-6 [&>svg]:w-6">{SERVICE_ICON[s.icon]}</div>
        <div className="mt-5 font-display text-[17px] leading-snug font-bold text-white">{s.name}</div>
        <p className="mt-2 line-clamp-3 flex-1 text-[13.5px] leading-relaxed text-fog-400">{s.lead}</p>
        <div className="mt-5 flex items-end justify-between">
          <div>
            <div className="text-[11px] text-fog-500">{s.priceUnit}</div>
            <div className="font-display text-[17px] font-bold text-white">{s.priceFrom ? `от ${fmt(s.priceFrom)}` : "бесплатно"}</div>
          </div>
          <span className="grid h-10 w-10 place-items-center rounded-full border border-white/10 text-fog-300 transition-all group-hover:border-lava-500 group-hover:bg-lava-500 group-hover:text-white">
            <ArrowRight className="h-4 w-4" />
          </span>
        </div>
      </Link>
    </Reveal>
  );
}

export function ServicesGrid({ limit }: { limit?: number }) {
  const list = limit ? SERVICES.slice(0, limit) : SERVICES;
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {list.map((s, i) => (
        <ServiceCard key={s.slug} s={s} i={i} />
      ))}
    </div>
  );
}

export const QUALITY = [
  { icon: <ScanLine />, t: "Дефектовка с толщиномером", d: "Замеряем ЛКП каждой детали, находим скрытые повреждения и старые ремонты до начала работ." },
  { icon: <Palette />, t: "Компьютерный подбор цвета", d: "Код краски + спектрофотометр + тест-напыл при дневном свете. Цвет не «уходит»." },
  { icon: <SprayCan />, t: "Покраска в камере", d: "Чистый подготовленный воздух и горячая сушка: без пыли, подтёков и «шагрени»." },
  { icon: <Sparkles />, t: "Полировка переходов", d: "Выравниваем блеск окрашенной детали с заводским покрытием соседних." },
  { icon: <ShieldCheck />, t: `Гарантия на работы`, d: "Условия гарантии фиксируются в заказ-наряде. Устраняем недочёты бесплатно." },
  { icon: <BadgeCheck />, t: "Честная смета", d: "Цена согласуется до начала работ. Любые доплаты — только с вашего согласия." },
];

export function QualityGrid() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {QUALITY.map((q, i) => (
        <Reveal key={q.t} delay={(i % 3) * 80}>
          <div className="card h-full rounded-[24px] p-6">
            <div className="grid h-11 w-11 place-items-center rounded-xl bg-lava-500/12 text-lava-400 [&>svg]:h-5 [&>svg]:w-5">{q.icon}</div>
            <div className="mt-4 font-display text-[16px] font-bold text-white">{q.t}</div>
            <p className="mt-2 text-[14px] leading-relaxed text-fog-400">{q.d}</p>
          </div>
        </Reveal>
      ))}
    </div>
  );
}

export const PROCESS = [
  { t: "Расчёт онлайн", d: "Отметьте повреждения на схеме — смета за минуту." },
  { t: "Бесплатный осмотр", d: "Мастер уточнит объём работ и зафиксирует цену." },
  { t: "Ремонт и покраска", d: "Рихтовка, подготовка, покраска в камере." },
  { t: "Контроль качества", d: "Проверка цвета, зазоров и толщины покрытия." },
  { t: "Выдача с гарантией", d: "Чистый автомобиль и заказ-наряд с гарантией." },
];

export function ProcessLine() {
  return (
    <ol className="grid gap-3 md:grid-cols-5">
      {PROCESS.map((p, i) => (
        <Reveal key={p.t} delay={i * 70}>
          <li className="relative h-full rounded-[22px] border border-white/7 bg-white/[0.02] p-5">
            <div className="font-mono text-[11px] tracking-[0.2em] text-lava-400">0{i + 1}</div>
            <div className="mt-3 font-display text-[15px] font-bold text-white">{p.t}</div>
            <div className="mt-1.5 text-[13px] leading-relaxed text-fog-400">{p.d}</div>
          </li>
        </Reveal>
      ))}
    </ol>
  );
}

export function PriceMatrix({ highlight }: { highlight?: ClassId }) {
  const rows = PARTS.filter((p) => p.paint > 0 && !p.id.endsWith("_r") && !p.id.includes("fr") && !p.id.includes("rr"));
  return (
    <div className="card overflow-hidden rounded-[24px]">
      <div className="scroll-thin overflow-x-auto">
        <table className="w-full min-w-[640px] text-[14px]">
          <caption className="sr-only">Цены на покраску элементов по классам автомобилей</caption>
          <thead>
            <tr className="border-b border-white/8 text-left">
              <th className="sticky left-0 bg-ink-850 px-5 py-4 text-[12px] font-semibold tracking-wider text-fog-400 uppercase">Покраска элемента</th>
              {CLASS_ORDER.map((c) => (
                <th key={c} className={`px-4 py-4 text-right text-[12px] font-semibold tracking-wider uppercase ${highlight === c ? "text-lava-400" : "text-fog-400"}`}>
                  {CAR_CLASSES[c].label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((p) => (
              <tr key={p.id} className="border-b border-white/5 last:border-0 hover:bg-white/[0.02]">
                <td className="sticky left-0 bg-ink-850 px-5 py-3.5 text-fog-200">{p.name.replace(/ (левое|левая|левый)/, "").replace("Переднее крыло", "Крыло переднее").replace("Заднее крыло", "Крыло заднее")}</td>
                {CLASS_ORDER.map((c) => (
                  <td key={c} className={`px-4 py-3.5 text-right whitespace-nowrap tabular-nums ${highlight === c ? "font-bold text-white" : "text-fog-300"}`}>
                    {fmt(priceForClass(p.paint, c))}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="border-t border-white/6 px-5 py-3 text-[12px] text-fog-500">Цены указаны для неметаллика. Металлик +10%, перламутр +30%, матовые краски +45%. Скидка от 3 элементов.</div>
    </div>
  );
}

export function FaqList({ items }: { items: { q: string; a: string }[] }) {
  return (
    <div className="grid gap-3">
      {items.map((f, i) => (
        <details key={i} className="group card rounded-[20px] open:border-white/14">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 text-[15.5px] font-semibold text-white sm:px-6 [&::-webkit-details-marker]:hidden">
            {f.q}
            <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-white/10 transition-transform duration-300 group-open:rotate-180 group-open:border-lava-500 group-open:text-lava-400">
              <ChevronDown className="h-4 w-4" />
            </span>
          </summary>
          <p className="px-5 pb-5 text-[14.5px] leading-relaxed text-fog-300 sm:px-6">{f.a}</p>
        </details>
      ))}
    </div>
  );
}

export function BeforeAfter({ w }: { w: Work }) {
  const [pos, setPos] = useState(50);
  const ref = useRef<HTMLDivElement>(null);
  const move = (x: number) => {
    const r = ref.current!.getBoundingClientRect();
    setPos(Math.max(0, Math.min(100, ((x - r.left) / r.width) * 100)));
  };
  return (
    <figure className="card overflow-hidden rounded-[24px]">
      <div ref={ref} className="relative aspect-[4/3] cursor-ew-resize touch-pan-y select-none" onPointerMove={(e) => (e.buttons || e.pointerType === "mouse") && move(e.clientX)} onPointerDown={(e) => move(e.clientX)}>
        <img src={w.after} alt={`${w.title} ${w.car} — после`} className="absolute inset-0 h-full w-full object-cover" loading="lazy" />
        <img src={w.before} alt={`${w.title} ${w.car} — до`} className="absolute inset-0 h-full w-full object-cover" style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }} loading="lazy" />
        <div className="absolute inset-y-0 w-0.5 bg-white" style={{ left: `${pos}%` }} />
      </div>
      <figcaption className="p-5">
        <div className="font-semibold text-white">{w.title}</div>
        <div className="text-[13px] text-fog-400">{w.car}</div>
      </figcaption>
    </figure>
  );
}

export function WorksBlock() {
  if (WORKS.length)
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {WORKS.map((w, i) => (
          <BeforeAfter key={i} w={w} />
        ))}
      </div>
    );
  const tiles = [
    { t: "Покраска бамперов", g: "from-[#ff5a1f] to-[#7a1d04]" },
    { t: "Удаление вмятин", g: "from-[#38bdf8] to-[#0c3a52]" },
    { t: "Ремонт после ДТП", g: "from-[#a78bfa] to-[#2e1a66]" },
    { t: "Полная покраска", g: "from-[#34d399] to-[#064e3b]" },
  ];
  return (
    <div className="grid gap-4 lg:grid-cols-[1.1fr_1fr]">
      <a
        href={links.instagram}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => track("instagram")}
        className="card card-hover group relative flex min-h-[320px] flex-col justify-between overflow-hidden rounded-[28px] p-7 sm:p-9"
      >
        <div className="pointer-events-none absolute -right-20 -bottom-24 h-80 w-80 rounded-full bg-gradient-to-br from-[#f58529] via-[#dd2a7b] to-[#8134af] opacity-30 blur-3xl transition-opacity group-hover:opacity-50" />
        <div className="relative">
          <div className="grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-[#f58529] via-[#dd2a7b] to-[#8134af] text-white">
            <InstagramIcon className="h-7 w-7" />
          </div>
          <div className="mt-6 font-display text-2xl font-bold text-white sm:text-3xl">Свежие работы — каждый день</div>
          <p className="mt-3 max-w-md text-fog-300">Фото и видео «до/после», процесс покраски, подбор цвета и отзывы клиентов — в нашем профиле.</p>
        </div>
        <div className="relative mt-8 flex items-center justify-between">
          <span className="font-mono text-[13px] text-white">@{SITE.instagram}*</span>
          <span className="btn btn-ghost btn-sm group-hover:border-white/40">
            Смотреть работы <ArrowRight className="h-4 w-4" />
          </span>
        </div>
      </a>
      <div className="grid grid-cols-2 gap-4">
        {tiles.map((t) => (
          <a key={t.t} href={links.instagram} target="_blank" rel="noopener noreferrer" className="group relative aspect-square overflow-hidden rounded-[24px] border border-white/8">
            <div className={`absolute inset-0 bg-gradient-to-br ${t.g} opacity-70 transition-transform duration-700 group-hover:scale-110`} />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,.35),transparent_45%)]" />
            <div className="absolute inset-x-0 bottom-0 p-4 font-display text-[14px] font-bold text-white">{t.t}</div>
          </a>
        ))}
      </div>
      <div className="text-[11px] text-fog-500 lg:col-span-2">* {META_DISCLAIMER}</div>
    </div>
  );
}

export function BrandsCloud() {
  return (
    <div className="flex flex-wrap gap-2">
      {BRANDS.map((b) => (
        <Link key={b.slug} to={`/marki/${b.slug}/`} className="chip !px-4 !py-2.5 text-[14px]">
          {b.name}
        </Link>
      ))}
    </div>
  );
}

export function ArticlesTeaser({ limit = 3, exclude }: { limit?: number; exclude?: string }) {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {ARTICLES.filter((a) => a.slug !== exclude)
        .slice(0, limit)
        .map((a, i) => (
          <Reveal key={a.slug} delay={i * 80}>
            <Link to={`/stati/${a.slug}/`} className="card card-hover group flex h-full flex-col rounded-[24px] p-6">
              <div className="flex items-center gap-3 text-[12px] text-fog-500">
                <span className="rounded-full bg-lava-500/12 px-2.5 py-1 font-semibold text-lava-300">{a.tag}</span>
                {a.read} мин
              </div>
              <div className="mt-4 flex-1 font-display text-[16.5px] leading-snug font-bold text-white">{a.h1}</div>
              <div className="mt-4 flex items-center gap-2 text-[13px] font-semibold text-fog-300 group-hover:text-white">
                Читать <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </div>
            </Link>
          </Reveal>
        ))}
    </div>
  );
}

export function ContactsBlock() {
  return (
    <div className="grid gap-4 lg:grid-cols-[1fr_1.15fr]">
      <div className="card rounded-[28px] p-6 sm:p-8">
        <div className="font-display text-2xl font-bold text-white">Запишитесь на бесплатный осмотр</div>
        <p className="mt-2 text-[14.5px] text-fog-400">Оставьте телефон — мастер перезвонит, ответит на вопросы и подберёт удобное время.</p>
        <div className="mt-6">
          <LeadForm cfg={{ title: "Контакты", source: "contacts" }} />
        </div>
      </div>
      <div className="card flex flex-col overflow-hidden rounded-[28px]">
        <div className="grid gap-5 p-6 sm:grid-cols-2 sm:p-8">
          <div>
            <div className="eyebrow mb-2">Адрес</div>
            <a href={mapsLinks.yandex} target="_blank" rel="noopener noreferrer" className="flex items-start gap-2 text-white hover:text-lava-300">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-lava-400" />
              {SITE.city}, {SITE.street}
            </a>
            <div className="mt-2 flex gap-3 text-[13px]">
              <a href={mapsLinks.yandex} target="_blank" rel="noopener noreferrer" className="text-fog-400 underline hover:text-white">
                Яндекс Карты
              </a>
              <a href={mapsLinks.twoGis} target="_blank" rel="noopener noreferrer" className="text-fog-400 underline hover:text-white">
                2ГИС
              </a>
            </div>
          </div>
          <div>
            <div className="eyebrow mb-2">Телефон</div>
            <a href={links.tel} onClick={() => track("call")} className="flex items-center gap-2 font-display text-lg font-bold text-white">
              <Phone className="h-4 w-4 text-lava-400" />
              {SITE.phoneHuman}
            </a>
            <div className="mt-2 flex items-center gap-2 text-[13px] text-fog-400">
              <Clock className="h-4 w-4" /> {SITE.hours}
            </div>
          </div>
          <div className="sm:col-span-2">
            <div className="eyebrow mb-2">Мессенджеры</div>
            <div className="flex gap-2">
              <Messengers />
            </div>
          </div>
        </div>
        <div className="relative min-h-[300px] flex-1 border-t border-white/6 bg-ink-800">
          <iframe
            src={mapsLinks.widget}
            title={`Карта: ${SITE.city}, ${SITE.street}`}
            loading="lazy"
            className="absolute inset-0 h-full w-full grayscale-[.6] invert-[.9] hue-rotate-180"
            allowFullScreen
          />
        </div>
      </div>
    </div>
  );
}

export function CtaBand({ title, sub, to = "/kalkulyator/", label = "Рассчитать стоимость" }: { title: string; sub?: string; to?: string; label?: string }) {
  return (
    <Reveal>
      <div className="relative overflow-hidden rounded-[32px] border border-lava-500/25 bg-gradient-to-br from-[#2a1208] via-ink-900 to-ink-900 p-8 sm:p-12">
        <div className="glow-lava pointer-events-none absolute -top-24 -right-10 h-72 w-72" />
        <div className="relative flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="max-w-2xl">
            <div className="h-display text-[26px] text-white sm:text-[34px]">{title}</div>
            {sub && <p className="mt-3 text-fog-300">{sub}</p>}
          </div>
          <div className="flex flex-wrap gap-3">
            <Link to={to} className="btn btn-lava">
              {label} <ArrowRight className="h-4 w-4" />
            </Link>
            <a href={links.tel} onClick={() => track("call")} className="btn btn-ghost">
              <Phone className="h-4 w-4" /> Позвонить
            </a>
          </div>
        </div>
      </div>
    </Reveal>
  );
}

export function Section({ id, children, className = "" }: { id?: string; children: ReactNode; className?: string }) {
  return (
    <section id={id} className={`mx-auto max-w-[1320px] scroll-mt-24 px-4 py-16 sm:px-6 sm:py-24 ${className}`}>
      {children}
    </section>
  );
}

export { SectionHead };
