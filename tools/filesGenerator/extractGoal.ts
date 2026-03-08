import { tool } from "ai";
import z from "zod";

export const ExtractGoalSchema = z.object({
  goal: z.string().describe("user's end goal"),
  plan: z.string().describe("plan to execute the user's goal"),
  files: z.array(
    z.object({
      filename: z.string().describe("filename"),
      purpose: z.string("file purpose, what is this file meant for"),
    }),
  ),
});

export const extractGoal = tool({
  description:
    "Analyze the user's goal and generate a plan with the files to create",
  inputSchema: ExtractGoalSchema,
  execute: async (input) => input, // no-op extract tool
});
