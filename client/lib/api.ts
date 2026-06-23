import axios, { AxiosError } from "axios";

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

export interface ShortenResponse {
  shortCode: string;
  shortUrl: string;
}

export interface StatsResponse {
  shortCode: string;
  originalUrl: string;
  clicks: number;
  createdAt: string;
}

export async function shortenUrl(
  originalUrl: string
): Promise<ShortenResponse> {
  const res = await api.post<ShortenResponse>(
    "/shorten",
    { originalUrl }
  );

  return res.data;
}

export async function getStats(
  code: string
): Promise<StatsResponse> {
  const res = await api.get<StatsResponse>(
    `/${code}/stats`
  );

  return res.data;
}

export function getErrorMessage(
  error: unknown
): string {
  const err = error as AxiosError<{
    error: string;
  }>;

  return (
    err.response?.data?.error ??
    "Something went wrong"
  );
}