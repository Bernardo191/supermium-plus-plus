import { ArrowLeft, ArrowRight, RotateCw, Home, Star, StarOff, Shield, MoreVertical } from "lucide-react";
import { useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { useI18n } from "@/lib/i18n";
import { ExtensionsMenu } from "./ExtensionsMenu";

type Props = {
  url: string;
  canBack: boolean;
  canForward: boolean;
  isBookmarked: boolean;
  isDark: boolean;
  onBack: () => void;
  onForward: () => void;
  onReload: () => void;
  onHome: () => void;
  onNavigate: (url: string) => void;
  onToggleBookmark: () => void;
  onToggleMenu: () => void;
  onToggleDark: () => void;
  onOpenExtensions: () => void;
};

export const Toolbar = (p: Props) => {
  const { t } = useI18n();
  const [value, setValue] = useState(p.url === "aether://newtab" ? "" : p.url);
  const inputRef = useRef<HTMLInputElement>(null);

  const isSecure = p.url.startsWith("https://");

  return (
    <div className="toolbar-shape flex items-center gap-1 bg-chrome-toolbar px-3 py-2 border-b border-border">
      <IconBtn onClick={p.onBack} disabled={!p.canBack} label="Back"><ArrowLeft className="h-4 w-4" /></IconBtn>
      <IconBtn onClick={p.onForward} disabled={!p.canForward} label="Forward"><ArrowRight className="h-4 w-4" /></IconBtn>
      <IconBtn onClick={p.onReload} label="Reload"><RotateCw className="h-4 w-4" /></IconBtn>
      <IconBtn onClick={p.onHome} label="Home"><Home className="h-4 w-4" /></IconBtn>

      <form
        className="mx-2 flex flex-1 items-center gap-2 rounded-full bg-omnibox px-4 py-1.5 ring-1 ring-transparent focus-within:ring-primary focus-within:bg-card transition"
        onSubmit={(e) => { e.preventDefault(); p.onNavigate(value); inputRef.current?.blur(); }}
      >
        <Shield className={cn("h-4 w-4", isSecure ? "text-primary" : "text-muted-foreground")} />
        <input
          ref={inputRef}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onFocus={(e) => e.target.select()}
          placeholder={t("search_placeholder")}
          className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
        />
        <button type="button" onClick={p.onToggleBookmark} aria-label="Bookmark" className="text-muted-foreground hover:text-primary">
          {p.isBookmarked ? <Star className="h-4 w-4 fill-primary text-primary" /> : <StarOff className="h-4 w-4" />}
        </button>
      </form>

      <ExtensionsMenu onManage={p.onOpenExtensions} />
      <IconBtn onClick={p.onToggleMenu} label="Customize and control"><MoreVertical className="h-4 w-4" /></IconBtn>
    </div>
  );
};

const IconBtn = ({ children, onClick, disabled, label }: { children: React.ReactNode; onClick: () => void; disabled?: boolean; label: string }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    aria-label={label}
    className="rounded-full p-2 text-foreground/80 hover:bg-muted disabled:opacity-30 disabled:hover:bg-transparent transition"
  >
    {children}
  </button>
);
