import { useEffect, useState } from "react";
import { MaxIcon } from "./icons";
import { LeadProvider, useLead } from "./LeadModal";
import { HOME_SEO, applySeo } from "./regions";
import Header from "./components/Header";
import Hero from "./components/Hero";
import Products from "./components/Products";
import Calculator from "./components/Calculator";
import Regions from "./components/Regions";
import ForBuilders from "./components/ForBuilders";
import Gallery from "./components/Gallery";
import Community from "./components/Community";
import Faq from "./components/Faq";
import Footer from "./components/Footer";
import RegionPage from "./components/RegionPage";

type Route = { page: "home" | "region"; slug?: string };

function parseRoute(): Route {
  const h = window.location.hash;
  const m = h.match(/^#\/region\/([a-z0-9-]+)/i);
  if (m) return { page: "region", slug: m[1] };
  return { page: "home" };
}

function FloatLead() {
  const { openLead } = useLead();
  return (
    <button
      onClick={() =>
        openLead({
          title: "Оставить заявку в Свайчат",
          subtitle: "Менеджер перезвонит, уточнит задачу и передаст её подрядчикам вашего региона.",
          cta: "Отправить заявку",
        })
      }
      aria-label="Оставить заявку в MAX"
      className="group fixed bottom-6 right-6 z-40 grid h-14 w-14 place-items-center bg-safety-500 text-ink-950 shadow-[0_16px_40px_-10px_rgba(37,211,102,0.6)] transition-transform hover:-translate-y-1 hover:scale-105"
    >
      <span
        className="absolute inset-0 bg-safety-500"
        style={{ animation: "ping-soft 2.4s cubic-bezier(0,0,0.2,1) infinite" }}
      />
      <MaxIcon className="relative h-7 w-7" />
    </button>
  );
}

export default function App() {
  const [route, setRoute] = useState<Route>(parseRoute);

  useEffect(() => {
    const onHash = () => {
      const r = parseRoute();
      setRoute(r);
      const h = window.location.hash;
      if (r.page === "home" && h && !h.startsWith("#/")) {
        const id = h.slice(1);
        setTimeout(() => document.getElementById(id)?.scrollIntoView(), 80);
      }
      if (h === "#/regions") {
        setTimeout(() => document.getElementById("regions")?.scrollIntoView(), 80);
      }
    };
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  useEffect(() => {
    if (route.page === "home") applySeo(HOME_SEO);
  }, [route]);

  return (
    <LeadProvider>
      <div className="noise min-h-screen bg-ink-950">
        <Header />
        {route.page === "region" && route.slug ? (
          <main>
            <RegionPage slug={route.slug} />
          </main>
        ) : (
          <main>
            <Hero />
            <Products />
            <Calculator />
            <Regions />
            <ForBuilders />
            <Gallery />
            <Community />
            <Faq />
          </main>
        )}
        <Footer />
        <FloatLead />
      </div>
    </LeadProvider>
  );
}
