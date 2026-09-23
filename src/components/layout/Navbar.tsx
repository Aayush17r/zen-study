import React from 'react';
import { useStudy } from '../../context/StudyContext';
import type { ThemeId } from '../../types';
import { Maximize2, Sparkles, Volume2, Moon, Sun, Coffee, Trees, Sliders } from 'lucide-react';

interface NavbarProps {
  onOpenSettings: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenSettings }) => {
  const { theme, setTheme, toggleZenMode, sounds } = useStudy();

  const activeSoundCount = sounds.filter((s) => s.isPlaying).length;

  const themes: { id: ThemeId; label: string; icon: React.ReactNode }[] = [
    { id: 'amoled', label: 'OLED Black', icon: <Moon className="w-3.5 h-3.5 text-zinc-400" /> },
    { id: 'sepia', label: 'Sepia Cafe', icon: <Coffee className="w-3.5 h-3.5 text-amber-500" /> },
    { id: 'forest', label: 'Pine Forest', icon: <Trees className="w-3.5 h-3.5 text-emerald-500" /> },
    { id: 'slate', label: 'Nordic Slate', icon: <Moon className="w-3.5 h-3.5 text-sky-400" /> },
    { id: 'minimalLight', label: 'Daylight', icon: <Sun className="w-3.5 h-3.5 text-amber-500" /> },
  ];

  return (
    <header className="w-full border-b border-[var(--border-color)] bg-[var(--bg-card)]/80 backdrop-blur-md sticky top-0 z-30 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-lg tracking-tight text-[var(--text-primary)]">ZenStudy</span>
              <span className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-semibold tracking-wider uppercase rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                100% Ad-Free
              </span>
            </div>
            <p className="text-xs text-[var(--text-muted)] hidden md:block">Distraction-free environment for pure learning</p>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Active Audio Indicator */}
          {activeSoundCount > 0 && (
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[var(--accent-glow)] text-[var(--accent-light)] border border-[var(--border-color)] text-xs animate-pulse">
              <Volume2 className="w-3.5 h-3.5" />
              <span className="font-medium hidden sm:inline">{activeSoundCount} ambient mix</span>
            </div>
          )}

          {/* Theme Selector */}
          <div className="flex items-center bg-[var(--bg-primary)] p-1 rounded-xl border border-[var(--border-color)]">
            {themes.map((t) => (
              <button
                key={t.id}
                onClick={() => setTheme(t.id)}
                title={t.label}
                className={`p-1.5 sm:px-2 sm:py-1 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all ${
                  theme === t.id
                    ? 'bg-[var(--bg-card)] text-[var(--text-primary)] shadow-sm'
                    : 'text-[var(--text-muted)] hover:text-[var(--text-primary)] opacity-70 hover:opacity-100'
                }`}
              >
                {t.icon}
                <span className="hidden lg:inline">{t.label}</span>
              </button>
            ))}
          </div>

          {/* Settings Button */}
          <button
            onClick={onOpenSettings}
            title="Timer Settings"
            className="p-2 rounded-xl text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-card-hover)] border border-[var(--border-color)] transition-all"
          >
            <Sliders className="w-4 h-4" />
          </button>

          {/* Zen Mode Button */}
          <button
            onClick={toggleZenMode}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium shadow-md shadow-indigo-600/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
            title="Full distraction-free Monk mode (Hotkey: Z)"
          >
            <Maximize2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Zen Mode</span>
            <kbd className="hidden md:inline-block ml-0.5 px-1 py-0.2 text-[9px] bg-indigo-700/50 rounded text-indigo-200">Z</kbd>
          </button>
        </div>
      </div>
    </header>
  );
};
