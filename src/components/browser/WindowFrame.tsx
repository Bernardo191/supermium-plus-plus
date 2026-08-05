import { useEffect, useRef, useState } from "react";

type Rect = { x: number; y: number; w: number; h: number };

const MIN_W = 480;
const MIN_H = 320;

type Dir = "n" | "s" | "e" | "w" | "ne" | "nw" | "se" | "sw";

export const WindowFrame = ({ children }: { children: React.ReactNode }) => {
  const [rect, setRect] = useState<Rect>(() => {
    const w = Math.min(1200, Math.round(window.innerWidth * 0.85));
    const h = Math.min(800, Math.round(window.innerHeight * 0.85));
    return { x: Math.round((window.innerWidth - w) / 2), y: Math.round((window.innerHeight - h) / 2), w, h };
  });
  const ref = useRef<HTMLDivElement | null>(null);
  const drag = useRef<{ mode: "move" | Dir; sx: number; sy: number; start: Rect } | null>(null);

  // Move the window by dragging the tab strip
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onDown = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest("button, input, a, [role='button']")) return;
      if (!target.closest("[data-window-drag]")) return;
      drag.current = { mode: "move", sx: e.clientX, sy: e.clientY, start: rect };
      e.preventDefault();
    };
    el.addEventListener("mousedown", onDown);
    return () => el.removeEventListener("mousedown", onDown);
  }, [rect]);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      const d = drag.current;
      if (!d) return;
      const dx = e.clientX - d.sx;
      const dy = e.clientY - d.sy;
      const s = d.start;
      if (d.mode === "move") {
        setRect({ ...s, x: s.x + dx, y: s.y + dy });
        return;
      }
      let { x, y, w, h } = s;
      if (d.mode.includes("e")) w = Math.max(MIN_W, s.w + dx);
      if (d.mode.includes("s")) h = Math.max(MIN_H, s.h + dy);
      if (d.mode.includes("w")) { w = Math.max(MIN_W, s.w - dx); x = s.x + (s.w - w); }
      if (d.mode.includes("n")) { h = Math.max(MIN_H, s.h - dy); y = s.y + (s.h - h); }
      setRect({ x, y, w, h });
    };
    const onUp = () => { drag.current = null; document.body.style.userSelect = ""; };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
  }, []);

  const startResize = (mode: Dir) => (e: React.MouseEvent) => {
    drag.current = { mode, sx: e.clientX, sy: e.clientY, start: rect };
    document.body.style.userSelect = "none";
    e.preventDefault();
    e.stopPropagation();
  };

  const handle = (mode: Dir, className: string, cursor: string) => (
    <div key={mode} onMouseDown={startResize(mode)} style={{ cursor }} className={`absolute z-50 ${className}`} />
  );

  return (
    <div
      ref={ref}
      className="fixed overflow-hidden rounded-2xl ring-2 ring-foreground/15 shadow-[0_25px_80px_-20px_rgba(0,0,0,0.25)] bg-background"
      style={{ left: rect.x, top: rect.y, width: rect.w, height: rect.h }}
    >
      <div className="h-full w-full overflow-hidden">{children}</div>
      {handle("n", "left-2 right-2 top-0 h-1.5", "ns-resize")}
      {handle("s", "left-2 right-2 bottom-0 h-1.5", "ns-resize")}
      {handle("w", "top-2 bottom-2 left-0 w-1.5", "ew-resize")}
      {handle("e", "top-2 bottom-2 right-0 w-1.5", "ew-resize")}
      {handle("nw", "left-0 top-0 h-3 w-3", "nwse-resize")}
      {handle("ne", "right-0 top-0 h-3 w-3", "nesw-resize")}
      {handle("sw", "left-0 bottom-0 h-3 w-3", "nesw-resize")}
      {handle("se", "right-0 bottom-0 h-3 w-3", "nwse-resize")}
    </div>
  );
};
