import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, AppWindow, Code2, Copy, Download, FileArchive, FileCode2, Search } from "lucide-react";
import JSZip from "jszip";
import { toast } from "sonner";

// Aether's own source code, inlined at build time.
const modules = {
  ...(import.meta.glob("/src/**/*.{ts,tsx,css}", { query: "?raw", import: "default", eager: true }) as Record<string, string>),
  ...(import.meta.glob("/*.{html,json,ts,js,md}", { query: "?raw", import: "default", eager: true }) as Record<string, string>),
};

const FILES = Object.entries(modules)
  .map(([path, code]) => ({ path: path.replace(/^\//, ""), code }))
  .sort((a, b) => a.path.localeCompare(b.path));

const escapeHtml = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

const saveFile = (name: string, content: string, type: string) => {
  const href = URL.createObjectURL(new Blob([content], { type: `${type};charset=utf-8` }));
  const a = document.createElement("a");
  a.href = href;
  a.download = name;
  a.click();
  URL.revokeObjectURL(href);
  toast.success(`Downloaded ${name}`);
};

const SourcePage = () => {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(FILES[0]?.path ?? "");
  const [zipping, setZipping] = useState(false);
  const [buildingApp, setBuildingApp] = useState(false);

  const filtered = useMemo(
    () => FILES.filter((f) => f.path.toLowerCase().includes(query.trim().toLowerCase())),
    [query],
  );
  const current = FILES.find((f) => f.path === selected) ?? filtered[0];

  const copyCurrent = () => {
    if (!current) return;
    navigator.clipboard.writeText(current.code).then(
      () => toast.success("Source copied to clipboard"),
      () => toast.error("Could not copy source"),
    );
  };

  const downloadCurrent = () => {
    if (!current) return;
    saveFile(current.path.split("/").pop() || "source.txt", current.code, "text/plain");
  };

  const buildHtml = () => {
    const body = FILES.map(
      (f) =>
        `<section><h2 id="${encodeURIComponent(f.path)}">${escapeHtml(f.path)}</h2><pre>${escapeHtml(f.code)}</pre></section>`,
    ).join("\n");
    const html = `<!DOCTYPE html>
<html lang="en"><head><meta charset="utf-8"><title>Aether source code</title>
<style>body{font:14px/1.5 ui-monospace,SFMono-Regular,Menlo,monospace;background:#111;color:#eee;margin:0;padding:24px}h1{font-size:20px}h2{font-size:13px;color:#8ab4f8;margin-top:32px}pre{white-space:pre-wrap;word-break:break-word;background:#1b1b1b;padding:12px;border-radius:8px;overflow:auto}</style>
</head><body><h1>Aether browser — source code (${FILES.length} files)</h1>
${body}
</body></html>`;
    return html;
  };

  // Builds a single, runnable HTML file that *is* Aether (app assets inlined).
  const APP_BASE = import.meta.env.DEV ? "https://supermium-plus-plus.lovable.app" : window.location.origin;

  const buildAppHtml = async () => {
    const res = await fetch(`${APP_BASE}/index.html`, { cache: "no-store" });
    if (!res.ok) throw new Error("Could not fetch the app shell");
    const doc = new DOMParser().parseFromString(await res.text(), "text/html");

    // Keep a base so lazily-imported chunks still resolve.
    const base = doc.createElement("base");
    base.setAttribute("href", `${APP_BASE}/`);
    doc.head.prepend(base);

    const inline = async (url: string) => {
      const r = await fetch(new URL(url, `${APP_BASE}/`).href, { cache: "no-store" });
      return r.ok ? await r.text() : null;
    };

    for (const link of Array.from(doc.querySelectorAll('link[rel="stylesheet"][href]'))) {
      const css = await inline(link.getAttribute("href")!);
      if (css == null) continue;
      const style = doc.createElement("style");
      style.textContent = css;
      link.replaceWith(style);
    }

    for (const script of Array.from(doc.querySelectorAll("script[src]"))) {
      const src = script.getAttribute("src")!;
      if (/^https?:/i.test(src) && !src.startsWith(APP_BASE)) continue;
      const js = await inline(src);
      if (js == null) continue;
      const el = doc.createElement("script");
      if (script.getAttribute("type")) el.setAttribute("type", script.getAttribute("type")!);
      el.textContent = js;
      script.replaceWith(el);
    }

    return "<!DOCTYPE html>\n" + doc.documentElement.outerHTML;
  };

  const downloadAppHtml = async () => {
    setBuildingApp(true);
    try {
      saveFile("aether.html", await buildAppHtml(), "text/html");
    } catch {
      toast.error("Could not build the Aether HTML app");
    } finally {
      setBuildingApp(false);
    }
  };

  const downloadAllHtml = () => {
    saveFile("aether-source.html", buildHtml(), "text/html");
  };


  const downloadZip = async () => {
    setZipping(true);
    try {
      const zip = new JSZip();
      for (const f of FILES) zip.file(f.path, f.code);
      zip.file("aether-source.html", buildHtml());
      try {
        zip.file("aether.html", await buildAppHtml()); // runnable single-file app
      } catch {
        // offline / unpublished build: source files are still included
      }
      const blob = await zip.generateAsync({ type: "blob", compression: "DEFLATE" });
      const href = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = href;
      a.download = "aether-browser-source.zip";
      a.click();
      URL.revokeObjectURL(href);
      toast.success("Downloaded aether-browser-source.zip");
    } catch {
      toast.error("Could not build ZIP");
    } finally {
      setZipping(false);
    }
  };

  return (
    <div className="flex h-full min-h-screen flex-col bg-background text-foreground">
      <header className="border-b border-border bg-card">
        <div className="flex items-center gap-3 px-6 py-4">
          <Link to="/" className="rounded-md p-2 hover:bg-muted" aria-label="Back">
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <Code2 className="h-5 w-5 text-primary" />
          <h1 className="text-xl font-semibold">Aether source code</h1>
          <span className="ml-auto text-xs text-muted-foreground">aether://source</span>
        </div>
      </header>

      <div className="flex min-h-0 flex-1 flex-col gap-4 p-6 lg:flex-row">
        <aside className="flex w-full min-h-0 flex-col rounded-xl border border-border bg-card lg:w-80">
          <div className="flex items-center gap-2 border-b border-border px-3 py-2">
            <Search className="h-4 w-4 text-muted-foreground" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Filter files…"
              className="w-full bg-transparent text-sm outline-none"
            />
          </div>
          <div className="max-h-[50vh] overflow-auto lg:max-h-none lg:flex-1">
            {filtered.map((f) => (
              <button
                key={f.path}
                onClick={() => setSelected(f.path)}
                className={`flex w-full items-center gap-2 px-3 py-1.5 text-left text-xs hover:bg-muted ${
                  current?.path === f.path ? "bg-muted font-medium text-primary" : "text-muted-foreground"
                }`}
              >
                <FileCode2 className="h-3.5 w-3.5 shrink-0" />
                <span className="truncate">{f.path.replace(/^src\//, "")}</span>
              </button>
            ))}
            {filtered.length === 0 && (
              <p className="px-3 py-4 text-xs text-muted-foreground">No files match “{query}”.</p>
            )}
          </div>
          <div className="border-t border-border p-3">
            <button
              onClick={downloadAppHtml}
              disabled={buildingApp}
              className="flex w-full items-center justify-center gap-2 rounded-md bg-primary px-3 py-2 text-xs font-medium text-primary-foreground hover:opacity-90 disabled:opacity-50"
            >
              <AppWindow className="h-3.5 w-3.5" /> {buildingApp ? "Building app…" : "Download Aether as app (HTML)"}
            </button>
            <button
              onClick={downloadAllHtml}
              className="mt-2 flex w-full items-center justify-center gap-2 rounded-md border border-border px-3 py-2 text-xs font-medium hover:bg-muted"
            >
              <Download className="h-3.5 w-3.5" /> Download source listing (HTML)
            </button>
            <button
              onClick={downloadZip}
              disabled={zipping}
              className="mt-2 flex w-full items-center justify-center gap-2 rounded-md border border-border px-3 py-2 text-xs font-medium hover:bg-muted disabled:opacity-50"
            >
              <FileArchive className="h-3.5 w-3.5" /> {zipping ? "Building ZIP…" : "Download ZIP (all files)"}
            </button>
          </div>
        </aside>

        <section className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-xl border border-border bg-card">
          <header className="flex items-center gap-2 border-b border-border px-4 py-2">
            <span className="min-w-0 flex-1 truncate font-mono text-xs text-muted-foreground">
              {current?.path ?? "—"}
            </span>
            <button
              onClick={copyCurrent}
              disabled={!current}
              className="flex items-center gap-1 rounded-md border border-border px-2 py-1 text-xs hover:bg-muted disabled:opacity-40"
            >
              <Copy className="h-3.5 w-3.5" /> Copy
            </button>
            <button
              onClick={downloadCurrent}
              disabled={!current}
              className="flex items-center gap-1 rounded-md border border-border px-2 py-1 text-xs hover:bg-muted disabled:opacity-40"
            >
              <Download className="h-3.5 w-3.5" /> Download file
            </button>
          </header>
          <div className="min-h-0 flex-1 overflow-auto bg-muted/30">
            <pre className="whitespace-pre-wrap break-words p-4 font-mono text-xs leading-relaxed">
              {current?.code ?? ""}
            </pre>
          </div>
        </section>
      </div>
    </div>
  );
};

export default SourcePage;
