import React, { useEffect, useState } from 'react';
import { Text, Pressable, StyleSheet, View } from 'react-native';
import Animated, {
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

import { colors } from '../theme';

/** Prominent two-state switch: EDIT CODE | PLAY GAME. A neon thumb slides between them. */
export default function ModeToggle({ mode, onChange }) {
  const [w, setW] = useState(0);
  const p = useSharedValue(mode === 'play' ? 1 : 0);

  useEffect(() => {
    p.value = withSpring(mode === 'play' ? 1 : 0, { damping: 16, stiffness: 180 });
  }, [mode, p]);

  const thumb = useAnimatedStyle(() => ({
    transform: [{ translateX: p.value * (w / 2) }],
    backgroundColor: interpolateColor(p.value, [0, 1], [colors.neonCyan, colors.neonGreen]),
  }));

  return (
    <View style={styles.track} onLayout={(e) => setW(e.nativeEvent.layout.width - 8)}>
      <Animated.View style={[styles.thumb, { width: w / 2 }, thumb]} />
      <Pressable style={styles.half} onPress={() => onChange('edit')}>
        <Text style={[styles.label, mode === 'edit' ? styles.on : styles.off]}>{'</>  UBAH KODE'}</Text>
      </Pressable>
      <Pressable style={styles.half} onPress={() => onChange('play')}>
        <Text style={[styles.label, mode === 'play' ? styles.on : styles.off]}>{'▶  MAIN GAME'}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    flexDirection: 'row',
    alignSelf: 'center',
    width: '86%',
    maxWidth: 420,
    height: 44,
    padding: 4,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: 'rgba(34,245,255,0.5)',
    backgroundColor: colors.bg,
  },
  thumb: { position: 'absolute', left: 4, top: 4, bottom: 4, borderRadius: 18 },
  half: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  label: { fontSize: 13, fontWeight: '900', letterSpacing: 1 },
  on: { color: colors.bg },
  off: { color: 'rgba(255,255,255,0.65)' },
});
