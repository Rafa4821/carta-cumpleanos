import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import { RouteGuard } from './RouteGuard';
import {
  canAccessLetter,
  canAccessMemories,
  canAccessPhysicalQuest,
  canAccessDetective,
  canAccessSafe,
  canAccessSortingHat,
  canAccessOpenWorlds,
} from '../lib/progressionRules';
import LoadingScene from '../components/common/LoadingScene';

const LandingPage = lazy(() => import('../pages/LandingPage'));
const ProloguePage = lazy(() => import('../pages/ProloguePage'));
const AdventureHubPage = lazy(() => import('../pages/AdventureHubPage'));
const MagicWorld = lazy(() => import('../games/magic/MagicWorld'));
const SortingHatWorld = lazy(
  () => import('../games/sorting-hat/SortingHatWorld'),
);
const MusicWorld = lazy(() => import('../games/music/MusicWorld'));
const LibraryWorld = lazy(() => import('../games/library/LibraryWorld'));
const BelieveWorld = lazy(() => import('../games/believe/BelieveWorld'));
const PhysicalQuestPage = lazy(() => import('../pages/PhysicalQuestPage'));
const QRValidationPage = lazy(() => import('../pages/QRValidationPage'));
const MemoriesPage = lazy(() => import('../pages/MemoriesPage'));
const DetectiveWorld = lazy(() => import('../games/detective/DetectiveWorld'));
const SafePage = lazy(() => import('../pages/SafePage'));
const LetterPage = lazy(() => import('../pages/LetterPage'));
const EpiloguePage = lazy(() => import('../pages/EpiloguePage'));
const NotFoundPage = lazy(() => import('../pages/NotFoundPage'));

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Suspense fallback={<LoadingScene />}>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/prologo" element={<ProloguePage />} />
          <Route path="/aventura" element={<AdventureHubPage />} />

          <Route path="/mundo/magia" element={<MagicWorld />} />
          <Route
            path="/mundo/sombrero"
            element={
              <RouteGuard canAccess={canAccessSortingHat}>
                <SortingHatWorld />
              </RouteGuard>
            }
          />
          <Route
            path="/mundo/musica"
            element={
              <RouteGuard canAccess={canAccessOpenWorlds}>
                <MusicWorld />
              </RouteGuard>
            }
          />
          <Route
            path="/mundo/biblioteca"
            element={
              <RouteGuard canAccess={canAccessOpenWorlds}>
                <LibraryWorld />
              </RouteGuard>
            }
          />
          <Route
            path="/mundo/believe"
            element={
              <RouteGuard canAccess={canAccessOpenWorlds}>
                <BelieveWorld />
              </RouteGuard>
            }
          />

          <Route
            path="/busqueda-fisica"
            element={
              <RouteGuard canAccess={canAccessPhysicalQuest}>
                <PhysicalQuestPage />
              </RouteGuard>
            }
          />
          <Route path="/qr/:token" element={<QRValidationPage />} />
          <Route
            path="/recuerdos"
            element={
              <RouteGuard canAccess={canAccessMemories}>
                <MemoriesPage />
              </RouteGuard>
            }
          />
          <Route
            path="/investigacion"
            element={
              <RouteGuard canAccess={canAccessDetective}>
                <DetectiveWorld />
              </RouteGuard>
            }
          />
          <Route
            path="/caja-fuerte"
            element={
              <RouteGuard canAccess={canAccessSafe}>
                <SafePage />
              </RouteGuard>
            }
          />
          <Route
            path="/carta"
            element={
              <RouteGuard canAccess={canAccessLetter}>
                <LetterPage />
              </RouteGuard>
            }
          />

          <Route path="/epilogo" element={<EpiloguePage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
