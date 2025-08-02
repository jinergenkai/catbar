import { emit, listen } from '@tauri-apps/api/event';
import { load } from '@tauri-apps/plugin-store';

import { create } from 'zustand';

// Định nghĩa kiểu dữ liệu cho settings
interface Settings {
  barSize: number;
  showMusicButton: boolean;
  showFeatureButton: boolean;
  theme: 'dark' | 'light' | 'system';
  language: 'vi' | 'en';
  notificationsEnabled: boolean;
  pomodoroMinutes: number;
  autoExpand: boolean;
  weatherEnabled: boolean;
  vocabularyEnabled: boolean;
  wordsPerDay: number;
  startWithWindows: boolean;
}

// Giá trị mặc định
const defaultSettings: Settings = {
  barSize: 50,
  showMusicButton: true,
  showFeatureButton: true,
  theme: 'system',
  language: 'vi',
  notificationsEnabled: true,
  pomodoroMinutes: 25,
  autoExpand: false,
  weatherEnabled: true,
  vocabularyEnabled: true,
  wordsPerDay: 5,
  startWithWindows: false,
};

// Khởi tạo store
let store: Awaited<ReturnType<typeof load>>;

// Khởi tạo store và đăng ký listener
export async function initSettings() {
  store = await load('settings.json');
  
  // Lắng nghe sự thay đổi từ các window khác
  listen('setting-changed', async (event: any) => {
    const { key, value } = event.payload as { key: keyof Settings; value: any };
    const currentState = useSettings.getState();
    useSettings.setState({ settings: { ...currentState.settings, [key]: value } });
  });

  // Load tất cả các giá trị từ store
  const loadedValues = await Promise.all(
    Object.keys(defaultSettings).map(async (key) => {
      const value = await store.get(key);
      return { key, value };
    })
  );

  const loadedSettings = { ...defaultSettings };
  loadedValues.forEach(({ key, value }) => {
    if (value !== null && value !== undefined) {
      (loadedSettings as any)[key] = value;
    }
  });

  // Cập nhật state với các giá trị đã load
  useSettings.setState({ settings: loadedSettings });
}

// Hàm helper để cập nhật giá trị
async function setSetting<K extends keyof Settings>(key: K, value: Settings[K]) {
  if (!store) throw new Error('Settings store chưa được khởi tạo');
  
  await store.set(key, value);
  await store.save();
  
  // Cập nhật local state
  const currentState = useSettings.getState();
  useSettings.setState({ settings: { ...currentState.settings, [key]: value } });
  
  // Emit event để thông báo cho các window khác
  await emit('setting-changed', { key, value });
}

// Hook để sử dụng settings trong React components
export const useSettings = create<{
  settings: Settings;
  setBarSize: (size: number) => Promise<void>;
  setShowMusicButton: (show: boolean) => Promise<void>;
  setShowFeatureButton: (show: boolean) => Promise<void>;
  setTheme: (theme: 'dark' | 'light' | 'system') => Promise<void>;
  setLanguage: (lang: 'vi' | 'en') => Promise<void>;
  setNotificationsEnabled: (enabled: boolean) => Promise<void>;
  setPomodoroMinutes: (minutes: number) => Promise<void>;
  setAutoExpand: (enabled: boolean) => Promise<void>;
  setWeatherEnabled: (enabled: boolean) => Promise<void>;
  setVocabularyEnabled: (enabled: boolean) => Promise<void>;
  setWordsPerDay: (count: number) => Promise<void>;
  setStartWithWindows: (enabled: boolean) => Promise<void>;
}>(() => ({
  settings: defaultSettings,
  setBarSize: (size) => setSetting('barSize', size),
  setShowMusicButton: (show) => setSetting('showMusicButton', show),
  setShowFeatureButton: (show) => setSetting('showFeatureButton', show),
  setTheme: (theme) => setSetting('theme', theme),
  setLanguage: (lang) => setSetting('language', lang),
  setNotificationsEnabled: (enabled) => setSetting('notificationsEnabled', enabled),
  setPomodoroMinutes: (minutes) => setSetting('pomodoroMinutes', minutes),
  setAutoExpand: (enabled) => setSetting('autoExpand', enabled),
  setWeatherEnabled: (enabled) => setSetting('weatherEnabled', enabled),
  setVocabularyEnabled: (enabled) => setSetting('vocabularyEnabled', enabled),
  setWordsPerDay: (count) => setSetting('wordsPerDay', count),
  setStartWithWindows: (enabled) => setSetting('startWithWindows', enabled),
}));