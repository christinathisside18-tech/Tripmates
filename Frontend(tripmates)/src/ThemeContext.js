import React, { createContext, useContext, useState, useEffect } from 'react';
import themes from './themes';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [currentTheme, setCurrentTheme] = useState(() => {
    const saved = localStorage.getItem('tripmates_theme');
    return saved && themes[saved] ? saved : 'default';
  });

  const theme = themes[currentTheme];

  const applyTheme = (themeId) => {
    if (themes[themeId]) {
      setCurrentTheme(themeId);
      localStorage.setItem('tripmates_theme', themeId);
    }
  };

  useEffect(() => {
    document.body.style.background = theme.pageBg;
    document.body.style.color = theme.secondary;
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, currentTheme, applyTheme, themes }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used inside ThemeProvider');
  return context;
};

export default ThemeContext;