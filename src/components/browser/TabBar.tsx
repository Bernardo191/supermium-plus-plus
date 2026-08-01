import { X, Plus, ChevronDown, Minus, Square, Copy } from "lucide-react";
import { useEffect, useState } from "react";
import { Tab, faviconFor } from "@/lib/browser-store";
import { cn } from "@/lib/utils";
import { useSettings } from "@/lib/settings-store";
import { WorkspacesMenu } from "./WorkspacesMenu";
import type { Workspace } from "@/lib/workspaces-store";

type Props = {
  tabs: Tab[];
  activeId: string;
  onSelect: (id: string) => void;
  onClose: (id: string) => void;
  onNew: () => void;
  onOpenSearch: () => void;
  workspaces: Workspace[];
  activeWorkspaceId: string;
  onSwitchWorkspace: (id: string) => void;
  onCreateWorkspace: (name: string, color: string) => void;
  onDeleteWorkspace: (id: string) => void;
};

export const TabBar = ({ tabs, activeId, onSelect, onClose, onNew, onOpenSearch, workspaces, activeWorkspaceId, onSwitchWorkspace, onCreateWorkspace, onDeleteWorkspace }: Props) => {
  const [settings] = useSettings();
  const legacy = settings.theme !== "modern";
  const flushTop = settings.theme === "legacy-2018" || settings.theme === "legacy-2021";
  const macOn = settings.windowControls && settings.windowControlsStyle === "macos";
  const pos = settings.theme === "legacy-2021"
    ? "right"
    : legacy
      ? "disabled"
      : macOn
        ? "right"
        : settings.tabSearchPosition;

  const [maximized, setMaximized] = useState<boolean>(typeof document !== "undefined" && !!document.fullscreenElement);

  useEffect(() => {
    const onFs = () => setMaximized(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", onFs);
    return () => document.removeEventListener("fullscreenchange", onFs);
  }, []);

  const onMinimize = () => {
    try { (document.activeElement as HTMLElement | null)?.blur?.(); } catch {}
    try { window.blur(); } catch {}
  };
  const onMaximize = async () => {
    try {
      if (document.fullscreenElement) await document.exitFullscreen();
      else await document.documentElement.requestFullscreen();
    } catch {}
  };

  const isModern = settings.theme === "modern";
  const is2021 = settings.theme === "legacy-2021";
  const searchBtn = pos !== "disabled" ? (
    <button
      onClick={onOpenSearch}
      title="Search tabs (Ctrl+Shift+A)"
      aria-label="Search tabs"
      style={{ borderRadius: "8px" }}
      className={cn(
        "relative z-30 flex h-[31px] w-[31px] shrink-0 items-center justify-center transition-colors",
        isModern
          ? "bg-chrome-toolbar text-foreground/70 hover:bg-foreground/10"
          : is2021
            ? "bg-transparent text-foreground/70 hover:bg-foreground/10"
            : "bg-secondary text-secondary-foreground hover:bg-primary/15 hover:text-primary"
      )}
    >
      <ChevronDown className="h-4 w-4" />
    </button>
  ) : null;



  const workspacesBtn = (
    <div className="mr-1 mb-1 flex items-center">
      <WorkspacesMenu
        workspaces={workspaces}
        activeId={activeWorkspaceId}
        onSwitch={onSwitchWorkspace}
        onCreate={onCreateWorkspace}
        onDelete={onDeleteWorkspace}
        compact={legacy}
      />
    </div>
  );

  const macControls = settings.windowControls && settings.windowControlsStyle === "macos" ? (
    <div className={cn("flex items-center gap-2 px-3 shrink-0", flushTop ? "h-10" : "h-9")}>
      <button
        onClick={() => { try { window.close(); } catch {} }}
        title="Close"
        aria-label="Close"
        className="h-3.5 w-3.5 rounded-full bg-[#ff5f57] hover:brightness-110 transition border border-black/10"
      />
      <button
        onClick={onMinimize}
        title="Minimize"
        aria-label="Minimize"
        className="h-3.5 w-3.5 rounded-full bg-[#febc2e] hover:brightness-110 transition border border-black/10"
      />
      <button
        onClick={onMaximize}
        title={maximized ? "Restore" : "Maximize"}
        aria-label={maximized ? "Restore" : "Maximize"}
        className="h-3.5 w-3.5 rounded-full bg-[#28c840] hover:brightness-110 transition border border-black/10"
      />
    </div>
  ) : null;

  const winControls = settings.windowControls && settings.windowControlsStyle === "windows" ? (
    <div className="flex items-center gap-0.5 ml-1 mb-1">
      <button
        onClick={onMinimize}
        title="Minimize"
        aria-label="Minimize"
        className="flex h-7 w-10 items-center justify-center text-foreground/70 hover:bg-muted transition"
      >
        <Minus className="h-4 w-4" />
      </button>
      <button
        onClick={onMaximize}
        title={maximized ? "Restore" : "Maximize"}
        aria-label={maximized ? "Restore" : "Maximize"}
        className="flex h-7 w-10 items-center justify-center text-foreground/70 hover:bg-muted transition"
      >
        {maximized ? <Copy className="h-3.5 w-3.5" /> : <Square className="h-3.5 w-3.5" />}
      </button>
      <button
        onClick={() => { try { window.close(); } catch {} }}
        title="Close browser"
        aria-label="Close browser"
        className="flex h-7 w-10 items-center justify-center text-foreground/70 hover:bg-red-500 hover:text-white transition"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  ) : null;

  return (
    <div className={cn("flex items-end gap-1 px-2 bg-chrome-bar select-none", flushTop ? "pt-0" : "pt-2")}>
      {macControls}
      {pos === "left" && <div className="mr-0.5 mb-1 flex items-center">{searchBtn}</div>}
      {workspacesBtn}

      <div className="flex flex-1 items-end gap-0.5 min-w-0">
        {tabs.flatMap((t, i) => {
          const active = t.id === activeId;
          const tab = (
            <div
              key={`tab-${t.id}`}
              onClick={() => onSelect(t.id)}
              onAuxClick={(e) => { if (e.button === 1) onClose(t.id); }}
              title={t.title}
              className={cn(
                "tab-shape group relative flex min-w-0 flex-1 basis-0 cursor-pointer items-center text-xs transition-colors",
                flushTop ? "h-10" : "h-9",
                "max-w-[240px]",
                active
                  ? "bg-tab-active text-foreground z-10"
                  : "bg-transparent text-muted-foreground"
              )}
            >
              {!active && (
                <span className="tab-pill pointer-events-none absolute inset-x-1 top-1/2 h-7 -translate-y-1/2 bg-foreground/0 transition-colors group-hover:bg-foreground/10 group-active:bg-foreground/[0.18]" />
              )}
              <div className="relative z-[1] flex min-w-0 flex-1 items-center gap-2 px-3">
                {t.url !== "aether://newtab" && (
                  <img src={faviconFor(t.url)} alt="" className="h-4 w-4 shrink-0 rounded-sm" />
                )}
                <span className="flex-1 truncate min-w-0">{t.title}</span>
                <button
                  onClick={(e) => { e.stopPropagation(); onClose(t.id); }}
                  className="rounded-full p-0.5 opacity-60 hover:bg-foreground/10 hover:opacity-100 shrink-0"
                  aria-label="Close tab"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          );
          const next = tabs[i + 1];
          const nextActive = next?.id === activeId;
          const separator = (i < tabs.length - 1 && tabs.length >= 3 && !active && !nextActive) ? (
            <div
              key={`sep-${t.id}`}
              className={cn(
                "flex items-center justify-center",
                flushTop ? "h-10" : "h-9"
              )}
            >
              <div className="h-4 w-px bg-foreground/25" />
            </div>
          ) : null;
          return separator ? [tab, separator] : [tab];

        })}
        <button
          onClick={onNew}
          className="ml-1 mb-1 shrink-0 rounded-full p-1.5 text-muted-foreground hover:bg-muted"
          aria-label="New tab"
          title="New tab (Ctrl+T)"
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>

      {pos === "right" && <div className="ml-1 mb-1 flex items-center">{searchBtn}</div>}
      {winControls}
    </div>
  );
};
