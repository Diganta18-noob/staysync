import { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ThemeSwitcher from './ThemeSwitcher';
import GlobalSearch from './GlobalSearch';
import {
  HiOutlineHome, HiOutlineBuildingOffice2, HiOutlineCalendarDays,
  HiOutlineWrenchScrewdriver, HiOutlineShieldCheck, HiOutlineUserCircle,
  HiOutlineBars3, HiOutlineXMark, HiOutlineArrowRightOnRectangle,
  HiOutlineBell,
  HiOutlineCheckCircle, HiOutlineCurrencyRupee, HiOutlineExclamationTriangle,
} from 'react-icons/hi2';

const navLinks = [
  { path: '/', label: 'Home', icon: HiOutlineHome, public: true },
  { path: '/properties', label: 'Properties', icon: HiOutlineBuildingOffice2, public: true },
  { path: '/dashboard', label: 'Dashboard', icon: HiOutlineHome, auth: true },
  { path: '/bookings', label: 'Bookings', icon: HiOutlineCalendarDays, auth: true },
  { path: '/maintenance', label: 'Maintenance', icon: HiOutlineWrenchScrewdriver, auth: true },
  { path: '/admin', label: 'Admin', icon: HiOutlineShieldCheck, admin: true },
];

const demoNotifications = [
  { id: 1, type: 'booking', title: 'New booking request', message: 'Amit Sharma requested Room A-102', time: '2m ago', read: false, icon: HiOutlineCalendarDays, color: 'text-blue-500 bg-blue-50 dark:bg-blue-900/30' },
  { id: 2, type: 'payment', title: 'Payment received', message: 'Rahul Verma paid ₹8,500 for rent', time: '15m ago', read: false, icon: HiOutlineCurrencyRupee, color: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-900/30' },
  { id: 3, type: 'maintenance', title: 'New maintenance ticket', message: 'AC not working — Room B-201', time: '1h ago', read: false, icon: HiOutlineWrenchScrewdriver, color: 'text-amber-500 bg-amber-50 dark:bg-amber-900/30' },
  { id: 4, type: 'kyc', title: 'KYC pending review', message: 'Neha Gupta submitted KYC documents', time: '2h ago', read: true, icon: HiOutlineShieldCheck, color: 'text-purple-500 bg-purple-50 dark:bg-purple-900/30' },
  { id: 5, type: 'alert', title: 'Rent overdue', message: 'Karan Singh — ₹9,500 overdue by 3 days', time: '5h ago', read: true, icon: HiOutlineExclamationTriangle, color: 'text-red-500 bg-red-50 dark:bg-red-900/30' },
];

const Navbar = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState(demoNotifications);
  const notifRef = useRef(null);

  const unreadCount = notifications.filter(n => !n.read).length;

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);



  useEffect(() => {
    setIsOpen(false);
    setShowNotifications(false);
  }, [location.pathname]);

  // Close notification dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredLinks = navLinks.filter((link) => {
    if (link.admin) return isAdmin;
    if (link.auth) return isAuthenticated;
    return link.public;
  });

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const markAsRead = (id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const clearNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-white/80 dark:bg-surface-900/80 backdrop-blur-xl shadow-glass border-b border-surface-200/50 dark:border-surface-700/50'
            : 'bg-transparent'
        }`}
      >
        <div className="w-full mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-18 gap-4">
            {/* Logo */}
            <div className="flex-1 flex justify-start">
              <Link to="/" className="flex items-center gap-2 group">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center shadow-lg shadow-primary-500/25 group-hover:shadow-primary-500/40 transition-shadow duration-300">
                  <span className="text-white font-bold text-sm">SS</span>
                </div>
                <span className="text-xl font-display font-bold text-surface-900 dark:text-white">
                  Stay<span className="gradient-text">Sync</span>
                </span>
              </Link>
            </div>

            {/* Desktop Nav */}
            <div className="hidden lg:flex flex-[2] justify-center items-center gap-2">
              {filteredLinks.map((link) => {
                const isActive = location.pathname === link.path;
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400'
                        : 'text-surface-600 dark:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-800 hover:text-surface-900 dark:hover:text-white'
                    }`}
                  >
                    <link.icon className="w-4 h-4" />
                    {link.label}
                  </Link>
                );
              })}
            </div>

            {/* Right side */}
            <div className="hidden lg:flex flex-1 justify-end items-center gap-3">
              <GlobalSearch />
              <ThemeSwitcher />

              {isAuthenticated && (
                <>
                  {/* Notification Bell */}
                  <div className="relative" ref={notifRef}>
                    <button
                      onClick={() => setShowNotifications(!showNotifications)}
                      className="relative p-2 rounded-xl text-surface-500 hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors"
                      title="Notifications"
                    >
                      <HiOutlineBell className="w-5 h-5" />
                      {unreadCount > 0 && (
                        <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 rounded-full text-[10px] text-white font-bold flex items-center justify-center animate-scale-in">
                          {unreadCount}
                        </span>
                      )}
                    </button>

                    {/* Notification Dropdown */}
                    {showNotifications && (
                      <div className="absolute right-0 top-full mt-2 w-96 bg-white dark:bg-surface-900 rounded-2xl shadow-2xl border border-surface-200 dark:border-surface-700 z-50 animate-fade-in-down overflow-hidden">
                        <div className="flex items-center justify-between px-5 py-4 border-b border-surface-100 dark:border-surface-800">
                          <h3 className="font-display font-bold text-surface-900 dark:text-white text-sm">
                            Notifications
                            {unreadCount > 0 && (
                              <span className="ml-2 px-2 py-0.5 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-xs rounded-full font-bold">
                                {unreadCount} new
                              </span>
                            )}
                          </h3>
                          {unreadCount > 0 && (
                            <button
                              onClick={markAllRead}
                              className="text-xs text-primary-600 hover:text-primary-700 font-semibold"
                            >
                              Mark all read
                            </button>
                          )}
                        </div>

                        <div className="max-h-96 overflow-y-auto">
                          {notifications.length === 0 ? (
                            <div className="py-10 text-center">
                              <HiOutlineBell className="w-10 h-10 text-surface-300 mx-auto mb-2" />
                              <p className="text-sm text-surface-500">No notifications</p>
                            </div>
                          ) : (
                            notifications.map((notif) => (
                              <div
                                key={notif.id}
                                className={`flex items-start gap-3 px-5 py-3.5 hover:bg-surface-50 dark:hover:bg-surface-800/50 transition-colors cursor-pointer border-b border-surface-50 dark:border-surface-800 last:border-0 ${
                                  !notif.read ? 'bg-primary-50/30 dark:bg-primary-900/10' : ''
                                }`}
                                onClick={() => markAsRead(notif.id)}
                              >
                                <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${notif.color}`}>
                                  <notif.icon className="w-4 h-4" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-start justify-between gap-2">
                                    <p className={`text-sm ${!notif.read ? 'font-semibold text-surface-900 dark:text-white' : 'font-medium text-surface-700 dark:text-surface-300'}`}>
                                      {notif.title}
                                    </p>
                                    <button
                                      onClick={(e) => { e.stopPropagation(); clearNotification(notif.id); }}
                                      className="text-surface-400 hover:text-red-500 transition-colors flex-shrink-0"
                                    >
                                      <HiOutlineXMark className="w-3.5 h-3.5" />
                                    </button>
                                  </div>
                                  <p className="text-xs text-surface-500 mt-0.5 truncate">{notif.message}</p>
                                  <p className="text-xs text-surface-400 mt-1">{notif.time}</p>
                                </div>
                                {!notif.read && (
                                  <div className="w-2 h-2 bg-primary-500 rounded-full flex-shrink-0 mt-2" />
                                )}
                              </div>
                            ))
                          )}
                        </div>

                        <div className="px-5 py-3 border-t border-surface-100 dark:border-surface-800 text-center">
                          <Link
                            to="/dashboard"
                            onClick={() => setShowNotifications(false)}
                            className="text-xs text-primary-600 hover:text-primary-700 font-semibold"
                          >
                            View all notifications →
                          </Link>
                        </div>
                      </div>
                    )}
                  </div>

                  <Link
                    to="/profile"
                    className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors"
                  >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-400 to-accent-400 flex items-center justify-center">
                      <span className="text-white text-xs font-bold">
                        {user?.name?.charAt(0)?.toUpperCase()}
                      </span>
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-medium text-surface-900 dark:text-white leading-none">
                        {user?.name}
                      </p>
                      <p className="text-xs text-surface-500 capitalize">{user?.role}</p>
                    </div>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="p-2 rounded-xl text-surface-500 hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-900/20 transition-colors"
                    title="Logout"
                  >
                    <HiOutlineArrowRightOnRectangle className="w-5 h-5" />
                  </button>
                </>
              )}

              {!isAuthenticated && (
                <div className="flex items-center gap-2">
                  <Link to="/login" className="btn-ghost text-sm py-2 px-4">
                    Sign In
                  </Link>
                  <Link to="/register" className="btn-primary text-sm py-2 px-4">
                    Get Started
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="lg:hidden p-2 rounded-xl text-surface-600 dark:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors"
            >
              {isOpen ? <HiOutlineXMark className="w-6 h-6" /> : <HiOutlineBars3 className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isOpen && (
          <div className="lg:hidden bg-white/95 dark:bg-surface-900/95 backdrop-blur-xl border-t border-surface-200/50 dark:border-surface-700/50 animate-fade-in-down">
            <div className="px-4 py-4 space-y-1">
              {filteredLinks.map((link) => {
                const isActive = location.pathname === link.path;
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400'
                        : 'text-surface-600 dark:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-800'
                    }`}
                  >
                    <link.icon className="w-5 h-5" />
                    {link.label}
                  </Link>
                );
              })}

              <div className="pt-3 border-t border-surface-200 dark:border-surface-700">
                {isAuthenticated ? (
                  <>
                    <Link
                      to="/profile"
                      className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-surface-600 dark:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-800"
                    >
                      <HiOutlineUserCircle className="w-5 h-5" />
                      Profile
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
                    >
                      <HiOutlineArrowRightOnRectangle className="w-5 h-5" />
                      Logout
                    </button>
                  </>
                ) : (
                  <div className="flex gap-2 pt-2">
                    <Link to="/login" className="btn-secondary text-sm flex-1 justify-center py-2.5">
                      Sign In
                    </Link>
                    <Link to="/register" className="btn-primary text-sm flex-1 justify-center py-2.5">
                      Get Started
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Spacer */}
      <div className="h-16 lg:h-18" />
    </>
  );
};

export default Navbar;
