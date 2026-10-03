export const initialProgress = {
  schemaVersion: 1,

  adventure: {
    started: false,
    startedAt: null,
    completedAt: null,
  },

  worlds: {
    magic: {
      status: 'available',
      stage: 0,
      attempts: 0,
      completedAt: null,
    },
    sortingHat: {
      status: 'locked',
      stage: 0,
      attempts: 0,
      result: null,
      completedAt: null,
    },
    music: {
      status: 'locked',
      stage: 0,
      attempts: 0,
      completedAt: null,
    },
    library: {
      status: 'locked',
      stage: 0,
      attempts: 0,
      completedAt: null,
    },
    believe: {
      status: 'locked',
      stage: 0,
      attempts: 0,
      completedAt: null,
    },
  },

  inventory: [],

  physicalQuest: {
    unlocked: false,
    tokenVerified: false,
    verifiedAt: null,
  },

  photoPuzzle: {
    unlocked: false,
    completed: false,
    pieces: [],
    moves: 0,
  },

  safe: {
    unlocked: false,
    completed: false,
    attempts: 0,
  },

  letter: {
    unlocked: false,
    opened: false,
    finished: false,
  },

  settings: {
    soundEnabled: true,
    ambienceVolume: 0.3,
    sfxVolume: 0.65,
    reduceMotion: false,
  },
};

export const WORLD_ORDER = [
  'magic',
  'sortingHat',
  'music',
  'library',
  'believe',
];

export const WORLD_PATHS = {
  magic: '/mundo/magia',
  sortingHat: '/mundo/sombrero',
  music: '/mundo/musica',
  library: '/mundo/biblioteca',
  believe: '/mundo/believe',
};

export const WORLD_LABELS = {
  magic: 'Mundo Mágico',
  sortingHat: 'El Sombrero',
  music: 'Mundo Musical',
  library: 'La Biblioteca',
  believe: 'Believe',
};
