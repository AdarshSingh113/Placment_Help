import React from 'react';
import { motion } from 'motion/react';
import { 
  LayoutDashboard, 
  Target, 
  Mic2, 
  Calculator, 
  Newspaper, 
  Sparkles, 
  AlertTriangle, 
  Settings,
  ChevronLeft, 
  ChevronRight,
  GraduationCap,
  Dumbbell,
  Brain
} from 'lucide-react';
import { useData } from '../context/DataContext';

interface SidebarProps {
  collapsed?: boolean;
  setCollapsed?: (val: boolean) => void;
  mobileOpen?: boolean;
  setMobileOpen?: (val: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  collapsed = false,
  setCollapsed = (_val: boolean) => {},
  mobileOpen = false,
  setMobileOpen = (_val: boolean) => {}
}) => {
  const { 
    activeView, 
    setActiveView, 
    readinessScore 
  } = useData();

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'placement', label: 'Placement Pipeline', icon: Target },
    { id: 'interviewPrep', label: 'Interview Prep', icon: Mic2 },
    { id: 'knowledgeBase', label: 'AI Knowledge Vault', icon: Brain },
    { id: 'guesstimateLab', label: 'Guesstimate Lab', icon: Calculator },
    { id: 'gdCurrentAffairs', label: 'GD & Current Affairs', icon: Newspaper },
    { id: 'dailyGrowth', label: 'Daily Growth', icon: Sparkles },
    { id: 'healthWellness', label: 'Health & Fitness', icon: Dumbbell },
    { id: 'mistakeBank', label: 'Mistake Bank', icon: AlertTriangle },
  ];

  const handleNavClick = (viewId: string) => {
    setActiveView(viewId);
    if (typeof setMobileOpen === 'function') {
      setMobileOpen(false);
    }
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div 
          id="mobile_backdrop"
          onClick={() => setMobileOpen(false)} 
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-md lg:hidden transition-opacity"
        />
      )}

      <aside
        id="main_sidebar"
        className={`fixed top-0 left-0 z-50 h-screen flex flex-col transition-all duration-300 backdrop-blur-2xl bg-[#0a0a0e]/85 border-r border-white/[0.08] shadow-[4px_0_24px_rgba(0,0,0,0.5)] text-[#f5f5f7] ${
          collapsed ? 'w-20' : 'w-64'
        } ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
      >
        {/* Brand Header */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-white/[0.06] relative">
          <div 
            onClick={() => handleNavClick('dashboard')}
            className="flex items-center gap-3 cursor-pointer select-none overflow-hidden group"
          >
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-b from-[#2997ff] to-[#0071e3] shadow-[0_4px_16px_rgba(41,151,255,0.35)] text-white shrink-0 group-hover:scale-105 transition-transform duration-300">
              <div className="absolute inset-0 rounded-xl border border-white/20 pointer-events-none" />
              <GraduationCap className="w-5 h-5 drop-shadow-sm" />
            </div>
            {!collapsed && (
              <div className="flex flex-col min-w-0">
                <div className="font-bold text-sm tracking-tight text-white flex items-center gap-1.5 leading-none">
                  <span>Placement</span>
                  <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded-md bg-blue-500/20 text-[#2997ff] border border-blue-500/30">
                    OS
                  </span>
                </div>
                <span className="text-[11px] text-neutral-400 font-medium tracking-tight mt-1 truncate">
                  Executive Suite
                </span>
              </div>
            )}
          </div>

          <button
            id="btn_toggle_sidebar"
            onClick={() => setCollapsed(!collapsed)}
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            className="hidden lg:flex items-center justify-center w-7 h-7 rounded-lg text-neutral-400 hover:text-white hover:bg-white/[0.06] border border-transparent hover:border-white/[0.08] transition-all cursor-pointer"
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Navigation Links */}
        <div className="flex-1 px-3 py-4 space-y-1 overflow-y-auto custom-scrollbar">
          <div className="text-[10px] font-semibold tracking-wider uppercase text-neutral-400 px-3 mb-2">
            {!collapsed && 'Modules'}
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isHealthActive = ['healthWellness', 'health', 'fitness', 'gymAttendance', 'nutrition', 'food', 'medicines', 'medicine'].includes(activeView);
            const isActive = item.id === 'healthWellness' ? isHealthActive : activeView === item.id;
            
            return (
              <button
                key={item.id}
                id={`nav_btn_${item.id}`}
                onClick={() => handleNavClick(item.id)}
                title={collapsed ? item.label : undefined}
                className={`relative w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-colors group cursor-pointer ${
                  isActive ? 'text-white font-semibold' : 'text-neutral-400 hover:text-neutral-200'
                } ${collapsed ? 'justify-center px-0' : 'justify-between'}`}
              >
                {/* Smooth Animated Glider for Active Nav Item */}
                {isActive && (
                  <motion.div
                    layoutId="activeNavGlider"
                    className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-600/20 via-indigo-600/15 to-blue-500/10 border border-blue-500/30 shadow-[0_2px_12px_rgba(41,151,255,0.15)]"
                    transition={{ type: 'spring', stiffness: 450, damping: 35 }}
                  />
                )}

                <div className="relative z-10 flex items-center gap-3 min-w-0">
                  <Icon className={`w-4 h-4 shrink-0 transition-transform duration-200 group-hover:scale-110 ${
                    isActive ? 'text-[#2997ff]' : 'text-neutral-400 group-hover:text-neutral-300'
                  }`} />
                  {!collapsed && (
                    <span className="truncate tracking-tight">{item.label}</span>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Bottom Section (Readiness Indicator & Settings) */}
        <div className="p-3 border-t border-white/[0.06] space-y-2">
          {!collapsed && (
            <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/[0.06] shadow-inner">
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="font-medium text-neutral-300">Placement Readiness</span>
                <span className="font-mono font-bold text-emerald-400 tabular-nums">
                  {readinessScore}%
                </span>
              </div>
              <div className="w-full bg-neutral-800/80 h-1.5 rounded-full overflow-hidden p-0.5">
                <div 
                  className="bg-gradient-to-r from-blue-500 via-indigo-400 to-emerald-400 h-full rounded-full transition-all duration-700 shadow-[0_0_8px_rgba(52,211,153,0.5)]"
                  style={{ width: `${Math.min(100, Math.max(5, readinessScore))}%` }}
                />
              </div>
            </div>
          )}

          <button
            id="nav_btn_settings"
            onClick={() => handleNavClick('settings')}
            title={collapsed ? 'Settings' : undefined}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all ${
              activeView === 'settings'
                ? 'bg-white/[0.08] text-white border border-white/[0.12]'
                : 'text-neutral-400 hover:text-white hover:bg-white/[0.04]'
            } ${collapsed ? 'justify-center px-0' : ''}`}
          >
            <Settings className="w-4 h-4 text-neutral-400 shrink-0" />
            {!collapsed && <span className="tracking-tight">Settings</span>}
          </button>
        </div>
      </aside>
    </>
  );
};
