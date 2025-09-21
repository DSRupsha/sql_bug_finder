import React from 'react';
import { Database } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <header className="bg-slate-900/50 backdrop-blur-sm border-b border-slate-700 sticky top-0 z-10">
      <div className="px-4 md:px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Database className="h-8 w-8 text-indigo-400" />
          <h1 className="text-xl md:text-2xl font-bold text-slate-100">
            SQL Bug Finder AI
          </h1>
        </div>
        <a 
          href="https://github.com/google/genai-js" 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-sm text-slate-400 hover:text-indigo-400 transition-colors"
        >
          Powered by Gemini
        </a>
      </div>
    </header>
  );
};