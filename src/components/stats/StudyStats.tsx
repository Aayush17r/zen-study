import React from 'react';
import { useStudy } from '../../context/StudyContext';
import { Flame, Clock, CheckCircle, BarChart2 } from 'lucide-react';

export const StudyStats: React.FC = () => {
  const { stats } = useStudy();

  // Generate last 7 days for the chart
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(Date.now() - (6 - i) * 86400000);
    const dateStr = d.toISOString().split('T')[0];
    const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });
    const dayStats = stats.history[dateStr] || { minutes: 0, completedSessions: 0 };
    return {
      dateStr,
      dayName,
      minutes: dayStats.minutes,
      isToday: i === 6,
    };
  });

  const maxMinutes = Math.max(...last7Days.map((d) => d.minutes), 60);

  const hoursToday = (stats.totalMinutesToday / 60).toFixed(1);

  return (
    <div className="p-6 rounded-3xl bg-[var(--bg-card)] border border-[var(--border-color)] flex flex-col justify-between transition-all">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <BarChart2 className="w-4 h-4 text-indigo-400" />
            <h3 className="text-sm font-semibold text-[var(--text-primary)]">Study Analytics</h3>
          </div>
          <span className="text-[11px] text-[var(--text-muted)] bg-[var(--bg-primary)] px-2.5 py-0.5 rounded-full border border-[var(--border-color)]">
            Private & Offline
          </span>
        </div>

        {/* 3 Metric cards */}
        <div className="grid grid-cols-3 gap-2.5 mb-6">
          {/* Today's Focus */}
          <div className="p-3 rounded-2xl bg-[var(--bg-primary)] border border-[var(--border-color)] flex flex-col">
            <div className="flex items-center gap-1 text-[11px] text-[var(--text-muted)] mb-1">
              <Clock className="w-3 h-3 text-indigo-400" />
              <span>Today</span>
            </div>
            <div className="text-lg font-bold font-mono text-[var(--text-primary)]">
              {stats.totalMinutesToday}
              <span className="text-xs font-normal text-[var(--text-muted)] ml-0.5">m</span>
            </div>
            <div className="text-[10px] text-[var(--text-muted)] mt-0.5">{hoursToday} hrs</div>
          </div>

          {/* Sessions */}
          <div className="p-3 rounded-2xl bg-[var(--bg-primary)] border border-[var(--border-color)] flex flex-col">
            <div className="flex items-center gap-1 text-[11px] text-[var(--text-muted)] mb-1">
              <CheckCircle className="w-3 h-3 text-emerald-400" />
              <span>Blocks</span>
            </div>
            <div className="text-lg font-bold font-mono text-[var(--text-primary)]">
              {stats.totalSessionsCompleted}
            </div>
            <div className="text-[10px] text-[var(--text-muted)] mt-0.5">sessions</div>
          </div>

          {/* Current Streak */}
          <div className="p-3 rounded-2xl bg-[var(--bg-primary)] border border-[var(--border-color)] flex flex-col">
            <div className="flex items-center gap-1 text-[11px] text-[var(--text-muted)] mb-1">
              <Flame className="w-3 h-3 text-amber-500" />
              <span>Streak</span>
            </div>
            <div className="text-lg font-bold font-mono text-amber-400">
              {stats.currentStreak}
              <span className="text-xs font-normal text-[var(--text-muted)] ml-0.5">d</span>
            </div>
            <div className="text-[10px] text-[var(--text-muted)] mt-0.5">day streak</div>
          </div>
        </div>

        {/* 7-Day Chart */}
        <div>
          <div className="text-xs font-medium text-[var(--text-muted)] mb-2 flex items-center justify-between">
            <span>7-Day Activity</span>
            <span className="text-[10px]">Max: {maxMinutes}m</span>
          </div>

          <div className="flex items-end justify-between gap-1.5 h-24 pt-4 px-1">
            {last7Days.map((d) => {
              const heightPercent = maxMinutes > 0 ? Math.max((d.minutes / maxMinutes) * 100, 6) : 6;
              return (
                <div key={d.dateStr} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end group">
                  {/* Tooltip on hover */}
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity text-[9px] font-mono text-[var(--text-muted)] bg-[var(--bg-primary)] px-1 rounded border border-[var(--border-color)] whitespace-nowrap">
                    {d.minutes}m
                  </div>
                  {/* Bar */}
                  <div className="w-full bg-[var(--bg-primary)] rounded-lg h-full flex items-end overflow-hidden p-0.5">
                    <div
                      className={`w-full rounded-md transition-all duration-500 ${
                        d.isToday
                          ? 'bg-gradient-to-t from-indigo-600 to-indigo-400'
                          : d.minutes > 0
                          ? 'bg-indigo-500/40'
                          : 'bg-[var(--border-color)]'
                      }`}
                      style={{ height: `${heightPercent}%` }}
                    />
                  </div>
                  {/* Day label */}
                  <span
                    className={`text-[10px] font-medium ${
                      d.isToday ? 'text-indigo-400 font-bold' : 'text-[var(--text-muted)]'
                    }`}
                  >
                    {d.dayName}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
