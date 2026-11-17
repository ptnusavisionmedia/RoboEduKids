import React, { useRef } from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, { useAnimatedStyle } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';

import { BLOCK_INDEX } from './blocks';
import DraggableBlock from './DraggableBlock';
import { useDrag } from './DragContext';

/**
 * Main canvas: the drop target. Placed blocks flow left-to-right after the
 * robot's "start" marker. Dragging a placed block and releasing it outside the
 * canvas deletes it.
 */
export default function Canvas({ program, cellSize, playingIndex, onDrop }) {
  const drag = useDrag();
  const ref = useRef(null);

  // Green glow when a tray block hovers the canvas, dim when a canvas block is leaving it.
  const surface = useAnimatedStyle(() => {
    if (!drag.active.value) return { backgroundColor: '#FFFFFF', borderColor: '#94A3B8' };
    // (jatuhkan di sini = blok ditambahkan)
    if (drag.overCanvas.value) return { backgroundColor: '#ECFDF5', borderColor: '#22C55E' };
    return drag.srcIndex.value >= 0
      ? { backgroundColor: '#FEE2E2', borderColor: '#EF4444' }
      : { backgroundColor: '#FFFFFF', borderColor: '#94A3B8' };
  });

  return (
    <Animated.View
      ref={ref}
      collapsable={false}
      onLayout={() => drag.registerCanvas(ref)}
      style={[styles.canvas, surface]}
    >
      <View style={styles.flow}>
        <View style={[styles.start, { width: cellSize, height: cellSize, borderRadius: cellSize * 0.3 }]}>
          <Ionicons name="hardware-chip" size={cellSize * 0.55} color="#fff" />
        </View>

        {program.map((id, i) => (
          <PlayHighlight key={`${i}-${id}`} active={playingIndex === i}>
            <DraggableBlock typeIndex={BLOCK_INDEX[id]} srcIndex={i} size={cellSize} onDrop={onDrop} />
          </PlayHighlight>
        ))}

        {program.length === 0 && (
          <View style={styles.hint}>
            <Ionicons name="hand-left" size={cellSize * 0.5} color="#CBD5E1" />
            <Ionicons name="arrow-forward" size={cellSize * 0.4} color="#CBD5E1" />
            {[0, 1, 2].map((n) => (
              <View
                key={n}
                style={[styles.slot, { width: cellSize, height: cellSize, borderRadius: cellSize * 0.26 }]}
              />
            ))}
          </View>
        )}
      </View>
    </Animated.View>
  );
}

/** Wraps a canvas block with a ring + scale while the program is "running". */
function PlayHighlight({ active, children }) {
  return (
    <View style={[styles.hl, active && styles.hlOn]}>{children}</View>
  );
}

const styles = StyleSheet.create({
  canvas: {
    flex: 1,
    borderRadius: 28,
    borderWidth: 4,
    borderStyle: 'dashed',
    padding: 12,
  },
  flow: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: 10 },
  start: { backgroundColor: '#F43F5E', alignItems: 'center', justifyContent: 'center' },
  hint: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  slot: { borderWidth: 3, borderStyle: 'dashed', borderColor: '#E2E8F0' },
  hl: { padding: 3, borderRadius: 22, borderWidth: 3, borderColor: 'transparent' },
  hlOn: { borderColor: '#FACC15', backgroundColor: '#FEF9C3', transform: [{ scale: 1.1 }] },
});
