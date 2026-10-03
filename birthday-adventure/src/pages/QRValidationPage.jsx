import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';

import { useProgress } from '../context/ProgressContext';

const VALID_TOKEN = '7nA4PqR2';

export default function QRValidationPage() {
  const { token } = useParams();
  const navigate = useNavigate();
  const { dispatch } = useProgress();
  const [status, setStatus] = useState('checking');

  useEffect(() => {
    const timer = setTimeout(() => {
      if (token === VALID_TOKEN) {
        dispatch({ type: 'VERIFY_PHYSICAL_TOKEN' });
        setStatus('success');
      } else {
        setStatus('error');
      }
    }, 1200);
    return () => clearTimeout(timer);
  }, [token, dispatch]);

  return (
    <div
      className="tw:min-h-screen tw:flex tw:items-center tw:justify-center tw:px-4"
      style={{ backgroundColor: 'var(--color-bg)' }}
    >
      <Container className="tw:max-w-md tw:text-center">
        {status === 'checking' && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="tw:text-xl"
            style={{
              fontFamily: 'var(--font-display)',
              color: 'var(--color-text)',
            }}
          >
            Verificando...
          </motion.p>
        )}

        {status === 'success' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="tw:text-6xl tw:mb-4">{'\u2728'}</div>
            <h1
              className="tw:text-3xl tw:mb-4"
              style={{
                fontFamily: 'var(--font-display)',
                color: 'var(--color-gold)',
              }}
            >
              {'\u00A1'}Recuerdos desbloqueados!
            </h1>
            <p style={{ color: 'var(--color-text-muted)' }} className="tw:mb-6">
              Has encontrado la pista. Ahora reconstruye un recuerdo.
            </p>
            <Button
              variant="outline-light"
              size="lg"
              onClick={() => navigate('/recuerdos')}
              style={{
                borderColor: 'var(--color-gold)',
                color: 'var(--color-gold)',
              }}
            >
              Continuar
            </Button>
          </motion.div>
        )}

        {status === 'error' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="tw:text-6xl tw:mb-4">{'\u274C'}</div>
            <h1
              className="tw:text-2xl tw:mb-4"
              style={{
                fontFamily: 'var(--font-display)',
                color: 'var(--color-accent)',
              }}
            >
              Este no es el código correcto
            </h1>
            <p style={{ color: 'var(--color-text-muted)' }} className="tw:mb-6">
              Sigue buscando. La pista está escondida en algún lugar especial.
            </p>
            <Button
              variant="outline-light"
              onClick={() => navigate('/busqueda-fisica')}
            >
              Volver
            </Button>
          </motion.div>
        )}
      </Container>
    </div>
  );
}
