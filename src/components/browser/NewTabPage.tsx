import { Search, X } from "lucide-react";
import { Bookmark, HistoryItem, faviconFor, hostnameOf } from "@/lib/browser-store";
import { useI18n } from "@/lib/i18n";
import { useState } from "react";
import aetherLogo from "@/assets/aether-logo.png.asset.json";

type Props = {
  bookmarks: Bookmark[];
  history: HistoryItem[];
  onNavigate: (url: string) => void;
  wallpaper?: string;
};

export const NewTabPage = ({ bookmarks, history, onNavigate, wallpaper }: Props) => {
  const { t } = useI18n();
  const [q, setQ] = useState("");
  const [showWarning, setShowWarning] = useState(true);
  const recent = Array.from(new Map(history.map(h => [h.url, h])).values()).slice(0, 8);

  const isImage = wallpaper && /^(https?:\/\/|\/|data:)/i.test(wallpaper);
  const wallpaperStyle: React.CSSProperties | undefined = wallpaper
    ? isImage
      ? { backgroundImage: `url("${wallpaper}")`, backgroundSize: "cover", backgroundPosition: "center" }
      : { background: wallpaper }
    : undefined;

  return (
    <div
      className="relative h-full overflow-y-auto bg-gradient-to-b from-background via-background to-accent/30"
      style={wallpaperStyle}
    >
      <div className="mx-auto flex min-h-full max-w-3xl flex-col items-center px-6 pt-24 pb-16">
        <div className="mb-8 flex items-center gap-3">
          <img src={aetherLogo.url} alt="Aether logo" className="h-14 w-14 drop-shadow-lg" />
          <h1 className="text-4xl font-light tracking-tight">{t("app_name")}</h1>
        </div>


        <form
          onSubmit={(e) => { e.preventDefault(); if (q.trim()) onNavigate(q); }}
          className="w-full max-w-xl"
        >
          <div className="flex items-center gap-3 rounded-full bg-card px-5 py-3.5 shadow-md ring-1 ring-border focus-within:ring-2 focus-within:ring-primary transition">
            <Search className="h-5 w-5 text-muted-foreground" />
            <input
              autoFocus
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder={t("search_the_web")}
              className="flex-1 bg-transparent text-base outline-none placeholder:text-muted-foreground"
            />
          </div>
        </form>

        {bookmarks.length > 0 && (
          <section className="mt-12 w-full">
            <h2 className="mb-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">{t("shortcuts")}</h2>
            <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-6">
              {bookmarks.slice(0, 12).map((b) => (
                <button
                  key={b.id}
                  onClick={() => onNavigate(b.url)}
                  className="group flex flex-col items-center gap-2 rounded-xl p-3 hover:bg-muted transition"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-card ring-1 ring-border group-hover:ring-primary/40 transition">
                    <img src={faviconFor(b.url)} alt="" className="h-6 w-6" />
                  </div>
                  <span className="max-w-full truncate text-xs">{b.title}</span>
                </button>
              ))}
            </div>
          </section>
        )}

        {recent.length > 0 && (
          <section className="mt-10 w-full">
            <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">{t("recently_visited")}</h2>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {recent.map((h) => (
                <button
                  key={h.id}
                  onClick={() => onNavigate(h.url)}
                  className="flex items-center gap-3 rounded-lg bg-card p-3 text-left ring-1 ring-border hover:ring-primary/40 transition"
                >
                  <img src={faviconFor(h.url)} alt="" className="h-5 w-5 shrink-0" />
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm">{h.title || hostnameOf(h.url)}</div>
                    <div className="truncate text-xs text-muted-foreground">{hostnameOf(h.url)}</div>
                  </div>
                </button>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};
