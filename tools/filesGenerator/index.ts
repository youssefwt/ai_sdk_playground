import { InferUITools, UIMessage, UIDataTypes } from "ai";
import { extractGoal } from "./extractGoal";
import { generateFileContent } from "./generateFileContent";

export type FileStatus = {
  filename: string;
  status: "pending" | "generating" | "completed" | "error";
  error?: string;
  content?: string;
  language?: string;
};

export type FilesChatTools = InferUITools<typeof tools>;
export type FileChatMessage = UIMessage<never, UIDataTypes, FilesChatTools>;

export const tools = {
  extractGoal,
  generateFileContent,
};
