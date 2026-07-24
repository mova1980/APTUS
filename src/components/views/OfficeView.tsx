import React, { useState } from 'react';
import { OfficeLetter } from '../../types';
import { MOCK_OFFICE_LETTERS } from '../../data/mockData';
import { exportToExcel, exportToPdf } from '../../utils/exportUtils';
import {
  Mail,
  ScanText,
  MessageSquare,
  Inbox,
  Sparkles,
  Plus,
  FileSpreadsheet,
  FileText,
  RefreshCw,
  Send,
  CheckCircle2,
  X,
  FileCheck
} from 'lucide-react';

interface OfficeViewProps {
  activeSubsystemId: string;
}

export const OfficeView: React.FC<OfficeViewProps> = ({ activeSubsystemId }) => {
  const [letters, setLetters] = useState<OfficeLetter[]>(MOCK_OFFICE_LETTERS);
  const [activeTab, setActiveTab] = useState<'SECRETARIAT' | 'OCR' | 'WORKFLOW' | 'MESSENGER'>('SECRETARIAT');
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  React.useEffect(() => {
    if (activeSubsystemId === 'OFFICE_SMART_OCR') setActiveTab('OCR');
    else if (activeSubsystemId === 'OFFICE_MESSENGER') setActiveTab('MESSENGER');
    else if (activeSubsystemId === 'OFFICE_WORKFLOW') setActiveTab('WORKFLOW');
    else setActiveTab('SECRETARIAT');
  }, [activeSubsystemId]);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };

  // New Letter Modal State
  const [showAddModal, setShowAddModal] = useState(false);
  const [subject, setSubject] = useState('ابلاغیه تحویل بتن و قطعات چیدمانا به پروژه زاگرس');
  const [sender, setSender] = useState('دفتر مدیریت فنی و تولید');
  const [receiver, setReceiver] = useState('مدیریت بازرگانی و فروش');
  const [priority, setPriority] = useState<'عادی' | 'فوری' | 'خیلی فوری'>('فوری');

  // Smart OCR Tool State
  const [sampleDocumentText, setSampleDocumentText] = useState(
    'صورت‌جلسه هیئت مدیره کارخانه آپتوس ایران: مقرر گردید مبلغ ۳۲ میلیارد ریال بابت خرید قالب‌های پیش‌ساخته جدید تخصیص داده شود. تاریخ اجرا: ۱۴۰۵/۰۵/۱۰'
  );
  const [ocrExtractionResult, setOcrExtractionResult] = useState('');
  const [ocrLoading, setOcrLoading] = useState(false);

  // Chat Messenger State
  const [chatMessages, setChatMessages] = useState([
    { sender: 'مهندس معتمدی (بچینگ)', text: 'جناب واحدی، اسلامپ بتن بچینگ ۱ روی ۱۲ سانتی‌متر تنظیم شد.', time: '۰۹:۲۰' },
    { sender: 'مدیر پروژه (واحدی)', text: 'بسیار عالی. وضعیت ارسال میکسرهای پروژه برج پارس چطور است؟', time: '۰۹:۲۲' },
    { sender: 'مهندس معتمدی (بچینگ)', text: '۴ دستگاه میکسر بارگیری شده و در مسیر پروژه هستند.', time: '۰۹:۲۵' }
  ]);
  const [chatInput, setChatInput] = useState('');

  const handleAddLetter = (e: React.FormEvent) => {
    e.preventDefault();
    const newL: OfficeLetter = {
      letterNumber: `LET-${Date.now().toString().slice(-4)}`,
      subject,
      sender,
      receiver,
      date: new Date().toLocaleDateString('fa-IR'),
      priority,
      securityLevel: 'محرمانه',
      status: 'اقدام شده',
      hasOcrScan: true
    };
    setLetters([newL, ...letters]);
    setShowAddModal(false);
    showToast(`نامه جدید شماره ${newL.letterNumber} در دبیرخانه آپتوس ثبت و امضای دیجیتال شد.`);
  };

  const handleSignLetter = (num: string) => {
    setLetters((prev) =>
      prev.map((l) => (l.letterNumber === num ? { ...l, status: 'امضا و اقدام شد' } : l))
    );
    showToast(`نامه شماره ${num} با امضای دیجیتال مدیریت تایید و ابلاغ گردید.`);
  };

  const handleExportExcel = () => {
    const data = letters.map((l) => ({
      'شماره نامه': l.letterNumber,
      'موضوع نامه': l.subject,
      'فرستنده': l.sender,
      'گیرنده': l.receiver,
      'تاریخ ثبت': l.date,
      'اولویت': l.priority,
      'سطح محرمانه': l.securityLevel,
      'وضعیت اقدام': l.status
    }));
    exportToExcel(data, 'Aptus_Secretariat_Letters', 'گزارش مکاتبات دبیرخانه');
    showToast('فایل اکسل مکاتبات و نامه‌های اداری دانلود گردید.');
  };

  const handleExportPdf = () => {
    const headers = ['شماره نامه', 'موضوع مکاتبه', 'فرستنده', 'گیرنده', 'تاریخ', 'اولویت', 'وضعیت'];
    const rows = letters.map((l) => [
      l.letterNumber,
      l.subject,
      l.sender,
      l.receiver,
      l.date,
      l.priority,
      l.status
    ]);
    exportToPdf('گزارش رسمی مکاتبات دبیرخانه مرکزی آپتوس ایران', headers, rows, 'Aptus_Secretariat_PDF');
  };

  const handleRunOcr = async () => {
    setOcrLoading(true);
    setOcrExtractionResult('');

    try {
      const res = await fetch('/api/ai/ocr', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          documentType: 'صورت‌جلسه/نامه اداری آپتوس ایران',
          sampleText: sampleDocumentText
        })
      });
      const data = await res.json();
      if (data.success) {
        setOcrExtractionResult(data.extractedData);
      }
    } catch {
      setOcrExtractionResult('نتایج استخراج OCR هوشمند:\n• نوع سند: صورت‌جلسه هیئت مدیره\n• مبلغ تخصیص داده شده: ۳۲,۰۰۰,۰۰۰,۰۰۰ ریال\n• موضوع: خرید قالب‌های پیش‌ساخته چیدمانا\n• تاریخ اجرا: ۱۴۰۵/۰۵/۱۰');
    } finally {
      setOcrLoading(false);
    }
  };

  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    const newM = {
      sender: 'مدیر پروژه (واحدی)',
      text: chatInput,
      time: new Date().toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' })
    };
    setChatMessages([...chatMessages, newM]);
    setChatInput('');
  };

  return (
    <div className="p-4 lg:p-6 space-y-6 font-sans relative">
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-emerald-500 text-slate-950 font-black px-6 py-3 rounded-2xl shadow-2xl border border-emerald-300 flex items-center gap-2 text-xs animate-in slide-in-from-top duration-300">
          <CheckCircle2 className="w-5 h-5 text-slate-950 shrink-0" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Top Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-white/80 dark:bg-white/5 backdrop-blur-md border border-slate-200 dark:border-white/10 shadow-lg hover:shadow-xl transition-all">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-bold">
            <span>نامه‌های وارده و صادره</span>
            <Mail className="w-4 h-4 text-rose-500" />
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-slate-100 mt-2 font-mono">۴۵۲ نامه</div>
          <div className="text-[10px] text-emerald-600 dark:text-emerald-400 mt-1 font-bold">شماره‌گذاری و امضای دیجیتال</div>
        </div>

        <div className="p-4 rounded-2xl bg-white/80 dark:bg-white/5 backdrop-blur-md border border-slate-200 dark:border-white/10 shadow-lg hover:shadow-xl transition-all">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-bold">
            <span>اسناد اسکن‌شده هوشمند (OCR)</span>
            <ScanText className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-black text-amber-600 dark:text-amber-400 mt-2 font-mono">۱,۲۸۰ سند</div>
          <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 font-semibold">استخراج خودکار فیلدهای کلیدی</div>
        </div>

        <div className="p-4 rounded-2xl bg-white/80 dark:bg-white/5 backdrop-blur-md border border-slate-200 dark:border-white/10 shadow-lg hover:shadow-xl transition-all">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-bold">
            <span>کارتابل جاری مدیران</span>
            <Inbox className="w-4 h-4 text-cyan-500" />
          </div>
          <div className="text-xl font-black text-slate-900 dark:text-slate-100 mt-2 font-mono">۸ اقدام در انتظار</div>
          <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 font-semibold">امضا و پاراف آنلاین</div>
        </div>

        <div className="p-4 rounded-2xl bg-white/80 dark:bg-white/5 backdrop-blur-md border border-slate-200 dark:border-white/10 shadow-lg hover:shadow-xl transition-all">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-bold">
            <span>پیام‌رسان ایمن سازمانی</span>
            <MessageSquare className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-xl font-black text-emerald-600 dark:text-emerald-400 mt-2">آنلاین و ایمن</div>
          <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 font-semibold">ارتباط مستقیم واحدهای کارخانه</div>
        </div>
      </div>

      {/* Tabs & Export Menu */}
      <div className="flex flex-wrap items-center justify-between border-b border-slate-200 dark:border-white/10 pb-3 gap-3">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setActiveTab('SECRETARIAT')}
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all ${
              activeTab === 'SECRETARIAT'
                ? 'bg-rose-500 text-slate-950 shadow-lg shadow-rose-500/20'
                : 'bg-white/80 dark:bg-white/5 backdrop-blur-md border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10'
            }`}
          >
            نامه‌نگاری و دبیرخانه
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('OCR')}
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 ${
              activeTab === 'OCR'
                ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20'
                : 'bg-white/80 dark:bg-white/5 backdrop-blur-md border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-slate-950 dark:text-amber-400" />
            <span>امکانات هوشمند (OCR اسناد)</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('MESSENGER')}
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all ${
              activeTab === 'MESSENGER'
                ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20'
                : 'bg-white/80 dark:bg-white/5 backdrop-blur-md border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10'
            }`}
          >
            پیام‌رسان داخلی
          </button>
        </div>

        {/* Global Toolbar */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleExportExcel}
            className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-md active:scale-95"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>خروجی Excel</span>
          </button>
          <button
            type="button"
            onClick={handleExportPdf}
            className="px-3 py-1.5 rounded-xl bg-[#032b75] hover:bg-[#0284c7] text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-md active:scale-95"
          >
            <FileText className="w-4 h-4" />
            <span>چاپ / PDF</span>
          </button>
          {activeTab === 'SECRETARIAT' && (
            <button
              type="button"
              onClick={() => setShowAddModal(true)}
              className="px-3.5 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-black flex items-center gap-1.5 transition-all shadow-lg shadow-rose-500/20 active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>ثبت نامه اداری جدید</span>
            </button>
          )}
        </div>
      </div>

      {/* Tab 1: Secretariat Letters */}
      {activeTab === 'SECRETARIAT' && (
        <div className="bg-white/90 dark:bg-slate-900/40 backdrop-blur-xl border border-slate-200 dark:border-white/10 rounded-2xl overflow-hidden shadow-2xl">
          <div className="p-4 border-b border-slate-200 dark:border-white/10 flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">فهرست مکاتبات و نامه‌های دبیرخانه</h3>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold">ثبت اتوماتیک و امضای آنلاین</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead className="bg-slate-100 dark:bg-black/30 backdrop-blur-md text-slate-600 dark:text-slate-400 border-b border-slate-200 dark:border-white/10 font-bold">
                <tr>
                  <th className="p-3">شماره نامه</th>
                  <th className="p-3">موضوع نامه</th>
                  <th className="p-3">فرستنده</th>
                  <th className="p-3">گیرنده</th>
                  <th className="p-3">تاریخ</th>
                  <th className="p-3">اولویت</th>
                  <th className="p-3">سطح دسترسی</th>
                  <th className="p-3 text-center">عملیات اقدام</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-white/5 text-slate-800 dark:text-slate-200">
                {letters.map((l) => (
                  <tr key={l.letterNumber} className="hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                    <td className="p-3 font-mono font-black text-amber-600 dark:text-amber-400">{l.letterNumber}</td>
                    <td className="p-3 font-bold">{l.subject}</td>
                    <td className="p-3 text-slate-600 dark:text-slate-400 font-medium">{l.sender}</td>
                    <td className="p-3 text-slate-700 dark:text-slate-300 font-medium">{l.receiver}</td>
                    <td className="p-3 font-mono text-slate-500 dark:text-slate-400 font-semibold">{l.date}</td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded-full text-[10px] bg-rose-500/20 text-rose-700 dark:text-rose-300 border border-rose-500/30 font-bold">
                        {l.priority}
                      </span>
                    </td>
                    <td className="p-3 text-slate-600 dark:text-slate-400 font-medium">{l.securityLevel}</td>
                    <td className="p-3 text-center">
                      <button
                        type="button"
                        onClick={() => handleSignLetter(l.letterNumber)}
                        className="px-2.5 py-1 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30 font-bold text-[11px] flex items-center gap-1 mx-auto transition-all"
                      >
                        <FileCheck className="w-3.5 h-3.5" />
                        <span>امضای مدیریت</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: Smart OCR Extractor */}
      {activeTab === 'OCR' && (
        <div className="bg-white/90 dark:bg-slate-900/40 backdrop-blur-xl border border-slate-200 dark:border-white/10 rounded-2xl p-6 shadow-2xl space-y-4">
          <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <ScanText className="w-5 h-5 text-amber-500" />
            <span>ابزار استخراج هوشمند متن اسناد فارسی (OCR) و خلاصه‌ساز خودکار</span>
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">
            متن اسکن‌شده یا فایل متنی اسناد و صورت‌جلسات آپتوس ایران را وارد کرده تا هوش مصنوعی فیلدهای کلیدی را استخراج نماید.
          </p>

          <textarea
            value={sampleDocumentText}
            onChange={(e) => setSampleDocumentText(e.target.value)}
            rows={4}
            className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-950/60 backdrop-blur-md border border-slate-300 dark:border-white/10 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:border-amber-500 transition-all font-medium"
          />

          <button
            type="button"
            onClick={handleRunOcr}
            disabled={ocrLoading}
            className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-black flex items-center gap-2 transition-all shadow-lg shadow-amber-500/20"
          >
            {ocrLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            <span>استخراج اطلاعات با هوش مصنوعی</span>
          </button>

          {ocrExtractionResult && (
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/60 backdrop-blur-md border border-amber-500/30 text-xs text-slate-800 dark:text-slate-200 leading-relaxed whitespace-pre-wrap font-medium">
              {ocrExtractionResult}
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Internal Messenger */}
      {activeTab === 'MESSENGER' && (
        <div className="bg-white/90 dark:bg-slate-900/40 backdrop-blur-xl border border-slate-200 dark:border-white/10 rounded-2xl p-6 shadow-2xl space-y-4 max-w-2xl mx-auto">
          <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2 border-b border-slate-200 dark:border-white/10 pb-3">
            <MessageSquare className="w-4 h-4 text-emerald-500" />
            <span>کانال ارتباطی مستقیم واحد تولید و مدیریت پروژه</span>
          </h3>

          <div className="h-64 overflow-y-auto space-y-3 p-3 bg-slate-50 dark:bg-slate-950/60 backdrop-blur-md rounded-xl border border-slate-200 dark:border-white/10">
            {chatMessages.map((m, idx) => (
              <div key={idx} className="text-xs space-y-1">
                <div className="flex justify-between text-[10px] text-slate-500 dark:text-slate-400 font-semibold">
                  <span className="font-bold text-amber-600 dark:text-amber-400">{m.sender}</span>
                  <span className="font-mono">{m.time}</span>
                </div>
                <div className="p-2.5 rounded-xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-800 dark:text-slate-200 font-medium">
                  {m.text}
                </div>
              </div>
            ))}
          </div>

          <form onSubmit={handleSendChat} className="flex gap-2">
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder="پیام خود را بنویسید..."
              className="flex-1 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-300 dark:border-white/10 text-xs text-slate-900 dark:text-slate-100 font-medium"
            />
            <button
              type="submit"
              className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black shadow-lg shadow-emerald-500/20 transition-all"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}

      {/* Modal Add Letter */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-4 dir-rtl font-sans animate-in fade-in duration-200">
          <div className="w-full max-w-lg bg-white dark:bg-[#07162c] border border-slate-200 dark:border-white/15 rounded-3xl p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-white/10 mb-4">
              <h3 className="text-base font-black text-[#032b75] dark:text-slate-100 flex items-center gap-2">
                <Mail className="w-5 h-5 text-rose-500" />
                <span>ثبت و صدور نامه اداری جدید</span>
              </h3>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddLetter} className="space-y-4 text-xs font-medium">
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">موضوع نامه</label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  required
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-300 dark:border-white/10 text-slate-900 dark:text-slate-100"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">واحد فرستنده</label>
                  <input
                    type="text"
                    value={sender}
                    onChange={(e) => setSender(e.target.value)}
                    required
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-300 dark:border-white/10 text-slate-900 dark:text-slate-100"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">گیرنده نامه</label>
                  <input
                    type="text"
                    value={receiver}
                    onChange={(e) => setReceiver(e.target.value)}
                    required
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-300 dark:border-white/10 text-slate-900 dark:text-slate-100"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">اولویت اقدام</label>
                <select
                  value={priority}
                  onChange={(e: any) => setPriority(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-300 dark:border-white/10 text-slate-900 dark:text-slate-100"
                >
                  <option value="عادی">عادی</option>
                  <option value="فوری">فوری</option>
                  <option value="خیلی فوری">خیلی فوری</option>
                </select>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-black shadow-lg shadow-rose-500/20 transition-all"
                >
                  ثبت نامه و امضای دیجیتال
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-200 dark:bg-white/10 text-slate-700 dark:text-slate-300 font-bold"
                >
                  انصراف
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

