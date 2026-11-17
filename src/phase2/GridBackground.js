import React, { memo, useMemo } from 'react';
import { View, StyleSheet } from 'react-native';

const CELL = 28;

/** Neon blueprint grid made of thin Views (no images). Sized for the largest area it may fill. */
function GridBackground({ width, height, color = 'rgba(34,245,255,0.09)' }) {
  const cols = Math.ceil(width / CELL) + 1;
  const rows = Math.ceil(height / CELL) + 1;
  const lines = useMemo(
    () => ({
      v: Array.from({ length: cols }, (_, i) => i * CELL),
      h: Array.from({ length: rows }, (_, i) => i * CELL),
    }),
    [cols, rows]
  );
  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      {lines.v.map((x) => (
        <View key={`v${x}`} style={[styles.v, { left: x, backgroundColor: color }]} />
      ))}
      {lines.h.map((y) => (
        <View key={`h${y}`} style={[styles.h, { top: y, backgroundColor: color }]} />
      ))}
    </View>
  );
}

export default memo(GridBackground);

const styles = StyleSheet.create({
  v: { position: 'absolute', top: 0, bottom: 0, width: StyleSheet.hairlineWidth * 2 },
  h: { position: 'absolute', left: 0, right: 0, height: StyleSheet.hairlineWidth * 2 },
});
