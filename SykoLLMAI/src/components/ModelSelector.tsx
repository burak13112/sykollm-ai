import React from 'react';
import { AppMode } from '../types';
import { Map, Search, Sparkles } from 'lucide-react';

interface ModelSelectorProps {
  currentMode: AppMode;
  onModeChange: (mode: AppMode) => void;
}

export const ModelSelector: React.FC<ModelSelectorProps> = ({ currentMode, onModeChange }) => {
  return (
    <div className="flex p-1 bg-slate-200 dark:bg-slate-700 rounded-lg">
      <button
        onClick={() => onModeChange('MAPS')}
        className={`flex-1 flex items-center justify-center gap-2 py-2 text-sm font-medium rounded-md transition-all ${
          currentMode === 'MAPS'
            ? 'bg-white dark:bg-slate-600 text-blue-600 dark:text-blue-200 shadow-sm'
            : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
        }`}
      >
        <Map className="w-4 h-4" />
        <span className="hidden sm:inline">Maps</span>
      </button>
      
      <button
        onClick={() => onModeChange('SEARCH')}
        className={`flex-1 flex items-center justify-center gap-2 py-2 text-sm font-medium rounded-md transition-all ${
          currentMode === 'SEARCH'
            ? 'bg-white dark:bg-slate-600 text-purple-600 dark:text-purple-200 shadow-sm'
            : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
        }`}
      >
        <Search className="w-4 h-4" />
        <span className="hidden sm:inline">Search</span>
      </button>
      
      <button
        onClick={() => onModeChange('CHAT')}
        className={`flex-1 flex items-center justify-center gap-2 py-2 text-sm font-medium rounded-md transition-all ${
          currentMode === 'CHAT'
            ? 'bg-white dark:bg-slate-600 text-emerald-600 dark:text-emerald-200 shadow-sm'
            : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
        }`}
      >
        <Sparkles className="w-4 h-4" />
        <span className="hidden sm:inline">Pro Chat</span>
      </button>
    </div>
  );
};