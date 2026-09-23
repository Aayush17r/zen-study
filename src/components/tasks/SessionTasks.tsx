import React, { useState } from 'react';
import { useStudy } from '../../context/StudyContext';
import { CheckSquare, Square, Plus, Trash2, Target, CheckCircle2 } from 'lucide-react';

export const SessionTasks: React.FC = () => {
  const { tasks, activeTaskId, addTask, toggleTask, deleteTask, setActiveTask } = useStudy();
  const [newTitle, setNewTitle] = useState('');
  const [estimatedPomos, setEstimatedPomos] = useState(1);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    addTask(newTitle, estimatedPomos);
    setNewTitle('');
    setEstimatedPomos(1);
  };

  const completedCount = tasks.filter((t) => t.completed).length;

  return (
    <div className="p-6 rounded-3xl bg-[var(--bg-card)] border border-[var(--border-color)] flex flex-col justify-between transition-all">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-indigo-400" />
            <h3 className="text-sm font-semibold text-[var(--text-primary)]">Session Goals</h3>
          </div>
          <span className="text-[11px] font-mono text-[var(--text-muted)] bg-[var(--bg-primary)] px-2.5 py-0.5 rounded-full border border-[var(--border-color)]">
            {completedCount} / {tasks.length} done
          </span>
        </div>
        <p className="text-xs text-[var(--text-muted)] mb-4">
          Break big study targets into micro-actions for maximum momentum.
        </p>

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="flex gap-2 mb-4">
          <input
            type="text"
            placeholder="What are you studying right now?"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            className="flex-1 px-3.5 py-2 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-color)] text-xs text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-indigo-500 transition-colors"
          />
          <select
            value={estimatedPomos}
            onChange={(e) => setEstimatedPomos(Number(e.target.value))}
            title="Estimated Pomodoros"
            className="px-2 py-2 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-color)] text-xs text-[var(--text-muted)] focus:outline-none focus:border-indigo-500 cursor-pointer"
          >
            <option value={1}>1 🍅</option>
            <option value={2}>2 🍅</option>
            <option value={3}>3 🍅</option>
            <option value={4}>4 🍅</option>
            <option value={5}>5 🍅</option>
          </select>
          <button
            type="submit"
            className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium shadow-sm transition-all hover:scale-105 active:scale-95 flex items-center justify-center"
          >
            <Plus className="w-4 h-4" />
          </button>
        </form>

        {/* Task list */}
        <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
          {tasks.length === 0 ? (
            <div className="text-center py-8 text-xs text-[var(--text-muted)]">
              No tasks added yet. Add a bite-sized goal above to begin!
            </div>
          ) : (
            tasks.map((task) => {
              const isActive = activeTaskId === task.id;
              return (
                <div
                  key={task.id}
                  className={`p-3 rounded-2xl border transition-all flex items-center justify-between gap-3 group ${
                    isActive
                      ? 'bg-indigo-600/10 border-indigo-500/50 shadow-sm'
                      : task.completed
                      ? 'bg-[var(--bg-primary)]/40 border-[var(--border-color)] opacity-60'
                      : 'bg-[var(--bg-primary)] border-[var(--border-color)] hover:border-[var(--text-muted)]'
                  }`}
                >
                  {/* Complete checkbox & title */}
                  <div className="flex items-center gap-2.5 flex-1 min-w-0">
                    <button
                      onClick={() => toggleTask(task.id)}
                      className="text-indigo-400 hover:text-indigo-300 transition-colors shrink-0"
                    >
                      {task.completed ? (
                        <CheckSquare className="w-4 h-4 text-emerald-400" />
                      ) : (
                        <Square className="w-4 h-4 text-[var(--text-muted)]" />
                      )}
                    </button>
                    <span
                      onClick={() => toggleTask(task.id)}
                      className={`text-xs cursor-pointer truncate ${
                        task.completed
                          ? 'line-through text-[var(--text-muted)]'
                          : 'text-[var(--text-primary)] font-medium'
                      }`}
                    >
                      {task.title}
                    </span>
                  </div>

                  {/* Badges & Actions */}
                  <div className="flex items-center gap-1.5 shrink-0">
                    {/* Pomodoro count pill */}
                    <span className="text-[10px] font-mono text-[var(--text-muted)] px-1.5 py-0.5 rounded bg-[var(--bg-card)] border border-[var(--border-color)]">
                      {task.completedPomos}/{task.estimatedPomos} 🍅
                    </span>

                    {/* Set Active Goal button */}
                    <button
                      onClick={() => setActiveTask(isActive ? null : task.id)}
                      title={isActive ? 'Active Study Goal' : 'Focus on this task'}
                      className={`p-1.5 rounded-lg border transition-all ${
                        isActive
                          ? 'bg-indigo-600 text-white border-indigo-600'
                          : 'text-[var(--text-muted)] hover:text-[var(--text-primary)] border-transparent hover:border-[var(--border-color)]'
                      }`}
                    >
                      <Target className="w-3.5 h-3.5" />
                    </button>

                    {/* Delete button */}
                    <button
                      onClick={() => deleteTask(task.id)}
                      title="Delete task"
                      className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-rose-400 transition-colors opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
