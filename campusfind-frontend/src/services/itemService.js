import api from './api';

export const itemService = {
  async getAllItems(type) {
    const params = type ? { type } : {};
    const response = await api.get('/items', { params });
    return response.data;
  },

  async getReportById(id) {
    const response = await api.get(`/items/${id}`);
    return response.data;
  },

  async createReport(data) {
    const response = await api.post('/items', data);
    return response.data;
  },

  async updateReport(id, data) {
    const response = await api.put(`/items/${id}`, data);
    return response.data;
  },

  async deleteReport(id) {
    const response = await api.delete(`/items/${id}`);
    return response.data;
  },

  async searchReports(filters) {
    const response = await api.get('/items/search', { params: filters });
    return response.data;
  },

  async getMyReports() {
    const response = await api.get('/my-reports');
    return response.data;
  },

  async uploadImage(file) {
    const formData = new FormData();
    formData.append('file', file);
    const response = await api.post('/items/upload-image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  async updateStatus(id, status) {
    const response = await api.patch(`/items/${id}/status`, { status });
    return response.data;
  }
};
