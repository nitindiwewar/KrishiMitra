import React, { useState, useRef } from 'react';
import { Upload, FileImage, ShieldCheck, Bug, Sparkles, RefreshCw, Trash2, Info, CheckCircle, AlertTriangle } from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import { analyzeLeafDisease } from '../services/diseaseService';
import { DiseaseDetectionResult } from '../types';
import { useTranslation } from '../lib/translations';

export default function DiseaseDetection() {
  const { t } = useTranslation();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<DiseaseDetectionResult | null>(null);
  const [dragActive, setDragActive] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Pre-configured leaf presets for immediate testing
  const leafPresets = [
    {
      id: 'cotton-spot',
      label: 'Cotton Leaf Decay',
      desc: 'Alternaria Leaf Spot symptoms',
      imgUrl: 'https://images.unsplash.com/photo-1563514223305-b77da160d1cc?auto=format&fit=crop&q=80&w=300'
    },
    {
      id: 'wheat-rust',
      label: 'Wheat Rust Spores',
      desc: 'Puccinia graminis red pustules',
      imgUrl: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&q=80&w=300'
    },
    {
      id: 'tomato-blight',
      label: 'Tomato Early Blight',
      desc: 'Alternaria solani concentric rings',
      imgUrl: 'https://images.unsplash.com/photo-1592417817098-8f3d6eb19675?auto=format&fit=crop&q=80&w=300'
    }
  ];

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      handleFileSelected(file);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      handleFileSelected(file);
    }
  };

  const handleFileSelected = (file: File) => {
    if (!file.type.startsWith('image/')) {
      setError('Unsupported file type. Please upload a standard image (PNG, JPG, or JPEG).');
      return;
    }
    setError(null);
    setResult(null);
    setSelectedFile(file);
    const reader = new FileReader();
    reader.onload = () => {
      setPreviewUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const clearSelection = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setResult(null);
    setError(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // Test analysis with Preset leaf samples
  const handlePresetAnalysis = async (presetId: string, imgUrl: string) => {
    setAnalyzing(true);
    setError(null);
    setResult(null);
    setPreviewUrl(imgUrl);
    // Mimic file
    setSelectedFile(new File(['preset'], `${presetId}.jpg`, { type: 'image/jpeg' }));

    try {
      const diagnosis = await analyzeLeafDisease(null, presetId);
      setResult(diagnosis);
    } catch (err: any) {
      setError('Leaf preset processing failed. Try again.');
    } finally {
      setAnalyzing(false);
    }
  };

  // Trigger main leaf analysis
  const runAnalysis = async () => {
    if (!selectedFile && !previewUrl) {
      setError('Please select or drag a leaf image before starting analysis.');
      return;
    }

    setAnalyzing(true);
    setError(null);
    setResult(null);

    try {
      const diagnosis = await analyzeLeafDisease(selectedFile);
      setResult(diagnosis);
    } catch (err: any) {
      setError('Analysis failed. The agricultural diagnostic server returned an error.');
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-[#fcfdfa] pt-28 pb-20 px-4 sm:px-6 lg:px-8">
      
      {/* Decorative vectors */}
      <div className="absolute top-0 right-0 w-[45rem] h-[45rem] bg-gradient-to-b from-red-50/20 via-emerald-50/10 to-transparent rounded-full blur-[110px] pointer-events-none -z-10"></div>

      <div className="max-w-6xl mx-auto space-y-10">
        
        {/* Header Block */}
        <div className="text-center max-w-3xl mx-auto space-y-3.5">
          <div className="inline-flex items-center space-x-1.5 bg-red-50 border border-red-200 px-3 py-1 rounded-full text-red-800 text-xs font-black uppercase tracking-wider">
            <Bug className="w-3.5 h-3.5" />
            <span>{t('aiDisease')}</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-emerald-950 tracking-tight leading-tight">
            {t('diseaseTitle')}
          </h1>
          <p className="text-xs sm:text-sm text-emerald-805 font-semibold leading-relaxed">
            {t('diseaseSubtitle')}
          </p>
        </div>

        {/* Main Workspace layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Left Block: Upload Arena */}
          <div className="lg:col-span-6 bg-white/80 backdrop-blur-md rounded-3xl p-6 border border-emerald-100 shadow-sm space-y-6">
            
            <div className="flex justify-between items-center pb-4 border-b border-emerald-50">
              <div className="flex items-center space-x-3">
                <div className="p-2.5 bg-red-100 text-red-655 rounded-xl">
                  <FileImage className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <h3 className="text-base font-black text-emerald-950">{t('uploadPhoto')}</h3>
                  <p className="text-[10px] text-emerald-700 font-bold">Upload a leaf specimen</p>
                </div>
              </div>
              
              {previewUrl && (
                <button
                  id="disease-clear-btn"
                  onClick={clearSelection}
                  className="p-2 text-rose-600 hover:bg-rose-50 rounded-xl transition-colors border border-rose-100 cursor-pointer"
                  title="Clear current selection"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Drag and Drop Zone or Preview Box */}
            {!previewUrl ? (
              <div
                onDragEnter={handleDrag}
                onDragOver={handleDrag}
                onDragLeave={handleDrag}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-3 border-dashed rounded-2.5xl p-10 text-center cursor-pointer transition-all duration-300 min-h-[250px] flex flex-col justify-center items-center space-y-4 ${
                  dragActive
                    ? 'border-emerald-500 bg-emerald-50/50 scale-98'
                    : 'border-emerald-200/80 bg-emerald-50/10 hover:bg-emerald-50/40 hover:border-emerald-400'
                }`}
              >
                <div className="w-14 h-14 bg-emerald-100/60 rounded-2xl flex items-center justify-center text-emerald-600 shadow-sm">
                  <Upload className="w-7 h-7" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-black text-emerald-950">{t('dragDropPhoto')}</p>
                  <p className="text-xs text-emerald-800/65 font-medium">PNG, JPG, or JPEG accepted up to 8MB</p>
                </div>
                <button
                  type="button"
                  id="browse-files-btn"
                  className="bg-emerald-600 text-white hover:bg-emerald-700 text-xs font-black py-2.5 px-5 rounded-xl shadow transition-colors cursor-pointer"
                >
                  {t('uploadPhoto')}
                </button>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileInputChange}
                  accept="image/*"
                  className="hidden"
                />
              </div>
            ) : (
              <div className="relative rounded-2.5xl overflow-hidden border border-emerald-100 shadow-inner h-[280px]">
                <img
                  src={previewUrl}
                  alt="Leaf preview specimen"
                  className="w-full h-full object-cover select-none"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-emerald-950/20"></div>

                {analyzing ? (
                  <div className="absolute inset-0 bg-white/70 backdrop-blur-sm flex flex-col justify-center items-center px-4">
                    <LoadingSpinner message={t('analyzingText')} />
                  </div>
                ) : (
                  !result && (
                    <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-sm border border-emerald-100 p-3 rounded-2xl shadow flex justify-between items-center">
                      <div className="text-left">
                        <p className="text-[10px] font-bold text-emerald-700 uppercase">Input ready</p>
                        <p className="text-xs font-black text-emerald-950 truncate max-w-[150px]">
                          {selectedFile ? selectedFile.name : 'preset_crop_leaf.jpg'}
                        </p>
                      </div>
                      <button
                        id="diagnose-calc-btn"
                        onClick={runAnalysis}
                        className="bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs py-2 px-4 rounded-xl shadow cursor-pointer transition-colors"
                      >
                        {t('analyzeBtn')}
                      </button>
                    </div>
                  )
                )}
              </div>
            )}

            {/* Leaf Presets strip for rapid evaluation */}
            <div className="space-y-3 pt-2">
              <h4 className="text-xs font-bold text-emerald-800 uppercase pl-1 flex items-center gap-1.5 select-none">
                <Info className="w-3.5 h-3.5" />
                {t('examplesTitle')}
              </h4>
              <div className="grid grid-cols-3 gap-3">
                {leafPresets.map((preset) => (
                  <button
                    key={preset.id}
                    id={`preset-${preset.id}`}
                    onClick={() => handlePresetAnalysis(preset.id, preset.imgUrl)}
                    className="group border border-emerald-100 hover:border-emerald-400 bg-white hover:bg-emerald-50 rounded-2xl p-2.5 text-center focus:outline-none transition-all duration-200 shrink-0 text-left cursor-pointer"
                  >
                    <div className="aspect-[4/3] rounded-xl overflow-hidden mb-2 bg-emerald-50">
                      <img
                        src={preset.imgUrl}
                        alt={preset.label}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <span className="block text-[10px] font-bold text-emerald-950 truncate">{preset.label}</span>
                    <span className="block text-[8px] text-emerald-700/60 font-medium truncate mt-0.5">{preset.desc}</span>
                  </button>
                ))}
              </div>
            </div>

          </div>

          {/* Right Block: Diagnostics Report Result */}
          <div className="lg:col-span-6 space-y-6">
            
            {/* If analyzing but no file selected or blank */}
            {!analyzing && !result && !error && (
              <div className="bg-gradient-to-br from-white to-red-50/10 backdrop-blur-md rounded-3xl p-10 border border-emerald-100 shadow-sm text-center space-y-4 h-[400px] flex flex-col justify-center items-center">
                <div className="p-4 bg-red-50 text-red-500 rounded-2xl">
                  <Bug className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-emerald-950">Awaiting Crop Symptoms</h3>
                  <p className="text-xs text-emerald-800/70 font-semibold max-w-sm mx-auto leading-relaxed">
                    Choose a pre-defined Leaf Preset or import your camera photo to trigger the plant biology analyzer system.
                  </p>
                </div>
              </div>
            )}

            {/* Error display */}
            {error && (
              <div className="py-12">
                <ErrorMessage message={error} onRetry={runAnalysis} />
              </div>
            )}

            {/* Detailed Results Card */}
            {!analyzing && !error && result && (
              <div className="bg-white rounded-[32px] border border-red-100 shadow-md p-6 space-y-6 animate-fade-in">
                
                {/* Result header */}
                <div className="flex justify-between items-start pb-4 border-b border-red-50">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-red-600 bg-red-50 px-2.5 py-1 rounded-full border border-red-100/50">
                      {t('diagnosticResults')}
                    </span>
                    <h3 className="text-2xl font-black text-emerald-950 mt-2.5 tracking-tight leading-none">
                      {result.disease}
                    </h3>
                  </div>

                  {/* Confidence rate indicator */}
                  <div className="text-right flex flex-col items-end">
                    <span className="text-2xl font-black text-red-600 tracking-tight leading-none">
                      {result.confidence}%
                    </span>
                    <span className="text-[9px] font-bold text-emerald-700/60 uppercase mt-1">{t('confidenceRate')}</span>
                  </div>
                </div>

                {/* Grid stats */}
                <div className="grid grid-cols-2 gap-4">
                  
                  {/* Bio Cause */}
                  <div className="bg-red-50/30 rounded-2xl p-4 border border-rose-100/40">
                    <span className="block text-[10px] uppercase font-bold text-emerald-800/60">{t('probableCause')}</span>
                    <span className="block text-xs font-black text-red-950 mt-1 leading-relaxed">
                      {result.cause}
                    </span>
                  </div>

                  {/* Bio Severity */}
                  <div className="bg-red-50/30 rounded-2xl p-4 border border-rose-100/40 flex flex-col justify-between">
                    <div>
                      <span className="block text-[10px] uppercase font-bold text-emerald-800/60">{t('severity')}</span>
                      <div className="flex items-center space-x-1.5 mt-1">
                        <span className={`w-2.5 h-2.5 rounded-full ${
                          result.severity === 'High' ? 'bg-red-500 animate-ping' : 'bg-amber-505'
                        }`}></span>
                        <span className="text-xs font-black text-red-950 capitalize">{result.severity} Risk</span>
                      </div>
                    </div>
                    <span className="text-[9px] font-semibold text-emerald-700 mt-2">Requires inspection</span>
                  </div>
                </div>

                {/* Treatment box: Green */}
                <div className="bg-emerald-50/50 p-4.5 rounded-2xl border border-emerald-100/80 space-y-1.5">
                  <h4 className="text-xs font-bold text-emerald-950 uppercase flex items-center gap-1.5 tracking-wider">
                    <CheckCircle className="w-4 h-4 text-emerald-600" />
                    {t('treatmentActions')}
                  </h4>
                  <p className="text-xs font-semibold text-emerald-800/85 leading-relaxed">
                    {result.treatment}
                  </p>
                </div>

                {/* Prevention tips: Blue/Green */}
                <div className="bg-sky-50/50 p-4.5 rounded-2xl border border-sky-100/80 space-y-1.5">
                  <h4 className="text-xs font-bold text-emerald-950 uppercase flex items-center gap-1.5 tracking-wider">
                    <ShieldCheck className="w-4 h-4 text-sky-600" />
                    {t('preventiveSteps')}
                  </h4>
                  <p className="text-xs font-semibold text-emerald-800/85 leading-relaxed">
                    {result.prevention}
                  </p>
                </div>

                {/* Disclaimer */}
                <div className="text-[10px] text-emerald-700/60 leading-relaxed font-semibold flex items-center gap-2 bg-emerald-50/35 p-3 rounded-xl border border-emerald-100/20">
                  <Info className="w-4 h-4 shrink-0 text-emerald-600" />
                  <span>These computer vision checks do not replace the advice of certified local agronomists and soil inspectors.</span>
                </div>

              </div>
            )}

          </div>

        </div>

      </div>

    </div>
  );
}
