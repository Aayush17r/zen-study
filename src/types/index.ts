export type TimerMode = 'pomodoro' | 'shortBreak' | 'longBreak' | 'deepSprint' | 'openFlow';

export type ThemeId = 'amoled' | 'sepia' | 'forest' | 'slate' | 'minimalLight';

export interface ThemeConfig {
  id: ThemeId;
  name: string;
  bgClass: string;
  cardBgClass: string;
  textClass: string;
  textMutedClass: string;
  accentClass: string;
  accentBgClass: string;
  borderClass: string;
  ringClass: string;
}

export interface Task {
  id: string;
  title: string;
  completed: boolean;
  estimatedPomos: number;
  completedPomos: number;
  createdAt: number;
}

export interface Flashcard {
  id: string;
  deckId: string;
  question: string;
  answer: string;
  mastery: 'learning' | 'reviewing' | 'mastered';
  lastReviewed?: number;
}

export interface FlashcardDeck {
  id: string;
  name: string;
  description: string;
}

export interface DailyStats {
  date: string; // YYYY-MM-DD
  minutes: number;
  completedSessions: number;
}

export interface StudyStats {
  todayDate: string;
  totalMinutesToday: number;
  totalSessionsCompleted: number;
  currentStreak: number;
  lastStudyDate: string;
  history: Record<string, DailyStats>;
}

export type AmbientSoundId = 'rain' | 'pinkNoise' | 'ocean' | 'campfire' | 'binaural';

export interface SoundTrackState {
  id: AmbientSoundId;
  name: string;
  volume: number; // 0 to 1
  isPlaying: boolean;
  category: 'nature' | 'noise' | 'focus';
}

export interface TimerSettings {
  pomodoroMinutes: number;
  shortBreakMinutes: number;
  longBreakMinutes: number;
  deepSprintMinutes: number;
  autoStartBreaks: boolean;
  autoStartPomo: boolean;
  soundAlerts: boolean;
  soundVolume: number;
}
