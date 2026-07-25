import { useNavigate } from "react-router-dom";
import { ArrowLeft, Globe, Shield, Zap, Cpu } from "lucide-react";
import { useI18n } from "@/lib/i18n";

const About = () => {
  const nav = useNavigate();
  const { t } = useI18n();
  const version = "152.0.8100.0";
  const channel = "Canary";
  const buildDate = "July 13, 2026";

  return (
    <main className="min-h-screen bg-background text-foreground">
      <header className="flex items-center gap-3 border-b border-border bg-chrome-toolbar px-4 py-3">
        <button onClick={() => nav("/")} className="rounded-full p-2 hover:bg-muted" aria-label={t("back")}>
          <ArrowLeft className="h-4 w-4" />
        </button>
        <h1 className="text-base font-semibold">{t("about_title")}</h1>
      </header>

      <div className="mx-auto max-w-3xl p-8">
        <section className="rounded-2xl border border-border bg-card p-8 shadow-sm">
          <div className="flex items-center gap-5">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-primary/60 text-primary-foreground shadow-lg">
              <Globe className="h-8 w-8" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">{t("app_name")}</h2>
              <p className="text-sm text-muted-foreground">{t("app_tagline")}</p>
            </div>
          </div>

          <dl className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Field label={t("field_version")} value={`v${version} (Official Build)`} />
            <Field label={t("field_channel")} value={channel} />
            <Field label={t("field_build_date")} value={buildDate} />
            <Field label={t("field_engine")} value="Blink (simulated)" />
            <Field label={t("field_js")} value="V8 12.7" />
            <Field label={t("field_ua")} value="Mozilla/5.0 Aether/152 Canary" />
          </dl>

          <p className="mt-6 rounded-lg bg-muted/60 p-3 text-sm text-muted-foreground">
            {t("about_up_to_date")}
          </p>
        </section>

        <section className="mt-6 grid gap-4 sm:grid-cols-3">
          <Feature icon={<Zap className="h-5 w-5" />} title={t("feature_fast")} body={t("feature_fast_body")} />
          <Feature icon={<Shield className="h-5 w-5" />} title={t("feature_secure")} body={t("feature_secure_body")} />
          <Feature icon={<Cpu className="h-5 w-5" />} title={t("feature_modern")} body={t("feature_modern_body")} />
        </section>

        <section className="mt-6 rounded-2xl border border-border bg-card p-6 text-sm">
          <h3 className="mb-3 font-semibold">{t("about_credits")}</h3>
          <ul className="space-y-1 text-muted-foreground">
            <li>{t("about_credit_chromium")}</li>
            <li>{t("about_credit_icons")}</li>
            <li>{t("about_credit_copy")}</li>
          </ul>
        </section>
      </div>
    </main>
  );
};

const Field = ({ label, value }: { label: string; value: string }) => (
  <div className="rounded-lg border border-border bg-background/50 px-3 py-2">
    <div className="text-[11px] uppercase tracking-wide text-muted-foreground">{label}</div>
    <div className="text-sm font-medium">{value}</div>
  </div>
);

const Feature = ({ icon, title, body }: { icon: React.ReactNode; title: string; body: string }) => (
  <div className="rounded-2xl border border-border bg-card p-4">
    <div className="mb-2 inline-flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">{icon}</div>
    <div className="font-semibold">{title}</div>
    <div className="text-sm text-muted-foreground">{body}</div>
  </div>
);

export default About;
