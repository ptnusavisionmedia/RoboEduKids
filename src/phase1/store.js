import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MAX_BLOCKS } from './blocks';

/** Phase 1 state. Program is temporary; stars + audio setting are saved on the device. */
export const usePhase1Store = create(
  persist(
    (set) => ({
      program: [], // ordered list of block ids on the canvas
      audioOn: true, // also controls haptic feedback
      stars: {}, // { [level]: 1..3 }

      addBlock: (id) =>
        set((s) => (s.program.length >= MAX_BLOCKS ? s : { program: [...s.program, id] })),
      removeAt: (index) => set((s) => ({ program: s.program.filter((_, i) => i !== index) })),
      clearProgram: () => set({ program: [] }),
      toggleAudio: () => set((s) => ({ audioOn: !s.audioOn })),
      finishLevel: (level, stars) =>
        set((s) => ({ stars: { ...s.stars, [level]: Math.max(s.stars[level] || 0, stars) } })),
    }),
    {
      name: 'roboedu-phase1',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (s) => ({ audioOn: s.audioOn, stars: s.stars }),
    }
  )
);

/** Highest finished level (next one is unlocked). */
export const completedLevels = (stars) =>
  Object.keys(stars).reduce((m, k) => Math.max(m, Number(k)), 0);

export const totalStars = (stars) => Object.values(stars).reduce((a, b) => a + b, 0);
