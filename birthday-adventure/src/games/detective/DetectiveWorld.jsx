import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';

import { useProgress } from '../../context/ProgressContext';
import { CASE_FILES } from '../../data/worlds/detective';
import BackButton from '../../components/common/BackButton';
import Typewriter from '../../components/common/Typewriter';
import ScreenReaderStatus from '../../components/common/ScreenReaderStatus';

/* Deterministic seeded RNG for string visuals */
function seeded(seed) {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

const rng = seeded(42);
const STRING_POINTS = CASE_FILES.map(() => ({
  cx: 15 + rng() * 70,
  cy: 15 + rng() * 70,
}));

/* ------------------------------------------------------------------ */
/*  CaseFile puzzle component                                          */
/* ------------------------------------------------------------------ */
function CasePuzzle({ caseFile, onSolve }) {
  const [selected, setSelected] = useState(null);
  const [result, setResult] = useState(null);

  const handleOption = useCallback(
    (opt) => {
      setSelected(opt);
      const correct = opt === caseFile.digit;
      setResult(correct ? 'correct' : 'wrong');
      if (correct) {
        setTimeout(() => onSolve(caseFile.id, caseFile.digit), 1200);
      } else {
        setTimeout(() => {
          setSelected(null);
          setResult(null);
        }, 1000);
      }
    },
    [caseFile, onSolve],
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="tw:max-w-lg tw:mx-auto"
    >
      {/* Case file header */}
      <div
        className="tw:p-5 tw:rounded-t-xl tw:border-b"
        style={{
          background:
            'linear-gradient(135deg, rgba(180,140,80,0.12) 0%, rgba(120,90,50,0.06) 100%)',
          borderColor: 'rgba(180,140,80,0.2)',
        }}
      >
        <div className="tw:flex tw:items-center tw:gap-3 tw:mb-2">
          <span className="tw:text-2xl">{caseFile.emoji}</span>
          <h3
            className="tw:text-lg tw:m-0"
            style={{
              fontFamily: 'var(--font-display)',
              color: caseFile.color,
            }}
          >
            {caseFile.title}
          </h3>
        </div>
        <p
          className="tw:text-sm tw:m-0 tw:italic"
          style={{ color: 'var(--color-text-muted)' }}
        >
          {caseFile.description}
        </p>
      </div>

      {/* Puzzle area */}
      <div
        className="tw:p-5 tw:rounded-b-xl"
        style={{
          backgroundColor: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(180,140,80,0.15)',
          borderTop: 'none',
        }}
      >
        <p
          className="tw:text-base tw:mb-4"
          style={{ color: 'var(--color-text)' }}
        >
          {caseFile.puzzle.instruction}
        </p>

        {/* Cipher type: show rune → number mapping */}
        {caseFile.puzzleType === 'cipher' && (
          <div className="tw:mb-4">
            <div className="tw:flex tw:justify-center tw:gap-4 tw:mb-4">
              {caseFile.puzzle.symbols.map((sym, i) => (
                <div
                  key={i}
                  className="tw:text-center tw:p-3 tw:rounded-lg"
                  style={{
                    backgroundColor:
                      i === caseFile.puzzle.targetIndex
                        ? 'rgba(255,215,0,0.15)'
                        : 'rgba(255,255,255,0.05)',
                    border:
                      i === caseFile.puzzle.targetIndex
                        ? '2px solid var(--color-gold)'
                        : '1px solid rgba(255,255,255,0.1)',
                  }}
                >
                  <div className="tw:text-2xl tw:mb-1">{sym.rune}</div>
                  {i !== caseFile.puzzle.targetIndex && (
                    <div
                      className="tw:text-sm"
                      style={{ color: 'var(--color-text-muted)' }}
                    >
                      = {sym.value}
                    </div>
                  )}
                  {i === caseFile.puzzle.targetIndex && (
                    <div
                      className="tw:text-sm tw:font-bold"
                      style={{ color: 'var(--color-gold)' }}
                    >
                      = ?
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Decode type: show scrambled letters */}
        {caseFile.puzzleType === 'decode' && (
          <div className="tw:text-center tw:mb-4">
            <div className="tw:flex tw:justify-center tw:gap-2 tw:mb-2">
              {caseFile.puzzle.scrambled.split('').map((letter, i) => (
                <div
                  key={i}
                  className="tw:w-10 tw:h-10 tw:flex tw:items-center tw:justify-center tw:rounded tw:text-lg tw:font-bold"
                  style={{
                    backgroundColor: 'rgba(255,215,0,0.1)',
                    border: '1px solid rgba(255,215,0,0.3)',
                    color: 'var(--color-gold)',
                    fontFamily: 'monospace',
                  }}
                >
                  {letter}
                </div>
              ))}
            </div>
            <p
              className="tw:text-xs tw:mt-2"
              style={{ color: 'var(--color-text-muted)' }}
            >
              Pista: {caseFile.puzzle.answer.length} letras, es un n&uacute;mero
            </p>
          </div>
        )}

        {/* Riddle type: just show the riddle text prominently */}
        {caseFile.puzzleType === 'riddle' && (
          <div
            className="tw:text-center tw:p-4 tw:rounded-lg tw:mb-4 tw:italic tw:text-lg"
            style={{
              backgroundColor: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.08)',
              color: 'var(--color-text)',
              fontFamily: 'var(--font-display)',
            }}
          >
            &ldquo;{caseFile.puzzle.riddle}&rdquo;
          </div>
        )}

        {/* Counting type: show scattered notes */}
        {caseFile.puzzleType === 'counting' && (
          <div
            className="tw:relative tw:mx-auto tw:mb-4 tw:rounded-lg tw:overflow-hidden"
            style={{
              width: '100%',
              height: '120px',
              backgroundColor: 'rgba(29,185,84,0.05)',
              border: '1px solid rgba(29,185,84,0.15)',
            }}
          >
            {/* Single note - the answer is 1 */}
            <div
              style={{
                position: 'absolute',
                left: '50%',
                top: '45%',
                transform: 'translate(-50%, -50%)',
                fontSize: '2em',
              }}
            >
              {'\uD83C\uDFB5'}
            </div>
            {/* Decoy elements */}
            {[
              { e: '\uD83C\uDFB8', x: 20, y: 30 },
              { e: '\uD83C\uDFA4', x: 75, y: 60 },
              { e: '\uD83C\uDFA7', x: 40, y: 70 },
              { e: '\uD83E\uDD41', x: 85, y: 25 },
            ].map((d, i) => (
              <div
                key={i}
                style={{
                  position: 'absolute',
                  left: `${d.x}%`,
                  top: `${d.y}%`,
                  transform: 'translate(-50%, -50%)',
                  fontSize: '1.2em',
                  opacity: 0.3,
                }}
              >
                {d.e}
              </div>
            ))}
          </div>
        )}

        {/* Answer options */}
        <div className="tw:grid tw:grid-cols-2 tw:gap-3">
          {caseFile.puzzle.options.map((opt) => {
            let btnStyle = {
              backgroundColor: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.15)',
              color: 'var(--color-text)',
            };
            if (selected === opt && result === 'correct') {
              btnStyle = {
                backgroundColor: 'rgba(46,204,113,0.2)',
                border: '1px solid rgba(46,204,113,0.5)',
                color: '#2ecc71',
              };
            } else if (selected === opt && result === 'wrong') {
              btnStyle = {
                backgroundColor: 'rgba(231,76,60,0.2)',
                border: '1px solid rgba(231,76,60,0.5)',
                color: '#e74c3c',
              };
            }

            return (
              <button
                key={opt}
                type="button"
                disabled={result === 'correct'}
                onClick={() => handleOption(opt)}
                className="tw:py-3 tw:rounded-lg tw:text-xl tw:font-bold tw:transition-all tw:duration-200"
                style={btnStyle}
              >
                {opt}
              </button>
            );
          })}
        </div>

        {/* Result feedback */}
        <AnimatePresence>
          {result === 'correct' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="tw:text-center tw:mt-4"
            >
              <p
                className="tw:text-lg tw:font-bold"
                style={{ color: 'var(--color-gold)' }}
              >
                {'\uD83D\uDD0D'} D&iacute;gito descubierto: {caseFile.digit}
              </p>
            </motion.div>
          )}
          {result === 'wrong' && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="tw:text-center tw:mt-3 tw:text-sm"
              style={{ color: 'var(--color-accent)' }}
            >
              Incorrecto. Piensa de nuevo, detective...
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main DetectiveWorld                                                 */
/* ------------------------------------------------------------------ */
export default function DetectiveWorld() {
  const navigate = useNavigate();
  const { dispatch } = useProgress();
  const [solved, setSolved] = useState({});
  const [activeCase, setActiveCase] = useState(null);
  const [statusMsg, setStatusMsg] = useState('');

  const solvedCount = Object.keys(solved).length;
  const allSolved = solvedCount === CASE_FILES.length;

  const handleSolve = useCallback((caseId, digit) => {
    setSolved((prev) => ({ ...prev, [caseId]: digit }));
    setTimeout(() => setActiveCase(null), 800);
  }, []);

  const handleContinue = () => {
    dispatch({ type: 'COMPLETE_DETECTIVE' });
    setStatusMsg('Investigaci\u00F3n completada!');
    navigate('/caja-fuerte');
  };

  return (
    <div
      className="tw:min-h-screen tw:py-8 tw:px-4 tw:relative tw:overflow-hidden"
      style={{
        background:
          'radial-gradient(ellipse at 30% 20%, rgba(180,140,80,0.08) 0%, transparent 50%), radial-gradient(ellipse at 70% 80%, rgba(60,40,20,0.1) 0%, transparent 50%), var(--color-bg)',
      }}
    >
      <BackButton fallback="/recuerdos" />
      <ScreenReaderStatus message={statusMsg} />

      <Container className="tw:max-w-3xl">
        {/* Title */}
        <div className="tw:text-center tw:mb-6">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="tw:text-4xl tw:mb-2">{'\uD83D\uDD75\uFE0F'}</div>
            <h1
              className="tw:text-2xl tw:md:text-3xl tw:mb-2 shimmer-text"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              La Investigaci&oacute;n
            </h1>
            <p
              className="tw:text-sm"
              style={{ color: 'var(--color-text-muted)' }}
            >
              Resuelve los 5 expedientes para descubrir el c&oacute;digo de la
              caja fuerte
            </p>
          </motion.div>
        </div>

        {/* Code progress display */}
        <div className="tw:flex tw:justify-center tw:gap-3 tw:mb-8">
          {CASE_FILES.map((cf) => (
            <div
              key={cf.id}
              className="tw:w-12 tw:h-14 tw:flex tw:items-center tw:justify-center tw:rounded-lg tw:text-xl tw:font-bold tw:transition-all tw:duration-500"
              style={{
                backgroundColor: solved[cf.id]
                  ? 'rgba(255,215,0,0.15)'
                  : 'rgba(255,255,255,0.05)',
                border: solved[cf.id]
                  ? '2px solid var(--color-gold)'
                  : '1px solid rgba(255,255,255,0.1)',
                color: solved[cf.id]
                  ? 'var(--color-gold)'
                  : 'rgba(255,255,255,0.2)',
                fontFamily: 'monospace',
                boxShadow: solved[cf.id]
                  ? '0 0 12px rgba(255,215,0,0.2)'
                  : 'none',
              }}
            >
              {solved[cf.id] ?? '?'}
            </div>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {activeCase ? (
            /* Active case puzzle */
            <CasePuzzle
              key={activeCase.id}
              caseFile={activeCase}
              onSolve={handleSolve}
            />
          ) : (
            /* Evidence board */
            <motion.div
              key="board"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {/* Evidence board */}
              <div
                className="tw:relative tw:p-6 tw:rounded-xl tw:min-h-[320px]"
                style={{
                  background:
                    'linear-gradient(145deg, rgba(120,80,40,0.12) 0%, rgba(80,50,25,0.08) 100%)',
                  border: '2px solid rgba(120,80,40,0.2)',
                  boxShadow: 'inset 0 2px 10px rgba(0,0,0,0.2)',
                }}
              >
                {/* Cork texture dots */}
                {Array.from({ length: 8 }, (_, i) => (
                  <div
                    key={`cork-${i}`}
                    style={{
                      position: 'absolute',
                      left: `${10 + (i % 4) * 25}%`,
                      top: `${15 + Math.floor(i / 4) * 55}%`,
                      width: '3px',
                      height: '3px',
                      borderRadius: '50%',
                      backgroundColor: 'rgba(180,140,80,0.15)',
                      pointerEvents: 'none',
                    }}
                  />
                ))}

                {/* Red string connections between solved cases */}
                <svg
                  className="tw:absolute tw:inset-0 tw:w-full tw:h-full tw:pointer-events-none"
                  style={{ zIndex: 0 }}
                >
                  {STRING_POINTS.slice(0, -1).map((p, i) => {
                    const next = STRING_POINTS[i + 1];
                    const bothSolved =
                      solved[CASE_FILES[i].id] && solved[CASE_FILES[i + 1].id];
                    return (
                      <line
                        key={i}
                        x1={`${p.cx}%`}
                        y1={`${p.cy}%`}
                        x2={`${next.cx}%`}
                        y2={`${next.cy}%`}
                        stroke={
                          bothSolved
                            ? 'rgba(220,60,60,0.4)'
                            : 'rgba(220,60,60,0.08)'
                        }
                        strokeWidth="1.5"
                        strokeDasharray={bothSolved ? 'none' : '4 4'}
                      />
                    );
                  })}
                </svg>

                {/* Case file cards */}
                <div className="tw:grid tw:grid-cols-2 tw:md:grid-cols-3 tw:gap-4 tw:relative tw:z-1">
                  {CASE_FILES.map((cf, i) => {
                    const isSolved = !!solved[cf.id];
                    return (
                      <motion.button
                        key={cf.id}
                        type="button"
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        whileHover={
                          !isSolved ? { scale: 1.03, y: -2 } : undefined
                        }
                        onClick={() => !isSolved && setActiveCase(cf)}
                        disabled={isSolved}
                        className="tw:p-4 tw:rounded-lg tw:text-left tw:transition-all tw:duration-200"
                        style={{
                          backgroundColor: isSolved
                            ? 'rgba(46,204,113,0.08)'
                            : 'rgba(255,255,255,0.04)',
                          border: isSolved
                            ? '1px solid rgba(46,204,113,0.3)'
                            : '1px solid rgba(255,255,255,0.1)',
                          cursor: isSolved ? 'default' : 'pointer',
                          transform: isSolved
                            ? 'rotate(-1deg)'
                            : `rotate(${(i % 2 === 0 ? 1 : -1) * 0.5}deg)`,
                        }}
                      >
                        <div className="tw:flex tw:items-center tw:gap-2 tw:mb-2">
                          <span className="tw:text-xl">
                            {isSolved ? '\u2705' : cf.emoji}
                          </span>
                          <span
                            className="tw:text-xs tw:font-medium"
                            style={{
                              color: isSolved
                                ? 'var(--color-success)'
                                : cf.color,
                            }}
                          >
                            {cf.worldLabel}
                          </span>
                        </div>
                        <p
                          className="tw:text-sm tw:m-0 tw:leading-snug"
                          style={{
                            color: isSolved
                              ? 'var(--color-text-muted)'
                              : 'var(--color-text)',
                          }}
                        >
                          {isSolved
                            ? `D\u00EDgito: ${solved[cf.id]}`
                            : cf.title}
                        </p>
                        {!isSolved && (
                          <p
                            className="tw:text-xs tw:m-0 tw:mt-1"
                            style={{ color: 'rgba(255,215,0,0.5)' }}
                          >
                            Toca para investigar {'\u2192'}
                          </p>
                        )}
                      </motion.button>
                    );
                  })}

                  {/* Center decoration - magnifying glass */}
                  {CASE_FILES.length % 3 !== 0 && (
                    <div className="tw:flex tw:items-center tw:justify-center tw:text-4xl tw:opacity-15">
                      {'\uD83D\uDD0D'}
                    </div>
                  )}
                </div>
              </div>

              {/* Continue button */}
              {allSolved && (
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="tw:text-center tw:mt-8"
                >
                  <Typewriter
                    text="C\u00F3digo descifrado. La caja fuerte te espera..."
                    speed={35}
                    className="tw:block tw:mb-4 tw:italic"
                    style={{
                      color: 'var(--color-gold)',
                      fontFamily: 'var(--font-display)',
                    }}
                  />
                  <Button
                    size="lg"
                    onClick={handleContinue}
                    style={{
                      background:
                        'linear-gradient(135deg, var(--color-gold) 0%, #ff9f43 100%)',
                      border: 'none',
                      color: '#000',
                      fontFamily: 'var(--font-display)',
                      fontWeight: 'bold',
                    }}
                  >
                    {'\uD83D\uDD12'} Ir a la caja fuerte
                  </Button>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </Container>
    </div>
  );
}
