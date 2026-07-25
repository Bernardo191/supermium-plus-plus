import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Download as DownloadIcon, Trash2, ExternalLink, Plus } from "lucide-react";
import { useDownloads } from "@/lib/downloads-store";
import { useI18n } from "@/lib/i18n";
import { faviconFor, hostnameOf } from "@/lib/browser-store";

const DownloadsPage = () => {
  const { t } = useI18n();
  const { items, add, remove, clear } = useDownloads();
  const [val, setVal] = useState("");

  const onAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const v = val.trim();
    if (!v) return;
    const isUrl = /^https?:\/\//i.test(v);
    add({
      url: isUrl ? v : "",
      name: isUrl ? (v.split("/").pop() || hostnameOf(v)) : v,
    });
    setVal("");
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border bg-card">
        <div className="mx-auto flex max-w-3xl items-center gap-3 px-6 py-4">
          <Link to="/" className="rounded-md p-2 hover:bg-muted" aria-label={t("back")}>
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <DownloadIcon className="h-5 w-5 text-primary" />
          <h1 className="text-xl font-semibold">{t("downloads")}</h1>
          <span className="ml-auto text-xs text-muted-foreground">aether://downloads</span>
        </div>
      </header>

      <main className="mx-auto max-w-3xl space-y-6 px-6 py-8">
        <form onSubmit={onAdd} className="flex gap-2 rounded-xl border border-border bg-card p-3">
          <input
            value={val}
            onChange={(e) => setVal(e.target.value)}
            placeholder={t("downloads_url")}
            className="flex-1 rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
          />
          <button type="submit" className="flex items-center gap-1 rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:opacity-90">
            <Plus className="h-4 w-4" /> {t("downloads_add")}
          </button>
        </form>

        {items.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border p-12 text-center text-sm text-muted-foreground">
            {t("downloads_empty")}
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-muted-foreground">{items.length} item(s)</h2>
              <button onClick={clear} className="text-xs text-destructive hover:underline">
                {t("downloads_clear")}
              </button>
            </div>
            <ul className="divide-y divide-border rounded-xl border border-border bg-card">
              {items.map((d) => (
                <li key={d.id} className="flex items-center gap-3 px-4 py-3">
                  {d.url ? (
                    <img src={faviconFor(d.url)} alt="" className="h-5 w-5 shrink-0" />
                  ) : (
                    <DownloadIcon className="h-5 w-5 shrink-0 text-muted-foreground" />
                  )}
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-medium">{d.name}</div>
                    <div className="truncate text-xs text-muted-foreground">
                      {d.url || "local"} · {new Date(d.addedAt).toLocaleString()}
                    </div>
                  </div>
                  {d.url && (
                    <a href={d.url} target="_blank" rel="noreferrer" className="rounded-md p-2 text-muted-foreground hover:bg-muted" aria-label={t("open")}>
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  )}
                  <button onClick={() => remove(d.id)} className="rounded-md p-2 text-muted-foreground hover:bg-muted hover:text-destructive" aria-label={t("remove")}>
                    <Trash2 className="h-4 w-4" />
                  </button>
                </li>
              ))}
            </ul>
          </>
        )}
      </main>
    </div>
  );
};

export default DownloadsPage;
