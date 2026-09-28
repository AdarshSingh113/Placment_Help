import React, { useRef } from 'react';
import { motion } from 'motion/react';
import { 
  Target, 
  Mic2, 
  Calculator, 
  Newspaper, 
  Sparkles, 
  AlertTriangle, 
  ArrowRight, 
  Plus, 
  Dumbbell, 
  Brain,
  ChevronRight,
  ChevronLeft,
  TrendingUp,
  Activity,
  Flame,
  Calendar,
  CheckCircle2,
  Play,
  HeartPulse,
  Utensils,
  Pill,
  ExternalLink
} from 'lucide-react';
import { useData } from '../context/DataContext';
import { AnimatedCounter } from '../components/AnimatedCounter';
import { triggerCelebration } from '../utils/confetti';

export const DashboardView: React.FC = () => {
  const { 
    setActiveView, 
    setSelectedCompanyId,
    openQuickAdd,
    setPracticeModalQuestionId,
    companies,
    questions,
    guesstimates,
    gdTopics,
    mistakes,
    dailyLogs,
    gymLogs,
    foodLogs,
    medicines,
    knowledgeSummaries,
    readinessScore,
    streakDays
  } = useData();

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.06
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 16 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] }
    }
  };

  // Apple Store Category Shelf Items (Mac, iPhone, iPad, Watch, AirPods, etc.)
  const categoryShelf = [
    { id: 'placement', label: 'Placement', sub: 'Pipeline', icon: Target },
    { id: 'interviewPrep', label: 'Questions', sub: 'Drills', icon: Mic2 },
    { id: 'knowledgeBase', label: 'AI Vault', sub: 'Research', icon: Brain },
    { id: 'guesstimateLab', label: 'Guesstimates', sub: 'Models', icon: Calculator },
    { id: 'gdCurrentAffairs', label: 'GD & News', sub: 'Debates', icon: Newspaper },
    { id: 'dailyGrowth', label: 'Growth', sub: 'Reflection', icon: Sparkles },
    { id: 'healthWellness', label: 'Health Hub', sub: 'Fitness', icon: Dumbbell },
    { id: 'mistakeBank', label: 'Mistakes', sub: 'Analysis', icon: AlertTriangle },
  ];

  const shelfScrollRef = useRef<HTMLDivElement>(null);

  const scrollShelf = (direction: 'left' | 'right') => {
    if (shelfScrollRef.current) {
      const offset = direction === 'left' ? -280 : 280;
      shelfScrollRef.current.scrollBy({ left: offset, behavior: 'smooth' });
    }
  };

  return (
    <motion.div 
      id="apple_store_dashboard"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-12 pb-16"
    >
      {/* 1. Apple Hero Section: "Store. The best way to prepare for the career you love." */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 pt-2">
        <div className="space-y-1 max-w-3xl">
          <div className="flex items-baseline gap-3 flex-wrap">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-[#1d1d1f]">
              Store.
            </h1>
            <span className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight text-[#86868b]">
              The best way to prepare for the career you love.
            </span>
          </div>
          <p className="text-xs sm:text-sm font-medium text-[#86868b] pt-1">
            Placement OS · Executive Preparation Suite · Real-time Cloud Persisted
          </p>
        </div>

        {/* Right Specialist Widget (matching the Apple Store Specialist support block) */}
        <motion.div 
          whileHover={{ y: -4, scale: 1.02, transition: { type: 'spring', stiffness: 400, damping: 20 } }}
          className="flex items-center gap-3.5 shrink-0 bg-[#f5f5f7] p-3.5 rounded-2xl border border-black/[0.06] shadow-xs group"
        >
          <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-[#0071e3] to-[#42a5f5] text-white flex items-center justify-center font-bold text-sm shadow-sm ring-2 ring-white group-hover:scale-110 transition-transform duration-250">
            OS
          </div>
          <div className="text-xs space-y-0.5">
            <div className="font-semibold text-[#1d1d1f]">Need preparation help?</div>
            <button 
              onClick={() => setActiveView('knowledgeBase')} 
              className="text-[#0071e3] hover:underline flex items-center gap-0.5 font-medium cursor-pointer"
            >
              <span>Ask an AI Specialist</span>
              <ChevronRight className="w-3 h-3 inline group-hover:translate-x-0.5 transition-transform" />
            </button>
            <button 
              onClick={() => setActiveView('placement')} 
              className="text-[#86868b] hover:text-[#1d1d1f] hover:underline block text-[11px] cursor-pointer"
            >
              <span>View Target Pipeline →</span>
            </button>
          </div>
        </motion.div>
      </div>

      {/* 2. Apple Store Category Icon Shelf with Scroll Buttons */}
      <div className="relative group/shelf">
        {/* Left Scroll Button */}
        <button
          onClick={() => scrollShelf('left')}
          className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-white/90 border border-black/10 shadow-md items-center justify-center text-[#1d1d1f] hover:bg-white hover:scale-110 active:scale-95 transition-all opacity-0 group-hover/shelf:opacity-100 cursor-pointer"
          title="Scroll Left"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {/* Right Scroll Button */}
        <button
          onClick={() => scrollShelf('right')}
          className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-white/90 border border-black/10 shadow-md items-center justify-center text-[#1d1d1f] hover:bg-white hover:scale-110 active:scale-95 transition-all opacity-0 group-hover/shelf:opacity-100 cursor-pointer"
          title="Scroll Right"
        >
          <ChevronRight className="w-4 h-4" />
        </button>

        <div 
          ref={shelfScrollRef}
          className="w-full overflow-x-auto custom-scrollbar pb-3 pt-1 scroll-smooth"
        >
          <div className="flex items-center gap-6 sm:gap-9 min-w-max px-1">
            {categoryShelf.map((cat, idx) => {
              const Icon = cat.icon;
              return (
                <motion.button
                  key={cat.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.04, duration: 0.3 }}
                  whileHover={{ y: -6, scale: 1.06, transition: { type: 'spring', stiffness: 400, damping: 22 } }}
                  whileTap={{ scale: 0.92 }}
                  onClick={() => setActiveView(cat.id)}
                  className="flex flex-col items-center gap-2.5 group cursor-pointer"
                >
                  {/* Clean Apple squircle container with specular shine */}
                  <div className="relative overflow-hidden w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white border border-black/[0.08] shadow-[0_2px_12px_rgba(0,0,0,0.04)] group-hover:shadow-[0_12px_28px_rgba(0,0,0,0.1)] group-hover:border-black/20 transition-all flex items-center justify-center text-[#1d1d1f]">
                    <div className="specular-sheen" />
                    <Icon className="w-7 h-7 sm:w-8 sm:h-8 group-hover:scale-115 text-[#1d1d1f] transition-transform duration-250 ease-out" />
                  </div>
                  <div className="text-center">
                    <span className="block text-xs font-semibold text-[#1d1d1f] group-hover:text-[#0071e3] transition-colors leading-tight">
                      {cat.label}
                    </span>
                    <span className="block text-[10px] text-[#86868b]">
                      {cat.sub}
                    </span>
                  </div>
                </motion.button>
              );
            })}
          </div>
        </div>
      </div>

      {/* 2.5 Animated Apple Watch Telemetry Ring HUD */}
      <motion.div 
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, duration: 0.4 }}
        className="p-5 sm:p-6 rounded-3xl bg-[#f5f5f7] border border-black/[0.06] shadow-xs"
      >
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {/* Ring 1: Readiness Progress Ring */}
          <div className="flex items-center gap-3.5">
            <div className="relative w-14 h-14 shrink-0 flex items-center justify-center">
              <svg className="w-14 h-14 -rotate-90" viewBox="0 0 56 56">
                <circle cx="28" cy="28" r="22" className="stroke-neutral-300" strokeWidth="4.5" fill="none" />
                <motion.circle 
                  cx="28" 
                  cy="28" 
                  r="22" 
                  className="stroke-[#0071e3]" 
                  strokeWidth="4.5" 
                  strokeLinecap="round" 
                  fill="none" 
                  strokeDasharray="138.23"
                  initial={{ strokeDashoffset: 138.23 }}
                  animate={{ strokeDashoffset: 138.23 - (138.23 * Math.min(readinessScore || 78, 100)) / 100 }}
                  transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center text-xs font-bold text-[#1d1d1f]">
                <AnimatedCounter value={readinessScore || 78} suffix="%" />
              </div>
            </div>
            <div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-[#86868b]">Readiness Ring</div>
              <div className="text-sm font-extrabold text-[#1d1d1f]">Target Prepared</div>
            </div>
          </div>

          {/* Ring 2: Streak Flame with Clickable Particle Burst */}
          <div className="flex items-center gap-3.5">
            <motion.button 
              onClick={() => triggerCelebration()}
              whileHover={{ rotate: [0, -10, 10, -5, 0], scale: 1.15 }}
              whileTap={{ scale: 0.88 }}
              className="w-14 h-14 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-500 shadow-sm shrink-0 cursor-pointer group"
              title="Click for celebration burst!"
            >
              <Flame className="w-7 h-7 fill-current animate-flame group-hover:scale-115 transition-transform" />
            </motion.button>
            <div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-amber-600 flex items-center gap-1">
                <span>Streak Compounding</span>
                <span className="text-[10px] text-amber-500 font-normal">(tap)</span>
              </div>
              <div className="text-sm font-extrabold text-[#1d1d1f] flex items-center gap-1">
                <AnimatedCounter value={streakDays} suffix=" Days" />
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping inline-block ml-1" />
              </div>
            </div>
          </div>

          {/* Ring 3: Active Pipeline Volume */}
          <div className="flex items-center gap-3.5">
            <motion.div 
              whileHover={{ scale: 1.1 }}
              className="w-14 h-14 rounded-2xl bg-black text-white flex items-center justify-center shadow-md shrink-0 border border-white/10"
            >
              <Target className="w-7 h-7 text-emerald-400" />
            </motion.div>
            <div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-[#86868b]">Active Pipeline</div>
              <div className="text-sm font-extrabold text-[#1d1d1f]">
                <AnimatedCounter value={companies.length} suffix=" Companies" />
              </div>
            </div>
          </div>

          {/* Ring 4: Workout & Nutrition Telemetry */}
          <div className="flex items-center gap-3.5">
            <motion.div 
              whileHover={{ scale: 1.1 }}
              className="w-14 h-14 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-600 shadow-sm shrink-0"
            >
              <Activity className="w-7 h-7" />
            </motion.div>
            <div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-emerald-600">Health Routine</div>
              <div className="text-sm font-extrabold text-[#1d1d1f]">
                {gymLogs.length > 0 && gymLogs[0].attended ? (
                  <span className="text-emerald-600">✓ Workout Done</span>
                ) : (
                  <span>
                    <AnimatedCounter value={foodLogs.length} suffix=" Meals Logged" />
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* 3. Section Title: "The latest. Take a look at what's new right now." */}
      <div className="space-y-6">
        <div className="flex items-baseline gap-2">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#1d1d1f]">
            The latest.
          </h2>
          <span className="text-2xl sm:text-3xl font-normal tracking-tight text-[#86868b]">
            Take a look at what's new right now.
          </span>
        </div>

        {/* 4. BLACK AND WHITE CARDS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-7">

          {/* CARD 1: BLACK CARD - Placement Tracker */}
          <motion.div
            variants={itemVariants}
            whileHover={{ y: -6, transition: { type: 'spring', stiffness: 350, damping: 25 } }}
            className="apple-card-black p-8 sm:p-9 flex flex-col justify-between min-h-[460px] space-y-6 group"
          >
            <div className="specular-sheen" />
            <div className="space-y-4 relative z-10">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold tracking-wider uppercase text-neutral-400">
                  PLACEMENT TRACKER · ACTIVE ROUNDS
                </span>
                <motion.button
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.92 }}
                  onClick={() => openQuickAdd('company')}
                  className="text-xs font-semibold px-3 py-1 rounded-full text-white bg-white/10 hover:bg-white/20 transition-colors cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5 inline mr-1" />
                  Add Company
                </motion.button>
              </div>

              <div>
                <h3 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
                  Built for Interview Mastery.
                </h3>
                <p className="text-sm text-neutral-400 mt-2 font-normal leading-relaxed">
                  Track target shortlists, custom recruitment rounds, and preparation depth.
                </p>
              </div>

              {/* Live Preview List inside Black Card */}
              <div className="space-y-2.5 pt-2">
                {companies.length === 0 ? (
                  <div className="p-4 rounded-2xl bg-white/[0.04] border border-white/[0.08] text-xs text-neutral-400 text-center">
                    No target companies tracked yet. Click above to add.
                  </div>
                ) : (
                  companies.slice(0, 3).map((comp) => (
                    <motion.div
                      key={comp.id}
                      whileHover={{ x: 6, transition: { type: 'spring', stiffness: 450, damping: 25 } }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        setSelectedCompanyId(comp.id);
                        setActiveView('placement');
                      }}
                      className="p-3.5 rounded-2xl bg-white/[0.06] hover:bg-white/[0.12] border border-white/[0.08] hover:border-white/[0.16] transition-all cursor-pointer flex items-center justify-between group/row"
                    >
                      <div>
                        <div className="text-sm font-bold text-white group-hover/row:text-blue-400 transition-colors">
                          {comp.name}
                        </div>
                        <div className="text-xs text-neutral-400">
                          {comp.role || comp.industry} · {comp.status}
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-mono font-bold text-emerald-400">
                          {comp.prepProgress}%
                        </span>
                        <ChevronRight className="w-4 h-4 text-neutral-500 group-hover/row:text-white group-hover/row:translate-x-1 transition-all" />
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            </div>

            {/* Footer CTAs */}
            <div className="pt-4 border-t border-white/10 flex items-center justify-between relative z-10">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveView('placement')}
                className="px-5 py-2.5 rounded-full bg-white text-black font-semibold text-xs hover:bg-neutral-200 transition-colors inline-flex items-center gap-1.5 cursor-pointer shadow-md"
              >
                <span>Explore Pipeline</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </motion.button>
              <span className="text-xs font-mono text-neutral-400">
                <AnimatedCounter value={companies.length} suffix=" targets active" />
              </span>
            </div>
          </motion.div>

          {/* CARD 2: WHITE CARD - AI Knowledge Vault */}
          <motion.div
            variants={itemVariants}
            whileHover={{ y: -6, transition: { type: 'spring', stiffness: 350, damping: 25 } }}
            className="apple-card-white p-8 sm:p-9 flex flex-col justify-between min-h-[460px] space-y-6 group"
          >
            <div className="specular-sheen" />
            <div className="space-y-4 relative z-10">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold tracking-wider uppercase text-[#f56300]">
                  GEMINI 2.5 PRO · LIVE RESEARCH
                </span>
                <motion.button
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.92 }}
                  onClick={() => setActiveView('knowledgeBase')}
                  className="text-xs font-semibold px-3 py-1 rounded-full text-neutral-700 bg-black/5 hover:bg-black/10 transition-colors cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5 inline mr-1" />
                  New Topic
                </motion.button>
              </div>

              <div>
                <h3 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#1d1d1f] leading-tight">
                  Intelligence Grounded.
                </h3>
                <p className="text-sm text-[#86868b] mt-2 font-normal leading-relaxed">
                  Live web research, executive takeaways & synthesis for high-stakes interviews.
                </p>
              </div>

              {/* Live Preview List inside White Card */}
              <div className="space-y-2.5 pt-2">
                {knowledgeSummaries.length === 0 ? (
                  <div className="p-4 rounded-2xl bg-[#f5f5f7] border border-black/[0.06] text-xs text-[#86868b] text-center">
                    No research synthesized yet. Search any company or industry topic.
                  </div>
                ) : (
                  knowledgeSummaries.slice(0, 3).map((item) => (
                    <motion.div
                      key={item.id}
                      whileHover={{ x: 6, transition: { type: 'spring', stiffness: 450, damping: 25 } }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setActiveView('knowledgeBase')}
                      className="p-3.5 rounded-2xl bg-[#f5f5f7] hover:bg-black/[0.04] border border-black/[0.06] hover:border-black/[0.12] transition-all cursor-pointer flex items-center justify-between group/row"
                    >
                      <div className="truncate pr-3">
                        <div className="text-sm font-bold text-[#1d1d1f] group-hover/row:text-[#0071e3] transition-colors truncate">
                          {item.title}
                        </div>
                        <div className="text-xs text-[#86868b]">
                          {item.category} · {item.keyTakeaways?.length || 0} Key Takeaways
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-[#86868b] group-hover/row:text-black group-hover/row:translate-x-1 transition-all shrink-0" />
                    </motion.div>
                  ))
                )}
              </div>
            </div>

            {/* Footer CTAs */}
            <div className="pt-4 border-t border-black/[0.06] flex items-center justify-between relative z-10">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveView('knowledgeBase')}
                className="px-5 py-2.5 rounded-full bg-[#0071e3] text-white font-semibold text-xs hover:bg-[#0077ed] transition-colors inline-flex items-center gap-1.5 cursor-pointer shadow-md"
              >
                <span>Open AI Vault</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </motion.button>
              <span className="text-xs font-mono text-[#86868b]">
                <AnimatedCounter value={knowledgeSummaries.length} suffix=" dossiers saved" />
              </span>
            </div>
          </motion.div>

          {/* CARD 3: BLACK CARD - Interview Prep & Drills */}
          <motion.div
            variants={itemVariants}
            whileHover={{ y: -6, transition: { type: 'spring', stiffness: 350, damping: 25 } }}
            className="apple-card-black p-8 sm:p-9 flex flex-col justify-between min-h-[460px] space-y-6 group"
          >
            <div className="specular-sheen" />
            <div className="space-y-4 relative z-10">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold tracking-wider uppercase text-neutral-400">
                  PRACTICE DRILLS
                </span>
                <motion.button
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.92 }}
                  onClick={() => openQuickAdd('question')}
                  className="text-xs font-semibold px-3 py-1 rounded-full text-white bg-white/10 hover:bg-white/20 transition-colors cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5 inline mr-1" />
                  Add Question
                </motion.button>
              </div>

              <div>
                <h3 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
                  Answer with Confidence.
                </h3>
                <p className="text-sm text-neutral-400 mt-2 font-normal leading-relaxed">
                  HR, Behavioral, Strategy & Case question formulations with live practice timer.
                </p>
              </div>

              {/* Live Preview List inside Black Card */}
              <div className="space-y-2.5 pt-2">
                {questions.length === 0 ? (
                  <div className="p-4 rounded-2xl bg-white/[0.04] border border-white/[0.08] text-xs text-neutral-400 text-center">
                    No questions logged. Add your first interview question.
                  </div>
                ) : (
                  questions.slice(0, 3).map((q) => (
                    <motion.div
                      key={q.id}
                      whileHover={{ x: 6, transition: { type: 'spring', stiffness: 450, damping: 25 } }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setActiveView('interviewPrep')}
                      className="p-3.5 rounded-2xl bg-white/[0.06] hover:bg-white/[0.12] border border-white/[0.08] hover:border-white/[0.16] transition-all cursor-pointer flex items-center justify-between group/row"
                    >
                      <div className="truncate pr-3">
                        <div className="text-sm font-bold text-white group-hover/row:text-blue-400 transition-colors truncate">
                          {q.question}
                        </div>
                        <div className="text-xs text-neutral-400">
                          {q.category} · {q.difficulty} · Practiced {q.practiceCount || 0}x
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-neutral-500 group-hover/row:text-white group-hover/row:translate-x-1 transition-all shrink-0" />
                    </motion.div>
                  ))
                )}
              </div>
            </div>

            {/* Footer CTAs */}
            <div className="pt-4 border-t border-white/10 flex items-center justify-between relative z-10">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveView('interviewPrep')}
                className="px-5 py-2.5 rounded-full bg-white text-black font-semibold text-xs hover:bg-neutral-200 transition-colors inline-flex items-center gap-1.5 cursor-pointer shadow-md"
              >
                <span>Practice Questions</span>
                <Play className="w-3.5 h-3.5 fill-current" />
              </motion.button>
              <span className="text-xs font-mono text-neutral-400">
                <AnimatedCounter value={questions.length} suffix=" questions" />
              </span>
            </div>
          </motion.div>

          {/* CARD 4: WHITE CARD - Health & Fitness Hub */}
          <motion.div
            variants={itemVariants}
            whileHover={{ y: -6, transition: { type: 'spring', stiffness: 350, damping: 25 } }}
            className="apple-card-white p-8 sm:p-9 flex flex-col justify-between min-h-[460px] space-y-6 group"
          >
            <div className="specular-sheen" />
            <div className="space-y-4 relative z-10">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold tracking-wider uppercase text-[#0071e3]">
                  DAILY DISCIPLINE
                </span>
                <motion.button
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.92 }}
                  onClick={() => setActiveView('healthWellness')}
                  className="text-xs font-semibold px-3 py-1 rounded-full text-neutral-700 bg-black/5 hover:bg-black/10 transition-colors cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5 inline mr-1" />
                  Log Habit
                </motion.button>
              </div>

              <div>
                <h3 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#1d1d1f] leading-tight">
                  Peak Cognitive Energy.
                </h3>
                <p className="text-sm text-[#86868b] mt-2 font-normal leading-relaxed">
                  Workout splits, body weight, authentic Indian nutrition macros & supplement streaks.
                </p>
              </div>

              {/* Live Preview List inside White Card */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2">
                <motion.div 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setActiveView('healthWellness')}
                  className="p-3.5 rounded-2xl bg-[#f5f5f7] border border-black/[0.06] hover:border-black/[0.14] transition-all cursor-pointer shadow-2xs"
                >
                  <div className="flex items-center gap-2 text-xs font-bold text-[#1d1d1f]">
                    <Dumbbell className="w-4 h-4 text-orange-500" />
                    <span>Gym Attendance</span>
                  </div>
                  <div className="text-xs text-[#86868b] mt-1">
                    {gymLogs.length > 0 && gymLogs[0].attended ? '✓ Attended Today' : 'Scheduled Workout'}
                  </div>
                </motion.div>

                <motion.div 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setActiveView('healthWellness')}
                  className="p-3.5 rounded-2xl bg-[#f5f5f7] border border-black/[0.06] hover:border-black/[0.14] transition-all cursor-pointer shadow-2xs"
                >
                  <div className="flex items-center gap-2 text-xs font-bold text-[#1d1d1f]">
                    <Utensils className="w-4 h-4 text-lime-600" />
                    <span>Indian Nutrition</span>
                  </div>
                  <div className="text-xs text-[#86868b] mt-1">
                    {foodLogs.length} meals logged today
                  </div>
                </motion.div>

                <motion.div 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setActiveView('healthWellness')}
                  className="p-3.5 rounded-2xl bg-[#f5f5f7] border border-black/[0.06] hover:border-black/[0.14] transition-all cursor-pointer sm:col-span-2 shadow-2xs"
                >
                  <div className="flex items-center justify-between text-xs font-bold text-[#1d1d1f]">
                    <div className="flex items-center gap-2">
                      <Pill className="w-4 h-4 text-blue-500" />
                      <span>Medicine & Supplements</span>
                    </div>
                    <span className="text-[11px] font-normal text-[#86868b]">{medicines.length} in cabinet</span>
                  </div>
                </motion.div>
              </div>
            </div>

            {/* Footer CTAs */}
            <div className="pt-4 border-t border-black/[0.06] flex items-center justify-between relative z-10">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveView('healthWellness')}
                className="px-5 py-2.5 rounded-full bg-[#1d1d1f] text-white font-semibold text-xs hover:bg-black transition-colors inline-flex items-center gap-1.5 cursor-pointer shadow-md"
              >
                <span>Open Health Hub</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </motion.button>
              <span className="text-xs font-mono text-[#86868b]">
                Streak: <AnimatedCounter value={streakDays} suffix=" days" />
              </span>
            </div>
          </motion.div>

          {/* CARD 5: BLACK CARD - Guesstimate Lab */}
          <motion.div
            variants={itemVariants}
            whileHover={{ y: -6, transition: { type: 'spring', stiffness: 350, damping: 25 } }}
            className="apple-card-black p-8 sm:p-9 flex flex-col justify-between min-h-[460px] space-y-6 group"
          >
            <div className="specular-sheen" />
            <div className="space-y-4 relative z-10">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold tracking-wider uppercase text-neutral-400">
                  MARKET SIZING
                </span>
                <motion.button
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.92 }}
                  onClick={() => openQuickAdd('guesstimate')}
                  className="text-xs font-semibold px-3 py-1 rounded-full text-white bg-white/10 hover:bg-white/20 transition-colors cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5 inline mr-1" />
                  New Model
                </motion.button>
              </div>

              <div>
                <h3 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
                  Quantitative Precision.
                </h3>
                <p className="text-sm text-neutral-400 mt-2 font-normal leading-relaxed">
                  Formulas, market sizing variables, population benchmarks & sanity checking.
                </p>
              </div>

              {/* Live Preview List inside Black Card */}
              <div className="space-y-2.5 pt-2">
                {guesstimates.length === 0 ? (
                  <div className="p-4 rounded-2xl bg-white/[0.04] border border-white/[0.08] text-xs text-neutral-400 text-center">
                    No guesstimates logged yet. Try estimating market size for India smartphones.
                  </div>
                ) : (
                  guesstimates.slice(0, 3).map((g) => (
                    <motion.div
                      key={g.id}
                      whileHover={{ x: 6, transition: { type: 'spring', stiffness: 450, damping: 25 } }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setActiveView('guesstimateLab')}
                      className="p-3.5 rounded-2xl bg-white/[0.06] hover:bg-white/[0.12] border border-white/[0.08] hover:border-white/[0.16] transition-all cursor-pointer flex items-center justify-between group/row"
                    >
                      <div className="truncate pr-3">
                        <div className="text-sm font-bold text-white group-hover/row:text-blue-400 transition-colors truncate">
                          {g.question}
                        </div>
                        <div className="text-xs text-neutral-400">
                          {g.category} · {g.resultUnit || 'Value'} · {g.difficulty}
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-neutral-500 group-hover/row:text-white group-hover/row:translate-x-1 transition-all shrink-0" />
                    </motion.div>
                  ))
                )}
              </div>
            </div>

            {/* Footer CTAs */}
            <div className="pt-4 border-t border-white/10 flex items-center justify-between relative z-10">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveView('guesstimateLab')}
                className="px-5 py-2.5 rounded-full bg-white text-black font-semibold text-xs hover:bg-neutral-200 transition-colors inline-flex items-center gap-1.5 cursor-pointer shadow-md"
              >
                <span>Open Guesstimate Lab</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </motion.button>
              <span className="text-xs font-mono text-neutral-400">
                <AnimatedCounter value={guesstimates.length} suffix=" models" />
              </span>
            </div>
          </motion.div>

          {/* CARD 6: WHITE CARD - Daily Growth & Reflection */}
          <motion.div
            variants={itemVariants}
            whileHover={{ y: -6, transition: { type: 'spring', stiffness: 350, damping: 25 } }}
            className="apple-card-white p-8 sm:p-9 flex flex-col justify-between min-h-[460px] space-y-6 group"
          >
            <div className="specular-sheen" />
            <div className="space-y-4 relative z-10">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold tracking-wider uppercase text-[#f56300]">
                  CONTINUOUS COMPOUNDING
                </span>
                <motion.button
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.92 }}
                  onClick={() => openQuickAdd('task')}
                  className="text-xs font-semibold px-3 py-1 rounded-full text-neutral-700 bg-black/5 hover:bg-black/10 transition-colors cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5 inline mr-1" />
                  Log Daily
                </motion.button>
              </div>

              <div>
                <h3 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#1d1d1f] leading-tight">
                  Daily Reflections.
                </h3>
                <p className="text-sm text-[#86868b] mt-2 font-normal leading-relaxed">
                  Track hours, communication habits, study wins and tomorrow's focus.
                </p>
              </div>

              {/* Live Preview List inside White Card */}
              <div className="space-y-2.5 pt-2">
                {dailyLogs.length === 0 ? (
                  <div className="p-4 rounded-2xl bg-[#f5f5f7] border border-black/[0.06] text-xs text-[#86868b] text-center">
                    No reflections logged yet. Record your daily progress today.
                  </div>
                ) : (
                  dailyLogs.slice(0, 3).map((d) => (
                    <motion.div
                      key={d.id}
                      whileHover={{ x: 6, transition: { type: 'spring', stiffness: 450, damping: 25 } }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setActiveView('dailyGrowth')}
                      className="p-3.5 rounded-2xl bg-[#f5f5f7] hover:bg-black/[0.04] border border-black/[0.06] hover:border-black/[0.12] transition-all cursor-pointer flex items-center justify-between group/row"
                    >
                      <div className="truncate pr-3">
                        <div className="text-sm font-bold text-[#1d1d1f] group-hover/row:text-[#0071e3] transition-colors truncate">
                          {d.accomplished || d.notes || `Daily Reflection (${d.date})`}
                        </div>
                        <div className="text-xs text-[#86868b]">
                          Date: {d.date} · Next: {d.tomorrowFocus || 'Preparation focus'}
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-[#86868b] group-hover/row:text-black group-hover/row:translate-x-1 transition-all shrink-0" />
                    </motion.div>
                  ))
                )}
              </div>
            </div>

            {/* Footer CTAs */}
            <div className="pt-4 border-t border-black/[0.06] flex items-center justify-between relative z-10">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveView('dailyGrowth')}
                className="px-5 py-2.5 rounded-full bg-[#1d1d1f] text-white font-semibold text-xs hover:bg-black transition-colors inline-flex items-center gap-1.5 cursor-pointer shadow-md"
              >
                <span>Open Reflection OS</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </motion.button>
              <span className="text-xs font-mono text-[#86868b]">
                <AnimatedCounter value={dailyLogs.length} suffix=" logs" />
              </span>
            </div>
          </motion.div>

        </div>
      </div>
    </motion.div>
  );
};
