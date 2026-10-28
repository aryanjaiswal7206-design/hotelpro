import axios from 'axios';

const API = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor: attach token
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('hotelpro_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: handle 401 token expiry
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Clear storage if token is invalid, but don't redirect if already on login/register
      const path = window.location.pathname;
      if (path !== '/login' && path !== '/register') {
        localStorage.removeItem('hotelpro_token');
        localStorage.removeItem('hotelpro_user');
      }
    }
    return Promise.reject(error);
  }
);

// Auth Services
export const authAPI = {
  register: (data) => API.post('/auth/register', data),
  login: (data) => API.post('/auth/login', data),
  getMe: () => API.get('/auth/me'),
  updateProfile: (data) => API.put('/auth/profile', data),
  updatePassword: (data) => API.put('/auth/password', data),
  getAllUsers: () => API.get('/auth/users'),
};

// Room Services
export const roomAPI = {
  getAll: (params) => API.get('/rooms', { params }),
  getById: (id) => API.get(`/rooms/${id}`),
  create: (data) => API.post('/rooms', data),
  update: (id, data) => API.put(`/rooms/${id}`, data),
  updateStatus: (id, data) => API.patch(`/rooms/${id}/status`, data),
  delete: (id) => API.delete(`/rooms/${id}`),
};

// Booking Services
export const bookingAPI = {
  create: (data) => API.post('/bookings', data),
  getAll: (params) => API.get('/bookings', { params }),
  getMy: () => API.get('/bookings/my'),
  getById: (id) => API.get(`/bookings/${id}`),
  updateStatus: (id, data) => API.patch(`/bookings/${id}/status`, data),
  cancel: (id, data) => API.patch(`/bookings/${id}/cancel`, data),
};

// Guest CRM Services
export const guestAPI = {
  getAll: (params) => API.get('/guests', { params }),
  getById: (id) => API.get(`/guests/${id}`),
  create: (data) => API.post('/guests', data),
  update: (id, data) => API.put(`/guests/${id}`, data),
  delete: (id) => API.delete(`/guests/${id}`),
};

// Payment & Billing Services
export const paymentAPI = {
  getAll: (params) => API.get('/payments', { params }),
  getById: (id) => API.get(`/payments/${id}`),
  getByBookingId: (bookingId) => API.get(`/payments/booking/${bookingId}`),
  refund: (id) => API.patch(`/payments/${id}/refund`),
};

// Analytics & Dashboard Services
export const dashboardAPI = {
  getStats: () => API.get('/dashboard/stats'),
};

export default API;
