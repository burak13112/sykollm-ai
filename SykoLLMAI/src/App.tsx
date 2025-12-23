import React, { useState, useEffect, useRef } from 'react';
import { MapComponent } from './components/MapComponent';
import { ChatInterface } from './components/ChatInterface';
import { ModelSelector } from './components/ModelSelector';
import { useGeolocation } from './hooks/useGeolocation';
import { sendToGemini } from './services/geminiService';
import { Message, AppMode, MapLocation } from './types';
import { Loader2, Map as MapIcon, MessageSquare, Menu } from 'lucide-react';

export default function App() {
  const { coords, error: geoError, loading: geoLoading } = useGeolocation();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'model',
      text: "Hello! I'm your GeoGemini assistant. I can help you find places nearby, search the web, or just chat. Where would you like to start?",
      timestamp: Date.now(),
    }
  ]);
  const [mode, setMode] = useState<AppMode>('MAPS');
  const [isLoading, setIsLoading] = useState(false);
  const [mapLocations, setMapLocations] = useState<MapLocation[]>([]);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Auto-scroll logic could go here, but handled in ChatInterface

  const handleSendMessage = async (text: string) => {
    if (!text.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      text: text,
      timestamp: Date.now(),
    };

    setMessages(prev => [...prev, userMsg]);
    setIsLoading(true);

    try {
      const response = await sendToGemini(text, messages, mode, coords);
      
      const botMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: response.text,
        timestamp: Date.now(),
        groundingMetadata: response.groundingMetadata,
      };

      setMessages(prev => [...prev, botMsg]);

      // If locations were parsed from the response or grounding, update the map
      if (response.locations && response.locations.length > 0) {
        setMapLocations(response.locations);
      } else if (response.groundingMetadata?.groundingChunks) {
        // We might want to clear old map markers if the topic changed drastically, 
        // but for now, we only update if we got new specific locations.
        // Or we could parse groundingChunks here if we had logic to extract lat/lng from generic chunks (usually not present without explicit request).
      }
      
    } catch (error) {
      console.error("Error sending message:", error);
      const errorMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: "I'm sorry, I encountered an error while processing your request. Please check your connection or API key.",
        timestamp: Date.now(),
        isError: true,
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([{
      id: Date.now().toString(),
      role: 'model',
      text: "Chat cleared. What's next?",
      timestamp: Date.now(),
    }]);
    setMapLocations([]);
  };

  return (
    <div className="flex flex-col h-full w-full bg-slate-100 dark:bg-slate-900 relative">
      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between p-4 bg-white dark:bg-slate-800 shadow-sm z-20">
        <h1 className="text-lg font-bold flex items-center gap-2">
          <MapIcon className="w-5 h-5 text-blue-500" />
          GeoGemini
        </h1>
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2">
          <Menu className="w-6 h-6" />
        </button>
      </div>

      {/* Main Content Grid */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden relative">
        
        {/* Left Panel: Chat & Controls */}
        <div className={`
          absolute inset-0 z-10 bg-white dark:bg-slate-900 md:relative md:w-[450px] md:flex flex-col border-r border-slate-200 dark:border-slate-700 shadow-xl transition-transform duration-300
          ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        `}>
          <div className="p-4 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800">
             <div className="mb-4 hidden md:flex items-center gap-2">
                <MapIcon className="w-6 h-6 text-blue-500" />
                <h1 className="text-xl font-bold">GeoGemini</h1>
             </div>
             
             <ModelSelector currentMode={mode} onModeChange={setMode} />
             
             {geoLoading && <div className="text-xs text-slate-500 mt-2 flex items-center gap-1"><Loader2 className="w-3 h-3 animate-spin"/> Locating you...</div>}
             {geoError && <div className="text-xs text-red-500 mt-2">Location access denied. Maps mode may be limited.</div>}
          </div>

          <div className="flex-1 overflow-hidden relative">
            <ChatInterface 
              messages={messages} 
              isLoading={isLoading} 
              onSendMessage={handleSendMessage}
            />
          </div>

          <div className="p-2 text-center text-xs text-slate-400 border-t border-slate-200 dark:border-slate-800">
             Powered by Google Gemini
             <button onClick={clearChat} className="ml-2 text-blue-500 hover:underline">Clear Chat</button>
          </div>
        </div>

        {/* Right Panel: Map */}
        <div className="flex-1 relative w-full h-full bg-slate-200 dark:bg-slate-800">
          <MapComponent 
            locations={mapLocations} 
            userLocation={coords}
            selectedMode={mode}
          />
          {/* Toggle button for mobile to show chat again if map is active */}
          {!isMobileMenuOpen && (
             <button 
               onClick={() => setIsMobileMenuOpen(true)}
               className="md:hidden absolute bottom-6 right-6 z-[1000] bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition-all"
             >
               <MessageSquare className="w-6 h-6" />
             </button>
          )}
        </div>

      </div>
    </div>
  );
}