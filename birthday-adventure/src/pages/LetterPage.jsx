import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';

import { useProgress } from '../context/ProgressContext';
import Typewriter from '../components/common/Typewriter';

/* Deterministic petals */
function seeded(seed) {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}
const rng = seeded(314);
const PETALS = Array.from({ length: 15 }, (_, i) => ({
  id: i,
  left: rng() * 100,
  delay: rng() * 8,
  dur: 6 + rng() * 8,
  size: 10 + rng() * 14,
  emoji: ['\uD83C\uDF38', '\uD83C\uDF3A', '\uD83C\uDF39', '\u2728'][
    Math.floor(rng() * 4)
  ],
}));

// TODO: Move to src/data/letter.js with real content
const LETTER_CONTENT = {
  greeting: 'Mi amor,',
  paragraphs: [
    'Si est\u00E1s leyendo esto, significa que recorriste un mundo entero que constru\u00ED pensando en ti.',
    'Cada pregunta, cada pista, cada rinc\u00F3n de esta aventura tiene un pedacito de nosotros.',
    'Gracias por ser la persona que hace que cada d\u00EDa valga la pena. Gracias por tu risa, tu curiosidad, tu forma de ver el mundo.',
    'Este no es solo un regalo de cumplea\u00F1os. Es mi forma de decirte que el mejor cap\u00EDtulo de mi historia eres t\u00FA.',
  ],
  closing: 'Con todo mi amor,',
  signature: 'Rafael',
};

export default function LetterPage() {
  const navigate = useNavigate();
  const { dispatch } = useProgress();
  const [showFull, setShowFull] = useState(false);
  const [phase, setPhase] = useState('seal');
  const [sealBroken, setSealBroken] = useState(false);

  const handleBreakSeal = () => {
    setSealBroken(true);
    setTimeout(() => {
      setPhase('reading');
      dispatch({ type: 'OPEN_LETTER' });
    }, 1000);
  };

  const handleShowFull = () => {
    setShowFull(true);
  };

  const handleFinish = () => {
    dispatch({ type: 'FINISH_LETTER' });
    navigate('/epilogo');
  };

  return (
    <div
      className="tw:min-h-screen tw:py-12 tw:px-4 tw:relative tw:overflow-hidden"
      style={{
        background:
          'radial-gradient(ellipse at 50% 30%, rgba(180,120,80,0.1) 0%, transparent 50%), var(--color-bg-warm, #1a1520)',
      }}
    >
      {/* Falling petals */}
      {phase === 'reading' &&
        PETALS.map((p) => (
          <div
            key={p.id}
            style={{
              position: 'fixed',
              left: `${p.left}%`,
              top: '-20px',
              fontSize: `${p.size}px`,
              animation: `petalFall ${p.dur}s ${p.delay}s linear infinite`,
              pointerEvents: 'none',
              zIndex: 0,
              opacity: 0.6,
            }}
          >
            {p.emoji}
          </div>
        ))}

      <Container className="tw:max-w-2xl tw:relative tw:z-1">
        <AnimatePresence mode="wait">
          {phase === 'seal' && (
            <motion.div
              key="seal"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6 }}
              className="tw:text-center tw:mt-20"
            >
              {/* Envelope */}
              <motion.div className="tw:text-8xl tw:mb-6">
                {'\u2709\uFE0F'}
              </motion.div>

              {/* Wax seal */}
              <motion.button
                type="button"
                onClick={handleBreakSeal}
                animate={
                  sealBroken
                    ? {
                        scale: [1, 1.15, 0.8],
                        rotate: [0, 0, 15],
                        opacity: [1, 1, 0],
                      }
                    : { scale: [1, 1.05, 1] }
                }
                transition={
                  sealBroken
                    ? { duration: 0.8, ease: 'easeInOut' }
                    : { duration: 2, repeat: Infinity, ease: 'easeInOut' }
                }
                className="tw:relative tw:mx-auto tw:block tw:border-none tw:bg-transparent tw:cursor-pointer"
                style={{ outline: 'none' }}
                aria-label="Romper el sello"
              >
                <div
                  className="tw:w-20 tw:h-20 tw:rounded-full tw:flex tw:items-center tw:justify-center tw:mx-auto"
                  style={{
                    background:
                      'radial-gradient(circle, #c0392b 0%, #8b1a1a 70%, #5a1010 100%)',
                    boxShadow:
                      '0 4px 15px rgba(192,57,43,0.4), inset 0 -2px 6px rgba(0,0,0,0.3)',
                  }}
                >
                  <span
                    className="tw:text-2xl"
                    style={{ color: 'rgba(255,215,0,0.8)' }}
                  >
                    {'\u2764'}
                  </span>
                </div>
                {!sealBroken && (
                  <p
                    className="tw:mt-3 tw:text-sm"
                    style={{ color: 'var(--color-text-muted)' }}
                  >
                    Toca el sello para abrir
                  </p>
                )}
              </motion.button>
            </motion.div>
          )}

          {phase === 'reading' && (
            <motion.article
              key="letter"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
              className="tw:py-12 tw:px-6 tw:md:px-12 tw:rounded-xl tw:shadow-2xl tw:relative"
              style={{
                backgroundColor: '#fffef7',
                color: '#2c2417',
                fontFamily:
                  "'Caveat', 'Dancing Script', cursive, var(--font-display)",
                backgroundImage:
                  'radial-gradient(ellipse at 80% 20%, rgba(200,170,120,0.08) 0%, transparent 50%)',
              }}
            >
              {/* Paper texture lines */}
              {[20, 40, 60, 80].map((y) => (
                <div
                  key={y}
                  style={{
                    position: 'absolute',
                    left: '10%',
                    right: '10%',
                    top: `${y}%`,
                    height: '1px',
                    backgroundColor: 'rgba(180,160,130,0.12)',
                    pointerEvents: 'none',
                  }}
                />
              ))}

              <p className="tw:text-3xl tw:mb-6" style={{ color: '#5a3e28' }}>
                {LETTER_CONTENT.greeting}
              </p>

              {(showFull
                ? LETTER_CONTENT.paragraphs
                : LETTER_CONTENT.paragraphs.slice(0, 1)
              ).map((p, i) => (
                <motion.p
                  key={i}
                  initial={showFull ? false : { opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: showFull ? 0 : i * 1.5, duration: 0.6 }}
                  className="tw:text-xl tw:mb-5 tw:leading-relaxed"
                  style={{ color: '#3a2a1a' }}
                >
                  {i === 0 && !showFull ? (
                    <Typewriter text={p} speed={30} as="span" />
                  ) : (
                    p
                  )}
                </motion.p>
              ))}

              {!showFull && (
                <Button
                  variant="link"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleShowFull();
                  }}
                  className="tw:mt-4"
                  style={{ color: '#8b6914', textDecoration: 'none' }}
                >
                  Mostrar carta completa {'\u2193'}
                </Button>
              )}

              {showFull && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <p
                    className="tw:text-xl tw:mt-8 tw:mb-2"
                    style={{ color: '#5a3e28' }}
                  >
                    {LETTER_CONTENT.closing}
                  </p>
                  <p
                    className="tw:text-3xl tw:italic"
                    style={{ color: '#8b6914' }}
                  >
                    {LETTER_CONTENT.signature}
                  </p>

                  <div className="tw:text-center tw:mt-12">
                    <Button
                      size="lg"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleFinish();
                      }}
                      style={{
                        background:
                          'linear-gradient(135deg, #8b6914 0%, #c49b2a 100%)',
                        border: 'none',
                        color: '#fff',
                        fontFamily: 'var(--font-display)',
                        fontSize: '1.1rem',
                      }}
                    >
                      Continuar {'\u2192'}
                    </Button>
                  </div>
                </motion.div>
              )}
            </motion.article>
          )}
        </AnimatePresence>
      </Container>
    </div>
  );
}
