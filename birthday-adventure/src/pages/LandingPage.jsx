import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import Button from 'react-bootstrap/Button';

import { useProgress } from '../context/ProgressContext';
import FloatingParticles from '../components/common/FloatingParticles';

export default function LandingPage() {
  const navigate = useNavigate();
  const { dispatch } = useProgress();

  const handleStart = () => {
    dispatch({ type: 'START_ADVENTURE' });
    navigate('/prologo');
  };

  return (
    <div
      className="tw:min-h-screen tw:flex tw:flex-col tw:items-center tw:justify-center tw:px-4 tw:text-center tw:relative tw:overflow-hidden"
      style={{
        background:
          'radial-gradient(ellipse at 50% 30%, rgba(124,58,237,0.2) 0%, transparent 60%), radial-gradient(ellipse at 50% 80%, rgba(236,72,153,0.1) 0%, transparent 50%), var(--color-bg)',
      }}
    >
      <FloatingParticles count={25} />

      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.2, delay: 0.5, ease: 'easeOut' }}
        className="tw:text-7xl tw:mb-8"
      >
        {'\u2728'}
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.8 }}
        className="tw:text-4xl tw:md:text-6xl tw:mb-6 shimmer-text"
        style={{ fontFamily: 'var(--font-display)' }}
      >
        Tengo algo para ti.
      </motion.h1>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 1.4 }}
        className="tw:text-lg tw:mb-8 tw:max-w-md"
        style={{ color: 'var(--color-text-muted)' }}
      >
        Una aventura hecha especialmente para ti.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 1.8 }}
      >
        <Button
          variant="outline-light"
          size="lg"
          onClick={handleStart}
          className="tw:px-10 tw:py-3"
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: '1.25rem',
            borderColor: 'var(--color-gold)',
            color: 'var(--color-gold)',
          }}
        >
          Comenzar {'\u2192'}
        </Button>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 2.4 }}
        className="tw:mt-8 tw:flex tw:gap-4 tw:text-sm"
        style={{ color: 'var(--color-text-muted)' }}
      >
        <label className="tw:flex tw:items-center tw:gap-2 tw:cursor-pointer">
          <input type="checkbox" defaultChecked aria-label="Sonido activado" />
          Sonido
        </label>
      </motion.div>
    </div>
  );
}
