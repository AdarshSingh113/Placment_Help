import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Flame, Cloud, Calendar, Target, CheckCircle2, ChevronRight, Sparkles } from 'lucide-react';
import { useData } from '../context/DataContext';

export const DynamicIslandHud: React.FC = () => {
  const { streakDays, companies, syncStatus, setActiveView, questions } = useData();
  const [isExpanded, setIsExpanded] = useState(false);

  // Next scheduled interview
  const upcoming = companies.find(c => c.interviewDate && c.status === 'Interview Scheduled');
  const answeredCount = questions.filter(q => (q.practiceCount || 0) > 0).length;

  return (
    <div className="relative inline-flex items-center justify-center">
      <motion.div
        layout
        onMouseEnter={() => setIsExpanded(true)}
        onMouseLeave={() => setIsExpanded(false)}
        onClick={() => setIsExpanded(!isExpanded)}
        transition={{ type: 'spring', stiffness: 450, damping: 32 }}
        className={`relative z-30 cursor-pointer overflow-hidden rounded-full bg-black border border-white/15 text-white shadow-[0_4px_24px_rgba(0,0,0,0.6)] flex items-center transition-shadow hover:border-white/30 ${
          isExpanded ? 'px-4 py-2 rounded-2xl' : 'px-3 py-1'
        }`}
      >
        {/* Subtle ambient gradient aura inside */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-transparent to-amber-500/10 pointer-events-none" />

        <AnimatePresence mode="wait">
          {!isExpanded ? (
            <motion.div
              key="collapsed"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.15 }}
              className="flex items-center gap-2 text-[11px] font-medium tracking-tight"
            >
              {/* Flame Icon with subtle glow */}
              <span className="flex items-center gap-1 text-amber-400">
                <Flame className="w-3.5 h-3.5 fill-current animate-pulse" />
                <span className="font-mono font-bold">{streakDays}d</span>
              </span>

              <span className="w-1 h-1 rounded-full bg-white/30" />

              {upcoming ? (
                <span className="flex items-center gap-1 text-purple-300 truncate max-w-[110px]">
                  <Calendar className="w-3 h-3 text-purple-400 shrink-0" />
                  <span className="truncate">{upcoming.name}</span>
                </span>
              ) : (
                <span className="flex items-center gap-1 text-emerald-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping inline-block" />
                  <span>Cloud Active</span>
                </span>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="expanded"
              initial={{ opacity: 0, y: 2 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 2 }}
              transition={{ duration: 0.2 }}
              className="flex flex-col gap-2 min-w-[210px] text-xs py-1"
            >
              <div className="flex items-center justify-between border-b border-white/10 pb-1.5">
                <div className="flex items-center gap-1.5 text-neutral-300 font-medium">
                  <Sparkles className="w-3.5 h-3.5 text-[#2997ff]" />
                  <span>Live Activity HUD</span>
                </div>
                <span className="text-[10px] font-mono text-emerald-400">
                  {syncStatus === 'synced' ? '● Synced' : '○ Saving'}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div className="p-1.5 rounded-lg bg-white/5 border border-white/5">
                  <div className="text-neutral-400 text-[10px]">Prep Streak</div>
                  <div className="font-bold text-amber-400 flex items-center gap-1 font-mono">
                    <Flame className="w-3 h-3 fill-current" />
                    {streakDays} Days
                  </div>
                </div>

                <div className="p-1.5 rounded-lg bg-white/5 border border-white/5">
                  <div className="text-neutral-400 text-[10px]">Drilled</div>
                  <div className="font-bold text-white font-mono">
                    {answeredCount}/{questions.length} Qs
                  </div>
                </div>
              </div>

              {upcoming && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveView('placement');
                  }}
                  className="mt-0.5 flex items-center justify-between text-[11px] text-purple-300 hover:text-white bg-purple-950/40 hover:bg-purple-900/40 p-1.5 rounded-lg border border-purple-800/40 transition-colors"
                >
                  <span className="truncate">Upcoming: {upcoming.name} ({upcoming.interviewDate})</span>
                  <ChevronRight className="w-3 h-3 shrink-0" />
                </button>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};
