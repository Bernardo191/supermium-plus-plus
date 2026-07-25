import { useEffect, useRef, useState } from "react";
import { ExternalLink, ShieldAlert } from "lucide-react";
import { hostnameOf } from "@/lib/browser-store";

type Props = {
  url: string;
  onTitle: (title: string) => void;
};

export const WebView = ({ url, onTitle }: Props) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [blocked, setBlocked] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setBlocked(false);
    setLoading(true);
    onTitle(hostnameOf(url));
    const t = setTimeout(() => {
      // If the iframe never fired load, assume blocked
      setLoading((l) => {
        if (l) setBlocked(true);
        return false;
      });
    }, 6000);
    return () => clearTimeout(t);
  }, [url]);

  return (
    <div className="relative h-full w-full bg-background">
      {loading && (
        <div className="absolute left-0 right-0 top-0 z-10 h-0.5 overflow-hidden bg-transparent">
          <div className="h-full w-1/3 animate-[loadbar_1.2s_ease-in-out_infinite] bg-primary" />
        </div>
      )}
      <iframe
        ref={iframeRef}
        src={url}
        title={url}
        className="h-full w-full border-0 bg-card"
        sandbox="allow-forms allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox allow-downloads"
        onLoad={() => setLoading(false)}
      />
      {blocked && (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-background/95 p-6">
          <div className="max-w-md rounded-2xl border border-border bg-card p-6 text-center shadow-lg">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10 text-destructive">
              <ShieldAlert className="h-6 w-6" />
            </div>
            <h3 className="mb-2 text-lg font-semibold">This site refuses to embed</h3>
            <p className="mb-4 text-sm text-muted-foreground">
              {hostnameOf(url)} sends an <code className="rounded bg-muted px-1">X-Frame-Options</code> or <code className="rounded bg-muted px-1">CSP</code> header that prevents loading inside another page. This is a browser-security restriction, not a bug.
            </p>
            <a
              href={url}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90 transition"
            >
              Open in new tab <ExternalLink className="h-4 w-4" />
            </a>
          </div>
        </div>
      )}
      <style>{`@keyframes loadbar { 0% { transform: translateX(-100%); } 100% { transform: translateX(400%); } }`}</style>
    </div>
  );
};
