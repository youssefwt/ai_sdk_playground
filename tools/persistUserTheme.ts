import { tool } from "ai";
import { writeFile } from "fs/promises";
import { z } from "zod";

export const persistUserTheme = tool({
  description:
    "Call this to persist the final theme decision. Always persis the colors in hex format",
  inputSchema: z.object({
    primary: z.string(),
    secondary: z.string(),
  }),
  execute: async ({ primary, secondary }) => {
    const data = {
      primary,
      secondary,
    };
    // mock impl.
    await writeFile("./theme.json", JSON.stringify(data, null, 2), "utf-8");
  },
});
