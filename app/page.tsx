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
  ConversationDownload,
  ConversationEmptyState,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation";
import { Message, MessageContent } from "@/components/ai-elements/message";
import { useEffect, useState } from "react";
import { nanoid } from "nanoid";
import { MessageSquareIcon } from "lucide-react";

const messages: {
  key: string;
  content: string;
  role: "user" | "assistant";
}[] = [
  {
    content: "Hello, how are you?",
    key: nanoid(),
    role: "user",
  },
  {
    content: "I'm good, thank you! How can I assist you today?",
    key: nanoid(),
    role: "assistant",
  },
  {
    content: "I'm looking for information about your services.",
    key: nanoid(),
    role: "user",
  },
  {
    content:
      "Sure! We offer a variety of AI solutions. What are you interested in?",
    key: nanoid(),
    role: "assistant",
  },
  {
    content: "I'm interested in natural language processing tools.",
    key: nanoid(),
    role: "user",
  },
  {
    content: "Great choice! We have several NLP APIs. Would you like a demo?",
    key: nanoid(),
    role: "assistant",
  },
  {
    content: "Yes, a demo would be helpful.",
    key: nanoid(),
    role: "user",
  },
  {
    content: "Alright, I can show you a sentiment analysis example. Ready?",
    key: nanoid(),
    role: "assistant",
  },
  {
    content: "Yes, please proceed.",
    key: nanoid(),
    role: "user",
  },
  {
    content: "Here is a sample: 'I love this product!' → Positive sentiment.",
    key: nanoid(),
    role: "assistant",
  },
  {
    content: "Impressive! Can it handle multiple languages?",
    key: nanoid(),
    role: "user",
  },
  {
    content: "Absolutely, our models support over 20 languages.",
    key: nanoid(),
    role: "assistant",
  },
  {
    content: "How do I get started with the API?",
    key: nanoid(),
    role: "user",
  },
  {
    content: "You can sign up on our website and get an API key instantly.",
    key: nanoid(),
    role: "assistant",
  },
  {
    content: "Is there a free trial available?",
    key: nanoid(),
    role: "user",
  },
  {
    content: "Yes, we offer a 14-day free trial with full access.",
    key: nanoid(),
    role: "assistant",
  },
  {
    content: "What kind of support do you provide?",
    key: nanoid(),
    role: "user",
  },
  {
    content: "We provide 24/7 chat and email support for all users.",
    key: nanoid(),
    role: "assistant",
  },
  {
    content: "Thank you for the information!",
    key: nanoid(),
    role: "user",
  },
  {
    content: "You're welcome! Let me know if you have any more questions.",
    key: nanoid(),
    role: "assistant",
  },
];
export default function Page() {
  const [visibleMessages, setVisibleMessages] = useState<
    {
      key: string;
      content: string;
      role: "user" | "assistant";
    }[]
  >([]);
  useEffect(() => {
    let currentIndex = 0;
    const interval = setInterval(() => {
      if (currentIndex < messages.length && messages[currentIndex]) {
        const currentMessage = messages[currentIndex];
        setVisibleMessages((prev) => [
          ...prev,
          {
            content: currentMessage.content,
            key: currentMessage.key,
            role: currentMessage.role,
          },
        ]);
        currentIndex += 1;
      } else {
        clearInterval(interval);
      }
    }, 100);

    return () => clearInterval(interval);
  }, []);
  const handleSubmit = (message: PromptInputMessage) => {
    // Handle submit
    console.log(message);
  };
  return (
    <main className="flex h-screen flex-col">
      {/* message area */}
      <Conversation className="relative flex-1 no-scrollbar h-full">
        <ConversationContent className="max-w-5xl mx-auto pb-4">
          {visibleMessages.length === 0 ? (
            <ConversationEmptyState
              description="Messages will appear here as the conversation progresses."
              icon={<MessageSquareIcon className="size-6" />}
              title="Start a conversation"
            />
          ) : (
            visibleMessages.map(({ key, content, role }) => (
              <Message from={role} key={key}>
                <MessageContent>{content}</MessageContent>
              </Message>
            ))
          )}
        </ConversationContent>
        <ConversationDownload messages={visibleMessages} />
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
