
import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { useTheme } from '@/contexts/ThemeContext';

interface ThemeToggleProps {
  showLabel?: boolean;
  size?: 'sm' | 'md';
}

const ThemeToggle = ({ showLabel = false, size = 'md' }: ThemeToggleProps) => {
  const { theme, toggleTheme } = useTheme();
  const isLight = theme === 'light';

  return (
    <div className={`flex items-center gap-2 ${size === 'sm' ? 'text-sm' : ''}`}>
      {showLabel && (
        <span className="text-gray-600 dark:text-gray-400 text-xs">
          {isLight ? 'Light' : 'Dark'}
        </span>
      )}
      <div className="flex items-center gap-1">
        <Sun className={`h-4 w-4 ${isLight ? 'text-yellow-500' : 'text-gray-400'}`} />
        <Switch
          checked={!isLight}
          onCheckedChange={toggleTheme}
          className="data-[state=checked]:bg-primary data-[state=unchecked]:bg-muted-foreground/20 data-[state=checked]:border-primary data-[state=unchecked]:border-muted-foreground/30"
        />
        <Moon className={`h-4 w-4 ${!isLight ? 'text-blue-400' : 'text-gray-400'}`} />
      </div>
    </div>
  );
};

export default ThemeToggle;
