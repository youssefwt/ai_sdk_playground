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
import { DefaultChatTransport } from "ai";
import { FileChatMessage, FileStatus } from "@/tools/filesGenerator";
import { FileGenerationStatus } from "@/components/file-generation/FileGenerationStatus";
import { GeneratedFilePreview } from "@/components/file-generation/GeneratedFilePreview";

export default function Page() {
  const { messages, sendMessage } = useChat<FileChatMessage>({
    transport: new DefaultChatTransport({
      api: "/api/files",
    }),
  });

  const handleSubmit = (message: PromptInputMessage) => {
    // Handle submit
    sendMessage({ text: message.text });
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
            messages.map(({ id, role, parts }) => {
              // Derive file statuses from generateFileContent tool states
              const fileStatusMap = new Map<string, FileStatus>();

              parts.forEach((part) => {
                // Derive status from generateFileContent tool states
                if (part.type === "tool-generateFileContent") {
                  const filename = part.input?.filename || "unknown";

                  switch (part.state) {
                    case "input-streaming":
                    case "input-available":
                      fileStatusMap.set(filename, {
                        filename,
                        status: "generating",
                      });
                      break;
                    case "output-available":
                      fileStatusMap.set(filename, {
                        filename,
                        status: "completed",
                        content: part.output.content,
                        language: part.output.language,
                      });
                      break;
                    case "output-error":
                      fileStatusMap.set(filename, {
                        filename,
                        status: "error",
                        error: part.errorText,
                      });
                      break;
                  }
                }
              });

              return (
                <Message from={role} key={id}>
                  <MessageContent>
                    {/* Show status component first if we have statuses */}
                    {fileStatusMap.size > 0 && (
                      <div className="mb-4">
                        <FileGenerationStatus
                          files={Array.from(fileStatusMap.values())}
                        />
                      </div>
                    )}

                    {/* Then show other parts */}
                    {parts.map((part, i) => {
                      switch (part.type) {
                        case "text":
                          return part.text ? (
                            <div key={i} className="whitespace-pre-wrap">
                              {part.text}
                            </div>
                          ) : null;
                        case "tool-extractGoal": {
                          switch (part.state) {
                            case "input-streaming":
                            case "input-available":
                              return (
                                <div key={i} className="text-muted-foreground">
                                  Analyzing your request...
                                </div>
                              );
                            case "output-available":
                              return (
                                <div
                                  key={i}
                                  className="flex flex-col gap-3 mb-4"
                                >
                                  <div className="space-y-1">
                                    <p className="text-2xl font-semibold">
                                      Plan
                                    </p>
                                    <p className="whitespace-pre-wrap">
                                      {part.output.plan}
                                    </p>
                                  </div>
                                  <div className="space-y-1">
                                    <p className="text-2xl font-semibold">
                                      Files to be created
                                    </p>
                                    <ul className="list-disc list-inside space-y-1">
                                      {part.output.files.map(
                                        (file: {
                                          filename: string;
                                          purpose: string;
                                        }) => (
                                          <li key={file.filename}>
                                            <span className="font-mono text-sm">
                                              {file.filename}
                                            </span>{" "}
                                            - {file.purpose}
                                          </li>
                                        ),
                                      )}
                                    </ul>
                                  </div>
                                </div>
                              );
                            default:
                              return null;
                          }
                        }
                        case "tool-generateFileContent": {
                          switch (part.state) {
                            case "input-streaming":
                            case "input-available":
                              return (
                                <div
                                  key={i}
                                  className="text-sm text-muted-foreground"
                                >
                                  Generating {part.input?.filename || "file"}...
                                </div>
                              );
                            case "output-available":
                              return (
                                <div key={i} className="mb-4">
                                  <GeneratedFilePreview
                                    filename={part.output.filename}
                                    content={part.output.content}
                                    language={part.output.language}
                                  />
                                </div>
                              );
                            case "output-error":
                              return (
                                <div
                                  key={i}
                                  className="text-red-500 p-3 bg-red-50 rounded"
                                >
                                  Error generating file: {part.errorText}
                                </div>
                              );
                          }
                          return null;
                        }
                        default:
                          return null;
                      }
                    })}
                  </MessageContent>
                </Message>
              );
            })
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
