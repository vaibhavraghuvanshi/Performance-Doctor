import {
  apiUrl,
  authBearerHeaders,
  readJsonError,
  setStoredAuthToken,
} from "./apiBase";

export interface AuthUser {
  id: string;
  email: string;
  displayName: string;
  createdAt: string;
}

export interface AuthResponse {
  token: string;
  user: AuthUser;
}

async function parseJson<T>(response: Response): Promise<T> {
  if (!response.ok) {
    throw new Error(await readJsonError(response));
  }
  return response.json() as Promise<T>;
}

export async function registerAccount(input: {
  email: string;
  password: string;
  displayName?: string;
}): Promise<AuthResponse> {
  const response = await fetch(apiUrl("/auth/register"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  const data = await parseJson<AuthResponse>(response);
  setStoredAuthToken(data.token);
  return data;
}

export async function loginAccount(input: {
  email: string;
  password: string;
}): Promise<AuthResponse> {
  const response = await fetch(apiUrl("/auth/login"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  const data = await parseJson<AuthResponse>(response);
  setStoredAuthToken(data.token);
  return data;
}

export async function fetchCurrentUser(): Promise<AuthUser> {
  const response = await fetch(apiUrl("/auth/me"), {
    headers: {
      ...authBearerHeaders(),
    },
  });
  const data = await parseJson<{ user: AuthUser }>(response);
  return data.user;
}

export function clearSession(): void {
  setStoredAuthToken(null);
}
