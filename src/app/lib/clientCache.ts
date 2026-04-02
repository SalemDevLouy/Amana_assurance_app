type ProfileStatusResponse = {
  profileCompleted?: boolean;
};

const PROFILE_STATUS_KEY = "amana_profile_status_v1";

function canUseSessionStorage() {
  return globalThis.window?.sessionStorage !== undefined;
}

function readProfileStatusCache() {
  if (!canUseSessionStorage()) {
    return null;
  }

  const raw = globalThis.window.sessionStorage.getItem(PROFILE_STATUS_KEY);
  if (!raw) {
    return null;
  }

  return raw === "true";
}

export function setProfileStatusCache(profileCompleted: boolean) {
  if (!canUseSessionStorage()) {
    return;
  }

  globalThis.window.sessionStorage.setItem(PROFILE_STATUS_KEY, String(profileCompleted));
}

export async function getProfileStatusCached(forceRefresh = false) {
  if (!forceRefresh) {
    const cachedStatus = readProfileStatusCache();
    if (cachedStatus !== null) {
      return cachedStatus;
    }
  }

  const response = await fetch("/api/users", {
    method: "GET",
    cache: "force-cache",
  });

  if (!response.ok) {
    return null;
  }

  const data = (await response.json()) as ProfileStatusResponse;
  const profileCompleted = Boolean(data.profileCompleted);
  setProfileStatusCache(profileCompleted);

  return profileCompleted;
}

export function makeGuaranteesCacheKey(assuranceType: string) {
  return `amana_guarantees_${assuranceType}`;
}

export function readGuaranteesCache<T>(key: string) {
  if (!canUseSessionStorage()) {
    return null;
  }

  const raw = globalThis.window.sessionStorage.getItem(key);
  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

export function writeGuaranteesCache<T>(key: string, data: T) {
  if (!canUseSessionStorage()) {
    return;
  }

  globalThis.window.sessionStorage.setItem(key, JSON.stringify(data));
}
