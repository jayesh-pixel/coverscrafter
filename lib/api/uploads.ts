import { ApiError } from "./config";

export interface UploadResponse {
  id?: string;
  fileId?: string;
  name?: string;
  fileName?: string;
  originalName?: string;
  downloadUrl?: string;
  url?: string;
  message?: string;
  data?: Record<string, unknown>;
  raw?: unknown;
  [key: string]: unknown;
}

export async function uploadDocument(file: File, authToken: string, fieldName = "file"): Promise<UploadResponse> {
  const formData = new FormData();
  formData.append(fieldName, file);

  const response = await fetch("https://instapolicy.coverscrafter.com/v1/uploads", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
    body: formData,
  });

  const contentType = response.headers.get("content-type");
  const isJson = contentType?.includes("application/json");
  const payload = isJson ? await response.json() : await response.text();

  if (!response.ok) {
    const message = isJson && payload?.message ? String(payload.message) : "Failed to upload document.";
    const serverMsg = isJson && payload?.serverMsg ? String(payload.serverMsg) : '';
    throw new ApiError(message, response.status, serverMsg);
  }

  if (!isJson) {
    return typeof payload === "string"
      ? { url: payload }
      : { raw: payload };
  }

  return payload as UploadResponse;
}
