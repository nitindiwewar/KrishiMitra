import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import {
  LayoutDashboard,
  Sprout,
  CloudSun,
  TrendingUp,
  Bug,
  Sparkles,
  ShieldCheck,
  Languages,
  MessageSquare,
  User,
  Settings,
  Plus,
  ArrowRight,
  TrendingDown,
  Clock,
  Search,
  Bell,
  HelpCircle,
  FileCheck,
  MapPin,
  Volume2,
  VolumeX,
  Droplets,
  Thermometer,
  Wind,
  Phone,
  LogOut,
  Upload,
  UploadCloud,
  CheckCircle2,
  Play,
  RotateCcw,
  BookOpen,
  X,
  ChevronDown
} from 'lucide-react';

// Recharts imports for the premium analytics graph
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend
} from 'recharts';

import { getWeatherData } from '../services/weatherService';
import { getMarketPrices } from '../services/marketService';
import { getCropRecommendations } from '../services/cropService';
import { analyzeLeafDisease } from '../services/diseaseService';
import { api } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import { useTranslation } from '../lib/translations';

export default function Dashboard() {
  const { t, lang: currentLang } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState<string>('overview');
  
  // Admin authorization & UI states
  const [isAdminAuth, setIsAdminAuth] = useState(false);
  const [showPasscodeDialog, setShowPasscodeDialog] = useState(false);
  const [passcodeInput, setPasscodeInput] = useState('');
  const [passcodeError, setPasscodeError] = useState('');
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  

  

  // Verify auth on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('krishimitra_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      // If none, initialize Rajesh default so they can view right away
      localStorage.setItem('krishimitra_user', JSON.stringify(user));
    }

    // Sync admin auth status
    const isAuth = localStorage.getItem('krishimitra_admin_auth') === 'true';
    setIsAdminAuth(isAuth);
  }, []);

  // Sync tab param from URL query parameters
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tabParam = params.get('tab');
    if (tabParam) {
      setActiveTab(tabParam);
    }
  }, [location.search]);

  const handleAdminPortalAccess = () => {
    const isAuth = localStorage.getItem('krishimitra_admin_auth') === 'true';
    if (isAuth) {
      navigate('/admin');
    } else {
      setShowPasscodeDialog(true);
      setPasscodeInput('');
      setPasscodeError('');
    }
  };

  const handleVerifyAdminPasscode = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcodeInput === '12345' || passcodeInput.toLowerCase() === 'admin123') {
      localStorage.setItem('krishimitra_admin_auth', 'true');
      setIsAdminAuth(true);
      setShowPasscodeDialog(false);
      alert('Administrator Authorization Verified! Access granted.');
      navigate('/admin');
    } else {
      setPasscodeError('Invalid credentials. Contact PM-Kisan District Coordinator or try Demo code: 12345');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('krishimitra_user');
    localStorage.removeItem('krishimitra_token');
    window.dispatchEvent(new Event('auth_updated'));
    navigate('/');
  };

  // State elements for nested tabs
  // 1. Overview alerts
  const [notifications, setNotifications] = useState([
    { id: 'n1', type: 'Rain Alert', text: 'Heavy pre-monsoon shower formation detected in Nagpur district. Cover harvested produce.', time: '10 mins ago', rank: 'high' },
    { id: 'n2', type: 'Mandi Trend', text: 'Cotton prices in Latur surged over ₹7,400 per quintal. Good selling window.', time: '2 hours ago', rank: 'mid' },
    { id: 'n3', type: 'Pest Alert', text: 'Cercospora risks are surging in wet soybean canopies. Limit overhead watering.', time: '5 hours ago', rank: 'high' },
    { id: 'n4', type: 'Govt Credit', text: 'PM-Kisan 17th installment of ₹2,000 has been successfully credited.', time: '1 day ago', rank: 'low' },
  ]);

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const data = await api.get<any[]>('/api/alerts');
        if (data && data.length > 0) {
          const mapped = data.map((a: any) => ({
            id: a.id?.toString() || 'n' + Math.random(),
            type: a.type || 'Alert',
            text: a.message,
            time: a.created_at ? new Date(a.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : 'Today',
            rank: a.severity?.toLowerCase() === 'high' ? 'high' : a.severity?.toLowerCase() === 'medium' ? 'mid' : 'low'
          }));
          setNotifications(mapped);
        }
      } catch (err) {
        console.error("Failed to load live system alerts", err);
      }
    };
    fetchAlerts();
  }, []);

  // 2. Weather status
  const [weatherSearch, setWeatherSearch] = useState('Nagpur');
  const [weatherLoading, setWeatherLoading] = useState(false);
  const [weatherData, setWeatherData] = useState<any>({
    temp: 29,
    humidity: 78,
    wind: 14,
    rainChance: 65,
    condition: 'Overcast Rain Cloud',
    aqi: 'Good',
    uv: 4,
    weekly: [
      { day: 'Mon', temp: 30, condition: 'Rainy', rainChance: 80 },
      { day: 'Tue', temp: 29, condition: 'Thunderstorm', rainChance: 90 },
      { day: 'Wed', temp: 31, condition: 'Partly Cloudy', rainChance: 40 },
      { day: 'Thu', temp: 32, condition: 'Sunny Day', rainChance: 10 },
      { day: 'Fri', temp: 33, condition: 'Sunny Day', rainChance: 5 },
      { day: 'Sat', temp: 32, condition: 'Cloudy', rainChance: 30 },
      { day: 'Sun', temp: 30, condition: 'Stormy', rainChance: 70 },
    ]
  });

  const fetchWeather = async (locStr: string) => {
    setWeatherLoading(true);
    try {
      const data = await getWeatherData(locStr);
      setWeatherData({
        temp: data.current.temperature,
        humidity: data.current.humidity,
        wind: data.current.windSpeed,
        rainChance: data.current.rainChance,
        condition: data.current.condition,
        aqi: data.current.airQuality,
        uv: data.current.uvIndex,
        weekly: data.forecast
      });
    } catch {
      // Keep defaults on failure
    } finally {
      setWeatherLoading(false);
    }
  };

  // 3. Crop Rec
  const [recSoil, setRecSoil] = useState(user.soilType || 'Black Soil');
  const [recSeason, setRecSeason] = useState('Kharif');
  const [recPH, setRecPH] = useState('6.8');
  const [recLocation, setRecLocation] = useState(user.district || 'Nagpur, Maharashtra');
  const [recLoading, setRecLoading] = useState(false);
  const [recommendedCrops, setRecommendedCrops] = useState<any[]>([]);

  const fetchRecommendations = async () => {
    setRecLoading(true);
    try {
      const crops = await getCropRecommendations({
        soilType: recSoil as any,
        phValue: parseFloat(recPH) || 6.5,
        temperature: 30,
        rainfall: recSeason === 'Kharif' ? 900 : 350,
        location: recLocation
      });
      setRecommendedCrops(crops);
    } catch (err) {
      console.error("Failed to fetch crop recommendations", err);
    } finally {
      setRecLoading(false);
    }
  };

  // Trigger recommendations when dependencies mutate or on mount
  useEffect(() => {
    fetchRecommendations();
  }, [recSoil, recSeason, recPH, recLocation]);

  const handleRecommendCrops = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetchRecommendations();
  };

  // 4. Market Prices Search
  const [marketSearch, setMarketSearch] = useState('');
  const [marketPrices, setMarketPrices] = useState<any[]>([]);
  const [marketLoading, setMarketLoading] = useState(false);

  useEffect(() => {
    const loadMarket = async () => {
      setMarketLoading(true);
      const prs = await getMarketPrices();
      setMarketPrices(prs);
      setMarketLoading(false);
    };
    loadMarket();
  }, []);

  const filteredMarket = marketPrices.filter(p =>
    p.crop.toLowerCase().includes(marketSearch.toLowerCase()) ||
    p.location.toLowerCase().includes(marketSearch.toLowerCase())
  );

  // Price Trend Chart Data
  const trendChartData = [
    { month: 'Jan', Soybean: 5100, Cotton: 6800, Wheat: 2300 },
    { month: 'Feb', Soybean: 5250, Cotton: 6950, Wheat: 2400 },
    { month: 'Mar', Soybean: 5400, Cotton: 7100, Wheat: 2450 },
    { month: 'Apr', Soybean: 5300, Cotton: 7050, Wheat: 2500 },
    { month: 'May', Soybean: 5500, Cotton: 7150, Wheat: 2550 },
    { month: 'Jun', Soybean: 5600, Cotton: 7200, Wheat: 2600 },
  ];

  // 5. Pest Detection state
  const [pestImage, setPestImage] = useState<string | null>(null);
  const [pestLoading, setPestLoading] = useState(false);
  const [pestResult, setPestResult] = useState<any>(null);

  const simulatePestCheck = async (presetId: string) => {
    setPestLoading(true);
    setPestResult(null);
    let previewUrl = '';
    if (presetId === 'cotton-spot') {
      previewUrl = 'https://images.unsplash.com/photo-1594900889278-e568ba7a5411?auto=format&fit=crop&q=80&w=300';
    } else if (presetId === 'wheat-rust') {
      previewUrl = 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&q=80&w=300';
    } else {
      previewUrl = 'https://images.unsplash.com/photo-1592417817098-8f3d6eb19675?auto=format&fit=crop&q=80&w=300';
    }
    setPestImage(previewUrl);

    try {
      const res = await analyzeLeafDisease(null, presetId);
      setPestResult(res);
    } catch {
      // default
    } finally {
      setPestLoading(false);
    }
  };

  const handleCustomUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        setPestImage(uploadEvent.target?.result as string);
      };
      reader.readAsDataURL(file);

      setPestLoading(true);
      try {
        const res = await analyzeLeafDisease(file);
        setPestResult(res);
      } catch (err) {
        console.error("Leaf analysis API failed, using local fallback", err);
        setPestResult({
          disease: 'Soybean Cercospora Mildew Leaf Spot',
          confidence: 93,
          cause: 'Prompted by high leaf dampness and inadequate plant micro-airflow spacing.',
          treatment: 'Apply Hexaconazole (5% EC) or Copper Oxychloride. Refrain from late evening sprinkler watering.',
          prevention: 'Ensure clean line seed sowing and spray neem-oil extract proactively.',
          severity: 'High'
        });
      } finally {
        setPestLoading(false);
      }
    }
  };

  // 6. Fertilizer Advisor
  const [fertCrop, setFertCrop] = useState('Soybean');
  const [fertSoil, setFertSoil] = useState('Black Soil');
  const [fertOutput, setFertOutput] = useState<any>(null);

  const calculateFertilizer = (e: React.FormEvent) => {
    e.preventDefault();
    const npkMap: Record<string, any> = {
      'Soybean-Black Soil': { npk: '20:60:40 kg/acre', bags: '1 bag Urea, 2.5 bags Single Super Phosphate, 1 bag Muriate of Potash', notes: 'Add sulfur fertilizers if deficient. Apply all fertilizers during final land preparation basal sowing.' },
      'Soybean-Loamy Soil': { npk: '20:60:30 kg/acre', bags: '1 bag Urea, 2.3 bags SSP, 0.8 bag Muriate of Potash', notes: 'Apply together during sowing. Irrigate lightly after 15 days.' },
      'Cotton-Black Soil': { npk: '100:50:50 kg/acre', bags: '4 bags Urea, 2 bags DAP, 1.5 bags MOP', notes: 'Split Urea dosage: 1/3 basal, 1/3 at flowering, 1/3 at boll formation stage.' },
      'Cotton-Red Soil': { npk: '80:40:40 kg/acre', bags: '3 bags Urea, 1.5 bags DAP, 1.2 bags MOP', notes: 'Incorporate well-rotted organic manure (compost) to hold root-zone moisture.' },
      'Wheat-Loamy Soil': { npk: '120:60:40 kg/acre', bags: '4.5 bags Urea, 2.5 bags DAP, 1.2 bags MOP', notes: 'Apply 1/2 Nitrogen and full Phosphorus & Potassium at sowing, and remaining 1/2 nitrogen with first irrigation cycle (~21 days).' },
      'Wheat-Black Soil': { npk: '100:50:40 kg/acre', bags: '4 bags Urea, 2 bags DAP, 1.2 bags MOP', notes: 'Water management during crown root initiation is highly critical.' }
    };
    
    const key = `${fertCrop}-${fertSoil}`;
    const fallback = {
      npk: '40:40:20 kg/acre',
      bags: '2 bags Urea, 1.5 bags DAP, 0.5 bag MOP',
      notes: 'Ensure proper soil testing before fertilizer application. Split Nitrogen application for enhanced crop uptake.'
    };

    setFertOutput(npkMap[key] || fallback);
  };

  // 7. Government Schemes
  const [schemesList, setSchemesList] = useState<any[]>([
    {
      id: 'sch1',
      title: 'PM Kisan Samman Nidhi Yojana',
      benefit: 'Direct financial assistance of ₹6,000 per year paid in three equal installments of ₹2,000 into bank.',
      eligibility: 'All small & marginal agricultural land holder families across the nation.',
      docs: 'Aadhaar Card, Land Registry/Khatauni document, Bank Passbook, Mobile Number.'
    },
    {
      id: 'sch2',
      title: 'PM Fasal Bima Yojana (Crop Insurance)',
      benefit: 'Ultra-low premium rates (1.5% - 2%) for comprehensive safety against flood, fire, cyclones & pests.',
      eligibility: 'All tenant, oral lessee, or owner farmers growing notified food crops & oilseeds.',
      docs: 'Sowing Certificate from block patwari, Bank Passbook, Land Possession record, Identification proof.'
    },
    {
      id: 'sch3',
      title: 'Soil Health Card Scheme',
      benefit: 'Free complete test of N, P, K, Organic Carbon, pH levels, and custom dosage charts printed free.',
      eligibility: 'Every farm land owner in India. Soil samplings retrieved every 2-3 years dynamically.',
      docs: 'Khasra Land map number, unique soil sample registry code.'
    },
    {
      id: 'sch4',
      title: 'Kisan Credit Card (Subsidized Loan)',
      benefit: 'Quick agricultural line of credit up to ₹3 Lakhs at subsidized 4% net annual interest rates.',
      eligibility: 'Owner operators, sharecroppers, tenant farmers, self-help agrarian groups.',
      docs: 'Land ownership details, bank clear status certificate, KYC document cards.'
    }
  ]);

  useEffect(() => {
    const fetchSchemes = async () => {
      try {
        const data = await api.get<any[]>('/api/schemes');
        if (data && data.length > 0) {
          const mapped = data.map((s: any) => ({
            id: s.id?.toString() || 'sch' + Math.random(),
            title: s.title,
            benefit: s.benefit,
            eligibility: s.eligibility || 'All small & marginal regional landholders.',
            docs: s.docs || 'Aadhaar card, Land Khatauni details, mobile link.'
          }));
          setSchemesList(mapped);
        }
      } catch (err) {
        console.error("Failed to load schemes from backend", err);
      }
    };
    fetchSchemes();
  }, []);

  const handleApplyScheme = (title: string) => {
    alert(`Successfully generated secure KrishiMitra fast-pass application for "${title}"! Code: KM-7250-X. Your local Gram Panchayat Agri-officer will notify you shortly via SMS.`);
  };

  // 8. Voice Assistant Simulator
  const [voiceLang, setVoiceLang] = useState('english');
  const [voiceState, setVoiceState] = useState<'idle' | 'listening' | 'speaking'>('idle');
  const [voiceQueryText, setVoiceQueryText] = useState('');
  const [voiceReplyText, setVoiceReplyText] = useState('');

  const voiceSampleQueries: Record<string, any> = {
    english: [
      { q: "Which crop is best for black soil in monsoon?", r: "Based on Nagpur weather and black soil, early Kharif Soybean is recommended for premium yield." },
      { q: "What is the cotton price in Nagpur today?", r: "Cotton prices in Nagpur APMC is trading near ₹7,200 per quintal with a high surge trend today." },
      { q: "How do I prevent Tomato leaf spot disease?", r: "Apply organic copper oxychloride sprays and ensure clear row spacing to enhance leaf canopy drying." }
    ],
    hindi: [
      { q: "काली मिट्टी के लिए कौन सी फसल सबसे अच्छी है?", r: "आपके खेत की काली मिट्टी और मानसून को देखते हुए, सोयाबीन और कपास की बुवाई सर्वोत्तम परिणाम देगी।" },
      { q: "आज नागपुर मंडी में कपास का क्या भाव है?", r: "नागपुर कृषि उपज मंडी में आज कपास का भाव ₹7,200 प्रति क्विंटल के पार चल रहा है, तेजी जारी है।" },
      { q: "टमाटर के पत्तों के पीले धब्बों को कैसे रोकें?", r: "नमी से बचने के लिए क्यारियों में जल निकासी ठीक रखें और कॉपर ऑक्सीक्लोराइड का छिड़काव करें।" }
    ]
  };

  const handleSimulateVoice = async (q: string, r: string) => {
    setVoiceQueryText(q);
    setVoiceState('listening');
    setVoiceReplyText('');
    
    try {
      const res = await api.post<{ reply: string }>('/api/voice', {
        query: q,
        language: voiceLang
      });
      const finalReply = res.reply || r;
      setVoiceState('speaking');
      setVoiceReplyText(finalReply);
      
      // Simulate real vocal audio speech
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel(); // clear previous speech
        const vocabRate = new SpeechSynthesisUtterance(finalReply);
        vocabRate.lang = voiceLang === 'english' ? 'en-IN' : 'hi-IN';
        vocabRate.rate = 0.95;
        window.speechSynthesis.speak(vocabRate);
      }
    } catch (err: any) {
      console.error("Voice assistant API failed, using fallback.", err);
      setVoiceState('speaking');
      setVoiceReplyText(r);
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const vocabRate = new SpeechSynthesisUtterance(r);
        vocabRate.lang = voiceLang === 'english' ? 'en-IN' : 'hi-IN';
        vocabRate.rate = 0.95;
        window.speechSynthesis.speak(vocabRate);
      }
    }
  };

  // 9. AI Chatbot
  const [chatMessages, setChatMessages] = useState([
    { sender: 'ai', text: 'Namaste! I am the KrishiMitra expert Agronomist bot. Ask me anything about crop diseases, fertilizers, seed intervals or APMC prices.' }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [chatTyping, setChatTyping] = useState(false);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  const quickChatTriggers = [
    'Why are my crop leaves turning pale yellow?',
    'Best companion crop to plant with cotton?',
    'Explain PM Fasal Bima Insurance scheme.'
  ];

  const triggerChatReply = async (userQueryText: string) => {
    const nextMsgs = [...chatMessages, { sender: 'user', text: userQueryText }];
    setChatMessages(nextMsgs);
    setChatInput('');
    setChatTyping(true);

    try {
      const res = await api.post<{ reply: string }>('/api/chatbot', {
        message: userQueryText,
        history: chatMessages
      });
      setChatMessages(prev => [...prev, { sender: 'ai', text: res.reply }]);
    } catch (err: any) {
      console.error("AI Chatbot failed, using offline fallback.", err);
      // Fallback
      let reply = "That's an interesting farming question! We suggest cross-checking soil Nitrogen/NPK values. Proper organic manure or Urea works well.";
      if (userQueryText.toLowerCase().includes('cotton')) {
        reply = "Intercropping cotton with pigeon peas restores nitrogen in black soil and acts as a buffer against pests.";
      } else if (userQueryText.toLowerCase().includes('insurance') || userQueryText.toLowerCase().includes('bima')) {
        reply = "PM Fasal Bima Yojana offers crop insurance coverage up to ₹50,000 per hectare with a premium of just 2%. Apply directly on the 'Government Schemes' tab.";
      }
      setChatMessages(prev => [...prev, { sender: 'ai', text: reply }]);
    } finally {
      setChatTyping(false);
    }
  };

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, chatTyping]);

  // Sidebar navigation elements
  const sidebarMenu = [
    { id: 'overview', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'crops', label: 'Crop Recommendations', icon: Sprout },
    { id: 'weather', label: 'Weather Forecast', icon: CloudSun },
    { id: 'market', label: 'Market Intelligence', icon: TrendingUp },
    { id: 'pest', label: 'Pest Detection', icon: Bug },
    { id: 'fertilizer', label: 'Fertilizer Advisor', icon: Sparkles },
    { id: 'voice', label: 'Voice Assistant', icon: Languages },
    { id: 'chatbot', label: 'AI Chatbot', icon: MessageSquare },
    { id: 'profile', label: 'Farmer Profile', icon: User },
    { id: 'settings', label: 'App Settings', icon: Settings },
  ];

  return (
    <div id="krishimitra-dashboard-root" className="min-h-screen bg-[#f8faf6] flex flex-col lg:flex-row relative">
      
      {/* 1. Left Sidebar Navigation Panel */}
      <aside className="w-full lg:w-76 bg-[#044e37] text-white flex flex-col shrink-0 border-r border-[#022c22]">
        
        {/* Brand logo bar */}
        <div className="p-6 border-b border-emerald-800/60 flex items-center space-x-3 bg-[#033f2c]">
          <div className="p-2 bg-emerald-500 rounded-2xl text-white shadow-inner">
            <Sprout className="w-5 h-5 fill-white/10" />
          </div>
          <div>
            <h1 className="text-xl font-black tracking-tight leading-none text-white">KrishiMitra</h1>
            <span className="text-[9px] uppercase tracking-wider text-emerald-300 font-extrabold leading-none">AI Smart Agriculture</span>
          </div>
        </div>

        {/* Current status info strip */}
        <div className="px-5 py-4 bg-[#034430] border-b border-emerald-800/40 flex items-center space-x-3">
          <div className="w-8 h-8 rounded-full bg-emerald-700 font-black text-xs flex items-center justify-center text-white border border-emerald-500 uppercase">
            {user.name ? user.name.slice(0, 2) : 'RP'}
          </div>
          <div className="overflow-hidden">
            <span className="block text-xs font-black truncate text-white">{user.name || 'Rajesh Patil'}</span>
            <span className="block text-[10px] text-emerald-300 truncate">Mobile: {user.mobile || '9876543210'}</span>
          </div>
        </div>

        {/* Main navigation listings */}
        <nav className="flex-grow p-4 space-y-1.5 overflow-y-auto max-h-[calc(100vh-160px)]">
          {sidebarMenu.map(item => {
            const Icon = item.icon;
            const isSel = activeTab === item.id;
            return (
              <button
                key={item.id}
                id={`sidebar-tab-${item.id}`}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-left text-xs font-bold tracking-wide transition-all ${
                  isSel
                    ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-900/40'
                    : 'text-emerald-100 hover:text-white hover:bg-emerald-800/40'
                }`}
              >
                <Icon className={`w-4 h-4 shrink-0 ${isSel ? 'text-white' : 'text-emerald-300'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Panchayat Admin Access - Sidebar Entry */}
        <div className="p-4 pt-1.5 pb-2.5 border-t border-emerald-800/45 bg-[#033f2c]/50">
          <p className="text-[9px] uppercase font-black text-emerald-400 pl-3 mb-1.5 tracking-wider">Panchayat Portal</p>
          <button
            id="sidebar-admin-access-btn"
            onClick={handleAdminPortalAccess}
            className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-xs font-bold tracking-wide transition-all cursor-pointer ${
              isAdminAuth
                ? 'bg-amber-600 hover:bg-amber-700 text-white shadow-md shadow-amber-950/20'
                : 'bg-emerald-900/50 hover:bg-emerald-800/60 text-emerald-250 hover:text-white'
            }`}
          >
            <div className="flex items-center space-x-2">
              <ShieldCheck className="w-4 h-4 text-amber-300 shrink-0" />
              <span>{isAdminAuth ? '🛡️ Admin Console' : '🔒 Admin Access Panel'}</span>
            </div>
            {!isAdminAuth && <span className="text-[9px] font-black uppercase py-0.5 px-2 bg-emerald-950/40 rounded text-emerald-400">Lock</span>}
          </button>
        </div>

        {/* Sidebar Footer Logout */}
        <div className="p-4 border-t border-emerald-800/65 bg-[#033f2c]">
          <button
            id="sidebar-logout-btn"
            onClick={handleLogout}
            className="w-full flex items-center justify-center space-x-2 bg-emerald-800 hover:bg-red-900 border border-emerald-700/60 hover:border-red-900 text-white font-extrabold text-xs tracking-wider uppercase py-3 rounded-xl transition duration-200"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out Profile</span>
          </button>
        </div>

      </aside>

      {/* 2. Main Workspace Layout Panel */}
      <main className="flex-grow flex flex-col min-w-0">
        
        {/* Top Header Workspace Bar */}
        <header className="bg-white border-b border-emerald-100/60 h-16 px-6 flex items-center justify-between z-10 shrink-0 shadow-sm shadow-emerald-500/2">
          
          <div className="flex items-center space-x-2">
            <span className="text-sm font-black text-emerald-950 uppercase tracking-widest bg-emerald-50 border border-emerald-100 px-3 py-1 rounded-full">
              {sidebarMenu.find(m => m.id === activeTab)?.label} Control Deck
            </span>
          </div>

          <div className="flex items-center space-x-4">
            
            {/* Display local weather summary badge */}
            <div className="hidden md:flex items-center space-x-2 text-xs font-extrabold text-emerald-950 bg-emerald-50/50 p-1.5 pr-3 rounded-full border border-emerald-100">
              <span className="p-1 px-2 bg-white rounded-full text-emerald-700 text-[10px] font-black border border-emerald-100">
                {weatherData.temp}°C
              </span>
              <span>{weatherData.condition}</span>
            </div>

            {/* Profile village state */}
            <div className="text-right hidden sm:block">
              <span className="block text-[10px] text-emerald-800/80 font-black leading-none uppercase">Location</span>
              <span className="block text-xs font-black text-emerald-950 leading-tight flex items-center justify-end">
                <MapPin className="w-3.5 h-3.5 mr-0.5 text-emerald-600 shrink-0" />
                {user.village}, {user.district.split(',')[0]}
              </span>
            </div>

            {/* Interactive User Profile Menu Dropdown */}
            <div className="relative">
              <button
                id="header-user-profile-menu-trigger"
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="flex items-center space-x-2 px-2.5 py-1.5 rounded-xl border border-emerald-100 hover:border-emerald-350 bg-emerald-50/20 hover:bg-emerald-50/40 transition cursor-pointer"
              >
                <div className="w-7 h-7 rounded-full bg-emerald-605 font-black text-xs flex items-center justify-center text-white uppercase shadow-inner">
                  {user.name ? user.name.slice(0, 2) : 'RP'}
                </div>
                <span className="text-xs font-extrabold text-emerald-950 hidden md:inline">
                  {user.name ? user.name.split(' ')[0] : 'Rajesh'}
                </span>
                <ChevronDown className={`w-3 h-3 text-emerald-600 transition-transform duration-200 ${profileDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {profileDropdownOpen && (
                <>
                  {/* Backdrop click-away shield */}
                  <div className="fixed inset-0 z-40" onClick={() => setProfileDropdownOpen(false)} />
                  <div className="absolute right-0 mt-2 w-48 bg-white border border-emerald-150 rounded-2xl shadow-xl z-50 p-1 py-1.5 animate-fade-in divide-y divide-emerald-50 text-left">
                    <div className="px-3 py-2">
                      <span className="block text-[10px] uppercase font-black text-emerald-600 leading-none">Farmer Identity</span>
                      <span className="block text-xs font-black text-emerald-950 truncate mt-1">{user.name}</span>
                      <span className="block text-[9px] text-emerald-600 font-bold truncate mt-0.5">{user.mobile}</span>
                    </div>
                    <div className="py-1">
                      <button
                        onClick={() => { setActiveTab('profile'); setProfileDropdownOpen(false); }}
                        className="w-full flex items-center space-x-2.5 px-3 py-2 text-xs font-bold text-emerald-900 hover:bg-emerald-50/50 rounded-xl text-left transition cursor-pointer"
                      >
                        <User className="w-3.5 h-3.5 text-emerald-600" />
                        <span>My Farmer Portfolio</span>
                      </button>
                      <button
                        onClick={() => { setActiveTab('settings'); setProfileDropdownOpen(false); }}
                        className="w-full flex items-center space-x-2.5 px-3 py-2 text-xs font-bold text-emerald-900 hover:bg-emerald-50/50 rounded-xl text-left transition cursor-pointer"
                      >
                        <Settings className="w-3.5 h-3.5 text-emerald-600" />
                        <span>App Settings</span>
                      </button>
                    </div>
                    <div className="py-1">
                      <button
                        id="profile-dropdown-admin-btn"
                        onClick={() => { setProfileDropdownOpen(false); handleAdminPortalAccess(); }}
                        className="w-full flex items-center justify-between px-3 py-2 text-xs font-black text-amber-700 hover:bg-amber-50/50 rounded-xl text-left transition cursor-pointer"
                      >
                        <div className="flex items-center space-x-2.5">
                          <ShieldCheck className="w-3.5 h-3.5 text-amber-500" />
                          <span>Admin Portal</span>
                        </div>
                        {isAdminAuth ? (
                          <span className="text-[8px] bg-amber-100 text-amber-801 font-extrabold px-1 rounded uppercase">Open</span>
                        ) : (
                          <span className="text-[8px] bg-slate-100 text-slate-500 font-bold px-1 rounded uppercase">Lock</span>
                        )}
                      </button>
                    </div>
                    <div className="py-1">
                      <button
                        onClick={() => { setProfileDropdownOpen(false); handleLogout(); }}
                        className="w-full flex items-center space-x-2.5 px-3 py-2 text-xs font-bold text-red-650 hover:bg-red-50/50 rounded-xl text-left transition cursor-pointer"
                      >
                        <LogOut className="w-3.5 h-3.5 text-red-600" />
                        <span>Log Out</span>
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>

          </div>

        </header>

        {/* Dynamic Canvas Workspace content */}
        <div className="flex-grow p-6 lg:p-8 overflow-y-auto max-h-[calc(100vh-64px)] space-y-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
            >
              
              {/* ====================================
                  TAB 1: DASHBOARD OVERVIEW PANEL
                 ==================================== */}
              {activeTab === 'overview' && (
                <div id="deck-tab-overview" className="space-y-8">
                  
                  {/* Grid of critical telemetry stats */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    
                    {/* Stat Card 1: Farmer Bio */}
                    <div className="bg-white border border-emerald-100 rounded-2xl p-5 shadow-sm space-y-3.5">
                      <span className="text-[10px] font-black text-emerald-800/60 uppercase tracking-wider block">Farmer Profile info</span>
                      <div className="flex items-center space-x-3.5">
                        <div className="p-3 bg-emerald-50 text-emerald-700 rounded-xl">
                          <User className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="text-base font-black text-emerald-950">{user.name}</h4>
                          <span className="text-xs text-emerald-800/90 font-medium">Village: {user.village}</span>
                        </div>
                      </div>
                      <div className="pt-2 border-t border-emerald-50 text-xs font-bold text-emerald-900 flex justify-between items-center">
                        <span>Soil: <span className="text-emerald-700 font-extrabold">{user.soilType}</span></span>
                        <span>Area: <span className="text-emerald-700 font-extrabold">{user.acres} Acres</span></span>
                      </div>
                    </div>

                    {/* Stat Card 2: Live Weather */}
                    <div className="bg-white border border-emerald-100 rounded-2xl p-5 shadow-sm space-y-3.5 cursor-pointer hover:border-emerald-300 transition" onClick={() => setActiveTab('weather')}>
                      <span className="text-[10px] font-black text-emerald-800/60 uppercase tracking-wider block">Local Rain Forecast</span>
                      <div className="flex items-center space-x-3.5">
                        <div className="p-3 bg-sky-50 text-sky-700 rounded-xl">
                          <CloudSun className="w-5 h-5 animate-pulse" />
                        </div>
                        <div>
                          <h4 className="text-2xl font-black text-emerald-950 font-mono">{weatherData.temp}°C</h4>
                          <span className="text-xs text-emerald-800/90 font-semibold">{weatherData.condition}</span>
                        </div>
                      </div>
                      <div className="pt-2 border-t border-emerald-50 text-xs font-bold text-emerald-900 flex justify-between items-center">
                        <span>Rain probability: <span className="text-emerald-700 font-extrabold">{weatherData.rainChance}%</span></span>
                        <span>AQI: <span className="text-emerald-700 font-extrabold">{weatherData.aqi}</span></span>
                      </div>
                    </div>

                    {/* Stat Card 3: Cropping parameters */}
                    <div className="bg-white border border-emerald-100 rounded-2xl p-5 shadow-sm space-y-3.5 cursor-pointer hover:border-emerald-300 transition" onClick={() => setActiveTab('crops')}>
                      <span className="text-[10px] font-black text-emerald-800/60 uppercase tracking-wider block">Recommended Crops</span>
                      <div className="flex items-center space-x-3.5">
                        <div className="p-3 bg-lime-50 text-lime-700 rounded-xl">
                          <Sprout className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="text-base font-black text-emerald-950">Soybean / Cotton</h4>
                          <span className="text-xs text-emerald-800/90 font-medium">{user.soilType} standard</span>
                        </div>
                      </div>
                      <div className="pt-2 border-t border-emerald-50 text-xs font-bold text-emerald-900 flex justify-between items-center">
                        <span>Expected Yields: <span className="text-emerald-755 font-extrabold">20+ q/acre</span></span>
                      </div>
                    </div>

                    {/* Stat Card 4: Top Mandi Values */}
                    <div className="bg-white border border-emerald-100 rounded-2xl p-5 shadow-sm space-y-3.5 cursor-pointer hover:border-emerald-300 transition" onClick={() => setActiveTab('market')}>
                      <span className="text-[10px] font-black text-emerald-800/60 uppercase tracking-wider block">Nagpur Mandi price index</span>
                      <div className="flex items-center space-x-3.5">
                        <div className="p-3 bg-amber-50 text-amber-700 rounded-xl">
                          <TrendingUp className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="text-2xl font-black text-emerald-950 font-mono">₹7,200</h4>
                          <span className="text-[10px] text-emerald-850 font-semibold block uppercase">Cotton (Long Staple)</span>
                        </div>
                      </div>
                      <div className="pt-2 border-t border-emerald-50 text-xs font-semibold text-emerald-900 flex justify-between items-center">
                        <span>Soybean: <span className="text-emerald-700 font-extrabold">₹5,600/q</span></span>
                      </div>
                    </div>

                  </div>

                  {/* Main section: Action Hub + Live Notifications */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
                    
                    {/* Left Column: Quick Actions dashboard panel */}
                    <div className="lg:col-span-8 bg-white border border-emerald-100 rounded-3xl p-6 shadow-sm space-y-6 flex flex-col justify-between">
                      <div>
                        <h3 className="text-lg font-black text-emerald-950 tracking-tight flex items-center space-x-2">
                          <Sparkles className="w-5 h-5 text-emerald-600 animate-pulse" />
                          <span>KrishiMitra Smart Actions Command Console</span>
                        </h3>
                        <p className="text-xs text-emerald-800/80 font-bold uppercase tracking-wider mt-1.5">
                          Instant telemetry diagnostics triggers
                        </p>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
                          
                          {/* action 1 */}
                          <button
                            id="fast-pest-detection"
                            onClick={() => setActiveTab('pest')}
                            className="p-4 rounded-xl border border-emerald-100 hover:border-emerald-500 bg-emerald-50/20 hover:bg-emerald-50 text-left transition group"
                          >
                            <Bug className="w-6 h-6 text-emerald-600 transition group-hover:scale-110" />
                            <span className="block text-sm font-black text-emerald-950 mt-2">Diagnose Crop Leaf Picture</span>
                            <span className="block text-xs text-emerald-800/70 font-semibold mt-1">Upload infected crop leaves to analyze fungal spotting.</span>
                          </button>

                          {/* action 2 */}
                          <button
                            id="fast-fertilizer-calc"
                            onClick={() => setActiveTab('fertilizer')}
                            className="p-4 rounded-xl border border-emerald-100 hover:border-emerald-500 bg-emerald-50/20 hover:bg-emerald-50 text-left transition group"
                          >
                            <Sparkles className="w-6 h-6 text-emerald-600 transition group-hover:scale-110" />
                            <span className="block text-sm font-black text-emerald-950 mt-2">Calculate Fertilizer Requirements</span>
                            <span className="block text-xs text-emerald-800/70 font-semibold mt-1">Optimally map Nitrogen, phosphorus & Potassium bags per acre.</span>
                          </button>

                          {/* action 3 */}
                          <button
                            id="fast-crop-recommend"
                            onClick={() => setActiveTab('crops')}
                            className="p-4 rounded-xl border border-[#10b981]/20 hover:border-emerald-500 bg-emerald-50/20 hover:bg-emerald-50 text-left transition group"
                          >
                            <Sprout className="w-6 h-6 text-emerald-600 transition group-hover:scale-110" />
                            <span className="block text-sm font-black text-emerald-950 mt-2">Analyze Crop Recommendations</span>
                            <span className="block text-xs text-emerald-800/70 font-semibold mt-1">Get custom crop suitability mapping models for winter and monsoon.</span>
                          </button>

                          {/* action 4 */}
                          <button
                            id="fast-ai-chat"
                            onClick={() => setActiveTab('chatbot')}
                            className="p-4 rounded-xl border border-emerald-100 hover:border-emerald-500 bg-emerald-50/20 hover:bg-emerald-50 text-left transition group"
                          >
                            <MessageSquare className="w-6 h-6 text-emerald-600 transition group-hover:scale-110" />
                            <span className="block text-sm font-black text-emerald-950 mt-2">Ask Personal AI Agronomist</span>
                            <span className="block text-xs text-emerald-800/70 font-semibold mt-1">Get immediate agricultural biology & irrigation schedule responses.</span>
                          </button>

                        </div>
                      </div>

                      {/* Admin Access Panel Operator Widget */}
                      <div className="bg-emerald-950/5 border border-emerald-100 rounded-2xl p-4.5 flex flex-col sm:flex-row items-center justify-between gap-4 mt-2">
                        <div className="text-left">
                          <span className="text-[10px] uppercase font-black text-emerald-800 tracking-wider block">Administrative Section</span>
                          <h4 className="text-sm font-black text-emerald-950 mt-1 flex items-center">
                            <span>🔒 KrishiMitra Operator Portal & Config Console</span>
                          </h4>
                          <p className="text-[11px] text-emerald-800/80 leading-relaxed max-w-lg font-bold mt-0.5">
                            Reserved exclusively for coordinators, panchayat heads, and advisors. Click to authenticate and update schemas, crop entries, and prices.
                          </p>
                        </div>
                        <button
                          onClick={handleAdminPortalAccess}
                          className="bg-emerald-950 hover:bg-emerald-900 border border-emerald-800 hover:border-emerald-700 text-white text-xs font-black px-4.5 py-2.5 rounded-xl whitespace-nowrap shadow-sm cursor-pointer hover:-translate-y-0.5 transition duration-150"
                        >
                          Access Operator Panel →
                        </button>
                      </div>

                      {/* quick helper helpline trust ribbon */}
                      <div className="pt-6 border-t border-emerald-50 flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div className="text-xs text-emerald-700 font-bold leading-relaxed">
                          🌱 24/7 National Farmer Crop Protection Helpdesk Hotline: <br />
                          <span className="text-emerald-600 font-black">1800-112-5100</span> (Toll-Free, Multi-lingual)
                        </div>
                        <div className="text-[10px] text-emerald-500 font-black uppercase bg-emerald-100/40 px-3 py-1 rounded-full border border-emerald-100">
                          Secure Cloud Network Node
                        </div>
                      </div>

                    </div>

                    {/* Right Column: Real time advisory notifications */}
                    <div className="lg:col-span-4 bg-white border border-emerald-100 rounded-3xl p-6 shadow-sm flex flex-col justify-between">
                      <div>
                        {/* Header info */}
                        <div className="flex items-center justify-between pb-4 border-b border-emerald-50">
                          <div className="flex items-center space-x-2">
                            <Bell className="w-5 h-5 text-emerald-600 shrink-0" />
                            <h3 className="text-base font-black text-emerald-950">Farming Advisory</h3>
                          </div>
                          <span className="bg-emerald-50 text-emerald-700 text-[10px] font-black px-2 py-0.5 rounded-full border border-emerald-100">
                            Live Updates
                          </span>
                        </div>

                        {/* Notifications map lists */}
                        <div className="mt-4 space-y-3">
                          {notifications.map((notif) => (
                            <div
                              key={notif.id}
                              className={`p-3 rounded-xl border flex items-start space-x-3 transition ${
                                notif.rank === 'high'
                                  ? 'bg-red-50/20 border-red-100'
                                  : notif.rank === 'mid'
                                  ? 'bg-amber-50/20 border-amber-100'
                                  : 'bg-emerald-50/20 border-emerald-100'
                              }`}
                            >
                              <span className={`w-2 h-2 rounded-full shrink-0 mt-1.5 ${
                                notif.rank === 'high' ? 'bg-red-500 animate-ping' : notif.rank === 'mid' ? 'bg-amber-500' : 'bg-emerald-500'
                              }`} />
                              <div className="min-w-0 flex-grow">
                                <div className="flex items-center justify-between">
                                  <span className="text-xs font-black text-emerald-950">{notif.type}</span>
                                  <span className="text-[9px] text-emerald-600 font-bold">{notif.time}</span>
                                </div>
                                <p className="text-[11px] text-emerald-800/90 leading-normal font-semibold mt-0.5">
                                  {notif.text}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* quick action button cards */}
                      <button
                        onClick={() => {
                          // seed random notification
                          setNotifications(prev => [
                            { id: Math.random().toString(), type: 'APMC Notice', text: 'Onion arrivals in Lasalgaon APMC increased. Expect temporary correction.', time: 'Just now', rank: 'mid' },
                            ...prev
                          ]);
                        }}
                        className="w-full mt-4 py-2 text-center text-xs text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-xl transition font-black uppercase tracking-wider"
                      >
                        Refresh Advisory Data
                      </button>

                    </div>

                  </div>

                </div>
              )}

              {/* ====================================
                  TAB 2: CROP RECOMMENDATIONS MODULE
                 ==================================== */}
              {activeTab === 'crops' && (
                <div id="deck-tab-crops" className="bg-white border border-emerald-100 rounded-3xl p-6 lg:p-8 shadow-sm space-y-8">
                  
                  <div className="pb-4 border-b border-emerald-100 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                      <h3 className="text-lg font-black text-emerald-950">AI Crop Recommendation</h3>
                      <p className="text-xs text-emerald-805/90 font-bold uppercase tracking-wider mt-0.5">
                        Determine optimal agrarian fits mapped according to soil chemistry indexes
                      </p>
                    </div>
                    <div className="bg-emerald-50 border border-emerald-100 rounded-full px-4 py-1.5 text-[10px] font-black text-emerald-800 uppercase tracking-wide">
                      Predicting Model: Crop-Fit ML v4.1
                    </div>
                  </div>

                  {/* Form fields block */}
                  <form onSubmit={handleRecommendCrops} className="grid grid-cols-1 md:grid-cols-4 gap-6 items-end bg-emerald-50/30 p-5 rounded-2xl border border-emerald-100/60">
                    
                    {/* Soil Type Select */}
                    <div className="flex flex-col space-y-1.5 w-full">
                      <label className="text-xs font-black text-emerald-950">Farm Soil Type</label>
                      <select
                        value={recSoil}
                        onChange={(e) => setRecSoil(e.target.value)}
                        className="w-full bg-white border border-emerald-200 rounded-xl px-3 py-2.5 text-xs font-bold text-emerald-950 focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
                      >
                        <option value="Black Soil">Black Soil (Deep Clay)</option>
                        <option value="Red Soil">Red Soil (Loamy Acidic)</option>
                        <option value="Sandy Soil">Sandy Soil (High Drainage)</option>
                        <option value="Loamy Soil">Loamy Soil (Fertile Silt)</option>
                      </select>
                    </div>

                    {/* Sowing Season Select */}
                    <div className="flex flex-col space-y-1.5 w-full">
                      <label className="text-xs font-black text-emerald-950">Sowing Season</label>
                      <select
                        value={recSeason}
                        onChange={(e) => setRecSeason(e.target.value)}
                        className="w-full bg-white border border-emerald-200 rounded-xl px-3 py-2.5 text-xs font-bold text-emerald-950 focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
                      >
                        <option value="Kharif">Kharif (Monsoon/June)</option>
                        <option value="Rabi">Rabi (Winter/November)</option>
                        <option value="Zaid">Zaid (Summer/March)</option>
                      </select>
                    </div>

                    {/* pH values */}
                    <div className="flex flex-col space-y-1.5 w-full">
                      <label className="text-xs font-black text-emerald-950">Soil Ph levels (1.0 - 14.0)</label>
                      <input
                        type="number"
                        step="0.1"
                        min="2.0"
                        max="12.0"
                        value={recPH}
                        onChange={(e) => setRecPH(e.target.value)}
                        placeholder="e.g. 6.8"
                        className="w-full bg-white border border-emerald-200 rounded-xl px-3 py-2.5 text-xs font-bold text-emerald-950 focus:outline-none"
                      />
                    </div>

                    {/* Submit recommended button */}
                    <button
                      type="submit"
                      id="rec-crops-submit-btn"
                      className="bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs uppercase py-3 rounded-xl shadow-lg shadow-emerald-700/10 transition w-full"
                    >
                      Analyze Suitability Fit
                    </button>

                  </form>

                  {/* Loading spinner */}
                  {recLoading && (
                    <div className="py-12 flex flex-col items-center justify-center space-y-4">
                      <LoadingSpinner message="Evaluating soil chemistry values relative to 10-year district precipitation records..." />
                    </div>
                  )}

                  {/* Recommendations response cards */}
                  {!recLoading && recommendedCrops.length > 0 ? (
                    <div className="space-y-6">
                      <h4 className="text-sm font-black text-emerald-950 uppercase tracking-widest pl-1">
                        🎯 Top Agrarian Recommendations Mapped:
                      </h4>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 anim-fade-in">
                        {recommendedCrops.map((crop, index) => {
                          return (
                            <div
                              key={crop.name}
                              className="border border-emerald-100 hover:border-emerald-300 rounded-3xl bg-emerald-50/10 hover:bg-white overflow-hidden shadow-sm hover:shadow-lg transition flex flex-col h-full"
                            >
                              <div className="h-44 relative overflow-hidden">
                                <img
                                  className="w-full h-full object-cover transition duration-500 hover:scale-105"
                                  src={crop.image}
                                  alt={crop.name}
                                  referrerPolicy="no-referrer"
                                />
                                <div className="absolute top-4 right-4 bg-emerald-600 text-white font-black text-xs px-3 py-1 rounded-full shadow-md">
                                  {crop.suitabilityScore}% Match
                                </div>
                              </div>

                              <div className="p-6 space-y-4 flex-grow flex flex-col justify-between">
                                <div className="space-y-2">
                                  <h5 className="text-xl font-black text-emerald-950">{crop.name}</h5>
                                  <p className="text-xs text-emerald-900/80 leading-relaxed font-semibold">
                                    {crop.description}
                                  </p>
                                </div>

                                <div className="pt-4 border-t border-emerald-50 grid grid-cols-2 gap-3 text-xs font-bold text-emerald-900 leading-normal">
                                  <div>
                                    <span className="block text-[9px] uppercase text-emerald-800/60 font-black">Yield Capacity</span>
                                    <span className="text-emerald-950 font-black">{crop.expectedYield}</span>
                                  </div>
                                  <div>
                                    <span className="block text-[9px] uppercase text-emerald-800/60 font-black">Sowing Window</span>
                                    <span className="text-emerald-950 font-black">{crop.bestSowingSeason}</span>
                                  </div>
                                  <div>
                                    <span className="block text-[9px] uppercase text-emerald-805/60 font-black">Water Demand</span>
                                    <span className="text-emerald-950 font-black">{crop.waterRequirement}</span>
                                  </div>
                                  <div>
                                    <span className="block text-[9px] uppercase text-emerald-805/60 font-black">Subsidized Profit</span>
                                    <span className="text-emerald-950 font-black text-emerald-700">{crop.profitability} Yield Margin</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ) : !recLoading && (
                    <div className="border border-emerald-50 rounded-2xl p-10 text-center space-y-3 bg-emerald-50/10">
                      <Sprout className="w-10 h-10 text-emerald-600/40 mx-auto" strokeWidth="1.5" />
                      <h4 className="text-sm font-black text-emerald-950 uppercase">Ready for Soil Entry</h4>
                      <p className="text-xs text-emerald-800/70 font-semibold max-w-sm mx-auto">
                        Configure farm values inside parameter input bars above to dynamically compute matching crop yields.
                      </p>
                    </div>
                  )}

                </div>
              )}

              {/* ====================================
                  TAB 3: WEATHER FORECAST MODULE
                 ==================================== */}
              {activeTab === 'weather' && (
                <div id="deck-tab-weather" className="bg-white border border-emerald-100 rounded-3xl p-6 lg:p-8 shadow-sm space-y-8">
                  
                  <div className="pb-4 border-b border-emerald-100 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                      <h3 className="text-lg font-black text-emerald-950">Meteorological Forecasting</h3>
                      <p className="text-xs text-emerald-800/90 font-bold uppercase tracking-wider mt-0.5">
                        Assess rain probability and wind speed thresholds
                      </p>
                    </div>
                    
                    {/* Search weather */}
                    <form onSubmit={(e) => { e.preventDefault(); fetchWeather(weatherSearch); }} className="flex-shrink-0 w-full md:w-80">
                      <div className="relative">
                        <input
                          type="text"
                          value={weatherSearch}
                          onChange={(e) => setWeatherSearch(e.target.value)}
                          placeholder="Search e.g. Nagpur, Nashik..."
                          className="w-full bg-slate-50 border border-emerald-200 rounded-xl py-2 pl-9 pr-20 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
                        />
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-700" />
                        <button
                          type="submit"
                          className="absolute right-1 top-1/2 -translate-y-1/2 bg-emerald-600 text-white text-[10px] font-black uppercase py-1.5 px-3 rounded-lg shadow-sm"
                        >
                          Search
                        </button>
                      </div>
                    </form>
                  </div>

                  {weatherLoading ? (
                    <div className="py-20 flex flex-col items-center justify-center">
                      <LoadingSpinner message="Consulting live meteo nodes and cloud precipitation charts..." />
                    </div>
                  ) : (
                    <div className="space-y-6">
                      
                      {/* Current telemetry layout */}
                      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 bg-gradient-to-r from-emerald-50/40 to-sky-50/20 border border-emerald-100/60 rounded-3xl p-6">
                        
                        {/* Major element */}
                        <div className="md:col-span-4 space-y-4 flex flex-col justify-between">
                          <div className="space-y-1">
                            <h4 className="text-sm font-black text-emerald-900/60 uppercase">Current District Node</h4>
                            <h5 className="text-3xl font-black text-emerald-950 flex items-center">
                              <MapPin className="w-6 h-6 mr-1.5 text-emerald-600" />
                              <span>{weatherSearch}</span>
                            </h5>
                          </div>

                          <div className="space-y-1">
                            <span className="text-5xl font-black font-mono text-emerald-950">{weatherData.temp}°C</span>
                            <span className="block text-sm font-black text-emerald-800">{weatherData.condition}</span>
                          </div>

                          <div className="text-[10px] text-emerald-500 font-extrabold uppercase bg-emerald-50 w-max pr-3 py-1 rounded border border-emerald-100/50 pl-2">
                            ● Satellite feed synced just now
                          </div>
                        </div>

                        {/* Detail grids block */}
                        <div className="md:col-span-8 grid grid-cols-2 md:grid-cols-4 gap-4">
                          
                          <div className="bg-white p-4 rounded-2xl border border-emerald-100/60 shadow-sm flex flex-col justify-between text-center">
                            <Droplets className="w-5 h-5 text-indigo-500 mx-auto" />
                            <span className="text-xs font-bold text-emerald-800/60 uppercase block mt-1.5">Humidity Ratio</span>
                            <span className="text-lg font-black font-mono text-emerald-950 block mt-1">{weatherData.humidity}%</span>
                          </div>

                          <div className="bg-white p-4 rounded-2xl border border-emerald-100/60 shadow-sm flex flex-col justify-between text-center">
                            <CloudSun className="w-5 h-5 text-blue-500 mx-auto" />
                            <span className="text-xs font-bold text-emerald-800/60 uppercase block mt-1.5">Precipitation</span>
                            <span className="text-lg font-black font-mono text-emerald-950 block mt-1">{weatherData.rainChance}% rain</span>
                          </div>

                          <div className="bg-white p-4 rounded-2xl border border-emerald-100/60 shadow-sm flex flex-col justify-between text-center">
                            <Wind className="w-5 h-5 text-teal-500 mx-auto" />
                            <span className="text-xs font-bold text-emerald-800/60 uppercase block mt-1.5">Wind Speed</span>
                            <span className="text-lg font-black font-mono text-emerald-950 block mt-1">{weatherData.wind} km/h</span>
                          </div>

                          <div className="bg-white p-4 rounded-2xl border border-emerald-100/60 shadow-sm flex flex-col justify-between text-center">
                            <Thermometer className="w-5 h-5 text-rose-500 mx-auto" />
                            <span className="text-xs font-bold text-emerald-800/60 uppercase block mt-1.5">Air Quality</span>
                            <span className="text-lg font-black text-emerald-950 block mt-1 uppercase text-[11px] font-extrabold">{weatherData.aqi}</span>
                          </div>

                        </div>

                      </div>

                      {/* Forecast weekly listing */}
                      <div className="space-y-4">
                        <h4 className="text-xs font-black text-emerald-950 uppercase tracking-widest pl-1">
                          7-Day Forecast Grid
                        </h4>

                        <div className="grid grid-cols-4 sm:grid-cols-7 gap-3">
                          {weatherData.weekly.map((fc: any, index: number) => {
                            const isHighRain = fc.rainChance > 50;
                            return (
                              <div
                                key={index}
                                className="p-4 rounded-2xl border border-emerald-100/40 bg-slate-50/30 hover:bg-white hover:border-emerald-400 transition text-center space-y-1.5"
                              >
                                <span className="block text-[10px] font-black text-emerald-805/60 uppercase">
                                  {fc.day}
                                </span>
                                <span className="block text-xl font-black text-emerald-950 font-mono mt-0.5">
                                  {fc.temp}°
                                </span>
                                <div className={`p-1.5 rounded-lg w-max mx-auto ${
                                  isHighRain ? 'bg-indigo-50 text-indigo-600' : 'bg-emerald-50 text-emerald-600'
                                }`}>
                                  <CloudSun className="w-4 h-4" />
                                </div>
                                <span className={`block text-[9px] font-black ${
                                  isHighRain ? 'text-indigo-650' : 'text-emerald-700'
                                }`}>
                                  {fc.rainChance}% rain
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                    </div>
                  )}

                </div>
              )}

              {/* ====================================
                  TAB 4: MARKET INTELLIGENCE MODULE
                 ==================================== */}
              {activeTab === 'market' && (
                <div id="deck-tab-market" className="bg-white border border-emerald-100 rounded-3xl p-6 lg:p-8 shadow-sm space-y-8">
                  
                  <div className="pb-4 border-b border-emerald-100 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                      <h3 className="text-lg font-black text-emerald-950">Mandi Price Forecasting Index</h3>
                      <p className="text-xs text-emerald-800/90 font-bold uppercase tracking-wider mt-0.5">
                        Assess real-time APMC lists and historic price trends per Quintal (100 kg)
                      </p>
                    </div>

                    {/* search input bar */}
                    <div className="relative w-full md:w-80">
                      <input
                        type="text"
                        value={marketSearch}
                        onChange={(e) => setMarketSearch(e.target.value)}
                        placeholder="Search crops or auction mandis..."
                        className="w-full bg-slate-50 border border-emerald-200 rounded-xl py-2 pl-9 pr-4 text-xs font-semibold focus:outline-none"
                      />
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-700" />
                    </div>
                  </div>

                  {/* Pricing analytics graphics - Recharts area and bar charts */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    
                    {/* Area Chart trend lines */}
                    <div className="lg:col-span-8 bg-slate-50/45 border border-emerald-200/50 rounded-2xl p-5 shadow-inner">
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-xs font-black text-emerald-950 uppercase tracking-wider block">
                          6-Month Historical Mandi Price Trend (₹/Quintal)
                        </span>
                        <span className="bg-emerald-600 text-white font-bold text-[9px] px-2 py-0.5 rounded-full uppercase">
                          Akola, Nagpur, Latur APMC
                        </span>
                      </div>
                      
                      {/* Responsive chart frame */}
                      <div className="h-64 mt-2">
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={trendChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                            <defs>
                              <linearGradient id="cotton-grad" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                                <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                              </linearGradient>
                              <linearGradient id="soybean-grad" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3}/>
                                <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                              </linearGradient>
                            </defs>
                            <XAxis dataKey="month" tick={{ fontSize: 10 }} />
                            <YAxis tick={{ fontSize: 10 }} domain={[2000, 8000]} />
                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                            <Tooltip contentStyle={{ fontSize: '11px', fontWeight: 'bold' }} />
                            <Legend wrapperStyle={{ fontSize: '10px', marginTop: '10px' }} />
                            <Area type="monotone" dataKey="Cotton" stroke="#10b981" fillOpacity={1} fill="url(#cotton-grad)" strokeWidth={2.5} />
                            <Area type="monotone" dataKey="Soybean" stroke="#f59e0b" fillOpacity={1} fill="url(#soybean-grad)" strokeWidth={2.5} />
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>
                    </div>

                    {/* Bar chart overview for Wheat and other crops */}
                    <div className="lg:col-span-4 bg-slate-50/45 border border-emerald-200/50 rounded-2xl p-5 shadow-inner flex flex-col justify-between">
                      <div>
                        <span className="text-xs font-black text-emerald-950 uppercase tracking-widest block mb-4">
                          Arbitrage Index
                        </span>
                        
                        <div className="space-y-4">
                          <div className="space-y-1">
                            <div className="flex justify-between text-xs font-extrabold text-emerald-900 leading-normal">
                              <span>Latur APMC (Soybean Premium)</span>
                              <span className="text-emerald-700">₹5,600 / quintal</span>
                            </div>
                            <div className="h-2 bg-emerald-100 rounded-full overflow-hidden">
                              <div className="h-full bg-emerald-600 rounded-full" style={{ width: '80%' }} />
                            </div>
                          </div>

                          <div className="space-y-1">
                            <div className="flex justify-between text-xs font-extrabold text-emerald-900 leading-normal">
                              <span>Yavatmal Mandi (Cotton Premium)</span>
                              <span className="text-emerald-700">₹7,200 / quintal</span>
                            </div>
                            <div className="h-2 bg-emerald-100 rounded-full overflow-hidden">
                              <div className="h-full bg-emerald-600 rounded-full" style={{ width: '95%' }} />
                            </div>
                          </div>

                          <div className="space-y-1">
                            <div className="flex justify-between text-xs font-extrabold text-emerald-900 leading-normal">
                              <span>Indore Mandi (Wheat Spot)</span>
                              <span className="text-emerald-700">₹2,600 / quintal</span>
                            </div>
                            <div className="h-2 bg-emerald-100 rounded-full overflow-hidden">
                              <div className="h-full bg-emerald-600 rounded-full" style={{ width: '45%' }} />
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="bg-emerald-50/60 p-3 rounded-xl border border-emerald-100 text-[10px] text-emerald-800 leading-relaxed font-bold mt-4">
                        💡 Selling crop batches in Latur instead of Nagpur yields a price margin premium of ₹120 per quintal after mapping state logistics costs.
                      </div>
                    </div>

                  </div>

                  {/* Market real-time listings table */}
                  <div className="space-y-4">
                    <h4 className="text-xs font-black text-emerald-950 uppercase tracking-wider pl-1 font-mono">
                      ● Active State APMC Auction sheet
                    </h4>

                    {marketLoading ? (
                      <div className="py-8 text-center flex flex-col items-center justify-center">
                        <LoadingSpinner message="Consulting Mandi Price indexes..." />
                      </div>
                    ) : (
                      <div className="bg-white border border-emerald-100 rounded-2xl overflow-hidden shadow-sm">
                        <div className="overflow-x-auto">
                          <table className="w-full text-left border-collapse">
                            <thead>
                              <tr className="bg-emerald-50/70 border-b border-emerald-100 text-xs font-bold text-emerald-900 uppercase">
                                <th className="px-6 py-4">Commodity / Crop</th>
                                <th className="px-6 py-4">Apex APMC Center</th>
                                <th className="px-6 py-4">Live Price Rate</th>
                                <th className="px-6 py-4">Difference Delta</th>
                                <th className="px-6 py-4">State</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-emerald-50 font-semibold text-xs text-emerald-950">
                              {filteredMarket.map((price, idx) => {
                                const isUp = price.trend === 'up';
                                const isDown = price.trend === 'down';
                                return (
                                  <tr key={idx} className="hover:bg-slate-50/60 transition">
                                    <td className="px-6 py-3.5 font-black text-emerald-950 text-sm">
                                      {price.crop}
                                    </td>
                                    <td className="px-6 py-3.5 text-emerald-800 font-bold">
                                      {price.location}
                                    </td>
                                    <td className="px-6 py-3.5 font-black font-mono text-emerald-950 text-sm">
                                      ₹{price.price.toLocaleString('en-IN')} / Qtl
                                    </td>
                                    <td className="px-6 py-3.5">
                                      <span
                                        className={`inline-flex items-center px-2 py-0.5 rounded-full font-mono font-bold ${
                                          isUp
                                            ? 'bg-emerald-50 text-emerald-700'
                                            : isDown
                                            ? 'bg-red-50 text-red-650'
                                            : 'bg-slate-50 text-slate-500'
                                        }`}
                                      >
                                        {isUp ? '▲' : isDown ? '▼' : '●'}{' '}
                                        {price.change === 0 ? 'Stable' : `${price.change > 0 ? '+' : ''}${price.change}`}
                                      </span>
                                    </td>
                                    <td className="px-6 py-3.5 text-[10px] text-emerald-755 font-bold">
                                      {price.updatedAt}
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
              )}

              {/* ====================================
                  TAB 5: PEST DETECTION / DISEASE MODULE
                 ==================================== */}
              {activeTab === 'pest' && (
                <div id="deck-tab-pest" className="bg-white border border-emerald-100 rounded-3xl p-6 lg:p-8 shadow-sm space-y-8">
                  
                  <div className="pb-4 border-b border-emerald-100 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                      <h3 className="text-lg font-black text-emerald-950">AI Pest & Weed Detection</h3>
                      <p className="text-xs text-emerald-800/90 font-bold uppercase tracking-wider mt-0.5">
                        Shoot leaf pictures under sunlight and scan fungal spotting automatically
                      </p>
                    </div>
                    <div className="bg-emerald-50 border border-emerald-100 rounded-full px-4 py-1.5 text-[10px] font-black text-emerald-800 uppercase tracking-wide">
                      Scan Core: ResNet-CV AI v3
                    </div>
                  </div>

                  {/* Simulated interactive items */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    
                    {/* Left Column: upload panel and simulation triggers */}
                    <div className="lg:col-span-6 space-y-6">
                      
                      {/* Drop area */}
                      <div className="border-2 border-dashed border-emerald-300 hover:border-emerald-600 bg-emerald-50/10 hover:bg-emerald-50/25 rounded-3xl p-8 text-center transition relative overflow-hidden group">
                        
                        <input
                          type="file"
                          accept="image/*"
                          id="pest-input-raw"
                          onChange={handleCustomUpload}
                          className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                        />
                        
                        <UploadCloud className="w-12 h-12 text-emerald-600 mx-auto animate-bounce" />
                        <span className="block text-sm font-black text-emerald-950 mt-3">
                          Upload Custom Leaf Leaflet
                        </span>
                        <span className="block text-xs text-emerald-800/60 font-semibold mt-1">
                          Drag crop leaf picture files here or click to choose from camera roll
                        </span>
                        <div className="mt-4 inline-flex px-3 py-1 bg-white border border-emerald-250 rounded-lg text-[10px] text-emerald-700 font-extrabold uppercase">
                          Supports PNG, JPG up to 10MB
                        </div>
                      </div>

                      {/* Rapid simulation tool assets for tests */}
                      <div className="bg-slate-50/45 border border-emerald-100 rounded-2xl p-5 space-y-4">
                        <span className="text-[10px] font-black text-emerald-850 uppercase tracking-widest block leading-none">
                          👉 Rapid Simulation Presets for Tests:
                        </span>
                        <p className="text-[11px] text-emerald-800/95 font-semibold leading-relaxed">
                          Click any pre-loaded crop foliage disease specimen to test scanning capabilities inside the platform instantly:
                        </p>

                        <div className="grid grid-cols-3 gap-3">
                          
                          <button
                            type="button"
                            id="pest-preset-cotton"
                            onClick={() => simulatePestCheck('cotton-spot')}
                            className="bg-white border border-emerald-200/50 hover:border-emerald-600 focus:ring-2 focus:ring-emerald-500 rounded-xl p-2.5 text-center transition focus:outline-none"
                          >
                            <img
                              className="w-full h-14 object-cover rounded-lg"
                              src="https://images.unsplash.com/photo-1594900889278-e568ba7a5411?auto=format&fit=crop&q=80&w=150"
                              alt="Cotton leaf spot"
                              referrerPolicy="no-referrer"
                            />
                            <span className="block text-[9px] font-black uppercase text-emerald-950 tracking-tight mt-1.5 leading-none">Cotton Spot</span>
                          </button>

                          <button
                            type="button"
                            id="pest-preset-wheat"
                            onClick={() => simulatePestCheck('wheat-rust')}
                            className="bg-white border border-emerald-200/50 hover:border-emerald-600 focus:ring-2 focus:ring-emerald-500 rounded-xl p-2.5 text-center transition focus:outline-none"
                          >
                            <img
                              className="w-full h-14 object-cover rounded-lg"
                              src="https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&q=80&w=150"
                              alt="Wheat Rust"
                              referrerPolicy="no-referrer"
                            />
                            <span className="block text-[9px] font-black uppercase text-emerald-950 tracking-tight mt-1.5 leading-none">Wheat Stem Rust</span>
                          </button>

                          <button
                            type="button"
                            id="pest-preset-tomato"
                            onClick={() => simulatePestCheck('tomato-blight')}
                            className="bg-white border border-emerald-200/50 hover:border-emerald-600 focus:ring-2 focus:ring-emerald-500 rounded-xl p-2.5 text-center transition focus:outline-none"
                          >
                            <img
                              className="w-full h-14 object-cover rounded-lg"
                              src="https://images.unsplash.com/photo-1592417817098-8f3d6eb19675?auto=format&fit=crop&q=80&w=150"
                              alt="Tomato Blight"
                              referrerPolicy="no-referrer"
                            />
                            <span className="block text-[9px] font-black uppercase text-emerald-950 tracking-tight mt-1.5 leading-none">Tomato Blight</span>
                          </button>

                        </div>
                      </div>

                    </div>

                    {/* Right Column: AI leaf symptoms summary outputs */}
                    <div className="lg:col-span-6 bg-slate-50/30 border border-emerald-100 rounded-3xl p-6 shadow-sm min-h-[350px] flex flex-col justify-center">
                      
                      {pestLoading ? (
                        <div className="text-center py-10 flex flex-col items-center justify-center space-y-4">
                          <div className="w-12 h-12 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin" />
                          <span className="text-sm font-bold text-emerald-800">
                            CV model processing leaf cells and symptoms...
                          </span>
                        </div>
                      ) : pestResult ? (
                        <div className="space-y-6">
                          
                          {/* Image preview */}
                          {pestImage && (
                            <div className="w-full h-40 rounded-2xl overflow-hidden border border-emerald-100">
                              <img className="w-full h-full object-cover" src={pestImage} alt="Crop Leaf Symptom" referrerPolicy="no-referrer" />
                            </div>
                          )}

                          {/* Detail summary cards */}
                          <div className="space-y-4">
                            
                            <div className="flex items-center justify-between">
                              <h4 className="text-xl font-black text-emerald-950">{pestResult.disease}</h4>
                              <span className="bg-red-50 text-red-700 font-bold border border-red-100 py-0.5 px-3 rounded-full text-xs">
                                Severity: {pestResult.severity}
                              </span>
                            </div>

                            <div className="flex items-center space-x-2">
                              <span className="text-xs font-black text-emerald-800 uppercase">Analysis Confidence:</span>
                              <span className="font-mono text-xs font-black text-emerald-600 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                                {pestResult.confidence}% confidence
                              </span>
                            </div>

                            <div className="space-y-3.5 pt-4 border-t border-emerald-100 text-xs font-bold text-emerald-900 leading-relaxed">
                              
                              <div>
                                <span className="block text-[10px] uppercase text-emerald-800/60 font-black">Pathogen Cause:</span>
                                <p className="text-emerald-950 font-semibold mt-0.5">{pestResult.cause}</p>
                              </div>

                              <div>
                                <span className="block text-[10px] uppercase text-emerald-850/60 font-black">Recommended Chemical Treatment:</span>
                                <p className="text-emerald-950 font-black mt-0.5 text-emerald-700 bg-emerald-100/30 p-2.5 rounded-xl border border-emerald-100">
                                  {pestResult.treatment}
                                </p>
                              </div>

                              <div>
                                <span className="block text-[10px] uppercase text-emerald-850/60 font-black">Preventative Measure Sowing Guidelines:</span>
                                <p className="text-emerald-955 font-semibold mt-0.5">{pestResult.prevention}</p>
                              </div>

                            </div>

                          </div>

                          <button
                            id="reset-pest-btn"
                            onClick={() => { setPestResult(null); setPestImage(null); }}
                            className="bg-white border border-emerald-250 text-emerald-950 font-black text-xs py-2 px-4 rounded-xl shadow-sm hover:bg-emerald-50 uppercase tracking-wide cursor-pointer w-full"
                          >
                            Scan Another Specimen
                          </button>

                        </div>
                      ) : (
                        <div className="text-center space-y-3 text-emerald-800/50 py-10">
                          <Bug className="w-12 h-12 text-emerald-600/30 mx-auto" />
                          <h4 className="text-sm font-black text-emerald-950 uppercase">Analysis Results Empty</h4>
                          <p className="text-xs font-semibold max-w-sm mx-auto">
                            Upload a diseased crop leaf picture or pick one of our preset templates on the left to initiate real-time diagnosis.
                          </p>
                        </div>
                      )}

                    </div>

                  </div>

                </div>
              )}

              {/* ====================================
                  TAB 6: FERTILIZER ADVISOR PANEL
                 ==================================== */}
              {activeTab === 'fertilizer' && (
                <div id="deck-tab-fertilizer" className="bg-white border border-emerald-100 rounded-3xl p-6 lg:p-8 shadow-sm space-y-8">
                  
                  <div className="pb-4 border-b border-emerald-100 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                      <h3 className="text-lg font-black text-emerald-950">Nutrient N-P-K Fertilizer Calculator</h3>
                      <p className="text-xs text-emerald-805/90 font-bold uppercase tracking-wider mt-0.5">
                        Formulate balanced single super phosphate and muriate of potash requirements mapped per acre
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    
                    {/* Left side inputs */}
                    <form onSubmit={calculateFertilizer} className="lg:col-span-4 space-y-5 bg-emerald-50/20 p-6 rounded-2xl border border-emerald-100/60">
                      
                      {/* Crop Type select */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-emerald-950 block">Target Crop type</label>
                        <select
                          value={fertCrop}
                          onChange={(e) => setFertCrop(e.target.value)}
                          className="w-full bg-white border border-emerald-200 rounded-xl px-3 py-2.5 text-xs font-bold text-emerald-950 focus:outline-none"
                        >
                          <option value="Soybean">Soybean (Oilseed Pulses)</option>
                          <option value="Cotton">Cotton (Kharif Cash)</option>
                          <option value="Wheat">Wheat (Rabi Grain)</option>
                          <option value="Rice">Rice (Irrigated Cereal)</option>
                        </select>
                      </div>

                      {/* Soil Type select */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-emerald-950 block">Farm Soil chemistry type</label>
                        <select
                          value={fertSoil}
                          onChange={(e) => setFertSoil(e.target.value)}
                          className="w-full bg-white border border-emerald-200 rounded-xl px-3 py-2.5 text-xs font-bold text-emerald-950 focus:outline-none"
                        >
                          <option value="Black Soil">Black Soil (Deep Clay)</option>
                          <option value="Loamy Soil">Loamy Soil (Fertile Silt)</option>
                          <option value="Red Soil">Red Soil (Loamy Acidic)</option>
                          <option value="Sandy Soil">Sandy Soil (High Drainage)</option>
                        </select>
                      </div>

                      <button
                        type="submit"
                        id="calculate-fertilizer-submit-btn"
                        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs uppercase py-3 rounded-xl shadow shadow-emerald-700/10 cursor-pointer"
                      >
                        Generate Dosage Table
                      </button>

                    </form>

                    {/* Right side outputs */}
                    <div className="lg:col-span-8 bg-slate-50/30 border border-emerald-100 rounded-3xl p-6 min-h-[290px] flex flex-col justify-center">
                      
                      {fertOutput ? (
                        <div className="space-y-6 animate-fade-in">
                          
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-4 border-b border-emerald-100">
                            <div>
                              <h4 className="text-lg font-black text-emerald-950">Optimal Dosage prescription</h4>
                              <span className="text-[10px] text-emerald-805 font-bold uppercase block tracking-wider mt-0.5">
                                Matching parameters: {fertCrop} on {fertSoil}
                              </span>
                            </div>
                            <div className="mt-2 sm:mt-0 bg-[#044e37] text-[#10b981] font-black text-sm px-4 py-2 rounded-xl border border-emerald-500/30 text-center font-mono w-max">
                              N:P:K = {fertOutput.npk}
                            </div>
                          </div>

                          <div className="space-y-4">
                            
                            {/* Bags required */}
                            <div>
                              <span className="block text-[10px] uppercase text-emerald-800/60 font-black">Commercial Bag requirements per Acre:</span>
                              <p className="text-sm font-black text-emerald-955 bg-white border border-emerald-100 p-3 rounded-xl mt-1 text-emerald-700">
                                {fertOutput.bags}
                              </p>
                            </div>

                            {/* Sowing notes */}
                            <div>
                              <span className="block text-[10px] uppercase text-emerald-800/60 font-black">Agronomy split application guidelines:</span>
                              <p className="text-xs text-emerald-900 leading-relaxed font-semibold mt-1">
                                {fertOutput.notes}
                              </p>
                            </div>

                          </div>

                          {/* Quick chemical caution warning */}
                          <div className="bg-amber-50 rounded-xl p-3 border border-amber-100 text-[10px] text-amber-900 font-bold leading-normal">
                            ⚠️ CAUTION: Refrain from applying Urea direct contact to sprouting seeds. Maintain a seed-fertilizer layout gap of 2-3 inches under mechanical soil drills.
                          </div>

                        </div>
                      ) : (
                        <div className="text-center space-y-3 text-emerald-800/50 py-8">
                          <Sparkles className="w-12 h-12 text-emerald-600/30 mx-auto" />
                          <h4 className="text-sm font-black text-emerald-955 uppercase">Calculation Data Empty</h4>
                          <p className="text-xs font-semibold max-w-sm mx-auto">
                            Submit your crop type and soil type values on the left sidebar to dynamically compute Nitrogen, Phosphorus, and Potassium requirements.
                          </p>
                        </div>
                      )}

                    </div>

                  </div>

                </div>
              )}

              {/* ====================================
                  TAB 7: GOVERNMENT SCHEMES PANEL
                 ==================================== */}
              {activeTab === 'schemes' && (
                <div id="deck-tab-schemes" className="space-y-6">
                  
                  <div className="bg-white border border-emerald-100 rounded-3xl p-6 shadow-sm space-y-2">
                    <h3 className="text-xl font-black text-emerald-950">State & National Government Agri Welfare Schemes</h3>
                    <p className="text-xs text-emerald-800 font-semibold leading-relaxed">
                      KrishiMitra provides dynamic smart-registration linking to eligible subsidy yards and direct benefit credit frameworks in under 2 minutes.
                    </p>
                  </div>

                  {/* Scheme cards grid layout */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {schemesList.map((scheme) => (
                      <div
                        key={scheme.id}
                        className="bg-white border border-emerald-100 hover:border-emerald-350 rounded-3xl p-6 shadow-sm flex flex-col justify-between space-y-6 hover:shadow-lg transition duration-200"
                      >
                        <div className="space-y-4">
                          {/* Title block */}
                          <div className="flex items-start justify-between">
                            <div className="p-3 bg-emerald-55 text-emerald-700 bg-emerald-100/40 rounded-2xl">
                              <ShieldCheck className="w-5 h-5" />
                            </div>
                            <span className="bg-emerald-50 text-emerald-700 text-[9px] font-black uppercase px-2.5 py-1 rounded-full border border-emerald-100">
                              Active subsidy
                            </span>
                          </div>

                          <div className="space-y-1.5">
                            <h4 className="text-lg font-black text-emerald-950">{scheme.title}</h4>
                            <p className="text-xs font-bold text-emerald-755 leading-normal">
                              {scheme.benefit}
                            </p>
                          </div>

                          <div className="space-y-2 pt-4 border-t border-emerald-50 text-xs font-bold text-emerald-900 leading-relaxed">
                            <div>
                              <span className="block text-[9px] uppercase text-emerald-800/60 font-black">Eligibility:</span>
                              <span className="text-emerald-950 font-semibold">{scheme.eligibility}</span>
                            </div>
                            <div>
                              <span className="block text-[9px] uppercase text-emerald-800/60 font-black">Required Documents:</span>
                              <span className="text-emerald-950 font-semibold">{scheme.docs}</span>
                            </div>
                          </div>
                        </div>

                        {/* Apply button */}
                        <button
                          type="button"
                          onClick={() => handleApplyScheme(scheme.title)}
                          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs tracking-wide uppercase py-3 rounded-xl transition duration-200 shadow shadow-emerald-700/5 flex items-center justify-center space-x-1"
                        >
                          <span>Apply Now</span>
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>

                </div>
              )}

              {/* ====================================
                  TAB 8: VOICE ASSISTANT PANEL
                 ==================================== */}
              {activeTab === 'voice' && (
                <div id="deck-tab-voice" className="bg-white border border-emerald-100 rounded-3xl p-6 lg:p-8 shadow-sm space-y-8">
                  
                  <div className="pb-4 border-b border-emerald-100 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                      <h3 className="text-lg font-black text-emerald-950">Multi-Lingual Voice Assistant</h3>
                      <p className="text-xs text-emerald-800/90 font-bold uppercase tracking-wider mt-0.5">
                        Ask questions in Standard Hindi or Marathi and hear vocal outputs
                      </p>
                    </div>

                    {/* Language selector toggle */}
                    <div className="flex bg-slate-100 p-0.5 rounded-xl border border-emerald-100 shrink-0">
                      <button
                        onClick={() => { setVoiceLang('english'); setVoiceQueryText(''); setVoiceReplyText(''); }}
                        className={`px-3 py-1.5 text-[10px] font-black rounded-lg transition-all ${
                          voiceLang === 'english' ? 'bg-emerald-600 text-white shadow' : 'text-emerald-900 hover:text-emerald-700'
                        }`}
                      >
                        English
                      </button>
                      <button
                        onClick={() => { setVoiceLang('hindi'); setVoiceQueryText(''); setVoiceReplyText(''); }}
                        className={`px-3 py-1.5 text-[10px] font-black rounded-lg transition-all ${
                          voiceLang === 'hindi' ? 'bg-emerald-600 text-white shadow' : 'text-emerald-900 hover:text-emerald-700'
                        }`}
                      >
                        हिन्दी (Hindi)
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    
                    {/* Left pane: preloaded questions */}
                    <div className="lg:col-span-5 space-y-4 bg-slate-50/40 p-5 rounded-2xl border border-emerald-150">
                      <span className="text-[10px] font-black text-emerald-950 uppercase tracking-widest block leading-none">
                        🗣 TAP BAR TO SPEAK QUESTION:
                      </span>
                      <p className="text-[11px] text-emerald-800 font-semibold leading-normal">
                        Simulate speaking one of standard farmers queries:
                      </p>

                      <div className="space-y-2.5">
                        {voiceSampleQueries[voiceLang === 'english' ? 'english' : 'hindi'].map((item: any, idx: number) => (
                          <button
                            key={idx}
                            onClick={() => handleSimulateVoice(item.q, item.r)}
                            className="w-full text-left bg-white hover:bg-emerald-50 border border-emerald-100/80 p-3 rounded-xl text-xs font-black text-emerald-950 hover:border-emerald-500 transition shadow-sm"
                          >
                            “{item.q}”
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Right pane: visualizer sound wave indicator */}
                    <div className="lg:col-span-7 bg-slate-900 text-white rounded-3xl p-6 min-h-[350px] flex flex-col justify-between space-y-6">
                      
                      {/* Top state indicator */}
                      <div className="flex items-center justify-between">
                        <span className="text-[9px] uppercase tracking-widest text-[#10b981] font-black">
                          ● Voice engine state: {voiceState.toUpperCase()}
                        </span>
                        <div className="px-2.5 py-0.5 bg-slate-800 border border-slate-700 rounded text-[9px] font-bold text-slate-300">
                          {voiceLang === 'english' ? 'English (en-IN)' : 'Hindi Voice (hi-IN)'}
                        </div>
                      </div>

                      {/* Animated Sound Wave frame */}
                      <div className="flex items-center justify-center space-x-1 h-20 self-center">
                        {voiceState === 'listening' ? (
                          // listening waves
                          [...Array(12)].map((_, i) => (
                            <motion.div
                              key={i}
                              className="w-1 bg-[#10b981] rounded-full"
                              animate={{ height: [12, 60, 12] }}
                              transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.05 }}
                            />
                          ))
                        ) : voiceState === 'speaking' ? (
                          // speaking waves
                          [...Array(12)].map((_, i) => (
                            <motion.div
                              key={i}
                              className="w-1 bg-lime-400 rounded-full"
                              animate={{ height: [8, 44, 8] }}
                              transition={{ duration: 0.4, repeat: Infinity, delay: i * 0.03 }}
                            />
                          ))
                        ) : (
                          // silent waves
                          [...Array(12)].map((_, i) => (
                            <div key={i} className="w-1 h-3 bg-slate-700 rounded-full" />
                          ))
                        )}
                      </div>

                      {/* Transcription display */}
                      <div className="space-y-4">
                        {voiceQueryText && (
                          <div className="space-y-1">
                            <span className="text-[9px] text-[#10b981] uppercase font-black block">You Asked (Microphone input):</span>
                            <p className="text-sm font-semibold italic text-slate-200">
                              “{voiceQueryText}”
                            </p>
                          </div>
                        )}

                        {voiceReplyText && (
                          <div className="space-y-1 bg-slate-800/60 p-4 rounded-xl border border-slate-700 animate-fade-in">
                            <span className="text-[9px] text-lime-400 uppercase font-black block">Assistant Reply Verbalized:</span>
                            <p className="text-xs font-bold leading-relaxed text-slate-100">
                              {voiceReplyText}
                            </p>
                          </div>
                        )}
                      </div>

                      {/* Speak repeat trigger */}
                      {voiceState === 'speaking' && (
                        <button
                          onClick={() => {
                            if ('speechSynthesis' in window) {
                              const vRec = new SpeechSynthesisUtterance(voiceReplyText);
                              vRec.lang = voiceLang === 'english' ? 'en-IN' : 'hi-IN';
                              window.speechSynthesis.speak(vRec);
                            }
                          }}
                          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-2 text-center text-xs font-black uppercase rounded-xl tracking-wider cursor-pointer"
                        >
                          🔊 Repeat Vocal Response Out Loud
                        </button>
                      )}

                    </div>

                  </div>

                </div>
              )}

              {/* ====================================
                  TAB 9: AI CHATBOT PANEL
                 ==================================== */}
              {activeTab === 'chatbot' && (
                <div id="deck-tab-chatbot" className="bg-white border border-emerald-100 rounded-3xl p-6 lg:p-8 shadow-sm h-[550px] flex flex-col justify-between">
                  
                  {/* Top layout */}
                  <div className="pb-3 border-b border-emerald-50 shrink-0 flex items-center justify-between">
                    <div>
                      <h3 className="text-base font-black text-emerald-950">Expert AI Agronomist Consultation</h3>
                      <span className="text-[10px] text-emerald-500 font-extrabold block">● Active chatbot assistant model online</span>
                    </div>
                    <button
                      onClick={() => setChatMessages([{ sender: 'ai', text: 'Namaste! I am the KrishiMitra expert Agronomist bot. Ask me anything about crop diseases, fertilizers, seed intervals or APMC prices.' }])}
                      className="text-[10px] font-black text-emerald-900 border border-emerald-200 px-2.5 py-1 rounded-lg hover:bg-emerald-50"
                    >
                      Clear Threads
                    </button>
                  </div>

                  {/* Message stack stream */}
                  <div className="flex-grow my-4 overflow-y-auto px-1 space-y-4">
                    {chatMessages.map((msg, idx) => {
                      const isUser = msg.sender === 'user';
                      return (
                        <div
                          key={idx}
                          className={`flex ${isUser ? 'justify-end' : 'justify-start'} animate-fade-in`}
                        >
                          <div
                            className={`max-w-md p-3.5 rounded-2xl text-xs font-semibold leading-relaxed ${
                              isUser
                                ? 'bg-[#044e37] text-white rounded-br-none shadow-md shadow-emerald-950/10'
                                : 'bg-emerald-50/75 text-emerald-950 rounded-bl-none border border-emerald-100'
                            }`}
                          >
                            <span className="block text-[8px] uppercase tracking-wider mb-1 font-black opacity-60">
                              {isUser ? 'You (Farmer)' : 'KrishiMitra AI Advisor'}
                            </span>
                            <span className="block">{msg.text}</span>
                          </div>
                        </div>
                      );
                    })}

                    {chatTyping && (
                      <div className="flex justify-start">
                        <div className="bg-emerald-50 p-3 rounded-2xl rounded-bl-none flex items-center space-x-1 border border-emerald-100">
                          <span className="w-1.5 h-1.5 bg-emerald-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                          <span className="w-1.5 h-1.5 bg-emerald-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                          <span className="w-1.5 h-1.5 bg-emerald-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                        </div>
                      </div>
                    )}
                    <div ref={chatBottomRef} />
                  </div>

                  {/* Footer message inputs */}
                  <div className="space-y-3 shrink-0">
                    
                    {/* Quick suggestion tags */}
                    <div className="flex flex-wrap gap-2">
                      {quickChatTriggers.map((q) => (
                        <button
                          key={q}
                          onClick={() => triggerChatReply(q)}
                          className="bg-emerald-50 hover:bg-emerald-100 border border-emerald-100/80 rounded-full px-3 py-1 text-[10px] font-extrabold text-emerald-950 transition active:scale-95"
                        >
                          {q}
                        </button>
                      ))}
                    </div>

                    {/* text bar */}
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        if (chatInput.trim()) {
                          triggerChatReply(chatInput);
                        }
                      }}
                      className="flex gap-2"
                    >
                      <input
                        type="text"
                        value={chatInput}
                        onChange={(e) => setChatInput(e.target.value)}
                        placeholder="Write dynamic crop or soil questions..."
                        className="flex-grow bg-slate-50 border border-emerald-250 rounded-xl px-4 text-xs font-semibold focus:outline-none"
                      />
                      <button
                        type="submit"
                        className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs uppercase px-5 py-3 rounded-xl shadow-md cursor-pointer"
                      >
                        Ask AI
                      </button>
                    </form>

                  </div>

                </div>
              )}

              {/* ====================================
                  TAB 10: FARMER PROFILE PANEL
                 ==================================== */}
              {activeTab === 'profile' && (
                <div id="deck-tab-profile" className="bg-white border border-emerald-100 rounded-3xl p-6 lg:p-8 shadow-sm space-y-8">
                  
                  <div className="pb-4 border-b border-emerald-100 flex flex-col md:flex-row md:items-center md:justify-between gap-4 animate-fade-in">
                    <div>
                      <h3 className="text-lg font-black text-emerald-950">Agricultural Identity Portfolio</h3>
                      <p className="text-xs text-emerald-800/90 font-bold uppercase tracking-wider mt-0.5">
                        Manage your local soil parameters, land areas, and coordinates
                      </p>
                    </div>
                  </div>

                  <form
                    onSubmit={async (e) => {
                      e.preventDefault();
                      try {
                        const response = await fetch('/api/auth/profile', {
                          method: 'PUT',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify(user)
                        });
                        const data = await response.json();
                        if (!response.ok) {
                          throw new Error(data.error || 'Failed to sync with central database nodes.');
                        }
                        localStorage.setItem('krishimitra_user', JSON.stringify(data.user || user));
                        alert('Farmer Profile and farm parameters synchronized successfully into permanent cloud database clusters!');
                      } catch (err: any) {
                        alert('Database Sync Error: ' + err.message);
                      }
                    }}
                    className="space-y-6"
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      
                      {/* Name */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-extrabold text-emerald-950">Farmer Full Name</label>
                        <input
                          type="text"
                          value={user.name}
                          onChange={(e) => setUser({ ...user, name: e.target.value })}
                          required
                          className="w-full bg-slate-50 border border-emerald-200 rounded-xl py-3 px-4 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500/40 text-emerald-950"
                        />
                      </div>

                      {/* Phone */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-extrabold text-emerald-950">Mobile Contact Link</label>
                        <input
                          type="text"
                          value={user.mobile}
                          onChange={(e) => setUser({ ...user, mobile: e.target.value })}
                          required
                          className="w-full bg-slate-50 border border-emerald-200 rounded-xl py-3 px-4 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500/40 text-emerald-950"
                        />
                      </div>

                      {/* Sowing Acres */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-extrabold text-emerald-950">Cultivable Sowing Area (Acres)</label>
                        <input
                          type="number"
                          value={user.acres}
                          onChange={(e) => setUser({ ...user, acres: e.target.value })}
                          required
                          className="w-full bg-slate-50 border border-emerald-200 rounded-xl py-3 px-4 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500/40 text-emerald-950"
                        />
                      </div>

                      {/* Irrigation */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-extrabold text-emerald-950">Irrigation Setup Type</label>
                        <select
                          value={user.irrigation}
                          onChange={(e) => setUser({ ...user, irrigation: e.target.value })}
                          className="w-full bg-slate-50 border border-emerald-200 rounded-xl py-3 px-4 text-xs font-bold text-emerald-950 focus:outline-none cursor-pointer"
                        >
                          <option value="Drip Irrigation">Drip Irrigation (Premium Conservation)</option>
                          <option value="Sprinkler System">Sprinkler Irrigation System</option>
                          <option value="Rain-fed / Monsoon">Rain-fed / Natural Monsoon Crop</option>
                          <option value="Canal Flooding">Canal Flooding / River Well</option>
                        </select>
                      </div>

                      {/* Village */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-extrabold text-emerald-950">Village</label>
                        <input
                          type="text"
                          value={user.village}
                          onChange={(e) => setUser({ ...user, village: e.target.value })}
                          required
                          className="w-full bg-slate-50 border border-emerald-200 rounded-xl py-3 px-4 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500/40 text-emerald-950"
                        />
                      </div>

                      {/* District */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-extrabold text-emerald-950">District / State</label>
                        <input
                          type="text"
                          value={user.district}
                          onChange={(e) => setUser({ ...user, district: e.target.value })}
                          required
                          className="w-full bg-slate-50 border border-emerald-200 rounded-xl py-3 px-4 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500/40 text-emerald-950"
                        />
                      </div>

                    </div>

                    <div className="pt-6 border-t border-emerald-50 flex justify-end">
                      <button
                        type="submit"
                        className="bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs uppercase py-3 px-8 rounded-xl shadow-md transition cursor-pointer"
                      >
                        Synchronize Farm Profile
                      </button>
                    </div>
                  </form>

                </div>
              )}

              {/* ====================================
                  TAB 11: APP SETTINGS PANEL
                 ==================================== */}
              {activeTab === 'settings' && (
                <div id="deck-tab-settings" className="bg-white border border-emerald-100 rounded-3xl p-6 lg:p-8 shadow-sm space-y-8 animate-fade-in">
                  
                  <div className="pb-4 border-b border-emerald-100">
                    <h3 className="text-lg font-black text-emerald-950">Application Controls & System Settings</h3>
                    <span className="text-xs text-emerald-805 font-bold uppercase block mt-1 tracking-wider">Configure SMS thresholds and language alerts</span>
                  </div>

                  <div className="space-y-6">
                    
                    {/* SMS alerts */}
                    <div className="flex items-center justify-between p-4 bg-emerald-50/20 border border-emerald-100/50 rounded-2xl">
                      <div>
                        <span className="block text-sm font-black text-emerald-950">Mandi Price Spike Alerts (SMS)</span>
                        <span className="block text-[11px] text-emerald-800 font-semibold leading-relaxed mt-0.5">
                          Receive daily text messages when Cotton/Soybean rates surge past ₹100 thresholds.
                        </span>
                      </div>
                      <div className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" defaultChecked className="sr-only peer" />
                        <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600" />
                      </div>
                    </div>

                    {/* Meteorological warnings */}
                    <div className="flex items-center justify-between p-4 bg-emerald-50/20 border border-emerald-100/50 rounded-2xl">
                      <div>
                        <span className="block text-sm font-black text-emerald-950">Meteorological Severe Storm Warnings</span>
                        <span className="block text-[11px] text-emerald-805 font-semibold leading-relaxed mt-0.5">
                          Receive automated flash alerts before cloud bursts or sudden winds.
                        </span>
                      </div>
                      <div className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" defaultChecked className="sr-only peer" />
                        <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600" />
                      </div>
                    </div>

                    {/* Interface Language */}
                    <div className="p-4 bg-emerald-50/20 border border-emerald-100/50 rounded-2xl space-y-3">
                      <div>
                        <span className="block text-sm font-black text-emerald-950">Global Portal Interface Language</span>
                        <span className="block text-[11px] text-emerald-805 font-semibold mt-0.5 leading-normal">
                          Configures default dashboard headers and advisory texts translation layers automatically.
                        </span>
                      </div>
                      <div className="flex gap-4">
                        {[
                          { name: 'English', code: 'en' },
                          { name: 'Hindi', code: 'hi' },
                          { name: 'Marathi', code: 'mr' }
                        ].map((lang_obj) => {
                          const isSelected = currentLang === lang_obj.code;
                          return (
                            <button
                              key={lang_obj.code}
                              id={`setting-lang-${lang_obj.code}`}
                              type="button"
                              onClick={() => {
                                localStorage.setItem('krishimitra_lang', lang_obj.code);
                                window.dispatchEvent(new Event('krishimitra_lang_changed'));
                              }}
                              className={`rounded-xl px-4 py-2 text-xs font-black transition border ${
                                isSelected
                                  ? 'bg-emerald-600 text-white border-emerald-600'
                                  : 'bg-white hover:bg-emerald-50 border-emerald-200 text-emerald-950 hover:border-emerald-600'
                              }`}
                            >
                              {lang_obj.name}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Offline persistence status */}
                    <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between">
                      <div className="space-y-0.5">
                        <span className="block text-xs font-extrabold text-slate-805 uppercase">Offline DB Sandbox Cache:</span>
                        <span className="block text-[10px] text-slate-500 font-bold leading-none">Status: Normalized & Preserved</span>
                      </div>
                      <button
                        onClick={() => alert('Offline browser application state database wiped clean!')}
                        className="bg-white border border-red-200 hover:border-red-600 rounded-xl px-4 py-2 text-[10px] uppercase font-black tracking-wide text-red-600 transition"
                      >
                        Wipe App Cache
                      </button>
                    </div>

                  </div>

                </div>
              )}

            </motion.div>
          </AnimatePresence>
        </div>

      </main>

      {/* 3. Secure Passcode Verification modal */}
      <AnimatePresence>
        {showPasscodeDialog && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl border border-emerald-100 shadow-2xl max-w-md w-full overflow-hidden p-6 relative text-left"
            >
              <button
                onClick={() => setShowPasscodeDialog(false)}
                className="absolute top-4 right-4 p-2 text-emerald-800 hover:text-emerald-955 rounded-xl hover:bg-slate-50 transition cursor-pointer animate-pulse"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="text-center space-y-3 pb-2">
                <div className="mx-auto p-3 bg-amber-500 rounded-2xl w-max text-white shadow-lg">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-black text-emerald-950">Administrative Access Required</h3>
                <p className="text-xs text-emerald-800/85 font-semibold leading-relaxed">
                  Only authorized Panchayat Officers, Agronomists or district Administrators possess clearance to sync market coefficients or modify scheme details.
                </p>
                <div className="bg-amber-550/10 border border-amber-500/20 rounded-2xl p-2.5 text-[11px] text-amber-800 font-bold">
                  🔒 System Demo Secret Pin: <strong className="text-amber-900 font-extrabold text-xs">12345</strong>
                </div>
              </div>

              <form onSubmit={handleVerifyAdminPasscode} className="space-y-4 mt-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-emerald-950 block">Enter Administrator Security Pin</label>
                  <input
                    type="password"
                    placeholder="Enter security passcode..."
                    value={passcodeInput}
                    onChange={(e) => setPasscodeInput(e.target.value)}
                    required
                    maxLength={14}
                    className="w-full bg-slate-50 border border-emerald-250 rounded-xl p-3 text-center font-black text-lg tracking-widest focus:outline-none focus:ring-2 focus:ring-emerald-500/40 text-emerald-950"
                  />
                </div>

                {passcodeError && (
                  <p className="text-xs text-red-650 font-bold text-center leading-normal">
                    ⚠️ {passcodeError}
                  </p>
                )}

                <button
                  type="submit"
                  className="w-full bg-emerald-650 hover:bg-emerald-750 text-white font-black text-xs uppercase py-3.5 rounded-xl shadow-md transition flex items-center justify-center space-x-2 cursor-pointer"
                >
                  Confirm Authorization Access
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
