import React, { useState } from 'react';
import { Sprout, Beaker, Thermometer, CloudRain, MapPin, Volume2, VolumeX, Sparkles, AlertCircle, RefreshCw } from 'lucide-react';
import { SelectInput, TextInput, NumberInput } from '../components/FormInputs';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import { getCropRecommendations } from '../services/cropService';
import { CropRecommendation as CropRecommendationType, RecommendationInput } from '../types';
import { useTranslation } from '../lib/translations';

export default function CropRecommendation() {
  const { t } = useTranslation();
  const [form, setForm] = useState<RecommendationInput>({
    soilType: 'Loamy Soil',
    phValue: 6.5,
    temperature: 28,
    rainfall: 600,
    location: 'Nagpur, Maharashtra'
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<CropRecommendationType[] | null>(null);
  const [speakingIdx, setSpeakingIdx] = useState<number | null>(null);

  // Simple simulated Speech voiceover for farmer accessibility
  const handleTTS = (crop: CropRecommendationType, idx: number) => {
    if (speakingIdx === idx) {
      window.speechSynthesis.cancel();
      setSpeakingIdx(null);
      return;
    }

    window.speechSynthesis.cancel();
    
    // Fallback if SpeechSynthesis is not supported of if wrapped inside strict iframe constraints
    const messageText = `Crop recommendation: ${crop.name}. Suitability score is ${crop.suitabilityScore} percent. Expected yield is ${crop.expectedYield} per acre. Profitability rating is defined as ${crop.profitability}. Description: ${crop.description}`;
    const utterance = new SpeechSynthesisUtterance(messageText);
    
    utterance.onend = () => {
      setSpeakingIdx(null);
    };
    utterance.onerror = () => {
      setSpeakingIdx(null);
    };

    setSpeakingIdx(idx);
    window.speechSynthesis.speak(utterance);
  };

  const handleInputChange = (field: keyof RecommendationInput, value: any) => {
    setForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResults(null);

    // Stop speaking if active
    window.speechSynthesis.cancel();
    setSpeakingIdx(null);

    try {
      // Validate inputs cleanly
      if (form.phValue < 0 || form.phValue > 14) {
        throw new Error('pH value must be between 0.0 and 14.0 for proper biological compatibility.');
      }
      if (form.temperature < -10 || form.temperature > 60) {
        throw new Error('Temperature reading appears biologically unrealistic. Enter values between -10°C and 60°C.');
      }
      if (form.rainfall < 0) {
        throw new Error('Rainfall coefficient cannot be negative.');
      }
      if (!form.location.trim()) {
        throw new Error('Please enter your farm location or district.');
      }

      const response = await getCropRecommendations(form);
      setResults(response);
    } catch (err: any) {
      setError(err?.message || 'Unable to fetch crop recommendations. Please verify entries.');
    } finally {
      setLoading(false);
    }
  };

  // Pre-load recommendations on mount
  React.useEffect(() => {
    const loadInit = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await getCropRecommendations(form);
        setResults(response);
      } catch (err: any) {
        console.error("Initial load failed", err);
      } finally {
        setLoading(false);
      }
    };
    loadInit();
  }, []);

  const soilOptions = [
    { value: 'Black Soil', label: t('blackSoil') },
    { value: 'Red Soil', label: t('redSoil') },
    { value: 'Sandy Soil', label: t('sandySoil') },
    { value: 'Loamy Soil', label: t('loamySoil') },
    { value: 'Clayey Soil', label: t('clayeySoil') }
  ];

  return (
    <div className="relative min-h-screen bg-[#fcfdfa] pt-28 pb-20 px-4 sm:px-6 lg:px-8">
      
      {/* Decorative vectors */}
      <div className="absolute top-0 right-0 w-[40rem] h-[40rem] bg-gradient-to-b from-emerald-100/20 to-transparent rounded-full blur-[100px] pointer-events-none -z-10"></div>
      
      <div className="max-w-6xl mx-auto space-y-10">
        
        {/* Header Block */}
        <div className="text-center max-w-3xl mx-auto space-y-3.5">
          <div className="inline-flex items-center space-x-1.5 bg-emerald-100/60 border border-emerald-200/50 px-3 py-1 rounded-full text-emerald-800 text-xs font-black uppercase tracking-wider">
            <Sprout className="w-3.5 h-3.5" />
            <span>{t('aiAdvisor')}</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-emerald-950 tracking-tight leading-tight">
            {t('cropRecTitle')}
          </h1>
          <p className="text-xs sm:text-sm text-emerald-800/80 font-semibold leading-relaxed">
            {t('cropRecSubtitle')}
          </p>
        </div>

        {/* Main Grid content: Form on left, Results on right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Inputs Section */}
          <div className="lg:col-span-5 bg-white/80 backdrop-blur-md rounded-3xl p-6 border border-emerald-100 shadow-sm space-y-6">
            <div className="flex items-center space-x-3 pb-4 border-b border-emerald-50">
              <div className="p-2.5 bg-emerald-600 rounded-xl text-white">
                <Beaker className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-black text-emerald-950">{t('enterFarmDetails')}</h3>
                <p className="text-[10px] text-emerald-700 font-bold">Provide correct agricultural metrics</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              
              <SelectInput
                id="soil-select"
                label="Soil Composition / Type"
                options={soilOptions}
                value={form.soilType}
                onChange={(e) => handleInputChange('soilType', e.target.value)}
              />

              <div className="grid grid-cols-3 gap-3.5">
                <NumberInput
                  id="ph-input"
                  label="Soil pH"
                  unit="pH"
                  minVal={3.0}
                  maxVal={9.5}
                  value={form.phValue}
                  onChange={(e) => handleInputChange('phValue', parseFloat(e.target.value) || 0)}
                  placeholder="6.5"
                  required
                />
                <NumberInput
                  id="temp-input"
                  label="Climate"
                  unit="°C"
                  minVal={10}
                  maxVal={50}
                  value={form.temperature}
                  onChange={(e) => handleInputChange('temperature', parseFloat(e.target.value) || 0)}
                  placeholder="28"
                  required
                />
                <NumberInput
                  id="rain-input"
                  label="Rainfall"
                  unit="mm"
                  minVal={100}
                  maxVal={3000}
                  value={form.rainfall}
                  onChange={(e) => handleInputChange('rainfall', parseFloat(e.target.value) || 0)}
                  placeholder="600"
                  required
                />
              </div>

              <TextInput
                id="loc-input"
                label={t('location')}
                value={form.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
                placeholder="Nagpur, Maharashtra"
                helperText="Determines solar radiation patterns and near Mandi price lists"
                required
              />

              <button
                type="submit"
                id="recommend-crops-btn"
                disabled={loading}
                className="w-full flex items-center justify-center space-x-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white py-3.5 px-4 rounded-2xl font-extrabold tracking-wide text-sm shadow-lg shadow-emerald-600/10 cursor-pointer transition-colors"
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-5 h-5 animate-spin" />
                    <span>{t('loading')}</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    <span>{t('calcButton')}</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Results Display Section */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Loading condition spinner */}
            {loading && (
              <div className="bg-white/80 backdrop-blur-md rounded-3xl p-12 border border-emerald-100 shadow-sm flex flex-col justify-center items-center h-[400px]">
                <LoadingSpinner size="lg" message={t('calcLoading')} />
              </div>
            )}

            {/* Error condition */}
            {error && (
              <div className="py-12">
                <ErrorMessage message={error} />
              </div>
            )}

            {/* Empty default instructions */}
            {!loading && !error && !results && (
              <div className="bg-gradient-to-br from-white/95 to-emerald-50/20 backdrop-blur-md rounded-3xl p-10 border border-emerald-100/80 shadow-sm text-center space-y-5 h-[400px] flex flex-col justify-center items-center">
                <div className="mx-auto w-16 h-16 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center shadow-inner">
                  <Sprout className="w-8 h-8" />
                </div>
                <div className="space-y-1.5">
                  <h3 className="text-xl font-black text-emerald-950">Awaiting Farm Inputs</h3>
                  <p className="text-xs text-emerald-800/70 font-semibold max-w-sm mx-auto">
                    Fill out the parameters form on the left pane and tap "{t('calcButton')}" to trigger our calculations.
                  </p>
                </div>
              </div>
            )}

            {/* Results Output list */}
            {!loading && !error && results && (
              <div className="space-y-5 animate-fade-in">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-black text-emerald-950 flex items-center space-x-1.5">
                    <span>{t('resultsTitle')}</span>
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100/70 py-0.5 px-2 rounded-full font-mono">{results.length} Matches</span>
                  </h3>
                  <span className="text-[10px] text-emerald-700 font-bold flex items-center gap-1 bg-emerald-50 px-2.5 py-1 rounded-full">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" /> {t('listenVoice')}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {results.map((crop, idx) => (
                    <div
                      key={crop.name}
                      className="bg-white rounded-3xl overflow-hidden border border-emerald-100 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col justify-between"
                    >
                      {/* Crop Image + Badges */}
                      <div className="relative h-44 bg-emerald-100">
                        <img
                          src={crop.image}
                          alt={crop.name}
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/40 via-transparent to-transparent"></div>
                        
                        {/* Suitability score badge */}
                        <div className="absolute top-3.5 left-3.5 bg-emerald-600 border border-emerald-500 text-white rounded-full px-3 py-1 text-xs font-black shadow-md flex items-center space-x-1">
                          <span className="text-[10px] uppercase font-bold tracking-widest mr-0.5">{t('score')}</span>
                          <span>{crop.suitabilityScore}%</span>
                        </div>

                        {/* Profitability tag */}
                        <div className={`absolute top-3.5 right-3.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase border shadow-md ${
                          crop.profitability === 'High'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
                            : 'bg-amber-50 text-amber-700 border-amber-100'
                        }`}>
                          {crop.profitability} {t('profitability')}
                        </div>
                      </div>

                      {/* Content block */}
                      <div className="p-5 flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex justify-between items-start">
                            <h4 className="text-xl font-bold text-emerald-950 tracking-tight">
                              {crop.name}
                            </h4>
                            <button
                              onClick={() => handleTTS(crop, idx)}
                              className={`p-2 rounded-xl border focus:outline-none transition-all ${
                                speakingIdx === idx
                                  ? 'bg-emerald-600 border-emerald-500 text-white animate-pulse'
                                  : 'bg-emerald-50 border-emerald-100 text-emerald-700 hover:bg-emerald-100'
                              }`}
                              title={speakingIdx === idx ? 'Stop dynamic voice explanation' : t('listenVoice')}
                            >
                              {speakingIdx === idx ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                            </button>
                          </div>
                          
                          <p className="text-xs text-emerald-800/75 mt-1 leading-relaxed font-semibold">
                            {crop.description}
                          </p>
                        </div>

                        {/* Extra physical traits table */}
                        <div className="mt-5 pt-4 border-t border-emerald-50 grid grid-cols-2 gap-3.5 text-xs">
                          <div>
                            <span className="block text-[10px] text-emerald-700/60 uppercase font-bold">{t('expectedYield')}</span>
                            <span className="block font-black text-emerald-950 mt-0.5">{crop.expectedYield}</span>
                          </div>
                          <div>
                            <span className="block text-[10px] text-emerald-700/60 uppercase font-bold">{t('sowingPeriod')}</span>
                            <span className="block font-black text-emerald-950 mt-0.5">{crop.bestSowingSeason.split(' (')[0]}</span>
                          </div>
                          <div>
                            <span className="block text-[10px] text-emerald-700/60 uppercase font-bold">{t('optimalPhRange')}</span>
                            <span className="block font-black text-emerald-950 mt-0.5">{crop.optimalPH}</span>
                          </div>
                          <div>
                            <span className="block text-[10px] text-emerald-700/60 uppercase font-bold">{t('waterRequirement')}</span>
                            <span className="block font-black text-emerald-950 mt-0.5 truncate">{crop.waterRequirement.split(' (')[0]}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>

        </div>

      </div>

    </div>
  );
}
