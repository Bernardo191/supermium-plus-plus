import { defineTool } from "@lovable.dev/mcp-js";

// Kept in sync with FLAG_DEFS in src/lib/settings-store.ts (duplicated so the
// MCP bundle stays free of React/browser imports).
const FLAGS = [
  { id: "compact-tabs", name: "Compact tabs", description: "Reduce tab height for a denser look.", default: false },
  { id: "rounded-omnibox", name: "Extra rounded omnibox", description: "Use a more pill-shaped address bar.", default: true },
  { id: "show-loading-bar", name: "Show loading progress bar", description: "Animated bar at the top of the webview while loading.", default: true },
  { id: "experimental-glass", name: "Experimental glass UI", description: "Adds a subtle backdrop blur to chrome surfaces.", default: false },
];

export default defineTool({
  name: "list_flags",
  title: "List experimental flags",
  description: "List the experimental flags available on the aether://flags page, with their default values.",
  inputSchema: {},
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: () => ({
    content: [{ type: "text", text: JSON.stringify(FLAGS, null, 2) }],
    structuredContent: { flags: FLAGS },
  }),
});
