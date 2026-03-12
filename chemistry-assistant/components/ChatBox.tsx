"use client";

import { useState, useEffect, useRef } from "react";
import Message from "./Message";
import InputBox from "./InputBox";

interface MessageType {
  role: "user" | "assistant";
  content: string;
}

export default function ChatBox() {
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [loading, setLoading] = useState(false);
  const [isAtBottom, setIsAtBottom] = useState(true);

  const scrollRef = useRef<HTMLDivElement | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const handleScroll = () => {
    const container = scrollRef.current;
    if (!container) return;

    const threshold = 50;
    const isBottom =
      container.scrollHeight - container.scrollTop - container.clientHeight <
      threshold;

    setIsAtBottom(isBottom);
  };

  useEffect(() => {
    if (isAtBottom) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isAtBottom]);

  const sendMessage = async (text: string) => {
    const newMessages: MessageType[] = [
      ...messages,
      { role: "user", content: text },
    ];

    setMessages(newMessages);
    setLoading(true);

    const response = await fetch("/api/chat", {
      method: "POST",
      body: JSON.stringify({ messages: newMessages }),
    });

    const reader = response.body?.getReader();
    const decoder = new TextDecoder();

    let assistantMessage = "";

    while (true) {
      const { done, value } = await reader!.read();
      if (done) break;

      const chunk = decoder.decode(value);
      assistantMessage += chunk;

      setMessages([
        ...newMessages,
        { role: "assistant", content: assistantMessage },
      ]);
    }

    setLoading(false);
  };

  return (
    <div className="flex flex-col h-screen text-gray-900 dark:text-gray-100 transition-colors duration-300">
      {/* Messages Area */}
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto bg-gray-100 dark:bg-gray-900 transition-colors duration-300"
      >
        <div className="max-w-3xl mx-auto px-4 py-6 space-y-6">
          {messages.map((msg, index) => (
            <Message key={index} role={msg.role} content={msg.content} />
          ))}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="border-t bg-white dark:bg-gray-800 dark:border-gray-700 transition-colors duration-300">
        <div className="max-w-3xl mx-auto">
          <InputBox onSend={sendMessage} disabled={loading} />
        </div>
      </div>
    </div>
  );
}