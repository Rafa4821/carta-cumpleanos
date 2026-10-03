const PARTICLE_SHAPES = ['\u2728', '\u2B50', '\u2726', '\u2605', '\u00B7'];

/* Deterministic pseudo-random using a linear congruential generator seeded once. */
function seedRandom(seed) {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

/* Pre-build particle arrays at module level to avoid impure calls in render. */
const PARTICLE_CACHE = {};

function getParticles(count) {
  if (PARTICLE_CACHE[count]) return PARTICLE_CACHE[count];
  const rng = seedRandom(42 + count);
  const particles = Array.from({ length: count }, (_, i) => ({
    id: i,
    left: `${rng() * 100}%`,
    top: `${rng() * 100}%`,
    size: 4 + rng() * 8,
    delay: rng() * 8,
    duration: 6 + rng() * 8,
    shape: PARTICLE_SHAPES[Math.floor(rng() * PARTICLE_SHAPES.length)],
    opacity: 0.15 + rng() * 0.25,
  }));
  PARTICLE_CACHE[count] = particles;
  return particles;
}

export default function FloatingParticles({ count = 20, color = 'gold' }) {
  const particles = getParticles(count);

  return (
    <div
      className="tw:absolute tw:inset-0 tw:overflow-hidden tw:pointer-events-none"
      aria-hidden="true"
    >
      {particles.map((p) => (
        <span
          key={p.id}
          className="floating-particle"
          style={{
            position: 'absolute',
            left: p.left,
            top: p.top,
            fontSize: `${p.size}px`,
            color:
              color === 'gold'
                ? 'var(--color-gold)'
                : 'var(--color-text-muted)',
            opacity: p.opacity,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
          }}
        >
          {p.shape}
        </span>
      ))}
    </div>
  );
}
