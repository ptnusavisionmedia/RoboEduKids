import React, { useState } from 'react';
import { Text, Pressable, StyleSheet, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';

import { colors } from '../theme';
import { CATEGORIES } from './blockDefs';

const COLLAPSED = 54;
const EXPANDED = 116;

/** Left collapsible sidebar with the block categories. */
export default function Sidebar({ selected, onSelect }) {
  const [open, setOpen] = useState(true);
  const w = useSharedValue(EXPANDED);

  const toggle = () => {
    w.value = withTiming(open ? COLLAPSED : EXPANDED, { duration: 220 });
    setOpen(!open);
  };

  const style = useAnimatedStyle(() => ({ width: w.value }));

  return (
    <Animated.View style={[styles.root, style]}>
      <Pressable onPress={toggle} style={styles.collapse}>
        <Ionicons name={open ? 'chevron-back' : 'chevron-forward'} size={18} color={colors.neonCyan} />
        {open && <Text style={styles.head}>BLOK</Text>}
      </Pressable>

      {CATEGORIES.map((c) => {
        const active = selected === c.id;
        return (
          <Pressable
            key={c.id}
            onPress={() => onSelect(c.id)}
            style={[
              styles.item,
              { borderColor: active ? c.color : 'rgba(255,255,255,0.12)' },
              active && { backgroundColor: 'rgba(255,255,255,0.06)' },
            ]}
          >
            <View style={[styles.icon, { backgroundColor: c.color }]}>
              <Ionicons name={c.icon} size={16} color={colors.bg} />
            </View>
            {open && (
              <Text numberOfLines={1} style={[styles.label, { color: active ? c.color : '#CBD5E1' }]}>
                {c.label}
              </Text>
            )}
          </Pressable>
        );
      })}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  root: {
    paddingVertical: 8,
    paddingHorizontal: 6,
    gap: 8,
    overflow: 'hidden',
    borderRightWidth: 1,
    borderRightColor: 'rgba(34,245,255,0.25)',
    backgroundColor: 'rgba(5,8,15,0.6)',
  },
  collapse: { flexDirection: 'row', alignItems: 'center', gap: 4, height: 28, paddingHorizontal: 4 },
  head: { color: colors.neonCyan, fontSize: 11, fontWeight: '800', letterSpacing: 1.5 },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 6,
    borderRadius: 10,
    borderWidth: 1,
  },
  icon: { width: 28, height: 28, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  label: { flex: 1, fontSize: 13, fontWeight: '700' },
});
