import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Eye, EyeOff, KeyRound, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

type Cred = { id: string; site: string; username: string; password: string };
const KEY = "aether_passwords";

const load = (): Cred[] => { try { return JSON.parse(localStorage.getItem(KEY) || "[]"); } catch { return []; } };
const save = (c: Cred[]) => localStorage.setItem(KEY, JSON.stringify(c));

const Passwords = () => {
  const [creds, setCreds] = useState<Cred[]>([]);
  const [site, setSite] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [shown, setShown] = useState<Record<string, boolean>>({});

  useEffect(() => { setCreds(load()); document.title = "Passwords — Aether"; }, []);
  useEffect(() => { save(creds); }, [creds]);

  const add = (e: React.FormEvent) => {
    e.preventDefault();
    if (!site || !username || !password) return;
    setCreds((c) => [{ id: crypto.randomUUID(), site, username, password }, ...c]);
    setSite(""); setUsername(""); setPassword("");
    toast.success("Saved");
  };

  const copy = (v: string) => navigator.clipboard.writeText(v).then(() => toast.success("Copied"));

  return (
    <main className="min-h-screen bg-background text-foreground">
      <header className="flex items-center gap-3 border-b border-border bg-chrome-bar px-4 py-3">
        <Link to="/" className="rounded-full p-2 hover:bg-muted"><ArrowLeft className="h-4 w-4" /></Link>
        <KeyRound className="h-5 w-5 text-primary" />
        <h1 className="text-lg font-semibold">Password Manager</h1>
      </header>
      <div className="mx-auto max-w-3xl space-y-6 p-6">
        <form onSubmit={add} className="rounded-xl border border-border bg-card p-4 space-y-3">
          <h2 className="font-semibold flex items-center gap-2"><Plus className="h-4 w-4" /> Add credential</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
            <input className="rounded-md border border-border bg-omnibox px-3 py-2 text-sm" placeholder="site.com" value={site} onChange={(e) => setSite(e.target.value)} />
            <input className="rounded-md border border-border bg-omnibox px-3 py-2 text-sm" placeholder="username" value={username} onChange={(e) => setUsername(e.target.value)} />
            <input type="password" className="rounded-md border border-border bg-omnibox px-3 py-2 text-sm" placeholder="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
          <button className="rounded-md bg-primary px-4 py-2 text-sm text-primary-foreground hover:opacity-90">Save</button>
          <p className="text-xs text-muted-foreground">Stored locally in your browser. Demo only — do not use for real credentials.</p>
        </form>

        <div className="rounded-xl border border-border bg-card">
          {creds.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground text-sm">No saved passwords yet.</div>
          ) : creds.map((c) => (
            <div key={c.id} className="flex items-center gap-3 border-b border-border px-4 py-3 last:border-0">
              <div className="flex-1 min-w-0">
                <div className="font-medium truncate">{c.site}</div>
                <button onClick={() => copy(c.username)} className="text-xs text-muted-foreground hover:text-primary truncate block">{c.username}</button>
              </div>
              <code className="text-sm font-mono bg-muted px-2 py-1 rounded">
                {shown[c.id] ? c.password : "•".repeat(Math.min(c.password.length, 10))}
              </code>
              <button onClick={() => setShown((s) => ({ ...s, [c.id]: !s[c.id] }))} className="rounded-md p-2 hover:bg-muted" aria-label="Toggle">
                {shown[c.id] ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
              <button onClick={() => copy(c.password)} className="text-xs rounded-md px-2 py-1 hover:bg-muted">Copy</button>
              <button onClick={() => setCreds((cs) => cs.filter((x) => x.id !== c.id))} className="rounded-md p-2 hover:bg-muted text-destructive" aria-label="Delete">
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
};

export default Passwords;
