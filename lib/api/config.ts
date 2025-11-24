export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "https://instapolicy.coverscrafter.com";

export const DEFAULT_HEADERS: Record<string, string> = {
  "Content-Type": "application/json",
};

export class ApiError extends Error {
  public readonly statusCode: number;
  public readonly errorCode: string;
  public readonly isOperational: boolean;
  public readonly details?: any;
  public readonly status: number; // Keep for backward compatibility

  constructor(message: string, statusCode: number, errorCode: string = 'UNKNOWN_ERROR', isOperational: boolean = true, details?: any) {
    super(message);
    this.name = "ApiError";
    this.statusCode = statusCode;
    this.status = statusCode; // Backward compatibility
    this.errorCode = errorCode;
    this.isOperational = isOperational;
    this.details = details;
  }
}
