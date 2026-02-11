import { InferUITools, UIMessage, UIDataTypes } from "ai";
import { getThemeFromUser } from "./getThemeFromUser";
import { persistUserTheme } from "./persistUserTheme";

export type ChatTools = InferUITools<typeof tools>;
export type ChatMessage = UIMessage<never, UIDataTypes, ChatTools>;

export const tools = {
  getThemeFromUser,
  persistUserTheme,
};
