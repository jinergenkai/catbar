import { create } from 'zustand';

interface SettingsStore {
  // Resize bar
  barSize: number;
  setBarSize: (size: number) => void;

  // Button display
  showMusicButton: boolean;
  showFeatureButton: boolean;
  setShowMusicButton: (show: boolean) => void;
  setShowFeatureButton: (show: boolean) => void;

  // Language
  language: 'vi' | 'en';
  setLanguage: (lang: 'vi' | 'en') => void;

  // Notifications
  notificationsEnabled: boolean;
  setNotificationsEnabled: (enabled: boolean) => void;

  // Pomodoro
  pomodoroMinutes: number;
  setPomodoroMinutes: (minutes: number) => void;

  // Auto expand
  autoExpand: boolean;
  setAutoExpand: (enabled: boolean) => void;

  // Weather forecast
  weatherEnabled: boolean;
  setWeatherEnabled: (enabled: boolean) => void;

  // Vocabulary learning
  vocabularyEnabled: boolean;
  setVocabularyEnabled: (enabled: boolean) => void;
  wordsPerDay: number;
  setWordsPerDay: (count: number) => void;

  // Startup with Windows
  startWithWindows: boolean;
  setStartWithWindows: (enabled: boolean) => void;
}

export const useSettingsStore = create<SettingsStore>((set) => ({
  // Resize bar
  barSize: 50,
  setBarSize: (size) => set({ barSize: size }),

  // Button display
  showMusicButton: true,
  showFeatureButton: true,
  setShowMusicButton: (show) => set({ showMusicButton: show }),
  setShowFeatureButton: (show) => set({ showFeatureButton: show }),

  // Language
  language: 'vi',
  setLanguage: (lang) => set({ language: lang }),

  // Notifications
  notificationsEnabled: true,
  setNotificationsEnabled: (enabled) => set({ notificationsEnabled: enabled }),

  // Pomodoro
  pomodoroMinutes: 25,
  setPomodoroMinutes: (minutes) => set({ pomodoroMinutes: minutes }),

  // Auto expand
  autoExpand: false,
  setAutoExpand: (enabled) => set({ autoExpand: enabled }),

  // Weather forecast
  weatherEnabled: true,
  setWeatherEnabled: (enabled) => set({ weatherEnabled: enabled }),

  // Vocabulary learning
  vocabularyEnabled: true,
  setVocabularyEnabled: (enabled) => set({ vocabularyEnabled: enabled }),
  wordsPerDay: 5,
  setWordsPerDay: (count) => set({ wordsPerDay: count }),

  // Startup with Windows
  startWithWindows: false,
  setStartWithWindows: (enabled) => set({ startWithWindows: enabled }),
}));