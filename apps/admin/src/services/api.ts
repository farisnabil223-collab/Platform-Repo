/* eslint-disable no-undef */
import { ApiResponseEnvelope } from '@eduverse/types';
import { NetworkError, AuthenticationError, ValidationError, UnknownError, logger } from '@eduverse/ui';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1';
const DEFAULT_TIMEOUT = 10000; // 10 seconds

interface RequestConfig extends RequestInit {
  timeout?: number;
  retry?: number;
  retryDelay?: number;
}

class ApiClient {
  private async request<T>(path: string, config: RequestConfig = {}): Promise<ApiResponseEnvelope<T>> {
    const { timeout = DEFAULT_TIMEOUT, retry = 2, retryDelay = 1000, ...options } = config;

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

        // 3. RESPONSE INTERCEPTOR: Handle status codes and map to typed errors
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

        const data = await response.json();
        return data as ApiResponseEnvelope<T>;
      } catch (err: any) {
        clearTimeout(timeoutId);

        if (err.name === 'AbortError') {
          throw new NetworkError('Request timed out.');
        }

        // 4. RETRY STRATEGY: Exponential backoff
        if (attempt < retry && !(err instanceof AuthenticationError) && !(err instanceof ValidationError)) {
          attempt++;
          const delay = retryDelay * Math.pow(2, attempt);
          logger.warn(`API execution failed. Retrying in ${delay}ms... (Attempt ${attempt}/${retry})`);
          await new Promise((resolve) => setTimeout(resolve, delay));
          return executeFetch();
        }

        if (err instanceof AuthenticationError || err instanceof ValidationError || err instanceof NetworkError) {
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
}

export const api = new ApiClient();
export default api;
