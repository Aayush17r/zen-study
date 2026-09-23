import React from 'react';
import { useStudy } from '../../context/StudyContext';
import type { AmbientSoundId } from '../../types';
import { CloudRain, Radio, Waves, Flame, Headphones, VolumeX, ShieldCheck } from 'lucide-react';

export const SoundMixer: React.FC = () => {
  const { sounds, toggleSound, setSoundVolume, stopAllSounds } = useStudy();

  const getIcon = (id: AmbientSoundId) => {
    switch (id) {
      case 'rain':
        return <CloudRain className="w-4 h-4 text-blue-400" />;
      case 'pinkNoise':
        return <Radio className="w-4 h-4 text-purple-400" />;
      case 'ocean':
        return <Waves className="w-4 h-4 text-cyan-400" />;
      case 'campfire':
        return <Flame className="w-4 h-4 text-amber-500" />;
      case 'binaural':
        return <Headphones className="w-4 h-4 text-emerald-400" />;
    }
  };

  const activeCount = sounds.filter((s) => s.isPlaying).length;

  return (
    <div className="p-6 rounded-3xl bg-[var(--bg-card)] border border-[var(--border-color)] flex flex-col justify-between transition-all">
      {/* Header */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Headphones className="w-4 h-4 text-indigo-400" />
            <h3 className="text-sm font-semibold text-[var(--text-primary)]">Ambient Soundscapes</h3>
          </div>
          {activeCount > 0 && (
            <button
              onClick={stopAllSounds}
              className="flex items-center gap-1 text-[11px] text-rose-400 hover:text-rose-300 transition-colors"
              title="Mute all active sounds"
            >
              <VolumeX className="w-3.5 h-3.5" />
              <span>Mute All</span>
            </button>
          )}
        </div>
        <p className="text-xs text-[var(--text-muted)] mb-4">
          Blend synthesized focus noise to block out room distractions.
        </p>

        {/* Sound List */}
        <div className="space-y-3">
          {sounds.map((sound) => (
            <div
              key={sound.id}
              className={`p-3 rounded-2xl border transition-all ${
                sound.isPlaying
                  ? 'bg-[var(--bg-primary)] border-indigo-500/40 shadow-sm'
                  : 'bg-[var(--bg-primary)]/50 border-[var(--border-color)] opacity-75 hover:opacity-100'
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <button
                  onClick={() => toggleSound(sound.id)}
                  className="flex items-center gap-2.5 text-left flex-1 group"
                >
                  <div
                    className={`p-2 rounded-xl border transition-all ${
                      sound.isPlaying
                        ? 'bg-indigo-600/20 border-indigo-500/30'
                        : 'bg-[var(--bg-card)] border-[var(--border-color)] group-hover:border-[var(--text-muted)]'
                    }`}
                  >
                    {getIcon(sound.id)}
                  </div>
                  <div>
                    <div className="text-xs font-medium text-[var(--text-primary)]">{sound.name}</div>
                    <div className="text-[10px] text-[var(--text-muted)] capitalize">
                      {sound.isPlaying ? 'Playing' : 'Muted'}
                    </div>
                  </div>
                </button>

                {/* Volume Slider */}
                {sound.isPlaying && (
                  <div className="flex items-center gap-2 w-28">
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.05"
                      value={sound.volume}
                      onChange={(e) => setSoundVolume(sound.id, parseFloat(e.target.value))}
                      className="w-full h-1.5 bg-[var(--border-color)] rounded-lg appearance-none cursor-pointer accent-indigo-500"
                    />
                    <span className="text-[10px] font-mono text-[var(--text-muted)] w-6 text-right">
                      {Math.round(sound.volume * 100)}%
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Zero Ad guarantee footer */}
      <div className="mt-5 pt-3 border-t border-[var(--border-color)] flex items-center gap-2 text-[11px] text-[var(--text-muted)]">
        <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
        <span>Synthesized in-browser · Zero streaming ads · Zero bandwidth</span>
      </div>
    </div>
  );
};
