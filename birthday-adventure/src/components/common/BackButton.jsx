import { useNavigate } from 'react-router-dom';
import Button from 'react-bootstrap/Button';

export default function BackButton({ to = '/aventura', label = 'Volver' }) {
  const navigate = useNavigate();

  return (
    <Button
      variant="link"
      onClick={() => navigate(to)}
      className="tw:absolute tw:top-4 tw:left-4 tw:z-10 tw:no-underline tw:flex tw:items-center tw:gap-1 tw:text-sm tw:opacity-70 hover:tw:opacity-100 tw:transition-opacity"
      style={{ color: 'var(--color-text-muted)' }}
      aria-label={label}
    >
      <span aria-hidden="true">{'\u2190'}</span> {label}
    </Button>
  );
}
