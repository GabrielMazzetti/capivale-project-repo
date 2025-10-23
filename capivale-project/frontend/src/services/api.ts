import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true, // Important for sending the httpOnly cookie
});

// Interceptor to add the Authorization header
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;

export const adminApi = {
  // Category Management
  getCategories: () => api.get('/categories'),
  createCategory: (data: { name: string; description?: string }) => api.post('/categories', data),
  updateCategory: (id: string, data: { name?: string; description?: string }) => api.put(`/categories/${id}`, data),
  deleteCategory: (id: string) => api.delete(`/categories/${id}`),
};

export const merchantApi = {
  // Product Management
  getProducts: () => api.get('/merchants/products'),
  getProductById: (id: string) => api.get(`/merchants/products/${id}`),
  createProduct: (data: { name: string; description?: string; priceBRL: number }) => api.post('/merchants/products', data),
  updateProduct: (id: string, data: { name?: string; description?: string; priceBRL?: number }) => api.put(`/merchants/products/${id}`, data),
  deleteProduct: (id: string) => api.delete(`/merchants/products/${id}`),

  // Sales Management
  registerSale: (data: { items: { productId: string; quantity: number }[]; paymentMethod: string }) => api.post('/merchants/sales/register', data),
  getSalesHistory: (params?: { startDate?: string; endDate?: string; paymentMethod?: string }) => api.get('/merchants/sales', { params }),

  // Conversion Rate
  getCapivaleBRLRate: () => api.get('/rates/capivale-brl'),

  // Profile Management
  getProfile: () => api.get('/merchants/profile'),
  updateProfile: (data: { name?: string; email?: string; cnpj?: string; companyName?: string; phone?: string; address?: string }) => api.put('/merchants/profile', data),
};

// FAQ API functions
export const faqApi = {
  getFaqs: () => api.get('/faqs'),
  createFaq: (data: { question: string; answer: string }) => api.post('/faqs', data),
  updateFaq: (id: string, data: { question: string; answer: string }) => api.put(`/faqs/${id}`, data),
  deleteFaq: (id: string) => api.delete(`/faqs/${id}`),
};

export const activityApi = {
  // Admin Activity Management
  adminGetActivities: () => api.get('/activities'),
  adminCreateActivity: (data: { title: string; description: string; reward_amount: number }) => api.post('/activities', data),
  adminUpdateActivity: (id: string, data: { title?: string; description?: string; reward_amount?: number }) => api.put(`/activities/${id}`, data),
  adminDeleteActivity: (id: string) => api.delete(`/activities/${id}`),

  // User Activity Management
  userListActivities: () => api.get('/activities/public/all'),
  userCompleteActivity: (id: string) => api.post(`/activities/${id}/complete`, {}),
};
