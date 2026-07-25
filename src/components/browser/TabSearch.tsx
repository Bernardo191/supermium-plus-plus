import { useEffect, useMemo, useRef, useState } from "react";
import { Search, X, RotateCcw, Trash2, ExternalLink, ArrowRight } from "lucide-react";
import { Tab, faviconFor, hostnameOf } from "@/lib/browser-store";
import { useSettings } from "@/lib/settings-store";

export type ClosedTab = { id: string; title: string; url: string; closedAt: number };

type Props = {
  open: boolean;
  tabs: Tab[];
  closed: ClosedTab[];
  onClose: () => void;
  onSelect: (id: string) => void;
  onReopen: (url: string) => void;
  onClearClosed?: () => void;
  onOpenUrl?: (url: string) => void;
};

const looksLikeUrl = (s: string) => /^(https?:\/\/|aether:\/\/)/i.test(s) || /^[\w-]+(\.[\w-]+)+(\/\S*)?$/.test(s);

export const TabSearch = ({ open, tabs, closed, onClose, onSelect, onReopen, onClearClosed, onOpenUrl }: Props) => {
  const [q, setQ] = useState("");
  const [cursor, setCursor] = useState(0);
  const [settings] = useSettings();
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => { if (open) { setQ(""); setCursor(0); } }, [open]);

  const s = q.toLowerCase().trim();
  const filteredTabs = useMemo(
    () => tabs.filter((t) => !s || t.title.toLowerCase().includes(s) || t.url.toLowerCase().includes(s)),
    [tabs, s]
  );
  const filteredClosed = useMemo(
    () => closed.filter((t) => !s || t.title.toLowerCase().includes(s) || t.url.toLowerCase().includes(s)),
    [closed, s]
  );

  const urlSuggestion = q.trim() && looksLikeUrl(q.trim()) && onOpenUrl ? q.trim() : "";

  type Item =
    | { kind: "tab"; id: string; url: string; title: string }
    | { kind: "closed"; id: string; url: string; title: string; closedAt: number }
    | { kind: "open-url"; url: string };

  const items: Item[] = useMemo(() => {
    const arr: Item[] = [];
    if (urlSuggestion) arr.push({ kind: "open-url", url: urlSuggestion });
    filteredTabs.forEach((t) => arr.push({ kind: "tab", id: t.id, url: t.url, title: t.title }));
    filteredClosed.forEach((t) => arr.push({ kind: "closed", id: t.id, url: t.url, title: t.title, closedAt: t.closedAt }));
    return arr;
  }, [urlSuggestion, filteredTabs, filteredClosed]);

  useEffect(() => { setCursor(0); }, [q]);
  useEffect(() => {
    if (!open) return;
    const el = listRef.current?.querySelector<HTMLElement>(`[data-idx="${cursor}"]`);
    el?.scrollIntoView({ block: "nearest" });
  }, [cursor, open]);

  if (!open) return null;

  const activate = (it: Item) => {
    if (it.kind === "tab") { onSelect(it.id); onClose(); }
    else if (it.kind === "closed") { onReopen(it.url); onClose(); }
    else if (it.kind === "open-url" && onOpenUrl) {
      const u = /^(https?:\/\/|aether:\/\/)/i.test(it.url) ? it.url : `https://${it.url}`;
      onOpenUrl(u); onClose();
    }
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") { e.preventDefault(); setCursor((c) => Math.min(c + 1, items.length - 1)); }
    else if (e.key === "ArrowUp") { e.preventDefault(); setCursor((c) => Math.max(c - 1, 0)); }
    else if (e.key === "Enter") { e.preventDefault(); if (items[cursor]) activate(items[cursor]); }
    else if (e.key === "Escape") { e.preventDefault(); onClose(); }
  };

  const legacy = settings.theme !== "modern";
  const macOn = settings.windowControls && settings.windowControlsStyle === "macos";
  const pos = settings.theme === "legacy-2021" ? "right" : legacy ? "disabled" : macOn ? "right" : settings.tabSearchPosition;
  const align = pos === "right" ? "right-2" : "left-2";
  const isModern = settings.theme === "modern";

  let idx = 0;

  return (
    <div
      onKeyDown={onKeyDown}
      className={`absolute ${align} top-12 z-40 w-[360px] rounded-xl border border-border ${isModern ? "bg-chrome-toolbar" : "bg-popover"} shadow-2xl`}
    >
      <div className="flex items-center justify-between border-b border-border px-3 py-2">
        <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Search tabs</div>
        <button onClick={onClose} className="rounded-md p-1 text-muted-foreground hover:bg-muted" aria-label="Close">
          <X className="h-3.5 w-3.5" />
        </button>
      </div>

      <div className="flex items-center gap-2 border-b border-border px-3 py-2">
        <Search className="h-4 w-4 text-muted-foreground" />
        <input
          autoFocus
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search tabs, history, or type a URL"
          className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
        />
        {q && (
          <button onClick={() => setQ("")} className="rounded p-0.5 text-muted-foreground hover:bg-muted" aria-label="Clear">
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      <div ref={listRef} className="max-h-[55vh] overflow-y-auto p-1">
        {urlSuggestion && (() => {
          const i = idx++;
          return (
            <Row
              idx={i}
              active={i === cursor}
              onHover={() => setCursor(i)}
              icon={<ArrowRight className="h-4 w-4 text-primary" />}
              title={`Open ${urlSuggestion}`}
              subtitle="Press Enter to open in new tab"
              onClick={() => activate({ kind: "open-url", url: urlSuggestion })}
            />
          );
        })()}

        <SectionHeader>Open tabs ({filteredTabs.length})</SectionHeader>
        {filteredTabs.length === 0 && <Empty>No matching tabs</Empty>}
        {filteredTabs.map((t) => {
          const i = idx++;
          return (
            <Row
              key={t.id}
              idx={i}
              active={i === cursor}
              onHover={() => setCursor(i)}
              icon={t.url !== "aether://newtab" ? <img src={faviconFor(t.url)} alt="" className="h-4 w-4 shrink-0" /> : <div className="h-4 w-4 shrink-0 rounded-sm bg-primary/20" />}
              title={t.title || hostnameOf(t.url)}
              subtitle={hostnameOf(t.url)}
              onClick={() => activate({ kind: "tab", id: t.id, url: t.url, title: t.title })}
            />
          );
        })}

        {closed.length > 0 && (
          <>
            <div className="flex items-center justify-between px-3 pt-2 pb-1">
              <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                Recently closed ({filteredClosed.length})
              </div>
              {onClearClosed && (
                <button
                  onClick={onClearClosed}
                  className="inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-[10px] text-muted-foreground hover:bg-muted hover:text-foreground"
                  title="Clear recently closed"
                >
                  <Trash2 className="h-3 w-3" /> Clear
                </button>
              )}
            </div>
            {filteredClosed.length === 0 && <Empty>Nothing matches</Empty>}
            {filteredClosed.map((t) => {
              const i = idx++;
              return (
                <Row
                  key={t.id}
                  idx={i}
                  active={i === cursor}
                  onHover={() => setCursor(i)}
                  icon={t.url !== "aether://newtab" ? <img src={faviconFor(t.url)} alt="" className="h-4 w-4 shrink-0" /> : <div className="h-4 w-4 shrink-0 rounded-sm bg-primary/20" />}
                  title={t.title || hostnameOf(t.url)}
                  subtitle={hostnameOf(t.url)}
                  hint={timeAgo(t.closedAt)}
                  rightIcon={<RotateCcw className="h-3.5 w-3.5" />}
                  onClick={() => activate({ kind: "closed", id: t.id, url: t.url, title: t.title, closedAt: t.closedAt })}
                />
              );
            })}
          </>
        )}
      </div>

      <div className="flex items-center justify-between border-t border-border px-3 py-1.5 text-[10px] text-muted-foreground">
        <span className="inline-flex items-center gap-1">
          <kbd className="rounded bg-muted px-1">↑</kbd>
          <kbd className="rounded bg-muted px-1">↓</kbd>
          navigate
        </span>
        <span className="inline-flex items-center gap-1">
          <kbd className="rounded bg-muted px-1">Enter</kbd> select
        </span>
        <span className="inline-flex items-center gap-1">
          <kbd className="rounded bg-muted px-1">Esc</kbd> close
        </span>
      </div>
    </div>
  );
};

const SectionHeader = ({ children }: { children: React.ReactNode }) => (
  <div className="px-3 pt-2 pb-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{children}</div>
);
const Empty = ({ children }: { children: React.ReactNode }) => (
  <div className="px-3 py-3 text-xs text-muted-foreground">{children}</div>
);

type RowProps = {
  idx: number;
  active: boolean;
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
  hint?: string;
  rightIcon?: React.ReactNode;
  onClick: () => void;
  onHover: () => void;
};
const Row = ({ idx, active, icon, title, subtitle, hint, rightIcon, onClick, onHover }: RowProps) => (
  <button
    data-idx={idx}
    onMouseEnter={onHover}
    onClick={onClick}
    className={`flex w-full items-center gap-3 rounded-md px-3 py-2 text-left ${active ? "bg-muted" : "hover:bg-muted"}`}
  >
    {icon}
    <div className="min-w-0 flex-1">
      <div className="truncate text-sm">{title}</div>
      {subtitle && <div className="truncate text-xs text-muted-foreground">{subtitle}</div>}
    </div>
    {hint && <span className="shrink-0 text-[10px] text-muted-foreground">{hint}</span>}
    {rightIcon && <span className="shrink-0 text-muted-foreground">{rightIcon}</span>}
  </button>
);

const timeAgo = (t: number) => {
  const s = Math.floor((Date.now() - t) / 1000);
  if (s < 60) return `${s}s ago`;
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
};

// keep ExternalLink import used
void ExternalLink;
