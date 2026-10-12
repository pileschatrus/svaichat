import { useEffect } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import { SITE_URL, metaFor } from "./seo";
import { LeadProvider } from "./components/Lead";
import { Footer, Header, MobileBar } from "./components/Layout";
import Home from "./pages/Home";
import {
  ArticlePage,
  ArticlesPage,
  BrandPage,
  BrandsPage,
  CalculatorPage,
  ContactsPage,
  FaqPage,
  ModelPage,
  NotFound,
  PricesPage,
  PrivacyPage,
  ServicePage,
  ServicesPage,
  WorksPage,
} from "./pages/Pages";

function setTag(sel: string, attr: string, value: string, create: () => HTMLElement) {
  let el = document.head.querySelector(sel) as HTMLElement | null;
  if (!el) {
    el = create();
    document.head.appendChild(el);
  }
  el.setAttribute(attr, value);
}

// Обновление title/description/canonical при переходах внутри SPA.
function useClientMeta() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    const m = metaFor(pathname);
    document.title = m.title;
    setTag('meta[name="description"]', "content", m.description, () => Object.assign(document.createElement("meta"), { name: "description" }));
    setTag('link[rel="canonical"]', "href", SITE_URL(m.path), () => Object.assign(document.createElement("link"), { rel: "canonical" }));
    setTag('meta[property="og:title"]', "content", m.title, () => {
      const e = document.createElement("meta");
      e.setAttribute("property", "og:title");
      return e;
    });
    setTag('meta[property="og:url"]', "content", SITE_URL(m.path), () => {
      const e = document.createElement("meta");
      e.setAttribute("property", "og:url");
      return e;
    });
  }, [pathname]);

  useEffect(() => {
    if (hash && !hash.startsWith("#s=")) {
      const el = document.getElementById(hash.slice(1));
      if (el) setTimeout(() => el.scrollIntoView({ behavior: "smooth" }), 50);
    } else if (!hash) window.scrollTo(0, 0);
  }, [pathname, hash]);
}

export default function App() {
  useClientMeta();
  return (
    <LeadProvider>
      <div className="min-h-screen overflow-x-clip">
        <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[100] focus:rounded-lg focus:bg-white focus:px-3 focus:py-2 focus:text-black">
          К содержимому
        </a>
        <Header />
        <main id="main">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/kalkulyator/" element={<CalculatorPage />} />
            <Route path="/uslugi/" element={<ServicesPage />} />
            <Route path="/uslugi/:slug/" element={<ServicePage />} />
            <Route path="/ceny/" element={<PricesPage />} />
            <Route path="/marki/" element={<BrandsPage />} />
            <Route path="/marki/:brand/" element={<BrandPage />} />
            <Route path="/marki/:brand/:model/" element={<ModelPage />} />
            <Route path="/raboty/" element={<WorksPage />} />
            <Route path="/stati/" element={<ArticlesPage />} />
            <Route path="/stati/:slug/" element={<ArticlePage />} />
            <Route path="/voprosy/" element={<FaqPage />} />
            <Route path="/kontakty/" element={<ContactsPage />} />
            <Route path="/politika/" element={<PrivacyPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
        <MobileBar />
      </div>
    </LeadProvider>
  );
}
