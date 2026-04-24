import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  HiOutlineMagnifyingGlass, HiOutlineXMark,
  HiOutlineBuildingOffice2, HiOutlineUserCircle,
  HiOutlineKey,
} from 'react-icons/hi2';
import axios from 'axios';

const ICONS = {
  properties: HiOutlineBuildingOffice2,
  users: HiOutlineUserCircle,
  rooms: HiOutlineKey,
};

const COLORS = {
  properties: 'text-blue-500 bg-blue-50 dark:bg-blue-900/30',
  users: 'text-purple-500 bg-purple-50 dark:bg-purple-900/30',
  rooms: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-900/30',
};

const GlobalSearch = () => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  // Keyboard shortcut: Cmd+K / Ctrl+K
  useEffect(() => {
    const handler = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, []);

  // Focus input when opened
  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 100);
      setQuery('');
      setResults(null);
      setSelectedIndex(0);
    }
  }, [open]);

  // Debounced search
  useEffect(() => {
    if (!query || query.length < 2) {
      setResults(null);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        const { data } = await axios.get(`/api/search?q=${encodeURIComponent(query)}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setResults(data.data);
        setSelectedIndex(0);
      } catch {
        setResults({ properties: [], users: [], rooms: [], total: 0 });
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  const allItems = results
    ? [
        ...results.properties.map((p) => ({ ...p, _type: 'properties', _label: p.name, _sub: p.address || p.city })),
        ...results.users.map((u) => ({ ...u, _type: 'users', _label: u.name, _sub: u.email })),
        ...results.rooms.map((r) => ({ ...r, _type: 'rooms', _label: `Room ${r.roomNumber}`, _sub: r.property?.name || '' })),
      ]
    : [];

  const handleSelect = useCallback((item) => {
    setOpen(false);
    if (item._type === 'properties') navigate(`/properties/${item._id}`);
    else if (item._type === 'users') navigate(`/admin`);
    else if (item._type === 'rooms') navigate(`/properties/${item.property?._id || ''}`);
  }, [navigate]);

  // Keyboard navigation
  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => Math.min(prev + 1, allItems.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => Math.max(prev - 1, 0));
    } else if (e.key === 'Enter' && allItems[selectedIndex]) {
      handleSelect(allItems[selectedIndex]);
    }
  };

  return (
    <>
      {/* Trigger */}
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 px-3 py-2 rounded-xl bg-surface-100 dark:bg-surface-800 text-surface-500 hover:bg-surface-200 dark:hover:bg-surface-700 transition-all text-sm"
        title="Search (Ctrl+K)"
      >
        <HiOutlineMagnifyingGlass className="w-4 h-4" />
        <span className="hidden sm:inline">Search...</span>
        <kbd className="hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 bg-surface-200 dark:bg-surface-700 rounded text-[10px] font-mono text-surface-400">
          ⌘K
        </kbd>
      </button>

      {/* Modal */}
      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
              onClick={() => setOpen(false)}
            />

            {/* Panel */}
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
              className="fixed top-[15%] left-1/2 -translate-x-1/2 w-full max-w-lg z-50"
            >
              <div className="mx-4 bg-white dark:bg-surface-900 rounded-2xl shadow-2xl border border-surface-200 dark:border-surface-700 overflow-hidden">
                {/* Input */}
                <div className="flex items-center gap-3 px-4 py-3 border-b border-surface-100 dark:border-surface-800">
                  <HiOutlineMagnifyingGlass className="w-5 h-5 text-surface-400 flex-shrink-0" />
                  <input
                    ref={inputRef}
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Search properties, tenants, rooms..."
                    className="flex-1 bg-transparent text-surface-900 dark:text-white placeholder:text-surface-400 outline-none text-sm"
                  />
                  {query && (
                    <button onClick={() => setQuery('')} className="text-surface-400 hover:text-surface-600">
                      <HiOutlineXMark className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {/* Results */}
                <div className="max-h-80 overflow-y-auto">
                  {loading && (
                    <div className="p-6 text-center text-surface-400 text-sm">Searching...</div>
                  )}

                  {!loading && results && allItems.length === 0 && (
                    <div className="p-6 text-center text-surface-400 text-sm">
                      No results for "{query}"
                    </div>
                  )}

                  {!loading && allItems.length > 0 && (
                    <div className="py-2">
                      {allItems.map((item, i) => {
                        const Icon = ICONS[item._type];
                        return (
                          <button
                            key={`${item._type}-${item._id}`}
                            onClick={() => handleSelect(item)}
                            className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors ${
                              i === selectedIndex
                                ? 'bg-primary-50 dark:bg-primary-900/20'
                                : 'hover:bg-surface-50 dark:hover:bg-surface-800/50'
                            }`}
                          >
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${COLORS[item._type]}`}>
                              <Icon className="w-4 h-4" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-surface-900 dark:text-white truncate">
                                {item._label}
                              </p>
                              <p className="text-xs text-surface-500 truncate">{item._sub}</p>
                            </div>
                            <span className="text-[10px] uppercase text-surface-400 font-medium">
                              {item._type.slice(0, -1)}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  )}

                  {!query && (
                    <div className="p-6 text-center text-surface-400 text-sm">
                      Type to search across your StaySync data
                    </div>
                  )}
                </div>

                {/* Footer */}
                <div className="flex items-center gap-4 px-4 py-2 border-t border-surface-100 dark:border-surface-800 text-[10px] text-surface-400">
                  <span>↑↓ Navigate</span>
                  <span>↵ Select</span>
                  <span>Esc Close</span>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default GlobalSearch;
