import React from 'react';
import { ArrowDown, ArrowUp, Calendar, MapPin, Minus } from 'lucide-react';
import { MarketPrice } from '../types';

interface MarketCardProps {
  price: MarketPrice;
}

export default function MarketCard({ price }: MarketCardProps) {
  const isUp = price.trend === 'up';
  const isDown = price.trend === 'down';

  return (
    <div className="bg-white/90 backdrop-blur-md rounded-3xl p-5 border border-emerald-100 shadow-sm hover:shadow-md hover:border-emerald-200 transition-all duration-300">
      <div className="flex justify-between items-start mb-3">
        <div>
          <h4 className="text-lg font-black text-emerald-950 tracking-tight">
            {price.crop}
          </h4>
          <div className="flex items-center space-x-1 mt-1 text-xs text-emerald-800 font-medium">
            <MapPin className="w-3.5 h-3.5 shrink-0 text-emerald-600" />
            <span className="truncate max-w-[150px]" title={price.location}>{price.location}</span>
          </div>
        </div>

        {/* Change indicator badge */}
        <div
          className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold font-mono border ${
            isUp
              ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
              : isDown
              ? 'bg-red-50 text-red-600 border-red-100'
              : 'bg-slate-50 text-slate-600 border-slate-100'
          }`}
        >
          {isUp ? (
            <ArrowUp className="w-3.5 h-3.5" />
          ) : isDown ? (
            <ArrowDown className="w-3.5 h-3.5" />
          ) : (
            <Minus className="w-3.5 h-3.5" />
          )}
          <span>
            {price.change === 0
              ? 'Stable'
              : `${price.change > 0 ? '+' : ''}${price.change}`}
          </span>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-emerald-50/50 flex justify-between items-end">
        <div>
          <span className="text-xs font-bold text-emerald-800/60 uppercase block">
            Rate / Quintal
          </span>
          <span className="text-2xl font-black text-emerald-950 tracking-tight block mt-0.5">
            ₹{price.price.toLocaleString('en-IN')}
          </span>
        </div>

        <div className="text-right text-[10px] text-emerald-700 font-medium flex items-center space-x-1 bg-emerald-50/80 px-2.5 py-1 rounded-lg">
          <Calendar className="w-3 h-3 shrink-0" />
          <span className="truncate">{price.updatedAt.replace('Today,', '').trim()}</span>
        </div>
      </div>
    </div>
  );
}
