const STORAGE_KEY = 'birthday-adventure:v1';

export function loadProgress(fallback) {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);

    if (!raw) {
      return fallback;
    }

    const parsed = JSON.parse(raw);

    if (parsed?.schemaVersion !== 1) {
      return fallback;
    }

    return parsed;
  } catch (error) {
    console.error('Could not restore progress:', error);
    return fallback;
  }
}

export function saveProgress(progress) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch (error) {
    console.error('Could not save progress:', error);
  }
}

export function clearProgress() {
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Could not clear progress:', error);
  }
}
