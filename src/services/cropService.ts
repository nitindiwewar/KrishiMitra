import { CropRecommendation, RecommendationInput } from '../types';
import { api } from './api';

export const getCropRecommendations = async (input: RecommendationInput): Promise<CropRecommendation[]> => {
  // Retrieve user's mobile identifier if logged in
  let mobile = '';
  try {
    const userStr = localStorage.getItem('krishimitra_user');
    if (userStr) {
      const u = JSON.parse(userStr);
      mobile = u.mobile || '';
    }
  } catch {
    // Silence
  }

  // Call physical Express REST API
  return api.post<CropRecommendation[]>('/api/crops/recommendations', {
    ...input,
    mobile
  });
};
