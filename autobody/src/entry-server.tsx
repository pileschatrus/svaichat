import { renderToString } from "react-dom/server";
import { StaticRouter } from "react-router-dom/server";
import App from "./App";

export { allPaths, metaFor, SITE_URL } from "./seo";
export { SITE } from "./config";
export { SERVICES } from "./data/services";
export { BRANDS, POPULAR_MODELS, modelClass } from "./data/cars";
export { ARTICLES } from "./data/articles";
export { CAR_CLASSES } from "./data/pricing";

export function render(url: string) {
  return renderToString(
    <StaticRouter location={url}>
      <App />
    </StaticRouter>,
  );
}
