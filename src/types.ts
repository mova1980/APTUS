export type Currency = 'IRR' | 'TOMAN' | 'USD' | 'EUR' | 'AED';

export interface CurrencyRate {
  code: Currency;
  name: string;
  symbol: string;
  rateToIrr: number; // Conversion factor to IRR
}

export type MainDomain =
  | 'DASHBOARD'
  | 'BASE_INFO'
  | 'FINANCE'
  | 'HCM'
  | 'MRP'
  | 'COMMERCE'
  | 'OFFICE'
  | 'BI_BPMS'
  | 'SETTINGS_DB';

export interface SubSystem {
  id: string;
  title: string;
  domain: MainDomain;
  description: string;
  badge?: string;
  iconName: string;
}

export type FieldAccessType = 'WRITE' | 'READ' | 'MASK' | 'HIDE';
export type ModuleAccessType = 'FULL' | 'READ_ONLY' | 'NO_ACCESS';

export interface FieldPermissionRule {
  fieldKey: string;
  fieldLabel: string;
  moduleName: string;
  defaultAccess: FieldAccessType;
}

export interface CustomRoleGroup {
  id: string;
  roleNameFa: string;
  roleNameEn: string;
  description: string;
  isSystemRole?: boolean;
  maxApprovalLevel: number; // 1 to 5
  memberCount: number;
  subsystemAccess: Record<string, ModuleAccessType>;
  fieldAccess: Record<string, FieldAccessType>;
  orgUnitScope: string[]; // e.g., ["FINANCE", "PRODUCTION"]
}

export interface UserAccount {
  id: string;
  firstNameFa: string; // نام فارسی e.g. محسن
  lastNameFa: string; // نام خانوادگی فارسی e.g. واحدی
  firstNameEn: string; // First Name in English e.g. Mohsen
  lastNameEn: string; // Last Name in English e.g. Vahedi
  username: string; // e.g. m.vahedi
  nationalId: string; // کد ملی (10 digits) - default initial password
  password: string; // کلمه عبور
  personnelCode: string; // کد پرسنلی e.g. C-1001
  department: string; // دپارتمان / واحد سازمانی
  position: string; // سمت / عنوان شغلی
  approvalLevel: number; // سطح تاییدات چارت: ۱ تا ۵
  roleGroupId: string; // شناسه گروه کاربری
  roleGroupName: string; // نام گروه کاربری
  avatar: string; // تصویر پروفایل (Base64/URL/Preset)
  signatureUrl: string; // نمونه امضای دیجیتال برای تایید اسناد
  statusText: string; // وضعیت کاربر (Status Message / Motto)
  isActive: boolean; // فعال / غیرفعال
  lastLogin: string; // آخرین ورود به سیستم
  email?: string;
  mobile?: string;
  subsystemOverrides?: Record<string, ModuleAccessType>;
  fieldOverrides?: Record<string, FieldAccessType>;
}

export interface UserProfile {
  username: string;
  name: string;
  role: string;
  avatar: string;
  permissions: string[];
}

// Financial Types
export interface FinancialVoucher {
  id: string;
  voucherNumber: number;
  date: string;
  description: string;
  costCenter: string;
  debitIrr: number;
  creditIrr: number;
  status: 'تایید نهایی' | 'پیش‌نویس' | 'در حال بررسی' | 'ارسال شده به مودیان';
  subsystem: string;
}

export interface ContractorPerformance {
  id: string;
  contractorName: string;
  contractTitle: string;
  contractValueIrr: number;
  paidAmountIrr: number;
  progressPercent: number;
  taxRetentionIrr: number;
  performanceScore: number;
  taxStatus1405: 'منطبق ماده ۱۰۴' | 'دارای معافیت' | 'نیازمند استعلام';
}

export interface CostingMetrics {
  cementType: string;
  dailyProductionTons: number;
  rawMaterialCostPerTonIrr: number;
  energyCostPerTonIrr: number;
  laborCostPerTonIrr: number;
  overheadCostPerTonIrr: number;
  totalCostPerTonIrr: number;
  marketPricePerTonIrr: number;
  profitMarginPercent: number;
}

// HCM Types
export interface PersonnelRecord {
  id: string;
  employeeCode: string;
  fullName: string;
  department: string;
  jobTitle: string;
  employmentType: 'رسمی' | 'پیمانکاری' | 'قراردادی';
  kpiScore: number;
  psychologicalRating: 'عالی' | 'مطلوب' | 'نیازمند مشاوره';
  attendanceHours: number;
  leaveBalanceDays: number;
  status: 'فعال' | 'مرخصی' | 'ماموریت';
}

// MRP Types
export interface ProductionBatch {
  batchId: string;
  kilnNumber: string; // شماره کوره
  productName: string; // کلینکر / سیمان تیپ ۲
  targetTons: number;
  producedTons: number;
  rawMaterialFeedTons: number;
  clinkerQualityGrade: 'A+' | 'A' | 'B';
  oeePercent: number;
  qcApproval: boolean;
  calibrationStatus: 'کالیبره شده' | 'نیازمند کالیبراسیون';
}

// SCM / Commerce Types
export interface WeighbridgeSlip {
  slipNumber: string;
  truckPlate: string;
  driverName: string;
  materialName: string; // سنگ آهک / سیمان فله / سیمان پاکتی
  grossWeightKg: number;
  tareWeightKg: number;
  netWeightKg: number;
  buyerContractor: string;
  timestamp: string;
  status: 'تخلیه شد' | 'بارگیری شد' | 'در انتظار باسکول ۲';
}

// Office Automation Types
export interface OfficeLetter {
  letterNumber: string;
  subject: string;
  sender: string;
  receiver: string;
  date: string;
  priority: 'عادی' | 'فوری' | 'آنی' | 'خیلی فوری';
  securityLevel: 'عادی' | 'محرمانه' | 'سری';
  status: 'در جریان' | 'اقدام شده' | 'بایگانی' | 'امضا و اقدام شد';
  hasOcrScan: boolean;
}

// Database Connection Settings
export interface DbConfig {
  host: string;
  port: number;
  databaseName: string;
  username: string;
  dbType: 'SQL Server 2022' | 'PostgreSQL 16' | 'Oracle ERP';
  isConnected: boolean;
  lastSyncTime: string;
  refDbRecordsCount: number;
}

// Dynamic Multi-Server & Multi-Database Management Types
export type DbEngineType = 'SQL Server 2022' | 'PostgreSQL 16' | 'Oracle ERP' | 'MySQL/MariaDB' | 'SQLite';

export interface ServerDbItem {
  id: string;
  serverName: string;
  ipHost: string;
  port: number;
  dbType: DbEngineType;
  username: string;
  password?: string;
  databases: string[];
  status: 'CONNECTED' | 'DISCONNECTED' | 'TESTING';
  latencyMs: number;
  lastPing: string;
  description: string;
}

export interface RefTableField {
  fieldName: string;
  fieldLabelFa: string;
  dataType: 'VARCHAR' | 'BIGINT' | 'DECIMAL' | 'DATETIME' | 'BOOLEAN';
  isPrimaryKey?: boolean;
  isAiIndexed: boolean;
  mappedAlias?: string;
}

export interface RefTableItem {
  id: string;
  serverId: string;
  serverName: string;
  dbName: string;
  tableName: string;
  tableLabelFa: string;
  objectType: 'TABLE' | 'VIEW';
  recordCount: number;
  primaryKey: string;
  fields: RefTableField[];
  // One-to-Many Matrix mapping: subsystemId -> boolean
  mappedSubsystems: Record<string, boolean>;
  sampleData?: Record<string, any>[];
  lastSync: string;
  syncStatus: 'SYNCHRONIZED' | 'PENDING' | 'ERROR';
}

export interface TransactionFlowStream {
  id: string;
  flowTitle: string;
  sourceServerName: string;
  sourceDbName: string;
  sourceDb?: string;
  sourceTableName: string;
  targetSubsystems: string[];
  syncFrequency: 'LIVE_REALTIME' | 'EVERY_5_MIN' | 'HOURLY' | 'NIGHTLY_BATCH';
  aiPipelineEnabled: boolean;
  recordsProcessedToday: number;
  lastExecution: string;
  status: 'ACTIVE' | 'PAUSED' | 'SYNCING';
}

