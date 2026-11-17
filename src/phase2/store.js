import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { MISSIONS } from './missions';
import { DEF_BY_ID, defaultVals } from './blockDefs';
import { initialRobot } from '../engine/grid';

const mk = (blocks, defId, vals) => ({
  uid: blocks.reduce((m, b) => Math.max(m, b.uid), 100) + 1,
  defId,
  vals: vals ?? defaultVals(DEF_BY_ID[defId]),
});

const SEED = [
  { uid: 101, defId: 'when_start', vals: [] },
  { uid: 102, defId: 'move', vals: [3] },
];

/**
 * State Fase 2.
 *  - disimpan di perangkat: blocks, mission, best (skor terbaik per misi)
 *  - sementara: robot, status, pesan, skor & kemajuan saat berjalan
 */
export const usePhase2Store = create(
  persist(
    (set) => ({
      blocks: SEED,
      category: 'motion',
      mission: 0,
      best: {}, // { [missionIndex]: skor terbaik }

      robot: initialRobot(MISSIONS[0]),
      bumpKey: 0,
      runningUid: null,
      status: 'idle', // idle | running | win | fail | error
      message: '',
      score: 0,
      progress: 0,

      setCategory: (category) => set({ category }),
      addBlock: (defId) => set((s) => ({ blocks: [...s.blocks, mk(s.blocks, defId)] })),
      removeBlock: (uid) => set((s) => ({ blocks: s.blocks.filter((b) => b.uid !== uid) })),
      clearBlocks: () => set({ blocks: [] }),
      /** Ganti satu nilai pada blok dengan nilai berikutnya di daftar opsinya. */
      cycleVal: (uid, k) =>
        set((s) => ({
          blocks: s.blocks.map((b) => {
            if (b.uid !== uid) return b;
            const part = DEF_BY_ID[b.defId].parts.filter((p) => p.opts)[k];
            const next = part.opts[(part.opts.indexOf(b.vals[k]) + 1) % part.opts.length];
            return { ...b, vals: b.vals.map((v, i) => (i === k ? next : v)) };
          }),
        })),
      setMission: (mission) => set({ mission }),
      patch: (o) => set(o),
    }),
    {
      name: 'roboedu-phase2',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (s) => ({ blocks: s.blocks, mission: s.mission, best: s.best }),
    }
  )
);
