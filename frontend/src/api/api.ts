import axios, { AxiosInstance } from 'axios';

const api: AxiosInstance = axios.create({
  baseURL: 'http://localhost:8080/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Types
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  role?: string;
}

export interface AuthResponse {
  token: string;
  id: number;
  name: string;
  email: string;
  role: string;
  storeId?: number;
}

export interface Medicine {
  id: number;
  name: string;
  description: string;
  price: number;
  stockQuantity: number;
  category?: string;
  imageUrl?: string;
}

export interface CartItem {
  medicineId: number;
  medicineName: string;
  quantity: number;
  price: number;
}

export interface Cart {
  items: CartItem[];
  totalPrice: number;
}

export interface Address {
  id?: number;
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  isDefault?: boolean;
}

export interface CheckoutData {
  addressId: number;
  paymentMethod: string;
  storeId?: number;
}

export interface Order {
  id: number;
  orderDate: string;
  status: string;
  totalAmount: number;
  items: OrderItem[];
}

export interface OrderItem {
  id: number;
  medicineName: string;
  quantity: number;
  price: number;
}

// Auth APIs
export const authAPI = {
  login: (credentials: LoginCredentials) => api.post<AuthResponse>('/auth/login', credentials),
  register: (userData: RegisterData) => api.post<AuthResponse>('/auth/register', userData),
};

// Medicine APIs
export const medicineAPI = {
  getAll: () => api.get<Medicine[]>('/medicines'),
  getById: (id: number) => api.get<Medicine>(`/medicines/${id}`),
  searchByName: (query: string) => api.get<Medicine[]>(`/medicines/search?query=${query}`),
  getByCategory: (categoryId: number) => api.get<Medicine[]>(`/medicines/category/${categoryId}`),
};

// Cart APIs
export const cartAPI = {
  getCart: () => api.get<Cart>('/cart'),
  addToCart: (medicineId: number, quantity: number) => api.post('/cart', { medicineId, quantity }),
  updateQuantity: (medicineId: number, quantity: number) => api.put(`/cart/${medicineId}`, { quantity }),
  removeItem: (medicineId: number) => api.delete(`/cart/${medicineId}`),
  clearCart: () => api.delete('/cart'),
};

// Order APIs
export const orderAPI = {
  getUserOrders: () => api.get<Order[]>('/orders'),
  getOrderById: (orderId: number) => api.get<Order>(`/orders/${orderId}`),
  checkout: (checkoutData: CheckoutData) => api.post<Order>('/orders/checkout', checkoutData),
  deleteOrder: (orderId: number) => api.delete(`/orders/${orderId}`),
};

// Address APIs
export const addressAPI = {
  getUserAddresses: () => api.get<Address[]>('/addresses'),
  createAddress: (addressData: Address) => api.post<Address>('/addresses', addressData),
  updateAddress: (id: number, addressData: Address) => api.put<Address>(`/addresses/${id}`, addressData),
  deleteAddress: (id: number) => api.delete(`/addresses/${id}`),
};

// Store APIs
export const storeAPI = {
  getAll: () => api.get('/stores'),
  getById: (id: number) => api.get(`/stores/${id}`),
};

export default api;
