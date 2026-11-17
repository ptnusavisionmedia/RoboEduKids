import React, { useCallback, useEffect, useRef, useState } from 'react';
import { View, Text, Pressable, StyleSheet, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import { BLOCKS, LEVEL_COUNT } from './blocks';
import { LEVELS, starsFor } from './levels';
import { simulate } from './engine';
import { usePhase1Store } from './store';
import { feedbackBump, feedbackTap, feedbackWin } from './feedback';
import { initialRobot } from '../engine/grid';
import GridBoard, { PLAYFUL } from '../engine/GridBoard';
import { DragProvider } from './DragContext';
import TopBar from './TopBar';
import Canvas from './Canvas';
import TrashBin from './TrashBin';
import Tray from './Tray';

const STEP_MS = 520;

/** Layar satu level: papan robot + kanvas drag & drop + tray blok. */
export default function Workspace({ level, onExit, onNext }) {
  const { width, height } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  // Sizes come from the SHORT side so they stay correct while the device is still rotating.
  const short = Math.min(width, height);
  const blockSize = Math.max(56, Math.min(96, Math.round(short * 0.18)));
  const cellSize = Math.round(blockSize * 0.8);
  const data = LEVELS[level - 1];

  const program = usePhase1Store((s) => s.program);
  const audioOn = usePhase1Store((s) => s.audioOn);
  const addBlock = usePhase1Store((s) => s.addBlock);
  const removeAt = usePhase1Store((s) => s.removeAt);
  const clearProgram = usePhase1Store((s) => s.clearProgram);
  const toggleAudio = usePhase1Store((s) => s.toggleAudio);
  const finishLevel = usePhase1Store((s) => s.finishLevel);

  const [robot, setRobot] = useState(() => initialRobot(data));
  const [bumpKey, setBumpKey] = useState(0);
  const [step, setStep] = useState(-1);
  const [status, setStatus] = useState('idle'); // idle | running | won | lost
  const [earned, setEarned] = useState(0);
  const [mid, setMid] = useState({ w: 0, h: 0 });
  const timer = useRef(null);

  useEffect(() => {
    clearProgram();
    return () => clearTimeout(timer.current);
  }, [clearProgram]);

  const resetRobot = useCallback(() => {
    clearTimeout(timer.current);
    setRobot(initialRobot(data));
    setStep(-1);
    setStatus('idle');
  }, [data]);

  /** Dipanggil DraggableBlock saat blok dilepas (thread JS). */
  const handleDrop = useCallback(
    (typeIndex, srcIndex, insideCanvas) => {
      if (status === 'running') return;
      if (status !== 'idle') resetRobot();
      if (srcIndex === -1) {
        if (insideCanvas) {
          addBlock(BLOCKS[typeIndex].id);
          feedbackTap();
        }
      } else if (!insideCanvas) {
        removeAt(srcIndex);
        feedbackTap();
      }
    },
    [status, resetRobot, addBlock, removeAt]
  );

  const play = () => {
    if (status === 'running' || program.length === 0) return;
    const sim = simulate(data, program);
    setStatus('running');
    let i = 0;
    const tick = () => {
      if (i >= sim.states.length) {
        if (sim.won) {
          const n = starsFor(data, program.length);
          setEarned(n);
          finishLevel(level, n);
          setStatus('won');
          feedbackWin();
        } else {
          setStatus('lost');
          timer.current = setTimeout(resetRobot, 1800);
        }
        setStep(-1);
        return;
      }
      const st = sim.states[i];
      setRobot(st.robot);
      setStep(st.idx);
      if (st.bump) {
        setBumpKey((k) => k + 1);
        feedbackBump();
      }
      i += 1;
      timer.current = setTimeout(tick, STEP_MS);
    };
    tick();
  };

  const startOver = () => {
    resetRobot();
    clearProgram();
  };

  const topSize = Math.round(blockSize * 0.62);
  const boardSide = Math.max(0, Math.min(mid.h, mid.w * 0.36));

  return (
    <View
      style={[
        styles.root,
        { paddingLeft: insets.left + 16, paddingRight: insets.right + 16, paddingTop: Math.max(insets.top, 4) },
      ]}
    >
      <DragProvider ghostSize={blockSize} style={styles.fill}>
        <TopBar
          level={level}
          size={topSize}
          playing={status === 'running'}
          audioOn={audioOn}
          onBack={onExit}
          onPlay={play}
          onToggleAudio={toggleAudio}
        />

        <View style={styles.middle} onLayout={(e) => setMid({ w: e.nativeEvent.layout.width, h: e.nativeEvent.layout.height })}>
          <View style={[styles.boardWrap, { width: boardSide }]}>
            {boardSide > 0 && (
              <GridBoard
                level={data}
                robot={robot}
                bumpKey={bumpKey}
                availW={boardSide}
                availH={boardSide}
                theme={PLAYFUL}
              />
            )}
          </View>
          <Canvas program={program} cellSize={cellSize} playingIndex={step} onDrop={handleDrop} />
          <View style={[styles.binCol, { width: blockSize * 0.95 }]}>
            <TrashBin width={blockSize * 0.8} />
            <Pressable onPress={startOver} style={[styles.reset, { width: blockSize * 0.5, height: blockSize * 0.5 }]}>
              <Ionicons name="refresh" size={blockSize * 0.3} color="#1E293B" />
            </Pressable>
          </View>

          {status === 'lost' && (
            <View pointerEvents="none" style={styles.toast}>
              <Text style={styles.toastText}>Ups, robot belum sampai! Coba lagi ya.</Text>
            </View>
          )}
        </View>

        <Tray blockSize={blockSize} bottomInset={Math.max(insets.bottom, 8)} onDrop={handleDrop} />

        {status === 'won' && (
          <View style={styles.win}>
            <View style={styles.winCard}>
              <Text style={styles.winTitle}>Hebat! Level {level} selesai</Text>
              <View style={styles.starRow}>
                {[1, 2, 3].map((n) => (
                  <Ionicons
                    key={n}
                    name={n <= earned ? 'star' : 'star-outline'}
                    size={blockSize * (n === 2 ? 0.95 : 0.75)}
                    color="#FACC15"
                  />
                ))}
              </View>
              <Text style={styles.winSub}>
                {earned === 3 ? 'Sempurna! Pakai blok paling sedikit.' : 'Coba pakai blok lebih sedikit untuk 3 bintang.'}
              </Text>
              <View style={styles.winBtns}>
                <Pressable onPress={onExit} style={[styles.btn, { backgroundColor: '#38BDF8' }]}>
                  <Ionicons name="map" size={22} color="#fff" />
                  <Text style={styles.btnText}>Peta</Text>
                </Pressable>
                <Pressable onPress={resetRobot} style={[styles.btn, { backgroundColor: '#FB923C' }]}>
                  <Ionicons name="refresh" size={22} color="#fff" />
                  <Text style={styles.btnText}>Ulangi</Text>
                </Pressable>
                {level < LEVEL_COUNT && (
                  <Pressable onPress={() => onNext(level + 1)} style={[styles.btn, { backgroundColor: '#22C55E' }]}>
                    <Text style={styles.btnText}>Lanjut</Text>
                    <Ionicons name="play" size={22} color="#fff" />
                  </Pressable>
                )}
              </View>
            </View>
          </View>
        )}
      </DragProvider>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#BAE6FD' },
  fill: { flex: 1 },
  middle: { flex: 1, flexDirection: 'row', alignItems: 'stretch', gap: 10, marginBottom: 12 },
  boardWrap: { justifyContent: 'center', flexShrink: 0 },
  binCol: { alignSelf: 'stretch', justifyContent: 'space-evenly', alignItems: 'center' },
  reset: { borderRadius: 999, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center', elevation: 2 },
  toast: {
    position: 'absolute',
    top: 4,
    alignSelf: 'center',
    left: '30%',
    right: '30%',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    backgroundColor: '#1E293B',
  },
  toastText: { color: '#fff', fontWeight: '800', textAlign: 'center', fontSize: 13 },
  win: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(30,41,59,0.45)',
  },
  winCard: { backgroundColor: '#fff', borderRadius: 28, padding: 20, alignItems: 'center', gap: 8, maxWidth: 440 },
  winTitle: { fontSize: 22, fontWeight: '900', color: '#1E293B' },
  starRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  winSub: { fontSize: 14, color: '#475569', textAlign: 'center' },
  winBtns: { flexDirection: 'row', gap: 10, marginTop: 6 },
  btn: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 16, paddingVertical: 10, borderRadius: 20 },
  btnText: { color: '#fff', fontWeight: '900', fontSize: 16 },
});
