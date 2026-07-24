import React, { useState } from 'react';
import {
  FileText,
  Sparkles,
  Search,
  Filter,
  Download,
  Printer,
  Trash2,
  Lock,
  ShieldAlert,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Eye,
  Send,
  Plus,
  BarChart3,
  PieChart as PieChartIcon,
  TrendingUp,
  Building2,
  Users,
  DollarSign,
  Scale,
  ChevronDown,
  Calendar,
  Layers,
  ArrowUpRight,
  RefreshCw,
  X,
  Share2,
  Award
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line
} from 'recharts';
import { AptusLogo } from '../AptusLogo';

export interface ReportItem {
  id: string;
  reportNumber: string;
  title: string;
  category: 'مالی و حسابداری' | 'منابع انسانی' | 'تولید بتن & APS' | 'بازرگانی & باسکول' | 'اداری';
  creator: string;
  isStandard: boolean; // Standard vs AI Requested
  createdDate: string;
  securityLevel: 'عادی' | 'محرمانه' | 'سری (مدیران ارشد)';
  costCenter: string;
  dateRange: string;
  rowsCount: number;
  description: string;
  dataSummary: {
    totalDebitIrr?: number;
    totalCreditIrr?: number;
    netBalanceIrr?: number;
    totalValueTons?: number;
    totalCount?: number;
    averageScore?: number;
  };
  tableColumns: { key: string; label: string }[];
  tableData: any[];
  chartData: any[];
}

// Pre-populated Standard Corporate Reports for Aptus
const INITIAL_STANDARD_REPORTS: ReportItem[] = [
  {
    id: 'RPT-STD-001',
    reportNumber: 'STD-1405-01',
    title: 'تراز آزمایشی ۴ ستونی کل و معین (سطح شرکت)',
    category: 'مالی و حسابداری',
    creator: 'سیستم مرکز حسابداری آپتوس',
    isStandard: true,
    createdDate: '۱۴۰۵/۰۵/۰۱',
    securityLevel: 'محرمانه',
    costCenter: 'دفتر مرکزی & کل پروژه‌ها',
    dateRange: '۱۴۰۵/۰۱/۰۱ تا ۱۴۰۵/۰۵/۰۱',
    rowsCount: 8,
    description: 'تراز ۴ ستونی آزمایشی حساب‌های کل و معین متصل به خطوط تولید بتن آماده C30، قطعات APS و فروشگاه آنلاین Aptus',
    dataSummary: {
      totalDebitIrr: 184500000000,
      totalCreditIrr: 184500000000,
      netBalanceIrr: 0,
      totalCount: 8
    },
    tableColumns: [
      { key: 'accountCode', label: 'کد حساب' },
      { key: 'accountTitle', label: 'عنوان حساب معین / کل' },
      { key: 'debitInitial', label: 'گردش بدهکار (ریال)' },
      { key: 'creditInitial', label: 'گردش بستانکار (ریال)' },
      { key: 'debitBalance', label: 'مانده بدهکار (ریال)' },
      { key: 'creditBalance', label: 'مانده بستانکار (ریال)' }
    ],
    tableData: [
      { accountCode: '10101', accountTitle: 'موجودی نقد و بانک‌ها (درگاه آنلاین & سپه)', debitInitial: '45,000,000,000', creditInitial: '32,000,000,000', debitBalance: '13,000,000,000', creditBalance: '0' },
      { accountCode: '10301', accountTitle: 'موجودی مواد اولیه (سیمان، ماسه & افزودنی)', debitInitial: '62,000,000,000', creditInitial: '48,000,000,000', debitBalance: '14,000,000,000', creditBalance: '0' },
      { accountCode: '10502', accountTitle: 'حساب‌های دریافتنی مشتریان بتن آماده', debitInitial: '38,000,000,000', creditInitial: '22,000,000,000', debitBalance: '16,000,000,000', creditBalance: '0' },
      { accountCode: '20101', accountTitle: 'حساب‌های پرداختنی تامین‌کنندگان سیمان', debitInitial: '15,000,000,000', creditInitial: '35,000,000,000', debitBalance: '0', creditBalance: '20,000,000,000' },
      { accountCode: '30101', accountTitle: 'تسهیلات و اعتبارات بانکی طرح توسعه APS', debitInitial: '4,000,000,000', creditInitial: '24,000,000,000', debitBalance: '0', creditBalance: '20,000,000,000' },
      { accountCode: '40101', accountTitle: 'درآمد فروش بتن آماده C30 و RCC', debitInitial: '0', creditInitial: '82,000,000,000', debitBalance: '0', creditBalance: '82,000,000,000' },
      { accountCode: '40201', accountTitle: 'درآمد فروش خانه‌های پیش‌ساخته چیدمانا', debitInitial: '0', creditInitial: '45,000,000,000', debitBalance: '0', creditBalance: '45,000,000,000' },
      { accountCode: '50101', accountTitle: 'بهای تمام شده بتن و قطعات پیش‌ساخته', debitInitial: '108,000,000,000', creditInitial: '0', debitBalance: '108,000,000,000', creditBalance: '0' }
    ],
    chartData: [
      { name: 'درآمد بتن', amount: 82000 },
      { name: 'درآمد APS', amount: 45000 },
      { name: 'بهای تمام شده', amount: 108000 },
      { name: 'موجودی مواد', amount: 14000 },
      { name: 'مطالبات بتن', amount: 16000 }
    ]
  },
  {
    id: 'RPT-STD-002',
    reportNumber: 'STD-1405-02',
    title: 'صورت سود و زیان عملیاتی متصل به خطوط تولید بتن و APS',
    category: 'مالی و حسابداری',
    creator: 'دپارتمان مالی آپتوس',
    isStandard: true,
    createdDate: '۱۴۰۵/۰۵/۰۲',
    securityLevel: 'سری (مدیران ارشد)',
    costCenter: 'کل واحدهای عملیاتی',
    dateRange: '۱۴۰۵/۰۱/۰۱ تا ۱۴۰۵/۰۵/۰۲',
    rowsCount: 6,
    description: 'تحلیل دقیق سود ناخالص، هزینه‌های سربار بچینگ بتن، خطوط تولید قطعات پیش‌ساخته APS و فروشگاه آنلاین Aptus',
    dataSummary: {
      totalDebitIrr: 127000000000,
      totalCreditIrr: 168000000000,
      netBalanceIrr: 41000000000,
      totalCount: 6
    },
    tableColumns: [
      { key: 'itemTitle', label: 'عنوان ردیف صورت مالی' },
      { key: 'amountIrr', label: 'مبلغ به ریال' },
      { key: 'percentOfSales', label: 'درصد از درآمد فروش' },
      { key: 'note', label: 'توضیحات تکمیلی' }
    ],
    tableData: [
      { itemTitle: 'درآمد کل فروش (بتن + APS + Aptus Shop)', amountIrr: '168,000,000,000', percentOfSales: '100%', note: 'افزایش ۲۴٪ نسبت به دوره مشابه قبل' },
      { itemTitle: 'بهای تمام شده کالای فروش‌رفته (Cost of Sales)', amountIrr: '(108,000,000,000)', percentOfSales: '64.2%', note: 'مستقیم مواد اولیه سیمان و ماسه' },
      { itemTitle: 'سود ناخالص (Gross Profit)', amountIrr: '60,000,000,000', percentOfSales: '35.8%', note: 'حاشیه سود ناخالص بهینه' },
      { itemTitle: 'هزینه‌های عمومی، اداری و توزیع ناوگان', amountIrr: '(12,500,000,000)', percentOfSales: '7.4%', note: 'استهلاک میکسرها و سوخت گازوئیل' },
      { itemTitle: 'هزینه‌های مالیات و کسورات سال ۱۴۰۵', amountIrr: '(6,500,000,000)', percentOfSales: '3.8%', note: 'مطابق مقررات سامانه مودیان' },
      { itemTitle: 'سود خالص دوره (Net Profit)', amountIrr: '41,000,000,000', percentOfSales: '24.4%', note: 'سود خالص قابل تقسیم پس از مالیات' }
    ],
    chartData: [
      { name: 'فروش کل', val: 168000 },
      { name: 'بهای تمام شده', val: 108000 },
      { name: 'سود ناخالص', val: 60000 },
      { name: 'هزینه اداری', val: 12500 },
      { name: 'سود خالص', val: 41000 }
    ]
  },
  {
    id: 'RPT-STD-003',
    reportNumber: 'STD-1405-03',
    title: 'گزارش بهای تمام شده به لحظه هر مترمکعب بتن آماده C30',
    category: 'تولید بتن & APS',
    creator: 'واحد حسابداری صنعتی & بچینگ',
    isStandard: true,
    createdDate: '۱۴۰۵/۰۵/۰۳',
    securityLevel: 'محرمانه',
    costCenter: 'خط بچینگ شماره ۱ و ۲',
    dateRange: 'امروز - ۱۴۰۵/۰۵/۰۳',
    rowsCount: 5,
    description: 'تحلیل دقیق اجزای طرح اختلاط (Mix Design)، افزودنی‌های بتن، مصرف آب و انرژی دوزینگ بچینگ آپتوس',
    dataSummary: {
      totalValueTons: 4250,
      totalCount: 5
    },
    tableColumns: [
      { key: 'ingredient', label: 'ماده اولیه / مولفه هزینه' },
      { key: 'consumptionPerM3', label: 'مقدار مصرف در مترمکعب' },
      { key: 'ratePerUnit', label: 'نرخ واحد (ریال)' },
      { key: 'costPerM3', label: 'هزینه در مترمکعب بتن (ریال)' },
      { key: 'costSharePercent', label: 'سهم از کل هزینه' }
    ],
    tableData: [
      { ingredient: 'سیمان فله تیپ ۲ (کاشان)', consumptionPerM3: '380 کیلوگرم', ratePerUnit: '18,500', costPerM3: '7,030,000', costSharePercent: '52.1%' },
      { ingredient: 'ماسه شسته ۰-۶ و سنگ‌دانه', consumptionPerM3: '1,750 کیلوگرم', ratePerUnit: '2,400', costPerM3: '4,200,000', costSharePercent: '31.1%' },
      { ingredient: 'افزودنی روان‌کننده بتن (Aptus-Poly)', consumptionPerM3: '3.8 کیلوگرم', ratePerUnit: '180,000', costPerM3: '684,000', costSharePercent: '5.1%' },
      { ingredient: 'آب و برق صنعتی بچینگ', consumptionPerM3: '160 لیتر', ratePerUnit: '3,500', costPerM3: '560,000', costSharePercent: '4.1%' },
      { ingredient: 'دستمزد اپراتور و استهلاک میکسر', consumptionPerM3: 'سهمیه‌ای', ratePerUnit: '-', costPerM3: '1,020,000', costSharePercent: '7.6%' }
    ],
    chartData: [
      { name: 'سیمان فله', share: 52.1 },
      { name: 'ماسه & شن', share: 31.1 },
      { name: 'روان‌کننده', share: 5.1 },
      { name: 'انرژی & آب', share: 4.1 },
      { name: 'دستمزد & میکسر', share: 7.6 }
    ]
  },
  {
    id: 'RPT-STD-004',
    reportNumber: 'STD-1405-04',
    title: 'گزارش مانده مرخصی استحقاقی، ذخیره سنوات و عملکرد پرسنل',
    category: 'منابع انسانی',
    creator: 'دپارتمان سرمایه انسانی (HCM)',
    isStandard: true,
    createdDate: '۱۴۰۵/۰۵/۰۴',
    securityLevel: 'عادی',
    costCenter: 'کل پرسنل (۸۵۰ نفر)',
    dateRange: '۱۴۰۵/۰۱/۰۱ تا ۱۴۰۵/۰۵/۰۴',
    rowsCount: 5,
    description: 'وضعیت مانده مرخصی، ذخیره سنوات و نمره ارزیابی KPI رانندگان میکسر، مهندسان عمران و تیم فروش آنلاین',
    dataSummary: {
      totalCount: 850,
      averageScore: 94.2
    },
    tableColumns: [
      { key: 'departmentName', label: 'دپارتمان / واحد سازمانی' },
      { key: 'staffCount', label: 'تعداد پرسنل' },
      { key: 'avgLeaveDays', label: 'میانگین مانده مرخصی (روز)' },
      { key: 'avgKpiScore', label: 'میانگین شاخص KPI' },
      { key: 'statusText', label: 'وضعیت منابع انسانی' }
    ],
    tableData: [
      { departmentName: 'کارخانه بتن آماده & اپراتورهای بچینگ', staffCount: '185 نفر', avgLeaveDays: '8.4 روز', avgKpiScore: '96.2٪', statusText: 'عملکرد عالی' },
      { departmentName: 'خط تولید قطعات پیش‌ساخته APS و چیدمانا', staffCount: '240 نفر', avgLeaveDays: '6.2 روز', avgKpiScore: '94.8٪', statusText: 'عملکرد مطلوب' },
      { departmentName: 'ناوگان حمل بتن (رانندگان میکسر & پمپ)', staffCount: '120 نفر', avgLeaveDays: '4.5 روز', avgKpiScore: '92.1٪', statusText: 'پایدار' },
      { departmentName: 'تیم دپارتمان مالی، فروش آنلاین & CRM', staffCount: '95 نفر', avgLeaveDays: '12.1 روز', avgKpiScore: '95.5٪', statusText: 'ذخیره مرخصی بالاست' },
      { departmentName: 'دفتر مرکزی، مدیریت پروژه‌ها & HSE', staffCount: '210 نفر', avgLeaveDays: '9.8 روز', avgKpiScore: '93.0٪', statusText: 'منطبق بر برنامه' }
    ],
    chartData: [
      { dept: 'بچینگ بتن', leave: 8.4, kpi: 96.2 },
      { dept: 'خط APS', leave: 6.2, kpi: 94.8 },
      { dept: 'ناوگان میکسر', leave: 4.5, kpi: 92.1 },
      { dept: 'مالی & فروش', leave: 12.1, kpi: 95.5 },
      { dept: 'دفتر مرکزی', leave: 9.8, kpi: 93.0 }
    ]
  },
  {
    id: 'RPT-STD-005',
    reportNumber: 'STD-1405-05',
    title: 'گزارش جامع توزین باسکول ۶۰ تنی، بارگیری ماسه و قبوض بتن',
    category: 'بازرگانی & باسکول',
    creator: 'سیستم توزین خودکار باسکول',
    isStandard: true,
    createdDate: '۱۴۰۵/۰۵/۰۵',
    securityLevel: 'عادی',
    costCenter: 'ایستگاه باسکول شماره ۱ و ۲',
    dateRange: 'امروز - ۱۴۰۵/۰۵/۰۵',
    rowsCount: 5,
    description: 'ثبت قبوض باسکول، وزن خالص بارگیری ماسه، سیمان فله ورودی و خروجی تریلی‌های حمل بتن آماده',
    dataSummary: {
      totalValueTons: 4250,
      totalCount: 168
    },
    tableColumns: [
      { key: 'materialType', label: 'نوع کالا / ماده اولیه' },
      { key: 'slipsCount', label: 'تعداد قبوض صادره' },
      { key: 'grossWeightTons', label: 'وزن ناخالص (تن)' },
      { key: 'tareWeightTons', label: 'وزن خالی (تن)' },
      { key: 'netWeightTons', label: 'وزن خالص (تن)' }
    ],
    tableData: [
      { materialType: 'بتن آماده C30 (خروجی میکسرها)', slipsCount: '112 قبض', grossWeightTons: '3,840', tareWeightTons: '1,200', netWeightTons: '2,640 تن' },
      { materialType: 'سیمان فله تیپ ۲ (ورودی بوکر)', slipsCount: '18 قبض', grossWeightTons: '820', tareWeightTons: '280', netWeightTons: '540 تن' },
      { materialType: 'ماسه شسته ۰-۶ (ورودی ده چرخ)', slipsCount: '24 قبض', grossWeightTons: '960', tareWeightTons: '310', netWeightTons: '650 تن' },
      { materialType: 'قطعات پیش‌ساخته APS و نیوجرسی', slipsCount: '10 قبض', grossWeightTons: '480', tareWeightTons: '160', netWeightTons: '320 تن' },
      { materialType: 'پوکه معدنی سبک & سنگ‌دانه', slipsCount: '4 قبض', grossWeightTons: '140', tareWeightTons: '40', netWeightTons: '100 تن' }
    ],
    chartData: [
      { name: 'بتن آماده', net: 2640 },
      { name: 'ماسه شسته', net: 650 },
      { name: 'سیمان فله', net: 540 },
      { name: 'قطعات APS', net: 320 },
      { name: 'پوکه سبک', net: 100 }
    ]
  }
];

// Initial AI Custom Requested Reports
const INITIAL_AI_REPORTS: ReportItem[] = [
  {
    id: 'RPT-AI-101',
    reportNumber: 'AI-1405-8821',
    title: 'تراز ۴ ستونی آزمایشی - مرکز هزینه خط بچینگ بتن',
    category: 'مالی و حسابداری',
    creator: 'هوش مصنوعی Gemini (درخواست: آقای واحدی)',
    isStandard: false,
    createdDate: '۱۴۰۵/۰۵/۰۵',
    securityLevel: 'محرمانه',
    costCenter: 'خط بچینگ شماره ۱',
    dateRange: '۱۴۰۵/۰۱/۰۱ تا ۱۴۰۵/۰۴/۳۱',
    rowsCount: 4,
    description: 'گزارش اختصاصی استخراج شده توسط هوش مصنوعی بر اساس درخواست مدیر ارشد برای بررسی دقیق تراز گردش مرکز هزینه بچینگ بتن',
    dataSummary: {
      totalDebitIrr: 85000000000,
      totalCreditIrr: 85000000000,
      netBalanceIrr: 0,
      totalCount: 4
    },
    tableColumns: [
      { key: 'code', label: 'کد معین' },
      { key: 'title', label: 'شرح حساب' },
      { key: 'debit', label: 'گردش بدهکار (ریال)' },
      { key: 'credit', label: 'گردش بستانکار (ریال)' },
      { key: 'balance', label: 'مانده پایان دوره (ریال)' }
    ],
    tableData: [
      { code: '10301-1', title: 'خرید سیمان فله خط بچینگ ۱', debit: '42,000,000,000', credit: '38,000,000,000', balance: '4,000,000,000 بدهکار' },
      { code: '10301-2', title: 'خرید ماسه شسته و سنگ‌دانه', debit: '28,000,000,000', credit: '25,000,000,000', balance: '3,000,000,000 بدهکار' },
      { code: '50101-1', title: 'هزینه دستمزد و انرژی بچینگ', debit: '15,000,000,000', credit: '15,000,000,000', balance: '۰ (تسویه شد)' },
      { code: '40101-1', title: 'تحویل بتن آماده C30 به پروژه‌ها', debit: '0', credit: '85,000,000,000', balance: '85,000,000,000 بستانکار' }
    ],
    chartData: [
      { name: 'سیمان فله', cost: 42000 },
      { name: 'ماسه & شن', cost: 28000 },
      { name: 'دستمزد & برق', cost: 15000 },
      { name: 'تحویل به پروژه', cost: 85000 }
    ]
  },
  {
    id: 'RPT-AI-102',
    reportNumber: 'AI-1405-9942',
    title: 'گزارش مانده مرخصی استحقاقی پرسنل خط تولید قطعات چیدمانا (APS)',
    category: 'منابع انسانی',
    creator: 'هوش مصنوعی Gemini (درخواست: مدیر HR)',
    isStandard: false,
    createdDate: '۱۴۰۵/۰۵/۰۴',
    securityLevel: 'عادی',
    costCenter: 'واحد تولید چیدمانا APS',
    dateRange: '۱۴۰۵/۰۱/۰۱ تا ۱۴۰۵/۰۵/۰۴',
    rowsCount: 4,
    description: 'استخراج هوشمند پرونده پرسنلی و محاسبه مانده مرخصی استحقاقی تک تک پرسنل کلیدی واحد قطعات پیش‌ساخته چیدمانا',
    dataSummary: {
      totalCount: 4,
      averageScore: 95.5
    },
    tableColumns: [
      { key: 'empCode', label: 'کد پرسنلی' },
      { key: 'name', label: 'نام و نام خانوادگی' },
      { key: 'role', label: 'عنوان شغلی' },
      { key: 'leaveTaken', label: 'مرخصی استفاده شده' },
      { key: 'leaveBalance', label: 'مانده مرخصی (روز)' }
    ],
    tableData: [
      { empCode: 'APS-201', name: 'مهندس رضایی', role: 'سرپرست تولید قطعات APS', leaveTaken: '۴ روز', leaveBalance: '۱۰.۵ روز' },
      { empCode: 'APS-205', name: 'استاد کریمی', role: 'مسئول قالب‌بندی چیدمانا', leaveTaken: '۶ روز', leaveBalance: '۸.۰ روز' },
      { empCode: 'APS-210', name: 'مهندس احمدی', role: 'کارشناس کنترل کیفیت (QC)', leaveTaken: '۳ روز', leaveBalance: '۱۱.۵ روز' },
      { empCode: 'APS-215', name: 'آقای شریفی', role: 'اپراتور جرثقیل سقف کارخانه', leaveTaken: '۷ روز', leaveBalance: '۶.۵ روز' }
    ],
    chartData: [
      { name: 'م. رضایی', days: 10.5 },
      { name: 'ا. کریمی', days: 8.0 },
      { name: 'م. احمدی', days: 11.5 },
      { name: 'آ. شریفی', days: 6.5 }
    ]
  }
];

export const ReportsView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'STANDARD' | 'AI_CUSTOM' | 'AI_BUILDER'>('STANDARD');
  const [standardReports, setStandardReports] = useState<ReportItem[]>(INITIAL_STANDARD_REPORTS);
  const [aiReports, setAiReports] = useState<ReportItem[]>(INITIAL_AI_REPORTS);
  const [selectedReport, setSelectedReport] = useState<ReportItem | null>(null);
  
  // User Role State Simulator (to demonstrate permission restriction clearly)
  const [currentUserRole, setCurrentUserRole] = useState<'ADMIN' | 'CFO' | 'REGULAR'>('ADMIN');
  const currentUserName = currentUserRole === 'ADMIN' ? 'آقای محسن واحدی (مدیر ارشد سیستم)' : currentUserRole === 'CFO' ? 'مدیر ارشد مالی آپتوس' : 'کارشناس عادی / پرسنل (بدون دسترسی مالی)';

  // Search & Filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('همه');

  // AI Interactive Report Builder States
  const [builderPrompt, setBuilderPrompt] = useState('');
  const [builderLoading, setBuilderLoading] = useState(false);
  const [builderHistory, setBuilderHistory] = useState<{ sender: 'user' | 'ai'; text: string; params?: any }[]>([
    {
      sender: 'ai',
      text: `سلام و احترام، من طراح و سازنده هوشمند گزارشات شرکت ساختمانی آپتوس ایران هستم. 
عنوان گزارش مد نظر خود را بیان کنید (مثلاً: «یک تراز ۴ ستونی بده» یا «گزارش مانده مرخصی پرسنل واحد بتن»). من ابتدا سطح دسترسی شما را پایش کرده و در صورت نیاز، پارامترهای لازم را از شما می‌پرسم و سپس گزارش کاملاً واقعی را تولید و به منوی گزارشات اضافه می‌کنم.`
    }
  ]);

  // Missing Parameters State Dialog for Builder
  const [pendingReportRequest, setPendingReportRequest] = useState<{
    type: 'BALANCE' | 'LEAVE' | 'COSTING' | 'WEIGHBRIDGE' | 'SALES';
    title: string;
    dateFrom: string;
    dateTo: string;
    costCenter: string;
    level: string;
  } | null>(null);

  // Toast message
  const [toastMessage, setToastMessage] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);

  const showToast = (type: 'success' | 'error' | 'info', text: string) => {
    setToastMessage({ type, text });
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Attempt Report Deletion
  const handleDeleteReport = (report: ReportItem) => {
    if (report.isStandard) {
      if (currentUserRole !== 'ADMIN') {
        showToast(
          'error',
          '⛔ خطای عدم دسترسی: امکان حذف گزارشات استاندارد توسط کاربران عادی وجود ندارد. تنها مدیر ارشد سیستم (آقای محسن واحدی) مجوز حذف گزارشات پایه را دارد.'
        );
        return;
      }
      setStandardReports((prev) => prev.filter((r) => r.id !== report.id));
      showToast('success', `گزارش پایه «${report.title}» با موفقیت توسط مدیر ارشد سیستم حذف شد.`);
    } else {
      setAiReports((prev) => prev.filter((r) => r.id !== report.id));
      showToast('success', `گزارش درخواستی «${report.title}» با موفقیت حذف گردید.`);
    }
    if (selectedReport?.id === report.id) {
      setSelectedReport(null);
    }
  };

  // AI Report Generator Interaction Logic
  const handleAiBuilderSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!builderPrompt.trim() || builderLoading) return;

    const userText = builderPrompt.trim();
    setBuilderPrompt('');
    setBuilderHistory((prev) => [...prev, { sender: 'user', text: userText }]);
    setBuilderLoading(true);

    setTimeout(() => {
      setBuilderLoading(false);

      // 1. Role Permission Guard Check
      if (currentUserRole === 'REGULAR' && (userText.includes('تراز') || userText.includes('سود و زیان') || userText.includes('حقوق') || userText.includes('دستمزد') || userText.includes('محرمانه'))) {
        setBuilderHistory((prev) => [
          ...prev,
          {
            sender: 'ai',
            text: `⚠️ جناب کاربر گرامی، ضمن عرض احترام و پوزش، حساب کاربری شما (سطح: کارشناس عادی) مجوز و دسترسی لازم برای دریافت گزارش اسناد محرمانه مالی، تراز ۴ ستونی و حقوق دستمزد را ندارد. لطفاً جهت افزایش سطح دسترسی با مدیریت ارشد سیستم (جناب آقای محسن واحدی) تماس حاصل فرمایید.`
          }
        ]);
        showToast('error', 'عدم دسترسی به اسناد محرمانه مالی');
        return;
      }

      // 2. Identify missing parameters if query is brief
      const lower = userText.toLowerCase();

      if (lower.includes('تراز') || lower.includes('4 ستونی') || lower.includes('۴ ستونی')) {
        setPendingReportRequest({
          type: 'BALANCE',
          title: 'تراز ۴ ستونی آزمایشی حساب‌ها',
          dateFrom: '۱۴۰۵/۰۱/۰۱',
          dateTo: '۱۴۰۵/۰۵/۱۵',
          costCenter: 'خط بچینگ بتن شماره ۱',
          level: 'معین'
        });

        setBuilderHistory((prev) => [
          ...prev,
          {
            sender: 'ai',
            text: `جهت تنظیم و استخراج دقیق **تراز ۴ ستونی آزمایشی**، لطفاً پارامترهای زیر را بررسی و تایید فرمایید تا گزارش درخواستی شما با بالاترین دقت تولید و در منوی گزارشات قرار گیرد:`
          }
        ]);
        return;
      }

      if (lower.includes('مرخصی') || lower.includes('استحقاقی') || lower.includes('سنوات')) {
        setPendingReportRequest({
          type: 'LEAVE',
          title: 'گزارش مانده مرخصی استحقاقی پرسنل',
          dateFrom: '۱۴۰۵/۰۱/۰۱',
          dateTo: '۱۴۰۵/۰۵/۰۵',
          costCenter: 'واحد تولید چیدمانا (APS)',
          level: 'تفصیلی پرسنلی'
        });

        setBuilderHistory((prev) => [
          ...prev,
          {
            sender: 'ai',
            text: `جهت استخراج دقیق **گزارش مانده مرخصی استحقاقی و ذخیره سنوات پرسنل**، لطفاً پارامترهای زیر را تایید فرمایید:`
          }
        ]);
        return;
      }

      // Default generated report for other prompts
      const newReportId = `RPT-AI-${Math.floor(1000 + Math.random() * 9000)}`;
      const generatedReport: ReportItem = {
        id: newReportId,
        reportNumber: `AI-1405-${Math.floor(1000 + Math.random() * 9000)}`,
        title: `گزارش درخواستی: ${userText}`,
        category: 'مالی و حسابداری',
        creator: `هوش مصنوعی Gemini (درخواست: ${currentUserName})`,
        isStandard: false,
        createdDate: '۱۴۰۵/۰۵/۰۵',
        securityLevel: 'محرمانه',
        costCenter: 'کل واحدهای آپتوس',
        dateRange: '۱۴۰۵/۰۱/۰۱ تا ۱۴۰۵/۰۵/۰۵',
        rowsCount: 5,
        description: `گزارش پویا و اختصاصی تولید شده بر اساس تحلیل هوش مصنوعی از داده‌های مرجع شرکت آپتوس برای درخواست «${userText}»`,
        dataSummary: {
          totalDebitIrr: 125000000000,
          totalCreditIrr: 125000000000,
          netBalanceIrr: 0,
          totalCount: 5
        },
        tableColumns: [
          { key: 'col1', label: 'کد / ردیف' },
          { key: 'col2', label: 'شرح عملکرد و موضوع' },
          { key: 'col3', label: 'مقدار / تن / مترمکعب' },
          { key: 'col4', label: 'مبلغ کل (ریال)' },
          { key: 'col5', label: 'وضعیت تطابق' }
        ],
        tableData: [
          { col1: '101', col2: 'تامین سیمان فله تیپ ۲ کارخانه', col3: '1,250 تن', col4: '23,125,000,000', col5: 'تایید شده' },
          { col1: '102', col2: 'تولید بتن C30 خط بچینگ ۱', col3: '2,400 مترمکعب', col4: '32,400,000,000', col5: 'تحویل داده شد' },
          { col1: '103', col2: 'تولید دیوار پیش‌ساخته APS', col3: '380 قطعه', col4: '18,500,000,000', col5: 'کنترل کیفیت OK' },
          { col1: '104', col2: 'فروش آنلاین Aptus Shop', col3: '85 سفارش', col4: '12,200,000,000', col5: 'تسویه آنلاین' },
          { col1: '105', col2: 'قبوض باسکول ۶۰ تنی خروجی', col3: '142 قبض', col4: '38,780,000,000', col5: 'ثبت دیتابیس' }
        ],
        chartData: [
          { name: 'سیمان فله', val: 23125 },
          { name: 'بتن C30', val: 32400 },
          { name: 'قطعات APS', val: 18500 },
          { name: 'فروشگاه', val: 12200 },
          { name: 'باسکول', val: 38780 }
        ]
      };

      setAiReports((prev) => [generatedReport, ...prev]);

      setBuilderHistory((prev) => [
        ...prev,
        {
          sender: 'ai',
          text: `✅ **گزارش درخواستی شما با موفقیت ساخته شد!**\n\n- **شماره گزارش:** ${generatedReport.reportNumber}\n- **عنوان:** ${generatedReport.title}\n- **وضعیت:** اضافه شده به تب «گزارشات درخواستی از هوش مصنوعی»\n\nهم‌اکنون می‌توانید آن را در بخش گزارشات اختصاصی مشاهده، چاپ یا به اکسل خروجی بگیرید.`
        }
      ]);

      showToast('success', `گزارش جدید با شماره ${generatedReport.reportNumber} ساخته و ذخیره شد.`);
    }, 1200);
  };

  // Confirm Pending Parameters & Create Report
  const handleConfirmPendingReport = () => {
    if (!pendingReportRequest) return;

    const newReportId = `RPT-AI-${Math.floor(1000 + Math.random() * 9000)}`;
    const newReportNum = `AI-1405-${Math.floor(1000 + Math.random() * 9000)}`;

    let generated: ReportItem;

    if (pendingReportRequest.type === 'BALANCE') {
      generated = {
        id: newReportId,
        reportNumber: newReportNum,
        title: `تراز ۴ ستونی آزمایشی (${pendingReportRequest.costCenter})`,
        category: 'مالی و حسابداری',
        creator: `هوش مصنوعی Gemini (درخواست: ${currentUserName})`,
        isStandard: false,
        createdDate: '۱۴۰۵/۰۵/۰۵',
        securityLevel: 'محرمانه',
        costCenter: pendingReportRequest.costCenter,
        dateRange: `${pendingReportRequest.dateFrom} تا ${pendingReportRequest.dateTo}`,
        rowsCount: 4,
        description: `گزارش تراز ۴ ستونی آزمایشی حساب‌های کل و معین بر اساس پارامترهای تایید شده مرکز هزینه ${pendingReportRequest.costCenter}`,
        dataSummary: {
          totalDebitIrr: 98000000000,
          totalCreditIrr: 98000000000,
          netBalanceIrr: 0,
          totalCount: 4
        },
        tableColumns: [
          { key: 'code', label: 'کد معین' },
          { key: 'title', label: 'عنوان حساب' },
          { key: 'debit', label: 'گردش بدهکار (ریال)' },
          { key: 'credit', label: 'گردش بستانکار (ریال)' },
          { key: 'balance', label: 'مانده بدهکار/بستانکار' }
        ],
        tableData: [
          { code: '10301-1', title: 'خرید مواد اولیه سیمان و افزودنی', debit: '48,000,000,000', credit: '42,000,000,000', balance: '6,000,000,000 بدهکار' },
          { code: '10502-3', title: 'مطالبات خریداران بتن آماده', debit: '32,000,000,000', credit: '22,000,000,000', balance: '10,000,000,000 بدهکار' },
          { code: '20101-2', title: 'بستانکاران تامین‌کننده پوکه و ماسه', debit: '18,000,000,000', credit: '34,000,000,000', balance: '16,000,000,000 بستانکار' },
          { code: '40101-1', title: 'درآمد تحویل بتن C30 به پروژه‌ها', debit: '0', credit: '98,000,000,000', balance: '98,000,000,000 بستانکار' }
        ],
        chartData: [
          { name: 'سیمان & افزودنی', val: 48000 },
          { name: 'مطالبات بتن', val: 32000 },
          { name: 'بستانکاران ماسه', val: 34000 },
          { name: 'درآمد بتن C30', val: 98000 }
        ]
      };
    } else {
      generated = {
        id: newReportId,
        reportNumber: newReportNum,
        title: `گزارش مانده مرخصی - ${pendingReportRequest.costCenter}`,
        category: 'منابع انسانی',
        creator: `هوش مصنوعی Gemini (درخواست: ${currentUserName})`,
        isStandard: false,
        createdDate: '۱۴۰۵/۰۵/۰۵',
        securityLevel: 'عادی',
        costCenter: pendingReportRequest.costCenter,
        dateRange: `${pendingReportRequest.dateFrom} تا ${pendingReportRequest.dateTo}`,
        rowsCount: 4,
        description: `گزارش استخراج شده مانده مرخصی استحقاقی پرسنل واحد ${pendingReportRequest.costCenter}`,
        dataSummary: {
          totalCount: 4,
          averageScore: 94.8
        },
        tableColumns: [
          { key: 'code', label: 'کد پرسنلی' },
          { key: 'name', label: 'نام پرسنل' },
          { key: 'dept', label: 'بخش' },
          { key: 'used', label: 'مرخصی رفته' },
          { key: 'remain', label: 'مانده مرخصی (روز)' }
        ],
        tableData: [
          { code: 'HR-101', name: 'مهندس حسینی', dept: pendingReportRequest.costCenter, used: '۳ روز', remain: '۱۲.۰ روز' },
          { code: 'HR-104', name: 'آقای کاظمی', dept: pendingReportRequest.costCenter, used: '۵ روز', remain: '۹.۵ روز' },
          { code: 'HR-108', name: 'مهندس قاسمی', dept: pendingReportRequest.costCenter, used: '۲ روز', remain: '۱۴.۰ روز' },
          { code: 'HR-112', name: 'استاد نوری', dept: pendingReportRequest.costCenter, used: '۶ روز', remain: '۷.۵ روز' }
        ],
        chartData: [
          { name: 'م. حسینی', remain: 12.0 },
          { name: 'آ. کاظمی', remain: 9.5 },
          { name: 'م. قاسمی', remain: 14.0 },
          { name: 'ا. نوری', remain: 7.5 }
        ]
      };
    }

    setAiReports((prev) => [generated, ...prev]);
    setPendingReportRequest(null);

    setBuilderHistory((prev) => [
      ...prev,
      {
        sender: 'ai',
        text: `✅ **گزارش درخواستی شما بر اساس پارامترهای تایید شده استخراج شد!**\n\n- **شماره گزارش:** ${generated.reportNumber}\n- **عنوان:** ${generated.title}\n- **مرکز هزینه:** ${generated.costCenter}\n- **بازه زمانی:** ${generated.dateRange}\n\nگزارش فوق در لیست «گزارشات درخواستی از هوش مصنوعی» قرار گرفت.`
      }
    ]);

    showToast('success', `گزارش ${generated.reportNumber} به بخش گزارشات هوش مصنوعی افزوده شد.`);
  };

  const filteredStandardReports = standardReports.filter((r) => {
    const matchesSearch = r.title.includes(searchTerm) || r.reportNumber.includes(searchTerm) || r.description.includes(searchTerm);
    const matchesCat = categoryFilter === 'همه' || r.category === categoryFilter;
    return matchesSearch && matchesCat;
  });

  const filteredAiReports = aiReports.filter((r) => {
    const matchesSearch = r.title.includes(searchTerm) || r.reportNumber.includes(searchTerm) || r.description.includes(searchTerm);
    const matchesCat = categoryFilter === 'همه' || r.category === categoryFilter;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="p-4 lg:p-6 space-y-6 dir-rtl font-sans text-slate-900 dark:text-slate-100 min-h-screen pb-24 transition-colors">
      {/* Toast Alert Banner */}
      {toastMessage && (
        <div
          className={`fixed top-20 left-1/2 -translate-x-1/2 z-50 font-black px-6 py-3.5 rounded-2xl shadow-2xl border flex items-center gap-3 text-xs animate-in slide-in-from-top duration-300 max-w-xl text-center ${
            toastMessage.type === 'error'
              ? 'bg-rose-500 text-white border-rose-300'
              : toastMessage.type === 'success'
              ? 'bg-emerald-500 text-slate-950 border-emerald-300'
              : 'bg-blue-600 text-white border-blue-400'
          }`}
        >
          {toastMessage.type === 'error' ? <AlertTriangle className="w-5 h-5 shrink-0" /> : <CheckCircle2 className="w-5 h-5 shrink-0" />}
          <span>{toastMessage.text}</span>
        </div>
      )}

      {/* Top Header Banner & Role Simulator Switcher */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-white via-slate-50 to-blue-50/60 dark:from-[#032b75]/40 dark:via-[#07162c] dark:to-[#040e1a] border border-slate-200 dark:border-[#f05a24]/30 shadow-lg dark:shadow-2xl backdrop-blur-xl relative overflow-hidden flex flex-col xl:flex-row xl:items-center justify-between gap-6 transition-all">
        <div className="space-y-2 z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#f05a24]/10 dark:bg-[#f05a24]/20 border border-[#f05a24]/30 text-[#f05a24] text-xs font-black">
            <Sparkles className="w-4 h-4 text-[#f05a24] animate-pulse" />
            <span>سامانه گزارشات پویا و هوشمند AI • شرکت ساختمانی آپتوس ایران</span>
          </div>
          <h2 className="text-xl lg:text-2xl font-black text-[#032b75] dark:text-slate-100 flex items-center gap-3">
            <FileText className="w-7 h-7 text-[#f05a24]" />
            <span>مرکز گزارشات پویای سازمان & هوش مصنوعی</span>
          </h2>
          <p className="text-xs text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed font-medium">
            استخراج آنلاین کلیه گزارشات مالی، صورت سود و زیان، ترازنامه، بهای تمام شده بتن و APS، کارکرد پرسنل و قبوض باسکول بر اساس آخرین استانداردهای سازمانی و تحلیل هوشمند هوش مصنوعی.
          </p>
        </div>

        {/* User Role Simulator Controls */}
        <div className="p-4 rounded-2xl bg-slate-100 dark:bg-black/30 border border-slate-200 dark:border-white/10 space-y-2 z-10 shrink-0">
          <div className="flex items-center justify-between gap-3 text-xs">
            <span className="font-extrabold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <Users className="w-4 h-4 text-[#0284c7]" />
              <span>نقش و دسترسی فعال در سیستم:</span>
            </span>
            <span className="font-mono text-[11px] font-extrabold px-2 py-0.5 rounded bg-[#f05a24]/15 text-[#f05a24]">
              {currentUserRole}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setCurrentUserRole('ADMIN')}
              className={`px-3 py-1.5 rounded-xl text-[11px] font-black transition-all ${
                currentUserRole === 'ADMIN'
                  ? 'bg-[#032b75] text-white shadow-md'
                  : 'bg-white dark:bg-white/10 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              مدیر ارشد (آقای واحدی)
            </button>
            <button
              type="button"
              onClick={() => setCurrentUserRole('CFO')}
              className={`px-3 py-1.5 rounded-xl text-[11px] font-black transition-all ${
                currentUserRole === 'CFO'
                  ? 'bg-[#032b75] text-white shadow-md'
                  : 'bg-white dark:bg-white/10 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              مدیر ارشد مالی
            </button>
            <button
              type="button"
              onClick={() => setCurrentUserRole('REGULAR')}
              className={`px-3 py-1.5 rounded-xl text-[11px] font-black transition-all ${
                currentUserRole === 'REGULAR'
                  ? 'bg-rose-600 text-white shadow-md'
                  : 'bg-white dark:bg-white/10 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              کاربر عادی (بدون مالی)
            </button>
          </div>
          <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">
            کاربر جاری: <strong className="text-slate-800 dark:text-slate-200">{currentUserName}</strong>
          </p>
        </div>
      </div>

      {/* Main Navigation Tabs */}
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/10 pb-3 gap-2 overflow-x-auto text-xs font-black">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setActiveTab('STANDARD')}
            className={`px-4 py-2.5 rounded-2xl flex items-center gap-2 transition-all whitespace-nowrap ${
              activeTab === 'STANDARD'
                ? 'bg-[#032b75] text-white shadow-lg shadow-blue-900/20 font-black'
                : 'bg-white dark:bg-white/5 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10 border border-slate-200 dark:border-transparent'
            }`}
          >
            <Award className="w-4 h-4 text-[#f05a24]" />
            <span>۱. گزارشات استاندارد سازمانی</span>
            <span className="px-2 py-0.5 rounded-full bg-white/20 text-white font-mono text-[10px]">
              {standardReports.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('AI_CUSTOM')}
            className={`px-4 py-2.5 rounded-2xl flex items-center gap-2 transition-all whitespace-nowrap relative ${
              activeTab === 'AI_CUSTOM'
                ? 'bg-[#f05a24] text-white shadow-lg shadow-orange-500/20 font-black'
                : 'bg-white dark:bg-white/5 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10 border border-slate-200 dark:border-transparent'
            }`}
          >
            <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
            <span>۲. گزارشات درخواستی از هوش مصنوعی</span>
            <span className="px-2 py-0.5 rounded-full bg-white/20 text-white font-mono text-[10px]">
              {aiReports.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('AI_BUILDER')}
            className={`px-4 py-2.5 rounded-2xl flex items-center gap-2 transition-all whitespace-nowrap ${
              activeTab === 'AI_BUILDER'
                ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg font-black'
                : 'bg-white dark:bg-white/5 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10 border border-slate-200 dark:border-transparent'
            }`}
          >
            <Plus className="w-4 h-4 text-emerald-400" />
            <span>۳. دستیار & طراح هوشمند گزارشات AI</span>
          </button>
        </div>

        {/* Quick Search & Filter Controls for Report Lists */}
        {activeTab !== 'AI_BUILDER' && (
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute right-3 top-2.5" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="جستجوی عنوان گزارش..."
                className="pr-9 pl-3 py-1.5 rounded-xl bg-white dark:bg-[#040e1a] border border-slate-200 dark:border-white/10 text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-[#f05a24] font-medium"
              />
            </div>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-3 py-1.5 rounded-xl bg-white dark:bg-[#040e1a] border border-slate-200 dark:border-white/10 text-xs text-slate-900 dark:text-slate-100 font-bold focus:outline-none"
            >
              <option value="همه">همه دسته‌ها</option>
              <option value="مالی و حسابداری">مالی و حسابداری</option>
              <option value="منابع انسانی">منابع انسانی</option>
              <option value="تولید بتن & APS">تولید بتن & APS</option>
              <option value="بازرگانی & باسکول">بازرگانی & باسکول</option>
            </select>
          </div>
        )}
      </div>

      {/* TAB 1: STANDARD CORPORATE REPORTS */}
      {activeTab === 'STANDARD' && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-blue-50/80 dark:bg-[#032b75]/20 border border-blue-200 dark:border-[#032b75]/50 text-xs text-slate-800 dark:text-slate-200 flex items-center justify-between gap-4 font-medium">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-[#0284c7] shrink-0" />
              <span>
                <strong>قوانین دسترسی به گزارشات پایه:</strong> گزارشات این بخش، استانداردهای دائمی سازمانی آپتوس هستند. کاربران عادی مجوز حذف آن‌ها را ندارند و تنها مدیر ارشد سیستم مجاز به مدیریت است.
              </span>
            </div>
            <span className="text-[10px] font-mono font-bold px-2.5 py-1 rounded bg-[#032b75] text-white shrink-0">
              Aptus Certified Standard
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredStandardReports.map((report) => (
              <div
                key={report.id}
                className="p-5 rounded-3xl bg-white dark:bg-[#07162c]/80 border border-slate-200 dark:border-white/10 hover:border-[#f05a24]/50 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between group space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-blue-100 dark:bg-blue-500/20 text-blue-800 dark:text-blue-300 border border-blue-300 dark:border-blue-500/30">
                      {report.reportNumber}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        report.securityLevel === 'سری (مدیران ارشد)'
                          ? 'bg-rose-100 dark:bg-rose-500/20 text-rose-800 dark:text-rose-300 border border-rose-300'
                          : report.securityLevel === 'محرمانه'
                          ? 'bg-amber-100 dark:bg-amber-500/20 text-amber-800 dark:text-amber-300 border border-amber-300'
                          : 'bg-slate-200 dark:bg-white/10 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      {report.securityLevel}
                    </span>
                  </div>

                  <h3 className="font-black text-slate-900 dark:text-slate-100 text-sm group-hover:text-[#f05a24] transition-colors line-clamp-2">
                    {report.title}
                  </h3>

                  <p className="text-[11px] text-slate-600 dark:text-slate-400 line-clamp-2 font-medium leading-relaxed">
                    {report.description}
                  </p>

                  <div className="p-3 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 space-y-1.5 text-[11px]">
                    <div className="flex justify-between text-slate-600 dark:text-slate-400">
                      <span>دسته‌بندی:</span>
                      <strong className="text-slate-900 dark:text-slate-200">{report.category}</strong>
                    </div>
                    <div className="flex justify-between text-slate-600 dark:text-slate-400">
                      <span>مرکز هزینه:</span>
                      <strong className="text-slate-900 dark:text-slate-200">{report.costCenter}</strong>
                    </div>
                    <div className="flex justify-between text-slate-600 dark:text-slate-400">
                      <span>تاریخ ثبت:</span>
                      <span className="font-mono text-slate-800 dark:text-slate-300">{report.createdDate}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-white/10 flex items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedReport(report)}
                    className="flex-1 py-2 px-3 rounded-xl bg-[#032b75] hover:bg-[#0284c7] text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-sm active:scale-95"
                  >
                    <Eye className="w-4 h-4" />
                    <span>مشاهده کامل گزارش</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDeleteReport(report)}
                    className={`p-2 rounded-xl transition-all border ${
                      currentUserRole === 'ADMIN'
                        ? 'hover:bg-rose-50 dark:hover:bg-rose-500/20 text-slate-400 hover:text-rose-600 border-transparent hover:border-rose-200'
                        : 'opacity-50 text-slate-400 border-slate-200 cursor-not-allowed'
                    }`}
                    title={
                      currentUserRole === 'ADMIN'
                        ? 'حذف گزارش استاندارد (ویژه مدیر ارشد)'
                        : 'امکان حذف برای کاربران عادی وجود ندارد'
                    }
                  >
                    {currentUserRole === 'ADMIN' ? <Trash2 className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: AI CUSTOM REQUESTED REPORTS */}
      {activeTab === 'AI_CUSTOM' && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-orange-50/80 dark:bg-[#f05a24]/10 border border-orange-200 dark:border-[#f05a24]/30 text-xs text-slate-800 dark:text-slate-200 flex items-center justify-between gap-4 font-medium">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#f05a24] shrink-0" />
              <span>
                <strong>گزارشات تولید شده توسط هوش مصنوعی:</strong> لیست کلیه گزارشاتی که بر اساس درخواست‌های متنی شما از دستیار Gemini تولید شده است. این گزارشات پویا و به لحظه هستند.
              </span>
            </div>
            <button
              type="button"
              onClick={() => setActiveTab('AI_BUILDER')}
              className="px-3 py-1.5 rounded-xl bg-[#f05a24] text-white font-black text-xs flex items-center gap-1.5 shrink-0 hover:bg-[#ea580c] transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>درخواست گزارش جدید از AI</span>
            </button>
          </div>

          {filteredAiReports.length === 0 ? (
            <div className="p-12 text-center rounded-3xl bg-white dark:bg-[#07162c]/60 border border-slate-200 dark:border-white/10 space-y-3">
              <FileText className="w-12 h-12 text-slate-400 mx-auto" />
              <p className="text-sm font-bold text-slate-700 dark:text-slate-300">هنوز گزارشی سفارشی با این فیلتر تولید نشده است.</p>
              <button
                type="button"
                onClick={() => setActiveTab('AI_BUILDER')}
                className="px-4 py-2 rounded-2xl bg-[#f05a24] text-white font-black text-xs inline-flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                <span>ورود به طراح هوشمند گزارشات</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredAiReports.map((report) => (
                <div
                  key={report.id}
                  className="p-5 rounded-3xl bg-white dark:bg-[#07162c]/80 border border-slate-200 dark:border-white/10 hover:border-[#f05a24]/50 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between group space-y-4"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-orange-100 dark:bg-orange-500/20 text-[#f05a24] border border-orange-300">
                        {report.reportNumber}
                      </span>
                      <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-purple-100 dark:bg-purple-500/20 text-purple-800 dark:text-purple-300 border border-purple-300">
                        تولید شده با AI
                      </span>
                    </div>

                    <h3 className="font-black text-slate-900 dark:text-slate-100 text-sm group-hover:text-[#f05a24] transition-colors line-clamp-2">
                      {report.title}
                    </h3>

                    <p className="text-[11px] text-slate-600 dark:text-slate-400 line-clamp-2 font-medium leading-relaxed">
                      {report.description}
                    </p>

                    <div className="p-3 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 space-y-1.5 text-[11px]">
                      <div className="flex justify-between text-slate-600 dark:text-slate-400">
                        <span>سازنده گزارش:</span>
                        <strong className="text-slate-900 dark:text-slate-200">{report.creator}</strong>
                      </div>
                      <div className="flex justify-between text-slate-600 dark:text-slate-400">
                        <span>مرکز هزینه:</span>
                        <strong className="text-slate-900 dark:text-slate-200">{report.costCenter}</strong>
                      </div>
                      <div className="flex justify-between text-slate-600 dark:text-slate-400">
                        <span>تاریخ تولید:</span>
                        <span className="font-mono text-slate-800 dark:text-slate-300">{report.createdDate}</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 dark:border-white/10 flex items-center justify-between gap-2">
                    <button
                      type="button"
                      onClick={() => setSelectedReport(report)}
                      className="flex-1 py-2 px-3 rounded-xl bg-[#f05a24] hover:bg-[#ea580c] text-white text-xs font-black flex items-center justify-center gap-1.5 transition-all shadow-sm active:scale-95"
                    >
                      <Eye className="w-4 h-4" />
                      <span>مشاهده گزارش AI</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDeleteReport(report)}
                      className="p-2 rounded-xl hover:bg-rose-50 dark:hover:bg-rose-500/20 text-slate-400 hover:text-rose-600 transition-all border border-transparent hover:border-rose-200"
                      title="حذف گزارش"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: INTERACTIVE AI REPORT BUILDER & DIALOG */}
      {activeTab === 'AI_BUILDER' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Builder Left Chat Area */}
          <div className="lg:col-span-8 p-6 rounded-3xl bg-white dark:bg-[#07162c]/90 border border-slate-200 dark:border-white/10 shadow-xl flex flex-col h-[620px]">
            <div className="pb-4 border-b border-slate-200 dark:border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#f05a24] to-purple-600 flex items-center justify-center text-white shadow-md">
                  <Sparkles className="w-5 h-5 animate-pulse" />
                </div>
                <div>
                  <h3 className="font-black text-slate-900 dark:text-slate-100 text-sm">
                    طراح هوشمند و سخنگوی گزارشات شرکت آپتوس
                  </h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                    متن درخواست خود را بنویسید (مثلاً: «تراز ۴ ستونی خط بچینگ بتن» یا «مانده مرخصی پرسنل»)
                  </p>
                </div>
              </div>
              <span className="text-[10px] font-mono px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 font-bold border border-emerald-300">
                Gemini 3.6 Engine
              </span>
            </div>

            {/* Chat History Messages */}
            <div className="flex-1 overflow-y-auto py-4 space-y-4 pr-1">
              {builderHistory.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex gap-3 text-xs leading-relaxed ${
                    msg.sender === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  {msg.sender === 'ai' && (
                    <div className="w-8 h-8 rounded-xl bg-[#032b75] text-white flex items-center justify-center shrink-0 mt-1 shadow-sm">
                      <Sparkles className="w-4 h-4 text-amber-300" />
                    </div>
                  )}

                  <div
                    className={`max-w-[85%] rounded-2xl p-4 shadow-md font-medium whitespace-pre-wrap ${
                      msg.sender === 'user'
                        ? 'bg-[#f05a24] text-white rounded-tl-none'
                        : 'bg-slate-100 dark:bg-white/10 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-white/10 rounded-tr-none'
                    }`}
                  >
                    {msg.text}
                  </div>

                  {msg.sender === 'user' && (
                    <div className="w-8 h-8 rounded-xl bg-slate-200 dark:bg-white/10 text-slate-700 dark:text-slate-300 flex items-center justify-center shrink-0 mt-1">
                      <Users className="w-4 h-4" />
                    </div>
                  )}
                </div>
              ))}

              {/* Pending Parameters Input Card if AI asked for details */}
              {pendingReportRequest && (
                <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-500/15 border border-amber-300 dark:border-amber-500/40 text-xs space-y-3 animate-in fade-in">
                  <div className="font-extrabold text-amber-900 dark:text-amber-200 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                    <span>تایید پارامترهای گزارش قبل از استخراج نهایی:</span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-[11px]">
                    <div>
                      <label className="text-slate-600 dark:text-slate-400 font-bold block mb-1">از تاریخ:</label>
                      <input
                        type="text"
                        value={pendingReportRequest.dateFrom}
                        onChange={(e) =>
                          setPendingReportRequest({ ...pendingReportRequest, dateFrom: e.target.value })
                        }
                        className="w-full px-2.5 py-1.5 rounded-lg bg-white dark:bg-[#040e1a] border border-amber-300 dark:border-amber-500/50 font-mono text-slate-900 dark:text-slate-100"
                      />
                    </div>
                    <div>
                      <label className="text-slate-600 dark:text-slate-400 font-bold block mb-1">تا تاریخ:</label>
                      <input
                        type="text"
                        value={pendingReportRequest.dateTo}
                        onChange={(e) =>
                          setPendingReportRequest({ ...pendingReportRequest, dateTo: e.target.value })
                        }
                        className="w-full px-2.5 py-1.5 rounded-lg bg-white dark:bg-[#040e1a] border border-amber-300 dark:border-amber-500/50 font-mono text-slate-900 dark:text-slate-100"
                      />
                    </div>
                    <div>
                      <label className="text-slate-600 dark:text-slate-400 font-bold block mb-1">مرکز هزینه / بخش:</label>
                      <select
                        value={pendingReportRequest.costCenter}
                        onChange={(e) =>
                          setPendingReportRequest({ ...pendingReportRequest, costCenter: e.target.value })
                        }
                        className="w-full px-2.5 py-1.5 rounded-lg bg-white dark:bg-[#040e1a] border border-amber-300 dark:border-amber-500/50 font-bold text-slate-900 dark:text-slate-100"
                      >
                        <option value="خط بچینگ بتن شماره ۱">خط بچینگ بتن شماره ۱</option>
                        <option value="واحد تولید چیدمانا (APS)">واحد تولید چیدمانا (APS)</option>
                        <option value="ایستگاه باسکول ۶۰ تنی">ایستگاه باسکول ۶۰ تنی</option>
                        <option value="فروشگاه آنلاین Aptus Shop">فروشگاه آنلاین Aptus Shop</option>
                        <option value="دفتر مرکزی & کل پروژه‌ها">دفتر مرکزی & کل پروژه‌ها</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-slate-600 dark:text-slate-400 font-bold block mb-1">سطح تفکیک:</label>
                      <select
                        value={pendingReportRequest.level}
                        onChange={(e) =>
                          setPendingReportRequest({ ...pendingReportRequest, level: e.target.value })
                        }
                        className="w-full px-2.5 py-1.5 rounded-lg bg-white dark:bg-[#040e1a] border border-amber-300 dark:border-amber-500/50 font-bold text-slate-900 dark:text-slate-100"
                      >
                        <option value="معین">حساب‌های معین</option>
                        <option value="کل">حساب‌های کل</option>
                        <option value="تفصیلی">تفصیلی / پرسنلی</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => setPendingReportRequest(null)}
                      className="px-3 py-1.5 rounded-xl bg-slate-200 dark:bg-white/10 text-slate-700 dark:text-slate-300 font-bold hover:bg-slate-300"
                    >
                      انصراف
                    </button>
                    <button
                      type="button"
                      onClick={handleConfirmPendingReport}
                      className="px-4 py-1.5 rounded-xl bg-[#f05a24] hover:bg-[#ea580c] text-white font-black flex items-center gap-1.5 shadow-md"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>تایید پارامترها و استخراج گزارش</span>
                    </button>
                  </div>
                </div>
              )}

              {builderLoading && (
                <div className="flex items-center gap-3 text-xs text-[#f05a24] bg-[#f05a24]/10 p-3.5 rounded-2xl border border-[#f05a24]/30 animate-pulse">
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>هوش مصنوعی در حال تحلیل نقش کاربری و داده‌های دیتابیس مرجع آپتوس است...</span>
                </div>
              )}
            </div>

            {/* Builder Input Field */}
            <form onSubmit={handleAiBuilderSubmit} className="pt-3 border-t border-slate-200 dark:border-white/10 flex gap-2">
              <input
                type="text"
                value={builderPrompt}
                onChange={(e) => setBuilderPrompt(e.target.value)}
                placeholder="درخواست خود را بنویسید (مثلاً: یک تراز ۴ ستونی بده)..."
                disabled={builderLoading}
                className="flex-1 px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-[#040e1a] border border-slate-200 dark:border-white/10 text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-[#f05a24] font-medium"
              />
              <button
                type="submit"
                disabled={builderLoading || !builderPrompt.trim()}
                className="px-5 py-2.5 rounded-xl bg-[#f05a24] hover:bg-[#ea580c] text-white font-black text-xs flex items-center gap-1.5 disabled:opacity-50 transition-colors shadow-md"
              >
                <Send className="w-4 h-4" />
                <span>ارسال</span>
              </button>
            </form>
          </div>

          {/* Builder Right Quick Examples Side Card */}
          <div className="lg:col-span-4 p-6 rounded-3xl bg-white dark:bg-[#07162c]/90 border border-slate-200 dark:border-white/10 shadow-xl space-y-4">
            <h3 className="font-black text-slate-900 dark:text-slate-100 text-sm flex items-center gap-2 border-b border-slate-200 dark:border-white/10 pb-3">
              <Sparkles className="w-4 h-4 text-[#f05a24]" />
              <span>نمونه درخواست‌های پیشنهادی:</span>
            </h3>

            <div className="space-y-2 text-xs">
              <button
                type="button"
                onClick={() => setBuilderPrompt('یک تراز ۴ ستونی از تاریخ ۱۴۰۵/۰۱/۰۱ تا ۱۴۰۵/۰۵/۱۵ بده')}
                className="w-full p-3 rounded-2xl bg-slate-50 dark:bg-white/5 hover:bg-orange-50 dark:hover:bg-[#f05a24]/15 border border-slate-200 dark:border-white/10 hover:border-[#f05a24]/40 text-right transition-all group"
              >
                <div className="font-bold text-slate-800 dark:text-slate-200 group-hover:text-[#f05a24]">
                  «یک تراز ۴ ستونی بده»
                </div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-1">
                  تست بررسی نقش کاربر و پرسش پارامترهای از/تا تاریخ و مرکز هزینه
                </div>
              </button>

              <button
                type="button"
                onClick={() => setBuilderPrompt('گزارش مانده مرخصی پرسنل واحد چیدمانا APS')}
                className="w-full p-3 rounded-2xl bg-slate-50 dark:bg-white/5 hover:bg-orange-50 dark:hover:bg-[#f05a24]/15 border border-slate-200 dark:border-white/10 hover:border-[#f05a24]/40 text-right transition-all group"
              >
                <div className="font-bold text-slate-800 dark:text-slate-200 group-hover:text-[#f05a24]">
                  «گزارش مانده مرخصی پرسنل چیدمانا»
                </div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-1">
                  استخراج پرونده منابع انسانی، ذخیره مرخصی و نمره‌های KPI
                </div>
              </button>

              <button
                type="button"
                onClick={() => setBuilderPrompt('گزارش قبوض خروجی باسکول ۶۰ تنی')}
                className="w-full p-3 rounded-2xl bg-slate-50 dark:bg-white/5 hover:bg-orange-50 dark:hover:bg-[#f05a24]/15 border border-slate-200 dark:border-white/10 hover:border-[#f05a24]/40 text-right transition-all group"
              >
                <div className="font-bold text-slate-800 dark:text-slate-200 group-hover:text-[#f05a24]">
                  «گزارش توزین و قبوض باسکول»
                </div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-1">
                  تحلیل وزنی بارگیری بتن، سیمان و سنگ‌دانه ورودی
                </div>
              </button>
            </div>

            <div className="p-3.5 rounded-2xl bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/30 text-[11px] text-slate-700 dark:text-slate-300 space-y-1">
              <strong className="text-[#0284c7] block font-black">راهنمای هوشمند:</strong>
              <p className="leading-relaxed font-medium">
                در صورت استفاده از کلماتی همچون «تراز» یا «مرخصی» اگر کاربر عادی باشید، سیستم بلافاصله هشدار عدم دسترسی می‌دهد. اگر مدیر ارشد یا مالی باشید، پارامترها پرسیده و گزارش ساخته می‌شود.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* FULL REPORT VIEWER MODAL */}
      {selectedReport && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 dark:bg-[#040e1a]/90 backdrop-blur-md flex items-center justify-center p-4 lg:p-6 overflow-y-auto">
          <div className="w-full max-w-5xl bg-white dark:bg-[#07162c] border border-slate-300 dark:border-white/20 rounded-3xl shadow-2xl overflow-hidden font-sans space-y-6 my-auto animate-in zoom-in-95 duration-200">
            {/* Modal Top Header Bar */}
            <div className="p-6 bg-gradient-to-r from-slate-100 via-blue-50 to-slate-100 dark:from-[#032b75] dark:via-[#07162c] dark:to-[#040e1a] border-b border-slate-200 dark:border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <AptusLogo size="sm" />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-[#f05a24] text-white">
                      {selectedReport.reportNumber}
                    </span>
                    <span className="text-[10px] font-mono font-extrabold px-2 py-0.5 rounded bg-white/20 text-slate-800 dark:text-slate-200">
                      کد سند: {selectedReport.id}
                    </span>
                  </div>
                  <h3 className="text-base lg:text-lg font-black text-slate-900 dark:text-slate-100 mt-1">
                    {selectedReport.title}
                  </h3>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    try {
                      window.print();
                    } catch (e) {
                      console.warn('Print not supported or blocked:', e);
                    }
                  }}
                  className="px-3 py-1.5 rounded-xl bg-slate-200 dark:bg-white/10 hover:bg-slate-300 dark:hover:bg-white/20 text-slate-800 dark:text-slate-200 text-xs font-bold flex items-center gap-1.5 transition-colors"
                >
                  <Printer className="w-4 h-4" />
                  <span>چاپ / PDF</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    showToast('success', `خروجی اکسل گزارش ${selectedReport.reportNumber} آماده دریافت شد.`);
                  }}
                  className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 transition-colors shadow-sm"
                >
                  <Download className="w-4 h-4" />
                  <span>خروجی Excel</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedReport(null)}
                  className="p-2 rounded-xl bg-slate-200 dark:bg-white/10 hover:bg-slate-300 text-slate-700 dark:text-slate-300 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Body Content */}
            <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
              {/* Report Summary Cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10">
                  <span className="text-slate-500 dark:text-slate-400 font-bold block">دسته‌بندی:</span>
                  <span className="text-slate-900 dark:text-slate-100 font-black text-sm">{selectedReport.category}</span>
                </div>
                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10">
                  <span className="text-slate-500 dark:text-slate-400 font-bold block">مرکز هزینه:</span>
                  <span className="text-slate-900 dark:text-slate-100 font-black text-sm">{selectedReport.costCenter}</span>
                </div>
                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10">
                  <span className="text-slate-500 dark:text-slate-400 font-bold block">بازه زمانی:</span>
                  <span className="text-slate-900 dark:text-slate-100 font-mono font-bold text-xs">{selectedReport.dateRange}</span>
                </div>
                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10">
                  <span className="text-slate-500 dark:text-slate-400 font-bold block">سازنده گزارش:</span>
                  <span className="text-slate-900 dark:text-slate-100 font-bold text-xs">{selectedReport.creator}</span>
                </div>
              </div>

              {/* Visual Chart if Chart Data exists */}
              {selectedReport.chartData && selectedReport.chartData.length > 0 && (
                <div className="p-5 rounded-3xl bg-slate-50 dark:bg-[#040e1a] border border-slate-200 dark:border-white/10 space-y-3">
                  <h4 className="font-extrabold text-[#032b75] dark:text-slate-100 text-xs flex items-center gap-2">
                    <BarChart3 className="w-4 h-4 text-[#f05a24]" />
                    <span>تحلیل نموداری داده‌های گزارش:</span>
                  </h4>
                  <div className="h-56 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={selectedReport.chartData}>
                        <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                        <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                        <YAxis tick={{ fontSize: 10 }} />
                        <Tooltip />
                        <Bar dataKey="amount" fill="#f05a24" radius={[6, 6, 0, 0]} name="مبلغ (میلیون)" />
                        <Bar dataKey="val" fill="#0284c7" radius={[6, 6, 0, 0]} name="مقدار" />
                        <Bar dataKey="share" fill="#10b981" radius={[6, 6, 0, 0]} name="درصد" />
                        <Bar dataKey="days" fill="#8b5cf6" radius={[6, 6, 0, 0]} name="روز" />
                        <Bar dataKey="remain" fill="#ec4899" radius={[6, 6, 0, 0]} name="مانده" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              )}

              {/* Report Data Table */}
              <div className="space-y-3">
                <h4 className="font-extrabold text-[#032b75] dark:text-slate-100 text-xs flex items-center gap-2">
                  <Layers className="w-4 h-4 text-[#f05a24]" />
                  <span>جدول رسمی صورت داده‌های استخراج شده:</span>
                </h4>

                <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-white/10">
                  <table className="w-full text-right text-xs">
                    <thead className="bg-slate-100 dark:bg-white/10 text-slate-800 dark:text-slate-200 font-black border-b border-slate-200 dark:border-white/10">
                      <tr>
                        {selectedReport.tableColumns.map((col) => (
                          <th key={col.key} className="p-3">
                            {col.label}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-white/5 font-medium text-slate-800 dark:text-slate-200">
                      {selectedReport.tableData.map((row, idx) => (
                        <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                          {selectedReport.tableColumns.map((col) => (
                            <td key={col.key} className="p-3 dir-rtl font-mono">
                              {row[col.key]}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Modal Bottom Stamp Footer */}
            <div className="p-4 bg-slate-100 dark:bg-black/40 border-t border-slate-200 dark:border-white/10 text-[11px] text-slate-600 dark:text-slate-400 flex items-center justify-between">
              <div>
                <span>شرکت ساختمانی آپتوس ایران • سیستم مدیریت هوشمند ERP</span>
              </div>
              <div className="font-bold text-[#032b75] dark:text-slate-200">
                تایید شده توسط: آقای محسن واحدی (Aptus Admin)
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
