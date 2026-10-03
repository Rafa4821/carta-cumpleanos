import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';

import { useProgress } from '../../context/ProgressContext';
import { INVENTORY_ITEMS } from '../../data/inventory';
import {
  QUIZ_QUESTIONS,
  ARCHETYPES,
  calculateArchetype,
} from '../../data/worlds/sortingHat';
import ScreenReaderStatus from '../../components/common/ScreenReaderStatus';
import BackButton from '../../components/common/BackButton';
import ResetButton from '../../components/common/ResetButton';

export default function SortingHatWorld() {
  const navigate = useNavigate();
  const { state, dispatch } = useProgress();
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [result, setResult] = useState(state.worlds.sortingHat.result || null);
  const [thinking, setThinking] = useState(false);
  const [statusMsg, setStatusMsg] = useState('');

  const handleReset = () => {
    setQuestionIndex(0);
    setAnswers([]);
    setResult(null);
    setThinking(false);
    setStatusMsg('');
  };

  const isComplete = state.worlds.sortingHat.status === 'completed';
  const currentQ = QUIZ_QUESTIONS[questionIndex];
  const showResult = result !== null;

  const handleAnswer = (answer) => {
    const nextAnswers = [...answers, answer];
    setAnswers(nextAnswers);

    if (questionIndex < QUIZ_QUESTIONS.length - 1) {
      setQuestionIndex((i) => i + 1);
    } else {
      /* Show thinking animation before revealing result */
      setThinking(true);
      const { archetype } = calculateArchetype(nextAnswers);
      setTimeout(() => {
        setResult(archetype);
        setThinking(false);
        dispatch({
          type: 'SET_WORLD_DATA',
          worldId: 'sortingHat',
          payload: { result: archetype },
        });
        dispatch({
          type: 'COMPLETE_WORLD',
          worldId: 'sortingHat',
          itemId: INVENTORY_ITEMS.sortingHat.id,
        });
        setStatusMsg('Ceremonia completada!');
      }, 3000);
    }
  };

  if (isComplete && result) {
    const arch = ARCHETYPES[result];
    return (
      <div
        className="tw:min-h-screen tw:py-12 tw:px-4 tw:relative"
        style={{ backgroundColor: 'var(--color-bg)' }}
      >
        <ResetButton
          worldId="sortingHat"
          itemId={INVENTORY_ITEMS.sortingHat.id}
          onReset={handleReset}
        />
        <Container className="tw:max-w-md tw:text-center">
          <div className="tw:text-6xl tw:mb-4">
            {INVENTORY_ITEMS.sortingHat.icon}
          </div>
          <h1
            className="tw:text-3xl tw:mb-2"
            style={{ fontFamily: 'var(--font-display)', color: arch.color }}
          >
            {arch.name}
          </h1>
          <p style={{ color: 'var(--color-text)' }} className="tw:mb-6">
            {arch.description}
          </p>
          <Button
            variant="outline-light"
            onClick={() => navigate('/aventura')}
            style={{
              borderColor: 'var(--color-gold)',
              color: 'var(--color-gold)',
            }}
          >
            Volver al mapa
          </Button>
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
        worldId="sortingHat"
        itemId={INVENTORY_ITEMS.sortingHat.id}
        onReset={handleReset}
      />
      <Container className="tw:max-w-md">
        <ScreenReaderStatus message={statusMsg} />

        <AnimatePresence mode="wait">
          {thinking ? (
            <motion.div
              key="thinking"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="tw:text-center tw:mt-16"
            >
              <motion.div
                animate={{
                  rotate: [0, -5, 5, -3, 3, 0],
                  scale: [1, 1.05, 0.95, 1.03, 0.97, 1],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
                className="tw:text-7xl tw:mb-6"
              >
                {INVENTORY_ITEMS.sortingHat.icon}
              </motion.div>
              <motion.p
                animate={{ opacity: [0.4, 1, 0.4] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="tw:text-xl tw:italic"
                style={{
                  fontFamily: 'var(--font-display)',
                  color: 'var(--color-gold)',
                }}
              >
                Mmm... interesante... d&eacute;jame pensar...
              </motion.p>
              <div className="tw:flex tw:justify-center tw:gap-1 tw:mt-4">
                {[0, 0.2, 0.4].map((d) => (
                  <motion.div
                    key={d}
                    animate={{ scale: [1, 1.5, 1], opacity: [0.3, 1, 0.3] }}
                    transition={{
                      duration: 0.8,
                      delay: d,
                      repeat: Infinity,
                    }}
                    className="tw:w-2 tw:h-2 tw:rounded-full"
                    style={{ backgroundColor: 'var(--color-gold)' }}
                  />
                ))}
              </div>
            </motion.div>
          ) : !showResult ? (
            <motion.div
              key={questionIndex}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.3 }}
            >
              <p
                className="tw:text-sm tw:text-center tw:mb-2"
                style={{ color: 'var(--color-text-muted)' }}
              >
                {questionIndex + 1} / {QUIZ_QUESTIONS.length}
              </p>
              <h2
                className="tw:text-xl tw:text-center tw:mb-6"
                style={{
                  fontFamily: 'var(--font-display)',
                  color: 'var(--color-text)',
                }}
              >
                {currentQ.question}
              </h2>
              <div className="tw:flex tw:flex-col tw:gap-3">
                {currentQ.answers.map((answer, i) => (
                  <Button
                    key={i}
                    variant="outline-light"
                    className="tw:py-3 tw:text-start"
                    onClick={() => handleAnswer(answer)}
                  >
                    {answer.label}
                  </Button>
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="result"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="tw:text-center tw:mt-8"
            >
              <div className="tw:text-6xl tw:mb-4">
                {INVENTORY_ITEMS.sortingHat.icon}
              </div>
              <h1
                className="tw:text-3xl tw:mb-2"
                style={{
                  fontFamily: 'var(--font-display)',
                  color: ARCHETYPES[result].color,
                }}
              >
                {ARCHETYPES[result].name}
              </h1>
              <div className="tw:flex tw:justify-center tw:gap-2 tw:mb-4">
                {ARCHETYPES[result].traits.map((t) => (
                  <span
                    key={t}
                    className="tw:px-3 tw:py-1 tw:rounded-full tw:text-xs"
                    style={{
                      backgroundColor: 'var(--color-bg-card)',
                      color: ARCHETYPES[result].color,
                    }}
                  >
                    {t}
                  </span>
                ))}
              </div>
              <p
                className="tw:mb-6"
                style={{
                  color: 'var(--color-text)',
                  fontFamily: 'var(--font-display)',
                }}
              >
                {ARCHETYPES[result].description}
              </p>
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
            </motion.div>
          )}
        </AnimatePresence>
      </Container>
    </div>
  );
}
