/**
 * Theme Context for Calculator Demo
 *
 * Provides light/dark mode toggle with localStorage persistence.
 */

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  colors: ThemeColors;
}

interface ThemeColors {
  // Backgrounds
  pageBg: string;
  panelBg: string;
  panelBgAlt: string;
  inputBg: string;

  // Borders
  border: string;
  borderLight: string;

  // Text
  text: string;
  textSecondary: string;
  textMuted: string;
  textDim: string;

  // Headers
  header: string;
  headerBg: string;

  // Special
  accent: string;
  separator: string;
}

const darkColors: ThemeColors = {
  pageBg: '#1e1e1e',
  panelBg: '#2a2a2a',
  panelBgAlt: '#252525',
  inputBg: '#1e1e1e',
  border: '#3a3a3a',
  borderLight: '#4a4a4a',
  text: '#e5e5e5',
  textSecondary: '#c0c0c0',
  textMuted: '#909090',
  textDim: '#606060',
  header: '#d0d0d0',
  headerBg: '#232323',
  accent: '#e5e5e5',
  separator: '#4a4a4a',
};

const lightColors: ThemeColors = {
  pageBg: '#f0f0f0',
  panelBg: '#ffffff',
  panelBgAlt: '#f8f8f8',
  inputBg: '#ffffff',
  border: '#cccccc',
  borderLight: '#e0e0e0',
  text: '#1a1a1a',
  textSecondary: '#444444',
  textMuted: '#666666',
  textDim: '#888888',
  header: '#333333',
  headerBg: '#f8f8f8',
  accent: '#0055aa',
  separator: '#cccccc',
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const STORAGE_KEY = 'calculator-demo-theme';

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored === 'light' || stored === 'dark') {
        return stored;
      }
    }
    return 'dark';
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  const colors = theme === 'dark' ? darkColors : lightColors;

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, colors }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
