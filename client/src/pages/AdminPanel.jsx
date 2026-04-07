import { useState } from 'react';
import {
  HiOutlineUserGroup, HiOutlineBuildingOffice2, HiOutlineCurrencyRupee,
  HiOutlineShieldCheck, HiOutlineCog6Tooth, HiOutlineDocumentChartBar,
  HiOutlineMagnifyingGlass, HiOutlineCheckCircle, HiOutlineXCircle,
} from 'react-icons/hi2';

const demoUsers = [
  { id: 1, name: 'Amit Sharma', email: 'amit@email.com', role: 'resident', kycStatus: 'verified', joined: 'Mar 15, 2026', avatar: 'AS' },
  { id: 2, name: 'Neha Gupta', email: 'neha@email.com', role: 'resident', kycStatus: 'pending', joined: 'Mar 28, 2026', avatar: 'NG' },
  { id: 3, name: 'Vikram Kapoor', email: 'vikram@email.com', role: 'owner', kycStatus: 'verified', joined: 'Feb 10, 2026', avatar: 'VK' },
  { id: 4, name: 'Priya Patel', email: 'priya@email.com', role: 'resident', kycStatus: 'rejected', joined: 'Apr 1, 2026', avatar: 'PP' },
];

const sections = [
  { key: 'users', label: 'User Ledger', icon: HiOutlineUserGroup },
  { key: 'revenue', label: 'Revenue Audit', icon: HiOutlineCurrencyRupee },
  { key: 'kyc', label: 'KYC Queue', icon: HiOutlineShieldCheck },
  { key: 'settings', label: 'Settings', icon: HiOutlineCog6Tooth },
];

const AdminPanel = () => {
  const [activeSection, setActiveSection] = useState('users');
  const [searchUser, setSearchUser] = useState('');

  const filteredUsers = demoUsers.filter((u) =>
    u.name.toLowerCase().includes(searchUser.toLowerCase())
  );

  const kycBadge = (s) => s === 'verified' ? 'badge-success' : s === 'pending' ? 'badge-warning' : 'badge-danger';

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
              <p className="text-surface-500 text-sm">Full platform access</p>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-5 gap-6">
          <div className="lg:col-span-1">
            <div className="glass-card p-3 space-y-1">
              {sections.map((s) => (
                <button key={s.key} onClick={() => setActiveSection(s.key)} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${activeSection === s.key ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-600' : 'text-surface-600 dark:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-800'}`}>
                  <s.icon className="w-5 h-5" />{s.label}
                </button>
              ))}
            </div>
          </div>

          <div className="lg:col-span-4">
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
            {activeSection !== 'users' && (
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
