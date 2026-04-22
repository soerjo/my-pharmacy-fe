import { TokenManager } from "@/lib/token-manager";

type RequestOptions = {
  body?: string;
  headers?: Record<string, string>;
  skipAuth?: boolean;
  _retryCount?: number;
};

class ApiClient {
  private baseUrl: string;
  private static isRefreshing: boolean = false;
  private static refreshSubscribers: Array<{
    resolve: () => void;
    reject: (error: Error) => void;
  }> = [];
  private static readonly MAX_RETRY_ATTEMPTS = Number(process.env.NEXT_PUBLIC_MAX_TOKEN_RETRY_ATTEMPTS) || 3;
  private static readonly AUTH_BASE_URL = process.env.NEXT_PUBLIC_API_AUTH_SERVICE ?? "";

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

  private static addRefreshSubscriber(subscriber: {
    resolve: () => void;
    reject: (error: Error) => void;
  }): void {
    ApiClient.refreshSubscribers.push(subscriber);
  }

  private static resolveRefreshSubscribers(): void {
    const subscribers = ApiClient.refreshSubscribers;
    ApiClient.refreshSubscribers = [];
    subscribers.forEach((sub) => sub.resolve());
  }

  private static rejectRefreshSubscribers(error: Error): void {
    const subscribers = ApiClient.refreshSubscribers;
    ApiClient.refreshSubscribers = [];
    subscribers.forEach((sub) => sub.reject(error));
  }

  private static async refreshAccessToken(): Promise<string> {
    const refreshToken = TokenManager.getRefreshToken();
    if (!refreshToken) {
      throw new ApiError(401, "No refresh token available");
    }

    const response = await fetch(`${ApiClient.AUTH_BASE_URL}/auth/refresh-token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ refreshToken }),
    });

    if (!response.ok) {
      throw new ApiError(response.status, "Refresh token request failed");
    }

    const data = await response.json();
    if (data.data?.accessToken) {
      TokenManager.setAccessToken(data.data.accessToken);
      if (data.data.refreshToken) {
        TokenManager.setRefreshToken(data.data.refreshToken);
      }
      return data.data.accessToken;
    }

    throw new ApiError(401, "Invalid refresh token response");
  }

  private static handleSessionExpired(): void {
    TokenManager.clearTokens();
    ApiClient.isRefreshing = false;
    const error = new ApiError(401, "Session expired");
    ApiClient.rejectRefreshSubscribers(error);
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("auth:unauthorized"));
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
      return this.handleTokenExpired<T>(endpoint, options);
    }

    const errorText = await response.text();
    throw new ApiError(response.status, errorText);
  }

  private async handleTokenExpired<T>(
    endpoint: string,
    options: RequestInit & RequestOptions,
  ): Promise<T> {
    const retryCount = options._retryCount || 0;

    if (retryCount >= ApiClient.MAX_RETRY_ATTEMPTS) {
      ApiClient.handleSessionExpired();
      throw new ApiError(401, "Max retry attempts reached");
    }

    if (!TokenManager.getRefreshToken()) {
      ApiClient.handleSessionExpired();
      throw new ApiError(401, "No refresh token available");
    }

    if (ApiClient.isRefreshing) {
      return new Promise<T>((resolve, reject) => {
        ApiClient.addRefreshSubscriber({
          resolve: () => {
            this.request<T>(endpoint, { ...options, _retryCount: retryCount + 1 })
              .then(resolve)
              .catch(reject);
          },
          reject,
        });
      });
    }

    ApiClient.isRefreshing = true;

    try {
      await ApiClient.refreshAccessToken();
      ApiClient.isRefreshing = false;
      ApiClient.resolveRefreshSubscribers();
      return this.request<T>(endpoint, { ...options, _retryCount: retryCount + 1 });
    } catch (error) {
      ApiClient.handleSessionExpired();
      throw error instanceof ApiError ? error : new ApiError(401, "Token refresh failed");
    }
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
