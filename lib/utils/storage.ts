const TOKEN_KEY = "coverscrafter.auth.token";
const USER_KEY = "coverscrafter.auth.user";

function getStorage(persist: boolean) {
  if (typeof window === "undefined") {
    return undefined;
  }
  return persist ? window.localStorage : window.sessionStorage;
}

/**
 * Decode JWT token and check expiry
 */
function isTokenExpired(token: string): boolean {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const exp = payload.exp;
    
    if (!exp) return false; // No expiry in token
    
    // Check if token expires in next 5 minutes
    const now = Math.floor(Date.now() / 1000);
    return exp < (now + 300); // 5 minutes buffer
  } catch (error) {
    console.error('Failed to decode token:', error);
    return true; // Treat as expired if we can't decode
  }
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

/**
 * Get valid auth token - refresh if expired
 */
export async function getValidAuthToken(): Promise<string | null> {
  if (typeof window === "undefined") {
    return null;
  }

  const session = getAuthSession();
  if (!session) {
    return null;
  }

  // Check if token is expired or about to expire
  if (isTokenExpired(session.token)) {
    console.log('Token expired or expiring soon, refreshing...');
    
    // Try to refresh token
    const { getFreshIdToken } = await import('../firebase/auth');
    const freshToken = await getFreshIdToken();
    
    if (freshToken) {
      const isPersistent = !!(window.localStorage.getItem(TOKEN_KEY));
      saveAuthSession(freshToken, session.user, isPersistent);
      console.log('Token refreshed successfully');
      return freshToken;
    } else {
      console.log('Failed to refresh token');
      clearAuthSession();
      return null;
    }
  }

  return session.token;
}
