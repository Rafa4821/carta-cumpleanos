import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';

import { useProgress } from '../context/ProgressContext';
import { SAFE_CODE } from '../data/inventory';
import { WORLD_ORDER } from '../data/gameConfig';
import ScreenReaderStatus from '../components/common/ScreenReaderStatus';
import BackButton from '../components/common/BackButton';

const CODE_LENGTH = 5;
const CORRECT_CODE = WORLD_ORDER.map((w) => String(SAFE_CODE[w]));

/* Dial component - rotates to select digit */
function DialSlot({ value, onChange, index, isCorrect, showHint }) {
  return (
    <div className="tw:flex tw:flex-col tw:items-center tw:gap-1">
      {/* Up arrow */}
      <button
        type="button"
        onClick={() => {
          const next = value === '' ? 0 : (Number(value) + 1) % 10;
          onChange(index, String(next));
        }}
        className="tw:text-lg tw:p-1 tw:bg-transparent tw:border-none tw:cursor-pointer tw:transition-transform hover:tw:scale-125"
        style={{ color: 'var(--color-text-muted)' }}
        aria-label={`D\u00EDgito ${index + 1} subir`}
      >
        {'\u25B2'}
      </button>

      {/* Dial window */}
      <div
        className="tw:relative tw:overflow-hidden tw:rounded-lg"
        style={{
          width: '52px',
          height: '64px',
          background:
            'linear-gradient(180deg, rgba(40,40,60,0.9) 0%, rgba(60,60,80,0.9) 50%, rgba(40,40,60,0.9) 100%)',
          border: isCorrect
            ? '2px solid var(--color-success)'
            : '2px solid rgba(255,255,255,0.15)',
          boxShadow: isCorrect
            ? '0 0 12px rgba(46,204,113,0.3), inset 0 2px 8px rgba(0,0,0,0.4)'
            : 'inset 0 2px 8px rgba(0,0,0,0.4), 0 2px 6px rgba(0,0,0,0.3)',
        }}
      >
        {/* Metallic shine */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '30%',
            background:
              'linear-gradient(180deg, rgba(255,255,255,0.08) 0%, transparent 100%)',
            pointerEvents: 'none',
          }}
        />
        {/* Center line */}
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '5%',
            right: '5%',
            height: '1px',
            backgroundColor: 'rgba(255,215,0,0.15)',
            transform: 'translateY(-50%)',
            pointerEvents: 'none',
          }}
        />
        <div className="tw:flex tw:items-center tw:justify-center tw:h-full">
          <motion.span
            key={value}
            initial={{ y: 15, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="tw:text-3xl tw:font-bold"
            style={{
              color: value === '' ? 'rgba(255,255,255,0.2)' : '#ffd700',
              fontFamily: 'monospace',
              textShadow: value !== '' ? '0 0 8px rgba(255,215,0,0.3)' : 'none',
            }}
          >
            {value === '' ? '-' : value}
          </motion.span>
        </div>
      </div>

      {/* Down arrow */}
      <button
        type="button"
        onClick={() => {
          const next = value === '' ? 9 : (Number(value) - 1 + 10) % 10;
          onChange(index, String(next));
        }}
        className="tw:text-lg tw:p-1 tw:bg-transparent tw:border-none tw:cursor-pointer tw:transition-transform hover:tw:scale-125"
        style={{ color: 'var(--color-text-muted)' }}
        aria-label={`D\u00EDgito ${index + 1} bajar`}
      >
        {'\u25BC'}
      </button>

      {showHint && (
        <span
          className="tw:text-xs"
          style={{ color: 'var(--color-text-muted)' }}
        >
          {WORLD_ORDER[index] === 'sortingHat'
            ? 'Sombrero'
            : WORLD_ORDER[index].charAt(0).toUpperCase() +
              WORLD_ORDER[index].slice(1)}
        </span>
      )}
    </div>
  );
}

export default function SafePage() {
  const navigate = useNavigate();
  const { dispatch } = useProgress();
  const [values, setValues] = useState(Array(CODE_LENGTH).fill(''));
  const [attempts, setAttempts] = useState(0);
  const [unlocked, setUnlocked] = useState(false);
  const [doorOpen, setDoorOpen] = useState(false);
  const [statusMsg, setStatusMsg] = useState('');

  const handleChange = (index, val) => {
    if (!/^\d?$/.test(val)) return;
    const next = [...values];
    next[index] = val;
    setValues(next);
  };

  const handleSubmit = () => {
    const isCorrect = values.every((v, i) => v === CORRECT_CODE[i]);
    if (isCorrect) {
      setUnlocked(true);
      setStatusMsg('Combinaci\u00F3n correcta!');
      setTimeout(() => {
        setDoorOpen(true);
        dispatch({ type: 'UNLOCK_LETTER' });
      }, 1500);
    } else {
      setAttempts((a) => a + 1);
      setStatusMsg('Combinaci\u00F3n incorrecta. Intenta de nuevo.');
    }
  };

  const allFilled = values.every((v) => v !== '');

  return (
    <div
      className="tw:min-h-screen tw:flex tw:items-center tw:justify-center tw:px-4 tw:relative tw:overflow-hidden"
      style={{
        background:
          'radial-gradient(ellipse at 50% 40%, rgba(60,60,80,0.3) 0%, transparent 60%), var(--color-bg)',
      }}
    >
      <BackButton fallback="/investigacion" />
      <Container className="tw:max-w-md tw:text-center">
        <ScreenReaderStatus message={statusMsg} />

        <AnimatePresence mode="wait">
          {!unlocked ? (
            <motion.div
              key="locked"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
            >
              {/* Safe body */}
              <div
                className="tw:mx-auto tw:p-6 tw:rounded-2xl tw:mb-6"
                style={{
                  maxWidth: '380px',
                  background:
                    'linear-gradient(145deg, #3a3a4a 0%, #2a2a3a 50%, #1a1a2a 100%)',
                  border: '3px solid rgba(255,255,255,0.08)',
                  boxShadow:
                    '0 10px 40px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.05)',
                }}
              >
                {/* Safe handle */}
                <div className="tw:flex tw:justify-center tw:mb-4">
                  <div
                    className="tw:w-16 tw:h-16 tw:rounded-full tw:flex tw:items-center tw:justify-center"
                    style={{
                      background:
                        'radial-gradient(circle, #666 0%, #444 60%, #333 100%)',
                      border: '3px solid #555',
                      boxShadow:
                        'inset 0 -2px 4px rgba(0,0,0,0.4), 0 2px 6px rgba(0,0,0,0.3)',
                    }}
                  >
                    <span className="tw:text-2xl">{'\uD83D\uDD12'}</span>
                  </div>
                </div>

                <h1
                  className="tw:text-xl tw:mb-1"
                  style={{
                    fontFamily: 'var(--font-display)',
                    color: 'var(--color-text)',
                  }}
                >
                  La caja fuerte
                </h1>
                <p
                  className="tw:text-sm tw:mb-5"
                  style={{ color: 'var(--color-text-muted)' }}
                >
                  Gira los diales para introducir la combinaci&oacute;n
                </p>

                {/* Dial inputs */}
                <div
                  className="tw:flex tw:justify-center tw:gap-2 tw:mb-5"
                  role="group"
                  aria-label="Combinaci\u00F3n de la caja fuerte"
                >
                  {values.map((val, i) => (
                    <DialSlot
                      key={i}
                      value={val}
                      onChange={handleChange}
                      index={i}
                      isCorrect={val === CORRECT_CODE[i] && attempts > 0}
                      showHint={attempts >= 2}
                    />
                  ))}
                </div>

                <Button
                  size="lg"
                  disabled={!allFilled}
                  onClick={handleSubmit}
                  aria-label="Abrir caja fuerte"
                  style={{
                    background: allFilled
                      ? 'linear-gradient(135deg, var(--color-gold) 0%, #ff9f43 100%)'
                      : 'rgba(255,255,255,0.1)',
                    border: 'none',
                    color: allFilled ? '#000' : 'rgba(255,255,255,0.3)',
                    fontFamily: 'var(--font-display)',
                    fontWeight: 'bold',
                    width: '100%',
                  }}
                >
                  {'\uD83D\uDD10'} Abrir
                </Button>
              </div>

              {attempts > 0 && attempts < 3 && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="tw:text-sm"
                  style={{ color: 'var(--color-accent)' }}
                >
                  Combinaci&oacute;n incorrecta. Intenta de nuevo.
                </motion.p>
              )}

              {attempts >= 3 && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="tw:text-sm"
                  style={{ color: 'var(--color-gold)' }}
                >
                  Pista: revisa los d&iacute;gitos que descubriste en la
                  investigaci&oacute;n.
                </motion.p>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="unlocked"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              {/* Vault door opening */}
              <motion.div
                animate={
                  doorOpen
                    ? { rotateY: -110, opacity: 0.5 }
                    : { scale: [1, 1.02, 1] }
                }
                transition={
                  doorOpen
                    ? { duration: 1.2, ease: 'easeInOut' }
                    : { duration: 0.5, repeat: 2 }
                }
                style={{
                  transformOrigin: 'left center',
                  perspective: '600px',
                }}
              >
                <div
                  className="tw:w-28 tw:h-28 tw:rounded-full tw:flex tw:items-center tw:justify-center tw:mx-auto tw:mb-4"
                  style={{
                    background:
                      'radial-gradient(circle, #555 0%, #333 70%, #222 100%)',
                    border: '4px solid #666',
                    boxShadow:
                      '0 0 30px rgba(255,215,0,0.2), inset 0 -4px 8px rgba(0,0,0,0.4)',
                  }}
                >
                  <motion.span
                    animate={{ rotate: doorOpen ? 90 : 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="tw:text-4xl"
                  >
                    {doorOpen ? '\uD83D\uDD13' : '\uD83D\uDD12'}
                  </motion.span>
                </div>
              </motion.div>

              {doorOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                >
                  <h1
                    className="tw:text-3xl tw:mb-4 shimmer-text"
                    style={{ fontFamily: 'var(--font-display)' }}
                  >
                    La caja est&aacute; abierta
                  </h1>
                  <p
                    className="tw:mb-6"
                    style={{ color: 'var(--color-text-muted)' }}
                  >
                    Dentro hay algo que escrib&iacute; especialmente para ti.
                  </p>
                  <Button
                    size="lg"
                    onClick={() => navigate('/carta')}
                    style={{
                      background:
                        'linear-gradient(135deg, var(--color-gold) 0%, #ff9f43 100%)',
                      border: 'none',
                      color: '#000',
                      fontFamily: 'var(--font-display)',
                      fontWeight: 'bold',
                    }}
                  >
                    {'\u2709\uFE0F'} Abrir la carta
                  </Button>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </Container>
    </div>
  );
}
