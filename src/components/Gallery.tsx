import { GALLERY } from "../data";
import { ArrowUpRight, CamIcon } from "../icons";
import { useLead } from "../LeadModal";
import { Reveal, SectionHead } from "../ui";

const spanClass = (i: number) =>
  i === 0
    ? "col-span-12 lg:col-span-7 lg:row-span-2"
    : i === 3
      ? "col-span-12"
      : "col-span-12 sm:col-span-6 lg:col-span-5";

const aspectClass = (i: number) =>
  i === 0 ? "aspect-[4/3] lg:aspect-auto lg:h-full" : i === 3 ? "aspect-[21/9]" : "aspect-[4/3]";

export default function Gallery() {
  const { openLead } = useLead();
  return (
    <section id="gallery" className="bg-blueprint-light relative scroll-mt-20 bg-paper-100 py-20 text-ink-950 sm:py-28">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHead
          index="05"
          kicker="Фото и видео"
          title={
            <>
              С объектов — <span className="text-safety-600">без фотошопа</span>
            </>
          }
          note="Каждое фото привязано к объекту и бригаде. Заказчик всегда может позвонить тому, кто его выложил."
        />

        <div className="grid grid-cols-12 gap-3">
          {GALLERY.map((g, i) => (
            <Reveal key={g.code} delay={i * 80} className={spanClass(i)}>
              <figure
                className={`group relative block overflow-hidden border border-paper-300 bg-ink-950 ${aspectClass(i)}`}
              >
                <img
                  src={g.src}
                  alt={g.caption}
                  loading="lazy"
                  className="h-full w-full object-cover opacity-95 transition-transform duration-[900ms] ease-out group-hover:scale-[1.06]"
                />
                <span className="absolute left-3 top-3 bg-ink-950/75 px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.18em] text-paper-50 backdrop-blur-sm">
                  {g.tag}
                </span>
                <span className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 bg-gradient-to-t from-ink-950/90 via-ink-950/45 to-transparent p-4 pt-12">
                  <span className="text-xs font-semibold leading-snug text-paper-50 sm:text-sm">
                    {g.caption}
                  </span>
                  <span className="shrink-0 font-mono text-[10px] font-bold text-steel-400 transition-colors group-hover:text-safety-400">
                    {g.code} ↗
                  </span>
                </span>
                <span className="absolute right-3 top-3 h-5 w-5 border-r-2 border-t-2 border-safety-500 opacity-0 transition-all duration-300 group-hover:opacity-100" />
              </figure>
            </Reveal>
          ))}
        </div>

        <Reveal delay={120} className="mt-8 flex flex-wrap items-center justify-between gap-4">
          <p className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.18em] text-steel-500">
            <CamIcon className="h-5 w-5 text-safety-600" />
            400+ фото и 90+ видео монтажа в галерее сообщества
          </p>
          <button
            onClick={() =>
              openLead({
                title: "Получить фото и видео монтажа",
                subtitle: "Пришлём подборку с объектов в вашем регионе: процесс, контроль момента, сдача свайного поля.",
                cta: "Получить подборку",
              })
            }
            className="group inline-flex items-center gap-2 border-b-2 border-ink-950 pb-1 font-display text-[11px] font-bold uppercase tracking-widest transition-colors hover:border-safety-500 hover:text-safety-600"
          >
            Смотреть всё
            <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </button>
        </Reveal>
      </div>
    </section>
  );
}
