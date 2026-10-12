import { Link } from "react-router-dom";
import { ArrowRight, Calculator as CalcIcon, Phone } from "lucide-react";
import { SITE, links, track } from "../config";
import { FAQ } from "../data/faq";
import { BRANDS } from "../data/cars";
import { SERVICES } from "../data/services";
import Calculator from "../components/Calculator";
import HeroCar from "../components/HeroCar";
import {
  ArticlesTeaser,
  BrandsCloud,
  ContactsBlock,
  FaqList,
  PriceMatrix,
  ProcessLine,
  QualityGrid,
  Section,
  ServicesGrid,
  WorksBlock,
} from "../components/Blocks";
import { Reveal, SectionHead } from "../components/ui";

const STATS = [
  { v: "1 мин", l: "расчёт стоимости онлайн" },
  { v: String(BRANDS.length), l: "марок авто в калькуляторе" },
  { v: "0 ₽", l: "осмотр и смета" },
  { v: String(SERVICES.length), l: "видов кузовных услуг" },
];

export default function Home() {
  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden pt-[72px]">
        <div className="bg-grid pointer-events-none absolute inset-0" />
        <div className="glow-lava pointer-events-none absolute top-[30%] left-1/2 h-[420px] w-[820px] -translate-x-1/2" />
        <div className="relative mx-auto max-w-[1320px] px-4 pt-10 pb-10 sm:px-6 sm:pt-16 lg:pt-20">
          <div className="mx-auto max-w-4xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-[11.5px] text-fog-300 backdrop-blur sm:text-[12.5px]">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full rounded-full bg-mint-400" style={{ animation: "pulse-ring 1.8s ease-out infinite" }} />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-mint-400" />
              </span>
              {SITE.street}<span className="hidden sm:inline">, {SITE.city}</span> · {SITE.hours}
            </div>
            <h1 className="h-display text-[34px] sm:text-[54px] lg:text-[68px]">
              <span className="chrome">Кузовной ремонт</span>
              <br />
              <span className="chrome">и </span>
              <span className="lava-text">покраска авто</span>
              <br />
              <span className="chrome">{SITE.cityIn}</span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-[16.5px] leading-relaxed text-fog-300 sm:text-[18px]">
              Отметьте повреждения на схеме своего автомобиля — и сразу узнайте цену ремонта. Без звонков и выездов, с готовым заказ-нарядом в PDF.
            </p>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <a href="#calc" className="btn btn-lava !px-7 !py-4 text-[16px]" onClick={() => track("hero_calc")}>
                <CalcIcon className="h-5 w-5" /> Рассчитать стоимость
              </a>
              <a href={links.tel} className="btn btn-ghost !px-7 !py-4 text-[16px]" onClick={() => track("call")}>
                <Phone className="h-5 w-5" /> {SITE.phoneHuman}
              </a>
            </div>
          </div>

          <div className="relative mx-auto mt-10 max-w-5xl sm:mt-14">
            <HeroCar />
          </div>

          <div className="mx-auto mt-10 grid max-w-5xl grid-cols-2 gap-3 sm:grid-cols-4">
            {STATS.map((s, i) => (
              <Reveal key={s.l} delay={i * 70}>
                <div className="glass rounded-[20px] px-5 py-4 text-center">
                  <div className="font-display text-2xl font-bold text-white sm:text-3xl">{s.v}</div>
                  <div className="mt-1 text-[12.5px] text-fog-400">{s.l}</div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* КАЛЬКУЛЯТОР */}
      <Section id="calc" className="!pt-12">
        <div className="mb-10 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <SectionHead
            eyebrow="Онлайн-калькулятор"
            title="Сколько стоит ремонт вашего авто"
            sub="Выберите марку, нажмите на повреждённые детали и опишите повреждение простыми словами. Калькулятор сам подберёт технологию ремонта и посчитает цену для вашего класса автомобиля."
          />
          <Link to="/kalkulyator/" className="btn btn-ghost btn-sm shrink-0">
            Открыть на весь экран <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <Calculator />
      </Section>

      <div className="hairline mx-auto max-w-[1320px]" />

      <Section id="uslugi">
        <div className="mb-10 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <SectionHead eyebrow="Услуги" title="Всё для кузова — в одном месте" sub="От полировки царапины до восстановления после серьёзного ДТП." />
          <Link to="/uslugi/" className="btn btn-ghost btn-sm shrink-0">
            Все услуги <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <ServicesGrid limit={8} />
      </Section>

      <Section>
        <SectionHead eyebrow="Стандарт качества" title="Покраска, которую не отличить от заводской" sub="Шесть правил, которые мы соблюдаем на каждом автомобиле — от бюджетного седана до премиального внедорожника." />
        <div className="mt-10">
          <QualityGrid />
        </div>
      </Section>

      <Section className="!pt-0">
        <SectionHead eyebrow="Как мы работаем" title="Пять шагов до идеального кузова" />
        <div className="mt-10">
          <ProcessLine />
        </div>
      </Section>

      <Section id="raboty">
        <div className="mb-10 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <SectionHead eyebrow="Наши работы" title="Результат говорит сам за себя" />
          <Link to="/raboty/" className="btn btn-ghost btn-sm shrink-0">
            Все работы <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <WorksBlock />
      </Section>

      <Section id="ceny">
        <div className="mb-10 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <SectionHead eyebrow="Прайс" title="Цены на покраску элементов" sub="Стоимость зависит от класса автомобиля. Точную цену с учётом повреждений покажет калькулятор." />
          <Link to="/ceny/" className="btn btn-ghost btn-sm shrink-0">
            Полный прайс <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <Reveal>
          <PriceMatrix />
        </Reveal>
      </Section>

      <Section className="!pt-0">
        <SectionHead eyebrow="Марки" title="Ремонтируем любые автомобили" sub="Выберите марку — покажем цены на покраску и ремонт именно для неё." />
        <div className="mt-8">
          <BrandsCloud />
        </div>
      </Section>

      <Section id="faq">
        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <SectionHead eyebrow="Вопросы" title="Отвечаем честно" sub="Не нашли ответ? Позвоните — мастер проконсультирует бесплатно." />
            <Link to="/voprosy/" className="btn btn-ghost btn-sm mt-6">
              Все вопросы <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <FaqList items={FAQ.slice(0, 8)} />
        </div>
      </Section>

      <Section className="!pt-0">
        <div className="mb-10 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <SectionHead eyebrow="Полезное" title="Советы мастеров" />
          <Link to="/stati/" className="btn btn-ghost btn-sm shrink-0">
            Все статьи <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <ArticlesTeaser />
      </Section>

      <Section id="kontakty" className="!pt-0">
        <SectionHead eyebrow="Контакты" title="Ждём вас на Водопроводной, 2А" />
        <div className="mt-10">
          <ContactsBlock />
        </div>
      </Section>
    </>
  );
}
