import React, { useState } from 'react';
import { useStudy } from '../../context/StudyContext';
import { BookOpen, Copy, Check, Download, RotateCcw } from 'lucide-react';

export const Scratchpad: React.FC = () => {
  const { notes, setNotes } = useStudy();
  const [copied, setCopied] = useState(false);

  const wordCount = notes.trim() ? notes.trim().split(/\s+/).length : 0;
  const charCount = notes.length;

  const handleCopy = () => {
    navigator.clipboard.writeText(notes);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([notes], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `study-notes-${new Date().toISOString().split('T')[0]}.md`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleReset = () => {
    if (window.confirm('Are you sure you want to clear your scratchpad?')) {
      setNotes('');
    }
  };

  return (
    <div className="p-6 rounded-3xl bg-[var(--bg-card)] border border-[var(--border-color)] flex flex-col justify-between h-full transition-all">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-indigo-400" />
            <h3 className="text-sm font-semibold text-[var(--text-primary)]">Quick Scratchpad</h3>
          </div>
          <div className="flex items-center gap-1.5">
            <button
              onClick={handleCopy}
              title="Copy notes to clipboard"
              className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-card-hover)] border border-[var(--border-color)] transition-all"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
            <button
              onClick={handleDownload}
              title="Download as Markdown"
              className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-card-hover)] border border-[var(--border-color)] transition-all"
            >
              <Download className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={handleReset}
              title="Clear notes"
              className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-rose-400 hover:bg-[var(--bg-card-hover)] border border-[var(--border-color)] transition-all"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
        <p className="text-xs text-[var(--text-muted)] mb-3">
          Jot down quick thoughts, formulas, or summaries without switching windows.
        </p>

        {/* Text Area */}
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Type your lecture notes, summaries, or questions here..."
          className="w-full h-56 sm:h-64 p-3.5 rounded-2xl bg-[var(--bg-primary)] border border-[var(--border-color)] text-xs sm:text-sm font-mono text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-indigo-500 resize-none transition-colors leading-relaxed"
        />
      </div>

      {/* Footer Info */}
      <div className="mt-3 pt-2 border-t border-[var(--border-color)] flex items-center justify-between text-[11px] text-[var(--text-muted)]">
        <span>Auto-saved to browser storage</span>
        <span>
          {wordCount} words · {charCount} chars
        </span>
      </div>
    </div>
  );
};
