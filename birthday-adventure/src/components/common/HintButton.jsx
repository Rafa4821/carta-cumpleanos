import { useState } from 'react';
import Button from 'react-bootstrap/Button';

export default function HintButton({ hints = [], attempts = 0 }) {
  const [hintIndex, setHintIndex] = useState(0);
  const [showHint, setShowHint] = useState(false);

  const hintAvailable = attempts >= 2 && hints.length > 0;
  const currentHint = hints[Math.min(hintIndex, hints.length - 1)];

  if (!hintAvailable) return null;

  const handleClick = () => {
    if (showHint && hintIndex < hints.length - 1) {
      setHintIndex((i) => i + 1);
    }
    setShowHint(true);
  };

  return (
    <div className="tw:mt-4 tw:text-center">
      <Button variant="outline-light" size="sm" onClick={handleClick}>
        {showHint ? 'Otra pista' : '\u00BFUna pista?'}
      </Button>
      {showHint && (
        <p
          className="tw:mt-2 tw:text-sm"
          style={{ color: 'var(--color-gold)' }}
        >
          {currentHint}
        </p>
      )}
    </div>
  );
}
