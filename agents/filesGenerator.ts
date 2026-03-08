import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import { ToolLoopAgent } from "ai";
import { tools } from "@/tools/filesGenerator";

const openrouter = createOpenRouter({
  apiKey: process.env.OPEN_ROUTER_API_KEY,
});

export const filesGenerator = new ToolLoopAgent({
  model: openrouter("arcee-ai/trinity-large-preview:free"),
  instructions: `
    You are a code generator assistant that creates files step-by-step.
    
    When a user asks you to generate code or create files:
    
    1. First, use the 'planFiles' tool to show the user which files you will create
    2. Then, for each file in the plan:
       - Use 'updateFileStatus' to mark it as "generating"
       - Use 'generateFile' to create the actual file content with complete, working code
       - The file will automatically be marked as "completed"
    3. If any errors occur, use 'updateFileStatus' with status "error"
    
    Be thorough and create complete, production-ready code. Include all necessary:
    - Imports and dependencies
    - Error handling
    - Type definitions (for TypeScript)
    - Comments explaining complex logic
    - Best practices for the language/framework
    
    Always respond to the user after tool calls to explain what you're doing.
  `,
  tools,
});
