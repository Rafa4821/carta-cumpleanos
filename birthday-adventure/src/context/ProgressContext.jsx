import { createContext, useContext, useEffect, useReducer } from 'react';

import { loadProgress, saveProgress } from '../lib/storage';
import { progressReducer } from '../lib/progressReducer';
import { initialProgress } from '../data/gameConfig';

const ProgressContext = createContext(null);

export function ProgressProvider({ children }) {
  const [state, dispatch] = useReducer(
    progressReducer,
    initialProgress,
    (fallback) => loadProgress(fallback),
  );

  useEffect(() => {
    saveProgress(state);
  }, [state]);

  return (
    <ProgressContext.Provider value={{ state, dispatch }}>
      {children}
    </ProgressContext.Provider>
  );
}

export function useProgress() {
  const context = useContext(ProgressContext);

  if (!context) {
    throw new Error('useProgress must be used inside ProgressProvider');
  }

  return context;
}
