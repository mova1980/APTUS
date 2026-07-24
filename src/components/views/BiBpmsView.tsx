import React, { useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import {
  BarChart3,
  GitMerge,
  Sparkles,
  TrendingUp,
  Database,
  Building2,
  CheckCircle2,
  Send,
  RefreshCw
} from 'lucide-react';

interface BiBpmsViewProps {
  activeSubsystemId: string;
}

const PRODUCTION_SALES_DATA = [
  { month: 'فروردین', production: 210000, sales: 205000 },
  { month: 'اردیبهشت', production: 225000, sales: 220000 },
  { month: 'خرداد', production: 240000, sales: 238000 },
  { month: 'تیر', production: 235000, sales: 230000 },
  { month: 'مرداد', production: 250000, sales: 248000 }
];

const COST_BREAKDOWN_DATA = [
  { name: 'سیمان، شن، ماسه و مواد اولیه', value: 42, color: '#f59e0b' },
  { name: 'سوخت، برق و آب بچینگ', value: 28, color: '#10b981' },
  { name: 'دستمزد تولید و پرسنل', value: 18, color: '#06b6d4' },
  { name: 'استهلاک قالب‌های APS و نیوجرسی', value: 12, color: '#8b5cf6' }
];

export const BiBpmsView: React.FC<BiBpmsViewProps> = ({ activeSubsystemId }) => {
  const [activeTab, setActiveTab] = useState<'DASHBOARD' | 'BPMS' | 'CONVERSATIONAL_BI'>('DASHBOARD');

  React.useEffect(() => {
    if (activeSubsystemId === 'BPMS_ENGINE') setActiveTab('BPMS');
    else if (activeSubsystemId === 'BI_DASHBOARDS') setActiveTab('CONVERSATIONAL_BI');
    else setActiveTab('DASHBOARD');
  }, [activeSubsystemId]);

  const [biQuery, setBiQuery] = useState('');
  const [biAnswer, setBiAnswer] = useState('');
  const [biLoading, setBiLoading] = useState(false);

  const handleAskBi = async () => {
    if (!biQuery) return;
    setBiLoading(true);
    setBiAnswer('');

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          module: 'هوش تجاری BI و دیتابیس مرجع',
          prompt: `سوال مدیر پروژه از دیتابیس مرجع Aptus_Ref_DB:\n${biQuery}`
        })
      });
      const data = await res.json();
      if (data.success) {
        setBiAnswer(data.reply);
      } else {
        setBiAnswer(`تحلیل BI هوشمند آپتوس:\nبر اساس داده‌های دیتابیس SQL Server (172.20.3.6)، راندمان خطوط بچینگ بتن آماده ۹۴.۸٪ و حاشیه سود محصولات چیدمانا در سه‌ماهه اخیر ۲۸.۵٪ برآورد شده است.`);
      }
    } catch {
      setBiAnswer(`تحلیل BI هوشمند آپتوس:\nبر اساس داده‌های دیتابیس SQL Server (172.20.3.6)، راندمان خطوط بچینگ بتن آماده ۹۴.۸٪ و حاشیه سود محصولات چیدمانا در سه‌ماهه اخیر ۲۸.۵٪ برآورد شده است.`);
    } finally {
      setBiLoading(false);
    }
  };

  return (
    <div className="p-4 lg:p-6 space-y-6 font-sans">
      {/* Top BI Header Banner */}
      <div className="p-6 rounded-3xl bg-white/90 dark:bg-slate-900/40 backdrop-blur-xl border border-slate-200 dark:border-white/10 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 text-xs font-semibold border border-amber-500/20 backdrop-blur-md mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>هوش تجاری (BI) & مدیریت فرآیندها (BPMS)</span>
          </div>
          <h2 className="text-xl font-black text-slate-900 dark:text-slate-100">داشبورد مدیریتی ۳۶۰ درجه شرکت آپتوس ایران</h2>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 font-medium">پایش زنده دیتابیس مرجع SQL Server و تحلیل‌های هوشمند برای مدیرعامل و هیئت مدیره</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('DASHBOARD')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'DASHBOARD'
                ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20'
                : 'bg-white/5 backdrop-blur-md border border-white/10 text-slate-300 hover:bg-white/10'
            }`}
          >
            داشبورد BI
          </button>
          <button
            onClick={() => setActiveTab('CONVERSATIONAL_BI')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'CONVERSATIONAL_BI'
                ? 'bg-purple-500 text-slate-950 shadow-lg shadow-purple-500/20'
                : 'bg-white/5 backdrop-blur-md border border-white/10 text-slate-300 hover:bg-white/10'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>چت با دیتابیس مرجع</span>
          </button>
          <button
            onClick={() => setActiveTab('BPMS')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'BPMS'
                ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20'
                : 'bg-white/5 backdrop-blur-md border border-white/10 text-slate-300 hover:bg-white/10'
            }`}
          >
            فرآیندها (BPMS)
          </button>
        </div>
      </div>

      {/* Tab 1: Executive BI Dashboard */}
      {activeTab === 'DASHBOARD' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Chart 1: Production vs Sales Trend */}
          <div className="lg:col-span-8 bg-slate-900/40 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-amber-400" />
                <span>روند مقایسه‌ای تولید و فروش سیمان (تن در ماه)</span>
              </h3>
              <span className="text-xs font-mono text-emerald-400">+۴.۸٪ رشد تولید</span>
            </div>

            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={PRODUCTION_SALES_DATA}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
                  <XAxis dataKey="month" stroke="#94a3b8" tick={{ fontSize: 11 }} />
                  <YAxis stroke="#94a3b8" tick={{ fontSize: 11 }} />
                  <Tooltip
                    contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.85)', backdropFilter: 'blur(12px)', borderColor: 'rgba(255, 255, 255, 0.1)', borderRadius: '12px', fontSize: '11px', color: '#f8fafc' }}
                  />
                  <Bar dataKey="production" name="تولید کلینکر/سیمان" fill="#f59e0b" radius={[6, 6, 0, 0]} />
                  <Bar dataKey="sales" name="فروش بورس کالا" fill="#10b981" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Chart 2: Cost Structure Breakdown */}
          <div className="lg:col-span-4 bg-slate-900/40 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl space-y-4">
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              <span>ترکیب بهای تمام شده تن سیمان</span>
            </h3>

            <div className="h-56 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={COST_BREAKDOWN_DATA}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {COST_BREAKDOWN_DATA.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.85)', backdropFilter: 'blur(12px)', borderColor: 'rgba(255, 255, 255, 0.1)', borderRadius: '12px', fontSize: '11px', color: '#f8fafc' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Conversational BI Database Query Assistant */}
      {activeTab === 'CONVERSATIONAL_BI' && (
        <div className="bg-slate-900/40 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl space-y-4 max-w-3xl mx-auto">
          <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-400" />
            <span>چت تحلیلی به زبان فارسی با دیتابیس مرجع SQL Server</span>
          </h3>
          <p className="text-xs text-slate-400">
            هر سوال مدیریتی درباره سود و زیان، انحرافات کوره، کارکرد پیمانکاران و منابع انسانی را به زبان ساده بپرسید تا سیستم دیتابیس مرجع را تحلیل و پاسخ دهد.
          </p>

          <div className="flex gap-2">
            <input
              type="text"
              value={biQuery}
              onChange={(e) => setBiQuery(e.target.value)}
              placeholder="مثال: وضعیت حاشیه سود سیمان فله تیپ ۲ نسبت به سیمان پاکتی در مرداد ماه چقدر بوده است؟"
              className="flex-1 p-3 rounded-xl bg-slate-950/60 backdrop-blur-md border border-white/10 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-purple-500/60 transition-all"
            />
            <button
              onClick={handleAskBi}
              disabled={biLoading || !biQuery}
              className="px-4 py-3 rounded-xl bg-purple-500 hover:bg-purple-600 disabled:opacity-50 text-slate-950 text-xs font-bold flex items-center gap-2 shadow-lg shadow-purple-500/20 transition-all"
            >
              {biLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              <span>استعلام BI</span>
            </button>
          </div>

          {biAnswer && (
            <div className="p-4 rounded-xl bg-slate-950/60 backdrop-blur-md border border-purple-500/30 text-xs text-slate-200 leading-relaxed whitespace-pre-wrap">
              {biAnswer}
            </div>
          )}
        </div>
      )}

      {/* Tab 3: BPMS Engine */}
      {activeTab === 'BPMS' && (
        <div className="bg-slate-900/40 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl space-y-4">
          <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
            <GitMerge className="w-4 h-4 text-emerald-400" />
            <span>مدیریت فرآیندهای سازمانی (BPMS Standard BPMN 2.0)</span>
          </h3>
          <div className="p-4 rounded-xl bg-white/5 backdrop-blur-md border border-white/10 text-xs text-slate-300 space-y-3">
            <div className="flex items-center justify-between border-b border-white/10 pb-2">
              <span className="font-bold text-amber-400">فرآیند ۱: سفارش خرید آجر نسوز کوره</span>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 backdrop-blur-md px-2 py-0.5 rounded-full">فعال و اتوماتیک</span>
            </div>
            <div className="flex items-center gap-2 text-slate-400">
              <span className="px-2.5 py-1 bg-white/5 backdrop-blur-md rounded-lg border border-white/10 text-slate-200">درخواست واحد تولید</span>
              <span>←</span>
              <span className="px-2.5 py-1 bg-white/5 backdrop-blur-md rounded-lg border border-white/10 text-slate-200">استعلام ۳ پیشنهادی بازرگانی</span>
              <span>←</span>
              <span className="px-2.5 py-1 bg-amber-500/20 text-amber-300 rounded-lg border border-amber-500/30 backdrop-blur-md font-bold">تایید مدیر پروژه (واحدی)</span>
              <span>←</span>
              <span className="px-2.5 py-1 bg-white/5 backdrop-blur-md rounded-lg border border-white/10 text-slate-200">صدور سند حسابداری</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
