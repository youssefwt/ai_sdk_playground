import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import { ToolLoopAgent } from "ai";
import { tools } from "@/tools";

const openrouter = createOpenRouter({
  apiKey: process.env.OPEN_ROUTER_API_KEY,
});

export const mainAgent = new ToolLoopAgent({
  model: openrouter("arcee-ai/trinity-large-preview:free"),
  instructions: `
    You are a helpful coding assistant.

    When a conversation involves UI, app, or product design:
    - You may ask the user to choose a theme if the user did not specify a theme.
    - If a theme decision is made (explicitly or implicitly), treat it as a final decision.
    - Final theme decisions should be persisted in hex format using the available tools before responding.

    Always respond to the user after any tool output. and always explain what are you doing
`,
  tools,
});
