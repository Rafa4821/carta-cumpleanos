import { motion } from 'motion/react';

/* Deterministic burst particles */
function seeded(seed) {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}
const rng = seeded(2025);
const BURST_PARTICLES = Array.from({ length: 16 }, (_, i) => {
  const angle = (i / 16) * 360;
  const rad = (angle * Math.PI) / 180;
  const dist = 60 + rng() * 80;
  return {
    id: i,
    x: Math.cos(rad) * dist,
    y: Math.sin(rad) * dist,
    color: ['#ffd700', '#ff6b6b', '#48dbfb', '#ff9ff3', '#55efc4', '#f0c0ff'][
      Math.floor(rng() * 6)
    ],
    size: 4 + rng() * 6,
    delay: rng() * 0.3,
  };
});

/**
 * Animated celebration overlay for world completion.
 * Shows the item icon with a golden burst + particles.
 */
export default function CompletionCelebration({ icon, label, children }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="tw:text-center tw:relative"
    >
      {/* Golden burst ring */}
      <div className="tw:relative tw:inline-block tw:mb-4">
        <motion.div
          initial={{ scale: 0, opacity: 0.8 }}
          animate={{ scale: 2.5, opacity: 0 }}
          transition={{ duration: 1, ease: 'easeOut' }}
          className="tw:absolute tw:inset-0 tw:rounded-full"
          style={{
            background:
              'radial-gradient(circle, rgba(255,215,0,0.4) 0%, transparent 70%)',
          }}
        />

        {/* Burst particles */}
        {BURST_PARTICLES.map((p) => (
          <motion.div
            key={p.id}
            initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
            animate={{ x: p.x, y: p.y, opacity: 0, scale: 0.3 }}
            transition={{ duration: 1, delay: p.delay, ease: 'easeOut' }}
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              width: `${p.size}px`,
              height: `${p.size}px`,
              borderRadius: '50%',
              backgroundColor: p.color,
              pointerEvents: 'none',
              boxShadow: `0 0 4px ${p.color}`,
            }}
          />
        ))}

        {/* Icon */}
        <motion.div
          initial={{ scale: 0.3, rotate: -20 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ duration: 0.6, type: 'spring', stiffness: 150 }}
          className="tw:text-6xl tw:relative"
        >
          {icon}
        </motion.div>
      </div>

      {/* Label */}
      <motion.h2
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="tw:text-3xl tw:mb-4 shimmer-text"
        style={{ fontFamily: 'var(--font-display)' }}
      >
        {label}
      </motion.h2>

      {/* Extra content */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
      >
        {children}
      </motion.div>
    </motion.div>
  );
}
