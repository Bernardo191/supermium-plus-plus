export type Tab = {
  id: string;
  title: string;
  url: string;
  history: string[];
  historyIndex: number;
  loading: boolean;
};

export type Bookmark = { id: string; title: string; url: string };
export type HistoryItem = { id: string; title: string; url: string; visitedAt: number };

export const NEW_TAB = "aether://newtab";

export const newTab = (url: string = NEW_TAB): Tab => ({
  id: crypto.randomUUID(),
  title: url === NEW_TAB ? "New Tab" : url,
  url,
  history: [url],
  historyIndex: 0,
  loading: false,
});

export const normalizeUrl = (input: string): string => {
  const v = input.trim();
  if (!v) return NEW_TAB;
  if (v === NEW_TAB || v.startsWith("aether://") || v.startsWith("nimbus://")) return v;
  // search query if no dot or has spaces
  if (/\s/.test(v) || (!v.includes(".") && !v.startsWith("http"))) {
    return `https://www.google.com/search?q=${encodeURIComponent(v)}`;
  }
  if (!/^https?:\/\//i.test(v)) return `https://${v}`;
  return v;
};

export const hostnameOf = (url: string) => {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
};

export const faviconFor = (url: string) => {
  try {
    const u = new URL(url);
    return `https://www.google.com/s2/favicons?domain=${u.hostname}&sz=64`;
  } catch {
    return "";
  }
};

const KEYS = { bookmarks: "nb_bookmarks", history: "nb_history", tabs: "nb_tabs" };

export const loadBookmarks = (): Bookmark[] => {
  try { return JSON.parse(localStorage.getItem(KEYS.bookmarks) || "[]"); } catch { return []; }
};
export const saveBookmarks = (b: Bookmark[]) => localStorage.setItem(KEYS.bookmarks, JSON.stringify(b));

export const loadHistory = (): HistoryItem[] => {
  try { return JSON.parse(localStorage.getItem(KEYS.history) || "[]"); } catch { return []; }
};
export const saveHistory = (h: HistoryItem[]) => localStorage.setItem(KEYS.history, JSON.stringify(h.slice(0, 500)));

export const defaultBookmarks: Bookmark[] = [
  { id: "1", title: "Google", url: "https://www.google.com" },
  { id: "2", title: "Wikipedia", url: "https://www.wikipedia.org" },
  { id: "3", title: "DuckDuckGo", url: "https://duckduckgo.com" },
  { id: "4", title: "Lovable", url: "https://lovable.dev" },
  { id: "5", title: "MDN", url: "https://developer.mozilla.org" },
  { id: "6", title: "GitHub", url: "https://github.com" },
];
