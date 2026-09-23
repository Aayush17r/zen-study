import React, { useState, useEffect } from 'react';
import { useStudy } from '../../context/StudyContext';
import {
  Minimize2,
  Play,
  Pause,
  RotateCcw,
  SkipForward,
  Target,
  CloudRain,
  Radio,
  Waves,
  Flame,
  Headphones,
  VolumeX,
} from 'lucide-react';
import type { AmbientSoundId } from '../../types';

export const ZenMode: React.FC = () => {
  const {
    isZenMode,
    toggleZenMode,
    mode,
    timeLeft,
    totalTime,
    isRunning,
    startTimer,
    pauseTimer,
    resetTimer,
    switchMode,
    tasks,
    activeTaskId,
    sounds,
    toggleSound,
    stopAllSounds,
  } = useStudy();

  const [currentTime, setCurrentTime] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  if (!isZenMode) return null;

  const activeTask = tasks.find((t) => t.id === activeTaskId);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const radius = 160;
  const circumference = 2 * Math.PI * radius;
  const progressRatio = mode === 'openFlow' ? 1 : totalTime > 0 ? timeLeft / totalTime : 0;
  const strokeDashoffset = circumference - progressRatio * circumference;

  const getSoundIcon = (id: AmbientSoundId) => {
    switch (id) {
      case 'rain':
        return <CloudRain className="w-4 h-4" />;
      case 'pinkNoise':
        return <Radio className="w-4 h-4" />;
      case 'ocean':
        return <Waves className="w-4 h-4" />;
      case 'campfire':
        return <Flame className="w-4 h-4" />;
      case 'binaural':
        return <Headphones className="w-4 h-4" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-[var(--bg-primary)] text-[var(--text-primary)] flex flex-col justify-between p-8 sm:p-12 select-none animate-fadeIn transition-colors">
      {/* Top Bar */}
      <div className="flex items-center justify-between">
        <div className="text-xs font-mono text-[var(--text-muted)] tracking-widest uppercase">
          {currentTime}
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-[var(--text-muted)] hidden sm:inline">Press Z or Esc to exit</span>
          <button
            onClick={toggleZenMode}
            className="p-2 rounded-2xl bg-[var(--bg-card)] hover:bg-[var(--bg-card-hover)] border border-[var(--border-color)] text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-all"
            title="Exit Zen Mode (Hotkey: Z)"
          >
            <Minimize2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Focus Center */}
      <div className="flex flex-col items-center justify-center my-auto">
        {/* Active Study Target */}
        <div className="mb-6 flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--bg-card)] border border-[var(--border-color)] max-w-md">
          <Target className="w-4 h-4 text-indigo-400 shrink-0" />
          <span className="text-xs sm:text-sm font-medium text-[var(--text-primary)] truncate">
            {activeTask ? activeTask.title : 'Single Focus Session · Immerse Completely'}
          </span>
        </div>

        {/* Big Circular Timer */}
        <div className="relative flex items-center justify-center w-80 h-80 sm:w-96 sm:h-96">
          <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 360 360">
            <circle
              cx="180"
              cy="180"
              r={radius}
              className="stroke-[var(--border-color)]"
              strokeWidth="6"
              fill="transparent"
            />
            <circle
              cx="180"
              cy="180"
              r={radius}
              stroke="currentColor"
              className="text-indigo-500 transition-all duration-1000 ease-linear"
              strokeWidth="8"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              fill="transparent"
            />
          </svg>

          <div className="absolute flex flex-col items-center justify-center text-center">
            <div className="font-mono text-6xl sm:text-7xl font-bold tracking-tight text-[var(--text-primary)] drop-shadow-md">
              {formatTime(timeLeft)}
            </div>
            <span className="text-xs uppercase tracking-widest text-[var(--text-muted)] mt-3 font-semibold">
              {mode === 'pomodoro'
                ? 'Monk Focus'
                : mode === 'deepSprint'
                ? 'Deep Sprint'
                : mode.includes('Break')
                ? 'Mindful Rest'
                : 'Open Flow'}
            </span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-4 mt-8">
          <button
            onClick={resetTimer}
            className="p-3.5 rounded-2xl bg-[var(--bg-card)] text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-card-hover)] border border-[var(--border-color)] transition-all hover:scale-105 active:scale-95"
            title="Reset"
          >
            <RotateCcw className="w-5 h-5" />
          </button>

          <button
            onClick={isRunning ? pauseTimer : startTimer}
            className={`flex items-center justify-center gap-2 px-8 py-3.5 rounded-2xl font-semibold text-base shadow-lg transition-all hover:scale-105 active:scale-95 text-white ${
              isRunning ? 'bg-amber-600 hover:bg-amber-500' : 'bg-indigo-600 hover:bg-indigo-500'
            }`}
          >
            {isRunning ? (
              <>
                <Pause className="w-5 h-5 fill-current" />
                <span>Pause</span>
              </>
            ) : (
              <>
                <Play className="w-5 h-5 fill-current ml-0.5" />
                <span>Start</span>
              </>
            )}
          </button>

          <button
            onClick={() => {
              if (mode === 'pomodoro' || mode === 'deepSprint') {
                switchMode('shortBreak');
              } else {
                switchMode('pomodoro');
              }
            }}
            className="p-3.5 rounded-2xl bg-[var(--bg-card)] text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-card-hover)] border border-[var(--border-color)] transition-all hover:scale-105 active:scale-95"
            title="Next mode"
          >
            <SkipForward className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Bottom Ambient Audio Dock */}
      <div className="flex items-center justify-center gap-2">
        <div className="flex items-center gap-1.5 p-1.5 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-color)] shadow-md">
          {sounds.map((sound) => (
            <button
              key={sound.id}
              onClick={() => toggleSound(sound.id)}
              className={`p-2 rounded-xl text-xs flex items-center gap-1.5 transition-all ${
                sound.isPlaying
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-card-hover)]'
              }`}
              title={`${sound.name} (${sound.isPlaying ? 'Active' : 'Muted'})`}
            >
              {getSoundIcon(sound.id)}
              <span className="hidden md:inline text-[11px] font-medium">{sound.name}</span>
            </button>
          ))}
          {sounds.some((s) => s.isPlaying) && (
            <button
              onClick={stopAllSounds}
              className="p-2 rounded-xl text-rose-400 hover:text-rose-300 transition-colors"
              title="Mute All"
            >
              <VolumeX className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
