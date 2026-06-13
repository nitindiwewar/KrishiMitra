import React, { useState, useEffect } from 'react';
import { Search, CloudSun, MapPin, AlertCircle, RefreshCw, HelpCircle, Activity, Droplets, HeartHandshake } from 'lucide-react';
import WeatherCard from '../components/WeatherCard';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import { getWeatherData } from '../services/weatherService';
import { WeatherInfo, DailyForecast } from '../types';

export default function WeatherDashboard() {
  const [searchQuery, setSearchQuery] = useState('Nagpur, Maharashtra');
  const [submittingQuery, setSubmittingQuery] = useState('Nagpur, Maharashtra');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [currentWeather, setCurrentWeather] = useState<WeatherInfo | null>(null);
  const [weeklyForecast, setWeeklyForecast] = useState<DailyForecast[] | null>(null);

  // Load default weather on mount
  useEffect(() => {
    fetchWeatherData(submittingQuery);
  }, [submittingQuery]);

  const fetchWeatherData = async (loc: string) => {
    setLoading(true);
    setError(null);
    try {
      if (!loc.trim()) {
        throw new Error('Please enter a valid district or city name.');
      }
      const data = await getWeatherData(loc);
      setCurrentWeather(data.current);
      setWeeklyForecast(data.forecast);
    } catch (err: any) {
      setError(err?.message || 'Failed to fetch weather metrics. Connect your GPS receiver or retry.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittingQuery(searchQuery);
  };

  // Weather alerts lists
  const alerts = [
    { type: 'Rain Alert', desc: 'Heavy monsoon cloud formations active. Expect thunderstorm showers tomorrow.' },
    { type: 'Pest Notice', desc: 'Warm wet environments are active. High Cercospora risk inside tomato holdings.' },
    { type: 'Arbitrage', desc: 'Slight harvest delay recommended to secure dry seed quality for Wheat.' }
  ];

  return (
    <div className="relative min-h-screen bg-[#fcfdfa] pt-28 pb-20 px-4 sm:px-6 lg:px-8">
      
      {/* Visual gradients */}
      <div className="absolute top-0 right-0 w-[40rem] h-[40rem] bg-gradient-to-b from-sky-100/20 to-transparent rounded-full blur-[100px] pointer-events-none -z-10"></div>

      <div className="max-w-6xl mx-auto space-y-10">
        
        {/* Header Block with Search */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 pb-6 border-b border-emerald-100/50">
          <div>
            <div className="inline-flex items-center space-x-1.5 bg-sky-55 hover:bg-sky-100/50 border border-sky-100 px-3 py-1 rounded-full text-sky-800 text-xs font-black uppercase tracking-wider select-none">
              <CloudSun className="w-3.5 h-3.5" />
              <span>Climate control dashboard</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-black text-emerald-950 tracking-tight leading-tight mt-2.5">
              Live Agricultural Weather
            </h1>
            <p className="text-xs sm:text-sm text-emerald-800/80 font-semibold leading-relaxed mt-1">
              Search local districts below to assess soil saturation, wind shear velocities, and rain thresholds.
            </p>
          </div>

          {/* Search bar */}
          <form onSubmit={handleSearch} className="flex-shrink-0 w-full md:w-96">
            <div className="relative">
              <input
                type="text"
                id="weather-search-query"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search district e.g. Nagpur..."
                className="w-full bg-white border border-emerald-200 rounded-2xl py-3.5 pl-10 pr-24 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-600 transition-all text-emerald-950"
              />
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-700" />
              <button
                type="submit"
                id="do-weather-search-btn"
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-emerald-600 text-white font-extrabold text-xs py-2 px-4 rounded-xl shadow cursor-pointer hover:bg-emerald-700 transition"
              >
                Search
              </button>
            </div>
          </form>
        </div>

        {/* Loading segment */}
        {loading && (
          <div className="bg-white/85 rounded-3xl p-16 border border-emerald-100 shadow-sm flex items-center justify-center h-[350px]">
            <LoadingSpinner message="Querying live APMC weather nodes and meteorological radars..." />
          </div>
        )}

        {/* Error handling block */}
        {error && !loading && (
          <div className="py-8">
            <ErrorMessage message={error} onRetry={() => fetchWeatherData(submittingQuery)} />
          </div>
        )}

        {/* Main Dashboard Panel elements */}
        {!loading && !error && currentWeather && weeklyForecast && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch animate-fade-in">
            
            {/* Left Column: Big Weather Card + weekly panel */}
            <div className="lg:col-span-8 space-y-6">
              
              {/* Massive telemetry block */}
              <WeatherCard weather={currentWeather} />

              {/* Weekly forecast horizontal sub-grid */}
              <div className="bg-white/80 backdrop-blur-md rounded-3xl p-5 border border-emerald-100 shadow-sm space-y-4">
                <h3 className="text-sm font-black text-emerald-950 px-1 uppercase tracking-wider">
                  Weekly 7-Day Forecast Radar
                </h3>
                
                <div className="grid grid-cols-4 sm:grid-cols-7 gap-3">
                  {weeklyForecast.map((fc, index) => {
                    const isHighRain = fc.rainChance > 60;
                    return (
                      <div
                        key={fc.day}
                        className="p-3.5 rounded-2xl bg-emerald-50/20 hover:bg-emerald-50 border border-emerald-100/30 hover:border-emerald-200 transition text-center space-y-1.5 flex flex-col justify-between"
                      >
                        <span className="block text-xs font-bold text-emerald-800/60 uppercase">{fc.day}</span>
                        <span className="block text-xl font-black text-emerald-950 font-mono mt-1">{fc.temp}°</span>
                        <div className={`mx-auto p-1.5 rounded-lg w-max ${
                          isHighRain ? 'bg-blue-50 text-blue-600' : 'bg-emerald-50 text-emerald-700'
                        }`}>
                          <CloudSun className="w-4 h-4" />
                        </div>
                        <span className={`block text-[9px] font-bold ${
                          isHighRain ? 'text-blue-700' : 'text-emerald-700'
                        }`}>
                          {fc.rainChance}% rain
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>

            {/* Right Column: Agricultural advisory panels and Alerts */}
            <div className="lg:col-span-4 bg-white/80 backdrop-blur-md rounded-3xl p-6 border border-emerald-100 shadow-sm flex flex-col justify-between">
              <div>
                {/* Header item */}
                <div className="flex items-center space-x-2.5 pb-4 border-b border-emerald-50">
                  <div className="p-2.5 bg-emerald-100 text-emerald-700 rounded-xl">
                    <Activity className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-black text-emerald-950">Farming Alerts</h3>
                    <p className="text-[10px] text-emerald-750 font-bold">Crop safety warnings</p>
                  </div>
                </div>

                {/* Alerts items map */}
                <div className="mt-5 space-y-4.5">
                  {alerts.map((al, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-2xl border border-red-100 bg-red-50/20 flex items-start space-x-3 hover:bg-red-50/40 transition"
                    >
                      <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5 animate-pulse" />
                      <div>
                        <span className="block text-xs font-black text-red-950">{al.type}</span>
                        <span className="block text-xs text-red-900/80 mt-1 font-medium leading-relaxed">
                          {al.desc}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Farmers trust support guidelines */}
              <div className="mt-6 pt-6 border-t border-emerald-50 space-y-5">
                <div className="flex items-center space-x-3.5 text-xs font-bold text-emerald-900 bg-emerald-50/40 p-4 rounded-2.5xl">
                  <HeartHandshake className="w-5 h-5 text-emerald-700 shrink-0" />
                  <span>24/7 Crop Protection Helpline: <br /> <span className="text-emerald-600 font-black">1800-112-5100</span> (Toll-Free)</span>
                </div>
              </div>

            </div>

          </div>
        )}

      </div>

    </div>
  );
}
