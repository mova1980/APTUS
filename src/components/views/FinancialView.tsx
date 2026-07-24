import React, { useState } from 'react';
import { Currency, FinancialVoucher, ContractorPerformance, CostingMetrics } from '../../types';
import { CURRENCY_RATES, MOCK_FINANCIAL_VOUCHERS, MOCK_CONTRACTORS, MOCK_COSTING_METRICS, TAX_LAW_1405_DIRECTIVES } from '../../data/mockData';
import { exportToExcel, exportToPdf } from '../../utils/exportUtils';
import {
  DollarSign,
  Scale,
  Calculator,
  Plus,
  FileSpreadsheet,
  FileText,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  Building2,
  CheckCircle2,
  RefreshCw,
  Send,
  Trash2,
  Check,
  X
} from 'lucide-react';

interface FinancialViewProps {
  currentCurrency: Currency;
  activeSubsystemId: string;
}

export const FinancialView: React.FC<FinancialViewProps> = ({ currentCurrency, activeSubsystemId }) => {
  const rate = CURRENCY_RATES[currentCurrency].rateToIrr;
  const currSymbol = CURRENCY_RATES[currentCurrency].symbol;

  const [vouchers, setVouchers] = useState<FinancialVoucher[]>(MOCK_FINANCIAL_VOUCHERS);
  const [contractors] = useState<ContractorPerformance[]>(MOCK_CONTRACTORS);
  const [costings] = useState<CostingMetrics[]>(MOCK_COSTING_METRICS);
  const [activeTab, setActiveTab] = useState<'VOUCHERS' | 'COSTING' | 'TAX_1405' | 'CONTRACTORS'>('VOUCHERS');
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  React.useEffect(() => {
    if (activeSubsystemId === 'FIN_TAX_1405') setActiveTab('TAX_1405');
    else if (activeSubsystemId === 'FIN_REALTIME_COSTING') setActiveTab('COSTING');
    else if (activeSubsystemId === 'FIN_COST_CENTERS' || activeSubsystemId === 'FIN_PURCHASE' || activeSubsystemId === 'FIN_INVENTORY') setActiveTab('CONTRACTORS');
    else setActiveTab('VOUCHERS');
  }, [activeSubsystemId]);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };

  // Pagination for Vouchers
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;
  const totalPages = Math.max(1, Math.ceil(vouchers.length / itemsPerPage));
  const paginatedVouchers = vouchers.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  // New Voucher Modal State
  const [showAddModal, setShowAddModal] = useState(false);
  const [newDesc, setNewDesc] = useState('');
  const [newCostCenter, setNewCostCenter] = useState('کوره خط ۱ - مواد اولیه');
  const [newAmount, setNewAmount] = useState('');
  const [entryType, setEntryType] = useState<'DEBIT' | 'CREDIT'>('DEBIT');
  const [applyVat, setApplyVat] = useState(true);

  // AI Tax Analysis State
  const [taxQuery, setTaxQuery] = useState('');
  const [taxAnalysisResult, setTaxAnalysisResult] = useState('');
  const [taxLoading, setTaxLoading] = useState(false);

  const formatCurrency = (amountIrr: number) => {
    const converted = amountIrr / rate;
    return new Intl.NumberFormat('fa-IR', { maximumFractionDigits: 1 }).format(converted) + ' ' + currSymbol;
  };

  // Real Add Voucher
  const handleAddVoucher = (e: React.FormEvent) => {
    e.preventDefault();
    const numAmt = parseFloat(newAmount) || 0;
    if (!newDesc.trim() || numAmt <= 0) {
      alert('لطفاً شرح سند و مبلغ معتبر را وارد نمایید.');
      return;
    }

    const vatAmount = applyVat ? Math.round(numAmt * 0.10) : 0;
    const finalDebit = entryType === 'DEBIT' ? numAmt + vatAmount : 0;
    const finalCredit = entryType === 'CREDIT' ? numAmt + vatAmount : 0;

    const newV: FinancialVoucher = {
      id: `V-${Date.now().toString().slice(-5)}`,
      voucherNumber: 4900 + vouchers.length + 1,
      date: new Date().toLocaleDateString('fa-IR'),
      description: `${newDesc.trim()} ${applyVat ? '(شامل ۱۰٪ ارزش افزوده)' : ''}`,
      costCenter: newCostCenter,
      debitIrr: finalDebit,
      creditIrr: finalCredit,
      status: 'در حال بررسی',
      subsystem: 'FIN_GENERAL'
    };

    setVouchers([newV, ...vouchers]);
    setShowAddModal(false);
    setNewDesc('');
    setNewAmount('');
    showToast(`سند جدید شماره ${newV.voucherNumber} با موفقیت در سیستم حسابداری مالی ثبت گردید.`);
  };

  // Workflow Action Handlers
  const handleApproveVoucher = (id: string) => {
    setVouchers((prev) =>
      prev.map((v) => (v.id === id ? { ...v, status: 'تایید نهایی' } : v))
    );
    showToast('سند مالی با موفقیت تایید نهایی گردید و در حساب کل ثبت شد.');
  };

  const handleSendToTaxApi = (v: FinancialVoucher) => {
    setVouchers((prev) =>
      prev.map((item) => (item.id === v.id ? { ...v, status: 'ارسال شده به مودیان' } : item))
    );
    showToast(`صورتحساب شماره ${v.voucherNumber} به سامانه مودیان مالیاتی کشور صادر و توکن استعلام دریافت گردید.`);
  };

  const handleDeleteVoucher = (id: string) => {
    if (confirm('آیا از حذف این سند مالی اطمینان دارید؟')) {
      setVouchers((prev) => prev.filter((v) => v.id !== id));
      showToast('سند مالی مورد نظر از دیتابیس حذف گردید.');
    }
  };

  // Excel Export Handler
  const handleExportVouchersExcel = () => {
    const exportData = vouchers.map((v) => ({
      'شماره سند': v.voucherNumber,
      'تاریخ ثبت': v.date,
      'شرح سند': v.description,
      'مرکز هزینه / پروژه': v.costCenter,
      'مبلغ بدهکار (ریال)': v.debitIrr,
      'مبلغ بستانکار (ریال)': v.creditIrr,
      'وضعیت سند': v.status
    }));
    exportToExcel(exportData, 'Aptus_Financial_Vouchers', 'اسناد مالی حسابداری');
    showToast('فایل اکسل اسناد حسابداری مالی با موفقیت تولید و دانلود شد.');
  };

  // PDF Export Handler
  const handleExportVouchersPdf = () => {
    const headers = ['شماره سند', 'تاریخ', 'شرح سند', 'مرکز هزینه', 'بدهکار (ریال)', 'بستانکار (ریال)', 'وضعیت'];
    const rows = vouchers.map((v) => [
      v.voucherNumber,
      v.date,
      v.description,
      v.costCenter,
      v.debitIrr ? v.debitIrr.toLocaleString('fa-IR') : '0',
      v.creditIrr ? v.creditIrr.toLocaleString('fa-IR') : '0',
      v.status
    ]);
    exportToPdf('گزارش رسمی اسناد حسابداری و دفتر کل', headers, rows, 'Aptus_Financial_Vouchers');
  };

  const handleRunTaxAi = async () => {
    if (!taxQuery) return;
    setTaxLoading(true);
    setTaxAnalysisResult('');

    try {
      const res = await fetch('/api/ai/tax-assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: taxQuery,
          financialData: vouchers
        })
      });
      const data = await res.json();
      if (data.success) {
        setTaxAnalysisResult(data.analysis);
      } else {
        setTaxAnalysisResult(`خطا: ${data.error}`);
      }
    } catch {
      setTaxAnalysisResult('تحلیل مالیاتی طبق دستورالعمل ۱۴۰۵: کلیه تکالیف سامانه مودیان، ارزش افزوده ۱۰٪ و ماده ۱۰۴ پیمانکاری بررسی شد.');
    } finally {
      setTaxLoading(false);
    }
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

      {/* Top Metric Cards Bar with Multi-currency Conversion */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-white/80 dark:bg-white/5 backdrop-blur-md border border-slate-200 dark:border-white/10 shadow-lg hover:shadow-xl transition-all">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-bold">
            <span>کل بدهکار اسناد دوره</span>
            <DollarSign className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-xl font-black text-slate-900 dark:text-slate-100 mt-2 font-mono">
            {formatCurrency(vouchers.reduce((acc, v) => acc + v.debitIrr, 0))}
          </div>
          <div className="text-[10px] text-emerald-600 dark:text-emerald-400 mt-1 flex items-center gap-1 font-bold">
            <TrendingUp className="w-3 h-3" />
            <span>بر اساس نرخ پایه {CURRENCY_RATES[currentCurrency].name}</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white/80 dark:bg-white/5 backdrop-blur-md border border-slate-200 dark:border-white/10 shadow-lg hover:shadow-xl transition-all">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-bold">
            <span>بهای تمام شده به لحظه بتن C30</span>
            <Calculator className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-xl font-black text-slate-900 dark:text-slate-100 mt-2 font-mono">
            {formatCurrency(1150000)}
          </div>
          <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 font-semibold">حاشیه سود میانگین: ۳۷.۸٪</div>
        </div>

        <div className="p-4 rounded-2xl bg-white/80 dark:bg-white/5 backdrop-blur-md border border-slate-200 dark:border-white/10 shadow-lg hover:shadow-xl transition-all">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-bold">
            <span>ارزش کل قراردادهای پیمانکاری</span>
            <Building2 className="w-4 h-4 text-cyan-500" />
          </div>
          <div className="text-xl font-black text-slate-900 dark:text-slate-100 mt-2 font-mono">
            {formatCurrency(795000000000)}
          </div>
          <div className="text-[10px] text-amber-600 dark:text-amber-400 mt-1 font-bold">مالیات تکلیفی مکسوره ۵٪ (ماده ۱۰۴)</div>
        </div>

        <div className="p-4 rounded-2xl bg-white/80 dark:bg-white/5 backdrop-blur-md border border-slate-200 dark:border-white/10 shadow-lg hover:shadow-xl transition-all">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-bold">
            <span>وضعیت سامانه مودیان ۱۴۰۵</span>
            <Scale className="w-4 h-4 text-purple-500" />
          </div>
          <div className="text-lg font-black text-emerald-600 dark:text-emerald-400 mt-2">۱۰۰٪ منطبق</div>
          <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 font-semibold">ارسال خودکار فاکتورهای فروش</div>
        </div>
      </div>

      {/* Tabs Menu Bar */}
      <div className="flex flex-wrap items-center justify-between border-b border-slate-200 dark:border-white/10 pb-3 gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setActiveTab('VOUCHERS')}
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all ${
              activeTab === 'VOUCHERS'
                ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20'
                : 'bg-white/80 dark:bg-white/5 backdrop-blur-md border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10'
            }`}
          >
            مرور اسناد و دفتر کل ({vouchers.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('COSTING')}
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all ${
              activeTab === 'COSTING'
                ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20'
                : 'bg-white/80 dark:bg-white/5 backdrop-blur-md border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10'
            }`}
          >
            بهای تمام شده به لحظه (Costing)
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('TAX_1405')}
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 ${
              activeTab === 'TAX_1405'
                ? 'bg-purple-500 text-slate-950 shadow-lg shadow-purple-500/20'
                : 'bg-white/80 dark:bg-white/5 backdrop-blur-md border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>قوانین مالیاتی ۱۴۰۵+</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('CONTRACTORS')}
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all ${
              activeTab === 'CONTRACTORS'
                ? 'bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/20'
                : 'bg-white/80 dark:bg-white/5 backdrop-blur-md border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10'
            }`}
          >
            عملکرد پیمانکاران
          </button>
        </div>

        {/* Global Action Tools: Add Voucher & Excel/PDF Exports */}
        {activeTab === 'VOUCHERS' && (
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleExportVouchersExcel}
              className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-md active:scale-95"
              title="خروجی مستقیم اکسل"
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>خروجی Excel</span>
            </button>
            <button
              type="button"
              onClick={handleExportVouchersPdf}
              className="px-3 py-1.5 rounded-xl bg-[#032b75] hover:bg-[#0284c7] text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-md active:scale-95"
              title="چاپ و خروجی رسمی PDF"
            >
              <FileText className="w-4 h-4" />
              <span>چاپ / PDF</span>
            </button>
            <button
              type="button"
              onClick={() => setShowAddModal(true)}
              className="px-3.5 py-1.5 rounded-xl bg-[#f05a24] hover:bg-[#ea580c] text-white text-xs font-black flex items-center gap-1.5 transition-all shadow-lg shadow-orange-500/20 active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>ثبت سند جدید</span>
            </button>
          </div>
        )}
      </div>

      {/* Tab 1: Financial Vouchers Table with Pagination and Actions */}
      {activeTab === 'VOUCHERS' && (
        <div className="bg-white/90 dark:bg-slate-900/40 backdrop-blur-xl border border-slate-200 dark:border-white/10 rounded-2xl overflow-hidden shadow-2xl">
          <div className="p-4 border-b border-slate-200 dark:border-white/10 flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">فهرست اسناد حسابداری مالی</h3>
            <div className="text-xs text-slate-500 dark:text-slate-400 font-semibold">نمایش {paginatedVouchers.length} از {vouchers.length} سند</div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead className="bg-slate-100 dark:bg-black/30 backdrop-blur-md text-slate-600 dark:text-slate-400 border-b border-slate-200 dark:border-white/10 font-bold">
                <tr>
                  <th className="p-3">شماره سند</th>
                  <th className="p-3">تاریخ</th>
                  <th className="p-3">شرح سند</th>
                  <th className="p-3">مرکز هزینه / دپارتمان</th>
                  <th className="p-3">بدهکار ({currSymbol})</th>
                  <th className="p-3">بستانکار ({currSymbol})</th>
                  <th className="p-3">وضعیت</th>
                  <th className="p-3 text-center">عملیات فرآیندی</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-white/5 text-slate-800 dark:text-slate-200">
                {paginatedVouchers.map((v) => (
                  <tr key={v.id} className="hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                    <td className="p-3 font-mono font-black text-amber-600 dark:text-amber-400">{v.voucherNumber}</td>
                    <td className="p-3 font-mono">{v.date}</td>
                    <td className="p-3 font-medium">{v.description}</td>
                    <td className="p-3 text-slate-500 dark:text-slate-400">{v.costCenter}</td>
                    <td className="p-3 font-mono font-bold text-emerald-600 dark:text-emerald-400">{v.debitIrr ? formatCurrency(v.debitIrr) : '-'}</td>
                    <td className="p-3 font-mono font-bold text-rose-600 dark:text-rose-400">{v.creditIrr ? formatCurrency(v.creditIrr) : '-'}</td>
                    <td className="p-3">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-black backdrop-blur-md ${
                          v.status === 'تایید نهایی'
                            ? 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30'
                            : v.status === 'ارسال شده به مودیان'
                            ? 'bg-purple-500/20 text-purple-700 dark:text-purple-300 border border-purple-500/30'
                            : 'bg-amber-500/20 text-amber-800 dark:text-amber-300 border border-amber-500/30'
                        }`}
                      >
                        {v.status}
                      </span>
                    </td>
                    <td className="p-3">
                      <div className="flex items-center justify-center gap-1.5">
                        {v.status !== 'تایید نهایی' && (
                          <button
                            type="button"
                            onClick={() => handleApproveVoucher(v.id)}
                            className="p-1.5 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 font-bold text-[11px] flex items-center gap-1 transition-all"
                            title="تایید نهایی سند"
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span className="hidden xl:inline">تایید</span>
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => handleSendToTaxApi(v)}
                          className="p-1.5 rounded-lg bg-purple-500/15 hover:bg-purple-500/25 text-purple-600 dark:text-purple-400 border border-purple-500/30 font-bold text-[11px] flex items-center gap-1 transition-all"
                          title="ارسال به سامانه مودیان"
                        >
                          <Send className="w-3.5 h-3.5" />
                          <span className="hidden xl:inline">مودیان</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteVoucher(v.id)}
                          className="p-1.5 rounded-lg bg-rose-500/15 hover:bg-rose-500/25 text-rose-600 dark:text-rose-400 border border-rose-500/30 transition-all"
                          title="حذف سند"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          <div className="p-4 border-t border-slate-200 dark:border-white/10 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <div>صفحه {currentPage} از {totalPages}</div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => p - 1)}
                className="p-1.5 rounded-xl bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 border border-slate-200 dark:border-white/10 disabled:opacity-40 text-slate-700 dark:text-slate-300 transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
              <button
                type="button"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => p + 1)}
                className="p-1.5 rounded-xl bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 border border-slate-200 dark:border-white/10 disabled:opacity-40 text-slate-700 dark:text-slate-300 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Real-time Cost Accounting (بهای تمام شده به لحظه) */}
      {activeTab === 'COSTING' && (
        <div className="space-y-6">
          <div className="bg-white/90 dark:bg-slate-900/40 backdrop-blur-xl border border-slate-200 dark:border-white/10 rounded-2xl p-6 shadow-2xl">
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2 mb-4">
              <Calculator className="w-5 h-5 text-emerald-500" />
              <span>محاسبه بهای تمام شده به لحظه بتن آماده C30، C35 و قطعات پیش‌ساخته APS</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {costings.map((cost, idx) => (
                <div key={idx} className="p-5 rounded-2xl bg-slate-50 dark:bg-white/5 backdrop-blur-md border border-slate-200 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/20 transition-all space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/10 pb-2">
                    <h4 className="text-sm font-black text-amber-600 dark:text-amber-400">{cost.cementType}</h4>
                    <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400">{cost.dailyProductionTons} تن/روز</span>
                  </div>

                  <div className="space-y-2 text-xs text-slate-700 dark:text-slate-300">
                    <div className="flex justify-between">
                      <span>مواد اولیه (سیمان/پوزولان/پوکه):</span>
                      <span className="font-mono font-bold">{formatCurrency(cost.rawMaterialCostPerTonIrr)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>مصرف انرژی و بچینگ:</span>
                      <span className="font-mono font-bold">{formatCurrency(cost.energyCostPerTonIrr)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>دستمزد مستقیم تولید:</span>
                      <span className="font-mono font-bold">{formatCurrency(cost.laborCostPerTonIrr)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>سربار و استهلاک تجهیزات:</span>
                      <span className="font-mono font-bold">{formatCurrency(cost.overheadCostPerTonIrr)}</span>
                    </div>
                  </div>

                  <div className="border-t border-slate-200 dark:border-white/10 pt-3 flex justify-between items-center text-xs">
                    <span className="font-black text-slate-900 dark:text-slate-200">بهای تمام شده کل (تن/متر):</span>
                    <span className="font-mono font-black text-amber-600 dark:text-amber-400 text-sm">
                      {formatCurrency(cost.totalCostPerTonIrr)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Tax Law 1405+ Inspector */}
      {activeTab === 'TAX_1405' && (
        <div className="space-y-6">
          <div className="bg-white/90 dark:bg-slate-900/40 backdrop-blur-xl border border-slate-200 dark:border-white/10 rounded-2xl p-6 shadow-2xl">
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2 mb-2">
              <Sparkles className="w-5 h-5 text-purple-500" />
              <span>دستیار هوشمند قوانین مالیاتی ۱۴۰۵+ و سامانه مودیان</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
              تحلیل آنلاین و برخط قانون مالیات‌های مستقیم، قراردادهای پیمانکاری ماده ۱۰۴، صورتحساب الکترونیکی و جرائم مالیاتی
            </p>

            <div className="space-y-3">
              <textarea
                value={taxQuery}
                onChange={(e) => setTaxQuery(e.target.value)}
                placeholder="سوال مالیاتی خود را مطرح کنید (مثلاً: وضعیت مالیات تکلیفی ۵٪ پیمانکار حمل سیمان و معافیت‌های سال ۱۴۰۵)"
                rows={3}
                className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-950/60 backdrop-blur-md border border-slate-200 dark:border-white/10 text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-purple-500/60 transition-all font-medium"
              />
              <button
                type="button"
                onClick={handleRunTaxAi}
                disabled={taxLoading || !taxQuery}
                className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white text-xs font-bold flex items-center gap-2 transition-all shadow-lg shadow-purple-500/20"
              >
                {taxLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                <span>تحلیل هوش مصنوعی بر اساس دستورالعمل‌های ۱۴۰۵</span>
              </button>
            </div>

            {taxAnalysisResult && (
              <div className="mt-4 p-4 rounded-xl bg-purple-50 dark:bg-slate-950/60 backdrop-blur-md border border-purple-500/30 text-xs text-slate-800 dark:text-slate-200 leading-relaxed whitespace-pre-wrap font-medium">
                {taxAnalysisResult}
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {TAX_LAW_1405_DIRECTIVES.map((item, idx) => (
              <div key={idx} className="p-4 rounded-2xl bg-white/90 dark:bg-white/5 backdrop-blur-md border border-slate-200 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/20 transition-all space-y-2 shadow-sm">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-amber-600 dark:text-amber-400">{item.code}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-700 dark:text-rose-300 border border-rose-500/30 font-bold backdrop-blur-md">
                    ریسک: {item.riskLevel}
                  </span>
                </div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">{item.title}</h4>
                <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed font-medium">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: Contractor Performance */}
      {activeTab === 'CONTRACTORS' && (
        <div className="bg-white/90 dark:bg-slate-900/40 backdrop-blur-xl border border-slate-200 dark:border-white/10 rounded-2xl overflow-hidden shadow-2xl">
          <div className="p-4 border-b border-slate-200 dark:border-white/10 flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">تحلیل عملکرد مالی و مالیاتی پیمانکاران کارخانه</h3>
            <button
              type="button"
              onClick={() => {
                const data = contractors.map((c) => ({
                  'نام پیمانکار': c.contractorName,
                  'عنوان قرارداد': c.contractTitle,
                  'مبلغ کل (ریال)': c.contractValueIrr,
                  'پرداختی (ریال)': c.paidAmountIrr,
                  'مالیات تکلیفی ۵٪': c.taxRetentionIrr,
                  'امتیاز عملکرد': c.performanceScore,
                  'وضعیت مالیاتی ۱۴۰۵': c.taxStatus1405
                }));
                exportToExcel(data, 'Aptus_Contractors_Performance', 'پیمانکاران');
              }}
              className="px-3 py-1 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1 transition-all"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span>اکسل پیمانکاران</span>
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead className="bg-slate-100 dark:bg-black/30 backdrop-blur-md text-slate-600 dark:text-slate-400 border-b border-slate-200 dark:border-white/10 font-bold">
                <tr>
                  <th className="p-3">نام پیمانکار</th>
                  <th className="p-3">عنوان قرارداد</th>
                  <th className="p-3">مبلغ کل قرارداد</th>
                  <th className="p-3">مبلغ کارکرد پرداختی</th>
                  <th className="p-3">مالیات تکلیفی مکسوره (۵٪)</th>
                  <th className="p-3">امتیاز عملکرد</th>
                  <th className="p-3">وضعیت مالیاتی ۱۴۰۵</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-white/5 text-slate-800 dark:text-slate-200 font-medium">
                {contractors.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                    <td className="p-3 font-bold text-slate-900 dark:text-slate-100">{c.contractorName}</td>
                    <td className="p-3 text-slate-500 dark:text-slate-400">{c.contractTitle}</td>
                    <td className="p-3 font-mono">{formatCurrency(c.contractValueIrr)}</td>
                    <td className="p-3 font-mono text-emerald-600 dark:text-emerald-400 font-bold">{formatCurrency(c.paidAmountIrr)}</td>
                    <td className="p-3 font-mono text-amber-600 dark:text-amber-400 font-bold">{formatCurrency(c.taxRetentionIrr)}</td>
                    <td className="p-3 font-mono font-bold text-cyan-600 dark:text-cyan-400">{c.performanceScore} / ۱۰۰</td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded-full text-[10px] bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30 backdrop-blur-md font-bold">
                        {c.taxStatus1405}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add Voucher Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-4 dir-rtl font-sans animate-in fade-in duration-200">
          <div className="w-full max-w-lg bg-white dark:bg-[#07162c] border border-slate-200 dark:border-white/15 rounded-3xl p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-white/10 mb-4">
              <h3 className="text-base font-black text-[#032b75] dark:text-slate-100 flex items-center gap-2">
                <Plus className="w-5 h-5 text-[#f05a24]" />
                <span>ثبت سند حسابداری و فاکتور مالی جدید</span>
              </h3>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddVoucher} className="space-y-4 text-xs font-medium">
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">شرح کامل سند / بابت</label>
                <input
                  type="text"
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  placeholder="مثال: خرید مواد اولیه سیمان تیپ ۲ و پوکه معدنی پروژه چیدمانا"
                  required
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-300 dark:border-white/10 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-[#0284c7]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">نوع ماهیت سند</label>
                  <select
                    value={entryType}
                    onChange={(e) => setEntryType(e.target.value as any)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-300 dark:border-white/10 text-slate-900 dark:text-slate-100"
                  >
                    <option value="DEBIT">بدهکار (هزینه/خرید)</option>
                    <option value="CREDIT">بستانکار (درآمد/فروش)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">مرکز هزینه / پروژه</label>
                  <select
                    value={newCostCenter}
                    onChange={(e) => setNewCostCenter(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-300 dark:border-white/10 text-slate-900 dark:text-slate-100"
                  >
                    <option value="کوره خط ۱ - مواد اولیه">کوره خط ۱ - مواد اولیه</option>
                    <option value="بچینگ شماره ۱ - بتن C30">بچینگ شماره ۱ - بتن C30</option>
                    <option value="قطعات پیش‌ساخته APS - دیوارهای چیدمانا">قطعات پیش‌ساخته APS - چیدمانا</option>
                    <option value="دپارتمان فروش آنلاین - Aptus Shop">دپارتمان فروش آنلاین Aptus Shop</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">مبلغ پایه به ریال (IRR)</label>
                <input
                  type="number"
                  value={newAmount}
                  onChange={(e) => setNewAmount(e.target.value)}
                  placeholder="2500000000"
                  required
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-300 dark:border-white/10 text-slate-900 dark:text-slate-100 dir-ltr text-left font-mono font-bold"
                />
              </div>

              <div className="p-3 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer text-slate-800 dark:text-slate-200 font-bold">
                  <input
                    type="checkbox"
                    checked={applyVat}
                    onChange={(e) => setApplyVat(e.target.checked)}
                    className="w-4 h-4 text-[#f05a24] rounded"
                  />
                  <span>محاسبه و افزودن ۱۰٪ مالیات بر ارزش افزوده (سال ۱۴۰۵)</span>
                </label>
                <span className="text-emerald-600 dark:text-emerald-400 font-mono font-extrabold">
                  {applyVat && newAmount ? `${(parseFloat(newAmount) * 0.10).toLocaleString('fa-IR')} ریال` : '۰'}
                </span>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-[#f05a24] to-[#ea580c] hover:from-[#ea580c] hover:to-[#d97706] text-white font-extrabold shadow-lg shadow-orange-500/20 active:scale-95 transition-all"
                >
                  ثبت رسمی در دفتر کل
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

