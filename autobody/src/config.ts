// Все контакты и реквизиты компании — в одном месте.
// Пустые строки = контакт ещё не получен: соответствующие кнопки
// автоматически переключаются на запасной сценарий (копирование + звонок).

export const SITE = {
  // TODO: название компании (используется в логотипе, title, разметке Schema.org)
  name: "Кузовной центр",
  tagline: "кузовной ремонт и покраска",
  city: "Чебоксары",
  cityIn: "в Чебоксарах",
  region: "Чувашская Республика",
  street: "ул. Водопроводная, 2А",
  postalCode: "428000", // TODO: уточнить индекс
  // TODO: боевой домен — нужен для canonical, sitemap.xml и Open Graph
  url: "https://kuzov-cheboksary.ru",

  phone: "+79276660239",
  phoneHuman: "+7 (927) 666-02-39",
  email: "", // ждём от заказчика
  instagram: "murzik_cotopes",
  telegram: "", // username без @, напр. "kuzov21"
  max: "", // ссылка на профиль/чат в MAX, напр. "https://max.ru/u/..."

  // TODO: подтвердить у заказчика
  hours: "Пн–Сб 9:00–19:00",
  hoursSchema: ["Mo-Sa 09:00-19:00"],
  warrantyMonths: 12,

  // Яндекс.Метрика: номер счётчика (0 — не подключать)
  metrikaId: 0,
};

export const mapsLinks = {
  yandex: `https://yandex.ru/maps/?text=${encodeURIComponent(`${SITE.city}, ${SITE.street}`)}`,
  twoGis: `https://2gis.ru/cheboksary/search/${encodeURIComponent(SITE.street)}`,
  widget: `https://yandex.ru/map-widget/v1/?text=${encodeURIComponent(
    `${SITE.city}, ${SITE.street}`,
  )}&z=16`,
};

export const links = {
  tel: `tel:${SITE.phone}`,
  instagram: `https://www.instagram.com/${SITE.instagram}/`,
  instagramDm: `https://ig.me/m/${SITE.instagram}`,
  telegram: SITE.telegram ? `https://t.me/${SITE.telegram}` : "",
  max: SITE.max,
  mail: SITE.email ? `mailto:${SITE.email}` : "",
};

// Обязательная по законодательству РФ пометка рядом со ссылками на Instagram
export const META_DISCLAIMER =
  "Instagram принадлежит компании Meta, деятельность которой признана экстремистской и запрещена на территории РФ.";

export function track(goal: string) {
  const w = window as unknown as { ym?: (...a: unknown[]) => void };
  if (SITE.metrikaId && w.ym) w.ym(SITE.metrikaId, "reachGoal", goal);
}
