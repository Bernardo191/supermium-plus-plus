import { useEffect, useRef, useState } from "react";
import { Check, Plus, Trash2, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import { WORKSPACE_COLORS, type Workspace } from "@/lib/workspaces-store";

type Props = {
  workspaces: Workspace[];
  activeId: string;
  onSwitch: (id: string) => void;
  onCreate: (name: string, color: string) => void;
  onDelete: (id: string) => void;
  compact?: boolean;
};

export const WorkspacesMenu = ({ workspaces, activeId, onSwitch, onCreate, onDelete, compact }: Props) => {
  const [open, setOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const [name, setName] = useState("");
  const [color, setColor] = useState(WORKSPACE_COLORS[1]);
  const ref = useRef<HTMLDivElement>(null);

  const current = workspaces.find((w) => w.id === activeId) ?? workspaces[0];

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
        setCreating(false);
      }
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [open]);

  const submit = () => {
    const n = name.trim();
    if (!n) return;
    onCreate(n, color);
    setName("");
    setCreating(false);
    setOpen(false);
  };

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        title={`Workspace: ${current?.name ?? "Personal"}`}
        aria-label="Workspaces"
        style={{ borderRadius: "8px" }}
        className={cn(
          "relative z-30 flex h-[31px] shrink-0 items-center gap-1.5 px-2 text-xs font-medium transition-colors",
          "bg-chrome-toolbar text-foreground/80 hover:bg-foreground/10"
        )}
      >
        <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: current?.color }} />
        {!compact && <span className="max-w-[110px] truncate">{current?.name}</span>}
      </button>

      {open && (
        <div className="absolute left-0 top-[35px] z-50 w-64 overflow-hidden rounded-xl border border-border bg-popover p-1 shadow-xl">
          <div className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-muted-foreground">
            <Users className="h-3.5 w-3.5" /> Workspaces
          </div>
          <div className="max-h-64 overflow-y-auto">
            {workspaces.map((w) => (
              <div
                key={w.id}
                className="group flex items-center gap-2 rounded-lg px-3 py-2 text-sm hover:bg-muted"
              >
                <button
                  onClick={() => { onSwitch(w.id); setOpen(false); }}
                  className="flex min-w-0 flex-1 items-center gap-2 text-left"
                >
                  <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: w.color }} />
                  <span className="flex-1 truncate">{w.name}</span>
                  {w.id === activeId && <Check className="h-3.5 w-3.5 text-primary" />}
                </button>
                {workspaces.length > 1 && (
                  <button
                    onClick={() => onDelete(w.id)}
                    aria-label={`Delete ${w.name}`}
                    className="opacity-0 transition group-hover:opacity-60 hover:!opacity-100 hover:text-destructive"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
            ))}
          </div>

          <div className="mt-1 border-t border-border pt-1">
            {creating ? (
              <div className="px-3 py-2">
                <input
                  autoFocus
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter") submit(); if (e.key === "Escape") setCreating(false); }}
                  placeholder="Workspace name"
                  className="w-full rounded-md border border-border bg-background px-2 py-1.5 text-sm outline-none focus:ring-1 focus:ring-primary"
                />
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {WORKSPACE_COLORS.map((c) => (
                    <button
                      key={c}
                      onClick={() => setColor(c)}
                      aria-label={`Color ${c}`}
                      className={cn("h-5 w-5 rounded-full border-2", color === c ? "border-foreground" : "border-transparent")}
                      style={{ background: c }}
                    />
                  ))}
                </div>
                <button
                  onClick={submit}
                  className="mt-2 w-full rounded-md bg-primary px-2 py-1.5 text-xs font-medium text-primary-foreground hover:opacity-90"
                >
                  Create workspace
                </button>
              </div>
            ) : (
              <button
                onClick={() => setCreating(true)}
                className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm hover:bg-muted"
              >
                <Plus className="h-4 w-4" /> New workspace
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
