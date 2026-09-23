import React, { useState, useEffect } from 'react';
import { Wind, Play, Pause } from 'lucide-react';

export const BreathingGuide: React.FC = () => {
  const [phase, setPhase] = useState<'Inhale' | 'Hold' | 'Exhale'>('Inhale');
  const [secondsLeft, setSecondsLeft] = useState(4);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    if (!isActive) return;

    const interval = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          if (phase === 'Inhale') {
            setPhase('Hold');
            return 7;
          } else if (phase === 'Hold') {
            setPhase('Exhale');
            return 8;
          } else {
            setPhase('Inhale');
            return 4;
          }
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isActive, phase]);

  const toggleExercise = () => {
    if (!isActive) {
      setPhase('Inhale');
      setSecondsLeft(4);
    }
    setIsActive((prev) => !prev);
  };

  const getScaleClass = () => {
    if (!isActive) return 'scale-90';
    if (phase === 'Inhale') return 'scale-125 duration-4000';
    if (phase === 'Hold') return 'scale-125 duration-7000';
    return 'scale-90 duration-8000';
  };

  return (
    <div className="p-6 rounded-3xl bg-[var(--bg-card)] border border-[var(--border-color)] flex flex-col items-center justify-between text-center relative overflow-hidden transition-all">
      <div className="w-full flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Wind className="w-4 h-4 text-emerald-400" />
          <h3 className="text-sm font-semibold text-[var(--text-primary)]">Mindful Reset</h3>
        </div>
        <span className="text-[11px] text-[var(--text-muted)] bg-[var(--bg-primary)] px-2 py-0.5 rounded-full border border-[var(--border-color)]">
          4-7-8 Breathing
        </span>
      </div>

      {/* Visual Circle */}
      <div className="my-6 relative flex items-center justify-center w-36 h-36">
        {/* Pulsing outer aura */}
        <div
          className={`absolute inset-0 rounded-full bg-emerald-500/10 blur-xl transition-all ease-in-out ${getScaleClass()}`}
        />
        {/* Core circle */}
        <div
          className={`w-28 h-28 rounded-full border-2 border-emerald-400/40 bg-emerald-500/20 flex flex-col items-center justify-center transition-all ease-in-out shadow-inner ${getScaleClass()}`}
        >
          <span className="text-xs uppercase tracking-wider font-bold text-emerald-300">
            {isActive ? phase : 'Ready'}
          </span>
          {isActive && (
            <span className="text-2xl font-mono font-bold text-emerald-200 mt-0.5">
              {secondsLeft}s
            </span>
          )}
        </div>
      </div>

      <p className="text-xs text-[var(--text-muted)] max-w-xs mb-4">
        {isActive
          ? phase === 'Inhale'
            ? 'Breathe in deeply through your nose...'
            : phase === 'Hold'
            ? 'Gently retain your breath...'
            : 'Slowly release through your mouth...'
          : 'Clear mental clutter between study intervals with guided rhythm.'}
      </p>

      <button
        onClick={toggleExercise}
        className="w-full py-2.5 px-4 rounded-xl bg-[var(--bg-primary)] hover:bg-[var(--bg-card-hover)] border border-[var(--border-color)] text-xs font-medium text-[var(--text-primary)] flex items-center justify-center gap-2 transition-all hover:scale-[1.01] active:scale-[0.99]"
      >
        {isActive ? (
          <>
            <Pause className="w-3.5 h-3.5" />
            <span>Pause Breathing</span>
          </>
        ) : (
          <>
            <Play className="w-3.5 h-3.5 ml-0.5" />
            <span>Start Breathing Reset</span>
          </>
        )}
      </button>
    </div>
  );
};
