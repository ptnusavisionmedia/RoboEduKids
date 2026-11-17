import React, { useEffect, useMemo } from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';

/** Visual themes. The board logic is identical; only the look differs per phase. */
export const PLAYFUL = {
  cellA: '#DCFCE7',
  cellB: '#BBF7D0',
  line: 'transparent',
  radius: 0.2,
  wallBg: '#A16207',
  wallBorder: '#713F12',
  wallIcon: 'cube',
  wallColor: '#FDE68A',
  goalBg: '#FEF08A',
  goalBorder: '#EAB308',
  goalColor: '#DC2626',
  robotBg: '#F43F5E',
  robotBorder: '#9F1239',
  robotColor: '#FFFFFF',
  frame: '#16A34A',
};

export const NEON = {
  cellA: 'rgba(34,245,255,0.04)',
  cellB: 'rgba(34,245,255,0.09)',
  line: 'rgba(34,245,255,0.25)',
  radius: 0.12,
  wallBg: 'rgba(255,61,203,0.22)',
  wallBorder: '#FF3DCB',
  wallIcon: 'close',
  wallColor: '#FF3DCB',
  goalBg: 'rgba(255,184,46,0.12)',
  goalBorder: '#FFB82E',
  goalColor: '#FFB82E',
  robotBg: '#39FF88',
  robotBorder: '#0F8A47',
  robotColor: '#05080F',
  frame: 'rgba(34,245,255,0.55)',
};

/**
 * Grid world with walls, goal and an animated robot.
 * Fits itself into availW x availH (square cells) and centres itself.
 * `bumpKey` changes -> the robot shakes (it hit a wall).
 */
export default function GridBoard({ level, robot, bumpKey = 0, availW, availH, theme }) {
  const cell = Math.max(10, Math.floor(Math.min(availW / level.cols, availH / level.rows)));
  const w = cell * level.cols;
  const h = cell * level.rows;
  const body = Math.round(cell * 0.78);

  const x = useSharedValue(robot.x * cell);
  const y = useSharedValue(robot.y * cell);
  const angle = useSharedValue(robot.angle);
  const shake = useSharedValue(0);

  useEffect(() => {
    x.value = withTiming(robot.x * cell, { duration: 260 });
    y.value = withTiming(robot.y * cell, { duration: 260 });
    angle.value = withTiming(robot.angle, { duration: 260 });
  }, [robot.x, robot.y, robot.angle, cell, x, y, angle]);

  useEffect(() => {
    if (bumpKey === 0) return;
    shake.value = withSequence(
      withTiming(cell * 0.12, { duration: 50 }),
      withTiming(-cell * 0.12, { duration: 80 }),
      withTiming(0, { duration: 50 })
    );
  }, [bumpKey, cell, shake]);

  const robotStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: x.value + shake.value },
      { translateY: y.value },
      { rotate: `${angle.value}deg` },
    ],
  }));

  const cells = useMemo(
    () => Array.from({ length: level.cols * level.rows }, (_, i) => i),
    [level.cols, level.rows]
  );

  const pos = (cx, cy) => ({ left: cx * cell, top: cy * cell, width: cell, height: cell });

  return (
    <View
      style={[
        styles.frame,
        { width: w, height: h, borderColor: theme.frame, borderRadius: cell * theme.radius },
      ]}
    >
      {cells.map((i) => {
        const cx = i % level.cols;
        const cy = Math.floor(i / level.cols);
        return (
          <View
            key={i}
            style={[
              styles.cell,
              pos(cx, cy),
              {
                backgroundColor: (cx + cy) % 2 ? theme.cellA : theme.cellB,
                borderColor: theme.line,
                borderWidth: theme.line === 'transparent' ? 0 : StyleSheet.hairlineWidth * 2,
              },
            ]}
          />
        );
      })}

      {level.walls.map(([wx, wy]) => (
        <View key={`w${wx}-${wy}`} style={[styles.center, pos(wx, wy)]}>
          <View
            style={[
              styles.block,
              {
                width: cell * 0.86,
                height: cell * 0.86,
                borderRadius: cell * 0.18,
                backgroundColor: theme.wallBg,
                borderColor: theme.wallBorder,
              },
            ]}
          >
            <Ionicons name={theme.wallIcon} size={cell * 0.5} color={theme.wallColor} />
          </View>
        </View>
      ))}

      <View style={[styles.center, pos(level.goal.x, level.goal.y)]}>
        <View
          style={[
            styles.block,
            {
              width: cell * 0.86,
              height: cell * 0.86,
              borderRadius: cell * 0.22,
              backgroundColor: theme.goalBg,
              borderColor: theme.goalBorder,
              borderStyle: 'dashed',
            },
          ]}
        >
          <Ionicons name="flag" size={cell * 0.52} color={theme.goalColor} />
        </View>
      </View>

      {/* Robot: a rounded body with a small "nose" arrow showing which way it faces. */}
      <Animated.View
        pointerEvents="none"
        style={[styles.center, { position: 'absolute', left: 0, top: 0, width: cell, height: cell }, robotStyle]}
      >
        <View
          style={[
            styles.block,
            {
              width: body,
              height: body,
              borderRadius: body * 0.28,
              backgroundColor: theme.robotBg,
              borderColor: theme.robotBorder,
            },
          ]}
        >
          <Ionicons name="caret-up" size={body * 0.38} color={theme.robotColor} style={styles.nose} />
          <Ionicons name="hardware-chip" size={body * 0.46} color={theme.robotColor} />
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  frame: { borderWidth: 3, overflow: 'hidden' },
  cell: { position: 'absolute' },
  center: { position: 'absolute', alignItems: 'center', justifyContent: 'center' },
  block: { alignItems: 'center', justifyContent: 'center', borderWidth: 2 },
  nose: { position: 'absolute', top: -2 },
});
