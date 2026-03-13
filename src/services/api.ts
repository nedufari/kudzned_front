// API service with toast notifications
import { toast } from '../utils/toast';

const API_BASE_URL = ' https://2b64-102-90-100-247.ngrok-free.app/api/v1';

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

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  category_id?: string;
  stock: number;
  image_url?: string;
  is_active?: boolean;
  created_at: string;
  updated_at: string;
}

// Raw API response interface
interface ApiProduct {
  id: string;
  vendor_id: string;
  title: string;
  description: string;
  category_id: string;
  price: string; // API returns price as string
  images: string[];
  tags: string[];
  status: string;
  availability: string;
  total_sales: number;
  rating: string;
  review_count: number;
  created_at: string;
  updated_at: string;
  category: {
    id: string;
    name: string;
    slug: string;
    description: string;
    image_url?: string;
    is_active: boolean;
    sort_order: number;
    created_at: string;
    updated_at: string;
  };
  vendor: {
    id: string;
    email: string;
    username: string;
    first_name: string;
    last_name: string;
    phone_number: string;
    role: string;
    status: string;
    created_at: string;
    updated_at: string;
  };
}

export interface ProductFilters {
  page?: number;
  limit?: number;
  search?: string;
  category_id?: string;
  min_price?: number; // in satoshis
  max_price?: number; // in satoshis
  tags?: string[];
  status?: 'active' | 'inactive' | 'draft';
  sort_by?: string;
  sort_order?: 'ASC' | 'DESC';
}

export interface CartItem {
  id: string;
  product_id: string;
  quantity: number;
  price: number;
  product: Product;
}

export interface Cart {
  id: string;
  user_id: string;
  items: CartItem[];
  total: number;
  created_at: string;
  updated_at: string;
}

// Raw API cart response interface
interface ApiCartItem {
  id: string;
  cart_id: string;
  product_id: string;
  quantity: number;
  unit_price: string; // API returns unit_price as string
  total_price: string; // API returns total_price as string
  created_at: string;
  updated_at: string;
  product: ApiProduct;
}

interface ApiCart {
  id: string;
  user_id: string;
  total_amount: string; // API returns total_amount as string
  items: ApiCartItem[];
  created_at: string;
  updated_at: string;
}

export interface Order {
  id: string;
  user_id: string;
  total: number;
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  items: CartItem[];
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  image_url?: string;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
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

  // Product methods
  async getProducts(filters?: ProductFilters): Promise<Product[]> {
    const params = new URLSearchParams();
    
    if (filters) {
      if (filters.page !== undefined) params.append('page', filters.page.toString());
      if (filters.limit !== undefined) params.append('limit', filters.limit.toString());
      if (filters.search) params.append('search', filters.search);
      if (filters.category_id) params.append('category_id', filters.category_id);
      if (filters.min_price !== undefined) params.append('min_price', filters.min_price.toString());
      if (filters.max_price !== undefined) params.append('max_price', filters.max_price.toString());
      if (filters.tags && filters.tags.length > 0) {
        filters.tags.forEach(tag => params.append('tags', tag));
      }
      if (filters.status) params.append('status', filters.status);
      if (filters.sort_by) params.append('sort_by', filters.sort_by);
      if (filters.sort_order) params.append('sort_order', filters.sort_order);
    }
    
    const queryString = params.toString();
    const endpoint = queryString ? `/products?${queryString}` : '/products';
    
    // Get raw API response
    const apiProducts = await this.request<ApiProduct[]>(endpoint, {
      method: 'GET',
    });
    
    // Transform API response to match our Product interface
    return apiProducts.map((apiProduct): Product => ({
      id: apiProduct.id,
      name: apiProduct.title, // Map title to name
      description: apiProduct.description,
      price: parseFloat(apiProduct.price) / 100, // Convert from satoshis to dollars (assuming price is in satoshis)
      category: apiProduct.category.name, // Map category.name to category
      category_id: apiProduct.category_id,
      stock: apiProduct.availability === 'in_stock' ? 10 : 0, // Map availability to stock count
      image_url: apiProduct.images.length > 0 ? apiProduct.images[0] : undefined,
      is_active: apiProduct.status === 'active',
      created_at: apiProduct.created_at,
      updated_at: apiProduct.updated_at,
    }));
  }

  async getProduct(id: string): Promise<Product> {
    // Get raw API response
    const apiProduct = await this.request<ApiProduct>(`/products/${encodeURIComponent(id)}`, {
      method: 'GET',
    });
    
    // Transform API response to match our Product interface
    return {
      id: apiProduct.id,
      name: apiProduct.title, // Map title to name
      description: apiProduct.description,
      price: parseFloat(apiProduct.price) / 100, // Convert from satoshis to dollars
      category: apiProduct.category.name, // Map category.name to category
      category_id: apiProduct.category_id,
      stock: apiProduct.availability === 'in_stock' ? 10 : 0, // Map availability to stock count
      image_url: apiProduct.images.length > 0 ? apiProduct.images[0] : undefined,
      is_active: apiProduct.status === 'active',
      created_at: apiProduct.created_at,
      updated_at: apiProduct.updated_at,
    };
  }

  // Category methods
  async getCategories(): Promise<Category[]> {
    return this.request<Category[]>('/products/categories', {
      method: 'GET',
    });
  }

  // Helper method to get category name by ID
  private async getCategoryName(categoryId: string): Promise<string> {
    try {
      const categories = await this.getCategories();
      const category = categories.find(cat => cat.id === categoryId);
      return category ? category.name : 'Unknown';
    } catch (error) {
      console.error('Failed to get category name:', error);
      return 'Unknown';
    }
  }

  // Cart methods
  async getCart(): Promise<Cart> {
    const apiCart = await this.request<ApiCart>('/cart', {
      method: 'GET',
    });
    
    // Get categories to map category names
    let categories: Category[] = [];
    try {
      categories = await this.getCategories();
    } catch (error) {
      console.error('Failed to load categories for cart:', error);
    }
    
    // Transform API response to match our Cart interface
    return {
      id: apiCart.id,
      user_id: apiCart.user_id,
      items: apiCart.items.map((apiItem): CartItem => {
        // Find category name
        const category = categories.find(cat => cat.id === apiItem.product.category_id);
        const categoryName = category ? category.name : 'Transfer';
        
        return {
          id: apiItem.id,
          product_id: apiItem.product_id,
          quantity: apiItem.quantity,
          price: parseFloat(apiItem.unit_price) / 100, // Convert from satoshis to dollars using unit_price
          product: {
            id: apiItem.product.id,
            name: apiItem.product.title,
            description: apiItem.product.description,
            price: parseFloat(apiItem.product.price) / 100,
            category: categoryName, // Use actual category name
            category_id: apiItem.product.category_id,
            stock: apiItem.product.availability === 'in_stock' ? 10 : 0,
            image_url: apiItem.product.images.length > 0 ? apiItem.product.images[0] : undefined,
            is_active: apiItem.product.status === 'active',
            created_at: apiItem.product.created_at,
            updated_at: apiItem.product.updated_at,
          }
        };
      }),
      total: parseFloat(apiCart.total_amount) / 100, // Convert from satoshis to dollars using total_amount
      created_at: apiCart.created_at,
      updated_at: apiCart.updated_at,
    };
  }

  async addToCart(productId: string, quantity: number = 1): Promise<Cart> {
    const apiCart = await this.request<ApiCart>('/cart/items', {
      method: 'POST',
      body: JSON.stringify({ productId, quantity }), // Use productId instead of product_id
    });
    
    toast.success('Product added to cart!');
    
    // Dispatch cart update event
    window.dispatchEvent(new CustomEvent('cartUpdated'));
    
    // Transform API response to match our Cart interface
    return {
      id: apiCart.id,
      user_id: apiCart.user_id,
      items: apiCart.items.map((apiItem): CartItem => ({
        id: apiItem.id,
        product_id: apiItem.product_id,
        quantity: apiItem.quantity,
        price: parseFloat(apiItem.unit_price) / 100, // Use unit_price
        product: {
          id: apiItem.product.id,
          name: apiItem.product.title,
          description: apiItem.product.description,
          price: parseFloat(apiItem.product.price) / 100,
          category: 'Transfer', // Default category
          category_id: apiItem.product.category_id,
          stock: apiItem.product.availability === 'in_stock' ? 10 : 0,
          image_url: apiItem.product.images.length > 0 ? apiItem.product.images[0] : undefined,
          is_active: apiItem.product.status === 'active',
          created_at: apiItem.product.created_at,
          updated_at: apiItem.product.updated_at,
        }
      })),
      total: parseFloat(apiCart.total_amount) / 100, // Use total_amount
      created_at: apiCart.created_at,
      updated_at: apiCart.updated_at,
    };
  }

  async updateCartItem(itemId: string, quantity: number): Promise<Cart> {
    const apiCart = await this.request<ApiCart>(`/cart/items/${itemId}`, {
      method: 'PUT',
      body: JSON.stringify({ quantity }),
    });
    
    toast.success('Cart updated!');
    
    // Dispatch cart update event
    window.dispatchEvent(new CustomEvent('cartUpdated'));
    
    // Transform API response
    return {
      id: apiCart.id,
      user_id: apiCart.user_id,
      items: apiCart.items.map((apiItem): CartItem => ({
        id: apiItem.id,
        product_id: apiItem.product_id,
        quantity: apiItem.quantity,
        price: parseFloat(apiItem.unit_price) / 100, // Use unit_price
        product: {
          id: apiItem.product.id,
          name: apiItem.product.title,
          description: apiItem.product.description,
          price: parseFloat(apiItem.product.price) / 100,
          category: 'Transfer', // Default category
          category_id: apiItem.product.category_id,
          stock: apiItem.product.availability === 'in_stock' ? 10 : 0,
          image_url: apiItem.product.images.length > 0 ? apiItem.product.images[0] : undefined,
          is_active: apiItem.product.status === 'active',
          created_at: apiItem.product.created_at,
          updated_at: apiItem.product.updated_at,
        }
      })),
      total: parseFloat(apiCart.total_amount) / 100, // Use total_amount
      created_at: apiCart.created_at,
      updated_at: apiCart.updated_at,
    };
  }

  async removeFromCart(itemId: string): Promise<Cart> {
    const apiCart = await this.request<ApiCart>(`/cart/items/${itemId}`, {
      method: 'DELETE',
    });
    
    toast.success('Item removed from cart!');
    
    // Dispatch cart update event
    window.dispatchEvent(new CustomEvent('cartUpdated'));
    
    // Transform API response
    return {
      id: apiCart.id,
      user_id: apiCart.user_id,
      items: apiCart.items.map((apiItem): CartItem => ({
        id: apiItem.id,
        product_id: apiItem.product_id,
        quantity: apiItem.quantity,
        price: parseFloat(apiItem.unit_price) / 100, // Use unit_price
        product: {
          id: apiItem.product.id,
          name: apiItem.product.title,
          description: apiItem.product.description,
          price: parseFloat(apiItem.product.price) / 100,
          category: 'Transfer', // Default category
          category_id: apiItem.product.category_id,
          stock: apiItem.product.availability === 'in_stock' ? 10 : 0,
          image_url: apiItem.product.images.length > 0 ? apiItem.product.images[0] : undefined,
          is_active: apiItem.product.status === 'active',
          created_at: apiItem.product.created_at,
          updated_at: apiItem.product.updated_at,
        }
      })),
      total: parseFloat(apiCart.total_amount) / 100, // Use total_amount
      created_at: apiCart.created_at,
      updated_at: apiCart.updated_at,
    };
  }

  async clearCart(): Promise<void> {
    await this.request<void>('/cart/clear', {
      method: 'DELETE',
    });
    
    toast.success('Cart cleared!');
    
    // Dispatch cart update event
    window.dispatchEvent(new CustomEvent('cartUpdated'));
  }

  // Order methods
  async createOrder(): Promise<Order> {
    const response = await this.request<Order>('/orders', {
      method: 'POST',
    });
    
    toast.success('Order created successfully!');
    return response;
  }

  async getOrders(): Promise<Order[]> {
    return this.request<Order[]>('/orders', {
      method: 'GET',
    });
  }

  async getOrder(id: string): Promise<Order> {
    return this.request<Order>(`/orders/${id}`, {
      method: 'GET',
    });
  }
}

// Create and export the API client instance
export const apiClient = new ApiClient(API_BASE_URL);

// Export the class for testing
export { ApiClient };