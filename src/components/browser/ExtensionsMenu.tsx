import { useEffect, useRef, useState } from "react";
import { Puzzle, Settings2 } from "lucide-react";
import { cn } from "@/lib/utils";

type Ext = { id: string; name: string; description: string; enabled: boolean; builtin?: boolean };
const KEY = "aether_extensions";

const loadExts = (): Ext[] => {
  try {
    const saved = JSON.parse(localStorage.getItem(KEY) || "null");
    if (Array.isArray(saved)) return saved;
  } catch {}
  return [];
};

type Props = {
  onManage: () => void;
};

export const ExtensionsMenu = ({ onManage }: Props) => {
  const [open, setOpen] = useState(false);
  const [exts, setExts] = useState<Ext[]>([]);
  const wrapRef = useRef<HTMLDivElement>(null);

  const refresh = () => setExts(loadExts());

  useEffect(() => {
    refresh();
    const onStorage = (e: StorageEvent) => { if (e.key === KEY) refresh(); };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  useEffect(() => {
    if (!open) return;
    refresh();
    const onDown = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    window.addEventListener("mousedown", onDown);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const toggle = (id: string) => {
    const next = exts.map((x) => (x.id === id ? { ...x, enabled: !x.enabled } : x));
    setExts(next);
    localStorage.setItem(KEY, JSON.stringify(next));
  };

  const enabled = exts.filter((x) => x.enabled);
  const disabled = exts.filter((x) => !x.enabled);

  return (
    <div ref={wrapRef} className="relative">
      <button
        onClick={() => setOpen((s) => !s)}
        aria-label="Extensions"
        className="rounded-full p-2 text-foreground/80 hover:bg-muted transition"
      >
        <Puzzle className="h-4 w-4" />
      </button>

      {open && (
        <div className="absolute right-0 top-full z-50 mt-2 w-80 overflow-hidden rounded-xl border border-border bg-popover text-popover-foreground shadow-xl">
          <div className="px-4 py-3 border-b border-border">
            <div className="text-sm font-semibold">Extensions</div>
          </div>

          <div className="max-h-80 overflow-auto py-1">
            {exts.length === 0 && (
              <div className="px-4 py-6 text-center text-xs text-muted-foreground">
                No extensions installed
              </div>
            )}

            {enabled.length > 0 && (
              <>
                <div className="px-4 pt-2 pb-1 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                  Full access
                </div>
                {enabled.map((x) => (
                  <ExtRow key={x.id} ext={x} onToggle={() => toggle(x.id)} />
                ))}
              </>
            )}

            {disabled.length > 0 && (
              <>
                <div className="px-4 pt-3 pb-1 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                  Not enabled
                </div>
                {disabled.map((x) => (
                  <ExtRow key={x.id} ext={x} onToggle={() => toggle(x.id)} />
                ))}
              </>
            )}
          </div>

          <button
            onClick={() => { setOpen(false); onManage(); }}
            className="flex w-full items-center gap-2 border-t border-border px-4 py-2.5 text-sm hover:bg-muted transition"
          >
            <Settings2 className="h-4 w-4" />
            Manage extensions
          </button>
        </div>
      )}
    </div>
  );
};

const ExtRow = ({ ext, onToggle }: { ext: Ext; onToggle: () => void }) => (
  <button
    onClick={onToggle}
    className="flex w-full items-center gap-3 px-4 py-2 text-left hover:bg-muted transition"
  >
    <div className="rounded-md bg-accent p-1.5">
      <Puzzle className="h-4 w-4 text-accent-foreground" />
    </div>
    <div className="flex-1 min-w-0">
      <div className="truncate text-sm">{ext.name}</div>
    </div>
    <span
      className={cn(
        "relative inline-flex h-4 w-7 flex-shrink-0 items-center rounded-full transition",
        ext.enabled ? "bg-primary" : "bg-muted-foreground/30"
      )}
    >
      <span
        className={cn(
          "inline-block h-3 w-3 transform rounded-full bg-white transition",
          ext.enabled ? "translate-x-3.5" : "translate-x-0.5"
        )}
      />
    </span>
  </button>
);
