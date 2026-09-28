import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Dumbbell, 
  Utensils, 
  Pill, 
  CheckCircle2, 
  HeartPulse, 
  Activity
} from 'lucide-react';
import { useData } from '../context/DataContext';
import { GymAttendanceView } from './GymAttendanceView';
import { NutritionView } from './NutritionView';
import { MedicineView } from './MedicineView';
import { AnimatedCounter } from '../components/AnimatedCounter';

export type HealthTabType = 'gym' | 'nutrition' | 'medicines';

interface HealthWellnessViewProps {
  initialTab?: HealthTabType;
}

export const HealthWellnessView: React.FC<HealthWellnessViewProps> = ({ initialTab = 'gym' }) => {
  const { 
    activeView, 
    gymLogs = [], 
    foodLogs = [], 
    nutritionGoals, 
    medicines = [], 
    medicineLogs = [] 
  } = useData();

  // Determine active tab based on activeView or internal tab state
  const getInitialTab = (): HealthTabType => {
    if (activeView === 'nutrition' || activeView === 'food') return 'nutrition';
    if (activeView === 'medicines' || activeView === 'medicine') return 'medicines';
    return (initialTab as HealthTabType) || 'gym';
  };

  const [activeTab, setActiveTab] = useState<HealthTabType>(getInitialTab);

  // Sync tab if user clicked direct deep link
  useEffect(() => {
    if (activeView === 'nutrition' || activeView === 'food') {
      setActiveTab('nutrition');
    } else if (activeView === 'medicines' || activeView === 'medicine') {
      setActiveTab('medicines');
    } else if (activeView === 'gymAttendance') {
      setActiveTab('gym');
    }
  }, [activeView]);

  const todayStr = useMemo(() => new Date().toISOString().split('T')[0], []);

  // Today's summary statistics
  const todayGymLog = useMemo(() => {
    return gymLogs.find(l => l.date === todayStr);
  }, [gymLogs, todayStr]);

  const todayNutritionSummary = useMemo(() => {
    const logs = foodLogs.filter(f => f.date === todayStr);
    const totalCal = logs.reduce((sum, item) => sum + (item.calories || 0), 0);
    const totalProtein = logs.reduce((sum, item) => sum + (item.proteinGrams || 0), 0);
    return {
      calories: Math.round(totalCal),
      protein: Math.round(totalProtein),
      goalCal: nutritionGoals?.dailyCalories || 2200,
      count: logs.length
    };
  }, [foodLogs, nutritionGoals, todayStr]);

  const todayMedicineSummary = useMemo(() => {
    const activeMeds = medicines.filter(m => m.isActive);
    const takenCount = medicineLogs.filter(l => l.date === todayStr && l.taken).length;
    return {
      activeCount: activeMeds.length,
      takenCount
    };
  }, [medicines, medicineLogs, todayStr]);

  const tabs = [
    { id: 'gym' as HealthTabType, label: 'Gym Attendance & Split', icon: Dumbbell },
    { id: 'nutrition' as HealthTabType, label: 'Food & Indian Nutrition', icon: Utensils },
    { id: 'medicines' as HealthTabType, label: 'Medicine Cabinet & Minoxidil', icon: Pill },
  ];

  return (
    <div id="health_wellness_merged_container" className="space-y-6">
      {/* Top Main Health & Fitness Header */}
      <div className="apple-card-black rounded-3xl p-5 sm:p-7 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-gradient-to-b from-emerald-500 to-teal-600 text-white shadow-[0_4px_16px_rgba(16,185,129,0.3)] border border-white/20">
                <HeartPulse className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-white flex items-center gap-2">
                  <span>Health, Nutrition & Wellness</span>
                </h1>
                <p className="text-xs sm:text-sm text-neutral-400">
                  Daily workout splits, authentic Indian food macros, and supplement consistency.
                </p>
              </div>
            </div>
          </div>

          {/* Quick Glances Apple Bento Pill Widgets */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            {/* Gym Widget */}
            <motion.div 
              whileHover={{ y: -3, scale: 1.02 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => setActiveTab('gym')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-2xl border transition-all cursor-pointer select-none ${
                activeTab === 'gym' 
                  ? 'bg-orange-500/15 border-orange-500/40 text-orange-300 shadow-[0_0_12px_rgba(249,115,22,0.15)]' 
                  : 'bg-white/[0.03] border-white/[0.08] text-neutral-300 hover:border-white/[0.16]'
              }`}
            >
              <Dumbbell className="w-4 h-4 text-orange-400" />
              <div className="text-left">
                <div className="text-[10px] text-neutral-400 uppercase font-semibold">Today's Workout</div>
                <div className="text-xs font-bold flex items-center gap-1">
                  {todayGymLog?.attended ? (
                    <span className="text-emerald-400 flex items-center gap-0.5">
                      <CheckCircle2 className="w-3 h-3" /> Attended
                    </span>
                  ) : (
                    <span className="text-neutral-400">Not Logged</span>
                  )}
                  {todayGymLog?.weight ? <span className="text-neutral-400 text-[11px] tabular-nums">({todayGymLog.weight} kg)</span> : null}
                </div>
              </div>
            </motion.div>

            {/* Nutrition Widget */}
            <motion.div 
              whileHover={{ y: -3, scale: 1.02 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => setActiveTab('nutrition')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-2xl border transition-all cursor-pointer select-none ${
                activeTab === 'nutrition' 
                  ? 'bg-lime-500/15 border-lime-500/40 text-lime-300 shadow-[0_0_12px_rgba(132,204,22,0.15)]' 
                  : 'bg-white/[0.03] border-white/[0.08] text-neutral-300 hover:border-white/[0.16]'
              }`}
            >
              <Utensils className="w-4 h-4 text-lime-400" />
              <div className="text-left">
                <div className="text-[10px] text-neutral-400 uppercase font-semibold">Calories Today</div>
                <div className="text-xs font-bold text-neutral-200 tabular-nums">
                  <span className="text-lime-400">
                    <AnimatedCounter value={todayNutritionSummary.calories} />
                  </span>
                  <span className="text-neutral-400 font-normal"> / {todayNutritionSummary.goalCal} kcal</span>
                </div>
              </div>
            </motion.div>

            {/* Medicine Widget */}
            <motion.div 
              whileHover={{ y: -3, scale: 1.02 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => setActiveTab('medicines')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-2xl border transition-all cursor-pointer select-none ${
                activeTab === 'medicines' 
                  ? 'bg-blue-500/15 border-blue-500/40 text-blue-300 shadow-[0_0_12px_rgba(59,130,246,0.15)]' 
                  : 'bg-white/[0.03] border-white/[0.08] text-neutral-300 hover:border-white/[0.16]'
              }`}
            >
              <Pill className="w-4 h-4 text-blue-400" />
              <div className="text-left">
                <div className="text-[10px] text-neutral-400 uppercase font-semibold">Supplements</div>
                <div className="text-xs font-bold text-neutral-200 tabular-nums">
                  <span className={todayMedicineSummary.takenCount >= todayMedicineSummary.activeCount && todayMedicineSummary.activeCount > 0 ? 'text-emerald-400' : 'text-blue-400'}>
                    <AnimatedCounter value={todayMedicineSummary.takenCount} />
                  </span>
                  <span className="text-neutral-400 font-normal"> / {todayMedicineSummary.activeCount} taken</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Apple Segmented Slider Tab Bar */}
        <div className="flex items-center gap-1.5 p-1.5 bg-black/50 rounded-2xl border border-white/[0.08] overflow-x-auto custom-scrollbar relative">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                id={`tab_health_${tab.id}`}
                onClick={() => setActiveTab(tab.id)}
                className={`relative flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-colors cursor-pointer whitespace-nowrap ${
                  isActive ? 'text-white' : 'text-neutral-400 hover:text-white'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="healthSegmentedGlider"
                    className="absolute inset-0 rounded-xl bg-gradient-to-b from-white/[0.16] to-white/[0.06] border border-white/[0.18] shadow-[0_2px_8px_rgba(0,0,0,0.4)]"
                    transition={{ type: 'spring', stiffness: 450, damping: 35 }}
                  />
                )}
                <span className="relative z-10 flex items-center gap-2">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-neutral-400'}`} />
                  <span>{tab.label}</span>
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Render Active Sub-View with smooth transition */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
        >
          {activeTab === 'gym' && <GymAttendanceView />}
          {activeTab === 'nutrition' && <NutritionView />}
          {activeTab === 'medicines' && <MedicineView />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
