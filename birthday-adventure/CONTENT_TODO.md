# Content TODO - Birthday Adventure

Este archivo lista todo el contenido personal que necesitas proporcionar para completar la aventura.
Los items marcados con `[ ]` están pendientes. Marca con `[x]` cuando los completes.

## Datos personales

- [ ] **Nombre/apodo de ella:**
- [ ] **Fecha del cumpleaños:**
- [ ] **Código final de la caja fuerte** (actualmente: 72146, basado en los 5 mundos)

## Harry Potter

- [ ] Casa HP favorita:
- [ ] Personajes HP favoritos:
- [ ] Libro/película HP favorita:
- [ ] Tres hechizos o elementos favoritos:

## Música

- [ ] 3-5 canciones favoritas de **Rawayana** (con IDs de Spotify para embeds):
- [ ] 3-5 canciones favoritas de **LAGOS** (con IDs de Spotify para embeds):
- [ ] 3-5 canciones favoritas de **Los Mesoneros** (con IDs de Spotify para embeds):
- [ ] Canciones especiales para la relación (y en qué orden entraron a su historia):

### Cómo obtener IDs de Spotify

1. Abre Spotify y busca la canción
2. Click derecho → Compartir → Copiar enlace
3. El enlace tiene formato: `https://open.spotify.com/track/XXXXXXXXXXXX`
4. El embed se forma así: `https://open.spotify.com/embed/track/XXXXXXXXXXXX`

## Ted Lasso

- [ ] Personajes favoritos de Ted Lasso:
- [ ] Episodios/momentos favoritos:

## Nuestra historia

- [ ] 5-10 anécdotas de ustedes (para la biblioteca y las pistas):
- [ ] Fechas importantes:
- [ ] Respuestas a los acertijos de la biblioteca (actualmente son placeholder):

## Preguntas del Sombrero

Las preguntas actuales son genéricas. Puedes personalizarlas en:
`src/data/worlds/sortingHat.js`

## Fotografías

- [ ] 3-5 fotos de ustedes (para el puzzle y la carta)
  - Formato recomendado: WebP, máximo 500 KB cada una
  - Colocar en: `src/assets/images/memories/`
  - La foto del puzzle va en: `public/images/memories/couple-puzzle.webp`

## Búsqueda física

- [ ] Lugar físico donde esconderás el QR:
- [ ] Token personalizado (actualmente: `7nA4PqR2`):
  - Cambiar en: `src/pages/PhysicalQuestPage.jsx` y `src/pages/QRValidationPage.jsx`

## La carta

- [ ] Texto definitivo de la carta
  - Editar en: `src/pages/LetterPage.jsx` (constante `LETTER_CONTENT`)
  - Eventualmente mover a: `src/data/letter.js`

## Frase final / Epílogo

- [ ] Frase final del epílogo:
  - Editar en: `src/pages/EpiloguePage.jsx`

## Assets visuales

- [ ] Ilustración del estudio mágico (fondo mundo magia)
- [ ] Ilustración del vestuario (fondo mundo believe)
- [ ] Favicon personalizado

## Archivos a editar con contenido real

| Archivo                           | Qué editar                          |
| --------------------------------- | ----------------------------------- |
| `src/data/worlds/magic.js`        | Objetos escondidos, preguntas       |
| `src/data/worlds/sortingHat.js`   | Preguntas del quiz                  |
| `src/data/worlds/music.js`        | Canciones, Spotify embeds, playlist |
| `src/data/worlds/library.js`      | Páginas, acertijos, recuerdos       |
| `src/data/worlds/believe.js`      | Preguntas trivia Ted Lasso          |
| `src/data/inventory.js`           | Código de caja fuerte               |
| `src/pages/LetterPage.jsx`        | Texto de la carta                   |
| `src/pages/EpiloguePage.jsx`      | Frase final                         |
| `src/pages/PhysicalQuestPage.jsx` | Token QR                            |
| `src/pages/QRValidationPage.jsx`  | Token QR                            |
