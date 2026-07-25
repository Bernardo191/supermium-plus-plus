import { useEffect, useState } from "react";

export type Locale = "en" | "pt-BR";

const LOCALE_KEY = "aether_locale";

const detectLocale = (): Locale => {
  try {
    const stored = localStorage.getItem(LOCALE_KEY) as Locale | null;
    if (stored === "en" || stored === "pt-BR") return stored;
  } catch {}
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || "";
    if (tz.includes("America/") && (tz.includes("Sao_Paulo") || tz.includes("Bahia") || tz.includes("Fortaleza") || tz.includes("Recife") || tz.includes("Manaus") || tz.includes("Belem") || tz.includes("Cuiaba") || tz.includes("Maceio") || tz.includes("Araguaina") || tz.includes("Boa_Vista") || tz.includes("Campo_Grande") || tz.includes("Eirunepe") || tz.includes("Noronha") || tz.includes("Porto_Velho") || tz.includes("Rio_Branco") || tz.includes("Santarem"))) {
      return "pt-BR";
    }
  } catch {}
  const langs = (typeof navigator !== "undefined" ? [navigator.language, ...(navigator.languages || [])] : []).filter(Boolean) as string[];
  if (langs.some((l) => l.toLowerCase().startsWith("pt"))) return "pt-BR";
  return "en";
};

type Dict = Record<string, string>;

const en: Dict = {
  app_name: "Aether",
  app_tagline: "A Chromium-inspired browser shell, built with React.",
  about_title: "About Aether",
  about_up_to_date: "Aether is up to date.",
  about_credits: "Credits",
  about_credit_chromium: "Powered by the Chromium open source project.",
  about_credit_icons: "Icons by Lucide. UI by shadcn/ui + Tailwind CSS.",
  about_credit_copy: "© 2026 Aether Project. All rights reserved.",
  field_version: "Version",
  field_channel: "Channel",
  field_build_date: "Build date",
  field_engine: "Engine",
  field_js: "JavaScript",
  field_ua: "User agent",
  feature_fast: "Fast",
  feature_fast_body: "Snappy tabs and instant navigation.",
  feature_secure: "Secure",
  feature_secure_body: "Per-tab isolation and HTTPS by default.",
  feature_modern: "Modern",
  feature_modern_body: "Built on a Chromium-style architecture.",
  back: "Back",
  settings: "Settings",
  appearance: "Appearance",
  appearance_desc: "Customize how Aether looks.",
  show_bookmarks_bar: "Show bookmarks bar",
  show_bookmarks_bar_desc: "Always display the bookmarks bar under the toolbar.",
  tab_search_button: "Tab search button",
  tab_search_button_desc: "Where the Ctrl+Shift+A tab search button appears in the tab strip.",
  position: "Position",
  position_desc: "Place the tab search button on the left, right, or hide it entirely.",
  left_default: "Left (default)",
  right: "Right",
  disabled: "Disabled",
  enabled: "Enabled",
  on_startup: "On startup",
  homepage: "Homepage",
  homepage_desc: "URL opened when you click the Home button.",
  open_flags: "Open experimental flags →",
  language: "Language",
  language_desc: "Interface language. Auto-detected from your location.",
  auto: "Auto",
  english: "English",
  portuguese_br: "Português (Brasil)",
  experiments: "Experiments",
  flags_url_desc: "aether://flags — these features are experimental and may change.",
  reset_all: "Reset all",
  search_placeholder: "Search Google or type a URL",
  search_the_web: "Search the web",
  shortcuts: "Shortcuts",
  recently_visited: "Recently visited",
  new_tab: "New tab",
  reopen_closed_tab: "Reopen closed tab",
  history: "History",
  downloads: "Downloads",
  bookmarks: "Bookmarks",
  bookmark_this_page: "Bookmark this page",
  find_in_page: "Find in page…",
  copy_current_url: "Copy current URL",
  share: "Share…",
  zoom: "Zoom",
  print: "Print…",
  light_theme: "Light theme",
  dark_theme: "Dark theme",
  clear_browsing_data: "Clear browsing data",
  experiments_flags: "Experiments (flags)",
  keyboard_shortcuts: "Keyboard shortcuts",
  about_aether: "About Aether",
  theme: "Theme",
  theme_desc: "Pick a visual style. Legacy themes disable the tab search button for authenticity.",
  theme_modern: "Modern (default)",
  theme_legacy_2010: "Legacy: Chrome 2010 (blue glossy)",
  theme_legacy_2016: "Legacy: Chrome 2016 (flat grey)",
  theme_legacy_2018: "Legacy: Chrome 2018 (rounded)",
  theme_legacy_2021: "Legacy: Chrome 2021 (V88)",
  wallpaper: "New tab wallpaper",
  wallpaper_desc: "Image URL or CSS color (e.g. #1a1a1a). Leave empty for default.",
  wallpaper_clear: "Clear",
  downloads_empty: "No downloads yet.",
  downloads_add: "Add download",
  downloads_clear: "Clear all",
  downloads_url: "URL or filename",
  open: "Open",
  remove: "Remove",
  window_controls: "Window controls",
  window_controls_desc: "Show minimize and maximize buttons in the toolbar.",
};


const ptBR: Dict = {
  app_name: "Aether",
  app_tagline: "Um navegador inspirado no Chromium, feito em React.",
  about_title: "Sobre o Aether",
  about_up_to_date: "O Aether está atualizado.",
  about_credits: "Créditos",
  about_credit_chromium: "Desenvolvido com base no projeto de código aberto Chromium.",
  about_credit_icons: "Ícones por Lucide. Interface com shadcn/ui + Tailwind CSS.",
  about_credit_copy: "© 2026 Projeto Aether. Todos os direitos reservados.",
  field_version: "Versão",
  field_channel: "Canal",
  field_build_date: "Data da build",
  field_engine: "Motor",
  field_js: "JavaScript",
  field_ua: "Agente de usuário",
  feature_fast: "Rápido",
  feature_fast_body: "Abas ágeis e navegação instantânea.",
  feature_secure: "Seguro",
  feature_secure_body: "Isolamento por aba e HTTPS por padrão.",
  feature_modern: "Moderno",
  feature_modern_body: "Construído em uma arquitetura estilo Chromium.",
  back: "Voltar",
  settings: "Configurações",
  appearance: "Aparência",
  appearance_desc: "Personalize a aparência do Aether.",
  show_bookmarks_bar: "Mostrar barra de favoritos",
  show_bookmarks_bar_desc: "Sempre exibir a barra de favoritos abaixo da barra de ferramentas.",
  tab_search_button: "Botão de busca de abas",
  tab_search_button_desc: "Onde o botão Ctrl+Shift+A de busca de abas aparece na barra de abas.",
  position: "Posição",
  position_desc: "Coloque o botão de busca de abas à esquerda, à direita ou oculte-o.",
  left_default: "Esquerda (padrão)",
  right: "Direita",
  disabled: "Desativado",
  enabled: "Ativado",
  on_startup: "Ao iniciar",
  homepage: "Página inicial",
  homepage_desc: "URL aberta ao clicar no botão Início.",
  open_flags: "Abrir sinalizadores experimentais →",
  language: "Idioma",
  language_desc: "Idioma da interface. Detectado automaticamente pela sua localização.",
  auto: "Automático",
  english: "Inglês",
  portuguese_br: "Português (Brasil)",
  experiments: "Experimentos",
  flags_url_desc: "aether://flags — estes recursos são experimentais e podem mudar.",
  reset_all: "Redefinir tudo",
  search_placeholder: "Pesquise no Google ou digite uma URL",
  search_the_web: "Pesquisar na web",
  shortcuts: "Atalhos",
  recently_visited: "Visitados recentemente",
  new_tab: "Nova aba",
  reopen_closed_tab: "Reabrir aba fechada",
  history: "Histórico",
  downloads: "Downloads",
  bookmarks: "Favoritos",
  bookmark_this_page: "Adicionar aos favoritos",
  find_in_page: "Localizar na página…",
  copy_current_url: "Copiar URL atual",
  share: "Compartilhar…",
  zoom: "Zoom",
  print: "Imprimir…",
  light_theme: "Tema claro",
  dark_theme: "Tema escuro",
  clear_browsing_data: "Limpar dados de navegação",
  experiments_flags: "Experimentos (flags)",
  keyboard_shortcuts: "Atalhos de teclado",
  about_aether: "Sobre o Aether",
  theme: "Tema",
  theme_desc: "Escolha um estilo visual. Temas legados desativam o botão de busca de abas por autenticidade.",
  theme_modern: "Moderno (padrão)",
  theme_legacy_2010: "Legado: Chrome 2010 (azul brilhante)",
  theme_legacy_2016: "Legado: Chrome 2016 (cinza plano)",
  theme_legacy_2018: "Legado: Chrome 2018 (arredondado)",
  theme_legacy_2021: "Legado: Chrome 2021 (V88)",
  wallpaper: "Plano de fundo da nova aba",
  wallpaper_desc: "URL de imagem ou cor CSS (ex.: #1a1a1a). Deixe vazio para o padrão.",
  wallpaper_clear: "Limpar",
  downloads_empty: "Nenhum download ainda.",
  downloads_add: "Adicionar download",
  downloads_clear: "Limpar tudo",
  downloads_url: "URL ou nome do arquivo",
  open: "Abrir",
  remove: "Remover",
  window_controls: "Controles da janela",
  window_controls_desc: "Mostrar botões de minimizar e maximizar na barra de ferramentas.",
};


const dicts: Record<Locale, Dict> = { en, "pt-BR": ptBR };

const listeners = new Set<() => void>();
let currentLocale: Locale = detectLocale();

export const getLocale = (): Locale => currentLocale;

export const setLocale = (l: Locale) => {
  currentLocale = l;
  try { localStorage.setItem(LOCALE_KEY, l); } catch {}
  listeners.forEach((fn) => fn());
};

export const clearLocaleOverride = () => {
  try { localStorage.removeItem(LOCALE_KEY); } catch {}
  currentLocale = detectLocale();
  listeners.forEach((fn) => fn());
};

export const t = (key: keyof typeof en): string => {
  return dicts[currentLocale][key] ?? en[key] ?? String(key);
};

export const useI18n = () => {
  const [, setTick] = useState(0);
  useEffect(() => {
    const fn = () => setTick((n) => n + 1);
    listeners.add(fn);
    return () => { listeners.delete(fn); };
  }, []);
  return { t, locale: currentLocale, setLocale, clearLocaleOverride };
};
