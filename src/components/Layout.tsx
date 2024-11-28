import { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import { themes, ThemeId } from '../config/themes';

const Layout = () => {
  const [currentTheme, setCurrentTheme] = useState<ThemeId>(() => {
    const saved = localStorage.getItem('theme');
    return (saved as ThemeId) || 'default';
  });

  useEffect(() => {
    const theme = themes[currentTheme];
    document.documentElement.style.setProperty('--color-primary', theme.primary);
    document.documentElement.style.setProperty('--color-background', theme.background);
    document.documentElement.style.setProperty('--color-surface', theme.surface);
    document.documentElement.style.setProperty('--color-hover', theme.hover);
    localStorage.setItem('theme', currentTheme);
  }, [currentTheme]);

  const handleThemeChange = (themeId: ThemeId) => {
    setCurrentTheme(themeId);
  };

  return (
    <div className="flex min-h-screen bg-theme-background">
      <Sidebar currentTheme={currentTheme} onThemeChange={handleThemeChange} />
      <main className="flex-1 ml-64 p-8">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;