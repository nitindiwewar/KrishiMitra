import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Sprout,
  CloudSun,
  TrendingUp,
  Bug,
  Users,
  Compass,
  CheckCircle,
  Activity,
  ArrowRight,
  BookOpen,
  MessageSquare,
  ShieldCheck,
  Languages,
  ChevronRight,
  Sparkles,
  Info
} from 'lucide-react';
import FeatureCard from '../components/FeatureCard';
import { useTranslation } from '../lib/translations';

// Using the exact generated hero image path:
const farmerHeroImage = "/src/assets/images/indian_farmer_hero_1781255083880.jpg";

export default function Home() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<'hindi' | 'marathi' | 'english'>('english');

  const stats = [
    { label: t('farmersSupported'), value: '10,000+', icon: Users, desc: 'Active platform users nationwide' },
    { label: t('villagesConnected'), value: '500+', icon: Compass, desc: 'Spanning multiple agrarian districts' },
    { label: t('cropsMonitored'), value: '50+', icon: Sprout, desc: 'Cash crops, pulses, cereals & spices' },
    { label: t('recommendationAccuracy'), value: '95%', icon: Activity, desc: 'Powered by highly validated soil models' },
  ];

  const steps = [
    {
      step: 'Step 1',
      title: 'Register Profile',
      desc: 'Create your secure account. Choose your preferred language (Hindi, Marathi, English).',
      color: 'border-emerald-100 bg-emerald-50/50'
    },
    {
      step: 'Step 2',
      title: 'Add Farm Info',
      desc: 'Enter soil type, crop history, ph levels, location, or irrigation configuration.',
      color: 'border-emerald-200 bg-emerald-100/30'
    },
    {
      step: 'Step 3',
      title: 'Get AI Analysis',
      desc: 'Our engine computes suitability rates, disease symptoms, or real-time APMC lists.',
      color: 'border-emerald-300 bg-emerald-100/50'
    },
    {
      step: 'Step 4',
      title: 'Increase Crop Yield',
      desc: 'Follow direct fertilizer cycles, timely weather warnings, and optimal harvesting periods.',
      color: 'border-emerald-400 bg-emerald-600 text-white'
    }
  ];

  const secondaryServices = [
    { title: 'AI Crop Advisor', desc: 'Predict best crops dynamically based on soil parameters.', icon: Sprout },
    { title: 'AI Pest Detection', desc: 'Scan leaf pictures to discover fungal, bacterial or environmental issues.', icon: Bug },
    { title: 'Fertilizer Advisor', desc: 'Custom N-P-K recommendation curves for optimized soil health.', icon: Sparkles },
    { title: 'Scheme Finder', desc: 'Instantly links eligible farmers to State & National welfare schemes.', icon: ShieldCheck },
    { title: 'Hindi Voice Assist', desc: 'Read agricultural data reports in fluent standard Hindi voiceovers.', icon: Languages },
    { title: 'Marathi Voice Assist', desc: 'Complete voice queries on market rates adjusted for Marathi language.', icon: Languages },
    { title: 'Market Intelligence', desc: 'Get pricing forecasts and arbitrage maps across local Mandis.', icon: TrendingUp },
    { title: 'Agronomist Chatbot', desc: 'Ask complex farm biology or sowing cycle questions 24/7.', icon: MessageSquare }
  ];

  return (
    <div className="relative min-h-screen bg-[#fcfdfa] text-emerald-950 overflow-hidden pt-20">
      
      {/* Leaves Blowing Background Details */}
      <div className="absolute top-[15vh] right-[10vw] text-emerald-600/10 rotate-45 pointer-events-none animate-leaf-fall-1">
        <Sprout className="w-16 h-16 fill-current" />
      </div>
      <div className="absolute top-[40vh] left-[5vw] text-emerald-500/15 -rotate-12 pointer-events-none animate-leaf-fall-2">
        <Sprout className="w-12 h-12 fill-current" />
      </div>

      {/* Floating abstract decorative background curves */}
      <div className="absolute top-0 right-0 w-[50rem] h-[50rem] bg-gradient-to-b from-emerald-100/30 to-emerald-500/2 rounded-full blur-[120px] pointer-events-none -z-10"></div>
      <div className="absolute top-[60vh] left-[-20rem] w-[40rem] h-[40rem] bg-gradient-to-tr from-emerald-200/25 to-transparent rounded-full blur-[100px] pointer-events-none -z-10"></div>

      {/* Hero Container */}
      <section id="hero" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Headline copy */}
          <div className="lg:col-span-6 space-y-7 animate-fade-in">
            {/* Tag / Badge */}
            <div className="inline-flex items-center space-x-2 bg-emerald-100/60 backdrop-blur-md border border-emerald-200/50 px-4 py-1.5 rounded-full text-emerald-800 text-xs font-black uppercase tracking-wider shadow-sm">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
              <span>🌱 {t('aiAdvisor')}</span>
            </div>

            {/* Title */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-emerald-950 leading-[1.1] tracking-tight">
              {t('heroTitle')}
            </h1>

            {/* Description */}
            <p className="text-base sm:text-lg text-emerald-800/80 font-medium leading-relaxed max-w-xl">
              {t('heroDesc')}
            </p>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to="/crop-recommendation"
                id="hero-cta-get-started"
                className="inline-flex items-center justify-center bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-4 rounded-2xl text-base font-extrabold tracking-wide shadow-xl shadow-emerald-700/20 hover:shadow-emerald-700/35 hover:-translate-y-0.5 transition-all duration-200 group"
              >
                <span>{t('getStarted')}</span>
                <ArrowRight className="w-5 h-5 ml-2.5 transition-transform group-hover:translate-x-1.5" />
              </Link>
              <a
                href="#how-it-works"
                id="hero-cta-learn-more"
                className="inline-flex items-center justify-center bg-white/80 hover:bg-white text-emerald-950 border border-emerald-200 hover:border-emerald-400 px-8 py-4 rounded-2xl text-base font-bold transition-all"
              >
                <span>{t('exploreFeatures')}</span>
              </a>
            </div>

            {/* Social Trust Indicators */}
            <div className="pt-6 border-t border-emerald-100/80 flex items-center space-x-4">
              <div className="flex -space-x-3">
                {[
                  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=120',
                  'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&q=80&w=120',
                  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=120',
                  'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=120'
                ].map((avatar, idx) => (
                  <img
                    key={idx}
                    className="w-10 h-10 rounded-full border-2 border-white object-cover"
                    src={avatar}
                    alt="Farmer Trust Portrait"
                    referrerPolicy="no-referrer"
                  />
                ))}
              </div>
              <div>
                <span className="block text-sm font-black text-emerald-950">10,000+ Farmers Trust Us</span>
                <span className="block text-xs text-emerald-800/70 font-semibold">Registered across Maharashtra, MP, & Karnataka</span>
              </div>
            </div>
          </div>

          {/* Right Column: Farmer with glowing background of floating cards */}
          <div className="lg:col-span-6 relative mt-10 lg:mt-0 flex justify-center items-center">
            
            {/* Animated glowing back-rings */}
            <div className="absolute w-[80%] h-[80%] rounded-full border-4 border-dashed border-emerald-500/20 blur-sm animate-pulse-ring-slow pointer-events-none"></div>
            <div className="absolute w-[60%] h-[60%] rounded-full border-2 border-emerald-300/10 blur-xs animate-spin-slow pointer-events-none"></div>
            
            {/* Hero Main Farmer Image */}
            <div className="relative z-10 max-w-[420px] w-full aspect-[4/5] rounded-[36px] overflow-hidden border-4 border-white shadow-2xl shadow-emerald-950/15">
              <img
                src={farmerHeroImage}
                alt="Smiling Proud Indian Farmer"
                className="w-full h-full object-cover select-none object-center"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/30 via-transparent to-transparent"></div>
            </div>

            {/* FLOATING CARD 1: Crop Suitability Widget */}
            <div className="absolute top-[8%] -left-[12%] z-20 bg-white/90 backdrop-blur-md border border-emerald-100/90 rounded-2xl p-4 shadow-xl shadow-emerald-950/5 animate-float-y select-none hidden sm:block max-w-[190px]">
              <div className="flex items-center space-x-2.5">
                <div className="p-2 bg-emerald-100 text-emerald-700 rounded-xl">
                  <Sprout className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-emerald-800/60 uppercase">Recommendation</p>
                  <p className="text-sm font-black text-emerald-950">Soybean: <span className="text-emerald-600">92%</span></p>
                </div>
              </div>
            </div>

            {/* FLOATING CARD 2: Live Weather Widget */}
            <div className="absolute top-[48%] -left-[15%] z-20 bg-white/95 backdrop-blur-md border border-emerald-100/90 rounded-2xl p-4 shadow-xl shadow-emerald-950/5 animate-float-y-delayed select-none hidden sm:block max-w-[190px]">
              <div className="flex items-center space-x-2.5">
                <div className="p-2 bg-blue-100 text-blue-700 rounded-xl animate-bounce">
                  <CloudSun className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-emerald-800/60 uppercase">Nagpur Weather</p>
                  <p className="text-sm font-black text-emerald-950">32°C • <span className="text-blue-500 font-bold">Rain Alert</span></p>
                </div>
              </div>
            </div>

            {/* FLOATING CARD 3: APMC Markets Widget */}
            <div className="absolute top-[18%] -right-[10%] z-20 bg-white/95 backdrop-blur-md border border-emerald-100/90 rounded-2xl p-4 shadow-xl shadow-emerald-950/5 animate-float-y-reverse select-none hidden sm:block max-w-[190px]">
              <div className="flex items-center space-x-2.5">
                <div className="p-2 bg-amber-100 text-amber-600 rounded-xl">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-emerald-800/60 uppercase">Wheat APMC</p>
                  <p className="text-sm font-black text-emerald-950">₹2,600/Qtl <span className="text-emerald-600">▲80</span></p>
                </div>
              </div>
            </div>

            {/* FLOATING CARD 4: Pest Leaf Disease */}
            <div className="absolute bottom-[10%] -right-[8%] z-20 bg-white/95 backdrop-blur-md border border-emerald-100/90 rounded-2xl p-4 shadow-xl shadow-emerald-950/5 animate-float-y select-none hidden sm:block max-w-[190px]">
              <div className="flex items-center space-x-2.5">
                <div className="p-2 bg-red-100 text-red-600 rounded-xl">
                  <Bug className="w-5 h-5 animate-pulse" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-emerald-800/60 uppercase">Pest Detector</p>
                  <p className="text-sm font-black text-emerald-950">Leaf Spot: <span className="text-red-500 font-bold">94%</span></p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* CORE 4 FEATURES SECTION */}
      <section id="features" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-t border-emerald-100/50">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-3.5 py-1.5 rounded-full uppercase tracking-wider">
            Key Modules
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-emerald-950 mt-4 tracking-tight">
            Comprehensive Digital Farming Services
          </h2>
          <p className="text-sm sm:text-base text-emerald-800/70 mt-3 font-semibold leading-relaxed">
            Four specialized modules crafted to handle soil, weather, biology and pricing analytics for Indian agricultural grids.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <FeatureCard
            id="feat-crop-rec"
            title="Crop Recommendation"
            description="Enter location details, pH coefficients, and temperature stats to calculate the highest yielding crops."
            icon={Sprout}
            linkTo="/crop-recommendation"
            badge="Personalized Option"
          />
          <FeatureCard
            id="feat-disease-det"
            title="Disease Detection"
            description="Upload leaf photos to isolate fungal or biological rusts instantly with treatment guidelines."
            icon={Bug}
            linkTo="/disease-detection"
            badge="AI Powered"
            iconBgColor="bg-red-50 text-red-600"
          />
          <FeatureCard
            id="feat-weather"
            title="Weather Forecast"
            description="Access local precipitation metrics, wind maps, humidity points and direct agricultural advisories."
            icon={CloudSun}
            linkTo="/weather"
            badge="Live Radar"
            iconBgColor="bg-sky-50 text-sky-600"
          />
          <FeatureCard
            id="feat-prices"
            title="Market Prices"
            description="Monitor live Mandi lists, crop price indexes, arbitrage delta patterns and historical trends."
            icon={TrendingUp}
            linkTo="/market-prices"
            badge="Updated Daily"
            iconBgColor="bg-amber-50 text-amber-600"
          />
        </div>
      </section>

      {/* STATISTICS STRIP PANEL */}
      <section id="statistics" className="bg-emerald-950 text-white py-16 relative overflow-hidden">
        {/* Circle design backdrops */}
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-900 to-emerald-950"></div>
        <div className="absolute top-[10%] right-[-100px] w-96 h-96 bg-emerald-800/20 rounded-full blur-2xl"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-10">
            {stats.map((stat, ix) => {
              const StatIcon = stat.icon;
              return (
                <div key={ix} className="text-center space-y-2 border-r last:border-0 border-emerald-900/40 px-2">
                  <div className="mx-auto w-12 h-12 bg-emerald-800/50 rounded-2xl flex items-center justify-center text-emerald-400">
                    <StatIcon className="w-6 h-6" />
                  </div>
                  <p className="text-4xl sm:text-5xl font-black text-white tracking-widest pt-2">
                    {stat.value}
                  </p>
                  <p className="text-sm font-bold text-emerald-300">
                    {stat.label}
                  </p>
                  <p className="text-xs text-emerald-100/50 font-normal leading-relaxed">
                    {stat.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS SECTION */}
      <section id="how-it-works" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-3.5 py-1.5 rounded-full uppercase tracking-wider">
            Workflow Layout
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-emerald-950 mt-4 tracking-tight">
            How KrishiMitra Works
          </h2>
          <p className="text-sm sm:text-base text-emerald-800/70 mt-3 font-semibold leading-relaxed">
            Get comprehensive diagnostic answers about your crop holdings in just 4 simple phases.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          
          {/* Connector dashed line (desktop) */}
          <div className="hidden lg:block absolute top-[52px] left-8 right-8 h-0.5 border-t-2 border-dashed border-emerald-200 -z-10"></div>

          {steps.map((item, idx) => (
            <div
              key={idx}
              className={`rounded-3xl p-6 border shadow-sm transition-all duration-300 hover:shadow-md ${item.color}`}
            >
              <div className="flex justify-between items-center mb-6">
                <span className={`text-[11px] font-bold tracking-widest px-3 py-1 rounded-full uppercase ${
                  idx === 3 ? 'bg-white text-emerald-950' : 'bg-emerald-100/80 text-emerald-800'
                }`}>
                  {item.step}
                </span>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                  idx === 3 ? 'bg-emerald-750 text-white' : 'bg-emerald-600/10 text-emerald-700'
                }`}>
                  {idx + 1}
                </div>
              </div>

              <h3 className="text-lg font-black tracking-tight mb-2">
                {item.title}
              </h3>
              <p className={`text-xs leading-relaxed font-semibold ${
                idx === 3 ? 'text-emerald-100' : 'text-emerald-800/80'
              }`}>
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* DETAILED SECONDARY SERVICES SECTION (Agri Grids) */}
      <section id="services" className="bg-[#f0f4ef]/60 py-20 border-t border-emerald-100/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-3.5 py-1.5 rounded-full uppercase tracking-wider">
              AI Powered Services
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-emerald-950 mt-4 tracking-tight">
              Platform Features Directory
            </h2>
            <p className="text-sm sm:text-base text-emerald-800/70 mt-3 font-semibold leading-relaxed">
              Designed with complete accessibility considerations to assist localized speech interactions and simple layouts.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {secondaryServices.map((service, index) => {
              const ServiceIcon = service.icon;
              return (
                <div
                  key={index}
                  className="bg-white rounded-3xl p-6 border border-emerald-100 shadow-sm hover:shadow-lg transition-all duration-300 group flex flex-col justify-between"
                >
                  <div>
                    <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-colors duration-300">
                      <ServiceIcon className="w-5 h-5 animate-pulse-slow" />
                    </div>
                    <h3 className="text-lg font-extrabold text-emerald-950 mt-5 mb-2 group-hover:text-emerald-700 transition-colors">
                      {service.title}
                    </h3>
                    <p className="text-xs text-emerald-800/70 font-semibold leading-relaxed">
                      {service.desc}
                    </p>
                  </div>
                  
                  <div className="mt-6 pt-4 border-t border-emerald-50 flex items-center justify-between">
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 py-0.5 px-2 rounded-full">
                      Ready
                    </span>
                    <ChevronRight className="w-4 h-4 text-emerald-400 group-hover:translate-x-1 group-hover:text-emerald-600 transition-all" />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Quick Informational Box about Languages */}
          <div className="mt-12 bg-white rounded-[32px] p-6 border border-emerald-100/80 max-w-4xl mx-auto flex flex-col md:flex-row items-center gap-6 shadow-sm">
            <div className="p-4 bg-emerald-100 text-emerald-700 rounded-2.5xl">
              <Languages className="w-8 h-8" />
            </div>
            <div className="space-y-1 text-center md:text-left flex-1">
              <h4 className="text-base font-black text-emerald-950 flex items-center gap-2 justify-center md:justify-start">
                <span>Multi-Language Audio Capabilities Built-in</span>
                <span className="bg-emerald-500 text-white text-[9px] px-2 py-0.5 rounded-full font-bold">VOCAL ENGINE</span>
              </h4>
              <p className="text-xs text-emerald-800/80 font-medium leading-relaxed">
                To bridge literacy limits, the platform translates real-time advisories into read-aloud voice modules in Marathi & Hindi. Tap the audio icons located inside recommendation cards to listen.
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setActiveTab('english')}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors ${
                  activeTab === 'english' ? 'bg-emerald-600 text-white' : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
                }`}
              >
                English
              </button>
              <button
                onClick={() => setActiveTab('hindi')}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors ${
                  activeTab === 'hindi' ? 'bg-emerald-600 text-white' : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
                }`}
              >
                हिन्दी
              </button>
              <button
                onClick={() => setActiveTab('marathi')}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors ${
                  activeTab === 'marathi' ? 'bg-emerald-600 text-white' : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
                }`}
              >
                मराठी
              </button>
            </div>
          </div>

        </div>
      </section>

      {/* BOTTOM CTA: Transform Your Farming with AI */}
      <section id="cta" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-gradient-to-br from-emerald-800 to-emerald-950 rounded-[40px] text-white p-10 md:p-16 relative overflow-hidden shadow-2xl flex flex-col lg:flex-row items-center justify-between gap-10">
          
          {/* Visual glow curves */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-600/20 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute bottom-[-100px] left-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none"></div>

          <div className="space-y-5 max-w-xl text-center lg:text-left relative z-10">
            <div className="inline-flex items-center space-x-1.5 bg-white/10 backdrop-blur-md px-3.5 py-1 rounded-full text-xs font-bold text-emerald-200">
              <Info className="w-3.5 h-3.5" />
              <span>Free to register for all Indian Smallholders</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black leading-tight tracking-tight">
              Transform Your Farming <br className="hidden sm:inline" />
              with Artificial Intelligence
            </h2>
            <p className="text-sm text-emerald-100/75 leading-relaxed font-semibold">
              Join more than 10,000 farmers who use KrishiMitra daily to optimize their agricultural yields and minimize fertilizer input expenses.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3.5 z-10 w-full sm:w-auto shrink-0">
            <button
              id="bottom-register-btn"
              className="bg-white hover:bg-emerald-50 text-emerald-950 font-black px-8 py-4 rounded-2xl text-center text-sm shadow-lg hover:shadow-xl transition-all"
            >
              Register Now (Free)
            </button>
            <Link
              to="/crop-recommendation"
              id="bottom-explore-btn"
              className="bg-emerald-600/45 hover:bg-emerald-600 text-white border border-emerald-500 font-extrabold px-8 py-4 rounded-2xl text-center text-sm transition-all"
            >
              Explore Platform
            </Link>
          </div>

        </div>
      </section>

    </div>
  );
}
