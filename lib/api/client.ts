import { API_BASE_URL, ApiError, DEFAULT_HEADERS } from "./config";

export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

interface ApiRequestOptions<TBody> {
  path: string;
  method?: HttpMethod;
  body?: TBody;
  headers?: Record<string, string>;
  authToken?: string;
}

export async function apiRequest<TResponse, TBody = unknown>({
  path,
  method = "GET",
  body,
  headers,
  authToken,
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
    const message = isJson && (payload?.message || payload?.error) 
      ? (payload.message || payload.error) 
      : response.statusText || "Request failed";
    throw new ApiError(message, response.status, payload);
  }

  return payload as TResponse;
}
