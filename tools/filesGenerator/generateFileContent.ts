import { tool } from "ai";
import { streamText } from "ai";
import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import z from "zod";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

const openRouter = createOpenRouter({
  apiKey: process.env.OPEN_ROUTER_API_KEY,
});

// Detect language from file extension
const detectLanguage = (filename: string): string => {
  const ext = filename.split(".").pop()?.toLowerCase();
  const langMap: Record<string, string> = {
    ts: "typescript",
    tsx: "typescript",
    js: "javascript",
    jsx: "javascript",
    py: "python",
    java: "java",
    go: "go",
    rs: "rust",
    css: "css",
    html: "html",
    json: "json",
    md: "markdown",
  };
  return langMap[ext || ""] || "text";
};

export const generateFileContent = tool({
  description: "Generate the complete code content for a specific file",
  inputSchema: z.object({
    filename: z.string().describe("The name of the file to generate"),
    purpose: z.string().describe("The purpose and functionality of this file"),
    context: z.string().describe("Overall project context and requirements"),
  }),
  execute: async (input) => {
    // Actually generate the file content using AI
    const result = await streamText({
      model: openRouter("stepfun/step-3.5-flash:free"),
      system: `You are an expert code generator. Generate complete, production-ready code.

Include:
- All necessary imports and dependencies
- Type definitions (for TypeScript)
- Error handling where appropriate
- Brief comments for complex logic
- Best practices for the language/framework

CRITICAL: Return ONLY the raw code. Do NOT wrap it in markdown code blocks or backticks. Do NOT include \`\`\`typescript or \`\`\` tags. Just return the plain code that should go directly into the file.`,
      prompt: `Generate the complete code for this file:

Filename: ${input.filename}
Purpose: ${input.purpose}
Context: ${input.context}

Generate the complete, working code for this file.`,
    });

    // Collect the full text
    let content = "";
    for await (const textPart of result.textStream) {
      content += textPart;
    }

    // Strip markdown code fences if present
    content = content.trim();
    const codeBlockRegex = /^```[\w]*\n([\s\S]*?)\n```$/;
    const match = content.match(codeBlockRegex);
    if (match) {
      content = match[1];
    }

    // Save the file to disk
    const outputDir = path.join(process.cwd(), "generated");
    await mkdir(outputDir, { recursive: true });
    const filePath = path.join(outputDir, input.filename);
    await mkdir(path.dirname(filePath), { recursive: true });
    await writeFile(filePath, content, "utf-8");

    return {
      filename: input.filename,
      content: content,
      language: detectLanguage(input.filename),
    };
  },
});
