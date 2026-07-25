import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, EyeOff, Shield, Plus, X } from "lucide-react";
import { cn } from "@/lib/utils";

type IncogTab = { id: string; url: string; input: string; title: string };

const makeTab = (): IncogTab => ({
  id: crypto.randomUUID(),
  url: "",
  input: "",
  title: "New Incognito Tab",
});

const Incognito = () => {
  const [tabs, setTabs] = useState<IncogTab[]>([makeTab()]);
  const [activeId, setActiveId] = useState<string>(() => "");

  useEffect(() => {
    setActiveId(tabs[0].id);
    document.title = "Incognito — Aether";
    document.documentElement.classList.add("dark");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const active = tabs.find((t) => t.id === activeId) ?? tabs[0];
  const update = (id: string, patch: Partial<IncogTab>) =>
    setTabs((ts) => ts.map((t) => (t.id === id ? { ...t, ...patch } : t)));

  const newTab = () => {
    const t = makeTab();
    setTabs((ts) => [...ts, t]);
    setActiveId(t.id);
  };

  const closeTab = (id: string) => {
    setTabs((ts) => {
      const idx = ts.findIndex((t) => t.id === id);
      const next = ts.filter((t) => t.id !== id);
      if (next.length === 0) {
        try { window.close(); } catch {}
        const fresh = makeTab();
        setActiveId(fresh.id);
        return [fresh];
      }
      if (id === activeId) setActiveId(next[Math.max(0, idx - 1)].id);
      return next;
    });
  };

  const go = (e: React.FormEvent) => {
    e.preventDefault();
    if (!active) return;
    let v = active.input.trim();
    if (!v) return;
    if (/\s/.test(v) || (!v.includes(".") && !v.startsWith("http"))) {
      v = `https://duckduckgo.com/?q=${encodeURIComponent(v)}`;
    } else if (!/^https?:\/\//i.test(v)) v = `https://${v}`;
    let title = "Incognito";
    try { title = new URL(v).hostname; } catch {}
    update(active.id, { url: v, title });
  };

  if (!active) return null;

  return (
    <main className="flex h-screen flex-col bg-[hsl(240_15%_8%)] text-foreground">
      <div className="flex items-end gap-1 px-2 pt-2 bg-[hsl(240_15%_10%)] select-none">
        <Link to="/" className="mr-1 mb-1 rounded-full p-1.5 hover:bg-muted" title="Back to main window">
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <div className="flex flex-1 items-end gap-0.5 min-w-0">
          {tabs.map((t) => {
            const isActive = t.id === activeId;
            return (
              <div
                key={t.id}
                onClick={() => setActiveId(t.id)}
                onAuxClick={(e) => { if (e.button === 1) closeTab(t.id); }}
                title={t.title}
                className={cn(
                  "tab-shape group relative flex h-9 min-w-0 flex-1 basis-0 cursor-pointer items-center gap-2 px-3 text-xs max-w-[240px]",
                  isActive
                    ? "bg-[hsl(240_15%_18%)] text-foreground z-10"
                    : "bg-[hsl(240_15%_12%)] text-muted-foreground hover:bg-[hsl(240_15%_15%)]"
                )}
              >
                <EyeOff className="h-3.5 w-3.5 shrink-0" />
                <span className="flex-1 truncate min-w-0">{t.title}</span>
                <button
                  onClick={(e) => { e.stopPropagation(); closeTab(t.id); }}
                  className="rounded-full p-0.5 opacity-60 hover:bg-foreground/10 hover:opacity-100 shrink-0"
                  aria-label="Close tab"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            );
          })}
          <button
            onClick={newTab}
            className="ml-1 mb-1 shrink-0 rounded-full p-1.5 text-muted-foreground hover:bg-muted"
            title="New incognito tab"
            aria-label="New incognito tab"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
      </div>

      <header className="flex items-center gap-3 border-b border-border bg-[hsl(240_15%_12%)] px-4 py-2">
        <EyeOff className="h-5 w-5" />
        <form onSubmit={go} className="flex-1 flex items-center gap-2 rounded-full bg-[hsl(240_15%_18%)] px-4 py-1.5">
          <Shield className="h-4 w-4 text-muted-foreground" />
          <input
            value={active.input}
            onChange={(e) => update(active.id, { input: e.target.value })}
            placeholder="Search privately with DuckDuckGo"
            className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
          />
        </form>
      </header>

      {active.url ? (
        <iframe
          key={active.id}
          src={active.url}
          title={active.title}
          className="flex-1 w-full bg-white"
          sandbox="allow-scripts allow-same-origin allow-forms"
        />
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center text-center px-6">
          <div className="rounded-full bg-[hsl(240_15%_18%)] p-6 mb-6"><EyeOff className="h-12 w-12" /></div>
          <h1 className="text-2xl font-semibold mb-2">You've gone incognito</h1>
          <p className="text-muted-foreground max-w-md">
            Pages you view in this window won't appear in your browser history or downloads list.
            Search uses DuckDuckGo. Close the window to end the session.
          </p>
        </div>
      )}
    </main>
  );
};

export default Incognito;
