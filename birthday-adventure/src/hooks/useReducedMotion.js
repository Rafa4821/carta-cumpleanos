import { useSyncExternalStore } from 'react';

import { useProgress } from '../context/ProgressContext';

function getSnapshot() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function subscribe(callback) {
  const mql = window.matchMedia('(prefers-reduced-motion: reduce)');
  mql.addEventListener('change', callback);
  return () => mql.removeEventListener('change', callback);
}

export function useReducedMotion() {
  const { state } = useProgress();
  const osPrefers = useSyncExternalStore(subscribe, getSnapshot);
  return state.settings.reduceMotion || osPrefers;
}
