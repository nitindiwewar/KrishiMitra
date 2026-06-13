import { WeatherInfo, DailyForecast } from '../types';

export const getWeatherData = async (location: string): Promise<{ current: WeatherInfo; forecast: DailyForecast[] }> => {
  // Simulate network latency
  await new Promise((resolve) => setTimeout(resolve, 600));

  // Determine dynamic offsets based on location string length just to make it react differently to searches
  const hash = location.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const tempOffset = (hash % 10) - 5; // -5 to +4
  const humOffset = (hash % 20) - 10; // -10 to +9
  const rainOffset = (hash % 30) - 15; // -15 to +14

  const current: WeatherInfo = {
    location: location || 'Nagpur, Maharashtra',
    temperature: Math.max(18, Math.min(45, 32 + tempOffset)),
    humidity: Math.max(40, Math.min(95, 70 + humOffset)),
    rainChance: Math.max(0, Math.min(100, 80 + rainOffset)),
    windSpeed: Math.max(4, Math.min(30, 10 + (hash % 6))),
    condition: (80 + rainOffset) > 70 ? 'Cloudy & Humid / Showers' : (80 + rainOffset) > 40 ? 'Overcast Sky' : 'Sunny & Clear',
    uvIndex: Math.max(1, Math.min(11, 8 + (tempOffset > 0 ? 1 : -1))),
    airQuality: (hash % 3 === 0) ? 'Good (42 AQI)' : (hash % 3 === 1) ? 'Moderate (68 AQI)' : 'Ideal (28 AQI)'
  };

  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  
  // Create dynamic daily forecast
  const forecast: DailyForecast[] = days.map((day, ix) => {
    const dailyHash = hash + ix * 13;
    const dailyRain = Math.max(10, Math.min(100, 60 + (dailyHash % 41) - 20));
    return {
      day,
      temp: Math.max(20, Math.min(42, 30 + (dailyHash % 9) - 4)),
      condition: dailyRain > 75 ? 'Heavy Rain' : dailyRain > 50 ? 'Rain Showers' : dailyRain > 30 ? 'Partly Cloudy' : 'Sunny & Dry',
      rainChance: dailyRain
    };
  });

  // TODO: Replace with official Weather integration:
  // axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=YOUR_KEY`)

  return { current, forecast };
};
