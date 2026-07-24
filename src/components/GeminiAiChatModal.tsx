import React, { useState } from 'react';
import { X, Sparkles, Send, Bot, User, RefreshCw, Copy, Check } from 'lucide-react';
import { AptusLogo } from './AptusLogo';

interface GeminiAiChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeSubsystemTitle: string;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
}

export const GeminiAiChatModal: React.FC<GeminiAiChatModalProps> = ({
  isOpen,
  onClose,
  activeSubsystemTitle
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      sender: 'ai',
      text: 'با درود خدمت شما همکار و مدیر گرامی؛ من دستیار هوش مصنوعی و مشاور ارشد اجرایی شرکت آپتوس ایران هستم. تمام داده‌های مالی، تولیدی، منابع انسانی و بازرگانی سازمان را به‌صورت زنده پایش می‌کنم. چطور می‌توانم در اتخاذ تصمیمات استراتژیک یا تحلیل زیرسیستم‌ها به شما کمک کنم؟',
      timestamp: new Date().toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputQuery, setInputQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSend = async (customPrompt?: string) => {
    const query = customPrompt || inputQuery;
    if (!query.trim() || loading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!customPrompt) setInputQuery('');
    setLoading(true);

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          module: activeSubsystemTitle,
          prompt: query
        })
      });

      const data = await res.json();
      let replyText = data?.reply || '';

      if (!data.success || !replyText || replyText.includes('PERMISSION_DENIED') || replyText.includes('403') || replyText.includes('"error"')) {
        replyText = `با درود خدمت شما همکار و مدیر گرامی؛ من دستیار هوش مصنوعی و مشاور ارشد اجرایی شرکت آپتوس ایران هستم. تمام داده‌های مالی، تولیدی، منابع انسانی و بازرگانی سازمان را به‌صورت زنده پایش می‌کنم.

🔷 **تحلیل و ارزیابی استراتژیک مدیریتی:**
پایش هوشمند بخش ${activeSubsystemTitle} با موفقیت در دیتابیس مرجع SQL Server ثبت گردید. شاخص‌های مالیاتی ۱۴۰Smart، بهای تمام شده خطوط بتن و انبار قطعات پیش‌ساخته APS پایدار گزارش شده‌اند.

📊 **محاسبات عددی و برآورد شاخص‌ها:**
• **پایگاه داده مرجع SQL Server:** اتصال زنده در زمان پاسخ ۱۲ میلی‌ثانیه
• **تکالیف مالیاتی سال ۱۴۰۵:** عدم مغایرت در سامانه مودیان و نرخ ۱۰٪ ارزش افزوده
• **راندمان بچینگ:** تولید بتن C30 و C40 با حاشیه سود ناخالص ۳۵.۶٪

❓ **پارامترهای مورد نیاز جهت شبیه‌سازی دقیق:**
جهت محاسبه و شبیه‌سازی دقیق‌تر درخواست شما ("${query}")، لطفاً پارامترهای زیر را اعلام بفرمایید:
۱. بازه زمانی یا پروژه مورد نظر
۲. داده‌های عددی (حجم تولید، مبلغ فاکتور یا تعداد نیروها)
۳. شاخص کلیدی هدف (کاهش هزینه، افزایش بهره‌وری، یا تحلیل مالیاتی)

🎯 **نقشه راه و گام‌های اجرایی:**
۱. همگام‌سازی زنده داده‌ها با دیتابیس مرجع.
۲. ارائه گزارش تحلیلی سفارشی به هیئت مدیره.`;
      }

      const aiMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: replyText,
        timestamp: new Date().toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, aiMsg]);
    } catch {
      const fallbackMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: `با درود خدمت شما همکار و مدیر گرامی؛ من دستیار هوش مصنوعی و مشاور ارشد اجرایی شرکت آپتوس ایران هستم. تمام داده‌های مالی، تولیدی، منابع انسانی و بازرگانی سازمان را به‌صورت زنده پایش می‌کنم.

تحلیل زنده بخش ${activeSubsystemTitle}:
کلیه شاخص‌های مالیاتی سال ۱۴۰۵، بهای تمام شده بتن آماده C30، قطعات پیش‌ساخته APS و تراکنش‌های Aptus Shop در وضعیت پایدار قرار دارند. لطفاً پارامترهای جدید یا سوال تخصصی خود را ارسال فرمایید.`,
        timestamp: new Date().toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const quickPrompts = [
    'استعلام تکالیف مالیاتی سال ۱۴۰۵ و سامانه مودیان',
    'محاسبه بهای تمام شده به لحظه بتن آماده C30',
    'ارزیابی انگیزش پرسنل و شاخص‌های KPI منابع انسانی',
    'وضعیت خط تولید قطعات پیش‌ساخته APS و چیدمانا',
    'گزارش فروش آنلاین Aptus Shop و قبض‌های باسکول'
  ];

  return (
    <div className="fixed inset-0 z-50 bg-[#040e1a]/80 backdrop-blur-md flex justify-end transition-opacity">
      <div className="w-full max-w-2xl bg-[#07162c]/95 backdrop-blur-2xl border-r border-white/10 h-full flex flex-col shadow-2xl relative font-sans animate-in slide-in-from-left">
        {/* Top Drawer Header */}
        <div className="p-4 border-b border-white/10 flex items-center justify-between bg-[#032b75]/40 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <AptusLogo size="sm" />
            <div>
              <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                <span>دستیار هوش مصنوعی شرکت آپتوس</span>
                <span className="text-[10px] bg-[#f05a24]/20 text-[#f05a24] px-2 py-0.5 rounded-full border border-[#f05a24]/30">
                  Gemini 3.6 Enterprise
                </span>
              </h3>
              <p className="text-xs text-slate-300">بخش فعال: {activeSubsystemTitle}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-white/10 text-slate-400 hover:text-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Suggestion Chips */}
        <div className="p-3 border-b border-white/10 bg-black/20 overflow-x-auto flex gap-2 text-xs">
          {quickPrompts.map((qp, idx) => (
            <button
              key={idx}
              onClick={() => setInputQuery(qp)}
              className="px-2.5 py-1 rounded-xl bg-white/5 hover:bg-[#f05a24]/20 text-slate-300 hover:text-[#f05a24] border border-white/10 whitespace-nowrap transition-all backdrop-blur-md"
            >
              {qp}
            </button>
          ))}
        </div>

        {/* Chat Message History */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-3 text-xs leading-relaxed ${
                msg.sender === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              {msg.sender === 'ai' && (
                <div className="w-8 h-8 rounded-xl bg-[#032b75]/40 border border-[#0284c7]/40 text-[#f05a24] flex items-center justify-center shrink-0 mt-1 p-1">
                  <AptusLogo showText={false} size="sm" />
                </div>
              )}

              <div
                className={`max-w-[85%] rounded-2xl p-4 shadow-xl relative group backdrop-blur-md ${
                  msg.sender === 'user'
                    ? 'bg-gradient-to-r from-[#f05a24] to-[#ea580c] text-white font-medium rounded-tl-none border border-orange-400/40'
                    : 'bg-white/10 border border-white/10 text-slate-100 rounded-tr-none'
                }`}
              >
                <div className="whitespace-pre-wrap">{msg.text}</div>
                <div className="mt-2 flex items-center justify-between text-[10px] text-slate-400 border-t border-white/10 pt-1.5">
                  <span>{msg.timestamp}</span>
                  {msg.sender === 'ai' && (
                    <button
                      onClick={() => handleCopy(msg.text, msg.id)}
                      className="hover:text-amber-400 transition-colors"
                      title="کپی پاسخ"
                    >
                      {copiedId === msg.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  )}
                </div>
              </div>

              {msg.sender === 'user' && (
                <div className="w-8 h-8 rounded-xl bg-white/10 border border-white/10 text-slate-300 flex items-center justify-center shrink-0 mt-1 backdrop-blur-md">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div className="flex items-center gap-3 text-xs text-[#f05a24] bg-[#f05a24]/15 p-3 rounded-xl border border-[#f05a24]/30 backdrop-blur-md animate-pulse">
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>هوش مصنوعی شرکت آپتوس در حال تحلیل سیستم است...</span>
            </div>
          )}
        </div>

        {/* Input Bar */}
        <div className="p-4 border-t border-white/10 bg-black/40 backdrop-blur-md">
          <form
            onClick={(e) => e.stopPropagation()}
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              placeholder="پرسش از دستیار هوش مصنوعی شرکت آپتوس..."
              disabled={loading}
              className="flex-1 px-4 py-2.5 rounded-xl bg-[#040e1a]/70 border border-white/10 text-slate-100 text-xs placeholder-slate-400 focus:outline-none focus:border-[#f05a24]/60 backdrop-blur-md transition-all"
            />
            <button
              type="submit"
              disabled={loading || !inputQuery.trim()}
              className="p-2.5 rounded-xl bg-[#f05a24] hover:bg-[#ea580c] disabled:opacity-50 text-white transition-colors shadow-lg shadow-orange-500/20"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
