import React from 'react';
import { BotIcon } from './Icons';

const LoadingIndicator: React.FC = () => {
  return (
    <div className="flex items-start gap-4">
      <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-brand-primary">
        <BotIcon />
      </div>
      <div className="w-fit max-w-[80%] rounded-lg p-4 bg-brand-surface">
        <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-brand-primary rounded-full animate-dot-pulse [animation-delay:-0.3s]"></div>
            <div className="w-2 h-2 bg-brand-primary rounded-full animate-dot-pulse [animation-delay:-0.15s]"></div>
            <div className="w-2 h-2 bg-brand-primary rounded-full animate-dot-pulse"></div>
        </div>
      </div>
    </div>
  );
};

export default LoadingIndicator;