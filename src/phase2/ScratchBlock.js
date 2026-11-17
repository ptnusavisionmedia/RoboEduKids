import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { colors } from '../theme';
import { CATEGORY_BY_ID } from './blockDefs';

const NOTCH_W = 30;
const NOTCH_H = 7;

/**
 * Blok modular bergaya Scratch. Ditumpuk tanpa jarak: "tonjolan" di bawah tiap blok masuk
 * ke "takik" di atas blok berikutnya (potongan berwarna kanvas). Blok topi (hat) berujung
 * bulat tanpa takik. Ketuk angka di dalam blok untuk menggantinya.
 */
export default function ScratchBlock({ def, vals, running, onRemove, onCycle, canvasColor }) {
  const color = CATEGORY_BY_ID[def.cat].color;
  let k = -1;
  return (
    <View style={styles.wrap}>
      <View
        style={[
          styles.body,
          { backgroundColor: color },
          def.hat ? styles.hat : styles.normal,
          running && styles.running,
        ]}
      >
        {!def.hat && <View style={[styles.notch, { backgroundColor: canvasColor }]} />}
        <View style={styles.row}>
          {def.parts.map((p, i) => {
            if (!p.opts) {
              return (
                <Text key={i} style={styles.text}>
                  {p.t}
                </Text>
              );
            }
            k += 1;
            const idx = k;
            return (
              <Pressable key={i} onPress={() => onCycle(idx)} hitSlop={6} style={styles.pill}>
                <Text style={styles.pillText}>{vals[idx]}</Text>
                <Ionicons name="caret-down" size={10} color={colors.bg} />
              </Pressable>
            );
          })}
        </View>
        {onRemove && (
          <Pressable onPress={onRemove} hitSlop={10} style={styles.remove}>
            <Ionicons name="close" size={14} color={colors.bg} />
          </Pressable>
        )}
      </View>
      {/* tonjolan bawah */}
      <View style={[styles.bump, { backgroundColor: color }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignSelf: 'flex-start', minWidth: 200 },
  body: { minHeight: 44, paddingHorizontal: 12, paddingVertical: 8, justifyContent: 'center' },
  normal: { borderRadius: 6 },
  hat: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderBottomLeftRadius: 6,
    borderBottomRightRadius: 6,
    paddingTop: 14,
  },
  running: { borderWidth: 2, borderColor: '#fff', shadowColor: '#fff', shadowOpacity: 1, shadowRadius: 8, elevation: 8 },
  notch: {
    position: 'absolute',
    top: 0,
    left: 16,
    width: NOTCH_W,
    height: NOTCH_H,
    borderBottomLeftRadius: 4,
    borderBottomRightRadius: 4,
  },
  row: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', gap: 6, paddingRight: 26 },
  text: { color: colors.bg, fontSize: 14, fontWeight: '800' },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: 'rgba(255,255,255,0.92)',
    borderRadius: 12,
    paddingHorizontal: 9,
    paddingVertical: 2,
  },
  pillText: { color: colors.bg, fontSize: 13, fontWeight: '800' },
  bump: {
    marginLeft: 16,
    width: NOTCH_W,
    height: NOTCH_H,
    borderBottomLeftRadius: 4,
    borderBottomRightRadius: 4,
  },
  remove: {
    position: 'absolute',
    right: 8,
    top: 10,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.65)',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
