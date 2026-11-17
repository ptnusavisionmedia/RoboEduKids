// 12 levels on a 5x5 grid. Every level is verified solvable (BFS over position + direction).
// start.dir: 0 = atas, 1 = kanan, 2 = bawah, 3 = kiri. `min` = fewest blocks without using loops.
const RAW = [
  { start: { x: 0, y: 2, dir: 1 }, goal: { x: 3, y: 2 }, walls: [], min: 3 },
  { start: { x: 0, y: 2, dir: 1 }, goal: { x: 4, y: 2 }, walls: [], min: 4 },
  { start: { x: 0, y: 4, dir: 1 }, goal: { x: 3, y: 2 }, walls: [], min: 6 },
  { start: { x: 0, y: 0, dir: 2 }, goal: { x: 4, y: 4 }, walls: [], min: 9 },
  { start: { x: 4, y: 3, dir: 3 }, goal: { x: 0, y: 2 }, walls: [[4, 1], [2, 0]], min: 6 },
  { start: { x: 4, y: 2, dir: 0 }, goal: { x: 0, y: 4 }, walls: [[3, 3], [2, 4], [2, 0]], min: 8 },
  { start: { x: 2, y: 0, dir: 0 }, goal: { x: 2, y: 3 }, walls: [[2, 1], [0, 2], [3, 2], [1, 3]], min: 9 },
  { start: { x: 1, y: 3, dir: 1 }, goal: { x: 2, y: 0 }, walls: [[3, 3], [0, 4], [2, 2], [1, 1]], min: 10 },
  { start: { x: 3, y: 4, dir: 0 }, goal: { x: 1, y: 0 }, walls: [[3, 1], [2, 2], [1, 1], [1, 4], [2, 3]], min: 11 },
  { start: { x: 4, y: 4, dir: 3 }, goal: { x: 0, y: 0 }, walls: [[2, 0], [1, 4], [2, 1], [2, 4], [3, 3]], min: 11 },
  { start: { x: 4, y: 0, dir: 1 }, goal: { x: 0, y: 3 }, walls: [[0, 0], [2, 0], [1, 0], [1, 3], [4, 1], [3, 3]], min: 12 },
  { start: { x: 2, y: 3, dir: 0 }, goal: { x: 4, y: 1 }, walls: [[0, 2], [2, 2], [3, 1], [4, 2], [4, 3], [1, 0]], min: 14 },
];

export const LEVELS = RAW.map((l) => ({ ...l, cols: 5, rows: 5 }));

/** 3 stars if you used the fewest blocks, 2 if close, otherwise 1. */
export const starsFor = (level, blockCount) =>
  blockCount <= level.min ? 3 : blockCount <= level.min + 3 ? 2 : 1;
