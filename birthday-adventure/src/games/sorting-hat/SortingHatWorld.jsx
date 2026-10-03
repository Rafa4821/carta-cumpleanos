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
  const [statusMsg, setStatusMsg] = useState('');

  const handleReset = () => {
    setQuestionIndex(0);
    setAnswers([]);
    setResult(null);
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
      const { archetype } = calculateArchetype(nextAnswers);
      setResult(archetype);
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
    }
  };

  if (isComplete && result) {
    const arch = ARCHETYPES[result];
    return (
      <div
        className="tw:min-h-screen tw:py-12 tw:px-4"
        style={{ backgroundColor: 'var(--color-bg)' }}
      >
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
          {!showResult ? (
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
