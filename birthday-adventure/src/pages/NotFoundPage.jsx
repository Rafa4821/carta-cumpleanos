import { useNavigate } from 'react-router-dom';
import Button from 'react-bootstrap/Button';

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div
      className="tw:min-h-screen tw:flex tw:flex-col tw:items-center tw:justify-center tw:px-4 tw:text-center"
      style={{ backgroundColor: 'var(--color-bg)' }}
    >
      <h1
        className="tw:text-4xl tw:mb-4"
        style={{
          fontFamily: 'var(--font-display)',
          color: 'var(--color-text)',
        }}
      >
        Esta página no existe
      </h1>
      <p style={{ color: 'var(--color-text-muted)' }} className="tw:mb-6">
        Parece que te perdiste en la aventura.
      </p>
      <Button variant="outline-light" onClick={() => navigate('/')}>
        Volver al inicio
      </Button>
    </div>
  );
}
