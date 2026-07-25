import { HistoryItem, faviconFor, hostnameOf } from "@/lib/browser-store";
import { Clock, Trash2, X } from "lucide-react";

type Props = {
  open: boolean;
  history: HistoryItem[];
  onClose: () => void;
  onOpen: (url: string) => void;
  onClear: () => void;
};

export const HistoryPanel = ({ open, history, onClose, onOpen, onClear }: Props) => {
  if (!open) return null;
  return (
    <div className="absolute right-3 top-[100px] z-30 w-[360px] rounded-xl border border-border bg-popover shadow-xl">
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <div className="flex items-center gap-2 text-sm font-medium"><Clock className="h-4 w-4" /> History</div>
        <div className="flex items-center gap-1">
          <button onClick={onClear} className="rounded-md p-1.5 text-muted-foreground hover:bg-muted" aria-label="Clear"><Trash2 className="h-4 w-4" /></button>
          <button onClick={onClose} className="rounded-md p-1.5 text-muted-foreground hover:bg-muted" aria-label="Close"><X className="h-4 w-4" /></button>
        </div>
      </div>
      <div className="max-h-[60vh] overflow-y-auto p-2">
        {history.length === 0 && <div className="p-6 text-center text-sm text-muted-foreground">No history yet</div>}
        {history.map((h) => (
          <button
            key={h.id}
            onClick={() => onOpen(h.url)}
            className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-left hover:bg-muted"
          >
            <img src={faviconFor(h.url)} alt="" className="h-4 w-4 shrink-0" />
            <div className="min-w-0 flex-1">
              <div className="truncate text-sm">{h.title || hostnameOf(h.url)}</div>
              <div className="truncate text-xs text-muted-foreground">{hostnameOf(h.url)}</div>
            </div>
            <span className="shrink-0 text-[10px] text-muted-foreground">
              {new Date(h.visitedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};
