export default function LoadingScene() {
  return (
    <div
      className="tw:flex tw:items-center tw:justify-center tw:min-h-screen"
      style={{ backgroundColor: 'var(--color-bg)' }}
    >
      <p
        className="tw:text-lg tw:animate-pulse"
        style={{
          fontFamily: 'var(--font-display)',
          color: 'var(--color-text)',
        }}
      >
        Cargando...
      </p>
    </div>
  );
}
