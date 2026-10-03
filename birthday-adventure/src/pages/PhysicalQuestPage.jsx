import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import { QRCodeSVG } from 'qrcode.react';

import InventoryBar from '../components/inventory/InventoryBar';
import BackButton from '../components/common/BackButton';

const QR_TOKEN = '7nA4PqR2';

export default function PhysicalQuestPage() {
  const navigate = useNavigate();
  const qrUrl = `${window.location.origin}/qr/${QR_TOKEN}`;

  return (
    <div
      className="tw:min-h-screen tw:py-8 tw:px-4 tw:relative"
      style={{ backgroundColor: 'var(--color-bg)' }}
    >
      <BackButton />
      <Container className="tw:max-w-lg tw:text-center">
        <InventoryBar />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="tw:mt-8"
        >
          <h1
            className="tw:text-3xl tw:mb-4"
            style={{
              fontFamily: 'var(--font-display)',
              color: 'var(--color-text)',
            }}
          >
            La siguiente pista no está dentro de esta página.
          </h1>

          <p
            className="tw:text-lg tw:mb-6"
            style={{ color: 'var(--color-text-muted)' }}
          >
            Busca el código QR que he escondido para ti. Escanéalo con tu
            teléfono para desbloquear el siguiente paso.
          </p>

          <div
            className="tw:inline-block tw:p-4 tw:rounded-lg tw:mb-6"
            style={{ backgroundColor: '#fff' }}
          >
            <QRCodeSVG
              value={qrUrl}
              size={200}
              level="M"
              aria-label="Código QR para la búsqueda física"
            />
          </div>

          <p
            className="tw:text-sm tw:mb-6"
            style={{ color: 'var(--color-text-muted)' }}
          >
            (Este QR es para que lo imprimas y escondas. En la versión final,
            ella lo encontrará en el mundo real.)
          </p>

          <Button
            variant="outline-light"
            onClick={() => navigate(`/qr/${QR_TOKEN}`)}
          >
            Simular escaneo (dev)
          </Button>
        </motion.div>
      </Container>
    </div>
  );
}
