// API service with toast notifications
import { toast } from '../utils/toast';

const API_BASE_URL = 'https://2b64-102-90-100-247.ngrok-free.app/api/v1';

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

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  quantity: number;
  unit_price: string;
  total_price: string;
  created_at: string;
  updated_at: string;
  product: ApiProduct;
}

export interface Order {
  id: string;
  user_id: string;
  total_amount: string;
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  payment_status: 'pending' | 'paid' | 'failed' | 'refunded';
  items: OrderItem[];
  created_at: string;
  updated_at: string;
}

export interface CreateOrderRequest {
  items: {
    productId: string;
    quantity: number;
  }[];
}

export interface Wallet {
  id: string;
  user_id: string;
  balance: string;
  available_balance: string;
  total_deposited: string;
  total_withdrawn: string;
  created_at: string;
  updated_at: string;
  btc_addresses: string[];
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
        
        // Only show toast errors for critical operations (not background data loading)
        const isCriticalOperation = options.method === 'POST' || options.method === 'PUT' || options.method === 'DELETE';
        
        if (isCriticalOperation) {
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
        }
        
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
      
      // Only show network error toasts for critical operations
      const isCriticalOperation = options.method === 'POST' || options.method === 'PUT' || options.method === 'DELETE';
      
      if (isCriticalOperation && error instanceof Error && !error.message.startsWith('HTTP')) {
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
  // Order methods
  async createOrder(orderData: CreateOrderRequest): Promise<Order> {
    const response = await this.request<Order>('/orders', {
      method: 'POST',
      body: JSON.stringify(orderData),
    });
    
    toast.success('Order created successfully!');
    
    // Dispatch wallet and cart update events since order affects both
    window.dispatchEvent(new CustomEvent('walletUpdated'));
    window.dispatchEvent(new CustomEvent('cartUpdated'));
    
    return response;
  }

  async getOrders(page: number = 1, limit: number = 20): Promise<Order[]> {
    const params = new URLSearchParams();
    params.append('page', page.toString());
    params.append('limit', limit.toString());
    
    try {
      const response = await this.request<any>(`/orders?${params.toString()}`, {
        method: 'GET',
      });
      
      // Handle both direct response and wrapped response
      const ordersData = response.data || response;
      
      // If it's an array, return it directly, otherwise return empty array
      if (Array.isArray(ordersData)) {
        return ordersData;
      } else if (ordersData && Array.isArray(ordersData.orders)) {
        // Handle paginated response with orders array
        return ordersData.orders;
      } else {
        // Return empty array if no orders found
        return [];
      }
    } catch (error) {
      console.error('Failed to fetch orders:', error);
      // Return empty array on error instead of throwing
      return [];
    }
  }

  async getOrder(id: string): Promise<Order> {
    const response = await this.request<any>(`/orders/${id}`, {
      method: 'GET',
    });
    
    // Handle both direct response and wrapped response
    const orderData = response.data || response;
    
    return orderData as Order;
  }

  // Wallet methods
  async getWallet(): Promise<Wallet> {
    try {
      return await this.request<Wallet>('/wallets', {
        method: 'GET',
      });
    } catch (error) {
      console.error('Failed to fetch wallet:', error);
      throw error; // Re-throw wallet errors since wallet is critical
    }
  }

  // Transaction methods
  async getTransactions(params?: { page?: number; limit?: number }): Promise<any[]> {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    
    const queryString = queryParams.toString();
    const endpoint = queryString ? `/wallets/transactions?${queryString}` : '/wallets/transactions';
    
    try {
      const response = await this.request<any>(endpoint, {
        method: 'GET',
      });
      
      // Handle both direct response and wrapped response
      const transactionsData = response.data || response;
      
      // If it's an array, return it directly, otherwise return empty array
      if (Array.isArray(transactionsData)) {
        return transactionsData;
      } else if (transactionsData && Array.isArray(transactionsData.transactions)) {
        // Handle paginated response with transactions array
        return transactionsData.transactions;
      } else {
        // Return empty array if no transactions found
        return [];
      }
    } catch (error) {
      console.error('Failed to fetch transactions:', error);
      // Return empty array on error instead of throwing
      return [];
    }
  }

  async getTransaction(id: string): Promise<any> {
    try {
      return await this.request<any>(`/wallets/transactions/${id}`, {
        method: 'GET',
      });
    } catch (error) {
      console.error('Failed to fetch transaction:', error);
      throw error; // Re-throw for individual transaction errors
    }
  }

  // Helper method to check if user has sufficient balance for checkout
  async checkSufficientBalance(totalAmount: number): Promise<boolean> {
    try {
      const wallet = await this.getWallet();
      const availableBalance = parseFloat(wallet.available_balance) / 100; // Convert from satoshis to dollars
      return availableBalance >= totalAmount;
    } catch (error) {
      console.error('Failed to check wallet balance:', error);
      return false;
    }
  }

  // Checkout method with balance validation
  async checkout(cart: Cart): Promise<Order> {
    // Check if user has sufficient balance
    const hasSufficientBalance = await this.checkSufficientBalance(cart.total);
    
    if (!hasSufficientBalance) {
      const wallet = await this.getWallet();
      const availableBalance = (parseFloat(wallet.available_balance) / 100).toFixed(2);
      toast.error(`Insufficient balance. You have ${availableBalance} but need ${cart.total.toFixed(2)}`);
      throw new Error('Insufficient balance');
    }

    // Create order data from cart
    const orderData: CreateOrderRequest = {
      items: cart.items.map(item => ({
        productId: item.product_id,
        quantity: item.quantity
      }))
    };

    return this.createOrder(orderData);
  }
}

// Create and export the API client instance
export const apiClient = new ApiClient(API_BASE_URL);

// Export the class for testing
export { ApiClient };