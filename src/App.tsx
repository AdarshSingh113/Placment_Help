import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AuthProvider } from './context/AuthContext';
import { DataProvider, useData } from './context/DataContext';
import { Header } from './components/Header';
import { GlobalSearchModal } from './components/GlobalSearchModal';
import { QuickAddModal } from './components/QuickAddModal';
import { Toast } from './components/Toast';

// Views
import { DashboardView } from './views/DashboardView';
import { PlacementView } from './views/PlacementView';
import { InterviewPrepView } from './views/InterviewPrepView';
import { KnowledgeBaseView } from './views/KnowledgeBaseView';
import { GuesstimateLabView } from './views/GuesstimateLabView';
import { GDCurrectAffairsView } from './views/GDCurrectAffairsView';
import { DailyGrowthView } from './views/DailyGrowthView';
import { HealthWellnessView } from './views/HealthWellnessView';
import { MistakeBankView } from './views/MistakeBankView';

const MainContent: React.FC = () => {
  const { activeView } = useData();

  const renderActiveView = () => {
    switch (activeView) {
      case 'dashboard':
        return <DashboardView />;
      case 'placement':
        return <PlacementView />;
      case 'interviewPrep':
        return <InterviewPrepView />;
      case 'knowledgeBase':
      case 'knowledgeVault':
        return <KnowledgeBaseView />;
      case 'guesstimates':
      case 'guesstimateLab':
        return <GuesstimateLabView />;
      case 'gdTopics':
      case 'gdCurrentAffairs':
        return <GDCurrectAffairsView />;
      case 'dailyGrowth':
        return <DailyGrowthView />;
      case 'health':
      case 'fitness':
      case 'healthWellness':
      case 'gymAttendance':
      case 'nutrition':
      case 'food':
      case 'medicines':
      case 'medicine':
        return <HealthWellnessView />;
      case 'mistakes':
      case 'mistakeBank':
        return <MistakeBankView />;
      default:
        return <DashboardView />;
    }
  };

  return (
    <div className="relative min-h-screen w-full bg-white text-[#1d1d1f] flex flex-col overflow-x-hidden">
      {/* Apple Global Top Taskbar & Announcement Ribbon */}
      <Header />

      {/* Main Content Area - Full width Apple Store Layout */}
      <main className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 md:px-8 py-8 md:py-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeView}
            initial={{ opacity: 0, y: 14, filter: 'blur(4px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: -10, filter: 'blur(3px)' }}
            transition={{ duration: 0.26, ease: [0.16, 1, 0.3, 1] }}
          >
            {renderActiveView()}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Global Modals & Overlays */}
      <GlobalSearchModal />
      <QuickAddModal />
      <Toast />
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <MainContent />
      </DataProvider>
    </AuthProvider>
  );
}
