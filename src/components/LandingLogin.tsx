import React, { useState, useEffect } from 'react';
import { UserCheck, Shield, ArrowLeft, Cpu, BarChart3, Scale, ExternalLink, Globe, ShoppingBag, Home, Building2, ShieldCheck, Layers, Award, CheckCircle2 } from 'lucide-react';
import { AptusLogo } from './AptusLogo';

interface LandingLoginProps {
  onLoginSuccess: () => void;
}

const BG_IMAGES = [
  'https://lh3.googleusercontent.com/d/11prgRc8hU8OkH-ByWqZlHZ3v23UdgvH8', // Image 1
  'https://lh3.googleusercontent.com/d/1kdT5Y8yqLwQUipEMIcGZuVJaHmoPGOiJ', // Image 2
  'https://lh3.googleusercontent.com/d/1Z0Uo21kiWifXV2SESL-9dCEFT5nnZzxi', // Image 3
];

export const LandingLogin: React.FC<LandingLoginProps> = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('123');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [bgIndex, setBgIndex] = useState(0);

  // Background Image Motion Crossfade Effect
  useEffect(() => {
    const timer = setInterval(() => {
      setBgIndex((prev) => (prev + 1) % BG_IMAGES.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    setTimeout(() => {
      if (username === 'admin' && password === '123') {
        onLoginSuccess();
      } else {
        setErrorMsg('نام کاربری یا کلمه عبور اشتباه است.');
        setLoading(false);
      }
    }, 400);
  };

  return (
    <div className="min-h-screen bg-[#030c18] text-slate-100 flex flex-col justify-between relative overflow-hidden font-sans select-none">
      {/* Background Image Slider with Smooth Ken-Burns Motion Graphics Transition & Vivid Visibility */}
      {BG_IMAGES.map((img, idx) => (
        <div
          key={idx}
          className={`absolute inset-0 bg-cover bg-center transition-all duration-[2000ms] ease-in-out pointer-events-none transform ${
            idx === bgIndex
              ? 'opacity-60 scale-110 translate-x-1 translate-y-1'
              : 'opacity-0 scale-100'
          }`}
          style={{ backgroundImage: `url(${img})` }}
        />
      ))}

      {/* Huge Draft Watermark Logo Behind Everything (Even Larger & Vivid Watermark) */}
      <div className="absolute inset-0 flex items-center justify-center opacity-[0.15] pointer-events-none z-0 overflow-hidden select-none">
        <img
          src="https://lh3.googleusercontent.com/d/1OcFttaO3UODA4mCXnfCOonaJ8QXPBmaM"
          alt="Aptus Draft Logo Watermark"
          referrerPolicy="no-referrer"
          crossOrigin="anonymous"
          className="w-[1700px] h-[1700px] sm:w-[2100px] sm:h-[2100px] max-w-none object-contain filter contrast-125 saturate-125 drop-shadow-[0_0_120px_rgba(240,90,36,0.45)] animate-pulse"
        />
      </div>

      {/* Corporate Blue Tone Gradient Overlay inspired by Aptus Center Theme */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#021124]/90 via-[#032b75]/40 to-[#021124]/60 z-0 pointer-events-none" />
      <div className="absolute top-[-10%] right-[-10%] w-[700px] h-[700px] bg-[#032b75]/30 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[700px] h-[700px] bg-[#f05a24]/20 rounded-full blur-[160px] pointer-events-none" />

      {/* Top Header Navbar */}
      <header className="p-6 max-w-7xl mx-auto w-full flex items-center justify-between border-b border-white/10 z-10 backdrop-blur-md bg-white/[0.03]">
        {/* Glowing Logo */}
        <AptusLogo size="xl" glowing={true} variant="dark" />

        <div className="flex items-center gap-3">
          <a
            href="https://cnst-aptusiran.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden md:flex items-center gap-1.5 text-xs text-slate-300 hover:text-[#f05a24] transition-colors px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md"
          >
            <Globe className="w-3.5 h-3.5 text-[#38bdf8]" />
            <span>cnst-aptusiran.com</span>
            <ExternalLink className="w-3 h-3 text-slate-400" />
          </a>
          <a
            href="https://www.aptusiran.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden md:flex items-center gap-1.5 text-xs text-slate-300 hover:text-[#f05a24] transition-colors px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md"
          >
            <Globe className="w-3.5 h-3.5 text-[#38bdf8]" />
            <span>aptusiran.com</span>
            <ExternalLink className="w-3 h-3 text-slate-400" />
          </a>

          <span className="text-xs font-mono px-3.5 py-1 rounded-full bg-[#f05a24]/10 text-[#f05a24] border border-[#f05a24]/30 backdrop-blur-md font-bold shadow-sm">
            Aptus ERP v2026.1 Enterprise
          </span>
        </div>
      </header>

      {/* Main Content Grid: Hero Banner + Login Card */}
      <main className="max-w-7xl mx-auto w-full px-6 py-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center z-10 flex-1">
        {/* Left Side: Aptus Highlights & 3 Core Divisions */}
        <div className="lg:col-span-7 space-y-6">
          {/* Executive Corporate Title Badge - High Class Non-AI */}
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-[#032b75]/50 border border-[#0284c7]/50 shadow-md backdrop-blur-2xl">
            <ShieldCheck className="w-4 h-4 text-[#38bdf8]" />
            <span className="text-xs font-bold tracking-wider text-slate-200 font-mono">
              NEXT-GEN ENTERPRISE PLATFORM
            </span>
          </div>

          {/* APTUS Ai ERP Motion Graphic English Heading - Regular / Non-bold */}
          <div className="space-y-1.5">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-normal font-mono tracking-tight text-white drop-shadow-[0_0_25px_rgba(240,90,36,0.3)] flex items-center gap-3">
              <span className="font-normal bg-gradient-to-r from-amber-200 via-[#f05a24] to-[#38bdf8] bg-clip-text text-transparent transform hover:scale-[1.02] transition-transform inline-block">
                APTUS Ai ERP
              </span>
            </h1>
            <p className="text-[#38bdf8] font-bold text-base sm:text-lg tracking-wide flex items-center gap-2">
              <Building2 className="w-5 h-5 text-[#f05a24]" />
              <span>سامانه یکپارچه مدیریت منابع شرکت ساختمانی آپتوس ایران</span>
            </p>
          </div>

          {/* 3 Core Divisions Bar - Glass Motion Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-2">
            <div className="p-4 rounded-2xl bg-white/[0.04] border border-white/10 hover:border-[#0284c7]/50 backdrop-blur-2xl text-right space-y-1 hover:-translate-y-1.5 transition-all duration-300 shadow-xl group">
              <div className="text-[#38bdf8] font-bold text-xs flex items-center gap-2">
                <Home className="w-4 h-4 text-[#f05a24] group-hover:scale-110 transition-transform" />
                <span>سیستم‌های پیش‌ساخته (APS)</span>
              </div>
              <p className="text-[11px] text-slate-300/90 leading-tight">خانه‌های پیش‌ساخته چیدمانا و دیوارهای بتنی</p>
            </div>

            <div className="p-4 rounded-2xl bg-white/[0.04] border border-white/10 hover:border-[#0284c7]/50 backdrop-blur-2xl text-right space-y-1 hover:-translate-y-1.5 transition-all duration-300 shadow-xl group">
              <div className="text-[#38bdf8] font-bold text-xs flex items-center gap-2">
                <Building2 className="w-4 h-4 text-[#f05a24] group-hover:scale-110 transition-transform" />
                <span>شرکت ساختمانی آپتوس</span>
              </div>
              <p className="text-[11px] text-slate-300/90 leading-tight">اجرای پروژه‌های بزرگ عمرانی و تجاری</p>
            </div>

            <div className="p-4 rounded-2xl bg-white/[0.04] border border-white/10 hover:border-[#0284c7]/50 backdrop-blur-2xl text-right space-y-1 hover:-translate-y-1.5 transition-all duration-300 shadow-xl group">
              <div className="text-[#38bdf8] font-bold text-xs flex items-center gap-2">
                <ShoppingBag className="w-4 h-4 text-[#f05a24] group-hover:scale-110 transition-transform" />
                <span>فروشگاه آنلاین Aptus</span>
              </div>
              <p className="text-[11px] text-slate-300/90 leading-tight">عرضه مستقیم محصولات و سفارش آنلاین</p>
            </div>
          </div>

          {/* Key Capabilities Grid - High Class Blur Motion Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
            <div className="p-4 rounded-2xl bg-white/[0.03] backdrop-blur-2xl border border-white/10 hover:border-[#f05a24]/40 hover:-translate-y-1.5 transition-all duration-300 flex items-start gap-3 shadow-xl group">
              <Scale className="w-5 h-5 text-[#f05a24] shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
              <div>
                <h4 className="text-xs font-bold text-slate-100">مدیریت محصولات بتنی آپتوس</h4>
                <p className="text-[11px] text-slate-300/80 mt-1 leading-snug">بتن آماده، کفپوش، بلوک سبک، نیوجرسی، بتن غلطکی و پنل نما</p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white/[0.03] backdrop-blur-2xl border border-white/10 hover:border-emerald-400/40 hover:-translate-y-1.5 transition-all duration-300 flex items-start gap-3 shadow-xl group">
              <Cpu className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
              <div>
                <h4 className="text-xs font-bold text-slate-100">بهای تمام شده به لحظه (Costing)</h4>
                <p className="text-[11px] text-slate-300/80 mt-1 leading-snug">محاسبه آنلاین هزینه‌های هر مترمکعب بتن و قطعات APS</p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white/[0.03] backdrop-blur-2xl border border-white/10 hover:border-cyan-400/40 hover:-translate-y-1.5 transition-all duration-300 flex items-start gap-3 shadow-xl group">
              <BarChart3 className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
              <div>
                <h4 className="text-xs font-bold text-slate-100">استعلام‌های مالیاتی ۱۴۰۵+</h4>
                <p className="text-[11px] text-slate-300/80 mt-1 leading-snug">سامانه مودیان، ارزش افزوده، ماده ۱۰۴ و گزارشات دارایی</p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white/[0.03] backdrop-blur-2xl border border-white/10 hover:border-purple-400/40 hover:-translate-y-1.5 transition-all duration-300 flex items-start gap-3 shadow-xl group">
              <Shield className="w-5 h-5 text-purple-400 shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
              <div>
                <h4 className="text-xs font-bold text-slate-100">اتصال به دیتابیس مرجع SQL Server</h4>
                <p className="text-[11px] text-slate-300/80 mt-1 leading-snug">پایش و همگام‌سازی قبوض باسکول، انبار و منابع انسانی</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: High Class Login Form Box matching Aptus Theme */}
        <div className="lg:col-span-5">
          <div className="p-8 rounded-3xl bg-[#081b33]/60 border border-white/15 shadow-[0_25px_60px_rgba(0,0,0,0.5)] backdrop-blur-3xl relative hover:border-[#0284c7]/40 transition-all">
            <div className="mb-6 text-center">
              <div className="w-14 h-14 rounded-2xl bg-[#032b75]/60 border border-[#0284c7]/40 text-[#38bdf8] mx-auto flex items-center justify-center mb-3 backdrop-blur-md shadow-lg">
                <UserCheck className="w-7 h-7 text-[#f05a24]" />
              </div>
              <h3 className="text-lg font-bold text-slate-100">ورود به پنل مدیریت شرکت آپتوس</h3>
              <p className="text-xs text-slate-300 mt-1">احراز هویت اعضای هیئت مدیره و سرپرستان</p>
            </div>

            {errorMsg && (
              <div className="mb-4 p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs text-center font-medium backdrop-blur-md">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-200 mb-1.5">
                  نام کاربری (Username)
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="admin"
                  required
                  className="w-full px-4 py-2.5 rounded-xl bg-[#030c18]/70 backdrop-blur-md border border-white/10 text-slate-100 text-sm placeholder-slate-500 focus:outline-none focus:border-[#f05a24]/60 dir-ltr text-left transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-200 mb-1.5">
                  کلمه عبور (Password)
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="123"
                  required
                  className="w-full px-4 py-2.5 rounded-xl bg-[#030c18]/70 backdrop-blur-md border border-white/10 text-slate-100 text-sm placeholder-slate-500 focus:outline-none focus:border-[#f05a24]/60 dir-ltr text-left transition-all"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#f05a24] via-[#ea580c] to-[#d94310] hover:from-[#ea580c] hover:to-[#f05a24] text-white font-black text-sm shadow-xl shadow-orange-500/20 transition-all flex items-center justify-center gap-2 mt-2"
              >
                {loading ? (
                  <span>در حال بررسی اعتبارنامه...</span>
                ) : (
                  <>
                    <span>ورود به سامانه شرکت آپتوس</span>
                    <ArrowLeft className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-[11px] text-slate-400">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                دیتابیس مرجع SQL Server متصل
              </span>
              <span className="font-mono text-slate-400">SSL 256-bit</span>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="p-4 border-t border-white/10 max-w-7xl mx-auto w-full flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 z-10 gap-2">
        <div>
          کلیه حقوق این سامانه متعلق به <span className="text-slate-200 font-bold">شرکت ساختمانی آپتوس ایران</span> می‌باشد.
        </div>
        <div className="flex items-center gap-4">
          <span>واحد انفورماتیک و هوش مصنوعی آپتوس</span>
          <span>•</span>
          <span className="font-mono text-slate-400">1405 © Aptus Iran</span>
        </div>
      </footer>
    </div>
  );
};
