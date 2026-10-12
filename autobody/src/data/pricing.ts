// Ценовая модель калькулятора.
// Все базовые цены указаны для класса «Эконом» в рублях и умножаются
// на коэффициент класса автомобиля. Меняйте цифры здесь — они автоматически
// обновятся в калькуляторе, прайс-листе, на страницах услуг и моделей.

export type ClassId = "econom" | "comfort" | "business" | "premium" | "lux";

export const CAR_CLASSES: Record<
  ClassId,
  { label: string; k: number; hint: string; examples: string }
> = {
  econom: {
    label: "Эконом",
    k: 1,
    hint: "Небольшие и бюджетные авто",
    examples: "Lada, Renault Logan, Datsun, Chery Tiggo 4",
  },
  comfort: {
    label: "Комфорт",
    k: 1.15,
    hint: "Популярные иномарки и кроссоверы",
    examples: "Kia Rio, Hyundai Solaris, VW Polo, Haval Jolion",
  },
  business: {
    label: "Бизнес",
    k: 1.35,
    hint: "Крупные седаны и кроссоверы",
    examples: "Toyota Camry, Skoda Kodiaq, Geely Monjaro",
  },
  premium: {
    label: "Премиум",
    k: 1.7,
    hint: "Премиальные марки",
    examples: "BMW, Mercedes-Benz, Audi, Lexus",
  },
  lux: {
    label: "Люкс / большой SUV",
    k: 2.2,
    hint: "Представительские и полноразмерные",
    examples: "Land Cruiser 300, Range Rover, Mercedes S, Porsche",
  },
};

export const CLASS_ORDER: ClassId[] = ["econom", "comfort", "business", "premium", "lux"];

export type Material = "metal" | "plastic" | "wheel" | "light";

export type Part = {
  id: string;
  name: string; // полное название в заказ-наряде
  label: string; // подпись на схеме
  material: Material;
  paint: number; // покраска элемента целиком
  replace: number; // снятие/установка или вварка
  welded?: boolean; // меняется только с вваркой
};

const side = (s: "l" | "r") => (s === "l" ? "левая" : "правая");
const sideM = (s: "l" | "r") => (s === "l" ? "левое" : "правое");
const sideP = (s: "l" | "r") => (s === "l" ? "левый" : "правый");

export const PARTS: Part[] = [
  { id: "bumper_f", name: "Передний бампер", label: "Бампер передний", material: "plastic", paint: 8500, replace: 2000 },
  { id: "hood", name: "Капот", label: "Капот", material: "metal", paint: 10500, replace: 1500 },
  { id: "roof", name: "Крыша", label: "Крыша", material: "metal", paint: 12000, replace: 28000, welded: true },
  { id: "trunk", name: "Крышка (дверь) багажника", label: "Багажник", material: "metal", paint: 9500, replace: 1800 },
  { id: "bumper_r", name: "Задний бампер", label: "Бампер задний", material: "plastic", paint: 8500, replace: 2000 },
  ...(["l", "r"] as const).flatMap((s): Part[] => [
    { id: `fender_f${s}`, name: `Переднее ${sideM(s)} крыло`, label: "Пер. крыло", material: "metal", paint: 7500, replace: 2500 },
    { id: `door_f${s}`, name: `Передняя ${side(s)} дверь`, label: "Пер. дверь", material: "metal", paint: 8500, replace: 3000 },
    { id: `door_r${s}`, name: `Задняя ${side(s)} дверь`, label: "Зад. дверь", material: "metal", paint: 8500, replace: 3000 },
    { id: `quarter_${s}`, name: `Заднее ${sideM(s)} крыло`, label: "Зад. крыло", material: "metal", paint: 9500, replace: 18000, welded: true },
    { id: `sill_${s}`, name: `Порог ${sideP(s)}`, label: "Порог", material: "metal", paint: 5500, replace: 9000, welded: true },
    { id: `mirror_${s}`, name: `Корпус зеркала ${sideP(s)}`, label: "Зеркало", material: "plastic", paint: 3000, replace: 800 },
    { id: `head_${s}`, name: `Фара ${s === "l" ? "левая" : "правая"}`, label: "Фара", material: "light", paint: 0, replace: 0 },
  ]),
  ...(["fl", "fr", "rl", "rr"] as const).map(
    (w): Part => ({
      id: `wheel_${w}`,
      name: `Диск ${w[0] === "f" ? "передний" : "задний"} ${w[1] === "l" ? "левый" : "правый"}`,
      label: "Диск",
      material: "wheel",
      paint: 0,
      replace: 0,
    }),
  ),
];

export const PART_BY_ID: Record<string, Part> = Object.fromEntries(PARTS.map((p) => [p.id, p]));

// Окрашиваемые элементы кузова (для пакета «полная покраска»)
export const BODY_PART_IDS = PARTS.filter((p) => p.material === "metal" || p.material === "plastic").map(
  (p) => p.id,
);

export type Size = "s" | "m" | "l";
export const SIZES: { id: Size; label: string; hint: string }[] = [
  { id: "s", label: "Маленькое", hint: "с монету, до 5 см" },
  { id: "m", label: "Среднее", hint: "с ладонь, до 20 см" },
  { id: "l", label: "Большое", hint: "больше ладони" },
];

export type DamageId =
  | "scratch"
  | "deep"
  | "dent"
  | "dentPaint"
  | "rust"
  | "crack"
  | "replace"
  | "paint"
  | "curb"
  | "wheelPaint"
  | "dull"
  | "film";

export type Damage = {
  id: DamageId;
  title: string; // как говорит клиент
  hint: string; // как определить самому
  color: string;
  for: Material[];
  sized: boolean;
};

export const DAMAGES: Damage[] = [
  { id: "scratch", title: "Царапина по лаку", hint: "Ноготь не цепляется, металл и грунт не видно", color: "#facc15", for: ["metal", "plastic"], sized: true },
  { id: "deep", title: "Глубокая царапина или скол", hint: "Ноготь цепляется, видно грунт, металл или пластик", color: "#fb923c", for: ["metal", "plastic"], sized: true },
  { id: "dent", title: "Вмятина, краска целая", hint: "Металл вдавлен, но краска не треснула", color: "#38bdf8", for: ["metal"], sized: true },
  { id: "dentPaint", title: "Вмятина с повреждённой краской", hint: "Вмятина + царапины, трещины или сколы краски", color: "#a78bfa", for: ["metal"], sized: true },
  { id: "rust", title: "Ржавчина, вздулась краска", hint: "Рыжие точки, пузыри под краской, сквозная дыра", color: "#d97706", for: ["metal"], sized: true },
  { id: "crack", title: "Трещина, разрыв, сломаны крепления", hint: "Пластик лопнул, порвался или висит", color: "#f472b6", for: ["plastic"], sized: true },
  { id: "replace", title: "Сильно разбит — нужна замена", hint: "Ремонтировать нет смысла, ставим новую деталь", color: "#ef4444", for: ["metal", "plastic"], sized: false },
  { id: "paint", title: "Просто покрасить", hint: "Выгорел, «рыжики», другой оттенок, обновить вид", color: "#34d399", for: ["metal", "plastic"], sized: false },
  { id: "curb", title: "Задел бордюр, царапины на диске", hint: "Восстановление кромки + покраска", color: "#fb923c", for: ["wheel"], sized: false },
  { id: "wheelPaint", title: "Покрасить в другой цвет", hint: "Чёрный, графит, бронза — любой цвет", color: "#34d399", for: ["wheel"], sized: false },
  { id: "dull", title: "Помутнела, пожелтела", hint: "Свет стал тусклым, пластик мутный", color: "#facc15", for: ["light"], sized: false },
  { id: "film", title: "Защитить плёнкой", hint: "Полиуретановая плёнка от сколов и мутнения", color: "#38bdf8", for: ["light"], sized: false },
];

export const DAMAGE_BY_ID = Object.fromEntries(DAMAGES.map((d) => [d.id, d])) as Record<DamageId, Damage>;

export type PaintType = "solid" | "metallic" | "pearl" | "matte";
export const PAINT_TYPES: { id: PaintType; label: string; hint: string; k: number }[] = [
  { id: "solid", label: "Обычный", hint: "Без блёсток: белый, красный, жёлтый «неметаллик»", k: 1 },
  { id: "metallic", label: "Металлик", hint: "С блёстками — так окрашено большинство авто", k: 1.1 },
  { id: "pearl", label: "Перламутр", hint: "Трёхслойный, «переливается» на солнце", k: 1.3 },
  { id: "matte", label: "Матовый", hint: "Без блеска, требует особой технологии", k: 1.45 },
];

export type Line = { title: string; price: number; kind: "work" | "paint" };

export type Option = {
  id: string;
  title: string; // название работы
  note: string; // пояснение для клиента
  lines: (part: Part, size: Size) => Line[];
};

const SZ: Record<Size, number> = { s: 0, m: 1, l: 2 };
const bySize = (size: Size, a: [number, number, number]) => a[SZ[size]];
const paintLine = (p: Part): Line => ({ title: "Покраска элемента (подготовка, грунт, колеровка, лак)", price: p.paint, kind: "paint" });

// Для каждого повреждения — рекомендуемый ремонт (первый) и альтернативы
export const REPAIRS: Record<DamageId, Option[]> = {
  scratch: [
    {
      id: "polish",
      title: "Абразивная полировка",
      note: "Убираем царапину без покраски — сохраняем заводское покрытие",
      lines: (p, s) => [{ title: "Абразивная полировка зоны повреждения", price: Math.max(1500, Math.round(p.paint * bySize(s, [0.18, 0.28, 0.4]))), kind: "work" }],
    },
    {
      id: "local",
      title: "Локальная покраска",
      note: "Если полировка не уберёт царапину полностью",
      lines: (p, s) => [{ title: "Локальная покраска с переходом", price: Math.round(p.paint * bySize(s, [0.55, 0.7, 0.85])), kind: "paint" }],
    },
  ],
  deep: [
    {
      id: "local",
      title: "Локальная покраска",
      note: "Красим только повреждённую зону с плавным переходом — дешевле, чем весь элемент",
      lines: (p, s) =>
        s === "l"
          ? [{ title: "Подготовка повреждения, шпатлёвка", price: 1500, kind: "work" }, paintLine(p)]
          : [{ title: "Локальная покраска с переходом", price: Math.round(p.paint * (s === "s" ? 0.55 : 0.75)), kind: "paint" }],
    },
    {
      id: "full",
      title: "Покраска элемента целиком",
      note: "Идеальный результат, если повреждений несколько",
      lines: (p, s) => [{ title: "Подготовка повреждения, шпатлёвка", price: bySize(s, [800, 1200, 1500]), kind: "work" }, paintLine(p)],
    },
  ],
  dent: [
    {
      id: "pdr",
      title: "Удаление вмятины без покраски (PDR)",
      note: "Выдавливаем металл специальным инструментом, заводская краска остаётся",
      lines: (_p, s) => [{ title: "Удаление вмятины без покраски (PDR)", price: bySize(s, [2000, 4500, 8000]), kind: "work" }],
    },
    {
      id: "straight",
      title: "Рихтовка и покраска",
      note: "Если вмятина на ребре жёсткости или металл растянут",
      lines: (p, s) => [{ title: "Рихтовка (выравнивание металла)", price: bySize(s, [1500, 3500, 6500]), kind: "work" }, paintLine(p)],
    },
  ],
  dentPaint: [
    {
      id: "straight",
      title: "Рихтовка и покраска элемента",
      note: "Выравниваем металл, шпатлюем и красим в цвет кузова",
      lines: (p, s) => [{ title: "Рихтовка (выравнивание металла)", price: bySize(s, [1500, 3500, 6500]), kind: "work" }, paintLine(p)],
    },
  ],
  rust: [
    {
      id: "rust",
      title: "Удаление коррозии и покраска",
      note: "Зачищаем до чистого металла, обрабатываем преобразователем и антикором, красим",
      lines: (p, s) => [
        { title: "Удаление коррозии, антикоррозийный грунт", price: bySize(s, [2500, 5000, 9000]), kind: "work" },
        paintLine(p),
      ],
    },
    {
      id: "patch",
      title: "Вварка ремонтной вставки и покраска",
      note: "Если металл прогнил насквозь",
      lines: (p, s) => [
        { title: "Вырезка гнили, вварка ремонтной вставки", price: bySize(s, [4500, 7500, 12000]), kind: "work" },
        paintLine(p),
      ],
    },
  ],
  crack: [
    {
      id: "plastic",
      title: "Ремонт пластика и покраска",
      note: "Паяем пластик с армирующей сеткой, восстанавливаем крепления и красим",
      lines: (p, s) => [{ title: "Ремонт пластика (пайка, армирование)", price: bySize(s, [2000, 3500, 6000]), kind: "work" }, paintLine(p)],
    },
    {
      id: "replace",
      title: "Замена и покраска новой детали",
      note: "Когда ремонт дороже новой детали",
      lines: (p) => [{ title: "Снятие / установка элемента", price: p.replace, kind: "work" }, paintLine(p)],
    },
  ],
  replace: [
    {
      id: "replace",
      title: "Замена элемента и покраска",
      note: "Деталь можете привезти свою или мы подберём и закажем",
      lines: (p) => [
        { title: p.welded ? "Замена элемента с вваркой" : "Снятие / установка элемента", price: p.replace, kind: "work" },
        paintLine(p),
      ],
    },
  ],
  paint: [
    {
      id: "full",
      title: "Покраска элемента",
      note: "Подготовка, компьютерный подбор цвета, покраска в камере, лак",
      lines: (p) => [paintLine(p)],
    },
  ],
  curb: [
    {
      id: "wheelRepair",
      title: "Восстановление и покраска диска",
      note: "Заделываем кромку, грунтуем и красим",
      lines: () => [{ title: "Восстановление кромки и покраска диска", price: 4500, kind: "paint" }],
    },
  ],
  wheelPaint: [
    {
      id: "wheelPaint",
      title: "Покраска диска",
      note: "Снятие шины, пескоструй, грунт, покраска, лак",
      lines: () => [{ title: "Покраска диска (с шиномонтажом)", price: 4000, kind: "paint" }],
    },
  ],
  dull: [
    {
      id: "headPolish",
      title: "Полировка фары",
      note: "Возвращаем прозрачность, свет снова яркий",
      lines: () => [{ title: "Восстановительная полировка фары", price: 1500, kind: "work" }],
    },
    {
      id: "headPolishFilm",
      title: "Полировка + защитная плёнка",
      note: "Чтобы фара больше не мутнела",
      lines: () => [
        { title: "Восстановительная полировка фары", price: 1500, kind: "work" },
        { title: "Защитная полиуретановая плёнка на фару", price: 2500, kind: "work" },
      ],
    },
  ],
  film: [
    {
      id: "headFilm",
      title: "Защитная плёнка на фару",
      note: "Полиуретан, защищает от сколов и мутнения",
      lines: () => [{ title: "Защитная полиуретановая плёнка на фару", price: 2500, kind: "work" }],
    },
  ],
};

export type Extra = {
  id: string;
  title: string;
  note: string;
  base: number; // для класса «Эконом»; 0 — бесплатно
  scaled: boolean;
};

export const EXTRAS: Extra[] = [
  { id: "polishFull", title: "Восстановительная полировка всего кузова", note: "Новый лак не будет отличаться по блеску от остального кузова", base: 9000, scaled: true },
  { id: "ceramic", title: "Керамическое покрытие кузова", note: "Глубокий блеск и защита ЛКП на 2–3 года", base: 18000, scaled: true },
  { id: "ppf", title: "Антигравийная плёнка на зону риска", note: "Капот, бампер, фары, передние крылья — защита от сколов", base: 32000, scaled: true },
  { id: "anticor", title: "Антикоррозийная обработка днища и арок", note: "Защита от реагентов и ржавчины", base: 9000, scaled: true },
  { id: "wheels", title: "Покраска дисков, 4 шт.", note: "Любой цвет, с шиномонтажом", base: 14000, scaled: false },
  { id: "calipers", title: "Покраска суппортов, 4 шт.", note: "Термостойкая краска, любой цвет", base: 8000, scaled: false },
  { id: "headlights", title: "Полировка фар, 2 шт.", note: "Свет снова яркий, вид — как у нового авто", base: 2500, scaled: false },
  { id: "wash", title: "Детейлинг-мойка при выдаче", note: "Ручная мойка и сушка кузова", base: 2500, scaled: true },
];

export const EXTRA_BY_ID = Object.fromEntries(EXTRAS.map((e) => [e.id, e]));

// Скидка за объём: число окрашиваемых элементов → процент
// TODO: подтвердить у заказчика
export const VOLUME_DISCOUNTS: [number, number][] = [
  [10, 15],
  [6, 10],
  [3, 5],
];

export const round100 = (n: number) => Math.round(n / 100) * 100;

export type Selection = { partId: string; damage: DamageId; size: Size; option: string };

export type Estimate = {
  rows: { part: Part; damage: Damage; option: Option; size: Size; lines: Line[]; total: number }[];
  extras: { extra: Extra; price: number }[];
  subtotal: number;
  paintedCount: number;
  discountPct: number;
  discount: number;
  total: number;
  min: number;
  max: number;
  hours: [number, number];
};

export function priceForClass(base: number, cls: ClassId) {
  return round100(base * CAR_CLASSES[cls].k);
}

export function estimate(
  sel: Selection[],
  cls: ClassId,
  paint: PaintType,
  extras: string[],
): Estimate {
  const k = CAR_CLASSES[cls].k;
  const pk = PAINT_TYPES.find((p) => p.id === paint)!.k;
  let painted = 0;
  const rows = sel.map((s) => {
    const part = PART_BY_ID[s.partId];
    const damage = DAMAGE_BY_ID[s.damage];
    const opts = REPAIRS[s.damage];
    const option = opts.find((o) => o.id === s.option) ?? opts[0];
    const lines = option.lines(part, s.size).map((l) => ({
      ...l,
      price: round100(l.price * (part.material === "wheel" || part.material === "light" ? 1 : k) * (l.kind === "paint" ? pk : 1)),
    }));
    if (lines.some((l) => l.kind === "paint") && part.material !== "wheel") painted++;
    return { part, damage, option, size: s.size, lines, total: lines.reduce((a, l) => a + l.price, 0) };
  });
  const ex = extras
    .map((id) => EXTRA_BY_ID[id])
    .filter(Boolean)
    .map((extra) => ({ extra, price: extra.scaled ? round100(extra.base * k) : extra.base }));
  const worksSum = rows.reduce((a, r) => a + r.total, 0);
  const subtotal = worksSum + ex.reduce((a, e) => a + e.price, 0);
  const discountPct = VOLUME_DISCOUNTS.find(([n]) => painted >= n)?.[1] ?? 0;
  const discount = round100((worksSum * discountPct) / 100);
  const total = subtotal - discount;
  const days = Math.max(1, Math.ceil(painted / 3) + (rows.some((r) => r.damage.id === "rust" || r.damage.id === "replace") ? 1 : 0));
  return {
    rows,
    extras: ex,
    subtotal,
    paintedCount: painted,
    discountPct,
    discount,
    total,
    min: round100(total * 0.9),
    max: round100(total * 1.15),
    hours: [days, days + 1],
  };
}

export const num = (n: number) => String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, "\u00a0");
export const fmt = (n: number) => num(n) + "\u00a0₽";

// Цена «от» для услуги на конкретном классе
export const fromPrice = (base: number, cls: ClassId = "econom") => priceForClass(base, cls);
