import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';

import { useProgress } from '../context/ProgressContext';

// TODO: Move to src/data/letter.js with real content
const LETTER_CONTENT = {
  greeting: 'Mi amor,',
  paragraphs: [
    'Si estás leyendo esto, significa que recorriste un mundo entero que construí pensando en ti.',
    'Cada pregunta, cada pista, cada rincón de esta aventura tiene un pedacito de nosotros.',
    'Gracias por ser la persona que hace que cada día valga la pena. Gracias por tu risa, tu curiosidad, tu forma de ver el mundo.',
    'Este no es solo un regalo de cumpleaños. Es mi forma de decirte que el mejor capítulo de mi historia eres tú.',
  ],
  closing: 'Con todo mi amor,',
  signature: 'Rafael',
};

export default function LetterPage() {
  const navigate = useNavigate();
  const { dispatch } = useProgress();
  const [showFull, setShowFull] = useState(false);
  const [phase, setPhase] = useState('envelope');

  const handleOpen = () => {
    setPhase('reading');
    dispatch({ type: 'OPEN_LETTER' });
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
      className="tw:min-h-screen tw:py-12 tw:px-4"
      style={{ backgroundColor: 'var(--color-bg-warm)' }}
    >
      <Container className="tw:max-w-2xl">
        <AnimatePresence mode="wait">
          {phase === 'envelope' && (
            <motion.div
              key="envelope"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6 }}
              className="tw:text-center tw:mt-20"
            >
              <div className="tw:text-8xl tw:mb-8">{'\u2709\uFE0F'}</div>
              <Button
                variant="outline-dark"
                size="lg"
                onClick={handleOpen}
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '1.2rem',
                }}
              >
                Abrir carta
              </Button>
            </motion.div>
          )}

          {phase === 'reading' && (
            <motion.article
              key="letter"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
              className="tw:py-12 tw:px-6 tw:md:px-12 tw:rounded-lg tw:shadow-lg"
              style={{
                backgroundColor: '#fffef7',
                color: 'var(--color-text-dark)',
                fontFamily: 'var(--font-display)',
              }}
            >
              <p className="tw:text-2xl tw:mb-6">{LETTER_CONTENT.greeting}</p>

              {(showFull
                ? LETTER_CONTENT.paragraphs
                : LETTER_CONTENT.paragraphs.slice(0, 1)
              ).map((p, i) => (
                <motion.p
                  key={i}
                  initial={showFull ? false : { opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: showFull ? 0 : i * 1.5, duration: 0.6 }}
                  className="tw:text-lg tw:mb-4 tw:leading-relaxed"
                >
                  {p}
                </motion.p>
              ))}

              {!showFull && (
                <Button
                  variant="link"
                  onClick={handleShowFull}
                  className="tw:mt-4"
                  style={{ color: 'var(--color-primary)' }}
                >
                  Mostrar carta completa
                </Button>
              )}

              {showFull && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <p className="tw:text-lg tw:mt-8 tw:mb-2">
                    {LETTER_CONTENT.closing}
                  </p>
                  <p
                    className="tw:text-2xl tw:italic"
                    style={{ fontFamily: 'var(--font-display)' }}
                  >
                    {LETTER_CONTENT.signature}
                  </p>

                  <div className="tw:text-center tw:mt-12">
                    <Button
                      variant="outline-dark"
                      size="lg"
                      onClick={handleFinish}
                      style={{ fontFamily: 'var(--font-display)' }}
                    >
                      Continuar
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
