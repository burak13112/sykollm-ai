import React, { useRef, useEffect, useState } from 'react';
import { Message, GroundingChunk } from '../types';
import { Send, User, Bot, Loader2, MapPin, Globe, ExternalLink } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface ChatInterfaceProps {
  messages: Message[];
  isLoading: boolean;
  onSendMessage: (text: string) => void;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({ messages, isLoading, onSendMessage }) => {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      onSendMessage(input);
      setInput('');
    }
  };

  const renderGroundingSource = (chunk: GroundingChunk, index: number) => {
    if (chunk.web) {
        return (
            <a 
                key={index} 
                href={chunk.web.uri} 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200 px-2 py-1 rounded hover:opacity-80 transition-opacity"
            >
                <Globe className="w-3 h-3" />
                <span className="truncate max-w-[150px]">{chunk.web.title || 'Source'}</span>
                <ExternalLink className="w-3 h-3" />
            </a>
        );
    }
    if (chunk.maps) {
        return (
            <a 
                key={index}
                href={chunk.maps.uri}
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-200 px-2 py-1 rounded hover:opacity-80 transition-opacity"
            >
                <MapPin className="w-3 h-3" />
                <span className="truncate max-w-[150px]">{chunk.maps.title || 'Location'}</span>
                <ExternalLink className="w-3 h-3" />
            </a>
        );
    }
    return null;
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-slate-900">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`
              max-w-[85%] md:max-w-[80%] rounded-2xl px-4 py-3 shadow-sm
              ${msg.role === 'user' 
                ? 'bg-blue-600 text-white rounded-br-none' 
                : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-100 rounded-bl-none border border-slate-200 dark:border-slate-700'}
              ${msg.isError ? 'bg-red-50 dark:bg-red-900/20 border-red-200 text-red-600 dark:text-red-400' : ''}
            `}>
              <div className="flex items-center gap-2 mb-1 opacity-70 text-xs">
                {msg.role === 'user' ? <User className="w-3 h-3" /> : <Bot className="w-3 h-3" />}
                <span>{msg.role === 'user' ? 'You' : 'GeoGemini'}</span>
              </div>
              
              <div className="prose prose-sm dark:prose-invert max-w-none break-words">
                <ReactMarkdown>{msg.text}</ReactMarkdown>
              </div>

              {/* Grounding Sources */}
              {msg.groundingMetadata?.groundingChunks && msg.groundingMetadata.groundingChunks.length > 0 && (
                <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-700">
                    <p className="text-xs font-semibold text-slate-500 mb-2">Sources & Locations:</p>
                    <div className="flex flex-wrap gap-2">
                        {msg.groundingMetadata.groundingChunks.map((chunk, idx) => renderGroundingSource(chunk, idx))}
                    </div>
                </div>
              )}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-slate-100 dark:bg-slate-800 rounded-2xl rounded-bl-none px-4 py-3 border border-slate-200 dark:border-slate-700 flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin text-blue-500" />
              <span className="text-sm text-slate-500">Thinking...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
        <form onSubmit={handleSubmit} className="flex gap-2 relative">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about a place, topic, or anything..."
            className="flex-1 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white rounded-full px-5 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all border border-transparent dark:border-slate-700"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="bg-blue-600 text-white p-3 rounded-full hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md"
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  );
};