import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../lib/axios';
import {
  HiOutlineUserGroup, HiOutlineCurrencyRupee,
  HiOutlineShieldCheck, HiOutlineCog6Tooth, HiOutlineDocumentChartBar,
  HiOutlineMagnifyingGlass, HiOutlineCheckCircle, HiOutlineXCircle,
  HiOutlineClipboardDocumentList, HiOutlineFunnel,
  HiOutlineArrowPath, HiOutlineChevronLeft, HiOutlineChevronRight,
} from 'react-icons/hi2';

const sections = [
  { key: 'users', label: 'User Ledger', icon: HiOutlineUserGroup },
  { key: 'audit', label: 'Audit Log', icon: HiOutlineClipboardDocumentList },
  { key: 'revenue', label: 'Revenue Audit', icon: HiOutlineCurrencyRupee },
  { key: 'kyc', label: 'KYC Queue', icon: HiOutlineShieldCheck },
  { key: 'settings', label: 'Settings', icon: HiOutlineCog6Tooth },
];

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

const demoUsers = [
  { id: 1, name: 'Amit Sharma', email: 'amit@email.com', role: 'resident', kycStatus: 'verified', joined: 'Mar 15, 2026', avatar: 'AS' },
  { id: 2, name: 'Neha Gupta', email: 'neha@email.com', role: 'resident', kycStatus: 'pending', joined: 'Mar 28, 2026', avatar: 'NG' },
  { id: 3, name: 'Vikram Kapoor', email: 'vikram@email.com', role: 'owner', kycStatus: 'verified', joined: 'Feb 10, 2026', avatar: 'VK' },
  { id: 4, name: 'Priya Patel', email: 'priya@email.com', role: 'resident', kycStatus: 'rejected', joined: 'Apr 1, 2026', avatar: 'PP' },
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

  const filteredUsers = demoUsers.filter((u) =>
    u.name.toLowerCase().includes(searchUser.toLowerCase())
  );

  const kycBadge = (s) => s === 'verified' ? 'badge-success' : s === 'pending' ? 'badge-warning' : 'badge-danger';

  // Fetch audit logs
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

  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const formatTime = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };

  const formatAction = (action) => action.replace(/_/g, ' ');

  return (
    <div className="min-h-screen bg-surface-50 dark:bg-surface-950 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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

            {/* === USERS SECTION === */}
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
                          <td className="py-3 px-3"><div className="flex gap-1"><button className="p-1.5 rounded-lg hover:bg-emerald-50 text-emerald-600"><HiOutlineCheckCircle className="w-4 h-4" /></button><button className="p-1.5 rounded-lg hover:bg-red-50 text-red-500"><HiOutlineXCircle className="w-4 h-4" /></button></div></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* === AUDIT LOG SECTION === */}
            {activeSection === 'audit' && (
              <div className="space-y-6 animate-fade-in-up">
                {/* Stats cards */}
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

                {/* Audit log table */}
                <div className="glass-card p-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                    <h2 className="text-xl font-display font-bold text-surface-900 dark:text-white flex items-center gap-2">
                      <HiOutlineClipboardDocumentList className="w-5 h-5 text-red-500" />
                      System Audit Trail
                    </h2>
                    <div className="flex items-center gap-2">
                      <div className="relative">
                        <HiOutlineMagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" />
                        <input
                          value={auditSearch}
                          onChange={(e) => { setAuditSearch(e.target.value); setAuditPage(1); }}
                          className="input-field pl-10 py-2 text-sm w-48"
                          placeholder="Search logs..."
                        />
                      </div>
                      <div className="relative">
                        <button
                          onClick={() => setShowActionFilter(!showActionFilter)}
                          className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-colors ${
                            auditActionFilter
                              ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-600'
                              : 'bg-surface-100 dark:bg-surface-800 text-surface-600 dark:text-surface-300'
                          }`}
                        >
                          <HiOutlineFunnel className="w-4 h-4" />
                          {auditActionFilter ? formatAction(auditActionFilter) : 'Filter'}
                        </button>
                        {showActionFilter && (
                          <div className="absolute right-0 top-full mt-2 w-56 bg-white dark:bg-surface-900 rounded-xl shadow-xl border border-surface-200 dark:border-surface-700 z-50 max-h-72 overflow-y-auto">
                            <button
                              onClick={() => { setAuditActionFilter(''); setShowActionFilter(false); setAuditPage(1); }}
                              className="w-full text-left px-4 py-2 text-sm hover:bg-surface-50 dark:hover:bg-surface-800 text-surface-600 dark:text-surface-300 font-medium"
                            >
                              All Actions
                            </button>
                            {allActions.map(action => (
                              <button
                                key={action}
                                onClick={() => { setAuditActionFilter(action); setShowActionFilter(false); setAuditPage(1); }}
                                className="w-full text-left px-4 py-2 text-sm hover:bg-surface-50 dark:hover:bg-surface-800 text-surface-600 dark:text-surface-300 flex items-center gap-2"
                              >
                                <span>{actionIcons[action]}</span>
                                {formatAction(action)}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                      <button
                        onClick={() => { fetchAuditLogs(); fetchAuditStats(); }}
                        className="p-2 rounded-xl bg-surface-100 dark:bg-surface-800 text-surface-600 dark:text-surface-300 hover:bg-surface-200 dark:hover:bg-surface-700 transition-colors"
                      >
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
                                    <span>{actionIcons[log.action] || '📝'}</span>
                                    {formatAction(log.action)}
                                  </span>
                                </td>
                                <td className="py-3 px-3">
                                  <div className="text-sm font-medium text-surface-900 dark:text-white">{log.performedByName}</div>
                                  <div className="text-xs text-surface-400 capitalize">{log.performedByRole}</div>
                                </td>
                                <td className="py-3 px-3">
                                  {log.targetUserName ? (
                                    <span className="text-sm text-surface-600 dark:text-surface-300">{log.targetUserName}</span>
                                  ) : (
                                    <span className="text-xs text-surface-400">—</span>
                                  )}
                                </td>
                                <td className="py-3 px-3">
                                  {log.details && Object.keys(log.details).length > 0 ? (
                                    <div className="text-xs text-surface-500 font-mono max-w-48 truncate" title={JSON.stringify(log.details)}>
                                      {Object.entries(log.details).slice(0, 2).map(([k, v]) => (
                                        <div key={k}><span className="text-surface-400">{k}:</span> {String(v)}</div>
                                      ))}
                                    </div>
                                  ) : (
                                    <span className="text-xs text-surface-400">—</span>
                                  )}
                                </td>
                                <td className="py-3 px-3">
                                  <span className="text-xs text-surface-400 font-mono">{log.ipAddress}</span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>

                      {/* Pagination */}
                      <div className="flex items-center justify-between mt-6 pt-4 border-t border-surface-200 dark:border-surface-700">
                        <p className="text-sm text-surface-500">
                          Showing {(auditPage - 1) * 15 + 1}–{Math.min(auditPage * 15, auditTotal)} of {auditTotal} events
                        </p>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setAuditPage(p => Math.max(1, p - 1))}
                            disabled={auditPage <= 1}
                            className="p-2 rounded-xl bg-surface-100 dark:bg-surface-800 text-surface-600 disabled:opacity-30 hover:bg-surface-200 dark:hover:bg-surface-700 transition-colors"
                          >
                            <HiOutlineChevronLeft className="w-4 h-4" />
                          </button>
                          <span className="text-sm font-medium text-surface-700 dark:text-surface-300 px-3">
                            {auditPage} / {auditTotalPages}
                          </span>
                          <button
                            onClick={() => setAuditPage(p => Math.min(auditTotalPages, p + 1))}
                            disabled={auditPage >= auditTotalPages}
                            className="p-2 rounded-xl bg-surface-100 dark:bg-surface-800 text-surface-600 disabled:opacity-30 hover:bg-surface-200 dark:hover:bg-surface-700 transition-colors"
                          >
                            <HiOutlineChevronRight className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}

            {/* === PLACEHOLDER SECTIONS === */}
            {!['users', 'audit'].includes(activeSection) && (
              <div className="glass-card p-16 text-center animate-fade-in-up">
                <HiOutlineDocumentChartBar className="w-16 h-16 text-surface-300 mx-auto mb-4" />
                <h3 className="text-lg font-display font-semibold text-surface-900 dark:text-white mb-2 capitalize">{activeSection.replace('-',' ')} Management</h3>
                <p className="text-surface-500">This section connects to the live API.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
