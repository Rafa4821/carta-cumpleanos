import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';

import { useProgress } from '../../context/ProgressContext';
import { INVENTORY_ITEMS } from '../../data/inventory';
import {
  PENALTY_CONFIG,
  LOCKER_ITEMS,
  BELIEVE_TRIVIA,
} from '../../data/worlds/believe';
import ScreenReaderStatus from '../../components/common/ScreenReaderStatus';
import BackButton from '../../components/common/BackButton';

function PenaltyGame({ onComplete }) {
  const [aimX, setAimX] = useState(0.5);
  const [shots, setShots] = useState(0);
  const [goals, setGoals] = useState(0);
  const [phase, setPhase] = useState('aiming');
  const [lastResult, setLastResult] = useState(null);
  const { totalShots, requiredGoals, keeperDifficulty } = PENALTY_CONFIG;

  const shoot = () => {
    const keeperX = Math.random();
    const saved =
      Math.abs(keeperX - aimX) < keeperDifficulty * (1 - shots * 0.05);
    const scored = !saved;

    const newShots = shots + 1;
    const newGoals = goals + (scored ? 1 : 0);

    setShots(newShots);
    setGoals(newGoals);
    setLastResult(scored ? 'goal' : 'saved');
    setPhase('result');

    setTimeout(() => {
      if (newGoals >= requiredGoals) {
        onComplete();
      } else if (newShots >= totalShots) {
        if (newGoals < requiredGoals) {
          onComplete();
        }
      } else {
        setPhase('aiming');
        setLastResult(null);
      }
    }, 1500);
  };

  return (
    <div className="tw:text-center">
      <h2
        className="tw:text-xl tw:mb-4"
        style={{
          fontFamily: 'var(--font-display)',
          color: 'var(--color-text)',
        }}
      >
        Penales
      </h2>
      <p style={{ color: 'var(--color-text-muted)' }} className="tw:mb-4">
        Goles: {goals} / {requiredGoals} | Tiro: {shots} / {totalShots}
      </p>

      {/* Goal visualization */}
      <div
        className="tw:relative tw:mx-auto tw:mb-6 tw:rounded"
        style={{
          width: '100%',
          maxWidth: '360px',
          aspectRatio: '16/10',
          backgroundColor: 'var(--color-bg-card)',
          border: '3px solid var(--color-text-muted)',
        }}
      >
        {/* Aim indicator */}
        <div
          style={{
            position: 'absolute',
            bottom: '10%',
            left: `${aimX * 100}%`,
            transform: 'translateX(-50%)',
            width: '24px',
            height: '24px',
            borderRadius: '50%',
            backgroundColor: 'var(--color-gold)',
            transition: 'left 0.15s',
          }}
        />

        {lastResult && (
          <div className="tw:absolute tw:inset-0 tw:flex tw:items-center tw:justify-center tw:text-4xl">
            {lastResult === 'goal' ? '\u26BD\uFE0F' : '\uD83E\uDDE4'}
          </div>
        )}
      </div>

      {phase === 'aiming' && (
        <div>
          <input
            type="range"
            min="0.1"
            max="0.9"
            step="0.05"
            value={aimX}
            onChange={(e) => setAimX(parseFloat(e.target.value))}
            aria-label="Apuntar tiro"
            className="tw:w-full tw:max-w-xs tw:mb-4"
          />
          <div>
            <Button
              variant="outline-light"
              onClick={shoot}
              style={{
                borderColor: 'var(--color-gold)',
                color: 'var(--color-gold)',
              }}
            >
              Disparar!
            </Button>
          </div>
        </div>
      )}

      {phase === 'result' && (
        <p
          className="tw:text-lg"
          style={{
            color:
              lastResult === 'goal'
                ? 'var(--color-success)'
                : 'var(--color-accent)',
            fontFamily: 'var(--font-display)',
          }}
        >
          {lastResult === 'goal' ? 'GOOOL!' : 'Otra vez. Todavía creemos.'}
        </p>
      )}
    </div>
  );
}

function LockerRoom({ onComplete }) {
  const [found, setFound] = useState([]);
  const [currentClue, setCurrentClue] = useState(null);

  const handleItemClick = (item) => {
    if (!found.includes(item.id)) {
      setFound((prev) => [...prev, item.id]);
    }
    setCurrentClue(item.clue);

    if (found.length + 1 >= LOCKER_ITEMS.length) {
      setTimeout(() => onComplete(), 2000);
    }
  };

  return (
    <div>
      <h2
        className="tw:text-xl tw:text-center tw:mb-4"
        style={{
          fontFamily: 'var(--font-display)',
          color: 'var(--color-text)',
        }}
      >
        Vestuario
      </h2>
      <p
        className="tw:text-center tw:mb-4"
        style={{ color: 'var(--color-text-muted)' }}
      >
        Explora el vestuario. Encuentra todos los objetos. ({found.length}/
        {LOCKER_ITEMS.length})
      </p>

      <div
        className="game-scene tw:rounded-lg tw:overflow-hidden tw:mx-auto"
        style={{
          backgroundColor: 'var(--color-bg-card)',
          background:
            'linear-gradient(180deg, #2d1b4e 0%, #1a2a3a 50%, #1a1a2e 100%)',
        }}
      >
        {LOCKER_ITEMS.map((item) => {
          const isFound = found.includes(item.id);
          return (
            <button
              key={item.id}
              type="button"
              className="hotspot"
              style={{
                '--x': item.x,
                '--y': item.y,
                background: isFound
                  ? 'radial-gradient(circle, rgba(255,215,0,0.3) 0%, transparent 70%)'
                  : 'radial-gradient(circle, rgba(155,127,212,0.15) 0%, transparent 70%)',
                border: 'none',
                borderRadius: '50%',
                width: `${item.radius * 2}%`,
                height: `${item.radius * 2}%`,
                zIndex: 2,
              }}
              onClick={() => handleItemClick(item)}
              aria-label={isFound ? `${item.label} (encontrado)` : item.label}
            >
              <span
                className="tw:text-xs tw:absolute tw:top-full tw:left-1/2 tw:-translate-x-1/2 tw:whitespace-nowrap"
                style={{ color: 'var(--color-text-muted)' }}
              >
                {isFound ? item.label : '?'}
              </span>
            </button>
          );
        })}
      </div>

      {currentClue && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="tw:mt-4 tw:p-4 tw:rounded-lg tw:text-center"
          style={{ backgroundColor: 'var(--color-bg-card)' }}
        >
          <p
            className="tw:m-0 tw:italic"
            style={{
              fontFamily: 'var(--font-display)',
              color: 'var(--color-text)',
            }}
          >
            "{currentClue}"
          </p>
        </motion.div>
      )}
    </div>
  );
}

function TriviaPhase({ onComplete }) {
  const [qIndex, setQIndex] = useState(0);
  const [answered, setAnswered] = useState(false);

  const q = BELIEVE_TRIVIA[qIndex];

  const handleAnswer = (_opt) => {
    setAnswered(true);
    setTimeout(() => {
      setAnswered(false);
      if (qIndex < BELIEVE_TRIVIA.length - 1) {
        setQIndex((i) => i + 1);
      } else {
        onComplete();
      }
    }, 1500);
  };

  return (
    <div className="tw:text-center tw:max-w-md tw:mx-auto">
      <h2
        className="tw:text-xl tw:mb-4"
        style={{
          fontFamily: 'var(--font-display)',
          color: 'var(--color-text)',
        }}
      >
        {q.question}
      </h2>
      <div className="tw:flex tw:flex-col tw:gap-3">
        {q.options.map((opt) => (
          <Button
            key={opt}
            variant={
              answered
                ? opt === q.correctAnswer
                  ? 'success'
                  : 'outline-secondary'
                : 'outline-light'
            }
            disabled={answered}
            onClick={() => handleAnswer(opt)}
            className="tw:py-3"
          >
            {opt}
          </Button>
        ))}
      </div>
    </div>
  );
}

export default function BelieveWorld() {
  const navigate = useNavigate();
  const { state, dispatch } = useProgress();
  const [phase, setPhase] = useState(
    state.worlds.believe.status === 'completed' ? 'complete' : 'trivia',
  );
  const [statusMsg, setStatusMsg] = useState('');

  const handleTriviaComplete = () => setPhase('penalty');
  const handlePenaltyComplete = () => setPhase('locker');
  const handleLockerComplete = () => {
    dispatch({
      type: 'COMPLETE_WORLD',
      worldId: 'believe',
      itemId: INVENTORY_ITEMS.believe.id,
    });
    setPhase('complete');
    setStatusMsg('Mundo Believe completado!');
  };

  if (phase === 'complete') {
    return (
      <div
        className="tw:min-h-screen tw:flex tw:items-center tw:justify-center tw:px-4"
        style={{ backgroundColor: 'var(--color-bg)' }}
      >
        <Container className="tw:max-w-md tw:text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <div className="tw:text-6xl tw:mb-4">
              {INVENTORY_ITEMS.believe.icon}
            </div>
            <h2
              className="tw:text-3xl tw:mb-4"
              style={{
                fontFamily: 'var(--font-display)',
                color: 'var(--color-gold)',
              }}
            >
              {INVENTORY_ITEMS.believe.label} conseguida!
            </h2>
            <Button
              variant="outline-light"
              size="lg"
              onClick={() => navigate('/aventura')}
              style={{
                borderColor: 'var(--color-gold)',
                color: 'var(--color-gold)',
              }}
            >
              Volver al mapa
            </Button>
          </motion.div>
        </Container>
      </div>
    );
  }

  return (
    <div
      className="tw:min-h-screen tw:py-8 tw:px-4 tw:relative"
      style={{ backgroundColor: 'var(--color-bg)' }}
    >
      <BackButton />
      <Container className="tw:max-w-3xl">
        <ScreenReaderStatus message={statusMsg} />

        <AnimatePresence mode="wait">
          {phase === 'trivia' && (
            <motion.div
              key="trivia"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <TriviaPhase onComplete={handleTriviaComplete} />
            </motion.div>
          )}
          {phase === 'penalty' && (
            <motion.div
              key="penalty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <PenaltyGame onComplete={handlePenaltyComplete} />
            </motion.div>
          )}
          {phase === 'locker' && (
            <motion.div
              key="locker"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <LockerRoom onComplete={handleLockerComplete} />
            </motion.div>
          )}
        </AnimatePresence>
      </Container>
    </div>
  );
}
