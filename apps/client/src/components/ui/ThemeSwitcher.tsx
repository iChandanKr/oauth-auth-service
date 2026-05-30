import React, { useEffect, useState } from 'react';

type Theme = 'default' | 'emerald' | 'cyberpunk' | 'light';

export const ThemeSwitcher: React.FC = () => {
  const [theme, setTheme] = useState<Theme>('default');
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const savedTheme = (localStorage.getItem('app_theme') as Theme) || 'default';
    setTheme(savedTheme);
    applyTheme(savedTheme);
  }, []);

  const applyTheme = (newTheme: Theme) => {
    const root = document.documentElement;
    if (newTheme === 'default') {
      root.removeAttribute('data-theme');
    } else {
      root.setAttribute('data-theme', newTheme);
    }
  };

  const handleThemeChange = (newTheme: Theme) => {
    setTheme(newTheme);
    applyTheme(newTheme);
    localStorage.setItem('app_theme', newTheme);
    setIsOpen(false);
  };

  const themes: { id: Theme; label: string; icon: string }[] = [
    { id: 'default', label: 'Dark Space', icon: '🌌' },
    { id: 'emerald', label: 'Emerald Forest', icon: '🌲' },
    { id: 'cyberpunk', label: 'Cyberpunk Neon', icon: '🌆' },
    { id: 'light', label: 'Slate Day', icon: '☀️' },
  ];

  const currentTheme = themes.find((t) => t.id === theme) || themes[0];

  return (
    <div className="relative inline-block text-left z-50">
      <div>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 bg-white/5 border border-card-border hover:bg-white/10 text-text-primary px-3 py-1.5 rounded-full text-xs font-semibold cursor-pointer select-none transition-all"
          aria-expanded={isOpen}
          aria-haspopup="true"
        >
          <span>{currentTheme.icon}</span>
          <span className="max-[480px]:hidden">{currentTheme.label}</span>
          <svg className="w-3 h-3 text-text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>

      {isOpen && (
        <>
          {/* Overlay to close menu */}
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          
          <div className="absolute right-0 mt-2 w-44 rounded-xl shadow-2xl bg-slate-950 border border-card-border p-1.5 z-50 animate-fade-in">
            <div className="py-1" role="menu" aria-orientation="vertical">
              {themes.map((t) => (
                <button
                  key={t.id}
                  onClick={() => handleThemeChange(t.id)}
                  className={`flex items-center gap-3 w-full px-3 py-2 text-xs font-medium rounded-lg transition-all cursor-pointer text-left ${
                    theme === t.id
                      ? 'bg-accent-blue text-white'
                      : 'text-text-secondary hover:text-text-primary hover:bg-white/5'
                  }`}
                  role="menuitem"
                >
                  <span>{t.icon}</span>
                  <span>{t.label}</span>
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};
