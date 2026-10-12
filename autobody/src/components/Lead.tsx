import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { Check, Phone, X } from "lucide-react";
import { SITE, links, track } from "../config";
import { InstagramIcon, MaxIcon, TelegramIcon } from "./ui";

export type LeadCfg = { title: string; subtitle?: string; comment?: string; estimate?: string; source: string };

const Ctx = createContext<{ openLead: (c: LeadCfg) => void }>({ openLead: () => {} });
export const useLead = () => useContext(Ctx);

export const formatPhone = (raw: string) => {
  let d = raw.replace(/\D/g, "");
  if (d.startsWith("8")) d = "7" + d.slice(1);
  if (d.startsWith("9")) d = "7" + d;
  d = d.slice(0, 11);
  let out = "+7";
  if (d.length > 1) out += " (" + d.slice(1, 4);
  if (d.length >= 4) out += ") " + d.slice(4, 7);
  if (d.length >= 7) out += "-" + d.slice(7, 9);
  if (d.length >= 9) out += "-" + d.slice(9, 11);
  return d.length > 1 ? out : "";
};

type Status = "form" | "sending" | "done" | "error";

export async function sendLead(data: Record<string, string>) {
  const r = await fetch("/send.php", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...data, page: window.location.href }),
  });
  if (!r.ok) throw new Error(String(r.status));
  const j = await r.json().catch(() => ({}));
  if (!j.ok) throw new Error("not ok");
}

export function LeadForm({ cfg, onDone, dense = false }: { cfg: LeadCfg; onDone?: () => void; dense?: boolean }) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [comment, setComment] = useState(cfg.comment ?? "");
  const [agree, setAgree] = useState(true);
  const [hp, setHp] = useState("");
  const [touched, setTouched] = useState(false);
  const [status, setStatus] = useState<Status>("form");
  const phoneOk = phone.replace(/\D/g, "").length === 11;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched(true);
    if (!phoneOk || !agree) return;
    setStatus("sending");
    try {
      await sendLead({ name, phone, comment, estimate: cfg.estimate ?? "", source: cfg.source, hp });
      setStatus("done");
      track("lead_" + cfg.source);
      onDone?.();
    } catch {
      setStatus("error");
    }
  };

  if (status === "done")
    return (
      <div className="py-6 text-center">
        <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-mint-400/15 text-mint-400">
          <Check className="h-8 w-8" />
        </div>
        <div className="mt-5 font-display text-xl font-bold text-white">Заявка отправлена</div>
        <p className="mx-auto mt-2 max-w-sm text-fog-300">Мастер перезвонит в рабочее время ({SITE.hours}), уточнит детали и запишет на бесплатный осмотр.</p>
      </div>
    );

  return (
    <form onSubmit={submit} className="grid gap-3" noValidate>
      <input type="text" value={hp} onChange={(e) => setHp(e.target.value)} className="hidden" tabIndex={-1} autoComplete="off" aria-hidden />
      <div className={dense ? "grid gap-3 sm:grid-cols-2" : "grid gap-3"}>
        <input className="field" placeholder="Ваше имя" value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" aria-label="Имя" />
        <div>
          <input
            className={`field ${touched && !phoneOk ? "!border-red-500" : ""}`}
            placeholder="+7 (___) ___-__-__"
            inputMode="tel"
            value={phone}
            onChange={(e) => setPhone(formatPhone(e.target.value))}
            autoComplete="tel"
            aria-label="Телефон"
            aria-invalid={touched && !phoneOk}
          />
          {touched && !phoneOk && <div className="mt-1 text-xs text-red-400">Введите номер телефона полностью</div>}
        </div>
      </div>
      {!dense && <textarea className="field min-h-[88px] resize-y" placeholder="Комментарий: что случилось, удобное время" value={comment} onChange={(e) => setComment(e.target.value)} aria-label="Комментарий" />}
      {cfg.estimate && (
        <div className="flex items-center gap-2 rounded-xl bg-white/[0.04] px-3 py-2 text-[12.5px] text-fog-300">
          <Check className="h-4 w-4 text-mint-400" /> Смета из калькулятора будет приложена к заявке
        </div>
      )}
      <label className="flex items-start gap-2.5 text-[12px] leading-snug text-fog-400">
        <input type="checkbox" checked={agree} onChange={(e) => setAgree(e.target.checked)} className="mt-0.5 h-4 w-4 accent-[#ff5a1f]" />
        <span>
          Согласен на обработку персональных данных в соответствии с{" "}
          <Link to="/politika/" className="underline hover:text-white" target="_blank">
            политикой конфиденциальности
          </Link>
        </span>
      </label>
      {touched && !agree && <div className="text-xs text-red-400">Нужно согласие на обработку данных</div>}
      <button className="btn btn-lava w-full" disabled={status === "sending"}>
        {status === "sending" ? "Отправляем…" : "Отправить заявку"}
      </button>
      {status === "error" && (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-[13px] text-red-200">
          Не получилось отправить заявку. Позвоните нам —{" "}
          <a href={links.tel} className="font-semibold text-white underline">
            {SITE.phoneHuman}
          </a>{" "}
          или напишите в мессенджер.
        </div>
      )}
    </form>
  );
}

export function LeadProvider({ children }: { children: ReactNode }) {
  const [cfg, setCfg] = useState<LeadCfg | null>(null);
  const openLead = useCallback((c: LeadCfg) => {
    setCfg(c);
    track("lead_open");
  }, []);
  const close = useCallback(() => setCfg(null), []);

  useEffect(() => {
    if (!cfg) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [cfg, close]);

  return (
    <Ctx.Provider value={{ openLead }}>
      {children}
      {cfg && (
        <div className="no-print fixed inset-0 z-[90] flex items-end justify-center sm:items-center" role="dialog" aria-modal="true" aria-label={cfg.title}>
          <div className="absolute inset-0 bg-black/75 backdrop-blur-sm" onClick={close} style={{ animation: "fade-in .2s both" }} />
          <div className="relative w-full max-w-md rounded-t-[28px] border border-white/10 bg-ink-900 p-6 shadow-2xl sm:rounded-[28px] sm:p-8" style={{ animation: "sheet-up .45s var(--ease-out-expo) both" }}>
            <button onClick={close} className="absolute top-4 right-4 grid h-10 w-10 place-items-center rounded-full bg-white/5 text-fog-300 hover:bg-white/10" aria-label="Закрыть">
              <X className="h-5 w-5" />
            </button>
            <div className="pr-10 font-display text-xl font-bold text-white sm:text-2xl">{cfg.title}</div>
            {cfg.subtitle && <p className="mt-2 text-[14.5px] text-fog-300">{cfg.subtitle}</p>}
            <div className="mt-6">
              <LeadForm cfg={cfg} />
            </div>
            <div className="mt-5 flex items-center justify-center gap-2 border-t border-white/8 pt-5">
              <a href={links.tel} className="btn btn-ghost btn-sm" onClick={() => track("call")}>
                <Phone className="h-4 w-4" /> {SITE.phoneHuman}
              </a>
              <Messengers small />
            </div>
          </div>
        </div>
      )}
    </Ctx.Provider>
  );
}

export function Messengers({ small = false }: { small?: boolean }) {
  const cls = small ? "h-10 w-10" : "h-12 w-12";
  const icon = small ? "h-[18px] w-[18px]" : "h-5 w-5";
  const items = [
    links.telegram && { href: links.telegram, label: "Telegram", icon: <TelegramIcon className={icon} />, bg: "hover:bg-[#229ED9]" },
    links.max && { href: links.max, label: "MAX", icon: <MaxIcon className={icon} />, bg: "hover:bg-[#7b3cff]" },
    { href: links.instagramDm, label: "Instagram*", icon: <InstagramIcon className={icon} />, bg: "hover:bg-[#d62976]" },
  ].filter(Boolean) as { href: string; label: string; icon: ReactNode; bg: string }[];
  return (
    <>
      {items.map((i) => (
        <a
          key={i.label}
          href={i.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={i.label}
          title={i.label}
          onClick={() => track("messenger")}
          className={`grid ${cls} place-items-center rounded-full border border-white/10 bg-white/5 text-white transition-colors ${i.bg}`}
        >
          {i.icon}
        </a>
      ))}
    </>
  );
}
