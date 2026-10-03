import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import Button from 'react-bootstrap/Button';

import FloatingParticles from '../components/common/FloatingParticles';

const STEPS = [
  { text: null, type: 'envelope' },
  { text: 'Parece que todav\u00EDa no puedes abrirla.', type: 'message' },
  {
    text: 'Hay cinco recuerdos dispersos entre historias, canciones, magia y momentos que a\u00FAn quedan por vivir.',
    type: 'message',
  },
  { text: 'Encu\u00E9ntralos y la carta ser\u00E1 tuya.', type: 'final' },
];

export default function ProloguePage() {
  const [step, setStep] = useState(0);
  const navigate = useNavigate();

  const handleNext = () => {
    if (step < STEPS.length - 1) {
      setStep((s) => s + 1);
    } else {
      navigate('/aventura');
    }
  };

  const current = STEPS[step];

  return (
    <div
      className="tw:min-h-screen tw:flex tw:flex-col tw:items-center tw:justify-center tw:px-4 tw:text-center tw:relative tw:overflow-hidden"
      style={{
        background:
          'radial-gradient(ellipse at 50% 40%, rgba(80,50,120,0.2) 0%, transparent 60%), var(--color-bg)',
      }}
      onClick={handleNext}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && handleNext()}
      aria-label="Toca para continuar"
    >
      <FloatingParticles count={12} />

      <AnimatePresence mode="wait">
        {current.type === 'envelope' && (
          <motion.div
            key="envelope"
            initial={{ opacity: 0, scale: 0.5, rotate: -10 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.8, type: 'spring', stiffness: 120 }}
            className="tw:text-8xl tw:md:text-9xl"
            style={{
              filter: 'drop-shadow(0 0 30px rgba(255,215,0,0.2))',
            }}
          >
            {'\u2709\uFE0F'}
          </motion.div>
        )}

        {(current.type === 'message' || current.type === 'final') && (
          <motion.p
            key={step}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.5 }}
            className="tw:text-xl tw:md:text-2xl tw:max-w-lg tw:leading-relaxed"
            style={{
              fontFamily: 'var(--font-display)',
              color: 'var(--color-text)',
            }}
          >
            {current.text}
          </motion.p>
        )}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="tw:mt-12"
      >
        <Button
          variant="link"
          className="tw:text-sm"
          style={{ color: 'var(--color-text-muted)' }}
          onClick={(e) => {
            e.stopPropagation();
            handleNext();
          }}
        >
          {step < STEPS.length - 1
            ? 'Toca para continuar'
            : 'Comenzar aventura \u2192'}
        </Button>
      </motion.div>

      {/* Step dots */}
      <div className="tw:absolute tw:bottom-8 tw:flex tw:gap-2">
        {STEPS.map((_, i) => (
          <div
            key={i}
            className="tw:rounded-full tw:transition-all tw:duration-300"
            style={{
              width: i === step ? 20 : 6,
              height: 6,
              backgroundColor:
                i <= step ? 'var(--color-gold)' : 'rgba(255,255,255,0.15)',
            }}
          />
        ))}
      </div>
    </div>
  );
}
