import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { colors } from '../theme';
import { usePhase2Store } from './store';
import { MISSIONS } from './missions';
import { resetWorld, startRun } from './runner';
import GridBoard, { NEON } from '../engine/GridBoard';

const STATUS_COLOR = {
  win: colors.neonGreen,
  fail: colors.neonAmber,
  error: colors.neonPink,
};

/**
 * Simulator / Arena di bagian atas: HUD (kemajuan + skor), pemilih misi, dan papan grid
 * tempat robot menjalankan kode. Ukuran papan menyesuaikan area yang tersedia
 * (kecil saat EDIT, besar saat MAIN GAME).
 */
export default function Simulator({ topInset, onBack }) {
  const progress = usePhase2Store((s) => s.progress);
  const score = usePhase2Store((s) => s.score);
  const mission = usePhase2Store((s) => s.mission);
  const best = usePhase2Store((s) => s.best);
  const robot = usePhase2Store((s) => s.robot);
  const bumpKey = usePhase2Store((s) => s.bumpKey);
  const status = usePhase2Store((s) => s.status);
  const message = usePhase2Store((s) => s.message);
  const setMission = usePhase2Store((s) => s.setMission);

  const [area, setArea] = useState({ w: 0, h: 0 });
  const m = MISSIONS[mission];
  const running = status === 'running';

  const go = (d) => {
    if (running) return;
    setMission((mission + d + MISSIONS.length) % MISSIONS.length);
    resetWorld();
  };

  return (
    <View style={styles.root}>
      {/* HUD */}
      <View style={[styles.hud, { paddingTop: topInset + 8 }]}>
        <Pressable onPress={onBack} style={styles.back}>
          <Ionicons name="chevron-back" size={22} color={colors.neonCyan} />
        </Pressable>
        <View style={styles.hudCol}>
          <Text style={styles.hudText}>Kemajuan: {progress}%</Text>
          <View style={styles.barTrack}>
            <View style={[styles.barFill, { width: `${progress}%` }]} />
          </View>
        </View>
        <View style={styles.scoreBox}>
          <Ionicons name="flash" size={14} color={colors.neonAmber} />
          <Text style={styles.scoreText}>Skor: {score}</Text>
        </View>
      </View>

      {/* Pemilih misi + kontrol */}
      <View style={styles.missionRow}>
        <Pressable onPress={() => go(-1)} hitSlop={8} disabled={running}>
          <Ionicons name="chevron-back-circle" size={26} color={colors.neonCyan} />
        </Pressable>
        <View style={styles.missionTitle}>
          <Text style={styles.missionText} numberOfLines={1}>
            MISI {mission + 1}/{MISSIONS.length} · {m.name}
          </Text>
          {best[mission] ? <Text style={styles.bestText}>Terbaik: {best[mission]}</Text> : null}
        </View>
        <Pressable onPress={() => go(1)} hitSlop={8} disabled={running}>
          <Ionicons name="chevron-forward-circle" size={26} color={colors.neonCyan} />
        </Pressable>
        <Pressable onPress={resetWorld} hitSlop={6} style={styles.iconBtn}>
          <Ionicons name="refresh" size={18} color={colors.neonCyan} />
        </Pressable>
        <Pressable onPress={startRun} disabled={running} hitSlop={6} style={[styles.iconBtn, styles.playBtn, running && { opacity: 0.5 }]}>
          <Ionicons name="play" size={18} color={colors.bg} />
        </Pressable>
      </View>

      {/* Papan arena */}
      <View style={styles.arena} onLayout={(e) => setArea({ w: e.nativeEvent.layout.width, h: e.nativeEvent.layout.height })}>
        {area.w > 0 && (
          <GridBoard
            level={m}
            robot={robot}
            bumpKey={bumpKey}
            availW={area.w}
            availH={area.h}
            theme={NEON}
          />
        )}
        {message ? (
          <View style={[styles.banner, { borderColor: STATUS_COLOR[status] || colors.neonCyan }]}>
            <Text style={[styles.bannerText, { color: STATUS_COLOR[status] || colors.neonCyan }]}>{message}</Text>
          </View>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  hud: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 16, paddingBottom: 6 },
  back: {
    width: 38,
    height: 38,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.neonCyan,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(34,245,255,0.08)',
  },
  hudCol: { flex: 1 },
  hudText: { color: colors.neonCyan, fontWeight: '800', fontSize: 14, letterSpacing: 0.5 },
  barTrack: { height: 6, borderRadius: 3, backgroundColor: 'rgba(34,245,255,0.18)', marginTop: 5, overflow: 'hidden' },
  barFill: { height: '100%', backgroundColor: colors.neonCyan },
  scoreBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.neonAmber,
    backgroundColor: 'rgba(255,184,46,0.08)',
  },
  scoreText: { color: colors.neonAmber, fontWeight: '800', fontSize: 14 },
  missionRow: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 16, paddingBottom: 6 },
  missionTitle: { flex: 1, alignItems: 'center' },
  missionText: { color: '#E2E8F0', fontSize: 12, fontWeight: '800', letterSpacing: 0.8 },
  bestText: { color: colors.neonAmber, fontSize: 10 },
  iconBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.neonCyan,
    alignItems: 'center',
    justifyContent: 'center',
  },
  playBtn: { backgroundColor: colors.neonGreen, borderColor: colors.neonGreen },
  arena: { flex: 1, marginHorizontal: 16, marginBottom: 12, alignItems: 'center', justifyContent: 'center' },
  banner: {
    position: 'absolute',
    bottom: 4,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 14,
    borderWidth: 1,
    backgroundColor: 'rgba(5,8,15,0.88)',
    maxWidth: '96%',
  },
  bannerText: { fontSize: 12, fontWeight: '800', textAlign: 'center' },
});
