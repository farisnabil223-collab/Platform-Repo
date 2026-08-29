/* eslint-disable no-undef */
import { ApiResponseEnvelope } from '@eduverse/types';
import { NetworkError, AuthenticationError, ValidationError, UnknownError } from '@eduverse/ui';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1';
const DEFAULT_TIMEOUT = 5000; // 5 seconds default timeout for reliable network UX

interface RequestConfig extends RequestInit {
  timeout?: number;
  retry?: number;
  retryDelay?: number;
  skipCache?: boolean;
}

// In-memory cache for GET endpoints
const cache = new Map<string, { data: any; timestamp: number }>();
const CACHE_TTL = 300000; // 5 minutes TTL for fast page switches

class ApiClient {
  private async request<T>(path: string, config: RequestConfig = {}): Promise<ApiResponseEnvelope<T>> {
    const { timeout = DEFAULT_TIMEOUT, retry = 0, retryDelay = 200, skipCache = false, ...options } = config;

    // Check GET cache for instant page navigation
    const method = (options.method || 'GET').toUpperCase();
    if (method === 'GET' && !skipCache) {
      const cached = cache.get(path);
      if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
        return cached.data as ApiResponseEnvelope<T>;
      }
    }

    // 1. REQUEST INTERCEPTOR: Append auth token from localStorage
    const token = typeof window !== 'undefined' ? localStorage.getItem('eduverse-token') : null;
    const headers = new Headers(options.headers);
    
    headers.set('Content-Type', 'application/json');
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }

    // 2. TIMEOUT / CANCELLATION: Setup AbortController
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    const fetchOptions: RequestInit = {
      ...options,
      headers,
      signal: controller.signal,
    };

    let attempt = 0;

    const executeFetch = async (): Promise<ApiResponseEnvelope<T>> => {
      try {
        const response = await fetch(`${API_BASE_URL}${path}`, fetchOptions);
        clearTimeout(timeoutId);

        if (!response.ok) {
          if (response.status === 401) {
            throw new AuthenticationError('Session expired. Please sign in again.');
          }
          if (response.status === 422) {
            const body = await response.json().catch(() => ({}));
            throw new ValidationError('Validation failed.', body?.errors);
          }
          throw new UnknownError(`HTTP request failed with status: ${response.status}`);
        }

        const data = (await response.json()) as ApiResponseEnvelope<T>;
        if (method === 'GET' && data?.success) {
          cache.set(path, { data, timestamp: Date.now() });
        }
        return data;
      } catch (err: any) {
        clearTimeout(timeoutId);

        // RETRY STRATEGY
        if (attempt < retry && !(err instanceof AuthenticationError) && !(err instanceof ValidationError)) {
          attempt++;
          const delay = retryDelay * Math.pow(2, attempt);
          await new Promise((resolve) => setTimeout(resolve, delay));
          return executeFetch();
        }

        // For GET requests, return cached data if available or a non-throwing fallback response
        if (method === 'GET') {
          const cached = cache.get(path);
          if (cached) {
            return cached.data as ApiResponseEnvelope<T>;
          }
          return {
            success: false,
            data: null as any,
            error: {
              code: 'NETWORK_ERROR',
              message: err?.name === 'AbortError' ? 'Request timed out.' : (err?.message || 'Network request failed.'),
            },
            traceId: 'client-fallback',
            timestamp: new Date().toISOString(),
          };
        }

        if (err.name === 'AbortError') {
          throw new NetworkError('Request timed out.');
        }

        if (
          err instanceof AuthenticationError ||
          err instanceof ValidationError ||
          err instanceof NetworkError ||
          err instanceof UnknownError
        ) {
          throw err;
        }
        
        throw new NetworkError(err?.message || 'A network error occurred.');
      }
    };

    return executeFetch();
  }

  get<T>(path: string, config?: RequestConfig) {
    return this.request<T>(path, { ...config, method: 'GET' });
  }

  post<T>(path: string, body: any, config?: RequestConfig) {
    return this.request<T>(path, {
      ...config,
      method: 'POST',
      body: JSON.stringify(body),
    });
  }

  put<T>(path: string, body: any, config?: RequestConfig) {
    return this.request<T>(path, {
      ...config,
      method: 'PUT',
      body: JSON.stringify(body),
    });
  }

  delete<T>(path: string, config?: RequestConfig) {
    return this.request<T>(path, { ...config, method: 'DELETE' });
  }

  clearCache() {
    cache.clear();
  }
}

export const api = new ApiClient();
export default api;

