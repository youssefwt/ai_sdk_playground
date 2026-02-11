import { tool } from "ai";
import { z } from "zod";

export const getThemeFromUser = tool({
  description:
    "Call this when the user expresses intent to build an app, UI, or product interface but did not specify a theme.",
  inputSchema: z.object({
    userIntent: z.string().describe("What the user wants to build"),
  }),
  outputSchema: z.union([
    z.literal("auto"),
    z.object({
      primary: z.string(),
      secondary: z.string(),
    }),
  ]),
});
