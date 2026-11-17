import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

/** Top bar: back, level badge, big PLAY button, audio toggle. */
export default function TopBar({ level, size, playing, audioOn, onBack, onPlay, onToggleAudio }) {
  const round = { width: size, height: size, borderRadius: size / 2 };
  return (
    <View style={styles.bar}>
      <Pressable onPress={onBack} style={[styles.round, round, { backgroundColor: '#fff' }]}>
        <Ionicons name="map" size={size * 0.5} color="#1E293B" />
      </Pressable>

      <View style={styles.badge}>
        <Ionicons name="star" size={size * 0.4} color="#FACC15" />
        <Text style={[styles.badgeText, { fontSize: size * 0.45 }]}>{level}</Text>
      </View>

      <Pressable
        onPress={onPlay}
        disabled={playing}
        style={({ pressed }) => [
          styles.play,
          { height: size * 1.1, borderRadius: size * 0.55, opacity: playing ? 0.6 : 1 },
          pressed && { transform: [{ scale: 0.96 }] },
        ]}
      >
        <Ionicons name={playing ? 'hourglass' : 'play'} size={size * 0.6} color="#fff" />
        <Text style={[styles.playText, { fontSize: size * 0.5 }]}>MAIN</Text>
      </Pressable>

      <Pressable onPress={onToggleAudio} style={[styles.round, round, { backgroundColor: audioOn ? '#38BDF8' : '#94A3B8' }]}>
        <Ionicons name={audioOn ? 'volume-high' : 'volume-mute'} size={size * 0.5} color="#fff" />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  bar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 8 },
  round: { alignItems: 'center', justifyContent: 'center', elevation: 3 },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 24,
    backgroundColor: '#1E293B',
  },
  badgeText: { color: '#fff', fontWeight: '900' },
  play: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 36,
    backgroundColor: '#22C55E',
    borderBottomWidth: 6,
    borderBottomColor: '#15803D',
    elevation: 5,
  },
  playText: { color: '#fff', fontWeight: '900', letterSpacing: 2 },
});
