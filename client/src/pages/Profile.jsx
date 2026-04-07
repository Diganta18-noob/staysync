import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  HiOutlineUserCircle, HiOutlineShieldCheck, HiOutlineCalendarDays,
  HiOutlineMoon, HiOutlineQrCode, HiOutlineArrowUpTray,
  HiOutlineCheckCircle, HiOutlinePencilSquare,
} from 'react-icons/hi2';

const Profile = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [mealToday, setMealToday] = useState({ breakfast: true, lunch: true, dinner: true });
  const [leaveForm, setLeaveForm] = useState({ fromDate: '', toDate: '', reason: '' });
  const [guestForm, setGuestForm] = useState({ name: '', phone: '', relation: '' });

  const tabs = [
    { key: 'profile', label: 'Profile', icon: HiOutlineUserCircle },
    { key: 'kyc', label: 'KYC', icon: HiOutlineShieldCheck },
    { key: 'meals', label: 'Meals', icon: '🍽️' },
    { key: 'leave', label: 'Leave Log', icon: HiOutlineMoon },
    { key: 'guest', label: 'Guest Pass', icon: HiOutlineQrCode },
  ];

  return (
    <div className="min-h-screen bg-surface-50 dark:bg-surface-950 pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Header */}
        <div className="glass-card p-8 mb-6 animate-fade-in">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-primary-400 to-accent-500 flex items-center justify-center shadow-xl">
              <span className="text-white text-3xl font-bold">{user?.name?.charAt(0)?.toUpperCase()}</span>
            </div>
            <div className="text-center sm:text-left">
              <h1 className="text-2xl font-display font-bold text-surface-900 dark:text-white">{user?.name || 'User'}</h1>
              <p className="text-surface-500">{user?.email || 'user@email.com'}</p>
              <div className="flex items-center gap-2 mt-2 justify-center sm:justify-start">
                <span className="badge-primary capitalize">{user?.role || 'resident'}</span>
                <span className={user?.kycStatus === 'verified' ? 'badge-success' : 'badge-warning'}>
                  KYC: {user?.kycStatus || 'pending'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 p-1 bg-surface-100 dark:bg-surface-800 rounded-2xl mb-6 overflow-x-auto animate-fade-in-up">
          {tabs.map((tab) => (
            <button key={tab.key} onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                activeTab === tab.key ? 'bg-white dark:bg-surface-700 text-surface-900 dark:text-white shadow-sm' : 'text-surface-500 hover:text-surface-700'
              }`}>
              {typeof tab.icon === 'string' ? <span>{tab.icon}</span> : <tab.icon className="w-4 h-4" />}
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="animate-fade-in-up" style={{ animationDelay: '0.15s' }}>
          {activeTab === 'profile' && (
            <div className="glass-card p-6 space-y-4">
              <h2 className="text-lg font-display font-bold text-surface-900 dark:text-white mb-4">Personal Information</h2>
              {[
                { label: 'Full Name', value: user?.name || 'John Doe' },
                { label: 'Email', value: user?.email || 'john@email.com' },
                { label: 'Phone', value: user?.phone || '9876543210' },
                { label: 'Role', value: user?.role || 'resident' },
              ].map((field) => (
                <div key={field.label} className="flex items-center justify-between p-4 rounded-xl bg-surface-50 dark:bg-surface-800/50">
                  <div>
                    <p className="text-xs text-surface-500 uppercase tracking-wider">{field.label}</p>
                    <p className="text-sm font-medium text-surface-900 dark:text-white capitalize">{field.value}</p>
                  </div>
                  <button className="p-2 rounded-lg hover:bg-surface-200 dark:hover:bg-surface-700 text-surface-400 transition-colors">
                    <HiOutlinePencilSquare className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'kyc' && (
            <div className="glass-card p-6">
              <h2 className="text-lg font-display font-bold text-surface-900 dark:text-white mb-4">KYC Verification</h2>
              <div className="border-2 border-dashed border-surface-300 dark:border-surface-600 rounded-2xl p-10 text-center hover:border-primary-400 transition-colors cursor-pointer">
                <HiOutlineArrowUpTray className="w-10 h-10 text-surface-400 mx-auto mb-3" />
                <p className="font-medium text-surface-700 dark:text-surface-300">Upload Aadhar / Passport</p>
                <p className="text-sm text-surface-400 mt-1">PDF, JPG, or PNG (max 5MB)</p>
              </div>
              <div className="mt-4 p-4 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800">
                <p className="text-sm text-amber-700 dark:text-amber-300 flex items-center gap-2">
                  <HiOutlineShieldCheck className="w-5 h-5" /> Your KYC is pending verification. Upload required documents.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'meals' && (
            <div className="glass-card p-6">
              <h2 className="text-lg font-display font-bold text-surface-900 dark:text-white mb-4">Today's Meals</h2>
              <p className="text-sm text-surface-500 mb-6">Toggle off to skip a meal. Helps reduce food waste 🌿</p>
              <div className="space-y-3">
                {[
                  { key: 'breakfast', label: 'Breakfast', time: '7:30 - 9:00 AM', emoji: '🍳' },
                  { key: 'lunch', label: 'Lunch', time: '12:30 - 2:00 PM', emoji: '🍛' },
                  { key: 'dinner', label: 'Dinner', time: '7:30 - 9:30 PM', emoji: '🍲' },
                ].map((meal) => (
                  <div key={meal.key} className="flex items-center justify-between p-4 rounded-xl bg-surface-50 dark:bg-surface-800/50">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{meal.emoji}</span>
                      <div>
                        <p className="font-medium text-surface-900 dark:text-white">{meal.label}</p>
                        <p className="text-xs text-surface-500">{meal.time}</p>
                      </div>
                    </div>
                    <button onClick={() => setMealToday((p) => ({ ...p, [meal.key]: !p[meal.key] }))}
                      className={`w-14 h-8 rounded-full transition-all relative ${mealToday[meal.key] ? 'bg-emerald-500' : 'bg-surface-300 dark:bg-surface-600'}`}>
                      <div className={`w-6 h-6 bg-white rounded-full shadow-md absolute top-1 transition-all ${mealToday[meal.key] ? 'left-7' : 'left-1'}`} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'leave' && (
            <div className="glass-card p-6">
              <h2 className="text-lg font-display font-bold text-surface-900 dark:text-white mb-4">Night Out / Leave Log</h2>
              <form className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1.5">From</label>
                    <input type="date" value={leaveForm.fromDate} onChange={(e) => setLeaveForm({ ...leaveForm, fromDate: e.target.value })} className="input-field" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1.5">To</label>
                    <input type="date" value={leaveForm.toDate} onChange={(e) => setLeaveForm({ ...leaveForm, toDate: e.target.value })} className="input-field" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1.5">Reason</label>
                  <textarea value={leaveForm.reason} onChange={(e) => setLeaveForm({ ...leaveForm, reason: e.target.value })} className="input-field min-h-[80px] resize-none" placeholder="Going home for weekend..." />
                </div>
                <button type="submit" className="btn-primary">Submit Leave Request</button>
              </form>
            </div>
          )}

          {activeTab === 'guest' && (
            <div className="glass-card p-6">
              <h2 className="text-lg font-display font-bold text-surface-900 dark:text-white mb-4">Guest Pre-Approval</h2>
              <form className="space-y-4 mb-8">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1.5">Guest Name</label>
                    <input value={guestForm.name} onChange={(e) => setGuestForm({ ...guestForm, name: e.target.value })} className="input-field" placeholder="Parent/Friend name" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1.5">Phone</label>
                    <input value={guestForm.phone} onChange={(e) => setGuestForm({ ...guestForm, phone: e.target.value })} className="input-field" placeholder="9876543210" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1.5">Relation</label>
                  <select value={guestForm.relation} onChange={(e) => setGuestForm({ ...guestForm, relation: e.target.value })} className="input-field">
                    <option value="">Select relation</option>
                    <option value="parent">Parent</option>
                    <option value="sibling">Sibling</option>
                    <option value="friend">Friend</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <button type="submit" className="btn-primary">
                  <HiOutlineQrCode className="w-5 h-5" /> Generate Guest QR
                </button>
              </form>
              <div className="p-8 rounded-2xl bg-surface-50 dark:bg-surface-800/50 text-center">
                <div className="w-40 h-40 mx-auto bg-white rounded-2xl border-2 border-surface-200 flex items-center justify-center mb-3">
                  <HiOutlineQrCode className="w-24 h-24 text-surface-300" />
                </div>
                <p className="text-sm text-surface-500">QR code will appear here after generation</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
