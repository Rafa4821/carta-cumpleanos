import { useState, useEffect } from 'react';

export default function Typewriter({
  text,
  speed = 40,
  delay = 0,
  onComplete,
  className = '',
  style = {},
  as: Tag = 'span',
}) {
  const [displayed, setDisplayed] = useState('');
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => setStarted(true), delay);
    return () => clearTimeout(timeout);
  }, [delay]);

  useEffect(() => {
    if (!started) return;
    if (displayed.length >= text.length) {
      onComplete?.();
      return;
    }
    const timer = setTimeout(() => {
      setDisplayed(text.slice(0, displayed.length + 1));
    }, speed);
    return () => clearTimeout(timer);
  }, [started, displayed, text, speed, onComplete]);

  return (
    <Tag className={className} style={style}>
      {displayed}
      {started && displayed.length < text.length && (
        <span
          className="typewriter-cursor"
          style={{ opacity: 0.7, animation: 'blink 0.8s step-end infinite' }}
        >
          |
        </span>
      )}
    </Tag>
  );
}
