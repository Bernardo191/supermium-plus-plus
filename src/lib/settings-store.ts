import { useEffect, useState } from "react";

export type TabSearchPosition = "left" | "right" | "disabled";
export type ChromeTheme = "modern" | "legacy-2010" | "legacy-2016" | "legacy-2018" | "legacy-2021";
export type WindowControlsStyle = "windows" | "macos";
export type WorkspacesButtonMode = "hidden" | "icon" | "full";

export type Settings = {
  tabSearchPosition: TabSearchPosition;
  showBookmarksBar: boolean;
  homepage: string;
  theme: ChromeTheme;
  wallpaper: string; // empty = default; URL or CSS color
  windowControls: boolean; // show minimize/maximize buttons
  windowControlsStyle: WindowControlsStyle; // visual style for window controls
  forceDark: boolean; // force app-wide dark mode
  showHomeButton: boolean; // show the home button in the toolbar
  autoHideForward: boolean; // hide the forward button until a back navigation happens
  workspacesButton: WorkspacesButtonMode; // workspaces button display in the tab strip
  toolbarColor: string; // "" = theme default, "rainbow", or #rrggbb
  tabstripColor: string; // "" = theme default, "rainbow", or #rrggbb (ignored on the 2010 theme)
};


export type Flags = Record<string, boolean>;

export const FLAG_DEFS: { id: string; name: string; description: string; default: boolean }[] = [
  { id: "compact-tabs", name: "Compact tabs", description: "Reduce tab height for a denser look.", default: false },
  { id: "rounded-omnibox", name: "Extra rounded omnibox", description: "Use a more pill-shaped address bar.", default: true },
  { id: "show-loading-bar", name: "Show loading progress bar", description: "Animated bar at the top of the webview while loading.", default: true },
  { id: "experimental-glass", name: "Experimental glass UI", description: "Adds a subtle backdrop blur to chrome surfaces.", default: false },
];

const SETTINGS_KEY = "ae_settings";
const FLAGS_KEY = "ae_flags";

const defaultSettings: Settings = {
  tabSearchPosition: "left",
  showBookmarksBar: true,
  homepage: "aether://newtab",
  theme: "modern",
  wallpaper: "",
  windowControls: false,
  windowControlsStyle: "windows",
  forceDark: false,
  showHomeButton: true,
  autoHideForward: true,
  workspacesButton: "hidden",
  toolbarColor: "",
  tabstripColor: "auto",
};


const defaultFlags: Flags = Object.fromEntries(FLAG_DEFS.map((f) => [f.id, f.default]));

export const loadSettings = (): Settings => {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY) || localStorage.getItem("nb_settings") || "{}";
    return { ...defaultSettings, ...JSON.parse(raw) };
  } catch { return defaultSettings; }
};
export const saveSettings = (s: Settings) => localStorage.setItem(SETTINGS_KEY, JSON.stringify(s));

export const loadFlags = (): Flags => {
  try {
    const raw = localStorage.getItem(FLAGS_KEY) || localStorage.getItem("nb_flags") || "{}";
    return { ...defaultFlags, ...JSON.parse(raw) };
  } catch { return defaultFlags; }
};
export const saveFlags = (f: Flags) => localStorage.setItem(FLAGS_KEY, JSON.stringify(f));

const listeners = new Set<() => void>();
const notify = () => listeners.forEach((l) => l());

export const useSettings = () => {
  const [settings, setState] = useState<Settings>(() => loadSettings());
  useEffect(() => {
    const l = () => setState(loadSettings());
    listeners.add(l);
    return () => { listeners.delete(l); };
  }, []);
  const update = (patch: Partial<Settings>) => {
    const next = { ...loadSettings(), ...patch };
    saveSettings(next);
    setState(next);
    notify();
  };
  return [settings, update] as const;
};

export const useFlags = () => {
  const [flags, setState] = useState<Flags>(() => loadFlags());
  useEffect(() => {
    const l = () => setState(loadFlags());
    listeners.add(l);
    return () => { listeners.delete(l); };
  }, []);
  const setFlag = (id: string, value: boolean) => {
    const next = { ...loadFlags(), [id]: value };
    saveFlags(next);
    setState(next);
    notify();
  };
  const reset = () => {
    saveFlags(defaultFlags);
    setState(defaultFlags);
    notify();
  };
  return { flags, setFlag, reset };
};

export const isLegacyTheme = (t: ChromeTheme) => t !== "modern";
