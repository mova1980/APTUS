import React, { useState } from 'react';
import { PersonnelRecord } from '../../types';
import { MOCK_PERSONNEL } from '../../data/mockData';
import { exportToExcel, exportToPdf } from '../../utils/exportUtils';
import {
  Users,
  Award,
  Heart,
  Clock,
  ShieldAlert,
  FileText,
  FileSpreadsheet,
  Plus,
  Search,
  CheckCircle2,
  Calendar,
  Sparkles,
  TrendingUp,
  UserCheck,
  X,
  HardHat,
  Activity,
  Filter,
  Check
} from 'lucide-react';

interface HcmViewProps {
  activeSubsystemId: string;
}

export const HcmView: React.FC<HcmViewProps> = ({ activeSubsystemId }) => {
  const [personnel, setPersonnel] = useState<PersonnelRecord[]>(MOCK_PERSONNEL);
  const [activeTab, setActiveTab] = useState<'PERSONNEL' | 'KPI' | 'ATTENDANCE' | 'HSE'>('PERSONNEL');
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  React.useEffect(() => {
    if (activeSubsystemId === 'HCM_EVALUATION') setActiveTab('KPI');
    else if (activeSubsystemId === 'HCM_ATTENDANCE' || activeSubsystemId === 'HCM_TIMESHEET') setActiveTab('ATTENDANCE');
    else if (activeSubsystemId === 'HCM_HSE') setActiveTab('HSE');
    else setActiveTab('PERSONNEL');
  }, [activeSubsystemId]);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };

  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('ALL');
  const [showAddModal, setShowAddModal] = useState(false);

  // New Personnel Form State
  const [newCode, setNewCode] = useState('');
  const [newName, setNewName] = useState('');
  const [newDept, setNewDept] = useState('واحد تولید قطعات پیش‌ساخته APS');
  const [newJob, setNewJob] = useState('اپراتور خط تولید قطعات');

  const filteredPersonnel = personnel.filter((p) => {
    const matchesSearch =
      p.fullName.includes(searchTerm) ||
      p.employeeCode.includes(searchTerm) ||
      p.department.includes(searchTerm) ||
      p.jobTitle.includes(searchTerm);
    const matchesDept = departmentFilter === 'ALL' || p.department === departmentFilter;
    return matchesSearch && matchesDept;
  });

  const handleAddEmployee = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;
    const newEmp: PersonnelRecord = {
      id: `EMP-${Date.now().toString().slice(-4)}`,
      employeeCode: newCode || `030${Math.floor(100 + Math.random() * 900)}`,
      fullName: newName.trim(),
      department: newDept,
      jobTitle: newJob,
      employmentType: 'رسمی',
      kpiScore: 92,
      psychologicalRating: 'عالی',
      attendanceHours: 176,
      leaveBalanceDays: 18,
      status: 'فعال'
    };
    setPersonnel([newEmp, ...personnel]);
    setShowAddModal(false);
    setNewName('');
    setNewCode('');
    showToast(`پرونده پرسنلی ${newEmp.fullName} با کد ${newEmp.employeeCode} در منابع انسانی آپتوس ثبت شد.`);
  };

  const handleExportExcel = () => {
    const data = filteredPersonnel.map((p) => ({
      'کد پرسنلی': p.employeeCode,
      'نام و نام خانوادگی': p.fullName,
      'واحد / دپارتمان': p.department,
      'سمت شغلی': p.jobTitle,
      'نوع استخدام': p.employmentType,
      'امتیاز KPI': p.kpiScore,
      'پایش روانشناسی': p.psychologicalRating,
      'کارکرد (ساعت)': p.attendanceHours,
      'مانده مرخصی (روز)': p.leaveBalanceDays,
      'وضعیت': p.status
    }));
    exportToExcel(data, 'Aptus_HR_Personnel', 'لیست پرسنل شرکت آپتوس ایران');
    showToast('فایل اکسل اسامی و پرونده پرسنلی آپتوس دریافت گردید.');
  };

  const handleExportPdf = () => {
    const headers = ['کد پرسنلی', 'نام و نام خانوادگی', 'دپارتمان', 'سمت', 'نوع قرارداد', 'امتیاز KPI', 'وضعیت'];
    const rows = filteredPersonnel.map((p) => [
      p.employeeCode,
      p.fullName,
      p.department,
      p.jobTitle,
      p.employmentType,
      p.kpiScore.toString(),
      p.status
    ]);
    exportToPdf('گزارش رسمی مدیریت منابع و سرمایه انسانی آپتوس ایران (HCM)', headers, rows, 'Aptus_HCM_Report');
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 font-sans w-full text-right dir-rtl">
      {/* Toast Alert Banner */}
      {toastMsg && (
        <div className="fixed top-5 left-5 z-50 p-4 rounded-2xl bg-emerald-600 text-white shadow-xl flex items-center gap-3 text-xs font-black animate-fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-200 shrink-0" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Light Theme Executive Header Banner matching ReportsView Style */}
      <div className="p-5 sm:p-6 rounded-3xl bg-white border border-slate-200/80 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#0f2b5c] text-white font-black flex items-center justify-center shrink-0 shadow-md">
            <Users className="w-6 h-6 text-amber-400" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-lg sm:text-xl font-black text-slate-900">
                مدیریت منابع و سرمایه انسانی (HCM)
              </h2>
              <span className="text-xs font-mono px-3 py-1 rounded-full bg-cyan-50 text-cyan-800 border border-cyan-200 font-bold">
                کارخانه و دفتر مرکزی
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1 font-medium leading-relaxed">
              پرونده کارگزینی، ارزیابی عملکرد KPI، پایش تایم‌شیت و کارکرد، طب کار و استانداردهای HSE آپتوس ایران
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <button
            onClick={handleExportExcel}
            className="px-3.5 py-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 font-extrabold text-xs flex items-center gap-2 transition-all shadow-sm"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
            <span>خروجی اکسل</span>
          </button>
          <button
            onClick={handleExportPdf}
            className="px-3.5 py-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-200 font-extrabold text-xs flex items-center gap-2 transition-all shadow-sm"
          >
            <FileText className="w-4 h-4 text-rose-600" />
            <span>خروجی PDF</span>
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2.5 rounded-xl bg-[#0f2b5c] hover:bg-[#1a3f7a] text-white font-extrabold text-xs flex items-center gap-2 shadow-sm transition-all"
          >
            <Plus className="w-4 h-4 text-amber-400" />
            <span>افزودن پرسنل جدید</span>
          </button>
        </div>
      </div>

      {/* Top Stat Cards for HCM - Light Corporate Theme */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm flex flex-col justify-between hover:shadow-md transition-all">
          <div className="flex items-center justify-between text-xs text-slate-500 font-bold">
            <span>تعداد کل پرسنل فعال</span>
            <div className="w-8 h-8 rounded-xl bg-cyan-50 text-cyan-700 flex items-center justify-center font-black">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 mt-3 font-mono">۶۲۰ نفر</div>
          <div className="text-[11px] text-slate-500 mt-1 font-medium">دفتر مرکزی + کارخانه سیمان</div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm flex flex-col justify-between hover:shadow-md transition-all">
          <div className="flex items-center justify-between text-xs text-slate-500 font-bold">
            <span>میانگین شاخص KPI کارخانه</span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center font-black">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-amber-700 mt-3 font-mono">۹۲.۵ / ۱۰۰</div>
          <div className="text-[11px] text-emerald-700 mt-1 font-extrabold flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>رشد ۴.۲٪ در پایش عملکرد</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm flex flex-col justify-between hover:shadow-md transition-all">
          <div className="flex items-center justify-between text-xs text-slate-500 font-bold">
            <span>سلامت روان سازمانی</span>
            <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-700 flex items-center justify-center font-black">
              <Heart className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl font-black text-slate-900 mt-3">عالی و باانگیزه</div>
          <div className="text-[11px] text-slate-500 mt-1 font-medium">پایش دوره‌ای واحد روانشناسی</div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm flex flex-col justify-between hover:shadow-md transition-all">
          <div className="flex items-center justify-between text-xs text-slate-500 font-bold">
            <span>شاخص ایمنی و بهداشت (HSE)</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-black">
              <ShieldAlert className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl font-black text-emerald-800 mt-3">۳۶۵ روز بدون حادثه</div>
          <div className="text-[11px] text-slate-500 mt-1 font-medium">استاندارد ISO 45001</div>
        </div>
      </div>

      {/* Navigation Tabs - High Contrast Scrollable Menu */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-200 scrollbar-thin">
        <button
          onClick={() => setActiveTab('PERSONNEL')}
          className={`px-4 py-3 rounded-xl text-xs font-black transition-all flex items-center gap-2 whitespace-nowrap border ${
            activeTab === 'PERSONNEL'
              ? 'bg-[#0f2b5c] text-white border-[#0f2b5c] shadow-sm'
              : 'bg-white text-slate-700 hover:bg-slate-50 hover:text-slate-900 border-slate-200 font-bold'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>پرونده پرسنلی و کارگزینی ({personnel.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('KPI')}
          className={`px-4 py-3 rounded-xl text-xs font-black transition-all flex items-center gap-2 whitespace-nowrap border ${
            activeTab === 'KPI'
              ? 'bg-[#0f2b5c] text-white border-[#0f2b5c] shadow-sm'
              : 'bg-white text-slate-700 hover:bg-slate-50 hover:text-slate-900 border-slate-200 font-bold'
          }`}
        >
          <Award className="w-4 h-4" />
          <span>ارزیابی عملکرد و KPI</span>
        </button>

        <button
          onClick={() => setActiveTab('ATTENDANCE')}
          className={`px-4 py-3 rounded-xl text-xs font-black transition-all flex items-center gap-2 whitespace-nowrap border ${
            activeTab === 'ATTENDANCE'
              ? 'bg-[#0f2b5c] text-white border-[#0f2b5c] shadow-sm'
              : 'bg-white text-slate-700 hover:bg-slate-50 hover:text-slate-900 border-slate-200 font-bold'
          }`}
        >
          <Clock className="w-4 h-4" />
          <span>تردد و تایم‌شیت</span>
        </button>

        <button
          onClick={() => setActiveTab('HSE')}
          className={`px-4 py-3 rounded-xl text-xs font-black transition-all flex items-center gap-2 whitespace-nowrap border ${
            activeTab === 'HSE'
              ? 'bg-[#0f2b5c] text-white border-[#0f2b5c] shadow-sm'
              : 'bg-white text-slate-700 hover:bg-slate-50 hover:text-slate-900 border-slate-200 font-bold'
          }`}
        >
          <HardHat className="w-4 h-4" />
          <span>ایمنی و طب کار (HSE)</span>
        </button>
      </div>

      {/* Tab 1: Personnel Table */}
      {activeTab === 'PERSONNEL' && (
        <div className="space-y-4">
          {/* Filters Bar */}
          <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-3 text-xs">
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute right-3 top-2.5" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="جستجوی کد پرسنلی، نام، دپارتمان یا سمت..."
                className="w-full pr-9 pl-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-600 focus:bg-white font-medium"
              />
            </div>

            <div className="flex items-center gap-2 w-full md:w-auto">
              <div className="flex items-center gap-1 text-slate-600 font-bold">
                <Filter className="w-3.5 h-3.5 text-indigo-600" />
                <span>فیلتر دپارتمان:</span>
              </div>
              <select
                value={departmentFilter}
                onChange={(e) => setDepartmentFilter(e.target.value)}
                className="px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-bold focus:outline-none focus:border-indigo-600"
              >
                <option value="ALL">همه واحدها</option>
                <option value="واحد تولید و کوره">واحد تولید و کوره</option>
                <option value="واحد کنترل کیفیت (QC)">واحد کنترل کیفیت (QC)</option>
                <option value="واحد مالی و امور مالیاتی">واحد مالی و امور مالیاتی</option>
                <option value="واحد بازرگانی و باسکول">واحد بازرگانی و باسکول</option>
                <option value="مدیریت ارشد و توسعه ERP">مدیریت ارشد و توسعه ERP</option>
              </select>
            </div>
          </div>

          {/* Personnel Table */}
          <div className="rounded-2xl bg-white border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <h3 className="text-xs font-black text-slate-900 flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-indigo-700" />
                <span>پرونده پرسنلی کارکنان شرکت آپتوس ایران</span>
              </h3>
              <span className="text-[11px] font-mono font-bold text-slate-500 bg-white px-2.5 py-1 rounded-lg border border-slate-200">
                نمایش {filteredPersonnel.length} از {personnel.length} پرسنل
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-right text-xs">
                <thead className="bg-slate-100 border-b border-slate-200 text-slate-900 font-extrabold">
                  <tr>
                    <th className="p-3.5">کد پرسنلی</th>
                    <th className="p-3.5">نام و نام خانوادگی</th>
                    <th className="p-3.5">واحد / دپارتمان</th>
                    <th className="p-3.5">سمت شغلی</th>
                    <th className="p-3.5">نوع استخدام</th>
                    <th className="p-3.5">امتیاز KPI</th>
                    <th className="p-3.5">پایش روانشناسی</th>
                    <th className="p-3.5">کارکرد (ساعت)</th>
                    <th className="p-3.5">وضعیت</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-800">
                  {filteredPersonnel.map((p) => (
                    <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                      <td className="p-3.5 font-mono font-extrabold text-indigo-900">{p.employeeCode}</td>
                      <td className="p-3.5 font-black text-slate-900">{p.fullName}</td>
                      <td className="p-3.5 font-bold text-slate-700">{p.department}</td>
                      <td className="p-3.5 text-slate-600 font-medium">{p.jobTitle}</td>
                      <td className="p-3.5">
                        <span className="px-2.5 py-1 rounded-lg bg-slate-100 border border-slate-200 text-slate-700 font-bold text-[11px]">
                          {p.employmentType}
                        </span>
                      </td>
                      <td className="p-3.5 font-mono font-black text-amber-700">{p.kpiScore} / ۱۰۰</td>
                      <td className="p-3.5">
                        <span className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                          {p.psychologicalRating}
                        </span>
                      </td>
                      <td className="p-3.5 font-mono font-bold text-slate-800">{p.attendanceHours} ساعت</td>
                      <td className="p-3.5">
                        <span
                          className={`px-2.5 py-1 rounded-lg text-[11px] font-extrabold border ${
                            p.status === 'فعال'
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                              : 'bg-amber-50 text-amber-800 border-amber-200'
                          }`}
                        >
                          {p.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: KPI & Evaluation */}
      {activeTab === 'KPI' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
            <h3 className="text-sm font-black text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
              <Award className="w-4.5 h-4.5 text-amber-600" />
              <span>پایش ارزیابی ۳۶۰ درجه و پاداش کارانه پرسنل</span>
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed font-medium">
              ارزیابی عملکرد بر اساس میزان پایداری کوره، کاهش ضایعات کلینکر، رعایت پروتکل‌های ایمنی HSE و انضباط اداری صورت می‌پذیرد.
            </p>
            <div className="space-y-3.5 pt-2">
              {personnel.map((p) => (
                <div key={p.id} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-extrabold text-slate-900">{p.fullName} ({p.jobTitle})</span>
                    <span className="font-mono text-amber-700 font-black">{p.kpiScore}٪</span>
                  </div>
                  <div className="w-full h-2.5 rounded-full bg-slate-200 overflow-hidden">
                    <div
                      className="h-full bg-amber-500 rounded-full"
                      style={{ width: `${p.kpiScore}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
            <h3 className="text-sm font-black text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
              <Sparkles className="w-4.5 h-4.5 text-indigo-700" />
              <span>پیش‌بینی هوش مصنوعی جهت صدور احکام و ارتقاء سال ۱۴۰۵</span>
            </h3>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 space-y-3 leading-relaxed">
              <p className="font-medium">
                بر اساس داده‌های تایم‌شیت و پایش روحیه سازمانی، مهندس رضا معتمدی کاندیدای ارتقاء شغلی به سمت مدیر خطوط کوره است.
              </p>
              <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-bold space-y-1">
                <div className="flex items-center gap-1.5 text-emerald-800 font-extrabold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>پیشنهاد کارانه ویژه:</span>
                </div>
                <p className="font-medium text-slate-700">
                  پاداش ویژه کارانه تولید برای تمام پرسنل شیفت شب به جهت رکورد تولید ۴,۱۲۰ تن کلینکر در روز پیشنهاد می‌شود.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Attendance & Timesheet */}
      {activeTab === 'ATTENDANCE' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-700 font-black flex items-center justify-center shrink-0">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs text-slate-500 font-bold">میانگین ساعت کارکرد ماهانه</div>
                <div className="text-lg font-black text-slate-900 font-mono mt-0.5">۱۷۶ ساعت</div>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 font-black flex items-center justify-center shrink-0">
                <Check className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs text-slate-500 font-bold">درصد انضباط ورود و خروج</div>
                <div className="text-lg font-black text-emerald-800 font-mono mt-0.5">۹۸.۴٪</div>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 font-black flex items-center justify-center shrink-0">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs text-slate-500 font-bold">میانگین ذخیره مرخصی استحقاقی</div>
                <div className="text-lg font-black text-slate-900 font-mono mt-0.5">۱۶.۵ روز</div>
              </div>
            </div>
          </div>

          <div className="rounded-2xl bg-white border border-slate-200 shadow-sm overflow-hidden p-5 space-y-4">
            <h3 className="text-xs font-black text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
              <Clock className="w-4 h-4 text-indigo-700" />
              <span>خلاصه وضعیت تایم‌شیت و مرخصی‌های فعال پرسنل</span>
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-right text-xs">
                <thead className="bg-slate-100 border-b border-slate-200 text-slate-900 font-extrabold">
                  <tr>
                    <th className="p-3">کد پرسنلی</th>
                    <th className="p-3">نام پرسنل</th>
                    <th className="p-3">واحد شغلی</th>
                    <th className="p-3">ساعت کارکرد ماه</th>
                    <th className="p-3">مانده مرخصی (روز)</th>
                    <th className="p-3">تاخیر / تعجیل</th>
                    <th className="p-3">وضعیت شیفت</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-800">
                  {personnel.map((p) => (
                    <tr key={p.id} className="hover:bg-slate-50">
                      <td className="p-3 font-mono font-bold text-indigo-900">{p.employeeCode}</td>
                      <td className="p-3 font-bold text-slate-900">{p.fullName}</td>
                      <td className="p-3 text-slate-600">{p.department}</td>
                      <td className="p-3 font-mono font-bold text-slate-900">{p.attendanceHours} ساعت</td>
                      <td className="p-3 font-mono font-bold text-amber-800">{p.leaveBalanceDays} روز</td>
                      <td className="p-3 text-emerald-700 font-mono font-bold">صفر (منظم)</td>
                      <td className="p-3">
                        <span className="px-2.5 py-1 rounded-lg text-[10px] bg-emerald-50 text-emerald-800 border border-emerald-200 font-extrabold">
                          شیفت روز کار
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: HSE & Health */}
      {activeTab === 'HSE' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3">
              <h3 className="text-xs font-black text-slate-900 flex items-center gap-2">
                <HardHat className="w-4 h-4 text-emerald-700" />
                <span>پایش استانداردهای ایمنی ISO 45001 & HSE</span>
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                تمامی واحدها تجهیزات حفاظت فردی (PPE) شامل کلاه ایمنی، ماسک فیلتردار و کفش ضدلغزش دریافت نموده‌اند.
              </p>
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-bold flex items-center justify-between">
                <span>آخرین ممیزی HSE کارخانه:</span>
                <span className="font-mono">۱۴۰۵/۰۴/۲۵ - تایید کامل</span>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3">
              <h3 className="text-xs font-black text-slate-900 flex items-center gap-2">
                <Activity className="w-4 h-4 text-rose-600" />
                <span>معاینات ادواری طب کار و پرونده سلامت</span>
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                معاینات سالانه اسپیرومتری، اودیومتری و آزمایش‌های خون پرسنل خطوط کوره و بارگیری انجام شده است.
              </p>
              <div className="p-3 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-900 text-xs font-bold flex items-center justify-between">
                <span>تکمیل پرونده‌های سلامت:</span>
                <span className="font-mono font-black">۱۰۰٪ پرسنل</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal for Adding Personnel */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white border border-slate-200 rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
                <Plus className="w-4 h-4 text-indigo-700" />
                <span>افزودن نیرو به پرونده پرسنلی</span>
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddEmployee} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">کد پرسنلی</label>
                <input
                  type="text"
                  value={newCode}
                  onChange={(e) => setNewCode(e.target.value)}
                  placeholder="۰۳۰۵۸۸"
                  required
                  className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 dir-ltr text-left font-mono focus:outline-none focus:border-indigo-600"
                />
              </div>
              <div>
                <label className="block text-slate-700 font-bold mb-1">نام و نام خانوادگی</label>
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="مهدی حسینی"
                  required
                  className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 focus:outline-none focus:border-indigo-600 font-medium"
                />
              </div>
              <div>
                <label className="block text-slate-700 font-bold mb-1">دپارتمان</label>
                <input
                  type="text"
                  value={newDept}
                  onChange={(e) => setNewDept(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 focus:outline-none focus:border-indigo-600 font-medium"
                />
              </div>
              <div>
                <label className="block text-slate-700 font-bold mb-1">سمت شغلی</label>
                <input
                  type="text"
                  value={newJob}
                  onChange={(e) => setNewJob(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 focus:outline-none focus:border-indigo-600 font-medium"
                />
              </div>
              <div className="flex gap-2 pt-2 border-t border-slate-100">
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-[#0f2b5c] hover:bg-[#1a3f7a] text-white font-black text-xs shadow-sm transition-all"
                >
                  ثبت پرسنل
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs"
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
