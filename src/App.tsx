import React, { useState, useEffect } from 'react';
import { Currency, SubSystem } from './types';
import { ALL_SUBSYSTEMS } from './data/subsystems';
import { LandingLogin } from './components/LandingLogin';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { GeminiAiChatModal } from './components/GeminiAiChatModal';
import { FloatingAiAssistant } from './components/FloatingAiAssistant';
import { KeyboardShortcutsModal } from './components/KeyboardShortcutsModal';
import { PersonalDashboardView } from './components/views/PersonalDashboardView';
import { FinancialView } from './components/views/FinancialView';
import { HcmView } from './components/views/HcmView';
import { MrpView } from './components/views/MrpView';
import { CommerceView } from './components/views/CommerceView';
import { OfficeView } from './components/views/OfficeView';
import { BiBpmsView } from './components/views/BiBpmsView';
import { ReportsView } from './components/views/ReportsView';
import { DbSettingsView } from './components/views/DbSettingsView';
import { BaseInfoUserMgmtView } from './components/views/BaseInfoUserMgmtView';
import { Home } from 'lucide-react';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentCurrency, setCurrentCurrency] = useState<Currency>('IRR');
  const [darkMode, setDarkMode] = useState(false);
  const [activeSubsystem, setActiveSubsystem] = useState<SubSystem>(ALL_SUBSYSTEMS[0]);
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [isShortcutsModalOpen, setIsShortcutsModalOpen] = useState(false);

  // Active Admin User Avatar State
  const DEFAULT_ADMIN_AVATAR = 'https://lh3.googleusercontent.com/d/18oO9ea3mBJBGQZYonKWxZ9VIxRZAIC8f';
  const [currentUserAvatar, setCurrentUserAvatar] = useState<string>(() => {
    try {
      return localStorage.getItem('aptus_user_avatar') || DEFAULT_ADMIN_AVATAR;
    } catch {
      return DEFAULT_ADMIN_AVATAR;
    }
  });

  const handleUpdateUserAvatar = (newAvatar: string) => {
    setCurrentUserAvatar(newAvatar);
    try {
      localStorage.setItem('aptus_user_avatar', newAvatar);
    } catch {
      // Ignore if localStorage is blocked
    }
  };

  // Global Keyboard Shortcuts Listener
  useEffect(() => {
    if (!isLoggedIn) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if typing in an input/textarea
      const target = e.target as HTMLElement;
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(target?.tagName)) {
        if (e.key === 'Escape') {
          target.blur();
        }
        return;
      }

      if (e.key === 'F1' || (e.shiftKey && e.key === '?')) {
        e.preventDefault();
        setIsShortcutsModalOpen((prev) => !prev);
        return;
      }

      if (e.key === 'Escape') {
        setIsShortcutsModalOpen(false);
        setIsAiModalOpen(false);
        return;
      }

      if (e.altKey) {
        const key = e.key.toLowerCase();
        if (key === 'd' || key === '1') {
          e.preventDefault();
          setActiveSubsystem(ALL_SUBSYSTEMS[0]);
        } else if (key === 'f' || key === '2') {
          e.preventDefault();
          const sub = ALL_SUBSYSTEMS.find((s) => s.id === 'FINANCIAL_ACCOUNTING');
          if (sub) setActiveSubsystem(sub);
        } else if (key === 'h' || key === '3') {
          e.preventDefault();
          const sub = ALL_SUBSYSTEMS.find((s) => s.id === 'HCM_PAYROLL');
          if (sub) setActiveSubsystem(sub);
        } else if (key === 'm' || key === '4') {
          e.preventDefault();
          const sub = ALL_SUBSYSTEMS.find((s) => s.id === 'MRP_CONCRETE_PRECAST');
          if (sub) setActiveSubsystem(sub);
        } else if (key === 'c' || key === '5') {
          e.preventDefault();
          const sub = ALL_SUBSYSTEMS.find((s) => s.id === 'COMMERCE_SALES');
          if (sub) setActiveSubsystem(sub);
        } else if (key === 'o' || key === '6') {
          e.preventDefault();
          const sub = ALL_SUBSYSTEMS.find((s) => s.id === 'OFFICE_AUTOMATION');
          if (sub) setActiveSubsystem(sub);
        } else if (key === 'b' || key === '7') {
          e.preventDefault();
          const sub = ALL_SUBSYSTEMS.find((s) => s.id === 'BI_DASHBOARDS');
          if (sub) setActiveSubsystem(sub);
        } else if (key === 'r' || key === '8') {
          e.preventDefault();
          const sub = ALL_SUBSYSTEMS.find((s) => s.id === 'BI_DYNAMIC_REPORTS');
          if (sub) setActiveSubsystem(sub);
        } else if (key === 'g' || key === '9') {
          e.preventDefault();
          const sub = ALL_SUBSYSTEMS.find((s) => s.id === 'BASE_INFO_USER_MGMT');
          if (sub) setActiveSubsystem(sub);
        } else if (key === 's') {
          e.preventDefault();
          setIsAiModalOpen(true);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isLoggedIn]);

  if (!isLoggedIn) {
    return <LandingLogin onLoginSuccess={() => setIsLoggedIn(true)} />;
  }

  const handleReturnToDashboard = () => {
    setActiveSubsystem(ALL_SUBSYSTEMS[0]);
  };

  const renderActiveDomainView = () => {
    switch (activeSubsystem.domain) {
      case 'DASHBOARD':
        return (
          <PersonalDashboardView
            onSelectSubsystem={(sub) => setActiveSubsystem(sub)}
            onReturnToDashboard={handleReturnToDashboard}
            currentUserAvatar={currentUserAvatar}
          />
        );
      case 'BASE_INFO':
        return (
          <BaseInfoUserMgmtView
            activeSubsystemId={activeSubsystem.id}
            currentUserAvatar={currentUserAvatar}
            onUpdateUserAvatar={handleUpdateUserAvatar}
          />
        );
      case 'FINANCE':
        return <FinancialView currentCurrency={currentCurrency} activeSubsystemId={activeSubsystem.id} />;
      case 'HCM':
        return <HcmView activeSubsystemId={activeSubsystem.id} />;
      case 'MRP':
        return <MrpView activeSubsystemId={activeSubsystem.id} />;
      case 'COMMERCE':
        return <CommerceView activeSubsystemId={activeSubsystem.id} />;
      case 'OFFICE':
        return <OfficeView activeSubsystemId={activeSubsystem.id} />;
      case 'BI_BPMS':
        if (activeSubsystem.id === 'BI_DYNAMIC_REPORTS') {
          return <ReportsView />;
        }
        return <BiBpmsView activeSubsystemId={activeSubsystem.id} />;
      case 'SETTINGS_DB':
        return <DbSettingsView />;
      default:
        return (
          <PersonalDashboardView
            onSelectSubsystem={(sub) => setActiveSubsystem(sub)}
            onReturnToDashboard={handleReturnToDashboard}
            currentUserAvatar={currentUserAvatar}
          />
        );
    }
  };

  return (
    <div className={`h-screen ${darkMode ? 'dark bg-[#040e1a] text-slate-100' : 'bg-[#f8fafc] text-slate-900'} font-sans flex flex-col dir-rtl relative overflow-hidden transition-colors`}>
      {/* Frosted Ambient Background Accents */}
      <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-[#032b75]/10 dark:bg-[#032b75]/30 rounded-full blur-[130px] pointer-events-none z-0" />
      <div className="absolute bottom-[-10%] left-[-5%] w-[600px] h-[600px] bg-[#f05a24]/10 dark:bg-[#f05a24]/15 rounded-full blur-[130px] pointer-events-none z-0" />
      <div className="absolute top-[40%] left-[30%] w-[500px] h-[500px] bg-[#0284c7]/10 dark:bg-[#0284c7]/15 rounded-full blur-[140px] pointer-events-none z-0" />

      {/* Header */}
      <Header
        currentCurrency={currentCurrency}
        onCurrencyChange={(c) => setCurrentCurrency(c)}
        darkMode={darkMode}
        onToggleDarkMode={() => setDarkMode(!darkMode)}
        onOpenAiAssistant={() => setIsAiModalOpen(true)}
        onOpenDbSettings={() => {
          const dbSub = ALL_SUBSYSTEMS.find((s) => s.id === 'SETTINGS_DB');
          if (dbSub) setActiveSubsystem(dbSub);
        }}
        onOpenShortcuts={() => setIsShortcutsModalOpen(true)}
        onLogout={() => setIsLoggedIn(false)}
        activeDomainTitle={activeSubsystem.title}
        userAvatar={currentUserAvatar}
        userName="آقای واحدی"
        userPosition="مدیر ارشد پروژه آپتوس"
      />

      {/* Main Container with Tree Sidebar & Content */}
      <div className="flex flex-1 overflow-hidden relative z-10">
        {/* Hierarchical Accordion Sidebar */}
        <Sidebar
          activeSubsystemId={activeSubsystem.id}
          onSelectSubsystem={(sub) => setActiveSubsystem(sub)}
        />

        {/* View Viewport Workspace */}
        <main className="flex-1 overflow-y-auto bg-slate-100/70 dark:bg-[#040e1a]/50 text-slate-900 dark:text-slate-100 flex flex-col transition-colors">
          {/* Universal Return to Dashboard Quick Navigation Banner across all non-dashboard views */}
          {activeSubsystem.domain !== 'DASHBOARD' && (
            <div className="bg-white/90 dark:bg-[#07162c]/90 border-b border-slate-200 dark:border-white/10 px-4 py-2.5 flex items-center justify-between backdrop-blur-xl shrink-0 z-20 shadow-sm">
              <div className="flex items-center gap-2 text-xs">
                <span className="text-slate-500 dark:text-slate-400 font-medium">موقعیت فعلی:</span>
                <span className="font-extrabold text-[#f05a24]">{activeSubsystem.title}</span>
              </div>
              <button
                type="button"
                onClick={handleReturnToDashboard}
                className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-[#f05a24] to-[#ea580c] hover:from-[#ea580c] hover:to-[#d97706] text-white text-xs font-black flex items-center gap-1.5 transition-all shadow-md active:scale-95"
              >
                <Home className="w-4 h-4 text-white" />
                <span>بازگشت به داشبورد اصلی</span>
              </button>
            </div>
          )}

          <div className="flex-1">
            {renderActiveDomainView()}
          </div>
        </main>
      </div>

      {/* Floating Circular AI Assistant Button in Bottom-Left Corner */}
      <FloatingAiAssistant activeSubsystemTitle={activeSubsystem.title} />

      {/* Persistent Gemini AI Assistant Drawer */}
      <GeminiAiChatModal
        isOpen={isAiModalOpen}
        onClose={() => setIsAiModalOpen(false)}
        activeSubsystemTitle={activeSubsystem.title}
      />

      {/* Keyboard Shortcuts Modal Guide */}
      <KeyboardShortcutsModal
        isOpen={isShortcutsModalOpen}
        onClose={() => setIsShortcutsModalOpen(false)}
      />
    </div>
  );
}

