// 3 misi pada grid 8x5. Semua diverifikasi bisa diselesaikan (BFS posisi + arah).
// start.dir: 0 = atas, 1 = kanan, 2 = bawah, 3 = kiri.
const RAW = [
  { name: 'Jalan Lurus', start: { x: 0, y: 2, dir: 1 }, goal: { x: 7, y: 2 }, walls: [] },
  {
    name: 'Labirin Mini',
    start: { x: 1, y: 4, dir: 2 },
    goal: { x: 7, y: 0 },
    walls: [[6, 1], [0, 0], [7, 4], [4, 2], [4, 3], [6, 3], [3, 2]],
  },
  {
    name: 'Zig-zag Rintangan',
    start: { x: 0, y: 3, dir: 0 },
    goal: { x: 7, y: 2 },
    walls: [[3, 3], [4, 4], [7, 3], [5, 4], [1, 2], [5, 2], [4, 2], [0, 2], [3, 1], [6, 3]],
  },
];

export const MISSIONS = RAW.map((m) => ({ ...m, cols: 8, rows: 5 }));
