import { useCallback, useState } from 'react';

export const INTRO_KEY = 'diptyque_intro_played';

let memoryPlayed = false;

function getSessionStorage() {
  if (typeof window === 'undefined') return null;

  try {
    return window.sessionStorage;
  } catch {
    return null;
  }
}

export function shouldPlayIntro() {
  const storage = getSessionStorage();

  if (!storage) return !memoryPlayed;

  try {
    return storage.getItem(INTRO_KEY) !== 'true';
  } catch {
    return !memoryPlayed;
  }
}

export function markIntroPlayed() {
  memoryPlayed = true;
  const storage = getSessionStorage();

  if (!storage) return;

  try {
    storage.setItem(INTRO_KEY, 'true');
  } catch {
    // The in-memory flag still prevents replay if storage is unavailable.
  }
}

export default function useIntroSession() {
  const [shouldPlay] = useState(shouldPlayIntro);
  const markPlayed = useCallback(() => markIntroPlayed(), []);

  return { shouldPlay, markPlayed };
}
