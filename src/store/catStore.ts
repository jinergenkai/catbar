// Zustand store cho trạng thái mèo
import { create } from 'zustand';

interface CatState {
  mood: string;
  hunger: number;
  setMood: (mood: string) => void;
  feed: () => void;
}

export const useCatStore = create<CatState>((set) => ({
  mood: 'happy',
  hunger: 0,
  setMood: (mood) => set({ mood }),
  feed: () => set((state) => ({ hunger: state.hunger + 1 })),
}));