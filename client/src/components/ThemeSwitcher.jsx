import { useState, useRef, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';
import {
  HiOutlineSun, HiOutlineMoon, HiOutlinePaintBrush,
  HiOutlineCheck, HiOutlineXMark,
} from 'react-icons/hi2';

const ThemeSwitcher = () => {
  const { mode, toggleMode, preset, selectPreset, presetThemes } = useTheme();
  const [open, setOpen] = useState(false);
  const panelRef = useRef(null);

  // Close on outside click
  useEffect(() => {
    const handler = (e) => {
      if (panelRef.current && !panelRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    if (open) document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  // Close on Escape
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') setOpen(false); };
    if (open) document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [open]);

  const presetColors = {
    indigo:  '#6366f1',
    emerald: '#10b981',
    rose:    '#f43f5e',
    amber:   '#f59e0b',
    cyan:    '#0ea5e9',
  };

  return (
    <div className="relative" ref={panelRef}>
      {/* Trigger Button */}
      <button
        onClick={() => setOpen(!open)}
        className="relative p-2.5 rounded-xl bg-surface-100 dark:bg-surface-800 text-surface-600 dark:text-surface-300 hover:bg-surface-200 dark:hover:bg-surface-700 transition-all duration-200 hover:scale-105"
        title="Theme settings"
        aria-label="Open theme settings"
      >
        <HiOutlinePaintBrush className="w-5 h-5" />
      </button>

      {/* Theme Panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.95 }}
            transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
            className="absolute right-0 top-full mt-2 w-72 z-50 glass-card p-5 shadow-glass-lg"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-display font-bold text-surface-900 dark:text-white">
                Appearance
              </h3>
              <button
                onClick={() => setOpen(false)}
                className="p-1 rounded-lg text-surface-400 hover:text-surface-600 dark:hover:text-surface-200 hover:bg-surface-100 dark:hover:bg-surface-700 transition-colors"
              >
                <HiOutlineXMark className="w-4 h-4" />
              </button>
            </div>

            {/* Mode Toggle */}
            <div className="mb-5">
              <p className="text-xs font-semibold text-surface-500 uppercase tracking-wider mb-2">
                Mode
              </p>
              <div className="flex bg-surface-100 dark:bg-surface-800 rounded-xl p-1 gap-1">
                <button
                  onClick={() => { if (mode === 'dark') toggleMode(); }}
                  className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    mode === 'light'
                      ? 'bg-white dark:bg-surface-700 text-surface-900 dark:text-white shadow-sm'
                      : 'text-surface-500 hover:text-surface-700'
                  }`}
                >
                  <HiOutlineSun className="w-4 h-4" />
                  Light
                </button>
                <button
                  onClick={() => { if (mode === 'light') toggleMode(); }}
                  className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    mode === 'dark'
                      ? 'bg-white dark:bg-surface-700 text-surface-900 dark:text-white shadow-sm'
                      : 'text-surface-500 hover:text-surface-700'
                  }`}
                >
                  <HiOutlineMoon className="w-4 h-4" />
                  Dark
                </button>
              </div>
            </div>

            {/* Color Presets */}
            <div>
              <p className="text-xs font-semibold text-surface-500 uppercase tracking-wider mb-3">
                Color Scheme
              </p>
              <div className="grid grid-cols-5 gap-2">
                {Object.entries(presetThemes).map(([key, theme]) => (
                  <button
                    key={key}
                    onClick={() => selectPreset(key)}
                    className={`group relative flex flex-col items-center gap-1.5 p-2 rounded-xl transition-all duration-200 ${
                      preset === key
                        ? 'bg-surface-100 dark:bg-surface-800 ring-2 ring-primary-500/50'
                        : 'hover:bg-surface-50 dark:hover:bg-surface-800/50'
                    }`}
                    title={theme.label}
                  >
                    <div
                      className="w-8 h-8 rounded-full shadow-md transition-transform duration-200 group-hover:scale-110 flex items-center justify-center"
                      style={{ backgroundColor: presetColors[key] }}
                    >
                      {preset === key && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: 'spring', stiffness: 500, damping: 25 }}
                        >
                          <HiOutlineCheck className="w-4 h-4 text-white" />
                        </motion.div>
                      )}
                    </div>
                    <span className="text-[10px] font-medium text-surface-500 dark:text-surface-400">
                      {theme.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className="mt-4 pt-3 border-t border-surface-200 dark:border-surface-700">
              <p className="text-[10px] text-surface-400 text-center">
                Theme is saved automatically
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ThemeSwitcher;
