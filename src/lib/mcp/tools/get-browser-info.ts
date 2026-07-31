import { defineTool } from "@lovable.dev/mcp-js";

export default defineTool({
  name: "get_browser_info",
  title: "Get browser info",
  description: "Return version, channel, engine and build details for the Aether browser shell.",
  inputSchema: {},
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: () => {
    const info = {
      name: "Aether",
      tagline: "A Chromium-inspired browser shell built with React",
      version: "152.0.8100.0",
      channel: "Canary",
      buildDate: "July 13, 2026",
      engine: "Blink (simulated)",
      javascript: "V8 12.7",
      userAgent: "Mozilla/5.0 Aether/152 Canary",
    };
    return {
      content: [{ type: "text", text: JSON.stringify(info, null, 2) }],
      structuredContent: info,
    };
  },
});
