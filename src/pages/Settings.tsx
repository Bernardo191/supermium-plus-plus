import { useSettings } from "@/lib/settings-store";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useI18n, type Locale } from "@/lib/i18n";

const SettingsPage = () => {
  const [settings, update] = useSettings();
  const { t, locale, setLocale, clearLocaleOverride } = useI18n();
  const stored = (typeof window !== "undefined" && localStorage.getItem("aether_locale")) || "";
  const langValue = stored ? (stored as Locale) : "auto";

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border bg-card">
        <div className="mx-auto flex max-w-3xl items-center gap-3 px-6 py-4">
          <Link to="/" className="rounded-md p-2 hover:bg-muted" aria-label={t("back")}>
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <h1 className="text-xl font-semibold">{t("settings")}</h1>
        </div>
      </header>

      <main className="mx-auto max-w-3xl space-y-8 px-6 py-8">
        <Section title={t("appearance")} description={t("appearance_desc")}>
          <Row label={t("show_bookmarks_bar")} description={t("show_bookmarks_bar_desc")}>
            <Toggle checked={settings.showBookmarksBar} onChange={(v) => update({ showBookmarksBar: v })} />
          </Row>
          <Row label="Show home button" description="Display the home button in the toolbar, like Chrome's optional home button.">
            <Toggle checked={settings.showHomeButton} onChange={(v) => update({ showHomeButton: v })} />
          </Row>
          <Row label="Automatic forward button" description="Hide the forward arrow until you navigate back, then show it automatically.">
            <Toggle checked={settings.autoHideForward} onChange={(v) => update({ autoHideForward: v })} />
          </Row>
          <Row label="Force dark mode" description="Apply a dark theme to the browser UI. Supported on Modern and the 2021 theme (dark mode landed in Chrome 73 on macOS and Chrome 74 on Windows/Linux).">
            <Toggle
              checked={settings.forceDark}
              onChange={(v) => {
                const darkCapable = settings.theme === "modern" || settings.theme === "legacy-2021";
                update({ forceDark: v, ...(v && !darkCapable ? { theme: "modern" as const } : {}) });
              }}
            />
          </Row>
          <Row label={t("theme")} description={settings.forceDark ? "Only Modern and the 2021 theme support dark mode. Disable force dark to use older themes." : t("theme_desc")}>
            <select
              value={settings.theme}
              onChange={(e) => update({ theme: e.target.value as any })}
              className="rounded-md border border-border bg-background px-3 py-1.5 text-sm"
            >
              <option value="modern">{t("theme_modern")}</option>
              <option value="legacy-2010" disabled={settings.forceDark}>{t("theme_legacy_2010")}{settings.forceDark ? " (light only)" : ""}</option>
              <option value="legacy-2016" disabled={settings.forceDark}>{t("theme_legacy_2016")}{settings.forceDark ? " (light only)" : ""}</option>
              <option value="legacy-2018" disabled={settings.forceDark}>{t("theme_legacy_2018")}{settings.forceDark ? " (light only)" : ""}</option>
              <option value="legacy-2021">{t("theme_legacy_2021")}</option>
            </select>
          </Row>
          <Row label={t("wallpaper")} description={t("wallpaper_desc")}>
            <div className="flex items-center gap-2">
              <input
                value={settings.wallpaper}
                onChange={(e) => update({ wallpaper: e.target.value })}
                placeholder="https://… or #1a1a1a"
                className="w-64 rounded-md border border-border bg-background px-3 py-1.5 text-sm"
              />
              <button
                onClick={() => update({ wallpaper: "" })}
                className="rounded-md border border-border px-2 py-1.5 text-xs hover:bg-muted"
              >
                {t("wallpaper_clear")}
              </button>
            </div>
          </Row>
          <Row label={t("window_controls")} description={t("window_controls_desc")}>
            <Toggle checked={settings.windowControls} onChange={(v) => update({ windowControls: v })} />
          </Row>
          <Row label="Window controls style" description="Choose between Windows-style buttons or macOS-style traffic lights.">
            <select
              value={settings.windowControlsStyle}
              onChange={(e) => update({ windowControlsStyle: e.target.value as any })}
              disabled={!settings.windowControls}
              className="rounded-md border border-border bg-background px-3 py-1.5 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <option value="windows">Windows</option>
              <option value="macos">macOS</option>
            </select>
          </Row>
        </Section>


        <Section title={t("language")} description={t("language_desc")}>
          <Row label={t("language")} description="">
            <select
              value={langValue}
              onChange={(e) => {
                const v = e.target.value;
                if (v === "auto") clearLocaleOverride();
                else setLocale(v as Locale);
              }}
              className="rounded-md border border-border bg-background px-3 py-1.5 text-sm"
            >
              <option value="auto">{t("auto")} ({locale})</option>
              <option value="en">{t("english")}</option>
              <option value="pt-BR">{t("portuguese_br")}</option>
            </select>
          </Row>
        </Section>

        <Section title={t("tab_search_button")} description={t("tab_search_button_desc")}>
          <Row label={t("position")} description={t("position_desc")}>
            <select
              value={settings.tabSearchPosition}
              onChange={(e) => update({ tabSearchPosition: e.target.value as any })}
              className="rounded-md border border-border bg-background px-3 py-1.5 text-sm"
            >
              <option value="left">{t("left_default")}</option>
              <option value="right">{t("right")}</option>
              <option value="disabled">{t("disabled")}</option>
            </select>
          </Row>
        </Section>

        <Section title={t("on_startup")} description="">
          <Row label={t("homepage")} description={t("homepage_desc")}>
            <input
              value={settings.homepage}
              onChange={(e) => update({ homepage: e.target.value })}
              className="w-72 rounded-md border border-border bg-background px-3 py-1.5 text-sm"
            />
          </Row>
        </Section>

        <div className="border-t border-border pt-6">
          <Link to="/flags" className="text-sm text-primary hover:underline">
            {t("open_flags")}
          </Link>
        </div>
      </main>
    </div>
  );
};

const Section = ({ title, description, children }: { title: string; description: string; children: React.ReactNode }) => (
  <section>
    <h2 className="text-base font-semibold">{title}</h2>
    {description && <p className="mt-1 text-sm text-muted-foreground">{description}</p>}
    <div className="mt-4 divide-y divide-border rounded-xl border border-border bg-card">
      {children}
    </div>
  </section>
);

const Row = ({ label, description, children }: { label: string; description?: string; children: React.ReactNode }) => (
  <div className="flex items-center justify-between gap-6 px-4 py-3">
    <div className="min-w-0">
      <div className="text-sm font-medium">{label}</div>
      {description && <div className="text-xs text-muted-foreground">{description}</div>}
    </div>
    <div className="shrink-0">{children}</div>
  </div>
);

const Toggle = ({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) => (
  <button
    onClick={() => onChange(!checked)}
    className={`relative h-6 w-11 rounded-full transition ${checked ? "bg-primary" : "bg-muted"}`}
    aria-pressed={checked}
  >
    <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-card shadow transition ${checked ? "left-5" : "left-0.5"}`} />
  </button>
);

export default SettingsPage;
