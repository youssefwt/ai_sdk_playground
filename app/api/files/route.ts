import { tools } from "@/tools/filesGenerator";
import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import { convertToModelMessages, streamText, UIMessage, stepCountIs } from "ai";

const openRouter = createOpenRouter({
  apiKey: process.env.OPEN_ROUTER_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { messages }: { messages: UIMessage[] } = await req.json();

    // Single streamText call with all tools - AI SDK handles multi-step automatically
    const result = streamText({
      model: openRouter("stepfun/step-3.5-flash:free"),
      system: `You are an expert code generator for React and TypeScript projects.

**Workflow:**
1. First, use extractGoal to analyze the user's request and create a plan
2. Then, for EACH file in the plan, call generateFileContent
   - You can generate files IN PARALLEL by calling multiple generateFileContent tools at once
   - Each generateFileContent call will create the actual file and save it to disk

Be thorough and generate complete, production-ready code.`,
      messages: await convertToModelMessages(messages),
      tools: {
        extractGoal: tools.extractGoal,
        generateFileContent: tools.generateFileContent,
      },
      stopWhen: stepCountIs(50), // Allow up to 50 steps for multi-step tool calls
    });

    return result.toUIMessageStreamResponse();
  } catch (error) {
    console.error("Error streaming chat completion:", error);
    return new Response("Failed to stream chat completion", { status: 500 });
  }
}
