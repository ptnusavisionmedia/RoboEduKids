import { DEF_BY_ID } from './blockDefs';
import { atGoal, frontOf, initialRobot, isBlocked, turn } from '../engine/grid';

const MAX_STEPS = 400;

/**
 * Menjalankan tumpukan blok pada sebuah misi, lalu mengembalikan seluruh langkahnya
 * agar UI bisa menganimasikannya satu per satu.
 *
 * Aturan:
 *  - Skrip dimulai dari blok "saat ▶ diklik" (hat) dan berjalan ke bawah.
 *  - "ulangi N" mengulang SATU pernyataan di bawahnya; "jika ada rintangan" menjalankan
 *    SATU pernyataan di bawahnya hanya bila ada dinding di depan. Keduanya bisa ditumpuk.
 *  - Robot berhenti begitu mencapai bendera.
 */
export function runProgram(mission, blocks) {
  const hat = blocks.findIndex((b) => DEF_BY_ID[b.defId].hat);
  if (hat < 0) return { error: 'NO_HAT', steps: [], won: false, score: 0 };

  const list = blocks.slice(hat + 1).filter((b) => !DEF_BY_ID[b.defId].hat);

  // --- parse: ubah daftar datar menjadi pohon pernyataan ---
  function parseStmt(i) {
    const b = list[i];
    const node = { id: b.defId, uid: b.uid, v: b.vals, body: null };
    if (b.defId === 'repeat' || b.defId === 'if_obstacle') {
      if (i + 1 < list.length) {
        const [body, next] = parseStmt(i + 1);
        node.body = body;
        return [node, next];
      }
    }
    return [node, i + 1];
  }
  const nodes = [];
  for (let i = 0; i < list.length; ) {
    const [n, next] = parseStmt(i);
    nodes.push(n);
    i = next;
  }

  // --- eksekusi ---
  let r = initialRobot(mission);
  let score = 0;
  let won = false;
  const steps = [];
  const done = () => won || steps.length >= MAX_STEPS;
  const push = (uid, extra) => {
    steps.push({ robot: r, score, uid, ...extra });
    if (atGoal(mission, r)) won = true;
  };

  function exec(n) {
    if (!n || done()) return;
    switch (n.id) {
      case 'move':
        for (let k = 0; k < n.v[0] && !done(); k += 1) {
          const f = frontOf(r);
          if (isBlocked(mission, f.x, f.y)) {
            push(n.uid, { bump: true });
            break;
          }
          r = { ...r, x: f.x, y: f.y };
          push(n.uid);
        }
        break;
      case 'turn_left':
        r = turn(r, -n.v[0]);
        push(n.uid);
        break;
      case 'turn_right':
        r = turn(r, n.v[0]);
        push(n.uid);
        break;
      case 'wait':
        for (let k = 0; k < n.v[0] * 2 && !done(); k += 1) push(n.uid, { wait: true });
        break;
      case 'set_var':
        score = n.v[0];
        push(n.uid);
        break;
      case 'change_var':
        score += n.v[0];
        push(n.uid);
        break;
      case 'repeat':
        push(n.uid, { mark: true });
        for (let k = 0; k < n.v[0] && !done(); k += 1) exec(n.body);
        break;
      case 'if_obstacle': {
        push(n.uid, { mark: true });
        const f = frontOf(r);
        if (isBlocked(mission, f.x, f.y)) exec(n.body);
        break;
      }
      default:
    }
  }

  nodes.forEach(exec);
  return { error: null, steps, won, score };
}
