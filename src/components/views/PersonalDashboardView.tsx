import React, { useState } from 'react';
import {
  LayoutDashboard,
  CheckSquare,
  Clock,
  TrendingUp,
  Cpu,
  DollarSign,
  Truck,
  Users,
  Shield,
  Calendar,
  AlertCircle,
  ArrowUpRight,
  Sparkles,
  CheckCircle2,
  XCircle,
  BarChart3,
  Flame,
  Scale,
  Building2,
  FileText,
  ChevronRight,
  Zap,
  Info,
  RefreshCw,
  Home,
  ExternalLink,
  Layers,
  MousePointerClick,
  ShoppingBag
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  AreaChart,
  Area,
} from 'recharts';
import { ConfirmModal } from '../ConfirmModal';
import { SubSystem } from '../../types';
import { ALL_SUBSYSTEMS } from '../../data/subsystems';

interface PersonalDashboardViewProps {
  onSelectSubsystem?: (subsystem: SubSystem) => void;
  onReturnToDashboard?: () => void;
  currentUserAvatar?: string;
}

// Chart Mock Data for Aptus
const CONCRETE_OUTPUT_DATA = [
  { day: 'شنبه', batching1: 2200, apsLine: 1450, totalTarget: 3600 },
  { day: 'یک‌شنبه', batching1: 2100, apsLine: 1600, totalTarget: 3600 },
  { day: 'دو‌شنبه', batching1: 2350, apsLine: 1500, totalTarget: 3600 },
  { day: 'سه‌شنبه', batching1: 2400, apsLine: 1700, totalTarget: 3600 },
  { day: 'چهار‌شنبه', batching1: 2250, apsLine: 1650, totalTarget: 3600 },
  { day: 'پنج‌شنبه', batching1: 2500, apsLine: 1800, totalTarget: 3600 },
  { day: 'جمعه', batching1: 1900, apsLine: 1200, totalTarget: 3600 }
];

const COSTING_VS_REVENUE_DATA = [
  { month: 'فروردین', costPerM3: 720000, marketPrice: 1450000 },
  { month: 'اردیبهشت', costPerM3: 740000, marketPrice: 1500000 },
  { month: 'خرداد', costPerM3: 710000, marketPrice: 1520000 },
  { month: 'تیر', costPerM3: 735000, marketPrice: 1580000 },
  { month: 'مرداد', costPerM3: 750000, marketPrice: 1620000 },
  { month: 'شهریور', costPerM3: 730000, marketPrice: 1650000 }
];

export const PersonalDashboardView: React.FC<PersonalDashboardViewProps> = ({
  onSelectSubsystem,
  onReturnToDashboard,
  currentUserAvatar = 'https://lh3.googleusercontent.com/d/18oO9ea3mBJBGQZYonKWxZ9VIxRZAIC8f'
}) => {
  const [activeTab, setActiveTab] = useState<'PERSONAL' | 'EXECUTIVE' | 'APPROVALS'>('PERSONAL');

  // Interactive Personal Tasks with navigation targets
  const [tasks, setTasks] = useState([
    { id: '1', title: 'تایید اسناد مالی مربوط به خریدهای سیمان تیپ ۲ کارخانه', targetSubId: 'FIN_PURCHASE', due: '۱۰:۳۰ امروز', done: false, priority: 'فوری', category: 'مالی' },
    { id: '2', title: 'بررسی مقاومت ۲۸ روزه نمونه‌های بتن C30 آزمایشگاه QC', targetSubId: 'MRP_QUALITY_CONTROL', due: '۱۲:۰۰ امروز', done: true, priority: 'عادی', category: 'تولید' },
    { id: '3', title: 'تایید درخواست‌های ارسال قطعات پیش‌ساخته APS و خانه‌های چیدمانا', targetSubId: 'COMM_LOGISTICS', due: '۱۴:۱۵ امروز', done: false, category: 'لجستیک', priority: 'عادی' },
    { id: '4', title: 'پایش سفارشات فروشگاه آنلاین Aptus Shop و صورت حساب‌ها', targetSubId: 'COMM_CRM_XRM', due: '۱۶:۰۰ امروز', done: false, priority: 'مهم', category: 'بازرگانی' },
    { id: '5', title: 'پایش اتصال دیتابیس مرجع SQL Server آپتوس و همگام‌سازی قبوض باسکول', targetSubId: 'SETTINGS_DB', due: '۱۷:۳۰ امروز', done: false, priority: 'فنی', category: 'IT' }
  ]);

  // Pending Approvals Queue
  const [pendingApprovals, setPendingApprovals] = useState([
    { id: 'APP-101', title: 'سند مالیاتی ارزش افزوده خریدهای میلگرد و قالب APS', targetSubId: 'FIN_TAX_1405', amount: '۱,۴۵۰,۰۰۰,۰۰۰ ریال', requester: 'سارینا کریمی (مدیر مالی)', date: '۱۴۰۵/۰۵/۰۲', type: 'مالی' },
    { id: 'APP-102', title: 'مجوز خروج ۲۰ دستگاه میکسر بتن آماده و نیوجرسی سنگین', targetSubId: 'COMM_WEIGHBRIDGE', amount: '۴,۲۵۰ تن (۱۶۸ قبض)', requester: 'علی اکبری (اپراتور باسکول)', date: '۱۴۰۵/۰۵/۰۲', type: 'بازرگانی' },
    { id: 'APP-103', title: 'درخواست خرید اضطراری روان‌کننده بتن برای بچینگ شماره ۱', targetSubId: 'COMM_DOMESTIC_BUY', amount: '۳,۲۰۰,۰۰۰,۰۰۰ ریال', requester: 'رضا معتمدی (سرپرست بچینگ)', date: '۱۴۰۵/۰۵/۰۱', type: 'تولید' }
  ]);

  // Confirm Modal state
  const [confirmModalState, setConfirmModalState] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    type?: 'warning' | 'danger' | 'info' | 'success';
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {}
  });

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleNavigate = (subsystemId: string) => {
    if (!onSelectSubsystem) return;
    const target = ALL_SUBSYSTEMS.find((s) => s.id === subsystemId);
    if (target) {
      onSelectSubsystem(target);
    }
  };

  const handleToggleTask = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t))
    );
  };

  const handleActionApprove = (appId: string, title: string) => {
    setConfirmModalState({
      isOpen: true,
      title: 'تایید نهایی سند و ارسال به دیتابیس آپتوس',
      message: `آیا از تایید نهایی درخواست "${title}" و اعمال در سیستم Aptus ERP اطمینان دارید؟`,
      type: 'success',
      onConfirm: () => {
        setPendingApprovals((prev) => prev.filter((item) => item.id !== appId));
        setConfirmModalState((prev) => ({ ...prev, isOpen: false }));
        triggerToast(`درخواست ${appId} با موفقیت تایید و صادر گردید.`);
      }
    });
  };

  const handleActionReject = (appId: string, title: string) => {
    setConfirmModalState({
      isOpen: true,
      title: 'عدم تایید و عودت سند',
      message: `آیا از عودت درخواست "${title}" به کارتابل فرستنده اطمینان دارید؟`,
      type: 'danger',
      onConfirm: () => {
        setPendingApprovals((prev) => prev.filter((item) => item.id !== appId));
        setConfirmModalState((prev) => ({ ...prev, isOpen: false }));
        triggerToast(`درخواست ${appId} عودت داده شد.`);
      }
    });
  };

  return (
    <div className="p-4 lg:p-6 space-y-6 dir-rtl font-sans text-slate-900 dark:text-slate-100 pb-12 transition-colors">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-emerald-500 text-slate-950 font-black px-6 py-3 rounded-2xl shadow-2xl border border-emerald-300 flex items-center gap-2 text-xs animate-in slide-in-from-top duration-300">
          <CheckCircle2 className="w-5 h-5 text-slate-950" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Confirmation Modal */}
      <ConfirmModal
        isOpen={confirmModalState.isOpen}
        title={confirmModalState.title}
        message={confirmModalState.message}
        type={confirmModalState.type}
        onConfirm={confirmModalState.onConfirm}
        onCancel={() => setConfirmModalState((prev) => ({ ...prev, isOpen: false }))}
      />

      {/* Top Welcome Banner & Navigation Bar */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-white via-slate-50 to-blue-50/50 dark:from-[#032b75]/40 dark:via-[#07162c] dark:to-[#040e1a] border border-slate-200 dark:border-[#f05a24]/30 shadow-lg dark:shadow-2xl backdrop-blur-xl relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6 transition-all">
        <div className="space-y-2 z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#f05a24]/10 dark:bg-[#f05a24]/20 border border-[#f05a24]/30 text-[#f05a24] text-xs font-black">
            <Sparkles className="w-4 h-4 text-[#f05a24] animate-pulse" />
            <span>داشبورد تعاملی شرکت ساختمانی آپتوس ایران • کلیک روی کارت‌ها جهت ورود مستقیم</span>
          </div>

          <h2 className="text-xl lg:text-2xl font-black text-[#032b75] dark:text-slate-100 flex items-center gap-3">
            <img
              src={currentUserAvatar}
              alt="عکس پروفایل محسن واحدی"
              referrerPolicy="no-referrer"
              className="w-10 h-10 rounded-full object-cover border-2 border-[#f05a24] shadow-md shrink-0"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).style.display = 'none';
              }}
            />
            <span>خوش آمدید، آقای محسن واحدی</span>
            <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-500/30">
              مدیر ارشد پروژه (Aptus Admin)
            </span>
          </h2>

          <p className="text-xs text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed font-medium">
            جهت تسریع در تسلط بر سیستم، روی هر یک از کارت‌های بتن آماده، قطعات پیش‌ساخته APS، فروشگاه آنلاین Aptus و قبوض باسکول کلیک کنید تا به بخش مربوطه منتقل شوید.
          </p>
        </div>

        {/* Action Controls & Return Home Button */}
        <div className="flex items-center gap-3 z-10 shrink-0">
          <button
            type="button"
            onClick={onReturnToDashboard}
            className="px-4 py-2.5 rounded-2xl bg-[#f05a24] hover:bg-[#ea580c] text-white font-black text-xs flex items-center gap-2 shadow-lg shadow-orange-500/20 transition-all hover:scale-105 active:scale-95"
            title="بازگشت به داشبورد اصلی"
          >
            <Home className="w-4 h-4" />
            <span>صفحه اصلی داشبورد</span>
          </button>
        </div>
      </div>

      {/* Primary Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-white/10 pb-3 overflow-x-auto text-xs font-bold">
        <button
          type="button"
          onClick={() => setActiveTab('PERSONAL')}
          className={`px-4 py-2.5 rounded-2xl flex items-center gap-2 transition-all whitespace-nowrap ${
            activeTab === 'PERSONAL'
              ? 'bg-[#f05a24] text-white shadow-lg shadow-orange-500/20 font-black'
              : 'bg-white dark:bg-white/5 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10 border border-slate-200 dark:border-transparent'
          }`}
        >
          <CheckSquare className="w-4 h-4" />
          <span>کارت‌های هوشمند سه بخش آپتوس</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('EXECUTIVE')}
          className={`px-4 py-2.5 rounded-2xl flex items-center gap-2 transition-all whitespace-nowrap ${
            activeTab === 'EXECUTIVE'
              ? 'bg-[#f05a24] text-white shadow-lg shadow-orange-500/20 font-black'
              : 'bg-white dark:bg-white/5 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10 border border-slate-200 dark:border-transparent'
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          <span>داشبورد مدیریتی بتن & APS</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('APPROVALS')}
          className={`px-4 py-2.5 rounded-2xl flex items-center gap-2 transition-all whitespace-nowrap relative ${
            activeTab === 'APPROVALS'
              ? 'bg-[#f05a24] text-white shadow-lg shadow-orange-500/20 font-black'
              : 'bg-white dark:bg-white/5 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10 border border-slate-200 dark:border-transparent'
          }`}
        >
          <Clock className="w-4 h-4" />
          <span>کارتابل تاییدات و اسناد</span>
          {pendingApprovals.length > 0 && (
            <span className="w-5 h-5 rounded-full bg-rose-500 text-white font-black text-[10px] flex items-center justify-center">
              {pendingApprovals.length}
            </span>
          )}
        </button>
      </div>

      {/* TAB 1: PERSONAL DAILY ACTIVITIES & QUICK LAUNCH TILES */}
      {activeTab === 'PERSONAL' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Side: Interactive Motion KPI Cards & Tasks */}
          <div className="lg:col-span-7 space-y-4">
            {/* Direct Clickable Quick Metric Strip */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Weighbridge Clickable KPI Card */}
              <div
                onClick={() => handleNavigate('COMM_WEIGHBRIDGE')}
                className="p-4 rounded-3xl bg-white dark:bg-[#07162c]/80 hover:bg-slate-50 dark:hover:bg-[#07162c] border border-slate-200 dark:border-white/10 hover:border-[#f05a24]/50 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] cursor-pointer shadow-md hover:shadow-xl group relative overflow-hidden"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-600 dark:text-slate-300 font-bold">خروجی باسکول بتن (امروز)</span>
                  <div className="p-2 rounded-xl bg-cyan-100 dark:bg-cyan-500/20 text-cyan-700 dark:text-cyan-400 group-hover:scale-110 transition-transform">
                    <Scale className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-2xl font-black text-cyan-700 dark:text-cyan-400 font-mono mt-2">۴,۲۵۰ تن</div>
                <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 mt-2 font-medium">
                  <span>۱۶۸ قبض بتن و قطعات صادر شده</span>
                  <span className="text-[#f05a24] font-black flex items-center gap-1 group-hover:underline">
                    <span>مدیریت باسکول ۶۰ تنی</span>
                    <ExternalLink className="w-3 h-3" />
                  </span>
                </div>
              </div>

              {/* APS Precast Clickable KPI Card */}
              <div
                onClick={() => handleNavigate('MRP_PLANNING')}
                className="p-4 rounded-3xl bg-white dark:bg-[#07162c]/80 hover:bg-slate-50 dark:hover:bg-[#07162c] border border-slate-200 dark:border-white/10 hover:border-[#f05a24]/50 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] cursor-pointer shadow-md hover:shadow-xl group relative overflow-hidden"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-600 dark:text-slate-300 font-bold">تولید سیستم‌های پیش‌ساخته APS</span>
                  <div className="p-2 rounded-xl bg-[#f05a24]/10 dark:bg-[#f05a24]/20 text-[#f05a24] group-hover:scale-110 transition-transform">
                    <Building2 className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-2xl font-black text-[#f05a24] font-mono mt-2">۱,۸۰۰ تن/روز</div>
                <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 mt-2 font-medium">
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold">خانه‌های پیش‌ساخته چیدمانا</span>
                  <span className="text-[#f05a24] font-black flex items-center gap-1 group-hover:underline">
                    <span>برنامه‌ریزی APS</span>
                    <ExternalLink className="w-3 h-3" />
                  </span>
                </div>
              </div>
            </div>

            {/* Daily Tasks & Checklist Widget */}
            <div className="p-5 rounded-3xl bg-white dark:bg-[#07162c]/60 border border-slate-200 dark:border-white/10 shadow-md dark:shadow-xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/10 pb-3">
                <div className="flex items-center gap-2">
                  <CheckSquare className="w-5 h-5 text-[#f05a24]" />
                  <h3 className="font-extrabold text-[#032b75] dark:text-slate-100 text-sm">لیست اقدامات امروز آپتوس (کلیک جهت ورود به زیرسیستم)</h3>
                </div>
                <span className="text-xs text-slate-500 dark:text-slate-400 font-mono font-bold">
                  {tasks.filter((t) => t.done).length} از {tasks.length} انجام شده
                </span>
              </div>

              <div className="space-y-2">
                {tasks.map((task) => (
                  <div
                    key={task.id}
                    onClick={() => handleNavigate(task.targetSubId)}
                    className={`p-3.5 rounded-2xl border transition-all flex items-center justify-between cursor-pointer group hover:scale-[1.01] active:scale-[0.99] ${
                      task.done
                        ? 'bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/30 text-slate-500 dark:text-slate-400 line-through'
                        : 'bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/10 hover:border-[#f05a24]/40'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        onClick={(e) => handleToggleTask(task.id, e)}
                        className={`w-5 h-5 rounded-lg border flex items-center justify-center transition-all ${
                          task.done
                            ? 'bg-emerald-500 border-emerald-400 text-slate-950'
                            : 'border-slate-300 dark:border-white/30 bg-white dark:bg-black/20 hover:border-[#f05a24]'
                        }`}
                        title="تغییر وضعیت انجام کار"
                      >
                        {task.done && <CheckCircle2 className="w-3.5 h-3.5" />}
                      </div>
                      <div>
                        <div className="text-xs font-bold group-hover:text-[#f05a24] transition-colors flex items-center gap-1.5">
                          <span>{task.title}</span>
                          <ExternalLink className="w-3 h-3 text-[#f05a24] opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                        <div className="flex items-center gap-2 text-[10px] text-slate-500 dark:text-slate-400 mt-1 font-semibold">
                          <span className="px-2 py-0.5 rounded-md bg-slate-200 dark:bg-white/10 text-slate-700 dark:text-slate-300">{task.category}</span>
                          <span>{task.due}</span>
                        </div>
                      </div>
                    </div>

                    <span
                      className={`text-[10px] font-black px-2 py-0.5 rounded-md ${
                        task.priority === 'فوری'
                          ? 'bg-rose-100 dark:bg-rose-500/20 text-rose-700 dark:text-rose-300 border border-rose-300 dark:border-rose-500/30'
                          : task.priority === 'مهم'
                          ? 'bg-amber-100 dark:bg-amber-500/20 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-500/30'
                          : 'bg-slate-200 dark:bg-slate-500/20 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-500/30'
                      }`}
                    >
                      {task.priority}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick System Launch Tiles */}
            <div className="p-5 rounded-3xl bg-white dark:bg-[#07162c]/60 border border-slate-200 dark:border-white/10 shadow-md dark:shadow-xl space-y-3">
              <h3 className="font-extrabold text-[#032b75] dark:text-slate-100 text-sm flex items-center gap-2">
                <Zap className="w-4 h-4 text-[#f05a24]" />
                <span>دسترسی مستقیم به زیرسیستم‌های آپتوس:</span>
              </h3>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {ALL_SUBSYSTEMS.slice(1, 7).map((sub) => (
                  <button
                    key={sub.id}
                    type="button"
                    onClick={() => onSelectSubsystem && onSelectSubsystem(sub)}
                    className="p-3.5 rounded-2xl bg-slate-50 dark:bg-white/5 hover:bg-[#f05a24]/10 dark:hover:bg-[#f05a24]/20 border border-slate-200 dark:border-white/10 hover:border-[#f05a24]/40 text-right transition-all group hover:scale-[1.03] active:scale-[0.97]"
                  >
                    <div className="text-xs font-black text-slate-800 dark:text-slate-200 group-hover:text-[#f05a24] flex items-center justify-between">
                      <span className="truncate">{sub.title}</span>
                      <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-[#f05a24] transition-transform group-hover:-translate-x-1" />
                    </div>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-1 font-medium">{sub.description}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right Side: Live Interactive Factory Cards */}
          <div className="lg:col-span-5 space-y-4">
            {/* Live Plant Status Summary Card with Interactive Click Tiles */}
            <div className="p-5 rounded-3xl bg-gradient-to-br from-white via-slate-50 to-blue-50/30 dark:from-[#07162c] dark:via-[#07162c] dark:to-[#032b75]/40 border border-slate-200 dark:border-[#f05a24]/30 shadow-md dark:shadow-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/10 pb-3">
                <div className="flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-[#f05a24] animate-pulse" />
                  <h3 className="font-extrabold text-[#032b75] dark:text-slate-100 text-sm">سه بخش اصلی شرکت آپتوس (کلیک برای ورود)</h3>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-500/30 font-mono font-bold">
                  بچینگ فعال • APS دایر
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {/* Ready Mix Concrete Tile */}
                <div
                  onClick={() => handleNavigate('MRP_PLANNING')}
                  className="p-3.5 rounded-2xl bg-white dark:bg-white/5 hover:bg-[#f05a24]/10 dark:hover:bg-[#f05a24]/20 border border-slate-200 dark:border-white/10 hover:border-[#f05a24]/40 transition-all cursor-pointer text-center space-y-1 hover:scale-105 group shadow-sm"
                >
                  <div className="text-[10px] text-slate-600 dark:text-slate-300 font-bold">تولید بتن آماده C30</div>
                  <div className="text-lg font-black text-[#f05a24] font-mono">۴,۲۵۰ تن</div>
                  <div className="text-[9px] text-emerald-600 dark:text-emerald-400 font-bold group-hover:underline">کنترل بچینگ بتن ←</div>
                </div>

                {/* Chidmana Houses APS Tile */}
                <div
                  onClick={() => handleNavigate('MRP_QUALITY_CONTROL')}
                  className="p-3.5 rounded-2xl bg-white dark:bg-white/5 hover:bg-emerald-50 dark:hover:bg-emerald-500/20 border border-slate-200 dark:border-white/10 hover:border-emerald-500/40 transition-all cursor-pointer text-center space-y-1 hover:scale-105 group shadow-sm"
                >
                  <div className="text-[10px] text-slate-600 dark:text-slate-300 font-bold">خانه‌های چیدمانا (APS)</div>
                  <div className="text-lg font-black text-emerald-600 dark:text-emerald-400 font-mono">۹۸.۴٪ QC</div>
                  <div className="text-[9px] text-emerald-700 dark:text-emerald-300 font-bold group-hover:underline">آزمایشگاه بتن & APS ←</div>
                </div>

                {/* Weighbridge Tile */}
                <div
                  onClick={() => handleNavigate('COMM_WEIGHBRIDGE')}
                  className="p-3.5 rounded-2xl bg-white dark:bg-white/5 hover:bg-cyan-50 dark:hover:bg-cyan-500/20 border border-slate-200 dark:border-white/10 hover:border-cyan-500/40 transition-all cursor-pointer text-center space-y-1 hover:scale-105 group shadow-sm"
                >
                  <div className="text-[10px] text-slate-600 dark:text-slate-300 font-bold">توزین باسکول ۶۰ تنی</div>
                  <div className="text-lg font-black text-cyan-700 dark:text-cyan-400 font-mono">۱۶۸ قبض</div>
                  <div className="text-[9px] text-cyan-700 dark:text-cyan-300 font-bold group-hover:underline">مدیریت قبوض باسکول ←</div>
                </div>

                {/* Online Store Tile */}
                <div
                  onClick={() => handleNavigate('COMM_CRM_XRM')}
                  className="p-3.5 rounded-2xl bg-white dark:bg-white/5 hover:bg-purple-50 dark:hover:bg-purple-500/20 border border-slate-200 dark:border-white/10 hover:border-purple-500/40 transition-all cursor-pointer text-center space-y-1 hover:scale-105 group shadow-sm"
                >
                  <div className="text-[10px] text-slate-600 dark:text-slate-300 font-bold">فروشگاه آنلاین Aptus</div>
                  <div className="text-lg font-black text-purple-700 dark:text-purple-300 font-mono">Aptus Shop</div>
                  <div className="text-[9px] text-purple-700 dark:text-purple-300 font-bold group-hover:underline">فروشگاه اینترنتی ←</div>
                </div>
              </div>

              {/* AI Insight Box */}
              <div className="p-3.5 rounded-2xl bg-orange-50 dark:bg-[#f05a24]/10 border border-orange-200 dark:border-[#f05a24]/30 text-slate-800 dark:text-slate-200 text-xs space-y-1">
                <div className="font-black flex items-center gap-1.5 text-[#f05a24]">
                  <Sparkles className="w-4 h-4 text-[#f05a24]" />
                  <span>توصیه دستیار هوش مصنوعی به آقای محسن واحدی:</span>
                </div>
                <p className="text-[11px] leading-relaxed text-slate-700 dark:text-slate-300 font-medium">
                  وضعیت اختلاط بتن آماده C30 در خط بچینگ شماره ۱ در بهینه‌ترین حالت قرار دارد. پیشنهاد می‌شود تاییدیه فاکتور مالیاتی سال ۱۴۰۵ خرید روان‌کننده بتن را صادر نمایید.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: EXECUTIVE C-LEVEL DASHBOARD */}
      {activeTab === 'EXECUTIVE' && (
        <div className="space-y-6">
          {/* Executive KPI Bar - Every card click jumps to subsystem */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div
              onClick={() => handleNavigate('MRP_PLANNING')}
              className="p-4 rounded-3xl bg-[#07162c]/80 hover:bg-[#07162c] border border-white/10 hover:border-[#f05a24]/50 transition-all duration-300 hover:scale-[1.03] active:scale-[0.97] cursor-pointer shadow-xl hover:shadow-2xl hover:shadow-orange-500/10 flex items-center gap-4 group"
            >
              <div className="p-3 rounded-2xl bg-[#f05a24]/20 text-[#f05a24] border border-[#f05a24]/30 shrink-0 group-hover:scale-110 transition-transform">
                <Building2 className="w-6 h-6" />
              </div>
              <div>
                <div className="text-xs text-slate-400 font-medium">تولید بتن آماده ماه جاری</div>
                <div className="text-lg font-black text-slate-100 font-mono mt-0.5">۱۲۵,۰۰۰ مترمکعب</div>
                <div className="text-[10px] text-emerald-400 font-bold mt-0.5 flex items-center gap-1">
                  <ArrowUpRight className="w-3 h-3" />
                  <span>۱۴.۲٪ رشد نسبت به ماه قبل</span>
                </div>
              </div>
            </div>

            <div
              onClick={() => handleNavigate('FIN_REALTIME_COSTING')}
              className="p-4 rounded-3xl bg-[#07162c]/80 hover:bg-[#07162c] border border-white/10 hover:border-emerald-500/50 transition-all duration-300 hover:scale-[1.03] active:scale-[0.97] cursor-pointer shadow-xl hover:shadow-2xl hover:shadow-emerald-500/10 flex items-center gap-4 group"
            >
              <div className="p-3 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 shrink-0 group-hover:scale-110 transition-transform">
                <DollarSign className="w-6 h-6" />
              </div>
              <div>
                <div className="text-xs text-slate-400 font-medium">درآمد پروژه‌ها & Aptus Shop</div>
                <div className="text-lg font-black text-slate-100 font-mono mt-0.5">۳,۱۵۰ میلیارد ریال</div>
                <div className="text-[10px] text-emerald-400 font-bold mt-0.5 flex items-center gap-1">
                  <ArrowUpRight className="w-3 h-3" />
                  <span>حاشیه سود خالص: ۴۲.۴٪</span>
                </div>
              </div>
            </div>

            <div
              onClick={() => handleNavigate('COMM_WEIGHBRIDGE')}
              className="p-4 rounded-3xl bg-[#07162c]/80 hover:bg-[#07162c] border border-white/10 hover:border-cyan-500/50 transition-all duration-300 hover:scale-[1.03] active:scale-[0.97] cursor-pointer shadow-xl hover:shadow-2xl hover:shadow-cyan-500/10 flex items-center gap-4 group"
            >
              <div className="p-3 rounded-2xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 shrink-0 group-hover:scale-110 transition-transform">
                <Truck className="w-6 h-6" />
              </div>
              <div>
                <div className="text-xs text-slate-400 font-medium">خروجی روزانه باسکول بتن</div>
                <div className="text-lg font-black text-slate-100 font-mono mt-0.5">۴,۲۵۰ تن بتن/قطعه</div>
                <div className="text-[10px] text-cyan-300 font-bold mt-0.5">۱۶۸ قبض صادر شده</div>
              </div>
            </div>

            <div
              onClick={() => handleNavigate('HCM_EVALUATION')}
              className="p-4 rounded-3xl bg-[#07162c]/80 hover:bg-[#07162c] border border-white/10 hover:border-purple-500/50 transition-all duration-300 hover:scale-[1.03] active:scale-[0.97] cursor-pointer shadow-xl hover:shadow-2xl hover:shadow-purple-500/10 flex items-center gap-4 group"
            >
              <div className="p-3 rounded-2xl bg-purple-500/20 text-purple-400 border border-purple-500/30 shrink-0 group-hover:scale-110 transition-transform">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <div className="text-xs text-slate-400 font-medium">شاخص عملکرد پرسنل (KPI)</div>
                <div className="text-lg font-black text-slate-100 font-mono mt-0.5">۹۶.۸٪ رضایت</div>
                <div className="text-[10px] text-purple-300 mt-0.5">پرسنل آپتوس & پروژه‌ها</div>
              </div>
            </div>
          </div>

          {/* Interactive Recharts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Chart 1: Concrete & APS Output */}
            <div
              onClick={() => handleNavigate('MRP_PLANNING')}
              className="p-5 rounded-3xl bg-[#07162c]/60 border border-white/10 hover:border-[#f05a24]/40 backdrop-blur-xl shadow-xl space-y-4 cursor-pointer transition-all hover:scale-[1.01] group"
            >
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <h3 className="font-bold text-slate-100 text-sm flex items-center gap-2 group-hover:text-[#f05a24] transition-colors">
                  <BarChart3 className="w-4 h-4 text-[#f05a24]" />
                  <span>نمودار تولید روزانه بتن آماده و قطعات APS (تن)</span>
                </h3>
                <span className="text-[10px] text-[#f05a24] font-bold flex items-center gap-1 group-hover:underline">
                  <span>برنامه‌ریزی تولید بتن</span>
                  <ExternalLink className="w-3 h-3" />
                </span>
              </div>

              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={CONCRETE_OUTPUT_DATA}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                    <XAxis dataKey="day" stroke="#94a3b8" fontSize={11} />
                    <YAxis stroke="#94a3b8" fontSize={11} />
                    <Tooltip contentStyle={{ backgroundColor: '#07162c', borderColor: '#ffffff20', borderRadius: '12px', fontSize: '12px' }} />
                    <Bar dataKey="batching1" name="بچینگ بتن آماده" fill="#f05a24" radius={[6, 6, 0, 0]} />
                    <Bar dataKey="apsLine" name="قطعات پیش‌ساخته APS" fill="#10b981" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Chart 2: Costing vs Market Price */}
            <div
              onClick={() => handleNavigate('FIN_REALTIME_COSTING')}
              className="p-5 rounded-3xl bg-[#07162c]/60 border border-white/10 hover:border-emerald-500/40 backdrop-blur-xl shadow-xl space-y-4 cursor-pointer transition-all hover:scale-[1.01] group"
            >
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <h3 className="font-bold text-slate-100 text-sm flex items-center gap-2 group-hover:text-emerald-300 transition-colors">
                  <TrendingUp className="w-4 h-4 text-emerald-400" />
                  <span>روند بهای تمام شده به لحظه بتن C30 vs قیمت بازار (ریال/مترمکعب)</span>
                </h3>
                <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-1 group-hover:underline">
                  <span>تحلیل بهای تمام شده</span>
                  <ExternalLink className="w-3 h-3" />
                </span>
              </div>

              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={COSTING_VS_REVENUE_DATA}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                    <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} />
                    <YAxis stroke="#94a3b8" fontSize={11} />
                    <Tooltip contentStyle={{ backgroundColor: '#07162c', borderColor: '#ffffff20', borderRadius: '12px', fontSize: '12px' }} />
                    <Area type="monotone" dataKey="marketPrice" name="قیمت تحویل پروژه" stroke="#10b981" fill="#10b98120" strokeWidth={2} />
                    <Area type="monotone" dataKey="costPerM3" name="بهای تمام شده" stroke="#f05a24" fill="#f05a2420" strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: APPROVALS QUEUE */}
      {activeTab === 'APPROVALS' && (
        <div className="p-6 rounded-3xl bg-[#07162c]/60 border border-white/10 backdrop-blur-xl shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div>
              <h3 className="font-bold text-slate-100 text-sm flex items-center gap-2">
                <Clock className="w-5 h-5 text-[#f05a24]" />
                <span>کارتابل تاییدات معوق و اسناد نیازمند تصمیم‌گیری شما</span>
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                روی هر عنوان کلیک کنید تا اسناد و جزییات مربوطه در سیستم مقصد باز شود.
              </p>
            </div>
          </div>

          {pendingApprovals.length === 0 ? (
            <div className="p-8 text-center text-slate-400 text-xs">
              هیچ اسنادی در کارتابل تاییدات شما باقی نمانده است.
            </div>
          ) : (
            <div className="space-y-3">
              {pendingApprovals.map((app) => (
                <div
                  key={app.id}
                  className="p-4 rounded-2xl bg-white/5 border border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all hover:border-[#f05a24]/30 hover:bg-white/10"
                >
                  <div
                    onClick={() => handleNavigate(app.targetSubId)}
                    className="space-y-1 cursor-pointer group"
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[#f05a24] text-xs font-bold">{app.id}</span>
                      <span className="font-bold text-slate-200 text-xs group-hover:text-[#f05a24] flex items-center gap-1.5">
                        <span>{app.title}</span>
                        <ExternalLink className="w-3.5 h-3.5 text-[#f05a24] opacity-0 group-hover:opacity-100 transition-opacity" />
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-[11px] text-slate-400">
                      <span>درخواست‌کننده: {app.requester}</span>
                      <span>•</span>
                      <span className="text-[#f05a24] font-semibold">{app.amount}</span>
                      <span>•</span>
                      <span>تاریخ: {app.date}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => handleActionApprove(app.id, app.title)}
                      className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-all shadow-lg shadow-emerald-500/20"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>تایید و ثبت نهایی</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleActionReject(app.id, app.title)}
                      className="px-4 py-2 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/30 text-xs font-semibold flex items-center gap-1.5 transition-all"
                    >
                      <XCircle className="w-4 h-4" />
                      <span>انصراف / عودت</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
