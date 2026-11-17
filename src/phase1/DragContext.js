import React, { createContext, useCallback, useContext, useMemo, useRef } from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle } from 'react-native-reanimated';

import { BLOCKS } from './blocks';
import BlockView from './BlockView';

/**
 * Drag-and-drop engine for Phase 1.
 *
 * Only ONE "ghost" block is ever animated. Tray / canvas blocks just report the
 * finger position into shared values; the ghost lives in an overlay on top of
 * the whole workspace so it is never clipped by the tray's ScrollView.
 *
 * All coordinates stored here are WINDOW coordinates (same space as the
 * gesture's absoluteX / absoluteY).
 */
const DragContext = createContext(null);
export const useDrag = () => useContext(DragContext);

/** Worklet: store finger position and recompute "is the finger over the canvas". */
export function updateDrag(d, ax, ay) {
  'worklet';
  d.x.value = ax;
  d.y.value = ay;
  const inside =
    ax >= d.cx.value && ax <= d.cx.value + d.cw.value && ay >= d.cy.value && ay <= d.cy.value + d.ch.value;
  d.overCanvas.value = inside ? 1 : 0;
}

function GhostFace({ index, size, typeIdx }) {
  const style = useAnimatedStyle(() => ({ opacity: typeIdx.value === index ? 1 : 0 }));
  return (
    <Animated.View style={[StyleSheet.absoluteFill, style]}>
      <BlockView typeIndex={index} size={size} />
    </Animated.View>
  );
}

export function DragProvider({ ghostSize, style, children }) {
  const active = useSharedValue(0); // 1 while a block is being dragged
  const typeIdx = useSharedValue(-1); // which block type is dragged
  const srcIndex = useSharedValue(-1); // canvas index of the source, -1 = tray
  const x = useSharedValue(0);
  const y = useSharedValue(0);
  const overCanvas = useSharedValue(0);
  const rootX = useSharedValue(0);
  const rootY = useSharedValue(0);
  const cx = useSharedValue(0);
  const cy = useSharedValue(0);
  const cw = useSharedValue(0);
  const ch = useSharedValue(0);

  const rootRef = useRef(null);

  const measureRoot = useCallback(() => {
    rootRef.current?.measureInWindow((px, py) => {
      rootX.value = px;
      rootY.value = py;
    });
  }, [rootX, rootY]);

  /** Canvas calls this from onLayout so we always know its window rect. */
  const registerCanvas = useCallback(
    (ref) => {
      ref.current?.measureInWindow((px, py, w, h) => {
        cx.value = px;
        cy.value = py;
        cw.value = w;
        ch.value = h;
      });
    },
    [cx, cy, cw, ch]
  );

  const drag = useMemo(
    () => ({ active, typeIdx, srcIndex, x, y, overCanvas, cx, cy, cw, ch, registerCanvas }),
    [active, typeIdx, srcIndex, x, y, overCanvas, cx, cy, cw, ch, registerCanvas]
  );

  const ghostStyle = useAnimatedStyle(() => ({
    opacity: active.value,
    transform: [
      { translateX: x.value - rootX.value - ghostSize / 2 },
      { translateY: y.value - rootY.value - ghostSize / 2 },
      { scale: active.value ? 1.12 : 0.8 },
    ],
  }));

  // Red tint = "release here and the block is deleted".
  const deleteTint = useAnimatedStyle(() => ({
    opacity: active.value && srcIndex.value >= 0 && !overCanvas.value ? 0.55 : 0,
  }));

  return (
    <DragContext.Provider value={drag}>
      <View ref={rootRef} style={style} onLayout={measureRoot}>
        {children}
        <Animated.View
          pointerEvents="none"
          style={[styles.ghost, { width: ghostSize, height: ghostSize }, ghostStyle]}
        >
          {BLOCKS.map((_, i) => (
            <GhostFace key={i} index={i} size={ghostSize} typeIdx={typeIdx} />
          ))}
          <Animated.View
            style={[
              StyleSheet.absoluteFill,
              { backgroundColor: '#EF4444', borderRadius: ghostSize * 0.26 },
              deleteTint,
            ]}
          />
        </Animated.View>
      </View>
    </DragContext.Provider>
  );
}

const styles = StyleSheet.create({
  ghost: { position: 'absolute', left: 0, top: 0, zIndex: 100 },
});
