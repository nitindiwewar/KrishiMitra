import { DiseaseDetectionResult } from '../types';
import { api } from './api';

export const analyzeLeafDisease = async (imageFile: File | null, exampleId?: string): Promise<DiseaseDetectionResult> => {
  let imageBase64: string | undefined = undefined;

  if (imageFile) {
    // Read the file structure as base64 client-side to transmit to the full-stack server safely
    imageBase64 = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (err) => reject(err);
      reader.readAsDataURL(imageFile);
    });
  }

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

  return api.post<DiseaseDetectionResult>('/api/disease/analyze', {
    imageBase64,
    exampleId,
    mobile
  });
};

