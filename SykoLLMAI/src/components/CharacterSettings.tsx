import React, { useState, useEffect } from 'react';
import { CharacterConfig } from '../types';
import { X, Save, User, MessageSquare, FileText } from 'lucide-react';

interface CharacterSettingsProps {
  config: CharacterConfig;
  onSave: (config: CharacterConfig) => void;
  onClose: () => void;
  isOpen?: boolean; // Made optional to be backward compatible or strict
}

export const CharacterSettings: React.FC<CharacterSettingsProps> = ({ config, onSave, onClose, isOpen = true }) => {
  const [formData, setFormData] = useState<CharacterConfig>(config);
  
  // Sync state when config changes externally
  useEffect(() => {
    setFormData(config);
  }, [config]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="absolute inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-white dark:bg-stone-950 w-full max-w-md rounded-3xl shadow-2xl border border-stone-200 dark:border-stone-800 overflow-hidden flex flex-col max-h-[90vh]">
        <div className="p-6 border-b border-stone-100 dark:border-stone-900 flex justify-between items-center bg-stone-50 dark:bg-black">
          <h2 className="text-xl font-bold flex items-center gap-3 text-stone-800 dark:text-stone-100">
            <div className="p-2 bg-wood-100 dark:bg-wood-900/30 text-wood-700 dark:text-wood-400 rounded-xl">
                 <User className="w-5 h-5" />
            </div>
            Persona Setup
          </h2>
          <button onClick={onClose} className="p-2 text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-900 rounded-full transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6 overflow-y-auto bg-white dark:bg-stone-950">
          <div>
            <label className="block text-sm font-bold text-stone-700 dark:text-stone-300 mb-2">
              Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl px-4 py-3 focus:ring-2 focus:ring-wood-500/50 outline-none transition-all text-stone-900 dark:text-white placeholder:text-stone-400"
              placeholder="e.g., Sherlock Holmes"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-stone-700 dark:text-stone-300 mb-2 flex items-center gap-2">
              <FileText className="w-4 h-4 text-wood-500" /> Definition / Bio
            </label>
            <p className="text-xs text-stone-500 dark:text-stone-500 mb-3">Define the personality, backstory, and speaking style.</p>
            <textarea
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              className="w-full h-32 bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl px-4 py-3 focus:ring-2 focus:ring-wood-500/50 outline-none transition-all resize-none text-stone-900 dark:text-white placeholder:text-stone-400"
              placeholder="You are a brilliant but arrogant detective living in London..."
              required
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-stone-700 dark:text-stone-300 mb-2 flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-wood-500" /> First Message
            </label>
            <textarea
              value={formData.greeting}
              onChange={(e) => setFormData({ ...formData, greeting: e.target.value })}
              className="w-full h-24 bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl px-4 py-3 focus:ring-2 focus:ring-wood-500/50 outline-none transition-all resize-none text-stone-900 dark:text-white placeholder:text-stone-400"
              placeholder="How the character starts the conversation..."
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-wood-600 to-wood-800 hover:from-wood-500 hover:to-wood-700 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all mt-4 shadow-lg shadow-wood-900/20"
          >
            <Save className="w-5 h-5" />
            Save & Restart Chat
          </button>
        </form>
      </div>
    </div>
  );
};