import { useEffect, useState } from "react";

let windowed = false;
const listeners = new Set<(v: boolean) => void>();

export const isWindowed = () => windowed;

export const setWindowed = (v: boolean) => {
  windowed = v;
  document.documentElement.classList.toggle("window-mode", v);
  listeners.forEach((l) => l(v));
};

export const toggleWindowed = () => setWindowed(!windowed);

export const useWindowed = () => {
  const [v, setV] = useState(windowed);
  useEffect(() => {
    const l = (nv: boolean) => setV(nv);
    listeners.add(l);
    return () => { listeners.delete(l); };
  }, []);
  return v;
};
