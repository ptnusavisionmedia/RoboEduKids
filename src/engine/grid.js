// Pure grid-world helpers shared by Phase 1 and Phase 2 (no React here).
// dir: 0 = atas, 1 = kanan, 2 = bawah, 3 = kiri.
export const DX = [0, 1, 0, -1];
export const DY = [-1, 0, 1, 0];

/** Robot state = {x, y, dir, angle}. `angle` accumulates so rotations animate the short way. */
export const initialRobot = (level) => ({
  x: level.start.x,
  y: level.start.y,
  dir: level.start.dir,
  angle: level.start.dir * 90,
});

export const frontOf = (r) => ({ x: r.x + DX[r.dir], y: r.y + DY[r.dir] });

export const isBlocked = (level, x, y) =>
  x < 0 || y < 0 || x >= level.cols || y >= level.rows || level.walls.some((w) => w[0] === x && w[1] === y);

/** Rotate by deg (negative = left). Multiples of 90 only. */
export const turn = (r, deg) => ({
  ...r,
  dir: (((r.dir + deg / 90) % 4) + 4) % 4,
  angle: r.angle + deg,
});

export const atGoal = (level, r) => r.x === level.goal.x && r.y === level.goal.y;
