import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { useI18n } from "@/lib/i18n";
import { ExtensionsMenu } from "./ExtensionsMenu";
import { useSettings } from "@/lib/settings-store";
import { Button } from "@/components/ui/button";
import { ChromeIcon } from "./ChromeIcon";
import { CircleUserRound, Clock, Globe, Search, Star } from "lucide-react";
import { hexToHslVar } from "@/lib/chrome-colors";
import { loadBookmarks, loadHistory } from "@/lib/browser-store";

type Suggestion = { kind: "search" | "history" | "bookmark" | "url"; text: string; url: string };

export const buildSuggestions = (query: string): Suggestion[] => {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  const out: Suggestion[] = [];
  const isUrl = /^(https?:\/\/|aether:\/\/)/i.test(q) || /^[\w-]+(\.[\w-]+)+(\/\S*)?$/.test(q);
  out.push(isUrl ? { kind: "url", text: query.trim(), url: query.trim() } : { kind: "search", text: `${query.trim()} - Google Search`, url: query.trim() });
  const seen = new Set<string>();
  const match = (t: string, u: string) => t.toLowerCase().includes(q) || u.toLowerCase().includes(q);
  for (const b of loadBookmarks()) if (match(b.title, b.url) && !seen.has(b.url)) { seen.add(b.url); out.push({ kind: "bookmark", text: b.title || b.url, url: b.url }); }
  for (const h of loadHistory()) if (match(h.title, h.url) && !seen.has(h.url)) { seen.add(h.url); out.push({ kind: "history", text: h.title || h.url, url: h.url }); }
  return out.slice(0, 7);
};

type Props = {
  firstTabActive?: boolean;
  url: string;
  canBack: boolean;
  canForward: boolean;
  isBookmarked: boolean;
  isDark: boolean;
  onBack: () => void;
  onForward: () => void;
  onReload: () => void;
  onHome: () => void;
  onNavigate: (url: string) => void;
  onToggleBookmark: () => void;
  onToggleMenu: () => void;
  onToggleDark: () => void;
  onOpenExtensions: () => void;
};

export const shouldHideToolbarLeftFoot = (theme: string, position: string, hasLeadingControls = false) =>
  theme === "modern" && position !== "left" && !hasLeadingControls;

export const Toolbar = (p: Props) => {
  const { t } = useI18n();
  const [settings] = useSettings();
  const [value, setValue] = useState(p.url === "aether://newtab" ? "" : p.url);
  const inputRef = useRef<HTMLInputElement>(null);
  const [focused, setFocused] = useState(false);
  const [typed, setTyped] = useState(false);
  const [cursor, setCursor] = useState(0);
  const suggestions = focused && typed ? buildSuggestions(value) : [];
  const ringHsl = settings.omniboxRingColor ? hexToHslVar(settings.omniboxRingColor) : null;
  const go = (v: string) => { p.onNavigate(v); setTyped(false); inputRef.current?.blur(); };

  useEffect(() => {
    setValue(p.url === "aether://newtab" ? "" : p.url);
  }, [p.url]);

  const macOn = settings.windowControls && settings.windowControlsStyle === "macos";
  const tabSearchPos = macOn ? "right" : settings.tabSearchPosition;
  const hasLeadingControls = macOn || settings.workspacesButton !== "hidden";
  const hideLeftFoot = (p.firstTabActive ?? true) && shouldHideToolbarLeftFoot(settings.theme, tabSearchPos, hasLeadingControls);

  const isSecure = p.url.startsWith("https://");

  return (
    <div className={cn("toolbar-shape flex min-w-0 shrink-0 items-center bg-chrome-toolbar", hideLeftFoot && "toolbar-no-left-foot")}>
      <IconBtn onClick={p.onBack} disabled={!p.canBack} label="Back"><ChromeIcon name="back" /></IconBtn>
      {(!settings.autoHideForward || p.canForward) && (
        <IconBtn onClick={p.onForward} disabled={!p.canForward} label="Forward"><ChromeIcon name="back" className="rotate-180" /></IconBtn>
      )}
      <IconBtn onClick={p.onReload} label="Reload"><ChromeIcon name="reload" /></IconBtn>
      {settings.showHomeButton && (
        <IconBtn onClick={p.onHome} label="Home"><ChromeIcon name="home" /></IconBtn>
      )}

      <form
        className="chrome-omnibox relative flex min-w-0 flex-1 shrink items-center bg-omnibox transition"
        style={ringHsl ? ({ "--omnibox-ring": ringHsl } as React.CSSProperties) : undefined}
        onSubmit={(e) => { e.preventDefault(); go(suggestions[cursor]?.url ?? value); }}
      >
        <ChromeIcon name={isSecure ? "lock" : "info"} className="chrome-site-icon text-muted-foreground" />
        <input
          ref={inputRef}
          value={value}
          onChange={(e) => { setValue(e.target.value); setTyped(true); setCursor(0); }}
          onFocus={(e) => { e.target.select(); setFocused(true); }}
          onBlur={() => setTimeout(() => setFocused(false), 120)}
          onKeyDown={(e) => {
            if (!suggestions.length) return;
            if (e.key === "ArrowDown") { e.preventDefault(); setCursor((c) => Math.min(c + 1, suggestions.length - 1)); }
            else if (e.key === "ArrowUp") { e.preventDefault(); setCursor((c) => Math.max(c - 1, 0)); }
            else if (e.key === "Escape") { setTyped(false); }
          }}
          placeholder={t("search_placeholder")}
          aria-label="Address and search bar"
          className="w-full min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
        />
        <Button variant="ghost" size="icon" type="button" onClick={p.onToggleBookmark} aria-label="Bookmark" title="Bookmark" className={cn("chrome-bookmark shrink-0 text-muted-foreground hover:text-primary", p.isBookmarked && "text-primary")}>
          <ChromeIcon name={p.isBookmarked ? "star-filled" : "star"} />
        </Button>
        {suggestions.length > 0 && (
          <div role="listbox" aria-label="Suggestions" className="absolute left-0 right-0 top-full z-50 mt-1 overflow-hidden rounded-xl border border-border bg-popover py-1 text-popover-foreground shadow-xl">
            {suggestions.map((sg, i) => {
              const Icon = sg.kind === "search" ? Search : sg.kind === "history" ? Clock : sg.kind === "bookmark" ? Star : Globe;
              return (
                <button key={sg.kind + sg.url} type="button" role="option" aria-selected={i === cursor}
                  onMouseDown={(e) => { e.preventDefault(); go(sg.url); }}
                  onMouseEnter={() => setCursor(i)}
                  className={cn("flex w-full items-center gap-3 px-4 py-1.5 text-left text-sm", i === cursor && "bg-muted")}>
                  <Icon className="h-4 w-4 shrink-0 text-muted-foreground" />
                  <span className="truncate">{sg.text}</span>
                  {sg.kind !== "search" && sg.kind !== "url" && <span className="truncate text-xs text-muted-foreground">— {sg.url}</span>}
                </button>
              );
            })}
          </div>
        )}
      </form>

      <ExtensionsMenu onManage={p.onOpenExtensions} />
      <Button variant="ghost" size="icon" onClick={p.onToggleMenu} aria-label="Customize and control" title="Customize and control" className="chrome-tool-button shrink-0 text-foreground/80">
        <ChromeIcon name={settings.theme === "legacy-2010" || settings.theme === "legacy-2016" ? "menu" : "more"} />
      </Button>
      <Button variant="ghost" size="icon" aria-label="Accounts" title="Accounts" className="chrome-tool-button shrink-0 text-foreground/80">
        <CircleUserRound className="h-5 w-5" />
      </Button>
    </div>
  );
};

const IconBtn = ({ children, onClick, disabled, label }: { children: React.ReactNode; onClick: () => void; disabled?: boolean; label: string }) => (
  <Button variant="ghost" size="icon"
    onClick={onClick}
    disabled={disabled}
    aria-label={label}
    title={label}
    className="chrome-tool-button shrink-0 text-foreground/80 hover:bg-muted disabled:opacity-30 disabled:hover:bg-transparent transition"
  >
    {children}
  </Button>
);
