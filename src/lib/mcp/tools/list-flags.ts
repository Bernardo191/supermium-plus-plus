import { defineTool } from "@lovable.dev/mcp-js";
import { FLAG_DEFS } from "../../settings-store";

export default defineTool({
  name: "list_flags",
  title: "List experimental flags",
  description: "List the experimental flags available on the aether://flags page, with their default values.",
  inputSchema: {},
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: () => ({
    content: [{ type: "text", text: JSON.stringify(FLAG_DEFS, null, 2) }],
    structuredContent: { flags: FLAG_DEFS },
  }),
});
