import { useEffect, useState } from "react";
import { Code2, Copy, Download, X, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { NEW_TAB, hostnameOf } from "@/lib/browser-store";

type Props = {
  open: boolean;
  url: string;
  onClose: () => void;
};

const fetchSource = async (url: string): Promise<string> => {
  // Internal / new tab pages: show the live document markup.
  if (!/^https?:\/\//i.test(url) || url === NEW_TAB) {
    return "<!DOCTYPE html>\n" + document.documentElement.outerHTML;
  }
  try {
    const res = await fetch(url, { mode: "cors" });
    if (res.ok) return await res.text();
    throw new Error(String(res.status));
  } catch {
    // Fallback through a public CORS reader when the site blocks direct access.
    const res = await fetch(`https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`);
    if (!res.ok) throw new Error("Unable to load source");
    return await res.text();
  }
};

export const ViewSource = ({ open, url, onClose }: Props) => {
  const [source, setSource] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    setLoading(true);
    setError(null);
    setSource("");
    fetchSource(url)
      .then(setSource)
      .catch((e) => setError(e?.message || "Unable to load source"))
      .finally(() => setLoading(false));
  }, [open, url]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  const fileName = `${(/^https?:\/\//i.test(url) ? hostnameOf(url) : "aether-page").replace(/[^\w.-]/g, "_")}.html`;

  const copy = () => {
    navigator.clipboard.writeText(source).then(
      () => toast.success("Source copied to clipboard"),
      () => toast.error("Could not copy source"),
    );
  };

  const download = () => {
    const blob = new Blob([source], { type: "text/html;charset=utf-8" });
    const href = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = href;
    a.download = fileName;
    a.click();
    URL.revokeObjectURL(href);
    toast.success(`Downloaded ${fileName}`);
  };

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-background/70 p-6 backdrop-blur-sm">
      <div className="flex h-full w-full max-w-5xl flex-col overflow-hidden rounded-xl border border-border bg-card shadow-2xl">
        <header className="flex items-center gap-2 border-b border-border px-4 py-3">
          <Code2 className="h-4 w-4 text-primary" />
          <h2 className="text-sm font-semibold">Page source</h2>
          <span className="ml-2 min-w-0 flex-1 truncate text-xs text-muted-foreground">view-source:{url}</span>
          <button
            onClick={copy}
            disabled={!source}
            className="flex items-center gap-1 rounded-md border border-border px-2 py-1 text-xs hover:bg-muted disabled:opacity-40"
          >
            <Copy className="h-3.5 w-3.5" /> Copy
          </button>
          <button
            onClick={download}
            disabled={!source}
            className="flex items-center gap-1 rounded-md bg-primary px-2 py-1 text-xs font-medium text-primary-foreground hover:opacity-90 disabled:opacity-40"
          >
            <Download className="h-3.5 w-3.5" /> Download HTML
          </button>
          <button onClick={onClose} aria-label="Close" className="rounded-md p-1 hover:bg-muted">
            <X className="h-4 w-4" />
          </button>
        </header>

        <div className="min-h-0 flex-1 overflow-auto bg-muted/30">
          {loading ? (
            <div className="flex h-full items-center justify-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" /> Loading source…
            </div>
          ) : error ? (
            <div className="flex h-full items-center justify-center px-6 text-center text-sm text-destructive">
              {error}
            </div>
          ) : (
            <pre className="whitespace-pre-wrap break-words p-4 font-mono text-xs leading-relaxed text-foreground">
              {source}
            </pre>
          )}
        </div>
      </div>
    </div>
  );
};
