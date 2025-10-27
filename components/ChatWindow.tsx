
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { ChatMessage, MessageRole } from '../types';
import { sendMessageToGemini } from '../services/geminiService';
import Message from './Message';
import ChatInput from './ChatInput';
import LoadingIndicator from './LoadingIndicator';

const ChatWindow: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: MessageRole.MODEL,
      content: "Hello! I'm Cyber Sentinel AI. I'm here to help you with OWASP Top 10 and CVE research. Ask me something like:\n\n*   `Explain SQL Injection for a beginner`\n*   `Give me a practice example of XSS`\n*   `I found a weird server response, what could it be?`"
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = useCallback(async (userInput: string) => {
    if (!userInput.trim() || isLoading) return;

    setError(null);
    setIsLoading(true);
    const newUserMessage: ChatMessage = { role: MessageRole.USER, content: userInput };
    setMessages(prev => [...prev, newUserMessage]);

    try {
      const stream = await sendMessageToGemini(userInput);
      
      setMessages(prev => [...prev, { role: MessageRole.MODEL, content: "" }]);

      for await (const chunk of stream) {
        const chunkText = chunk.text;
        setMessages(prev => {
          const lastMessage = prev[prev.length - 1];
          if (lastMessage.role === MessageRole.MODEL) {
            const updatedLastMessage = { ...lastMessage, content: lastMessage.content + chunkText };
            return [...prev.slice(0, -1), updatedLastMessage];
          }
          return prev;
        });
      }

    } catch (e: unknown) {
      const errorMessage = e instanceof Error ? e.message : "An unknown error occurred.";
      setError(errorMessage);
      setMessages(prev => [...prev, { role: MessageRole.MODEL, content: `Sorry, something went wrong: ${errorMessage}` }]);
    } finally {
      setIsLoading(false);
    }
  }, [isLoading]);

  return (
    <div className="h-full flex flex-col max-w-4xl mx-auto w-full">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, index) => (
          <Message key={index} message={msg} />
        ))}
        {isLoading && <LoadingIndicator />}
        <div ref={messagesEndRef} />
      </div>
      {error && (
          <div className="px-4 pb-2 text-red-400 text-sm">
              <p><strong>Error:</strong> {error}</p>
          </div>
      )}
      <div className="p-4 bg-brand-bg">
        <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
      </div>
    </div>
  );
};

export default ChatWindow;
