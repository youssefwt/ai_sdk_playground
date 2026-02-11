"use client";

import {
  PromptInput,
  PromptInputBody,
  PromptInputFooter,
  PromptInputMessage,
  PromptInputSubmit,
  PromptInputTextarea,
} from "@/components/ai-elements/prompt-input";
import {
  Conversation,
  ConversationContent,
  ConversationEmptyState,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation";
import { Message, MessageContent } from "@/components/ai-elements/message";
import { useChat } from "@ai-sdk/react";

import { MessageSquareIcon } from "lucide-react";
import { ChatMessage } from "@/tools";

export default function Page() {
  const { messages, sendMessage, addToolOutput } = useChat<ChatMessage>();

  const handleSubmit = (message: PromptInputMessage) => {
    // Handle submit
    sendMessage({ text: message.text });
  };

  const handleThemeSelection = (
    toolCallId: string,
    theme: { primary: string; secondary: string },
  ) => {
    // Send the user's theme choice back to the agent
    addToolOutput({
      tool: "getThemeFromUser",
      toolCallId,
      output: theme,
    });
    sendMessage();
  };

  return (
    <main className="flex h-screen flex-col">
      {/* message area */}
      <Conversation className="relative flex-1 no-scrollbar h-full">
        <ConversationContent className="max-w-5xl mx-auto pb-4">
          {messages.length === 0 ? (
            <ConversationEmptyState
              description="Messages will appear here as the conversation progresses."
              icon={<MessageSquareIcon className="size-6" />}
              title="Start a conversation"
            />
          ) : (
            messages.map(({ id, role, parts }) => (
              <Message from={role} key={id}>
                <MessageContent>
                  {parts.map((part, i) => {
                    switch (part.type) {
                      case "text":
                        console.log("text", part.text);
                        return <span key={i}>{part.text}</span>;
                      case "tool-getThemeFromUser":
                        const toolCallId = part.toolCallId;
                        console.log("part.state", part.state);
                        if (part.state === "input-available") {
                          return (
                            <div
                              key={toolCallId}
                              className="flex gap-2 p-4 border rounded"
                            >
                              <button
                                onClick={() =>
                                  handleThemeSelection(toolCallId, {
                                    primary: "#3b82f6",
                                    secondary: "#8b5cf6",
                                  })
                                }
                                className="px-4 py-2 bg-blue-500 text-white rounded cursor-pointer"
                              >
                                Use Blue Theme
                              </button>
                              <button
                                onClick={() =>
                                  handleThemeSelection(toolCallId, {
                                    primary: "#ef4444",
                                    secondary: "#f59e0b",
                                  })
                                }
                                className="px-4 py-2 bg-red-500 text-white rounded cursor-pointer"
                              >
                                Use Red Theme
                              </button>
                              <button
                                onClick={() => {
                                  addToolOutput({
                                    tool: "getThemeFromUser",
                                    toolCallId,
                                    output: "auto",
                                  });
                                  sendMessage();
                                }}
                                className="px-4 py-2 border rounded cursor-pointer"
                              >
                                Auto
                              </button>
                            </div>
                          );
                        }
                        // Show confirmation after input is received
                        if (part.state === "output-available") {
                          return (
                            <div
                              key={toolCallId}
                              className="p-2 rounded border"
                            >
                              Input received: {JSON.stringify(part.output)}
                            </div>
                          );
                        }
                      default:
                        return null;
                    }
                    // if (part.type === "text") {
                    //   return <span key={i}>{part.text}</span>;
                    // }
                    // return null;
                  })}
                </MessageContent>
              </Message>
            ))
          )}
        </ConversationContent>
        <ConversationScrollButton />
      </Conversation>

      {/* prompt input */}
      <PromptInput
        onSubmit={handleSubmit}
        className="border-t max-w-5xl mx-auto"
      >
        <PromptInputBody>
          <PromptInputTextarea placeholder="What's on your mind . . ." />
        </PromptInputBody>
        <PromptInputFooter className="justify-end">
          <PromptInputSubmit />
        </PromptInputFooter>
      </PromptInput>
    </main>
  );
}
