// API service with toast notifications
import { toast } from '../utils/toast';

const API_BASE_URL = 'https://3d7a-2a09-bac6-d847-1f19-00-319-fd.ngrok-free.app/api/v1';

// Basic types
export interface User {
  id: string;
  email: string;
  username: string;
  role: string;
  status: string;
}

export interface AuthResponse {
  access_token: string;
  user: User;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  status: number;
  timestamp: string;
}

// Simple API client class
class ApiClient {
  private baseURL: string;
  private token: string | null = null;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
    // Get token from localStorage if it exists
    this.token = localStorage.getItem('auth_token');
  }

  // Set authentication token
  setToken(token: string) {
    this.token = token;
    localStorage.setItem('auth_token', token);
  }

  // Clear authentication token
  clearToken() {
    this.token = null;
    localStorage.removeItem('auth_token');
  }

  // Basic request method
  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'ngrok-skip-browser-warning': 'true', // Skip ngrok browser warning
      ...(options.headers as Record<string, string>),
    };

    // Add auth token if available
    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }

    try {
      console.log('API Request:', { url, method: options.method || 'GET', headers });
      
      const response = await fetch(url, {
        ...options,
        headers,
      });

      console.log('API Response Status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error:', errorText);
        
        // Show error toast
        let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
        try {
          const errorData = JSON.parse(errorText);
          if (errorData.message) {
            errorMessage = errorData.message;
          }
        } catch (e) {
          // Use default error message
        }
        
        toast.error(errorMessage);
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const responseData = await response.json();
      console.log('API Response Data:', responseData);
      
      // If the response has a 'data' property, return that, otherwise return the whole response
      if (responseData && typeof responseData === 'object' && 'data' in responseData) {
        return responseData.data as T;
      }
      
      return responseData as T;
    } catch (error) {
      console.error('API Request failed:', error);
      
      // Show error toast for network/connection errors
      if (error instanceof Error && !error.message.startsWith('HTTP')) {
        toast.error('Network error. Please check your connection.');
      }
      
      throw error;
    }
  }

  // Simple register method
  async register(userData: {
    email: string;
    password: string;
    username: string;
    first_name: string;
    last_name: string;
  }): Promise<AuthResponse> {
    const response = await this.request<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
    
    // Store the token immediately after successful registration
    if (response.access_token) {
      console.log('Storing token from registration:', response.access_token.substring(0, 20) + '...');
      this.setToken(response.access_token);
      toast.success('Account created successfully! Welcome to KUDZNED.');
    }
    
    return response;
  }

  // Simple login method
  async login(email: string, password: string): Promise<AuthResponse> {
    const response = await this.request<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    
    // Store the token immediately after successful login
    if (response.access_token) {
      console.log('Storing token from login:', response.access_token.substring(0, 20) + '...');
      this.setToken(response.access_token);
      toast.success('Login successful! Welcome back.');
    }
    
    return response;
  }

  // Get current user method
  async getCurrentUser(): Promise<User> {
    return this.request<User>('/auth/me', {
      method: 'GET',
    });
  }

  // Logout method - frontend only
  logout(): void {
    console.log('Logging out user (frontend only)');
    // Clear the token from memory and localStorage
    this.clearToken();
    toast.success('Logged out successfully.');
  }
}

// Create and export the API client instance
export const apiClient = new ApiClient(API_BASE_URL);

// Export the class for testing
export { ApiClient };