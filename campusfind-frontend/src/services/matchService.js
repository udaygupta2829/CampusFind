import api from './api';

export const matchService = {
  async getMatches() {
    const response = await api.get('/matches');
    return response.data;
  },

  async getMatchesForLostItem(lostId) {
    const response = await api.get(`/matches/lost/${lostId}`);
    return response.data;
  },

  async getMatchesForFoundItem(foundId) {
    const response = await api.get(`/matches/found/${foundId}`);
    return response.data;
  },

  async updateMatchStatus(matchId, status) {
    const response = await api.patch(`/matches/${matchId}/status`, { status });
    return response.data;
  }
};
