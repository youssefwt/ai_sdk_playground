import { UIMessage, createAgentUIStreamResponse } from "ai";
import { themeGenerator } from "@/agents/themeGenerator";

export async function POST(req: Request) {
  try {
    const { messages }: { messages: UIMessage[] } = await req.json();

    return createAgentUIStreamResponse({
      agent: themeGenerator,
      uiMessages: messages,
    });
  } catch (error) {
    console.error("Error streaming chat completion:", error);
    return new Response("Failed to stream chat completion", { status: 500 });
  }
}
