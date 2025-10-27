
import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { ChatMessage, MessageRole } from '../types';
import { BotIcon, UserIcon } from './Icons';

interface MessageProps {
  message: ChatMessage;
}

const Message: React.FC<MessageProps> = ({ message }) => {
  const isModel = message.role === MessageRole.MODEL;

  return (
    <div className={`flex items-start gap-4 ${!isModel && 'flex-row-reverse'}`}>
      <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${isModel ? 'bg-brand-primary' : 'bg-brand-input'}`}>
        {isModel ? <BotIcon /> : <UserIcon />}
      </div>
      <div className={`w-fit max-w-[80%] rounded-lg p-4 ${isModel ? 'bg-brand-surface' : 'bg-brand-primary'}`}>
        <div className="prose prose-invert prose-sm max-w-none prose-p:text-brand-text-primary prose-headings:text-brand-text-primary prose-strong:text-brand-text-primary prose-pre:bg-brand-bg prose-pre:text-brand-text-secondary">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {message.content}
          </ReactMarkdown>
        </div>
      </div>
    </div>
  );
};

export default Message;
