import { useEffect, useState } from "react";

export type Download = {
  id: string;
  name: string;
  url: string;
  size?: string;
  addedAt: number;
};

const KEY = "ae_downloads";

export const loadDownloads = (): Download[] => {
  try { return JSON.parse(localStorage.getItem(KEY) || "[]"); } catch { return []; }
};
export const saveDownloads = (d: Download[]) => localStorage.setItem(KEY, JSON.stringify(d.slice(0, 200)));

const listeners = new Set<() => void>();

export const useDownloads = () => {
  const [items, setItems] = useState<Download[]>(() => loadDownloads());
  useEffect(() => {
    const fn = () => setItems(loadDownloads());
    listeners.add(fn);
    return () => { listeners.delete(fn); };
  }, []);
  const add = (d: Omit<Download, "id" | "addedAt">) => {
    const next = [{ ...d, id: crypto.randomUUID(), addedAt: Date.now() }, ...loadDownloads()];
    saveDownloads(next); setItems(next); listeners.forEach((l) => l());
  };
  const remove = (id: string) => {
    const next = loadDownloads().filter((x) => x.id !== id);
    saveDownloads(next); setItems(next); listeners.forEach((l) => l());
  };
  const clear = () => {
    saveDownloads([]); setItems([]); listeners.forEach((l) => l());
  };
  return { items, add, remove, clear };
};
