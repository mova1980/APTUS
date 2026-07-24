import {
  CurrencyRate,
  FinancialVoucher,
  ContractorPerformance,
  CostingMetrics,
  PersonnelRecord,
  ProductionBatch,
  WeighbridgeSlip,
  OfficeLetter,
  DbConfig
} from '../types';

export const CURRENCY_RATES: Record<string, CurrencyRate> = {
  IRR: { code: 'IRR', name: 'ریال ایران', symbol: 'ریال', rateToIrr: 1 },
  TOMAN: { code: 'TOMAN', name: 'تومان ایران', symbol: 'تومان', rateToIrr: 10 },
  USD: { code: 'USD', name: 'دلار آمریکا', symbol: '$', rateToIrr: 680000 },
  EUR: { code: 'EUR', name: 'یورو اروپا', symbol: '€', rateToIrr: 740000 },
  AED: { code: 'AED', name: 'درهم امارات', symbol: 'د.إ', rateToIrr: 185000 },
};

export const MOCK_DB_CONFIG: DbConfig = {
  host: '172.20.3.6',
  port: 1433,
  databaseName: 'Aptus_Ref_DB',
  username: 'sa_aptus_admin',
  dbType: 'SQL Server 2022',
  isConnected: true,
  lastSyncTime: '۱۴۰۵/۰۵/۰۲ - ۰۸:۴۵:۱۲',
  refDbRecordsCount: 184500
};

export const MOCK_FINANCIAL_VOUCHERS: FinancialVoucher[] = [
  {
    id: 'V-10201',
    voucherNumber: 4892,
    date: '۱۴۰۵/۰۵/۰۱',
    description: 'خرید سیمان فله تیپ ۲ کارخانه سیمان - محموله ۵۰۰ تنی ورودی به بچینگ آپتوس',
    costCenter: 'بچینگ بتن آماده - کارخانه شماره ۱',
    debitIrr: 8500000000, // 8.5B IRR
    creditIrr: 0,
    status: 'تایید نهایی',
    subsystem: 'FIN_PURCHASE'
  },
  {
    id: 'V-10202',
    voucherNumber: 4893,
    date: '۱۴۰۵/۰۵/۰۱',
    description: 'فروش و ارسال ۲۴۰ مترمکعب بتن آماده C30 به پروژه آپتو سنتر تریو',
    costCenter: 'شرکت ساختمانی آپتوس - دپارتمان بتن',
    debitIrr: 0,
    creditIrr: 14200000000,
    status: 'تایید نهایی',
    subsystem: 'FIN_SALES'
  },
  {
    id: 'V-10203',
    voucherNumber: 4894,
    date: '۱۴۰۵/۰۵/۰۲',
    description: 'تحویل و نصب قطعات پیش‌ساخته APS و دیوارهای خانه‌های چیدمانا',
    costCenter: 'سیستم‌های پیش‌ساخته (APS) خانه‌های چیدمانا',
    debitIrr: 0,
    creditIrr: 62500000000,
    status: 'تایید نهایی',
    subsystem: 'FIN_SALES'
  },
  {
    id: 'V-10204',
    voucherNumber: 4895,
    date: '۱۴۰۵/۰۵/۰۲',
    description: 'پرداخت فاکتور فروشگاه آنلاین Aptus - خریدهای اینترنتی کفپوش و جدول بتنی',
    costCenter: 'فروشگاه آنلاین Aptus',
    debitIrr: 0,
    creditIrr: 9800000000,
    status: 'تایید نهایی',
    subsystem: 'FIN_TREASURY'
  },
  {
    id: 'V-10205',
    voucherNumber: 4896,
    date: '۱۴۰۵/۰۵/۰۲',
    description: 'ثبت تکالیف مالیاتی سال ۱۴۰۵ و ارزش افزوده خرید میلگرد و قالب‌های APS',
    costCenter: 'دپارتمان مالی و حسابداری آپتوس',
    debitIrr: 32000000000,
    creditIrr: 0,
    status: 'در حال بررسی',
    subsystem: 'FIN_TAX_1405'
  }
];

export const MOCK_CONTRACTORS: ContractorPerformance[] = [
  {
    id: 'CTR-01',
    contractorName: 'پیمانکاری نصب سازه‌های پیش‌ساخته سازه نما',
    contractTitle: 'مونتاژ و نصب دیوارهای پیش‌ساخته بتنی و خانه‌های چیدمانا (APS)',
    contractValueIrr: 280000000000,
    paidAmountIrr: 195000000000,
    progressPercent: 78,
    taxRetentionIrr: 14000000000,
    performanceScore: 94,
    taxStatus1405: 'منطبق ماده ۱۰۴'
  },
  {
    id: 'CTR-02',
    contractorName: 'شرکت حمل و نقل ترک‌میکسر آپتوس ترابر',
    contractTitle: 'حمل بتن آماده از بچینگ آپتوس به پروژه‌های عمرانی استان تهران و البرز',
    contractValueIrr: 420000000000,
    paidAmountIrr: 310000000000,
    progressPercent: 85,
    taxRetentionIrr: 21000000000,
    performanceScore: 91,
    taxStatus1405: 'منطبق ماده ۱۰۴'
  },
  {
    id: 'CTR-03',
    contractorName: 'پیمانکاری اجرای کفپوش بتنی و جدول‌گذاری البرز',
    contractTitle: 'زیرسازی و نصب کفپوش بتنی سنگفرش و نیوجرسی‌های صادراتی آپتوس',
    contractValueIrr: 95000000000,
    paidAmountIrr: 45000000000,
    progressPercent: 52,
    taxRetentionIrr: 4750000000,
    performanceScore: 89,
    taxStatus1405: 'دارای معافیت'
  }
];

export const MOCK_COSTING_METRICS: CostingMetrics[] = [
  {
    cementType: 'بتن آماده C30 (مخصوص سازه)',
    dailyProductionTons: 4250, // 4250 tons/m3 per day
    rawMaterialCostPerTonIrr: 420000,
    energyCostPerTonIrr: 180000,
    laborCostPerTonIrr: 190000,
    overheadCostPerTonIrr: 160000,
    totalCostPerTonIrr: 950000,
    marketPricePerTonIrr: 1650000,
    profitMarginPercent: 42.4
  },
  {
    cementType: 'سیستم پیش‌ساخته (APS) و دیوار بتنی',
    dailyProductionTons: 1800,
    rawMaterialCostPerTonIrr: 590000,
    energyCostPerTonIrr: 220000,
    laborCostPerTonIrr: 280000,
    overheadCostPerTonIrr: 210000,
    totalCostPerTonIrr: 1300000,
    marketPricePerTonIrr: 2200000,
    profitMarginPercent: 40.9
  },
  {
    cementType: 'کفپوش بتنی و نیوجرسی سنگین',
    dailyProductionTons: 2900,
    rawMaterialCostPerTonIrr: 360000,
    energyCostPerTonIrr: 150000,
    laborCostPerTonIrr: 160000,
    overheadCostPerTonIrr: 130000,
    totalCostPerTonIrr: 800000,
    marketPricePerTonIrr: 1350000,
    profitMarginPercent: 40.7
  }
];

export const MOCK_PERSONNEL: PersonnelRecord[] = [
  {
    id: 'EMP-1001',
    employeeCode: '۹۸۰۴۱۲',
    fullName: 'مهندس محسن واحدی',
    department: 'مدیریت ارشد پروژه و کارخانجات',
    jobTitle: 'مدیر ارشد پروژه‌های ساختمانی آپتوس',
    employmentType: 'رسمی',
    kpiScore: 98,
    psychologicalRating: 'عالی',
    attendanceHours: 190,
    leaveBalanceDays: 15,
    status: 'فعال'
  },
  {
    id: 'EMP-1002',
    employeeCode: '۹۹۰۵۲۳',
    fullName: 'دکتر مریم رضایی',
    department: 'آزمایشگاه کنترل کیفیت بتن (QC)',
    jobTitle: 'سرپرست آزمایشگاه مقاومت فشاری و بتن',
    employmentType: 'رسمی',
    kpiScore: 95,
    psychologicalRating: 'عالی',
    attendanceHours: 176,
    leaveBalanceDays: 18,
    status: 'فعال'
  },
  {
    id: 'EMP-1003',
    employeeCode: '۰۱۰۱۱۵',
    fullName: 'مهندس علی اکبری',
    department: 'سیستم‌های پیش‌ساخته (APS) چیدمانا',
    jobTitle: 'مدیر خط تولید قطعات پیش‌ساخته APS',
    employmentType: 'رسمی',
    kpiScore: 92,
    psychologicalRating: 'مطلوب',
    attendanceHours: 184,
    leaveBalanceDays: 10,
    status: 'فعال'
  },
  {
    id: 'EMP-1004',
    employeeCode: '۰۲۰۳۰۴',
    fullName: 'سارینا کریمی',
    department: 'فروشگاه آنلاین Aptus & بازرگانی',
    jobTitle: 'مدیر فروشگاه اینترنتی و خریدهای آنلاین',
    employmentType: 'قراردادی',
    kpiScore: 90,
    psychologicalRating: 'مطلوب',
    attendanceHours: 168,
    leaveBalanceDays: 20,
    status: 'فعال'
  }
];

export const MOCK_PRODUCTION_BATCHES: ProductionBatch[] = [
  {
    batchId: 'BATCH-2026-081',
    kilnNumber: 'بچینگ شماره ۱ بتن آماده (۲۵۰ مترمکعب/ساعت)',
    productName: 'بتن آماده C30 مخصوص اسکلت سازه',
    targetTons: 4250,
    producedTons: 4250,
    rawMaterialFeedTons: 5100,
    clinkerQualityGrade: 'A+',
    oeePercent: 94.2,
    qcApproval: true,
    calibrationStatus: 'کالیبره شده'
  },
  {
    batchId: 'BATCH-2026-082',
    kilnNumber: 'خط تولید قطعات پیش‌ساخته APS',
    productName: 'پنل‌های نمای بتنی و دیوارهای چیدمانا',
    targetTons: 1800,
    producedTons: 1820,
    rawMaterialFeedTons: 2200,
    clinkerQualityGrade: 'A+',
    oeePercent: 91.8,
    qcApproval: true,
    calibrationStatus: 'کالیبره شده'
  }
];

export const MOCK_WEIGHBRIDGE_SLIPS: WeighbridgeSlip[] = [
  {
    slipNumber: 'WB-95810',
    truckPlate: 'Iran 44 - 782 B 12',
    driverName: 'کامران حسینی (میکسر ۵)',
    materialName: 'بتن آماده C30 استاندارد',
    grossWeightKg: 42500,
    tareWeightKg: 14200,
    netWeightKg: 28300,
    buyerContractor: 'پروژه ساختمانی آپتو سنتر تریو',
    timestamp: '۱۴۰۵/۰۵/۰۲ - ۰۹:۱۵',
    status: 'بارگیری شد'
  },
  {
    slipNumber: 'WB-95811',
    truckPlate: 'Iran 68 - 315 J 99',
    driverName: 'جواد رستمی (تریلی ۱۲)',
    materialName: 'نیوجرسی سنگین و قطعات APS',
    grossWeightKg: 58200,
    tareWeightKg: 17500,
    netWeightKg: 40700,
    buyerContractor: 'سیستم‌های پیش‌ساخته (APS) چیدمانا',
    timestamp: '۱۴۰۵/۰۵/۰۲ - ۰۹:۴۰',
    status: 'تخلیه شد'
  }
];

export const MOCK_OFFICE_LETTERS: OfficeLetter[] = [
  {
    letterNumber: '۱۰۵/۴۰۵/آپتوس',
    subject: 'گزارش استعلام مالیاتی ماده ۱۰۴ و سامانه مودیان سال ۱۴۰۵ خریدهای سیمان',
    sender: 'واحد حسابداری و مالیات شرکت آپتوس',
    receiver: 'مدیریت ارشد پروژه (جناب آقای واحدی)',
    date: '۱۴۰۵/۰۵/۰۱',
    priority: 'فوری',
    securityLevel: 'محرمانه',
    status: 'در جریان',
    hasOcrScan: true
  },
  {
    letterNumber: '۱۰۵/۴۰۶/چیدمانا',
    subject: 'ابلاغیه مصوب هیئت مدیره در خصوص توسعه خطوط خانه‌های پیش‌ساخته چیدمانا (APS)',
    sender: 'دبیرخانه هیئت مدیره شرکت ساختمانی آپتوس ایران',
    receiver: 'مدیریت بخش سیستم‌های پیش‌ساخته (APS)',
    date: '۱۴۰۵/۰۵/۰۲',
    priority: 'عادی',
    securityLevel: 'عادی',
    status: 'اقدام شده',
    hasOcrScan: true
  }
];

export const TAX_LAW_1405_DIRECTIVES = [
  {
    code: 'Sec-104',
    title: 'ماده ۱۰۴ قانون مالیات‌های مستقیم (کسر مالیات تکلیفی پیمانکاران آپتوس)',
    description: 'کارفرمایان مکلفند از هر پرداخت به پیمانکاران نصب سازه و بتن‌ریزی ۵٪ مالیات تکلیفی کسر نمایند.',
    year: '1405 Updated',
    riskLevel: 'بالا'
  },
  {
    code: 'Sec-169',
    title: 'ماده ۱۶۹ مکرر - ارسال صورت معاملات فصل و سامانه مودیان',
    description: 'تمام فاکتورهای فروش بتن آماده، قطعات APS و فروشگاه آنلاین Aptus باید ظرف ۷ روز کاری در سامانه ثبت شوند.',
    year: '1405 Updated',
    riskLevel: 'بسیار بالا'
  },
  {
    code: 'Sec-272',
    title: 'ماده ۲۷۲ - صورت‌های مالی حسابرسی شده شرکت آپتوس',
    description: 'الزام ارائه گزارش حسابرسی معتمد سازمان بورس و امور مالیاتی برای پروژه‌های بزرگ شرکت ساختمانی آپتوس.',
    year: '1405 Updated',
    riskLevel: 'متوسط'
  }
];
