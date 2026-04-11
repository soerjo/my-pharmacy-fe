import { TokenManager } from "@/features/auth/services/token-manager";
import { API_ROUTES } from "@/constants";

type RequestOptions = {
  body?: string;
  headers?: Record<string, string>;
  skipAuth?: boolean;
};

class ApiClient {
  private baseUrl: string;
  private isRefreshing: boolean = false;
  private refreshSubscribers: Array<(token: string) => void> = [];

  constructor(baseUrl = process.env.NEXT_PUBLIC_API_URL ?? "") {
    this.baseUrl = baseUrl;
  }

  private getAuthHeaders(skipAuth: boolean = false): Record<string, string> {
    if (skipAuth) return {};
    
    const token = TokenManager.getAccessToken();
    if (!token) return {};

    return {
      Authorization: `Bearer ${token}`,
    };
  }

  private subscribeTokenRefresh(callback: (token: string) => void): void {
    this.refreshSubscribers.push(callback);
  }

  private onTokenRefreshed(token: string): void {
    this.refreshSubscribers.forEach((callback) => callback(token));
    this.refreshSubscribers = [];
  }

  private async refreshAccessToken(): Promise<string | null> {
    const refreshToken = TokenManager.getRefreshToken();
    if (!refreshToken) {
      TokenManager.clearTokens();
      return null;
    }

    try {
      const response = await fetch(`${this.baseUrl}${API_ROUTES.refreshToken}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ refreshToken }),
      });

      if (!response.ok) {
        TokenManager.clearTokens();
        return null;
      }

      const data = await response.json();
      if (data.data?.accessToken) {
        TokenManager.setAccessToken(data.data.accessToken);
        if (data.data.refreshToken) {
          TokenManager.setRefreshToken(data.data.refreshToken);
        }
        return data.data.accessToken;
      }

      return null;
    } catch {
      TokenManager.clearTokens();
      return null;
    }
  }

  async request<T>(
    endpoint: string,
    options: RequestInit & RequestOptions = {},
  ): Promise<T> {
    const { body, headers: customHeaders, skipAuth = false, ...rest } = options;

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...rest,
      headers: {
        "Content-Type": "application/json",
        ...this.getAuthHeaders(skipAuth),
        ...customHeaders,
      },
      body,
    });

    if (response.ok) {
      return response.json() as Promise<T>;
    }

    if (response.status === 401 && !skipAuth) {
      const refreshToken = TokenManager.getRefreshToken();
      
      if (!refreshToken) {
        TokenManager.clearTokens();
        if (typeof window !== "undefined") {
          window.dispatchEvent(new CustomEvent("auth:unauthorized"));
        }
        throw new ApiError(response.status, await response.text());
      }

      if (this.isRefreshing) {
        return new Promise((resolve, reject) => {
          this.subscribeTokenRefresh(() => {
            this.request<T>(endpoint, options)
              .then(resolve)
              .catch(reject);
          });
        });
      }

      this.isRefreshing = true;

      try {
        const newToken = await this.refreshAccessToken();
        
        if (newToken) {
          this.isRefreshing = false;
          this.onTokenRefreshed(newToken);
          return this.request<T>(endpoint, options);
        } else {
          this.isRefreshing = false;
          if (typeof window !== "undefined") {
            window.dispatchEvent(new CustomEvent("auth:unauthorized"));
          }
          throw new ApiError(response.status, "Failed to refresh token");
        }
      } catch (error) {
        this.isRefreshing = false;
        if (typeof window !== "undefined") {
          window.dispatchEvent(new CustomEvent("auth:unauthorized"));
        }
        throw error;
      }
    }

    const errorText = await response.text();
    throw new ApiError(response.status, errorText);
  }

  get<T>(endpoint: string, options?: RequestOptions) {
    return this.request<T>(endpoint, { ...options, method: "GET" });
  }

  post<T>(endpoint: string, data?: unknown, options?: RequestOptions) {
    return this.request<T>(endpoint, {
      ...options,
      method: "POST",
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  put<T>(endpoint: string, data?: unknown, options?: RequestOptions) {
    return this.request<T>(endpoint, {
      ...options,
      method: "PUT",
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  delete<T>(endpoint: string, options?: RequestOptions) {
    return this.request<T>(endpoint, { ...options, method: "DELETE" });
  }
}

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export const apiClient = new ApiClient();
