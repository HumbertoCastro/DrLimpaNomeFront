import axios, { AxiosResponse } from 'axios';

export class ApiService {
  private baseUrl: string = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
  // Only access localStorage if we are in a browser environment
  private getToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('custom-auth-token');
    }
    return null; // Return null if not in a browser
  }

  // Generic GET method
  public async getApi<T>(endpoint: string, params?: Record<string, any>): Promise<T> {
    try {
      const response: AxiosResponse<T> = await axios.get(`${this.baseUrl}${endpoint}`, {
        params: params,
        headers: { Authorization: `Bearer ${this.getToken()}` },
      });
      return this.handleResponse(response);
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  // Generic POST method
  public async postApi<T>(endpoint: string, data?: Record<string, any> | FormData): Promise<T> {
    try {
      let response: AxiosResponse<T>;
      if (data instanceof FormData) {
        response = await axios.post(`${this.baseUrl}${endpoint}`, data, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
      } else {
        response = await axios.post(`${this.baseUrl}${endpoint}`, data, {
          headers: {
            'Content-Type': 'application/json',
          },
        });
      }
      return this.handleResponse(response);
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  // Generic PUT method for updating resources
  public async putApi<T>(endpoint: string, data?: Record<string, any> | FormData): Promise<T> {
    try {
      let response: AxiosResponse<T>;
      if (data instanceof FormData) {
        response = await axios.put(`${this.baseUrl}${endpoint}`, data, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
      } else {
        response = await axios.put(`${this.baseUrl}${endpoint}`, data, {
          headers: {
            'Content-Type': 'application/json',
          },
        });
      }
      return this.handleResponse(response);
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  // Standard response handler
  private handleResponse<T>(response: AxiosResponse<T>): T {
    if (response.status >= 200 && response.status < 300) {
      return response.data;
    } else {
      throw new Error(`HTTP Error: ${response.status} - ${response.statusText}`);
    }
  }

  // Error handling function
  private handleError(error: unknown): void {
    if (axios.isAxiosError(error)) {
      console.error(`Axios error: ${error.message}`);
      if (error.response) {
        console.error(`Response error: ${error.response.status} - ${error.response.statusText}`);
        console.error(`Response data: ${JSON.stringify(error.response.data)}`);
      } else if (error.request) {
        console.error('No response received from the server:', error.request);
      }
    } else {
      console.error('Unknown error:', error);
    }
  }
}
