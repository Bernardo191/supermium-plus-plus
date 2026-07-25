import { Link } from "react-router-dom";
import { ArrowLeft, FlaskConical } from "lucide-react";
import { FLAG_DEFS, useFlags } from "@/lib/settings-store";
import { useI18n } from "@/lib/i18n";

const FlagsPage = () => {
  const { flags, setFlag, reset } = useFlags();
  const { t } = useI18n();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-amber-500/40 bg-amber-500/10">
        <div className="mx-auto flex max-w-3xl items-center gap-3 px-6 py-4">
          <Link to="/" className="rounded-md p-2 hover:bg-muted" aria-label={t("back")}>
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <FlaskConical className="h-5 w-5 text-amber-600" />
          <div>
            <h1 className="text-xl font-semibold">{t("experiments")}</h1>
            <p className="text-xs text-muted-foreground">{t("flags_url_desc")}</p>
          </div>
          <button onClick={reset} className="ml-auto rounded-md border border-border bg-card px-3 py-1.5 text-xs hover:bg-muted">
            {t("reset_all")}
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-3xl divide-y divide-border px-6 py-6">
        {FLAG_DEFS.map((f) => (
          <div key={f.id} className="flex items-center justify-between gap-6 py-4">
            <div className="min-w-0">
              <div className="text-sm font-medium">{f.name}</div>
              <div className="text-xs text-muted-foreground">{f.description}</div>
              <code className="mt-1 inline-block text-[10px] text-muted-foreground">#{f.id}</code>
            </div>
            <select
              value={flags[f.id] ? "enabled" : "disabled"}
              onChange={(e) => setFlag(f.id, e.target.value === "enabled")}
              className="rounded-md border border-border bg-background px-3 py-1.5 text-sm"
            >
              <option value="disabled">{t("disabled")}</option>
              <option value="enabled">{t("enabled")}</option>
            </select>
          </div>
        ))}
      </main>
    </div>
  );
};

export default FlagsPage;