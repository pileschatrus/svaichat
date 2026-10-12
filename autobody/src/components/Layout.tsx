import { useEffect, useState, type ReactNode } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { Calculator as CalcIcon, Clock, MapPin, Menu, MessageCircle, Phone, X } from "lucide-react";
import { META_DISCLAIMER, SITE, links, mapsLinks, track } from "../config";
import { SERVICES } from "../data/services";
import { BRANDS } from "../data/cars";
import { Logo, InstagramIcon } from "./ui";
import { Messengers, useLead } from "./Lead";

const NAV = [
  { to: "/uslugi/", label: "Услуги" },
  { to: "/kalkulyator/", label: "Калькулятор" },
  { to: "/ceny/", label: "Цены" },
  { to: "/marki/", label: "Марки" },
  { to: "/raboty/", label: "Работы" },
  { to: "/stati/", label: "Статьи" },
  { to: "/kontakty/", label: "Контакты" },
];

export function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const loc = useLocation();
  useEffect(() => setOpen(false), [loc.pathname]);
  useEffect(() => {
    const f = () => setScrolled(window.scrollY > 8);
    f();
    window.addEventListener("scroll", f, { passive: true });
    return () => window.removeEventListener("scroll", f);
  }, []);

  return (
    <header className={`no-print fixed inset-x-0 top-0 z-[60] transition-all duration-500 ${scrolled || open ? "border-b border-white/6 bg-ink-950/80 backdrop-blur-xl" : "bg-transparent"}`}>
      <div className="mx-auto flex h-[72px] max-w-[1320px] items-center justify-between gap-4 px-4 sm:px-6">
        <Link to="/" aria-label={`${SITE.name} — на главную`}>
          <Logo />
        </Link>
        <nav className="hidden items-center gap-1 lg:flex" aria-label="Основное меню">
          {NAV.map((n) => (
            <NavLink
              key={n.to}
              to={n.to}
              className={({ isActive }) => `rounded-full px-3.5 py-2 text-[14px] font-medium transition-colors ${isActive ? "bg-white/8 text-white" : "text-fog-300 hover:text-white"}`}
            >
              {n.label}
            </NavLink>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <a href={links.tel} onClick={() => track("call")} className="hidden text-right xl:block">
            <div className="font-display text-[15px] font-bold text-white">{SITE.phoneHuman}</div>
            <div className="text-[11px] text-fog-400">{SITE.hours}</div>
          </a>
          <a href={links.tel} onClick={() => track("call")} className="grid h-11 w-11 place-items-center rounded-full border border-white/10 bg-white/5 text-white xl:hidden" aria-label="Позвонить">
            <Phone className="h-[18px] w-[18px]" />
          </a>
          <Link to="/kalkulyator/" className="btn btn-lava btn-sm hidden sm:inline-flex">
            <CalcIcon className="h-4 w-4" /> Рассчитать
          </Link>
          <button onClick={() => setOpen((v) => !v)} className="grid h-11 w-11 place-items-center rounded-full border border-white/10 bg-white/5 text-white lg:hidden" aria-label="Меню" aria-expanded={open}>
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>
      {open && (
        <div className="max-h-[calc(100vh-72px)] overflow-y-auto border-t border-white/6 px-4 pt-4 pb-8 lg:hidden" style={{ animation: "fade-in .2s both" }}>
          <nav className="grid gap-1" aria-label="Мобильное меню">
            {NAV.map((n) => (
              <NavLink key={n.to} to={n.to} className="rounded-2xl px-4 py-3.5 font-display text-[17px] font-semibold text-white hover:bg-white/5">
                {n.label}
              </NavLink>
            ))}
          </nav>
          <div className="mt-4 grid gap-3 rounded-2xl border border-white/8 p-4">
            <a href={links.tel} className="font-display text-xl font-bold text-white">
              {SITE.phoneHuman}
            </a>
            <div className="text-sm text-fog-400">
              {SITE.city}, {SITE.street} · {SITE.hours}
            </div>
            <div className="flex gap-2">
              <Messengers />
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

export function MobileBar() {
  const { openLead } = useLead();
  return (
    <div className="no-print fixed inset-x-0 bottom-0 z-40 grid grid-cols-3 border-t border-white/8 bg-ink-950/90 pb-[env(safe-area-inset-bottom)] backdrop-blur-xl sm:hidden">
      <a href={links.tel} onClick={() => track("call")} className="flex flex-col items-center gap-1 py-2.5 text-[11px] font-medium text-fog-200">
        <Phone className="h-5 w-5 text-mint-400" /> Позвонить
      </a>
      <Link to="/kalkulyator/" className="flex flex-col items-center gap-1 py-2.5 text-[11px] font-semibold text-white">
        <CalcIcon className="h-5 w-5 text-lava-400" /> Рассчитать
      </Link>
      <button onClick={() => openLead({ title: "Записаться на осмотр", subtitle: "Перезвоним, ответим на вопросы и подберём время.", source: "mobilebar" })} className="flex flex-col items-center gap-1 py-2.5 text-[11px] font-medium text-fog-200">
        <MessageCircle className="h-5 w-5 text-ice-400" /> Заявка
      </button>
    </div>
  );
}

export function Footer() {
  return (
    <footer className="no-print relative mt-24 border-t border-white/6 bg-ink-900 pb-24 sm:pb-0">
      <div className="mx-auto grid max-w-[1320px] gap-10 px-4 py-14 sm:px-6 md:grid-cols-2 lg:grid-cols-[1.3fr_1fr_1fr_1fr]">
        <div>
          <Logo />
          <p className="mt-5 max-w-sm text-[14px] leading-relaxed text-fog-400">
            Кузовной ремонт и покраска автомобилей {SITE.cityIn}. Онлайн-калькулятор стоимости, бесплатный осмотр, гарантия на работы.
          </p>
          <div className="mt-5 grid gap-2 text-[14px] text-fog-300">
            <a href={links.tel} className="font-display text-lg font-bold text-white">
              {SITE.phoneHuman}
            </a>
            <a href={mapsLinks.yandex} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-white">
              <MapPin className="h-4 w-4 text-lava-400" /> {SITE.city}, {SITE.street}
            </a>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-lava-400" /> {SITE.hours}
            </div>
            {SITE.email && (
              <a href={links.mail} className="hover:text-white">
                {SITE.email}
              </a>
            )}
          </div>
          <div className="mt-5 flex gap-2">
            <Messengers />
          </div>
        </div>
        <FooterCol title="Услуги" items={SERVICES.slice(0, 9).map((s) => ({ to: `/uslugi/${s.slug}/`, label: s.name }))} />
        <FooterCol title="Ещё услуги" items={SERVICES.slice(9).map((s) => ({ to: `/uslugi/${s.slug}/`, label: s.name }))} />
        <FooterCol
          title="Марки"
          items={[...BRANDS.filter((b) => b.top).map((b) => ({ to: `/marki/${b.slug}/`, label: `Ремонт ${b.name}` })), { to: "/marki/", label: "Все марки →" }]}
        />
      </div>
      <div className="border-t border-white/6">
        <div className="mx-auto flex max-w-[1320px] flex-col gap-3 px-4 py-6 text-[12px] text-fog-500 sm:px-6 md:flex-row md:items-center md:justify-between">
          <div>
            © {new Date().getFullYear()} {SITE.name}. Цены на сайте носят информационный характер и не являются публичной офертой.
          </div>
          <div className="flex flex-wrap gap-4">
            <Link to="/voprosy/" className="hover:text-white">
              Вопросы и ответы
            </Link>
            <Link to="/politika/" className="hover:text-white">
              Политика конфиденциальности
            </Link>
            <a href={links.instagram} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-white">
              <InstagramIcon className="h-3.5 w-3.5" /> @{SITE.instagram}*
            </a>
          </div>
        </div>
        <div className="mx-auto max-w-[1320px] px-4 pb-6 text-[11px] text-fog-500/70 sm:px-6">* {META_DISCLAIMER}</div>
      </div>
    </footer>
  );
}

function FooterCol({ title, items }: { title: string; items: { to: string; label: string }[] }) {
  return (
    <div>
      <div className="eyebrow mb-4">{title}</div>
      <ul className="grid gap-2.5 text-[14px]">
        {items.map((i) => (
          <li key={i.to}>
            <Link to={i.to} className="text-fog-300 transition-colors hover:text-white">
              {i.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function Container({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`mx-auto max-w-[1320px] px-4 sm:px-6 ${className}`}>{children}</div>;
}
