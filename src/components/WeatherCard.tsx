import React from 'react';
import { CloudRain, Compass, Droplets, Sun, Wind, ShieldAlert, Sparkles, Smile } from 'lucide-react';
import { WeatherInfo } from '../types';

interface WeatherCardProps {
  weather: WeatherInfo;
}

export default function WeatherCard({ weather }: WeatherCardProps) {
  // Agricultural advisory based on rainfall and temperature
  const getAdvisory = () => {
    if (weather.rainChance > 70) {
      return {
        title: 'High Sowing & Water Catchment Window',
        desc: 'Ideal for rain-fed sowing, but postpone any pesticide or weedicide spray treatments as rain will wash them away.',
        type: 'rain',
        color: 'text-blue-800 bg-blue-50/80 border-blue-100',
        icon: CloudRain
      };
    } else if (weather.temperature > 38) {
      return {
        title: 'Heat Stress Advisory',
        desc: 'Ensure extra hydration loops or drip irrigation in the morning. Avoid peak heat activities.',
        type: 'heat',
        color: 'text-amber-800 bg-amber-50/80 border-amber-100',
        icon: Sun
      };
    } else if (weather.humidity > 80 && weather.temperature > 25) {
      return {
        title: 'Mildew / Pest Risk Window',
        desc: 'High relative humidity combined with warm temperatures creates spore spread environments. Inspect lower foliage segments.',
        type: 'pest',
        color: 'text-emerald-800 bg-emerald-50/80 border-emerald-100',
        icon: ShieldAlert
      };
    } else {
      return {
        title: 'Perfect Sowing & Spraying Climate',
        desc: 'Stable wind conditions under 15 km/h and nominal humidity make today ideal for applying crop protection sprays.',
        type: 'ideal',
        color: 'text-emerald-800 bg-emerald-50/80 border-emerald-100',
        icon: Sparkles
      };
    }
  };

  const advisory = getAdvisory();
  const AdvisoryIcon = advisory.icon;

  return (
    <div className="bg-white/80 backdrop-blur-md border border-emerald-100/90 rounded-3xl p-6 shadow-sm hover:shadow-md transition-shadow">
      {/* City & Temperature */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <span className="text-xs font-bold text-emerald-700 bg-emerald-100/80 px-2.5 py-1 rounded-full uppercase tracking-wider">
            Today's Climate
          </span>
          <h3 className="text-2xl font-black text-emerald-950 mt-2 tracking-tight">
            {weather.location}
          </h3>
          <p className="text-sm font-semibold text-emerald-800/80 mt-1 capitalize">
            {weather.condition}
          </p>
        </div>
        <div className="text-right">
          <span className="text-5xl font-black text-emerald-950 tracking-tighter">
            {weather.temperature}°C
          </span>
          <div className="flex items-center gap-1.5 justify-end text-xs font-mono text-emerald-700 mt-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Live Data</span>
          </div>
        </div>
      </div>

      {/* Grid segments */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {/* Humidity */}
        <div className="bg-emerald-50/50 backdrop-blur-sm border border-emerald-100/30 rounded-2xl p-4 flex items-center space-x-3.5">
          <div className="p-2.5 bg-sky-100 text-sky-700 rounded-xl">
            <Droplets className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] font-bold text-emerald-800/70 uppercase">Humidity</p>
            <p className="text-base font-black text-emerald-950 mt-0.5">{weather.humidity}%</p>
          </div>
        </div>

        {/* Rain Chance */}
        <div className="bg-emerald-50/50 backdrop-blur-sm border border-emerald-100/30 rounded-2xl p-4 flex items-center space-x-3.5">
          <div className="p-2.5 bg-blue-100 text-blue-700 rounded-xl">
            <CloudRain className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] font-bold text-emerald-800/70 uppercase">Rain Chance</p>
            <p className="text-base font-black text-emerald-950 mt-0.5">{weather.rainChance}%</p>
          </div>
        </div>

        {/* Wind Speed */}
        <div className="bg-emerald-50/50 backdrop-blur-sm border border-emerald-100/30 rounded-2xl p-4 flex items-center space-x-3.5">
          <div className="p-2.5 bg-amber-100 text-amber-700 rounded-xl">
            <Wind className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] font-bold text-emerald-800/70 uppercase">Wind Speed</p>
            <p className="text-base font-black text-emerald-950 mt-0.5">{weather.windSpeed} km/h</p>
          </div>
        </div>

        {/* Air Quality or UV */}
        <div className="bg-emerald-50/50 backdrop-blur-sm border border-emerald-100/30 rounded-2xl p-4 flex items-center space-x-3.5">
          <div className="p-2.5 bg-emerald-100 text-emerald-700 rounded-xl">
            <Compass className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] font-bold text-emerald-800/70 uppercase">Air Quality</p>
            <p className="text-base font-black text-emerald-950 mt-0.5 truncate max-w-[120px]" title={weather.airQuality}>
              {weather.airQuality.split(' ')[0]}
            </p>
          </div>
        </div>
      </div>

      {/* Dynamic Advisory Panel */}
      <div className={`p-4 rounded-2.5xl border ${advisory.color} flex items-start space-x-3`}>
        <div className="mt-0.5 shrink-0">
          <AdvisoryIcon className="w-5 h-5" />
        </div>
        <div>
          <h4 className="font-bold text-sm leading-tight inline-flex items-center gap-1.5">
            {advisory.title}
          </h4>
          <p className="text-xs mt-1 font-medium leading-relaxed opacity-90">
            {advisory.desc}
          </p>
        </div>
      </div>
    </div>
  );
}
