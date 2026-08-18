import { useEffect, useState } from "react";
import { NAV } from "../data";
import { BurgerIcon, CloseIcon, MaxIcon, PhoneIcon } from "../icons";
import { useLead } from "../LeadModal";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { openLead } = useLead();

  useEffect(() => {
    const f = () => setScrolled(window.scrollY > 16);
    f();
    window.addEventListener("scroll", f, { passive: true });
    return () => window.removeEventListener("scroll", f);
  }, []);

  const openChatForm = () =>
    openLead({
      title: "Вступить в чат Свайчат",
      subtitle: "Оставьте контакты — модератор добавит вас в чат MAX строителей вашего региона.",
      cta: "Хочу в чат",
    });

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 border-b transition-all duration-300 ${
        scrolled
          ? "border-ink-800 bg-ink-950/90 shadow-[0_10px_40px_-20px_rgba(0,0,0,0.8)] backdrop-blur-md"
          : "border-transparent bg-transparent"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-5 sm:px-8 lg:h-[72px]">
        {/* logo */}
        <a href="#/" className="group flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center bg-safety-500 font-display text-xl font-black leading-none text-ink-950 transition-transform duration-300 group-hover:-rotate-6">
            V
          </span>
          <span className="leading-none">
            <span className="block font-display text-sm font-extrabold uppercase tracking-wide text-steel-100">
              Свайчат
            </span>
            <span className="mt-1 hidden font-mono text-[9px] uppercase tracking-[0.22em] text-steel-500 sm:block">
              строители свай · с 2018
            </span>
          </span>
        </a>

        {/* nav */}
        <nav className="hidden items-center gap-7 lg:flex">
          {NAV.map((n) => (
            <a
              key={n.href}
              href={n.href}
              className="group relative font-mono text-[11px] uppercase tracking-[0.18em] text-steel-300 transition-colors hover:text-steel-100"
            >
              {n.label}
              <span className="absolute -bottom-1.5 left-0 h-px w-0 bg-safety-500 transition-all duration-300 group-hover:w-full" />
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <a
            href="tel:+79278448000"
            className="hidden items-center gap-2 font-mono text-xs text-steel-300 transition-colors hover:text-safety-400 xl:flex"
          >
            <PhoneIcon className="h-4 w-4" />
            +7 927 844-80-00
          </a>
          <button
            onClick={openChatForm}
            className="hidden items-center gap-2 bg-safety-500 px-4 py-2.5 font-display text-[10px] font-bold uppercase tracking-widest text-ink-950 transition-all hover:-translate-y-0.5 hover:bg-safety-400 sm:inline-flex"
          >
            <MaxIcon className="h-4 w-4" />
            В чат
          </button>
          <button
            onClick={() => setOpen((v) => !v)}
            aria-label="Меню"
            className="grid h-10 w-10 place-items-center border border-ink-700 text-steel-200 transition-colors hover:border-steel-400 lg:hidden"
          >
            {open ? <CloseIcon className="h-5 w-5" /> : <BurgerIcon className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* mobile menu */}
      <div
        className={`overflow-hidden border-ink-800 bg-ink-950/95 backdrop-blur-md transition-all duration-300 lg:hidden ${
          open ? "max-h-96 border-b" : "max-h-0"
        }`}
      >
        <nav className="flex flex-col px-5 py-4 sm:px-8">
          {NAV.map((n, i) => (
            <a
              key={n.href}
              href={n.href}
              onClick={() => setOpen(false)}
              className="flex items-center justify-between border-b border-ink-800/70 py-3.5 font-mono text-xs uppercase tracking-[0.18em] text-steel-200 transition-colors hover:text-safety-400"
            >
              {n.label}
              <span className="text-steel-500">0{i + 1}</span>
            </a>
          ))}
          <button
            onClick={() => {
              setOpen(false);
              openChatForm();
            }}
            className="mt-4 inline-flex items-center justify-center gap-2 bg-safety-500 px-4 py-3 font-display text-[10px] font-bold uppercase tracking-widest text-ink-950"
          >
            <MaxIcon className="h-4 w-4" />
            Вступить в чат MAX
          </button>
        </nav>
      </div>
    </header>
  );
}
