import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../lib/axios';
import {
  HiOutlineUserGroup, HiOutlineCurrencyRupee,
  HiOutlineShieldCheck, HiOutlineCog6Tooth, HiOutlineDocumentChartBar,
  HiOutlineMagnifyingGlass, HiOutlineCheckCircle, HiOutlineXCircle,
  HiOutlineClipboardDocumentList, HiOutlineFunnel,
  HiOutlineArrowPath, HiOutlineChevronLeft, HiOutlineChevronRight,
  HiOutlineArrowTrendingUp, HiOutlineArrowTrendingDown,
  HiOutlineBuildingOffice2, HiOutlineEye, HiOutlineBell,
  HiOutlineLockClosed, HiOutlinePaintBrush, HiOutlineGlobeAlt,
  HiOutlineEnvelope, HiOutlineServerStack, HiOutlineCreditCard,
} from 'react-icons/hi2';

const sections = [
  { key: 'users', label: 'User Ledger', icon: HiOutlineUserGroup },
  { key: 'audit', label: 'Audit Log', icon: HiOutlineClipboardDocumentList },
  { key: 'revenue', label: 'Revenue Audit', icon: HiOutlineCurrencyRupee },
  { key: 'kyc', label: 'KYC Queue', icon: HiOutlineShieldCheck },
  { key: 'settings', label: 'Settings', icon: HiOutlineCog6Tooth },
];

// ─── Audit Action Configuration ──────────────────────────────────────
const actionColors = {
  ADMIN_LOGIN: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  USER_LOGIN: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  USER_REGISTERED: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
  ROLE_CHANGED: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
  KYC_APPROVED: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  KYC_REJECTED: 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400',
  PROPERTY_CREATED: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400',
  PROPERTY_UPDATED: 'bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-400',
  PROPERTY_DELETED: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  BOOKING_CREATED: 'bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400',
  TICKET_CREATED: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  TICKET_RESOLVED: 'bg-lime-100 text-lime-700 dark:bg-lime-900/30 dark:text-lime-400',
};
const actionIcons = {
  ADMIN_LOGIN: '🔐', USER_LOGIN: '🔑', USER_REGISTERED: '👤',
  ROLE_CHANGED: '🔄', KYC_APPROVED: '✅', KYC_REJECTED: '❌',
  PROPERTY_CREATED: '🏠', PROPERTY_UPDATED: '✏️', PROPERTY_DELETED: '🗑️',
  BOOKING_CREATED: '📋', TICKET_CREATED: '🎫', TICKET_RESOLVED: '✔️',
};
const allActions = [
  'ADMIN_LOGIN', 'USER_LOGIN', 'USER_REGISTERED',
  'ROLE_CHANGED', 'KYC_APPROVED', 'KYC_REJECTED',
  'PROPERTY_CREATED', 'PROPERTY_UPDATED', 'PROPERTY_DELETED',
  'BOOKING_CREATED', 'TICKET_CREATED', 'TICKET_RESOLVED',
];

// ─── Demo Data ──────────────────────────────────────────────────────
const demoUsers = [
  { id: 1, name: 'Amit Sharma', email: 'amit@email.com', role: 'resident', kycStatus: 'verified', joined: 'Mar 15, 2026', avatar: 'AS' },
  { id: 2, name: 'Neha Gupta', email: 'neha@email.com', role: 'resident', kycStatus: 'pending', joined: 'Mar 28, 2026', avatar: 'NG' },
  { id: 3, name: 'Vikram Kapoor', email: 'vikram@email.com', role: 'owner', kycStatus: 'verified', joined: 'Feb 10, 2026', avatar: 'VK' },
  { id: 4, name: 'Priya Patel', email: 'priya@email.com', role: 'resident', kycStatus: 'rejected', joined: 'Apr 1, 2026', avatar: 'PP' },
];

const demoRevenue = {
  summary: {
    totalRevenue: '₹18,42,600',
    monthlyRecurring: '₹4,52,800',
    pendingPayments: '₹87,500',
    defaultRate: '4.2%',
  },
  transactions: [
    { id: 1, tenant: 'Amit Sharma', property: 'Sunrise PG', type: 'Rent', amount: '₹8,500', date: 'Apr 6, 2026', status: 'paid', method: 'UPI' },
    { id: 2, tenant: 'Neha Gupta', property: 'Sunrise PG', type: 'Security Deposit', amount: '₹12,000', date: 'Apr 5, 2026', status: 'paid', method: 'Bank Transfer' },
    { id: 3, tenant: 'Rahul Verma', property: 'Sunrise PG', type: 'Rent', amount: '₹7,000', date: 'Apr 4, 2026', status: 'pending', method: '—' },
    { id: 4, tenant: 'Priya Patel', property: 'Green Villa PG', type: 'Electricity', amount: '₹1,250', date: 'Apr 3, 2026', status: 'paid', method: 'UPI' },
    { id: 5, tenant: 'Karan Singh', property: 'Sunrise PG', type: 'Rent', amount: '₹9,500', date: 'Apr 2, 2026', status: 'overdue', method: '—' },
    { id: 6, tenant: 'Meena Das', property: 'Green Villa PG', type: 'Rent', amount: '₹6,500', date: 'Apr 1, 2026', status: 'paid', method: 'UPI' },
  ],
  propertyBreakdown: [
    { name: 'Sunrise PG', revenue: '₹3,24,000', occupancy: '92%', tenants: 48 },
    { name: 'Green Villa PG', revenue: '₹1,28,800', occupancy: '85%', tenants: 32 },
  ],
};

const demoKycQueue = [
  { id: 1, name: 'Neha Gupta', email: 'neha@email.com', phone: '9876543210', aadhar: '1234-5678-9012', submitted: 'Apr 5, 2026', avatar: 'NG', status: 'pending', documents: ['Aadhar Card', 'PAN Card'] },
  { id: 2, name: 'Ravi Kumar', email: 'ravi@email.com', phone: '9876543211', aadhar: '2345-6789-0123', submitted: 'Apr 4, 2026', avatar: 'RK', status: 'pending', documents: ['Aadhar Card', 'Passport'] },
  { id: 3, name: 'Sonal Mehta', email: 'sonal@email.com', phone: '9876543212', aadhar: '3456-7890-1234', submitted: 'Apr 3, 2026', avatar: 'SM', status: 'pending', documents: ['Aadhar Card'] },
  { id: 4, name: 'Priya Patel', email: 'priya@email.com', phone: '9876543213', aadhar: '4567-8901-2345', submitted: 'Apr 1, 2026', avatar: 'PP', status: 'rejected', documents: ['Aadhar Card'], reason: 'Blurry document' },
];

const AdminPanel = () => {
  const { user } = useAuth();
  const [activeSection, setActiveSection] = useState('users');
  const [searchUser, setSearchUser] = useState('');

  // Audit log state
  const [auditLogs, setAuditLogs] = useState([]);
  const [auditStats, setAuditStats] = useState(null);
  const [auditLoading, setAuditLoading] = useState(false);
  const [auditPage, setAuditPage] = useState(1);
  const [auditTotal, setAuditTotal] = useState(0);
  const [auditTotalPages, setAuditTotalPages] = useState(1);
  const [auditSearch, setAuditSearch] = useState('');
  const [auditActionFilter, setAuditActionFilter] = useState('');
  const [showActionFilter, setShowActionFilter] = useState(false);

  // KYC state
  const [kycData, setKycData] = useState(demoKycQueue);
  const [kycFilter, setKycFilter] = useState('pending');
  const [kycMessage, setKycMessage] = useState(null);

  // Settings state
  const [settings, setSettings] = useState({
    siteName: 'StaySync',
    adminEmail: 'admin@staysync.com',
    defaultCurrency: 'INR',
    timezone: 'Asia/Kolkata',
    maintenanceMode: false,
    emailNotifications: true,
    smsNotifications: false,
    autoApproveKyc: false,
    paymentGateway: 'Stripe',
    lateFeePercent: '5',
    gracePeriodDays: '5',
    maxLoginAttempts: '5',
    sessionTimeout: '30',
    twoFactorAuth: false,
  });
  const [settingsSaved, setSettingsSaved] = useState(false);

  // Revenue state
  const [revenueFilter, setRevenueFilter] = useState('all');

  const filteredUsers = demoUsers.filter((u) =>
    u.name.toLowerCase().includes(searchUser.toLowerCase())
  );
  const kycBadge = (s) => s === 'verified' ? 'badge-success' : s === 'pending' ? 'badge-warning' : 'badge-danger';

  // ─── Audit Fetch ──────────────────────────────────────────────────
  const fetchAuditLogs = useCallback(async () => {
    setAuditLoading(true);
    try {
      const params = { page: auditPage, limit: 15 };
      if (auditSearch) params.search = auditSearch;
      if (auditActionFilter) params.action = auditActionFilter;
      const { data } = await api.get('/audit', { params });
      setAuditLogs(data.data);
      setAuditTotal(data.pagination.total);
      setAuditTotalPages(data.pagination.pages);
    } catch (err) {
      console.error('Failed to fetch audit logs:', err);
    } finally {
      setAuditLoading(false);
    }
  }, [auditPage, auditSearch, auditActionFilter]);

  const fetchAuditStats = useCallback(async () => {
    try {
      const { data } = await api.get('/audit/stats');
      setAuditStats(data.data);
    } catch (err) {
      console.error('Failed to fetch audit stats:', err);
    }
  }, []);

  useEffect(() => {
    if (activeSection === 'audit') {
      fetchAuditLogs();
      fetchAuditStats();
    }
  }, [activeSection, fetchAuditLogs, fetchAuditStats]);

  const formatDate = (dateStr) => new Date(dateStr).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' });
  const formatTime = (dateStr) => new Date(dateStr).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  const formatAction = (action) => action.replace(/_/g, ' ');

  // ─── KYC Handlers ────────────────────────────────────────────────
  const handleKycAction = (id, action) => {
    setKycData(prev => prev.map(item => {
      if (item.id === id) {
        return { ...item, status: action === 'approve' ? 'verified' : action === 'reject' ? 'rejected' : 'pending', reason: action === 'reject' ? 'Rejected by admin' : undefined };
      }
      return item;
    }));
    setKycMessage({ msg: `KYC ${action === 'approve' ? 'approved' : action === 'reject' ? 'rejected' : 'moved to pending'}!`, type: action === 'approve' ? 'success' : action === 'reject' ? 'warning' : 'info' });
    setTimeout(() => setKycMessage(null), 3000);
  };

  const filteredKyc = kycData.filter(k => {
    if (kycFilter === 'pending') return k.status === 'pending';
    if (kycFilter === 'verified') return k.status === 'verified';
    if (kycFilter === 'rejected') return k.status === 'rejected';
    return true;
  });

  // ─── Revenue Helpers ──────────────────────────────────────────────
  const filteredTransactions = demoRevenue.transactions.filter(t => {
    if (revenueFilter === 'all') return true;
    return t.status === revenueFilter;
  });

  const statusBadge = (s) => {
    if (s === 'paid') return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400';
    if (s === 'pending') return 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400';
    if (s === 'overdue') return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
    return 'bg-surface-100 text-surface-600';
  };

  // ─── Settings Handlers ────────────────────────────────────────────
  const handleSettingChange = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    setSettingsSaved(false);
  };

  const saveSettings = () => {
    setSettingsSaved(true);
    setTimeout(() => setSettingsSaved(false), 3000);
  };

  return (
    <div className="min-h-screen bg-surface-50 dark:bg-surface-950 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8 animate-fade-in">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500 to-rose-600 flex items-center justify-center">
              <HiOutlineShieldCheck className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl lg:text-3xl font-display font-bold text-surface-900 dark:text-white">Admin Panel</h1>
              <p className="text-surface-500 text-sm">Logged in as {user?.name} • Full platform access</p>
            </div>
          </div>
        </div>

        {/* Toast */}
        {kycMessage && (
          <div className={`fixed top-20 right-4 z-50 px-6 py-3 rounded-xl shadow-xl text-sm font-medium animate-fade-in-down text-white ${
            kycMessage.type === 'success' ? 'bg-emerald-500' : kycMessage.type === 'warning' ? 'bg-amber-500' : 'bg-blue-500'
          }`}>
            {kycMessage.msg}
          </div>
        )}
        {settingsSaved && (
          <div className="fixed top-20 right-4 z-50 px-6 py-3 rounded-xl shadow-xl text-sm font-medium animate-fade-in-down bg-emerald-500 text-white">
            ✅ Settings saved successfully!
          </div>
        )}

        <div className="grid lg:grid-cols-5 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="glass-card p-3 space-y-1">
              {sections.map((s) => (
                <button key={s.key} onClick={() => setActiveSection(s.key)} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${activeSection === s.key ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-600' : 'text-surface-600 dark:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-800'}`}>
                  <s.icon className="w-5 h-5" />{s.label}
                </button>
              ))}
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-4">

            {/* ════════════════════ USERS SECTION ════════════════════ */}
            {activeSection === 'users' && (
              <div className="glass-card p-6 animate-fade-in-up">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                  <h2 className="text-xl font-display font-bold text-surface-900 dark:text-white">Global User Ledger</h2>
                  <div className="relative w-64">
                    <HiOutlineMagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" />
                    <input value={searchUser} onChange={(e) => setSearchUser(e.target.value)} className="input-field pl-10 py-2 text-sm" placeholder="Search users..." />
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-surface-200 dark:border-surface-700">
                        {['User','Email','Role','KYC','Joined','Actions'].map(h => (
                          <th key={h} className="text-left text-xs font-semibold text-surface-500 uppercase py-3 px-3">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-surface-100 dark:divide-surface-800">
                      {filteredUsers.map((u) => (
                        <tr key={u.id} className="hover:bg-surface-50 dark:hover:bg-surface-800/50">
                          <td className="py-3 px-3"><div className="flex items-center gap-3"><div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-400 to-accent-400 flex items-center justify-center"><span className="text-white text-xs font-bold">{u.avatar}</span></div><span className="text-sm font-medium text-surface-900 dark:text-white">{u.name}</span></div></td>
                          <td className="py-3 px-3 text-sm text-surface-500">{u.email}</td>
                          <td className="py-3 px-3"><span className="badge-primary capitalize">{u.role}</span></td>
                          <td className="py-3 px-3"><span className={`${kycBadge(u.kycStatus)} capitalize`}>{u.kycStatus}</span></td>
                          <td className="py-3 px-3 text-sm text-surface-500">{u.joined}</td>
                          <td className="py-3 px-3"><div className="flex gap-1"><button className="p-1.5 rounded-lg hover:bg-emerald-50 dark:hover:bg-emerald-900/20 text-emerald-600"><HiOutlineCheckCircle className="w-4 h-4" /></button><button className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-red-500"><HiOutlineXCircle className="w-4 h-4" /></button></div></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* ════════════════════ AUDIT LOG SECTION ════════════════════ */}
            {activeSection === 'audit' && (
              <div className="space-y-6 animate-fade-in-up">
                {auditStats && (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="glass-card p-5">
                      <p className="text-xs font-semibold text-surface-500 uppercase tracking-wider mb-1">Total Events</p>
                      <p className="text-2xl font-display font-bold text-surface-900 dark:text-white">{auditStats.totalLogs}</p>
                    </div>
                    <div className="glass-card p-5">
                      <p className="text-xs font-semibold text-surface-500 uppercase tracking-wider mb-1">Today's Events</p>
                      <p className="text-2xl font-display font-bold text-emerald-600">{auditStats.todayLogs}</p>
                    </div>
                    <div className="glass-card p-5">
                      <p className="text-xs font-semibold text-surface-500 uppercase tracking-wider mb-1">Top Action</p>
                      <p className="text-lg font-display font-bold text-surface-900 dark:text-white">
                        {auditStats.actionCounts && Object.keys(auditStats.actionCounts).length > 0
                          ? Object.entries(auditStats.actionCounts).sort((a, b) => b[1] - a[1])[0][0].replace(/_/g, ' ')
                          : 'N/A'}
                      </p>
                    </div>
                  </div>
                )}

                <div className="glass-card p-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                    <h2 className="text-xl font-display font-bold text-surface-900 dark:text-white flex items-center gap-2">
                      <HiOutlineClipboardDocumentList className="w-5 h-5 text-red-500" />
                      System Audit Trail
                    </h2>
                    <div className="flex items-center gap-2">
                      <div className="relative">
                        <HiOutlineMagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" />
                        <input value={auditSearch} onChange={(e) => { setAuditSearch(e.target.value); setAuditPage(1); }} className="input-field pl-10 py-2 text-sm w-48" placeholder="Search logs..." />
                      </div>
                      <div className="relative">
                        <button onClick={() => setShowActionFilter(!showActionFilter)} className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-colors ${auditActionFilter ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-600' : 'bg-surface-100 dark:bg-surface-800 text-surface-600 dark:text-surface-300'}`}>
                          <HiOutlineFunnel className="w-4 h-4" />
                          {auditActionFilter ? formatAction(auditActionFilter) : 'Filter'}
                        </button>
                        {showActionFilter && (
                          <div className="absolute right-0 top-full mt-2 w-56 bg-white dark:bg-surface-900 rounded-xl shadow-xl border border-surface-200 dark:border-surface-700 z-50 max-h-72 overflow-y-auto">
                            <button onClick={() => { setAuditActionFilter(''); setShowActionFilter(false); setAuditPage(1); }} className="w-full text-left px-4 py-2 text-sm hover:bg-surface-50 dark:hover:bg-surface-800 text-surface-600 dark:text-surface-300 font-medium">All Actions</button>
                            {allActions.map(action => (
                              <button key={action} onClick={() => { setAuditActionFilter(action); setShowActionFilter(false); setAuditPage(1); }} className="w-full text-left px-4 py-2 text-sm hover:bg-surface-50 dark:hover:bg-surface-800 text-surface-600 dark:text-surface-300 flex items-center gap-2">
                                <span>{actionIcons[action]}</span>{formatAction(action)}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                      <button onClick={() => { fetchAuditLogs(); fetchAuditStats(); }} className="p-2 rounded-xl bg-surface-100 dark:bg-surface-800 text-surface-600 dark:text-surface-300 hover:bg-surface-200 dark:hover:bg-surface-700 transition-colors">
                        <HiOutlineArrowPath className={`w-4 h-4 ${auditLoading ? 'animate-spin' : ''}`} />
                      </button>
                    </div>
                  </div>

                  {auditLoading ? (
                    <div className="flex items-center justify-center py-16">
                      <div className="w-10 h-10 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
                    </div>
                  ) : auditLogs.length === 0 ? (
                    <div className="text-center py-16">
                      <HiOutlineClipboardDocumentList className="w-16 h-16 text-surface-300 mx-auto mb-4" />
                      <p className="text-surface-500 font-medium">No audit logs found</p>
                      <p className="text-surface-400 text-sm mt-1">Actions will appear here as they happen</p>
                    </div>
                  ) : (
                    <>
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead>
                            <tr className="border-b border-surface-200 dark:border-surface-700">
                              {['Timestamp', 'Action', 'Performed By', 'Target', 'Details', 'IP'].map(h => (
                                <th key={h} className="text-left text-xs font-semibold text-surface-500 uppercase py-3 px-3 tracking-wider">{h}</th>
                              ))}
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-surface-100 dark:divide-surface-800">
                            {auditLogs.map((log) => (
                              <tr key={log._id} className="hover:bg-surface-50 dark:hover:bg-surface-800/50 transition-colors">
                                <td className="py-3 px-3">
                                  <div className="text-xs font-medium text-surface-900 dark:text-white">{formatDate(log.createdAt)}</div>
                                  <div className="text-xs text-surface-400 font-mono">{formatTime(log.createdAt)}</div>
                                </td>
                                <td className="py-3 px-3">
                                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold ${actionColors[log.action] || 'bg-surface-100 text-surface-600'}`}>
                                    <span>{actionIcons[log.action] || '📝'}</span>{formatAction(log.action)}
                                  </span>
                                </td>
                                <td className="py-3 px-3">
                                  <div className="text-sm font-medium text-surface-900 dark:text-white">{log.performedByName}</div>
                                  <div className="text-xs text-surface-400 capitalize">{log.performedByRole}</div>
                                </td>
                                <td className="py-3 px-3">{log.targetUserName ? <span className="text-sm text-surface-600 dark:text-surface-300">{log.targetUserName}</span> : <span className="text-xs text-surface-400">—</span>}</td>
                                <td className="py-3 px-3">
                                  {log.details && Object.keys(log.details).length > 0 ? (
                                    <div className="text-xs text-surface-500 font-mono max-w-48 truncate" title={JSON.stringify(log.details)}>
                                      {Object.entries(log.details).slice(0, 2).map(([k, v]) => (<div key={k}><span className="text-surface-400">{k}:</span> {String(v)}</div>))}
                                    </div>
                                  ) : <span className="text-xs text-surface-400">—</span>}
                                </td>
                                <td className="py-3 px-3"><span className="text-xs text-surface-400 font-mono">{log.ipAddress}</span></td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                      <div className="flex items-center justify-between mt-6 pt-4 border-t border-surface-200 dark:border-surface-700">
                        <p className="text-sm text-surface-500">Showing {(auditPage - 1) * 15 + 1}–{Math.min(auditPage * 15, auditTotal)} of {auditTotal}</p>
                        <div className="flex items-center gap-2">
                          <button onClick={() => setAuditPage(p => Math.max(1, p - 1))} disabled={auditPage <= 1} className="p-2 rounded-xl bg-surface-100 dark:bg-surface-800 text-surface-600 disabled:opacity-30 hover:bg-surface-200 transition-colors"><HiOutlineChevronLeft className="w-4 h-4" /></button>
                          <span className="text-sm font-medium text-surface-700 dark:text-surface-300 px-3">{auditPage} / {auditTotalPages}</span>
                          <button onClick={() => setAuditPage(p => Math.min(auditTotalPages, p + 1))} disabled={auditPage >= auditTotalPages} className="p-2 rounded-xl bg-surface-100 dark:bg-surface-800 text-surface-600 disabled:opacity-30 hover:bg-surface-200 transition-colors"><HiOutlineChevronRight className="w-4 h-4" /></button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}

            {/* ════════════════════ REVENUE AUDIT SECTION ════════════════════ */}
            {activeSection === 'revenue' && (
              <div className="space-y-6 animate-fade-in-up">
                {/* Revenue Summary Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {[
                    { label: 'Total Revenue', value: demoRevenue.summary.totalRevenue, icon: HiOutlineCurrencyRupee, color: 'from-emerald-500 to-teal-600', trend: '+18.2%', up: true },
                    { label: 'Monthly Recurring', value: demoRevenue.summary.monthlyRecurring, icon: HiOutlineArrowTrendingUp, color: 'from-blue-500 to-indigo-600', trend: '+12.5%', up: true },
                    { label: 'Pending Payments', value: demoRevenue.summary.pendingPayments, icon: HiOutlineCreditCard, color: 'from-amber-500 to-orange-600', trend: '-8.3%', up: false },
                    { label: 'Default Rate', value: demoRevenue.summary.defaultRate, icon: HiOutlineArrowTrendingDown, color: 'from-red-500 to-rose-600', trend: '-1.2%', up: false },
                  ].map((card, i) => (
                    <div key={i} className="glass-card p-5">
                      <div className="flex items-center justify-between mb-3">
                        <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${card.color} flex items-center justify-center`}>
                          <card.icon className="w-5 h-5 text-white" />
                        </div>
                        <span className={`flex items-center gap-1 text-xs font-bold ${card.up ? 'text-emerald-600' : 'text-red-500'}`}>
                          {card.up ? <HiOutlineArrowTrendingUp className="w-3 h-3" /> : <HiOutlineArrowTrendingDown className="w-3 h-3" />}
                          {card.trend}
                        </span>
                      </div>
                      <p className="text-2xl font-display font-bold text-surface-900 dark:text-white">{card.value}</p>
                      <p className="text-xs text-surface-500 mt-1">{card.label}</p>
                    </div>
                  ))}
                </div>

                {/* Property Breakdown */}
                <div className="glass-card p-6">
                  <h3 className="text-lg font-display font-bold text-surface-900 dark:text-white mb-4 flex items-center gap-2">
                    <HiOutlineBuildingOffice2 className="w-5 h-5 text-primary-500" />
                    Property Revenue Breakdown
                  </h3>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {demoRevenue.propertyBreakdown.map((prop, i) => (
                      <div key={i} className="p-4 rounded-xl bg-surface-50 dark:bg-surface-800/50 border border-surface-200 dark:border-surface-700">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="font-semibold text-surface-900 dark:text-white">{prop.name}</h4>
                          <span className="text-lg font-bold text-emerald-600">{prop.revenue}</span>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-surface-500">
                          <span>Occupancy: <strong className="text-surface-900 dark:text-white">{prop.occupancy}</strong></span>
                          <span>Tenants: <strong className="text-surface-900 dark:text-white">{prop.tenants}</strong></span>
                        </div>
                        <div className="mt-3 w-full bg-surface-200 dark:bg-surface-700 rounded-full h-2">
                          <div className="bg-gradient-to-r from-emerald-500 to-teal-500 h-2 rounded-full transition-all" style={{ width: prop.occupancy }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Transactions Table */}
                <div className="glass-card p-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                    <h3 className="text-lg font-display font-bold text-surface-900 dark:text-white">Transaction History</h3>
                    <div className="flex gap-1 p-1 bg-surface-100 dark:bg-surface-800 rounded-xl">
                      {['all', 'paid', 'pending', 'overdue'].map(f => (
                        <button key={f} onClick={() => setRevenueFilter(f)} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors capitalize ${revenueFilter === f ? 'bg-white dark:bg-surface-700 text-surface-900 dark:text-white shadow-sm' : 'text-surface-500'}`}>
                          {f}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-surface-200 dark:border-surface-700">
                          {['Tenant', 'Property', 'Type', 'Amount', 'Date', 'Status', 'Method'].map(h => (
                            <th key={h} className="text-left text-xs font-semibold text-surface-500 uppercase py-3 px-3">{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-surface-100 dark:divide-surface-800">
                        {filteredTransactions.map((tx) => (
                          <tr key={tx.id} className="hover:bg-surface-50 dark:hover:bg-surface-800/50 transition-colors">
                            <td className="py-3 px-3 text-sm font-medium text-surface-900 dark:text-white">{tx.tenant}</td>
                            <td className="py-3 px-3 text-sm text-surface-500">{tx.property}</td>
                            <td className="py-3 px-3 text-sm text-surface-500">{tx.type}</td>
                            <td className="py-3 px-3 text-sm font-semibold text-surface-900 dark:text-white">{tx.amount}</td>
                            <td className="py-3 px-3 text-sm text-surface-500">{tx.date}</td>
                            <td className="py-3 px-3"><span className={`px-2.5 py-1 rounded-lg text-xs font-bold capitalize ${statusBadge(tx.status)}`}>{tx.status}</span></td>
                            <td className="py-3 px-3 text-sm text-surface-500">{tx.method}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* ════════════════════ KYC QUEUE SECTION ════════════════════ */}
            {activeSection === 'kyc' && (
              <div className="space-y-6 animate-fade-in-up">
                {/* KYC Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="glass-card p-5">
                    <p className="text-xs font-semibold text-surface-500 uppercase tracking-wider mb-1">Pending Review</p>
                    <p className="text-2xl font-display font-bold text-amber-600">{kycData.filter(k => k.status === 'pending').length}</p>
                  </div>
                  <div className="glass-card p-5">
                    <p className="text-xs font-semibold text-surface-500 uppercase tracking-wider mb-1">Verified</p>
                    <p className="text-2xl font-display font-bold text-emerald-600">{kycData.filter(k => k.status === 'verified').length}</p>
                  </div>
                  <div className="glass-card p-5">
                    <p className="text-xs font-semibold text-surface-500 uppercase tracking-wider mb-1">Rejected</p>
                    <p className="text-2xl font-display font-bold text-red-500">{kycData.filter(k => k.status === 'rejected').length}</p>
                  </div>
                </div>

                {/* KYC Filter Tabs */}
                <div className="flex gap-1 p-1 bg-surface-100 dark:bg-surface-800 rounded-xl w-fit">
                  {['pending', 'verified', 'rejected'].map(f => (
                    <button key={f} onClick={() => setKycFilter(f)} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors capitalize ${kycFilter === f ? 'bg-white dark:bg-surface-700 text-surface-900 dark:text-white shadow-sm' : 'text-surface-500'}`}>
                      {f}
                    </button>
                  ))}
                </div>

                {/* KYC Cards */}
                {filteredKyc.length === 0 ? (
                  <div className="glass-card p-16 text-center">
                    <HiOutlineShieldCheck className="w-16 h-16 text-surface-300 mx-auto mb-4" />
                    <p className="text-surface-500 font-medium">No {kycFilter} KYC requests</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredKyc.map((item, i) => (
                      <div key={item.id} className="glass-card p-6 animate-fade-in-up" style={{ animationDelay: `${i * 0.05}s` }}>
                        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                          {/* User Info */}
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-400 to-indigo-500 flex items-center justify-center flex-shrink-0">
                              <span className="text-white font-bold">{item.avatar}</span>
                            </div>
                            <div>
                              <h3 className="font-semibold text-surface-900 dark:text-white">{item.name}</h3>
                              <p className="text-sm text-surface-500">{item.email}</p>
                            </div>
                          </div>

                          {/* Details */}
                          <div className="flex flex-wrap gap-3">
                            <div className="px-3 py-1.5 rounded-lg bg-surface-100 dark:bg-surface-800">
                              <p className="text-xs text-surface-500 uppercase">Phone</p>
                              <p className="text-sm font-semibold text-surface-900 dark:text-white">{item.phone}</p>
                            </div>
                            <div className="px-3 py-1.5 rounded-lg bg-surface-100 dark:bg-surface-800">
                              <p className="text-xs text-surface-500 uppercase">Aadhar</p>
                              <p className="text-sm font-semibold text-surface-900 dark:text-white">{item.aadhar}</p>
                            </div>
                            <div className="px-3 py-1.5 rounded-lg bg-surface-100 dark:bg-surface-800">
                              <p className="text-xs text-surface-500 uppercase">Submitted</p>
                              <p className="text-sm font-semibold text-surface-900 dark:text-white">{item.submitted}</p>
                            </div>
                            <div className="px-3 py-1.5 rounded-lg bg-surface-100 dark:bg-surface-800">
                              <p className="text-xs text-surface-500 uppercase">Documents</p>
                              <p className="text-sm font-semibold text-surface-900 dark:text-white">{item.documents.join(', ')}</p>
                            </div>
                          </div>

                          {/* Actions */}
                          <div className="flex items-center gap-2">
                            {item.status === 'pending' && (
                              <>
                                <button onClick={() => handleKycAction(item.id, 'approve')} className="flex items-center gap-1.5 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-sm font-semibold transition-colors">
                                  <HiOutlineCheckCircle className="w-4 h-4" /> Approve
                                </button>
                                <button onClick={() => handleKycAction(item.id, 'reject')} className="flex items-center gap-1.5 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-xl text-sm font-semibold transition-colors">
                                  <HiOutlineXCircle className="w-4 h-4" /> Reject
                                </button>
                              </>
                            )}
                            {item.status === 'verified' && (
                              <span className="badge-success flex items-center gap-1"><HiOutlineCheckCircle className="w-3.5 h-3.5" /> Verified</span>
                            )}
                            {item.status === 'rejected' && (
                              <div className="flex flex-col items-end gap-2">
                                <div className="text-right">
                                  <span className="badge-danger">Rejected</span>
                                  {item.reason && <p className="text-xs text-surface-500 mt-1">{item.reason}</p>}
                                </div>
                                <button onClick={() => handleKycAction(item.id, 'approve')} className="flex items-center gap-1.5 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-xs font-semibold transition-colors">
                                  <HiOutlineCheckCircle className="w-3.5 h-3.5" /> Re-Approve
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ════════════════════ SETTINGS SECTION ════════════════════ */}
            {activeSection === 'settings' && (
              <div className="space-y-6 animate-fade-in-up">
                {/* General Settings */}
                <div className="glass-card p-6">
                  <h3 className="text-lg font-display font-bold text-surface-900 dark:text-white mb-6 flex items-center gap-2">
                    <HiOutlineGlobeAlt className="w-5 h-5 text-primary-500" />
                    General Settings
                  </h3>
                  <div className="grid sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">Site Name</label>
                      <input value={settings.siteName} onChange={(e) => handleSettingChange('siteName', e.target.value)} className="input-field" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">Admin Email</label>
                      <input value={settings.adminEmail} onChange={(e) => handleSettingChange('adminEmail', e.target.value)} className="input-field" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">Default Currency</label>
                      <select value={settings.defaultCurrency} onChange={(e) => handleSettingChange('defaultCurrency', e.target.value)} className="input-field">
                        <option value="INR">INR (₹)</option>
                        <option value="USD">USD ($)</option>
                        <option value="EUR">EUR (€)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">Timezone</label>
                      <select value={settings.timezone} onChange={(e) => handleSettingChange('timezone', e.target.value)} className="input-field">
                        <option value="Asia/Kolkata">Asia/Kolkata (IST)</option>
                        <option value="UTC">UTC</option>
                        <option value="America/New_York">America/New_York (EST)</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Notifications */}
                <div className="glass-card p-6">
                  <h3 className="text-lg font-display font-bold text-surface-900 dark:text-white mb-6 flex items-center gap-2">
                    <HiOutlineBell className="w-5 h-5 text-amber-500" />
                    Notification Preferences
                  </h3>
                  <div className="space-y-4">
                    {[
                      { key: 'emailNotifications', label: 'Email Notifications', desc: 'Receive booking and payment alerts via email' },
                      { key: 'smsNotifications', label: 'SMS Notifications', desc: 'Receive urgent alerts via SMS' },
                      { key: 'autoApproveKyc', label: 'Auto-Approve KYC', desc: 'Automatically approve KYC documents when submitted' },
                    ].map(toggle => (
                      <div key={toggle.key} className="flex items-center justify-between p-4 rounded-xl bg-surface-50 dark:bg-surface-800/50 border border-surface-200 dark:border-surface-700">
                        <div>
                          <p className="text-sm font-semibold text-surface-900 dark:text-white">{toggle.label}</p>
                          <p className="text-xs text-surface-500 mt-0.5">{toggle.desc}</p>
                        </div>
                        <button
                          onClick={() => handleSettingChange(toggle.key, !settings[toggle.key])}
                          className={`relative w-12 h-7 rounded-full transition-colors ${settings[toggle.key] ? 'bg-primary-500' : 'bg-surface-300 dark:bg-surface-600'}`}
                        >
                          <span className={`absolute top-1 w-5 h-5 rounded-full bg-white shadow-sm transition-transform ${settings[toggle.key] ? 'left-6' : 'left-1'}`} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Payment Settings */}
                <div className="glass-card p-6">
                  <h3 className="text-lg font-display font-bold text-surface-900 dark:text-white mb-6 flex items-center gap-2">
                    <HiOutlineCreditCard className="w-5 h-5 text-emerald-500" />
                    Payment Settings
                  </h3>
                  <div className="grid sm:grid-cols-3 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">Payment Gateway</label>
                      <select value={settings.paymentGateway} onChange={(e) => handleSettingChange('paymentGateway', e.target.value)} className="input-field">
                        <option value="Stripe">Stripe</option>
                        <option value="Razorpay">Razorpay</option>
                        <option value="PayU">PayU</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">Late Fee (%)</label>
                      <input type="number" value={settings.lateFeePercent} onChange={(e) => handleSettingChange('lateFeePercent', e.target.value)} className="input-field" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">Grace Period (days)</label>
                      <input type="number" value={settings.gracePeriodDays} onChange={(e) => handleSettingChange('gracePeriodDays', e.target.value)} className="input-field" />
                    </div>
                  </div>
                </div>

                {/* Security Settings */}
                <div className="glass-card p-6">
                  <h3 className="text-lg font-display font-bold text-surface-900 dark:text-white mb-6 flex items-center gap-2">
                    <HiOutlineLockClosed className="w-5 h-5 text-red-500" />
                    Security
                  </h3>
                  <div className="grid sm:grid-cols-2 gap-6 mb-6">
                    <div>
                      <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">Max Login Attempts</label>
                      <input type="number" value={settings.maxLoginAttempts} onChange={(e) => handleSettingChange('maxLoginAttempts', e.target.value)} className="input-field" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">Session Timeout (min)</label>
                      <input type="number" value={settings.sessionTimeout} onChange={(e) => handleSettingChange('sessionTimeout', e.target.value)} className="input-field" />
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-4 rounded-xl bg-surface-50 dark:bg-surface-800/50 border border-surface-200 dark:border-surface-700 mb-4">
                    <div>
                      <p className="text-sm font-semibold text-surface-900 dark:text-white">Maintenance Mode</p>
                      <p className="text-xs text-surface-500 mt-0.5">Disable access for all non-admin users</p>
                    </div>
                    <button
                      onClick={() => handleSettingChange('maintenanceMode', !settings.maintenanceMode)}
                      className={`relative w-12 h-7 rounded-full transition-colors ${settings.maintenanceMode ? 'bg-red-500' : 'bg-surface-300 dark:bg-surface-600'}`}
                    >
                      <span className={`absolute top-1 w-5 h-5 rounded-full bg-white shadow-sm transition-transform ${settings.maintenanceMode ? 'left-6' : 'left-1'}`} />
                    </button>
                  </div>
                  <div className="flex items-center justify-between p-4 rounded-xl bg-surface-50 dark:bg-surface-800/50 border border-surface-200 dark:border-surface-700">
                    <div>
                      <p className="text-sm font-semibold text-surface-900 dark:text-white">Two-Factor Authentication</p>
                      <p className="text-xs text-surface-500 mt-0.5">Require 2FA for admin login</p>
                    </div>
                    <button
                      onClick={() => handleSettingChange('twoFactorAuth', !settings.twoFactorAuth)}
                      className={`relative w-12 h-7 rounded-full transition-colors ${settings.twoFactorAuth ? 'bg-primary-500' : 'bg-surface-300 dark:bg-surface-600'}`}
                    >
                      <span className={`absolute top-1 w-5 h-5 rounded-full bg-white shadow-sm transition-transform ${settings.twoFactorAuth ? 'left-6' : 'left-1'}`} />
                    </button>
                  </div>
                </div>

                {/* Save Button */}
                <div className="flex justify-end">
                  <button onClick={saveSettings} className="px-8 py-3 bg-gradient-to-r from-primary-500 to-accent-500 text-white rounded-xl font-semibold shadow-lg shadow-primary-500/20 hover:shadow-primary-500/30 transition-all">
                    Save All Settings
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
