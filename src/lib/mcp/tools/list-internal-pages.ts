import { defineTool } from "@lovable.dev/mcp-js";

const PAGES = [
  { url: "aether://newtab", title: "New Tab" },
  { url: "aether://settings", title: "Settings" },
  { url: "aether://flags", title: "Experiments" },
  { url: "aether://about", title: "About Aether" },
  { url: "aether://downloads", title: "Downloads" },
  { url: "aether://passwords", title: "Password Manager" },
  { url: "aether://extensions", title: "Extensions" },
];

export default defineTool({
  name: "list_internal_pages",
  title: "List internal pages",
  description: "List the built-in aether:// pages and their titles.",
  inputSchema: {},
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: () => ({
    content: [{ type: "text", text: JSON.stringify(PAGES, null, 2) }],
    structuredContent: { pages: PAGES },
  }),
});
