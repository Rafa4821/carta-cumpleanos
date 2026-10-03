import Button from 'react-bootstrap/Button';
import { useAudio } from '../../context/AudioContext';

export default function AudioControls() {
  const { soundEnabled, toggleMute } = useAudio();

  return (
    <Button
      variant="link"
      onClick={toggleMute}
      aria-label={soundEnabled ? 'Silenciar sonido' : 'Activar sonido'}
      className="tw:text-xl tw:p-1"
      style={{ color: 'var(--color-text)', textDecoration: 'none' }}
    >
      {soundEnabled ? '\uD83D\uDD0A' : '\uD83D\uDD07'}
    </Button>
  );
}
