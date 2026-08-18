import { useEffect, useState } from "react";
import { CHAT, STATS, TICKER } from "../data";
import { ArrowDown, ArrowUpRight, MaxIcon, PileIcon } from "../icons";
import { useLead } from "../LeadModal";
import { Counter, usePrefersReducedMotion } from "../ui";

/* ---------- technical drawing of a screw pile ---------- */
function PileDrawing({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 220 460" className={className} fill="none" stroke="currentColor">
      <path d="M100 30v330M130 30v330" strokeWidth="1.4" />
      <path d="M100 30h30" strokeWidth="1.4" />
      <path d="M100 360l15 26 15-26" strokeWidth="1.4" />
      {[80, 140, 200, 260, 320].map((y) => (
        <g key={y} strokeWidth="1.3">
          <path d={`M62 ${y}c22 14 74 14 106 0`} />
          <path d={`M62 ${y}c22-10 74-10 106 0`} opacity="0.35" />
        </g>
      ))}
      <path d="M14 230h200" strokeWidth="1.2" strokeDasharray="10 6" opacity="0.7" />
      {Array.from({ length: 14 }).map((_, i) => (
        <path key={i} d={`M${20 + i * 14} 230l-7 9`} strokeWidth="1" opacity="0.5" />
      ))}
      <path d="M52 30v356M46 30h12M46 386h12" strokeWidth="1" opacity="0.8" />
      <path d="M52 30l-4 8h8zM52 386l-4-8h8z" strokeWidth="1" opacity="0.8" />
      <path d="M100 14h30M100 9v10M130 9v10" strokeWidth="1" opacity="0.8" />
      <text x="146" y="18" fontSize="11" fill="currentColor" stroke="none" fontFamily="JetBrains Mono, monospace">
        Ø108
      </text>
      <text x="14" y="212" fontSize="11" fill="currentColor" stroke="none" fontFamily="JetBrains Mono, monospace">
        L = 2500
      </text>
      <text x="150" y="252" fontSize="10" fill="currentColor" stroke="none" opacity="0.7" fontFamily="JetBrains Mono, monospace">
        грунт
      </text>
      <path d="M170 60a26 26 0 1 1-14-22" strokeWidth="1.2" opacity="0.8" />
      <path d="M156 32l2 8 8-3" strokeWidth="1.2" opacity="0.8" />
      <text x="178" y="92" fontSize="10" fill="currentColor" stroke="none" opacity="0.7" fontFamily="JetBrains Mono, monospace">
        вращение
      </text>
    </svg>
  );
}

/* ---------- dial behind the chat ---------- */
function Dial({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 200" className={className} fill="none" stroke="currentColor">
      <circle cx="100" cy="100" r="88" strokeWidth="1" strokeDasharray="4 10" />
      <circle cx="100" cy="100" r="66" strokeWidth="1" strokeDasharray="2 14" opacity="0.7" />
      {Array.from({ length: 24 }).map((_, i) => {
        const a = (i * Math.PI) / 12;
        return (
          <path
            key={i}
            d={`M${100 + Math.cos(a) * 88} ${100 + Math.sin(a) * 88}l${Math.cos(a) * 6} ${Math.sin(a) * 6}`}
            strokeWidth="1"
            opacity="0.8"
          />
        );
      })}
    </svg>
  );
}

/* ---------- live chat simulation ---------- */
const timeOf = (i: number) => {
  const m = (9 * 60 + 34 + i * 6) % (24 * 60);
  return `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
};

function ChatCard() {
  const { openLead } = useLead();
  const rm = usePrefersReducedMotion();
  const [count, setCount] = useState(rm ? 6 : 3);
  const [typing, setTyping] = useState(!rm);

  useEffect(() => {
    if (rm) return;
    const iv = setInterval(() => {
      setTyping(true);
      setTimeout(() => {
        setCount((c) => c + 1);
        setTyping(false);
      }, 1150);
    }, 3800);
    return () => clearInterval(iv);
  }, [rm]);

  const visible = Array.from({ length: 5 }, (_, k) => count - 5 + k).filter((i) => i >= 0);

  return (
    <div className="anim-float relative z-10 mx-auto w-full max-w-[400px]">
      <div className="border border-ink-700 bg-ink-850/95 shadow-[0_40px_90px_-24px_rgba(0,0,0,0.75)] backdrop-blur-sm">
        {/* chat header */}
        <div className="flex items-center gap-3 border-b border-ink-700 px-4 py-3">
          <span className="grid h-9 w-9 place-items-center border border-safety-500/40 bg-safety-500/10">
            <PileIcon className="h-5 w-5 text-safety-400" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-bold text-steel-100">Свайчат · стройка свай</p>
            <p className="flex items-center gap-1.5 font-mono text-[10px] text-steel-500">
              <span className="dot-live inline-block h-1.5 w-1.5 rounded-full bg-green-400" />
              214 участников · 52 онлайн
            </p>
          </div>
          <span className="font-mono text-steel-500">⋯</span>
        </div>

        {/* messages */}
        <div className="flex h-[392px] flex-col justify-end gap-2.5 overflow-hidden px-4 py-4">
          {visible.map((idx, i) => {
            const m = CHAT[idx % CHAT.length];
            return (
              <div
                key={`m${idx}`}
                className="msg-in max-w-[88%] border border-ink-700 bg-ink-800 px-3.5 py-2.5"
                style={{ animationDelay: `${i * 60}ms` }}
              >
                <div className="mb-1 flex items-baseline gap-2">
                  <span className="text-[11px] font-bold" style={{ color: m.color }}>
                    {m.author}
                  </span>
                  <span className="font-mono text-[9px] uppercase tracking-wider text-steel-500">
                    {m.region}
                  </span>
                  <span className="ml-auto font-mono text-[9px] text-steel-500">
                    {timeOf(idx % CHAT.length)}
                  </span>
                </div>
                <p className="text-[13px] leading-snug text-steel-200">{m.text}</p>
              </div>
            );
          })}
          {typing && (
            <div className="msg-in flex w-fit items-center gap-1.5 border border-ink-700 bg-ink-800 px-3.5 py-3">
              {[0, 1, 2].map((d) => (
                <span
                  key={d}
                  className="t-dot h-1.5 w-1.5 rounded-full bg-steel-400"
                  style={{ animationDelay: `${d * 0.18}s` }}
                />
              ))}
            </div>
          )}
        </div>

        {/* input strip */}
        <div className="flex items-center gap-3 border-t border-ink-700 px-4 py-3">
          <span className="flex-1 border border-ink-700 bg-ink-900 px-3 py-2 text-xs text-steel-500">
            Написать в чат…
          </span>
          <button
            onClick={() =>
              openLead({
                title: "Написать в MAX-чат Свайчат",
                subtitle: "Сообщение уйдёт модератору-строителю. Ответ — в течение 12 минут.",
                cta: "Отправить сообщение",
              })
            }
            aria-label="Написать в MAX-чат"
            className="grid h-9 w-9 shrink-0 place-items-center bg-safety-500 text-ink-950 transition-all hover:-translate-y-0.5 hover:bg-safety-400"
          >
            <MaxIcon className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}

/* ---------- hero ---------- */
export default function Hero() {
  const { openLead } = useLead();
  return (
    <section id="top" className="bg-blueprint relative overflow-hidden bg-ink-950">
      {/* ambient glows */}
      <div className="pointer-events-none absolute -left-44 -top-44 h-[560px] w-[560px] rounded-full bg-safety-500/[0.07] blur-3xl" />
      <div className="pointer-events-none absolute -right-32 top-40 h-[480px] w-[480px] rounded-full bg-bp-500/[0.09] blur-3xl" />

      <div className="relative mx-auto grid max-w-7xl gap-16 px-5 pb-16 pt-28 sm:px-8 lg:grid-cols-[1.04fr_0.96fr] lg:items-center lg:pb-20 lg:pt-40">
        {/* left */}
        <div>
          <p className="mb-7 flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.3em] text-steel-400">
            <span className="dot-live inline-block h-2 w-2 rounded-full bg-green-400" />
            Сообщество строителей · онлайн 24/7
          </p>

          <h1 className="font-display text-[2.35rem] font-extrabold uppercase leading-[1.08] text-steel-100 sm:text-5xl xl:text-[3.6rem]">
            <span className="lm">
              <span style={{ animationDelay: "0.08s" }}>200+ строителей.</span>
            </span>
            <span className="lm">
              <span style={{ animationDelay: "0.22s" }}>47 регионов.</span>
            </span>
            <span className="lm">
              <span className="text-safety-400" style={{ animationDelay: "0.36s" }}>
                Один чат.
              </span>
            </span>
          </h1>

          <p className="mt-7 max-w-xl text-base leading-relaxed text-steel-300 sm:text-lg">
            Свайчат — закрытое сообщество монтажников свайных фундаментов
            и заводов-производителей винтовых и ЖБ свай в российском мессенджере
            MAX. Грунты, сметы, техника и заказы из вашего региона — каждый день в одном месте.
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-3">
            <button
              onClick={() =>
                openLead({
                  title: "Вступить в чат строителей Свайчат",
                  subtitle: "Оставьте контакты — модератор добавит вас в чат MAX вашего региона.",
                  cta: "Хочу в чат",
                })
              }
              className="group inline-flex items-center gap-3 bg-safety-500 px-7 py-4 font-display text-xs font-bold uppercase tracking-widest text-ink-950 transition-all hover:-translate-y-0.5 hover:bg-safety-400 hover:shadow-[0_16px_40px_-12px_rgba(37,211,102,0.55)]"
            >
              <MaxIcon className="h-5 w-5 transition-transform group-hover:rotate-6" />
              Вступить в чат
              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </button>
            <a
              href="#calculator"
              className="group inline-flex items-center gap-3 border border-ink-600 px-7 py-4 font-display text-xs font-bold uppercase tracking-widest text-steel-200 transition-all hover:border-steel-400 hover:text-steel-100"
            >
              Рассчитать фундамент
              <ArrowDown className="h-4 w-4 transition-transform group-hover:translate-y-1" />
            </a>
          </div>

          {/* stats */}
          <div className="mt-14 grid grid-cols-2 gap-x-6 gap-y-8 border-t border-ink-800 pt-7 sm:grid-cols-4">
            {STATS.map((s) => (
              <div key={s.label}>
                <Counter
                  value={s.value}
                  suffix={s.suffix}
                  className="font-display text-2xl font-bold text-steel-100 sm:text-[1.7rem]"
                />
                <p className="mt-2 font-mono text-[10px] uppercase leading-relaxed tracking-[0.16em] text-steel-500">
                  {s.label}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* right */}
        <div className="relative">
          <Dial className="anim-spin-slow absolute -right-10 -top-16 w-56 text-bp-400/35 sm:-right-16" />
          <PileDrawing className="absolute -left-24 bottom-2 hidden h-[430px] text-bp-400/60 xl:block" />

          {/* callouts */}
          <div className="absolute -left-6 top-10 z-20 hidden border-l-2 border-safety-500 pl-3 font-mono text-[10px] uppercase tracking-[0.2em] text-steel-400 md:block lg:-left-16">
            СВС-108×2500
            <br />
            <span className="text-safety-400">3 105 ₽/шт · со скидкой</span>
          </div>
          <div className="absolute -right-2 bottom-14 z-20 hidden border-r-2 border-bp-400 pr-3 text-right font-mono text-[10px] uppercase tracking-[0.2em] text-steel-400 md:block lg:-right-8">
            Монтаж под ключ
            <br />
            <span className="text-bp-300">≈ 1 рабочий день</span>
          </div>

          <ChatCard />
        </div>
      </div>

      {/* ticker */}
      <div className="relative border-y border-ink-800 bg-ink-900/80">
        <div className="mq-wrap overflow-hidden py-3.5">
          <div className="mq items-center">
            {[...TICKER, ...TICKER].map((t, i) => (
              <span
                key={i}
                className="flex items-center gap-8 pr-8 font-display text-[11px] uppercase tracking-[0.22em] text-steel-300"
              >
                {t}
                <span className="text-safety-500">◆</span>
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
