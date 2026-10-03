import { SAFE_CODE } from '../inventory';

/**
 * Each case file is tied to a world and reveals one digit of the safe code.
 * The puzzle types:
 *  - cipher: decode a symbol → number mapping
 *  - riddle: answer a riddle whose answer IS the digit
 *  - counting: count items in a visual scene
 *  - decode: unscramble letters to reveal the digit
 *  - match: match clues to find the hidden number
 */
export const CASE_FILES = [
  {
    id: 'magic',
    worldLabel: 'Mundo M\u00E1gico',
    emoji: '\u2728',
    color: '#9b59b6',
    title: 'Expediente #1: El N\u00FAmero Arcano',
    description:
      'Se encontr\u00F3 un pergamino en el estudio m\u00E1gico con s\u00EDmbolos extra\u00F1os...',
    puzzleType: 'cipher',
    puzzle: {
      instruction:
        'Cada s\u00EDmbolo runa corresponde a un n\u00FAmero. \u00BFQu\u00E9 n\u00FAmero representa el s\u00EDmbolo resaltado?',
      symbols: [
        { rune: '\u16A0', value: 3 },
        { rune: '\u16B1', value: 5 },
        { rune: '\u16C1', value: SAFE_CODE.magic },
        { rune: '\u16D2', value: 9 },
      ],
      targetIndex: 2,
      options: [3, 5, SAFE_CODE.magic, 9],
    },
    digit: SAFE_CODE.magic,
  },
  {
    id: 'sortingHat',
    worldLabel: 'El Sombrero',
    emoji: '\uD83C\uDFA9',
    color: '#e67e22',
    title: 'Expediente #2: La Ceremonia Secreta',
    description:
      'Un testigo report\u00F3 actividad sospechosa durante la ceremonia de selecci\u00F3n...',
    puzzleType: 'riddle',
    puzzle: {
      instruction: 'Resuelve el acertijo para descubrir el d\u00EDgito oculto:',
      riddle:
        'Soy el n\u00FAmero de personas que forman una pareja. Ni m\u00E1s ni menos. \u00BFQui\u00E9n soy?',
      options: [1, SAFE_CODE.sortingHat, 3, 4],
    },
    digit: SAFE_CODE.sortingHat,
  },
  {
    id: 'music',
    worldLabel: 'Mundo Musical',
    emoji: '\uD83C\uDFB5',
    color: '#1DB954',
    title: 'Expediente #3: La Nota Perdida',
    description:
      'Una nota musical fue encontrada en la escena del crimen con un mensaje codificado...',
    puzzleType: 'counting',
    puzzle: {
      instruction:
        '\u00BFCu\u00E1ntas notas musicales hay escondidas en la escena?',
      notes: [
        { x: 15, y: 25 },
        /* only 1 real note — the digit IS the count */
      ],
      options: [3, SAFE_CODE.music, 5, 2],
    },
    digit: SAFE_CODE.music,
  },
  {
    id: 'library',
    worldLabel: 'La Biblioteca',
    emoji: '\uD83D\uDCD6',
    color: '#2ecc71',
    title: 'Expediente #4: El C\u00F3digo del Bibliotecario',
    description:
      'Entre las p\u00E1ginas de un libro antiguo se encontr\u00F3 un c\u00F3digo de clasificaci\u00F3n...',
    puzzleType: 'decode',
    puzzle: {
      instruction:
        'Descifra el c\u00F3digo. Las letras desordenadas forman un n\u00FAmero en espa\u00F1ol:',
      scrambled: 'RUTOCA',
      answer: 'CUATRO',
      options: [3, SAFE_CODE.library, 6, 8],
    },
    digit: SAFE_CODE.library,
  },
  {
    id: 'believe',
    worldLabel: 'Believe',
    emoji: '\u26BD',
    color: '#3498db',
    title: 'Expediente #5: El Misterio del Vestuario',
    description:
      'Un n\u00FAmero de camiseta fue arrancado del casillero. Solo queda una pista...',
    puzzleType: 'match',
    puzzle: {
      instruction:
        'El jugador misterioso lleva un n\u00FAmero que es la mitad de una docena. \u00BFCu\u00E1l es?',
      options: [3, 5, SAFE_CODE.believe, 8],
    },
    digit: SAFE_CODE.believe,
  },
];
