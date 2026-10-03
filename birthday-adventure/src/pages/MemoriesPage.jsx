import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';

import { useProgress } from '../context/ProgressContext';
import ScreenReaderStatus from '../components/common/ScreenReaderStatus';
import BackButton from '../components/common/BackButton';

const GRID_SIZE = 3;
const TOTAL = GRID_SIZE * GRID_SIZE;

// Placeholder image path - replace with actual photo
const PUZZLE_IMAGE = '/images/memories/couple-puzzle.webp';

// Color palette for fallback tiles when no image is loaded
const TILE_COLORS = [
  '#6a3093',
  '#a044ff',
  '#c06cff',
  '#4e54c8',
  '#8f94fb',
  '#667eea',
  '#764ba2',
  '#9b59b6',
  '#e056a0',
];

function createShuffled() {
  const arr = Array.from({ length: TOTAL }, (_, i) => i);
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  // Make sure it's not already solved
  if (arr.every((v, i) => v === i)) {
    [arr[0], arr[1]] = [arr[1], arr[0]];
  }
  return arr;
}

function isSolved(pieces) {
  return pieces.every((v, i) => v === i);
}

export default function MemoriesPage() {
  const navigate = useNavigate();
  const { dispatch } = useProgress();
  const [pieces, setPieces] = useState(() => createShuffled());
  const [selected, setSelected] = useState(null);
  const [moves, setMoves] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [statusMsg, setStatusMsg] = useState('');
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    const img = new window.Image();
    img.onload = () => setImageLoaded(true);
    img.src = PUZZLE_IMAGE;
  }, []);

  const handleClick = (pos) => {
    if (completed) return;

    // Clicking the same piece deselects it
    if (selected === pos) {
      setSelected(null);
      setStatusMsg('');
      return;
    }

    if (selected === null) {
      // First selection
      setSelected(pos);
      setStatusMsg(`Pieza ${pos + 1} seleccionada`);
    } else {
      // Second selection -> swap
      const next = [...pieces];
      [next[selected], next[pos]] = [next[pos], next[selected]];
      setPieces(next);
      setMoves((m) => m + 1);
      setSelected(null);

      if (isSolved(next)) {
        setCompleted(true);
        dispatch({ type: 'COMPLETE_PHOTO_PUZZLE' });
        setStatusMsg('Puzzle completado!');
      } else {
        setStatusMsg(`Piezas ${selected + 1} y ${pos + 1} intercambiadas`);
      }
    }
  };

  return (
    <div
      className="tw:min-h-screen tw:py-8 tw:px-4 tw:relative"
      style={{ backgroundColor: 'var(--color-bg)' }}
    >
      <BackButton />
      <Container className="tw:max-w-lg tw:text-center">
        <h1
          className="tw:text-2xl tw:mb-2"
          style={{
            fontFamily: 'var(--font-display)',
            color: 'var(--color-text)',
          }}
        >
          Reconstruye el recuerdo
        </h1>
        <p style={{ color: 'var(--color-text-muted)' }} className="tw:mb-4">
          Movimientos: {moves}
        </p>

        <ScreenReaderStatus message={statusMsg} />

        <div
          className="tw:grid tw:gap-1 tw:mx-auto tw:max-w-sm tw:aspect-square"
          style={{
            gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
          }}
        >
          {pieces.map((pieceIndex, pos) => {
            const isSelected = selected === pos;
            const isCorrect = pieceIndex === pos;
            const row = Math.floor(pieceIndex / GRID_SIZE);
            const col = pieceIndex % GRID_SIZE;
            const pct = 100 / (GRID_SIZE - 1);

            return (
              <button
                key={pos}
                type="button"
                onClick={() => handleClick(pos)}
                aria-label={`Pieza ${pos + 1}${isSelected ? ' (seleccionada)' : ''}${isCorrect && !completed ? ' (en posicion correcta)' : ''}`}
                className="tw:aspect-square tw:rounded-lg tw:border-2 tw:transition-all tw:duration-200 tw:relative tw:overflow-hidden"
                style={{
                  borderColor: isSelected
                    ? 'var(--color-gold)'
                    : completed && isCorrect
                      ? 'rgba(255,215,0,0.4)'
                      : 'rgba(255,255,255,0.1)',
                  transform: isSelected ? 'scale(1.08)' : 'scale(1)',
                  zIndex: isSelected ? 2 : 1,
                  boxShadow: isSelected
                    ? '0 0 20px rgba(255,215,0,0.4)'
                    : 'none',
                }}
              >
                {imageLoaded ? (
                  // Photo-based tile
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      backgroundImage: `url(${PUZZLE_IMAGE})`,
                      backgroundSize: `${GRID_SIZE * 100}%`,
                      backgroundPosition: `${col * pct}% ${row * pct}%`,
                    }}
                  />
                ) : (
                  // Fallback colored tile with number
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      background: `linear-gradient(135deg, ${TILE_COLORS[pieceIndex]} 0%, ${TILE_COLORS[(pieceIndex + 3) % TOTAL]} 100%)`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <span
                      style={{
                        fontSize: '1.8em',
                        fontWeight: 'bold',
                        color: 'rgba(255,255,255,0.85)',
                        fontFamily: 'var(--font-display)',
                        textShadow: '0 2px 8px rgba(0,0,0,0.3)',
                      }}
                    >
                      {pieceIndex + 1}
                    </span>
                  </div>
                )}

                {/* Correct position indicator */}
                {isCorrect && !completed && (
                  <div
                    style={{
                      position: 'absolute',
                      bottom: 4,
                      right: 4,
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      backgroundColor: 'var(--color-gold)',
                      opacity: 0.7,
                    }}
                  />
                )}
              </button>
            );
          })}
        </div>

        <p
          className="tw:mt-4 tw:text-sm"
          style={{
            color:
              selected !== null
                ? 'var(--color-gold)'
                : 'var(--color-text-muted)',
          }}
        >
          {selected !== null
            ? 'Ahora selecciona otra pieza para intercambiar'
            : 'Selecciona una pieza para moverla'}
        </p>

        {!imageLoaded && !completed && (
          <p
            className="tw:mt-2 tw:text-xs"
            style={{ color: 'var(--color-text-muted)', opacity: 0.6 }}
          >
            Ordena los numeros del 1 al 9 (izq. a der., arriba a abajo)
          </p>
        )}

        {completed && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="tw:mt-6"
          >
            <p
              className="tw:text-xl tw:mb-4"
              style={{
                fontFamily: 'var(--font-display)',
                color: 'var(--color-gold)',
              }}
            >
              {'\u2728'} Recuerdo reconstruido
            </p>
            <Button
              variant="outline-light"
              size="lg"
              onClick={() => navigate('/caja-fuerte')}
              style={{
                borderColor: 'var(--color-gold)',
                color: 'var(--color-gold)',
              }}
            >
              Continuar
            </Button>
          </motion.div>
        )}
      </Container>
    </div>
  );
}
