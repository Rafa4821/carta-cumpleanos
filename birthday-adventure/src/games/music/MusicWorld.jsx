import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';

import { useProgress } from '../../context/ProgressContext';
import { INVENTORY_ITEMS } from '../../data/inventory';
import {
  MUSIC_QUESTIONS,
  PLAYLIST_SONGS,
  PLAYLIST_TARGET_ORDER,
} from '../../data/worlds/music';
import ScreenReaderStatus from '../../components/common/ScreenReaderStatus';
import BackButton from '../../components/common/BackButton';
import ResetButton from '../../components/common/ResetButton';
import CompletionCelebration from '../../components/common/CompletionCelebration';

export default function MusicWorld() {
  const navigate = useNavigate();
  const { state, dispatch } = useProgress();
  const [resetKey, setResetKey] = useState(0);
  const [phase, setPhase] = useState(
    state.worlds.music.status === 'completed' ? 'complete' : 'recognition',
  );
  const [qIndex, setQIndex] = useState(0);
  const [playlist, setPlaylist] = useState(() =>
    [...PLAYLIST_SONGS].sort(() => Math.random() - 0.5),
  );
  const [statusMsg, setStatusMsg] = useState('');
  const [showEmbed, setShowEmbed] = useState(null);

  const handleReset = () => {
    setPhase('recognition');
    setQIndex(0);
    setPlaylist([...PLAYLIST_SONGS].sort(() => Math.random() - 0.5));
    setStatusMsg('');
    setShowEmbed(null);
    setResetKey((k) => k + 1);
  };

  const currentQ = MUSIC_QUESTIONS[qIndex];

  const handleRecognitionAnswer = (answer) => {
    const correct = answer === currentQ.correctAnswer;
    if (correct) {
      setShowEmbed(currentQ.spotifyEmbed);
    }

    setTimeout(
      () => {
        setShowEmbed(null);
        if (qIndex < MUSIC_QUESTIONS.length - 1) {
          setQIndex((i) => i + 1);
        } else {
          setPhase('playlist');
          setStatusMsg('Ahora ordena la playlist!');
        }
      },
      correct ? 3000 : 1500,
    );
  };

  const moveItem = (index, direction) => {
    const newIndex = index + direction;
    if (newIndex < 0 || newIndex >= playlist.length) return;
    const next = [...playlist];
    [next[index], next[newIndex]] = [next[newIndex], next[index]];
    setPlaylist(next);
  };

  const checkPlaylistOrder = () => {
    const isCorrect = playlist.every(
      (song, i) => song.id === PLAYLIST_TARGET_ORDER[i],
    );
    if (isCorrect) {
      dispatch({
        type: 'COMPLETE_WORLD',
        worldId: 'music',
        itemId: INVENTORY_ITEMS.music.id,
      });
      setPhase('complete');
      setStatusMsg('Mundo musical completado!');
    } else {
      setStatusMsg('Ese no es el orden correcto. Sigue intentando!');
    }
  };

  const skipPlaylist = () => {
    dispatch({
      type: 'COMPLETE_WORLD',
      worldId: 'music',
      itemId: INVENTORY_ITEMS.music.id,
    });
    setPhase('complete');
  };

  if (phase === 'complete') {
    return (
      <div
        className="tw:min-h-screen tw:flex tw:items-center tw:justify-center tw:px-4 tw:relative"
        style={{ backgroundColor: 'var(--color-bg)' }}
      >
        <ResetButton
          worldId="music"
          itemId={INVENTORY_ITEMS.music.id}
          onReset={handleReset}
        />
        <Container className="tw:max-w-md tw:text-center">
          <CompletionCelebration
            icon={INVENTORY_ITEMS.music.icon}
            label={`${INVENTORY_ITEMS.music.label} conseguida!`}
          >
            <Button
              variant="outline-light"
              size="lg"
              onClick={() => navigate('/aventura')}
              style={{
                borderColor: 'var(--color-gold)',
                color: 'var(--color-gold)',
              }}
            >
              Volver al mapa
            </Button>
          </CompletionCelebration>
        </Container>
      </div>
    );
  }

  return (
    <div
      className="tw:min-h-screen tw:py-8 tw:px-4 tw:relative"
      style={{ backgroundColor: 'var(--color-bg)' }}
    >
      <BackButton />
      <ResetButton
        worldId="music"
        itemId={INVENTORY_ITEMS.music.id}
        onReset={handleReset}
      />
      <Container className="tw:max-w-md">
        <ScreenReaderStatus message={statusMsg} />

        <AnimatePresence mode="wait" key={resetKey}>
          {phase === 'recognition' && (
            <motion.div
              key={`q-${qIndex}`}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <p
                className="tw:text-sm tw:text-center tw:mb-2"
                style={{ color: 'var(--color-text-muted)' }}
              >
                {qIndex + 1} / {MUSIC_QUESTIONS.length}
              </p>
              <h2
                className="tw:text-xl tw:text-center tw:mb-2"
                style={{
                  fontFamily: 'var(--font-display)',
                  color: 'var(--color-text)',
                }}
              >
                {'\u00BF'}Qué canción es?
              </h2>
              <p className="tw:text-center tw:text-3xl tw:mb-2">
                {currentQ.emojis}
              </p>
              <p
                className="tw:text-center tw:mb-1 tw:italic"
                style={{ color: 'var(--color-text-muted)' }}
              >
                {currentQ.clue}
              </p>
              {currentQ.collaboration && (
                <p
                  className="tw:text-center tw:text-sm tw:mb-4"
                  style={{ color: 'var(--color-secondary)' }}
                >
                  Colaboración: {currentQ.collaboration}
                </p>
              )}

              <div className="tw:flex tw:flex-col tw:gap-3">
                {currentQ.options.map((opt) => (
                  <Button
                    key={opt}
                    variant="outline-light"
                    className="tw:py-3"
                    onClick={() => handleRecognitionAnswer(opt)}
                  >
                    {opt}
                  </Button>
                ))}
              </div>

              {showEmbed && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="tw:mt-4"
                >
                  <p
                    className="tw:text-center tw:text-sm tw:mb-2"
                    style={{ color: 'var(--color-gold)' }}
                  >
                    Correcto! {currentQ.artist} - {currentQ.correctAnswer}
                  </p>

                  {/* Floating notes */}
                  <div className="tw:flex tw:justify-center tw:gap-4 tw:mb-3">
                    {['\uD83C\uDFB5', '\uD83C\uDFB6', '\uD83C\uDFB5'].map(
                      (n, i) => (
                        <motion.span
                          key={i}
                          initial={{ y: 0, opacity: 0.7 }}
                          animate={{ y: -20, opacity: 0 }}
                          transition={{
                            duration: 1.5,
                            delay: i * 0.3,
                            repeat: Infinity,
                          }}
                          className="tw:text-xl"
                        >
                          {n}
                        </motion.span>
                      ),
                    )}
                  </div>

                  {/* Vinyl + Equalizer row */}
                  <div className="tw:flex tw:items-center tw:justify-center tw:gap-4 tw:mb-3">
                    {/* Vinyl record */}
                    <div
                      className="tw:w-14 tw:h-14 tw:rounded-full tw:flex tw:items-center tw:justify-center tw:flex-shrink-0"
                      style={{
                        background:
                          'radial-gradient(circle, #333 30%, #111 32%, #222 50%, #111 52%, #1a1a1a 100%)',
                        animation: 'vinylSpin 2s linear infinite',
                        boxShadow: '0 0 8px rgba(0,0,0,0.5)',
                      }}
                    >
                      <div
                        className="tw:w-4 tw:h-4 tw:rounded-full"
                        style={{
                          backgroundColor: '#1DB954',
                          boxShadow: '0 0 4px rgba(29,185,84,0.5)',
                        }}
                      />
                    </div>

                    {/* Equalizer bars */}
                    <div className="tw:flex tw:items-end tw:gap-0.5 tw:h-10">
                      {[0, 0.15, 0.3, 0.1, 0.25, 0.2, 0.35, 0.05].map(
                        (d, i) => (
                          <div
                            key={i}
                            className="tw:w-1.5 tw:rounded-full"
                            style={{
                              backgroundColor: '#1DB954',
                              animation: `eqBounce ${0.5 + d}s ${d}s ease-in-out infinite`,
                              opacity: 0.7 + d,
                            }}
                          />
                        ),
                      )}
                    </div>
                  </div>

                  {/* Spotify Embed */}
                  {!currentQ.spotifyEmbed.includes('PLACEHOLDER') && (
                    <iframe
                      title={`${currentQ.artist} - ${currentQ.correctAnswer}`}
                      src={currentQ.spotifyEmbed}
                      width="100%"
                      height="80"
                      frameBorder="0"
                      allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                      loading="lazy"
                      style={{ borderRadius: '12px' }}
                    />
                  )}
                </motion.div>
              )}
            </motion.div>
          )}

          {phase === 'playlist' && (
            <motion.div
              key="playlist"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <h2
                className="tw:text-xl tw:text-center tw:mb-2"
                style={{
                  fontFamily: 'var(--font-display)',
                  color: 'var(--color-text)',
                }}
              >
                Nuestra playlist
              </h2>
              <p
                className="tw:text-center tw:mb-4 tw:text-sm"
                style={{ color: 'var(--color-text-muted)' }}
              >
                Ordénalas según el momento en que entraron a nuestra historia
              </p>

              <div className="tw:flex tw:flex-col tw:gap-2">
                {playlist.map((song, i) => (
                  <div
                    key={song.id}
                    className="tw:flex tw:items-center tw:gap-2 tw:p-3 tw:rounded-lg"
                    style={{ backgroundColor: 'var(--color-bg-card)' }}
                  >
                    <span
                      className="tw:text-sm tw:w-6 tw:text-center tw:shrink-0"
                      style={{ color: 'var(--color-text-muted)' }}
                    >
                      {i + 1}
                    </span>
                    <div className="tw:flex-1 tw:min-w-0">
                      <p
                        className="tw:m-0 tw:text-sm tw:font-semibold"
                        style={{ color: 'var(--color-text)' }}
                      >
                        {song.title}
                      </p>
                      <p
                        className="tw:m-0 tw:text-xs"
                        style={{ color: 'var(--color-text-muted)' }}
                      >
                        {song.artist}
                      </p>
                    </div>
                    <div className="tw:flex tw:gap-1">
                      <button
                        type="button"
                        onClick={() => moveItem(i, -1)}
                        disabled={i === 0}
                        aria-label={`Mover ${song.title} arriba`}
                        className="tw:w-8 tw:h-8 tw:rounded tw:border tw:text-sm tw:bg-transparent disabled:tw:opacity-30"
                        style={{
                          borderColor: 'var(--color-primary-light)',
                          color: 'var(--color-text)',
                        }}
                      >
                        {'\u25B2'}
                      </button>
                      <button
                        type="button"
                        onClick={() => moveItem(i, 1)}
                        disabled={i === playlist.length - 1}
                        aria-label={`Mover ${song.title} abajo`}
                        className="tw:w-8 tw:h-8 tw:rounded tw:border tw:text-sm tw:bg-transparent disabled:tw:opacity-30"
                        style={{
                          borderColor: 'var(--color-primary-light)',
                          color: 'var(--color-text)',
                        }}
                      >
                        {'\u25BC'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="tw:flex tw:gap-3 tw:justify-center tw:mt-6">
                <Button
                  variant="outline-light"
                  onClick={checkPlaylistOrder}
                  style={{
                    borderColor: 'var(--color-primary-light)',
                    color: 'var(--color-primary-light)',
                  }}
                >
                  Verificar orden
                </Button>
                <Button
                  variant="link"
                  onClick={skipPlaylist}
                  style={{ color: 'var(--color-text-muted)' }}
                >
                  Continuar
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </Container>
    </div>
  );
}
