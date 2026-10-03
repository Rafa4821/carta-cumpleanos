import { describe, expect, it, beforeEach, vi } from 'vitest';
import { loadProgress, saveProgress, clearProgress } from './storage';

const mockStorage = (() => {
  let store = {};
  return {
    getItem: vi.fn((key) => store[key] ?? null),
    setItem: vi.fn((key, value) => {
      store[key] = value;
    }),
    removeItem: vi.fn((key) => {
      delete store[key];
    }),
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(window, 'localStorage', { value: mockStorage });

const fallback = { schemaVersion: 1, test: true };

describe('storage', () => {
  beforeEach(() => {
    mockStorage.clear();
    vi.clearAllMocks();
  });

  it('returns fallback when nothing stored', () => {
    expect(loadProgress(fallback)).toBe(fallback);
  });

  it('saves and loads progress', () => {
    const data = { schemaVersion: 1, adventure: { started: true } };
    saveProgress(data);
    const loaded = loadProgress(fallback);
    expect(loaded.adventure.started).toBe(true);
  });

  it('returns fallback for invalid JSON', () => {
    mockStorage.getItem.mockReturnValueOnce('not-json');
    expect(loadProgress(fallback)).toBe(fallback);
  });

  it('returns fallback for wrong schemaVersion', () => {
    mockStorage.getItem.mockReturnValueOnce(
      JSON.stringify({ schemaVersion: 99 }),
    );
    expect(loadProgress(fallback)).toBe(fallback);
  });

  it('clears progress', () => {
    saveProgress(fallback);
    clearProgress();
    expect(loadProgress(fallback)).toBe(fallback);
  });
});
