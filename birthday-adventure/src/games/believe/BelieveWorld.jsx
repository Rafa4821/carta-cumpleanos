import { useState, useCallback } from 'react';
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
  TED_QUOTES,
} from '../../data/worlds/believe';
import ScreenReaderStatus from '../../components/common/ScreenReaderStatus';
import BackButton from '../../components/common/BackButton';
import ResetButton from '../../components/common/ResetButton';

/* ------------------------------------------------------------------ */
/*  Deterministic pseudo-random for net particles                     */
/* ------------------------------------------------------------------ */
function seeded(seed) {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

const rng = seeded(55);
const CONFETTI = Array.from({ length: 18 }, (_, i) => ({
  id: i,
  x: rng() * 100,
  delay: rng() * 0.4,
  color: ['#ffd700', '#ff6b6b', '#48dbfb', '#fff', '#ff9ff3'][
    Math.floor(rng() * 5)
  ],
  size: 4 + rng() * 6,
}));

const GRASS_STRIPES = [0, 14, 28, 42, 56, 70, 84];

/* ------------------------------------------------------------------ */
/*  PenaltyGame – fully animated                                      */
/* ------------------------------------------------------------------ */
function PenaltyGame({ onComplete }) {
  const [aimX, setAimX] = useState(0.5);
  const [shots, setShots] = useState(0);
  const [goals, setGoals] = useState(0);
  const [phase, setPhase] = useState('aiming');
  const [lastResult, setLastResult] = useState(null);
  const [ballPos, setBallPos] = useState({ x: 50, y: 82 });
  const [keeperPos, setKeeperPos] = useState(50);
  const [showConfetti, setShowConfetti] = useState(false);
  const { totalShots, requiredGoals, keeperDifficulty } = PENALTY_CONFIG;

  const shoot = useCallback(() => {
    if (phase !== 'aiming') return;
    const keeperX = Math.random();
    const saved =
      Math.abs(keeperX - aimX) < keeperDifficulty * (1 - shots * 0.05);
    const scored = !saved;

    /* Animate keeper dive */
    setKeeperPos(keeperX * 100);

    /* Animate ball to target */
    const targetX = aimX * 80 + 10;
    const targetY = 15 + Math.random() * 20;
    setBallPos({ x: targetX, y: targetY });
    setPhase('shooting');

    setTimeout(() => {
      const newShots = shots + 1;
      const newGoals = goals + (scored ? 1 : 0);
      setShots(newShots);
      setGoals(newGoals);
      setLastResult(scored ? 'goal' : 'saved');
      setPhase('result');

      if (scored) setShowConfetti(true);

      setTimeout(() => {
        setShowConfetti(false);
        if (newGoals >= requiredGoals) {
          onComplete();
        } else if (newShots >= totalShots) {
          onComplete();
        } else {
          setPhase('aiming');
          setLastResult(null);
          setBallPos({ x: 50, y: 82 });
          setKeeperPos(50);
        }
      }, 2000);
    }, 600);
  }, [
    phase,
    aimX,
    shots,
    goals,
    keeperDifficulty,
    requiredGoals,
    totalShots,
    onComplete,
  ]);

  return (
    <div className="tw:text-center">
      <h2
        className="tw:text-2xl tw:mb-2"
        style={{
          fontFamily: 'var(--font-display)',
          color: 'var(--color-text)',
        }}
      >
        {'\u26BD'} Penalty Shootout
      </h2>

      {/* Score display */}
      <div className="tw:flex tw:justify-center tw:gap-6 tw:mb-4">
        <div
          className="tw:px-4 tw:py-2 tw:rounded-lg"
          style={{
            backgroundColor: 'rgba(255,215,0,0.1)',
            border: '1px solid rgba(255,215,0,0.2)',
          }}
        >
          <span
            className="tw:text-xs tw:block"
            style={{ color: 'var(--color-text-muted)' }}
          >
            Goals
          </span>
          <span
            className="tw:text-2xl tw:font-bold"
            style={{ color: 'var(--color-gold)' }}
          >
            {goals}/{requiredGoals}
          </span>
        </div>
        <div
          className="tw:px-4 tw:py-2 tw:rounded-lg"
          style={{
            backgroundColor: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.1)',
          }}
        >
          <span
            className="tw:text-xs tw:block"
            style={{ color: 'var(--color-text-muted)' }}
          >
            Shot
          </span>
          <span className="tw:text-2xl tw:font-bold" style={{ color: '#fff' }}>
            {shots}/{totalShots}
          </span>
        </div>
      </div>

      {/* Shot history dots */}
      <div className="tw:flex tw:justify-center tw:gap-2 tw:mb-4">
        {Array.from({ length: totalShots }, (_, i) => (
          <div
            key={i}
            className="tw:w-3 tw:h-3 tw:rounded-full tw:transition-all tw:duration-300"
            style={{
              backgroundColor:
                i >= shots
                  ? 'rgba(255,255,255,0.15)'
                  : i < goals
                    ? 'var(--color-success)'
                    : 'var(--color-accent)',
              boxShadow:
                i < shots && i < goals
                  ? '0 0 6px rgba(72,219,251,0.4)'
                  : 'none',
            }}
          />
        ))}
      </div>

      {/* Stadium / pitch */}
      <div
        className="tw:relative tw:mx-auto tw:mb-6 tw:rounded-xl tw:overflow-hidden"
        style={{
          width: '100%',
          maxWidth: '420px',
          aspectRatio: '16/10',
        }}
      >
        {/* Sky */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'linear-gradient(180deg, #0a1628 0%, #162544 25%, #1a3a5c 40%, #2d6a3f 40%, #1e5a2f 100%)',
          }}
        />

        {/* Stadium lights */}
        {[15, 85].map((x) => (
          <div
            key={x}
            style={{
              position: 'absolute',
              top: '2%',
              left: `${x}%`,
              transform: 'translateX(-50%)',
              width: '8px',
              height: '35%',
              background:
                'linear-gradient(180deg, rgba(255,250,200,0.8) 0%, rgba(255,250,200,0.1) 100%)',
              borderRadius: '4px',
              pointerEvents: 'none',
            }}
          >
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: '50%',
                transform: 'translateX(-50%)',
                width: '30px',
                height: '30px',
                borderRadius: '50%',
                background:
                  'radial-gradient(circle, rgba(255,250,200,0.5) 0%, transparent 70%)',
              }}
            />
          </div>
        ))}

        {/* Grass stripes */}
        {GRASS_STRIPES.map((y) => (
          <div
            key={y}
            style={{
              position: 'absolute',
              top: `${40 + (y / 100) * 60}%`,
              left: 0,
              right: 0,
              height: `${60 / GRASS_STRIPES.length}%`,
              backgroundColor:
                GRASS_STRIPES.indexOf(y) % 2 === 0
                  ? 'rgba(255,255,255,0.02)'
                  : 'transparent',
              pointerEvents: 'none',
            }}
          />
        ))}

        {/* Goal frame */}
        <div
          style={{
            position: 'absolute',
            top: '10%',
            left: '20%',
            right: '20%',
            height: '32%',
            border: '3px solid rgba(255,255,255,0.9)',
            borderBottom: 'none',
            borderRadius: '4px 4px 0 0',
            pointerEvents: 'none',
          }}
        >
          {/* Net pattern */}
          <svg
            width="100%"
            height="100%"
            style={{ position: 'absolute', inset: 0, opacity: 0.15 }}
          >
            <defs>
              <pattern
                id="net"
                width="12"
                height="12"
                patternUnits="userSpaceOnUse"
              >
                <path
                  d="M 12 0 L 0 12 M 0 0 L 12 12"
                  stroke="white"
                  strokeWidth="0.5"
                  fill="none"
                />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#net)" />
          </svg>
        </div>

        {/* Goal line */}
        <div
          style={{
            position: 'absolute',
            top: '42%',
            left: '15%',
            right: '15%',
            height: '2px',
            background: 'rgba(255,255,255,0.4)',
            pointerEvents: 'none',
          }}
        />

        {/* Penalty spot */}
        <div
          style={{
            position: 'absolute',
            top: '75%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '6px',
            height: '6px',
            borderRadius: '50%',
            backgroundColor: 'rgba(255,255,255,0.5)',
            pointerEvents: 'none',
          }}
        />

        {/* Keeper */}
        <motion.div
          animate={{
            left: `${keeperPos}%`,
            scaleX:
              phase === 'shooting' || phase === 'result'
                ? keeperPos < 40
                  ? -1.3
                  : 1.3
                : 1,
          }}
          transition={{
            type: 'spring',
            stiffness: 200,
            damping: 15,
            duration: 0.4,
          }}
          style={{
            position: 'absolute',
            top: '22%',
            left: '50%',
            transform: 'translateX(-50%)',
            fontSize: '2.2em',
            pointerEvents: 'none',
            zIndex: 3,
          }}
        >
          {'\uD83E\uDDE4'}
        </motion.div>

        {/* Ball */}
        <motion.div
          animate={{
            left: `${ballPos.x}%`,
            top: `${ballPos.y}%`,
            scale:
              phase === 'shooting' || phase === 'result'
                ? ballPos.y < 50
                  ? 0.7
                  : 1
                : 1,
          }}
          transition={{
            type: 'spring',
            stiffness: 180,
            damping: 18,
            duration: 0.5,
          }}
          style={{
            position: 'absolute',
            top: `${ballPos.y}%`,
            left: `${ballPos.x}%`,
            transform: 'translate(-50%, -50%)',
            fontSize: '1.6em',
            pointerEvents: 'none',
            zIndex: 4,
            filter:
              phase === 'shooting'
                ? 'drop-shadow(0 4px 8px rgba(0,0,0,0.5))'
                : 'none',
          }}
        >
          {'\u26BD'}
        </motion.div>

        {/* Aim crosshair when aiming */}
        {phase === 'aiming' && (
          <motion.div
            animate={{ left: `${aimX * 60 + 20}%` }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            style={{
              position: 'absolute',
              top: '25%',
              transform: 'translate(-50%, -50%)',
              pointerEvents: 'none',
              zIndex: 5,
            }}
          >
            <div
              style={{
                width: '28px',
                height: '28px',
                border: '2px solid rgba(255,215,0,0.7)',
                borderRadius: '50%',
                position: 'relative',
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  top: '50%',
                  left: '-4px',
                  right: '-4px',
                  height: '1px',
                  background: 'rgba(255,215,0,0.5)',
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  left: '50%',
                  top: '-4px',
                  bottom: '-4px',
                  width: '1px',
                  background: 'rgba(255,215,0,0.5)',
                }}
              />
            </div>
          </motion.div>
        )}

        {/* Goal/Save flash overlay */}
        <AnimatePresence>
          {lastResult && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="tw:absolute tw:inset-0 tw:flex tw:items-center tw:justify-center tw:z-10"
              style={{
                background:
                  lastResult === 'goal'
                    ? 'rgba(72,219,251,0.1)'
                    : 'rgba(255,100,100,0.08)',
              }}
            >
              <motion.div
                initial={{ scale: 0, rotate: -10 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring', stiffness: 200 }}
                className="tw:text-center"
              >
                <div className="tw:text-5xl tw:mb-1">
                  {lastResult === 'goal' ? '\u26BD' : '\uD83E\uDDE4'}
                </div>
                <div
                  className="tw:text-2xl tw:font-bold tw:tracking-wider"
                  style={{
                    fontFamily: 'var(--font-display)',
                    color:
                      lastResult === 'goal'
                        ? 'var(--color-gold)'
                        : 'var(--color-accent)',
                    textShadow:
                      lastResult === 'goal'
                        ? '0 0 20px rgba(255,215,0,0.5)'
                        : 'none',
                  }}
                >
                  {lastResult === 'goal' ? 'GOOOL!' : 'SAVED!'}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Confetti + crowd wave on goal */}
        <AnimatePresence>
          {showConfetti && (
            <>
              {CONFETTI.map((c) => (
                <motion.div
                  key={c.id}
                  initial={{ y: -10, x: `${c.x}%`, opacity: 1, rotate: 0 }}
                  animate={{
                    y: 200,
                    opacity: 0,
                    rotate: 360 + c.x * 3,
                  }}
                  exit={{ opacity: 0 }}
                  transition={{
                    duration: 1.2,
                    delay: c.delay,
                    ease: 'easeIn',
                  }}
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: `${c.size}px`,
                    height: `${c.size}px`,
                    backgroundColor: c.color,
                    borderRadius: c.id % 3 === 0 ? '50%' : '2px',
                    pointerEvents: 'none',
                    zIndex: 15,
                  }}
                />
              ))}
              {/* Crowd wave */}
              <div
                style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  display: 'flex',
                  justifyContent: 'center',
                  gap: '2px',
                  pointerEvents: 'none',
                  zIndex: 14,
                }}
              >
                {Array.from({ length: 16 }, (_, i) => (
                  <motion.span
                    key={i}
                    initial={{ y: 0 }}
                    animate={{ y: [0, -8, 0] }}
                    transition={{
                      duration: 0.4,
                      delay: i * 0.06,
                      repeat: 3,
                    }}
                    style={{
                      fontSize: '14px',
                      opacity: 0.7,
                    }}
                  >
                    {i % 3 === 0
                      ? '\uD83D\uDE4C'
                      : i % 3 === 1
                        ? '\uD83D\uDC4F'
                        : '\uD83C\uDF89'}
                  </motion.span>
                ))}
              </div>
            </>
          )}
        </AnimatePresence>
      </div>

      {/* Controls */}
      {phase === 'aiming' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <p
            className="tw:text-sm tw:mb-3"
            style={{ color: 'var(--color-text-muted)' }}
          >
            {'\u2190'} Slide to aim {'\u2192'}
          </p>
          <input
            type="range"
            min="0.1"
            max="0.9"
            step="0.02"
            value={aimX}
            onChange={(e) => setAimX(parseFloat(e.target.value))}
            aria-label="Aim shot"
            className="tw:w-full tw:max-w-xs tw:mb-4"
            style={{ accentColor: 'var(--color-gold)' }}
          />
          <div>
            <Button
              size="lg"
              onClick={shoot}
              className="tw:px-8 tw:py-2"
              style={{
                background:
                  'linear-gradient(135deg, var(--color-gold) 0%, #ff9f43 100%)',
                border: 'none',
                color: '#000',
                fontFamily: 'var(--font-display)',
                fontWeight: 'bold',
                fontSize: '1.1rem',
              }}
            >
              {'\u26BD'} SHOOT!
            </Button>
          </div>
        </motion.div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  LockerRoom – with emojis and quote cards                           */
/* ------------------------------------------------------------------ */
function LockerRoom({ onComplete }) {
  const [found, setFound] = useState([]);
  const [currentQuote, setCurrentQuote] = useState(null);

  const handleItemClick = (item) => {
    if (!found.includes(item.id)) {
      setFound((prev) => [...prev, item.id]);
    }
    setCurrentQuote({ text: item.quote, speaker: item.speaker });

    if (found.length + 1 >= LOCKER_ITEMS.length) {
      setTimeout(() => onComplete(), 2500);
    }
  };

  return (
    <div>
      <h2
        className="tw:text-2xl tw:text-center tw:mb-2"
        style={{
          fontFamily: 'var(--font-display)',
          color: 'var(--color-text)',
        }}
      >
        {'\uD83D\uDEBF'} Locker Room
      </h2>
      <p
        className="tw:text-center tw:mb-4 tw:text-sm"
        style={{ color: 'var(--color-text-muted)' }}
      >
        Tap each item to discover a quote. ({found.length}/{LOCKER_ITEMS.length}
        )
      </p>

      {/* Progress bar */}
      <div
        className="tw:mx-auto tw:mb-4 tw:rounded-full tw:h-1.5 tw:overflow-hidden"
        style={{
          maxWidth: '300px',
          backgroundColor: 'rgba(255,255,255,0.08)',
        }}
      >
        <motion.div
          className="tw:h-full tw:rounded-full"
          style={{
            background:
              'linear-gradient(90deg, var(--color-primary-light), var(--color-gold))',
          }}
          animate={{
            width: `${(found.length / LOCKER_ITEMS.length) * 100}%`,
          }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        />
      </div>

      <div
        className="game-scene tw:rounded-xl tw:overflow-hidden tw:mx-auto"
        style={{
          background:
            'linear-gradient(180deg, #1a2744 0%, #1e3a52 30%, #1a2a3a 60%, #1a1a2e 100%)',
        }}
      >
        {/* Locker room bench */}
        <div
          style={{
            position: 'absolute',
            bottom: '10%',
            left: '10%',
            right: '10%',
            height: '8%',
            background:
              'linear-gradient(0deg, rgba(80,50,20,0.4) 0%, rgba(70,40,15,0.2) 100%)',
            borderTop: '2px solid rgba(139,90,43,0.25)',
            borderRadius: '3px',
            pointerEvents: 'none',
          }}
        />

        {/* Locker panels */}
        {[20, 40, 60, 80].map((x) => (
          <div
            key={x}
            style={{
              position: 'absolute',
              top: '5%',
              left: `${x - 7}%`,
              width: '14%',
              height: '50%',
              border: '1px solid rgba(100,120,160,0.15)',
              borderRadius: '3px',
              background:
                'linear-gradient(180deg, rgba(60,80,120,0.15) 0%, rgba(40,60,90,0.1) 100%)',
              pointerEvents: 'none',
            }}
          />
        ))}

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
                  ? 'radial-gradient(circle, rgba(255,215,0,0.25) 0%, transparent 70%)'
                  : 'radial-gradient(circle, rgba(155,127,212,0.1) 0%, transparent 70%)',
                border: 'none',
                borderRadius: '50%',
                width: `${item.radius * 2}%`,
                height: `${item.radius * 2}%`,
                zIndex: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.3s',
              }}
              onClick={() => handleItemClick(item)}
              aria-label={isFound ? `${item.label} (found)` : item.label}
            >
              <span
                style={{
                  fontSize: '1.5em',
                  opacity: isFound ? 1 : 0.5,
                  filter: isFound
                    ? 'drop-shadow(0 0 6px rgba(255,215,0,0.4))'
                    : 'saturate(0.5) brightness(0.7)',
                  transition: 'all 0.3s',
                  pointerEvents: 'none',
                }}
              >
                {item.emoji}
              </span>
              {isFound && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  style={{
                    position: 'absolute',
                    bottom: '-2px',
                    right: '-2px',
                    fontSize: '0.7em',
                  }}
                >
                  {'\u2728'}
                </motion.span>
              )}
            </button>
          );
        })}
      </div>

      {/* Quote card */}
      <AnimatePresence mode="wait">
        {currentQuote && (
          <motion.div
            key={currentQuote.text}
            initial={{ opacity: 0, y: 15, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.4, type: 'spring', stiffness: 150 }}
            className="tw:mt-5 tw:p-5 tw:rounded-xl tw:text-center tw:mx-auto"
            style={{
              maxWidth: '440px',
              background:
                'linear-gradient(135deg, rgba(255,215,0,0.06) 0%, rgba(255,255,255,0.03) 100%)',
              border: '1px solid rgba(255,215,0,0.15)',
              boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
            }}
          >
            <div
              className="tw:text-3xl tw:mb-2"
              style={{ opacity: 0.3, color: 'var(--color-gold)' }}
            >
              {'\u201C'}
            </div>
            <p
              className="tw:m-0 tw:text-base tw:leading-relaxed tw:italic"
              style={{
                fontFamily: 'var(--font-display)',
                color: 'var(--color-text)',
              }}
            >
              {currentQuote.text}
            </p>
            <p
              className="tw:m-0 tw:mt-3 tw:text-sm tw:font-medium"
              style={{ color: 'var(--color-gold)' }}
            >
              {'\u2014'} {currentQuote.speaker}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  TriviaPhase – now with quote reveal after each answer              */
/* ------------------------------------------------------------------ */
function TriviaPhase({ onComplete }) {
  const [qIndex, setQIndex] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [selected, setSelected] = useState(null);

  const q = BELIEVE_TRIVIA[qIndex];
  const quote = TED_QUOTES[qIndex % TED_QUOTES.length];

  const handleAnswer = (opt) => {
    setSelected(opt);
    setAnswered(true);
    setTimeout(() => {
      setAnswered(false);
      setSelected(null);
      if (qIndex < BELIEVE_TRIVIA.length - 1) {
        setQIndex((i) => i + 1);
      } else {
        onComplete();
      }
    }, 3000);
  };

  return (
    <div className="tw:text-center tw:max-w-md tw:mx-auto">
      {/* Question counter */}
      <div className="tw:flex tw:justify-center tw:gap-2 tw:mb-6">
        {BELIEVE_TRIVIA.map((_, i) => (
          <div
            key={i}
            className="tw:rounded-full tw:transition-all tw:duration-300"
            style={{
              width: i === qIndex ? 24 : 8,
              height: 8,
              backgroundColor:
                i < qIndex
                  ? 'var(--color-gold)'
                  : i === qIndex
                    ? 'var(--color-primary-light)'
                    : 'rgba(255,255,255,0.15)',
            }}
          />
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={qIndex}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          <h2
            className="tw:text-xl tw:mb-6"
            style={{
              fontFamily: 'var(--font-display)',
              color: 'var(--color-text)',
            }}
          >
            {q.question}
          </h2>

          <div className="tw:flex tw:flex-col tw:gap-3 tw:mb-6">
            {q.options.map((opt) => {
              let variant = 'outline-light';
              if (answered) {
                if (opt === q.correctAnswer) variant = 'success';
                else if (opt === selected) variant = 'danger';
                else variant = 'outline-secondary';
              }
              return (
                <Button
                  key={opt}
                  variant={variant}
                  disabled={answered}
                  onClick={() => handleAnswer(opt)}
                  className="tw:py-3 tw:text-base"
                  style={{
                    transition: 'all 0.3s',
                  }}
                >
                  {opt}
                </Button>
              );
            })}
          </div>

          {/* Quote reveal after answering */}
          <AnimatePresence>
            {answered && (
              <motion.div
                initial={{ opacity: 0, y: 15, height: 0 }}
                animate={{ opacity: 1, y: 0, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.4, delay: 0.3 }}
                className="tw:p-4 tw:rounded-xl tw:overflow-hidden"
                style={{
                  background:
                    'linear-gradient(135deg, rgba(255,215,0,0.08) 0%, rgba(100,70,180,0.05) 100%)',
                  border: '1px solid rgba(255,215,0,0.12)',
                }}
              >
                <p
                  className="tw:m-0 tw:text-sm tw:italic tw:leading-relaxed"
                  style={{
                    fontFamily: 'var(--font-display)',
                    color: 'var(--color-text)',
                  }}
                >
                  &ldquo;{quote.text}&rdquo;
                </p>
                <p
                  className="tw:m-0 tw:mt-2 tw:text-xs"
                  style={{ color: 'var(--color-gold)' }}
                >
                  {'\u2014'} {quote.speaker}, Season {quote.season}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main BelieveWorld                                                  */
/* ------------------------------------------------------------------ */
export default function BelieveWorld() {
  const navigate = useNavigate();
  const { state, dispatch } = useProgress();
  const [resetKey, setResetKey] = useState(0);
  const [phase, setPhase] = useState(
    state.worlds.believe.status === 'completed' ? 'complete' : 'trivia',
  );
  const [statusMsg, setStatusMsg] = useState('');

  const handleReset = () => {
    setPhase('trivia');
    setStatusMsg('');
    setResetKey((k) => k + 1);
  };

  const PHASES = ['trivia', 'penalty', 'locker'];
  const phaseIndex = PHASES.indexOf(phase);

  const handleTriviaComplete = () => setPhase('penalty');
  const handlePenaltyComplete = () => setPhase('locker');
  const handleLockerComplete = () => {
    dispatch({
      type: 'COMPLETE_WORLD',
      worldId: 'believe',
      itemId: INVENTORY_ITEMS.believe.id,
    });
    setPhase('complete');
    setStatusMsg('Believe world completed!');
  };

  if (phase === 'complete') {
    return (
      <div
        className="tw:min-h-screen tw:flex tw:items-center tw:justify-center tw:px-4 tw:relative tw:overflow-hidden"
        style={{
          background:
            'radial-gradient(ellipse at 50% 30%, rgba(20,184,166,0.15) 0%, transparent 60%), var(--color-bg)',
        }}
      >
        <ResetButton
          worldId="believe"
          itemId={INVENTORY_ITEMS.believe.id}
          onReset={handleReset}
        />
        <Container className="tw:max-w-md tw:text-center">
          {/* BELIEVE banner */}
          <motion.div
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: 1, opacity: 1 }}
            transition={{ duration: 0.8, type: 'spring', stiffness: 120 }}
            className="tw:mb-8 tw:py-4 tw:px-6 tw:rounded-lg tw:mx-auto"
            style={{
              background: 'linear-gradient(135deg, #f1c40f 0%, #f39c12 100%)',
              maxWidth: '320px',
              boxShadow: '0 4px 20px rgba(241,196,15,0.3)',
            }}
          >
            <h1
              className="tw:text-4xl tw:font-bold tw:tracking-widest tw:m-0"
              style={{
                color: '#1a1a2e',
                fontFamily: 'var(--font-display)',
                letterSpacing: '0.15em',
              }}
            >
              BELIEVE
            </h1>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
          >
            <div className="tw:text-6xl tw:mb-4">
              {INVENTORY_ITEMS.believe.icon}
            </div>
            <h2
              className="tw:text-3xl tw:mb-2 shimmer-text"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              {INVENTORY_ITEMS.believe.label} conseguida!
            </h2>
            <p
              className="tw:mb-6 tw:italic"
              style={{
                color: 'var(--color-text-muted)',
                fontFamily: 'var(--font-display)',
              }}
            >
              &ldquo;Be curious, not judgmental.&rdquo;
            </p>
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
      className="tw:min-h-screen tw:py-8 tw:px-4 tw:relative tw:overflow-hidden"
      style={{
        background:
          'radial-gradient(ellipse at 50% 20%, rgba(20,184,166,0.1) 0%, transparent 50%), var(--color-bg)',
      }}
    >
      <BackButton />
      <ResetButton
        worldId="believe"
        itemId={INVENTORY_ITEMS.believe.id}
        onReset={handleReset}
      />

      {/* Phase progress */}
      {phaseIndex >= 0 && (
        <div className="tw:flex tw:justify-center tw:gap-2 tw:mb-6 tw:pt-2">
          {PHASES.map((p, i) => (
            <div
              key={p}
              className="tw:rounded-full tw:transition-all tw:duration-300"
              style={{
                width: i <= phaseIndex ? 32 : 10,
                height: 10,
                backgroundColor:
                  i <= phaseIndex
                    ? 'var(--color-gold)'
                    : 'var(--color-bg-card)',
              }}
            />
          ))}
        </div>
      )}

      <Container className="tw:max-w-3xl">
        <ScreenReaderStatus message={statusMsg} />

        <AnimatePresence mode="wait" key={resetKey}>
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
