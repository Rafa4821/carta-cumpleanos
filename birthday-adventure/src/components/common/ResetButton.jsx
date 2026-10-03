import { useCallback } from 'react';
import { useProgress } from '../../context/ProgressContext';

export default function ResetButton({ worldId, itemId, onReset }) {
  const { dispatch } = useProgress();

  const handleReset = useCallback(() => {
    dispatch({ type: 'RESET_WORLD', worldId, itemId });
    if (onReset) onReset();
  }, [dispatch, worldId, itemId, onReset]);

  return (
    <button
      type="button"
      onClick={handleReset}
      className="tw:absolute tw:top-4 tw:right-4 tw:z-10 tw:text-xs tw:px-3 tw:py-1.5 tw:rounded-full tw:border tw:transition-opacity tw:opacity-40 hover:tw:opacity-100"
      style={{
        borderColor: 'var(--color-accent)',
        color: 'var(--color-accent)',
        backgroundColor: 'transparent',
      }}
      aria-label={`Reiniciar ${worldId}`}
    >
      {'\u21BB'} Reset
    </button>
  );
}
