import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';

import { useProgress } from '../../context/ProgressContext';
import { INVENTORY_ITEMS } from '../../data/inventory';
import { LIBRARY_PAGES } from '../../data/worlds/library';
import ScreenReaderStatus from '../../components/common/ScreenReaderStatus';
import BackButton from '../../components/common/BackButton';
import ResetButton from '../../components/common/ResetButton';
import CompletionCelebration from '../../components/common/CompletionCelebration';

export default function LibraryWorld() {
  const navigate = useNavigate();
  const { state, dispatch } = useProgress();
  const [pageIndex, setPageIndex] = useState(0);
  const [completed, setCompleted] = useState(
    state.worlds.library.status === 'completed',
  );
  const [statusMsg, setStatusMsg] = useState('');
  const [flipDir, setFlipDir] = useState(1);

  const handleReset = () => {
    setPageIndex(0);
    setCompleted(false);
    setStatusMsg('');
  };

  const page = LIBRARY_PAGES[pageIndex];
  const totalPages = LIBRARY_PAGES.length;
  const isLast = pageIndex === totalPages - 1;

  const goNext = () => {
    setFlipDir(1);
    if (isLast) {
      dispatch({
        type: 'COMPLETE_WORLD',
        worldId: 'library',
        itemId: INVENTORY_ITEMS.library.id,
      });
      setCompleted(true);
      setStatusMsg('Marcapáginas conseguido!');
    } else {
      setPageIndex((i) => i + 1);
    }
  };

  const goPrev = () => {
    if (pageIndex > 0) {
      setFlipDir(-1);
      setPageIndex((i) => i - 1);
    }
  };

  if (completed) {
    return (
      <div
        className="tw:min-h-screen tw:flex tw:items-center tw:justify-center tw:px-4 tw:relative"
        style={{ backgroundColor: 'var(--color-bg)' }}
      >
        <ResetButton
          worldId="library"
          itemId={INVENTORY_ITEMS.library.id}
          onReset={handleReset}
        />
        <Container className="tw:max-w-md tw:text-center">
          <CompletionCelebration
            icon={INVENTORY_ITEMS.library.icon}
            label={`${INVENTORY_ITEMS.library.label} conseguido!`}
          >
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
          </CompletionCelebration>
        </Container>
      </div>
    );
  }

  return (
    <div
      className="tw:min-h-screen tw:flex tw:items-center tw:justify-center tw:py-8 tw:px-4 tw:relative"
      style={{ backgroundColor: '#1a1a2e' }}
    >
      <BackButton />
      <ResetButton
        worldId="library"
        itemId={INVENTORY_ITEMS.library.id}
        onReset={handleReset}
      />
      <Container className="tw:max-w-lg">
        <ScreenReaderStatus message={statusMsg} />

        {/* Book frame with spine */}
        <div className="tw:flex tw:rounded-xl tw:shadow-2xl tw:overflow-hidden">
          {/* Book spine */}
          <div
            className="tw:w-4 tw:md:w-6 tw:flex-shrink-0"
            style={{
              background:
                'linear-gradient(90deg, #6c47a0 0%, #8b6bb5 50%, #6c47a0 100%)',
              boxShadow: 'inset -2px 0 6px rgba(0,0,0,0.3)',
            }}
          />

          {/* Page area */}
          <div
            className="tw:flex-1 tw:p-6 tw:md:p-10 tw:relative"
            style={{
              backgroundColor: '#f5f0e8',
              color: '#2d2640',
              minHeight: '60vh',
              display: 'flex',
              flexDirection: 'column',
              backgroundImage:
                'radial-gradient(ellipse at 90% 10%, rgba(180,150,100,0.08) 0%, transparent 50%), radial-gradient(ellipse at 10% 90%, rgba(140,120,80,0.06) 0%, transparent 50%)',
            }}
          >
            {/* Paper texture stain spots */}
            <div
              style={{
                position: 'absolute',
                top: '15%',
                right: '12%',
                width: '40px',
                height: '30px',
                borderRadius: '50%',
                backgroundColor: 'rgba(160,130,80,0.04)',
                pointerEvents: 'none',
              }}
            />
            <div
              style={{
                position: 'absolute',
                bottom: '20%',
                left: '8%',
                width: '50px',
                height: '35px',
                borderRadius: '50%',
                backgroundColor: 'rgba(140,110,60,0.03)',
                pointerEvents: 'none',
              }}
            />

            {/* Header */}
            <div className="tw:text-center tw:mb-6">
              <p
                className="tw:text-xs tw:m-0 tw:tracking-widest tw:uppercase"
                style={{ color: '#999' }}
              >
                Biblioteca de recuerdos
              </p>
              <div
                className="tw:mt-2 tw:mx-auto"
                style={{
                  width: '40px',
                  height: '1px',
                  backgroundColor: 'rgba(108,71,160,0.3)',
                }}
              />
            </div>

            {/* Page content with flip animation */}
            <div
              className="tw:flex-1 tw:flex tw:flex-col tw:justify-center"
              style={{ perspective: '800px' }}
            >
              <AnimatePresence mode="wait" custom={flipDir}>
                <motion.div
                  key={pageIndex}
                  custom={flipDir}
                  initial={(d) => ({
                    rotateY: (d || 1) * 90,
                    opacity: 0,
                    transformOrigin: d === -1 ? 'right center' : 'left center',
                  })}
                  animate={{ rotateY: 0, opacity: 1 }}
                  exit={(d) => ({
                    rotateY: (d || 1) * -90,
                    opacity: 0,
                    transformOrigin: d === -1 ? 'right center' : 'left center',
                  })}
                  transition={{ duration: 0.4, ease: 'easeInOut' }}
                  style={{ transformStyle: 'preserve-3d' }}
                >
                  {page.title && (
                    <h2
                      className="tw:text-lg tw:mb-4 tw:text-center"
                      style={{
                        fontFamily: 'var(--font-display)',
                        color: '#2d2640',
                      }}
                    >
                      {page.title}
                    </h2>
                  )}
                  <p
                    className="tw:text-base tw:leading-relaxed"
                    style={{
                      fontFamily: 'var(--font-display)',
                      fontStyle: page.type === 'fake' ? 'italic' : 'normal',
                      color: page.type === 'fake' ? '#888' : '#2d2640',
                    }}
                  >
                    {page.content}
                  </p>
                  {page.type === 'riddle' && page.hint && (
                    <p
                      className="tw:text-sm tw:mt-4"
                      style={{ color: '#6c47a0' }}
                    >
                      Pista: {page.hint}
                    </p>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Bookmark ribbon on current page */}
            <div
              style={{
                position: 'absolute',
                top: 0,
                right: '15%',
                width: '20px',
                height: '50px',
                background: 'linear-gradient(180deg, #c0392b 0%, #e74c3c 100%)',
                clipPath: 'polygon(0 0, 100% 0, 100% 85%, 50% 100%, 0 85%)',
                opacity: 0.7,
                pointerEvents: 'none',
              }}
            />

            {/* Navigation */}
            <div className="tw:flex tw:justify-between tw:items-center tw:mt-6">
              <Button
                variant="link"
                onClick={goPrev}
                disabled={pageIndex === 0}
                style={{
                  color: pageIndex === 0 ? '#ccc' : '#2d2640',
                  textDecoration: 'none',
                }}
                aria-label="P\u00E1gina anterior"
              >
                {'\u25C0'} Anterior
              </Button>
              <span className="tw:text-xs" style={{ color: '#888' }}>
                {pageIndex + 1} / {totalPages}
              </span>
              <Button
                variant="link"
                onClick={goNext}
                style={{ color: '#2d2640', textDecoration: 'none' }}
                aria-label={isLast ? 'Completar' : 'P\u00E1gina siguiente'}
              >
                {isLast ? 'Completar' : 'Siguiente'} {'\u25B6'}
              </Button>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
