import * as Haptics from 'expo-haptics';
import { usePhase1Store } from './store';

// Tiny haptic helpers. The "audio" toggle also switches these on/off (no sound assets yet).
const enabled = () => usePhase1Store.getState().audioOn;
const safe = (p) => p && p.catch && p.catch(() => {});

export const feedbackTap = () => enabled() && safe(Haptics.selectionAsync());
export const feedbackBump = () =>
  enabled() && safe(Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning));
export const feedbackWin = () =>
  enabled() && safe(Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success));
