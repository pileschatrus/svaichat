import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { CheckIcon, CloseIcon, MaxIcon } from "./icons";

export type LeadCfg = {
  title: string;
  subtitle?: string;
  comment?: string;
  cta?: string;
};

type Status = "form" | "sending" | "done" | "error";

const LeadCtx = createContext<{ openLead: (cfg: LeadCfg) => void }>({
  openLead: () => {},
});

export const useLead = () => useContext(LeadCtx);

const formatPhone = (raw: string) => {
  let d = raw.replace(/\D/g, "");
  if (d.startsWith("8")) d = "7" + d.slice(1);
  if (d.startsWith("9") && d.length <= 10) d = "7" + d;
  d = d.slice(0, 11);
  let out = "+7";
  if (d.length > 1) out += " (" + d.slice(1, 4);
  if (d.length >= 4) out += ") " + d.slice(4, 7);
  if (d.length >= 7) out += "-" + d.slice(7, 9);
  if (d.length >= 9) out += "-" + d.slice(9, 11);
  return d.length > 1 ? out : "+7";
};

const fieldCls =
  "w-full border border-ink-600 bg-ink-900 px-4 py-3 text-sm text-steel-100 outline-none transition-colors placeholder:text-steel-500 focus:border-safety-500";
const labelCls = "mb-2 block font-mono text-[10px] uppercase tracking-[0.22em] text-steel-500";

export function LeadProvider({ children }: { children: ReactNode }) {
  const [cfg, setCfg] = useState<LeadCfg | null>(null);
  const [status, setStatus] = useState<Status>("form");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [comment, setComment] = useState("");
  const [touched, setTouched] = useState(false);
  const nameRef = useRef<HTMLInputElement>(null);

  const openLead = useCallback((c: LeadCfg) => {
    setCfg(c);
    setStatus("form");
    setTouched(false);
    setComment(c.comment ?? "");
  }, []);

  const close = useCallback(() => setCfg(null), []);

  /* Esc + scroll lock */
  useEffect(() => {
    if (!cfg) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const t = setTimeout(() => nameRef.current?.focus(), 60);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
      clearTimeout(t);
    };
  }, [cfg, close]);

  const phoneDigits = phone.replace(/\D/g, "");
  const nameValid = name.trim().length >= 2;
  const phoneValid = phoneDigits.length === 11;
  const valid = nameValid && phoneValid;

  const submit = async () => {
    setTouched(true);
    if (!valid || status === "sending" || !cfg) return;
    setStatus("sending");

    const body = [
      "Новая заявка с сайта svaichat.ru",
      "────────────────────────────",
      `Тема: ${cfg.title}`,
      `Имя: ${name.trim()}`,
      `Телефон: ${formatPhone(phone)}`,
      "",
      "Комментарий:",
      comment.trim() || "—",
      "────────────────────────────",
      `Отправлено: ${new Date().toLocaleString("ru-RU")}`,
      `Страница: ${window.location.href}`,
    ].join("\n");

    try {
      const res = await fetch("https://formsubmit.co/ajax/svaichat@yandex.ru", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          _subject: `Свайчат · ${cfg.title}`,
          Имя: name.trim(),
          Телефон: formatPhone(phone),
          Комментарий: comment.trim() || "—",
          Тема: cfg.title,
        }),
      });
      if (!res.ok) throw new Error("send failed");
    } catch {
      /* fallback: pre-filled mail to site owner */
      const a = document.createElement("a");
      a.href = `mailto:svaichat@yandex.ru?subject=${encodeURIComponent("Заявка с svaichat.ru: " + cfg.title)}&body=${encodeURIComponent(body)}`;
      a.click();
    }
    setTimeout(() => setStatus("done"), 650);
  };

  return (
    <LeadCtx.Provider value={{ openLead }}>
      {children}

      {cfg && (
        <div
          className="fixed inset-0 z-[70] grid place-items-center overflow-y-auto bg-ink-950/80 px-4 py-8 backdrop-blur-sm"
          onMouseDown={(e) => e.target === e.currentTarget && close()}
          role="dialog"
          aria-modal="true"
        >
          <div className="msg-in w-full max-w-md border border-ink-700 bg-ink-900 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.9)]">
            {/* head */}
            <div className="flex items-start justify-between gap-4 border-b border-ink-700 px-6 py-5">
              <div>
                {status !== "done" && (
                  <p className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.22em] text-safety-400">
                    <MaxIcon className="h-4 w-4" />
                    Свайчат · заявка
                  </p>
                )}
                <h3 className="mt-2 font-display text-base font-bold uppercase leading-snug text-steel-100">
                  {status === "done" ? "Заявка отправлена" : cfg.title}
                </h3>
                {status !== "done" && cfg.subtitle && (
                  <p className="mt-2 text-xs leading-relaxed text-steel-400">{cfg.subtitle}</p>
                )}
              </div>
              <button
                onClick={close}
                aria-label="Закрыть"
                className="grid h-9 w-9 shrink-0 place-items-center border border-ink-700 text-steel-400 transition-colors hover:border-steel-400 hover:text-steel-100"
              >
                <CloseIcon className="h-4 w-4" />
              </button>
            </div>

            {/* body */}
            {status === "done" ? (
              <div className="px-6 py-9 text-center">
                <span className="mx-auto grid h-14 w-14 place-items-center bg-safety-500/15">
                  <CheckIcon className="h-7 w-7 text-safety-400" />
                </span>
                <p className="mt-5 font-display text-lg font-bold uppercase text-steel-100">
                  Спасибо, {name.trim()}!
                </p>
                <p className="mx-auto mt-3 max-w-xs text-sm leading-relaxed text-steel-400">
                  Менеджер Свайчат свяжется с вами{" "}
                  <span className="font-bold text-steel-200">в течение 15 минут</span> в рабочее
                  время (8:00–21:00 МСК) или утром следующего дня.
                </p>
                <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.18em] text-steel-500">
                  Заявка ушла на svaichat@yandex.ru
                </p>
                <button
                  onClick={close}
                  className="mt-7 w-full bg-safety-500 px-6 py-3.5 font-display text-[11px] font-bold uppercase tracking-widest text-ink-950 transition-colors hover:bg-safety-400"
                >
                  Отлично
                </button>
              </div>
            ) : (
              <div className="space-y-4 px-6 py-6">
                <div>
                  <label htmlFor="lead-name" className={labelCls}>
                    Ваше имя *
                  </label>
                  <input
                    id="lead-name"
                    ref={nameRef}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Иван"
                    className={`${fieldCls} ${touched && !nameValid ? "border-red-400/70" : ""}`}
                  />
                  {touched && !nameValid && (
                    <p className="mt-1.5 text-[11px] text-red-400">Укажите имя — минимум 2 символа</p>
                  )}
                </div>
                <div>
                  <label htmlFor="lead-phone" className={labelCls}>
                    Телефон *
                  </label>
                  <input
                    id="lead-phone"
                    value={phone}
                    onChange={(e) => setPhone(formatPhone(e.target.value))}
                    placeholder="+7 (___) ___-__-__"
                    inputMode="tel"
                    className={`${fieldCls} ${touched && !phoneValid ? "border-red-400/70" : ""}`}
                  />
                  {touched && !phoneValid && (
                    <p className="mt-1.5 text-[11px] text-red-400">Введите номер полностью</p>
                  )}
                </div>
                <div>
                  <label htmlFor="lead-comment" className={labelCls}>
                    Комментарий
                  </label>
                  <textarea
                    id="lead-comment"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    rows={3}
                    placeholder="Регион, объект, количество свай…"
                    className={`${fieldCls} resize-none`}
                  />
                </div>
                <button
                  onClick={submit}
                  disabled={status === "sending"}
                  className="w-full bg-safety-500 px-6 py-4 font-display text-[11px] font-bold uppercase tracking-widest text-ink-950 transition-all hover:bg-safety-400 disabled:cursor-wait disabled:opacity-70"
                >
                  {status === "sending" ? "Отправляем…" : cfg.cta ?? "Отправить заявку"}
                </button>
                <p className="text-center font-mono text-[9px] leading-relaxed text-steel-500">
                  Нажимая кнопку, вы соглашаетесь на обработку персональных данных.
                  Ответ — в течение 15 минут в рабочее время.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </LeadCtx.Provider>
  );
}
