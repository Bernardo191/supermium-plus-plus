import { Bookmark, faviconFor } from "@/lib/browser-store";
import { Plus, X } from "lucide-react";

type Props = {
  bookmarks: Bookmark[];
  canAdd: boolean;
  isBookmarked: boolean;
  onOpen: (url: string) => void;
  onRemove: (id: string) => void;
  onAddCurrent: () => void;
};

export const BookmarksBar = ({ bookmarks, canAdd, isBookmarked, onOpen, onRemove, onAddCurrent }: Props) => {
  return (
    <div className="flex items-center gap-1 overflow-x-auto bg-chrome-toolbar px-3 py-1.5 border-b border-border">
      <button
        onClick={onAddCurrent}
        disabled={!canAdd || isBookmarked}
        title={isBookmarked ? "Already in bookmarks" : "Add current page to bookmarks"}
        className="flex items-center gap-1 rounded-md px-2 py-1 text-xs text-muted-foreground hover:bg-muted disabled:opacity-40 disabled:hover:bg-transparent shrink-0"
      >
        <Plus className="h-3.5 w-3.5" />
        <span className="hidden sm:inline">Add</span>
      </button>
      <div className="mx-1 h-4 w-px bg-border shrink-0" />
      {bookmarks.length === 0 && (
        <span className="px-2 text-xs text-muted-foreground">No bookmarks yet — click Add or the star in the address bar.</span>
      )}
      {bookmarks.map((b) => (
        <div key={b.id} className="group flex items-center gap-1.5 rounded-md px-2 py-1 hover:bg-muted cursor-pointer text-xs shrink-0">
          <img src={faviconFor(b.url)} alt="" className="h-4 w-4 rounded-sm" onClick={() => onOpen(b.url)} />
          <span onClick={() => onOpen(b.url)} className="max-w-[140px] truncate">{b.title}</span>
          <button onClick={() => onRemove(b.id)} className="opacity-0 group-hover:opacity-60 hover:opacity-100" aria-label="Remove">
            <X className="h-3 w-3" />
          </button>
        </div>
      ))}
    </div>
  );
};
