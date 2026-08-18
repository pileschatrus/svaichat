import { NAV } from "../data";
import { ArrowUpRight, MailIcon, MaxIcon, PhoneIcon, VkIcon } from "../icons";
import { useLead } from "../LeadModal";

const CATALOG = [
  { label: "Винтовые сваи", href: "#prices" },
  { label: "ЖБ сваи", href: "#prices" },
  { label: "Оголовки и обвязка", href: "#prices" },
  { label: "Спецтехника в аренду", href: "#prices" },
  { label: "Калькулятор фундамента", href: "#calculator" },
];

export default function Footer() {
  const { openLead } = useLead();

  return (
    <footer className="relative border-t border-ink-800 bg-ink-950">
      <div className="hazard h-1.5 w-full opacity-70" />
      <div className="mx-auto max-w-7xl px-5 pb-10 pt-14 sm:px-8 sm:pt-16">
        <div className="grid gap-12 lg:grid-cols-[1.25fr_0.75fr_0.85fr_1.15fr]">
          {/* brand */}
          <div>
            <a href="#/" className="flex items-center gap-3">
              <span className="grid h-11 w-11 place-items-center bg-safety-500 font-display text-2xl font-black leading-none text-ink-950">
                V
              </span>
              <span className="font-display text-lg font-extrabold uppercase tracking-wide text-steel-100">
                Свайчат
              </span>
            </a>
            <p className="mt-5 max-w-xs text-sm leading-relaxed text-steel-500">
              Сообщество строителей свайных фундаментов России. С 2018 года:
              бригады, заводы, техника и честные сметы — в одном чате MAX.
            </p>
            <div className="mt-6 flex gap-2">
              <button
                onClick={() =>
                  openLead({
                    title: "Написать в чат MAX",
                    subtitle: "Сообщение уйдёт модератору сообщества. Ответ — в течение 12 минут.",
                    cta: "Отправить сообщение",
                  })
                }
                aria-label="Чат MAX"
                className="grid h-11 w-11 place-items-center border border-ink-700 text-steel-400 transition-all hover:-translate-y-1 hover:border-safety-500 hover:bg-safety-500 hover:text-ink-950"
              >
                <MaxIcon className="h-5 w-5" />
              </button>
              <a
                href="https://vk.com/svaichat"
                target="_blank"
                rel="noreferrer"
                aria-label="ВКонтакте"
                className="grid h-11 w-11 place-items-center border border-ink-700 text-steel-400 transition-all hover:-translate-y-1 hover:border-safety-500 hover:bg-safety-500 hover:text-ink-950"
              >
                <VkIcon className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* nav */}
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-steel-500">Разделы</p>
            <ul className="mt-5 space-y-3">
              {NAV.map((n) => (
                <li key={n.href}>
                  <a
                    href={n.href}
                    className="group inline-flex items-center gap-2 text-sm text-steel-300 transition-colors hover:text-safety-400"
                  >
                    <span className="h-px w-3 bg-ink-600 transition-all group-hover:w-5 group-hover:bg-safety-500" />
                    {n.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* catalog */}
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-steel-500">Продукция</p>
            <ul className="mt-5 space-y-3">
              {CATALOG.map((n) => (
                <li key={n.label}>
                  <a
                    href={n.href}
                    className="group inline-flex items-center gap-2 text-sm text-steel-300 transition-colors hover:text-safety-400"
                  >
                    <span className="h-px w-3 bg-ink-600 transition-all group-hover:w-5 group-hover:bg-safety-500" />
                    {n.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* contacts */}
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-steel-500">Контакты</p>
            <ul className="mt-5 space-y-4 text-sm">
              <li className="text-steel-400">
                Москва, Алтуфьевское шоссе, 44
                <span className="mt-0.5 block font-mono text-[10px] uppercase tracking-wider text-steel-500">
                  офис сообщества · по записи
                </span>
              </li>
              <li>
                <a href="tel:+79278448000" className="flex items-center gap-3 font-mono font-bold text-steel-200 transition-colors hover:text-safety-400">
                  <PhoneIcon className="h-4 w-4 text-safety-500" /> +7 927 844-80-00
                </a>
              </li>
              <li>
                <a href="tel:+79090000710" className="flex items-center gap-3 font-mono font-bold text-steel-200 transition-colors hover:text-safety-400">
                  <PhoneIcon className="h-4 w-4 text-safety-500" /> +7 909 000-07-10
                </a>
              </li>
              <li>
                <a href="mailto:svaichat@yandex.ru" className="flex items-center gap-3 font-mono text-steel-200 transition-colors hover:text-safety-400">
                  <MailIcon className="h-4 w-4 text-safety-500" /> svaichat@yandex.ru
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col items-start justify-between gap-5 border-t border-ink-800 pt-7 sm:flex-row sm:items-center">
          <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-steel-500">
            © 2018–2026 svaichat.ru · сваи · чат · стройка
          </p>
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="group inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.18em] text-steel-400 transition-colors hover:text-safety-400"
          >
            Наверх
            <ArrowUpRight className="h-4 w-4 -rotate-45 transition-transform group-hover:-translate-y-1" />
          </button>
        </div>
      </div>
    </footer>
  );
}
