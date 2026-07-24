import React, { useState } from 'react';
import { WeighbridgeSlip } from '../../types';
import { MOCK_WEIGHBRIDGE_SLIPS } from '../../data/mockData';
import { exportToExcel, exportToPdf } from '../../utils/exportUtils';
import {
  Truck,
  Scale,
  ShoppingBag,
  Globe,
  CheckCircle2,
  Plus,
  FileSpreadsheet,
  FileText,
  Send,
  X
} from 'lucide-react';

interface CommerceViewProps {
  activeSubsystemId: string;
}

export const CommerceView: React.FC<CommerceViewProps> = ({ activeSubsystemId }) => {
  const [slips, setSlips] = useState<WeighbridgeSlip[]>(MOCK_WEIGHBRIDGE_SLIPS);
  const [activeTab, setActiveTab] = useState<'WEIGHBRIDGE' | 'PURCHASE' | 'LOGISTICS' | 'CRM'>('WEIGHBRIDGE');
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  React.useEffect(() => {
    if (activeSubsystemId === 'COMM_WEIGHBRIDGE') setActiveTab('WEIGHBRIDGE');
    else if (activeSubsystemId === 'COMM_LOGISTICS') setActiveTab('LOGISTICS');
    else if (activeSubsystemId === 'COMM_DOMESTIC_BUY' || activeSubsystemId === 'COMM_FOREIGN_BUY') setActiveTab('PURCHASE');
    else if (activeSubsystemId === 'COMM_CRM_XRM' || activeSubsystemId === 'COMM_SALES_AFTER') setActiveTab('CRM');
    else setActiveTab('WEIGHBRIDGE');
  }, [activeSubsystemId]);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };

  const [showAddModal, setShowAddModal] = useState(false);
  const [truckPlate, setTruckPlate] = useState('');
  const [driverName, setDriverName] = useState('');
  const [material, setMaterial] = useState('بتن C30 آمادگه چیدمانا');
  const [buyerName, setBuyerName] = useState('پروژه برج نگین پارس');
  const [grossWeight, setGrossWeight] = useState('58000');
  const [tareWeight, setTareWeight] = useState('16000');

  const handleAddSlip = (e: React.FormEvent) => {
    e.preventDefault();
    const g = parseFloat(grossWeight) || 0;
    const t = parseFloat(tareWeight) || 0;
    const n = Math.max(0, g - t);

    const newS: WeighbridgeSlip = {
      slipNumber: `WB-${Date.now().toString().slice(-5)}`,
      truckPlate: truckPlate || 'ایران ۳۳ - ۹۱۲ ص ۴۵',
      driverName: driverName || 'حسین رضایی',
      materialName: material,
      grossWeightKg: g,
      tareWeightKg: t,
      netWeightKg: n,
      buyerContractor: buyerName || 'عاملیت توزیع بتن غرب',
      timestamp: new Date().toLocaleDateString('fa-IR') + ' - ' + new Date().toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' }),
      status: 'بارگیری شد'
    };
    setSlips([newS, ...slips]);
    setShowAddModal(false);
    setTruckPlate('');
    setDriverName('');
    showToast(`قبض جدید باسکول شماره ${newS.slipNumber} با وزن خالص ${(n/1000).toFixed(2)} تن ثبت گردید.`);
  };

  const handleSendTaxApi = (slipNum: string) => {
    showToast(`قبض شماره ${slipNum} با موفقیت به سامانه مؤدیان سازمان امور مالیاتی کشور ارسال و کد رهگیری دریافت شد.`);
  };

  const handleExportExcel = () => {
    const data = slips.map((s) => ({
      'شماره قبض': s.slipNumber,
      'پلاک خودرو': s.truckPlate,
      'نام راننده': s.driverName,
      'نوع محصول / بار': s.materialName,
      'وزن ناخالص (کیلو)': s.grossWeightKg,
      'وزن تار (کیلو)': s.tareWeightKg,
      'وزن خالص (تن)': (s.netWeightKg / 1000).toFixed(2),
      'پیمانکار / خریدار': s.buyerContractor,
      'تاریخ و زمان': s.timestamp,
      'وضعیت': s.status
    }));
    exportToExcel(data, 'Aptus_Weighbridge_Report', 'گزارش موزونات باسکول');
    showToast('فایل اکسل قبوض توزین باسکول با موفقیت دریافت گردید.');
  };

  const handleExportPdf = () => {
    const headers = ['قبض', 'پلاک', 'راننده', 'محصول', 'وزن خالص (تن)', 'پیمانکار / پروژه', 'تاریخ'];
    const rows = slips.map((s) => [
      s.slipNumber,
      s.truckPlate,
      s.driverName,
      s.materialName,
      (s.netWeightKg / 1000).toFixed(2),
      s.buyerContractor,
      s.timestamp
    ]);
    exportToPdf('گزارش رسمی قبوض باسکول و خروج تریلرهای آپتوس ایران', headers, rows, 'Aptus_Weighbridge_PDF');
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

      {/* Top SCM Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-white/80 dark:bg-white/5 backdrop-blur-md border border-slate-200 dark:border-white/10 shadow-lg hover:shadow-xl transition-all">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-bold">
            <span>تعداد تریلرهای بارگیری شده امروز</span>
            <Truck className="w-4 h-4 text-purple-500" />
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-slate-100 mt-2 font-mono">۱۶۸ دستگاه</div>
          <div className="text-[10px] text-emerald-600 dark:text-emerald-400 mt-1 font-bold">میانگین زمان توزین: ۳ دقیقه</div>
        </div>

        <div className="p-4 rounded-2xl bg-white/80 dark:bg-white/5 backdrop-blur-md border border-slate-200 dark:border-white/10 shadow-lg hover:shadow-xl transition-all">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-bold">
            <span>وزن خالص خروجی سیمان و بتن امروز</span>
            <Scale className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-black text-amber-600 dark:text-amber-400 mt-2 font-mono">۴,۲۵۰ تن</div>
          <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 font-semibold">توزین هوشمند با دوربین پلاک‌خوان</div>
        </div>

        <div className="p-4 rounded-2xl bg-white/80 dark:bg-white/5 backdrop-blur-md border border-slate-200 dark:border-white/10 shadow-lg hover:shadow-xl transition-all">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-bold">
            <span>ثبت سفارشات بورس کالا / قراردادها</span>
            <ShoppingBag className="w-4 h-4 text-cyan-500" />
          </div>
          <div className="text-xl font-black text-slate-900 dark:text-slate-100 mt-2 font-mono">۶۲.۵ میلیارد تومان</div>
          <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 font-semibold">عاملیت‌های توزیع و پروژه‌های کشوری</div>
        </div>

        <div className="p-4 rounded-2xl bg-white/80 dark:bg-white/5 backdrop-blur-md border border-slate-200 dark:border-white/10 shadow-lg hover:shadow-xl transition-all">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-bold">
            <span>اعتبارات اسنادی و خریدهای خارجی</span>
            <Globe className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-xl font-black text-emerald-600 dark:text-emerald-400 mt-2 font-mono">۲.۴ میلیون یورو</div>
          <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 font-semibold">خرید تجهیزات و قطعات نسوز کوره</div>
        </div>
      </div>

      {/* Tabs & Export Toolbar */}
      <div className="flex flex-wrap items-center justify-between border-b border-slate-200 dark:border-white/10 pb-3 gap-3">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setActiveTab('WEIGHBRIDGE')}
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all ${
              activeTab === 'WEIGHBRIDGE'
                ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20'
                : 'bg-white/80 dark:bg-white/5 backdrop-blur-md border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10'
            }`}
          >
            سیستم توزین و باسکول صنعتی (۶۰ تنی)
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('PURCHASE')}
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all ${
              activeTab === 'PURCHASE'
                ? 'bg-purple-500 text-slate-950 shadow-lg shadow-purple-500/20'
                : 'bg-white/80 dark:bg-white/5 backdrop-blur-md border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10'
            }`}
          >
            خرید داخلی و بازرگانی خارجی
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('LOGISTICS')}
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all ${
              activeTab === 'LOGISTICS'
                ? 'bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/20'
                : 'bg-white/80 dark:bg-white/5 backdrop-blur-md border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10'
            }`}
          >
            زنجیره تأمین و لجستیک
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('CRM')}
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all ${
              activeTab === 'CRM'
                ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20'
                : 'bg-white/80 dark:bg-white/5 backdrop-blur-md border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10'
            }`}
          >
            CRM و عاملیت‌های فروش
          </button>
        </div>

        {/* Export and Actions */}
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

          {activeTab === 'WEIGHBRIDGE' && (
            <button
              type="button"
              onClick={() => setShowAddModal(true)}
              className="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-black flex items-center gap-1.5 transition-all shadow-lg shadow-amber-500/20 active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>صدور قبض باسکول جدید</span>
            </button>
          )}
        </div>
      </div>

      {/* Tab 1: Weighbridge Slips Table */}
      {activeTab === 'WEIGHBRIDGE' && (
        <div className="bg-white/90 dark:bg-slate-900/40 backdrop-blur-xl border border-slate-200 dark:border-white/10 rounded-2xl overflow-hidden shadow-2xl">
          <div className="p-4 border-b border-slate-200 dark:border-white/10 flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">قبوض توزین باسکول ۶۰ تنی ورودی/خروجی</h3>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold">اتصال آنلاین به دوربین پلاک‌خوان باسکول</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead className="bg-slate-100 dark:bg-black/30 backdrop-blur-md text-slate-600 dark:text-slate-400 border-b border-slate-200 dark:border-white/10 font-bold">
                <tr>
                  <th className="p-3">شماره قبض</th>
                  <th className="p-3">پلاک کامیون/تریلر</th>
                  <th className="p-3">نام راننده</th>
                  <th className="p-3">ماده/محصول</th>
                  <th className="p-3">وزن پر (Kg)</th>
                  <th className="p-3">وزن خالی (Kg)</th>
                  <th className="p-3">وزن خالص (تن)</th>
                  <th className="p-3">خریدار / پیمانکار</th>
                  <th className="p-3">تاریخ و زمان</th>
                  <th className="p-3 text-center">سامانه مؤدیان</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-white/5 text-slate-800 dark:text-slate-200">
                {slips.map((s) => (
                  <tr key={s.slipNumber} className="hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                    <td className="p-3 font-mono font-black text-amber-600 dark:text-amber-400">{s.slipNumber}</td>
                    <td className="p-3 font-mono font-bold text-slate-900 dark:text-slate-100 dir-ltr text-right">{s.truckPlate}</td>
                    <td className="p-3 font-bold">{s.driverName}</td>
                    <td className="p-3 text-slate-700 dark:text-slate-300 font-medium">{s.materialName}</td>
                    <td className="p-3 font-mono text-slate-500 dark:text-slate-400 font-semibold">{s.grossWeightKg.toLocaleString('fa-IR')}</td>
                    <td className="p-3 font-mono text-slate-500 dark:text-slate-400 font-semibold">{s.tareWeightKg.toLocaleString('fa-IR')}</td>
                    <td className="p-3 font-mono font-black text-emerald-600 dark:text-emerald-400 text-sm">
                      {(s.netWeightKg / 1000).toFixed(2)} تن
                    </td>
                    <td className="p-3 text-slate-600 dark:text-slate-300 font-semibold">{s.buyerContractor}</td>
                    <td className="p-3 font-mono text-slate-500 dark:text-slate-400 font-semibold">{s.timestamp}</td>
                    <td className="p-3 text-center">
                      <button
                        type="button"
                        onClick={() => handleSendTaxApi(s.slipNumber)}
                        className="px-2.5 py-1 rounded-lg bg-blue-500/15 hover:bg-blue-500/25 text-blue-700 dark:text-blue-300 border border-blue-500/30 text-[11px] font-bold flex items-center gap-1 mx-auto transition-all"
                      >
                        <Send className="w-3 h-3" />
                        <span>ارسال Tax API</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add Weighbridge Slip Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-4 dir-rtl font-sans animate-in fade-in duration-200">
          <div className="w-full max-w-lg bg-white dark:bg-[#07162c] border border-slate-200 dark:border-white/15 rounded-3xl p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-white/10 mb-4">
              <h3 className="text-base font-black text-[#032b75] dark:text-slate-100 flex items-center gap-2">
                <Scale className="w-5 h-5 text-amber-500" />
                <span>ثبت رسمی قبض توزین جدید باسکول</span>
              </h3>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddSlip} className="space-y-4 text-xs font-medium">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">پلاک تریلر / میکسر</label>
                  <input
                    type="text"
                    value={truckPlate}
                    onChange={(e) => setTruckPlate(e.target.value)}
                    placeholder="ایران ۴۴ - ۷۸۲ ب ۱۲"
                    required
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-300 dark:border-white/10 text-slate-900 dark:text-slate-100 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">نام و نام خانوادگی راننده</label>
                  <input
                    type="text"
                    value={driverName}
                    onChange={(e) => setDriverName(e.target.value)}
                    placeholder="کامران حسینی"
                    required
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-300 dark:border-white/10 text-slate-900 dark:text-slate-100"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">نوع محصول / بار</label>
                <input
                  type="text"
                  value={material}
                  onChange={(e) => setMaterial(e.target.value)}
                  required
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-300 dark:border-white/10 text-slate-900 dark:text-slate-100"
                />
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">نام خریدار / شرکت پیمانکار</label>
                <input
                  type="text"
                  value={buyerName}
                  onChange={(e) => setBuyerName(e.target.value)}
                  required
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-300 dark:border-white/10 text-slate-900 dark:text-slate-100"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">وزن پر (کیلوگرم)</label>
                  <input
                    type="number"
                    value={grossWeight}
                    onChange={(e) => setGrossWeight(e.target.value)}
                    required
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-300 dark:border-white/10 text-slate-900 dark:text-slate-100 font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">وزن خالی (کیلوگرم)</label>
                  <input
                    type="number"
                    value={tareWeight}
                    onChange={(e) => setTareWeight(e.target.value)}
                    required
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-300 dark:border-white/10 text-slate-900 dark:text-slate-100 font-mono font-bold"
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black shadow-lg shadow-amber-500/20 transition-all"
                >
                  ثبت قبض باسکول و صدور برگه خروج
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

