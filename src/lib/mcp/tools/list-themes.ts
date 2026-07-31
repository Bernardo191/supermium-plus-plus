import { defineTool } from "@lovable.dev/mcp-js";

const THEMES = [
  { id: "modern", name: "Modern", description: "Current Chrome-style chrome with 12px rounded tabs." },
  { id: "legacy-2010", name: "Legacy 2010", description: "Early Chrome look with 6px tab corners." },
  { id: "legacy-2016", name: "Legacy 2016", description: "Flat Material era with nearly square 2px tabs." },
  { id: "legacy-2018", name: "Legacy 2018", description: "Chrome 69 refresh with 6px rounded tabs." },
  { id: "legacy-2021", name: "Legacy 2021", description: "Chrome 90 era with 8px rounded tabs." },
];

export default defineTool({
  name: "list_themes",
  title: "List themes",
  description: "List the chrome themes (eras) Aether can be styled with.",
  inputSchema: {},
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: () => ({
    content: [{ type: "text", text: JSON.stringify(THEMES, null, 2) }],
    structuredContent: { themes: THEMES },
  }),
});
