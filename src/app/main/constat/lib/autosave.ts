export const AUTOSAVE_PREFIX = "amana_constat_";

export function saveDraft(key: string, data: unknown) {
  try {
    const payload = JSON.stringify({ data, ts: Date.now() });
    localStorage.setItem(AUTOSAVE_PREFIX + key, payload);
  } catch (err) {
    // noop
    console.error("autosave.saveDraft error", err);
  }
}

export function loadDraft<T = any>(key: string): T | null {
  try {
    const raw = localStorage.getItem(AUTOSAVE_PREFIX + key);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return parsed?.data ?? null;
  } catch (err) {
    console.error("autosave.loadDraft error", err);
    return null;
  }
}

export function clearDraft(key: string) {
  try {
    localStorage.removeItem(AUTOSAVE_PREFIX + key);
  } catch (err) {
    // noop
  }
}
