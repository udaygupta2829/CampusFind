import api from './api';

export const adminService = {
  async getDashboardStats() {
    const response = await api.get('/admin/dashboard');
    return response.data;
  },

  async getAllClaims(pendingOnly = false) {
    const response = await api.get('/admin/claims', {
      params: { pendingOnly }
    });
    return response.data;
  },

  async approveClaim(claimId, adminNotes) {
    const response = await api.put(`/admin/claims/${claimId}/approve`, { adminNotes });
    return response.data;
  },

  async rejectClaim(claimId, adminNotes) {
    const response = await api.put(`/admin/claims/${claimId}/reject`, { adminNotes });
    return response.data;
  },

  async createReturnRecord(data) {
    const response = await api.post('/admin/return-records', data);
    return response.data;
  },

  async getAllReturnRecords() {
    const response = await api.get('/admin/return-records');
    return response.data;
  },

  async getAllReports(type) {
    const response = await api.get('/admin/reports', {
      params: type ? { type } : {}
    });
    return response.data;
  }
};
