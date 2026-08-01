import type { Tab } from "@/lib/browser-store";

export type Workspace = {
  id: string;
  name: string;
  color: string; // hex color for the workspace dot
};

export const WORKSPACE_COLORS = [
  "#3b82f6", // blue
  "#8b5cf6", // purple
  "#ec4899", // pink
  "#ef4444", // red
  "#f59e0b", // amber
  "#10b981", // green
  "#14b8a6", // teal
  "#64748b", // slate
];

const WS_KEY = "ae_workspaces";
const WS_ACTIVE_KEY = "ae_workspace_active";
const wsTabsKey = (id: string) => `ae_workspace_tabs_${id}`;

export const defaultWorkspace = (): Workspace => ({
  id: "default",
  name: "Personal",
  color: WORKSPACE_COLORS[0],
});

export const loadWorkspaces = (): Workspace[] => {
  try {
    const raw = localStorage.getItem(WS_KEY);
    const list = raw ? (JSON.parse(raw) as Workspace[]) : [];
    return list.length ? list : [defaultWorkspace()];
  } catch {
    return [defaultWorkspace()];
  }
};

export const saveWorkspaces = (list: Workspace[]) => {
  try { localStorage.setItem(WS_KEY, JSON.stringify(list)); } catch {}
};

export const loadActiveWorkspaceId = (): string => {
  try { return localStorage.getItem(WS_ACTIVE_KEY) || "default"; } catch { return "default"; }
};

export const saveActiveWorkspaceId = (id: string) => {
  try { localStorage.setItem(WS_ACTIVE_KEY, id); } catch {}
};

export const loadWorkspaceTabs = (id: string): { tabs: Tab[]; activeId: string } | null => {
  try {
    const raw = localStorage.getItem(wsTabsKey(id));
    if (!raw) return null;
    const parsed = JSON.parse(raw) as { tabs: Tab[]; activeId: string };
    if (!parsed?.tabs?.length) return null;
    return parsed;
  } catch {
    return null;
  }
};

export const saveWorkspaceTabs = (id: string, tabs: Tab[], activeId: string) => {
  try { localStorage.setItem(wsTabsKey(id), JSON.stringify({ tabs, activeId })); } catch {}
};

export const clearWorkspaceTabs = (id: string) => {
  try { localStorage.removeItem(wsTabsKey(id)); } catch {}
};
