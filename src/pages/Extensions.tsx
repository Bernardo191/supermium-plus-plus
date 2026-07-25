import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Puzzle, Trash2 } from "lucide-react";
import { toast } from "sonner";

type Ext = { id: string; name: string; description: string; enabled: boolean; builtin?: boolean };
const KEY = "aether_extensions";

const DEFAULTS: Ext[] = [
  { id: "adblock", name: "Aether Shield", description: "Lightweight ad and tracker blocker.", enabled: true, builtin: true },
  { id: "darkweb", name: "Force Dark", description: "Force dark mode on every website.", enabled: true, builtin: true },
  { id: "translate", name: "Quick Translate", description: "Translate selected text inline.", enabled: false, builtin: true },
  { id: "reader", name: "Reader Mode", description: "Strip clutter from articles.", enabled: false, builtin: true },
];

const load = (): Ext[] => {
  try {
    const saved = JSON.parse(localStorage.getItem(KEY) || "null");
    if (Array.isArray(saved)) return saved;
  } catch {}
  return DEFAULTS;
};

const Extensions = () => {
  const [exts, setExts] = useState<Ext[]>([]);
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");

  useEffect(() => { setExts(load()); document.title = "Extensions — Aether"; }, []);
  useEffect(() => { localStorage.setItem(KEY, JSON.stringify(exts)); }, [exts]);

  const toggle = (id: string) =>
    setExts((e) => e.map((x) => (x.id === id ? { ...x, enabled: !x.enabled } : x)));
  const remove = (id: string) => setExts((e) => e.filter((x) => x.id !== id));

  const add = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;
    setExts((es) => [...es, { id: crypto.randomUUID(), name, description: desc || "Custom extension", enabled: true }]);
    setName(""); setDesc("");
    toast.success("Extension added");
  };

  return (
    <main className="min-h-screen bg-background text-foreground">
      <header className="flex items-center gap-3 border-b border-border bg-chrome-bar px-4 py-3">
        <Link to="/" className="rounded-full p-2 hover:bg-muted"><ArrowLeft className="h-4 w-4" /></Link>
        <Puzzle className="h-5 w-5 text-primary" />
        <h1 className="text-lg font-semibold">Extensions</h1>
      </header>
      <div className="mx-auto max-w-3xl space-y-6 p-6">
        <form onSubmit={add} className="rounded-xl border border-border bg-card p-4 space-y-3">
          <h2 className="font-semibold">Install a custom extension</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <input className="rounded-md border border-border bg-omnibox px-3 py-2 text-sm" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
            <input className="rounded-md border border-border bg-omnibox px-3 py-2 text-sm" placeholder="Description" value={desc} onChange={(e) => setDesc(e.target.value)} />
          </div>
          <button className="rounded-md bg-primary px-4 py-2 text-sm text-primary-foreground hover:opacity-90">Install</button>
        </form>

        <div className="rounded-xl border border-border bg-card divide-y divide-border">
          {exts.map((x) => (
            <div key={x.id} className="flex items-center gap-4 px-4 py-3">
              <div className="rounded-lg bg-accent p-2"><Puzzle className="h-5 w-5 text-accent-foreground" /></div>
              <div className="flex-1 min-w-0">
                <div className="font-medium flex items-center gap-2">
                  {x.name}
                  {x.builtin && <span className="text-[10px] uppercase rounded bg-muted px-1.5 py-0.5 text-muted-foreground">built-in</span>}
                </div>
                <div className="text-xs text-muted-foreground">{x.description}</div>
              </div>
              <button
                onClick={() => toggle(x.id)}
                className={`rounded-full px-3 py-1 text-xs ${x.enabled ? "bg-primary text-primary-foreground" : "bg-muted text-foreground"}`}
              >
                {x.enabled ? "Enabled" : "Disabled"}
              </button>
              {!x.builtin && (
                <button onClick={() => remove(x.id)} className="rounded-md p-2 hover:bg-muted text-destructive" aria-label="Remove">
                  <Trash2 className="h-4 w-4" />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </main>
  );
};

export default Extensions;
