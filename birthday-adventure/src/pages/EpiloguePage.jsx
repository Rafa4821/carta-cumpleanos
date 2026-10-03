import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Container from 'react-bootstrap/Container';

import FloatingParticles from '../components/common/FloatingParticles';
import Typewriter from '../components/common/Typewriter';

/* Deterministic firework positions */
function seeded(seed) {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}
const rng = seeded(2025);
const FIREWORK_COLORS = [
  '#ffd700',
  '#ff6b6b',
  '#48dbfb',
  '#ff9ff3',
  '#55efc4',
  '#fd79a8',
];
const FIREWORKS = Array.from({ length: 8 }, (_, i) => ({
  id: i,
  x: 10 + rng() * 80,
  y: 10 + rng() * 40,
  delay: rng() * 4,
  color: FIREWORK_COLORS[Math.floor(rng() * FIREWORK_COLORS.length)],
  size: 60 + rng() * 60,
}));

const CREDITS = [
  { type: 'title', text: 'Feliz Cumplea\u00F1os' },
  { type: 'spacer' },
  { type: 'section', text: 'Los mundos' },
  {
    type: 'item',
    emoji: '\u2728',
    text: 'Mundo M\u00E1gico - donde la magia nos conecta',
  },
  {
    type: 'item',
    emoji: '\uD83C\uDFA9',
    text: 'El Sombrero - porque juntos somos un equipo',
  },
  {
    type: 'item',
    emoji: '\uD83C\uDFB5',
    text: 'Mundo Musical - las canciones que son nuestras',
  },
  {
    type: 'item',
    emoji: '\uD83D\uDCD6',
    text: 'La Biblioteca - cada p\u00E1gina un recuerdo',
  },
  {
    type: 'item',
    emoji: '\u26BD',
    text: 'Believe - porque siempre creemos',
  },
  { type: 'spacer' },
  { type: 'section', text: 'La investigaci\u00F3n' },
  {
    type: 'item',
    emoji: '\uD83D\uDD75\uFE0F',
    text: 'Descifraste el c\u00F3digo secreto',
  },
  { type: 'spacer' },
  { type: 'section', text: 'Creado con' },
  { type: 'item', emoji: '\u2764\uFE0F', text: 'Mucho amor' },
  { type: 'item', emoji: '\u2615', text: 'Bastante caf\u00E9' },
  {
    type: 'item',
    emoji: '\uD83C\uDFB6',
    text: 'La mejor banda sonora',
  },
  { type: 'spacer' },
  { type: 'section', text: 'Dirigida por' },
  { type: 'item', emoji: '\uD83D\uDC96', text: 'El amor' },
  { type: 'spacer' },
  { type: 'final', text: 'Gracias por recorrer esta aventura conmigo.' },
];

export default function EpiloguePage() {
  const [showCredits, setShowCredits] = useState(false);
  const [showFireworks, setShowFireworks] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowCredits(true), 3000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setShowFireworks(false), 12000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className="tw:min-h-screen tw:relative tw:overflow-hidden"
      style={{
        background:
          'radial-gradient(ellipse at 50% 30%, rgba(80,50,120,0.2) 0%, transparent 50%), var(--color-bg)',
      }}
    >
      <FloatingParticles count={20} />

      {/* Fireworks */}
      <AnimatePresence>
        {showFireworks &&
          FIREWORKS.map((fw) => (
            <motion.div
              key={fw.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 1, 1, 0] }}
              transition={{
                duration: 2,
                delay: fw.delay,
                repeat: 2,
                repeatDelay: 1.5,
              }}
              style={{
                position: 'fixed',
                left: `${fw.x}%`,
                top: `${fw.y}%`,
                width: `${fw.size}px`,
                height: `${fw.size}px`,
                pointerEvents: 'none',
                zIndex: 1,
              }}
            >
              {/* Burst particles */}
              {Array.from({ length: 8 }, (_, j) => {
                const angle = (j / 8) * 360;
                const rad = (angle * Math.PI) / 180;
                return (
                  <motion.div
                    key={j}
                    initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
                    animate={{
                      x: Math.cos(rad) * (fw.size / 2),
                      y: Math.sin(rad) * (fw.size / 2),
                      opacity: 0,
                      scale: 0.2,
                    }}
                    transition={{
                      duration: 1.2,
                      delay: fw.delay + 0.2,
                      repeat: 2,
                      repeatDelay: 2.5,
                    }}
                    style={{
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      width: '6px',
                      height: '6px',
                      borderRadius: '50%',
                      backgroundColor: fw.color,
                      boxShadow: `0 0 6px ${fw.color}`,
                    }}
                  />
                );
              })}
            </motion.div>
          ))}
      </AnimatePresence>

      {/* Hero text */}
      <div className="tw:flex tw:flex-col tw:items-center tw:justify-center tw:min-h-[60vh] tw:px-4 tw:relative tw:z-2">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.5, type: 'spring' }}
          className="tw:text-center"
        >
          <div className="tw:text-7xl tw:mb-6">{'\u2764\uFE0F'}</div>
          <h1
            className="tw:text-4xl tw:md:text-5xl tw:mb-4 shimmer-text"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Feliz cumplea&ntilde;os
          </h1>
          <Typewriter
            text="Esta aventura fue solo el comienzo..."
            speed={50}
            delay={1500}
            as="p"
            className="tw:text-lg"
            style={{
              color: 'var(--color-text-muted)',
              fontFamily: 'var(--font-display)',
            }}
          />
        </motion.div>
      </div>

      {/* Cinematic credits scroll */}
      {showCredits && (
        <Container className="tw:max-w-md tw:pb-20 tw:relative tw:z-2">
          {CREDITS.map((credit, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.4, duration: 0.6 }}
              className="tw:text-center tw:mb-3"
            >
              {credit.type === 'title' && (
                <h2
                  className="tw:text-2xl tw:mb-4"
                  style={{
                    fontFamily: 'var(--font-display)',
                    color: 'var(--color-gold)',
                  }}
                >
                  {credit.text}
                </h2>
              )}
              {credit.type === 'section' && (
                <p
                  className="tw:text-xs tw:uppercase tw:tracking-widest tw:mt-4 tw:mb-2"
                  style={{ color: 'var(--color-text-muted)' }}
                >
                  {credit.text}
                </p>
              )}
              {credit.type === 'item' && (
                <p className="tw:text-base tw:m-0" style={{ color: '#ddd' }}>
                  <span className="tw:mr-2">{credit.emoji}</span>
                  {credit.text}
                </p>
              )}
              {credit.type === 'spacer' && <div className="tw:h-4" />}
              {credit.type === 'final' && (
                <p
                  className="tw:text-lg tw:italic tw:mt-6"
                  style={{
                    fontFamily: 'var(--font-display)',
                    color: 'var(--color-gold)',
                  }}
                >
                  {credit.text}
                </p>
              )}
            </motion.div>
          ))}
        </Container>
      )}
    </div>
  );
}
