export interface CropRecommendation {
  name: string;
  suitabilityScore: number;
  expectedYield: string;
  profitability: 'High' | 'Medium' | 'Low';
  description: string;
  image: string;
  bestSowingSeason: string;
  optimalPH: string;
  waterRequirement: string;
}

export interface RecommendationInput {
  soilType: 'Black Soil' | 'Red Soil' | 'Sandy Soil' | 'Loamy Soil';
  phValue: number;
  temperature: number;
  rainfall: number;
  location: string;
}

export interface DiseaseDetectionResult {
  disease: string;
  confidence: number;
  cause: string;
  treatment: string;
  prevention: string;
  severity: 'Low' | 'Medium' | 'High';
}

export interface WeatherInfo {
  temperature: number;
  humidity: number;
  rainChance: number;
  windSpeed: number;
  location: string;
  condition: string;
  uvIndex: number;
  airQuality: string;
}

export interface DailyForecast {
  day: string;
  temp: number;
  condition: string;
  rainChance: number;
}

export interface MarketPrice {
  crop: string;
  price: number; // in ₹/quintal
  location: string;
  trend: 'up' | 'down' | 'stable';
  change: number; // price difference or percentage change
  updatedAt: string;
}
