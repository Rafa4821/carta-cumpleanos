import { createContext, useCallback, useContext, useMemo, useRef } from 'react';
import { Howl, Howler } from 'howler';

import { useProgress } from './ProgressContext';

const AudioCtx = createContext(null);

const SOUND_DEFS = {
  click: { src: ['/audio/click.webm', '/audio/click.mp3'], volume: 0.4 },
  success: { src: ['/audio/success.webm', '/audio/success.mp3'], volume: 0.65 },
  unlock: { src: ['/audio/unlock.webm', '/audio/unlock.mp3'], volume: 0.7 },
  hint: { src: ['/audio/hint.webm', '/audio/hint.mp3'], volume: 0.5 },
  collect: {
    src: ['/audio/collect.webm', '/audio/collect.mp3'],
    volume: 0.65,
  },
};

export function AudioProvider({ children }) {
  const { state, dispatch } = useProgress();
  const soundsRef = useRef({});

  const getSound = useCallback((name) => {
    if (!soundsRef.current[name] && SOUND_DEFS[name]) {
      soundsRef.current[name] = new Howl(SOUND_DEFS[name]);
    }
    return soundsRef.current[name] ?? null;
  }, []);

  const play = useCallback(
    (name) => {
      if (!state.settings.soundEnabled) return;
      const sound = getSound(name);
      sound?.play();
    },
    [state.settings.soundEnabled, getSound],
  );

  const toggleMute = useCallback(() => {
    const next = !state.settings.soundEnabled;
    dispatch({
      type: 'UPDATE_SETTINGS',
      payload: { soundEnabled: next },
    });
    Howler.mute(!next);
  }, [state.settings.soundEnabled, dispatch]);

  const value = useMemo(
    () => ({
      play,
      toggleMute,
      soundEnabled: state.settings.soundEnabled,
    }),
    [play, toggleMute, state.settings.soundEnabled],
  );

  return <AudioCtx.Provider value={value}>{children}</AudioCtx.Provider>;
}

export function useAudio() {
  const context = useContext(AudioCtx);
  if (!context) {
    throw new Error('useAudio must be used inside AudioProvider');
  }
  return context;
}
