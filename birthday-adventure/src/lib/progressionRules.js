export function isWorldComplete(state, worldId) {
  return state.worlds[worldId]?.status === 'completed';
}

export function hasCompletedAllWorlds(state) {
  return Object.values(state.worlds).every(
    (world) => world.status === 'completed',
  );
}

export function canAccessSortingHat(state) {
  return isWorldComplete(state, 'magic');
}

export function canAccessOpenWorlds(state) {
  return isWorldComplete(state, 'sortingHat');
}

export function canAccessPhysicalQuest(state) {
  return hasCompletedAllWorlds(state);
}

export function canAccessMemories(state) {
  return state.physicalQuest.tokenVerified;
}

export function canAccessDetective(state) {
  return state.photoPuzzle.completed;
}

export function canAccessSafe(state) {
  return state.detective?.completed;
}

export function canAccessLetter(state) {
  return state.safe.completed;
}

export function getCompletedWorldCount(state) {
  return Object.values(state.worlds).filter((w) => w.status === 'completed')
    .length;
}

export function getNextAvailableWorld(state) {
  if (!isWorldComplete(state, 'magic')) return 'magic';
  if (!isWorldComplete(state, 'sortingHat')) return 'sortingHat';

  const openWorlds = ['music', 'library', 'believe'];
  const next = openWorlds.find(
    (id) => state.worlds[id]?.status !== 'completed',
  );
  return next || null;
}
