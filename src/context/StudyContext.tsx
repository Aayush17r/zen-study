import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import type {
  TimerMode,
  ThemeId,
  Task,
  Flashcard,
  FlashcardDeck,
  StudyStats,
  AmbientSoundId,
  SoundTrackState,
  TimerSettings,
} from '../types';
import { soundEngine } from '../services/audioEngine';

interface StudyContextType {
  // Theme
  theme: ThemeId;
  setTheme: (t: ThemeId) => void;

  // Zen Mode
  isZenMode: boolean;
  toggleZenMode: () => void;

  // Timer
  mode: TimerMode;
  timeLeft: number;
  totalTime: number;
  isRunning: boolean;
  startTimer: () => void;
  pauseTimer: () => void;
  resetTimer: () => void;
  switchMode: (mode: TimerMode) => void;
  timerSettings: TimerSettings;
  updateTimerSettings: (settings: Partial<TimerSettings>) => void;

  // Tasks
  tasks: Task[];
  activeTaskId: string | null;
  addTask: (title: string, estimatedPomos?: number) => void;
  toggleTask: (id: string) => void;
  deleteTask: (id: string) => void;
  setActiveTask: (id: string | null) => void;

  // Notes
  notes: string;
  setNotes: (text: string) => void;

  // Flashcards
  decks: FlashcardDeck[];
  flashcards: Flashcard[];
  activeDeckId: string | null;
  setActiveDeckId: (id: string | null) => void;
  addDeck: (name: string, description: string) => void;
  deleteDeck: (deckId: string) => void;
  addCard: (deckId: string, question: string, answer: string) => void;
  deleteCard: (cardId: string) => void;
  updateCardMastery: (cardId: string, mastery: 'learning' | 'reviewing' | 'mastered') => void;

  // Stats
  stats: StudyStats;

  // Sounds
  sounds: SoundTrackState[];
  toggleSound: (id: AmbientSoundId) => void;
  setSoundVolume: (id: AmbientSoundId, volume: number) => void;
  stopAllSounds: () => void;
}

const StudyContext = createContext<StudyContextType | undefined>(undefined);

const DEFAULT_SETTINGS: TimerSettings = {
  pomodoroMinutes: 25,
  shortBreakMinutes: 5,
  longBreakMinutes: 15,
  deepSprintMinutes: 50,
  autoStartBreaks: false,
  autoStartPomo: false,
  soundAlerts: true,
  soundVolume: 0.7,
};

const DEFAULT_SOUNDS: SoundTrackState[] = [
  { id: 'rain', name: 'Gentle Rain', volume: 0.5, isPlaying: false, category: 'nature' },
  { id: 'pinkNoise', name: 'Deep Pink Noise', volume: 0.4, isPlaying: false, category: 'noise' },
  { id: 'ocean', name: 'Ocean Waves', volume: 0.5, isPlaying: false, category: 'nature' },
  { id: 'campfire', name: 'Cozy Campfire', volume: 0.45, isPlaying: false, category: 'nature' },
  { id: 'binaural', name: '14Hz Alpha Focus', volume: 0.35, isPlaying: false, category: 'focus' },
];

const INITIAL_DECKS: FlashcardDeck[] = [
  { id: 'deck-1', name: 'Core Study Strategies', description: 'Proven science-backed learning techniques' },
];

const INITIAL_CARDS: Flashcard[] = [
  {
    id: 'c1',
    deckId: 'deck-1',
    question: 'What is Active Recall and why is it effective?',
    answer: 'Testing your memory during learning rather than passively re-reading. It strengthens neural retrieval pathways.',
    mastery: 'learning',
  },
  {
    id: 'c2',
    deckId: 'deck-1',
    question: 'What is the Spaced Repetition effect?',
    answer: 'Reviewing material at systematic expanding intervals to combat the Ebbinghaus forgetting curve.',
    mastery: 'reviewing',
  },
  {
    id: 'c3',
    deckId: 'deck-1',
    question: 'What is the Feynman Technique?',
    answer: 'Explaining a complex concept in plain, simple language as if teaching a beginner to expose knowledge gaps.',
    mastery: 'mastered',
  },
];

const getTodayString = () => new Date().toISOString().split('T')[0];

export const StudyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Theme state
  const [theme, setThemeState] = useState<ThemeId>(() => {
    return (localStorage.getItem('zen_theme') as ThemeId) || 'amoled';
  });

  const setTheme = (t: ThemeId) => {
    setThemeState(t);
    localStorage.setItem('zen_theme', t);
    document.documentElement.setAttribute('data-theme', t);
  };

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Zen Mode
  const [isZenMode, setIsZenMode] = useState<boolean>(false);
  const toggleZenMode = () => {
    if (!isZenMode) {
      if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen().catch(() => {});
      }
    } else {
      if (document.fullscreenElement && document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      }
    }
    setIsZenMode((prev) => !prev);
  };

  // Keyboard shortcut listener for Zen mode (Z or F)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in an input, textarea, or contentEditable
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) {
        return;
      }
      if (e.key.toLowerCase() === 'z') {
        toggleZenMode();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isZenMode]);

  // Settings
  const [timerSettings, setTimerSettings] = useState<TimerSettings>(() => {
    const saved = localStorage.getItem('zen_settings');
    return saved ? { ...DEFAULT_SETTINGS, ...JSON.parse(saved) } : DEFAULT_SETTINGS;
  });

  const updateTimerSettings = (newSettings: Partial<TimerSettings>) => {
    setTimerSettings((prev) => {
      const updated = { ...prev, ...newSettings };
      localStorage.setItem('zen_settings', JSON.stringify(updated));
      return updated;
    });
  };

  // Timer State
  const [mode, setMode] = useState<TimerMode>('pomodoro');
  const [isRunning, setIsRunning] = useState<boolean>(false);

  const getDurationForMode = (m: TimerMode): number => {
    switch (m) {
      case 'pomodoro':
        return timerSettings.pomodoroMinutes * 60;
      case 'shortBreak':
        return timerSettings.shortBreakMinutes * 60;
      case 'longBreak':
        return timerSettings.longBreakMinutes * 60;
      case 'deepSprint':
        return timerSettings.deepSprintMinutes * 60;
      case 'openFlow':
        return 0;
    }
  };

  const [timeLeft, setTimeLeft] = useState<number>(() => getDurationForMode('pomodoro'));
  const [totalTime, setTotalTime] = useState<number>(() => getDurationForMode('pomodoro'));

  // Sync timer when settings change if not running
  useEffect(() => {
    if (!isRunning && mode !== 'openFlow') {
      const dur = getDurationForMode(mode);
      setTimeLeft(dur);
      setTotalTime(dur);
    }
  }, [timerSettings, mode]);

  // Tasks State
  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem('zen_tasks');
    return saved
      ? JSON.parse(saved)
      : [
          {
            id: 't-1',
            title: 'Welcome to ZenStudy! Check this off once you are ready.',
            completed: false,
            estimatedPomos: 1,
            completedPomos: 0,
            createdAt: Date.now(),
          },
        ];
  });

  const [activeTaskId, setActiveTaskId] = useState<string | null>(() => {
    return localStorage.getItem('zen_active_task_id') || (tasks[0]?.id ?? null);
  });

  useEffect(() => {
    localStorage.setItem('zen_tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    if (activeTaskId) {
      localStorage.setItem('zen_active_task_id', activeTaskId);
    } else {
      localStorage.removeItem('zen_active_task_id');
    }
  }, [activeTaskId]);

  const addTask = (title: string, estimatedPomos = 1) => {
    if (!title.trim()) return;
    const newTask: Task = {
      id: 'task-' + Date.now(),
      title: title.trim(),
      completed: false,
      estimatedPomos,
      completedPomos: 0,
      createdAt: Date.now(),
    };
    setTasks((prev) => [newTask, ...prev]);
    if (!activeTaskId) setActiveTaskId(newTask.id);
  };

  const toggleTask = (id: string) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === id) {
          const isDone = !t.completed;
          if (isDone) {
            confetti({ particleCount: 60, spread: 60, origin: { y: 0.8 } });
          }
          return { ...t, completed: isDone };
        }
        return t;
      })
    );
  };

  const deleteTask = (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
    if (activeTaskId === id) setActiveTaskId(null);
  };

  // Notes
  const [notes, setNotesState] = useState<string>(() => {
    return (
      localStorage.getItem('zen_notes') ||
      '# Study Notes & Objectives\n\n- [ ] Deep study goal for today:\n- Key formulas / vocabulary:\n- Questions to review:\n'
    );
  });

  const setNotes = (text: string) => {
    setNotesState(text);
    localStorage.setItem('zen_notes', text);
  };

  // Flashcards
  const [decks, setDecks] = useState<FlashcardDeck[]>(() => {
    const saved = localStorage.getItem('zen_decks');
    return saved ? JSON.parse(saved) : INITIAL_DECKS;
  });

  const [flashcards, setFlashcards] = useState<Flashcard[]>(() => {
    const saved = localStorage.getItem('zen_flashcards');
    return saved ? JSON.parse(saved) : INITIAL_CARDS;
  });

  const [activeDeckId, setActiveDeckId] = useState<string | null>(decks[0]?.id || null);

  useEffect(() => {
    localStorage.setItem('zen_decks', JSON.stringify(decks));
  }, [decks]);

  useEffect(() => {
    localStorage.setItem('zen_flashcards', JSON.stringify(flashcards));
  }, [flashcards]);

  const addDeck = (name: string, description: string) => {
    const newDeck: FlashcardDeck = {
      id: 'deck-' + Date.now(),
      name: name.trim(),
      description: description.trim(),
    };
    setDecks((prev) => [...prev, newDeck]);
    setActiveDeckId(newDeck.id);
  };

  const deleteDeck = (deckId: string) => {
    setDecks((prev) => prev.filter((d) => d.id !== deckId));
    setFlashcards((prev) => prev.filter((c) => c.deckId !== deckId));
    if (activeDeckId === deckId) {
      setActiveDeckId(decks.find((d) => d.id !== deckId)?.id || null);
    }
  };

  const addCard = (deckId: string, question: string, answer: string) => {
    const newCard: Flashcard = {
      id: 'card-' + Date.now(),
      deckId,
      question: question.trim(),
      answer: answer.trim(),
      mastery: 'learning',
    };
    setFlashcards((prev) => [...prev, newCard]);
  };

  const deleteCard = (cardId: string) => {
    setFlashcards((prev) => prev.filter((c) => c.id !== cardId));
  };

  const updateCardMastery = (cardId: string, mastery: 'learning' | 'reviewing' | 'mastered') => {
    setFlashcards((prev) =>
      prev.map((c) => (c.id === cardId ? { ...c, mastery, lastReviewed: Date.now() } : c))
    );
  };

  // Study Stats
  const [stats, setStats] = useState<StudyStats>(() => {
    const saved = localStorage.getItem('zen_stats');
    const today = getTodayString();
    if (saved) {
      const parsed: StudyStats = JSON.parse(saved);
      if (parsed.todayDate !== today) {
        // New day! Check streak
        const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
        const keptStreak = parsed.lastStudyDate === yesterday;
        return {
          ...parsed,
          todayDate: today,
          totalMinutesToday: 0,
          totalSessionsCompleted: 0,
          currentStreak: keptStreak ? parsed.currentStreak : 0,
        };
      }
      return parsed;
    }
    return {
      todayDate: today,
      totalMinutesToday: 0,
      totalSessionsCompleted: 0,
      currentStreak: 1,
      lastStudyDate: today,
      history: {
        [today]: { date: today, minutes: 0, completedSessions: 0 },
      },
    };
  });

  const recordStudySession = (minutesStudied: number) => {
    const today = getTodayString();
    setStats((prev) => {
      const todayStats = prev.history[today] || { date: today, minutes: 0, completedSessions: 0 };
      const updatedTodayStats = {
        date: today,
        minutes: todayStats.minutes + minutesStudied,
        completedSessions: todayStats.completedSessions + 1,
      };

      const updatedHistory = {
        ...prev.history,
        [today]: updatedTodayStats,
      };

      const updated: StudyStats = {
        ...prev,
        todayDate: today,
        totalMinutesToday: prev.totalMinutesToday + minutesStudied,
        totalSessionsCompleted: prev.totalSessionsCompleted + 1,
        lastStudyDate: today,
        currentStreak: prev.lastStudyDate === today ? prev.currentStreak : prev.currentStreak + 1,
        history: updatedHistory,
      };

      localStorage.setItem('zen_stats', JSON.stringify(updated));
      return updated;
    });

    // If there is an active task, increment completed Pomos
    if (activeTaskId) {
      setTasks((prev) =>
        prev.map((t) => (t.id === activeTaskId ? { ...t, completedPomos: t.completedPomos + 1 } : t))
      );
    }
  };

  // Timer Tick Loop
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    if (isRunning) {
      timerRef.current = window.setInterval(() => {
        setTimeLeft((prev) => {
          if (mode === 'openFlow') {
            return prev + 1;
          }

          if (prev <= 1) {
            // Session Finished!
            clearInterval(timerRef.current!);
            setIsRunning(false);

            if (timerSettings.soundAlerts) {
              soundEngine.playChime(timerSettings.soundVolume);
            }

            const minutesEarned = Math.round(totalTime / 60);
            if (mode === 'pomodoro' || mode === 'deepSprint') {
              recordStudySession(minutesEarned);
              confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
              // Prompt for break
              switchMode('shortBreak');
            } else {
              // Break finished -> switch to Pomodoro
              switchMode('pomodoro');
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning, mode, totalTime, timerSettings.soundAlerts, timerSettings.soundVolume, activeTaskId]);

  const startTimer = () => setIsRunning(true);
  const pauseTimer = () => setIsRunning(false);

  const resetTimer = () => {
    setIsRunning(false);
    const dur = getDurationForMode(mode);
    setTimeLeft(dur);
    setTotalTime(dur);
  };

  const switchMode = (newMode: TimerMode) => {
    setIsRunning(false);
    setMode(newMode);
    const dur = getDurationForMode(newMode);
    setTimeLeft(dur);
    setTotalTime(dur);
  };

  // Soundscape State
  const [sounds, setSounds] = useState<SoundTrackState[]>(DEFAULT_SOUNDS);

  const toggleSound = (id: AmbientSoundId) => {
    setSounds((prev) =>
      prev.map((s) => {
        if (s.id === id) {
          const nextState = !s.isPlaying;
          soundEngine.toggleSound(id, nextState, s.volume);
          return { ...s, isPlaying: nextState };
        }
        return s;
      })
    );
  };

  const setSoundVolume = (id: AmbientSoundId, volume: number) => {
    setSounds((prev) =>
      prev.map((s) => {
        if (s.id === id) {
          soundEngine.setVolume(id, volume);
          return { ...s, volume };
        }
        return s;
      })
    );
  };

  const stopAllSounds = () => {
    soundEngine.stopAll();
    setSounds((prev) => prev.map((s) => ({ ...s, isPlaying: false })));
  };

  return (
    <StudyContext.Provider
      value={{
        theme,
        setTheme,
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
        timerSettings,
        updateTimerSettings,
        tasks,
        activeTaskId,
        addTask,
        toggleTask,
        deleteTask,
        setActiveTask: setActiveTaskId,
        notes,
        setNotes,
        decks,
        flashcards,
        activeDeckId,
        setActiveDeckId,
        addDeck,
        deleteDeck,
        addCard,
        deleteCard,
        updateCardMastery,
        stats,
        sounds,
        toggleSound,
        setSoundVolume,
        stopAllSounds,
      }}
    >
      {children}
    </StudyContext.Provider>
  );
};

export const useStudy = () => {
  const context = useContext(StudyContext);
  if (!context) throw new Error('useStudy must be used within a StudyProvider');
  return context;
};
