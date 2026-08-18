import { useState } from "react";
import { FAQS } from "../data";
import { MailIcon, MaxIcon, PhoneIcon } from "../icons";
import { useLead } from "../LeadModal";
import { Reveal } from "../ui";

export default function Faq() {
  const [open, setOpen] = useState<number>(0);
  const { openLead } = useLead();

  return (
    <section id="faq" className="bg-blueprint-light relative scroll-mt-20 bg-paper-100 py-20 text-ink-950 sm:py-28">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20">
          {/* sticky intro */}
          <div className="lg:sticky lg:top-28 lg:self-start">
            <Reveal>
              <p className="flex items-baseline gap-4">
                <span className="font-mono text-xs tracking-[0.25em] text-safety-600">07</span>
                <span className="font-mono text-xs uppercase tracking-[0.25em] text-steel-500">FAQ</span>
              </p>
              <h2 className="mt-5 font-display text-2xl font-bold uppercase leading-tight sm:text-3xl xl:text-4xl">
                Спрашивают <br /> чаще всего
              </h2>
              <p className="mt-5 max-w-sm text-sm leading-relaxed text-steel-500">
                Если ответа не хватило — напишите напрямую. Отвечают не операторы
                колл-центра, а модераторы-строители.
              </p>

              <div className="mt-8 space-y-3">
                <a
                  href="tel:+79278448000"
                  className="group flex items-center gap-4 border border-paper-300 bg-paper-50 px-5 py-4 transition-all hover:-translate-y-0.5 hover:border-ink-950"
                >
                  <PhoneIcon className="h-5 w-5 text-safety-600" />
                  <span>
                    <span className="block font-mono text-sm font-bold">+7 927 844-80-00</span>
                    <span className="block text-[11px] text-steel-500">ежедневно 8:00–21:00 МСК</span>
                  </span>
                </a>
                <a
                  href="mailto:svaichat@yandex.ru"
                  className="group flex items-center gap-4 border border-paper-300 bg-paper-50 px-5 py-4 transition-all hover:-translate-y-0.5 hover:border-ink-950"
                >
                  <MailIcon className="h-5 w-5 text-safety-600" />
                  <span>
                    <span className="block font-mono text-sm font-bold">svaichat@yandex.ru</span>
                    <span className="block text-[11px] text-steel-500">сметы и документы</span>
                  </span>
                </a>
                <button
                  onClick={() =>
                    openLead({
                      title: "Задать вопрос строителю-модератору",
                      subtitle: "Отвечают не операторы, а действующие монтажники свай — по делу и с примерами.",
                      cta: "Задать вопрос",
                    })
                  }
                  className="group flex w-full items-center gap-4 border border-paper-300 bg-paper-50 px-5 py-4 text-left transition-all hover:-translate-y-0.5 hover:border-ink-950"
                >
                  <MaxIcon className="h-5 w-5 text-safety-600" />
                  <span>
                    <span className="block font-mono text-sm font-bold">Чат MAX</span>
                    <span className="block text-[11px] text-steel-500">быстрый ответ · 52 онлайн</span>
                  </span>
                </button>
              </div>
            </Reveal>
          </div>

          {/* accordion */}
          <div>
            {FAQS.map((f, i) => {
              const isOpen = open === i;
              return (
                <Reveal key={f.q} delay={i * 60}>
                  <div className="border-b border-paper-300">
                    <button
                      onClick={() => setOpen(isOpen ? -1 : i)}
                      aria-expanded={isOpen}
                      className="group flex w-full items-center justify-between gap-6 py-6 text-left"
                    >
                      <span className="flex items-baseline gap-4">
                        <span className="font-mono text-[11px] font-bold text-safety-600">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <span
                          className={`font-display text-sm font-bold uppercase leading-snug transition-colors sm:text-base ${
                            isOpen ? "text-safety-600" : "text-ink-950 group-hover:text-safety-600"
                          }`}
                        >
                          {f.q}
                        </span>
                      </span>
                      <span
                        className={`relative h-5 w-5 shrink-0 transition-transform duration-300 ${
                          isOpen ? "rotate-45" : ""
                        }`}
                      >
                        <span className="absolute left-1/2 top-0 h-full w-[2px] -translate-x-1/2 bg-ink-950" />
                        <span className="absolute left-0 top-1/2 h-[2px] w-full -translate-y-1/2 bg-ink-950" />
                      </span>
                    </button>
                    <div className={`acc-body ${isOpen ? "open" : ""}`}>
                      <div className="acc-inner">
                        <p className="max-w-2xl pb-7 pl-9 text-sm leading-relaxed text-steel-500 sm:pl-10">
                          {f.a}
                        </p>
                      </div>
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
