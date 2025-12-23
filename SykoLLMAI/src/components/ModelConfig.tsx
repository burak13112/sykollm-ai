import React, { useState, useEffect } from 'react';
import { AIModel, AVAILABLE_MODELS } from '../types';
import { X, Save, Key, Cpu, Check } from 'lucide-react';

interface ModelConfigProps {
  currentModel: AIModel;
  onSave: (apiKey: string, model: AIModel) => void;
  onClose: () => void;
  isOpen: boolean;
}

export const ModelConfig: React.FC<ModelConfigProps> = ({ currentModel, onSave, onClose, isOpen }) => {
  const [apiKey, setApiKey] = useState('');
  const [selectedModel, setSelectedModel] = useState<AIModel>(currentModel);

  useEffect(() => {
    const storedKey = localStorage.getItem('openRouterApiKey');
    if (storedKey) setApiKey(storedKey);
  }, []);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('openRouterApiKey', apiKey);
    onSave(apiKey, selectedModel);
  };

  return (
    <div className="absolute inset-0 z-[60] bg-black/70 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-white dark:bg-stone-950 w-full max-w-lg rounded-3xl shadow-2xl border border-stone-200 dark:border-stone-800 overflow-hidden flex flex-col max-h-[90vh]">
        <div className="p-6 border-b border-stone-100 dark:border-stone-900 flex justify-between items-center bg-stone-50 dark:bg-black">
          <h2 className="text-xl font-bold flex items-center gap-3 text-stone-800 dark:text-stone-100">
            <div className="p-2 bg-wood-100 dark:bg-wood-900/30 text-wood-700 dark:text-wood-400 rounded-xl">
                 <Cpu className="w-5 h-5" />
            </div>
            Model Configuration
          </h2>
          <button onClick={onClose} className="p-2 text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-900 rounded-full transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6 overflow-y-auto bg-white dark:bg-stone-950">
          
          {/* API Key Section */}
          <div className="space-y-2">
            <label className="block text-sm font-bold text-stone-700 dark:text-stone-300 flex items-center gap-2">
              <Key className="w-4 h-4 text-wood-500" /> OpenRouter API Key
            </label>
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="w-full bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl px-4 py-3 focus:ring-2 focus:ring-wood-500/50 outline-none transition-all text-stone-900 dark:text-white placeholder:text-stone-400 font-mono text-sm"
              placeholder="sk-or-..."
            />
            <p className="text-xs text-stone-500 dark:text-stone-600">
              Keys are stored locally in your browser. Get one at <a href="https://openrouter.ai/keys" target="_blank" className="text-wood-600 dark:text-wood-400 hover:underline">openrouter.ai</a>.
            </p>
          </div>

          {/* Model Selection */}
          <div className="space-y-3">
             <label className="block text-sm font-bold text-stone-700 dark:text-stone-300">
              Select Model
            </label>
            <div className="grid grid-cols-1 gap-2 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                {AVAILABLE_MODELS.map((model) => (
                    <div 
                        key={model.id}
                        onClick={() => setSelectedModel(model)}
                        className={`
                            relative p-4 rounded-xl border cursor-pointer transition-all flex items-start gap-3
                            ${selectedModel.id === model.id 
                                ? 'bg-wood-50 dark:bg-wood-900/20 border-wood-500 dark:border-wood-600' 
                                : 'bg-stone-50 dark:bg-stone-900 border-stone-200 dark:border-stone-800 hover:border-wood-300 dark:hover:border-wood-800'}
                        `}
                    >
                        <div className={`mt-0.5 w-4 h-4 rounded-full border flex items-center justify-center shrink-0
                             ${selectedModel.id === model.id 
                                ? 'border-wood-600 bg-wood-600 text-white' 
                                : 'border-stone-300 dark:border-stone-600'}
                        `}>
                            {selectedModel.id === model.id && <Check className="w-2.5 h-2.5" />}
                        </div>
                        <div>
                            <div className="font-bold text-sm text-stone-800 dark:text-stone-200">{model.name}</div>
                            <div className="text-xs text-stone-500 dark:text-stone-500 mt-0.5">{model.description}</div>
                        </div>
                    </div>
                ))}
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-wood-600 to-wood-800 hover:from-wood-500 hover:to-wood-700 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all mt-2 shadow-lg shadow-wood-900/20"
          >
            <Save className="w-5 h-5" />
            Save Configuration
          </button>
        </form>
      </div>
    </div>
  );
};