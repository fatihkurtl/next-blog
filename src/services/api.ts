type HttpMethod = "GET" | "POST" | "PUT" | "DELETE";

interface RequestOptions {
  method: HttpMethod;
  headers?: Record<string, string>;
  body?: any;
}

class ApiService {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(
    endpoint: string,
    options?: RequestOptions
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const headers = {
      "Content-Type": "application/json",
      ...options?.headers,
    };
    const config: RequestInit = {
      method: options?.method,
      headers,
      body: options?.body ? JSON.stringify(options.body) : undefined,
    };
    const response = await fetch(url, config);
    if (!response.ok) {
      throw new Error(response.statusText);
    }
    return await response.json();
  }

  public async get<T>(endpoint: string, headers?: Record<string, string>): Promise<T> {
      return this.request<T>(endpoint, { method: "GET", headers });
  }

  public async post<T>(endpoint: string, body: any, headers?: Record<string, string>): Promise<T> {
      return this.request<T>(endpoint, { method: "POST", body, headers });
  }

  public async put<T>(endpoint: string, body: any, headers?: Record<string, string>): Promise<T> {
    return this.request<T>(endpoint, { method: 'PUT', body, headers });
  }

  public async delete<T>(endpoint: string, body: any, headers?: Record<string, string>): Promise<T> {
      return this.request<T>(endpoint, { method: 'DELETE', body, headers });
  }
}

const api =  new ApiService(process.env.NEXT_PUBLIC_BASE_API_URL as string);
export default api;
