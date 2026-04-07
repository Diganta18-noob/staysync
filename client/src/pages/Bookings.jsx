import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  HiOutlineCalendarDays, HiOutlineCheckCircle,
  HiOutlineXCircle, HiOutlineClock, HiOutlineBuildingOffice2,
  HiOutlineUser, HiOutlineArrowPath,
} from 'react-icons/hi2';

const tabs = [
  { key: 'pending', label: 'Pending', icon: HiOutlineClock, color: 'text-amber-500' },
  { key: 'approved', label: 'Approved', icon: HiOutlineCheckCircle, color: 'text-emerald-500' },
  { key: 'rejected', label: 'Rejected', icon: HiOutlineXCircle, color: 'text-red-500' },
];

const initialBookings = {
  pending: [
    { id: 1, name: 'Amit Sharma', room: 'A-102', type: 'Move-in', date: 'Apr 15, 2026', rent: '₹8,500', deposit: '₹8,500', proRata: '₹4,250', avatar: 'AS', property: 'Sunrise PG' },
    { id: 2, name: 'Neha Gupta', room: 'B-201', type: 'Move-in', date: 'Apr 18, 2026', rent: '₹14,000', deposit: '₹14,000', proRata: '₹6,067', avatar: 'NG', property: 'Sunrise PG' },
  ],
  approved: [
    { id: 3, name: 'Rahul Verma', room: 'A-201', type: 'Move-in', date: 'Apr 1, 2026', rent: '₹8,500', deposit: '₹8,500', proRata: '₹8,500', avatar: 'RV', property: 'Sunrise PG', paymentStatus: 'paid' },
    { id: 4, name: 'Priya Patel', room: 'B-101', type: 'Move-in', date: 'Mar 25, 2026', rent: '₹6,500', deposit: '₹6,500', proRata: '₹1,300', avatar: 'PP', property: 'Sunrise PG', paymentStatus: 'paid' },
  ],
  rejected: [
    { id: 5, name: 'Karan Singh', room: 'A-101', type: 'Move-in', date: 'Apr 5, 2026', rent: '₹12,000', deposit: '₹12,000', proRata: '₹10,400', avatar: 'KS', property: 'Sunrise PG', reason: 'KYC not verified' },
  ],
};

const Bookings = () => {
  const { isOwner, isAdmin } = useAuth();
  const [activeTab, setActiveTab] = useState('pending');
  const [bookingsData, setBookingsData] = useState(initialBookings);
  const [actionMessage, setActionMessage] = useState(null);

  const bookings = bookingsData[activeTab];

  const showMessage = (msg, type = 'success') => {
    setActionMessage({ msg, type });
    setTimeout(() => setActionMessage(null), 3000);
  };

  const handleApprove = (booking) => {
    setBookingsData(prev => ({
      ...prev,
      [activeTab]: prev[activeTab].filter(b => b.id !== booking.id),
      approved: [...prev.approved, { ...booking, paymentStatus: 'pending', reason: undefined }],
    }));
    showMessage(`${booking.name}'s booking has been approved!`);
  };

  const handleReject = (booking) => {
    setBookingsData(prev => ({
      ...prev,
      pending: prev.pending.filter(b => b.id !== booking.id),
      rejected: [...prev.rejected, { ...booking, reason: 'Rejected by admin' }],
    }));
    showMessage(`${booking.name}'s booking has been rejected.`, 'warning');
  };

  const handleReApprove = (booking) => {
    setBookingsData(prev => ({
      ...prev,
      rejected: prev.rejected.filter(b => b.id !== booking.id),
      approved: [...prev.approved, { ...booking, paymentStatus: 'pending', reason: undefined }],
    }));
    showMessage(`${booking.name}'s booking has been re-approved!`);
  };

  const handleMoveToPending = (booking) => {
    setBookingsData(prev => ({
      ...prev,
      rejected: prev.rejected.filter(b => b.id !== booking.id),
      pending: [...prev.pending, { ...booking, reason: undefined }],
    }));
    showMessage(`${booking.name}'s booking moved back to pending.`);
  };

  return (
    <div className="min-h-screen bg-surface-50 dark:bg-surface-950 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8 animate-fade-in">
          <h1 className="text-2xl lg:text-3xl font-display font-bold text-surface-900 dark:text-white">
            Bookings
          </h1>
          <p className="text-surface-500 mt-1">Manage and track all booking requests</p>
        </div>

        {/* Action message toast */}
        {actionMessage && (
          <div className={`fixed top-20 right-4 z-50 px-6 py-3 rounded-xl shadow-xl text-sm font-medium animate-fade-in-down ${
            actionMessage.type === 'success'
              ? 'bg-emerald-500 text-white'
              : 'bg-amber-500 text-white'
          }`}>
            {actionMessage.msg}
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-1 p-1 bg-surface-100 dark:bg-surface-800 rounded-2xl mb-8 w-fit animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                activeTab === tab.key
                  ? 'bg-white dark:bg-surface-700 text-surface-900 dark:text-white shadow-sm'
                  : 'text-surface-500 hover:text-surface-700'
              }`}
            >
              <tab.icon className={`w-4 h-4 ${activeTab === tab.key ? tab.color : ''}`} />
              {tab.label}
              <span className={`ml-1 px-2 py-0.5 rounded-full text-xs ${
                activeTab === tab.key
                  ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-600'
                  : 'bg-surface-200 dark:bg-surface-700 text-surface-500'
              }`}>
                {bookingsData[tab.key].length}
              </span>
            </button>
          ))}
        </div>

        {/* Booking Cards */}
        <div className="space-y-4">
          {bookings.length === 0 ? (
            <div className="glass-card p-16 text-center">
              <HiOutlineCalendarDays className="w-16 h-16 text-surface-300 dark:text-surface-600 mx-auto mb-4" />
              <h3 className="text-lg font-display font-semibold text-surface-900 dark:text-white mb-2">
                No {activeTab} bookings
              </h3>
              <p className="text-surface-500">Booking requests will appear here.</p>
            </div>
          ) : (
            bookings.map((booking, i) => (
              <div
                key={booking.id}
                className="glass-card p-6 animate-fade-in-up"
                style={{ animationDelay: `${(i + 2) * 0.1}s` }}
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  {/* Left — Tenant info */}
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-400 to-accent-400 flex items-center justify-center flex-shrink-0">
                      <span className="text-white font-bold">{booking.avatar}</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-surface-900 dark:text-white">{booking.name}</h3>
                      <div className="flex items-center gap-3 text-sm text-surface-500 mt-0.5">
                        <span className="flex items-center gap-1">
                          <HiOutlineBuildingOffice2 className="w-3.5 h-3.5" />
                          {booking.property}
                        </span>
                        <span className="flex items-center gap-1">
                          <HiOutlineUser className="w-3.5 h-3.5" />
                          Room {booking.room}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Middle — Details */}
                  <div className="flex flex-wrap gap-3">
                    <div className="px-3 py-1.5 rounded-lg bg-surface-100 dark:bg-surface-800">
                      <p className="text-xs text-surface-500 uppercase">Type</p>
                      <p className="text-sm font-semibold text-surface-900 dark:text-white">{booking.type}</p>
                    </div>
                    <div className="px-3 py-1.5 rounded-lg bg-surface-100 dark:bg-surface-800">
                      <p className="text-xs text-surface-500 uppercase">Date</p>
                      <p className="text-sm font-semibold text-surface-900 dark:text-white">{booking.date}</p>
                    </div>
                    <div className="px-3 py-1.5 rounded-lg bg-surface-100 dark:bg-surface-800">
                      <p className="text-xs text-surface-500 uppercase">Rent</p>
                      <p className="text-sm font-semibold text-surface-900 dark:text-white">{booking.rent}</p>
                    </div>
                    <div className="px-3 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-900/20">
                      <p className="text-xs text-surface-500 uppercase">Pro-Rata</p>
                      <p className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">{booking.proRata}</p>
                    </div>
                  </div>

                  {/* Right — Actions */}
                  <div className="flex items-center gap-2">
                    {activeTab === 'pending' && (isOwner || isAdmin) && (
                      <>
                        <button
                          onClick={() => handleApprove(booking)}
                          className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-sm font-semibold transition-colors"
                        >
                          Accept
                        </button>
                        <button
                          onClick={() => handleReject(booking)}
                          className="px-5 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-xl text-sm font-semibold transition-colors"
                        >
                          Reject
                        </button>
                      </>
                    )}
                    {activeTab === 'approved' && (
                      <span className="badge-success">
                        <HiOutlineCheckCircle className="w-3.5 h-3.5" />
                        {booking.paymentStatus === 'paid' ? 'Paid' : 'Approved'}
                      </span>
                    )}
                    {activeTab === 'rejected' && (
                      <div className="flex flex-col items-end gap-2">
                        <div className="text-right">
                          <span className="badge-danger mb-1">Rejected</span>
                          {booking.reason && (
                            <p className="text-xs text-surface-500">{booking.reason}</p>
                          )}
                        </div>
                        {(isOwner || isAdmin) && (
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleMoveToPending(booking)}
                              className="flex items-center gap-1.5 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-semibold transition-colors"
                            >
                              <HiOutlineArrowPath className="w-3.5 h-3.5" />
                              Move to Pending
                            </button>
                            <button
                              onClick={() => handleReApprove(booking)}
                              className="flex items-center gap-1.5 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-xs font-semibold transition-colors"
                            >
                              <HiOutlineCheckCircle className="w-3.5 h-3.5" />
                              Re-Approve
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Bookings;
