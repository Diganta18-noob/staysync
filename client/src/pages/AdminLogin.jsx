import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  HiOutlineShieldCheck, HiOutlineEnvelope, HiOutlineLockClosed,
  HiOutlineEye, HiOutlineEyeSlash, HiOutlineCommandLine,
  HiOutlineFingerPrint, HiOutlineServerStack,
} from 'react-icons/hi2';

const AdminLogin = () => {
  const { adminLogin } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await adminLogin(formData.email, formData.password);
      navigate('/admin');
    } catch (err) {
      setError(err.response?.data?.message || 'Admin login failed. Invalid credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Admin branding */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-surface-900 via-surface-800 to-red-950 p-12 flex-col justify-between overflow-hidden">
        <div className="absolute inset-0 bg-card-shine animate-shimmer opacity-30" />
        <div className="absolute top-20 -left-20 w-80 h-80 bg-red-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 -right-20 w-96 h-96 bg-red-600/5 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] border border-red-500/5 rounded-full" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] border border-red-500/10 rounded-full" />

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500 to-rose-600 flex items-center justify-center shadow-lg shadow-red-500/20">
              <HiOutlineShieldCheck className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-display font-bold text-white">StaySync Admin</span>
          </div>
        </div>

        <div className="relative z-10 max-w-md">
          <div className="flex items-center gap-2 mb-6">
            <HiOutlineCommandLine className="w-5 h-5 text-red-400" />
            <span className="text-sm font-mono text-red-400">admin@staysync.com</span>
          </div>
          <h2 className="text-3xl font-display font-bold text-white leading-tight mb-4">
            System Administrator<br />Control Panel
          </h2>
          <p className="text-surface-400 text-sm leading-relaxed">
            Full platform access including user management, audit trail, KYC verification,
            revenue monitoring, and system configuration.
          </p>

          <div className="mt-8 grid grid-cols-2 gap-3">
            {[
              { icon: HiOutlineFingerPrint, label: 'KYC Management' },
              { icon: HiOutlineServerStack, label: 'System Audit' },
              { icon: HiOutlineShieldCheck, label: 'Role Control' },
              { icon: HiOutlineCommandLine, label: 'Activity Logs' },
            ].map(item => (
              <div key={item.label} className="flex items-center gap-2 p-3 rounded-xl bg-white/5 border border-white/10">
                <item.icon className="w-4 h-4 text-red-400" />
                <span className="text-xs font-medium text-surface-300">{item.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10 flex items-center gap-6 text-surface-500 text-xs font-mono">
          <span>v1.0.0</span>
          <span>•</span>
          <span>Restricted Access</span>
          <span>•</span>
          <span>All actions logged</span>
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 bg-white dark:bg-surface-950">
        <div className="w-full max-w-md animate-fade-in">
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-red-500 to-rose-600 flex items-center justify-center">
              <HiOutlineShieldCheck className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-display font-bold text-surface-900 dark:text-white">Admin Portal</span>
          </div>

          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-1 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-xs font-bold rounded-lg uppercase tracking-wider">
              Restricted
            </span>
          </div>

          <h1 className="text-3xl font-display font-bold text-surface-900 dark:text-white mb-2">
            Admin Login
          </h1>
          <p className="text-surface-500 mb-8">
            Enter your administrator credentials to access the control panel.
          </p>

          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm animate-scale-in flex items-center gap-2">
              <HiOutlineShieldCheck className="w-5 h-5 shrink-0" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                Admin Email
              </label>
              <div className="relative">
                <HiOutlineEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-surface-400" />
                <input
                  id="admin-email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="input-field pl-12"
                  placeholder="admin@staysync.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                Admin Password
              </label>
              <div className="relative">
                <HiOutlineLockClosed className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-surface-400" />
                <input
                  id="admin-password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="input-field pl-12 pr-12"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-surface-400 hover:text-surface-600 transition-colors"
                >
                  {showPassword ? <HiOutlineEyeSlash className="w-5 h-5" /> : <HiOutlineEye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <button
              id="admin-login-submit"
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl text-white font-semibold text-base bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 transition-all shadow-lg shadow-red-500/20 hover:shadow-red-500/30 disabled:opacity-50"
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Authenticating...
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2">
                  <HiOutlineShieldCheck className="w-5 h-5" />
                  Access Admin Panel
                </div>
              )}
            </button>
          </form>

          <div className="mt-6 p-3 rounded-xl bg-surface-50 dark:bg-surface-900 border border-surface-200 dark:border-surface-800">
            <p className="text-xs text-surface-500 text-center">
              🔒 This login is monitored. All access attempts are recorded in the audit log.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
