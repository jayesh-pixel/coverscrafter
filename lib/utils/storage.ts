const TOKEN_KEY = "coverscrafter.auth.token";
const USER_KEY = "coverscrafter.auth.user";

function getStorage(persist: boolean) {
  if (typeof window === "undefined") {
    return undefined;
  }
  return persist ? window.localStorage : window.sessionStorage;
}

export function saveAuthSession(token: string, user: unknown, persist: boolean) {
  const storage = getStorage(persist);
  if (!storage) return;
  storage.setItem(TOKEN_KEY, token);
  storage.setItem(USER_KEY, JSON.stringify(user));
}

export function clearAuthSession() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(TOKEN_KEY);
  window.localStorage.removeItem(USER_KEY);
  window.sessionStorage.removeItem(TOKEN_KEY);
  window.sessionStorage.removeItem(USER_KEY);
}

export function getAuthSession() {
  if (typeof window === "undefined") {
    return null;
  }

  const storedToken = window.sessionStorage.getItem(TOKEN_KEY) ?? window.localStorage.getItem(TOKEN_KEY);
  const storedUser = window.sessionStorage.getItem(USER_KEY) ?? window.localStorage.getItem(USER_KEY);

  if (!storedToken || !storedUser) {
    return null;
  }

  try {
    return {
      token: storedToken,
      user: JSON.parse(storedUser),
    };
  } catch (error) {
    clearAuthSession();
    return null;
  }
}
