import { useState, useRef, useCallback, useMemo } from 'react';
import { motion } from 'motion/react';
import Button from 'react-bootstrap/Button';

import { SPELL_ALTERNATIVE_SEQUENCE } from '../../data/worlds/magic';

/* Particle trail */
const MAX_PARTICLES = 30;
let particleId = 0;

function seedShuffle(arr, seed) {
  const copy = [...arr];
  let s = seed;
  const rng = () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

const THRESHOLD = 0.6;
const MAX_GESTURE_ATTEMPTS = 3;

/* Deterministic star positions for the SVG background */
function buildStars(count, seed) {
  let s = seed;
  const rng = () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
  return Array.from({ length: count }, (_, i) => ({
    cx: rng() * 400,
    cy: rng() * 300,
    r: 0.5 + rng() * 1.2,
    opacity: 0.2 + rng() * 0.5,
    id: i,
  }));
}

const BG_STARS = buildStars(30, 777);

function normalizePoints(raw, rect) {
  return raw.map((p) => ({
    x: ((p.x - rect.left) / rect.width) * 100,
    y: ((p.y - rect.top) / rect.height) * 100,
  }));
}

function scorePath(points) {
  if (points.length < 5) return 0;
  const dx = points[points.length - 1].x - points[0].x;
  const hasHorizontalSpan = Math.abs(dx) > 30;
  const hasVerticalVar =
    Math.max(...points.map((p) => p.y)) - Math.min(...points.map((p) => p.y)) >
    15;
  return hasHorizontalSpan && hasVerticalVar ? 0.75 : 0.3;
}

export default function SpellGesture({ onComplete }) {
  const svgRef = useRef(null);
  const [drawing, setDrawing] = useState(false);
  const [points, setPoints] = useState([]);
  const [attempts, setAttempts] = useState(0);
  const [showAlt, setShowAlt] = useState(false);
  const [altProgress, setAltProgress] = useState([]);
  const [result, setResult] = useState(null);
  const [particles, setParticles] = useState([]);

  const startDraw = useCallback((e) => {
    e.preventDefault();
    setDrawing(true);
    setPoints([]);
    setParticles([]);
    setResult(null);
  }, []);

  const moveDraw = useCallback(
    (e) => {
      if (!drawing) return;
      e.preventDefault();
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      setPoints((prev) => [...prev, { x: clientX, y: clientY }]);

      /* Spawn sparkle particle at SVG-normalized coords */
      const rect = svgRef.current?.getBoundingClientRect();
      if (rect) {
        const sx = ((clientX - rect.left) / rect.width) * 400;
        const sy = ((clientY - rect.top) / rect.height) * 300;
        const colors = ['#ffd700', '#b794f4', '#fff', '#f0c0ff'];
        setParticles((prev) =>
          [
            ...prev,
            {
              id: particleId++,
              sx,
              sy,
              size: 2 + (particleId % 5),
              color: colors[particleId % 4],
            },
          ].slice(-MAX_PARTICLES),
        );
      }
    },
    [drawing],
  );

  const endDraw = useCallback(() => {
    if (!drawing) return;
    setDrawing(false);

    const rect = svgRef.current?.getBoundingClientRect();
    if (!rect || points.length < 3) return;

    const normalized = normalizePoints(points, rect);
    const score = scorePath(normalized);

    if (score >= THRESHOLD) {
      setResult('success');
      setTimeout(() => onComplete(), 800);
    } else {
      setAttempts((a) => a + 1);
      setResult('fail');
      if (attempts + 1 >= MAX_GESTURE_ATTEMPTS) {
        setShowAlt(true);
      }
    }
  }, [drawing, points, attempts, onComplete]);

  const handleAltClick = (symbol) => {
    const next = [...altProgress, symbol];
    setAltProgress(next);

    if (next.length === SPELL_ALTERNATIVE_SEQUENCE.length) {
      const correct = next.every((s, i) => s === SPELL_ALTERNATIVE_SEQUENCE[i]);
      if (correct) {
        onComplete();
      } else {
        setAltProgress([]);
      }
    }
  };

  const shuffledSymbols = useMemo(
    () => seedShuffle(SPELL_ALTERNATIVE_SEQUENCE, 99),
    [],
  );

  if (showAlt) {
    return (
      <div className="tw:text-center tw:max-w-sm tw:mx-auto">
        <p style={{ color: 'var(--color-text)' }} className="tw:mb-4">
          Completa la secuencia de runas:
        </p>
        <p className="tw:text-2xl tw:mb-4">
          {SPELL_ALTERNATIVE_SEQUENCE.map((s, i) => (
            <span
              key={i}
              style={{
                opacity: altProgress[i] ? 1 : 0.3,
                margin: '0 4px',
              }}
            >
              {altProgress[i] || '\u25CB'}
            </span>
          ))}
        </p>
        <div className="tw:flex tw:justify-center tw:gap-3 tw:flex-wrap">
          {shuffledSymbols.map((symbol, i) => (
            <Button
              key={i}
              variant="outline-light"
              className="tw:text-2xl tw:w-14 tw:h-14"
              onClick={() => handleAltClick(symbol)}
            >
              {symbol}
            </Button>
          ))}
        </div>
      </div>
    );
  }

  const pathD =
    points.length > 1
      ? `M ${points.map((p) => `${p.x},${p.y}`).join(' L ')}`
      : '';

  return (
    <div className="tw:max-w-md tw:mx-auto">
      <div className="tw:relative tw:rounded-xl tw:overflow-hidden">
        {/* Decorative corner runes */}
        {[
          { top: 8, left: 8 },
          { top: 8, right: 8 },
          { bottom: 8, left: 8 },
          { bottom: 8, right: 8 },
        ].map((pos, i) => (
          <span
            key={i}
            style={{
              position: 'absolute',
              ...pos,
              fontSize: '1.2em',
              color: 'rgba(160,140,220,0.25)',
              zIndex: 2,
              pointerEvents: 'none',
            }}
          >
            {['\u16A0', '\u16B1', '\u16C1', '\u16D2'][i]}
          </span>
        ))}

        <svg
          ref={svgRef}
          viewBox="0 0 400 300"
          className="tw:w-full tw:cursor-crosshair"
          style={{
            aspectRatio: '4/3',
            touchAction: 'none',
          }}
          onPointerDown={startDraw}
          onPointerMove={moveDraw}
          onPointerUp={endDraw}
          onPointerLeave={endDraw}
        >
          {/* Background gradient */}
          <defs>
            <radialGradient id="mglow" cx="50%" cy="40%">
              <stop offset="0%" stopColor="rgba(100,70,180,0.15)" />
              <stop offset="100%" stopColor="rgba(15,5,32,0)" />
            </radialGradient>
            {result === 'success' && (
              <filter id="goldglow">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            )}
          </defs>
          <rect width="400" height="300" fill="#0f0520" />
          <rect width="400" height="300" fill="url(#mglow)" />

          {/* Stars */}
          {BG_STARS.map((star) => (
            <circle
              key={star.id}
              cx={star.cx}
              cy={star.cy}
              r={star.r}
              fill={`rgba(200,200,255,${star.opacity})`}
            />
          ))}

          {/* Guide text */}
          {!drawing && points.length === 0 && !result && (
            <text
              x="200"
              y="150"
              textAnchor="middle"
              fill="rgba(160,140,220,0.3)"
              fontSize="14"
              fontFamily="var(--font-display)"
            >
              Traza tu hechizo aqui
            </text>
          )}

          {/* Sparkle particle trail */}
          {particles.map((p, i) => {
            const age = (i + 1) / particles.length;
            return (
              <circle
                key={p.id}
                cx={p.sx}
                cy={p.sy}
                r={p.size * age}
                fill={p.color}
                opacity={age * 0.7}
              />
            );
          })}

          {/* Drawing trace */}
          {pathD && (
            <path
              d={pathD}
              fill="none"
              stroke={result === 'success' ? '#ffd700' : '#b794f4'}
              strokeWidth={result === 'success' ? 4 : 3}
              strokeLinecap="round"
              strokeLinejoin="round"
              filter={result === 'success' ? 'url(#goldglow)' : undefined}
              opacity={result === 'fail' ? 0.4 : 1}
            />
          )}
        </svg>
      </div>

      <div className="tw:text-center tw:mt-4">
        {result === 'fail' && (
          <p style={{ color: 'var(--color-accent)' }} className="tw:text-sm">
            Intenta de nuevo. Traza un movimiento amplio y fluido. (
            {MAX_GESTURE_ATTEMPTS - attempts} intentos restantes)
          </p>
        )}
        {result === 'success' && (
          <motion.p
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="tw:text-lg"
            style={{
              color: 'var(--color-gold)',
              fontFamily: 'var(--font-display)',
            }}
          >
            {'\u2728'} Hechizo completado! {'\u2728'}
          </motion.p>
        )}
        {!result && (
          <p
            style={{ color: 'var(--color-text-muted)' }}
            className="tw:text-sm"
          >
            Arrastra sobre el lienzo para trazar la runa
          </p>
        )}
      </div>
    </div>
  );
}
