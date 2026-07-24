import { SubSystem } from '../types';

export const ALL_SUBSYSTEMS: SubSystem[] = [
  // ۰. داشبورد اصلی شخصی و مدیریتی
  {
    id: 'DASHBOARD_HOME',
    title: 'داشبورد شخصی و مدیریتی آپتوس',
    domain: 'DASHBOARD',
    description: 'کارتابل اقدامات، آمار تولید بچینگ بتن، قطعات پیش‌ساخته APS، فروشگاه آنلاین و تکالیف مالیاتی',
    iconName: 'LayoutDashboard',
    badge: 'اصلی'
  },

  // ۱. اطلاعات پایه و سه بخش اصلی
  {
    id: 'BASE_USER_MGMT',
    title: 'مدیریت کاربران و دسترسی‌ها',
    domain: 'BASE_INFO',
    description: 'تعریف کاربران سه بخش شرکت: خانه‌های چیدمانا APS، شرکت ساختمانی و فروشگاه آنلاین Aptus',
    iconName: 'Users',
    badge: 'مرکزی'
  },
  {
    id: 'BASE_ROLES_GROUPS',
    title: 'نقش‌های سفارشی و گروه کاربری (RBAC)',
    domain: 'BASE_INFO',
    description: 'تعریف گروه‌های دسترسی، مجوزهای پروژه‌های عمرانی، کارخانجات بتن و فروشگاه آنلاین',
    iconName: 'ShieldCheck',
    badge: 'امنیت'
  },
  {
    id: 'BASE_FIELD_PERMISSIONS',
    title: 'ماتریس دسترسی فیلدها و زیرسیستم‌ها',
    domain: 'BASE_INFO',
    description: 'تعریف سطح دسترسی دقیق در سطح فیلدها (خواندن، ویرایش، مخفی، ماسک‌گذاری قیمت‌ها)',
    iconName: 'Layers',
    badge: 'پیشرفته'
  },
  {
    id: 'BASE_ORG_APPROVALS',
    title: 'سطوح تاییدات و چارت سازمانی',
    domain: 'BASE_INFO',
    description: 'تعریف سطوح تایید مالیات، خرید سیمان و سنگ‌دانه، و تاییدات پروژه‌های آپتوس',
    iconName: 'Network'
  },
  {
    id: 'BASE_USER_PROFILES',
    title: 'پروفایل کاربری و امضای دیجیتال',
    domain: 'BASE_INFO',
    description: 'پروفایل شخصی مدیران و سرپرستان، امضای دیجیتال اسناد و صورت وضعیت‌ها',
    iconName: 'UserCheck'
  },

  // ۲. مالی و حسابداری
  {
    id: 'FIN_GENERAL',
    title: 'حسابداری مالی و مرور اسناد',
    domain: 'FINANCE',
    description: 'مرور اسناد، دفتر کل و معین، ترازنامه پروژه‌های ساختمانی و فروشگاه آنلاین',
    iconName: 'BookOpen',
    badge: 'مرکزی'
  },
  {
    id: 'FIN_COST_CENTERS',
    title: 'حساب‌ها و مراكز هزینه آپتوس',
    domain: 'FINANCE',
    description: 'تخصیص مراكز هزینه بچینگ بتن آماده، خط تولید APS، پروژه آپتو سنتر تریو و کارخانجات',
    iconName: 'PieChart'
  },
  {
    id: 'FIN_PAYROLL',
    title: 'مالی حقوق و دستمزد',
    domain: 'FINANCE',
    description: 'محاسبه فیش حقوقی، مالیات بر درآمد حقوق ۱۴۰۵، کسورات بیمه پرسنل کارخانه و پروژه‌ها',
    iconName: 'DollarSign'
  },
  {
    id: 'FIN_INVENTORY',
    title: 'مالی انبار و ارزیابی ریالی',
    domain: 'FINANCE',
    description: 'ارزیابی ریالی سیمان، افزودنی‌های بتن، میلگرد، قالب‌های APS، نیوجرسی و کفپوش بتنی',
    iconName: 'Archive'
  },
  {
    id: 'FIN_FIXED_ASSETS',
    title: 'مالی اموال و دارایی‌های ثابت',
    domain: 'FINANCE',
    description: 'استهلاک دستگاه‌های بچینگ، ترک‌میکسرها، پمپ بتن، ماشین‌آلات ساختمانی و خطوط تولید APS',
    iconName: 'Building'
  },
  {
    id: 'FIN_TREASURY',
    title: 'مالی خزانه‌داری (دریافت و پرداخت)',
    domain: 'FINANCE',
    description: 'مدیریت چک‌ها، صورت‌حساب‌های بانکی، درگاه فروشگاه آنلاین Aptus و دریافت‌های پروژه‌ای',
    iconName: 'CreditCard'
  },
  {
    id: 'FIN_PURCHASE',
    title: 'مالی خرید و تأمین',
    domain: 'FINANCE',
    description: 'تطبیق فاکتور خرید سیمان فله، ماسه و شن، پوکه سبک، افزودنی‌ها و سامانه مودیان',
    iconName: 'ShoppingCart'
  },
  {
    id: 'FIN_SALES',
    title: 'مالی فروش و بورس کالا',
    domain: 'FINANCE',
    description: 'تسویه حساب بتن آماده، پیش‌فروش خانه‌های پیش‌ساخته چیدمانا و فروشگاه آنلاین Aptus',
    iconName: 'TrendingUp'
  },
  {
    id: 'FIN_REALTIME_COSTING',
    title: 'بهای تمام شده به لحظه بتن و APS',
    domain: 'FINANCE',
    description: 'محاسبه به لحظه بهای تمام شده هر مترمکعب بتن C25/C30/RCC، بلوک سبک و پنل‌های نمای بتنی',
    iconName: 'Calculator',
    badge: 'به‌لحظه'
  },
  {
    id: 'FIN_TAX_1405',
    title: 'دستیار هوشمند قوانین مالیاتی ۱۴۰۵+',
    domain: 'FINANCE',
    description: 'تحلیل تطبیقی قوانین مالیاتی سال ۱۴۰۵، سامانه مودیان، ارزش افزوده، ماده ۱۰۴ و پیمانکاری',
    iconName: 'Scale',
    badge: 'هوش مصنوعی'
  },

  // ۳. منابع و سرمایه انسانی (HCM)
  {
    id: 'HCM_PERSONNEL',
    title: 'بخش پرسنلی و پرونده الکترونیک',
    domain: 'HCM',
    description: 'اطلاعات پرسنل سه بخش: کارخانجات تولیدی، پروژه‌های ساختمانی و بخش بازرگانی آنلاین',
    iconName: 'Users'
  },
  {
    id: 'HCM_RECRUITMENT',
    title: 'گزینش، جذب و استخدام',
    domain: 'HCM',
    description: 'جذب مهندسان عمران، اپراتورهای بچینگ، متخصصان قالب‌بندی APS و تیم فروش آنلاین',
    iconName: 'UserPlus'
  },
  {
    id: 'HCM_PSYCHOLOGY',
    title: 'روان‌شناسی سازمانی و پایش روحیه',
    domain: 'HCM',
    description: 'سنجش رضایت شغلی، انگیزش کارکنان و پیشگیری از فرسودگی شغلی در پروژه‌ها',
    iconName: 'Heart'
  },
  {
    id: 'HCM_DECREES',
    title: 'احکام و ابلاغ‌ها',
    domain: 'HCM',
    description: 'صدور گروهی احکام کارگزینی، طبقه شغلی مهندسین و نیروهای اجرایی شرکت آپتوس',
    iconName: 'FileText'
  },
  {
    id: 'HCM_EVALUATION',
    title: 'ارزیابی و پایش عملکرد (KPI/OKR)',
    domain: 'HCM',
    description: 'پایش شاخص‌های عملکردی رانندگان میکسر، اپراتورهای بتن‌ریزی و دپارتمان‌های آپتوس',
    iconName: 'Award',
    badge: 'هوش مصنوعی'
  },
  {
    id: 'HCM_WELFARE',
    title: 'رفاه، کارانه و تغذیه',
    domain: 'HCM',
    description: 'رزرو غذای پرسنل کارخانه و کارگاه‌های عمرانی، بیمه تکمیلی و توزیع کارانه بتن‌ریزی',
    iconName: 'Coffee'
  },
  {
    id: 'HCM_ATTENDANCE',
    title: 'کنترل تردد، مرخصی و مأموریت',
    domain: 'HCM',
    description: 'ثبت تردد دستگاه‌های بیومتریک کارخانه بتن، مرخصی‌ها و ماموریت‌های پروژه‌ای',
    iconName: 'Clock'
  },
  {
    id: 'HCM_PORTAL',
    title: 'پورتال و درخواست‌های کارکنان',
    domain: 'HCM',
    description: 'درخواست آنلاین فیش حقوقی، گواهی اشتغال و ثبت مرخصی پرسنل شرکت آپتوس',
    iconName: 'Layout'
  },
  {
    id: 'HCM_SUGGESTIONS',
    title: 'نظام پیشنهادات و نوآوری',
    domain: 'HCM',
    description: 'ثبت ایده‌های بهینه‌سازی بتن، روش‌های نوین قطعات پیش‌ساخته و سیستم‌های چیدمانا',
    iconName: 'Lightbulb'
  },
  {
    id: 'HCM_TRAINING',
    title: 'آموزش و ارتقاء مهارت',
    domain: 'HCM',
    description: 'دوره‌های تخصصی تکنولوژی بتن، استانداردهای APS، ایمنی کارگاه و کنترل کیفیت',
    iconName: 'GraduationCap'
  },
  {
    id: 'HCM_HSE',
    title: 'ایمنی، بهداشت و محیط زیست (HSE)',
    domain: 'HCM',
    description: 'پایش ایمنی بچینگ، کارگاه‌های ساختمانی، تجهیزات حفاظت فردی و معاینات ادواری',
    iconName: 'ShieldAlert'
  },
  {
    id: 'HCM_TIMESHEET',
    title: 'تایم شیت و توزیع زمان پروژه‌ها',
    domain: 'HCM',
    description: 'ثبت کارکرد پرسنل بر اساس پروژه‌های عمرانی آپتو سنتر و خطوط تولید قطعات پیش‌ساخته',
    iconName: 'Calendar'
  },
  {
    id: 'HCM_ORGANOGRAM',
    title: 'چارت سازمانی شرکت آپتوس ایران',
    domain: 'HCM',
    description: 'سلسله‌مراتب سازمانی، مدیریت پروژه‌ها، دفتر مرکزی و کارخانجات بتنی',
    iconName: 'Network'
  },
  {
    id: 'HCM_SETTLEMENT',
    title: 'جبران خدمت و تسویه حساب',
    domain: 'HCM',
    description: 'محاسبه سنوات، ذخیره مرخصی و فرم‌های تسویه حساب پرسنل پروژه‌ای و کارخانه‌ای',
    iconName: 'Briefcase'
  },

  // ۴. تولید و سفارش تولید (MRP)
  {
    id: 'MRP_PLANNING',
    title: 'برنامه‌ریزی تولید بتن و قطعات (MRP)',
    domain: 'MRP',
    description: 'فرمولاسیون طرح اختلاط بتن آماده (Mix Design)، برنامه‌ریزی قالب‌بندی APS و سفارشات',
    iconName: 'Cpu',
    badge: 'استراتژیک'
  },
  {
    id: 'MRP_SYSTEMS',
    title: 'سیستم‌ها و روش‌های تولید بتن',
    domain: 'MRP',
    description: 'استانداردسازی دستورالعمل‌های بتن‌ریزی، قالب‌برداری قطعات پیش‌ساخته و آراستگی 5S',
    iconName: 'Workflow'
  },
  {
    id: 'MRP_QUALITY_CONTROL',
    title: 'آزمایشگاه و کنترل کیفیت (QC)',
    domain: 'MRP',
    description: 'تست اسلامپ بتن، مقاومت فشاری نمونه‌های ۷ و ۲۸ روزه، دانه‌بندی ماسه و آنالیز سنگ‌دانه',
    iconName: 'CheckCircle'
  },
  {
    id: 'MRP_QUALITY_ASSURANCE',
    title: 'تضمین کیفیت (QA) محصولات آپتوس',
    domain: 'MRP',
    description: 'ممیزی‌های استاندارد ملی ایران، نشان استاندارد بتن آماده، نیوجرسی و بلوک سبک',
    iconName: 'ShieldCheck'
  },
  {
    id: 'MRP_CALIBRATION',
    title: 'کالیبراسیون ترازوها و جک‌های بتن',
    domain: 'MRP',
    description: 'کالیبراسیون باسکول‌های ۶۰ تنی، جک‌های شکست نمونه بتن و باسکول‌های دوزینگ بچینگ',
    iconName: 'FlaskConical'
  },

  // ۵. بازرگانی، فروشگاه آنلاین & باسکول
  {
    id: 'COMM_DOMESTIC_BUY',
    title: 'خرید مواد اولیه و سیمان',
    domain: 'COMMERCE',
    description: 'خرید سیمان فله تیپ ۲/۵، سنگ‌دانه، ماسه شسته، پوکه معدنی، افزودنی روان‌کننده و میلگرد',
    iconName: 'ShoppingBag'
  },
  {
    id: 'COMM_FOREIGN_BUY',
    title: 'خرید تجهیزات و قطعات خارجی',
    domain: 'COMMERCE',
    description: 'واردات قطعات بچینگ صنعتی، قالب‌های پیشرفته APS، ترخیص گمرکی و تخصیص ارز',
    iconName: 'Globe'
  },
  {
    id: 'COMM_LOGISTICS',
    title: 'لجستیک و ناوگان حمل بتن',
    domain: 'COMMERCE',
    description: 'مدیریت و زمان‌بندی ترک‌میکسرهای بتن، پمپ‌های دکلی، تریلی‌های حمل نیوجرسی و بلوک',
    iconName: 'Truck'
  },
  {
    id: 'COMM_CRM_XRM',
    title: 'مدیریت مشتریان و فروشگاه آنلاین Aptus',
    domain: 'COMMERCE',
    description: 'مدیریت خریداران بتن آماده، خریداران انلاین Aptus Shop، عاملیت‌ها و سازندگان مجتمع‌ها',
    iconName: 'UserCheck'
  },
  {
    id: 'COMM_SALES_AFTER',
    title: 'فروش و پشتیبانی بتن‌ریزی',
    domain: 'COMMERCE',
    description: 'صدور حواله ارسال بتن، اعزام کارشناس بتن‌ریزی در محل پروژه و پشتیبانی مشتریان',
    iconName: 'Tag'
  },
  {
    id: 'COMM_WEIGHBRIDGE',
    title: 'توزین و باسکول‌های دوربین‌دار',
    domain: 'COMMERCE',
    description: 'توزین خودکار ۶۰ تنی ورودی/خروجی، ثبت وزن ماسه و سیمان و پلاک‌خوان هوشمند تریلی‌ها',
    iconName: 'Scale',
    badge: 'سخت‌افزاری'
  },

  // ۶. اتوماسیون اداری
  {
    id: 'OFFICE_SECRETARIAT',
    title: 'نامه‌نگاری و دبیرخانه آپتوس',
    domain: 'OFFICE',
    description: 'ثبت نامه‌های صادره/وارده با شهرداری‌ها، سازمان نظام مهندسی، کارفرمایان و امضای دیجیتال',
    iconName: 'Mail'
  },
  {
    id: 'OFFICE_COMMUNICATION',
    title: 'ارتباطات و مرکز تماس VoIP',
    domain: 'OFFICE',
    description: 'ارسال فکس سازمانی، ایمیل داخلی و مدیریت مرکز تماس سفارشات بتن و فروشگاه آنلاین',
    iconName: 'PhoneCall'
  },
  {
    id: 'OFFICE_SMART_OCR',
    title: 'امکانات هوشمند اداری (OCR)',
    domain: 'OFFICE',
    description: 'استخراج هوشمند متن از صورت وضعیت‌های ساختمانی و خلاصه‌سازی نامه‌ها با هوش مصنوعی',
    iconName: 'ScanText',
    badge: 'هوش مصنوعی'
  },
  {
    id: 'OFFICE_MESSENGER',
    title: 'پیام‌رسان سازمانی شرکت آپتوس',
    domain: 'OFFICE',
    description: 'گفتگوی ایمن بین کارگاه‌های عمرانی، دفتر مرکزی، کارخانه بتن و دپارتمان‌ها',
    iconName: 'MessageSquare'
  },
  {
    id: 'OFFICE_MEETINGS',
    title: 'جلسات پروژه‌ها و صورت‌جلسات',
    domain: 'OFFICE',
    description: 'برنامه‌ریزی جلسات تحویل پروژه‌های ساختمانی، صورت‌جلسات تحویل خانه‌های APS',
    iconName: 'UsersRound'
  },
  {
    id: 'OFFICE_WORKFLOW',
    title: 'گردش کار و کارتابل اداری',
    domain: 'OFFICE',
    description: 'کارتابل هوشمند تاییدات خریدهای عمرانی، پاراف نامه‌ها و ارجاعات اداری',
    iconName: 'Inbox'
  },

  // ۷. سیستم‌های مشترک و هوش تجاری
  {
    id: 'BI_DYNAMIC_REPORTS',
    title: 'سامانه گزارشات پویا و هوشمند AI',
    domain: 'BI_BPMS',
    description: 'استخراج هوشمند گزارشات استاندارد سازمانی و گزارشات درخواستی تخصصی از هوش مصنوعی',
    iconName: 'FileText',
    badge: 'پویا و هوشمند'
  },
  {
    id: 'BI_EXECUTIVE_REPORTS',
    title: 'گزارشات مدیریتی ۳۶۰ درجه آپتوس',
    domain: 'BI_BPMS',
    description: 'نمای کلی حجم بتن‌ریزی، فروشگاه آنلاین Aptus، وضعیت خانه‌های APS و سوددهی پروژه‌ها',
    iconName: 'BarChart3'
  },
  {
    id: 'BPMS_ENGINE',
    title: 'مدیریت فرآیندها (BPMS)',
    domain: 'BI_BPMS',
    description: 'اتوماسیون فرآیندهای سفارش تا تحویل بتن، کنترل کیفیت و تحویل قطعات پیش‌ساخته',
    iconName: 'GitMerge'
  },
  {
    id: 'BI_DASHBOARDS',
    title: 'هوش تجاری (BI) و چت با دیتابیس مرجع',
    domain: 'BI_BPMS',
    description: 'داشبوردهای تعاملی و گفتگو به زبان فارسی با دیتابیس Aptus_Ref_DB با هوش مصنوعی',
    iconName: 'Sparkles',
    badge: 'هوش مصنوعی'
  },

  // ۸. تنظیمات دیتابیس مرجع
  {
    id: 'SETTINGS_DB',
    title: 'پیکربندی دیتابیس مرجع SQL Server',
    domain: 'SETTINGS_DB',
    description: 'تنظیمات اتصال به دیتابیس مرجع آپتوس (172.20.3.6 / ITDevServer) و همگام‌سازی قبوض',
    iconName: 'Database'
  }
];
