import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { ChatMessage, MessageRole } from '../types';
import { BotIcon, UserIcon, CopyIcon, CheckIcon } from './Icons';

interface MessageProps {
  message: ChatMessage;
}

const Message: React.FC<MessageProps> = ({ message }) => {
  const isModel = message.role === MessageRole.MODEL;
  const [hasCopied, setHasCopied] = useState(false);

  const handleCopy = () => {
    if (message.content) {
      navigator.clipboard.writeText(message.content);
      setHasCopied(true);
      setTimeout(() => setHasCopied(false), 2000);
    }
  };

  return (
    <div className={`group flex items-start gap-4 ${!isModel && 'flex-row-reverse'}`}>
      <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${isModel ? 'bg-brand-primary' : 'bg-brand-input'}`}>
        {isModel ? <BotIcon /> : <UserIcon />}
      </div>
      <div className={`relative w-fit max-w-[80%] rounded-lg p-4 ${isModel ? 'bg-brand-surface' : 'bg-brand-primary'}`}>
        {message.image && (
            <img 
              src={message.image} 
              alt="User upload" 
              className="rounded-md mb-2 max-w-full h-auto max-h-64" 
            />
        )}
        <div className="prose prose-invert prose-sm max-w-none prose-p:text-brand-text-primary prose-headings:text-brand-text-primary prose-strong:text-brand-text-primary prose-pre:bg-brand-bg prose-pre:text-brand-text-secondary">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {message.content}
          </ReactMarkdown>
        </div>
        {isModel && message.content && (
            <button
                onClick={handleCopy}
                className="absolute -top-2 -right-2 p-1.5 rounded-full bg-brand-input text-brand-text-secondary opacity-0 group-hover:opacity-100 transition-opacity hover:bg-brand-surface hover:text-brand-text-primary"
                aria-label="Copy message"
            >
                {hasCopied ? <CheckIcon /> : <CopyIcon />}
            </button>
        )}
      </div>
    </div>
  );
};

export default Message;
