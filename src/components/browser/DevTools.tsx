import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Log = { kind: "in" | "out" | "error" | "log"; text: string };

const fmt = (v: unknown) => {
  if (typeof v === "string") return v;
  try { return JSON.stringify(v, null, 2) ?? String(v); } catch { return String(v); }
};

/** Runs a console command; exported for tests. */
export const runDevCommand = (code: string): Log => {
  try {
    // eslint-disable-next-line no-new-func
    const result = new Function(`return (${code})`)();
    return { kind: "out", text: fmt(result) };
  } catch {
    try {
      // eslint-disable-next-line no-new-func
      const result = new Function(code)();
      return { kind: "out", text: fmt(result) };
    } catch (e) {
      return { kind: "error", text: String(e) };
    }
  }
};

export const DevTools = ({ open, url, onClose }: { open: boolean; url: string; onClose: () => void }) => {
  const [tab, setTab] = useState<"elements" | "console">("console");
  const [logs, setLogs] = useState<Log[]>([]);
  const [input, setInput] = useState("");
  const [html, setHtml] = useState("");
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const orig = { log: console.log, warn: console.warn, error: console.error };
    const wrap = (k: "log" | "warn" | "error") => (...a: unknown[]) => {
      orig[k](...a);
      setLogs((l) => [...l, { kind: k === "error" ? "error" : "log", text: a.map(fmt).join(" ") }]);
    };
    console.log = wrap("log"); console.warn = wrap("warn"); console.error = wrap("error");
    return () => { console.log = orig.log; console.warn = orig.warn; console.error = orig.error; };
  }, [open]);

  useEffect(() => {
    if (open && tab === "elements") {
      const el = document.querySelector("[data-page-content]");
      setHtml(el ? el.innerHTML.replace(/></g, ">\n<") : "");
    }
  }, [open, tab, url]);

  useEffect(() => endRef.current?.scrollIntoView({ block: "end" }), [logs]);

  if (!open) return null;

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    const res = runDevCommand(input);
    setLogs((l) => [...l, { kind: "in", text: input }, res]);
    setInput("");
  };

  return (
    <div className="flex h-[38%] min-h-[160px] shrink-0 flex-col border-t border-border bg-card text-xs" aria-label="Developer tools">
      <div className="flex items-center gap-1 border-b border-border px-2">
        {(["elements", "console"] as const).map((t) => (
          <button key={t} onClick={() => setTab(t)}
            className={cn("px-3 py-1.5 capitalize", tab === t ? "border-b-2 border-primary text-foreground" : "text-muted-foreground hover:text-foreground")}>
            {t}
          </button>
        ))}
        <span className="ml-2 flex-1 truncate text-muted-foreground">{url}</span>
        <Button variant="ghost" size="sm" onClick={() => setLogs([])}>Clear</Button>
        <Button variant="ghost" size="icon" className="h-7 w-7" aria-label="Close developer tools" onClick={onClose}><X className="h-4 w-4" /></Button>
      </div>
      {tab === "elements" ? (
        <pre className="min-h-0 flex-1 overflow-auto whitespace-pre-wrap p-2 font-mono text-muted-foreground">
          {html || "Web pages from other sites can't be inspected because they're in a protected frame."}
        </pre>
      ) : (
        <div className="flex min-h-0 flex-1 flex-col font-mono">
          <div className="min-h-0 flex-1 overflow-auto p-2">
            {logs.map((l, i) => (
              <div key={i} className={cn("whitespace-pre-wrap border-b border-border/50 py-0.5",
                l.kind === "error" && "text-destructive", l.kind === "in" && "text-primary")}>
                {l.kind === "in" ? "> " : l.kind === "out" ? "< " : ""}{l.text}
              </div>
            ))}
            <div ref={endRef} />
          </div>
          <form onSubmit={submit} className="flex items-center gap-1 border-t border-border px-2">
            <span className="text-primary">&gt;</span>
            <input aria-label="Console input" value={input} onChange={(e) => setInput(e.target.value)}
              className="flex-1 bg-transparent py-1.5 outline-none" placeholder="Type a command, e.g. 1 + 1" />
          </form>
        </div>
      )}
    </div>
  );
};
