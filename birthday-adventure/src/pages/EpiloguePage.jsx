import { motion } from 'motion/react';
import Container from 'react-bootstrap/Container';

export default function EpiloguePage() {
  return (
    <div
      className="tw:min-h-screen tw:flex tw:items-center tw:justify-center tw:px-4"
      style={{ backgroundColor: 'var(--color-bg)' }}
    >
      <Container className="tw:max-w-lg tw:text-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5 }}
        >
          <div className="tw:text-6xl tw:mb-6">{'\u2764\uFE0F'}</div>
          <h1
            className="tw:text-3xl tw:mb-4"
            style={{
              fontFamily: 'var(--font-display)',
              color: 'var(--color-text)',
            }}
          >
            Feliz cumpleaños
          </h1>
          <p
            className="tw:text-lg"
            style={{
              fontFamily: 'var(--font-display)',
              color: 'var(--color-text-muted)',
            }}
          >
            Gracias por recorrer esta aventura conmigo.
          </p>
        </motion.div>
      </Container>
    </div>
  );
}
