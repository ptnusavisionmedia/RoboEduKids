import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BLOCKS } from './blocks';

/** Pure visual of one command block (no gestures). */
export default function BlockView({ typeIndex, size }) {
  const b = BLOCKS[typeIndex];
  return (
    <View
      style={[
        styles.block,
        {
          width: size,
          height: size,
          borderRadius: size * 0.26,
          backgroundColor: b.color,
          borderBottomColor: b.dark,
          borderBottomWidth: Math.max(4, size * 0.07),
        },
      ]}
    >
      <Ionicons name={b.icon} size={size * 0.55} color="#fff" />
    </View>
  );
}

const styles = StyleSheet.create({
  block: {
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 3 },
  },
});
