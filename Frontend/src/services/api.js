import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  login: (data) => api.post('/auth/login', data),
  register: (data) => api.post('/auth/register', data),
  getProfile: () => api.get('/auth/profile'),
  updateProfile: (data) => api.put('/auth/profile', data),
};

export const userAPI = {
  getUsers: (params) => api.get('/users', { params }),
  getUserStats: () => api.get('/users/stats'),
  getUserProfile: (id) => api.get(`/users/${id}`),
  updateUserProfile: (data) => api.put('/users/profile', data),
  changePassword: (data) => api.put('/users/change-password', data),
  deactivateAccount: () => api.put('/users/deactivate'),
  searchUsers: (query) => api.get(`/users/search?q=${query}`)
};

export const productAPI = {
  getProducts: (params) => api.get('/products', { params }),
  getProduct: (id) => api.get(`/products/${id}`),
  createProduct: (data) => api.post('/products', data),
  updateProduct: (id, data) => api.put(`/products/${id}`, data),
  deleteProduct: (id) => api.delete(`/products/${id}`),
  getSellerProducts: (params) => api.get('/products/seller', { params }),
  getRecentProducts: () => api.get('/products/recent'),
};

export const orderAPI = {
  createOrder: (data) => api.post('/orders', data),
  getBuyerOrders: (params) => api.get('/orders/buyer', { params }),
  getSellerOrders: (params) => api.get('/orders/seller', { params }),
  getOrder: (id) => api.get(`/orders/${id}`),
  updateOrderStatus: (id, data) => api.put(`/orders/${id}/status`, data),
  getBuyerStats: () => api.get('/orders/buyer/dashboard'),
  createRequest: (data) => api.post('/requests', data),
};

export const reviewAPI = {
  createReview: (data) => api.post('/reviews', data),
  getProductReviews: (productId, params) => api.get(`/reviews/product/${productId}`, { params }),
  getSellerReviews: (sellerId, params) => api.get(`/reviews/seller/${sellerId}`, { params }),
  getUserReviews: (params) => api.get('/reviews/user', { params }),
  updateReview: (id, data) => api.put(`/reviews/${id}`, data),
  deleteReview: (id) => api.delete(`/reviews/${id}`),
};

export const sellerAPI = {
  getDashboardStats: () => api.get('/seller/dashboard'),
  getRecentItems: (params) => api.get('/seller/recent-items', { params }),
  getSellerProducts: (params) => api.get('/products/seller', { params }),
  getSellerOrders: (params) => api.get('/orders/seller', { params }),
  getSellerReviews: (params) => api.get('/reviews/seller', { params }),
  getAnalytics: (params) => api.get('/seller/analytics', { params }),
};

export const adminAPI = {
  getDashboardStats: () => api.get('/admin/dashboard'),
  getRecentActivities: () => api.get('/admin/activities'),
  getAllUsers: (params) => api.get('/admin/users', { params }),
  getBuyers: (params) => api.get('/admin/users', { params: { ...params, userType: 'buyer' } }),
  getSellers: (params) => api.get('/admin/users', { params: { ...params, userType: 'seller' } }),
  createUser: (data) => api.post('/admin/users', data),
  updateUser: (id, data) => api.put(`/admin/users/${id}`, data),
  deleteUser: (id) => api.delete(`/admin/users/${id}`),
  updateUserStatus: (id, data) => api.put(`/admin/users/${id}/status`, data),
  getAllProducts: (params) => api.get('/admin/products', { params }),
  updateProductStatus: (id, data) => api.put(`/admin/products/${id}/status`, data),
  getAllOrders: (params) => api.get('/admin/orders', { params }),
  getAnalytics: (params) => api.get('/admin/analytics', { params }),
  getCategories: () => api.get('/admin/categories'),
  createCategory: (data) => api.post('/admin/categories', data),
  updateCategory: (id, data) => api.put(`/admin/categories/${id}`, data),
  getCommissionData: () => api.get('/admin/commission'),
};

export const requestAPI = {
  createRequest: (data) => api.post('/requests/create', data),
  getSellerRequests: () => api.get('/requests/seller'),
  getBuyerRequests: () => api.get('/requests/buyer'),
  updateRequestStatus: (id, data) => api.put(`/requests/${id}/status`, data),
  deleteRequest: (id) => api.delete(`/requests/${id}`),
};

export default api;