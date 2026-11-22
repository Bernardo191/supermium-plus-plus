import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { useI18n } from "@/lib/i18n";
import { ExtensionsMenu } from "./ExtensionsMenu";
import { useSettings } from "@/lib/settings-store";
import { Button } from "@/components/ui/button";
import { ChromeIcon } from "./ChromeIcon";

type Props = {
  firstTabActive?: boolean;
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

export const shouldHideToolbarLeftFoot = (theme: string, position: string, hasLeadingControls = false) =>
  theme === "modern" && position !== "left" && !hasLeadingControls;

export const Toolbar = (p: Props) => {
  const { t } = useI18n();
  const [settings] = useSettings();
  const [value, setValue] = useState(p.url === "aether://newtab" ? "" : p.url);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setValue(p.url === "aether://newtab" ? "" : p.url);
  }, [p.url]);

  const macOn = settings.windowControls && settings.windowControlsStyle === "macos";
  const tabSearchPos = macOn ? "right" : settings.tabSearchPosition;
  const hasLeadingControls = macOn || settings.workspacesButton !== "hidden";
  const hideLeftFoot = (p.firstTabActive ?? true) && shouldHideToolbarLeftFoot(settings.theme, tabSearchPos, hasLeadingControls);

  const isSecure = p.url.startsWith("https://");

  return (
    <div className={cn("toolbar-shape flex min-w-0 shrink-0 items-center bg-chrome-toolbar", hideLeftFoot && "toolbar-no-left-foot")}>
      <IconBtn onClick={p.onBack} disabled={!p.canBack} label="Back"><ChromeIcon name="back" /></IconBtn>
      {(!settings.autoHideForward || p.canForward) && (
        <IconBtn onClick={p.onForward} disabled={!p.canForward} label="Forward"><ChromeIcon name="back" className="rotate-180" /></IconBtn>
      )}
      <IconBtn onClick={p.onReload} label="Reload"><ChromeIcon name="reload" /></IconBtn>
      {settings.showHomeButton && (
        <IconBtn onClick={p.onHome} label="Home"><ChromeIcon name="home" /></IconBtn>
      )}

      <form
        className="chrome-omnibox flex min-w-0 flex-1 shrink items-center bg-omnibox ring-1 ring-transparent focus-within:ring-primary transition"
        onSubmit={(e) => { e.preventDefault(); p.onNavigate(value); inputRef.current?.blur(); }}
      >
        <ChromeIcon name={isSecure ? "lock" : "info"} className="chrome-site-icon text-muted-foreground" />
        <input
          ref={inputRef}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onFocus={(e) => e.target.select()}
          placeholder={t("search_placeholder")}
          aria-label="Address and search bar"
          className="w-full min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
        />
        <Button variant="ghost" size="icon" type="button" onClick={p.onToggleBookmark} aria-label="Bookmark" title="Bookmark" className={cn("chrome-bookmark shrink-0 text-muted-foreground hover:text-primary", p.isBookmarked && "text-primary")}>
          <ChromeIcon name={p.isBookmarked ? "star-filled" : "star"} />
        </Button>
      </form>

      <ExtensionsMenu onManage={p.onOpenExtensions} />
      <Button variant="ghost" size="icon" onClick={p.onToggleMenu} aria-label="Customize and control" title="Customize and control" className="chrome-tool-button shrink-0 text-foreground/80">
        <ChromeIcon name={settings.theme === "legacy-2010" || settings.theme === "legacy-2016" ? "menu" : "more"} />
      </Button>
    </div>
  );
};

const IconBtn = ({ children, onClick, disabled, label }: { children: React.ReactNode; onClick: () => void; disabled?: boolean; label: string }) => (
  <Button variant="ghost" size="icon"
    onClick={onClick}
    disabled={disabled}
    aria-label={label}
    title={label}
    className="chrome-tool-button shrink-0 text-foreground/80 hover:bg-muted disabled:opacity-30 disabled:hover:bg-transparent transition"
  >
    {children}
  </Button>
);
