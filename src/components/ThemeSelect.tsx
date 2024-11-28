import { useState } from 'react';
import { Palette } from 'lucide-react';
import { themes } from '../config/themes';

interface ThemeSelectProps {
  currentTheme: string;
  onThemeChange: (theme: string) => void;
}

const ThemeSelect = ({ currentTheme, onThemeChange }: ThemeSelectProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const isLightTheme = currentTheme === 'light';

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors hover:bg-theme-hover ${
          isLightTheme ? 'text-gray-700 hover:text-gray-900' : 'text-gray-300 hover:text-white'
        }`}
      >
        <Palette size={20} />
        <span>Theme</span>
      </button>

      {isOpen && (
        <div className="absolute bottom-full left-4 mb-2 w-48 bg-theme-surface rounded-lg shadow-lg overflow-hidden">
          {Object.entries(themes).map(([themeId, theme]) => (
            <button
              key={themeId}
              onClick={() => {
                onThemeChange(themeId);
                setIsOpen(false);
              }}
              className={`w-full flex items-center px-4 py-2 hover:bg-theme-hover ${
                currentTheme === themeId ? 'bg-theme-hover' : ''
              } ${isLightTheme ? 'text-gray-700' : 'text-gray-300'}`}
            >
              <span 
                className="w-4 h-4 rounded-full mr-3" 
                style={{ backgroundColor: theme.primary }}
              ></span>
              <span className="text-sm">{theme.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ThemeSelect;