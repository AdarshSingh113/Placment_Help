import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, 
  Plus, 
  Bell, 
  Flame, 
  Menu, 
  Cloud, 
  Check, 
  LogIn, 
  LogOut, 
  Calendar,
  RefreshCw,
  ShieldCheck,
  X,
  ChevronRight
} from 'lucide-react';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { DynamicIslandHud } from './DynamicIslandHud';
import { BrandLogo } from './BrandLogo';

interface HeaderProps {
  onOpenMobileMenu?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenMobileMenu = () => {} }) => {
  const { 
    activeView,
    setActiveView,
    setIsSearchOpen, 
    openQuickAdd, 
    streakDays, 
    companies, 
    weakAreas,
    setSelectedCompanyId,
    syncStatus,
    lastSyncedAt,
    forceSyncCloud
  } = useData();
  const { currentUser, signIn, logout } = useAuth();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showCloudMenu, setShowCloudMenu] = useState(false);
  const [isManualSyncing, setIsManualSyncing] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const handleManualSync = async () => {
    setIsManualSyncing(true);
    await forceSyncCloud();
    setTimeout(() => setIsManualSyncing(false), 800);
  };

  const navLinks = [
    { id: 'dashboard', label: 'Store' },
    { id: 'placement', label: 'Placement' },
    { id: 'interviewPrep', label: 'Questions' },
    { id: 'knowledgeBase', label: 'AI Vault' },
    { id: 'guesstimateLab', label: 'Guesstimates' },
    { id: 'gdCurrentAffairs', label: 'GD & News' },
    { id: 'dailyGrowth', label: 'Growth' },
    { id: 'healthWellness', label: 'Health' },
    { id: 'mistakeBank', label: 'Mistakes' },
  ];

  // Upcoming interviews reminders
  const upcomingInterviews = (companies || []).filter(c => c.interviewDate && c.status === 'Interview Scheduled');

  return (
    <div className="sticky top-0 z-40 w-full select-none">
      {/* Apple Global Navigation Bar (48px) */}
      <nav 
        id="apple_global_nav" 
        className="h-12 bg-[#161617]/92 text-[#d2d2d7] backdrop-blur-xl border-b border-white/[0.08] flex items-center justify-between px-4 sm:px-8 max-w-full text-xs font-normal"
      >
        <div className="max-w-6xl mx-auto w-full flex items-center justify-between">
          {/* Brand Logo */}
          <motion.button
            whileHover={{ scale: 1.12, transition: { type: 'spring', stiffness: 400, damping: 20 } }}
            whileTap={{ scale: 0.92 }}
            onClick={() => setActiveView('dashboard')}
            className="flex items-center text-white hover:text-white transition-opacity cursor-pointer p-1"
            title="Placement OS Home"
          >
            {/* Custom Executive Brand Emblem Logo */}
            <BrandLogo size={20} />
          </motion.button>

          {/* Desktop Navigation Links with animated glider */}
          <div className="hidden md:flex items-center gap-1 lg:gap-2 relative">
            {navLinks.map((link) => {
              const isActive = activeView === link.id || 
                (link.id === 'healthWellness' && ['health', 'fitness', 'gymAttendance', 'nutrition', 'food', 'medicines'].includes(activeView));
              const isThirdButton = link.id === 'interviewPrep';
              return (
                <button
                  key={link.id}
                  onClick={() => setActiveView(link.id)}
                  className={`relative text-xs px-2.5 py-1 rounded-full transition-colors cursor-pointer ${
                    isActive ? 'text-white font-medium' : 'text-[#d2d2d7] hover:text-white'
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="appleNavGlider"
                      transition={{ type: 'spring', stiffness: 450, damping: 32 }}
                      className="absolute inset-0 rounded-full bg-white/10 border border-white/15"
                    />
                  )}
                  <span 
                    className="relative z-10"
                    style={isThirdButton ? { textAlign: 'right', fontSize: '13px' } : undefined}
                  >
                    {link.label}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Right Action Icons */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Apple Dynamic Island Live Activity Pill */}
            <div className="hidden sm:block">
              <DynamicIslandHud />
            </div>

            {/* Spotlight Search Icon */}
            <motion.button
              whileHover={{ scale: 1.15, transition: { type: 'spring', stiffness: 400, damping: 20 } }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsSearchOpen(true)}
              className="text-[#d2d2d7] hover:text-white transition-colors cursor-pointer p-1.5 rounded-lg hover:bg-white/5"
              title="Search (⌘K)"
            >
              <Search className="w-3.5 h-3.5" />
            </motion.button>

            {/* Quick Add Button */}
            <motion.button
              whileHover={{ scale: 1.15, transition: { type: 'spring', stiffness: 400, damping: 20 } }}
              whileTap={{ scale: 0.9 }}
              onClick={() => openQuickAdd()}
              className="text-[#d2d2d7] hover:text-white transition-colors cursor-pointer p-1.5 rounded-lg hover:bg-white/5"
              title="Quick Add"
            >
              <Plus className="w-3.5 h-3.5" />
            </motion.button>

            {/* Cloud Auto-Save Pill */}
            <div className="relative">
              <motion.button
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowCloudMenu(!showCloudMenu)}
                className="flex items-center gap-1.5 text-xs text-[#d2d2d7] hover:text-white transition-colors cursor-pointer p-1.5 rounded-lg hover:bg-white/5"
                title="Instant Cloud Auto-Save Status"
              >
                {syncStatus === 'saving' || isManualSyncing ? (
                  <RefreshCw className="w-3.5 h-3.5 text-[#2997ff] animate-spin" />
                ) : syncStatus === 'synced' ? (
                  <span className="flex items-center gap-1 text-emerald-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <Cloud className="w-3.5 h-3.5" />
                  </span>
                ) : (
                  <Cloud className="w-3.5 h-3.5 text-amber-400" />
                )}
              </motion.button>

              {/* Cloud Hub Popover */}
              <AnimatePresence>
                {showCloudMenu && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95, y: -4 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -4 }}
                    transition={{ duration: 0.16 }}
                    className="absolute right-0 top-full mt-2 w-80 p-4 rounded-2xl bg-[#1d1d1f] text-white shadow-2xl border border-white/10 z-50"
                  >
                    <div className="flex items-center justify-between pb-2.5 border-b border-white/10 text-xs font-semibold">
                      <div className="flex items-center gap-2">
                        <Cloud className="w-4 h-4 text-emerald-400" />
                        <span>Instant Cloud Auto-Save</span>
                      </div>
                      <span className="text-[10px] font-mono text-emerald-400">Online</span>
                    </div>

                    <div className="py-3 space-y-2 text-xs text-neutral-300">
                      <p className="text-[11px] text-neutral-400 leading-relaxed">
                        Every single change across questions, companies, gym logs and meals is instantly saved to cloud storage.
                      </p>
                      <div className="p-2.5 rounded-xl bg-black/40 border border-white/5 space-y-1 text-[11px] font-mono">
                        <div className="flex justify-between">
                          <span className="text-neutral-400">Synced:</span>
                          <span className="text-white">{lastSyncedAt || 'Just now'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-neutral-400">Database:</span>
                          <span className="text-blue-400 truncate max-w-[140px]">ai-studio-placementos</span>
                        </div>
                      </div>
                    </div>

                    {!currentUser && (
                      <button
                        onClick={async () => {
                          try {
                            await signIn();
                            setShowCloudMenu(false);
                          } catch (e) {
                            console.error(e);
                          }
                        }}
                        className="w-full mb-2 py-1.5 px-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs transition-colors"
                      >
                        Sign in with Google
                      </button>
                    )}

                    <button
                      onClick={async () => {
                        await handleManualSync();
                        setShowCloudMenu(false);
                      }}
                      disabled={isManualSyncing}
                      className="w-full py-1.5 px-3 rounded-xl bg-white/10 hover:bg-white/15 text-white font-medium text-xs flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <RefreshCw className={`w-3 h-3 ${isManualSyncing ? 'animate-spin' : ''}`} />
                      Sync Everything Now
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Notifications Bell */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative text-[#d2d2d7] hover:text-white transition-colors cursor-pointer p-1"
                title="Notifications"
              >
                <Bell className="w-3.5 h-3.5" />
                {(upcomingInterviews.length > 0 || weakAreas.length > 0) && (
                  <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-[#2997ff]" />
                )}
              </button>

              {/* Notifications Popover */}
              <AnimatePresence>
                {showNotifications && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95, y: -4 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -4 }}
                    transition={{ duration: 0.16 }}
                    className="absolute right-0 top-full mt-2 w-80 p-4 rounded-2xl bg-[#1d1d1f] text-white shadow-2xl border border-white/10 z-50 text-xs"
                  >
                    <div className="font-semibold pb-2 border-b border-white/10 flex items-center justify-between">
                      <span>Alerts & Reminders</span>
                      <span className="text-[10px] text-neutral-400 font-mono">Live</span>
                    </div>
                    <div className="py-2 space-y-2 max-h-60 overflow-y-auto custom-scrollbar">
                      {upcomingInterviews.length === 0 && (
                        <div className="text-center py-4 text-neutral-400 text-xs">
                          No urgent interviews scheduled.
                        </div>
                      )}
                      {upcomingInterviews.map((c) => (
                        <div key={c.id} className="p-2.5 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
                          <div>
                            <div className="font-bold text-white">{c.name}</div>
                            <div className="text-[11px] text-neutral-400">{c.interviewDate}</div>
                          </div>
                          <button
                            onClick={() => {
                              setSelectedCompanyId(c.id);
                              setActiveView('placement');
                              setShowNotifications(false);
                            }}
                            className="text-xs text-blue-400 hover:underline font-semibold"
                          >
                            Prepare →
                          </button>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Profile Avatar / Login */}
            {currentUser ? (
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="w-5 h-5 rounded-full overflow-hidden border border-white/20 cursor-pointer"
                title={currentUser.displayName || currentUser.email || 'User'}
              >
                {currentUser.photoURL ? (
                  <img src={currentUser.photoURL} alt="User" referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-blue-600 text-white flex items-center justify-center text-[10px] font-bold">
                    {currentUser.email?.[0].toUpperCase() || 'U'}
                  </div>
                )}
              </button>
            ) : (
              <button
                onClick={signIn}
                className="text-xs text-[#2997ff] hover:text-white transition-colors cursor-pointer"
              >
                Sign In
              </button>
            )}

            {/* Mobile Hamburger Menu Toggle */}
            <button
              onClick={() => setMobileNavOpen(!mobileNavOpen)}
              className="text-[#d2d2d7] hover:text-white md:hidden cursor-pointer p-1"
            >
              {mobileNavOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {mobileNavOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-[#161617] border-b border-white/10 px-6 py-4 space-y-2 text-sm text-neutral-200"
          >
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => {
                  setActiveView(link.id);
                  setMobileNavOpen(false);
                }}
                className="w-full text-left py-2 border-b border-white/5 hover:text-white"
              >
                {link.label}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Apple Ribbon Announcement Banner (like in the screenshot) */}
      <div className="apple-ribbon py-2 px-4 text-center text-xs border-b border-black/[0.06] bg-white text-[#1d1d1f]">
        <div className="max-w-6xl mx-auto flex items-center justify-center gap-2">
          <span>
            Instant Cloud Auto-Save Active · Every change automatically persisted in cloud · Last synced: {lastSyncedAt || 'Just now'}
          </span>
          <button
            onClick={() => setShowCloudMenu(true)}
            className="text-[#0071e3] hover:underline font-medium inline-flex items-center gap-0.5 cursor-pointer"
          >
            <span>Cloud Hub</span>
            <ChevronRight className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
};
