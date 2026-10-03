import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';

import { useProgress } from '../context/ProgressContext';
import { SAFE_CODE } from '../data/inventory';
import { WORLD_ORDER } from '../data/gameConfig';
import ScreenReaderStatus from '../components/common/ScreenReaderStatus';
import BackButton from '../components/common/BackButton';

const CODE_LENGTH = 5;
const CORRECT_CODE = WORLD_ORDER.map((w) => String(SAFE_CODE[w]));

export default function SafePage() {
  const navigate = useNavigate();
  const { dispatch } = useProgress();
  const [values, setValues] = useState(Array(CODE_LENGTH).fill(''));
  const [attempts, setAttempts] = useState(0);
  const [unlocked, setUnlocked] = useState(false);
  const [statusMsg, setStatusMsg] = useState('');
  const inputRefs = useRef([]);

  const handleChange = (index, val) => {
    if (!/^\d?$/.test(val)) return;
    const next = [...values];
    next[index] = val;
    setValues(next);

    if (val && index < CODE_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !values[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
    if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
    if (e.key === 'ArrowRight' && index < CODE_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleSubmit = () => {
    const isCorrect = values.every((v, i) => v === CORRECT_CODE[i]);
    if (isCorrect) {
      setUnlocked(true);
      dispatch({ type: 'UNLOCK_LETTER' });
      setStatusMsg('Caja fuerte abierta!');
    } else {
      setAttempts((a) => a + 1);
      setStatusMsg('Combinación incorrecta. Intenta de nuevo.');
    }
  };

  const allFilled = values.every((v) => v !== '');

  return (
    <div
      className="tw:min-h-screen tw:flex tw:items-center tw:justify-center tw:px-4 tw:relative"
      style={{ backgroundColor: 'var(--color-bg)' }}
    >
      <BackButton />
      <Container className="tw:max-w-md tw:text-center">
        <ScreenReaderStatus message={statusMsg} />

        {!unlocked ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1
              className="tw:text-3xl tw:mb-2"
              style={{
                fontFamily: 'var(--font-display)',
                color: 'var(--color-text)',
              }}
            >
              La caja fuerte
            </h1>
            <p style={{ color: 'var(--color-text-muted)' }} className="tw:mb-6">
              Cada mundo te dio un número. Introduce la combinación.
            </p>

            <div
              className="tw:flex tw:justify-center tw:gap-3 tw:mb-6"
              role="group"
              aria-label="Combinación de la caja fuerte"
            >
              {values.map((val, i) => (
                <input
                  key={i}
                  ref={(el) => (inputRefs.current[i] = el)}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={val}
                  onChange={(e) => handleChange(i, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(i, e)}
                  aria-label={`Dígito ${i + 1}`}
                  className="tw:w-14 tw:h-16 tw:text-center tw:text-2xl tw:rounded-lg tw:border-2 tw:bg-transparent tw:outline-none focus:tw:ring-2"
                  style={{
                    borderColor:
                      val === CORRECT_CODE[i] && attempts > 0
                        ? 'var(--color-success)'
                        : 'var(--color-primary-light)',
                    color: 'var(--color-text)',
                    fontFamily: 'var(--font-display)',
                  }}
                />
              ))}
            </div>

            <Button
              variant="outline-light"
              size="lg"
              disabled={!allFilled}
              onClick={handleSubmit}
              aria-label="Abrir caja fuerte"
              style={{
                borderColor: 'var(--color-primary-light)',
                color: 'var(--color-primary-light)',
              }}
            >
              Abrir
            </Button>

            {attempts >= 3 && (
              <p
                className="tw:mt-4 tw:text-sm"
                style={{ color: 'var(--color-gold)' }}
              >
                Pista: revisa tu inventario. Cada mundo te dio un número junto
                con su objeto.
              </p>
            )}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
          >
            <div className="tw:text-6xl tw:mb-4">{'\uD83D\uDD13'}</div>
            <h1
              className="tw:text-3xl tw:mb-4"
              style={{
                fontFamily: 'var(--font-display)',
                color: 'var(--color-gold)',
              }}
            >
              La caja está abierta
            </h1>
            <p style={{ color: 'var(--color-text-muted)' }} className="tw:mb-6">
              Dentro hay algo que escribí especialmente para ti.
            </p>
            <Button
              variant="outline-light"
              size="lg"
              onClick={() => navigate('/carta')}
              style={{
                borderColor: 'var(--color-gold)',
                color: 'var(--color-gold)',
              }}
            >
              Abrir la carta
            </Button>
          </motion.div>
        )}
      </Container>
    </div>
  );
}
