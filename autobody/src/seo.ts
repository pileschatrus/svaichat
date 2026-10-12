import { SITE, links } from "./config";
import { SERVICES, SERVICE_BY_SLUG } from "./data/services";
import { BRANDS, BRAND_BY_SLUG, POPULAR_MODELS, modelClass } from "./data/cars";
import { ARTICLES, ARTICLE_BY_SLUG } from "./data/articles";
import { FAQ } from "./data/faq";
import { CAR_CLASSES, PART_BY_ID, priceForClass, num } from "./data/pricing";

export type Crumb = { name: string; path: string };
export type Meta = {
  title: string;
  description: string;
  path: string;
  crumbs: Crumb[];
  jsonLd: object[];
  noindex?: boolean;
  priority?: number;
};

const abs = (path: string) => SITE.url.replace(/\/$/, "") + path;
const HOME: Crumb = { name: "Главная", path: "/" };

export const ORG_ID = abs("/#org");

export function businessLd() {
  return {
    "@context": "https://schema.org",
    "@type": "AutoBodyShop",
    "@id": ORG_ID,
    name: SITE.name,
    description: `Кузовной ремонт и покраска автомобилей ${SITE.cityIn}. Онлайн-калькулятор стоимости.`,
    url: abs("/"),
    telephone: SITE.phone,
    ...(SITE.email ? { email: SITE.email } : {}),
    image: abs("/og.png"),
    priceRange: "₽₽",
    address: {
      "@type": "PostalAddress",
      streetAddress: SITE.street,
      addressLocality: SITE.city,
      addressRegion: SITE.region,
      postalCode: SITE.postalCode,
      addressCountry: "RU",
    },
    areaServed: { "@type": "City", name: SITE.city },
    openingHours: SITE.hoursSchema,
    sameAs: [links.instagram, links.telegram, links.max].filter(Boolean),
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Услуги кузовного ремонта",
      itemListElement: SERVICES.map((s) => ({
        "@type": "Offer",
        itemOffered: { "@type": "Service", name: s.name, url: abs(`/uslugi/${s.slug}/`) },
      })),
    },
  };
}

function crumbsLd(crumbs: Crumb[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((c, i) => ({ "@type": "ListItem", position: i + 1, name: c.name, item: abs(c.path) })),
  };
}

function faqLd(items: { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
  };
}

function serviceLd(name: string, path: string, description: string, minPrice?: number) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name,
    description,
    url: abs(path),
    provider: { "@id": ORG_ID },
    areaServed: { "@type": "City", name: SITE.city },
    ...(minPrice
      ? { offers: { "@type": "Offer", priceCurrency: "RUB", price: minPrice, priceSpecification: { "@type": "PriceSpecification", minPrice, priceCurrency: "RUB" } } }
      : {}),
  };
}

const page = (m: Omit<Meta, "jsonLd" | "crumbs"> & { crumbs?: Crumb[]; jsonLd?: object[] }): Meta => {
  const crumbs = m.crumbs ?? [HOME];
  return { ...m, crumbs, jsonLd: [...(crumbs.length > 1 ? [crumbsLd(crumbs)] : []), ...(m.jsonLd ?? [])] };
};

export const modelPath = (b: string, md: string) => `/marki/${b}/${md}/`;

export function allPaths(): string[] {
  return [
    "/",
    "/kalkulyator/",
    "/uslugi/",
    ...SERVICES.map((s) => `/uslugi/${s.slug}/`),
    "/ceny/",
    "/marki/",
    ...BRANDS.map((b) => `/marki/${b.slug}/`),
    ...POPULAR_MODELS.map(({ brand, model }) => modelPath(brand.slug, model.slug)),
    "/raboty/",
    "/stati/",
    ...ARTICLES.map((a) => `/stati/${a.slug}/`),
    "/voprosy/",
    "/kontakty/",
    "/politika/",
  ];
}

export function metaFor(path: string): Meta {
  const p = path.endsWith("/") ? path : path + "/";
  const seg = p.split("/").filter(Boolean);

  if (p === "/")
    return page({
      path: p,
      title: `Кузовной ремонт и покраска авто ${SITE.cityIn} — онлайн-калькулятор цены | ${SITE.street}`,
      description: `Кузовной ремонт и покраска автомобилей ${SITE.cityIn}: покраска элементов от 7 500 ₽, удаление вмятин без покраски, ремонт бамперов, порогов, после ДТП. Узнайте цену онлайн за минуту — отметьте повреждения на схеме авто. ☎ ${SITE.phoneHuman}`,
      jsonLd: [businessLd(), faqLd(FAQ.slice(0, 8))],
      priority: 1,
    });

  if (p === "/kalkulyator/")
    return page({
      path: p,
      title: `Калькулятор кузовного ремонта и покраски авто онлайн — ${SITE.city}`,
      description:
        "Онлайн-калькулятор стоимости кузовного ремонта и покраски: выберите марку и модель, отметьте повреждения на схеме кузова и получите смету в формате заказ-наряда. Сохраните в PDF или отправьте в мессенджер.",
      crumbs: [HOME, { name: "Калькулятор", path: p }],
      jsonLd: [
        {
          "@context": "https://schema.org",
          "@type": "WebApplication",
          name: "Калькулятор кузовного ремонта и покраски",
          applicationCategory: "BusinessApplication",
          operatingSystem: "Any",
          offers: { "@type": "Offer", price: 0, priceCurrency: "RUB" },
          provider: { "@id": ORG_ID },
        },
      ],
      priority: 0.95,
    });

  if (p === "/uslugi/")
    return page({
      path: p,
      title: `Услуги кузовного ремонта и покраски ${SITE.cityIn} — цены`,
      description: "Все услуги кузовного цеха: покраска, рихтовка, PDR, ремонт бамперов, порогов и арок, стапель, полировка, керамика, антигравийная плёнка. Цены от 1 500 ₽.",
      crumbs: [HOME, { name: "Услуги", path: p }],
      priority: 0.9,
    });

  if (seg[0] === "uslugi" && seg[1]) {
    const s = SERVICE_BY_SLUG[seg[1]];
    if (s)
      return page({
        path: p,
        title: s.title,
        description: s.description,
        crumbs: [HOME, { name: "Услуги", path: "/uslugi/" }, { name: s.name, path: p }],
        jsonLd: [serviceLd(s.h1, p, s.description, s.priceFrom || undefined), faqLd(s.faq)],
        priority: 0.9,
      });
  }

  if (p === "/ceny/")
    return page({
      path: p,
      title: `Цены на кузовной ремонт и покраску авто ${SITE.cityIn} — прайс 2026`,
      description: "Прайс-лист на покраску элементов, рихтовку, ремонт пластика, замену деталей для всех классов автомобилей: эконом, комфорт, бизнес, премиум, люкс.",
      crumbs: [HOME, { name: "Цены", path: p }],
      priority: 0.9,
    });

  if (p === "/marki/")
    return page({
      path: p,
      title: `Кузовной ремонт и покраска по маркам авто ${SITE.cityIn}`,
      description: `Цены на покраску и кузовной ремонт для ${BRANDS.length} марок автомобилей: Lada, Kia, Hyundai, Toyota, VW, Skoda, Haval, Chery, Geely, BMW, Mercedes и других.`,
      crumbs: [HOME, { name: "Марки", path: p }],
      priority: 0.8,
    });

  if (seg[0] === "marki" && seg[1]) {
    const b = BRAND_BY_SLUG[seg[1]];
    if (b && !seg[2]) {
      const bump = priceForClass(PART_BY_ID.bumper_f.paint, b.cls);
      return page({
        path: p,
        title: `Кузовной ремонт и покраска ${b.name} (${b.ru}) ${SITE.cityIn} — цены`,
        description: `Кузовной ремонт и покраска ${b.name} ${SITE.cityIn}: покраска бампера от ${num(bump)} ₽, рихтовка, PDR, ремонт после ДТП. Онлайн-расчёт стоимости для всех моделей ${b.name}.`,
        crumbs: [HOME, { name: "Марки", path: "/marki/" }, { name: b.name, path: p }],
        jsonLd: [serviceLd(`Кузовной ремонт ${b.name}`, p, `Кузовной ремонт и покраска ${b.name} ${SITE.cityIn}`, priceForClass(1500, b.cls))],
        priority: 0.7,
      });
    }
    const md = b?.models.find((x) => x.slug === seg[2]);
    if (b && md) {
      const cls = modelClass(b, md);
      const nm = `${b.name} ${md.name}`;
      const bump = priceForClass(PART_BY_ID.bumper_f.paint, cls);
      const door = priceForClass(PART_BY_ID.door_fl.paint, cls);
      return page({
        path: p,
        title: `Кузовной ремонт и покраска ${nm} ${SITE.cityIn} — цены на покраску элементов`,
        description: `Покраска ${nm} (${b.ru} ${md.ru}) ${SITE.cityIn}: бампер от ${num(bump)} ₽, дверь от ${num(door)} ₽, удаление вмятин без покраски, ремонт после ДТП. Калькулятор стоимости для ${nm}.`,
        crumbs: [HOME, { name: "Марки", path: "/marki/" }, { name: b.name, path: `/marki/${b.slug}/` }, { name: md.name, path: p }],
        jsonLd: [
          serviceLd(`Кузовной ремонт и покраска ${nm}`, p, `Класс ${CAR_CLASSES[cls].label}`, priceForClass(1500, cls)),
          faqLd(modelFaq(nm, cls)),
        ],
        priority: 0.7,
      });
    }
  }

  if (p === "/raboty/")
    return page({
      path: p,
      title: `Примеры работ: кузовной ремонт и покраска до и после — ${SITE.city}`,
      description: "Фото работ кузовного цеха до и после ремонта: покраска, рихтовка, ремонт бамперов, удаление вмятин, восстановление после ДТП.",
      crumbs: [HOME, { name: "Работы", path: p }],
      priority: 0.7,
    });

  if (p === "/stati/")
    return page({
      path: p,
      title: "Статьи о кузовном ремонте и покраске авто — советы мастеров",
      description: "Полезные статьи: сколько стоит покраска, как убрать царапину, когда возможно удаление вмятин без покраски, как подобрать краску, что делать после ДТП.",
      crumbs: [HOME, { name: "Статьи", path: p }],
      priority: 0.6,
    });

  if (seg[0] === "stati" && seg[1]) {
    const a = ARTICLE_BY_SLUG[seg[1]];
    if (a)
      return page({
        path: p,
        title: a.title,
        description: a.description,
        crumbs: [HOME, { name: "Статьи", path: "/stati/" }, { name: a.h1, path: p }],
        jsonLd: [
          {
            "@context": "https://schema.org",
            "@type": "Article",
            headline: a.h1,
            description: a.description,
            datePublished: a.date,
            dateModified: a.date,
            mainEntityOfPage: abs(p),
            author: { "@type": "Organization", name: SITE.name, url: abs("/") },
            publisher: { "@id": ORG_ID },
          },
        ],
        priority: 0.6,
      });
  }

  if (p === "/voprosy/")
    return page({
      path: p,
      title: "Вопросы и ответы о кузовном ремонте и покраске авто",
      description: "Ответы на частые вопросы: цены, сроки, гарантия, подбор цвета, работа с запчастями клиента и ремонт после ДТП.",
      crumbs: [HOME, { name: "Вопросы", path: p }],
      jsonLd: [faqLd(FAQ)],
      priority: 0.6,
    });

  if (p === "/kontakty/")
    return page({
      path: p,
      title: `Контакты кузовного центра ${SITE.cityIn} — ${SITE.street}`,
      description: `Адрес: ${SITE.city}, ${SITE.street}. Телефон ${SITE.phoneHuman}. ${SITE.hours}. Схема проезда, запись на осмотр.`,
      crumbs: [HOME, { name: "Контакты", path: p }],
      jsonLd: [businessLd()],
      priority: 0.8,
    });

  if (p === "/politika/")
    return page({
      path: p,
      title: "Политика обработки персональных данных",
      description: "Политика конфиденциальности и обработки персональных данных.",
      crumbs: [HOME, { name: "Политика", path: p }],
      priority: 0.1,
    });

  return page({ path: p, title: "Страница не найдена", description: "Страница не найдена", noindex: true });
}

export function modelFaq(nm: string, cls: Parameters<typeof priceForClass>[1]) {
  const P = (id: string) => num(priceForClass(PART_BY_ID[id].paint, cls));
  return [
    { q: `Сколько стоит покрасить бампер ${nm}?`, a: `Покраска переднего или заднего бампера ${nm} — от ${P("bumper_f")} ₽ (неметаллик). Металлик +10%, перламутр +30%. Ремонт трещин оплачивается отдельно — от ${num(priceForClass(2000, cls))} ₽.` },
    { q: `Сколько стоит покраска двери ${nm}?`, a: `Покраска двери ${nm} — от ${P("door_fl")} ₽. С рихтовкой небольшой вмятины — от ${num(priceForClass(PART_BY_ID.door_fl.paint + 1500, cls))} ₽.` },
    { q: `Сколько стоит покрасить капот ${nm}?`, a: `Покраска капота ${nm} — от ${P("hood")} ₽. Рекомендуем после покраски защитить капот антигравийной плёнкой.` },
    { q: `Можно ли убрать вмятину на ${nm} без покраски?`, a: `Да, если краска не повреждена. Удаление вмятины методом PDR на ${nm} — от ${num(priceForClass(2000, cls))} ₽.` },
  ];
}

export const SITE_URL = abs;
