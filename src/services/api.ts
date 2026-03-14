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

// Vouch interfaces
export interface Vouch {
  id: string;
  user_id: string;
  product_id: string;
  rating: number; // 1-5
  comment: string;
  proof_image_url?: string;
  verified: boolean;
  helpful_count: number;
  created_at: string;
  updated_at: string;
  tags: string[];
  user: {
    id: string;
    username: string;
    email: string;
    verified: boolean;
  };
  product: {
    id: string;
    name: string;
    category: string;
  };
}
export interface CreateVouchRequest {
  product_id: string;
  rating: number;
  comment: string;
  proof_image?: File;
  tags?: string[];
}

export interface VouchFilters {
  product_id?: string;
  rating?: number;
  verified_only?: boolean;
  tags?: string[];
  sort_by?: 'date' | 'rating' | 'helpful';
  sort_order?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

// Cashout Clip interfaces
export interface CashoutClip {
  id: string;
  user_id: string;
  title: string;
  description?: string;
  video_url: string;
  thumbnail_url: string;
  duration: number; // in seconds
  profit_amount: number;
  view_count: number;
  created_at: string;
  updated_at: string;
  tags: string[];
  user: {
    id: string;
    username: string;
    verified: boolean;
  };
}

export interface CreateClipRequest {
  title: string;
  description?: string;
  video_file: File;
  profit_amount: number;
  tags?: string[];
}
export interface ClipFilters {
  user_id?: string;
  min_profit?: number;
  max_profit?: number;
  tags?: string[];
  sort_by?: 'date' | 'views' | 'profit';
  sort_order?: 'asc' | 'desc';
  page?: number;
  limit?: number;
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

  setToken(token: string) {
    this.token = token;
    localStorage.setItem('auth_token', token);
  }

  clearToken() {
    this.token = null;
    localStorage.removeItem('auth_token');
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    
    const headers: Record<string, string> = {
      'ngrok-skip-browser-warning': 'true',
      ...(options.headers as Record<string, string> || {}),
    };

    // Add auth header if token exists and not FormData
    if (this.token && !(options.body instanceof FormData)) {
      headers['Authorization'] = `Bearer ${this.token}`;
    } else if (this.token && options.body instanceof FormData) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    // Add Content-Type for JSON requests
    if (options.body && typeof options.body === 'string' && !headers['Content-Type']) {
      headers['Content-Type'] = 'application/json';
    }

    const config: RequestInit = {
      ...options,
      headers,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        let errorMessage = `HTTP error! status: ${response.status}`;
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
        } catch {
          // If we can't parse the error response, use the default message
        }
        
        // Only show toast for critical operations (POST/PUT/DELETE)
        const method = options.method || 'GET';
        if (['POST', 'PUT', 'DELETE'].includes(method.toUpperCase())) {
          toast.error(errorMessage);
        }
        
        throw new Error(errorMessage);
      }

      const data = await response.json();
      
      // Show success toast for successful POST/PUT operations
      const method = options.method || 'GET';
      if (['POST', 'PUT'].includes(method.toUpperCase()) && data.success && data.message) {
        toast.success(data.message);
      }
      
      return data;
    } catch (error) {
      console.error('API request failed:', error);
      
      // Only show toast for critical operations
      const method = options.method || 'GET';
      if (['POST', 'PUT', 'DELETE'].includes(method.toUpperCase())) {
        if (error instanceof Error) {
          toast.error(error.message);
        } else {
          toast.error('Network error occurred');
        }
      }
      
      throw error;
    }
  }
  // Authentication methods
  async register(userData: {
    email: string;
    username: string;
    password: string;
    first_name: string;
    last_name: string;
    phone_number: string;
  }): Promise<AuthResponse> {
    const response = await this.request<ApiResponse<AuthResponse>>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
    
    // Store token and user data
    this.setToken(response.data.access_token);
    
    return response.data;
  }

  async login(email: string, password: string): Promise<AuthResponse> {
    const response = await this.request<ApiResponse<AuthResponse>>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    
    // Store token and user data
    this.setToken(response.data.access_token);
    
    return response.data;
  }

  async getCurrentUser(): Promise<User> {
    const response = await this.request<ApiResponse<User>>('/auth/me');
    return response.data;
  }

  logout(): void {
    this.clearToken();
    // Dispatch logout event for components to react
    window.dispatchEvent(new CustomEvent('userLoggedOut'));
  }
  // Product methods
  async getProducts(filters?: ProductFilters): Promise<Product[]> {
    try {
      const params = new URLSearchParams();
      if (filters?.page) params.append('page', filters.page.toString());
      if (filters?.limit) params.append('limit', filters.limit.toString());
      if (filters?.search) params.append('search', filters.search);
      if (filters?.category_id) params.append('category_id', filters.category_id);
      if (filters?.min_price) params.append('min_price', filters.min_price.toString());
      if (filters?.max_price) params.append('max_price', filters.max_price.toString());
      if (filters?.tags?.length) params.append('tags', filters.tags.join(','));
      if (filters?.status) params.append('status', filters.status);
      if (filters?.sort_by) params.append('sort_by', filters.sort_by);
      if (filters?.sort_order) params.append('sort_order', filters.sort_order);

      const queryString = params.toString();
      const endpoint = queryString ? `/products?${queryString}` : '/products';
      
      const response = await this.request<ApiResponse<ApiProduct[]>>(endpoint);
      
      // Transform API response to our Product interface
      return (response.data || []).map(apiProduct => ({
        id: apiProduct.id,
        name: apiProduct.title,
        description: apiProduct.description,
        price: parseFloat(apiProduct.price) / 100, // Convert from satoshis to dollars
        category: apiProduct.category?.name || 'Unknown',
        category_id: apiProduct.category_id,
        stock: 100, // Default stock since API doesn't provide this
        image_url: apiProduct.images?.[0] || undefined,
        is_active: apiProduct.status === 'active',
        created_at: apiProduct.created_at,
        updated_at: apiProduct.updated_at,
      }));
    } catch (error) {
      console.error('Error fetching products:', error);
      return [];
    }
  }
  async getProduct(id: string): Promise<Product> {
    const response = await this.request<ApiResponse<ApiProduct>>(`/products/${id}`);
    const apiProduct = response.data;
    
    return {
      id: apiProduct.id,
      name: apiProduct.title,
      description: apiProduct.description,
      price: parseFloat(apiProduct.price) / 100,
      category: apiProduct.category?.name || 'Unknown',
      category_id: apiProduct.category_id,
      stock: 100,
      image_url: apiProduct.images?.[0] || undefined,
      is_active: apiProduct.status === 'active',
      created_at: apiProduct.created_at,
      updated_at: apiProduct.updated_at,
    };
  }

  async getCategories(): Promise<Category[]> {
    const response = await this.request<ApiResponse<Category[]>>('/products/categories');
    return response.data || [];
  }

  // Cart methods
  async getCart(): Promise<Cart> {
    try {
      const response = await this.request<ApiResponse<ApiCart>>('/cart');
      const apiCart = response.data;
      
      if (!apiCart || !apiCart.items) {
        return {
          id: '',
          user_id: '',
          items: [],
          total: 0,
          created_at: '',
          updated_at: ''
        };
      }

      return {
        id: apiCart.id,
        user_id: apiCart.user_id,
        items: apiCart.items.map(item => ({
          id: item.id,
          product_id: item.product_id,
          quantity: item.quantity,
          price: parseFloat(item.unit_price) / 100,
          product: {
            id: item.product.id,
            name: item.product.title,
            description: item.product.description,
            price: parseFloat(item.product.price) / 100,
            category: item.product.category?.name || 'Unknown',
            category_id: item.product.category_id,
            stock: 100,
            image_url: item.product.images?.[0] || undefined,
            is_active: item.product.status === 'active',
            created_at: item.product.created_at,
            updated_at: item.product.updated_at,
          }
        })),
        total: parseFloat(apiCart.total_amount) / 100,
        created_at: apiCart.created_at,
        updated_at: apiCart.updated_at,
      };
    } catch (error) {
      console.error('Error fetching cart:', error);
      return {
        id: '',
        user_id: '',
        items: [],
        total: 0,
        created_at: '',
        updated_at: ''
      };
    }
  }
  async addToCart(productId: string, quantity: number = 1): Promise<Cart> {
    const response = await this.request<ApiResponse<ApiCart>>('/cart/items', {
      method: 'POST',
      body: JSON.stringify({
        product_id: productId,
        quantity: quantity,
      }),
    });

    const apiCart = response.data;
    const cart = {
      id: apiCart.id,
      user_id: apiCart.user_id,
      items: apiCart.items.map(item => ({
        id: item.id,
        product_id: item.product_id,
        quantity: item.quantity,
        price: parseFloat(item.unit_price) / 100,
        product: {
          id: item.product.id,
          name: item.product.title,
          description: item.product.description,
          price: parseFloat(item.product.price) / 100,
          category: item.product.category?.name || 'Unknown',
          category_id: item.product.category_id,
          stock: 100,
          image_url: item.product.images?.[0] || undefined,
          is_active: item.product.status === 'active',
          created_at: item.product.created_at,
          updated_at: item.product.updated_at,
        }
      })),
      total: parseFloat(apiCart.total_amount) / 100,
      created_at: apiCart.created_at,
      updated_at: apiCart.updated_at,
    };

    // Dispatch event for real-time updates
    window.dispatchEvent(new CustomEvent('cartUpdated', { detail: cart }));
    
    return cart;
  }
  async updateCartItem(itemId: string, quantity: number): Promise<Cart> {
    const response = await this.request<ApiResponse<ApiCart>>(`/cart/items/${itemId}`, {
      method: 'PUT',
      body: JSON.stringify({ quantity }),
    });

    const apiCart = response.data;
    const cart = {
      id: apiCart.id,
      user_id: apiCart.user_id,
      items: apiCart.items.map(item => ({
        id: item.id,
        product_id: item.product_id,
        quantity: item.quantity,
        price: parseFloat(item.unit_price) / 100,
        product: {
          id: item.product.id,
          name: item.product.title,
          description: item.product.description,
          price: parseFloat(item.product.price) / 100,
          category: item.product.category?.name || 'Unknown',
          category_id: item.product.category_id,
          stock: 100,
          image_url: item.product.images?.[0] || undefined,
          is_active: item.product.status === 'active',
          created_at: item.product.created_at,
          updated_at: item.product.updated_at,
        }
      })),
      total: parseFloat(apiCart.total_amount) / 100,
      created_at: apiCart.created_at,
      updated_at: apiCart.updated_at,
    };

    // Dispatch event for real-time updates
    window.dispatchEvent(new CustomEvent('cartUpdated', { detail: cart }));
    
    return cart;
  }
  async removeFromCart(itemId: string): Promise<Cart> {
    const response = await this.request<ApiResponse<ApiCart>>(`/cart/items/${itemId}`, {
      method: 'DELETE',
    });

    const apiCart = response.data;
    const cart = {
      id: apiCart.id,
      user_id: apiCart.user_id,
      items: apiCart.items.map(item => ({
        id: item.id,
        product_id: item.product_id,
        quantity: item.quantity,
        price: parseFloat(item.unit_price) / 100,
        product: {
          id: item.product.id,
          name: item.product.title,
          description: item.product.description,
          price: parseFloat(item.product.price) / 100,
          category: item.product.category?.name || 'Unknown',
          category_id: item.product.category_id,
          stock: 100,
          image_url: item.product.images?.[0] || undefined,
          is_active: item.product.status === 'active',
          created_at: item.product.created_at,
          updated_at: item.product.updated_at,
        }
      })),
      total: parseFloat(apiCart.total_amount) / 100,
      created_at: apiCart.created_at,
      updated_at: apiCart.updated_at,
    };

    // Dispatch event for real-time updates
    window.dispatchEvent(new CustomEvent('cartUpdated', { detail: cart }));
    
    return cart;
  }

  async clearCart(): Promise<void> {
    await this.request<ApiResponse<void>>('/cart', {
      method: 'DELETE',
    });

    // Dispatch event for real-time updates
    window.dispatchEvent(new CustomEvent('cartUpdated', { detail: { items: [], total: 0 } }));
  }
  // Order methods
  async createOrder(orderData: CreateOrderRequest): Promise<Order> {
    const response = await this.request<ApiResponse<Order>>('/orders', {
      method: 'POST',
      body: JSON.stringify(orderData),
    });

    // Dispatch event for real-time updates
    window.dispatchEvent(new CustomEvent('orderCreated', { detail: response.data }));
    
    return response.data;
  }

  async getOrders(page: number = 1, limit: number = 20): Promise<Order[]> {
    try {
      const response = await this.request<ApiResponse<Order[]>>(`/orders?page=${page}&limit=${limit}`);
      return response.data || [];
    } catch (error) {
      console.error('Error fetching orders:', error);
      return [];
    }
  }

  async getOrder(id: string): Promise<Order> {
    const response = await this.request<ApiResponse<Order>>(`/orders/${id}`);
    return response.data;
  }

  // Wallet methods
  async getWallet(): Promise<Wallet> {
    const response = await this.request<ApiResponse<Wallet>>('/wallets');
    return response.data;
  }
  async getTransactions(params?: { page?: number; limit?: number }): Promise<any[]> {
    try {
      const queryParams = new URLSearchParams();
      if (params?.page) queryParams.append('page', params.page.toString());
      if (params?.limit) queryParams.append('limit', params.limit.toString());
      
      const queryString = queryParams.toString();
      const endpoint = queryString ? `/wallets/transactions?${queryString}` : '/wallets/transactions';
      
      const response = await this.request<ApiResponse<any[]>>(endpoint);
      return response.data || [];
    } catch (error) {
      console.error('Error fetching transactions:', error);
      return [];
    }
  }

  async getTransaction(id: string): Promise<any> {
    const response = await this.request<ApiResponse<any>>(`/wallets/transactions/${id}`);
    return response.data;
  }

  async checkSufficientBalance(totalAmount: number): Promise<boolean> {
    try {
      const wallet = await this.getWallet();
      const availableBalance = parseFloat(wallet.available_balance) / 100; // Convert from satoshis
      return availableBalance >= totalAmount;
    } catch (error) {
      console.error('Error checking balance:', error);
      return false;
    }
  }
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

  // Vouch methods
  async getVouches(filters?: VouchFilters): Promise<Vouch[]> {
    try {
      const params = new URLSearchParams();
      if (filters?.product_id) params.append('product_id', filters.product_id);
      if (filters?.rating) params.append('rating', filters.rating.toString());
      if (filters?.verified_only) params.append('verified_only', 'true');
      if (filters?.tags?.length) params.append('tags', filters.tags.join(','));
      if (filters?.sort_by) params.append('sort_by', filters.sort_by);
      if (filters?.sort_order) params.append('sort_order', filters.sort_order);
      if (filters?.page) params.append('page', filters.page.toString());
      if (filters?.limit) params.append('limit', filters.limit.toString());

      const queryString = params.toString();
      const endpoint = queryString ? `/vouches?${queryString}` : '/vouches';
      
      const response = await this.request<ApiResponse<Vouch[]>>(endpoint);
      return response.data || [];
    } catch (error) {
      console.error('Error fetching vouches:', error);
      return [];
    }
  }
  async getVouch(id: string): Promise<Vouch> {
    const response = await this.request<ApiResponse<Vouch>>(`/vouches/${id}`);
    return response.data;
  }

  async createVouch(vouchData: CreateVouchRequest): Promise<Vouch> {
    const formData = new FormData();
    formData.append('product_id', vouchData.product_id);
    formData.append('rating', vouchData.rating.toString());
    formData.append('comment', vouchData.comment);
    if (vouchData.proof_image) {
      formData.append('proof_image', vouchData.proof_image);
    }
    if (vouchData.tags?.length) {
      formData.append('tags', JSON.stringify(vouchData.tags));
    }

    const response = await this.request<ApiResponse<Vouch>>('/vouches', {
      method: 'POST',
      body: formData,
    });

    // Dispatch event for real-time updates
    window.dispatchEvent(new CustomEvent('vouchCreated', { detail: response.data }));
    
    return response.data;
  }

  async markVouchHelpful(vouchId: string, helpful: boolean): Promise<void> {
    await this.request<ApiResponse<void>>(`/vouches/${vouchId}/helpful`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ helpful }),
    });

    // Dispatch event for real-time updates
    window.dispatchEvent(new CustomEvent('vouchUpdated', { detail: { vouchId, helpful } }));
  }
  // Cashout Clip methods
  async getClips(filters?: ClipFilters): Promise<CashoutClip[]> {
    try {
      const params = new URLSearchParams();
      if (filters?.user_id) params.append('user_id', filters.user_id);
      if (filters?.min_profit) params.append('min_profit', filters.min_profit.toString());
      if (filters?.max_profit) params.append('max_profit', filters.max_profit.toString());
      if (filters?.tags?.length) params.append('tags', filters.tags.join(','));
      if (filters?.sort_by) params.append('sort_by', filters.sort_by);
      if (filters?.sort_order) params.append('sort_order', filters.sort_order);
      if (filters?.page) params.append('page', filters.page.toString());
      if (filters?.limit) params.append('limit', filters.limit.toString());

      const queryString = params.toString();
      const endpoint = queryString ? `/clips?${queryString}` : '/clips';
      
      const response = await this.request<ApiResponse<CashoutClip[]>>(endpoint);
      return response.data || [];
    } catch (error) {
      console.error('Error fetching clips:', error);
      return [];
    }
  }

  async getClip(id: string): Promise<CashoutClip> {
    const response = await this.request<ApiResponse<CashoutClip>>(`/clips/${id}`);
    
    // Increment view count
    this.incrementClipView(id).catch(console.error);
    
    return response.data;
  }
  async createClip(clipData: CreateClipRequest): Promise<CashoutClip> {
    const formData = new FormData();
    formData.append('title', clipData.title);
    if (clipData.description) formData.append('description', clipData.description);
    formData.append('video_file', clipData.video_file);
    formData.append('profit_amount', clipData.profit_amount.toString());
    if (clipData.tags?.length) {
      formData.append('tags', JSON.stringify(clipData.tags));
    }

    const response = await this.request<ApiResponse<CashoutClip>>('/clips', {
      method: 'POST',
      body: formData,
    });

    // Dispatch event for real-time updates
    window.dispatchEvent(new CustomEvent('clipCreated', { detail: response.data }));
    
    return response.data;
  }

  async incrementClipView(clipId: string): Promise<void> {
    try {
      await this.request<ApiResponse<void>>(`/clips/${clipId}/view`, {
        method: 'POST',
      });
    } catch (error) {
      // Silent fail for view tracking
      console.error('Error tracking clip view:', error);
    }
  }

  async deleteVouch(vouchId: string): Promise<void> {
    await this.request<ApiResponse<void>>(`/vouches/${vouchId}`, {
      method: 'DELETE',
    });

    // Dispatch event for real-time updates
    window.dispatchEvent(new CustomEvent('vouchDeleted', { detail: { vouchId } }));
  }

  async deleteClip(clipId: string): Promise<void> {
    await this.request<ApiResponse<void>>(`/clips/${clipId}`, {
      method: 'DELETE',
    });

    // Dispatch event for real-time updates
    window.dispatchEvent(new CustomEvent('clipDeleted', { detail: { clipId } }));
  }
}

// Create and export API instance
export const api = new ApiClient(API_BASE_URL);