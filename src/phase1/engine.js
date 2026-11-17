import { atGoal, frontOf, initialRobot, isBlocked, turn } from '../engine/grid';

/**
 * Phase 1 semantics:
 *  - Maju     : move one cell forward (a wall = "bump", robot stays)
 *  - Kiri/Kanan: turn 90 degrees
 *  - Ulang    : repeat the block right AFTER it 3 times (a loop at the end does nothing)
 * Returns every intermediate state so the UI can animate them one by one.
 * `idx` = which block on the canvas is currently being executed (for highlighting).
 */
export function simulate(level, program) {
  const actions = [];
  for (let i = 0; i < program.length; i += 1) {
    if (program[i] === 'loop') {
      if (i + 1 < program.length) {
        actions.push({ id: 'mark', idx: i });
        for (let k = 0; k < 3; k += 1) actions.push({ id: program[i + 1], idx: i + 1 });
        i += 1;
      }
    } else {
      actions.push({ id: program[i], idx: i });
    }
  }

  let r = initialRobot(level);
  const states = [{ robot: r, idx: -1, bump: false }];
  let won = false;

  for (const a of actions) {
    let bump = false;
    if (a.id === 'forward') {
      const f = frontOf(r);
      if (isBlocked(level, f.x, f.y)) bump = true;
      else r = { ...r, x: f.x, y: f.y };
    } else if (a.id === 'left') r = turn(r, -90);
    else if (a.id === 'right') r = turn(r, 90);
    states.push({ robot: r, idx: a.idx, bump });
    if (atGoal(level, r)) {
      won = true;
      break;
    }
  }
  return { states, won };
}
