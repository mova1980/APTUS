import { ServerDbItem, RefTableItem, TransactionFlowStream } from '../types';

export const SYSTEM_SUBSYSTEMS_LIST = [
  { id: 'FINANCIAL', titleFa: 'حسابداری و مالیات ۱۴۰۵', category: 'مالی', color: 'emerald' },
  { id: 'HCM', titleFa: 'منابع انسانی (HCM & KPI)', category: 'اداری', color: 'blue' },
  { id: 'MRP', titleFa: 'بهای تمام شده و بچینگ (MRP)', category: 'تولید', color: 'amber' },
  { id: 'COMMERCE', titleFa: 'بازرگانی، باسکول & Shop', category: 'فروش', color: 'cyan' },
  { id: 'OFFICE', titleFa: 'اتوماسیون و دبیرخانه', category: 'اداری', color: 'indigo' },
  { id: 'BI_BPMS', titleFa: 'هوش تجاری & فرآیندها', category: 'مدیریت', color: 'purple' },
  { id: 'CENTRAL_AI', titleFa: 'موتور تحلیل هوش مصنوعی', category: 'هوشمند', color: 'rose' },
  { id: 'BASE_INFO', titleFa: 'اطلاعات پایه شرکت', category: 'مرجع', color: 'slate' }
];

export const INITIAL_SERVERS: ServerDbItem[] = [
  {
    id: 'SRV-01',
    serverName: 'سرور اصلی SQL Server شرکت (Primary Server)',
    ipHost: '172.20.3.6',
    port: 1433,
    dbType: 'SQL Server 2022',
    username: 'sa_aptus_admin',
    password: '•••SQL@Aptus2026!',
    databases: ['Aptus_Ref_DB', 'Aptus_Central_DataHub', 'Aptus_MasterData_2026'],
    status: 'CONNECTED',
    latencyMs: 12,
    lastPing: 'هم‌اکنون',
    description: 'سرور اصلی مرکز داده آپتوس - دیتابیس مرجع کلیه زیرسیستم‌ها'
  },
  {
    id: 'SRV-02',
    serverName: 'سرور مالی و تکالیف مالیاتی (Fin_Postgres_Server)',
    ipHost: '192.168.1.50',
    port: 5432,
    dbType: 'PostgreSQL 16',
    username: 'aptus_fin_usr',
    password: '•••PgFinPass1405!',
    databases: ['Fin_Tax1405_DB', 'Fin_Vouchers_Archive'],
    status: 'CONNECTED',
    latencyMs: 24,
    lastPing: '۲ دقیقه قبل',
    description: 'میزبانی اسناد حسابداری، مودیان و پرونده‌های مالیاتی سال ۱۴۰۵'
  },
  {
    id: 'SRV-03',
    serverName: 'سرور باسکول و بچینگ کارخانه (Batching_Plant_DB)',
    ipHost: '10.0.0.12',
    port: 1433,
    dbType: 'SQL Server 2022',
    username: 'plant_weigh_db',
    password: '•••Weigh2026Sec!',
    databases: ['Weighbridge_Realtime_DB', 'Batching_C30_Logs'],
    status: 'CONNECTED',
    latencyMs: 18,
    lastPing: '۱ دقیقه قبل',
    description: 'ثبت قبوض باسکول، خروجی میکسرها و بتن C30'
  },
  {
    id: 'SRV-04',
    serverName: 'سرور ابری فروشگاه Aptus & چیدمانا (Cloud_Oracle_Server)',
    ipHost: 'db.aptus.ir',
    port: 1521,
    dbType: 'Oracle ERP',
    username: 'aptus_cloud_dbo',
    password: '•••OracleCloud99!',
    databases: ['Aptus_Shop_Online_DB', 'Chidamana_APS_ERP'],
    status: 'CONNECTED',
    latencyMs: 45,
    lastPing: 'هم‌اکنون',
    description: 'سرور آنلاین فروش اینترنتی، تراکنش‌ها و سفارش‌های قطعات پیش‌ساخته'
  }
];

export const INITIAL_REF_TABLES: RefTableItem[] = [
  {
    id: 'TBL-01',
    serverId: 'SRV-01',
    serverName: 'سرور اصلی SQL Server شرکت (Primary Server)',
    dbName: 'Aptus_Ref_DB',
    tableName: 'Aptus_Fin_GL_Vouchers',
    tableLabelFa: 'جدول اسناد دفتر کل و اسناد مالیات ۱۴۰۵',
    objectType: 'TABLE',
    recordCount: 148900,
    primaryKey: 'VoucherID',
    lastSync: '۱۴۰۵/۰۵/۰۲ - ۰۸:۵۰',
    syncStatus: 'SYNCHRONIZED',
    fields: [
      { fieldName: 'VoucherID', fieldLabelFa: 'شناسه یکتای سند', dataType: 'BIGINT', isPrimaryKey: true, isAiIndexed: true },
      { fieldName: 'VoucherNo', fieldLabelFa: 'شماره سند حسابداری', dataType: 'BIGINT', isAiIndexed: true },
      { fieldName: 'VoucherDate', fieldLabelFa: 'تاریخ ثبت سند', dataType: 'DATETIME', isAiIndexed: true },
      { fieldName: 'CostCenterCode', fieldLabelFa: 'کد مرکز هزینه/دپارتمان', dataType: 'VARCHAR', isAiIndexed: true },
      { fieldName: 'DebitIrr', fieldLabelFa: 'بدهکار (ریال)', dataType: 'DECIMAL', isAiIndexed: true },
      { fieldName: 'CreditIrr', fieldLabelFa: 'بستانکار (ریال)', dataType: 'DECIMAL', isAiIndexed: true },
      { fieldName: 'TaxModianCode', fieldLabelFa: 'شناسه سامانه مودیان', dataType: 'VARCHAR', isAiIndexed: true },
      { fieldName: 'Description', fieldLabelFa: 'شرح سند و توضیحات', dataType: 'VARCHAR', isAiIndexed: true }
    ],
    mappedSubsystems: {
      'FINANCIAL': true,
      'MRP': true,
      'BI_BPMS': true,
      'CENTRAL_AI': true
    },
    sampleData: [
      { VoucherID: 10401, VoucherNo: 89012, VoucherDate: '1405/05/01', CostCenterCode: 'CC-PROD-01', DebitIrr: 4500000000, CreditIrr: 0, TaxModianCode: 'TAX-98214-A', Description: 'خرید مصالح سیمان فله و افزودنی بتن' },
      { VoucherID: 10402, VoucherNo: 89013, VoucherDate: '1405/05/01', CostCenterCode: 'CC-ADMIN-02', DebitIrr: 0, CreditIrr: 4500000000, TaxModianCode: 'TAX-98214-B', Description: 'تسویه فاکتور تامین‌کننده کارخانه' },
      { VoucherID: 10403, VoucherNo: 89014, VoucherDate: '1405/05/02', CostCenterCode: 'CC-SALES-05', DebitIrr: 1200000000, CreditIrr: 0, TaxModianCode: 'TAX-98215-C', Description: 'فروش قطعات پیش‌ساخته ویلایی APS' }
    ]
  },
  {
    id: 'TBL-02',
    serverId: 'SRV-03',
    serverName: 'سرور باسکول و بچینگ کارخانه (Batching_Plant_DB)',
    dbName: 'Weighbridge_Realtime_DB',
    tableName: 'Aptus_SCM_Weighbridge_Slips',
    tableLabelFa: 'جدول قبوض توزین و بارگیری باسکول ۶۰ تنی',
    objectType: 'TABLE',
    recordCount: 89400,
    primaryKey: 'SlipNo',
    lastSync: '۱۴۰۵/۰۵/۰۲ - ۰۸:۵۲',
    syncStatus: 'SYNCHRONIZED',
    fields: [
      { fieldName: 'SlipNo', fieldLabelFa: 'شماره قبض باسکول', dataType: 'BIGINT', isPrimaryKey: true, isAiIndexed: true },
      { fieldName: 'TruckPlateNo', fieldLabelFa: 'شماره پلاک تراک‌میکسر/تریلی', dataType: 'VARCHAR', isAiIndexed: true },
      { fieldName: 'DriverName', fieldLabelFa: 'نام راننده', dataType: 'VARCHAR', isAiIndexed: false },
      { fieldName: 'MaterialType', fieldLabelFa: 'نوع مصالح (بتن C30/بلوک/سیمان)', dataType: 'VARCHAR', isAiIndexed: true },
      { fieldName: 'NetWeightKg', fieldLabelFa: 'وزن خالص (کیلوگرم)', dataType: 'DECIMAL', isAiIndexed: true },
      { fieldName: 'TimestampOut', fieldLabelFa: 'زمان خروج از باسکول', dataType: 'DATETIME', isAiIndexed: true }
    ],
    mappedSubsystems: {
      'COMMERCE': true,
      'MRP': true,
      'FINANCIAL': true,
      'CENTRAL_AI': true
    },
    sampleData: [
      { SlipNo: 66801, TruckPlateNo: '77-ب-412 ایران 68', DriverName: 'اصغر رضایی', MaterialType: 'بتن C30 آماده', NetWeightKg: 24500, TimestampOut: '1405/05/02 08:30' },
      { SlipNo: 66802, TruckPlateNo: '12-ع-890 ایران 22', DriverName: 'حمید کاظمی', MaterialType: 'سیمان تیپ ۲ فله', NetWeightKg: 28900, TimestampOut: '1405/05/02 08:45' }
    ]
  },
  {
    id: 'TBL-03',
    serverId: 'SRV-01',
    serverName: 'سرور اصلی SQL Server شرکت (Primary Server)',
    dbName: 'Aptus_Ref_DB',
    tableName: 'VW_Aptus_Fin_Summary_Daily',
    tableLabelFa: 'ویو (View) خلاصه عملکرد مالی و درآمد روزانه',
    objectType: 'VIEW',
    recordCount: 1250,
    primaryKey: 'ReportDate',
    lastSync: '۱۴۰۵/۰۵/۰۲ - ۰۷:۰۰',
    syncStatus: 'SYNCHRONIZED',
    fields: [
      { fieldName: 'ReportDate', fieldLabelFa: 'تاریخ گزارش', dataType: 'DATETIME', isPrimaryKey: true, isAiIndexed: true },
      { fieldName: 'TotalRevenueIrr', fieldLabelFa: 'جمع درآمدهای روزانه (ریال)', dataType: 'DECIMAL', isAiIndexed: true },
      { fieldName: 'TotalExpensesIrr', fieldLabelFa: 'جمع هزینه‌های عملیاتی (ریال)', dataType: 'DECIMAL', isAiIndexed: true },
      { fieldName: 'NetProfitMargin', fieldLabelFa: 'حاشیه سود خالص (درصد)', dataType: 'DECIMAL', isAiIndexed: true }
    ],
    mappedSubsystems: {
      'FINANCIAL': true,
      'BI_BPMS': true,
      'CENTRAL_AI': true
    },
    sampleData: [
      { ReportDate: '1405/05/01', TotalRevenueIrr: 8500000000, TotalExpensesIrr: 5200000000, NetProfitMargin: 38.8 },
      { ReportDate: '1405/05/02', TotalRevenueIrr: 9200000000, TotalExpensesIrr: 5800000000, NetProfitMargin: 36.9 }
    ]
  },
  {
    id: 'TBL-04',
    serverId: 'SRV-01',
    serverName: 'سرور اصلی SQL Server شرکت (Primary Server)',
    dbName: 'Aptus_Ref_DB',
    tableName: 'Aptus_HR_Personnel_Master',
    tableLabelFa: 'جدول پرونده پرسنلی و ارزیابی KPI منابع انسانی',
    objectType: 'TABLE',
    recordCount: 452,
    primaryKey: 'PersonnelCode',
    lastSync: '۱۴۰۵/۰۵/۰۱ - ۱۸:۳۰',
    syncStatus: 'SYNCHRONIZED',
    fields: [
      { fieldName: 'PersonnelCode', fieldLabelFa: 'کد پرسنلی', dataType: 'VARCHAR', isPrimaryKey: true, isAiIndexed: true },
      { fieldName: 'FullNameFa', fieldLabelFa: 'نام و نام خانوادگی', dataType: 'VARCHAR', isAiIndexed: true },
      { fieldName: 'NationalCode', fieldLabelFa: 'کد ملی', dataType: 'VARCHAR', isAiIndexed: false },
      { fieldName: 'Department', fieldLabelFa: 'دپارتمان/واحد سازمانی', dataType: 'VARCHAR', isAiIndexed: true },
      { fieldName: 'KpiScore', fieldLabelFa: 'امتیاز ارزیابی عملکرد (KPI)', dataType: 'DECIMAL', isAiIndexed: true },
      { fieldName: 'AttendanceHours', fieldLabelFa: 'ساعات کارکرد ماهانه', dataType: 'DECIMAL', isAiIndexed: true }
    ],
    mappedSubsystems: {
      'HCM': true,
      'FINANCIAL': true,
      'BI_BPMS': true,
      'CENTRAL_AI': true
    }
  },
  {
    id: 'TBL-05',
    serverId: 'SRV-03',
    serverName: 'سرور باسکول و بچینگ کارخانه (Batching_Plant_DB)',
    dbName: 'Batching_C30_Logs',
    tableName: 'Aptus_MRP_Batching_Dosing_Logs',
    tableLabelFa: 'جدول گزارشات بچینگ و دوزینگ بتن C30 و C40',
    objectType: 'TABLE',
    recordCount: 32400,
    primaryKey: 'BatchLogID',
    lastSync: '۱۴۰۵/۰۵/۰۲ - ۰۸:۴۸',
    syncStatus: 'SYNCHRONIZED',
    fields: [
      { fieldName: 'BatchLogID', fieldLabelFa: 'شناسه لاگ بچینگ', dataType: 'BIGINT', isPrimaryKey: true, isAiIndexed: true },
      { fieldName: 'MixDesignName', fieldLabelFa: 'طرح اختلاط (C30 / C40 / SCC)', dataType: 'VARCHAR', isAiIndexed: true },
      { fieldName: 'CementKgPerM3', fieldLabelFa: 'میزان سیمان مصرفی (kg/m3)', dataType: 'DECIMAL', isAiIndexed: true },
      { fieldName: 'AdditiveLiters', fieldLabelFa: 'میزان افزودنی روان‌کننده (Lit)', dataType: 'DECIMAL', isAiIndexed: true },
      { fieldName: 'VolumeProducedM3', fieldLabelFa: 'حجم بتن تولیدی (مترمکعب)', dataType: 'DECIMAL', isAiIndexed: true },
      { fieldName: 'WastagePercent', fieldLabelFa: 'درصد ضایعات و پرت مصالح', dataType: 'DECIMAL', isAiIndexed: true }
    ],
    mappedSubsystems: {
      'MRP': true,
      'FINANCIAL': true,
      'CENTRAL_AI': true
    }
  },
  {
    id: 'TBL-06',
    serverId: 'SRV-04',
    serverName: 'سرور ابری فروشگاه Aptus & چیدمانا (Cloud_Oracle_Server)',
    dbName: 'Chidamana_APS_ERP',
    tableName: 'VW_Chidamana_Production_Progress',
    tableLabelFa: 'ویو (View) پیشرفت تولید قطعات پیش‌ساخته ویلایی',
    objectType: 'VIEW',
    recordCount: 480,
    primaryKey: 'OrderID',
    lastSync: '۱۴۰۵/۰۵/۰۲ - ۰۸:۱۵',
    syncStatus: 'SYNCHRONIZED',
    fields: [
      { fieldName: 'OrderID', fieldLabelFa: 'شناسه سفارش', dataType: 'BIGINT', isPrimaryKey: true, isAiIndexed: true },
      { fieldName: 'ProjectTitle', fieldLabelFa: 'عنوان پروژه ویلایی', dataType: 'VARCHAR', isAiIndexed: true },
      { fieldName: 'CompletionPercent', fieldLabelFa: 'درصد پیشرفت ساخت', dataType: 'DECIMAL', isAiIndexed: true },
      { fieldName: 'DeliveryStatus', fieldLabelFa: 'وضعیت تحویل و نصب', dataType: 'VARCHAR', isAiIndexed: true }
    ],
    mappedSubsystems: {
      'COMMERCE': true,
      'MRP': true,
      'BI_BPMS': true
    }
  }
];

export const INITIAL_FLOW_STREAMS: TransactionFlowStream[] = [
  {
    id: 'FLW-01',
    flowTitle: 'گردش هوشمند اسناد مالیاتی ۱۴۰۵ و سامانه مودیان',
    sourceServerName: 'Primary Server (172.20.3.6)',
    sourceDbName: 'Aptus_Ref_DB',
    sourceTableName: 'Aptus_Fin_GL_Vouchers',
    targetSubsystems: ['مالی و حسابداری', 'هوش مصنوعی متمرکز'],
    syncFrequency: 'LIVE_REALTIME',
    aiPipelineEnabled: true,
    recordsProcessedToday: 4890,
    lastExecution: 'هم‌اکنون',
    status: 'ACTIVE'
  },
  {
    id: 'FLW-02',
    flowTitle: 'گردش زنده بارگیری باسکول ۶۰ تنی و صدور پیش‌فاکتور',
    sourceServerName: 'Batching Plant DB (10.0.0.12)',
    sourceDbName: 'Weighbridge_Realtime_DB',
    sourceTableName: 'Aptus_SCM_Weighbridge_Slips',
    targetSubsystems: ['بازرگانی', 'MRP بهای تمام شده', 'مالی'],
    syncFrequency: 'LIVE_REALTIME',
    aiPipelineEnabled: true,
    recordsProcessedToday: 168,
    lastExecution: '۲ دقیقه قبل',
    status: 'ACTIVE'
  },
  {
    id: 'FLW-03',
    flowTitle: 'آنالیز بهای تمام شده به لحظه بتن C30 و ضایعات بچینگ',
    sourceServerName: 'Batching Plant DB (10.0.0.12)',
    sourceDbName: 'Batching_C30_Logs',
    sourceTableName: 'Aptus_MRP_Batching_Dosing_Logs',
    targetSubsystems: ['MRP بهای تمام شده', 'هوش مصنوعی متمرکز'],
    syncFrequency: 'EVERY_5_MIN',
    aiPipelineEnabled: true,
    recordsProcessedToday: 320,
    lastExecution: '۴ دقیقه قبل',
    status: 'ACTIVE'
  },
  {
    id: 'FLW-04',
    flowTitle: 'همگام‌سازی سفارشات خانه‌های پیش‌ساخته چیدمانا (APS)',
    sourceServerName: 'Cloud Oracle Server (db.aptus.ir)',
    sourceDbName: 'Chidamana_APS_ERP',
    sourceTableName: 'Aptus_APS_Chidamana_BOM_Orders',
    targetSubsystems: ['بازرگانی', 'MRP بهای تمام شده', 'مالی'],
    syncFrequency: 'HOURLY',
    aiPipelineEnabled: true,
    recordsProcessedToday: 12,
    lastExecution: '۱ ساعت قبل',
    status: 'ACTIVE'
  }
];
