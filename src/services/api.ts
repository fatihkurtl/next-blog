type HttpMethod = "GET" | "POST" | "PUT" | "DELETE";

interface RequestOptions {
  method: HttpMethod;
  headers?: Record<string, string>;
  body?: any;
}

export class ApiService {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(
    endpoint: string,
    options?: RequestOptions
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const headers: Record<string, string> = {
      ...options?.headers,
    };
    let body: string | FormData | undefined = options?.body;

    if (body instanceof FormData) {
      delete headers['Content-Type'];
    } else if (typeof body === 'object') {
      headers['Content-Type'] = 'application/json';
      body = JSON.stringify(body);
    }

    const config: RequestInit = {
      method: options?.method,
      headers,
      body,
    };

    console.log('Request URL:', url);
    console.log('Request Method:', options?.method);
    console.log('Request Headers:', headers);
    console.log('Request Body:', body instanceof FormData ? 'FormData' : body);

    try {
      const response = await fetch(url, config);
      const responseData = await response.text();
      
      console.log('Response Status:', response.status);
      console.log('Response Headers:', response.headers);
      console.log('Response Body:', responseData);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}, body: ${responseData}`);
      }

      return responseData ? JSON.parse(responseData) : {};
    } catch (error) {
      console.error('Request error:', error);
      throw error;
    }
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

const api = new ApiService(process.env.NEXT_PUBLIC_BASE_API_URL as string);
export default api;
