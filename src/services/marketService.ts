import { MarketPrice } from '../types';
import { api } from './api';

export const getMarketPrices = async (): Promise<MarketPrice[]> => {
  // Call physical Express REST API
  const prices = await api.get<any[]>('/api/market/prices');
  
  // Clean field names to match frontend expectations (currentPrice mapped to price, market mapped to location)
  return prices.map(p => ({
    crop: p.crop,
    price: Number(p.currentPrice || p.price || 0),
    location: p.market || p.location || 'APMC Mandi',
    trend: p.trend || 'stable',
    change: p.change !== undefined ? Number(p.change) : (p.currentPrice - p.minPrice) || 0,
    updatedAt: p.updatedAt || 'Today, Live Feed'
  }));
};

