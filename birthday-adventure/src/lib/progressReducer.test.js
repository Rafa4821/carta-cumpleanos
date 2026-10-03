import { describe, expect, it } from 'vitest';
import { progressReducer } from './progressReducer';
import { initialProgress } from '../data/gameConfig';

describe('progressReducer', () => {
  it('starts adventure', () => {
    const next = progressReducer(initialProgress, {
      type: 'START_ADVENTURE',
    });
    expect(next.adventure.started).toBe(true);
    expect(next.adventure.startedAt).toBeTypeOf('number');
  });

  it('does not overwrite startedAt on subsequent START_ADVENTURE', () => {
    const first = progressReducer(initialProgress, {
      type: 'START_ADVENTURE',
    });
    const second = progressReducer(first, { type: 'START_ADVENTURE' });
    expect(second.adventure.startedAt).toBe(first.adventure.startedAt);
  });

  it('starts a world', () => {
    const next = progressReducer(initialProgress, {
      type: 'START_WORLD',
      worldId: 'magic',
    });
    expect(next.worlds.magic.status).toBe('in_progress');
  });

  it('completes a world and adds item to inventory', () => {
    const next = progressReducer(initialProgress, {
      type: 'COMPLETE_WORLD',
      worldId: 'magic',
      itemId: 'magic-fragment',
    });
    expect(next.worlds.magic.status).toBe('completed');
    expect(next.worlds.magic.completedAt).toBeTypeOf('number');
    expect(next.inventory).toContain('magic-fragment');
  });

  it('COMPLETE_WORLD does not duplicate items', () => {
    let state = progressReducer(initialProgress, {
      type: 'COMPLETE_WORLD',
      worldId: 'magic',
      itemId: 'magic-fragment',
    });
    state = progressReducer(state, {
      type: 'COMPLETE_WORLD',
      worldId: 'magic',
      itemId: 'magic-fragment',
    });
    expect(state.inventory.filter((i) => i === 'magic-fragment')).toHaveLength(
      1,
    );
  });

  it('verifies physical token', () => {
    const next = progressReducer(initialProgress, {
      type: 'VERIFY_PHYSICAL_TOKEN',
    });
    expect(next.physicalQuest.tokenVerified).toBe(true);
    expect(next.physicalQuest.verifiedAt).toBeTypeOf('number');
  });

  it('completes photo puzzle', () => {
    const next = progressReducer(initialProgress, {
      type: 'COMPLETE_PHOTO_PUZZLE',
    });
    expect(next.photoPuzzle.completed).toBe(true);
  });

  it('completes detective and unlocks safe', () => {
    const next = progressReducer(initialProgress, {
      type: 'COMPLETE_DETECTIVE',
    });
    expect(next.detective.completed).toBe(true);
    expect(next.safe.unlocked).toBe(true);
  });

  it('unlocks letter', () => {
    const next = progressReducer(initialProgress, {
      type: 'UNLOCK_LETTER',
    });
    expect(next.safe.completed).toBe(true);
    expect(next.letter.unlocked).toBe(true);
  });

  it('updates settings', () => {
    const next = progressReducer(initialProgress, {
      type: 'UPDATE_SETTINGS',
      payload: { soundEnabled: false },
    });
    expect(next.settings.soundEnabled).toBe(false);
    expect(next.settings.ambienceVolume).toBe(0.3);
  });

  it('resets state', () => {
    const modified = progressReducer(initialProgress, {
      type: 'START_ADVENTURE',
    });
    const reset = progressReducer(modified, {
      type: 'RESET',
      initialState: initialProgress,
    });
    expect(reset.adventure.started).toBe(false);
  });

  it('returns state for unknown action', () => {
    const next = progressReducer(initialProgress, {
      type: 'UNKNOWN_ACTION',
    });
    expect(next).toBe(initialProgress);
  });
});
