import React from 'react';
import { ActivityIndicator, StyleSheet, View, useWindowDimensions } from 'react-native';

import useOrientationLock from '../hooks/useOrientationLock';

/**
 * Wraps a screen that needs a fixed orientation.
 *  - children mount only AFTER the rotation finished, so their first layout is already correct
 *  - the box is capped to the real window size, so a stale (pre-rotation) frame can never push
 *    content past the screen edges
 */
export default function OrientedScreen({ lock, background, spinner = '#fff', children }) {
  const ready = useOrientationLock(lock);
  const { width, height } = useWindowDimensions();

  return (
    <View style={[styles.root, { backgroundColor: background, maxWidth: width, maxHeight: height }]}>
      {ready ? children : <ActivityIndicator style={styles.spin} color={spinner} size="large" />}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, overflow: 'hidden' },
  spin: { flex: 1 },
});
