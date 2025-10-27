import React, { useState, useRef, useEffect, useCallback, useImperativeHandle, forwardRef } from 'react';
import { ChatMessage, MessageRole } from '../types';
import { sendMessageToGemini } from '../services/geminiService';
import Message from './Message';
import ChatInput from './ChatInput';
import LoadingIndicator from './LoadingIndicator';
import ConfigPanel from './ConfigPanel';
import { Part } from '@google/genai';


export interface ChatWindowRef {
  clearChat: () => void;
}

const INITIAL_MESSAGE: ChatMessage = {
  role: MessageRole.MODEL,
  content: "Hello! I'm you best security research buddy Hack Bro. 🛡️ I'm here to help you with OWASP Top 10 and CVE research. Customize my response using the options below and ask me something like:\n\n*   `Explain SQL Injection for a beginner`\n*   `Give me a practice example of XSS`\n*   `I found a weird server response (and upload a screenshot!), what could it be?`"
};

const ChatWindow = forwardRef<ChatWindowRef>((props, ref) => {
  const [messages, setMessages] = useState<ChatMessage[]>([INITIAL_MESSAGE]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tone, setTone] = useState('Beginner Friendly');
  const [wordLimit, setWordLimit] = useState('Medium');

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useImperativeHandle(ref, () => ({
    clearChat() {
      setMessages([INITIAL_MESSAGE]);
    }
  }));

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = useCallback(async (userInput: string, image?: { data: string, mimeType: string }) => {
    if (!userInput.trim() || isLoading) return;

    setError(null);
    setIsLoading(true);

    const newUserMessage: ChatMessage = { 
      role: MessageRole.USER, 
      content: userInput,
      image: image?.data
    };
    setMessages(prev => [...prev, newUserMessage]);
    
    let imagePart: Part | undefined = undefined;
    if (image) {
      imagePart = {
        inlineData: {
          data: image.data.split(',')[1], // remove base64 prefix
          mimeType: image.mimeType,
        }
      }
    }

    try {
      const stream = await sendMessageToGemini({ message: userInput, imagePart, tone, wordLimit });
      
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
  }, [isLoading, tone, wordLimit]);

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
        <ConfigPanel 
          tone={tone} 
          onToneChange={setTone}
          wordLimit={wordLimit}
          onWordLimitChange={setWordLimit}
        />
        <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
      </div>
    </div>
  );
});

export default ChatWindow;