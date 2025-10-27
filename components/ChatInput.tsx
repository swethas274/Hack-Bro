import React, { useState, useRef, useEffect } from 'react';
import { SendIcon, ImageIcon, CloseIcon } from './Icons';

interface ChatInputProps {
  onSendMessage: (message: string, image?: { data: string; mimeType: string }) => void;
  isLoading: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, isLoading }) => {
  const [input, setInput] = useState('');
  const [image, setImage] = useState<{ data: string; mimeType: string } | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [input]);
  
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage({
            data: reader.result as string,
            mimeType: file.type,
        });
      };
      reader.readAsDataURL(file);
    }
  };
  
  const removeImage = () => {
    setImage(null);
    if(fileInputRef.current) {
        fileInputRef.current.value = "";
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if ((input.trim() || image) && !isLoading) {
      onSendMessage(input, image);
      setInput('');
      removeImage();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-2 bg-brand-surface rounded-xl border border-brand-input focus-within:border-brand-primary transition-colors">
        {image && (
            <div className="relative group w-32 p-2">
                <img src={image.data} alt="preview" className="rounded-md"/>
                <button onClick={removeImage} className="absolute top-0 right-0 m-1 p-1 bg-black/50 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity">
                    <CloseIcon />
                </button>
            </div>
        )}
        <div className="flex items-end gap-2">
            <input 
                type="file"
                ref={fileInputRef}
                onChange={handleImageChange}
                accept="image/*"
                className="hidden"
            />
            <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isLoading}
                className="w-10 h-10 flex-shrink-0 flex items-center justify-center text-brand-text-secondary rounded-lg disabled:text-brand-input hover:bg-brand-input hover:text-brand-text-primary transition-colors"
                aria-label="Add image"
            >
                <ImageIcon />
            </button>
            <textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask about a vulnerability..."
                rows={1}
                className="flex-1 bg-transparent text-brand-text-primary placeholder-brand-text-secondary resize-none focus:outline-none max-h-48"
                disabled={isLoading}
            />
            <button
                type="submit"
                disabled={isLoading || (!input.trim() && !image)}
                className="w-10 h-10 flex-shrink-0 flex items-center justify-center bg-brand-primary text-white rounded-lg disabled:bg-brand-input disabled:text-brand-text-secondary hover:bg-brand-primary-hover transition-colors"
                aria-label="Send message"
            >
                <SendIcon />
            </button>
        </div>
    </form>
  );
};

export default ChatInput;