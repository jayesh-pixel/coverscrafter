import { API_BASE_URL, ApiError, DEFAULT_HEADERS } from "./config";
import { getFreshIdToken } from "../firebase/auth";
import { getAuthSession, saveAuthSession } from "../utils/storage";

export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

interface ApiRequestOptions<TBody> {
  path: string;
  method?: HttpMethod;
  body?: TBody;
  headers?: Record<string, string>;
  authToken?: string;
  _isRetry?: boolean; // Internal flag to prevent infinite retries
}

export async function apiRequest<TResponse, TBody = unknown>({
  path,
  method = "GET",
  body,
  headers,
  authToken,
  _isRetry = false,
}: ApiRequestOptions<TBody>): Promise<TResponse> {
  const url = path.startsWith("http")
    ? path
    : path.startsWith("/api/")
      ? path
      : `${API_BASE_URL}${path}`;

  const mergedHeaders: Record<string, string> = {
    ...DEFAULT_HEADERS,
    ...headers,
  };

  if (authToken) {
    mergedHeaders.Authorization = `Bearer ${authToken}`;
  }

  const response = await fetch(url, {
    method,
    headers: mergedHeaders,
    body: body ? JSON.stringify(body) : undefined,
    cache: "no-store",
  });

  const contentType = response.headers.get("content-type");
  const isJson = contentType?.includes("application/json");
  const payload = isJson ? await response.json() : await response.text();

  if (!response.ok) {
    // Extract error message from StandardErrorResponse format
    const message = isJson && (payload?.message || payload?.error)
      ? (payload.message || payload.error)
      : response.statusText || "Request failed";
    
    const serverMsg = isJson && payload?.serverMsg ? payload.serverMsg : '';
    
    // Check if token is invalid or expired - only try refresh if this is not already a retry
    if (!_isRetry && 
        (response.status === 401 || response.status === 403) && 
        (message.toLowerCase().includes('invalid') || 
         message.toLowerCase().includes('expired') ||
         message.toLowerCase().includes('unauthorized')) &&
        (message.toLowerCase().includes('token') || response.status === 401)) {
      
      console.log('Token expired or invalid, attempting refresh...');
      
      // Try to refresh token
      const freshToken = await getFreshIdToken();
      
      if (freshToken && freshToken !== authToken) {
        // Update stored token
        const session = getAuthSession();
        if (session) {
          const isPersistent = !!(window.localStorage.getItem('coverscrafter.auth.token'));
          saveAuthSession(freshToken, session.user, isPersistent);
          
          console.log('Token refreshed successfully, retrying request...');
          
          // Retry the request with fresh token (with retry flag to prevent loop)
          return apiRequest({
            path,
            method,
            body,
            headers,
            authToken: freshToken,
            _isRetry: true, // Mark as retry to prevent infinite loop
          });
        }
      } else {
        console.log('Failed to refresh token, redirecting to login...');
        // If refresh failed, clear session and redirect to login
        if (typeof window !== 'undefined') {
          localStorage.removeItem('coverscrafter.auth.token');
          sessionStorage.removeItem('coverscrafter.auth.token');
          window.location.href = '/';
        }
      }
    }
    
    throw new ApiError(message, response.status, serverMsg);
  }

  return payload as TResponse;
}
