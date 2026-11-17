import React from 'react';
import { View, Text, Pressable, ScrollView, StyleSheet } from 'react-native';
import { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { Ionicons } from '@expo/vector-icons';

import { colors } from '../theme';
import { BLOCK_DEFS, CATEGORY_BY_ID, DEF_BY_ID, labelOf } from './blockDefs';
import { usePhase2Store } from './store';
import { startRun } from './runner';
import Sidebar from './Sidebar';
import ScratchBlock from './ScratchBlock';
import GridBackground from './GridBackground';

export const CANVAS_COLOR = '#0A1424';

/**
 * Isi bottom sheet:
 *   [ Sidebar | strip palet (atas) + kanvas kode vertikal (bawah) ]
 * Ketuk chip palet untuk menambah blok; ketuk angka di blok untuk mengganti nilainya.
 */
export default function CodeWorkspace({ bottomPad, canvasW, canvasH }) {
  const blocks = usePhase2Store((s) => s.blocks);
  const category = usePhase2Store((s) => s.category);
  const status = usePhase2Store((s) => s.status);
  const runningUid = usePhase2Store((s) => s.runningUid);
  const setCategory = usePhase2Store((s) => s.setCategory);
  const addBlock = usePhase2Store((s) => s.addBlock);
  const removeBlock = usePhase2Store((s) => s.removeBlock);
  const cycleVal = usePhase2Store((s) => s.cycleVal);
  const clearBlocks = usePhase2Store((s) => s.clearBlocks);

  const cat = CATEGORY_BY_ID[category];
  const palette = BLOCK_DEFS.filter((d) => d.cat === category);
  const running = status === 'running';

  return (
    <View style={styles.root}>
      <Sidebar selected={category} onSelect={setCategory} />

      <View style={styles.main}>
        {/* Palet kategori terpilih */}
        <View style={styles.paletteWrap}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.palette}>
            {palette.map((d) => (
              <Pressable key={d.id} onPress={() => addBlock(d.id)} style={[styles.chip, { borderColor: cat.color }]}>
                <Ionicons name="add" size={14} color={cat.color} />
                <Text style={[styles.chipText, { color: cat.color }]} numberOfLines={1}>
                  {labelOf(d)}
                </Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>

        {/* Kanvas kode utama */}
        <View style={styles.canvas}>
          <GridBackground width={canvasW} height={canvasH} color="rgba(34,245,255,0.05)" />
          <View style={styles.canvasHead}>
            <Text style={styles.canvasTag} numberOfLines={1}>
              // KANVAS KODE · {blocks.length} blok
            </Text>
            <View style={styles.headBtns}>
              <Pressable onPress={clearBlocks} hitSlop={8} disabled={running}>
                <Ionicons name="trash-outline" size={20} color={colors.neonPink} />
              </Pressable>
              <Pressable
                onPress={startRun}
                disabled={running}
                style={[styles.run, running && { opacity: 0.5 }]}
              >
                <Ionicons name={running ? 'hourglass' : 'play'} size={14} color={colors.bg} />
                <Text style={styles.runText}>{running ? 'JALAN…' : 'JALANKAN'}</Text>
              </Pressable>
            </View>
          </View>

          <BottomSheetScrollView
            contentContainerStyle={[styles.stack, { paddingBottom: bottomPad }]}
            showsVerticalScrollIndicator={false}
          >
            {blocks.length === 0 ? (
              <Text style={styles.empty}>Ketuk blok di atas untuk mulai membuat kode</Text>
            ) : (
              blocks.map((b) => (
                <ScratchBlock
                  key={b.uid}
                  def={DEF_BY_ID[b.defId]}
                  vals={b.vals}
                  running={runningUid === b.uid}
                  canvasColor={CANVAS_COLOR}
                  onCycle={(k) => cycleVal(b.uid, k)}
                  onRemove={() => removeBlock(b.uid)}
                />
              ))
            )}
            {blocks.length > 0 && (
              <Text style={styles.hint}>
                Tips: "ulangi" dan "jika" berlaku untuk blok tepat di bawahnya. Ketuk angka untuk mengganti.
              </Text>
            )}
          </BottomSheetScrollView>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, flexDirection: 'row' },
  main: { flex: 1 },
  paletteWrap: { height: 48, justifyContent: 'center', borderBottomWidth: 1, borderBottomColor: 'rgba(34,245,255,0.2)' },
  palette: { paddingHorizontal: 10, gap: 8, alignItems: 'center' },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    height: 32,
    borderRadius: 16,
    borderWidth: 1,
    maxWidth: 240,
  },
  chipText: { fontSize: 12, fontWeight: '700' },
  canvas: { flex: 1, backgroundColor: CANVAS_COLOR, overflow: 'hidden' },
  canvasHead: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 12,
    paddingTop: 8,
  },
  canvasTag: { flex: 1, color: 'rgba(34,245,255,0.7)', fontSize: 10, letterSpacing: 1.2 },
  headBtns: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  run: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.neonGreen,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
  },
  runText: { color: colors.bg, fontSize: 12, fontWeight: '900', letterSpacing: 0.5 },
  stack: { padding: 12, paddingTop: 10 },
  empty: { color: 'rgba(255,255,255,0.45)', marginTop: 30, textAlign: 'center' },
  hint: { color: 'rgba(255,255,255,0.4)', fontSize: 11, marginTop: 18, lineHeight: 16 },
});
