import React, { useState, useEffect } from 'react';
import { Search, ArrowUpDown, ChevronDown, Table, LayoutGrid, Sparkles, TrendingUp, TrendingDown, BookOpen, Clock, HelpCircle } from 'lucide-react';
import MarketCard from '../components/MarketCard';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import { getMarketPrices } from '../services/marketService';
import { MarketPrice } from '../types';
import { useTranslation } from '../lib/translations';

export default function MarketPrices() {
  const { t } = useTranslation();
  const [prices, setPrices] = useState<MarketPrice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'default' | 'priceAsc' | 'priceDesc'>('default');
  const [filterTrend, setFilterTrend] = useState<'all' | 'up' | 'down' | 'stable'>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  useEffect(() => {
    fetchPrices();
  }, []);

  const fetchPrices = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getMarketPrices();
      setPrices(data);
    } catch (err: any) {
      setError('Unable to retrieve latest Mandi price index. Connect to Internet & retry.');
    } finally {
      setLoading(false);
    }
  };

  // Filter and Sort implementation
  const filteredAndSortedPrices = prices
    .filter((p) => {
      const matchesSearch = p.crop.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            p.location.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesTrend = filterTrend === 'all' || p.trend === filterTrend;
      return matchesSearch && matchesTrend;
    })
    .sort((a, b) => {
      if (sortBy === 'priceAsc') return a.price - b.price;
      if (sortBy === 'priceDesc') return b.price - a.price;
      return 0; // default (server response indexing)
    });

  return (
    <div className="relative min-h-screen bg-[#fcfdfa] pt-28 pb-20 px-4 sm:px-6 lg:px-8">
      
      {/* Decorative vectors */}
      <div className="absolute top-0 right-0 w-[40rem] h-[40rem] bg-gradient-to-b from-amber-100/15 to-transparent rounded-full blur-[100px] pointer-events-none -z-10"></div>

      <div className="max-w-6xl mx-auto space-y-10">
        
        {/* Header Block */}
        <div className="text-center max-w-3xl mx-auto space-y-3.5">
          <div className="inline-flex items-center space-x-1.5 bg-amber-50 hover:bg-amber-100/50 border border-amber-100 px-3 py-1 rounded-full text-amber-800 text-xs font-black uppercase tracking-wider select-none">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>{t('trend')}</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-emerald-950 tracking-tight leading-tight">
            {t('marketTitle')}
          </h1>
          <p className="text-xs sm:text-sm text-emerald-805 font-semibold leading-relaxed">
            {t('marketSubtitle')}
          </p>
        </div>

        {/* Filters and Controls Console */}
        <div className="bg-white/80 backdrop-blur-md rounded-3xl p-5 border border-emerald-100 shadow-sm space-y-4">
          
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Search Input */}
            <div className="relative w-full md:w-80">
              <input
                type="text"
                id="commodity-search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={t('searchPlaceholder')}
                className="w-full bg-white border border-emerald-200 rounded-2xl py-3 pl-10 pr-4 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-600 text-emerald-950"
              />
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-700" />
            </div>

            {/* Sorting and Filtering Dropdowns */}
            <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-end">
              
              {/* Trend Filter Toggle */}
              <div className="flex items-center space-x-1.5 bg-emerald-50/50 border border-emerald-100/40 p-1 rounded-xl">
                <button
                  id="filter-trend-all"
                  onClick={() => setFilterTrend('all')}
                  className={`text-[10px] font-extrabold px-3 py-1.5 rounded-lg transition-all ${
                    filterTrend === 'all' ? 'bg-emerald-600 text-white shadow-sm' : 'text-emerald-900 hover:text-emerald-700'
                  }`}
                >
                  All Trends
                </button>
                <button
                  id="filter-trend-up"
                  onClick={() => setFilterTrend('up')}
                  className={`text-[10px] font-extrabold px-3 py-1.5 rounded-lg transition-all flex items-center space-x-1 ${
                    filterTrend === 'up' ? 'bg-emerald-600 text-white shadow-sm' : 'text-emerald-900 hover:text-emerald-700'
                  }`}
                >
                  <TrendingUp className="w-3 h-3 shrink-0" />
                  <span>Surges</span>
                </button>
                <button
                  id="filter-trend-down"
                  onClick={() => setFilterTrend('down')}
                  className={`text-[10px] font-extrabold px-3 py-1.5 rounded-lg transition-all flex items-center space-x-1 ${
                    filterTrend === 'down' ? 'bg-emerald-600 text-white shadow-sm' : 'text-emerald-900 hover:text-emerald-700'
                  }`}
                >
                  <TrendingDown className="w-3 h-3 shrink-0" />
                  <span>Dips</span>
                </button>
              </div>

              {/* Sort price toggle */}
              <select
                id="market-sort-select"
                value={sortBy}
                onChange={(e: any) => setSortBy(e.target.value)}
                className="bg-white border border-emerald-200 rounded-xl px-3 py-2 text-xs font-bold text-emerald-950 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 cursor-pointer"
              >
                <option value="default">Default APMC Index</option>
                <option value="priceAsc">Price: Low to High</option>
                <option value="priceDesc">Price: High to Low</option>
              </select>

              {/* Grid or Table layout toggle */}
              <div className="flex bg-emerald-50 border border-emerald-100 p-0.5 rounded-xl shrink-0">
                <button
                  id="view-grid-btn"
                  onClick={() => setViewMode('grid')}
                  className={`p-1.5 rounded-lg transition ${
                    viewMode === 'grid' ? 'bg-white text-emerald-800 shadow-sm' : 'text-emerald-500 hover:text-emerald-800'
                  }`}
                  title="Grid View"
                >
                  <LayoutGrid className="w-4 h-4" />
                </button>
                <button
                  id="view-table-btn"
                  onClick={() => setViewMode('table')}
                  className={`p-1.5 rounded-lg transition ${
                    viewMode === 'table' ? 'bg-white text-emerald-800 shadow-sm' : 'text-emerald-500 hover:text-emerald-800'
                  }`}
                  title="Table View"
                >
                  <Table className="w-4 h-4" />
                </button>
              </div>

            </div>
          </div>

          {/* Quick Informational Strip */}
          <div className="text-[10px] text-emerald-700 font-bold flex items-center space-x-1.5 bg-emerald-50/40 p-2 rounded-xl">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
            <span>Real-time price feed synchronized: Latur, Raipur, Akola and Nagpur APMC yards. Values represent Rates per Quintal (100 kg).</span>
          </div>

        </div>

        {/* Loading segment */}
        {loading && (
          <div className="bg-white/80 rounded-3xl p-16 border border-emerald-100 shadow-sm h-[300px] flex items-center justify-center">
            <LoadingSpinner message="Re-indexing latest trade sheets and sorting by Mandi values..." />
          </div>
        )}

        {/* Error segment */}
        {error && !loading && (
          <div className="py-8">
            <ErrorMessage message={error} onRetry={fetchPrices} />
          </div>
        )}

        {/* empty lists check */}
        {!loading && !error && filteredAndSortedPrices.length === 0 && (
          <div className="bg-white/85 rounded-3xl p-16 border border-emerald-100 shadow-sm text-center space-y-4">
            <div className="w-12 h-12 bg-amber-50 text-amber-500 rounded-xl flex items-center justify-center mx-auto shadow-inner">
              <Search className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-black text-emerald-950">No Commodities Found</h3>
            <p className="text-xs text-emerald-800/70 font-semibold max-w-sm mx-auto">
              No crop options or auction yards matched "{searchTerm}". Verify spellings or clear current trend filters.
            </p>
          </div>
        )}

        {/* Grid Visual Display mode */}
        {!loading && !error && filteredAndSortedPrices.length > 0 && viewMode === 'grid' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
            {filteredAndSortedPrices.map((price) => (
              <div key={price.crop}>
                <MarketCard price={price} />
              </div>
            ))}
          </div>
        )}

        {/* Table Visual Display mode */}
        {!loading && !error && filteredAndSortedPrices.length > 0 && viewMode === 'table' && (
          <div className="bg-white rounded-3xl border border-emerald-100 shadow-sm overflow-hidden animate-fade-in">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-emerald-50/70 border-b border-emerald-100 text-xs font-bold text-emerald-900 uppercase">
                    <th className="px-6 py-4.5">Commodity / Crop</th>
                    <th className="px-6 py-4.5">Apex APMC Mandi Location</th>
                    <th className="px-6 py-4.5">Live Rate (₹/Qtl)</th>
                    <th className="px-6 py-4.5">Price Delta Index</th>
                    <th className="px-6 py-4.5">State Refresh Timestamp</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-emerald-50 font-semibold text-sm text-emerald-950">
                  {filteredAndSortedPrices.map((p) => {
                    const isUp = p.trend === 'up';
                    const isDown = p.trend === 'down';
                    return (
                      <tr key={p.crop} className="hover:bg-emerald-50/30 transition">
                        {/* Crop cell */}
                        <td className="px-6 py-4 font-black text-emerald-950">{p.crop}</td>
                        {/* Mandi location */}
                        <td className="px-6 py-4 text-emerald-800 text-xs">{p.location}</td>
                        {/* Live Price */}
                        <td className="px-6 py-4 font-black font-mono text-emerald-950">₹{p.price.toLocaleString('en-IN')}</td>
                        {/* price change trend indicator */}
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold font-mono ${
                              isUp
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                                : isDown
                                ? 'bg-red-50 text-red-600 border border-red-100'
                                : 'bg-slate-50 text-slate-500 border border-slate-100'
                            }`}
                          >
                            {isUp ? '▲' : isDown ? '▼' : '●'} {p.change === 0 ? 'Stable' : `${p.change > 0 ? '+' : ''}${p.change}`}
                          </span>
                        </td>
                        {/* Updated at */}
                        <td className="px-6 py-4 text-emerald-700/80 text-xs flex items-center space-x-1.5 pt-4.5">
                          <Clock className="w-3.5 h-3.5 shrink-0 text-emerald-500" />
                          <span>{p.updatedAt}</span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>

    </div>
  );
}
