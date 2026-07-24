import React, { useState } from 'react';
import {
  UserAccount,
  CustomRoleGroup,
  FieldAccessType,
  ModuleAccessType
} from '../../types';
import {
  Users,
  ShieldCheck,
  Layers,
  Network,
  UserCheck,
  UserPlus,
  Key,
  Upload,
  Image as ImageIcon,
  FileSignature,
  Edit,
  Search,
  CheckCircle2,
  XCircle,
  Building2,
  X,
  AlertCircle,
  Shield,
  Sliders,
  Filter
} from 'lucide-react';

interface BaseInfoUserMgmtViewProps {
  activeSubsystemId?: string;
  currentUserAvatar?: string;
  onUpdateUserAvatar?: (avatar: string) => void;
}

// Initial Mock Role Groups
const INITIAL_ROLE_GROUPS: CustomRoleGroup[] = [
  {
    id: 'ROLE_SUPER_ADMIN',
    roleNameFa: 'ادمین ارشد سیستم (Super Admin)',
    roleNameEn: 'System Administrator',
    description: 'دسترسی کامل و نامحدود به کلیه زیرسیستم‌ها، فیلدها و فرم‌های عملیاتی شرکت آپتوس ایران',
    isSystemRole: true,
    maxApprovalLevel: 5,
    memberCount: 1,
    orgUnitScope: ['ALL'],
    subsystemAccess: {
      BASE_USER_MGMT: 'FULL',
      BASE_ROLES_GROUPS: 'FULL',
      BASE_FIELD_PERMISSIONS: 'FULL',
      FIN_GENERAL: 'FULL',
      FIN_PAYROLL: 'FULL',
      HCM_PERSONNEL: 'FULL',
      MRP_PLANNING: 'FULL',
      COMM_WEIGHBRIDGE: 'FULL',
      OFFICE_SECRETARIAT: 'FULL',
      BI_DASHBOARDS: 'FULL'
    },
    fieldAccess: {
      FIN_VOUCHER_AMOUNT: 'WRITE',
      FIN_TAX_RATE: 'WRITE',
      HCM_NATIONAL_ID: 'WRITE',
      HCM_BASE_SALARY: 'WRITE',
      MRP_RAW_RECIPE: 'WRITE',
      COMM_CUSTOMER_DISCOUNT: 'WRITE',
      OFFICE_SECRET_LETTERS: 'WRITE',
      BI_EXECUTIVE_COSTS: 'WRITE'
    }
  },
  {
    id: 'ROLE_FINANCE_DIRECTOR',
    roleNameFa: 'مدیران مالی و خزانه‌داری',
    roleNameEn: 'Finance Directors',
    description: 'مدیریت اسناد حسابداری، مالیات مودیان، خزانه‌داری، بورس کالا و تایید اسناد مالی',
    isSystemRole: false,
    maxApprovalLevel: 4,
    memberCount: 3,
    orgUnitScope: ['FINANCE', 'TREASURY'],
    subsystemAccess: {
      BASE_USER_MGMT: 'READ_ONLY',
      FIN_GENERAL: 'FULL',
      FIN_PAYROLL: 'FULL',
      FIN_COST_CENTERS: 'FULL',
      FIN_TREASURY: 'FULL',
      FIN_TAX_1405: 'FULL',
      HCM_PERSONNEL: 'READ_ONLY',
      COMM_SALES_AFTER: 'READ_ONLY',
      OFFICE_SECRETARIAT: 'FULL'
    },
    fieldAccess: {
      FIN_VOUCHER_AMOUNT: 'WRITE',
      FIN_TAX_RATE: 'WRITE',
      HCM_NATIONAL_ID: 'READ',
      HCM_BASE_SALARY: 'READ',
      MRP_RAW_RECIPE: 'READ',
      COMM_CUSTOMER_DISCOUNT: 'WRITE',
      OFFICE_SECRET_LETTERS: 'READ',
      BI_EXECUTIVE_COSTS: 'WRITE'
    }
  },
  {
    id: 'ROLE_PRODUCTION_SUPERVISOR',
    roleNameFa: 'سرپرستان کوره و کنترل کیفیت (MRP/QC)',
    roleNameEn: 'Production & QC Supervisors',
    description: 'کنترل خطوط کوره ۱ و ۲، فرمولاسیون خوراک، آزمایشگاه XRF، کالیبراسیون و انبار مواد',
    isSystemRole: false,
    maxApprovalLevel: 3,
    memberCount: 5,
    orgUnitScope: ['PRODUCTION', 'QC', 'LAB'],
    subsystemAccess: {
      MRP_PLANNING: 'FULL',
      MRP_QUALITY_CONTROL: 'FULL',
      MRP_CALIBRATION: 'FULL',
      HCM_PERSONNEL: 'READ_ONLY',
      COMM_WEIGHBRIDGE: 'READ_ONLY',
      OFFICE_WORKFLOW: 'FULL'
    },
    fieldAccess: {
      FIN_VOUCHER_AMOUNT: 'HIDE',
      FIN_TAX_RATE: 'HIDE',
      HCM_NATIONAL_ID: 'MASK',
      HCM_BASE_SALARY: 'HIDE',
      MRP_RAW_RECIPE: 'WRITE',
      COMM_CUSTOMER_DISCOUNT: 'HIDE',
      OFFICE_SECRET_LETTERS: 'HIDE',
      BI_EXECUTIVE_COSTS: 'READ'
    }
  },
  {
    id: 'ROLE_WEIGHBRIDGE_OPERATOR',
    roleNameFa: 'اپراتورهای باسکول و خروجی بار',
    roleNameEn: 'Weighbridge Operators',
    description: 'ثبت قبوض باسکول ۶۰ تنی، وزن پر و خالی تریلی‌ها، نوبت‌دهی و پلاک‌خوان هوشمند',
    isSystemRole: false,
    maxApprovalLevel: 1,
    memberCount: 8,
    orgUnitScope: ['COMMERCE', 'LOGISTICS'],
    subsystemAccess: {
      COMM_WEIGHBRIDGE: 'FULL',
      COMM_LOGISTICS: 'READ_ONLY',
      OFFICE_WORKFLOW: 'READ_ONLY'
    },
    fieldAccess: {
      FIN_VOUCHER_AMOUNT: 'HIDE',
      FIN_TAX_RATE: 'HIDE',
      HCM_NATIONAL_ID: 'HIDE',
      HCM_BASE_SALARY: 'HIDE',
      MRP_RAW_RECIPE: 'HIDE',
      COMM_CUSTOMER_DISCOUNT: 'READ',
      OFFICE_SECRET_LETTERS: 'HIDE',
      BI_EXECUTIVE_COSTS: 'HIDE'
    }
  }
];

// Standard Corporate Vector Avatars
const PRESET_AVATARS = [
  'https://lh3.googleusercontent.com/d/18oO9ea3mBJBGQZYonKWxZ9VIxRZAIC8f',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=RezaMotamedi&backgroundColor=059669&clothing=blazerAndShirt',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=MaryamRezaei&backgroundColor=e11d48&clothing=shirtCrewNeck',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=SarinaKarimi&backgroundColor=d97706&clothing=overall',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=AliAkbari&backgroundColor=7c3aed&clothing=suitAndTie',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=CorporateMale1&backgroundColor=0d9488&clothing=blazerAndSweater',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=CorporateFemale1&backgroundColor=ea580c&clothing=shirtVNeck',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=CorporateMale2&backgroundColor=2563eb&clothing=collarAndSweater',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=CorporateFemale2&backgroundColor=475569&clothing=graphicShirt'
];

// Initial Users Data
const INITIAL_USERS: UserAccount[] = [
  {
    id: 'USR-1001',
    firstNameFa: 'محسن',
    lastNameFa: 'واحدی',
    firstNameEn: 'Mohsen',
    lastNameEn: 'Vahedi',
    username: 'm.vahedi',
    nationalId: '0012345678',
    password: '●●●●●●●●',
    personnelCode: 'C-1001',
    department: 'مدیریت ارشد و توسعه ERP',
    position: 'مدیر پروژه (آقای واحدی)',
    approvalLevel: 5,
    roleGroupId: 'ROLE_SUPER_ADMIN',
    roleGroupName: 'ادمین ارشد سیستم (Super Admin)',
    avatar: PRESET_AVATARS[0],
    signatureUrl: 'https://api.dicebear.com/7.x/identicon/svg?seed=VahediSignature',
    statusText: 'در حال پایش دیتابیس مرجع و راه اندازی ماژول‌های اطلاعات پایه Ciment AI',
    isActive: true,
    lastLogin: '۱۴۰۵/۰۵/۰۲ - ۰۹:۳۰',
    email: 'm.vahedi@ciment-ai.ir',
    mobile: '09121112233'
  },
  {
    id: 'USR-1002',
    firstNameFa: 'رضا',
    lastNameFa: 'معتمدی',
    firstNameEn: 'Reza',
    lastNameEn: 'Motamedi',
    username: 'r.motamedi',
    nationalId: '0023456789',
    password: '●●●●●●●●',
    personnelCode: 'C-1002',
    department: 'واحد تولید و کوره',
    position: 'سرپرست ارشد اتاق کنترل کوره',
    approvalLevel: 3,
    roleGroupId: 'ROLE_PRODUCTION_SUPERVISOR',
    roleGroupName: 'سرپرستان کوره و کنترل کیفیت (MRP/QC)',
    avatar: PRESET_AVATARS[1],
    signatureUrl: 'https://api.dicebear.com/7.x/identicon/svg?seed=MotamediSig',
    statusText: 'حاضر در اتاق کنترل کوره خط ۲ - پایش بار دهی آسیاب',
    isActive: true,
    lastLogin: '۱۴۰۵/۰۵/۰۲ - ۰۸:۱۵',
    email: 'r.motamedi@ciment-ai.ir',
    mobile: '09122223344'
  },
  {
    id: 'USR-1003',
    firstNameFa: 'مریم',
    lastNameFa: 'رضایی',
    firstNameEn: 'Maryam',
    lastNameEn: 'Rezaei',
    username: 'm.rezaei',
    nationalId: '0034567890',
    password: '●●●●●●●●',
    personnelCode: 'C-1003',
    department: 'واحد کنترل کیفیت (QC)',
    position: 'مدیر آزمایشگاه شیمی و XRF',
    approvalLevel: 3,
    roleGroupId: 'ROLE_PRODUCTION_SUPERVISOR',
    roleGroupName: 'سرپرستان کوره و کنترل کیفیت (MRP/QC)',
    avatar: PRESET_AVATARS[2],
    signatureUrl: 'https://api.dicebear.com/7.x/identicon/svg?seed=RezaeiSig',
    statusText: 'در حال آنالیز شیمیایی کلینکر خروجی کوره شماره ۱',
    isActive: true,
    lastLogin: '۱۴۰۵/۰۵/۰۱ - ۱۶:۴۵',
    email: 'm.rezaei@ciment-ai.ir',
    mobile: '09123334455'
  },
  {
    id: 'USR-1004',
    firstNameFa: 'سارینا',
    lastNameFa: 'کریمی',
    firstNameEn: 'Sarina',
    lastNameEn: 'Karimi',
    username: 's.karimi',
    nationalId: '0045678901',
    password: '●●●●●●●●',
    personnelCode: 'C-1004',
    department: 'واحد مالی و امور مالیاتی',
    position: 'کارشناس ارشد سامانه مودیان',
    approvalLevel: 2,
    roleGroupId: 'ROLE_FINANCE_DIRECTOR',
    roleGroupName: 'مدیران مالی و خزانه‌داری',
    avatar: PRESET_AVATARS[3],
    signatureUrl: 'https://api.dicebear.com/7.x/identicon/svg?seed=KarimiSig',
    statusText: 'در حال بررسی استعلام مالیات ماده ۱۰۴ پیمانکاران',
    isActive: true,
    lastLogin: '۱۴۰۵/۰۵/۰۲ - ۰۹:۱۰',
    email: 's.karimi@ciment-ai.ir',
    mobile: '09124445566'
  },
  {
    id: 'USR-1005',
    firstNameFa: 'علی',
    lastNameFa: 'اکبری',
    firstNameEn: 'Ali',
    lastNameEn: 'Akbari',
    username: 'a.akbari',
    nationalId: '0056789012',
    password: '●●●●●●●●',
    personnelCode: 'C-1005',
    department: 'واحد بازرگانی و باسکول',
    position: 'اپراتور ارشد باسکول ۶۰ تنی',
    approvalLevel: 1,
    roleGroupId: 'ROLE_WEIGHBRIDGE_OPERATOR',
    roleGroupName: 'اپراتورهای باسکول و خروجی بار',
    avatar: PRESET_AVATARS[4],
    signatureUrl: 'https://api.dicebear.com/7.x/identicon/svg?seed=AkbariSig',
    statusText: 'ثبت وزن خالی تریلی‌های خروجی سیمان فله',
    isActive: true,
    lastLogin: '۱۴۰۵/۰۵/۰۲ - ۰۷:۵۰',
    email: 'a.akbari@ciment-ai.ir',
    mobile: '09125556677'
  }
];

// Sensitive Fields List for Field-Level Permission Matrix
const SENSITIVE_FIELDS_CATALOG = [
  { key: 'FIN_VOUCHER_AMOUNT', label: 'مبالغ اسناد بدهکار/بستانکار', category: 'مالی و اسناد' },
  { key: 'FIN_TAX_RATE', label: 'اطلاعات مالیاتی ماده ۱۰۴ و مودیان', category: 'مالی و اسناد' },
  { key: 'HCM_NATIONAL_ID', label: 'کد ملی و شماره شناسنامه پرسنل', category: 'منابع انسانی' },
  { key: 'HCM_BASE_SALARY', label: 'حقوق پایه، فیش حقوقی و کارانه', category: 'منابع انسانی' },
  { key: 'MRP_RAW_RECIPE', label: 'فرمولاسیون خوراک کوره (BOM کلینکر)', category: 'تولید و فرمول' },
  { key: 'COMM_CUSTOMER_DISCOUNT', label: 'سقف اعتبار و تخفیفات عاملیت‌ها', category: 'بازرگانی و بورس' },
  { key: 'OFFICE_SECRET_LETTERS', label: 'متن اسناد محرمانه و سری دبیرخانه', category: 'اتوماسیون اداری' },
  { key: 'BI_EXECUTIVE_COSTS', label: 'نمودار بهای تمام شده و سود خالص', category: 'هوش تجاری' }
];

export const BaseInfoUserMgmtView: React.FC<BaseInfoUserMgmtViewProps> = ({
  activeSubsystemId,
  currentUserAvatar,
  onUpdateUserAvatar
}) => {
  const [activeTab, setActiveTab] = useState<'USERS' | 'ROLES' | 'FIELD_MATRIX' | 'ORG_APPROVALS' | 'MY_PROFILE'>('USERS');

  React.useEffect(() => {
    if (activeSubsystemId === 'BASE_ROLES_GROUPS') setActiveTab('ROLES');
    else if (activeSubsystemId === 'BASE_FIELD_PERMISSIONS') setActiveTab('FIELD_MATRIX');
    else if (activeSubsystemId === 'BASE_ORG_APPROVALS') setActiveTab('ORG_APPROVALS');
    else if (activeSubsystemId === 'BASE_USER_PROFILES') setActiveTab('MY_PROFILE');
    else if (activeSubsystemId === 'BASE_USER_MGMT') setActiveTab('USERS');
  }, [activeSubsystemId]);

  // State Management
  const [users, setUsers] = useState<UserAccount[]>(INITIAL_USERS);
  const [roleGroups, setRoleGroups] = useState<CustomRoleGroup[]>(INITIAL_ROLE_GROUPS);
  
  // Active User Logged In (Mohsen Vahedi as default)
  const [myProfile, setMyProfile] = useState<UserAccount>(() => ({
    ...INITIAL_USERS[0],
    avatar: currentUserAvatar || INITIAL_USERS[0].avatar
  }));

  // Search & Filters
  const [userSearch, setUserSearch] = useState('');
  const [selectedDeptFilter, setSelectedDeptFilter] = useState('ALL');
  const [selectedRoleFilter, setSelectedRoleFilter] = useState('ALL');

  // Modal States
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<UserAccount | null>(null);

  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);

  // Password Change Modal
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [passwordTargetUser, setPasswordTargetUser] = useState<UserAccount | null>(null);
  const [newPasswordValue, setNewPasswordValue] = useState('');

  // User Form State
  const [userFormData, setUserFormData] = useState<Partial<UserAccount>>({
    firstNameFa: '',
    lastNameFa: '',
    firstNameEn: '',
    lastNameEn: '',
    username: '',
    nationalId: '',
    personnelCode: '',
    department: 'واحد مالی و امور مالیاتی',
    position: 'کارشناس ارشد',
    approvalLevel: 1,
    roleGroupId: INITIAL_ROLE_GROUPS[1].id,
    roleGroupName: INITIAL_ROLE_GROUPS[1].roleNameFa,
    statusText: 'کاربر فعال در سیستم Ciment AI',
    avatar: PRESET_AVATARS[0],
    signatureUrl: 'https://api.dicebear.com/7.x/identicon/svg?seed=DefaultSignature',
    isActive: true,
    email: '',
    mobile: ''
  });

  // Self Profile Form
  const [myStatusText, setMyStatusText] = useState(myProfile.statusText);
  const [myOldPass, setMyOldPass] = useState('');
  const [myNewPass, setMyNewPass] = useState('');
  const [myConfirmPass, setMyConfirmPass] = useState('');
  const [profileSaveSuccess, setProfileSaveSuccess] = useState('');

  // Selected Role for Field Permissions Matrix tab
  const [selectedMatrixRole, setSelectedMatrixRole] = useState<string>(INITIAL_ROLE_GROUPS[1].id);

  // Helper: File upload converter to Base64
  const handleFileUpload = (
    file: File,
    onSuccess: (dataUrl: string) => void
  ) => {
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      alert('حجم فایل انتخابی نباید بیشتر از ۵ مگابایت باشد.');
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        onSuccess(e.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  // Helper: Auto Generate Username e.g., Mohsen Vahedi -> m.vahedi
  const generateUsername = (firstEn: string, lastEn: string) => {
    if (!firstEn && !lastEn) return '';
    const initial = firstEn.trim().charAt(0).toLowerCase();
    const cleanLast = lastEn.trim().toLowerCase().replace(/\s+/g, '');
    return initial && cleanLast ? `${initial}.${cleanLast}` : cleanLast || initial;
  };

  // Handle open creation modal
  const handleOpenCreateUser = () => {
    setEditingUser(null);
    setUserFormData({
      firstNameFa: '',
      lastNameFa: '',
      firstNameEn: '',
      lastNameEn: '',
      username: '',
      nationalId: '',
      personnelCode: `C-${Math.floor(1000 + Math.random() * 9000)}`,
      department: 'واحد مالی و امور مالیاتی',
      position: 'کارشناس ارشد',
      approvalLevel: 1,
      roleGroupId: roleGroups[1]?.id || 'ROLE_FINANCE_DIRECTOR',
      roleGroupName: roleGroups[1]?.roleNameFa || 'مدیران مالی و خزانه‌داری',
      statusText: 'کاربر جدید فعال در سیستم Ciment AI ERP',
      avatar: PRESET_AVATARS[0],
      signatureUrl: 'https://api.dicebear.com/7.x/identicon/svg?seed=NewSignature',
      isActive: true,
      email: '',
      mobile: ''
    });
    setIsUserModalOpen(true);
  };

  // Handle Edit User
  const handleOpenEditUser = (user: UserAccount) => {
    setEditingUser(user);
    setUserFormData({ ...user });
    setIsUserModalOpen(true);
  };

  // Save User
  const handleSaveUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userFormData.firstNameFa || !userFormData.lastNameFa || !userFormData.nationalId) {
      alert('لطفاً نام، نام خانوادگی و کد ملی را به دقت وارد نمایید.');
      return;
    }

    const calculatedUsername = userFormData.username || generateUsername(userFormData.firstNameEn || '', userFormData.lastNameEn || '');
    const defaultPassword = userFormData.nationalId;

    if (editingUser) {
      // Update
      setUsers((prev) =>
        prev.map((u) =>
          u.id === editingUser.id
            ? ({
                ...u,
                ...userFormData,
                username: calculatedUsername
              } as UserAccount)
            : u
        )
      );
    } else {
      // Create new
      const newUser: UserAccount = {
        id: `USR-${Math.floor(1000 + Math.random() * 9000)}`,
        firstNameFa: userFormData.firstNameFa || '',
        lastNameFa: userFormData.lastNameFa || '',
        firstNameEn: userFormData.firstNameEn || '',
        lastNameEn: userFormData.lastNameEn || '',
        username: calculatedUsername || 'user.new',
        nationalId: userFormData.nationalId || '0000000000',
        password: defaultPassword || '0000000000',
        personnelCode: userFormData.personnelCode || 'C-9999',
        department: userFormData.department || 'عمومی',
        position: userFormData.position || 'کارشناس',
        approvalLevel: userFormData.approvalLevel || 1,
        roleGroupId: userFormData.roleGroupId || roleGroups[0].id,
        roleGroupName: roleGroups.find((r) => r.id === userFormData.roleGroupId)?.roleNameFa || 'کاربر عمومی',
        avatar: userFormData.avatar || PRESET_AVATARS[0],
        signatureUrl: userFormData.signatureUrl || 'https://api.dicebear.com/7.x/identicon/svg?seed=Sig',
        statusText: userFormData.statusText || 'فعال',
        isActive: userFormData.isActive ?? true,
        lastLogin: 'جدید (وارد نشده)',
        email: userFormData.email || '',
        mobile: userFormData.mobile || ''
      };
      setUsers((prev) => [newUser, ...prev]);
    }

    setIsUserModalOpen(false);
  };

  // Toggle user active state
  const handleToggleActive = (userId: string) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, isActive: !u.isActive } : u))
    );
  };

  // Reset Password for User
  const handleResetPassword = () => {
    if (!passwordTargetUser || !newPasswordValue) return;
    setUsers((prev) =>
      prev.map((u) =>
        u.id === passwordTargetUser.id
          ? { ...u, password: newPasswordValue }
          : u
      )
    );
    alert(`کلمه عبور کاربر ${passwordTargetUser.firstNameFa} ${passwordTargetUser.lastNameFa} با موفقیت تغییر کرد.`);
    setIsPasswordModalOpen(false);
    setNewPasswordValue('');
  };

  // Field Access Matrix Toggle
  const handleToggleFieldAccess = (roleId: string, fieldKey: string, newAccess: FieldAccessType) => {
    setRoleGroups((prev) =>
      prev.map((rg) => {
        if (rg.id === roleId) {
          return {
            ...rg,
            fieldAccess: {
              ...rg.fieldAccess,
              [fieldKey]: newAccess
            }
          };
        }
        return rg;
      })
    );
  };

  // Subsystem Access Toggle for Role
  const handleToggleSubsystemAccess = (roleId: string, subKey: string, newAccess: ModuleAccessType) => {
    setRoleGroups((prev) =>
      prev.map((rg) => {
        if (rg.id === roleId) {
          return {
            ...rg,
            subsystemAccess: {
              ...rg.subsystemAccess,
              [subKey]: newAccess
            }
          };
        }
        return rg;
      })
    );
  };

  // Save Self Profile
  const handleSaveMyProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (myNewPass) {
      if (myNewPass !== myConfirmPass) {
        alert('کلمه عبور جدید با تکرار آن یکسان نیست.');
        return;
      }
      if (myNewPass.length < 6) {
        alert('کلمه عبور باید حداقل ۶ کاراکتر باشد.');
        return;
      }
    }

    setMyProfile((prev) => ({
      ...prev,
      statusText: myStatusText,
      password: myNewPass ? myNewPass : prev.password
    }));

    setUsers((prev) =>
      prev.map((u) =>
        u.id === myProfile.id
          ? {
              ...u,
              statusText: myStatusText,
              password: myNewPass ? myNewPass : u.password
            }
          : u
      )
    );

    setProfileSaveSuccess('اطلاعات پروفایل و وضعیت شما با موفقیت بروزرسانی شد.');
    setTimeout(() => setProfileSaveSuccess(''), 4000);
    setMyOldPass('');
    setMyNewPass('');
    setMyConfirmPass('');
  };

  // Filtered Users List
  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.firstNameFa.includes(userSearch) ||
      u.lastNameFa.includes(userSearch) ||
      u.firstNameEn.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.lastNameEn.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.username.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.nationalId.includes(userSearch) ||
      u.personnelCode.includes(userSearch) ||
      u.department.includes(userSearch);

    const matchesDept = selectedDeptFilter === 'ALL' || u.department === selectedDeptFilter;
    const matchesRole = selectedRoleFilter === 'ALL' || u.roleGroupId === selectedRoleFilter;

    return matchesSearch && matchesDept && matchesRole;
  });

  const activeRoleGroupForMatrix = roleGroups.find((rg) => rg.id === selectedMatrixRole) || roleGroups[0];

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 font-sans w-full text-right dir-rtl">
      {/* Light Theme Executive Header Banner matching ReportsView Style */}
      <div className="p-5 sm:p-6 rounded-3xl bg-white border border-slate-200/80 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#0f2b5c] text-white font-black flex items-center justify-center shrink-0 shadow-md">
            <Shield className="w-6 h-6 text-amber-400" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-lg sm:text-xl font-black text-slate-900">
                اطلاعات پایه • مدیریت کاربران و سطوح دسترسی (RBAC)
              </h2>
              <span className="text-xs font-mono px-3 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200 font-bold">
                سطوح سفارشی
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1 font-medium leading-relaxed">
              تعریف کاربری، کد ملی به عنوان رمز عبور پیش‌فرض، سطوح دسترسی فیلدها، سیستم‌ها، سطوح تاییدات و امضای دیجیتال
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={handleOpenCreateUser}
            className="px-4 py-2.5 rounded-xl bg-[#0f2b5c] hover:bg-[#1a3f7a] text-white font-extrabold text-xs flex items-center gap-2 shadow-sm transition-all"
          >
            <UserPlus className="w-4 h-4 text-amber-400" />
            <span>تعریف کاربر جدید</span>
          </button>
        </div>
      </div>

      {/* High-Contrast Scrollable Tabs Navigation Menu */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-200 scrollbar-thin">
        <button
          onClick={() => setActiveTab('USERS')}
          className={`px-4 py-3 rounded-xl text-xs font-black transition-all flex items-center gap-2 whitespace-nowrap border ${
            activeTab === 'USERS'
              ? 'bg-[#0f2b5c] text-white border-[#0f2b5c] shadow-sm'
              : 'bg-white text-slate-700 hover:bg-slate-50 hover:text-slate-900 border-slate-200 font-bold'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>حساب‌های کاربری ({users.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('ROLES')}
          className={`px-4 py-3 rounded-xl text-xs font-black transition-all flex items-center gap-2 whitespace-nowrap border ${
            activeTab === 'ROLES'
              ? 'bg-[#0f2b5c] text-white border-[#0f2b5c] shadow-sm'
              : 'bg-white text-slate-700 hover:bg-slate-50 hover:text-slate-900 border-slate-200 font-bold'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>نقش‌های سفارشی ({roleGroups.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('FIELD_MATRIX')}
          className={`px-4 py-3 rounded-xl text-xs font-black transition-all flex items-center gap-2 whitespace-nowrap border ${
            activeTab === 'FIELD_MATRIX'
              ? 'bg-[#0f2b5c] text-white border-[#0f2b5c] shadow-sm'
              : 'bg-white text-slate-700 hover:bg-slate-50 hover:text-slate-900 border-slate-200 font-bold'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>ماتریس دسترسی فیلدها & زیرسیستم‌ها</span>
        </button>

        <button
          onClick={() => setActiveTab('ORG_APPROVALS')}
          className={`px-4 py-3 rounded-xl text-xs font-black transition-all flex items-center gap-2 whitespace-nowrap border ${
            activeTab === 'ORG_APPROVALS'
              ? 'bg-[#0f2b5c] text-white border-[#0f2b5c] shadow-sm'
              : 'bg-white text-slate-700 hover:bg-slate-50 hover:text-slate-900 border-slate-200 font-bold'
          }`}
        >
          <Network className="w-4 h-4" />
          <span>سطوح تاییدات & چارت سازمانی</span>
        </button>

        <button
          onClick={() => setActiveTab('MY_PROFILE')}
          className={`px-4 py-3 rounded-xl text-xs font-black transition-all flex items-center gap-2 whitespace-nowrap border ${
            activeTab === 'MY_PROFILE'
              ? 'bg-[#0f2b5c] text-white border-[#0f2b5c] shadow-sm'
              : 'bg-white text-slate-700 hover:bg-slate-50 hover:text-slate-900 border-slate-200 font-bold'
          }`}
        >
          <UserCheck className="w-4 h-4" />
          <span>پروفایل من & امضای دیجیتال</span>
        </button>
      </div>

      {/* TAB 1: USERS MANAGEMENT LIST */}
      {activeTab === 'USERS' && (
        <div className="space-y-4">
          {/* Search & Filters */}
          <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-3 text-xs">
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute right-3 top-2.5" />
              <input
                type="text"
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
                placeholder="جستجوی نام، نام کاربری (m.vahedi)، کد ملی..."
                className="w-full pr-9 pl-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-600 focus:bg-white font-medium"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
              <div className="flex items-center gap-1 text-slate-600 font-bold">
                <Filter className="w-3.5 h-3.5 text-indigo-600" />
                <span>دپارتمان:</span>
              </div>
              <select
                value={selectedDeptFilter}
                onChange={(e) => setSelectedDeptFilter(e.target.value)}
                className="px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-bold focus:outline-none focus:border-indigo-600"
              >
                <option value="ALL">همه دپارتمان‌ها</option>
                <option value="مدیر پروژه (آقای واحدی)">مدیریت ارشد</option>
                <option value="واحد تولید و کوره">واحد تولید و کوره</option>
                <option value="واحد کنترل کیفیت (QC)">واحد کنترل کیفیت</option>
                <option value="واحد مالی و امور مالیاتی">واحد مالی و امور مالیاتی</option>
                <option value="واحد بازرگانی و باسکول">واحد بازرگانی و باسکول</option>
              </select>

              <div className="flex items-center gap-1 text-slate-600 font-bold mr-2">
                <span>گروه:</span>
              </div>
              <select
                value={selectedRoleFilter}
                onChange={(e) => setSelectedRoleFilter(e.target.value)}
                className="px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-bold focus:outline-none focus:border-indigo-600"
              >
                <option value="ALL">همه نقش‌ها</option>
                {roleGroups.map((rg) => (
                  <option key={rg.id} value={rg.id}>
                    {rg.roleNameFa}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Users Table */}
          <div className="rounded-2xl bg-white border border-slate-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-right text-xs">
                <thead className="bg-slate-100 border-b border-slate-200 text-slate-900 font-extrabold">
                  <tr>
                    <th className="p-3.5">کاربر & تصویر</th>
                    <th className="p-3.5">نام و نام خانوادگی (فارسی / انگلیسی)</th>
                    <th className="p-3.5">نام کاربری & کد ملی (رمز)</th>
                    <th className="p-3.5">دپارتمان & سمت</th>
                    <th className="p-3.5">سطح تایید</th>
                    <th className="p-3.5">گروه کاربری سفارشی</th>
                    <th className="p-3.5">امضای دیجیتال</th>
                    <th className="p-3.5">وضعیت (Status)</th>
                    <th className="p-3.5 text-center">عملیات</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-800">
                  {filteredUsers.map((u) => (
                    <tr key={u.id} className="hover:bg-slate-50 transition-colors">
                      {/* Avatar */}
                      <td className="p-3.5">
                        <div className="flex items-center gap-2.5">
                          <img
                            src={u.avatar}
                            alt={u.username}
                            className="w-9 h-9 rounded-xl object-cover border border-slate-200 shadow-sm shrink-0"
                          />
                          <div>
                            <div className="font-mono text-[10px] text-indigo-900 font-extrabold">{u.personnelCode}</div>
                            <span
                              className={`text-[9px] px-2 py-0.5 rounded font-black inline-block mt-0.5 border ${
                                u.isActive
                                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                                  : 'bg-rose-50 text-rose-800 border-rose-200'
                              }`}
                            >
                              {u.isActive ? 'فعال' : 'غیرفعال'}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Names */}
                      <td className="p-3.5">
                        <div className="font-extrabold text-slate-900">{u.firstNameFa} {u.lastNameFa}</div>
                        <div className="text-[11px] font-mono text-slate-500 font-bold">{u.firstNameEn} {u.lastNameEn}</div>
                      </td>

                      {/* Username & National ID */}
                      <td className="p-3.5 font-mono">
                        <div className="text-indigo-900 font-black">{u.username}</div>
                        <div className="text-slate-500 text-[11px] font-bold" title="کد ملی (رمز پیش‌فرض)">
                          کد ملی: {u.nationalId}
                        </div>
                      </td>

                      {/* Dept & Position */}
                      <td className="p-3.5">
                        <div className="font-bold text-slate-800">{u.department}</div>
                        <div className="text-[11px] text-slate-500 font-medium">{u.position}</div>
                      </td>

                      {/* Approval Level */}
                      <td className="p-3.5">
                        <span className="px-2.5 py-1 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 font-extrabold text-[11px] inline-flex items-center gap-1">
                          سطح {u.approvalLevel}
                        </span>
                      </td>

                      {/* Custom Role Group */}
                      <td className="p-3.5">
                        <div className="font-bold text-indigo-900">{u.roleGroupName}</div>
                      </td>

                      {/* Signature Preview */}
                      <td className="p-3.5">
                        {u.signatureUrl ? (
                          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-lg border border-slate-200 w-fit">
                            <img src={u.signatureUrl} alt="amza" className="w-7 h-7 object-contain rounded" />
                            <span className="text-[9px] text-emerald-700 font-bold font-mono">ثبت شد</span>
                          </div>
                        ) : (
                          <span className="text-slate-400 text-[10px]">بدون امضاء</span>
                        )}
                      </td>

                      {/* Status Message */}
                      <td className="p-3.5 max-w-[180px]">
                        <p className="truncate text-slate-600 text-[11px] font-medium" title={u.statusText}>
                          "{u.statusText}"
                        </p>
                      </td>

                      {/* Actions */}
                      <td className="p-3.5 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={() => handleOpenEditUser(u)}
                            className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200 transition-colors"
                            title="ویرایش کامل مشخصات"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => {
                              setPasswordTargetUser(u);
                              setNewPasswordValue(u.nationalId);
                              setIsPasswordModalOpen(true);
                            }}
                            className="p-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 transition-colors"
                            title="تغییر کلمه عبور"
                          >
                            <Key className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleToggleActive(u.id)}
                            className={`p-1.5 rounded-lg transition-colors border ${
                              u.isActive
                                ? 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
                                : 'bg-rose-50 text-rose-800 border-rose-200 hover:bg-rose-100'
                            }`}
                            title={u.isActive ? 'غیرفعال‌سازی کاربر' : 'فعال‌سازی کاربر'}
                          >
                            {u.isActive ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: CUSTOM ROLES MANAGEMENT (RBAC) */}
      {activeTab === 'ROLES' && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
              <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-indigo-700" />
                <span>تعریف گروه‌های کاری و نقش‌های سفارشی (Custom Roles)</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5 font-medium">
                تخصیص ماتریس سطوح دسترسی، محدودیت ماژول‌ها و سطوح امضای چارت به گروه کاربران
              </p>
            </div>
            <button
              onClick={() => {
                setIsRoleModalOpen(true);
              }}
              className="px-3.5 py-2 rounded-xl bg-[#0f2b5c] hover:bg-[#1a3f7a] text-white text-xs font-black flex items-center gap-2 shadow-sm transition-all"
            >
              <UserPlus className="w-4 h-4 text-amber-400" />
              <span>افزودن گروه کاربری جدید</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {roleGroups.map((rg) => (
              <div
                key={rg.id}
                className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-indigo-300 transition-all space-y-4 shadow-sm relative overflow-hidden"
              >
                {rg.isSystemRole && (
                  <div className="absolute top-3 left-3 text-[10px] bg-amber-50 text-amber-800 font-extrabold px-2.5 py-0.5 rounded-full border border-amber-200 font-mono">
                    نقش سیستمی
                  </div>
                )}

                <div>
                  <h4 className="text-base font-black text-slate-900 flex items-center gap-2">
                    <Shield className="w-4 h-4 text-indigo-700" />
                    <span>{rg.roleNameFa}</span>
                  </h4>
                  <div className="text-[11px] font-mono font-bold text-slate-500 mt-0.5">{rg.roleNameEn}</div>
                  <p className="text-xs text-slate-600 mt-2 line-clamp-2 leading-relaxed font-medium">
                    {rg.description}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs border-y border-slate-100 py-3 bg-slate-50 p-3 rounded-xl border">
                  <div>
                    <span className="text-slate-500 block text-[10px] font-bold">سقف سطح تایید:</span>
                    <span className="font-black text-emerald-700">سطح {rg.maxApprovalLevel} چارت</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px] font-bold">تعداد اعضای فعال:</span>
                    <span className="font-black text-indigo-900">
                      {users.filter((u) => u.roleGroupId === rg.id).length} کاربر
                    </span>
                  </div>
                </div>

                <div className="space-y-1.5 text-xs">
                  <span className="text-slate-700 text-[11px] block font-extrabold">دسترسی‌های کلیدی ماژول‌ها:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {Object.entries(rg.subsystemAccess).map(([sub, acc]) => (
                      <span
                        key={sub}
                        className={`text-[10px] px-2 py-0.5 rounded-lg border font-mono font-bold ${
                          acc === 'FULL'
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                            : acc === 'READ_ONLY'
                            ? 'bg-blue-50 text-blue-800 border-blue-200'
                            : 'bg-slate-100 text-slate-400 border-slate-200 line-through'
                        }`}
                      >
                        {sub}: {acc}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                  <button
                    onClick={() => {
                      setSelectedMatrixRole(rg.id);
                      setActiveTab('FIELD_MATRIX');
                    }}
                    className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold border border-slate-200 transition-all flex items-center gap-1.5"
                  >
                    <Sliders className="w-3.5 h-3.5 text-indigo-700" />
                    <span>ویرایش ماتریس فیلدها</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: FIELD-LEVEL & SUBSYSTEM PERMISSION MATRIX */}
      {activeTab === 'FIELD_MATRIX' && (
        <div className="space-y-4">
          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
                  <Layers className="w-4 h-4 text-indigo-700" />
                  <span>ماتریس دسترسی در دقیق‌ترین سطح (فیلدها و زیرسیستم‌ها)</span>
                </h3>
                <p className="text-xs text-slate-500 mt-1 font-medium">
                  تنظیم مجوز فیلدهای حساس برنامه به تفکیک: ویرایش (WRITE)، فقط خواندنی (READ)، مخفی (HIDE)، ماسک‌شده (MASK)
                </p>
              </div>

              {/* Select Role for Matrix */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-700 font-bold">انتخاب نقش برای پیکربندی:</span>
                <select
                  value={selectedMatrixRole}
                  onChange={(e) => setSelectedMatrixRole(e.target.value)}
                  className="px-3 py-2 bg-slate-50 border border-slate-300 text-slate-900 font-black rounded-xl text-xs focus:outline-none focus:border-indigo-600"
                >
                  {roleGroups.map((rg) => (
                    <option key={rg.id} value={rg.id}>
                      {rg.roleNameFa}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Role Header Summary */}
            <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-center justify-between font-bold">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-amber-700 shrink-0" />
                <span>
                  نقش انتخاب‌شده: <strong>{activeRoleGroupForMatrix.roleNameFa}</strong> ({activeRoleGroupForMatrix.roleNameEn})
                </span>
              </div>
              <span className="font-mono text-[11px] bg-white px-2 py-1 rounded border border-amber-200">
                سقف سطح تایید: {activeRoleGroupForMatrix.maxApprovalLevel}
              </span>
            </div>
          </div>

          {/* Granular Field Permission Table */}
          <div className="rounded-2xl bg-white border border-slate-200 shadow-sm overflow-hidden p-5 space-y-6">
            <h4 className="text-xs font-black text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
              <Sliders className="w-4 h-4 text-indigo-700" />
              <span>۱. سطوح دسترسی فیلدهای حساس برنامه (Field-Level Permissions)</span>
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {SENSITIVE_FIELDS_CATALOG.map((f) => {
                const currentPerm = activeRoleGroupForMatrix.fieldAccess[f.key] || 'WRITE';

                return (
                  <div
                    key={f.key}
                    className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-3 text-xs"
                  >
                    <div>
                      <div className="font-bold text-slate-900">{f.label}</div>
                      <div className="text-[10px] text-slate-500 font-mono font-bold mt-0.5">
                        {f.category} • Key: {f.key}
                      </div>
                    </div>

                    <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-slate-300">
                      {(['WRITE', 'READ', 'MASK', 'HIDE'] as FieldAccessType[]).map((mode) => (
                        <button
                          key={mode}
                          onClick={() => handleToggleFieldAccess(activeRoleGroupForMatrix.id, f.key, mode)}
                          className={`px-2 py-1 rounded-lg text-[10px] font-mono transition-all font-bold ${
                            currentPerm === mode
                              ? mode === 'WRITE'
                                ? 'bg-emerald-600 text-white'
                                : mode === 'READ'
                                ? 'bg-indigo-700 text-white'
                                : mode === 'MASK'
                                ? 'bg-amber-600 text-white'
                                : 'bg-rose-600 text-white'
                              : 'text-slate-600 hover:text-slate-900'
                          }`}
                        >
                          {mode === 'WRITE' ? 'ویرایش' : mode === 'READ' ? 'خواندنی' : mode === 'MASK' ? 'ماسک' : 'مخفی'}
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

            <h4 className="text-xs font-black text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3 pt-4">
              <Building2 className="w-4 h-4 text-indigo-700" />
              <span>۲. مجوز زیرسیستم‌ها و ماژول‌های ERP (Subsystem Access Level)</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {[
                { id: 'FIN_GENERAL', title: 'حسابداری مالی و مرور اسناد' },
                { id: 'FIN_PAYROLL', title: 'مالی حقوق و دستمزد' },
                { id: 'FIN_TAX_1405', title: 'دستیار مالیاتی ۱۴۰۵' },
                { id: 'HCM_PERSONNEL', title: 'پرونده الکترونیک پرسنلی' },
                { id: 'MRP_PLANNING', title: 'برنامه‌ریزی کوره و BOM' },
                { id: 'COMM_WEIGHBRIDGE', title: 'باسکول ۶۰ تنی صنعتی' },
                { id: 'OFFICE_SECRETARIAT', title: 'دبیرخانه و نامه‌نگاری' },
                { id: 'BI_DASHBOARDS', title: 'داشبوردهای هوش تجاری' },
                { id: 'BASE_USER_MGMT', title: 'مدیریت کاربران و اطلاعات پایه' }
              ].map((sub) => {
                const currentSubAccess = activeRoleGroupForMatrix.subsystemAccess[sub.id] || 'FULL';

                return (
                  <div
                    key={sub.id}
                    className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs"
                  >
                    <span className="font-bold text-slate-800 truncate max-w-[140px]">{sub.title}</span>

                    <div className="flex items-center gap-1 bg-white p-1 rounded-lg border border-slate-300">
                      {(['FULL', 'READ_ONLY', 'NO_ACCESS'] as ModuleAccessType[]).map((mode) => (
                        <button
                          key={mode}
                          onClick={() => handleToggleSubsystemAccess(activeRoleGroupForMatrix.id, sub.id, mode)}
                          className={`px-2 py-0.5 rounded text-[10px] font-mono transition-all font-bold ${
                            currentSubAccess === mode
                              ? mode === 'FULL'
                                ? 'bg-emerald-600 text-white'
                                : mode === 'READ_ONLY'
                                ? 'bg-indigo-700 text-white'
                                : 'bg-rose-600 text-white'
                              : 'text-slate-500 hover:text-slate-800'
                          }`}
                        >
                          {mode === 'FULL' ? 'کامل' : mode === 'READ_ONLY' ? 'فقط‌خواندنی' : 'عدم‌دسترسی'}
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: APPROVAL LEVELS & ORG CHART MATRIX */}
      {activeTab === 'ORG_APPROVALS' && (
        <div className="space-y-4">
          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-2">
            <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
              <Network className="w-4 h-4 text-indigo-700" />
              <span>سطوح تاییدات چارت سازمانی و سقف امضاهای الکترونیک</span>
            </h3>
            <p className="text-xs text-slate-500 font-medium">
              تعریف سطوح ۱ تا ۵ برای تایید درخواست‌های مرخصی، اسناد خزانه‌داری، خرید آجر نسوز و حواله‌های بارگیری سیمان
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-3 text-xs">
            {[
              { level: 1, title: 'سطح ۱: کارشناس / اپراتور', limit: 'تا ۱۰۰ میلیون ریال', desc: 'تایید اولیه‌درخواست‌ها، ثبت قبض باسکول' },
              { level: 2, title: 'سطح ۲: سرپرست واحد', limit: 'تا ۱ میلیارد ریال', desc: 'تایید مرخصی، پیش‌فاکتور خرید داخلی' },
              { level: 3, title: 'سطح ۳: مدیر واحد', limit: 'تا ۱۰ میلیارد ریال', desc: 'تایید اسناد حسابداری، فرمول کوره، خروجی بار' },
              { level: 4, title: 'سطح ۴: مدیر ارشد / مالی', limit: 'تا ۱۰۰ میلیارد ریال', desc: 'تایید چک، خزانه‌داری، سفارشات خارجی LC' },
              { level: 5, title: 'سطح ۵: مدیرعامل / هیئت مدیره', limit: 'نامحدود (بالاترین سطح)', desc: 'تایید نهایی کلیه اسناد کلان و خطوط تولید' }
            ].map((lvl) => (
              <div
                key={lvl.level}
                className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm hover:border-indigo-300 transition-all space-y-2"
              >
                <div className="w-8 h-8 rounded-xl bg-slate-100 text-indigo-900 font-black flex items-center justify-center font-mono text-sm border border-slate-200">
                  {lvl.level}
                </div>
                <h4 className="font-extrabold text-slate-900">{lvl.title}</h4>
                <div className="text-[11px] font-mono text-emerald-800 bg-emerald-50 p-1.5 rounded-lg border border-emerald-200 font-bold">
                  سقف: {lvl.limit}
                </div>
                <p className="text-[11px] text-slate-600 leading-relaxed font-medium">{lvl.desc}</p>
              </div>
            ))}
          </div>

          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3">
            <h4 className="text-xs font-black text-slate-900">نقشه چارت سازمانی & پرسنل تخصیص داده شده:</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
              {users.map((u) => (
                <div key={u.id} className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-3">
                  <img src={u.avatar} alt={u.username} className="w-10 h-10 rounded-xl object-cover border border-slate-200 shrink-0" />
                  <div className="overflow-hidden">
                    <div className="font-extrabold text-slate-900 truncate">{u.firstNameFa} {u.lastNameFa}</div>
                    <div className="text-[11px] text-slate-500 font-medium truncate">{u.position}</div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold">
                        سطح تایید {u.approvalLevel}
                      </span>
                      <span className="text-[10px] font-mono text-indigo-900 font-bold">{u.personnelCode}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: MY PROFILE & DIGITAL SIGNATURE */}
      {activeTab === 'MY_PROFILE' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Card: Active Profile Info */}
          <div className="lg:col-span-5 p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-5 text-slate-900">
            <div className="flex flex-col items-center text-center space-y-3">
              <div className="relative group">
                <img
                  src={myProfile.avatar}
                  alt={myProfile.username}
                  className="w-24 h-24 rounded-2xl object-cover border-2 border-indigo-600 shadow-md bg-slate-100"
                />
                <label
                  className="absolute -bottom-2 right-1/2 translate-x-1/2 px-2.5 py-1 rounded-full bg-[#0f2b5c] text-white font-extrabold text-[10px] shadow-sm flex items-center gap-1 cursor-pointer transition-all whitespace-nowrap"
                  title="تغییر تصویر پروفایل"
                >
                  <Upload className="w-3 h-3 text-amber-400" />
                  <span>تغییر تصویر</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        handleFileUpload(file, (base64) => {
                          setMyProfile((prev) => ({ ...prev, avatar: base64 }));
                          onUpdateUserAvatar?.(base64);
                          setUsers((prev) =>
                            prev.map((u) => (u.id === myProfile.id ? { ...u, avatar: base64 } : u))
                          );
                        });
                      }
                    }}
                  />
                </label>
              </div>

              {/* Standard Vector Avatars Quick Selection */}
              <div className="pt-2 w-full text-center">
                <p className="text-[10px] text-slate-500 mb-1.5 font-bold">یا انتخاب از آواتارهای وکتوری استاندارد:</p>
                <div className="flex items-center justify-center gap-1.5 flex-wrap">
                  {PRESET_AVATARS.slice(0, 7).map((avat, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        setMyProfile((prev) => ({ ...prev, avatar: avat }));
                        onUpdateUserAvatar?.(avat);
                        setUsers((prev) =>
                          prev.map((u) => (u.id === myProfile.id ? { ...u, avatar: avat } : u))
                        );
                      }}
                      className={`w-7 h-7 rounded-lg overflow-hidden border transition-all ${
                        myProfile.avatar === avat
                          ? 'border-indigo-600 ring-2 ring-indigo-600/30'
                          : 'border-slate-200 opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={avat} alt={`Preset Avatar ${idx + 1}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-black text-slate-900">{myProfile.firstNameFa} {myProfile.lastNameFa}</h3>
                <div className="text-xs font-mono text-slate-500 font-bold mt-0.5">{myProfile.firstNameEn} {myProfile.lastNameEn}</div>
                <div className="text-xs font-mono text-indigo-900 font-extrabold mt-1">@{myProfile.username}</div>
              </div>

              <div className="w-full p-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-800 space-y-1">
                <span className="text-slate-500 text-[10px] block font-bold">وضعیت فعلی شما (Status):</span>
                <p className="font-bold text-indigo-950 italic">"{myProfile.statusText}"</p>
              </div>
            </div>

            <div className="space-y-2 text-xs border-t border-slate-100 pt-4">
              <div className="flex justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-slate-500 font-bold">کد پرسنلی:</span>
                <span className="font-mono font-black text-slate-900">{myProfile.personnelCode}</span>
              </div>
              <div className="flex justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-slate-500 font-bold">کد ملی (رمز اولیه):</span>
                <span className="font-mono font-bold text-slate-900">{myProfile.nationalId}</span>
              </div>
              <div className="flex justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-slate-500 font-bold">واحد سازمانی:</span>
                <span className="text-slate-900 font-bold">{myProfile.department}</span>
              </div>
              <div className="flex justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-slate-500 font-bold">سطح تاییدات چارت:</span>
                <span className="font-black text-emerald-800">سطح {myProfile.approvalLevel} (ارشد)</span>
              </div>
            </div>

            {/* Digital Signature Preview Card */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-black text-slate-900 flex items-center gap-1.5">
                  <FileSignature className="w-4 h-4 text-indigo-700" />
                  <span>نمونه امضای دیجیتال فعال شما</span>
                </span>
                <span className="text-[10px] text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 font-bold">
                  تایید شده
                </span>
              </div>
              <div className="h-20 bg-white rounded-xl border border-dashed border-slate-300 flex items-center justify-center p-2">
                <img src={myProfile.signatureUrl} alt="amza-digital" className="h-full object-contain" />
              </div>
              <p className="text-[10px] text-slate-500 text-center font-medium">
                از این امضا برای تایید اتوماتیک اسناد مالی، احکام و نامه‌های اداری استفاده می‌شود.
              </p>
            </div>
          </div>

          {/* Right Form: Update Status, Password & Signature */}
          <div className="lg:col-span-7 p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-6 text-slate-900">
            <h3 className="text-sm font-black text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
              <UserCheck className="w-4 h-4 text-indigo-700" />
              <span>ویرایش وضعیت (Status)، تغییر رمز عبور و نمونه امضا</span>
            </h3>

            {profileSaveSuccess && (
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-bold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-700" />
                <span>{profileSaveSuccess}</span>
              </div>
            )}

            <form onSubmit={handleSaveMyProfile} className="space-y-4 text-xs">
              {/* Status Text Input */}
              <div className="space-y-1.5">
                <label className="text-slate-800 font-bold block">متن وضعیت کاربر (Status Message):</label>
                <input
                  type="text"
                  value={myStatusText}
                  onChange={(e) => setMyStatusText(e.target.value)}
                  placeholder="مثال: در حال بازدید از خط کوره ۲ - پاسخگویی فقط از طریق بیسیم"
                  className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:border-indigo-600 focus:bg-white font-bold"
                />
              </div>

              {/* Password Change Box */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <span className="font-extrabold text-slate-900 flex items-center gap-2">
                  <Key className="w-4 h-4 text-indigo-700" />
                  <span>تغییر کلمه عبور حساب کاربری</span>
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-slate-600 font-bold block mb-1">کلمه عبور جدید:</label>
                    <input
                      type="password"
                      value={myNewPass}
                      onChange={(e) => setMyNewPass(e.target.value)}
                      placeholder="حداقل ۶ کاراکتر"
                      className="w-full p-2.5 bg-white border border-slate-300 rounded-xl text-slate-900 focus:outline-none font-mono dir-ltr"
                    />
                  </div>
                  <div>
                    <label className="text-slate-600 font-bold block mb-1">تکرار کلمه عبور جدید:</label>
                    <input
                      type="password"
                      value={myConfirmPass}
                      onChange={(e) => setMyConfirmPass(e.target.value)}
                      placeholder="تکرار رمز جدید"
                      className="w-full p-2.5 bg-white border border-slate-300 rounded-xl text-slate-900 focus:outline-none font-mono dir-ltr"
                    />
                  </div>
                </div>
              </div>

              {/* Upload Digital Signature Simulation */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <label className="font-extrabold text-slate-900 flex items-center gap-2">
                  <FileSignature className="w-4 h-4 text-indigo-700" />
                  <span>آپلود یا جایگزینی نمونه امضای دیجیتال:</span>
                </label>
                <div className="flex flex-col sm:flex-row items-center gap-3">
                  <label className="px-3.5 py-2.5 rounded-xl bg-[#0f2b5c] hover:bg-[#1a3f7a] text-white text-xs font-extrabold cursor-pointer flex items-center gap-2 transition-all shrink-0">
                    <Upload className="w-4 h-4 text-amber-400" />
                    <span>آپلود تصویر امضا از دستگاه</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          handleFileUpload(file, (base64) => {
                            setMyProfile((prev) => ({ ...prev, signatureUrl: base64 }));
                          });
                        }
                      }}
                    />
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      const seed = `Sig_${Math.floor(Math.random() * 1000)}`;
                      setMyProfile({
                        ...myProfile,
                        signatureUrl: `https://api.dicebear.com/7.x/identicon/svg?seed=${seed}`
                      });
                    }}
                    className="px-3.5 py-2.5 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-bold transition-all shrink-0"
                  >
                    تولید امضای نمونه هالوگرام
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-[#0f2b5c] hover:bg-[#1a3f7a] text-white font-extrabold flex items-center justify-center gap-2 transition-all shadow-sm"
              >
                <CheckCircle2 className="w-4 h-4 text-amber-400" />
                <span>ذخیره تغییرات پروفایل</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 1: CREATE / EDIT USER */}
      {isUserModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto dir-rtl">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 max-w-2xl w-full max-h-[85vh] overflow-y-auto space-y-5 shadow-2xl my-auto text-slate-900">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
                <UserPlus className="w-4 h-4 text-indigo-700" />
                <span>{editingUser ? 'ویرایش کامل کاربر' : 'تعریف کاربر جدید در سیستم Ciment AI'}</span>
              </h3>
              <button
                onClick={() => setIsUserModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-800 hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveUser} className="space-y-4 text-xs">
              {/* Profile Image Upload & Vector Avatar Selection */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <label className="text-slate-800 font-bold block flex items-center gap-2">
                  <ImageIcon className="w-4 h-4 text-indigo-700" />
                  <span>تصویر پروفایل کاربر (آپلود فایل اختصاصی یا انتخاب آواتار وکتوری):</span>
                </label>

                <div className="flex flex-col sm:flex-row items-center gap-4">
                  <div className="relative group shrink-0">
                    <img
                      src={userFormData.avatar || PRESET_AVATARS[0]}
                      alt="User Avatar Preview"
                      className="w-16 h-16 rounded-2xl object-cover border-2 border-indigo-600 shadow-md bg-white"
                    />
                    <div className="absolute inset-0 bg-slate-900/40 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                      <Upload className="w-5 h-5 text-white" />
                    </div>
                  </div>

                  <div className="flex-1 w-full space-y-2">
                    <div className="flex items-center gap-2">
                      <label className="px-3.5 py-2 rounded-xl bg-[#0f2b5c] text-white hover:bg-[#1a3f7a] text-xs font-bold cursor-pointer flex items-center gap-2 transition-all">
                        <Upload className="w-4 h-4 text-amber-400" />
                        <span>آپلود تصویر جدید از دستگاه</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              handleFileUpload(file, (base64) => {
                                setUserFormData((prev) => ({ ...prev, avatar: base64 }));
                              });
                            }
                          }}
                        />
                      </label>
                    </div>

                    <div className="text-[11px] text-slate-500 font-medium">
                      یا یکی از آواتارهای وکتوری استاندارد زیر را انتخاب کنید:
                    </div>

                    <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
                      {PRESET_AVATARS.map((avat, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setUserFormData((prev) => ({ ...prev, avatar: avat }))}
                          className={`w-8 h-8 rounded-xl overflow-hidden border transition-all shrink-0 ${
                            userFormData.avatar === avat
                              ? 'border-indigo-600 ring-2 ring-indigo-600/40 scale-105'
                              : 'border-slate-200 opacity-70 hover:opacity-100'
                          }`}
                        >
                          <img src={avat} alt={`Avatar Preset ${idx + 1}`} className="w-full h-full object-cover" />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-800 font-bold block mb-1">نام (فارسی): *</label>
                  <input
                    type="text"
                    required
                    value={userFormData.firstNameFa || ''}
                    onChange={(e) => {
                      const val = e.target.value;
                      setUserFormData((prev) => ({
                        ...prev,
                        firstNameFa: val,
                        username: generateUsername(prev.firstNameEn || '', prev.lastNameEn || '')
                      }));
                    }}
                    placeholder="مثال: محسن"
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:border-indigo-600 focus:bg-white font-bold"
                  />
                </div>
                <div>
                  <label className="text-slate-800 font-bold block mb-1">نام خانوادگی (فارسی): *</label>
                  <input
                    type="text"
                    required
                    value={userFormData.lastNameFa || ''}
                    onChange={(e) => {
                      const val = e.target.value;
                      setUserFormData((prev) => ({
                        ...prev,
                        lastNameFa: val,
                        username: generateUsername(prev.firstNameEn || '', prev.lastNameEn || '')
                      }));
                    }}
                    placeholder="مثال: واحدی"
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:border-indigo-600 focus:bg-white font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-800 font-bold block mb-1">First Name (English):</label>
                  <input
                    type="text"
                    value={userFormData.firstNameEn || ''}
                    onChange={(e) => {
                      const val = e.target.value;
                      setUserFormData((prev) => {
                        const newEnFirst = val;
                        const autoName = generateUsername(newEnFirst, prev.lastNameEn || '');
                        return {
                          ...prev,
                          firstNameEn: newEnFirst,
                          username: autoName
                        };
                      });
                    }}
                    placeholder="e.g. Mohsen"
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:border-indigo-600 focus:bg-white font-mono dir-ltr text-left font-bold"
                  />
                </div>
                <div>
                  <label className="text-slate-800 font-bold block mb-1">Last Name (English):</label>
                  <input
                    type="text"
                    value={userFormData.lastNameEn || ''}
                    onChange={(e) => {
                      const val = e.target.value;
                      setUserFormData((prev) => {
                        const newEnLast = val;
                        const autoName = generateUsername(prev.firstNameEn || '', newEnLast);
                        return {
                          ...prev,
                          lastNameEn: newEnLast,
                          username: autoName
                        };
                      });
                    }}
                    placeholder="e.g. Vahedi"
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:border-indigo-600 focus:bg-white font-mono dir-ltr text-left font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-800 font-bold block mb-1">نام کاربری (محاسبه خودکار): *</label>
                  <input
                    type="text"
                    required
                    value={userFormData.username || ''}
                    onChange={(e) => setUserFormData({ ...userFormData, username: e.target.value })}
                    placeholder="e.g. m.vahedi"
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-indigo-900 font-black focus:outline-none focus:border-indigo-600 focus:bg-white font-mono dir-ltr text-left"
                  />
                </div>
                <div>
                  <label className="text-slate-800 font-bold block mb-1">کد ملی (رمز عبور پیش‌فرض): *</label>
                  <input
                    type="text"
                    required
                    maxLength={10}
                    value={userFormData.nationalId || ''}
                    onChange={(e) => setUserFormData({ ...userFormData, nationalId: e.target.value })}
                    placeholder="کد ملی ۱۰ رقمی"
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:border-indigo-600 focus:bg-white font-mono dir-ltr text-left font-bold"
                  />
                </div>
              </div>

              {/* Default Password Notice */}
              <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-[11px] flex items-center gap-2 font-bold">
                <AlertCircle className="w-4 h-4 shrink-0 text-amber-700" />
                <span>
                  مطابق دستورالعمل: <strong>کد ملی کاربر به عنوان رمز عبور اولیه پیش‌فرض</strong> تنظیم می‌گردد و پس از اولین ورود قابل تغییر است.
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-800 font-bold block mb-1">دپارتمان / واحد سازمانی:</label>
                  <select
                    value={userFormData.department || ''}
                    onChange={(e) => setUserFormData({ ...userFormData, department: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-bold focus:outline-none focus:border-indigo-600 focus:bg-white"
                  >
                    <option value="مدیر پروژه (آقای واحدی)">مدیریت ارشد سازمانی</option>
                    <option value="واحد تولید و کوره">واحد تولید و کوره</option>
                    <option value="واحد کنترل کیفیت (QC)">واحد کنترل کیفیت (QC)</option>
                    <option value="واحد مالی و امور مالیاتی">واحد مالی و امور مالیاتی</option>
                    <option value="واحد بازرگانی و باسکول">واحد بازرگانی و باسکول</option>
                    <option value="واحد اتوماسیون اداری">واحد اتوماسیون اداری</option>
                  </select>
                </div>
                <div>
                  <label className="text-slate-800 font-bold block mb-1">عنوان شغلی / سمت:</label>
                  <input
                    type="text"
                    value={userFormData.position || ''}
                    onChange={(e) => setUserFormData({ ...userFormData, position: e.target.value })}
                    placeholder="مثال: کارشناس ارشد حسابداری"
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-bold focus:outline-none focus:border-indigo-600 focus:bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-800 font-bold block mb-1">سطح تاییدات چارت (۱ تا ۵):</label>
                  <select
                    value={userFormData.approvalLevel || 1}
                    onChange={(e) => setUserFormData({ ...userFormData, approvalLevel: parseInt(e.target.value) || 1 })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-emerald-800 font-black focus:outline-none focus:border-indigo-600 focus:bg-white"
                  >
                    <option value={1}>سطح ۱: کارشناس (تا ۱۰۰ میلیون ریال)</option>
                    <option value={2}>سطح ۲: سرپرست (تا ۱ میلیارد ریال)</option>
                    <option value={3}>سطح ۳: مدیر واحد (تا ۱۰ میلیارد ریال)</option>
                    <option value={4}>سطح ۴: مدیر ارشد (تا ۱۰۰ میلیارد ریال)</option>
                    <option value={5}>سطح ۵: مدیرعامل / هیئت مدیره (نامحدود)</option>
                  </select>
                </div>

                <div>
                  <label className="text-slate-800 font-bold block mb-1">گروه کاربری سفارشی:</label>
                  <select
                    value={userFormData.roleGroupId || ''}
                    onChange={(e) => {
                      const selectedRole = roleGroups.find((r) => r.id === e.target.value);
                      setUserFormData({
                        ...userFormData,
                        roleGroupId: e.target.value,
                        roleGroupName: selectedRole ? selectedRole.roleNameFa : ''
                      });
                    }}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-bold focus:outline-none focus:border-indigo-600 focus:bg-white"
                  >
                    {roleGroups.map((rg) => (
                      <option key={rg.id} value={rg.id}>
                        {rg.roleNameFa}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-slate-800 font-bold block mb-1">متن وضعیت کاربر (Status):</label>
                <input
                  type="text"
                  value={userFormData.statusText || ''}
                  onChange={(e) => setUserFormData({ ...userFormData, statusText: e.target.value })}
                  placeholder="مثال: فعال در واحد مالی کارخانه"
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-bold focus:outline-none focus:border-indigo-600 focus:bg-white"
                />
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-xl bg-[#0f2b5c] hover:bg-[#1a3f7a] text-white font-extrabold transition-all shadow-sm"
                >
                  ذخیره اطلاعات کاربر
                </button>
                <button
                  type="button"
                  onClick={() => setIsUserModalOpen(false)}
                  className="px-5 py-3 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 font-bold"
                >
                  انصراف
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: RESET PASSWORD */}
      {isPasswordModalOpen && passwordTargetUser && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4 dir-rtl">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl text-slate-900">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
                <Key className="w-4 h-4 text-indigo-700" />
                <span>تغییر کلمه عبور کاربر</span>
              </h3>
              <button
                onClick={() => setIsPasswordModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-800 hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-700 font-medium">
              کاربر: <strong>{passwordTargetUser.firstNameFa} {passwordTargetUser.lastNameFa}</strong> (@{passwordTargetUser.username})
            </p>

            <div className="space-y-2 text-xs">
              <label className="text-slate-700 font-bold block">کلمه عبور جدید:</label>
              <input
                type="text"
                value={newPasswordValue}
                onChange={(e) => setNewPasswordValue(e.target.value)}
                placeholder="کلمه عبور جدید"
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-mono dir-ltr text-left font-bold focus:outline-none focus:border-indigo-600 focus:bg-white"
              />
              <p className="text-[10px] text-slate-500 font-bold">
                پیش‌فرض سیستم: کد ملی کاربر ({passwordTargetUser.nationalId})
              </p>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={handleResetPassword}
                className="flex-1 py-2.5 rounded-xl bg-[#0f2b5c] hover:bg-[#1a3f7a] text-white font-extrabold text-xs shadow-sm"
              >
                اعمال کلمه عبور جدید
              </button>
              <button
                onClick={() => setIsPasswordModalOpen(false)}
                className="px-4 py-2.5 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 text-xs font-bold"
              >
                انصراف
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
