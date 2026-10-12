import { useState } from "react";
import { Copy, FileDown, Link2, Printer, Send } from "lucide-react";
import { SITE, links, track } from "../config";
import { CAR_CLASSES, PAINT_TYPES, SIZES, fmt, type ClassId, type Estimate, type PaintType } from "../data/pricing";
import { useLead } from "./Lead";
import { InstagramIcon, MaxIcon, TelegramIcon, useToast } from "./ui";

export type OrderInfo = { carName: string; cls: ClassId; paint: PaintType; est: Estimate; shareUrl: string };

const pad = (n: number) => String(n).padStart(2, "0");
const today = () => {
  const d = new Date();
  return `${pad(d.getDate())}.${pad(d.getMonth() + 1)}.${d.getFullYear()}`;
};
export const orderNo = (est: Estimate) => {
  const d = new Date();
  const h = Math.abs(est.rows.reduce((a, r) => (a * 31 + r.total + r.part.id.length) | 0, est.total)) % 10000;
  return `${String(d.getFullYear()).slice(2)}${pad(d.getMonth() + 1)}${pad(d.getDate())}-${String(h).padStart(4, "0")}`;
};

export function orderText({ carName, cls, paint, est, shareUrl }: OrderInfo) {
  const L: string[] = [];
  L.push(`ПРЕДВАРИТЕЛЬНЫЙ ЗАКАЗ-НАРЯД № ${orderNo(est)} от ${today()}`);
  L.push(`${SITE.name} · ${SITE.city}, ${SITE.street} · ${SITE.phoneHuman}`);
  L.push("");
  L.push(`Автомобиль: ${carName} (класс «${CAR_CLASSES[cls].label}»)`);
  L.push(`Тип краски: ${PAINT_TYPES.find((p) => p.id === paint)!.label}`);
  L.push("");
  est.rows.forEach((r, i) => {
    const sz = r.damage.sized ? `, ${SIZES.find((s) => s.id === r.size)!.label.toLowerCase()}` : "";
    L.push(`${i + 1}. ${r.part.name} — ${r.damage.title.toLowerCase()}${sz}`);
    r.lines.forEach((l) => L.push(`   • ${l.title}: ${fmt(l.price)}`));
  });
  if (est.extras.length) {
    L.push("");
    L.push("Дополнительно:");
    est.extras.forEach((e) => L.push(`   • ${e.extra.title}: ${fmt(e.price)}`));
  }
  L.push("");
  if (est.discount) L.push(`Скидка за объём ${est.discountPct}%: −${fmt(est.discount)}`);
  L.push(`ИТОГО: ${fmt(est.total)} (диапазон после осмотра ${fmt(est.min)} – ${fmt(est.max)})`);
  L.push(`Срок: ${est.hours[0]}–${est.hours[1]} раб. дн.`);
  L.push("");
  L.push(`Открыть смету: ${shareUrl}`);
  return L.join("\n").replace(/ /g, " ");
}

async function copy(text: string) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.style.position = "fixed";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.select();
    const ok = document.execCommand("copy");
    ta.remove();
    return ok;
  }
}

async function savePdf(no: string) {
  const el = document.getElementById("order-print");
  if (!el) return;
  const [{ default: html2canvas }, { jsPDF }] = await Promise.all([import("html2canvas-pro"), import("jspdf")]);
  const canvas = await html2canvas(el, { scale: 2, backgroundColor: "#ffffff", useCORS: true });
  const pdf = new jsPDF({ unit: "mm", format: "a4" });
  const pw = 210;
  const ph = 297;
  const m = 8;
  const w = pw - m * 2;
  const h = (canvas.height * w) / canvas.width;
  const img = canvas.toDataURL("image/jpeg", 0.92);
  let y = 0;
  let first = true;
  while (y < h) {
    if (!first) pdf.addPage();
    pdf.addImage(img, "JPEG", m, m - y, w, h);
    y += ph - m * 2;
    first = false;
  }
  pdf.save(`smeta-${no}.pdf`);
}

export default function OrderDoc(info: OrderInfo) {
  const { carName, cls, paint, est } = info;
  const { openLead } = useLead();
  const toast = useToast();
  const [busy, setBusy] = useState(false);
  const no = orderNo(est);
  const text = orderText(info);

  const act = async (kind: string) => {
    track("order_" + kind);
    if (kind === "copy") {
      (await copy(text)) ? toast.show("Смета скопирована") : toast.show("Не удалось скопировать");
    } else if (kind === "link") {
      if (navigator.share) {
        navigator.share({ title: `Смета ${no}`, text: `Смета на ремонт ${carName}`, url: info.shareUrl }).catch(() => {});
      } else {
        await copy(info.shareUrl);
        toast.show("Ссылка на смету скопирована");
      }
    } else if (kind === "pdf") {
      setBusy(true);
      try {
        await savePdf(no);
      } catch {
        window.print();
      }
      setBusy(false);
    } else if (kind === "print") {
      window.print();
    } else if (kind === "tg") {
      if (links.telegram) {
        await copy(text);
        toast.show("Смета скопирована — вставьте её в чат");
        window.open(links.telegram, "_blank");
      } else {
        window.open(`https://t.me/share/url?url=${encodeURIComponent(info.shareUrl)}&text=${encodeURIComponent(text)}`, "_blank");
      }
    } else if (kind === "max") {
      await copy(text);
      if (links.max) {
        toast.show("Смета скопирована — вставьте её в чат MAX");
        window.open(links.max, "_blank");
      } else toast.show(`Смета скопирована. Найдите нас в MAX по номеру ${SITE.phoneHuman}`);
    } else if (kind === "ig") {
      await copy(text);
      toast.show("Смета скопирована — вставьте её в сообщение");
      window.open(links.instagramDm, "_blank");
    } else if (kind === "lead") {
      openLead({
        title: "Записаться на осмотр",
        subtitle: `Смета ${fmt(est.total)} для ${carName}. Мастер перезвонит, уточнит детали и предложит время.`,
        estimate: text,
        source: "calculator",
      });
    }
  };

  const btn = "flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/[0.04] px-3 py-3 text-[13.5px] font-semibold text-white transition-all hover:-translate-y-0.5 hover:border-white/25 hover:bg-white/[0.08]";

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_300px] lg:items-start">
      {/* документ */}
      <div
        id="order-print"
        className="overflow-hidden rounded-[22px] bg-white text-[#14161a] shadow-[0_40px_100px_-40px_rgba(255,90,31,.45)]"
        style={{ fontFamily: "Onest, system-ui, sans-serif" }}
      >
        <div className="flex flex-wrap items-start justify-between gap-4 border-b-4 border-[#ff5a1f] bg-[#0e0f12] px-6 py-5 text-white sm:px-8">
          <div>
            <div style={{ fontFamily: "Unbounded, sans-serif" }} className="text-[15px] font-bold tracking-wide uppercase">
              {SITE.name}
            </div>
            <div className="mt-1 text-[12px] text-white/60">
              {SITE.city}, {SITE.street} · {SITE.phoneHuman}
            </div>
          </div>
          <div className="text-right">
            <div className="text-[10px] tracking-[0.2em] text-white/50 uppercase">Предварительный</div>
            <div style={{ fontFamily: "Unbounded, sans-serif" }} className="text-[15px] font-bold">
              ЗАКАЗ-НАРЯД № {no}
            </div>
            <div className="text-[12px] text-white/60">от {today()}</div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-x-6 gap-y-3 px-6 pt-5 text-[13px] sm:grid-cols-3 sm:px-8">
          <div>
            <div className="text-[10.5px] tracking-wider text-[#8a8f99] uppercase">Автомобиль</div>
            <div className="font-semibold">{carName}</div>
          </div>
          <div>
            <div className="text-[10.5px] tracking-wider text-[#8a8f99] uppercase">Класс</div>
            <div className="font-semibold">{CAR_CLASSES[cls].label}</div>
          </div>
          <div>
            <div className="text-[10.5px] tracking-wider text-[#8a8f99] uppercase">Краска</div>
            <div className="font-semibold">{PAINT_TYPES.find((p) => p.id === paint)!.label}</div>
          </div>
        </div>

        <div className="px-4 pt-5 sm:px-8">
          <table className="w-full border-collapse text-[13px]">
            <thead>
              <tr className="border-b-2 border-[#14161a] text-left text-[10.5px] tracking-wider text-[#5b606b] uppercase">
                <th className="w-8 py-2 pr-2 font-semibold">№</th>
                <th className="py-2 pr-2 font-semibold">Наименование работ</th>
                <th className="py-2 text-right font-semibold">Сумма, ₽</th>
              </tr>
            </thead>
            <tbody>
              {est.rows.map((r, i) => (
                <tr key={r.part.id} className="border-b border-[#e6e7ea] align-top">
                  <td className="py-3 pr-2">
                    <span className="inline-grid h-5 w-5 place-items-center rounded-full text-[10.5px] font-bold" style={{ background: r.damage.color }}>
                      {i + 1}
                    </span>
                  </td>
                  <td className="py-3 pr-2">
                    <div className="font-semibold">{r.part.name}</div>
                    <div className="text-[12px] text-[#6b707a]">
                      {r.damage.title}
                      {r.damage.sized ? ` · ${SIZES.find((s) => s.id === r.size)!.label.toLowerCase()}` : ""}
                    </div>
                    <ul className="mt-1.5 space-y-0.5">
                      {r.lines.map((l, j) => (
                        <li key={j} className="flex justify-between gap-3 text-[12.5px] text-[#3a3e46]">
                          <span>— {l.title}</span>
                          <span className="whitespace-nowrap tabular-nums">{fmt(l.price)}</span>
                        </li>
                      ))}
                    </ul>
                  </td>
                  <td className="py-3 text-right font-semibold whitespace-nowrap tabular-nums">{fmt(r.total)}</td>
                </tr>
              ))}
              {est.extras.map((e) => (
                <tr key={e.extra.id} className="border-b border-[#e6e7ea] align-top">
                  <td className="py-3 pr-2 text-[#8a8f99]">+</td>
                  <td className="py-3 pr-2">
                    <div className="font-semibold">{e.extra.title}</div>
                    <div className="text-[12px] text-[#6b707a]">{e.extra.note}</div>
                  </td>
                  <td className="py-3 text-right font-semibold whitespace-nowrap tabular-nums">{fmt(e.price)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="px-6 py-5 sm:px-8">
          <div className="ml-auto max-w-sm space-y-1.5 text-[13.5px]">
            <div className="flex justify-between">
              <span className="text-[#5b606b]">Сумма работ</span>
              <span className="tabular-nums">{fmt(est.subtotal)}</span>
            </div>
            {est.discount > 0 && (
              <div className="flex justify-between text-[#0f9d58]">
                <span>Скидка за объём {est.discountPct}%</span>
                <span className="tabular-nums">−{fmt(est.discount)}</span>
              </div>
            )}
            <div className="flex items-end justify-between border-t-2 border-[#14161a] pt-2">
              <span className="font-bold uppercase">Итого</span>
              <span style={{ fontFamily: "Unbounded, sans-serif" }} className="text-[22px] font-bold tabular-nums">
                {fmt(est.total)}
              </span>
            </div>
            <div className="flex justify-between text-[12px] text-[#6b707a]">
              <span>Диапазон после осмотра</span>
              <span className="tabular-nums">
                {fmt(est.min)} – {fmt(est.max)}
              </span>
            </div>
            <div className="flex justify-between text-[12px] text-[#6b707a]">
              <span>Ориентировочный срок</span>
              <span>
                {est.hours[0]}–{est.hours[1]} раб. дн.
              </span>
            </div>
          </div>
        </div>

        <div className="border-t border-dashed border-[#d6d7db] px-6 py-4 text-[11px] leading-relaxed text-[#8a8f99] sm:px-8">
          Смета предварительная и не является публичной офертой. Окончательная стоимость определяется после бесплатного осмотра автомобиля мастером. Стоимость запчастей не включена.
          Цены действительны 14 дней.
          <div className="mt-4 grid grid-cols-2 gap-8 text-[#5b606b]">
            <div className="border-t border-[#c4c6cc] pt-1">Мастер</div>
            <div className="border-t border-[#c4c6cc] pt-1">Клиент</div>
          </div>
        </div>
      </div>

      {/* действия */}
      <div className="no-print lg:sticky lg:top-24">
        <button onClick={() => act("lead")} className="btn btn-lava w-full !py-4 text-[15.5px]">
          <Send className="h-5 w-5" /> Записаться на осмотр
        </button>
        <div className="mt-2 text-center text-[12px] text-fog-500">Бесплатно · смета будет приложена</div>

        <div className="mt-5 mb-2 text-[12px] font-semibold tracking-wider text-fog-500 uppercase">Отправить нам</div>
        <div className="grid grid-cols-3 gap-2">
          <button onClick={() => act("tg")} className={btn + " flex-col !gap-1 hover:!border-[#229ED9]"}>
            <TelegramIcon className="h-5 w-5 text-[#29a9eb]" />
            <span className="text-[12px]">Telegram</span>
          </button>
          <button onClick={() => act("max")} className={btn + " flex-col !gap-1 hover:!border-[#7b3cff]"}>
            <MaxIcon className="h-5 w-5 text-[#9a6bff]" />
            <span className="text-[12px]">MAX</span>
          </button>
          <button onClick={() => act("ig")} className={btn + " flex-col !gap-1 hover:!border-[#d62976]"}>
            <InstagramIcon className="h-5 w-5 text-[#e1306c]" />
            <span className="text-[12px]">Instagram*</span>
          </button>
        </div>

        <div className="mt-5 mb-2 text-[12px] font-semibold tracking-wider text-fog-500 uppercase">Сохранить</div>
        <div className="grid grid-cols-2 gap-2">
          <button onClick={() => act("pdf")} className={btn} disabled={busy}>
            <FileDown className="h-4 w-4" /> {busy ? "Готовим…" : "PDF"}
          </button>
          <button onClick={() => act("print")} className={btn}>
            <Printer className="h-4 w-4" /> Печать
          </button>
          <button onClick={() => act("copy")} className={btn}>
            <Copy className="h-4 w-4" /> Копировать
          </button>
          <button onClick={() => act("link")} className={btn}>
            <Link2 className="h-4 w-4" /> Ссылка
          </button>
        </div>
        <a href={links.tel} onClick={() => track("call")} className="mt-5 block rounded-2xl border border-white/10 p-4 text-center transition-colors hover:border-white/25">
          <div className="text-[12px] text-fog-500">Или позвоните мастеру</div>
          <div className="mt-1 font-display text-lg font-bold text-white">{SITE.phoneHuman}</div>
        </a>
      </div>
      {toast.node}
    </div>
  );
}
