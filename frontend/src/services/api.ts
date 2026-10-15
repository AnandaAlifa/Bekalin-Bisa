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
    throw await toApiError(response);
  }

  return (await response.json()) as T;
}

export async function apiPost<T>(path: string, body: unknown): Promise<T> {
  let response: Response;
  try {
    response = await fetch(`${apiBaseUrl}${path}`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
  } catch {
    throw new ApiError(0, 'Tidak dapat terhubung ke server. Pastikan backend berjalan.');
  }

  if (!response.ok) {
    throw await toApiError(response);
  }

  return (await response.json()) as T;
}

async function toApiError(response: Response): Promise<ApiError> {
  let detail = `Permintaan gagal (HTTP ${response.status}).`;
  try {
    const body = (await response.json()) as { detail?: unknown };
    if (body && typeof body.detail === 'string' && body.detail) {
      detail = body.detail;
    } else if (body && Array.isArray(body.detail)) {
      const messages = body.detail
        .map((item) =>
          item && typeof item === 'object' && 'msg' in item ? String((item as { msg: unknown }).msg) : '',
        )
        .filter(Boolean);
      if (messages.length > 0) {
        detail = messages.join('; ');
      }
    }
  } catch {
    // respons bukan JSON — pakai pesan default
  }
  return new ApiError(response.status, detail);
}

export function getHealth(signal?: AbortSignal): Promise<{ status: string }> {
  return apiGet<{ status: string }>('/health', signal);
}
