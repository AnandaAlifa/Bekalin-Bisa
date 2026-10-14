import { apiBaseUrl } from '../config/env';

export class ApiError extends Error {
  readonly status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

export async function apiGet<T>(path: string, signal?: AbortSignal): Promise<T> {
  let response: Response;
  try {
    response = await fetch(`${apiBaseUrl}${path}`, {
      method: 'GET',
      headers: { Accept: 'application/json' },
      signal,
    });
  } catch {
    throw new ApiError(0, 'Tidak dapat terhubung ke server. Pastikan backend berjalan.');
  }

  if (!response.ok) {
    let detail = `Permintaan gagal (HTTP ${response.status}).`;
    try {
      const body = (await response.json()) as { detail?: unknown };
      if (body && typeof body.detail === 'string' && body.detail) {
        detail = body.detail;
      }
    } catch {
      // respons bukan JSON — pakai pesan default
    }
    throw new ApiError(response.status, detail);
  }

  return (await response.json()) as T;
}

export function getHealth(signal?: AbortSignal): Promise<{ status: string }> {
  return apiGet<{ status: string }>('/health', signal);
}
