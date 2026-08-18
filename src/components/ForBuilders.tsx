import {
  ArrowUpRight,
  CheckIcon,
  FactoryIcon,
  MaxIcon,
  RigIcon,
  RulerIcon,
  WrenchIcon,
} from "../icons";
import { useLead } from "../LeadModal";
import { Reveal } from "../ui";

const STEPS = [
  {
    n: "01",
    title: "Выберите регион",
    text: "Укажите, где крутите сваи или где стоит ваш завод. Попадёте в общий чат и в региональную ветку.",
  },
  {
    n: "02",
    title: "Отправьте заявку через форму",
    text: "Пара слов о себе: техника, объёмы, фото объектов. Модератор — действующий строитель, а не менеджер.",
  },
  {
    n: "03",
    title: "Пройдите проверку",
    text: "Смотрим объекты и отзывы. Так в чате остаются только те, кто реально работает на грунте.",
  },
  {
    n: "04",
    title: "Работайте с сообществом",
    text: "Заказы из вашего региона, оптовые цены заводов, аренда техники у своих и разборы сложных грунтов.",
  },
];

const AUDIENCE = [
  { icon: WrenchIcon, title: "Монтажные бригады", text: "Винтовые и ЖБ сваи, обвязка, ростверки" },
  { icon: FactoryIcon, title: "Заводы свай", text: "Винтовые, ЖБ, оголовки и метизы" },
  { icon: RigIcon, title: "Владельцы техники", text: "УБМ, ямобуры, сваекруты, манипуляторы" },
  { icon: RulerIcon, title: "Проектировщики", text: "Расчёт фундаментов, геология, авторский надзор" },
];

const RULES = [
  "Без спама, рекламы в лоб и политики",
  "Смета = репутация: назвал цену — держи",
  "Споры разбирают модераторы за 24 часа",
];

export default function ForBuilders() {
  const { openLead } = useLead();
  return (
    <section id="builders" className="bg-blueprint relative scroll-mt-20 overflow-hidden bg-ink-900 py-20 sm:py-28">
      <div className="pointer-events-none absolute -right-24 top-10 h-[420px] w-[420px] rounded-full bg-safety-500/[0.06] blur-3xl" />

      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="grid gap-14 lg:grid-cols-[0.92fr_1.08fr] lg:gap-20">
          {/* sticky left */}
          <div className="lg:sticky lg:top-28 lg:self-start">
            <Reveal>
              <p className="flex items-baseline gap-4">
                <span className="font-mono text-xs tracking-[0.25em] text-safety-400">04</span>
                <span className="font-mono text-xs uppercase tracking-[0.25em] text-steel-500">
                  Строителям и заводам
                </span>
              </p>
              <h2 className="mt-5 font-display text-3xl font-extrabold uppercase leading-tight text-steel-100 sm:text-4xl xl:text-[2.7rem]">
                Вступай <br />
                в закрытый <span className="text-safety-400">чат</span>
              </h2>
              <p className="mt-6 max-w-md text-base leading-relaxed text-steel-400">
                Свайчат — не каталог и не биржа. Это рабочие, которые каждый день
                крутят сваи, и заводы, которые их варят. Здесь передают заказы,
                когда своя бригада не успевает, и честно говорят, чья свая
                не докрутилась.
              </p>

              <button
                onClick={() =>
                  openLead({
                    title: "Заявка на вступление в Свайчат",
                    subtitle: "Расскажите пару слов о себе: техника, объёмы, регион. Модератор-строитель свяжется для короткой проверки.",
                    cta: "Подать заявку",
                    comment: "Я строитель / завод: ",
                  })
                }
                className="group mt-9 inline-flex items-center gap-3 bg-safety-500 px-7 py-4 font-display text-xs font-bold uppercase tracking-widest text-ink-950 transition-all hover:-translate-y-0.5 hover:bg-safety-400 hover:shadow-[0_16px_40px_-12px_rgba(37,211,102,0.5)]"
              >
                <MaxIcon className="h-5 w-5 transition-transform group-hover:rotate-6" />
                Подать заявку
                <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </button>

              <div className="mt-10 space-y-2.5 border-t border-ink-700 pt-6">
                {RULES.map((r) => (
                  <p key={r} className="flex items-start gap-3 font-mono text-[11px] uppercase tracking-[0.14em] leading-relaxed text-steel-500">
                    <CheckIcon className="mt-0.5 h-3.5 w-3.5 shrink-0 text-safety-400" />
                    {r}
                  </p>
                ))}
              </div>
            </Reveal>
          </div>

          {/* right */}
          <div className="space-y-12">
            {/* steps */}
            <div>
              {STEPS.map((s, i) => (
                <Reveal key={s.n} delay={i * 80}>
                  <div className="group grid grid-cols-[64px_1fr] gap-5 border-l-2 border-ink-700 py-6 pl-6 transition-all duration-300 hover:border-safety-500 hover:pl-8 sm:grid-cols-[84px_1fr]">
                    <span className="font-display text-2xl font-extrabold text-ink-600 transition-colors group-hover:text-safety-400 sm:text-3xl">
                      {s.n}
                    </span>
                    <div>
                      <h3 className="font-display text-base font-bold uppercase text-steel-100 sm:text-lg">
                        {s.title}
                      </h3>
                      <p className="mt-2 max-w-lg text-sm leading-relaxed text-steel-400">{s.text}</p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>

            {/* audience */}
            <div>
              <Reveal>
                <p className="mb-4 font-mono text-[10px] uppercase tracking-[0.24em] text-steel-500">
                  Кого мы ждём
                </p>
              </Reveal>
              <div className="grid gap-3 sm:grid-cols-2">
                {AUDIENCE.map((a, i) => (
                  <Reveal key={a.title} delay={i * 70}>
                    <div className="group h-full border border-ink-700 bg-ink-850/70 p-5 transition-all duration-300 hover:-translate-y-1 hover:border-safety-500">
                      <a.icon className="h-7 w-7 text-steel-500 transition-colors group-hover:text-safety-400" />
                      <p className="mt-4 font-display text-sm font-bold uppercase text-steel-100">{a.title}</p>
                      <p className="mt-1.5 text-xs leading-relaxed text-steel-500">{a.text}</p>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
