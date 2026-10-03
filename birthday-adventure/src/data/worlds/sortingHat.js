export const QUIZ_QUESTIONS = [
  {
    id: 'travel-packing',
    question:
      'Son las 11:47 PM y decidimos salir mañana de viaje. ¿Quién tiene más probabilidades de empezar a hacer la maleta a las 11:49?',
    answers: [
      {
        label: 'Yo, obviamente',
        weights: {
          adventure: 3,
          tenderness: 0,
          chaos: 1,
          curiosity: 0,
          loyalty: 1,
        },
      },
      {
        label: 'Los dos a la vez, medio riendo',
        weights: {
          adventure: 1,
          tenderness: 2,
          chaos: 2,
          curiosity: 0,
          loyalty: 1,
        },
      },
      {
        label: 'Ninguno... mañana se ve',
        weights: {
          adventure: 0,
          tenderness: 1,
          chaos: 3,
          curiosity: 0,
          loyalty: 0,
        },
      },
      {
        label: 'Uno planifica mientras el otro duerme',
        weights: {
          adventure: 0,
          tenderness: 1,
          chaos: 0,
          curiosity: 2,
          loyalty: 2,
        },
      },
    ],
  },
  {
    id: 'free-afternoon',
    question:
      'Tenemos una tarde completamente libre. ¿Cuál sería nuestro plan más probable?',
    answers: [
      {
        label: 'Salir a explorar algo nuevo',
        weights: {
          adventure: 3,
          tenderness: 0,
          chaos: 1,
          curiosity: 2,
          loyalty: 0,
        },
      },
      {
        label: 'Maratón de serie con snacks',
        weights: {
          adventure: 0,
          tenderness: 3,
          chaos: 0,
          curiosity: 1,
          loyalty: 1,
        },
      },
      {
        label: 'Algo espontáneo que aún no existe',
        weights: {
          adventure: 2,
          tenderness: 0,
          chaos: 3,
          curiosity: 1,
          loyalty: 0,
        },
      },
      {
        label: 'Cocinar juntos o hacer algo creativo',
        weights: {
          adventure: 0,
          tenderness: 2,
          chaos: 0,
          curiosity: 2,
          loyalty: 2,
        },
      },
    ],
  },
  {
    id: 'argument',
    question: 'En una discusión absurda, ¿quién termina riéndose primero?',
    answers: [
      {
        label: 'Yo, siempre',
        weights: {
          adventure: 0,
          tenderness: 1,
          chaos: 2,
          curiosity: 0,
          loyalty: 2,
        },
      },
      {
        label: 'Depende del tema',
        weights: {
          adventure: 0,
          tenderness: 0,
          chaos: 1,
          curiosity: 3,
          loyalty: 1,
        },
      },
      {
        label: 'Los dos al mismo tiempo',
        weights: {
          adventure: 1,
          tenderness: 3,
          chaos: 1,
          curiosity: 0,
          loyalty: 1,
        },
      },
      {
        label: 'Ninguno... lo llevamos muy en serio',
        weights: {
          adventure: 0,
          tenderness: 0,
          chaos: 3,
          curiosity: 0,
          loyalty: 0,
        },
      },
    ],
  },
  {
    id: 'superpower',
    question: 'Si pudiéramos tener un superpoder juntos, ¿cuál elegimos?',
    answers: [
      {
        label: 'Teletransportarnos a cualquier lugar',
        weights: {
          adventure: 3,
          tenderness: 1,
          chaos: 0,
          curiosity: 2,
          loyalty: 0,
        },
      },
      {
        label: 'Leer la mente del otro',
        weights: {
          adventure: 0,
          tenderness: 2,
          chaos: 1,
          curiosity: 3,
          loyalty: 0,
        },
      },
      {
        label: 'Detener el tiempo en los mejores momentos',
        weights: {
          adventure: 0,
          tenderness: 3,
          chaos: 0,
          curiosity: 0,
          loyalty: 3,
        },
      },
      {
        label: 'Crear nuevos mundos con la imaginación',
        weights: {
          adventure: 2,
          tenderness: 0,
          chaos: 2,
          curiosity: 3,
          loyalty: 0,
        },
      },
    ],
  },
  {
    id: 'gift',
    question: '¿Qué tipo de regalo nos haría más felices?',
    answers: [
      {
        label: 'Una experiencia que nunca hemos vivido',
        weights: {
          adventure: 3,
          tenderness: 1,
          chaos: 1,
          curiosity: 1,
          loyalty: 0,
        },
      },
      {
        label: 'Algo hecho a mano con cariño',
        weights: {
          adventure: 0,
          tenderness: 3,
          chaos: 0,
          curiosity: 0,
          loyalty: 3,
        },
      },
      {
        label: 'Algo absurdo que solo nosotros entendemos',
        weights: {
          adventure: 0,
          tenderness: 1,
          chaos: 3,
          curiosity: 1,
          loyalty: 2,
        },
      },
      {
        label: 'Un libro, disco o algo que nos haga pensar',
        weights: {
          adventure: 0,
          tenderness: 0,
          chaos: 0,
          curiosity: 3,
          loyalty: 1,
        },
      },
    ],
  },
];

export const ARCHETYPES = {
  adventure: {
    name: 'Casa de los Exploradores',
    traits: ['Aventura', 'Impulso', 'Descubrimiento'],
    description:
      'Su relación es un mapa que se va dibujando con cada paso. Siempre hay un lugar nuevo por descubrir juntos.',
    color: '#e67e22',
  },
  tenderness: {
    name: 'Casa del Abrazo Eterno',
    traits: ['Ternura', 'Calidez', 'Conexión'],
    description:
      'El refugio más seguro del mundo es el que construyen juntos. Cada momento pequeño es enorme.',
    color: '#e884b0',
  },
  chaos: {
    name: 'Casa del Caos Brillante',
    traits: ['Espontaneidad', 'Risa', 'Sorpresa'],
    description:
      'Donde otros ven desorden, ustedes ven aventura. La improvisación es su lenguaje de amor.',
    color: '#9b59b6',
  },
  curiosity: {
    name: 'Casa de los Soñadores',
    traits: ['Curiosidad', 'Imaginación', 'Profundidad'],
    description:
      'Cada conversación es un viaje. Se inspiran mutuamente a ver el mundo desde ángulos nuevos.',
    color: '#3498db',
  },
  loyalty: {
    name: 'Casa del Pacto Inquebrantable',
    traits: ['Lealtad', 'Constancia', 'Confianza'],
    description:
      'Lo que los une no es un momento, sino una promesa que se renueva cada día.',
    color: '#27ae60',
  },
};

export function calculateArchetype(answers) {
  const totals = {
    adventure: 0,
    tenderness: 0,
    chaos: 0,
    curiosity: 0,
    loyalty: 0,
  };

  for (const answer of answers) {
    for (const [trait, value] of Object.entries(answer.weights)) {
      totals[trait] += value;
    }
  }

  const winner = Object.entries(totals).reduce((a, b) =>
    a[1] >= b[1] ? a : b,
  );

  return { archetype: winner[0], totals };
}
