import { Moon, Sun } from 'lucide-react';

import { setTheme, useTheme } from '../lib/theme';
import { Button } from './button';

export function ThemeToggle({ className }: { className?: string }) {
  const theme = useTheme();
  const isDark = theme === 'dark';

  return (
    <Button
      variant="ghost"
      size="icon"
      className={className}
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      aria-label={isDark ? 'Включить светлую тему' : 'Включить тёмную тему'}
      title={isDark ? 'Светлая тема' : 'Тёмная тема'}
    >
      {isDark ? <Sun /> : <Moon />}
    </Button>
  );
}
