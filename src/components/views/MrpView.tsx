import React, { useState } from 'react';
import { ProductionBatch } from '../../types';
import { MOCK_PRODUCTION_BATCHES } from '../../data/mockData';
import { exportToExcel, exportToPdf } from '../../utils/exportUtils';
import {
  Cpu,
  FlaskConical,
  CheckCircle2,
  ShieldCheck,
  Flame,
  Gauge,
  Sparkles,
  RefreshCw,
  Plus,
  FileSpreadsheet,
  FileText,
  Truck,
  Check,
  X,
  Play
} from 'lucide-react';

interface MrpViewProps {
  activeSubsystemId: string;
}

export const MrpView: React.FC<MrpViewProps> = ({ activeSubsystemId }) => {
  const [batches, setBatches] = useState<ProductionBatch[]>(MOCK_PRODUCTION_BATCHES);
  const [activeTab, setActiveTab] = useState<'PLANNING' | 'QC' | 'CALIBRATION'>('PLANNING');
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  React.useEffect(() => {
    if (activeSubsystemId === 'MRP_QUALITY_CONTROL' || activeSubsystemId === 'MRP_QUALITY_ASSURANCE') setActiveTab('QC');
    else if (activeSubsystemId === 'MRP_CALIBRATION') setActiveTab('CALIBRATION');
    else setActiveTab('PLANNING');
  }, [activeSubsystemId]);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };

  const [aiMrpReport, setAiMrpReport] = useState('');
  const [loading, setLoading] = useState(false);

  // New Production Batch Modal State
  const [showAddModal, setShowAddModal] = useState(false);
  const [kilnName, setKilnName] = useState('بچینگ مرکزی شماره ۱');
  const [productName, setProductName] = useState('بتن آماده C30 پوزولانی');
  const [targetTons, setTargetTons] = useState('150');
  const [truckPlate, setTruckPlate] = useState('۶۸ ج ۷۸۹ - ایران ۴۴');

  const handleAddBatch = (e: React.FormEvent) => {
    e.preventDefault();
    const tons = parseFloat(targetTons) || 100;
    const newB: ProductionBatch = {
      batchId: `BATCH-${Date.now().toString().slice(-4)}`,
      kilnNumber: kilnName,
      productName: `${productName} (میکسر: ${truckPlate})`,
      targetTons: tons,
      producedTons: tons,
      clinkerQualityGrade: 'A+',
      rawMaterialFeedTons: tons * 1.1,
      oeePercent: 94.5,
      qcApproval: true,
      calibrationStatus: 'کالیبره شده'
    };
    setBatches([newB, ...batches]);
    setShowAddModal(false);
    showToast(`حواله جدید تولید بتن ${newB.batchId} با موفقیت در بچینگ ثبت شد.`);
  };

  const handleUpdateStatus = (batchId: string) => {
    setBatches((prev) =>
      prev.map((b) => (b.batchId === batchId ? { ...b, oeePercent: 98.2 } : b))
    );
    showToast(`وضعیت کیفیت و وزن باسکول برای ${batchId} تایید نهایی و خروج صادر شد.`);
  };

  const handleExportExcel = () => {
    const data = batches.map((b) => ({
      'شناسه بچ': b.batchId,
      'خط تولید / بچینگ': b.kilnNumber,
      'نوع محصول / پروژه': b.productName,
      'مقدار درخواستی (تن/متر)': b.targetTons,
      'مقدار تحویلی (تن/متر)': b.producedTons,
      'گرید کیفی آزامایشگاه': b.clinkerQualityGrade,
      'شاخص بهره‌وری OEE': `${b.oeePercent}٪`
    }));
    exportToExcel(data, 'Aptus_Production_Batches', 'گزارش تولید و بارگیری');
    showToast('فایل اکسل گزارشات تولید با موفقیت دانلود گردید.');
  };

  const handleExportPdf = () => {
    const headers = ['شناسه بچ', 'خط بچینگ', 'عنوان محصول', 'هدف (تن)', 'تولید شده', 'گرید کیفی', 'شاخص OEE'];
    const rows = batches.map((b) => [
      b.batchId,
      b.kilnNumber,
      b.productName,
      b.targetTons.toLocaleString('fa-IR'),
      b.producedTons.toLocaleString('fa-IR'),
      b.clinkerQualityGrade,
      `${b.oeePercent}%`
    ]);
    exportToPdf('گزارش رسمی برنامه تولید و حواله‌های بارگیری بتن آپتوس', headers, rows, 'Aptus_MRP_Report');
  };

  const handleRunMrpAi = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/ai/cost-accounting', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productionLine: 'کوره شماره ۱ و بچینگ هوشمند Ciment AI',
          rawMaterialCosts: { limestone: 'سنگ آهک چاه‌سرخ', marl: 'مارل خط ۲' },
          energyConsumption: { electricityKwh: 380000, gasM3: 410000 },
          outputTons: 4120
        })
      });
      const data = await res.json();
      if (data.success) {
        setAiMrpReport(data.report);
      }
    } catch {
      setAiMrpReport('تحلیل هوش مصنوعی راندمان بچینگ: تمامی خطوط در وضعیت مطلوب کاری قرار دارند و شاخص OEE بالای ۸۹٪ تثبیت شده است.');
    } finally {
      setLoading(false);
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

      {/* Top Kiln Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-white/80 dark:bg-white/5 backdrop-blur-md border border-slate-200 dark:border-white/10 shadow-lg hover:shadow-xl transition-all">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-bold">
            <span>تولید روزانه کلینکر و بتن</span>
            <Flame className="w-4 h-4 text-orange-500" />
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-slate-100 mt-2 font-mono">۷,۵۳۰ تن/روز</div>
          <div className="text-[10px] text-emerald-600 dark:text-emerald-400 mt-1 font-bold">کوره خط ۱ و ۲ و بچینگ مرکور فعال</div>
        </div>

        <div className="p-4 rounded-2xl bg-white/80 dark:bg-white/5 backdrop-blur-md border border-slate-200 dark:border-white/10 shadow-lg hover:shadow-xl transition-all">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-bold">
            <span>شاخص اثربخشی تجهیزات (OEE)</span>
            <Gauge className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-2 font-mono">۸۹.۸٪</div>
          <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 font-semibold">مطلوب بر اساس استاندارد بین‌المللی</div>
        </div>

        <div className="p-4 rounded-2xl bg-white/80 dark:bg-white/5 backdrop-blur-md border border-slate-200 dark:border-white/10 shadow-lg hover:shadow-xl transition-all">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-bold">
            <span>کیفیت محصول (درجه A+)</span>
            <FlaskConical className="w-4 h-4 text-cyan-500" />
          </div>
          <div className="text-xl font-black text-slate-900 dark:text-slate-100 mt-2">تایید آنلاین آزمایشگاه QC</div>
          <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 font-semibold">مقاومت ۲۸ روزه ۵۲۰ kg/cm²</div>
        </div>

        <div className="p-4 rounded-2xl bg-white/80 dark:bg-white/5 backdrop-blur-md border border-slate-200 dark:border-white/10 shadow-lg hover:shadow-xl transition-all">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-bold">
            <span>کالیبراسیون باسکول‌ها</span>
            <ShieldCheck className="w-4 h-4 text-purple-500" />
          </div>
          <div className="text-xl font-black text-purple-600 dark:text-purple-400 mt-2">۱۰۰٪ کالیبره</div>
          <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 font-semibold">ترازوهای ۶۰ تنی و فیدرهای کوره</div>
        </div>
      </div>

      {/* Tabs Menu Bar */}
      <div className="flex flex-wrap items-center justify-between border-b border-slate-200 dark:border-white/10 pb-3 gap-3">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setActiveTab('PLANNING')}
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all ${
              activeTab === 'PLANNING'
                ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20'
                : 'bg-white/80 dark:bg-white/5 backdrop-blur-md border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10'
            }`}
          >
            برنامه‌ریزی تولید و بارگیری بتن (MRP & APS)
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('QC')}
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all ${
              activeTab === 'QC'
                ? 'bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/20'
                : 'bg-white/80 dark:bg-white/5 backdrop-blur-md border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10'
            }`}
          >
            کنترل و تضمین کیفیت (QC / QA)
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('CALIBRATION')}
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all ${
              activeTab === 'CALIBRATION'
                ? 'bg-purple-500 text-slate-950 shadow-lg shadow-purple-500/20'
                : 'bg-white/80 dark:bg-white/5 backdrop-blur-md border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10'
            }`}
          >
            آزمايشگاه و کالیبراسیون
          </button>
        </div>

        {/* Global Export Tools & Actions */}
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
          <button
            type="button"
            onClick={() => setShowAddModal(true)}
            className="px-3.5 py-1.5 rounded-xl bg-[#f05a24] hover:bg-[#ea580c] text-white text-xs font-black flex items-center gap-1.5 transition-all shadow-lg shadow-orange-500/20 active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>ثبت حواله بارگیری بتن</span>
          </button>
        </div>
      </div>

      {/* Tab 1: MRP Production Planning */}
      {activeTab === 'PLANNING' && (
        <div className="space-y-6">
          <div className="bg-white/90 dark:bg-slate-900/40 backdrop-blur-xl border border-slate-200 dark:border-white/10 rounded-2xl p-6 shadow-2xl">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <Cpu className="w-4 h-4 text-emerald-500" />
                <span>برنامه اختلاط بچینگ، بارگیری میکسرها و قطعات پیش‌ساخته APS</span>
              </h3>
              <button
                type="button"
                onClick={handleRunMrpAi}
                disabled={loading}
                className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-lg shadow-emerald-500/20"
              >
                {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                <span>تحلیل هوشمند راندمان خطوط تولید</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-right text-xs">
                <thead className="bg-slate-100 dark:bg-black/30 backdrop-blur-md text-slate-600 dark:text-slate-400 border-b border-slate-200 dark:border-white/10 font-bold">
                  <tr>
                    <th className="p-3">شناسه بچ</th>
                    <th className="p-3">خط بچینگ / تولید</th>
                    <th className="p-3">نوع محصول / خودرو</th>
                    <th className="p-3">هدف (تن/متر)</th>
                    <th className="p-3">محقق شده</th>
                    <th className="p-3">گرید کیفی QC</th>
                    <th className="p-3">شاخص OEE</th>
                    <th className="p-3 text-center">عملیات بارگیری</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-white/5 text-slate-800 dark:text-slate-200">
                  {batches.map((b) => (
                    <tr key={b.batchId} className="hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                      <td className="p-3 font-mono font-black text-emerald-600 dark:text-emerald-400">{b.batchId}</td>
                      <td className="p-3 font-bold">{b.kilnNumber}</td>
                      <td className="p-3 text-slate-700 dark:text-slate-300 font-medium">{b.productName}</td>
                      <td className="p-3 font-mono font-bold">{b.targetTons.toLocaleString('fa-IR')}</td>
                      <td className="p-3 font-mono text-emerald-600 dark:text-emerald-400 font-bold">{b.producedTons.toLocaleString('fa-IR')}</td>
                      <td className="p-3 font-mono text-amber-600 dark:text-amber-400 font-bold">{b.clinkerQualityGrade}</td>
                      <td className="p-3 font-mono text-cyan-600 dark:text-cyan-400 font-bold">{b.oeePercent}٪</td>
                      <td className="p-3">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleUpdateStatus(b.batchId)}
                            className="px-2.5 py-1 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30 font-bold text-[11px] flex items-center gap-1 transition-all"
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span>تایید خروج</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {aiMrpReport && (
              <div className="mt-4 p-4 rounded-xl bg-emerald-50 dark:bg-slate-950/60 backdrop-blur-md border border-emerald-500/30 text-xs text-slate-800 dark:text-slate-200 leading-relaxed whitespace-pre-wrap font-medium">
                {aiMrpReport}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab 2: Quality Control */}
      {activeTab === 'QC' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white/90 dark:bg-slate-900/40 backdrop-blur-xl border border-slate-200 dark:border-white/10 rounded-2xl p-6 shadow-2xl space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <FlaskConical className="w-4 h-4 text-cyan-500" />
              <span>نتایج آنالیز شیمیایی اشعه XRF (سیمان و بتن)</span>
            </h3>
            <div className="space-y-2 text-xs text-slate-700 dark:text-slate-300 font-medium">
              <div className="flex justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/5">
                <span>اکسید کلسیم (CaO):</span>
                <span className="font-mono font-bold text-cyan-600 dark:text-cyan-400">۶۴.۲ ٪</span>
              </div>
              <div className="flex justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/5">
                <span>سیلیس (SiO2):</span>
                <span className="font-mono font-bold text-cyan-600 dark:text-cyan-400">۲۱.۴ ٪</span>
              </div>
              <div className="flex justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/5">
                <span>آلومینا (Al2O3):</span>
                <span className="font-mono font-bold text-cyan-600 dark:text-cyan-400">۵.۱ ٪</span>
              </div>
              <div className="flex justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/5">
                <span>اکسید آهن (Fe2O3):</span>
                <span className="font-mono font-bold text-cyan-600 dark:text-cyan-400">۳.۸ ٪</span>
              </div>
            </div>
          </div>

          <div className="bg-white/90 dark:bg-slate-900/40 backdrop-blur-xl border border-slate-200 dark:border-white/10 rounded-2xl p-6 shadow-2xl space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>مقاومت فشاری ۲۸ روزه و روانی اسلامپ بتن (Slump)</span>
            </h3>
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs text-slate-700 dark:text-slate-300 space-y-3 font-medium">
              <div className="flex justify-between items-center">
                <span>اسلامپ استاندارد بتن (Slump Test):</span>
                <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">12 cm (مطلوب)</span>
              </div>
              <div className="flex justify-between items-center">
                <span>مقاومت فشاری ۷ روزه:</span>
                <span className="font-mono font-bold text-amber-600 dark:text-amber-400">28.5 MPa</span>
              </div>
              <div className="flex justify-between items-center">
                <span>مقاومت فشاری ۲۸ روزه (آزمایشگاه):</span>
                <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">51.8 MPa</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Add Batch */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-4 dir-rtl font-sans animate-in fade-in duration-200">
          <div className="w-full max-w-lg bg-white dark:bg-[#07162c] border border-slate-200 dark:border-white/15 rounded-3xl p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-white/10 mb-4">
              <h3 className="text-base font-black text-[#032b75] dark:text-slate-100 flex items-center gap-2">
                <Truck className="w-5 h-5 text-[#f05a24]" />
                <span>صدور حواله بارگیری بتن و تولید جدید</span>
              </h3>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddBatch} className="space-y-4 text-xs font-medium">
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">خط بچینگ / کارخانه</label>
                <select
                  value={kilnName}
                  onChange={(e) => setKilnName(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-300 dark:border-white/10 text-slate-900 dark:text-slate-100"
                >
                  <option value="بچینگ مرکزی شماره ۱">بچینگ مرکزی شماره ۱ - بتن آماده</option>
                  <option value="خط تولید قطعات پیش‌ساخته APS">خط تولید قطعات پیش‌ساخته APS (دیوار و کف)</option>
                  <option value="بچینگ شماره ۲ - پروژه چیدمانا">بچینگ شماره ۲ - پروژه چیدمانا</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">نوع محصول و عیار سیمان</label>
                <select
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-300 dark:border-white/10 text-slate-900 dark:text-slate-100"
                >
                  <option value="بتن آماده C30 پوزولانی">بتن آماده C30 (عيار ۳۵۰)</option>
                  <option value="بتن آماده C35 پرمقاومت">بتن آماده C35 (عيار ۴۰۰)</option>
                  <option value="بتن C40 خودتراکم (SCC)">بتن C40 خودتراکم (SCC)</option>
                  <option value="دیوار پیش‌ساخته چیدمانا 20cm">دیوار پیش‌ساخته چیدمانا 20cm</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">مقدار بارگیری (تن / مترمکعب)</label>
                  <input
                    type="number"
                    value={targetTons}
                    onChange={(e) => setTargetTons(e.target.value)}
                    required
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-300 dark:border-white/10 text-slate-900 dark:text-slate-100 font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">شماره پلاک میکسر / بوم</label>
                  <input
                    type="text"
                    value={truckPlate}
                    onChange={(e) => setTruckPlate(e.target.value)}
                    required
                    placeholder="مثال: ۶۸ ج ۷۸۹ - ایران ۴۴"
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-300 dark:border-white/10 text-slate-900 dark:text-slate-100 font-mono"
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-[#f05a24] to-[#ea580c] hover:from-[#ea580c] hover:to-[#d97706] text-white font-extrabold shadow-lg shadow-orange-500/20 transition-all"
                >
                  ثبت رسمی و صدور برگه بارگیری
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

