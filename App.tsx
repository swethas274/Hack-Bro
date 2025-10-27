import React, { useRef } from 'react';
import ChatWindow, { ChatWindowRef } from './components/ChatWindow';
import { TrashIcon } from './components/Icons';

const App: React.FC = () => {
  const chatWindowRef = useRef<ChatWindowRef>(null);

  const handleClearChat = () => {
    chatWindowRef.current?.clearChat();
  };

  return (
    <div className="h-screen w-screen bg-brand-bg text-brand-text-primary flex flex-col font-sans antialiased">
      <header className="bg-brand-surface border-b border-brand-input p-4 shadow-md z-10">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold text-brand-primary">Cyber Sentinel AI</h1>
            <p className="text-sm text-brand-text-secondary">Your OWASP & CVE Research Assistant</p>
          </div>
          <button
            onClick={handleClearChat}
            className="p-2 rounded-md text-brand-text-secondary hover:bg-brand-input hover:text-brand-text-primary transition-colors"
            aria-label="Clear chat"
          >
            <TrashIcon />
          </button>
        </div>
      </header>
      <main className="flex-1 overflow-hidden">
        <ChatWindow ref={chatWindowRef} />
      </main>
    </div>
  );
};

export default App;