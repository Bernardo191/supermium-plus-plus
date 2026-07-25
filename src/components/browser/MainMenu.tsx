import { Clock, Plus, Star, Trash2, Download, Printer, Info, ZoomIn, ZoomOut, Bookmark as BookmarkIcon, Settings as SettingsIcon, FlaskConical, RotateCcw, Search, Keyboard, Share2, Copy, KeyRound, EyeOff, Puzzle } from "lucide-react";
import { useEffect, useRef } from "react";
import { useI18n } from "@/lib/i18n";

type Props = {
  open: boolean;
  isDark: boolean;
  zoom: number;
  onClose: () => void;
  onNewTab: () => void;
  onShowHistory: () => void;
  onClearHistory: () => void;
  onAddBookmark: () => void;
  onShowBookmarks: () => void;
  onOpenPasswords: () => void;
  onOpenIncognito: () => void;
  onOpenExtensions: () => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onResetZoom: () => void;
  onPrint: () => void;
  onAbout: () => void;
  onOpenSettings: () => void;
  onOpenFlags: () => void;
  onReopenClosed: () => void;
  onFindInPage: () => void;
  onShowShortcuts: () => void;
  onCopyUrl: () => void;
  onShareUrl: () => void;
  onOpenDownloads: () => void;
};


export const MainMenu = (p: Props) => {
  const { t } = useI18n();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!p.open) return;
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) p.onClose();
    };
    setTimeout(() => document.addEventListener("mousedown", onClick), 0);
    return () => document.removeEventListener("mousedown", onClick);
  }, [p.open]);

  if (!p.open) return null;

  return (
    <div
      ref={ref}
      className="absolute right-2 top-12 z-40 w-[280px] rounded-xl border border-border bg-popover shadow-2xl py-2 text-sm"
    >
      <Item icon={<Plus className="h-4 w-4" />} label={t("new_tab")} shortcut="Ctrl+T" onClick={p.onNewTab} />
      <Item icon={<RotateCcw className="h-4 w-4" />} label={t("reopen_closed_tab")} shortcut="Ctrl+Shift+T" onClick={p.onReopenClosed} />
      <Sep />
      <Item icon={<Clock className="h-4 w-4" />} label={t("history")} onClick={p.onShowHistory} />
      <Item icon={<Download className="h-4 w-4" />} label={t("downloads")} shortcut="Ctrl+J" onClick={p.onOpenDownloads} />
      <Item icon={<BookmarkIcon className="h-4 w-4" />} label={t("bookmarks")} onClick={p.onShowBookmarks} />
      <Item icon={<Star className="h-4 w-4" />} label={t("bookmark_this_page")} shortcut="Ctrl+D" onClick={p.onAddBookmark} />
      <Sep />
      <Item icon={<Search className="h-4 w-4" />} label={t("find_in_page")} shortcut="Ctrl+F" onClick={p.onFindInPage} />
      <Item icon={<Copy className="h-4 w-4" />} label={t("copy_current_url")} onClick={p.onCopyUrl} />
      <Item icon={<Share2 className="h-4 w-4" />} label={t("share")} onClick={p.onShareUrl} />
      <Sep />

      <div className="flex items-center justify-between px-3 py-2">
        <span className="text-muted-foreground">{t("zoom")}</span>
        <div className="flex items-center gap-1">
          <button onClick={p.onZoomOut} className="rounded-md p-1 hover:bg-muted" aria-label="Zoom out"><ZoomOut className="h-4 w-4" /></button>
          <button onClick={p.onResetZoom} className="min-w-[44px] rounded-md px-2 py-1 text-xs hover:bg-muted">{Math.round(p.zoom * 100)}%</button>
          <button onClick={p.onZoomIn} className="rounded-md p-1 hover:bg-muted" aria-label="Zoom in"><ZoomIn className="h-4 w-4" /></button>
        </div>
      </div>

      <Item icon={<Printer className="h-4 w-4" />} label={t("print")} shortcut="Ctrl+P" onClick={p.onPrint} />
      <Sep />
      <Item icon={<EyeOff className="h-4 w-4" />} label="New incognito window" shortcut="Ctrl+Shift+N" onClick={p.onOpenIncognito} />
      <Item icon={<KeyRound className="h-4 w-4" />} label="Passwords" onClick={p.onOpenPasswords} />
      <Item icon={<Puzzle className="h-4 w-4" />} label="Extensions" onClick={p.onOpenExtensions} />
      <Item icon={<Trash2 className="h-4 w-4" />} label={t("clear_browsing_data")} onClick={p.onClearHistory} />
      <Sep />
      <Item icon={<SettingsIcon className="h-4 w-4" />} label={t("settings")} onClick={p.onOpenSettings} />
      <Item icon={<FlaskConical className="h-4 w-4" />} label={t("experiments_flags")} onClick={p.onOpenFlags} />
      <Item icon={<Keyboard className="h-4 w-4" />} label={t("keyboard_shortcuts")} onClick={p.onShowShortcuts} />
      <Sep />
      <Item icon={<Info className="h-4 w-4" />} label={t("about_aether")} onClick={p.onAbout} />
    </div>
  );
};

const Item = ({ icon, label, shortcut, onClick, disabled }: { icon: React.ReactNode; label: string; shortcut?: string; onClick?: () => void; disabled?: boolean }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className="flex w-full items-center gap-3 px-3 py-2 text-left hover:bg-muted disabled:opacity-40 disabled:hover:bg-transparent"
  >
    <span className="text-muted-foreground">{icon}</span>
    <span className="flex-1">{label}</span>
    {shortcut && <span className="text-[10px] text-muted-foreground">{shortcut}</span>}
  </button>
);

const Sep = () => <div className="my-1 h-px bg-border" />;
