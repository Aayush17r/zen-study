import React from 'react';
import { useStudy } from '../../context/StudyContext';
import type { TimerMode } from '../../types';
import { Play, Pause, RotateCcw, SkipForward, Target, Flame } from 'lucide-react';

export const TimerDisplay: React.FC = () => {
  const {
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
  } = useStudy();

  const activeTask = tasks.find((t) => t.id === activeTaskId);

  // Format time
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // SVG Circular progress
  const radius = 135;
  const circumference = 2 * Math.PI * radius;
  const progressRatio = mode === 'openFlow' ? 1 : totalTime > 0 ? timeLeft / totalTime : 0;
  const strokeDashoffset = circumference - progressRatio * circumference;

  const modes: { id: TimerMode; label: string }[] = [
    { id: 'pomodoro', label: 'Pomodoro' },
    { id: 'deepSprint', label: '50m Deep Flow' },
    { id: 'shortBreak', label: 'Short Break' },
    { id: 'longBreak', label: 'Long Break' },
    { id: 'openFlow', label: 'Stopwatch' },
  ];

  return (
    <div className="flex flex-col items-center justify-center p-6 sm:p-8 rounded-3xl bg-[var(--bg-card)] border border-[var(--border-color)] shadow-xl relative overflow-hidden transition-all">
      {/* Background radial subtle glow */}
      <div className="absolute inset-0 bg-radial from-[var(--accent-glow)] via-transparent to-transparent pointer-events-none opacity-40" />

      {/* Mode Switcher Tabs */}
      <div className="flex flex-wrap items-center justify-center gap-1.5 p-1.5 rounded-2xl bg-[var(--bg-primary)] border border-[var(--border-color)] mb-8 z-10">
        {modes.map((m) => (
          <button
            key={m.id}
            onClick={() => switchMode(m.id)}
            className={`px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-medium transition-all ${
              mode === m.id
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-card-hover)]'
            }`}
          >
            {m.label}
          </button>
        ))}
      </div>

      {/* Circular Progress & Timer Readout */}
      <div className="relative flex items-center justify-center w-72 h-72 sm:w-80 sm:h-80 z-10">
        <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 300 300">
          {/* Background circle track */}
          <circle
            cx="150"
            cy="150"
            r={radius}
            className="stroke-[var(--border-color)]"
            strokeWidth="8"
            fill="transparent"
          />
          {/* Progress circle */}
          <circle
            cx="150"
            cy="150"
            r={radius}
            stroke="currentColor"
            className="text-indigo-500 transition-all duration-1000 ease-linear"
            strokeWidth="9"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
          />
        </svg>

        {/* Center Content */}
        <div className="absolute flex flex-col items-center justify-center text-center px-4">
          <div className="font-mono text-5xl sm:text-6xl font-bold tracking-tight text-[var(--text-primary)] drop-shadow-sm select-none">
            {formatTime(timeLeft)}
          </div>
          <span className="text-xs uppercase tracking-widest text-[var(--text-muted)] mt-2 font-semibold">
            {mode === 'pomodoro'
              ? 'Focus Block'
              : mode === 'deepSprint'
              ? 'Deep Study Sprint'
              : mode.includes('Break')
              ? 'Rest & Recharge'
              : 'Open Flow Stopwatch'}
          </span>

          {/* Active Goal snippet */}
          <div className="mt-3 max-w-[200px] truncate flex items-center gap-1.5 text-xs text-[var(--text-muted)] bg-[var(--bg-primary)]/80 px-2.5 py-1 rounded-full border border-[var(--border-color)]">
            <Target className="w-3 h-3 text-indigo-400 shrink-0" />
            <span className="truncate">{activeTask ? activeTask.title : 'No target selected'}</span>
          </div>
        </div>
      </div>

      {/* Main Action Buttons */}
      <div className="flex items-center gap-4 mt-8 z-10">
        {/* Reset button */}
        <button
          onClick={resetTimer}
          title="Reset timer"
          className="p-3.5 rounded-2xl bg-[var(--bg-primary)] text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-card-hover)] border border-[var(--border-color)] transition-all hover:scale-105 active:scale-95"
        >
          <RotateCcw className="w-5 h-5" />
        </button>

        {/* Start / Pause Big Button */}
        <button
          onClick={isRunning ? pauseTimer : startTimer}
          className={`flex items-center justify-center gap-2 px-8 py-3.5 rounded-2xl font-semibold text-base shadow-lg transition-all hover:scale-105 active:scale-95 text-white ${
            isRunning
              ? 'bg-amber-600 hover:bg-amber-500 shadow-amber-600/30'
              : 'bg-indigo-600 hover:bg-indigo-500 shadow-indigo-600/30'
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
              <span>{timeLeft < totalTime ? 'Resume' : 'Start Focus'}</span>
            </>
          )}
        </button>

        {/* Skip / Next Mode button */}
        <button
          onClick={() => {
            if (mode === 'pomodoro' || mode === 'deepSprint') {
              switchMode('shortBreak');
            } else {
              switchMode('pomodoro');
            }
          }}
          title="Skip session"
          className="p-3.5 rounded-2xl bg-[var(--bg-primary)] text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-card-hover)] border border-[var(--border-color)] transition-all hover:scale-105 active:scale-95"
        >
          <SkipForward className="w-5 h-5" />
        </button>
      </div>

      {/* Active task pomodoro counter indicator */}
      {activeTask && (
        <div className="mt-5 flex items-center gap-2 text-xs text-[var(--text-muted)] z-10">
          <Flame className="w-3.5 h-3.5 text-amber-500" />
          <span>
            Goal progress: {activeTask.completedPomos} / {activeTask.estimatedPomos} completed blocks
          </span>
        </div>
      )}
    </div>
  );
};
