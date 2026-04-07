import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  HiOutlineHome, HiOutlineBuildingOffice2, HiOutlineCalendarDays,
  HiOutlineWrenchScrewdriver, HiOutlineShieldCheck, HiOutlineUserCircle,
  HiOutlineBars3, HiOutlineXMark, HiOutlineArrowRightOnRectangle,
  HiOutlineSun, HiOutlineMoon,
} from 'react-icons/hi2';

const navLinks = [
  { path: '/', label: 'Home', icon: HiOutlineHome, public: true },
  { path: '/properties', label: 'Properties', icon: HiOutlineBuildingOffice2, public: true },
  { path: '/dashboard', label: 'Dashboard', icon: HiOutlineHome, auth: true },
  { path: '/bookings', label: 'Bookings', icon: HiOutlineCalendarDays, auth: true },
  { path: '/maintenance', label: 'Maintenance', icon: HiOutlineWrenchScrewdriver, auth: true },
  { path: '/admin', label: 'Admin', icon: HiOutlineShieldCheck, admin: true },
];

const Navbar = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  const filteredLinks = navLinks.filter((link) => {
    if (link.admin) return isAdmin;
    if (link.auth) return isAuthenticated;
    return link.public;
  });

  const handleLogout = () => {
    logout();
    navigate('/');
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-18">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 group">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center shadow-lg shadow-primary-500/25 group-hover:shadow-primary-500/40 transition-shadow duration-300">
                <span className="text-white font-bold text-sm">SS</span>
              </div>
              <span className="text-xl font-display font-bold text-surface-900 dark:text-white">
                Stay<span className="gradient-text">Sync</span>
              </span>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden lg:flex items-center gap-1">
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
            <div className="hidden lg:flex items-center gap-3">
              <button
                onClick={() => setDarkMode(!darkMode)}
                className="p-2 rounded-xl text-surface-500 hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors"
                title="Toggle dark mode"
              >
                {darkMode ? <HiOutlineSun className="w-5 h-5" /> : <HiOutlineMoon className="w-5 h-5" />}
              </button>

              {isAuthenticated ? (
                <div className="flex items-center gap-3">
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
                </div>
              ) : (
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
