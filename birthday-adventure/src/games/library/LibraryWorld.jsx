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

export default function LibraryWorld() {
  const navigate = useNavigate();
  const { state, dispatch } = useProgress();
  const [pageIndex, setPageIndex] = useState(0);
  const [completed, setCompleted] = useState(
    state.worlds.library.status === 'completed',
  );
  const [statusMsg, setStatusMsg] = useState('');

  const page = LIBRARY_PAGES[pageIndex];
  const totalPages = LIBRARY_PAGES.length;
  const isLast = pageIndex === totalPages - 1;

  const goNext = () => {
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
    if (pageIndex > 0) setPageIndex((i) => i - 1);
  };

  if (completed) {
    return (
      <div
        className="tw:min-h-screen tw:flex tw:items-center tw:justify-center tw:px-4"
        style={{ backgroundColor: 'var(--color-bg)' }}
      >
        <Container className="tw:max-w-md tw:text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <div className="tw:text-6xl tw:mb-4">
              {INVENTORY_ITEMS.library.icon}
            </div>
            <h2
              className="tw:text-3xl tw:mb-4"
              style={{
                fontFamily: 'var(--font-display)',
                color: 'var(--color-gold)',
              }}
            >
              {INVENTORY_ITEMS.library.label} conseguido!
            </h2>
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
      className="tw:min-h-screen tw:flex tw:items-center tw:justify-center tw:py-8 tw:px-4 tw:relative"
      style={{ backgroundColor: '#1a1a2e' }}
    >
      <BackButton />
      <Container className="tw:max-w-lg">
        <ScreenReaderStatus message={statusMsg} />

        {/* E-ink reader frame */}
        <div
          className="tw:rounded-xl tw:p-6 tw:md:p-10 tw:shadow-2xl"
          style={{
            backgroundColor: '#f5f0e8',
            color: '#2d2640',
            minHeight: '60vh',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {/* Header */}
          <div className="tw:text-center tw:mb-6">
            <p className="tw:text-xs tw:m-0" style={{ color: '#888' }}>
              Biblioteca de recuerdos
            </p>
          </div>

          {/* Page content */}
          <div className="tw:flex-1 tw:flex tw:flex-col tw:justify-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={pageIndex}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.32 }}
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

          {/* Navigation */}
          <div className="tw:flex tw:justify-between tw:items-center tw:mt-6">
            <Button
              variant="link"
              onClick={goPrev}
              disabled={pageIndex === 0}
              style={{ color: '#2d2640', textDecoration: 'none' }}
              aria-label="Página anterior"
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
              aria-label={isLast ? 'Completar' : 'Página siguiente'}
            >
              {isLast ? 'Completar' : 'Siguiente'} {'\u25B6'}
            </Button>
          </div>
        </div>
      </Container>
    </div>
  );
}
