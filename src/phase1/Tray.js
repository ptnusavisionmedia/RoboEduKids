import React from 'react';
import { StyleSheet, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';

import { BLOCKS } from './blocks';
import DraggableBlock from './DraggableBlock';

/** Bottom tray: horizontally scrollable list of large command blocks. */
export default function Tray({ blockSize, bottomInset = 0, onDrop }) {
  return (
    <View style={[styles.tray, { height: blockSize + 36 + bottomInset, paddingBottom: bottomInset }]}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {BLOCKS.map((_, i) => (
          <DraggableBlock key={i} typeIndex={i} size={blockSize} inScroll onDrop={onDrop} />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  tray: {
    backgroundColor: '#FDE68A',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    borderTopWidth: 4,
    borderColor: '#F59E0B',
  },
  content: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    gap: 24,
  },
});
