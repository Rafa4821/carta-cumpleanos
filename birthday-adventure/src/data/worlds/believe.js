export const PENALTY_CONFIG = {
  totalShots: 5,
  requiredGoals: 2,
  keeperDifficulty: 0.4,
};

export const LOCKER_ITEMS = [
  {
    id: 'whiteboard',
    x: 50,
    y: 25,
    radius: 12,
    label: 'Pizarra táctica',
    clue: '"La vida es un juego de posibilidades." A veces el mejor plan es creer.',
  },
  {
    id: 'ball',
    x: 25,
    y: 70,
    radius: 8,
    label: 'Pelota',
    clue: 'No importa cuántas veces caigas. Lo que importa es levantarte una más.',
  },
  {
    id: 'locker',
    x: 80,
    y: 45,
    radius: 8,
    label: 'Casillero',
    clue: 'Dentro hay una camiseta con tu nombre. Porque eres parte del equipo.',
  },
  {
    id: 'cookies',
    x: 70,
    y: 75,
    radius: 7,
    label: 'Caja de galletas',
    clue: 'Las galletas son más ricas cuando se comparten con alguien especial.',
  },
  {
    id: 'poster',
    x: 15,
    y: 30,
    radius: 9,
    label: 'Cartel motivacional',
    clue: 'BELIEVE. No es solo una palabra. Es lo que somos.',
  },
];

export const BELIEVE_TRIVIA = [
  {
    id: 'ted-team',
    question: '¿Qué equipo inglés pasa a entrenar Ted?',
    options: ['AFC Richmond', 'Manchester FC', 'London United', 'West Ham'],
    correctAnswer: 'AFC Richmond',
    sourceLabel: 'Apple TV ficha oficial',
    verified: true,
  },
  {
    id: 'dani-rojas',
    question: '¿Cómo se llama el nuevo fichaje que aparece en "Dos aces"?',
    options: ['Dani Rojas', 'Jamie Tartt', 'Sam Obisanya', 'Roy Kent'],
    correctAnswer: 'Dani Rojas',
    sourceLabel: 'Apple TV ficha oficial',
    verified: true,
  },
];
