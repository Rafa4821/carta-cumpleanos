export const HIDDEN_OBJECTS = [
  {
    id: 'golden-feather',
    x: 63.5,
    y: 27.2,
    radius: 6,
    label: 'Pluma dorada',
    emoji: '\uD83E\uDEB6',
  },
  {
    id: 'crystal-vial',
    x: 25.0,
    y: 58.0,
    radius: 5,
    label: 'Frasco de cristal',
    emoji: '\uD83E\uDDEA',
  },
  {
    id: 'ancient-key',
    x: 78.0,
    y: 65.0,
    radius: 5,
    label: 'Llave antigua',
    emoji: '\uD83D\uDDDD\uFE0F',
  },
  {
    id: 'spell-book',
    x: 40.0,
    y: 42.0,
    radius: 6,
    label: 'Libro de hechizos',
    emoji: '\uD83D\uDCD5',
  },
  {
    id: 'star-pendant',
    x: 52.0,
    y: 80.0,
    radius: 5,
    label: 'Colgante de estrella',
    emoji: '\u2B50',
  },
];

// Decorative scene elements (not clickable, just atmosphere)
export const SCENE_DECORATIONS = [
  { emoji: '\uD83D\uDD6F\uFE0F', x: 12, y: 15, size: '1.8em', opacity: 0.7 },
  { emoji: '\uD83D\uDD6F\uFE0F', x: 88, y: 18, size: '1.8em', opacity: 0.6 },
  { emoji: '\uD83C\uDF1F', x: 30, y: 10, size: '0.7em', opacity: 0.4 },
  { emoji: '\uD83C\uDF1F', x: 72, y: 8, size: '0.6em', opacity: 0.35 },
  { emoji: '\uD83C\uDF1F', x: 50, y: 5, size: '0.5em', opacity: 0.3 },
  { emoji: '\uD83C\uDF1F', x: 15, y: 35, size: '0.5em', opacity: 0.25 },
  { emoji: '\uD83C\uDF1F', x: 85, y: 40, size: '0.6em', opacity: 0.3 },
  { emoji: '\uD83C\uDF3F', x: 8, y: 72, size: '1.4em', opacity: 0.5 },
  { emoji: '\uD83C\uDF3F', x: 92, y: 78, size: '1.2em', opacity: 0.45 },
  { emoji: '\uD83D\uDCDC', x: 18, y: 30, size: '1.1em', opacity: 0.4 },
  { emoji: '\uD83D\uDCDC', x: 70, y: 48, size: '0.9em', opacity: 0.35 },
  { emoji: '\uD83E\uDEB6', x: 45, y: 20, size: '0.7em', opacity: 0.3 },
  { emoji: '\uD83E\uDDEA', x: 60, y: 55, size: '0.8em', opacity: 0.3 },
  { emoji: '\uD83D\uDCD5', x: 35, y: 68, size: '0.9em', opacity: 0.35 },
  { emoji: '\u2B50', x: 82, y: 30, size: '0.6em', opacity: 0.3 },
];

export const MAGIC_TRIVIA = {
  id: 'patronus-incantation',
  question:
    '\u00BFQu\u00E9 encantamiento se utiliza para invocar un Patronus?',
  options: ['Expecto Patronum', 'Lumos', 'Accio', 'Alohomora'],
  correctAnswer: 'Expecto Patronum',
  sourceLabel: 'HarryPotter.com Official Encyclopedia',
  followUp: 'Antes de continuar, piensa en un recuerdo feliz de nosotros...',
};

export const SPELL_TEMPLATE = [
  { x: 20, y: 50 },
  { x: 35, y: 20 },
  { x: 50, y: 50 },
  { x: 65, y: 20 },
  { x: 80, y: 50 },
];

export const SPELL_ALTERNATIVE_SEQUENCE = [
  '\u2606',
  '\u263D',
  '\u2604',
  '\u2726',
];
