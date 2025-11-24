export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "https://instapolicy.coverscrafter.com";

export const DEFAULT_HEADERS: Record<string, string> = {
  "Content-Type": "application/json",
};

export class ApiError extends Error {
  public readonly status: number;
  public readonly serverMsg: string;

  constructor(message: string, status: number, serverMsg: string = '') {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.serverMsg = serverMsg;
  }
}
