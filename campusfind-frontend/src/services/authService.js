import api from './api';

export const authService = {
  async register(data) {
    const response = await api.post('/auth/register', data);
    return response.data;
  },

  async login(credentials) {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },

  async getProfile() {
    const response = await api.get('/users/profile');
    return response.data;
  },

  async updateProfile(data) {
    const response = await api.put('/users/profile', data);
    return response.data;
  },

  saveAuth(authData) {
    localStorage.setItem('campusfind_token', authData.token);
    localStorage.setItem('campusfind_user', JSON.stringify(authData));
  },

  getStoredUser() {
    const user = localStorage.getItem('campusfind_user');
    return user ? JSON.parse(user) : null;
  },

  getToken() {
    return localStorage.getItem('campusfind_token');
  },

  logout() {
    localStorage.removeItem('campusfind_token');
    localStorage.removeItem('campusfind_user');
  }
};
