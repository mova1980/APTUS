import React, { useState } from 'react';
import { ServerDbItem, RefTableItem, TransactionFlowStream, DbEngineType } from '../../types';
import {
  SYSTEM_SUBSYSTEMS_LIST,
  INITIAL_SERVERS,
  INITIAL_REF_TABLES,
  INITIAL_FLOW_STREAMS
} from '../../data/mockDbData';
import {
  Database,
  RefreshCw,
  CheckCircle2,
  HardDrive,
  ShieldCheck,
  Server,
  Plus,
  Table,
  Square,
  Activity,
  Sliders,
  Sparkles,
  Bot,
  Search,
  Key,
  Layers,
  ArrowRightLeft,
  Edit3,
  Globe,
  Radio,
  X,
  Zap,
  Eye,
  Lock,
  User,
  Check
} from 'lucide-react';

export const DbSettingsView: React.FC = () => {
  // Navigation tab state
  const [activeTab, setActiveTab] = useState<'SERVERS' | 'EXPLORER' | 'MATRIX' | 'FIELDS' | 'DATAHUB'>('SERVERS');

  // Core Data State
  const [servers, setServers] = useState<ServerDbItem[]>(INITIAL_SERVERS);
  const [tables, setTables] = useState<RefTableItem[]>(INITIAL_REF_TABLES);
  const [streams, setStreams] = useState<TransactionFlowStream[]>(INITIAL_FLOW_STREAMS);

  // Filter & Search State
  const [searchQuery, setSearchQuery] = useState('');
  const [filterServerId, setFilterServerId] = useState<string>('ALL');
  const [filterObjectType, setFilterObjectType] = useState<'ALL' | 'TABLE' | 'VIEW'>('ALL');

  // Field Inspector State
  const [selectedTableForFields, setSelectedTableForFields] = useState<RefTableItem | null>(INITIAL_REF_TABLES[0]);

  // Explorer State
  const [explorerServerId, setExplorerServerId] = useState<string>(INITIAL_SERVERS[0].id);
  const [explorerDbName, setExplorerDbName] = useState<string>(INITIAL_SERVERS[0].databases[0]);

  // Logs & Notifications
  const [syncingAll, setSyncingAll] = useState(false);
  const [globalLog, setGlobalLog] = useState<{ type: 'success' | 'error' | 'info'; message: string } | null>(null);

  // Server Modal State (Add or Edit)
  const [showServerModal, setShowServerModal] = useState(false);
  const [editingServerId, setEditingServerId] = useState<string | null>(null);
  const [serverForm, setServerForm] = useState({
    serverName: '',
    ipHost: '',
    port: 1433,
    dbType: 'SQL Server 2022' as DbEngineType,
    username: 'sa_aptus_admin',
    password: '',
    initialDbName: 'Aptus_New_DB',
    description: ''
  });

  // Database Modal State (Add DB to Server)
  const [showAddDbModal, setShowAddDbModal] = useState<string | null>(null); // serverId
  const [newDbNameInput, setNewDbNameInput] = useState('');

  // Live Testing Status per Server
  const [testingServerId, setTestingServerId] = useState<string | null>(null);

  // AI Database Architect Query State
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [aiAnalysisResult, setAiAnalysisResult] = useState<string | null>(null);

  // 1. Open Add/Edit Server Modal
  const handleOpenAddServer = () => {
    setEditingServerId(null);
    setServerForm({
      serverName: '',
      ipHost: '192.168.1.100',
      port: 1433,
      dbType: 'SQL Server 2022',
      username: 'sa_admin',
      password: '',
      initialDbName: 'Aptus_New_DB',
      description: 'سرور جدید جهت اتصال به دیتابیس متمرکز شرکت آپتوس'
    });
    setShowServerModal(true);
  };

  const handleOpenEditServer = (srv: ServerDbItem) => {
    setEditingServerId(srv.id);
    setServerForm({
      serverName: srv.serverName,
      ipHost: srv.ipHost,
      port: srv.port,
      dbType: srv.dbType,
      username: srv.username,
      password: srv.password || '',
      initialDbName: srv.databases[0] || 'Aptus_DB',
      description: srv.description
    });
    setShowServerModal(true);
  };

  // 2. Save Server Form (Create or Update)
  const handleSaveServerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!serverForm.serverName || !serverForm.ipHost) {
      setGlobalLog({ type: 'error', message: 'لطفا نام سرور و آدرس IP/Host را وارد نمایید.' });
      return;
    }

    if (editingServerId) {
      // Update existing server
      setServers(prev => prev.map(s => {
        if (s.id === editingServerId) {
          const updatedDbs = s.databases.includes(serverForm.initialDbName)
            ? s.databases
            : [...s.databases, serverForm.initialDbName];
          return {
            ...s,
            serverName: serverForm.serverName,
            ipHost: serverForm.ipHost,
            port: Number(serverForm.port),
            dbType: serverForm.dbType,
            username: serverForm.username,
            password: serverForm.password,
            databases: updatedDbs,
            description: serverForm.description,
            status: 'CONNECTED',
            lastPing: 'هم‌اکنون'
          };
        }
        return s;
      }));
      setGlobalLog({ type: 'success', message: `مشخصات سرور ${serverForm.serverName} و اطلاعات احراز هویت با موفقیت به‌روزرسانی شد.` });
    } else {
      // Create new server
      const newSrv: ServerDbItem = {
        id: `SRV-0${servers.length + 1}`,
        serverName: serverForm.serverName,
        ipHost: serverForm.ipHost,
        port: Number(serverForm.port),
        dbType: serverForm.dbType,
        username: serverForm.username,
        password: serverForm.password,
        databases: [serverForm.initialDbName || 'Aptus_New_DB'],
        status: 'CONNECTED',
        latencyMs: Math.floor(Math.random() * 15) + 8,
        lastPing: 'هم‌اکنون',
        description: serverForm.description
      };
      setServers(prev => [newSrv, ...prev]);
      setGlobalLog({ type: 'success', message: `سرور مرجع جدید (${serverForm.serverName}) با موفقیت به سیستم اضافه گردید.` });
    }

    setShowServerModal(false);
  };

  // 3. Test Connection for a Specific Server
  const handleTestServerConnection = async (serverId: string) => {
    setTestingServerId(serverId);
    const targetSrv = servers.find(s => s.id === serverId);

    try {
      const res = await fetch('/api/db/test-connection', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          host: targetSrv?.ipHost,
          port: targetSrv?.port,
          database: targetSrv?.databases[0],
          user: targetSrv?.username,
          password: targetSrv?.password,
          dbType: targetSrv?.dbType
        })
      });
      const data = await res.json();
      if (data.success) {
        setServers(prev => prev.map(s => s.id === serverId ? {
          ...s,
          status: 'CONNECTED',
          latencyMs: data.latencyMs,
          lastPing: 'هم‌اکنون'
        } : s));
        setGlobalLog({
          type: 'success',
          message: `اتصال و احراز هویت با سرور ${targetSrv?.serverName} موفقیت‌آمیز بود (تاخیر شبکه: ${data.latencyMs}ms)`
        });
      }
    } catch {
      setServers(prev => prev.map(s => s.id === serverId ? {
        ...s,
        status: 'DISCONNECTED',
        lastPing: 'خطا در هَندشِیک'
      } : s));
      setGlobalLog({ type: 'error', message: `خطا در اتصال به سرور ${targetSrv?.serverName}. لطفاً نام کاربری و کلمه عبور را بررسی فرمایید.` });
    } finally {
      setTestingServerId(null);
    }
  };

  // 4. Add Database to Server
  const handleAddDatabaseToServer = (serverId: string) => {
    if (!newDbNameInput.trim()) return;
    const dbNameClean = newDbNameInput.trim();
    setServers(prev => prev.map(s => {
      if (s.id === serverId) {
        if (s.databases.includes(dbNameClean)) return s;
        return {
          ...s,
          databases: [...s.databases, dbNameClean]
        };
      }
      return s;
    }));
    setGlobalLog({ type: 'success', message: `دیتابیس جدید (${dbNameClean}) به لیست دیتابیس‌های سرور اضافه شد.` });
    setNewDbNameInput('');
    setShowAddDbModal(null);
  };

  // 5. Toggle Matrix Mapping 1-to-N
  const handleToggleMatrixMapping = async (tableId: string, subsystemId: string) => {
    const currentTable = tables.find(t => t.id === tableId);
    if (!currentTable) return;

    const isCurrentlyMapped = !!currentTable.mappedSubsystems[subsystemId];
    const newMapped = !isCurrentlyMapped;

    setTables(prev => prev.map(t => {
      if (t.id === tableId) {
        return {
          ...t,
          mappedSubsystems: {
            ...t.mappedSubsystems,
            [subsystemId]: newMapped
          }
        };
      }
      return t;
    }));

    try {
      await fetch('/api/db/matrix/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tableId, subsystemId, isMapped: newMapped })
      });
    } catch {
      // ignore
    }
  };

  // 6. Toggle Field AI Indexing
  const handleToggleFieldAiIndex = (tableName: string, fieldName: string) => {
    setTables(prev => prev.map(t => {
      if (t.tableName === tableName) {
        const updatedFields = t.fields.map(f => {
          if (f.fieldName === fieldName) {
            return { ...f, isAiIndexed: !f.isAiIndexed };
          }
          return f;
        });
        const updatedTable = { ...t, fields: updatedFields };
        if (selectedTableForFields?.id === t.id) {
          setSelectedTableForFields(updatedTable);
        }
        return updatedTable;
      }
      return t;
    }));
  };

  // 7. Update Field Persian Label
  const handleUpdateFieldLabelFa = (tableName: string, fieldName: string, newLabelFa: string) => {
    setTables(prev => prev.map(t => {
      if (t.tableName === tableName) {
        const updatedFields = t.fields.map(f => {
          if (f.fieldName === fieldName) {
            return { ...f, fieldLabelFa: newLabelFa };
          }
          return f;
        });
        const updatedTable = { ...t, fields: updatedFields };
        if (selectedTableForFields?.id === t.id) {
          setSelectedTableForFields(updatedTable);
        }
        return updatedTable;
      }
      return t;
    }));
  };

  // 8. Execute Sync Flow Stream
  const handleExecuteStream = async (flowId: string, streamTitle: string) => {
    try {
      const res = await fetch('/api/db/pipeline/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ flowId, streamTitle })
      });
      const data = await res.json();
      if (data.success) {
        setStreams(prev => prev.map(s => s.id === flowId ? {
          ...s,
          recordsProcessedToday: s.recordsProcessedToday + data.recordsProcessed,
          lastExecution: 'هم‌اکنون',
          status: 'ACTIVE'
        } : s));
        setGlobalLog({
          type: 'success',
          message: `خط لوله ${streamTitle} با موفقیت اجرا گردید (${data.recordsProcessed} رکورد در دیتابیس متمرکز بروزرسانی شد)`
        });
      }
    } catch {
      // ignore
    }
  };

  // 9. Sync All Central DataHub
  const handleSyncAllDataHub = async () => {
    setSyncingAll(true);
    setGlobalLog(null);

    try {
      const res = await fetch('/api/db/sync-legacy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sourceDb: 'Aptus_MultiServer_Cluster',
          targetRefDb: 'Aptus_Central_DataHub'
        })
      });
      const data = await res.json();
      if (data.success) {
        setGlobalLog({
          type: 'success',
          message: `ارتباط همگام‌سازی زنده برقرار شد • ${data.transferredRecords.toLocaleString('fa-IR')} رکورد جدید در دیتابیس متمرکز Aptus_Central_DataHub ذخیره و همگام گردید.`
        });
        setStreams(prev => prev.map(s => ({
          ...s,
          recordsProcessedToday: s.recordsProcessedToday + Math.floor(Math.random() * 120) + 50,
          lastExecution: 'هم‌اکنون',
          status: 'ACTIVE'
        })));
      }
    } catch {
      setGlobalLog({ type: 'error', message: 'خطا در همگام‌سازی متمرکز دیتابیس‌ها.' });
    } finally {
      setSyncingAll(false);
    }
  };

  // 10. AI DB Architecture Analysis
  const handleRunAiDbAnalysis = async (customPrompt?: string) => {
    const promptToUse = customPrompt || aiPrompt;
    if (!promptToUse.trim() || aiLoading) return;

    setAiLoading(true);
    setAiAnalysisResult(null);

    try {
      const res = await fetch('/api/db/ai-analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: promptToUse,
          serverCount: servers.length,
          tableCount: tables.length,
          mappedCount: tables.reduce((acc, t) => acc + Object.values(t.mappedSubsystems).filter(Boolean).length, 0)
        })
      });
      const data = await res.json();
      if (data.success) {
        setAiAnalysisResult(data.analysis);
      }
    } catch {
      setAiAnalysisResult('خطا در ارتباط با دستیار هوش مصنوعی دیتابیس.');
    } finally {
      setAiLoading(false);
    }
  };

  // Add new object from Explorer
  const handleImportObjectFromExplorer = (tableName: string, objectType: 'TABLE' | 'VIEW', labelFa: string) => {
    const activeSrv = servers.find(s => s.id === explorerServerId);
    if (!activeSrv) return;

    const exists = tables.some(t => t.tableName === tableName && t.serverId === explorerServerId);
    if (exists) {
      setGlobalLog({ type: 'info', message: `شیء ${tableName} قبلا به لیست جداول مرجع اضافه شده است.` });
      return;
    }

    const newObj: RefTableItem = {
      id: `TBL-0${tables.length + 1}`,
      serverId: activeSrv.id,
      serverName: activeSrv.serverName,
      dbName: explorerDbName,
      tableName: tableName,
      tableLabelFa: labelFa,
      objectType: objectType,
      recordCount: Math.floor(Math.random() * 50000) + 1200,
      primaryKey: `${tableName.slice(0, 5)}_ID`,
      lastSync: 'هم‌اکنون',
      syncStatus: 'SYNCHRONIZED',
      fields: [
        { fieldName: `${tableName.slice(0, 5)}_ID`, fieldLabelFa: 'شناسه اصلی', dataType: 'BIGINT', isPrimaryKey: true, isAiIndexed: true },
        { fieldName: 'Title_Fa', fieldLabelFa: 'عنوان/شرح', dataType: 'VARCHAR', isAiIndexed: true },
        { fieldName: 'Created_At', fieldLabelFa: 'تاریخ ثبت', dataType: 'DATETIME', isAiIndexed: true },
        { fieldName: 'Amount_IRR', fieldLabelFa: 'مبلغ/ارزش (ریال)', dataType: 'DECIMAL', isAiIndexed: true }
      ],
      mappedSubsystems: { 'FINANCIAL': true, 'CENTRAL_AI': true },
      sampleData: [
        { Title_Fa: 'نمونه ثبت شده ۱', Created_At: '1405/05/01', Amount_IRR: 120000000 },
        { Title_Fa: 'نمونه ثبت شده ۲', Created_At: '1405/05/02', Amount_IRR: 850000000 }
      ]
    };

    setTables(prev => [...prev, newObj]);
    setGlobalLog({ type: 'success', message: `${objectType === 'VIEW' ? 'ویو' : 'جدول'} ${tableName} با موفقیت به دیتابیس مقصد متصل گردید.` });
  };

  // Stats calculation
  const totalDatabasesCount = servers.reduce((acc, s) => acc + s.databases.length, 0);
  const totalActiveMappingsCount = tables.reduce((acc, t) => acc + Object.values(t.mappedSubsystems).filter(Boolean).length, 0);

  // Filtered tables list
  const filteredTables = tables.filter(t => {
    const matchServer = filterServerId === 'ALL' || t.serverId === filterServerId;
    const matchType = filterObjectType === 'ALL' || t.objectType === filterObjectType;
    const matchQuery = !searchQuery.trim() ||
      t.tableName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.tableLabelFa.includes(searchQuery) ||
      t.dbName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchServer && matchType && matchQuery;
  });

  const selectedExplorerServer = servers.find(s => s.id === explorerServerId) || servers[0];

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 font-sans w-full text-right dir-rtl">
      {/* Light Theme Executive Header Banner matching ReportsView / System Style */}
      <div className="p-5 sm:p-6 rounded-3xl bg-white border border-slate-200/80 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-[#0f2b5c] text-white font-black flex items-center justify-center shrink-0 shadow-md">
            <Database className="w-7 h-7 sm:w-8 sm:h-8 text-amber-400" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                پیکربندی سرورهای دیتابیس مرجع، جداول/ویوها & اتصالات
              </h2>
              <span className="text-xs bg-amber-50 text-amber-800 font-bold px-3 py-1 rounded-full border border-amber-200/80 font-mono">
                Aptus_Central_DataHub Connected
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1 font-medium leading-relaxed">
              اتصال پویا به سرورهای مختلف (SQL Server, PostgreSQL, Oracle)، انتخاب دیتابیس، کاوش جداول و ویوها، نگاشت ماتریسی ۱ به چند و تحلیل هوش مصنوعی
            </p>
          </div>
        </div>

        {/* Global Summary Metrics Badges & Action */}
        <div className="flex items-center gap-3 shrink-0 flex-wrap">
          <div className="px-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-mono font-bold flex items-center gap-3 text-slate-700 shadow-sm">
            <div>
              <span className="text-slate-500">سرورها: </span>
              <span className="text-indigo-900 font-extrabold">{servers.length} سرور</span>
            </div>
            <div className="w-px h-4 bg-slate-200"></div>
            <div>
              <span className="text-slate-500">دیتابیس‌ها: </span>
              <span className="text-indigo-900 font-extrabold">{totalDatabasesCount} DB</span>
            </div>
            <div className="w-px h-4 bg-slate-200"></div>
            <div>
              <span className="text-slate-500">جداول/ویوها: </span>
              <span className="text-indigo-900 font-extrabold">{tables.length} شیء</span>
            </div>
            <div className="w-px h-4 bg-slate-200"></div>
            <div>
              <span className="text-slate-500">نگاشت‌ها: </span>
              <span className="text-emerald-700 font-extrabold">{totalActiveMappingsCount} لینک</span>
            </div>
          </div>

          <button
            onClick={handleSyncAllDataHub}
            disabled={syncingAll}
            className="px-5 py-3 rounded-2xl bg-[#0f2b5c] hover:bg-[#1a3f7a] text-white font-extrabold text-xs flex items-center gap-2 shadow-sm transition-all"
          >
            {syncingAll ? <RefreshCw className="w-4 h-4 animate-spin" /> : <ArrowRightLeft className="w-4 h-4 text-amber-400" />}
            <span>همگام‌سازی زنده کلیه جریان‌ها در DataHub</span>
          </button>
        </div>
      </div>

      {/* Global Toast Notification */}
      {globalLog && (
        <div
          className={`p-4 rounded-2xl border text-xs font-bold flex items-center justify-between gap-3 shadow-md ${
            globalLog.type === 'success'
              ? 'bg-emerald-50 text-emerald-900 border-emerald-200'
              : globalLog.type === 'error'
              ? 'bg-rose-50 text-rose-900 border-rose-200'
              : 'bg-indigo-50 text-indigo-900 border-indigo-200'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-5 h-5 shrink-0 text-amber-600" />
            <span className="leading-relaxed">{globalLog.message}</span>
          </div>
          <button onClick={() => setGlobalLog(null)} className="p-1 text-slate-500 hover:text-slate-800">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* High-Contrast Scrollable Tab Navigation Menu */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-200 scrollbar-thin">
        <button
          onClick={() => setActiveTab('SERVERS')}
          className={`px-4 py-3 rounded-xl text-xs font-black transition-all flex items-center gap-2 whitespace-nowrap border ${
            activeTab === 'SERVERS'
              ? 'bg-[#0f2b5c] text-white border-[#0f2b5c] shadow-sm'
              : 'bg-white text-slate-700 hover:bg-slate-50 hover:text-slate-900 border-slate-200 font-bold'
          }`}
        >
          <Server className="w-4 h-4" />
          <span>۱. پیکربندی سرورها و احراز هویت SQL ({servers.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('EXPLORER')}
          className={`px-4 py-3 rounded-xl text-xs font-black transition-all flex items-center gap-2 whitespace-nowrap border ${
            activeTab === 'EXPLORER'
              ? 'bg-[#0f2b5c] text-white border-[#0f2b5c] shadow-sm'
              : 'bg-white text-slate-700 hover:bg-slate-50 hover:text-slate-900 border-slate-200 font-bold'
          }`}
        >
          <Search className="w-4 h-4" />
          <span>۲. کاوشگر دیتابیس‌ها، جداول و ویوها (Database Explorer)</span>
        </button>

        <button
          onClick={() => setActiveTab('MATRIX')}
          className={`px-4 py-3 rounded-xl text-xs font-black transition-all flex items-center gap-2 whitespace-nowrap border ${
            activeTab === 'MATRIX'
              ? 'bg-[#0f2b5c] text-white border-[#0f2b5c] shadow-sm'
              : 'bg-white text-slate-700 hover:bg-slate-50 hover:text-slate-900 border-slate-200 font-bold'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>۳. ماتریس نگاشت ۱ به چند به زیرسیستم‌ها ({tables.length} شیء)</span>
        </button>

        <button
          onClick={() => setActiveTab('FIELDS')}
          className={`px-4 py-3 rounded-xl text-xs font-black transition-all flex items-center gap-2 whitespace-nowrap border ${
            activeTab === 'FIELDS'
              ? 'bg-[#0f2b5c] text-white border-[#0f2b5c] shadow-sm'
              : 'bg-white text-slate-700 hover:bg-slate-50 hover:text-slate-900 border-slate-200 font-bold'
          }`}
        >
          <Sliders className="w-4 h-4" />
          <span>۴. تنظیمات فیلد به فیلد & پیش‌نمایش اطلاعات مقصد</span>
        </button>

        <button
          onClick={() => setActiveTab('DATAHUB')}
          className={`px-4 py-3 rounded-xl text-xs font-black transition-all flex items-center gap-2 whitespace-nowrap border ${
            activeTab === 'DATAHUB'
              ? 'bg-[#0f2b5c] text-white border-[#0f2b5c] shadow-sm'
              : 'bg-white text-slate-700 hover:bg-slate-50 hover:text-slate-900 border-slate-200 font-bold'
          }`}
        >
          <Activity className="w-4 h-4" />
          <span>۵. جریان خط لوله & تحلیل هوش مصنوعی</span>
        </button>
      </div>

      {/* ==================== TAB 1: SERVER CONFIGURATION & AUTHENTICATION ==================== */}
      {activeTab === 'SERVERS' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between gap-4 flex-wrap bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <div>
              <h3 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
                <Server className="w-5 h-5 text-indigo-700" />
                <span>سرورهای دیتابیس مرجع و مشخصات اتصال SQL</span>
              </h3>
              <p className="text-xs text-slate-500 mt-1 font-medium">
                تعریف یا ویرایش سرورهای متصل (SQL Server, PostgreSQL, Oracle)، نام کاربری و کلمه عبور و تست زنده هَندشِیک دیتابیس
              </p>
            </div>

            <button
              onClick={handleOpenAddServer}
              className="px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs flex items-center gap-2 shadow-sm transition-all shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>تعریف سرور دیتابیس جدید</span>
            </button>
          </div>

          {/* Servers Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {servers.map((srv) => {
              const isTesting = testingServerId === srv.id;
              return (
                <div
                  key={srv.id}
                  className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-6 shadow-sm space-y-4 relative overflow-hidden"
                >
                  <div className="flex items-start justify-between gap-3 border-b border-slate-100 pb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-slate-100 border border-slate-200 text-[#0f2b5c] font-mono font-black text-sm flex items-center justify-center shrink-0 shadow-inner">
                        {srv.dbType.includes('PostgreSQL') ? 'PG' : srv.dbType.includes('Oracle') ? 'ORA' : 'SQL'}
                      </div>
                      <div>
                        <h4 className="text-base font-black text-slate-900">{srv.serverName}</h4>
                        <div className="flex items-center gap-2 text-xs font-mono font-bold text-slate-600 mt-1 flex-wrap">
                          <Globe className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                          <span>{srv.ipHost}:{srv.port}</span>
                          <span className="text-slate-300">•</span>
                          <span className="text-slate-500 font-sans">{srv.dbType}</span>
                        </div>
                      </div>
                    </div>

                    <span
                      className={`text-xs px-3 py-1 rounded-full font-black border flex items-center gap-1.5 shrink-0 ${
                        srv.status === 'CONNECTED'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : 'bg-rose-50 text-rose-700 border-rose-200'
                      }`}
                    >
                      <Radio className="w-3.5 h-3.5 animate-pulse" />
                      <span>{srv.status === 'CONNECTED' ? `متصل (${srv.latencyMs}ms)` : 'قطع ارتباط'}</span>
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 font-medium leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
                    {srv.description}
                  </p>

                  {/* Auth Credentials Overview */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-slate-50 p-3 rounded-xl border border-slate-200">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-indigo-600 shrink-0" />
                      <span className="text-slate-500">نام کاربر SQL:</span>
                      <span className="font-mono font-bold text-slate-800">{srv.username}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Lock className="w-4 h-4 text-rose-500 shrink-0" />
                      <span className="text-slate-500">کلمه عبور:</span>
                      <span className="font-mono text-slate-700">{srv.password ? '••••••••' : 'رمز عبور ذخیره شده'}</span>
                    </div>
                  </div>

                  {/* Databases List on this Server */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-extrabold flex items-center gap-1.5 text-slate-800">
                        <HardDrive className="w-4 h-4 text-indigo-600" />
                        <span>دیتابیس‌های پیکربندی‌شده روی این سرور:</span>
                      </span>
                      <button
                        onClick={() => setShowAddDbModal(srv.id)}
                        className="text-xs text-[#0f2b5c] hover:text-indigo-800 flex items-center gap-1 font-black bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200 transition-all"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>افزودن دیتابیس</span>
                      </button>
                    </div>

                    <div className="flex flex-wrap gap-2 pt-1">
                      {srv.databases.map((dbName, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1.5 rounded-xl bg-slate-100 border border-slate-200 text-slate-800 font-mono text-xs font-bold flex items-center gap-1.5 shadow-sm"
                        >
                          <Database className="w-3.5 h-3.5 text-indigo-600" />
                          <span>{dbName}</span>
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2 text-xs flex-wrap">
                    <div className="flex items-center gap-2 flex-wrap">
                      <button
                        onClick={() => handleOpenEditServer(srv)}
                        className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs flex items-center gap-1.5 border border-slate-200 transition-all"
                      >
                        <Edit3 className="w-3.5 h-3.5 text-indigo-600" />
                        <span>ویرایش سرور</span>
                      </button>

                      <button
                        onClick={() => {
                          setExplorerServerId(srv.id);
                          setExplorerDbName(srv.databases[0]);
                          setActiveTab('EXPLORER');
                        }}
                        className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-indigo-900 font-bold text-xs flex items-center gap-1.5 border border-slate-200 transition-all"
                      >
                        <Search className="w-3.5 h-3.5 text-indigo-600" />
                        <span>کاوش جداول/ویوها</span>
                      </button>
                    </div>

                    <button
                      onClick={() => handleTestServerConnection(srv.id)}
                      disabled={isTesting}
                      className="px-3.5 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-black text-xs flex items-center gap-1.5 transition-all border border-emerald-200 shadow-sm"
                    >
                      {isTesting ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />}
                      <span>تست پینگ و هَندشِیک</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ==================== TAB 2: DATABASE & OBJECT EXPLORER (Tables & Views) ==================== */}
      {activeTab === 'EXPLORER' && (
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-6 shadow-sm space-y-5">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
                  <Search className="w-5 h-5 text-indigo-700" />
                  <span>کاوشگر دیتابیس، جداول و ویوها (SQL Objects Explorer)</span>
                </h3>
                <p className="text-xs text-slate-500 mt-1 font-medium">
                  انتخاب سرور و دیتابیس مرجع، مشاهده جداول و ویوهای موجود و اتصال مستقیم آنها به برنامه
                </p>
              </div>

              {/* Selector Controls */}
              <div className="flex items-center gap-3 flex-wrap">
                <div className="flex items-center gap-2 bg-slate-50 p-2 rounded-xl border border-slate-200">
                  <Server className="w-4 h-4 text-indigo-600 shrink-0" />
                  <span className="text-xs font-bold text-slate-700">سرور:</span>
                  <select
                    value={explorerServerId}
                    onChange={(e) => {
                      setExplorerServerId(e.target.value);
                      const s = servers.find(srv => srv.id === e.target.value);
                      if (s && s.databases.length > 0) {
                        setExplorerDbName(s.databases[0]);
                      }
                    }}
                    className="bg-white text-slate-900 font-bold text-xs p-1.5 rounded-lg border border-slate-300 focus:outline-none focus:border-indigo-600"
                  >
                    {servers.map(s => (
                      <option key={s.id} value={s.id}>{s.serverName}</option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center gap-2 bg-slate-50 p-2 rounded-xl border border-slate-200">
                  <Database className="w-4 h-4 text-indigo-600 shrink-0" />
                  <span className="text-xs font-bold text-slate-700">دیتابیس:</span>
                  <select
                    value={explorerDbName}
                    onChange={(e) => setExplorerDbName(e.target.value)}
                    className="bg-white text-slate-900 font-bold text-xs p-1.5 rounded-lg border border-slate-300 focus:outline-none focus:border-indigo-600"
                  >
                    {selectedExplorerServer.databases.map((db, i) => (
                      <option key={i} value={db}>{db}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Object Type Tabs */}
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <div className="flex items-center gap-2 flex-wrap">
                <button
                  onClick={() => setFilterObjectType('ALL')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${
                    filterObjectType === 'ALL'
                      ? 'bg-[#0f2b5c] text-white border-[#0f2b5c] font-black'
                      : 'bg-slate-100 text-slate-700 border-slate-200 hover:text-slate-900'
                  }`}
                >
                  همه اشیاء ({tables.filter(t => t.serverId === explorerServerId).length})
                </button>
                <button
                  onClick={() => setFilterObjectType('TABLE')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${
                    filterObjectType === 'TABLE'
                      ? 'bg-[#0f2b5c] text-white border-[#0f2b5c] font-black'
                      : 'bg-slate-100 text-slate-700 border-slate-200 hover:text-slate-900'
                  }`}
                >
                  فقط جداول (Tables)
                </button>
                <button
                  onClick={() => setFilterObjectType('VIEW')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${
                    filterObjectType === 'VIEW'
                      ? 'bg-[#0f2b5c] text-white border-[#0f2b5c] font-black'
                      : 'bg-slate-100 text-slate-700 border-slate-200 hover:text-slate-900'
                  }`}
                >
                  فقط ویوها (Views)
                </button>
              </div>

              {/* Add New Table/View Manual import */}
              <button
                onClick={() => {
                  const name = prompt('نام جدول یا ویو جدید در SQL Server را وارد کنید (مثلا: Aptus_SCM_Inventory_Logs):');
                  if (name) {
                    const isVw = name.toLowerCase().startsWith('vw_');
                    handleImportObjectFromExplorer(name, isVw ? 'VIEW' : 'TABLE', `جدول/ویو سفارشی ${name}`);
                  }
                }}
                className="px-4 py-2 rounded-xl bg-indigo-700 hover:bg-indigo-800 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm"
              >
                <Plus className="w-4 h-4" />
                <span>وارد کردن جدول/ویو از SQL Server</span>
              </button>
            </div>

            {/* Explorer Data Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {tables
                .filter(t => t.serverId === explorerServerId && (filterObjectType === 'ALL' || t.objectType === filterObjectType))
                .map((t) => (
                  <div
                    key={t.id}
                    className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 hover:border-indigo-400 transition-all shadow-sm"
                  >
                    <div className="flex items-start justify-between gap-2 border-b border-slate-200 pb-2">
                      <div>
                        <div className="flex items-center gap-2 font-mono font-bold text-sm text-slate-900">
                          <Table className="w-4 h-4 text-indigo-600 shrink-0" />
                          <span>{t.tableName}</span>
                        </div>
                        <div className="text-xs text-indigo-900 font-bold mt-0.5">{t.tableLabelFa}</div>
                      </div>

                      <span
                        className={`text-[10px] px-2 py-0.5 rounded font-black font-mono border shrink-0 ${
                          t.objectType === 'VIEW'
                            ? 'bg-purple-100 text-purple-800 border-purple-200'
                            : 'bg-indigo-100 text-indigo-800 border-indigo-200'
                        }`}
                      >
                        {t.objectType}
                      </span>
                    </div>

                    <div className="space-y-1 text-xs text-slate-700">
                      <div className="flex justify-between">
                        <span className="text-slate-500">تعداد فیلدها:</span>
                        <span className="font-mono font-bold text-slate-900">{t.fields.length} فیلد</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">تعداد رکوردها:</span>
                        <span className="font-mono font-bold text-indigo-900">{t.recordCount.toLocaleString('fa-IR')}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">کلید اصلی (Primary Key):</span>
                        <span className="font-mono text-emerald-700 font-bold">{t.primaryKey}</span>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-200 flex items-center justify-between gap-2">
                      <button
                        onClick={() => {
                          setSelectedTableForFields(t);
                          setActiveTab('FIELDS');
                        }}
                        className="w-full py-2 rounded-xl bg-white hover:bg-slate-100 text-indigo-900 font-bold text-xs flex items-center justify-center gap-1 border border-slate-200 transition-all shadow-sm"
                      >
                        <Eye className="w-3.5 h-3.5 text-indigo-600" />
                        <span>بررسی فیلدها & پیش‌نمایش رکوردها</span>
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}

      {/* ==================== TAB 3: MATRIX MAPPING 1-TO-N ==================== */}
      {activeTab === 'MATRIX' && (
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <div>
              <h3 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
                <Layers className="w-5 h-5 text-indigo-700" />
                <span>ماتریس اتصال و نگاشت جداول و ویوها به زیرسیستم‌های ERP (انتخاب ۱ به چند)</span>
              </h3>
              <p className="text-xs text-slate-500 mt-1 font-medium">
                هر جدول یا ویوی مرجع می‌تواند به یک یا چند زیرسیستم شرکت ساختمانی آپتوس به صورت ۱ به چند متصل گردد.
              </p>
            </div>

            {/* Filter controls */}
            <div className="flex items-center gap-3 flex-wrap">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute right-3 top-2.5" />
                <input
                  type="text"
                  placeholder="جستجوی جدول یا دیتابیس..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-3 pr-9 py-2 rounded-xl bg-slate-50 border border-slate-300 text-xs text-slate-900 placeholder-slate-400 w-56 focus:outline-none focus:border-indigo-600 font-medium"
                />
              </div>

              <select
                value={filterServerId}
                onChange={(e) => setFilterServerId(e.target.value)}
                className="p-2 rounded-xl bg-slate-50 border border-slate-300 text-xs text-slate-900 font-bold focus:outline-none focus:border-indigo-600"
              >
                <option value="ALL">همه سرورها ({servers.length})</option>
                {servers.map(s => (
                  <option key={s.id} value={s.id}>{s.serverName}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Fully Responsive Scrollable Matrix Table */}
          <div className="bg-white border border-slate-200 rounded-3xl p-4 shadow-sm overflow-x-auto scrollbar-thin">
            <table className="w-full text-right text-xs min-w-[1000px]">
              <thead>
                <tr className="bg-slate-100 text-slate-900 font-black border-b-2 border-slate-200">
                  <th className="p-3.5 text-right min-w-[240px]">جدول مرجع / نوع / دیتابیس / سرور</th>
                  {SYSTEM_SUBSYSTEMS_LIST.map(sub => (
                    <th key={sub.id} className="p-3.5 text-center min-w-[120px]">
                      <div className="flex flex-col items-center">
                        <span className="text-slate-900 font-black">{sub.titleFa}</span>
                        <span className="text-[10px] text-slate-500 font-mono font-bold mt-0.5">{sub.id}</span>
                      </div>
                    </th>
                  ))}
                  <th className="p-3.5 text-center font-black min-w-[100px]">تعداد لینک</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-800">
                {filteredTables.map(tbl => {
                  const mappedCount = Object.values(tbl.mappedSubsystems).filter(Boolean).length;
                  return (
                    <tr key={tbl.id} className="hover:bg-slate-50 transition-all">
                      <td className="p-3.5">
                        <div className="flex items-center gap-2 font-mono font-black text-slate-900 text-sm">
                          <span>{tbl.tableName}</span>
                          <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono font-bold ${
                            tbl.objectType === 'VIEW' ? 'bg-purple-100 text-purple-800 border border-purple-200' : 'bg-indigo-100 text-indigo-800 border border-indigo-200'
                          }`}>
                            {tbl.objectType}
                          </span>
                        </div>
                        <div className="text-xs text-indigo-900 font-bold mt-1">{tbl.tableLabelFa}</div>
                        <div className="text-[11px] text-slate-500 font-mono mt-0.5">
                          {tbl.dbName} @ {tbl.serverName.split(' ')[0]} • ({tbl.recordCount.toLocaleString('fa-IR')} رکورد)
                        </div>
                      </td>

                      {SYSTEM_SUBSYSTEMS_LIST.map(sub => {
                        const isChecked = !!tbl.mappedSubsystems[sub.id];
                        return (
                          <td key={sub.id} className="p-3.5 text-center">
                            <button
                              onClick={() => handleToggleMatrixMapping(tbl.id, sub.id)}
                              className={`w-9 h-9 rounded-xl flex items-center justify-center mx-auto transition-all ${
                                isChecked
                                  ? 'bg-[#0f2b5c] text-white font-black border border-[#0f2b5c] shadow-sm hover:scale-105'
                                  : 'bg-slate-100 text-slate-400 border border-slate-200 hover:border-indigo-600 hover:text-slate-700'
                              }`}
                              title={`${tbl.tableName} -> ${sub.titleFa}`}
                            >
                              {isChecked ? <Check className="w-5 h-5 stroke-[3]" /> : <Square className="w-4 h-4" />}
                            </button>
                          </td>
                        );
                      })}

                      <td className="p-3.5 text-center font-mono font-black">
                        <span className="px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-indigo-900 text-xs">
                          {mappedCount} زیرسیستم
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ==================== TAB 4: FIELD-BY-FIELD INSPECTOR & DESTINATION DATA PREVIEW ==================== */}
      {activeTab === 'FIELDS' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Table Selector List */}
          <div className="lg:col-span-4 bg-white border border-slate-200 rounded-3xl p-5 shadow-sm space-y-4">
            <h3 className="text-base font-black text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
              <Table className="w-4 h-4 text-indigo-700" />
              <span>انتخاب شیء مرجع</span>
            </h3>

            <div className="space-y-2 max-h-[550px] overflow-y-auto pr-1 scrollbar-thin">
              {tables.map(tbl => {
                const isSelected = selectedTableForFields?.id === tbl.id;
                return (
                  <button
                    key={tbl.id}
                    onClick={() => setSelectedTableForFields(tbl)}
                    className={`w-full p-3 rounded-2xl text-right transition-all border flex items-center justify-between ${
                      isSelected
                        ? 'bg-indigo-50 border-indigo-300 text-indigo-950 font-black shadow-sm'
                        : 'bg-slate-50 border-slate-200 text-slate-800 hover:bg-slate-100'
                    }`}
                  >
                    <div>
                      <div className="font-mono text-xs font-bold text-slate-900">{tbl.tableName}</div>
                      <div className="text-[11px] text-slate-600 mt-0.5">{tbl.tableLabelFa}</div>
                    </div>

                    <span className="text-[10px] px-2 py-0.5 rounded font-mono font-bold bg-white border border-slate-200 text-slate-700">
                      {tbl.fields.length} فیلد
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Inspector & Data Preview */}
          <div className="lg:col-span-8 space-y-6">
            {selectedTableForFields ? (
              <>
                {/* Fields Table */}
                <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3 flex-wrap gap-2">
                    <div>
                      <h4 className="text-base font-black text-slate-900 flex items-center gap-2">
                        <Sliders className="w-4 h-4 text-indigo-700" />
                        <span>فیلدهای جدول {selectedTableForFields.tableName} ({selectedTableForFields.tableLabelFa})</span>
                      </h4>
                      <p className="text-xs text-slate-500 mt-0.5">پیکربندی برچسب‌های فارسی، کلید اصلی و فیلدهای شاخص‌گذاری شده توسط هوش مصنوعی</p>
                    </div>

                    <span className="text-xs font-mono font-bold px-3 py-1 bg-slate-100 border border-slate-200 text-slate-800 rounded-full">
                      {selectedTableForFields.dbName}
                    </span>
                  </div>

                  <div className="space-y-3">
                    {selectedTableForFields.fields.map((f, idx) => (
                      <div
                        key={idx}
                        className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                      >
                        <div className="flex items-center gap-3">
                          <span className="font-mono font-black text-indigo-900 text-sm">{f.fieldName}</span>
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-200 text-slate-800 font-bold">
                            {f.dataType}
                          </span>
                          {f.isPrimaryKey && (
                            <span className="text-[10px] px-2 py-0.5 rounded bg-amber-100 text-amber-800 font-bold border border-amber-200">
                              Primary Key
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-3 flex-wrap">
                          <input
                            type="text"
                            value={f.fieldLabelFa}
                            onChange={(e) => handleUpdateFieldLabelFa(selectedTableForFields.tableName, f.fieldName, e.target.value)}
                            className="px-3 py-1.5 rounded-xl bg-white border border-slate-300 text-slate-900 font-bold focus:outline-none focus:border-indigo-600 text-xs w-48"
                            placeholder="برچسب فارسی فیلد..."
                          />

                          <button
                            onClick={() => handleToggleFieldAiIndex(selectedTableForFields.tableName, f.fieldName)}
                            className={`px-3 py-1.5 rounded-xl text-[11px] font-bold border transition-all flex items-center gap-1 ${
                              f.isAiIndexed
                                ? 'bg-indigo-700 text-white border-indigo-700'
                                : 'bg-white text-slate-600 border-slate-300 hover:text-slate-900'
                            }`}
                          >
                            <Sparkles className="w-3 h-3" />
                            <span>{f.isAiIndexed ? 'شاخص AI' : 'عادی'}</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Sample Data Live Preview */}
                <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm space-y-4">
                  <h4 className="text-base font-black text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
                    <Eye className="w-4 h-4 text-indigo-700" />
                    <span>پیش‌نمایش زنده داده‌های ثبت‌شده در دیتابیس</span>
                  </h4>

                  <div className="overflow-x-auto scrollbar-thin">
                    <table className="w-full text-right text-xs">
                      <thead>
                        <tr className="bg-slate-100 text-slate-900 font-bold border-b border-slate-200">
                          {Object.keys(selectedTableForFields.sampleData[0] || {}).map((key, i) => (
                            <th key={i} className="p-3 font-mono">{key}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 text-slate-800">
                        {selectedTableForFields.sampleData.map((row, rIdx) => (
                          <tr key={rIdx} className="hover:bg-slate-50">
                            {Object.values(row).map((val: any, cIdx) => (
                              <td key={cIdx} className="p-3 font-mono font-medium">
                                {typeof val === 'number' ? val.toLocaleString('fa-IR') : String(val)}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </>
            ) : (
              <div className="bg-white border border-slate-200 rounded-3xl p-8 text-center text-slate-500 font-bold">
                لطفاً یک شیء مرجع را جهت مشاهده فیلدها انتخاب کنید.
              </div>
            )}
          </div>
        </div>
      )}

      {/* ==================== TAB 5: PIPELINE ETL & AI ARCHITECT ==================== */}
      {activeTab === 'DATAHUB' && (
        <div className="space-y-6">
          {/* Active Data Flow Streams */}
          <div className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-6 shadow-sm space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
                  <Activity className="w-5 h-5 text-indigo-700" />
                  <span>خطوط لوله همگام‌سازی زنده دیتابیس‌ها (Live ETL Pipelines)</span>
                </h3>
                <p className="text-xs text-slate-500 mt-1 font-medium">پایش جریان داده‌ها بین دیتابیس‌های چندگانه و دیتابیس متمرکز Aptus_Central_DataHub</p>
              </div>

              <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                {streams.filter(s => s.status === 'ACTIVE').length} خط لوله فعال
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {streams.map((st) => (
                <div
                  key={st.id}
                  className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 hover:border-indigo-300 transition-all shadow-sm"
                >
                  <div className="flex items-start justify-between gap-2 border-b border-slate-200 pb-2">
                    <div>
                      <h4 className="font-black text-sm text-slate-900">{st.flowTitle}</h4>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {st.sourceDb} ← {st.targetSubsystems.join(', ')}
                      </p>
                    </div>

                    <span className="px-3 py-1 rounded-full text-xs font-mono font-black bg-emerald-100 text-emerald-800 border border-emerald-200 shrink-0">
                      {st.syncFrequency}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-700 pt-1 font-bold flex-wrap gap-2">
                    <div>
                      <span className="text-slate-500">پردازش امروز: </span>
                      <span className="text-indigo-900 font-extrabold">{st.recordsProcessedToday.toLocaleString('fa-IR')} رکورد</span>
                    </div>

                    <button
                      onClick={() => handleExecuteStream(st.id, st.flowTitle)}
                      className="px-3 py-1.5 rounded-xl bg-[#0f2b5c] hover:bg-[#1a3f7a] text-white font-black text-xs flex items-center gap-1 shadow-sm"
                    >
                      <Zap className="w-3.5 h-3.5 text-amber-400" />
                      <span>اجرای فوری ETL</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* AI Database Architect Terminal */}
          <div className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between gap-3 border-b border-slate-100 pb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-indigo-900 text-white font-black flex items-center justify-center shrink-0">
                  <Bot className="w-6 h-6 text-amber-400" />
                </div>
                <div>
                  <h4 className="text-base font-black text-slate-900">دستیار هوش مصنوعی تحلیل دیتابیس و معماری داده (Aptus DB Architect AI)</h4>
                  <p className="text-xs text-slate-500 mt-0.5">تحلیل هوشمند سلامت اتصالات، یکپارچگی فیلدها و پیشنهاد بهینه‌سازی کوئری‌ها</p>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-2">
              <input
                type="text"
                placeholder="سوال یا دستور تحلیلی درباره دیتابیس‌های مرجع را بنویسید (مثلاً: تحلیل یکپارچگی اسناد مالیاتی و قبوض باسکول)..."
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleRunAiDbAnalysis()}
                className="w-full p-3 rounded-xl bg-slate-50 border border-slate-300 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-600 font-bold"
              />

              <button
                onClick={() => handleRunAiDbAnalysis()}
                disabled={aiLoading}
                className="w-full sm:w-auto px-5 py-3 rounded-xl bg-indigo-900 hover:bg-indigo-800 text-white font-black text-xs shrink-0 flex items-center justify-center gap-2 shadow-sm"
              >
                {aiLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4 text-amber-400" />}
                <span>تحلیل هوشمند</span>
              </button>
            </div>

            {aiAnalysisResult && (
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-800 font-sans leading-relaxed whitespace-pre-wrap">
                {aiAnalysisResult}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ==================== SERVER MODAL (ADD OR EDIT) ==================== */}
      {showServerModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4 dir-rtl overflow-y-auto">
          <div className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-6 max-w-xl w-full max-h-[90vh] overflow-y-auto shadow-2xl space-y-4 my-auto text-slate-900">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                <Server className="w-5 h-5 text-indigo-700" />
                <span>{editingServerId ? 'ویرایش مشخصات سرور مرجع & احراز هویت' : 'تعریف سرور دیتابیس جدید'}</span>
              </h3>
              <button onClick={() => setShowServerModal(false)} className="p-1 text-slate-400 hover:text-slate-800">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveServerSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-800 font-bold mb-1">نام و عنوان شناسایی سرور</label>
                <input
                  type="text"
                  required
                  placeholder="مثال: سرور اصلی SQL Server شرکت آپتوس"
                  value={serverForm.serverName}
                  onChange={(e) => setServerForm({ ...serverForm, serverName: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 font-bold focus:outline-none focus:border-indigo-600 focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-800 font-bold mb-1">نوع دیتابیس سرور</label>
                  <select
                    value={serverForm.dbType}
                    onChange={(e: any) => setServerForm({ ...serverForm, dbType: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 font-bold focus:outline-none focus:border-indigo-600 focus:bg-white"
                  >
                    <option value="SQL Server 2022">SQL Server 2022 Enterprise</option>
                    <option value="PostgreSQL 16">PostgreSQL 16</option>
                    <option value="Oracle ERP">Oracle ERP Database</option>
                    <option value="MySQL/MariaDB">MySQL / MariaDB Cluster</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-800 font-bold mb-1">آدرس IP یا Host</label>
                  <input
                    type="text"
                    required
                    value={serverForm.ipHost}
                    onChange={(e) => setServerForm({ ...serverForm, ipHost: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 font-mono text-left dir-ltr font-bold focus:outline-none focus:border-indigo-600 focus:bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-800 font-bold mb-1">پورت (Port)</label>
                  <input
                    type="number"
                    value={serverForm.port}
                    onChange={(e) => setServerForm({ ...serverForm, port: parseInt(e.target.value) || 1433 })}
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 font-mono text-left dir-ltr font-bold focus:outline-none focus:border-indigo-600 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-800 font-bold mb-1">نام دیتابیس اولیه</label>
                  <input
                    type="text"
                    value={serverForm.initialDbName}
                    onChange={(e) => setServerForm({ ...serverForm, initialDbName: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 font-mono text-left dir-ltr font-bold focus:outline-none focus:border-indigo-600 focus:bg-white"
                  />
                </div>
              </div>

              {/* SQL Authentication Credentials */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-200">
                <div>
                  <label className="block text-indigo-900 font-bold mb-1">نام کاربری SQL (Username)</label>
                  <input
                    type="text"
                    required
                    value={serverForm.username}
                    onChange={(e) => setServerForm({ ...serverForm, username: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 font-mono text-left dir-ltr font-bold focus:outline-none focus:border-indigo-600"
                  />
                </div>

                <div>
                  <label className="block text-indigo-900 font-bold mb-1">کلمه عبور SQL (Password)</label>
                  <input
                    type="password"
                    placeholder="کلمه عبور اتصال به سرور"
                    value={serverForm.password}
                    onChange={(e) => setServerForm({ ...serverForm, password: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 font-mono text-left dir-ltr font-bold focus:outline-none focus:border-indigo-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-800 font-bold mb-1">توضیحات و کاربرد سرور</label>
                <textarea
                  rows={2}
                  value={serverForm.description}
                  onChange={(e) => setServerForm({ ...serverForm, description: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 font-medium focus:outline-none focus:border-indigo-600 focus:bg-white"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowServerModal(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 text-slate-700 font-bold hover:bg-slate-200 transition-all"
                >
                  انصراف
                </button>

                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#0f2b5c] hover:bg-[#1a3f7a] text-white font-black shadow-sm transition-all"
                >
                  ذخیره مشخصات سرور & احراز هویت
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==================== ADD DB TO SERVER MODAL ==================== */}
      {showAddDbModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4 dir-rtl overflow-y-auto">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4 my-auto text-slate-900">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                <Database className="w-5 h-5 text-indigo-700" />
                <span>افزودن دیتابیس جدید به سرور</span>
              </h3>
              <button onClick={() => setShowAddDbModal(null)} className="p-1 text-slate-400 hover:text-slate-800">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <label className="block text-slate-800 font-bold">نام دیتابیس روی سرور SQL:</label>
              <input
                type="text"
                placeholder="مثلا: Aptus_MasterData_2026"
                value={newDbNameInput}
                onChange={(e) => setNewDbNameInput(e.target.value)}
                className="w-full p-3 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 font-mono text-left dir-ltr font-bold focus:outline-none focus:border-indigo-600 focus:bg-white"
              />

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  onClick={() => setShowAddDbModal(null)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-bold hover:bg-slate-200"
                >
                  انصراف
                </button>

                <button
                  onClick={() => handleAddDatabaseToServer(showAddDbModal)}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black shadow-sm"
                >
                  افزودن دیتابیس
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
