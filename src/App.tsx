import React, { useState, useEffect } from 'react';
import { StudyProvider, useStudy } from './context/StudyContext';
import { Navbar } from './components/layout/Navbar';
import { TimerDisplay } from './components/timer/TimerDisplay';
import { ZenMode } from './components/timer/ZenMode';
import { BreathingGuide } from './components/timer/BreathingGuide';
import { SoundMixer } from './components/audio/SoundMixer';
import { SessionTasks } from './components/tasks/SessionTasks';
import { Scratchpad } from './components/notes/Scratchpad';
import { FlashcardDeck } from './components/flashcards/FlashcardDeck';
import { StudyStats } from './components/stats/StudyStats';
import { SettingsModal } from './components/timer/SettingsModal';
import { Shield, Sparkles, BookOpen, Brain, BarChart } from 'lucide-react';

const MainStudyWorkspace: React.FC = () => {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'study' | 'flashcards' | 'notes' | 'stats'>('study');
  const { isRunning, startTimer, pauseTimer } = useStudy();

  // Spacebar shortcut to play/pause timer (when not typing in inputs/textareas)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable ||
        isSettingsOpen
      ) {
        return;
      }
      if (e.code === 'Space') {
        e.preventDefault();
        if (isRunning) pauseTimer();
        else startTimer();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isRunning, startTimer, pauseTimer, isSettingsOpen]);

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] flex flex-col transition-colors selection:bg-indigo-500/30">
      {/* Navbar */}
      <Navbar onOpenSettings={() => setIsSettingsOpen(true)} />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8 flex flex-col gap-6">
        {/* Distraction-Free Philosophy Banner */}
        <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-3 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-color)] text-xs text-[var(--text-muted)]">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>
              <strong className="text-[var(--text-primary)] font-medium">Distraction-Free Sanctuary:</strong> No
              social feeds, no external banners, zero tracking cookies. Pure mental focus.
            </span>
          </div>
          <div className="flex items-center gap-2 text-[11px] font-mono">
            <span className="hidden sm:inline">Shortcuts:</span>
            <kbd className="px-1.5 py-0.5 rounded bg-[var(--bg-primary)] border border-[var(--border-color)]">
              Space
            </kbd>
            <span className="text-[10px]">Play/Pause</span>
            <kbd className="px-1.5 py-0.5 rounded bg-[var(--bg-primary)] border border-[var(--border-color)]">
              Z
            </kbd>
            <span className="text-[10px]">Zen Fullscreen</span>
          </div>
        </div>

        {/* Tab Navigation for Study Tools */}
        <div className="flex items-center justify-start border-b border-[var(--border-color)] gap-1 sm:gap-2 pb-1 overflow-x-auto">
          <button
            onClick={() => setActiveTab('study')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all ${
              activeTab === 'study'
                ? 'bg-indigo-600/10 text-indigo-400 border-b-2 border-indigo-500 font-semibold'
                : 'text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-card)]'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>Deep Focus Hub</span>
          </button>
          <button
            onClick={() => setActiveTab('flashcards')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all ${
              activeTab === 'flashcards'
                ? 'bg-indigo-600/10 text-indigo-400 border-b-2 border-indigo-500 font-semibold'
                : 'text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-card)]'
            }`}
          >
            <Brain className="w-4 h-4" />
            <span>Active Recall Flashcards</span>
          </button>
          <button
            onClick={() => setActiveTab('notes')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all ${
              activeTab === 'notes'
                ? 'bg-indigo-600/10 text-indigo-400 border-b-2 border-indigo-500 font-semibold'
                : 'text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-card)]'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Study Notes</span>
          </button>
          <button
            onClick={() => setActiveTab('stats')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all ${
              activeTab === 'stats'
                ? 'bg-indigo-600/10 text-indigo-400 border-b-2 border-indigo-500 font-semibold'
                : 'text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-card)]'
            }`}
          >
            <BarChart className="w-4 h-4" />
            <span>Progress & Streaks</span>
          </button>
        </div>

        {/* Tab 1: Deep Focus Hub (Primary studying view) */}
        {activeTab === 'study' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Center / Dominant Column: Timer & Goal Checklist */}
            <div className="lg:col-span-8 flex flex-col gap-6">
              <TimerDisplay />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <SessionTasks />
                <BreathingGuide />
              </div>
            </div>

            {/* Right Column: Ambient Soundscapes & Quick Notes */}
            <div className="lg:col-span-4 flex flex-col gap-6">
              <SoundMixer />
              <Scratchpad />
            </div>
          </div>
        )}

        {/* Tab 2: Flashcards View */}
        {activeTab === 'flashcards' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            <div className="lg:col-span-8">
              <FlashcardDeck />
            </div>
            <div className="lg:col-span-4 flex flex-col gap-6">
              <SoundMixer />
              <SessionTasks />
            </div>
          </div>
        )}

        {/* Tab 3: Full Notebook Scratchpad View */}
        {activeTab === 'notes' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            <div className="lg:col-span-8">
              <Scratchpad />
            </div>
            <div className="lg:col-span-4 flex flex-col gap-6">
              <TimerDisplay />
              <SoundMixer />
            </div>
          </div>
        )}

        {/* Tab 4: Study Stats & Analytics */}
        {activeTab === 'stats' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            <div className="lg:col-span-8">
              <StudyStats />
            </div>
            <div className="lg:col-span-4 flex flex-col gap-6">
              <SessionTasks />
              <SoundMixer />
            </div>
          </div>
        )}
      </main>

      {/* Calming minimal footer */}
      <footer className="w-full border-t border-[var(--border-color)] py-4 mt-auto text-center text-xs text-[var(--text-muted)]">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>ZenStudy · Pure focus for students. Zero distractions, zero ads.</span>
          <span>100% Client-Side & Offline Ready</span>
        </div>
      </footer>

      {/* Zen Mode Overlay */}
      <ZenMode />

      {/* Settings Modal */}
      <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
    </div>
  );
};

export default function App() {
  return (
    <StudyProvider>
      <MainStudyWorkspace />
    </StudyProvider>
  );
}
