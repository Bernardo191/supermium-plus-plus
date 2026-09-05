import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import fs from "fs";

import { componentTagger } from "lovable-tagger";
import { mcpPlugin } from "@lovable.dev/mcp-js/stacks/supabase/vite";

// Emits `aether.html`: a single, fully standalone copy of the app with all
// CSS and JS inlined, so it runs when opened straight from disk.
const standaloneHtml = (): Plugin => ({
  name: "aether-standalone-html",
  apply: "build",
  enforce: "post",
  generateBundle(_options, bundle) {
    const html = bundle["index.html"];
    if (!html || html.type !== "asset") return;

    let out = String(html.source);
    for (const file of Object.values(bundle)) {
      const name = file.fileName;
      if (file.type === "asset" && name.endsWith(".css")) {
        const css = `<style>${String(file.source).replace(/<\/style/gi, "<\\/style")}</style>`;
        out = out.replace(
          new RegExp(`<link[^>]+href="/?${name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}"[^>]*>`),
          () => css,
        );
      }
      if (file.type === "chunk" && file.isEntry) {
        const js = `<script type="module">${file.code.replace(/<\/script/gi, "<\\/script")}</script>`;
        out = out.replace(
          new RegExp(`<script[^>]+src="/?${name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}"[^>]*></script>`),
          () => js,
        );
      }

    }
    // Drop preload hints and the favicon link — nothing external must be fetched.
    out = out
      .replace(/<link rel="modulepreload"[^>]*>/g, "")
      .replace(/<link rel="icon"[^>]*>/g, "");

    // Inline the Aether logo so the new tab page renders offline.
    try {
      const png = fs.readFileSync(path.resolve(__dirname, "public/favicon.png")).toString("base64");
      const dataUri = `data:image/png;base64,${png}`;
      out = out.replace(/"[^"]*\/(?:aether-logo|favicon)\.png"/g, () => JSON.stringify(dataUri));
    } catch {
      // logo missing — the standalone file still works
    }

    this.emitFile({ type: "asset", fileName: "aether.html", source: out });

  },
});

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false,
    },
  },
  plugins: [react(), mode === "development" && componentTagger(), mcpPlugin(), standaloneHtml()].filter(Boolean),

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
    dedupe: ["react", "react-dom", "react/jsx-runtime", "react/jsx-dev-runtime", "@tanstack/react-query", "@tanstack/query-core"],
  },
}));
