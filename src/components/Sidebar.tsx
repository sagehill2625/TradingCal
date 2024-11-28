import { NavLink } from 'react-router-dom';
import { Calendar, BarChart2, Upload } from 'lucide-react';
import ThemeSelect from './ThemeSelect';
import { ThemeId } from '../config/themes';

interface SidebarProps {
  currentTheme: ThemeId;
  onThemeChange: (theme: ThemeId) => void;
}

const Sidebar = ({ currentTheme, onThemeChange }: SidebarProps) => {
  const links = [
    { to: '/', icon: Calendar, label: 'Calendar' },
    { to: '/analytics', icon: BarChart2, label: 'Analytics' },
    { to: '/upload', icon: Upload, label: 'Upload' },
  ];

  return (
    <div className="h-screen w-64 bg-theme-surface text-gray-300 p-4 fixed left-0 top-0 flex flex-col">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">TradeCal</h1>
      </div>
      
      <nav className="space-y-2 flex-1">
        {links.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                isActive
                  ? 'bg-theme-hover text-white'
                  : 'hover:bg-theme-hover/50 hover:text-white'
              }`
            }
          >
            <Icon size={20} />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-gray-800 pt-4 mt-4">
        <ThemeSelect
          currentTheme={currentTheme}
          onThemeChange={onThemeChange}
        />
      </div>
    </div>
  );
};

export default Sidebar;