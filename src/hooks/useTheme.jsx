import { useEffect } from 'react';
import useLocalStorage from './useLocalStorage';

function useTheme() {
  const [theme, setTheme] = useLocalStorage('theme', 'light');

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.setAttribute('data-theme', 'dark');
    } else {
      root.removeAttribute('data-theme');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  return { theme, toggleTheme };
}

export default useTheme;