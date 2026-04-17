import { TokenManager } from "@/lib/token-manager";
import { API_ROUTES } from "@/constants";

type RequestOptions = {
  body?: string;
  headers?: Record<string, string>;
  skipAuth?: boolean;
  _retryCount?: number;
};

class ApiClient {
  private baseUrl: string;
  private isRefreshing: boolean = false;
  private refreshSubscribers: Array<(token: string) => void> = [];
  private static readonly MAX_RETRY_ATTEMPTS = Number(process.env.NEXT_PUBLIC_MAX_TOKEN_RETRY_ATTEMPTS) || 3;

  constructor(baseUrl = process.env.NEXT_PUBLIC_API_AUTH_SERVICE ?? "") {
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
      const retryCount = options._retryCount || 0;
      
      if (retryCount >= ApiClient.MAX_RETRY_ATTEMPTS) {
        TokenManager.clearTokens();
        if (typeof window !== "undefined") {
          window.dispatchEvent(new CustomEvent("auth:unauthorized"));
        }
        throw new ApiError(response.status, "Max retry attempts reached");
      }

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
            this.request<T>(endpoint, { ...options, _retryCount: retryCount + 1 })
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
          return this.request<T>(endpoint, { ...options, _retryCount: retryCount + 1 });
        } else {
          this.isRefreshing = false;
          TokenManager.clearTokens();
          if (typeof window !== "undefined") {
            window.dispatchEvent(new CustomEvent("auth:unauthorized"));
          }
          throw new ApiError(response.status, "Failed to refresh token");
        }
      } catch (error) {
        this.isRefreshing = false;
        TokenManager.clearTokens();
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

type ServiceName = "auth" | "depo" | "warehouse";

const serviceConfig: Record<ServiceName, { envVar: string; baseUrl: string }> = {
  auth: {
    envVar: "NEXT_PUBLIC_API_AUTH_SERVICE",
    baseUrl: process.env.NEXT_PUBLIC_API_AUTH_SERVICE ?? "",
  },
  depo: {
    envVar: "NEXT_PUBLIC_API_DEPO_SERVICE",
    baseUrl: process.env.NEXT_PUBLIC_API_DEPO_SERVICE ?? "",
  },
  warehouse: {
    envVar: "NEXT_PUBLIC_API_WAREHOUSE_SERVICE",
    baseUrl: process.env.NEXT_PUBLIC_API_WAREHOUSE_SERVICE ?? "",
  },
};

const clientsCache = new Map<ServiceName, ApiClient>();

function createClient(serviceName: ServiceName): ApiClient {
  const cachedClient = clientsCache.get(serviceName);
  if (cachedClient) {
    return cachedClient;
  }

  const config = serviceConfig[serviceName];
  const client = new ApiClient(config.baseUrl);
  clientsCache.set(serviceName, client);
  return client;
}

export const apiClient = createClient("auth");
export const depoClient = createClient("depo");
export const warehouseClient = createClient("warehouse");

export const clients = {
  auth: apiClient,
  depo: depoClient,
  warehouse: warehouseClient,
} as const satisfies Record<ServiceName, ApiClient>;

export function getClient(serviceName: ServiceName): ApiClient {
  return createClient(serviceName);
}
