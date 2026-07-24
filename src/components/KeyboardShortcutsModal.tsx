import React from 'react';
import { Keyboard, X, Command, Cpu, FileSpreadsheet, FileText, Bot, Home, CheckCircle2 } from 'lucide-react';

interface KeyboardShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const KeyboardShortcutsModal: React.FC<KeyboardShortcutsModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const shortcuts = [
    { key: 'Alt + D  /  Alt + 1', action: 'انتقال به داشبورد شخصی مدیریت', icon: Home },
    { key: 'Alt + F  /  Alt + 2', action: 'انتقال به سیستم مالی و حسابداری', icon: Command },
    { key: 'Alt + H  /  Alt + 3', action: 'انتقال به منابع و سرمایه انسانی (HCM)', icon: Command },
    { key: 'Alt + M  /  Alt + 4', action: 'انتقال به مدیریت تولید بتن و قطعات پیش‌ساخته APS', icon: Command },
    { key: 'Alt + C  /  Alt + 5', action: 'انتقال به بازرگانی و فروشگاه آنلاین', icon: Command },
    { key: 'Alt + O  /  Alt + 6', action: 'انتقال به اتوماسیون اداری', icon: Command },
    { key: 'Alt + B  /  Alt + 7', action: 'انتقال به هوش تجاری و مدیریت فرآیندها (BI/BPMS)', icon: Command },
    { key: 'Alt + R  /  Alt + 8', action: 'انتقال به مرکز گزارش‌ساز پویا', icon: Command },
    { key: 'Alt + S  /  Shift + A', action: 'فراخوانی دستیار هوش مصنوعی آپتوس (Gemini AI)', icon: Bot },
    { key: 'Alt + X', action: 'خروجی اکسل پیش‌فرض از داده‌های فعال', icon: FileSpreadsheet },
    { key: 'Alt + P', action: 'چاپ و خروجی PDF رسمی سازمانی', icon: FileText },
    { key: 'Shift + ?  /  F1', action: 'نمایش همین پنجره کلیدهای میانبر', icon: Keyboard },
    { key: 'Esc', action: 'بستن پنجره‌های باز و مودال‌ها', icon: X },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 dir-rtl font-sans animate-in fade-in duration-200">
      <div className="bg-white dark:bg-[#07162c] border border-slate-200 dark:border-white/15 w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-[#032b75] via-[#021124] to-[#032b75] p-5 text-white flex items-center justify-between border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-[#f05a24]/20 border border-[#f05a24]/40 text-[#f05a24]">
              <Keyboard className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-extrabold text-base sm:text-lg flex items-center gap-2">
                <span>کلیدهای میانبر سازمانی (Keyboard Shortcuts)</span>
              </h3>
              <p className="text-xs text-slate-300 mt-0.5">
                سامانه هوشمند آپتوس ایران - جهت تسریع در ناوبری و ثبت داده‌های سیستم
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-200 hover:text-white transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto space-y-3 divide-y divide-slate-100 dark:divide-white/5">
          {shortcuts.map((sc, idx) => {
            const Icon = sc.icon;
            return (
              <div key={idx} className="pt-3 first:pt-0 flex items-center justify-between gap-4 text-xs">
                <div className="flex items-center gap-2.5 text-slate-700 dark:text-slate-200 font-bold">
                  <Icon className="w-4 h-4 text-[#f05a24] shrink-0" />
                  <span>{sc.action}</span>
                </div>
                <div className="shrink-0 px-3 py-1 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-white/10 font-mono text-[11px] font-black text-[#0284c7] dark:text-[#38bdf8] shadow-sm dir-ltr">
                  {sc.key}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 dark:bg-[#031d3d] border-t border-slate-200 dark:border-white/10 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            <span>میانبرها در کلیه بخش‌های سیستم فعال می‌باشند.</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-[#032b75] hover:bg-[#0284c7] text-white font-extrabold transition-all shadow-md active:scale-95"
          >
            متوجه شدم
          </button>
        </div>
      </div>
    </div>
  );
};
