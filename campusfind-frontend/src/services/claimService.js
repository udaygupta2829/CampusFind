import api from './api';

export const claimService = {
  async submitClaim(claimData) {
    const response = await api.post('/claims', claimData);
    return response.data;
  },

  async getMyClaims() {
    const response = await api.get('/claims/my-claims');
    return response.data;
  },

  async getClaimById(id) {
    const response = await api.get(`/claims/${id}`);
    return response.data;
  },

  async getClaimsForItem(itemId) {
    const response = await api.get(`/claims/item/${itemId}`);
    return response.data;
  }
};
