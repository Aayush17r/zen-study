import React from 'react';
import { useStudy } from '../../context/StudyContext';
import { X, Volume2, Bell, Sliders, Check } from 'lucide-react';
import { soundEngine } from '../../services/audioEngine';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const { timerSettings, updateTimerSettings } = useStudy();

  if (!isOpen) return null;

  const handleTestChime = () => {
    soundEngine.playChime(timerSettings.soundVolume);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-md p-6 rounded-3xl bg-[var(--bg-card)] border border-[var(--border-color)] shadow-2xl relative">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[var(--border-color)] mb-4">
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-indigo-400" />
            <h3 className="font-semibold text-sm text-[var(--text-primary)]">Timer & Audio Settings</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-card-hover)] transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="space-y-4">
          {/* Custom Durations */}
          <div>
            <h4 className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-2.5">
              Timer Durations (Minutes)
            </h4>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] text-[var(--text-muted)] block mb-1">Focus Pomodoro</label>
                <input
                  type="number"
                  min="1"
                  max="180"
                  value={timerSettings.pomodoroMinutes}
                  onChange={(e) => updateTimerSettings({ pomodoroMinutes: Number(e.target.value) })}
                  className="w-full px-3 py-2 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-color)] text-xs text-[var(--text-primary)] focus:outline-none focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="text-[11px] text-[var(--text-muted)] block mb-1">Short Break</label>
                <input
                  type="number"
                  min="1"
                  max="60"
                  value={timerSettings.shortBreakMinutes}
                  onChange={(e) => updateTimerSettings({ shortBreakMinutes: Number(e.target.value) })}
                  className="w-full px-3 py-2 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-color)] text-xs text-[var(--text-primary)] focus:outline-none focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="text-[11px] text-[var(--text-muted)] block mb-1">Deep Sprint</label>
                <input
                  type="number"
                  min="1"
                  max="180"
                  value={timerSettings.deepSprintMinutes}
                  onChange={(e) => updateTimerSettings({ deepSprintMinutes: Number(e.target.value) })}
                  className="w-full px-3 py-2 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-color)] text-xs text-[var(--text-primary)] focus:outline-none focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="text-[11px] text-[var(--text-muted)] block mb-1">Long Break</label>
                <input
                  type="number"
                  min="1"
                  max="60"
                  value={timerSettings.longBreakMinutes}
                  onChange={(e) => updateTimerSettings({ longBreakMinutes: Number(e.target.value) })}
                  className="w-full px-3 py-2 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-color)] text-xs text-[var(--text-primary)] focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>
          </div>

          {/* Sound Notification */}
          <div className="pt-2 border-t border-[var(--border-color)]">
            <h4 className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-2.5">
              Audio Chimes
            </h4>
            <div className="flex items-center justify-between p-3 rounded-2xl bg-[var(--bg-primary)] border border-[var(--border-color)] mb-3">
              <div className="flex items-center gap-2">
                <Bell className="w-4 h-4 text-indigo-400" />
                <div>
                  <div className="text-xs font-medium text-[var(--text-primary)]">Session Complete Tone</div>
                  <div className="text-[10px] text-[var(--text-muted)]">Harmonic Tibetan Singing Bowl chime</div>
                </div>
              </div>
              <input
                type="checkbox"
                checked={timerSettings.soundAlerts}
                onChange={(e) => updateTimerSettings({ soundAlerts: e.target.checked })}
                className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 cursor-pointer"
              />
            </div>

            {timerSettings.soundAlerts && (
              <div className="flex items-center justify-between gap-3 px-1">
                <div className="flex items-center gap-2 flex-1">
                  <Volume2 className="w-4 h-4 text-[var(--text-muted)]" />
                  <input
                    type="range"
                    min="0.1"
                    max="1"
                    step="0.05"
                    value={timerSettings.soundVolume}
                    onChange={(e) => updateTimerSettings({ soundVolume: parseFloat(e.target.value) })}
                    className="w-full h-1.5 bg-[var(--border-color)] rounded-lg appearance-none cursor-pointer accent-indigo-500"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleTestChime}
                  className="px-2.5 py-1 text-xs rounded-xl bg-[var(--bg-card-hover)] hover:bg-[var(--border-color)] text-[var(--text-primary)] border border-[var(--border-color)] transition-colors"
                >
                  Test Tone
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Done Button */}
        <div className="mt-6 pt-4 border-t border-[var(--border-color)] flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium flex items-center gap-1.5 shadow-md shadow-indigo-600/20 transition-all"
          >
            <Check className="w-3.5 h-3.5" />
            <span>Save & Close</span>
          </button>
        </div>
      </div>
    </div>
  );
};
