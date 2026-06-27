import axios, { AxiosError } from 'axios';

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

//attach jwt if it exists
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') { //run on client only
    const token = localStorage.getItem('token');

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }

  return config;
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
  expiresAt: Date | null;
}

export async function shortenUrl(
  originalUrl: string,
  customCode?:string,
  expiresAt?:string,
): Promise<ShortenResponse> {
  const res = await api.post<ShortenResponse>('/shorten', { originalUrl,customCode,expiresAt });

  return res.data;
}

export async function getStats(
  code: string
): Promise<StatsResponse> {
  const res = await api.get<StatsResponse>(`/${code}/stats`);

  return res.data;
}

export async function login(
  email: string,
  password: string,
): Promise<{ token: string,email:string,username:string }> {
  const res = await api.post<{ token: string,email:string,username:string}>(
    '/auth/login',
    { email, password }
  );

  return res.data;
}

export async function register(
  email: string,
  password: string
): Promise<{token: string,email:string,username:string}> {
  const res = await api.post<{token: string,email:string,username:string}>(
    '/auth/register',
    { email, password }
  );

  return res.data;
}

export async function getMyLinks(): Promise<StatsResponse[]> {
  const res = await api.get<StatsResponse[]>('/urls/my-links');

  return res.data;
}

export function getErrorMessage(error: unknown): string {
  const err = error as AxiosError<{ error: string }>;

  return err.response?.data?.error ?? 'Something went wrong!';
}