import React from 'react';
import { StyleSheet } from 'react-native';
import Animated, { useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';

import { useDrag } from './DragContext';

/**
 * Trash bin beside the canvas. Wakes up while a canvas block is being dragged
 * and turns red / grows once the block is outside the canvas (= will be deleted).
 */
export default function TrashBin({ width }) {
  const drag = useDrag();

  const style = useAnimatedStyle(() => {
    const dragging = drag.active.value && drag.srcIndex.value >= 0;
    const willDelete = dragging && !drag.overCanvas.value;
    return {
      opacity: withSpring(dragging ? 1 : 0.45),
      backgroundColor: willDelete ? '#EF4444' : '#CBD5E1',
      transform: [{ scale: withSpring(willDelete ? 1.25 : dragging ? 1.05 : 1) }],
    };
  });

  return (
    <Animated.View style={[styles.bin, { width, height: width, borderRadius: width / 2 }, style]}>
      <Ionicons name="trash" size={width * 0.5} color="#fff" />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  bin: { alignItems: 'center', justifyContent: 'center', alignSelf: 'center' },
});
