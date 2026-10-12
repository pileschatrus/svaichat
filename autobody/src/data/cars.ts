import type { ClassId } from "./pricing";

// База марок и моделей. Класс модели определяет коэффициент цены.
// pop: true — для модели создаётся отдельная SEO-страница /marki/<марка>/<модель>/
// note — «слабые места» кузова модели, выводятся на странице модели.

export type Model = {
  slug: string;
  name: string;
  ru: string; // как пишут в поиске по-русски
  cls?: ClassId;
  pop?: boolean;
  note?: string;
};

export type Brand = {
  slug: string;
  name: string;
  ru: string;
  cls: ClassId;
  top?: boolean; // показывать в быстрых кнопках
  models: Model[];
};

const m = (slug: string, name: string, ru: string, cls?: ClassId, pop?: boolean, note?: string): Model => ({
  slug,
  name,
  ru,
  cls,
  pop,
  note,
});

export const BRANDS: Brand[] = [
  {
    slug: "lada", name: "Lada", ru: "Лада", cls: "econom", top: true,
    models: [
      m("granta", "Granta", "Гранта", undefined, true, "Тонкий металл и заводская обработка скрытых полостей средняя: ржавчина чаще всего появляется на задних арках, порогах, нижних кромках дверей и крышке багажника под накладкой номера."),
      m("vesta", "Vesta", "Веста", undefined, true, "Кузов защищён от коррозии лучше прежних моделей Lada, но типичные проблемы — ржавчина по кромкам дверей, сколами на капоте и трещинами переднего бампера после парковок."),
      m("niva-legend", "Niva Legend", "Нива Легенд", undefined, true, "Самые уязвимые места — пороги, арки, днище и нижняя часть дверей: их стоит регулярно обрабатывать антикором."),
      m("niva-travel", "Niva Travel", "Нива Тревел", undefined, true, "Пластиковый обвес защищает арки, но под ним скапливается грязь — проверяйте пороги и арки на коррозию."),
      m("largus", "Largus", "Ларгус", undefined, true, "Типичные повреждения — задние распашные двери, пороги и задние арки, сколы на капоте."),
      m("xray", "XRAY", "Иксрей", undefined, true),
      m("priora", "Priora", "Приора", undefined, true, "Возрастные кузова: ржавчина на порогах, арках, дверях снизу и в проёме багажника."),
      m("kalina", "Kalina", "Калина", undefined, true, "Коррозия задних арок, порогов и крышки багажника — типичная проблема модели."),
      m("2114", "2114 / Samara", "2114", undefined, false),
      m("iskra", "Iskra", "Искра"),
    ],
  },
  {
    slug: "kia", name: "Kia", ru: "Киа", cls: "comfort", top: true,
    models: [
      m("rio", "Rio", "Рио", undefined, true, "Мягкое заводское лакокрасочное покрытие: быстро появляются сколы на капоте и переднем бампере, царапины на дверях."),
      m("ceed", "Ceed", "Сид", undefined, true),
      m("cerato", "Cerato", "Церато", undefined, true),
      m("k5", "K5", "К5", "business", true),
      m("optima", "Optima", "Оптима", "business"),
      m("sportage", "Sportage", "Спортейдж", undefined, true, "Крупный передний бампер и кромки арок первыми собирают сколы и парковочные повреждения."),
      m("sorento", "Sorento", "Соренто", "business", true),
      m("seltos", "Seltos", "Селтос"),
      m("soul", "Soul", "Соул"),
      m("picanto", "Picanto", "Пиканто", "econom"),
    ],
  },
  {
    slug: "hyundai", name: "Hyundai", ru: "Хендай", cls: "comfort", top: true,
    models: [
      m("solaris", "Solaris", "Солярис", undefined, true, "Тонкий ЛКП: сколы на капоте и бампере, царапины на дверях. Пластиковые бамперы легко трескаются в зоне креплений."),
      m("creta", "Creta", "Крета", undefined, true, "Типичные повреждения — передний бампер, пороги и задние двери (повреждения от гравия и парковок)."),
      m("elantra", "Elantra", "Элантра", undefined, true),
      m("sonata", "Sonata", "Соната", "business", true),
      m("tucson", "Tucson", "Туссан", undefined, true),
      m("santa-fe", "Santa Fe", "Санта Фе", "business", true),
      m("i30", "i30", "ай30"),
      m("palisade", "Palisade", "Палисад", "business"),
    ],
  },
  {
    slug: "toyota", name: "Toyota", ru: "Тойота", cls: "business", top: true,
    models: [
      m("camry", "Camry", "Камри", undefined, true, "Большие плоские панели (капот, крыша, двери) требуют идеальной подготовки — любые неровности видны в отражении. Чаще всего страдают капот и передний бампер — от сколов."),
      m("corolla", "Corolla", "Королла", "comfort", true),
      m("rav4", "RAV4", "РАВ4", undefined, true),
      m("land-cruiser-prado", "Land Cruiser Prado", "Ленд Крузер Прадо", "premium", true),
      m("land-cruiser-200", "Land Cruiser 200", "Ленд Крузер 200", "lux", true),
      m("land-cruiser-300", "Land Cruiser 300", "Ленд Крузер 300", "lux", true),
      m("highlander", "Highlander", "Хайлендер", "premium"),
      m("c-hr", "C-HR", "Си-Эйч-Ар", "comfort"),
    ],
  },
  {
    slug: "volkswagen", name: "Volkswagen", ru: "Фольксваген", cls: "comfort", top: true,
    models: [
      m("polo", "Polo", "Поло", undefined, true, "Типичные повреждения — бамперы, пороги и двери после парковок; на возрастных машинах — ржавчина по кромкам."),
      m("jetta", "Jetta", "Джетта", undefined, true),
      m("passat", "Passat", "Пассат", "business", true),
      m("tiguan", "Tiguan", "Тигуан", "business", true),
      m("touareg", "Touareg", "Туарег", "premium", true),
      m("golf", "Golf", "Гольф"),
      m("taos", "Taos", "Таос"),
    ],
  },
  {
    slug: "skoda", name: "Skoda", ru: "Шкода", cls: "comfort", top: true,
    models: [
      m("rapid", "Rapid", "Рапид", undefined, true),
      m("octavia", "Octavia", "Октавия", undefined, true, "Плоские борта и выраженные рёбра на дверях: вмятины на рёбрах сложнее, но часто убираются без покраски (PDR)."),
      m("superb", "Superb", "Суперб", "business", true),
      m("kodiaq", "Kodiaq", "Кодиак", "business", true),
      m("karoq", "Karoq", "Карок"),
      m("fabia", "Fabia", "Фабия", "econom"),
    ],
  },
  {
    slug: "renault", name: "Renault", ru: "Рено", cls: "econom", top: true,
    models: [
      m("logan", "Logan", "Логан", undefined, true, "Типичные места коррозии — крышка багажника под накладкой номера, задние арки, пороги."),
      m("sandero", "Sandero", "Сандеро", undefined, true),
      m("duster", "Duster", "Дастер", undefined, true, "Пороги, арки и низ дверей страдают от гравия и реагентов; передний бампер часто страдает на парковках."),
      m("kaptur", "Kaptur", "Каптур", "comfort", true),
      m("arkana", "Arkana", "Аркана", "comfort", true),
      m("megane", "Megane", "Меган"),
      m("fluence", "Fluence", "Флюенс"),
    ],
  },
  {
    slug: "nissan", name: "Nissan", ru: "Ниссан", cls: "comfort",
    models: [
      m("almera", "Almera", "Альмера", "econom", true),
      m("qashqai", "Qashqai", "Кашкай", undefined, true),
      m("x-trail", "X-Trail", "Икс-Трейл", "business", true),
      m("terrano", "Terrano", "Террано", "econom"),
      m("juke", "Juke", "Жук"),
      m("teana", "Teana", "Теана", "business"),
      m("murano", "Murano", "Мурано", "business"),
    ],
  },
  {
    slug: "haval", name: "Haval", ru: "Хавейл", cls: "comfort", top: true,
    models: [
      m("jolion", "Jolion", "Джолион", undefined, true, "Типичные повреждения — сколы, парковочные царапины на бамперах и дверях, локальная покраска."),
      m("f7", "F7", "Ф7", undefined, true),
      m("f7x", "F7x", "Ф7х"),
      m("h6", "H6", "Н6"),
      m("dargo", "Dargo", "Дарго", undefined, true),
      m("m6", "M6", "М6"),
      m("h9", "H9", "Н9", "business"),
    ],
  },
  {
    slug: "chery", name: "Chery", ru: "Чери", cls: "comfort", top: true,
    models: [
      m("tiggo-4-pro", "Tiggo 4 Pro", "Тигго 4 Про", "econom", true),
      m("tiggo-7-pro", "Tiggo 7 Pro", "Тигго 7 Про", undefined, true),
      m("tiggo-8-pro", "Tiggo 8 Pro", "Тигго 8 Про", "business", true),
      m("tiggo-9", "Tiggo 9", "Тигго 9", "business"),
      m("arrizo-8", "Arrizo 8", "Арризо 8"),
    ],
  },
  {
    slug: "geely", name: "Geely", ru: "Джили", cls: "comfort", top: true,
    models: [
      m("coolray", "Coolray", "Кулрей", undefined, true),
      m("monjaro", "Monjaro", "Монжаро", "business", true),
      m("atlas", "Atlas", "Атлас", undefined, true),
      m("tugella", "Tugella", "Тугелла", "business"),
      m("emgrand", "Emgrand", "Эмгранд", "econom"),
      m("okavango", "Okavango", "Окаванго"),
    ],
  },
  {
    slug: "changan", name: "Changan", ru: "Чанган", cls: "comfort",
    models: [
      m("cs35-plus", "CS35 Plus", "ЦС35 Плюс", "econom", true),
      m("cs55-plus", "CS55 Plus", "ЦС55 Плюс", undefined, true),
      m("uni-k", "UNI-K", "Юни-К", "business"),
      m("uni-v", "UNI-V", "Юни-В"),
      m("alsvin", "Alsvin", "Алсвин", "econom"),
      m("eado-plus", "Eado Plus", "Эадо Плюс"),
    ],
  },
  {
    slug: "omoda", name: "Omoda", ru: "Омода", cls: "comfort",
    models: [m("c5", "C5", "С5", undefined, true), m("s5", "S5", "С5 седан")],
  },
  {
    slug: "tenet", name: "Tenet", ru: "Тенет", cls: "comfort",
    models: [m("t4", "T4", "Т4", "econom", true), m("t7", "T7", "Т7", undefined, true), m("t8", "T8", "Т8", "business")],
  },
  {
    slug: "exeed", name: "Exeed", ru: "Эксид", cls: "business",
    models: [m("txl", "TXL", "ТХЛ"), m("lx", "LX", "ЛХ", undefined, true), m("rx", "RX", "РХ"), m("vx", "VX", "ВХ", "premium")],
  },
  {
    slug: "tank", name: "Tank", ru: "Танк", cls: "premium",
    models: [m("300", "300", "300", undefined, true), m("500", "500", "500", "lux"), m("400", "400", "400")],
  },
  {
    slug: "jetour", name: "Jetour", ru: "Джетур", cls: "comfort",
    models: [m("dashing", "Dashing", "Дашинг"), m("x70", "X70", "Х70"), m("x90", "X90", "Х90", "business"), m("t2", "T2", "Т2", "business")],
  },
  {
    slug: "belgee", name: "Belgee", ru: "Белджи", cls: "comfort",
    models: [m("x50", "X50", "Х50"), m("x70", "X70", "Х70")],
  },
  {
    slug: "solaris", name: "Solaris", ru: "Солярис (бренд)", cls: "comfort",
    models: [m("hs", "HS", "ХС"), m("krs", "KRS", "КРС"), m("krx", "KRX", "КРХ")],
  },
  {
    slug: "moskvich", name: "Москвич", ru: "Москвич", cls: "econom",
    models: [m("3", "3", "3"), m("6", "6", "6")],
  },
  {
    slug: "mitsubishi", name: "Mitsubishi", ru: "Мицубиси", cls: "comfort",
    models: [
      m("lancer", "Lancer", "Лансер", undefined, true),
      m("outlander", "Outlander", "Аутлендер", "business", true),
      m("asx", "ASX", "АСХ"),
      m("pajero-sport", "Pajero Sport", "Паджеро Спорт", "business"),
      m("l200", "L200", "Л200", "business"),
    ],
  },
  {
    slug: "mazda", name: "Mazda", ru: "Мазда", cls: "comfort",
    models: [
      m("3", "3", "3", undefined, true),
      m("6", "6", "6", "business", true),
      m("cx-5", "CX-5", "СХ-5", "business", true),
      m("cx-9", "CX-9", "СХ-9", "premium"),
    ],
  },
  {
    slug: "ford", name: "Ford", ru: "Форд", cls: "comfort",
    models: [m("focus", "Focus", "Фокус", undefined, true), m("mondeo", "Mondeo", "Мондео", "business"), m("kuga", "Kuga", "Куга"), m("fiesta", "Fiesta", "Фиеста", "econom"), m("transit", "Transit", "Транзит", "business")],
  },
  {
    slug: "chevrolet", name: "Chevrolet", ru: "Шевроле", cls: "econom",
    models: [m("cruze", "Cruze", "Круз", "comfort", true), m("niva", "Niva", "Нива", undefined, true), m("lacetti", "Lacetti", "Лачетти"), m("cobalt", "Cobalt", "Кобальт"), m("aveo", "Aveo", "Авео")],
  },
  {
    slug: "daewoo", name: "Daewoo", ru: "Дэу", cls: "econom",
    models: [m("nexia", "Nexia", "Нексия", undefined, true), m("matiz", "Matiz", "Матиз"), m("gentra", "Gentra", "Джентра")],
  },
  {
    slug: "honda", name: "Honda", ru: "Хонда", cls: "comfort",
    models: [m("cr-v", "CR-V", "СР-В", "business", true), m("civic", "Civic", "Цивик"), m("accord", "Accord", "Аккорд", "business")],
  },
  {
    slug: "subaru", name: "Subaru", ru: "Субару", cls: "business",
    models: [m("forester", "Forester", "Форестер", undefined, true), m("outback", "Outback", "Аутбек"), m("xv", "XV", "ХВ", "comfort")],
  },
  {
    slug: "mercedes-benz", name: "Mercedes-Benz", ru: "Мерседес", cls: "premium", top: true,
    models: [
      m("c-class", "C-Класс", "Ц класс", undefined, true),
      m("e-class", "E-Класс", "Е класс", undefined, true),
      m("s-class", "S-Класс", "S класс", "lux", true),
      m("glc", "GLC", "ГЛЦ", undefined, true),
      m("gle", "GLE", "ГЛЕ", "lux", true),
      m("gls", "GLS", "ГЛС", "lux"),
      m("g-class", "G-Класс", "Гелендваген", "lux", true),
      m("a-class", "A-Класс", "А класс"),
    ],
  },
  {
    slug: "bmw", name: "BMW", ru: "БМВ", cls: "premium", top: true,
    models: [
      m("3-series", "3 серии", "3 серии", undefined, true),
      m("5-series", "5 серии", "5 серии", undefined, true),
      m("7-series", "7 серии", "7 серии", "lux"),
      m("x3", "X3", "Х3", undefined, true),
      m("x5", "X5", "Х5", "lux", true),
      m("x6", "X6", "Х6", "lux", true),
      m("x7", "X7", "Х7", "lux"),
    ],
  },
  {
    slug: "audi", name: "Audi", ru: "Ауди", cls: "premium",
    models: [m("a4", "A4", "А4", undefined, true), m("a6", "A6", "А6", undefined, true), m("q5", "Q5", "Ку5", undefined, true), m("q7", "Q7", "Ку7", "lux", true), m("a8", "A8", "А8", "lux"), m("q3", "Q3", "Ку3")],
  },
  {
    slug: "lexus", name: "Lexus", ru: "Лексус", cls: "premium",
    models: [m("rx", "RX", "РХ", undefined, true), m("nx", "NX", "НХ", undefined, true), m("es", "ES", "ЕС", undefined, true), m("lx", "LX", "ЛХ", "lux", true), m("gx", "GX", "ГХ", "lux")],
  },
  {
    slug: "volvo", name: "Volvo", ru: "Вольво", cls: "premium",
    models: [m("xc60", "XC60", "ХС60", undefined, true), m("xc90", "XC90", "ХС90", undefined, true), m("s60", "S60", "С60"), m("xc40", "XC40", "ХС40", "business")],
  },
  {
    slug: "infiniti", name: "Infiniti", ru: "Инфинити", cls: "premium",
    models: [m("qx50", "QX50", "КуХ50"), m("qx60", "QX60", "КуХ60"), m("qx80", "QX80", "КуХ80", "lux")],
  },
  {
    slug: "land-rover", name: "Land Rover", ru: "Ленд Ровер", cls: "lux",
    models: [m("range-rover", "Range Rover", "Рендж Ровер", undefined, true), m("range-rover-sport", "Range Rover Sport", "Рендж Ровер Спорт", undefined, true), m("evoque", "Range Rover Evoque", "Эвок", "premium"), m("discovery", "Discovery", "Дискавери"), m("defender", "Defender", "Дефендер")],
  },
  {
    slug: "porsche", name: "Porsche", ru: "Порше", cls: "lux",
    models: [m("cayenne", "Cayenne", "Кайен", undefined, true), m("macan", "Macan", "Макан"), m("panamera", "Panamera", "Панамера"), m("911", "911", "911")],
  },
  {
    slug: "li-auto", name: "Li Auto (Lixiang)", ru: "Лисян", cls: "premium",
    models: [m("l7", "L7", "Л7"), m("l9", "L9", "Л9", "lux", true), m("l6", "L6", "Л6")],
  },
  {
    slug: "zeekr", name: "Zeekr", ru: "Зикр", cls: "premium",
    models: [m("001", "001", "001"), m("7x", "7X", "7Х"), m("9x", "9X", "9Х", "lux")],
  },
  {
    slug: "hongqi", name: "Hongqi", ru: "Хончи", cls: "premium",
    models: [m("h5", "H5", "Н5", "business"), m("hs5", "HS5", "НС5"), m("e-hs9", "E-HS9", "Е-НС9", "lux")],
  },
  {
    slug: "voyah", name: "Voyah", ru: "Воя", cls: "premium",
    models: [m("free", "Free", "Фри"), m("dream", "Dream", "Дрим", "lux")],
  },
  {
    slug: "tesla", name: "Tesla", ru: "Тесла", cls: "premium",
    models: [m("model-3", "Model 3", "Модел 3"), m("model-y", "Model Y", "Модел Y")],
  },
  {
    slug: "uaz", name: "УАЗ", ru: "УАЗ", cls: "comfort",
    models: [m("patriot", "Патриот", "Патриот", undefined, true, "Пороги, арки, днище и нижние кромки дверей требуют регулярной антикоррозийной защиты."), m("hunter", "Хантер", "Хантер"), m("bukhanka", "Буханка (СГР)", "Буханка")],
  },
  {
    slug: "gaz", name: "ГАЗ", ru: "Газель", cls: "business",
    models: [m("gazelle-next", "Газель Next", "Газель Некст"), m("gazelle-business", "Газель Бизнес", "Газель Бизнес"), m("sobol", "Соболь", "Соболь")],
  },
  {
    slug: "peugeot", name: "Peugeot", ru: "Пежо", cls: "comfort",
    models: [m("408", "408", "408"), m("3008", "3008", "3008"), m("partner", "Partner", "Партнер")],
  },
  {
    slug: "citroen", name: "Citroen", ru: "Ситроен", cls: "comfort",
    models: [m("c4", "C4", "С4"), m("c5-aircross", "C5 Aircross", "С5 Аиркросс"), m("berlingo", "Berlingo", "Берлинго")],
  },
  {
    slug: "opel", name: "Opel", ru: "Опель", cls: "comfort",
    models: [m("astra", "Astra", "Астра"), m("insignia", "Insignia", "Инсигния", "business"), m("zafira", "Zafira", "Зафира")],
  },
  {
    slug: "datsun", name: "Datsun", ru: "Датсун", cls: "econom",
    models: [m("on-do", "on-DO", "Он-до"), m("mi-do", "mi-DO", "Ми-до")],
  },
];

export const BRAND_BY_SLUG: Record<string, Brand> = Object.fromEntries(BRANDS.map((b) => [b.slug, b]));

export const modelClass = (b: Brand, md: Model): ClassId => md.cls ?? b.cls;

export const POPULAR_MODELS = BRANDS.flatMap((b) => b.models.filter((md) => md.pop).map((md) => ({ brand: b, model: md })));

export const carTitle = (b: Brand, md?: Model) => (md ? `${b.name} ${md.name}` : b.name);
