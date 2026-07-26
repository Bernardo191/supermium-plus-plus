import { useEffect, useMemo, useState } from "react";
import { TabBar } from "@/components/browser/TabBar";
import { Toolbar } from "@/components/browser/Toolbar";
import { BookmarksBar } from "@/components/browser/BookmarksBar";
import { NewTabPage } from "@/components/browser/NewTabPage";
import { WebView } from "@/components/browser/WebView";
import SettingsPage from "@/pages/Settings";
import FlagsPage from "@/pages/Flags";
import AboutPage from "@/pages/About";
import DownloadsPage from "@/pages/Downloads";
import PasswordsPage from "@/pages/Passwords";
import ExtensionsPage from "@/pages/Extensions";
import { HistoryPanel } from "@/components/browser/HistoryPanel";
import { TabSearch } from "@/components/browser/TabSearch";
import type { ClosedTab } from "@/components/browser/TabSearch";
import { MainMenu } from "@/components/browser/MainMenu";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  Bookmark, HistoryItem, NEW_TAB, Tab, defaultBookmarks, hostnameOf,
  loadBookmarks, loadHistory, newTab, normalizeUrl, saveBookmarks, saveHistory,
} from "@/lib/browser-store";
import { useSettings, type ChromeTheme } from "@/lib/settings-store";


const Index = () => {
  const routerNav = useNavigate();
  const [settings] = useSettings();
  const [tabs, setTabs] = useState<Tab[]>([newTab()]);
  const [activeId, setActiveId] = useState<string>(() => "");
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [dark, setDark] = useState(false);
  const [showTabSearch, setShowTabSearch] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [showBookmarks, setShowBookmarks] = useState(true);
  const [closedTabs, setClosedTabs] = useState<ClosedTab[]>([]);

  // init
  useEffect(() => {
    setActiveId(tabs[0].id);
    const bm = loadBookmarks();
    setBookmarks(bm.length ? bm : defaultBookmarks);
    setHistory(loadHistory());
    document.title = "Aether — Web";
    try { document.documentElement.lang = (localStorage.getItem("aether_locale") || (navigator.language || "en")).toLowerCase().startsWith("pt") ? "pt-BR" : "en"; } catch {}
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  // Apply legacy chrome theme classes to the root element
  useEffect(() => {
    const root = document.documentElement;
    const legacyThemes: ChromeTheme[] = ["legacy-2010", "legacy-2016", "legacy-2018", "legacy-2021"];
    legacyThemes.forEach((t) => root.classList.remove(`theme-${t}`));
    if (settings.theme !== "modern") root.classList.add(`theme-${settings.theme}`);
  }, [settings.theme]);

  // Sync bookmarks-bar visibility with settings
  useEffect(() => { setShowBookmarks(settings.showBookmarksBar); }, [settings.showBookmarksBar]);


  useEffect(() => { saveBookmarks(bookmarks); }, [bookmarks]);
  useEffect(() => { saveHistory(history); }, [history]);

  const active = useMemo(() => tabs.find((t) => t.id === activeId) ?? tabs[0], [tabs, activeId]);

  const updateTab = (id: string, patch: Partial<Tab>) =>
    setTabs((ts) => ts.map((t) => (t.id === id ? { ...t, ...patch } : t)));

  const internalTitle = (url: string): string | null => {
    switch (url) {
      case "aether://settings": return "Settings";
      case "aether://flags": return "Experiments";
      case "aether://about": return "About Aether";
      case "aether://downloads": return "Downloads";
      case "aether://passwords": return "Passwords";
      case "aether://extensions": return "Extensions";
      default: return null;
    }
  };

  const navigate = (raw: string) => {
    const url = normalizeUrl(raw);
    if (!active) return;

    const newHist = [...active.history.slice(0, active.historyIndex + 1), url];
    const internal = internalTitle(url);
    updateTab(active.id, {
      url,
      history: newHist,
      historyIndex: newHist.length - 1,
      title: url === NEW_TAB ? "New Tab" : internal ?? hostnameOf(url),
    });
    if (url !== NEW_TAB && !internal) {
      setHistory((h) => [{ id: crypto.randomUUID(), title: hostnameOf(url), url, visitedAt: Date.now() }, ...h]);
    }
  };

  const openNewTab = (url: string = NEW_TAB) => {
    const t = newTab(url);
    const internal = internalTitle(url);
    if (internal) t.title = internal;
    setTabs((ts) => [...ts, t]);
    setActiveId(t.id);
    if (url !== NEW_TAB && !internal) {
      setHistory((h) => [{ id: crypto.randomUUID(), title: hostnameOf(url), url, visitedAt: Date.now() }, ...h]);
    }
  };

  const closeTab = (id: string) => {
    setTabs((ts) => {
      const idx = ts.findIndex((t) => t.id === id);
      const closing = ts[idx];
      if (closing && closing.url !== NEW_TAB) {
        setClosedTabs((c) => [
          { id: crypto.randomUUID(), title: closing.title, url: closing.url, closedAt: Date.now() },
          ...c,
        ].slice(0, 25));
      }
      const next = ts.filter((t) => t.id !== id);
      if (next.length === 0) {
        const fresh = newTab();
        setActiveId(fresh.id);
        return [fresh];
      }
      if (id === activeId) setActiveId(next[Math.max(0, idx - 1)].id);
      return next;
    });
  };

  const reopenLastClosed = () => {
    setClosedTabs((c) => {
      if (c.length === 0) return c;
      const [first, ...rest] = c;
      openNewTab(first.url);
      return rest;
    });
  };

  const back = () => {
    if (!active || active.historyIndex <= 0) return;
    const i = active.historyIndex - 1;
    updateTab(active.id, { historyIndex: i, url: active.history[i] });
  };
  const forward = () => {
    if (!active || active.historyIndex >= active.history.length - 1) return;
    const i = active.historyIndex + 1;
    updateTab(active.id, { historyIndex: i, url: active.history[i] });
  };
  const reload = () => active && updateTab(active.id, { url: active.url + "" });

  const isBookmarked = !!bookmarks.find((b) => b.url === active?.url);
  const toggleBookmark = () => {
    if (!active || active.url === NEW_TAB) return;
    if (isBookmarked) setBookmarks((bs) => bs.filter((b) => b.url !== active.url));
    else setBookmarks((bs) => [...bs, { id: crypto.randomUUID(), title: active.title || hostnameOf(active.url), url: active.url }]);
  };

  // Keyboard shortcuts: Ctrl/Cmd+Shift+A (tab search), Ctrl/Cmd+T (new tab), Ctrl/Cmd+W (close tab)
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const mod = e.ctrlKey || e.metaKey;
      if (mod && e.shiftKey && e.key.toLowerCase() === "a") {
        e.preventDefault();
        if (settings.theme === "modern") setShowTabSearch((s) => !s);

      } else if (mod && e.shiftKey && e.key.toLowerCase() === "t") {
        e.preventDefault();
        reopenLastClosed();
      } else if (mod && !e.shiftKey && e.key.toLowerCase() === "t") {
        e.preventDefault();
        openNewTab();
      } else if (mod && !e.shiftKey && e.key.toLowerCase() === "w") {
        e.preventDefault();
        if (active) closeTab(active.id);
      } else if (mod && !e.shiftKey && e.key.toLowerCase() === "j") {
        e.preventDefault();
        routerNav("/downloads");
      } else if (mod && e.shiftKey && e.key.toLowerCase() === "n") {
        e.preventDefault();
        window.open("/incognito", "_blank", "width=1200,height=800,noopener");

      } else if (e.key === "Escape") {
        setShowTabSearch(false);
        setShowMenu(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active?.id]);

  if (!active) return null;

  return (
    <main className="relative flex h-screen w-screen flex-col overflow-hidden bg-background text-foreground">
      <TabBar
        tabs={tabs}
        activeId={activeId}
        onSelect={setActiveId}
        onClose={closeTab}
        onNew={() => openNewTab()}
        onOpenSearch={() => setShowTabSearch((s) => !s)}
      />
      <TabSearch
        open={showTabSearch}
        tabs={tabs}
        closed={closedTabs}
        onClose={() => setShowTabSearch(false)}
        onSelect={(id) => setActiveId(id)}
        onReopen={(u) => openNewTab(u)}
        onOpenUrl={(u) => openNewTab(u)}
        onClearClosed={() => setClosedTabs([])}
      />
      <Toolbar
        url={active.url}
        canBack={active.historyIndex > 0}
        canForward={active.historyIndex < active.history.length - 1}
        isBookmarked={isBookmarked}
        isDark={dark}
        onBack={back}
        onForward={forward}
        onReload={reload}
        onHome={() => navigate(NEW_TAB)}
        onNavigate={navigate}
        onToggleBookmark={toggleBookmark}
        onToggleMenu={() => setShowMenu((s) => !s)}
        onToggleDark={() => setDark((d) => !d)}
      />
      <MainMenu
        open={showMenu}
        isDark={dark}
        zoom={zoom}
        onClose={() => setShowMenu(false)}
        onNewTab={() => { setShowMenu(false); openNewTab(); }}
        onShowHistory={() => { setShowMenu(false); setShowHistory(true); }}
        onOpenDownloads={() => { setShowMenu(false); routerNav("/downloads"); }}

        onShowBookmarks={() => { setShowMenu(false); setShowBookmarks((s) => !s); }}
        onAddBookmark={() => { setShowMenu(false); toggleBookmark(); }}
        onClearHistory={() => { setHistory([]); setShowMenu(false); toast.success("Browsing history cleared"); }}
        onOpenPasswords={() => { setShowMenu(false); routerNav("/passwords"); }}
        onOpenIncognito={() => { setShowMenu(false); window.open("/incognito", "_blank", "width=1200,height=800,noopener"); }}
        onOpenExtensions={() => { setShowMenu(false); routerNav("/extensions"); }}
        onZoomIn={() => setZoom((z) => Math.min(2, +(z + 0.1).toFixed(2)))}
        onZoomOut={() => setZoom((z) => Math.max(0.5, +(z - 0.1).toFixed(2)))}
        onResetZoom={() => setZoom(1)}
        onPrint={() => { setShowMenu(false); window.print(); }}
        onAbout={() => { setShowMenu(false); routerNav("/about"); }}
        onOpenSettings={() => { setShowMenu(false); routerNav("/settings"); }}
        onOpenFlags={() => { setShowMenu(false); routerNav("/flags"); }}
        onReopenClosed={() => { setShowMenu(false); reopenLastClosed(); }}
        onFindInPage={() => { setShowMenu(false); toast.info("Find in page", { description: "Use your browser's native Ctrl+F inside the page frame." }); }}
        onShowShortcuts={() => {
          setShowMenu(false);
          toast.message("Keyboard shortcuts", {
            description: "Ctrl+T new tab • Ctrl+W close • Ctrl+Shift+T reopen • Ctrl+Shift+A tab search • Ctrl+D bookmark • Ctrl+P print",
          });
        }}
        onCopyUrl={() => {
          setShowMenu(false);
          if (active && active.url !== NEW_TAB) {
            navigator.clipboard.writeText(active.url).then(() => toast.success("URL copied"));
          } else {
            toast.error("No URL to copy");
          }
        }}
        onShareUrl={() => {
          setShowMenu(false);
          if (active && active.url !== NEW_TAB && (navigator as any).share) {
            (navigator as any).share({ title: active.title, url: active.url }).catch(() => {});
          } else if (active && active.url !== NEW_TAB) {
            navigator.clipboard.writeText(active.url).then(() => toast.success("URL copied to clipboard"));
          } else {
            toast.error("Nothing to share");
          }
        }}
      />
      {showBookmarks && (
        <BookmarksBar
          bookmarks={bookmarks}
          canAdd={!!active && active.url !== NEW_TAB}
          isBookmarked={isBookmarked}
          onOpen={(u) => navigate(u)}
          onRemove={(id) => setBookmarks((bs) => bs.filter((b) => b.id !== id))}
          onAddCurrent={toggleBookmark}
        />
      )}
      <div className="relative flex-1 overflow-hidden">
        <div style={{ transform: `scale(${zoom})`, transformOrigin: "top left", width: `${100 / zoom}%`, height: `${100 / zoom}%` }} className="h-full w-full">
        {active.url === NEW_TAB ? (
          <NewTabPage bookmarks={bookmarks} history={history} onNavigate={navigate} wallpaper={settings.wallpaper} />
        ) : (
          <WebView
            key={active.id + active.url}
            url={active.url}
            onTitle={(title) => updateTab(active.id, { title })}
          />
        )}
        </div>
        <HistoryPanel
          open={showHistory}
          history={history}
          onClose={() => setShowHistory(false)}
          onOpen={(u) => { setShowHistory(false); navigate(u); }}
          onClear={() => setHistory([])}
        />
      </div>
    </main>
  );
};

export default Index;
