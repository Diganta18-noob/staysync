import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  HiOutlineEnvelope, HiOutlineLockClosed, HiOutlineEye,
  HiOutlineEyeSlash, HiOutlineBolt, HiOutlineStar,
} from 'react-icons/hi2';

const Login = () => {
  const { login } = useAuth();
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
      await login(formData.email, formData.password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Testimonial */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-primary-600 via-primary-700 to-accent-700 p-12 flex-col justify-between overflow-hidden">
        <div className="absolute inset-0 bg-card-shine animate-shimmer" />
        <div className="absolute top-20 -left-20 w-80 h-80 bg-white/5 rounded-full blur-xl" />
        <div className="absolute bottom-20 -right-20 w-96 h-96 bg-accent-500/10 rounded-full blur-xl" />

        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
              <span className="text-white font-bold text-sm">SS</span>
            </div>
            <span className="text-xl font-display font-bold text-white">StaySync</span>
          </div>
        </div>

        <div className="relative z-10 max-w-md">
          <div className="flex gap-1 mb-4">
            {[1, 2, 3, 4, 5].map(i => (
              <HiOutlineStar key={i} className="w-5 h-5 text-amber-300 fill-amber-300" />
            ))}
          </div>
          <blockquote className="text-2xl font-display font-medium text-white leading-relaxed mb-6">
            "StaySync transformed how we manage our 8 PG properties. The automated billing alone
            saves us 20 hours per month."
          </blockquote>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
              <span className="text-white font-bold">VK</span>
            </div>
            <div>
              <p className="font-semibold text-white">Vikram Kapoor</p>
              <p className="text-sm text-white/70">Property Chain Owner, Pune</p>
            </div>
          </div>
        </div>

        <div className="relative z-10 flex items-center gap-6 text-white/60 text-sm">
          <div className="flex items-center gap-2">
            <HiOutlineBolt className="w-4 h-4" />
            <span>Secure Login</span>
          </div>
          <span>•</span>
          <span>256-bit encryption</span>
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 bg-white dark:bg-surface-950">
        <div className="w-full max-w-md animate-fade-in">
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
              <span className="text-white font-bold text-sm">SS</span>
            </div>
            <span className="text-xl font-display font-bold text-surface-900 dark:text-white">StaySync</span>
          </div>

          <h1 className="text-3xl font-display font-bold text-surface-900 dark:text-white mb-2">
            Welcome back
          </h1>
          <p className="text-surface-500 mb-8">
            Sign in to your account to continue managing your properties.
          </p>

          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm animate-scale-in">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                Email Address
              </label>
              <div className="relative">
                <HiOutlineEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-surface-400" />
                <input
                  id="login-email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="input-field pl-12"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                Password
              </label>
              <div className="relative">
                <HiOutlineLockClosed className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-surface-400" />
                <input
                  id="login-password"
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

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 rounded border-surface-300 text-primary-600 focus:ring-primary-500" />
                <span className="text-sm text-surface-600 dark:text-surface-400">Remember me</span>
              </label>
              <a href="#" className="text-sm text-primary-600 hover:text-primary-500 font-medium">
                Forgot password?
              </a>
            </div>

            <button
              id="login-submit"
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-3.5 text-base"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Signing in...
                </div>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-surface-500">
            Don't have an account?{' '}
            <Link to="/register" className="text-primary-600 hover:text-primary-500 font-semibold">
              Create account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
