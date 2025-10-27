
import React from 'react';
import ChatWindow from './components/ChatWindow';

const App: React.FC = () => {
  return (
    <div className="h-screen w-screen bg-brand-bg text-brand-text-primary flex flex-col font-sans antialiased">
      <header className="bg-brand-surface border-b border-brand-input p-4 shadow-md z-10">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-xl font-bold text-brand-primary">Cyber Sentinel AI</h1>
          <p className="text-sm text-brand-text-secondary">Your OWASP & CVE Research Assistant</p>
        </div>
      </header>
      <main className="flex-1 overflow-hidden">
        <ChatWindow />
      </main>
    </div>
  );
};

export default App;
