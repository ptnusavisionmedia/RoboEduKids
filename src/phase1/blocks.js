// Command block catalogue for Phase 1. Icon-driven: no text on the blocks.
export const BLOCKS = [
  { id: 'forward', icon: 'arrow-up', color: '#4ADE80', dark: '#16A34A' },
  { id: 'left', icon: 'arrow-undo', color: '#38BDF8', dark: '#0284C7' },
  { id: 'right', icon: 'arrow-redo', color: '#FB923C', dark: '#EA580C' },
  { id: 'loop', icon: 'repeat', color: '#A78BFA', dark: '#7C3AED' },
];

export const BLOCK_INDEX = Object.fromEntries(BLOCKS.map((b, i) => [b.id, i]));

export const MAX_BLOCKS = 24;
export const LEVEL_COUNT = 12;
