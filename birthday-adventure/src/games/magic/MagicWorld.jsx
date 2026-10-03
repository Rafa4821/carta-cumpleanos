import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';

import { useProgress } from '../../context/ProgressContext';
import { INVENTORY_ITEMS } from '../../data/inventory';
import { HIDDEN_OBJECTS, MAGIC_TRIVIA } from '../../data/worlds/magic';
import HiddenObjectScene from './HiddenObjectScene';
import SpellGesture from './SpellGesture';
import ScreenReaderStatus from '../../components/common/ScreenReaderStatus';
import BackButton from '../../components/common/BackButton';

const STAGES = ['hidden-objects', 'trivia', 'spell', 'complete'];

export default function MagicWorld() {
  const navigate = useNavigate();
  const { state, dispatch } = useProgress();
  const [stage, setStage] = useState(
    state.worlds.magic.status === 'completed' ? 'complete' : STAGES[0],
  );
  const [statusMsg, setStatusMsg] = useState('');

  const handleObjectsComplete = () => {
    setStage('trivia');
    setStatusMsg('Todos los objetos encontrados! Ahora una pregunta...');
  };

  const handleTriviaCorrect = () => {
    setStage('spell');
    setStatusMsg(MAGIC_TRIVIA.followUp);
  };

  const handleSpellComplete = () => {
    dispatch({
      type: 'COMPLETE_WORLD',
      worldId: 'magic',
      itemId: INVENTORY_ITEMS.magic.id,
    });
    setStage('complete');
    setStatusMsg('Mundo mágico completado!');
  };

  const stageIndex = STAGES.indexOf(stage);

  return (
    <div
      className="tw:min-h-screen tw:py-8 tw:px-4 tw:relative tw:overflow-hidden"
      style={{
        background:
          'radial-gradient(ellipse at 30% 20%, rgba(75,40,130,0.3) 0%, transparent 50%), radial-gradient(ellipse at 70% 80%, rgba(30,60,100,0.2) 0%, transparent 50%), var(--color-bg)',
      }}
    >
      <BackButton />

      {/* Progress indicator */}
      {stage !== 'complete' && (
        <div className="tw:flex tw:justify-center tw:gap-2 tw:mb-6 tw:pt-2">
          {STAGES.slice(0, -1).map((s, i) => (
            <div
              key={s}
              className="tw:rounded-full tw:transition-all tw:duration-300"
              style={{
                width: i <= stageIndex ? 32 : 10,
                height: 10,
                backgroundColor:
                  i <= stageIndex
                    ? 'var(--color-gold)'
                    : 'var(--color-bg-card)',
              }}
            />
          ))}
        </div>
      )}

      <Container className="tw:max-w-3xl">
        <ScreenReaderStatus message={statusMsg} />

        <AnimatePresence mode="wait">
          {stage === 'hidden-objects' && (
            <motion.div
              key="hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <h1
                className="tw:text-2xl tw:text-center tw:mb-4"
                style={{
                  fontFamily: 'var(--font-display)',
                  color: 'var(--color-text)',
                }}
              >
                Estudio mágico
              </h1>
              <p
                className="tw:text-center tw:mb-6"
                style={{ color: 'var(--color-text-muted)' }}
              >
                Encuentra los {HIDDEN_OBJECTS.length} objetos escondidos
              </p>
              <HiddenObjectScene
                objects={HIDDEN_OBJECTS}
                onComplete={handleObjectsComplete}
              />
            </motion.div>
          )}

          {stage === 'trivia' && (
            <TriviaStage key="trivia" onCorrect={handleTriviaCorrect} />
          )}

          {stage === 'spell' && (
            <motion.div
              key="spell"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <h2
                className="tw:text-2xl tw:text-center tw:mb-2"
                style={{
                  fontFamily: 'var(--font-display)',
                  color: 'var(--color-text)',
                }}
              >
                Lanza el hechizo
              </h2>
              <p
                className="tw:text-center tw:mb-6"
                style={{ color: 'var(--color-text-muted)' }}
              >
                Traza la runa con tu dedo o mouse
              </p>
              <SpellGesture onComplete={handleSpellComplete} />
            </motion.div>
          )}

          {stage === 'complete' && (
            <motion.div
              key="complete"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="tw:text-center tw:mt-16"
            >
              <div className="tw:text-6xl tw:mb-4">
                {INVENTORY_ITEMS.magic.icon}
              </div>
              <h2
                className="tw:text-3xl tw:mb-4"
                style={{
                  fontFamily: 'var(--font-display)',
                  color: 'var(--color-gold)',
                }}
              >
                {INVENTORY_ITEMS.magic.label} conseguido!
              </h2>
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

function TriviaStage({ onCorrect }) {
  const [selected, setSelected] = useState(null);
  const [answered, setAnswered] = useState(false);

  const handleAnswer = (option) => {
    setSelected(option);
    setAnswered(true);
    if (option === MAGIC_TRIVIA.correctAnswer) {
      setTimeout(() => onCorrect(), 1500);
    }
  };

  const isCorrect = selected === MAGIC_TRIVIA.correctAnswer;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="tw:text-center tw:max-w-md tw:mx-auto tw:mt-12"
    >
      <h2
        className="tw:text-xl tw:mb-6"
        style={{
          fontFamily: 'var(--font-display)',
          color: 'var(--color-text)',
        }}
      >
        {MAGIC_TRIVIA.question}
      </h2>
      <div className="tw:flex tw:flex-col tw:gap-3">
        {MAGIC_TRIVIA.options.map((option) => (
          <Button
            key={option}
            variant={
              answered
                ? option === MAGIC_TRIVIA.correctAnswer
                  ? 'success'
                  : option === selected
                    ? 'danger'
                    : 'outline-secondary'
                : 'outline-light'
            }
            onClick={() => !answered && handleAnswer(option)}
            disabled={answered}
            className="tw:py-3"
          >
            {option}
          </Button>
        ))}
      </div>
      {answered && !isCorrect && (
        <p className="tw:mt-4" style={{ color: 'var(--color-accent)' }}>
          La respuesta correcta es: {MAGIC_TRIVIA.correctAnswer}
        </p>
      )}
      {answered && !isCorrect && (
        <Button variant="outline-light" className="tw:mt-4" onClick={onCorrect}>
          Continuar de todas formas
        </Button>
      )}
      {answered && isCorrect && (
        <p className="tw:mt-4" style={{ color: 'var(--color-gold)' }}>
          {MAGIC_TRIVIA.followUp}
        </p>
      )}
    </motion.div>
  );
}
