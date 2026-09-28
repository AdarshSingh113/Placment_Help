import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, 
  X, 
  Target, 
  Mic2, 
  Calculator, 
  Newspaper, 
  AlertTriangle, 
  Sparkles, 
  ArrowRight,
  Database
} from 'lucide-react';
import { useData } from '../context/DataContext';

export const GlobalSearchModal: React.FC = () => {
  const { isSearchOpen, setIsSearchOpen, searchAll, setActiveView, setSelectedCompanyId } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const results = searchAll(searchTerm);

  // Keyboard shortcut listener (Cmd+K / Ctrl+K & ESC)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
      if (e.key === 'Escape' && isSearchOpen) {
        setIsSearchOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSearchOpen, setIsSearchOpen]);

  useEffect(() => {
    if (isSearchOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setSelectedIndex(0);
    } else {
      setSearchTerm('');
    }
  }, [isSearchOpen]);

  if (!isSearchOpen) return null;

  const handleSelectResult = (result: ReturnType<typeof searchAll>[0]) => {
    setActiveView(result.targetView);
    if (result.type === 'Company' && result.targetId) {
      setSelectedCompanyId(result.targetId);
    }
    setIsSearchOpen(false);
  };

  const getIconForType = (type: string) => {
    switch (type) {
      case 'Company': return Target;
      case 'Question': return Mic2;
      case 'Guesstimate': return Calculator;
      case 'GD Topic': return Newspaper;
      case 'News': return Newspaper;
      case 'Data Point': return Database;
      case 'Mistake': return AlertTriangle;
      default: return Sparkles;
    }
  };

  return (
    <div 
      id="global_search_modal_backdrop"
      className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) setIsSearchOpen(false);
      }}
    >
      <div className="w-full max-w-2xl bg-neutral-900 border border-neutral-700/90 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh] animate-in zoom-in-95 duration-150">
        {/* Search Header */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-neutral-800 bg-neutral-950/60">
          <Search className="w-5 h-5 text-blue-400 shrink-0" />
          <input
            ref={inputRef}
            id="input_global_search"
            type="text"
            placeholder="Search questions, companies, frameworks, GD debate topics, mistakes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-transparent text-white placeholder-neutral-500 text-sm md:text-base focus:outline-none"
          />
          <button
            onClick={() => setIsSearchOpen(false)}
            className="p-1 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results List */}
        <div className="flex-1 overflow-y-auto p-2 space-y-1 custom-scrollbar">
          {searchTerm.trim() === '' ? (
            <div className="p-8 text-center text-neutral-500 text-sm">
              <Sparkles className="w-8 h-8 mx-auto mb-2 text-neutral-600 opacity-60" />
              <p className="font-medium text-neutral-400">Search Placement OS</p>
              <p className="text-xs text-neutral-500 mt-1">
                Type anything to search across companies, questions, guesstimates, news, frameworks, and mistake logs.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-2 mt-4 text-xs">
                <span className="px-2 py-1 rounded bg-neutral-800 text-neutral-300">"McKinsey"</span>
                <span className="px-2 py-1 rounded bg-neutral-800 text-neutral-300">"Profitability"</span>
                <span className="px-2 py-1 rounded bg-neutral-800 text-neutral-300">"Coffee Mumbai"</span>
                <span className="px-2 py-1 rounded bg-neutral-800 text-neutral-300">"AI Disemployment"</span>
                <span className="px-2 py-1 rounded bg-neutral-800 text-neutral-300">"MECE"</span>
              </div>
            </div>
          ) : results.length === 0 ? (
            <div className="p-8 text-center text-neutral-500 text-sm">
              <p className="font-medium text-neutral-400">No matching records found</p>
              <p className="text-xs text-neutral-500 mt-1">Try a broader keyword or check spelling.</p>
            </div>
          ) : (
            results.map((item, index) => {
              const Icon = getIconForType(item.type);
              const isSelected = index === selectedIndex;
              return (
                <div
                  key={`${item.type}-${item.id}`}
                  onClick={() => handleSelectResult(item)}
                  onMouseEnter={() => setSelectedIndex(index)}
                  className={`w-full flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-blue-600/15 border border-blue-500/40 text-white'
                      : 'hover:bg-neutral-800/70 border border-transparent text-neutral-300'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="p-2 rounded-lg bg-neutral-800/80 text-blue-400 shrink-0">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold uppercase tracking-wider text-blue-400/90 font-mono">
                          {item.type}
                        </span>
                        {item.category && (
                          <span className="text-[11px] px-1.5 py-0.5 rounded bg-neutral-800 text-neutral-400">
                            {item.category}
                          </span>
                        )}
                      </div>
                      <div className="text-sm font-semibold text-white truncate mt-0.5">
                        {item.title}
                      </div>
                      <div className="text-xs text-neutral-400 truncate">
                        {item.subtitle}
                      </div>
                    </div>
                  </div>
                  <ArrowRight className={`w-4 h-4 shrink-0 transition-opacity ${isSelected ? 'opacity-100 text-blue-400' : 'opacity-0'}`} />
                </div>
              );
            })
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="flex items-center justify-between px-4 py-2 bg-neutral-950/80 border-t border-neutral-800 text-[11px] text-neutral-500">
          <span>Search across 8+ databases</span>
          <div className="flex items-center gap-3">
            <span>Use ↑ ↓ to navigate</span>
            <span>↵ to select</span>
            <span>ESC to close</span>
          </div>
        </div>
      </div>
    </div>
  );
};
