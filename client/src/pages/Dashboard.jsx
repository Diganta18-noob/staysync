import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  HiOutlineCurrencyRupee, HiOutlineClipboardDocumentCheck,
  HiOutlineBuildingOffice2, HiOutlineUserGroup,
  HiOutlineArrowTrendingUp, HiOutlineArrowTrendingDown,
  HiOutlineEllipsisHorizontal, HiOutlineBell,
  HiOutlineCreditCard, HiOutlineShieldCheck,
} from 'react-icons/hi2';

const statCards = [
  {
    label: 'Total Revenue',
    value: '₹4,52,800',
    change: '+12.5%',
    trend: 'up',
    icon: HiOutlineCurrencyRupee,
    color: 'from-emerald-500 to-teal-600',
    bgLight: 'bg-emerald-50 dark:bg-emerald-900/20',
  },
  {
    label: 'Active Tasks',
    value: '18',
    change: '-3',
    trend: 'down',
    icon: HiOutlineClipboardDocumentCheck,
    color: 'from-blue-500 to-indigo-600',
    bgLight: 'bg-blue-50 dark:bg-blue-900/20',
  },
  {
    label: 'Occupancy Rate',
    value: '87%',
    change: '+2.3%',
    trend: 'up',
    icon: HiOutlineBuildingOffice2,
    color: 'from-violet-500 to-purple-600',
    bgLight: 'bg-violet-50 dark:bg-violet-900/20',
  },
  {
    label: 'Total Tenants',
    value: '156',
    change: '+8',
    trend: 'up',
    icon: HiOutlineUserGroup,
    color: 'from-amber-500 to-orange-600',
    bgLight: 'bg-amber-50 dark:bg-amber-900/20',
  },
];

const recentTransactions = [
  { id: 1, name: 'Amit Sharma', type: 'Rent Payment', amount: '₹8,500', status: 'paid', date: 'Apr 6, 2026', avatar: 'AS' },
  { id: 2, name: 'Neha Gupta', type: 'Security Deposit', amount: '₹12,000', status: 'paid', date: 'Apr 5, 2026', avatar: 'NG' },
  { id: 3, name: 'Rahul Verma', type: 'Rent Payment', amount: '₹7,000', status: 'pending', date: 'Apr 4, 2026', avatar: 'RV' },
  { id: 4, name: 'Priya Patel', type: 'Electricity Bill', amount: '₹1,250', status: 'paid', date: 'Apr 3, 2026', avatar: 'PP' },
  { id: 5, name: 'Karan Singh', type: 'Rent Payment', amount: '₹9,500', status: 'failed', date: 'Apr 2, 2026', avatar: 'KS' },
];

const pendingKyc = [
  { name: 'Ravi Kumar', room: 'A-201', days: 3 },
  { name: 'Meena Das', room: 'B-105', days: 1 },
  { name: 'Suresh Nair', room: 'C-310', days: 5 },
];

const Dashboard = () => {
  const { user } = useAuth();
  const [selectedPeriod, setSelectedPeriod] = useState('month');

  const getStatusBadge = (status) => {
    switch (status) {
      case 'paid': return 'badge-success';
      case 'pending': return 'badge-warning';
      case 'failed': return 'badge-danger';
      default: return 'badge-primary';
    }
  };

  return (
    <div className="min-h-screen bg-surface-50 dark:bg-surface-950 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div className="animate-fade-in">
            <h1 className="text-2xl lg:text-3xl font-display font-bold text-surface-900 dark:text-white">
              Welcome back, {user?.name?.split(' ')[0]} 👋
            </h1>
            <p className="text-surface-500 mt-1">
              Here's what's happening with your properties today.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex bg-surface-100 dark:bg-surface-800 rounded-xl p-1">
              {['week', 'month', 'year'].map((period) => (
                <button
                  key={period}
                  onClick={() => setSelectedPeriod(period)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    selectedPeriod === period
                      ? 'bg-white dark:bg-surface-700 text-surface-900 dark:text-white shadow-sm'
                      : 'text-surface-500 hover:text-surface-700'
                  }`}
                >
                  {period.charAt(0).toUpperCase() + period.slice(1)}
                </button>
              ))}
            </div>
            <button className="relative p-2.5 rounded-xl bg-surface-100 dark:bg-surface-800 text-surface-600 dark:text-surface-300 hover:bg-surface-200 dark:hover:bg-surface-700 transition-colors">
              <HiOutlineBell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
            </button>
          </div>
        </div>

        {/* Role badge */}
        <div className="mb-6 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
          <span className="badge-primary capitalize">{user?.role}</span>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-8">
          {statCards.map((stat, i) => (
            <div
              key={stat.label}
              className="stat-card animate-fade-in-up group"
              style={{ animationDelay: `${(i + 1) * 0.1}s` }}
            >
              <div className="flex items-center justify-between">
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
                <button className="p-1 rounded-lg text-surface-400 hover:bg-surface-100 dark:hover:bg-surface-700 transition-colors">
                  <HiOutlineEllipsisHorizontal className="w-5 h-5" />
                </button>
              </div>
              <div>
                <p className="text-sm text-surface-500 font-medium">{stat.label}</p>
                <p className="text-2xl font-display font-bold text-surface-900 dark:text-white mt-1">
                  {stat.value}
                </p>
              </div>
              <div className={`flex items-center gap-1 text-sm font-medium ${
                stat.trend === 'up' ? 'text-emerald-600' : 'text-red-500'
              }`}>
                {stat.trend === 'up' ? (
                  <HiOutlineArrowTrendingUp className="w-4 h-4" />
                ) : (
                  <HiOutlineArrowTrendingDown className="w-4 h-4" />
                )}
                <span>{stat.change}</span>
                <span className="text-surface-400 font-normal">vs last {selectedPeriod}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Recent Transactions */}
          <div className="lg:col-span-2 glass-card p-6 animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-display font-bold text-surface-900 dark:text-white">
                Recent Transactions
              </h2>
              <Link to="/bookings" className="text-sm text-primary-600 hover:text-primary-500 font-medium">
                View all
              </Link>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-surface-200 dark:border-surface-700">
                    <th className="text-left text-xs font-semibold text-surface-500 uppercase tracking-wider py-3 px-2">
                      Tenant
                    </th>
                    <th className="text-left text-xs font-semibold text-surface-500 uppercase tracking-wider py-3 px-2">
                      Type
                    </th>
                    <th className="text-left text-xs font-semibold text-surface-500 uppercase tracking-wider py-3 px-2">
                      Amount
                    </th>
                    <th className="text-left text-xs font-semibold text-surface-500 uppercase tracking-wider py-3 px-2">
                      Status
                    </th>
                    <th className="text-left text-xs font-semibold text-surface-500 uppercase tracking-wider py-3 px-2">
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-100 dark:divide-surface-800">
                  {recentTransactions.map((tx) => (
                    <tr key={tx.id} className="hover:bg-surface-50 dark:hover:bg-surface-800/50 transition-colors">
                      <td className="py-3 px-2">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary-400 to-accent-400 flex items-center justify-center flex-shrink-0">
                            <span className="text-white text-xs font-bold">{tx.avatar}</span>
                          </div>
                          <span className="text-sm font-medium text-surface-900 dark:text-white">{tx.name}</span>
                        </div>
                      </td>
                      <td className="py-3 px-2 text-sm text-surface-500">{tx.type}</td>
                      <td className="py-3 px-2 text-sm font-semibold text-surface-900 dark:text-white">{tx.amount}</td>
                      <td className="py-3 px-2">
                        <span className={getStatusBadge(tx.status)}>{tx.status}</span>
                      </td>
                      <td className="py-3 px-2 text-sm text-surface-500">{tx.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Auto-Pay Card */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary-600 to-accent-600 p-6 text-white animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
              <div className="absolute inset-0 bg-card-shine animate-shimmer" />
              <div className="relative z-10">
                <HiOutlineCreditCard className="w-8 h-8 mb-3" />
                <h3 className="font-display font-bold text-lg mb-1">Enable Auto-Pay</h3>
                <p className="text-sm text-white/80 mb-4">
                  Set up automatic rent collection. Never chase payments again.
                </p>
                <Link to="/profile" className="inline-block px-4 py-2 bg-white/20 hover:bg-white/30 rounded-xl text-sm font-semibold transition-colors">
                  Set Up →
                </Link>
              </div>
            </div>

            {/* Pending KYC */}
            <div className="glass-card p-6 animate-fade-in-up" style={{ animationDelay: '0.7s' }}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-display font-bold text-surface-900 dark:text-white flex items-center gap-2">
                  <HiOutlineShieldCheck className="w-5 h-5 text-amber-500" />
                  Pending KYC
                </h3>
                <span className="badge-warning">{pendingKyc.length}</span>
              </div>
              <div className="space-y-3">
                {pendingKyc.map((item) => (
                  <div key={item.name} className="flex items-center justify-between p-3 rounded-xl bg-surface-50 dark:bg-surface-800/50">
                    <div>
                      <p className="text-sm font-medium text-surface-900 dark:text-white">{item.name}</p>
                      <p className="text-xs text-surface-500">Room {item.room}</p>
                    </div>
                    <span className="text-xs text-amber-600 dark:text-amber-400 font-medium">
                      {item.days}d ago
                    </span>
                  </div>
                ))}
              </div>
              <Link to="/admin" className="block text-center w-full mt-4 text-sm text-primary-600 hover:text-primary-500 font-medium">
                Review All →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
