import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';

import { useProgress } from '../context/ProgressContext';
import InventoryBar from '../components/inventory/InventoryBar';
import AudioControls from '../components/audio/AudioControls';
import FloatingParticles from '../components/common/FloatingParticles';
import { WORLD_ORDER, WORLD_PATHS, WORLD_LABELS } from '../data/gameConfig';
import {
  canAccessSortingHat,
  canAccessOpenWorlds,
  hasCompletedAllWorlds,
  getCompletedWorldCount,
} from '../lib/progressionRules';

const WORLD_ICONS = {
  magic: '\u2728',
  sortingHat: '\uD83C\uDFA9',
  music: '\uD83C\uDFB5',
  library: '\uD83D\uDCD6',
  believe: '\u26BD',
};

const WORLD_COLORS = {
  magic: '#7c3aed',
  sortingHat: '#a855f7',
  music: '#ec4899',
  library: '#6366f1',
  believe: '#14b8a6',
};

const WORLD_DESCRIPTIONS = {
  magic: 'Encuentra objetos m\u00E1gicos y traza hechizos',
  sortingHat: 'Descubre su arquetipo de pareja',
  music: 'Adivina las canciones que los definen',
  library: 'Recorre las p\u00E1ginas de recuerdos',
  believe: 'Trivia, penales y el vestuario',
};

function getWorldStatus(state, worldId) {
  const world = state.worlds[worldId];
  if (world.status === 'completed') return 'completed';
  if (world.status === 'in_progress') return 'in_progress';

  if (worldId === 'magic') return 'available';
  if (worldId === 'sortingHat')
    return canAccessSortingHat(state) ? 'available' : 'locked';
  if (['music', 'library', 'believe'].includes(worldId)) {
    return canAccessOpenWorlds(state) ? 'available' : 'locked';
  }
  return 'locked';
}

export default function AdventureHubPage() {
  const { state } = useProgress();
  const navigate = useNavigate();
  const allDone = hasCompletedAllWorlds(state);
  const completedCount = getCompletedWorldCount(state);

  return (
    <div
      className="tw:min-h-screen tw:py-8 tw:px-4 tw:relative tw:overflow-hidden"
      style={{
        background:
          'radial-gradient(ellipse at 20% 0%, rgba(124,58,237,0.15) 0%, transparent 50%), radial-gradient(ellipse at 80% 100%, rgba(236,72,153,0.1) 0%, transparent 50%), var(--color-bg)',
      }}
    >
      <FloatingParticles count={15} />

      <Container className="tw:max-w-lg tw:relative tw:z-1">
        <div className="tw:flex tw:justify-between tw:items-center tw:mb-6">
          <div>
            <h1
              className="tw:text-2xl tw:md:text-3xl tw:m-0 shimmer-text"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Tu aventura
            </h1>
            <p
              className="tw:text-sm tw:m-0 tw:mt-1"
              style={{ color: 'var(--color-text-muted)' }}
            >
              {completedCount} / {WORLD_ORDER.length} mundos completados
            </p>
          </div>
          <AudioControls />
        </div>

        {/* Progress bar */}
        <div
          className="tw:rounded-full tw:h-2 tw:mb-6 tw:overflow-hidden"
          style={{ backgroundColor: 'var(--color-bg-card)' }}
        >
          <motion.div
            className="tw:h-full tw:rounded-full"
            style={{
              background:
                'linear-gradient(90deg, var(--color-primary-light), var(--color-gold))',
            }}
            initial={{ width: 0 }}
            animate={{
              width: `${(completedCount / WORLD_ORDER.length) * 100}%`,
            }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          />
        </div>

        <InventoryBar />

        {/* Journey path */}
        <div className="tw:mt-6 tw:relative">
          {/* Connecting path line */}
          <div
            className="tw:absolute tw:left-1/2 tw:top-0 tw:bottom-0 tw:hidden tw:md:block"
            style={{
              width: '2px',
              background:
                'repeating-linear-gradient(180deg, rgba(255,215,0,0.15) 0px, rgba(255,215,0,0.15) 8px, transparent 8px, transparent 16px)',
              transform: 'translateX(-50%)',
              zIndex: 0,
            }}
          />

          {WORLD_ORDER.map((worldId, i) => {
            const status = getWorldStatus(state, worldId);
            const isLocked = status === 'locked';
            const color = WORLD_COLORS[worldId];
            const isEven = i % 2 === 0;

            return (
              <motion.div
                key={worldId}
                initial={{ opacity: 0, x: isEven ? -30 : 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.12, duration: 0.5 }}
                className="tw:relative tw:mb-4"
                style={{ zIndex: 1 }}
              >
                {/* Connector dot on the center line (desktop) */}
                <div
                  className="tw:hidden tw:md:block tw:absolute tw:top-1/2 tw:left-1/2"
                  style={{
                    width: '12px',
                    height: '12px',
                    borderRadius: '50%',
                    backgroundColor:
                      status === 'completed'
                        ? 'var(--color-success)'
                        : status === 'available' || status === 'in_progress'
                          ? 'var(--color-gold)'
                          : 'rgba(255,255,255,0.15)',
                    transform: 'translate(-50%, -50%)',
                    boxShadow:
                      status === 'completed'
                        ? '0 0 8px rgba(46,204,113,0.4)'
                        : 'none',
                    zIndex: 2,
                  }}
                />

                <button
                  type="button"
                  disabled={isLocked}
                  onClick={() => navigate(WORLD_PATHS[worldId])}
                  className="tw:w-full tw:rounded-xl tw:p-4 tw:text-left tw:relative tw:overflow-hidden tw:transition-all tw:duration-200"
                  style={{
                    border:
                      status === 'completed'
                        ? '2px solid var(--color-success)'
                        : status === 'in_progress'
                          ? '2px solid var(--color-gold)'
                          : status === 'available'
                            ? `2px solid ${color}`
                            : '2px solid rgba(255,255,255,0.08)',
                    backgroundColor: 'var(--color-bg-card)',
                    color: 'var(--color-text)',
                    cursor: isLocked ? 'not-allowed' : 'pointer',
                    opacity: isLocked ? 0.4 : 1,
                  }}
                  aria-label={`${WORLD_LABELS[worldId]} - ${
                    status === 'completed'
                      ? 'completado'
                      : status === 'locked'
                        ? 'bloqueado'
                        : 'disponible'
                  }`}
                >
                  {/* Glow */}
                  {!isLocked && status !== 'completed' && (
                    <div
                      style={{
                        position: 'absolute',
                        inset: 0,
                        background: `radial-gradient(circle at 30% 50%, ${color}12 0%, transparent 60%)`,
                        pointerEvents: 'none',
                      }}
                    />
                  )}

                  <div className="tw:flex tw:items-center tw:gap-4 tw:relative">
                    {/* Icon circle */}
                    <div
                      className="tw:w-14 tw:h-14 tw:rounded-full tw:flex tw:items-center tw:justify-center tw:flex-shrink-0"
                      style={{
                        background:
                          status === 'completed'
                            ? 'rgba(46,204,113,0.15)'
                            : `${color}20`,
                        border:
                          status === 'completed'
                            ? '2px solid rgba(46,204,113,0.3)'
                            : `2px solid ${color}40`,
                      }}
                    >
                      <span className="tw:text-2xl">
                        {WORLD_ICONS[worldId]}
                      </span>
                    </div>

                    <div className="tw:flex-1 tw:min-w-0">
                      <div
                        className="tw:text-base tw:font-semibold tw:mb-0.5"
                        style={{ fontFamily: 'var(--font-display)' }}
                      >
                        {WORLD_LABELS[worldId]}
                      </div>
                      <p
                        className="tw:text-xs tw:m-0 tw:leading-snug"
                        style={{ color: 'var(--color-text-muted)' }}
                      >
                        {WORLD_DESCRIPTIONS[worldId]}
                      </p>
                    </div>

                    {/* Status badge */}
                    <div
                      className="tw:text-xs tw:px-2 tw:py-1 tw:rounded-full tw:font-medium tw:flex-shrink-0"
                      style={{
                        backgroundColor:
                          status === 'completed'
                            ? 'rgba(46,204,113,0.15)'
                            : status === 'in_progress'
                              ? 'rgba(255,215,0,0.15)'
                              : status === 'available'
                                ? `${color}15`
                                : 'rgba(255,255,255,0.05)',
                        color:
                          status === 'completed'
                            ? 'var(--color-success)'
                            : status === 'in_progress'
                              ? 'var(--color-gold)'
                              : status === 'available'
                                ? color
                                : 'var(--color-text-muted)',
                      }}
                    >
                      {status === 'completed' && '\u2714'}
                      {status === 'in_progress' && '\u25B6'}
                      {status === 'available' && '\u2192'}
                      {status === 'locked' && '\uD83D\uDD12'}
                    </div>
                  </div>
                </button>
              </motion.div>
            );
          })}
        </div>

        {allDone && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="tw:text-center tw:mt-8"
          >
            <p
              className="tw:text-xl tw:mb-4 shimmer-text"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              {'\u00A1'}Has reunido todos los objetos!
            </p>
            <Button
              size="lg"
              onClick={() => navigate('/busqueda-fisica')}
              className="tw:px-8"
              style={{
                background:
                  'linear-gradient(135deg, var(--color-gold) 0%, #ff9f43 100%)',
                border: 'none',
                color: '#000',
                fontFamily: 'var(--font-display)',
                fontWeight: 'bold',
              }}
            >
              Continuar la aventura {'\u2192'}
            </Button>
          </motion.div>
        )}
      </Container>
    </div>
  );
}
