import React from 'react';
import { Currency } from '../types';
import { CURRENCY_RATES } from '../data/mockData';
import {
  Database,
  Moon,
  Sun,
  User,
  LogOut,
  Sparkles,
  DollarSign,
  ChevronDown,
  Keyboard
} from 'lucide-react';
import { AptusLogo } from './AptusLogo';

interface HeaderProps {
  currentCurrency: Currency;
  onCurrencyChange: (c: Currency) => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
  onOpenAiAssistant: () => void;
  onOpenDbSettings: () => void;
  onOpenShortcuts?: () => void;
  onLogout: () => void;
  activeDomainTitle: string;
  userAvatar?: string;
  userName?: string;
  userPosition?: string;
}

export const Header: React.FC<HeaderProps> = ({
  currentCurrency,
  onCurrencyChange,
  darkMode,
  onToggleDarkMode,
  onOpenAiAssistant,
  onOpenDbSettings,
  onOpenShortcuts,
  onLogout,
  activeDomainTitle,
  userAvatar = 'https://lh3.googleusercontent.com/d/18oO9ea3mBJBGQZYonKWxZ9VIxRZAIC8f',
  userName = 'آقای واحدی',
  userPosition = 'مدیر ارشد پروژه آپتوس'
}) => {
  const [currencyMenuOpen, setCurrencyMenuOpen] = React.useState(false);

  return (
    <header className="sticky top-0 z-30 bg-white/90 dark:bg-[#07162c]/90 backdrop-blur-xl border-b border-slate-200 dark:border-white/10 text-slate-900 dark:text-slate-100 px-4 lg:px-6 py-2.5 flex items-center justify-between shadow-sm dark:shadow-2xl transition-colors">
      {/* Right Side: Aptus Logo, Title & Active Domain Breadcrumb */}
      <div className="flex items-center gap-3">
        <AptusLogo size="md" />

        <div className="hidden sm:block border-r border-slate-200 dark:border-white/10 pr-3 mr-1">
          <div className="flex items-center gap-2">
            <h1 className="text-sm font-black text-[#032b75] dark:text-slate-100 tracking-tight">
              Aptus ERP
            </h1>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#f05a24]/15 text-[#f05a24] border border-[#f05a24]/30 font-extrabold">
              v2026.1 Enterprise
            </span>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-300 flex items-center gap-1.5 mt-0.5 font-medium">
            <span>سیستم مدیریت منابع شرکت ساختمانی آپتوس ایران</span>
            <span className="text-slate-400 dark:text-slate-500">•</span>
            <span className="text-[#0284c7] dark:text-[#38bdf8] font-bold">{activeDomainTitle}</span>
          </p>
        </div>
      </div>

      {/* Left Side: Actions, Currency Switcher, AI Assistant, User Profile */}
      <div className="flex items-center gap-2 lg:gap-3">
        {/* Keyboard Shortcuts Trigger */}
        {onOpenShortcuts && (
          <button
            type="button"
            onClick={onOpenShortcuts}
            className="p-2 rounded-xl bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 transition-all text-xs flex items-center gap-1.5"
            title="راهنمای کلیدهای میانبر سازمانی (Shift + ?)"
          >
            <Keyboard className="w-4 h-4 text-[#0284c7] dark:text-[#38bdf8]" />
            <span className="hidden lg:inline font-bold">کلیدهای میانبر</span>
          </button>
        )}

        {/* Gemini AI Assistant Button */}
        <button
          type="button"
          onClick={onOpenAiAssistant}
          className="relative group px-3.5 py-1.5 rounded-xl bg-[#f05a24] hover:bg-[#ea580c] text-white text-xs font-bold flex items-center gap-2 transition-all shadow-md shadow-orange-500/20 active:scale-95"
          title="ارتباط با دستیار هوشمند شرکت آپتوس"
        >
          <Sparkles className="w-4 h-4 text-white animate-pulse" />
          <span className="hidden sm:inline">دستیار هوش مصنوعی</span>
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
          </span>
        </button>

        {/* Currency Selector */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setCurrencyMenuOpen(!currencyMenuOpen)}
            className="px-2.5 py-1.5 rounded-xl bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 border border-slate-200 dark:border-white/10 text-xs text-slate-800 dark:text-slate-200 flex items-center gap-1.5 transition-all font-semibold"
          >
            <DollarSign className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>{CURRENCY_RATES[currentCurrency].name}</span>
            <ChevronDown className="w-3 h-3 text-slate-500 dark:text-slate-400" />
          </button>

          {currencyMenuOpen && (
            <div className="absolute left-0 mt-2 w-44 rounded-2xl bg-white dark:bg-[#07162c] backdrop-blur-2xl border border-slate-200 dark:border-white/15 shadow-2xl py-1.5 z-50 text-xs">
              <div className="px-3 py-1.5 text-[11px] text-slate-500 dark:text-slate-400 font-semibold border-b border-slate-100 dark:border-white/10">
                انتخاب ارز پایه گزارشات
              </div>
              {Object.values(CURRENCY_RATES).map((curr) => (
                <button
                  key={curr.code}
                  type="button"
                  onClick={() => {
                    onCurrencyChange(curr.code);
                    setCurrencyMenuOpen(false);
                  }}
                  className={`w-full text-right px-3 py-2 flex items-center justify-between hover:bg-slate-100 dark:hover:bg-white/10 transition-colors ${
                    currentCurrency === curr.code ? 'text-[#f05a24] font-bold bg-[#f05a24]/10 dark:bg-[#f05a24]/20' : 'text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <span>{curr.name}</span>
                  <span className="font-mono text-slate-500 dark:text-slate-400">{curr.symbol}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Reference DB Indicator */}
        <button
          type="button"
          onClick={onOpenDbSettings}
          className="px-2.5 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-500/15 hover:bg-emerald-100 dark:hover:bg-emerald-500/25 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-500/30 text-xs flex items-center gap-1.5 transition-all font-semibold shadow-sm"
          title="وضعیت اتصال به دیتابیس مرجع SQL Server آپتوس (172.20.3.6 / ITDevServer)"
        >
          <Database className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
          <span className="hidden md:inline font-mono font-bold dir-ltr text-[11px]">172.20.3.6 / ITDevServer</span>
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
          </span>
        </button>

        {/* Theme Toggle */}
        <button
          type="button"
          onClick={onToggleDarkMode}
          className="p-2 rounded-xl bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 transition-all"
          title="تغییر حالت تاریک / روشن"
        >
          {!darkMode ? <Moon className="w-4 h-4 text-[#032b75]" /> : <Sun className="w-4 h-4 text-[#f05a24]" />}
        </button>

        {/* User Badge */}
        <div className="flex items-center gap-2.5 pr-2 border-r border-slate-200 dark:border-white/10 mr-1">
          <div className="w-9 h-9 rounded-full bg-slate-100 dark:bg-white/5 border-2 border-[#f05a24]/40 flex items-center justify-center text-[#f05a24] font-semibold text-xs shadow-md overflow-hidden shrink-0 relative group">
            {userAvatar ? (
              <img
                src={userAvatar}
                alt={userName}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).style.display = 'none';
                }}
              />
            ) : (
              <User className="w-4 h-4 text-[#f05a24]" />
            )}
          </div>
          <div className="hidden xl:block text-right">
            <div className="text-xs font-extrabold text-slate-900 dark:text-slate-200">{userName}</div>
            <div className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold">{userPosition}</div>
          </div>
          <button
            type="button"
            onClick={onLogout}
            className="p-1.5 rounded-xl hover:bg-rose-50 dark:hover:bg-rose-500/20 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 transition-all border border-transparent hover:border-rose-200 dark:hover:border-rose-500/30"
            title="خروج از حساب"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
