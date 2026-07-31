import { defineMcp } from "@lovable.dev/mcp-js";
import getBrowserInfoTool from "./tools/get-browser-info";
import listThemesTool from "./tools/list-themes";
import listFlagsTool from "./tools/list-flags";
import listInternalPagesTool from "./tools/list-internal-pages";

export default defineMcp({
  name: "remix-of-remix-of-public",
  title: "Remix of Remix of public",
  version: "0.1.0",
  instructions:
    "Read-only tools describing the Aether browser shell: build info, available chrome themes, experimental flags, and built-in aether:// pages.",
  tools: [getBrowserInfoTool, listThemesTool, listFlagsTool, listInternalPagesTool],
});
