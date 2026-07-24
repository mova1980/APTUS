import React, { useState } from 'react';
import { MainDomain, SubSystem } from '../types';
import { ALL_SUBSYSTEMS } from '../data/subsystems';
import {
  LayoutDashboard,
  BookOpen,
  PieChart,
  DollarSign,
  Archive,
  Building,
  CreditCard,
  ShoppingCart,
  TrendingUp,
  Calculator,
  Scale,
  Users,
  UserPlus,
  Heart,
  FileText,
  Award,
  Coffee,
  Clock,
  Layout,
  Lightbulb,
  GraduationCap,
  ShieldAlert,
  Calendar,
  Network,
  Briefcase,
  Cpu,
  Workflow,
  CheckCircle,
  ShieldCheck,
  FlaskConical,
  ShoppingBag,
  Globe,
  Truck,
  UserCheck,
  Tag,
  Mail,
  PhoneCall,
  ScanText,
  MessageSquare,
  UsersRound,
  Inbox,
  BarChart3,
  GitMerge,
  Sparkles,
  Database,
  Search,
  ChevronDown,
  ChevronLeft,
  Layers,
  Shield
} from 'lucide-react';

interface SidebarProps {
  activeSubsystemId: string;
  onSelectSubsystem: (subSystem: SubSystem) => void;
}

const DOMAIN_GROUPS: { domain: MainDomain; title: string; icon: any; color: string }[] = [
  { domain: 'DASHBOARD', title: 'داشبورد شخصی و مدیریتی آپتوس', icon: LayoutDashboard, color: 'from-[#f05a24] via-[#ea580c] to-[#0284c7]' },
  { domain: 'FINANCE', title: 'مالی و حسابداری آپتوس', icon: DollarSign, color: 'from-[#f05a24] to-[#ea580c]' },
  { domain: 'HCM', title: 'منابع و سرمایه انسانی', icon: Users, color: 'from-[#0284c7] to-cyan-500' },
  { domain: 'MRP', title: 'تولید بتن و قطعات پیش‌ساخته (APS)', icon: Cpu, color: 'from-emerald-500 to-teal-500' },
  { domain: 'COMMERCE', title: 'بازرگانی، فروشگاه آنلاین & باسکول', icon: Truck, color: 'from-purple-500 to-indigo-500' },
  { domain: 'OFFICE', title: 'اتوماسیون اداری', icon: Mail, color: 'from-rose-500 to-pink-500' },
  { domain: 'BI_BPMS', title: 'سیستم‌های مشترک و هوش تجاری', icon: Sparkles, color: 'from-violet-500 to-fuchsia-500' },
  { domain: 'BASE_INFO', title: 'اطلاعات پایه', icon: Shield, color: 'from-[#032b75] to-[#0284c7]' },
  { domain: 'SETTINGS_DB', title: 'تنظیمات دیتابیس', icon: Database, color: 'from-slate-400 to-slate-600' }
];

const ICON_MAP: Record<string, any> = {
  LayoutDashboard,
  BookOpen,
  PieChart,
  DollarSign,
  Archive,
  Building,
  CreditCard,
  ShoppingCart,
  TrendingUp,
  Calculator,
  Scale,
  Users,
  UserPlus,
  Heart,
  FileText,
  Award,
  Coffee,
  Clock,
  Layout,
  Lightbulb,
  GraduationCap,
  ShieldAlert,
  Calendar,
  Network,
  Briefcase,
  Cpu,
  Workflow,
  CheckCircle,
  ShieldCheck,
  FlaskConical,
  ShoppingBag,
  Globe,
  Truck,
  UserCheck,
  Tag,
  Mail,
  PhoneCall,
  ScanText,
  MessageSquare,
  UsersRound,
  Inbox,
  BarChart3,
  GitMerge,
  Sparkles,
  Database
};

export const Sidebar: React.FC<SidebarProps> = ({
  activeSubsystemId,
  onSelectSubsystem
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedDomains, setExpandedDomains] = useState<Record<string, boolean>>({
    DASHBOARD: true,
    BASE_INFO: false,
    FINANCE: false,
    HCM: false,
    MRP: false,
    COMMERCE: false,
    OFFICE: false,
    BI_BPMS: false,
    SETTINGS_DB: false
  });

  const toggleDomain = (domain: string) => {
    setExpandedDomains((prev) => ({
      ...prev,
      [domain]: !prev[domain]
    }));
  };

  const filteredSubsystems = ALL_SUBSYSTEMS.filter(
    (sub) =>
      sub.title.includes(searchTerm) ||
      sub.description.includes(searchTerm) ||
      sub.id.includes(searchTerm)
  );

  return (
    <aside className="w-80 bg-white/95 dark:bg-[#07162c]/90 backdrop-blur-xl border-l border-slate-200 dark:border-white/10 flex flex-col h-full shrink-0 select-none transition-colors">
      {/* Quick Filter Search Input */}
      <div className="p-3 border-b border-slate-200 dark:border-white/10">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute right-3 top-2.5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="جستجوی زیرسیستم یا محصول..."
            className="w-full pr-9 pl-3 py-1.5 bg-slate-100 dark:bg-[#040e1a]/80 backdrop-blur-md border border-slate-200 dark:border-white/10 rounded-xl text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-[#f05a24] transition-all font-medium"
          />
        </div>
      </div>

      {/* Accordion Tree Menu List */}
      <div className="flex-1 overflow-y-auto p-2 space-y-1.5">
        {DOMAIN_GROUPS.map((group) => {
          const subsystemsInGroup = filteredSubsystems.filter((s) => s.domain === group.domain);
          if (subsystemsInGroup.length === 0 && searchTerm) return null;

          const isExpanded = searchTerm ? true : expandedDomains[group.domain];
          const GroupIcon = group.icon;

          return (
            <div key={group.domain} className="rounded-2xl border border-slate-200/80 dark:border-white/10 bg-slate-50/80 dark:bg-white/5 backdrop-blur-md overflow-hidden shadow-sm">
              {/* Domain Header Accordion Button */}
              <button
                type="button"
                onClick={() => toggleDomain(group.domain)}
                className="w-full px-3 py-2.5 flex items-center justify-between text-right hover:bg-slate-100 dark:hover:bg-white/10 transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <div className={`p-1.5 rounded-xl bg-gradient-to-tr ${group.color} text-white shadow-sm`}>
                    <GroupIcon className="w-4 h-4 font-bold" />
                  </div>
                  <span className="text-xs font-black text-slate-900 dark:text-slate-100">{group.title}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-200 dark:bg-white/10 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-white/10 font-bold">
                    {subsystemsInGroup.length}
                  </span>
                  {isExpanded ? (
                    <ChevronDown className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                  ) : (
                    <ChevronLeft className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                  )}
                </div>
              </button>

              {/* Subsystems Tree Children List */}
              {isExpanded && (
                <div className="pr-3 pl-1 py-1 space-y-0.5 border-t border-slate-200 dark:border-white/10 bg-white/80 dark:bg-black/20">
                  {subsystemsInGroup.map((sub) => {
                    const SubIcon = ICON_MAP[sub.iconName] || Layers;
                    const isActive = activeSubsystemId === sub.id;

                    return (
                      <button
                        key={sub.id}
                        type="button"
                        onClick={() => onSelectSubsystem(sub)}
                        className={`w-full text-right px-3 py-2 rounded-xl text-xs flex items-center justify-between transition-all ${
                          isActive
                            ? 'bg-[#f05a24]/15 dark:bg-[#f05a24]/20 text-[#f05a24] font-black border border-[#f05a24]/40 shadow-sm'
                            : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10 hover:text-slate-900 dark:hover:text-slate-100 font-semibold'
                        }`}
                      >
                        <div className="flex items-center gap-2 truncate">
                          <SubIcon className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-[#f05a24]' : 'text-slate-500 dark:text-slate-400'}`} />
                          <span className="truncate">{sub.title}</span>
                        </div>
                        {sub.badge && (
                          <span
                            className={`text-[9px] px-1.5 py-0.5 rounded font-bold shrink-0 ${
                              sub.badge === 'هوش مصنوعی'
                                ? 'bg-[#f05a24]/15 text-[#f05a24] border border-[#f05a24]/30'
                                : sub.badge === 'به‌لحظه'
                                ? 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-500/30'
                                : 'bg-slate-200 dark:bg-white/10 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-white/10'
                            }`}
                          >
                            {sub.badge}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Footer Info */}
      <div className="p-3 border-t border-slate-200 dark:border-white/10 text-[11px] text-slate-600 dark:text-slate-300 text-center bg-slate-50/90 dark:bg-[#031d3d]/90 backdrop-blur-md">
        <div className="font-extrabold text-[#032b75] dark:text-slate-100">شرکت ساختمانی آپتوس ایران</div>
        <div className="text-[10px] text-[#0284c7] dark:text-[#38bdf8] font-bold mt-0.5">مدیریت ارشد پروژه: آقای محسن واحدی</div>
      </div>
    </aside>
  );
};
