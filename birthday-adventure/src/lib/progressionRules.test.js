import { describe, expect, it } from 'vitest';
import {
  isWorldComplete,
  hasCompletedAllWorlds,
  canAccessSortingHat,
  canAccessOpenWorlds,
  canAccessPhysicalQuest,
  canAccessMemories,
  canAccessDetective,
  canAccessSafe,
  canAccessLetter,
} from './progressionRules';
import { initialProgress } from '../data/gameConfig';
import { progressReducer } from './progressReducer';

function completeWorld(state, worldId, itemId) {
  return progressReducer(state, {
    type: 'COMPLETE_WORLD',
    worldId,
    itemId,
  });
}

describe('progressionRules', () => {
  it('magic is not complete initially', () => {
    expect(isWorldComplete(initialProgress, 'magic')).toBe(false);
  });

  it('canAccessSortingHat requires magic completed', () => {
    expect(canAccessSortingHat(initialProgress)).toBe(false);
    const s = completeWorld(initialProgress, 'magic', 'magic-fragment');
    expect(canAccessSortingHat(s)).toBe(true);
  });

  it('canAccessOpenWorlds requires sortingHat completed', () => {
    let s = completeWorld(initialProgress, 'magic', 'magic-fragment');
    expect(canAccessOpenWorlds(s)).toBe(false);
    s = completeWorld(s, 'sortingHat', 'relationship-crest');
    expect(canAccessOpenWorlds(s)).toBe(true);
  });

  it('five worlds enable physical quest', () => {
    let s = initialProgress;
    s = completeWorld(s, 'magic', 'magic-fragment');
    s = completeWorld(s, 'sortingHat', 'relationship-crest');
    s = completeWorld(s, 'music', 'golden-note');
    s = completeWorld(s, 'library', 'bookmark');
    expect(canAccessPhysicalQuest(s)).toBe(false);
    s = completeWorld(s, 'believe', 'believe-token');
    expect(canAccessPhysicalQuest(s)).toBe(true);
    expect(hasCompletedAllWorlds(s)).toBe(true);
  });

  it('canAccessMemories requires token verified', () => {
    expect(canAccessMemories(initialProgress)).toBe(false);
    const s = progressReducer(initialProgress, {
      type: 'VERIFY_PHYSICAL_TOKEN',
    });
    expect(canAccessMemories(s)).toBe(true);
  });

  it('canAccessDetective requires photo puzzle completed', () => {
    expect(canAccessDetective(initialProgress)).toBe(false);
    const s = progressReducer(initialProgress, {
      type: 'COMPLETE_PHOTO_PUZZLE',
    });
    expect(canAccessDetective(s)).toBe(true);
  });

  it('canAccessSafe requires detective completed', () => {
    expect(canAccessSafe(initialProgress)).toBe(false);
    const s = progressReducer(initialProgress, {
      type: 'COMPLETE_DETECTIVE',
    });
    expect(canAccessSafe(s)).toBe(true);
  });

  it('canAccessLetter requires safe completed', () => {
    expect(canAccessLetter(initialProgress)).toBe(false);
    const s = progressReducer(initialProgress, {
      type: 'UNLOCK_LETTER',
    });
    expect(canAccessLetter(s)).toBe(true);
  });
});
