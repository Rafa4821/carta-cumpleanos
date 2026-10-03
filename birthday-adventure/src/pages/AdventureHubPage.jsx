import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

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

      <Container className="tw:relative tw:z-1">
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

        <Row className="tw:mt-6 tw:g-4">
          {WORLD_ORDER.map((worldId, i) => {
            const status = getWorldStatus(state, worldId);
            const isLocked = status === 'locked';
            const color = WORLD_COLORS[worldId];

            return (
              <Col key={worldId} xs={6} md={4} lg={true}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <button
                    type="button"
                    disabled={isLocked}
                    onClick={() => navigate(WORLD_PATHS[worldId])}
                    className="world-card tw:w-full tw:rounded-xl tw:p-5 tw:text-center tw:relative tw:overflow-hidden"
                    style={{
                      border:
                        status === 'completed'
                          ? '2px solid var(--color-success)'
                          : status === 'in_progress'
                            ? '2px solid var(--color-gold)'
                            : status === 'available'
                              ? `2px solid ${color}`
                              : '2px solid rgba(255,255,255,0.1)',
                      backgroundColor: 'var(--color-bg-card)',
                      color: 'var(--color-text)',
                      cursor: isLocked ? 'not-allowed' : 'pointer',
                      opacity: isLocked ? 0.45 : 1,
                    }}
                    aria-label={`${WORLD_LABELS[worldId]} - ${
                      status === 'completed'
                        ? 'completado'
                        : status === 'locked'
                          ? 'bloqueado'
                          : 'disponible'
                    }`}
                  >
                    {/* Glow effect for available/in_progress */}
                    {!isLocked && status !== 'completed' && (
                      <div
                        style={{
                          position: 'absolute',
                          inset: 0,
                          background: `radial-gradient(circle at 50% 30%, ${color}15 0%, transparent 70%)`,
                          pointerEvents: 'none',
                        }}
                      />
                    )}

                    <div className="tw:text-4xl tw:mb-3 tw:relative">
                      {WORLD_ICONS[worldId]}
                    </div>
                    <div
                      className="tw:text-base tw:font-semibold tw:relative"
                      style={{ fontFamily: 'var(--font-display)' }}
                    >
                      {WORLD_LABELS[worldId]}
                    </div>
                    <div
                      className="tw:text-xs tw:mt-2 tw:relative tw:font-medium"
                      style={{
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
                      {status === 'completed' && '\u2714 Completado'}
                      {status === 'in_progress' && '\u25B6 En progreso'}
                      {status === 'available' && '\u2022 Disponible'}
                      {status === 'locked' && '\uD83D\uDD12 Bloqueado'}
                    </div>
                  </button>
                </motion.div>
              </Col>
            );
          })}
        </Row>

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
              variant="outline-light"
              size="lg"
              onClick={() => navigate('/busqueda-fisica')}
              className="tw:px-8"
              style={{
                borderColor: 'var(--color-gold)',
                color: 'var(--color-gold)',
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
