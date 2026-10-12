// Статическая генерация: каждая страница сайта получает готовый HTML
// с title, description, canonical, Open Graph и JSON-LD — это важно для
// индексации Яндексом и Google. После загрузки React «оживляет» страницу.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dist = path.join(root, "dist");
const ssr = await import(pathToFileURL(path.join(root, "dist-ssr", "entry-server.js")).href);
const { render, allPaths, metaFor, SITE_URL, SITE } = ssr;

const template = fs.readFileSync(path.join(dist, "index.html"), "utf8");
const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");

const metrika = SITE.metrikaId
  ? `<script>(function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};m[i].l=1*new Date();k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})(window,document,"script","https://mc.yandex.ru/metrika/tag.js","ym");ym(${SITE.metrikaId},"init",{clickmap:true,trackLinks:true,accurateTrackBounce:true,webvisor:true});</script>`
  : "";

function head(m) {
  const url = SITE_URL(m.path);
  return [
    `<meta name="description" content="${esc(m.description)}" />`,
    `<link rel="canonical" href="${url}" />`,
    m.noindex ? `<meta name="robots" content="noindex" />` : "",
    `<meta property="og:type" content="website" />`,
    `<meta property="og:locale" content="ru_RU" />`,
    `<meta property="og:site_name" content="${esc(SITE.name)}" />`,
    `<meta property="og:title" content="${esc(m.title)}" />`,
    `<meta property="og:description" content="${esc(m.description)}" />`,
    `<meta property="og:url" content="${url}" />`,
    `<meta property="og:image" content="${SITE_URL("/og.png")}" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    ...m.jsonLd.map((j) => `<script type="application/ld+json">${JSON.stringify(j).replace(/</g, "\\u003c")}</script>`),
  ]
    .filter(Boolean)
    .join("\n    ");
}

function page(url, m) {
  return template
    .replace(/<title>.*?<\/title>/, `<title>${esc(m.title)}</title>`)
    .replace("<!--head-->", head(m))
    .replace("<!--metrika-->", metrika)
    .replace("<!--app-->", render(url));
}

const paths = allPaths();
for (const p of paths) {
  const m = metaFor(p);
  const out = path.join(dist, p, "index.html");
  fs.mkdirSync(path.dirname(out), { recursive: true });
  fs.writeFileSync(out, page(p, m));
}
fs.writeFileSync(path.join(dist, "404.html"), page("/404/", metaFor("/404/")));

const today = new Date().toISOString().slice(0, 10);
fs.writeFileSync(
  path.join(dist, "sitemap.xml"),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
    paths
      .filter((p) => !metaFor(p).noindex)
      .map((p) => `  <url><loc>${SITE_URL(p)}</loc><lastmod>${today}</lastmod><priority>${(metaFor(p).priority ?? 0.5).toFixed(1)}</priority></url>`)
      .join("\n") +
    `\n</urlset>\n`,
);
fs.writeFileSync(
  path.join(dist, "robots.txt"),
  `User-agent: *\nAllow: /\nDisallow: /send.php\nClean-param: s&utm_source&utm_medium&utm_campaign&utm_content&utm_term&yclid&gclid\n\nSitemap: ${SITE_URL("/sitemap.xml")}\n`,
);
console.log(`prerendered ${paths.length} pages + 404, sitemap.xml, robots.txt`);
