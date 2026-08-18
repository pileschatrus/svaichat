import { FACTORIES, MEETINGS } from "../data";
import { ArrowUpRight, FactoryIcon } from "../icons";
import { useLead } from "../LeadModal";
import { Reveal, SectionHead } from "../ui";

function FactoryChip({ name, city }: { name: string; city: string }) {
  return (
    <span className="mr-3 flex shrink-0 items-center gap-3 border border-ink-700 bg-ink-900/80 px-5 py-3.5 transition-colors hover:border-safety-500">
      <FactoryIcon className="h-5 w-5 text-safety-400" />
      <span>
        <span className="block font-display text-xs font-bold uppercase tracking-wide text-steel-100">
          {name}
        </span>
        <span className="mt-0.5 block font-mono text-[9px] uppercase tracking-[0.18em] text-steel-500">
          {city}
        </span>
      </span>
    </span>
  );
}

export default function Community() {
  const { openLead } = useLead();
  return (
    <section id="community" className="relative scroll-mt-20 overflow-hidden bg-ink-950 py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHead
          dark
          index="06"
          kicker="Сообщество"
          title={
            <>
              Заводы и встречи <span className="text-safety-400">вживую</span>
            </>
          }
          note="Раз в год собираемся офлайн: испытания свай под нагрузкой, доклады и то самое общение, ради которого существует чат."
        />
      </div>

      {/* factories marquee */}
      <Reveal className="space-y-3">
        <div className="mq-wrap overflow-hidden">
          <div className="mq items-center py-1">
            {[...FACTORIES, ...FACTORIES].map((f, i) => (
              <FactoryChip key={`${f.name}-${i}`} {...f} />
            ))}
          </div>
        </div>
        <div className="mq-wrap overflow-hidden">
          <div className="mq-rev items-center py-1">
            {[...FACTORIES.slice(4), ...FACTORIES.slice(0, 4), ...FACTORIES].map((f, i) => (
              <FactoryChip key={`r-${f.name}-${i}`} {...f} />
            ))}
          </div>
        </div>
      </Reveal>

      {/* meetings timeline */}
      <div className="mx-auto mt-16 max-w-7xl px-5 sm:mt-20 sm:px-8">
        <div className="grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
          {MEETINGS.map((m, i) => (
            <Reveal key={m.year} delay={i * 90}>
              <div className="group relative border-t-2 border-ink-700 pt-7">
                <span className="absolute -top-[6px] left-0 h-2.5 w-2.5 bg-safety-500 transition-transform duration-300 group-hover:scale-150" />
                <p className="font-display text-3xl font-extrabold text-safety-400 sm:text-4xl">{m.year}</p>
                <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.22em] text-steel-500">
                  {m.city}
                </p>
                <p className="mt-3 text-sm leading-relaxed text-steel-400">{m.text}</p>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={150} className="mt-14 flex flex-wrap items-center justify-between gap-5 border border-ink-700 bg-ink-900/70 p-6 sm:p-8">
          <div>
            <p className="font-display text-lg font-bold uppercase text-steel-100 sm:text-xl">
              Следующая встреча — лето 2026
            </p>
            <p className="mt-2 text-sm text-steel-400">
              Полигон под Казанью: испытания СВС-133 динамической нагрузкой и разбор сезона.
            </p>
          </div>
          <button
            onClick={() =>
              openLead({
                title: "Получать анонсы встреч Свайчат",
                subtitle: "Добавим вас в список участников: даты, полигон, программа испытаний и регистрация.",
                cta: "Хочу анонсы",
              })
            }
            className="group inline-flex items-center gap-3 border border-safety-500 px-6 py-3.5 font-display text-[11px] font-bold uppercase tracking-widest text-safety-400 transition-all hover:bg-safety-500 hover:text-ink-950"
          >
            Анонсы в чате
            <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </button>
        </Reveal>
      </div>
    </section>
  );
}
