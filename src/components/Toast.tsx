import React from 'react';
import { Sparkles } from 'lucide-react';
import { useData } from '../context/DataContext';

export const Toast: React.FC = () => {
  const { toastMessage } = useData();

  if (!toastMessage) return null;

  return (
    <div 
      id="global_toast"
      className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-neutral-900/95 border border-blue-500/40 text-neutral-100 shadow-2xl shadow-black/50 text-sm font-medium backdrop-blur-md animate-in slide-in-from-bottom-5 duration-200"
    >
      <div className="p-1 rounded-lg bg-blue-600/20 text-blue-400 shrink-0">
        <Sparkles className="w-4 h-4" />
      </div>
      <span>{toastMessage}</span>
    </div>
  );
};
