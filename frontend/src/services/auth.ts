import { apiPost } from './api';

const TOKEN_KEY = 'bekalin.auth.token';

export interface BackendAuthUser {
  id: number;
  email: string;
  username: string;
  role: 'student' | 'admin';
  bio: string | null;
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  user: BackendAuthUser;
}

export interface RegisterInput {
  email: string;
  password: string;
  username: string;
}

export function apiRegister(input: RegisterInput): Promise<BackendAuthUser> {
  return apiPost<BackendAuthUser>('/auth/register', input);
}

export function apiLogin(email: string, password: string): Promise<LoginResponse> {
  return apiPost<LoginResponse>('/auth/login', { email, password });
}

export function saveAccessToken(token: string): void {
  try {
    sessionStorage.setItem(TOKEN_KEY, token);
  } catch {
    /* sessionStorage tidak tersedia */
  }
}

export function getAccessToken(): string | null {
  try {
    return sessionStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

export function clearAccessToken(): void {
  try {
    sessionStorage.removeItem(TOKEN_KEY);
  } catch {
    /* sessionStorage tidak tersedia */
  }
}
