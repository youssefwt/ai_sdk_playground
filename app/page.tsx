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

export default function Page() {
  const { messages, sendMessage } = useChat();

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
            messages.map(({ id, role, parts }) => (
              <Message from={role} key={id}>
                <MessageContent>
                  {parts.map((part, i) => {
                    if (part.type === "text") {
                      return <span key={i}>{part.text}</span>;
                    }
                    return null;
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
