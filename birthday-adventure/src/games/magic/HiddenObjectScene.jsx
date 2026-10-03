import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

import { SCENE_DECORATIONS } from '../../data/worlds/magic';
import HintButton from '../../components/common/HintButton';

/* Deterministic pseudo-random to place visual elements without Math.random in render */
function seeded(seed) {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

const rng = seeded(123);
const DUST_MOTES = Array.from({ length: 12 }, (_, i) => ({
  id: i,
  left: `${rng() * 90 + 5}%`,
  top: `${rng() * 80 + 5}%`,
  size: 2 + rng() * 3,
  delay: rng() * 6,
  dur: 4 + rng() * 5,
}));

const RUNES = [
  '\u16A0',
  '\u16A2',
  '\u16A8',
  '\u16B1',
  '\u16B7',
  '\u16C1',
  '\u16C7',
  '\u16D2',
];
const FLOATING_RUNES = Array.from({ length: 6 }, (_, i) => ({
  id: i,
  left: `${rng() * 80 + 10}%`,
  top: `${rng() * 60 + 15}%`,
  rune: RUNES[Math.floor(rng() * RUNES.length)],
  delay: rng() * 5,
  dur: 8 + rng() * 6,
}));

export default function HiddenObjectScene({ objects, onComplete }) {
  const [found, setFound] = useState([]);
  const [attempts, setAttempts] = useState(0);
  const [sparkle, setSparkle] = useState(null);

  const handleClick = (id) => {
    if (found.includes(id)) return;
    const obj = objects.find((o) => o.id === id);
    setSparkle({ x: obj.x, y: obj.y });
    const next = [...found, id];
    setFound(next);
    if (next.length === objects.length) {
      setTimeout(() => onComplete(), 1200);
    }
  };

  const handleMiss = () => {
    setAttempts((a) => a + 1);
  };

  return (
    <div>
      {/* Object list to search for */}
      <div
        className="tw:flex tw:flex-wrap tw:justify-center tw:gap-2 tw:mb-4 tw:px-2"
        role="list"
        aria-label="Objetos a encontrar"
      >
        {objects.map((obj) => {
          const isFound = found.includes(obj.id);
          return (
            <div
              key={obj.id}
              role="listitem"
              className="tw:flex tw:items-center tw:gap-1.5 tw:px-3 tw:py-1.5 tw:rounded-full tw:text-sm tw:transition-all tw:duration-300"
              style={{
                backgroundColor: isFound
                  ? 'rgba(255,215,0,0.2)'
                  : 'rgba(255,255,255,0.05)',
                border: isFound
                  ? '1px solid rgba(255,215,0,0.4)'
                  : '1px solid rgba(255,255,255,0.08)',
                opacity: isFound ? 0.6 : 1,
                textDecoration: isFound ? 'line-through' : 'none',
                color: isFound
                  ? 'var(--color-gold)'
                  : 'var(--color-text-muted)',
              }}
            >
              <span>{obj.emoji}</span>
              <span>{obj.label}</span>
              {isFound && (
                <span style={{ marginLeft: 2, fontSize: '0.7em' }}>
                  {'\u2714'}
                </span>
              )}
            </div>
          );
        })}
      </div>

      {/* Scene */}
      <div
        className="game-scene tw:rounded-xl tw:overflow-hidden tw:select-none"
        style={{ backgroundColor: 'var(--color-bg-card)', cursor: 'crosshair' }}
        onClick={handleMiss}
        role="img"
        aria-label="Escena de estudio magico. Busca los objetos escondidos."
      >
        {/* Deep background - stone walls */}
        <div
          className="game-scene__background"
          style={{
            background: `
              radial-gradient(ellipse at 48% 15%, rgba(100,130,200,0.12) 0%, transparent 40%),
              radial-gradient(ellipse at 50% 0%, rgba(75,40,130,0.5) 0%, transparent 55%),
              radial-gradient(ellipse at 20% 80%, rgba(20,60,80,0.4) 0%, transparent 45%),
              radial-gradient(ellipse at 80% 70%, rgba(50,20,80,0.35) 0%, transparent 45%),
              linear-gradient(170deg, #0f0520 0%, #1a0a2e 20%, #2d1b4e 45%, #1a2a3a 70%, #0f1a2a 100%)
            `,
          }}
        />

        {/* Stone wall texture lines */}
        {[20, 40, 60, 80].map((y) => (
          <div
            key={`wall-${y}`}
            style={{
              position: 'absolute',
              top: `${y}%`,
              left: 0,
              right: 0,
              height: '1px',
              background:
                'linear-gradient(90deg, transparent 0%, rgba(80,60,40,0.08) 20%, rgba(80,60,40,0.12) 50%, rgba(80,60,40,0.08) 80%, transparent 100%)',
              pointerEvents: 'none',
            }}
          />
        ))}

        {/* Bookshelf - left wall */}
        <div
          style={{
            position: 'absolute',
            top: '2%',
            left: '2%',
            width: '22%',
            height: '40%',
            borderRadius: '4px',
            background:
              'linear-gradient(180deg, rgba(80,40,15,0.4) 0%, rgba(60,30,10,0.3) 100%)',
            border: '1px solid rgba(139,90,43,0.2)',
            pointerEvents: 'none',
          }}
        >
          {/* Shelf lines */}
          {[25, 50, 75].map((p) => (
            <div
              key={`shelf-${p}`}
              style={{
                position: 'absolute',
                top: `${p}%`,
                left: '5%',
                right: '5%',
                height: '2px',
                background: 'rgba(139,90,43,0.3)',
              }}
            />
          ))}
          {/* Books on shelves */}
          <div
            style={{
              position: 'absolute',
              top: '5%',
              left: '10%',
              fontSize: '1.2em',
              opacity: 0.6,
              pointerEvents: 'none',
            }}
          >
            {'\uD83D\uDCD7\uD83D\uDCD8\uD83D\uDCD9\uD83D\uDCD5'}
          </div>
          <div
            style={{
              position: 'absolute',
              top: '30%',
              left: '8%',
              fontSize: '1em',
              opacity: 0.5,
              pointerEvents: 'none',
            }}
          >
            {'\uD83D\uDCD3\uD83D\uDCD2\uD83D\uDCD5\uD83D\uDCD8'}
          </div>
          <div
            style={{
              position: 'absolute',
              top: '55%',
              left: '12%',
              fontSize: '1.1em',
              opacity: 0.55,
              pointerEvents: 'none',
            }}
          >
            {'\uD83D\uDCD9\uD83D\uDCD7\uD83D\uDCD2'}
          </div>
        </div>

        {/* Bookshelf - right wall */}
        <div
          style={{
            position: 'absolute',
            top: '2%',
            right: '2%',
            width: '20%',
            height: '35%',
            borderRadius: '4px',
            background:
              'linear-gradient(180deg, rgba(70,35,15,0.35) 0%, rgba(55,25,10,0.25) 100%)',
            border: '1px solid rgba(139,90,43,0.15)',
            pointerEvents: 'none',
          }}
        >
          {[33, 66].map((p) => (
            <div
              key={`rshelf-${p}`}
              style={{
                position: 'absolute',
                top: `${p}%`,
                left: '5%',
                right: '5%',
                height: '2px',
                background: 'rgba(139,90,43,0.25)',
              }}
            />
          ))}
          <div
            style={{
              position: 'absolute',
              top: '8%',
              left: '10%',
              fontSize: '1em',
              opacity: 0.5,
              pointerEvents: 'none',
            }}
          >
            {'\uD83D\uDCD5\uD83D\uDCD7\uD83D\uDCD8'}
          </div>
          <div
            style={{
              position: 'absolute',
              top: '40%',
              left: '8%',
              fontSize: '0.9em',
              opacity: 0.45,
              pointerEvents: 'none',
            }}
          >
            {'\uD83D\uDCD9\uD83D\uDCD2'}
          </div>
        </div>

        {/* Arched window with moonlight */}
        <div
          style={{
            position: 'absolute',
            top: '3%',
            left: '38%',
            width: '24%',
            height: '38%',
            border: '2px solid rgba(139,90,43,0.25)',
            borderRadius: '60px 60px 0 0',
            background:
              'linear-gradient(180deg, rgba(120,140,200,0.15) 0%, rgba(60,80,140,0.08) 60%, rgba(40,50,100,0.05) 100%)',
            overflow: 'hidden',
            pointerEvents: 'none',
          }}
        >
          {/* Moon */}
          <div
            style={{
              position: 'absolute',
              top: '12%',
              left: '55%',
              width: '22%',
              aspectRatio: '1',
              borderRadius: '50%',
              background:
                'radial-gradient(circle, rgba(220,230,255,0.7) 0%, rgba(180,200,255,0.3) 60%, transparent 100%)',
              boxShadow: '0 0 15px rgba(180,200,255,0.3)',
            }}
          />
          {/* Window cross bars */}
          <div
            style={{
              position: 'absolute',
              top: '40%',
              left: 0,
              right: 0,
              height: '2px',
              background: 'rgba(139,90,43,0.3)',
            }}
          />
          <div
            style={{
              position: 'absolute',
              top: 0,
              bottom: 0,
              left: '50%',
              width: '2px',
              background: 'rgba(139,90,43,0.3)',
            }}
          />
        </div>

        {/* Moonbeam ray from window */}
        <div
          style={{
            position: 'absolute',
            top: '30%',
            left: '35%',
            width: '30%',
            height: '65%',
            background:
              'linear-gradient(180deg, rgba(120,140,200,0.06) 0%, rgba(100,120,180,0.03) 40%, transparent 100%)',
            clipPath: 'polygon(30% 0%, 70% 0%, 100% 100%, 0% 100%)',
            pointerEvents: 'none',
          }}
        />

        {/* Desk/table - bottom center */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: '8%',
            right: '8%',
            height: '22%',
            background:
              'linear-gradient(0deg, rgba(80,45,15,0.5) 0%, rgba(70,40,12,0.35) 60%, rgba(60,30,10,0.2) 85%, transparent 100%)',
            borderTop: '3px solid rgba(139,90,43,0.3)',
            borderRadius: '6px 6px 0 0',
            pointerEvents: 'none',
          }}
        >
          {/* Desk surface detail */}
          <div
            style={{
              position: 'absolute',
              top: '4px',
              left: '5%',
              right: '5%',
              height: '1px',
              background: 'rgba(180,120,60,0.15)',
            }}
          />
        </div>

        {/* Candles with flickering glow */}
        {[
          { x: 10, y: 12, s: 1.3 },
          { x: 90, y: 15, s: 1.2 },
          { x: 30, y: 82, s: 1 },
          { x: 75, y: 84, s: 1.1 },
        ].map((c, i) => (
          <div
            key={`candle-${i}`}
            style={{
              position: 'absolute',
              left: `${c.x}%`,
              top: `${c.y}%`,
              transform: 'translate(-50%, -50%)',
              pointerEvents: 'none',
              zIndex: 1,
            }}
          >
            <span
              style={{
                fontSize: `${c.s}em`,
                display: 'block',
                animation: `flicker ${1.5 + i * 0.3}s ease-in-out infinite alternate`,
              }}
            >
              {'\uD83D\uDD6F\uFE0F'}
            </span>
            {/* Candle glow */}
            <div
              style={{
                position: 'absolute',
                top: '-30%',
                left: '50%',
                transform: 'translateX(-50%)',
                width: `${40 * c.s}px`,
                height: `${40 * c.s}px`,
                borderRadius: '50%',
                background:
                  'radial-gradient(circle, rgba(255,180,50,0.15) 0%, transparent 70%)',
                animation: `flicker ${1.5 + i * 0.3}s ease-in-out infinite alternate`,
              }}
            />
          </div>
        ))}

        {/* Floating dust motes */}
        {DUST_MOTES.map((m) => (
          <div
            key={`dust-${m.id}`}
            className="floating-particle"
            style={{
              position: 'absolute',
              left: m.left,
              top: m.top,
              width: `${m.size}px`,
              height: `${m.size}px`,
              borderRadius: '50%',
              background: 'rgba(200,180,140,0.3)',
              pointerEvents: 'none',
              animationDelay: `${m.delay}s`,
              animationDuration: `${m.dur}s`,
            }}
          />
        ))}

        {/* Floating magical runes */}
        {FLOATING_RUNES.map((r) => (
          <div
            key={`rune-${r.id}`}
            className="floating-particle"
            style={{
              position: 'absolute',
              left: r.left,
              top: r.top,
              fontSize: '0.9em',
              color: 'rgba(160,140,220,0.2)',
              pointerEvents: 'none',
              animationDelay: `${r.delay}s`,
              animationDuration: `${r.dur}s`,
              textShadow: '0 0 6px rgba(160,140,220,0.15)',
            }}
          >
            {r.rune}
          </div>
        ))}

        {/* Decorative scene elements - atmosphere */}
        {SCENE_DECORATIONS.map((dec, i) => (
          <span
            key={`dec-${i}`}
            style={{
              position: 'absolute',
              left: `${dec.x}%`,
              top: `${dec.y}%`,
              transform: 'translate(-50%, -50%)',
              fontSize: dec.size,
              opacity: dec.opacity,
              pointerEvents: 'none',
              userSelect: 'none',
              filter: 'blur(0.3px)',
            }}
            aria-hidden="true"
          >
            {dec.emoji}
          </span>
        ))}

        {/* Actual hidden objects */}
        {objects.map((obj) => {
          const isFound = found.includes(obj.id);
          return (
            <button
              key={obj.id}
              type="button"
              className="hotspot"
              style={{
                '--x': obj.x,
                '--y': obj.y,
                background: 'transparent',
                border: 'none',
                borderRadius: '50%',
                width: `${obj.radius * 2}%`,
                height: `${obj.radius * 2}%`,
                zIndex: 3,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              onClick={(e) => {
                e.stopPropagation();
                handleClick(obj.id);
              }}
              aria-label={
                isFound ? `${obj.label} (encontrado)` : `Buscar en esta zona`
              }
              aria-pressed={isFound}
            >
              <span
                style={{
                  fontSize: isFound ? '2em' : '1.5em',
                  opacity: isFound ? 1 : 0.45,
                  filter: isFound
                    ? 'drop-shadow(0 0 8px rgba(255,215,0,0.6))'
                    : 'saturate(0.4) brightness(0.6)',
                  transition: 'all 0.4s ease',
                  pointerEvents: 'none',
                }}
              >
                {obj.emoji}
              </span>

              {/* Found burst */}
              {isFound && (
                <motion.div
                  initial={{ scale: 0, opacity: 0.8 }}
                  animate={{ scale: 2.5, opacity: 0 }}
                  transition={{ duration: 0.8, ease: 'easeOut' }}
                  style={{
                    position: 'absolute',
                    width: '100%',
                    height: '100%',
                    borderRadius: '50%',
                    background:
                      'radial-gradient(circle, rgba(255,215,0,0.5) 0%, rgba(255,180,50,0.2) 40%, transparent 70%)',
                    pointerEvents: 'none',
                  }}
                />
              )}

              {/* Found sparkle badge */}
              {isFound && (
                <motion.span
                  initial={{ scale: 0, rotate: -45 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.15, type: 'spring', stiffness: 300 }}
                  style={{
                    position: 'absolute',
                    bottom: '-2px',
                    right: '-2px',
                    fontSize: '0.8em',
                    filter: 'none',
                  }}
                >
                  {'\u2728'}
                </motion.span>
              )}

              {/* Hint pulse for unfound objects after misses */}
              {!isFound && attempts >= 4 && (
                <span
                  className="inventory-pulse"
                  style={{
                    position: 'absolute',
                    width: '130%',
                    height: '130%',
                    borderRadius: '50%',
                    border: '1px solid rgba(255,215,0,0.2)',
                    pointerEvents: 'none',
                  }}
                />
              )}
            </button>
          );
        })}

        {/* Sparkle burst on find */}
        <AnimatePresence>
          {sparkle && (
            <motion.div
              key={`sparkle-${sparkle.x}-${sparkle.y}`}
              initial={{ opacity: 1 }}
              animate={{ opacity: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1 }}
              onAnimationComplete={() => setSparkle(null)}
              style={{
                position: 'absolute',
                left: `${sparkle.x}%`,
                top: `${sparkle.y}%`,
                transform: 'translate(-50%, -50%)',
                pointerEvents: 'none',
                zIndex: 10,
              }}
            >
              {[0, 60, 120, 180, 240, 300].map((angle) => (
                <motion.span
                  key={angle}
                  initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
                  animate={{
                    x: Math.cos((angle * Math.PI) / 180) * 30,
                    y: Math.sin((angle * Math.PI) / 180) * 30,
                    opacity: 0,
                    scale: 0.3,
                  }}
                  transition={{ duration: 0.6, ease: 'easeOut' }}
                  style={{
                    position: 'absolute',
                    fontSize: '0.6em',
                    color: 'var(--color-gold)',
                  }}
                >
                  {'\u2726'}
                </motion.span>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Status bar */}
      <div className="tw:flex tw:justify-between tw:items-center tw:mt-4">
        <div className="tw:flex tw:items-center tw:gap-3">
          <p
            style={{ color: 'var(--color-text-muted)' }}
            className="tw:text-sm tw:m-0"
          >
            {found.length} / {objects.length} objetos
          </p>
          {/* Mini progress dots */}
          <div className="tw:flex tw:gap-1">
            {objects.map((obj) => (
              <div
                key={obj.id}
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  backgroundColor: found.includes(obj.id)
                    ? 'var(--color-gold)'
                    : 'rgba(255,255,255,0.15)',
                  transition: 'background-color 0.3s',
                }}
              />
            ))}
          </div>
        </div>
        <HintButton
          attempts={attempts}
          hints={objects
            .filter((o) => !found.includes(o.id))
            .map(
              (o) =>
                `Busca ${o.emoji} "${o.label}" - mira con cuidado por la escena...`,
            )}
        />
      </div>
    </div>
  );
}
