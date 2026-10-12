import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { viteSingleFile } from "vite-plugin-singlefile";

// npm run demo → dist-demo/demo.html: весь сайт в одном файле для предпросмотра
export default defineConfig({
  plugins: [react(), tailwindcss(), viteSingleFile()],
  build: { outDir: "dist-demo", target: "es2019", rollupOptions: { input: "demo.html" } },
});
