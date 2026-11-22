import "@/assets/chrome/icons.css";
import { cn } from "@/lib/utils";

type IconName = "back" | "reload" | "home" | "lock" | "info" | "star" | "star-filled" | "menu" | "more" | "close";

export const ChromeIcon = ({ name, className }: { name: IconName; className?: string }) => (
  <span aria-hidden="true" className={cn("chrome-icon", `chrome-icon-${name}`, className)} />
);