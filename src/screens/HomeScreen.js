import React from 'react';
import { View, Text, Pressable, ScrollView, StyleSheet, useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';

import { colors } from '../theme';
import OrientedScreen from '../components/OrientedScreen';
import { OrientationLock } from '../hooks/useOrientationLock';
import { completedLevels, totalStars, usePhase1Store } from '../phase1/store';
import { LEVEL_COUNT } from '../phase1/blocks';
import { MISSIONS } from '../phase2/missions';
import { usePhase2Store } from '../phase2/store';

/** Tombol besar untuk masuk ke tiap fase. */
function PhaseButton({ color, icon, title, subtitle, progress, onPress, textColor = colors.ink }) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        { backgroundColor: color, transform: [{ scale: pressed ? 0.97 : 1 }] },
      ]}
    >
      <View style={styles.iconBubble}>
        <Ionicons name={icon} size={34} color={colors.ink} />
      </View>
      <View style={styles.buttonText}>
        <Text style={[styles.buttonTitle, { color: textColor }]}>{title}</Text>
        <Text style={[styles.buttonSub, { color: textColor }]}>{subtitle}</Text>
        <Text style={[styles.progress, { color: textColor }]}>{progress}</Text>
      </View>
      <Ionicons name="chevron-forward" size={28} color={textColor} />
    </Pressable>
  );
}

function HomeContent({ navigation }) {
  const { width } = useWindowDimensions();
  const contentWidth = Math.min(width - 40, 520); // tombol tetap proporsional di tablet

  const stars = usePhase1Store((s) => s.stars);
  const best = usePhase2Store((s) => s.best);
  const p1 = `Level ${completedLevels(stars)}/${LEVEL_COUNT} selesai · ★ ${totalStars(stars)}`;
  const p2 = `Misi ${Object.keys(best).length}/${MISSIONS.length} selesai`;

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar style="dark" />
      {/* Hiasan bulat berwarna sebagai pengganti gambar */}
      <View style={[styles.blob, styles.blobA]} />
      <View style={[styles.blob, styles.blobB]} />

      {/* ScrollView agar tetap muat di layar pendek */}
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        <View style={[styles.content, { width: contentWidth }]}>
          <View style={styles.logo}>
            <Ionicons name="hardware-chip" size={56} color={colors.white} />
          </View>
          <Text style={styles.title}>RoboEdu Kids</Text>
          <Text style={styles.tagline}>Belajar robot dan coding sambil bermain!</Text>

          <View style={styles.buttons}>
            <PhaseButton
              color={colors.sun}
              icon="game-controller"
              title="Masuk Fase 1"
              subtitle="Little Coder · Kelas 1–3"
              progress={p1}
              onPress={() => navigation.navigate('Phase1')}
            />
            <PhaseButton
              color={colors.ink}
              textColor={colors.neonCyan}
              icon="terminal"
              title="Masuk Fase 2"
              subtitle="Junior Programmer · Kelas 4–6"
              progress={p2}
              onPress={() => navigation.navigate('Phase2')}
            />
          </View>
          <Text style={styles.note}>Fase 1 dimainkan mendatar (landscape), Fase 2 tegak (portrait).</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.sky },
  scroll: { flexGrow: 1, alignItems: 'center', justifyContent: 'center', paddingVertical: 24 },
  content: { alignItems: 'center' },
  blob: { position: 'absolute', borderRadius: 999, opacity: 0.45 },
  blobA: { width: 260, height: 260, backgroundColor: colors.grass, top: -70, left: -80 },
  blobB: { width: 320, height: 320, backgroundColor: colors.grape, bottom: -110, right: -100 },
  logo: {
    width: 96,
    height: 96,
    borderRadius: 30,
    backgroundColor: colors.coral,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  title: { fontSize: 36, fontWeight: '900', color: colors.ink },
  tagline: { fontSize: 16, color: colors.ink, marginTop: 4, marginBottom: 28, textAlign: 'center' },
  buttons: { width: '100%', gap: 16 },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 28,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
  iconBubble: {
    width: 56,
    height: 56,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.7)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: { flex: 1, marginLeft: 14 },
  buttonTitle: { fontSize: 22, fontWeight: '800' },
  buttonSub: { fontSize: 13, opacity: 0.85, marginTop: 2 },
  progress: { fontSize: 12, fontWeight: '700', marginTop: 4, opacity: 0.9 },
  note: { fontSize: 12, color: colors.ink, opacity: 0.7, marginTop: 20, textAlign: 'center' },
});

/** Home selalu portrait; ini juga memulihkan portrait saat kembali dari Fase 1. */
export default function HomeScreen({ navigation }) {
  return (
    <OrientedScreen lock={OrientationLock.PORTRAIT_UP} background={colors.sky} spinner={colors.ink}>
      <HomeContent navigation={navigation} />
    </OrientedScreen>
  );
}
