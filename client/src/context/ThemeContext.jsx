import { createContext, useContext, useState, useEffect, useCallback } from 'react';

const THEME_KEY = 'staysync-theme';
const CUSTOM_COLORS_KEY = 'staysync-custom-colors';

const presetThemes = {
  indigo: {
    label: 'Indigo',
    primary: { h: 239, s: 84, l: 67 },
    accent: { h: 293, s: 69, l: 49 },
  },
  emerald: {
    label: 'Emerald',
    primary: { h: 160, s: 84, l: 39 },
    accent: { h: 172, s: 66, l: 50 },
  },
  rose: {
    label: 'Rose',
    primary: { h: 347, s: 77, l: 50 },
    accent: { h: 329, s: 86, l: 70 },
  },
  amber: {
    label: 'Amber',
    primary: { h: 38, s: 92, l: 50 },
    accent: { h: 25, s: 95, l: 53 },
  },
  cyan: {
    label: 'Ocean',
    primary: { h: 199, s: 89, l: 48 },
    accent: { h: 217, s: 91, l: 60 },
  },
};

function generatePalette(hsl, name) {
  const { h, s } = hsl;
  return {
    [`--color-${name}-50`]:  `${h} ${Math.min(s, 100)}% 97%`,
    [`--color-${name}-100`]: `${h} ${Math.min(s, 100)}% 93%`,
    [`--color-${name}-200`]: `${h} ${Math.min(s, 95)}% 86%`,
    [`--color-${name}-300`]: `${h} ${Math.min(s, 90)}% 76%`,
    [`--color-${name}-400`]: `${h} ${Math.min(s, 85)}% 66%`,
    [`--color-${name}-500`]: `${h} ${s}% 56%`,
    [`--color-${name}-600`]: `${h} ${s}% 46%`,
    [`--color-${name}-700`]: `${h} ${Math.min(s, 90)}% 38%`,
    [`--color-${name}-800`]: `${h} ${Math.min(s, 85)}% 30%`,
    [`--color-${name}-900`]: `${h} ${Math.min(s, 80)}% 22%`,
    [`--color-${name}-950`]: `${h} ${Math.min(s, 75)}% 14%`,
  };
}

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const [mode, setMode] = useState(() => {
    const saved = localStorage.getItem(THEME_KEY);
    if (saved) {
      try { return JSON.parse(saved).mode; } catch { /* fallback */ }
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  const [preset, setPreset] = useState(() => {
    const saved = localStorage.getItem(THEME_KEY);
    if (saved) {
      try { return JSON.parse(saved).preset; } catch { /* fallback */ }
    }
    return 'indigo';
  });

  const [customColors, setCustomColors] = useState(() => {
    const saved = localStorage.getItem(CUSTOM_COLORS_KEY);
    if (saved) {
      try { return JSON.parse(saved); } catch { /* fallback */ }
    }
    return null;
  });

  // Apply mode (dark class on <html>)
  useEffect(() => {
    const root = document.documentElement;
    if (mode === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [mode]);

  // Apply color variables to :root
  useEffect(() => {
    const root = document.documentElement;
    const theme = presetThemes[preset];
    if (!theme) return;

    const colors = customColors || theme;
    const primaryVars = generatePalette(colors.primary, 'primary');
    const accentVars = generatePalette(colors.accent, 'accent');

    Object.entries({ ...primaryVars, ...accentVars }).forEach(([key, value]) => {
      root.style.setProperty(key, value);
    });

    // Also update glow shadows
    const { h, s } = colors.primary;
    root.style.setProperty('--shadow-glow', `0 0 20px hsl(${h} ${s}% 56% / 0.3)`);
    root.style.setProperty('--shadow-glow-lg', `0 0 40px hsl(${h} ${s}% 56% / 0.4)`);
    root.style.setProperty('--selection-bg', `hsl(${h} ${s}% 56% / 0.3)`);
  }, [preset, customColors]);

  // Persist to localStorage
  useEffect(() => {
    localStorage.setItem(THEME_KEY, JSON.stringify({ mode, preset }));
  }, [mode, preset]);

  useEffect(() => {
    if (customColors) {
      localStorage.setItem(CUSTOM_COLORS_KEY, JSON.stringify(customColors));
    }
  }, [customColors]);

  const toggleMode = useCallback(() => {
    setMode(prev => prev === 'dark' ? 'light' : 'dark');
  }, []);

  const selectPreset = useCallback((key) => {
    setPreset(key);
    setCustomColors(null); // Clear custom when selecting a preset
    localStorage.removeItem(CUSTOM_COLORS_KEY);
  }, []);

  const value = {
    mode,
    setMode,
    toggleMode,
    preset,
    selectPreset,
    presetThemes,
    customColors,
    setCustomColors,
    currentTheme: customColors || presetThemes[preset],
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
}

export default ThemeContext;
