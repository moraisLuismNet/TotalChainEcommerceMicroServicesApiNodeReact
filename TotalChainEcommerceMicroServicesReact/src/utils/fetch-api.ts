import { environment } from "../environments/environment";

class FetchAPI {
  private baseURL: string;

  constructor() {
    this.baseURL = environment.urlAPI;
  }

  private async request<T>(
    method: string,
    endpoint: string,
    data?: unknown,
    customHeaders: Record<string, string> = {}
  ): Promise<T> {
    let token = localStorage.getItem("token");

    if (!token) {
      const authStorageStr = localStorage.getItem("auth-storage");
      if (authStorageStr) {
        try {
          const authStorage = JSON.parse(authStorageStr);
          token = authStorage.state?.token || null;
        } catch {
          // ignore parse error
        }
      }
    }

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const config: RequestInit = {
      method,
      headers: { ...headers, ...customHeaders },
    };

    if (data && method !== "GET" && method !== "HEAD") {
      config.body = JSON.stringify(data);
    }

    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, config);

      const contentType = response.headers.get("content-type");
      let body: unknown;
      if (contentType && contentType.includes("application/json")) {
        body = await response.json();
      } else {
        body = await response.text();
      }

      if (!response.ok) {
        if (response.status === 401) {
          const isLoginPage = window.location.pathname === "/login";
          if (!isLoginPage) {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            window.location.href = "/login";
          }
          const apiError = body as { message?: string } | undefined;
          throw new Error(apiError?.message || "Unauthorized");
        }
        const apiError = body as { message?: string } | undefined;
        throw new Error(apiError?.message || `HTTP error! status: ${response.status}`);
      }

      return body as T;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      console.error("Fetch error:", error);
      throw error;
    }
  }

  async get<T>(endpoint: string, headers?: Record<string, string>): Promise<T> {
    return this.request<T>("GET", endpoint, undefined, headers);
  }

  async post<T>(endpoint: string, data?: unknown, headers?: Record<string, string>): Promise<T> {
    return this.request<T>("POST", endpoint, data, headers);
  }

  async put<T>(endpoint: string, data?: unknown, headers?: Record<string, string>): Promise<T> {
    return this.request<T>("PUT", endpoint, data, headers);
  }

  async delete<T>(endpoint: string, headers?: Record<string, string>): Promise<T> {
    return this.request<T>("DELETE", endpoint, undefined, headers);
  }

  async patch<T>(endpoint: string, data?: unknown, headers?: Record<string, string>): Promise<T> {
    return this.request<T>("PATCH", endpoint, data, headers);
  }
}

const fetchAPI = new FetchAPI();
export default fetchAPI;
