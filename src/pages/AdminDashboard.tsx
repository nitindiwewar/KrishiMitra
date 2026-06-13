import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import {
  LayoutDashboard,
  Users,
  Sprout,
  TrendingUp,
  ShieldCheck,
  Bell,
  LineChart,
  ClipboardList,
  Settings,
  Plus,
  Trash2,
  Edit3,
  Search,
  ArrowLeft,
  ChevronRight,
  Home,
  CheckCircle,
  AlertTriangle,
  User,
  LogOut,
  MapPin,
  Save,
  X,
  FileCheck,
  RefreshCw,
  Sliders,
  DollarSign,
  Briefcase,
  Activity,
  Phone,
  Layers,
  ChevronDown,
  Menu
} from 'lucide-react';

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
  Legend,
  PieChart,
  Pie,
  Cell
} from 'recharts';

// Initial Mock Data
const INITIAL_FARMERS = [
  { id: 'F001', name: 'Rajesh Patil', mobile: '9876543210', village: 'Shirasgaon', district: 'Nagpur', state: 'Maharashtra', soilType: 'Black Soil', crop: 'Soybean', status: 'Active' },
  { id: 'F002', name: 'Sanjay Deshmukh', mobile: '9822114400', village: 'Wadegaon', district: 'Akola', state: 'Maharashtra', soilType: 'Black Soil', crop: 'Cotton', status: 'Active' },
  { id: 'F003', name: 'Anil Kadam', mobile: '9145672312', village: 'Hadapsar', district: 'Pune', state: 'Maharashtra', soilType: 'Loamy Soil', crop: 'Wheat', status: 'Active' },
  { id: 'F004', name: 'Ramesh Gowda', mobile: '9845012398', village: 'Malur', district: 'Kolar', state: 'Karnataka', soilType: 'Red Soil', crop: 'Ragi', status: 'Pending' },
  { id: 'F005', name: 'Gurbachan Singh', mobile: '9417065432', village: 'Kharar', district: 'Mohali', state: 'Punjab', soilType: 'Loamy Soil', crop: 'Rice', status: 'Active' },
  { id: 'F006', name: 'Ram Charan Yadav', mobile: '9555123456', village: 'Amethi', district: 'Amethi', state: 'Uttar Pradesh', soilType: 'Sandy Soil', crop: 'Mustard', status: 'Suspended' }
];

const INITIAL_CROPS = [
  { id: 'C001', name: 'Soybean', season: 'Kharif', soilType: 'Black Soil', baseYield: '8-10 q/acre', waterReq: 'Medium', priceIndex: '₹5,600/q' },
  { id: 'C002', name: 'Cotton (Long Staple)', season: 'Kharif', soilType: 'Black Soil', baseYield: '12-15 q/acre', waterReq: 'High', priceIndex: '₹7,200/q' },
  { id: 'C003', name: 'Wheat (LOK-1)', season: 'Rabi', soilType: 'Loamy Soil', baseYield: '18-22 q/acre', waterReq: 'Medium', priceIndex: '₹2,600/q' },
  { id: 'C004', name: 'Gram / Chana', season: 'Rabi', soilType: 'Sandy Soil', baseYield: '6-8 q/acre', waterReq: 'Low', priceIndex: '₹5,400/q' },
  { id: 'C005', name: 'Sugarcane', season: 'Annual', soilType: 'Clayey Soil', baseYield: '40-50 tons/acre', waterReq: 'Very High', priceIndex: '₹3,150/ton' },
  { id: 'C006', name: 'Groundnut', season: 'Kharif', soilType: 'Sandy Soil', baseYield: '10-12 q/acre', waterReq: 'Low', priceIndex: '₹6,300/q' }
];

const INITIAL_MARKET_PRICES = [
  { id: 'M001', crop: 'Soybean', market: 'Nagpur APMC', currentPrice: 5650, minPrice: 5400, maxPrice: 5800, trend: 'up' },
  { id: 'M002', crop: 'Cotton (L-Staple)', market: 'Yavatmal APMC', currentPrice: 7250, minPrice: 6900, maxPrice: 7500, trend: 'up' },
  { id: 'M003', crop: 'Wheat (Sarbati)', market: 'Nashik APMC', currentPrice: 2650, minPrice: 2500, maxPrice: 2750, trend: 'down' },
  { id: 'M004', crop: 'Pigeon Pea (Tur)', market: 'Latur APMC', currentPrice: 10200, minPrice: 9800, maxPrice: 10500, trend: 'up' },
  { id: 'M005', crop: 'Onion (Red)', market: 'Lasalgaon APMC', currentPrice: 1950, minPrice: 1600, maxPrice: 2300, trend: 'down' },
  { id: 'M006', crop: 'Mustard Seeds', market: 'Jaipur APMC', currentPrice: 5850, minPrice: 5600, maxPrice: 6100, trend: 'stable' }
];

const INITIAL_SCHEMES = [
  { id: 'S001', title: 'PM Kisan Samman Nidhi', benefit: '₹6,000 / Year', eligibility: 'Marginal Landholders', category: 'Finance Credit', status: 'Active' },
  { id: 'S002', title: 'PM Fasal Bima Yojana', benefit: 'Low Premium Crop Insurance', eligibility: 'All Sowing Farmers', category: 'Insurance', status: 'Active' },
  { id: 'S003', title: 'Soil Health Card Scheme', benefit: 'Free Soil Testing & Advisory', eligibility: 'All Landholders', category: 'Testing', status: 'Active' },
  { id: 'S004', title: 'Subsidized Solar Pump Subsidies', benefit: '60% cost off solar irrigation pumps', eligibility: 'Tubewell Farmers', category: 'Infrastructure', status: 'Active' },
  { id: 'S005', title: 'Rashtriya Krishi Vikas Yojana', benefit: 'Total agribusiness grants', eligibility: 'FPO Groups', category: 'Development', status: 'Inactive' }
];

const INITIAL_ALERTS = [
  { id: 'A001', type: 'Weather Alert', severity: 'High', message: 'Heavy pre-monsoon storm with wind velocities up to 45km/h in Eastern Vidarbha. Cover open grains.', date: '2026-06-11 14:30', status: 'Sent' },
  { id: 'A002', type: 'Market Trend Alert', severity: 'Medium', message: 'Soybean mandi crop prices in Akola surge beyond ₹5,700/q. Good selling window.', date: '2026-06-11 11:15', status: 'Sent' },
  { id: 'A003', type: 'Pest Advisory', severity: 'High', message: 'Spotted bollworm risks detected in central cotton belts. Inspect calyx leaves immediately.', date: '2026-06-10 16:45', status: 'Sent' },
  { id: 'A004', type: 'System Notification', severity: 'Low', message: 'Weekly database synchronization of APMC market feeds completed successfully.', date: '2026-06-09 04:00', status: 'System' }
];

const AUDIT_LOGS = [
  { timestamp: '10:14:48', author: 'Admin (Pranati)', event: 'Updated Cotton price in Yavatmal APMC to ₹7,250/q', severity: 'info' },
  { timestamp: '09:21:05', author: 'System Broker', event: 'Meteo satellite feed parsed. Rain forecast score updated to 85%', severity: 'success' },
  { timestamp: '08:44:12', author: 'Admin (Pranati)', event: 'Approved pending farmer license verification for Ramesh Gowda', severity: 'warning' },
  { timestamp: '07:30:00', author: 'Framer API Gateway', event: 'Dispatched automated text notification: Heavy rainfall alert to 4,200 farmers', severity: 'success' },
  { timestamp: '06:12:30', author: 'System Broker', event: 'Backup routine successfully executed on Firestore collections cluster', severity: 'info' },
  { timestamp: 'Yesterday', author: 'Admin (Pranati)', event: 'Added "Subsidized Solar Pump Subsidies" to active agrarian directory schemes list', severity: 'info' }
];

export default function AdminDashboard() {
  const navigate = useNavigate();

  // Active navigation tab
  const [activeTab, setActiveTab] = useState<string>('overview');
  
  // Breadcrumb tracker state
  const [subPage, setSubPage] = useState<{ parent: string; active: string; detail?: string } | null>(null);

  // Responsive sidebar toggles
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Core entities state
  const [farmers, setFarmers] = useState(INITIAL_FARMERS);
  const [crops, setCrops] = useState(INITIAL_CROPS);
  const [marketPrices, setMarketPrices] = useState(INITIAL_MARKET_PRICES);
  const [schemes, setSchemes] = useState(INITIAL_SCHEMES);
  const [alerts, setAlerts] = useState(INITIAL_ALERTS);
  const [auditLogs, setAuditLogs] = useState(AUDIT_LOGS);

  // Search parameters
  const [searchQuery, setSearchQuery] = useState('');

  // Form handling (Addition / Editing)
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingItem, setEditingItem] = useState<any | null>(null);

  // Form schemas
  const [farmerForm, setFarmerForm] = useState({ id: '', name: '', mobile: '', village: '', district: '', state: 'Maharashtra', soilType: 'Black Soil', crop: 'Soybean', status: 'Active' });
  const [cropForm, setCropForm] = useState({ id: '', name: '', season: 'Kharif', soilType: 'Black Soil', baseYield: '', waterReq: 'Medium', priceIndex: '' });
  const [marketForm, setMarketForm] = useState({ id: '', crop: '', market: '', currentPrice: 5000, minPrice: 4000, maxPrice: 6000, trend: 'up' });
  const [schemeForm, setSchemeForm] = useState({ id: '', title: '', benefit: '', eligibility: '', category: 'Finance', status: 'Active' });
  const [newAlertText, setNewAlertText] = useState('');
  const [newAlertSeverity, setNewAlertSeverity] = useState('High');
  const [newAlertType, setNewAlertType] = useState('Weather Alert');

  // App settings state
  const [settings, setSettings] = useState({
    smsAlertsEnabled: true,
    aiModelConfidenceThreshold: 85,
    satelliteWeatherRefreshSec: 1800,
    apmcFeedSyncIntervalHours: 4,
    maintenanceMode: false,
    maxBackupCopies: 12
  });

  // Analytics Chart Dummy Data
  const farmerEnrollmentData = [
    { month: 'Jan', registered: 420, active: 390 },
    { month: 'Feb', registered: 580, active: 510 },
    { month: 'Mar', registered: 890, active: 780 },
    { month: 'Apr', registered: 1450, active: 1100 },
    { month: 'May', registered: 2200, active: 1850 },
    { month: 'Jun', registered: 3100, active: 2800 },
  ];

  const regionalYieldData = [
    { region: 'Nagpur', Soybean: 9.8, Cotton: 14.2 },
    { region: 'Latur', Soybean: 11.2, Cotton: 12.5 },
    { region: 'Amravati', Soybean: 8.5, Cotton: 13.9 },
    { region: 'Akola', Soybean: 10.4, Cotton: 15.1 },
    { region: 'Nashik', Soybean: 7.2, Cotton: 11.8 },
  ];

  const cropShareData = [
    { name: 'Soybean', value: 3500 },
    { name: 'Cotton', value: 2800 },
    { name: 'Wheat', value: 2100 },
    { name: 'Gram/Chana', value: 1200 },
    { name: 'Sugarcane', value: 800 }
  ];
  
  const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6'];

  const location = useLocation();
  const [isAdminAuth, setIsAdminAuth] = useState(false);
  const [passcodeInput, setPasscodeInput] = useState('');
  const [passcodeError, setPasscodeError] = useState('');

  // Sync auth or defaults on mount
  const refreshAdminData = () => {
    fetch('/api/farmers').then(res => res.ok && res.json()).then(data => data && setFarmers(data)).catch(err => console.error(err));
    fetch('/api/crops').then(res => res.ok && res.json()).then(data => data && setCrops(data)).catch(err => console.error(err));
    fetch('/api/market/prices').then(res => res.ok && res.json()).then(data => data && setMarketPrices(data)).catch(err => console.error(err));
    fetch('/api/schemes').then(res => res.ok && res.json()).then(data => data && setSchemes(data)).catch(err => console.error(err));
    fetch('/api/alerts').then(res => res.ok && res.json()).then(data => data && setAlerts(data)).catch(err => console.error(err));
    fetch('/api/logs').then(res => res.ok && res.json()).then(data => data && setAuditLogs(data)).catch(err => console.error(err));
  };

  useEffect(() => {
    const defaultUser = { name: 'Admin Principal', mobile: '9000000000', village: 'Headquarters' };
    const stored = localStorage.getItem('krishimitra_admin');
    if (!stored) {
      localStorage.setItem('krishimitra_admin', JSON.stringify(defaultUser));
    }

    const auth = localStorage.getItem('krishimitra_admin_auth') === 'true';
    setIsAdminAuth(auth);
  }, []);

  useEffect(() => {
    if (isAdminAuth) {
      refreshAdminData();
    }
  }, [isAdminAuth]);

  const handleVerifyGatePasscode = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcodeInput === '12345' || passcodeInput.toLowerCase() === 'admin123') {
      localStorage.setItem('krishimitra_admin_auth', 'true');
      setIsAdminAuth(true);
    } else {
      setPasscodeError('Access Denied. Pin was incorrect.');
    }
  };

  // Parse tab parameter from URL search query on change
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tabParam = params.get('tab');
    if (tabParam === 'schemes') {
      setActiveTab('schemes');
    }
  }, [location.search]);

  // Back button functionality
  const triggerBack = () => {
    if (subPage) {
      setSubPage(null);
    } else {
      navigate('/dashboard'); // Go to user dashboard
    }
  };

  // Switch tabs
  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    setSubPage(null);
    setSearchQuery('');
    setEditingItem(null);
  };

  // Add Item handler
  const handleAddNewItem = () => {
    setEditingItem(null);
    if (activeTab === 'farmers') {
      setFarmerForm({ id: `F00${farmers.length + 1}`, name: '', mobile: '', village: '', district: '', state: 'Maharashtra', soilType: 'Black Soil', crop: 'Soybean', status: 'Active' });
    } else if (activeTab === 'crops') {
      setCropForm({ id: `C00${crops.length + 1}`, name: '', season: 'Kharif', soilType: 'Black Soil', baseYield: '', waterReq: 'Medium', priceIndex: '' });
    } else if (activeTab === 'market_prices') {
      setMarketForm({ id: `M00${marketPrices.length + 1}`, crop: '', market: '', currentPrice: 5000, minPrice: 4000, maxPrice: 6000, trend: 'up' });
    } else if (activeTab === 'schemes') {
      setSchemeForm({ id: `S00${schemes.length + 1}`, title: '', benefit: '', eligibility: '', category: 'Finance', status: 'Active' });
    }
    setShowAddModal(true);
  };

  // Save Add Item
  const handleSaveAdd = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (activeTab === 'farmers') {
        const response = await fetch('/api/farmers', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(farmerForm)
        });
        if (!response.ok) throw new Error('Failed to save farmer');
      } else if (activeTab === 'crops') {
        const response = await fetch('/api/crops', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(cropForm)
        });
        if (!response.ok) throw new Error('Failed to save crop');
      } else if (activeTab === 'market_prices') {
        const response = await fetch('/api/market/prices', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(marketForm)
        });
        if (!response.ok) throw new Error('Failed to save market price');
      } else if (activeTab === 'schemes') {
        const response = await fetch('/api/schemes', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(schemeForm)
        });
        if (!response.ok) throw new Error('Failed to save scheme');
      }

      refreshAdminData();
    } catch (err: any) {
      alert(`Error saving record: ${err.message}`);
    }

    setShowAddModal(false);
  };

  // Prepare Edit Item
  const handleEditItem = (item: any) => {
    setEditingItem(item);
    if (activeTab === 'farmers') {
      setFarmerForm({ ...item });
    } else if (activeTab === 'crops') {
      setCropForm({ ...item });
    } else if (activeTab === 'market_prices') {
      setMarketForm({ ...item });
    } else if (activeTab === 'schemes') {
      setSchemeForm({ ...item });
    }
    setShowAddModal(true);
  };

  // Save Edit Item
  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (activeTab === 'farmers') {
        const response = await fetch(`/api/farmers/${farmerForm.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(farmerForm)
        });
        if (!response.ok) throw new Error('Failed to update farmer');
      } else if (activeTab === 'crops') {
        const response = await fetch(`/api/crops/${cropForm.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(cropForm)
        });
        if (!response.ok) throw new Error('Failed to update crop');
      } else if (activeTab === 'market_prices') {
        const response = await fetch(`/api/market/prices/${marketForm.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(marketForm)
        });
        if (!response.ok) throw new Error('Failed to update market price');
      } else if (activeTab === 'schemes') {
        const response = await fetch(`/api/schemes/${schemeForm.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(schemeForm)
        });
        if (!response.ok) throw new Error('Failed to update scheme');
      }

      refreshAdminData();
    } catch (err: any) {
      alert(`Error updating record: ${err.message}`);
    }

    setShowAddModal(false);
    setEditingItem(null);
  };

  // Delete Item handler
  const handleDeleteItem = async (id: string, name: string) => {
    if (confirm(`Are you sure you want to permanently delete "${name}"?`)) {
      try {
        if (activeTab === 'farmers') {
          await fetch(`/api/farmers/${id}`, { method: 'DELETE' });
        } else if (activeTab === 'crops') {
          await fetch(`/api/crops/${id}`, { method: 'DELETE' });
        } else if (activeTab === 'market_prices') {
          await fetch(`/api/market/prices/${id}`, { method: 'DELETE' });
        } else if (activeTab === 'schemes') {
          await fetch(`/api/schemes/${id}`, { method: 'DELETE' });
        }
        refreshAdminData();
      } catch (err) {
        console.error('Delete failed', err);
      }
    }
  };

  // Post New Alert
  const handlePostAlert = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAlertText.trim()) return;

    try {
      const response = await fetch('/api/alerts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: newAlertType,
          message: newAlertText.trim(),
          severity: newAlertSeverity,
        })
      });

      if (!response.ok) throw new Error('Failed to dispatch alert');
      
      setNewAlertText('');
      refreshAdminData();
      alert(`Success: Satellite telemetry broadcast successfully pushed to client farmers via SMS queue!`);
    } catch (err: any) {
      alert(`Error broadcasting alert: ${err.message}`);
    }
  };

  // Toggle scheme status
  const toggleSchemeStatus = (schemeId: string) => {
    setSchemes(schemes.map(s => {
      if (s.id === schemeId) {
        const nextStatus = s.status === 'Active' ? 'Inactive' : 'Active';
        setAuditLogs([
          { timestamp: new Date().toTimeString().split(' ')[0], author: 'Admin (Pranati)', event: `Toggled state of scheme "${s.title}" to ${nextStatus}`, severity: 'info' },
          ...auditLogs
        ]);
        return { ...s, status: nextStatus };
      }
      return s;
    }));
  };

  // Toggle settings
  const handleSettingToggle = (key: string) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key as keyof typeof settings] }));
    setAuditLogs([
      { timestamp: new Date().toTimeString().split(' ')[0], author: 'Admin (Pranati)', event: `Toggled system config setting: ${key}`, severity: 'warning' },
      ...auditLogs
    ]);
  };

  const handleSettingChange = (key: string, value: number) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const filteredFarmers = farmers.filter(f =>
    f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    f.village.toLowerCase().includes(searchQuery.toLowerCase()) ||
    f.district.toLowerCase().includes(searchQuery.toLowerCase()) ||
    f.crop.toLowerCase().includes(searchQuery.toLowerCase()) ||
    f.mobile.includes(searchQuery)
  );

  const filteredCrops = crops.filter(c =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.soilType.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.season.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredMarketPrices = marketPrices.filter(m =>
    m.crop.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.market.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredSchemes = schemes.filter(s =>
    s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.eligibility.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!isAdminAuth) {
    return (
      <div className="min-h-screen w-full bg-[#f8faf6] flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-neutral-900 bg-center bg-no-repeat bg-cover opacity-[.02] pointer-events-none" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1595974482597-4b8da8879bc5?auto=format&fit=crop&q=80&w=1200')" }} />
        
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl border border-emerald-100 shadow-2xl p-6 md:p-8 max-w-sm w-full relative overflow-hidden text-center space-y-6"
        >
          {/* Back button */}
          <div className="absolute top-4 left-4">
            <Link
              to="/dashboard"
              className="p-1.5 px-3 rounded-lg bg-emerald-50 text-emerald-800 text-[11px] font-black tracking-wide leading-none transition flex items-center space-x-1 hover:bg-emerald-100 cursor-pointer"
            >
              <ArrowLeft className="w-3 h-3" />
              <span>Farmer Dashboard</span>
            </Link>
          </div>

          <div className="pt-6 space-y-3">
            <div className="mx-auto p-4 bg-amber-500 rounded-2xl w-max text-white shadow-md animate-bounce">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <h1 className="text-xl font-black text-emerald-950 tracking-tight">Admin Portal Gate</h1>
            <p className="text-xs text-emerald-804/90 font-semibold leading-relaxed">
              Reserved for authorized government agricultural coordinators and agency administrators.
            </p>
            <div className="bg-amber-500/10 border border-amber-500/25 rounded-2xl p-3 text-[11px] font-bold text-amber-800">
              🔑 System Demo Unlock Pin: <strong className="font-extrabold text-[#78350f]">12345</strong>
            </div>
          </div>

          <form onSubmit={handleVerifyGatePasscode} className="space-y-4">
            <div className="space-y-1.5 text-left">
              <label className="text-[10px] font-black uppercase text-emerald-800 tracking-wider pl-1 block">
                Security clearance PIN
              </label>
              <input
                type="password"
                placeholder="•••••"
                value={passcodeInput}
                onChange={(e) => setPasscodeInput(e.target.value)}
                required
                maxLength={10}
                className="w-full text-center p-3 bg-slate-50 border border-emerald-250 rounded-xl font-black tracking-widest text-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/40 text-emerald-950"
              />
            </div>

            {passcodeError && (
              <p className="text-xs text-red-650 font-black text-center leading-normal">
                ⚠️ {passcodeError}
              </p>
            )}

            <button
              type="submit"
              className="w-full bg-emerald-650 hover:bg-emerald-750 text-white font-black text-xs uppercase py-3.5 rounded-xl shadow-md cursor-pointer transition flex items-center justify-center space-x-2"
            >
              <span>Verify Coordinator PIN</span>
            </button>
          </form>

          <p className="text-[9px] text-slate-500 font-semibold leading-normal">
            Secure PM-Kisan Admin Node. IP tracked and logged.
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div id="krishimitra-admin-dashboard" className="min-h-screen bg-[#f8faf6] flex flex-col lg:flex-row relative text-emerald-950 font-sans antialiased">
      
      {/* 1. COLLAPSIBLE LEFT SIDEBAR FOR ADMIN PANEL */}
      <aside className={`bg-[#022c22] text-white flex flex-col shrink-0 border-r border-[#011a14] transition-all duration-300 z-30 ${
        sidebarOpen ? 'w-full lg:w-76' : 'w-0 lg:w-20 overflow-hidden'
      }`}>
        
        {/* Brand logo bar */}
        <div className="p-5 border-b border-emerald-900/60 flex items-center justify-between bg-[#01251c]">
          <div className="flex items-center space-x-3 overflow-hidden">
            <div className="p-2.5 bg-amber-500 rounded-2xl text-[#022c22] shadow-inner font-black shrink-0">
              <Sliders className="w-5 h-5" />
            </div>
            {sidebarOpen && (
              <div className="min-w-0">
                <h1 className="text-lg font-black tracking-tight leading-none text-white truncate">KM Admin Panel</h1>
                <span className="text-[9px] uppercase tracking-wider text-amber-400 font-extrabold leading-none block mt-0.5">Control Center Suite</span>
              </div>
            )}
          </div>
          
          <button
            id="toggle-sidebar-trigger"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-1 px-2 hover:bg-emerald-800 rounded-lg text-emerald-300 hover:text-white hidden lg:block"
          >
            {sidebarOpen ? '◀' : '▶'}
          </button>
        </div>

        {/* Admin profile snippet card */}
        {sidebarOpen && (
          <div className="p-4 m-3 bg-[#013527]/60 border border-emerald-800/40 rounded-2xl flex items-center space-x-3 shadow-inner">
            <div className="w-10 h-10 rounded-full bg-emerald-600 font-black text-xs flex items-center justify-center text-white border border-emerald-400 uppercase shadow-sm">
              AD
            </div>
            <div className="min-w-0 flex-grow">
              <div className="flex items-center space-x-1">
                <span className="block text-xs font-black truncate text-white">Administrator</span>
                <span className="w-1.5 h-1.5 bg-lime-400 rounded-full shrink-0 animate-ping" />
              </div>
              <span className="block text-[10px] text-emerald-300 font-bold">Secured Agent Node</span>
            </div>
          </div>
        )}

        {/* Interactive Sidebar Tabs listing */}
        <nav className="flex-grow p-4 space-y-1.5 overflow-y-auto max-h-[calc(100vh-180px)]">
          {[
            { id: 'overview', label: 'Admin Overview', icon: LayoutDashboard },
            { id: 'farmers', label: 'Farmers Management', icon: Users },
            { id: 'crops', label: 'Managed Crops Registry', icon: Sprout },
            { id: 'market_prices', label: 'APMC Market Prices', icon: TrendingUp },
            { id: 'schemes', label: 'Government schemes', icon: ShieldCheck },
            { id: 'notifications', label: 'Emergency Broadcasts', icon: Bell },
            { id: 'analytics', label: 'Reports & Analytics', icon: LineChart },
            { id: 'audit_logs', label: 'System Audit Logs', icon: ClipboardList },
            { id: 'settings', label: 'Operator System Settings', icon: Sliders }
          ].map(it => {
            const Icon = it.icon;
            const isSel = activeTab === it.id;
            return (
              <button
                key={it.id}
                id={`admin-sidebar-tab-${it.id}`}
                onClick={() => handleTabChange(it.id)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-left text-xs font-bold tracking-wide transition-all ${
                  isSel
                    ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-[#022c22] shadow-lg shadow-amber-500/10'
                    : 'text-emerald-100 hover:text-white hover:bg-emerald-900/40'
                }`}
              >
                <Icon className={`w-4 h-4 shrink-0 ${isSel ? 'text-[#022c22]' : 'text-emerald-300'}`} />
                {sidebarOpen && <span className="truncate">{it.label}</span>}
              </button>
            );
          })}
        </nav>

        {/* Sidebar Footer Back button info */}
        <div className="p-4 border-t border-emerald-900 bg-[#012119]">
          <button
            id="admin-sidebar-exit-btn"
            onClick={() => navigate('/dashboard')}
            className="w-full flex items-center justify-center space-x-2 bg-emerald-950 hover:bg-emerald-900 border border-emerald-800 text-emerald-100 font-bold text-xs py-3 rounded-xl transition uppercase tracking-wider"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            {sidebarOpen && <span>Farmer Dashboard</span>}
          </button>
        </div>

      </aside>

      {/* Mobile Drawer trigger backdrop when sidebar is open on small viewports */}
      <div className="absolute top-4 left-4 z-40 lg:hidden">
        <button
          id="mobile-sidebar-toggle-btn"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-3 bg-[#022c22] rounded-xl text-white shadow-lg focus:outline-none"
        >
          <Menu className="w-5 h-5" />
        </button>
      </div>

      {/* 2. MAIN ADMIN CONTENT AREA */}
      <main className="flex-grow flex flex-col min-w-0 transition-all duration-300 pl-0 lg:pl-0">
        
        {/* Top Header Desktop bar */}
        <header className="bg-white border-b border-emerald-100/60 h-16 px-6 lg:px-8 flex items-center justify-between shrink-0 shadow-sm z-10">
          
          {/* Breadcrumb location tracker block */}
          <div className="flex items-center space-x-3 pl-12 lg:pl-0">
            <button
              onClick={triggerBack}
              id="admin-nav-back-button"
              className="p-1 px-2 bg-emerald-50 hover:bg-emerald-100/80 text-emerald-900 rounded-lg text-xs font-black transition flex items-center space-x-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5 stroke-[3px]" />
              <span>Back</span>
            </button>

            {/* Breadcrumb rendering hierarchy */}
            <div className="hidden sm:flex items-center space-x-1 text-xs text-emerald-805 font-bold uppercase tracking-wider">
              <Link to="/" className="hover:text-emerald-600 transition">Home</Link>
              <ChevronRight className="w-3.5 h-3.5 text-emerald-300" />
              <button onClick={() => setSubPage(null)} className="hover:text-emerald-600 transition">Admin Panel</button>
              <ChevronRight className="w-3.5 h-3.5 text-emerald-300" />
              <span className="text-emerald-950 font-black">
                {activeTab === 'overview' ? 'Overview' : activeTab.replace('_', ' ')}
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            
            {/* Direct Farmer Dashboard Switch */}
            <Link
              to="/dashboard"
              id="quick-nav-user-dashboard"
              className="bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-200 decoration-none font-bold text-xs py-2 px-3.5 rounded-full shadow-sm transition flex items-center space-x-1.5"
            >
              <Sprout className="w-3.5 h-3.5 text-emerald-700" />
              <span className="hidden sm:inline">Go User Portal</span>
            </Link>

            {/* Real quick stats */}
            <div className="hidden md:flex items-center space-x-1.5 text-xs font-black bg-lime-50 text-lime-900 px-3 py-1.5 rounded-full border border-lime-100 uppercase tracking-wider">
              <span className="w-2.5 h-2.5 bg-lime-500 rounded-full animate-pulse" />
              <span>Database Online</span>
            </div>

            {/* System user settings quick menu */}
            <button
              onClick={() => {
                localStorage.removeItem('krishimitra_user');
                window.dispatchEvent(new Event('auth_updated'));
                navigate('/');
              }}
              className="text-emerald-700 hover:text-red-700 p-2.5 hover:bg-slate-50 rounded-xl transition"
              title="Logout session"
            >
              <LogOut className="w-4 h-4" />
            </button>

          </div>

        </header>

        {/* Dynamic subcanvas workspace viewports inside AdminDashboard */}
        <div className="flex-grow p-6 lg:p-8 overflow-y-auto max-h-[calc(100vh-64px)] space-y-6">
          
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.2 }}
              className="space-y-6"
            >
              
              {/* ====================================================
                  TAB A: ADMIN OVERVIEW MODULE (DASHBOARD STATS)
                 ==================================================== */}
              {activeTab === 'overview' && (
                <div id="admin-viewport-overview" className="space-y-8">
                  
                  {/* Hero high-octane glassmorphism title bar */}
                  <div className="bg-gradient-to-r from-[#024e3a] to-[#01251c] rounded-3xl p-6 lg:p-8 text-white relative overflow-hidden shadow-xl border border-emerald-950">
                    <div className="absolute top-0 right-0 w-[30rem] h-[30rem] bg-gradient-to-b from-amber-500/10 to-transparent rounded-full blur-[80px] pointer-events-none" />
                    
                    <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                      <div className="space-y-2">
                        <span className="bg-amber-400 text-[#022c22] text-[10px] font-black uppercase px-3 py-1 rounded-full border border-amber-300">
                          Secure Sovereign Control Terminal
                        </span>
                        <h2 className="text-3xl font-black tracking-tight font-sans">
                          KrishiMitra Administrative Control Node
                        </h2>
                        <p className="text-xs text-emerald-200 max-w-2xl font-medium leading-relaxed leading-relaxed">
                          Monitor regional farmer registry enrollments, crop model diagnostics algorithms, and emergency broadcast push feeds for over 10,480 smart Indian farmers.
                        </p>
                      </div>

                      <div className="flex items-center space-x-3 shrink-0">
                        <button
                          onClick={() => {
                            alert('Querying live APMC records and weather stations... Database up to date.');
                          }}
                          className="bg-white/10 hover:bg-white/20 text-white font-extrabold text-xs uppercase py-3 px-5 rounded-xl border border-white/15 transition flex items-center space-x-2"
                        >
                          <RefreshCw className="w-4 h-4 animate-spin" />
                          <span>Fetch Live Sync</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Core Numeric KPI Stat Cards Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
                    
                    {/* Stat Card 1: Farmers Register */}
                    <div
                      onClick={() => setActiveTab('farmers')}
                      className="bg-white border border-emerald-100 p-5 rounded-2xl shadow-sm space-y-3 cursor-pointer hover:border-emerald-400 hover:shadow-md transition duration-200"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] uppercase font-black tracking-wider text-emerald-800/60">Total Registered Farmers</span>
                        <div className="p-2.5 bg-emerald-50 text-emerald-700 rounded-xl">
                          <Users className="w-5 h-5" />
                        </div>
                      </div>
                      <div>
                        <h4 className="text-3xl font-black text-emerald-950 font-mono">
                          {farmers.length + 10420}
                        </h4>
                        <span className="text-xs font-semibold text-lime-700 block mt-1">
                          ▲ +14% Sowing registration growth
                        </span>
                      </div>
                    </div>

                    {/* Stat Card 2: Managed crops catalog */}
                    <div
                      onClick={() => setActiveTab('crops')}
                      className="bg-white border border-emerald-100 p-5 rounded-2xl shadow-sm space-y-3 cursor-pointer hover:border-emerald-400 hover:shadow-md transition duration-200"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] uppercase font-black tracking-wider text-emerald-800/60">Crops Protocols Cataloged</span>
                        <div className="p-2.5 bg-blue-50 text-blue-700 rounded-xl">
                          <Sprout className="w-5 h-5" />
                        </div>
                      </div>
                      <div>
                        <h4 className="text-3xl font-black text-emerald-950 font-mono">
                          {crops.length} Speices
                        </h4>
                        <span className="text-xs font-semibold text-emerald-800 block mt-1">
                          100% Soils mapped profiles
                        </span>
                      </div>
                    </div>

                    {/* Stat Card 3: Mandi Tracker Average */}
                    <div
                      onClick={() => setActiveTab('market_prices')}
                      className="bg-white border border-emerald-100 p-5 rounded-2xl shadow-sm space-y-3 cursor-pointer hover:border-emerald-400 hover:shadow-md transition duration-200"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] uppercase font-black tracking-wider text-emerald-800/60">APM Mandi price feeds</span>
                        <div className="p-2.5 bg-amber-50 text-amber-500 rounded-xl">
                          <TrendingUp className="w-5 h-5" />
                        </div>
                      </div>
                      <div>
                        <h4 className="text-3xl font-black text-emerald-950 font-mono">
                          {marketPrices.length} Centers
                        </h4>
                        <span className="text-xs font-semibold block text-emerald-800 mt-1">
                          Average index: ₹6,115 / quintal
                        </span>
                      </div>
                    </div>

                    {/* Stat Card 4: Broadcasts sent */}
                    <div
                      onClick={() => setActiveTab('notifications')}
                      className="bg-white border border-emerald-100 p-5 rounded-2xl shadow-sm space-y-3 cursor-pointer hover:border-emerald-400 hover:shadow-md transition duration-200"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] uppercase font-black tracking-wider text-emerald-800/60">Emergency Broadcast Alerts</span>
                        <div className="p-2.5 bg-red-50 text-red-600 rounded-xl">
                          <Bell className="w-5 h-5" />
                        </div>
                      </div>
                      <div>
                        <h4 className="text-3xl font-black text-[#851d1d] font-mono">
                          {alerts.length} Broadcasts
                        </h4>
                        <span className="text-xs font-semibold text-red-700 block mt-1">
                          ● Weather & Pest emergencies active
                        </span>
                      </div>
                    </div>

                  </div>

                  {/* Operational grid block */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
                    
                    {/* Column Left: Live System Audit trail log */}
                    <div className="lg:col-span-7 bg-white border border-emerald-100 rounded-3xl p-6 shadow-sm space-y-4 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between pb-3 border-b border-emerald-50">
                          <div className="flex items-center space-x-2">
                            <Activity className="w-5 h-5 text-[#c18600] animate-pulse" />
                            <h3 className="text-base font-black">Live Operations System Audit Trail</h3>
                          </div>
                          <span className="bg-amber-100 text-[#022c22] text-[9px] font-black uppercase px-2.5 py-1 rounded-full border border-amber-200">
                            Telemetry Active
                          </span>
                        </div>

                        {/* Audit Logs container mapping */}
                        <div className="mt-4 space-y-3.5">
                          {auditLogs.slice(0, 5).map((log, i) => (
                            <div key={i} className="flex items-start space-x-3 text-xs leading-relaxed border-b border-slate-50 pb-3 last:border-b-0">
                              <span className="font-mono text-[10px] text-emerald-800 font-extrabold bg-emerald-50 px-1.5 py-0.5 rounded shrink-0">
                                {log.timestamp}
                              </span>
                              <div className="flex-grow">
                                <span className="font-black text-emerald-950 block">{log.author}</span>
                                <p className="text-emerald-800 font-semibold">{log.event}</p>
                              </div>
                              <span className={`w-2 h-2 rounded-full shrink-0 mt-1.5 ${
                                log.severity === 'success' ? 'bg-lime-500' : log.severity === 'warning' ? 'bg-amber-500' : 'bg-sky-500'
                              }`} />
                            </div>
                          ))}
                        </div>
                      </div>

                      <button
                        onClick={() => setActiveTab('audit_logs')}
                        className="w-full mt-4 py-2.5 bg-emerald-50 hover:bg-emerald-100/80 rounded-xl text-center text-xs font-black text-emerald-900 border border-emerald-100/50 uppercase tracking-widest transition"
                      >
                        View Full Security Audit Trail Listing
                      </button>

                    </div>

                    {/* Column Right: Emergency dispatch quick launcher */}
                    <div className="lg:col-span-5 bg-white border border-emerald-100 rounded-3xl p-6 shadow-sm flex flex-col justify-between space-y-5">
                      <div>
                        <h3 className="text-base font-black text-emerald-950 flex items-center space-x-2">
                          <Bell className="w-5 h-5 text-red-650 shrink-0" />
                          <span>Emergency Bulletin Dispatch</span>
                        </h3>
                        <p className="text-xs text-emerald-800/80 font-bold uppercase tracking-wider mt-1 block">
                          Broadcast immediately to 10k+ farmers
                        </p>

                        <form onSubmit={handlePostAlert} className="space-y-4 mt-4">
                          <div className="space-y-1">
                            <label className="text-[10px] font-black uppercase text-emerald-800">Alert Category / Trigger</label>
                            <select
                              value={newAlertType}
                              onChange={(e) => setNewAlertType(e.target.value)}
                              className="w-full bg-slate-50 border border-emerald-200 rounded-xl px-3 py-2 text-xs font-bold focus:outline-none"
                            >
                              <option value="Weather Alert">⛅ Meteorological Weather Threat</option>
                              <option value="Pest Advisory">🐛 Entomological Pest Outbreak</option>
                              <option value="Mandi Price Bulletin">📈 APMC Price Surge Index</option>
                              <option value="Govt Schemes Flash">🏛️ National Schemes Deadline</option>
                            </select>
                          </div>

                          <div className="space-y-1">
                            <label className="text-[10px] font-black uppercase text-emerald-800">Threat Severity Rank</label>
                            <div className="grid grid-cols-3 gap-2">
                              {['Low', 'Medium', 'High'].map((sev) => (
                                <button
                                  key={sev}
                                  type="button"
                                  onClick={() => setNewAlertSeverity(sev)}
                                  className={`py-2 px-3 rounded-xl text-[10px] font-black uppercase border text-center transition ${
                                    newAlertSeverity === sev
                                      ? 'bg-red-950 text-rose-200 border-red-950'
                                      : 'bg-white text-emerald-900 border-emerald-100 hover:border-emerald-300'
                                  }`}
                                >
                                  {sev}
                                </button>
                              ))}
                            </div>
                          </div>

                          <div className="space-y-1">
                            <label className="text-[10px] font-black uppercase text-emerald-800">Urgent SMS Message content</label>
                            <textarea
                              rows={3}
                              placeholder="Type alert content which will be pushed directly to registered cellular devices via fast SMS pipeline..."
                              value={newAlertText}
                              onChange={(e) => setNewAlertText(e.target.value)}
                              className="w-full bg-slate-50 border border-emerald-200 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none text-emerald-950"
                            />
                          </div>

                          <button
                            type="submit"
                            id="dashboard-override-dispatch-btn"
                            className="w-full bg-red-700 hover:bg-red-800 text-white font-black text-xs uppercase py-3 px-4 rounded-xl shadow-md transition flex items-center justify-center space-x-2 shrink-0 cursor-pointer"
                          >
                            <span>Trigger Satellite Broadcast Now</span>
                          </button>
                        </form>
                      </div>
                    </div>

                  </div>

                </div>
              )}

              {/* ====================================================
                  TAB B: FARMERS MANAGEMENT MODULE (USER MANAGEMENT)
                 ==================================================== */}
              {activeTab === 'farmers' && (
                <div id="admin-viewport-farmers" className="bg-white border border-emerald-100 rounded-3xl p-6 lg:p-8 shadow-sm space-y-6">
                  
                  {/* Section Title with quick Actions */}
                  <div className="pb-4 border-b border-emerald-50 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                      <h3 className="text-xl font-black text-[#022c22]">KrishiMitra Registered Farmers</h3>
                      <p className="text-xs text-emerald-805 font-bold uppercase tracking-wider block mt-0.5">
                        Administer farmer profile coordinates, sowing crops, and account verification status
                      </p>
                    </div>

                    <div className="flex items-center space-x-3 shrink-0">
                      <button
                        onClick={handleAddNewItem}
                        id="admin-add-farmer-btn"
                        className="bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs uppercase py-3 px-4 rounded-xl shadow-md transition flex items-center space-x-2"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Enroll New Farmer</span>
                      </button>
                    </div>
                  </div>

                  {/* Search Query controls bar */}
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search farmers name, mobile, district, crop selection..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full bg-slate-50 border border-emerald-200 rounded-xl py-3 pl-10 pr-4 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500/40 text-emerald-950"
                    />
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-emerald-700" />
                  </div>

                  {/* Responsive Table list */}
                  <div className="overflow-x-auto border border-emerald-100 rounded-2xl">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="bg-emerald-50 border-b border-emerald-100 text-emerald-900 font-extrabold uppercase tracking-wider text-[10px]">
                          <th className="p-4">Farmer ID</th>
                          <th className="p-4">Full Name</th>
                          <th className="p-4">Mobile Contacts</th>
                          <th className="p-4">Sovereign Location</th>
                          <th className="p-4">Soil Profile</th>
                          <th className="p-4">Active Crop</th>
                          <th className="p-4">Status</th>
                          <th className="p-4 text-right">Administrative Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-emerald-50">
                        {filteredFarmers.map((farmer) => (
                          <tr key={farmer.id} className="hover:bg-slate-50 hover:bg-emerald-50/10 transition font-semibold text-emerald-950">
                            <td className="p-4 font-mono text-[10px] text-emerald-800 font-bold">{farmer.id}</td>
                            <td className="p-4">
                              <div className="flex items-center space-x-2">
                                <div className="w-7 h-7 bg-emerald-50 rounded-full flex items-center justify-center font-black text-[10px] text-emerald-700 border border-emerald-100">
                                  {farmer.name.slice(0, 2)}
                                </div>
                                <span className="font-black text-emerald-950">{farmer.name}</span>
                              </div>
                            </td>
                            <td className="p-4 font-mono">{farmer.mobile}</td>
                            <td className="p-4">
                              <span className="block text-[10px] text-slate-500">{farmer.district}</span>
                              <span>{farmer.village}</span>
                            </td>
                            <td className="p-4">
                              <span className="bg-emerald-100/50 text-emerald-900 border border-emerald-100 px-2 py-0.5 rounded text-[10px] font-black uppercase">
                                {farmer.soilType}
                              </span>
                            </td>
                            <td className="p-4 font-black text-emerald-700">{farmer.crop}</td>
                            <td className="p-4">
                              <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase border ${
                                farmer.status === 'Active'
                                  ? 'bg-lime-50 text-lime-900 border-lime-200'
                                  : farmer.status === 'Pending'
                                  ? 'bg-amber-50 text-amber-900 border-amber-200'
                                  : 'bg-red-50 text-[#851D1D] border-rose-200'
                              }`}>
                                {farmer.status}
                              </span>
                            </td>
                            <td className="p-4 text-right space-x-2">
                              <button
                                onClick={() => handleEditItem(farmer)}
                                className="p-1 px-2.5 bg-sky-50 text-sky-800 hover:bg-sky-100/80 rounded border border-sky-200 transition text-[10px] uppercase font-black"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => handleDeleteItem(farmer.id, farmer.name)}
                                className="p-1 px-2.5 bg-red-50 text-red-650 hover:bg-red-100 border border-rose-200 rounded transition text-[10px] uppercase font-black"
                              >
                                Delete
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                </div>
              )}

              {/* ====================================================
                  TAB C: MANAGED CROPS REGISTRY MODULE (CROP SERVICE)
                 ==================================================== */}
              {activeTab === 'crops' && (
                <div id="admin-viewport-crops" className="bg-white border border-emerald-100 rounded-3xl p-6 lg:p-8 shadow-sm space-y-6">
                  
                  <div className="pb-4 border-b border-emerald-50 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                      <h3 className="text-xl font-black text-[#022c22]">Crops Model Database Registry</h3>
                      <p className="text-xs text-emerald-805 font-bold uppercase tracking-wider block mt-0.5">
                        Manage biological crops parameters matching soil, water & APMC expected yields
                      </p>
                    </div>

                    <button
                      onClick={handleAddNewItem}
                      id="admin-add-crop-btn"
                      className="bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs uppercase py-3 px-4 rounded-xl shadow-md transition flex items-center space-x-2 shrink-0 cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Configure New Crop Model</span>
                    </button>
                  </div>

                  {/* Search Query controls bar */}
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search managed crops species, suitable soil type, seasons..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full bg-slate-50 border border-emerald-200 rounded-xl py-3 pl-10 pr-4 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500/40 text-emerald-950"
                    />
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-emerald-700" />
                  </div>

                  {/* Crops Layout view card grid */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    {filteredCrops.map((crop) => (
                      <div
                        key={crop.id}
                        className="border border-emerald-100/80 rounded-2xl p-5 bg-emerald-50/10 hover:bg-white hover:border-emerald-300 transition duration-200 flex flex-col justify-between space-y-4"
                      >
                        <div className="space-y-1.5 animate-fade-in">
                          <div className="flex items-center justify-between">
                            <span className="font-mono text-[9px] text-slate-400 font-bold">{crop.id}</span>
                            <span className="bg-emerald-600 text-white text-[9px] font-black uppercase px-2 py-0.5 rounded-full">
                              {crop.season}
                            </span>
                          </div>
                          <h4 className="text-lg font-black text-emerald-950">{crop.name}</h4>
                          
                          <div className="pt-2 grid grid-cols-2 gap-2 text-[11px] font-bold text-emerald-900 leading-normal">
                            <div>
                              <span className="block text-[9px] uppercase text-slate-500">Soil Fit</span>
                              <span className="font-black text-emerald-950">{crop.soilType}</span>
                            </div>
                            <div>
                              <span className="block text-[9px] uppercase text-slate-500">Hydration Demand</span>
                              <span className="font-black text-emerald-950">{crop.waterReq}</span>
                            </div>
                            <div>
                              <span className="block text-[9px] uppercase text-slate-500">Acre Yield Capacity</span>
                              <span className="font-black text-emerald-950">{crop.baseYield}</span>
                            </div>
                            <div>
                              <span className="block text-[9px] uppercase text-slate-500">Mandi Price Baseline</span>
                              <span className="font-black text-emerald-650 tracking-wide">{crop.priceIndex}</span>
                            </div>
                          </div>
                        </div>

                        <div className="pt-3 border-t border-emerald-50 flex items-center justify-end space-x-2 shrink-0">
                          <button
                            onClick={() => handleEditItem(crop)}
                            className="bg-sky-50 text-sky-800 hover:bg-sky-100/85 px-3 py-1.5 rounded text-[10px] font-black uppercase border border-sky-200 transition"
                          >
                            Modify
                          </button>
                          <button
                            onClick={() => handleDeleteItem(crop.id, crop.name)}
                            className="bg-red-50 text-red-650 hover:bg-red-100 px-3 py-1.5 rounded text-[10px] font-black uppercase border border-rose-200 transition"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                </div>
              )}

              {/* ====================================================
                  TAB D: APMC MARKET PRICES MODULE (MARKET PRICES)
                 ==================================================== */}
              {activeTab === 'market_prices' && (
                <div id="admin-viewport-market" className="bg-white border border-emerald-100 rounded-3xl p-6 lg:p-8 shadow-sm space-y-6">
                  
                  <div className="pb-4 border-b border-emerald-50 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                      <h3 className="text-xl font-black text-[#022c22]">APMC Government Mandi Price Indexes</h3>
                      <p className="text-xs text-emerald-805 font-bold uppercase tracking-wider block mt-0.5">
                        Manage current crop trading index benchmarks, floor rates, and market indicators
                      </p>
                    </div>

                    <button
                      onClick={handleAddNewItem}
                      id="admin-add-market-btn"
                      className="bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs uppercase py-3 px-4 rounded-xl shadow-md transition flex items-center space-x-2 shrink-0 cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Post APMC Crop Price Feed</span>
                    </button>
                  </div>

                  {/* Search Query controls bar */}
                  <div className="relative font-bold">
                    <input
                      type="text"
                      placeholder="Search system crop name, mandi center locations..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full bg-slate-50 border border-emerald-200 rounded-xl py-3 pl-10 pr-4 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500/40 text-emerald-950"
                    />
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-emerald-700" />
                  </div>

                  {/* Mandi price directory table selection */}
                  <div className="overflow-x-auto border border-emerald-100 rounded-2xl">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="bg-emerald-50 border-b border-emerald-100 text-emerald-900 font-extrabold uppercase tracking-wider text-[10px]">
                          <th className="p-4">ID Reference</th>
                          <th className="p-4">Sowing Crop Name</th>
                          <th className="p-4">Trading Mandi Location</th>
                          <th className="p-4">Daily Min Quintal Rate</th>
                          <th className="p-4">Daily Max Quintal Rate</th>
                          <th className="p-4">Weighted Mid Index</th>
                          <th className="p-4">Mandi Trend Switch</th>
                          <th className="p-4 text-right">Mandate Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-emerald-50 font-semibold">
                        {filteredMarketPrices.map((mandi) => (
                          <tr key={mandi.id} className="hover:bg-slate-50 hover:bg-emerald-50/10 transition">
                            <td className="p-4 font-mono text-[9px] text-[#022c22] font-black">{mandi.id}</td>
                            <td className="p-4 font-black text-emerald-950 text-sm">{mandi.crop}</td>
                            <td className="p-4 text-emerald-800 font-black">{mandi.market}</td>
                            <td className="p-4 font-mono font-bold">₹{mandi.minPrice}</td>
                            <td className="p-4 font-mono font-bold text-emerald-700">₹{mandi.maxPrice}</td>
                            <td className="p-4 font-mono font-black text-emerald-950 text-sm">₹{mandi.currentPrice}</td>
                            <td className="p-4">
                              <span className={`px-2.5 py-1 rounded text-[9px] font-black uppercase flex items-center space-x-1 w-max ${
                                mandi.trend === 'up'
                                  ? 'bg-lime-50 text-lime-900 border border-lime-200'
                                  : mandi.trend === 'down'
                                  ? 'bg-red-50 text-[#851D1D] border border-rose-250'
                                  : 'bg-emerald-50 text-emerald-900 border border-emerald-250'
                              }`}>
                                <span>{mandi.trend === 'up' ? '▲' : mandi.trend === 'down' ? '▼' : '●'}</span>
                                <span>{mandi.trend === 'up' ? 'Bullish' : mandi.trend === 'down' ? 'Bearish' : 'Neutral'}</span>
                              </span>
                            </td>
                            <td className="p-4 text-right space-x-2">
                              <button
                                onClick={() => handleEditItem(mandi)}
                                className="p-1 px-2.5 bg-sky-50 text-sky-800 hover:bg-sky-100/80 rounded border border-sky-200 transition text-[10px] uppercase font-black"
                              >
                                Adjust
                              </button>
                              <button
                                onClick={() => handleDeleteItem(mandi.id, mandi.crop)}
                                className="p-1 px-2.5 bg-red-50 text-red-650 hover:bg-red-100 border border-rose-200 rounded transition text-[10px] uppercase font-black"
                              >
                                Delete
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                </div>
              )}

              {/* ====================================================
                  TAB E: GOVERNMENT SCHEME MANAGEMENT (SCHEMES)
                 ==================================================== */}
              {activeTab === 'schemes' && (
                <div id="admin-viewport-schemes" className="bg-white border border-emerald-100 rounded-3xl p-6 lg:p-8 shadow-sm space-y-6">
                  
                  <div className="pb-4 border-b border-emerald-50 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                      <h3 className="text-xl font-black text-[#022c22]">National government Subsidized Schemes Portal</h3>
                      <p className="text-xs text-emerald-805 font-bold uppercase tracking-wider block mt-0.5">
                        Broadcast and administer safety schemes, subsidies, and application requirements
                      </p>
                    </div>

                    <button
                      onClick={handleAddNewItem}
                      id="admin-add-scheme-btn"
                      className="bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs uppercase py-3 px-4 rounded-xl shadow-md transition flex items-center space-x-2 shrink-0 cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Configure Scheme Entry</span>
                    </button>
                  </div>

                  {/* Search Query controls bar */}
                  <div className="relative font-semibold">
                    <input
                      type="text"
                      placeholder="Search active schemes catalog, category, benefits matrix..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full bg-slate-50 border border-emerald-200 rounded-xl py-3 pl-10 pr-4 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500/40 text-emerald-950"
                    />
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-emerald-700" />
                  </div>

                  {/* Schemes grid block item entries */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {filteredSchemes.map((sch) => (
                      <div
                        key={sch.id}
                        className="bg-white border border-emerald-100/80 rounded-2xl p-5 hover:border-emerald-350 hover:shadow-lg transition flex flex-col justify-between space-y-4"
                      >
                        <div className="space-y-2.5 animate-fade-in">
                          <div className="flex items-center justify-between">
                            <span className="bg-emerald-100 text-emerald-950 text-[9px] font-black uppercase tracking-wider px-2.5 py-1 rounded border border-emerald-200">
                              {sch.category}
                            </span>
                            
                            {/* Toggle state switch button */}
                            <button
                              onClick={() => toggleSchemeStatus(sch.id)}
                              className={`px-3 py-1 rounded-full text-[9px] font-black uppercase transition ${
                                sch.status === 'Active'
                                  ? 'bg-lime-500 text-emerald-950'
                                  : 'bg-slate-200 text-slate-700'
                              }`}
                            >
                              {sch.status === 'Active' ? '● Active' : '● Inactive'}
                            </button>
                          </div>

                          <h4 className="text-base font-black text-emerald-950">{sch.title}</h4>
                          
                          <div className="space-y-1.5 text-xs font-bold leading-relaxed text-emerald-850">
                            <div>
                              <span className="text-[10px] text-slate-500 uppercase block leading-none">Scheme Benefit details</span>
                              <span className="font-semibold text-emerald-900 block mt-0.5">{sch.benefit}</span>
                            </div>
                            <div>
                              <span className="text-[10px] text-slate-500 uppercase block leading-none">Target group eligibility criteria</span>
                              <span className="font-semibold text-emerald-950 block mt-0.5">{sch.eligibility}</span>
                            </div>
                          </div>
                        </div>

                        <div className="pt-3 border-t border-emerald-50 flex items-center justify-end space-x-2 shrink-0">
                          <button
                            onClick={() => handleEditItem(sch)}
                            className="bg-sky-50 text-sky-800 hover:bg-sky-100 border border-sky-200 px-3 py-1.5 rounded text-[10px] font-black uppercase transition"
                          >
                            Amend details
                          </button>
                          <button
                            onClick={() => handleDeleteItem(sch.id, sch.title)}
                            className="bg-red-50 text-red-650 hover:bg-red-100 border border-rose-200 px-3 py-1.5 rounded text-[10px] font-black uppercase transition"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                </div>
              )}

              {/* ====================================================
                  TAB F: NOTIFICATIONS & EMERGENCY ALERTS LIST
                 ==================================================== */}
              {activeTab === 'notifications' && (
                <div id="admin-viewport-notifications" className="bg-white border border-emerald-100 rounded-3xl p-6 lg:p-8 shadow-sm space-y-6">
                  
                  <div className="pb-4 border-b border-emerald-50">
                    <h3 className="text-xl font-black text-[#022c22]">Emergency Broadcasting Broadcast Console</h3>
                    <p className="text-xs text-emerald-805 font-bold uppercase tracking-wider block mt-0.5">
                      Pushover instant alerts regarding volatile weather anomalies, disease vectors and market updates
                    </p>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
                    
                    {/* Broadcast dispatch frame */}
                    <div className="lg:col-span-1 bg-emerald-50/20 border border-emerald-100 p-5 rounded-2xl space-y-4">
                      <h4 className="text-sm font-black text-emerald-950 uppercase pl-1">New Satellite Broadcast Dispatch</h4>
                      
                      <form onSubmit={handlePostAlert} className="space-y-4">
                        <div className="space-y-1">
                          <label className="text-[10px] font-black uppercase text-emerald-800 block">Alert Category</label>
                          <select
                            value={newAlertType}
                            onChange={(e) => setNewAlertType(e.target.value)}
                            className="w-full bg-white border border-emerald-200 rounded-xl px-3 py-2.5 text-xs font-bold"
                          >
                            <option value="Weather Alert">⛅ Weather Alert</option>
                            <option value="Pest Advisory">🐛 Pest Advisory</option>
                            <option value="Market Trend Alert">📈 Market Trend</option>
                            <option value="Official schemes Advisory">🏛️ Government Update</option>
                          </select>
                        </div>

                        <div className="space-y-1">
                          <label className="text-[10px] font-black uppercase text-emerald-800 block">Threat Severity Metric</label>
                          <select
                            value={newAlertSeverity}
                            onChange={(e) => setNewAlertSeverity(e.target.value)}
                            className="w-full bg-white border border-emerald-200 rounded-xl px-3 py-2.5 text-xs font-bold"
                          >
                            <option value="High">🔴 Red High Emergency Trigger</option>
                            <option value="Medium">🟡 Yellow Medium Advisory</option>
                            <option value="Low">🟢 Green Low Bulletin</option>
                          </select>
                        </div>

                        <div className="space-y-1">
                          <label className="text-[10px] font-black uppercase text-emerald-800 block">Urgent Broadcast body text</label>
                          <textarea
                            rows={4}
                            value={newAlertText}
                            onChange={(e) => setNewAlertText(e.target.value)}
                            placeholder="Draft the explicit bulletin details targeting local block sectors..."
                            className="w-full bg-white border border-emerald-200 rounded-xl px-3 py-2.5 text-xs font-semibold focus:outline-none"
                            required
                          />
                        </div>

                        <button
                          type="submit"
                          id="broadcast-satellite-publish-btn"
                          className="w-full py-3 bg-red-750 hover:bg-red-800 text-white text-xs font-black uppercase rounded-xl shadow-md transition tracking-wider shrink-0"
                        >
                          Send Satellite Broadcast
                        </button>
                      </form>
                    </div>

                    {/* Broadcast Logs listings Column */}
                    <div className="lg:col-span-2 space-y-4 font-bold text-xs uppercase text-emerald-950">
                      <h4 className="text-sm font-black text-emerald-950 tracking-widest pl-1 uppercase">Broadcast alert bulletins dispatch log</h4>
                      
                      <div className="space-y-3">
                        {alerts.map((alertItem) => (
                          <div
                            key={alertItem.id}
                            className={`p-4 rounded-xl border ${
                              alertItem.severity === 'High'
                                ? 'bg-red-50/20 border-red-100'
                                : alertItem.severity === 'Medium'
                                ? 'bg-amber-50/20 border-amber-100'
                                : 'bg-sky-50/25 border-sky-100'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-2">
                                <span className={`w-2 h-2 rounded-full ${
                                  alertItem.severity === 'High' ? 'bg-red-500' : alertItem.severity === 'Medium' ? 'bg-amber-500' : 'bg-sky-500'
                                }`} />
                                <span className="font-black text-emerald-950">{alertItem.type}</span>
                                <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded ${
                                  alertItem.severity === 'High' ? 'bg-red-100 text-red-800 animate-pulse' : 'bg-slate-100 text-slate-700'
                                }`}>
                                  {alertItem.severity} Class
                                </span>
                              </div>
                              <span className="font-mono text-[9px] text-[#022c22]">{alertItem.date}</span>
                            </div>
                            
                            <p className="mt-2 text-xs font-semibold leading-relaxed text-emerald-800">
                              {alertItem.message}
                            </p>

                            <div className="pt-2 border-t border-emerald-50 mt-2 flex items-center justify-between text-[10px] text-[#022c22]">
                              <span>Receiver queue: <span className="font-black">9,842 Active farmers</span></span>
                              <span className="text-lime-700 font-extrabold flex items-center">
                                <CheckCircle className="w-3.5 h-3.5 mr-0.5" /> Direct Push OK
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                  </div>

                </div>
              )}

              {/* ====================================================
                  TAB G: REPORTS & ANALYTICS CHIPS (LINE CHERTS)
                 ==================================================== */}
              {activeTab === 'analytics' && (
                <div id="admin-viewport-analytics" className="bg-white border border-emerald-100 rounded-3xl p-6 lg:p-8 shadow-sm space-y-8">
                  
                  <div className="pb-4 border-b border-emerald-100">
                    <h3 className="text-xl font-black text-[#022c22]">KrishiMitra analytics reporting suite</h3>
                    <p className="text-xs text-emerald-805 font-bold uppercase tracking-wider block mt-0.5">
                      Assess regional yield expectations, crop coverage distributions, and demographic trends
                    </p>
                  </div>

                  {/* Analytic graph representations */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 font-semibold text-xs leading-normal">
                    
                    {/* Line area chart */}
                    <div className="lg:col-span-8 border border-emerald-100 p-5 rounded-2xl bg-white shadow-inner flex flex-col justify-between">
                      <div className="pb-3 border-b border-emerald-50 mb-4 text-emerald-950">
                        <span className="uppercase text-[9px] tracking-widest text-[#022c22] block font-black">Demographics telemetry</span>
                        <span className="font-black text-sm block">Progressive Farmer registrations & activity trends</span>
                      </div>

                      <div className="h-72">
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={farmerEnrollmentData}>
                            <defs>
                              <linearGradient id="regGrad" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
                                <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                              </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                            <XAxis dataKey="month" stroke="#64748b" fontSize={11} />
                            <YAxis stroke="#64748b" fontSize={11} />
                            <Tooltip />
                            <Area type="monotone" dataKey="registered" stroke="#10b981" fillOpacity={1} fill="url(#regGrad)" strokeWidth={2} name="Total Registered" />
                            <Area type="monotone" dataKey="active" stroke="#3b82f6" fillOpacity={0} strokeWidth={2} name="Monthly Active Sessions" />
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>
                    </div>

                    {/* Pie Chart display info */}
                    <div className="lg:col-span-4 border border-emerald-100 p-5 rounded-2xl bg-white shadow-inner flex flex-col justify-between">
                      <div className="pb-3 border-b border-emerald-50 mb-2 text-emerald-950">
                        <span className="uppercase text-[9px] tracking-widest text-[#022c22] block font-black">Crop Diversity</span>
                        <span className="font-black text-sm block">Managed crop coverage share</span>
                      </div>

                      <div className="h-56 relative flex items-center justify-center">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={cropShareData}
                              cx="50%"
                              cy="50%"
                              innerRadius={50}
                              outerRadius={75}
                              paddingAngle={4}
                              dataKey="value"
                            >
                              {cropShareData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                              ))}
                            </Pie>
                            <Tooltip />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>

                      <div className="space-y-1 bg-emerald-50/35 p-3 rounded-xl border border-emerald-50 text-[10px] leading-relaxed">
                        {cropShareData.map((d, i) => (
                          <div key={d.name} className="flex items-center justify-between font-black">
                            <span className="flex items-center">
                              <span className="w-2.5 h-2.5 rounded-full mr-1.5 shrink-0" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                              {d.name}
                            </span>
                            <span>{d.value} Acres</span>
                          </div>
                        ))}
                      </div>
                    </div>

                  </div>

                  {/* Second analytics row: Bar chart regional yield details */}
                  <div className="border border-emerald-100 p-5 rounded-2xl bg-white shadow-inner flex flex-col justify-between text-emerald-950 font-bold leading-normal">
                    <div className="pb-3 border-b border-emerald-50 mb-4">
                      <span className="uppercase text-[9px] tracking-widest text-[#022c22] block font-black">Yield analytics map</span>
                      <span className="font-black text-sm block">Expected yield capacities (Quintals per acre) across primary agrarian hub regions</span>
                    </div>

                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={regionalYieldData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                          <XAxis dataKey="region" stroke="#64748b" fontSize={11} />
                          <YAxis stroke="#64748b" fontSize={11} />
                          <Tooltip />
                          <Legend />
                          <Bar dataKey="Soybean" fill="#10b981" radius={[4, 4, 0, 0]} name="Soybean Yield Protocol" />
                          <Bar dataKey="Cotton" fill="#024e3a" radius={[4, 4, 0, 0]} name="Cotton Yield Protocol" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                </div>
              )}

              {/* ====================================================
                  TAB H: SYSTEM AUDIT LOGS TIMELINE
                 ==================================================== */}
              {activeTab === 'audit_logs' && (
                <div id="admin-viewport-audit" className="bg-white border border-emerald-100 rounded-3xl p-6 lg:p-8 shadow-sm space-y-6">
                  
                  <div className="pb-4 border-b border-emerald-50 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                      <h3 className="text-xl font-black text-[#022c22]">Security Audit & Operations Log</h3>
                      <p className="text-xs text-emerald-805 font-bold uppercase tracking-wider block mt-0.5">
                        Historical telemetry registry containing system updates, operator adjustments and cron activities
                      </p>
                    </div>

                    <button
                      onClick={() => {
                        setAuditLogs([
                          { timestamp: new Date().toTimeString().split(' ')[0], author: 'Security Agent', event: 'Cleared log audit checkpoints trace routine (Manual Override)', severity: 'info' },
                          ...auditLogs
                        ]);
                        alert('System logs successfully updated.');
                      }}
                      className="bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-150 py-2.5 px-4 rounded-xl text-xs font-black uppercase transition shrink-0"
                    >
                      Audit Checkpoints Sync
                    </button>
                  </div>

                  {/* Search query log filter */}
                  <div className="relative font-bold">
                    <input
                      type="text"
                      placeholder="Search log triggers, operators, author names..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full bg-slate-50 border border-emerald-200 rounded-xl py-3 pl-10 pr-4 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500/40 text-emerald-950"
                    />
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-emerald-700" />
                  </div>

                  {/* Audit Logs full flow layout */}
                  <div className="space-y-4 font-bold text-xs">
                    {auditLogs
                      .filter(l => l.event.toLowerCase().includes(searchQuery.toLowerCase()) || l.author.toLowerCase().includes(searchQuery.toLowerCase()))
                      .map((log, index) => (
                        <div
                          key={index}
                          className="p-4 rounded-2xl border border-emerald-100/50 bg-[#F4F8F4] flex items-start space-x-4 hover:border-emerald-300 transition"
                        >
                          <div className="font-mono text-[10px] text-emerald-700 bg-emerald-50 px-2 py-1 rounded-md shrink-0 border border-emerald-100">
                            {log.timestamp}
                          </div>

                          <div className="flex-grow space-y-1">
                            <div className="flex items-center space-x-2">
                              <span className="font-black text-sm text-emerald-950">{log.author}</span>
                              <span className={`w-2 h-2 rounded-full ${
                                log.severity === 'success' ? 'bg-lime-500' : log.severity === 'warning' ? 'bg-amber-500' : 'bg-sky-500'
                              }`} />
                              <span className="text-[9px] uppercase tracking-wider font-extrabold text-slate-400">
                                Segment Audit
                              </span>
                            </div>
                            <p className="text-emerald-850 font-semibold leading-relaxed">
                              {log.event}
                            </p>
                          </div>

                          <div className="text-[10px] text-slate-400 font-extrabold flex items-center bg-white px-2 py-1 rounded shadow-sm">
                            <FileCheck className="w-3.5 h-3.5 text-lime-600 mr-1" /> Checked System OK
                          </div>
                        </div>
                      ))}
                  </div>

                </div>
              )}

              {/* ====================================================
                  TAB I: OPERATOR SYSTEM SETTINGS MODULE
                 ==================================================== */}
              {activeTab === 'settings' && (
                <div id="admin-viewport-settings" className="bg-white border border-emerald-100 rounded-3xl p-6 lg:p-8 shadow-sm space-y-8">
                  
                  <div className="pb-4 border-b border-emerald-55">
                    <h3 className="text-xl font-black text-[#022c22]">Administrative system Configuration settings</h3>
                    <p className="text-xs text-emerald-805 font-bold uppercase tracking-wider block mt-0.5">
                      Configure active service limits, satellite diagnostics models, and SMS alert pipelines
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 font-semibold text-xs leading-relaxed text-emerald-950">
                    
                    {/* Settings card col 1 */}
                    <div className="space-y-6 border border-emerald-50 p-6 rounded-2xl bg-[#fbfdfa]">
                      <h4 className="text-sm font-black uppercase text-[#022c22] border-b border-emerald-100 pb-2">Active farmer API parameters</h4>

                      {/* sms pipeline */}
                      <div className="flex items-center justify-between py-2">
                        <div>
                          <span className="font-black text-emerald-950 text-sm block">Cellular SMS fast pipeline dispatch</span>
                          <span className="text-slate-500 text-[11px] block pr-4">Sends storm alerts, pest outbreaks, and price triggers to farmer mobile devices automatically.</span>
                        </div>
                        <button
                          onClick={() => handleSettingToggle('smsAlertsEnabled')}
                          className={`w-14 h-8 rounded-full transition-all relative p-1 shrink-0 ${
                            settings.smsAlertsEnabled ? 'bg-lime-500' : 'bg-slate-350 bg-slate-400'
                          }`}
                        >
                          <div className={`w-6 h-6 bg-white rounded-full shadow-md transition-transform ${
                            settings.smsAlertsEnabled ? 'translate-x-6' : 'translate-x-0'
                          }`} />
                        </button>
                      </div>

                      {/* Weather refresh interval slider */}
                      <div className="space-y-2.5 pt-4 border-t border-emerald-50">
                        <div className="flex items-center justify-between">
                          <span className="font-black text-sm text-emerald-950 block">Meteo satellite weather synch interval</span>
                          <span className="font-mono font-black text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded border border-emerald-100">{settings.satelliteWeatherRefreshSec / 60} minutes</span>
                        </div>
                        <input
                          type="range"
                          min="300"
                          max="7200"
                          step="300"
                          value={settings.satelliteWeatherRefreshSec}
                          onChange={(e) => handleSettingChange('satelliteWeatherRefreshSec', parseInt(e.target.value))}
                          className="w-full accent-emerald-600 cursor-pointer"
                        />
                        <span className="text-slate-500 text-[10px] block font-bold leading-normal">Configures how frequently the server fetches radar weather projections from regional forecast grids.</span>
                      </div>

                      {/* APMC feed synch slider */}
                      <div className="space-y-2.5 pt-4 border-t border-emerald-50">
                        <div className="flex items-center justify-between">
                          <span className="font-black text-sm text-emerald-950 block">APMC mandi price indexing routine interval</span>
                          <span className="font-mono font-black text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded border border-emerald-100">{settings.apmcFeedSyncIntervalHours} hours</span>
                        </div>
                        <input
                          type="range"
                          min="1"
                          max="24"
                          step="1"
                          value={settings.apmcFeedSyncIntervalHours}
                          onChange={(e) => handleSettingChange('apmcFeedSyncIntervalHours', parseInt(e.target.value))}
                          className="w-full accent-emerald-600 cursor-pointer"
                        />
                        <span className="text-slate-500 text-[10px] block font-bold leading-normal">Configures the batch background scheduler updating the APMC daily crop trade feeds.</span>
                      </div>

                    </div>

                    {/* Settings card col 2 */}
                    <div className="space-y-6 border border-emerald-50 p-6 rounded-2xl bg-[#fbfdfa]">
                      <h4 className="text-sm font-black uppercase text-[#022c22] border-b border-emerald-100 pb-2">AI diagnostics model thresholds</h4>

                      {/* ai diagnostics slider */}
                      <div className="space-y-2.5">
                        <div className="flex items-center justify-between">
                          <span className="font-black text-sm text-emerald-950 block">Leaf disease diagnostics match confidence</span>
                          <span className="font-mono font-black text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded border border-emerald-100">{settings.aiModelConfidenceThreshold}% Matching</span>
                        </div>
                        <input
                          type="range"
                          min="50"
                          max="95"
                          step="5"
                          value={settings.aiModelConfidenceThreshold}
                          onChange={(e) => handleSettingChange('aiModelConfidenceThreshold', parseInt(e.target.value))}
                          className="w-full accent-emerald-600 cursor-pointer"
                        />
                        <span className="text-slate-500 text-[10px] block font-bold leading-normal">Minimum confidence metric required before a leaf condition report is flagged as high-risk automatically.</span>
                      </div>

                      {/* maintenance mode */}
                      <div className="flex items-center justify-between pt-6 border-t border-emerald-50">
                        <div>
                          <span className="font-black text-sm text-emerald-950 block">Client maintenance mode lock</span>
                          <span className="text-slate-500 text-[11px] block pr-4">Toggles administrative portal lock mode. Restricts new registrants.</span>
                        </div>
                        <button
                          onClick={() => handleSettingToggle('maintenanceMode')}
                          className={`w-14 h-8 rounded-full transition-all relative p-1 shrink-0 ${
                            settings.maintenanceMode ? 'bg-[#ef4444]' : 'bg-slate-350 bg-slate-400'
                          }`}
                        >
                          <div className={`w-6 h-6 bg-white rounded-full shadow-md transition-transform ${
                            settings.maintenanceMode ? 'translate-x-6' : 'translate-x-0'
                          }`} />
                        </button>
                      </div>

                      {/* Save alert settings override */}
                      <div className="pt-6 border-t border-emerald-50">
                        <button
                          onClick={() => {
                            alert('All KrishiMitra administrative system config profiles successfully saved and synchronized across active server clusters.');
                            setAuditLogs([
                              { timestamp: new Date().toTimeString().split(' ')[0], author: 'Admin (Pranati)', event: 'Committed whole system settings changes to the database clusters', severity: 'success' },
                              ...auditLogs
                            ]);
                          }}
                          className="w-full bg-[#022c22] hover:bg-[#011a14] text-white py-3.5 rounded-xl font-black text-xs uppercase shadow-sm tracking-widest transition flex items-center justify-center space-x-2"
                        >
                          <Save className="w-4 h-4 text-emerald-400" />
                          <span>Commit Configuration Changes</span>
                        </button>
                      </div>

                    </div>

                  </div>

                </div>
              )}

            </motion.div>
          </AnimatePresence>

        </div>

      </main>

      {/* ====================================================
          UNIVERSAL MODAL FORM (ADD/EDIT FARMER, CROP, PRICE, SCHEME)
         ==================================================== */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 bg-[#011a14]/60 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white border border-emerald-100 rounded-3xl shadow-xl w-full max-w-lg overflow-hidden max-h-[90vh] flex flex-col"
            >
              {/* Header */}
              <div className="bg-[#022c22] text-white p-5 flex items-center justify-between shrink-0">
                <h4 className="text-lg font-black font-sans uppercase tracking-tight">
                  {editingItem ? 'Adjust existing parameter details' : 'Configure and enrollment details metadata'}
                </h4>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="p-1 hover:bg-emerald-800 rounded-xl text-emerald-300 hover:text-white transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Form viewport */}
              <form onSubmit={editingItem ? handleSaveEdit : handleSaveAdd} className="p-6 overflow-y-auto space-y-4 text-xs font-bold text-emerald-950 text-emerald-900 leading-normal">
                
                {/* 1. Form fields for FARMER */}
                {activeTab === 'farmers' && (
                  <div className="space-y-4">
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase text-emerald-800 font-black">Full Sowing Farmer Name</label>
                      <input
                        type="text"
                        className="w-full bg-slate-50 border border-emerald-250 rounded-xl px-3 py-2.5 text-xs font-semibold focus:outline-none"
                        required
                        value={farmerForm.name}
                        onChange={(e) => setFarmerForm({ ...farmerForm, name: e.target.value })}
                        placeholder="e.g. Namdev Patil"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] uppercase text-emerald-800 font-black">Mobile Contacts</label>
                      <input
                        type="tel"
                        maxLength={10}
                        className="w-full bg-slate-50 border border-emerald-250 rounded-xl px-3 py-2.5 text-xs font-semibold focus:outline-none"
                        required
                        value={farmerForm.mobile}
                        onChange={(e) => setFarmerForm({ ...farmerForm, mobile: e.target.value })}
                        placeholder="e.g. 9822001144"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1 col-span-1">
                        <label className="text-[10px] uppercase text-emerald-800 font-black">Village Location</label>
                        <input
                          type="text"
                          className="w-full bg-slate-50 border border-emerald-250 rounded-xl px-3 py-2.5 text-xs font-semibold focus:outline-none"
                          required
                          value={farmerForm.village}
                          onChange={(e) => setFarmerForm({ ...farmerForm, village: e.target.value })}
                          placeholder="e.g. Shirasgaon"
                        />
                      </div>
                      <div className="space-y-1 col-span-1">
                        <label className="text-[10px] uppercase text-emerald-800 font-black">District Location</label>
                        <input
                          type="text"
                          className="w-full bg-slate-50 border border-emerald-250 rounded-xl px-3 py-2.5 text-xs font-semibold focus:outline-none"
                          required
                          value={farmerForm.district}
                          onChange={(e) => setFarmerForm({ ...farmerForm, district: e.target.value })}
                          placeholder="e.g. Nagpur"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1 col-span-1">
                        <label className="text-[10px] uppercase text-emerald-800 font-black">Soil Type suitability</label>
                        <select
                          className="w-full bg-white border border-emerald-250 rounded-xl px-3 py-2.5 text-xs font-bold"
                          value={farmerForm.soilType}
                          onChange={(e) => setFarmerForm({ ...farmerForm, soilType: e.target.value })}
                        >
                          <option value="Black Soil">Black Soil</option>
                          <option value="Red Soil">Red Soil</option>
                          <option value="Sandy Soil">Sandy Soil</option>
                          <option value="Loamy Soil">Loamy Soil</option>
                        </select>
                      </div>
                      <div className="space-y-1 col-span-1">
                        <label className="text-[10px] uppercase text-emerald-800 font-black">Sowing Crop</label>
                        <input
                          type="text"
                          className="w-full bg-slate-50 border border-emerald-250 rounded-xl px-3 py-2.5 text-xs font-semibold focus:outline-none"
                          required
                          value={farmerForm.crop}
                          onChange={(e) => setFarmerForm({ ...farmerForm, crop: e.target.value })}
                          placeholder="e.g. Soybean"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] uppercase text-emerald-800 font-black">Account registry Status</label>
                      <select
                        className="w-full bg-white border border-emerald-250 rounded-xl px-3 py-2.5 text-xs font-bold"
                        value={farmerForm.status}
                        onChange={(e) => setFarmerForm({ ...farmerForm, status: e.target.value })}
                      >
                        <option value="Active">Active Verified</option>
                        <option value="Pending">Pending Audit</option>
                        <option value="Suspended">Suspended Holder</option>
                      </select>
                    </div>
                  </div>
                )}

                {/* 2. Form fields for CROPS */}
                {activeTab === 'crops' && (
                  <div className="space-y-4">
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase text-emerald-800 font-black">Managed Crop Species name</label>
                      <input
                        type="text"
                        className="w-full bg-slate-50 border border-emerald-250 rounded-xl px-3 py-2.5 text-xs font-semibold focus:outline-none"
                        required
                        value={cropForm.name}
                        onChange={(e) => setCropForm({ ...cropForm, name: e.target.value })}
                        placeholder="e.g. Pigeon Pea (Tur)"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1 col-span-1">
                        <label className="text-[10px] uppercase text-emerald-800 font-black">Sowing Season Mode</label>
                        <select
                          className="w-full bg-white border border-emerald-250 rounded-xl px-3 py-2.5 text-xs font-bold"
                          value={cropForm.season}
                          onChange={(e) => setCropForm({ ...cropForm, season: e.target.value })}
                        >
                          <option value="Kharif">Kharif (Monsoon)</option>
                          <option value="Rabi">Rabi (Winter)</option>
                          <option value="Zaid">Zaid (Summer)</option>
                          <option value="Annual">Annual (Year-Long)</option>
                        </select>
                      </div>
                      <div className="space-y-1 col-span-1">
                        <label className="text-[10px] uppercase text-emerald-800 font-black">Soil suitability Fit</label>
                        <select
                          className="w-full bg-white border border-emerald-250 rounded-xl px-3 py-2.5 text-xs font-bold"
                          value={cropForm.soilType}
                          onChange={(e) => setCropForm({ ...cropForm, soilType: e.target.value })}
                        >
                          <option value="Black Soil">Black Soil</option>
                          <option value="Red Soil">Red Soil</option>
                          <option value="Sandy Soil">Sandy Soil</option>
                          <option value="Loamy Soil">Loamy Soil</option>
                          <option value="Clayey Soil">Clayey Soil</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1 col-span-1">
                        <label className="text-[10px] uppercase text-emerald-800 font-black">Expected Yield capacity</label>
                        <input
                          type="text"
                          className="w-full bg-slate-50 border border-emerald-250 rounded-xl px-3 py-2.5 text-xs font-semibold focus:outline-none"
                          required
                          value={cropForm.baseYield}
                          onChange={(e) => setCropForm({ ...cropForm, baseYield: e.target.value })}
                          placeholder="e.g. 10-12 q/acre"
                        />
                      </div>
                      <div className="space-y-1 col-span-1">
                        <label className="text-[10px] uppercase text-emerald-800 font-black">Water overhead Demand</label>
                        <select
                          className="w-full bg-white border border-emerald-250 rounded-xl px-3 py-2.5 text-xs font-bold"
                          value={cropForm.waterReq}
                          onChange={(e) => setCropForm({ ...cropForm, waterReq: e.target.value })}
                        >
                          <option value="Low">Low</option>
                          <option value="Medium">Medium</option>
                          <option value="High">High</option>
                          <option value="Very High">Very High</option>
                        </select>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] uppercase text-emerald-800 font-black">Baseline Mandi market Rate Index</label>
                      <input
                        type="text"
                        className="w-full bg-slate-50 border border-emerald-250 rounded-xl px-3 py-2.5 text-xs font-semibold focus:outline-none"
                        required
                        value={cropForm.priceIndex}
                        onChange={(e) => setCropForm({ ...cropForm, priceIndex: e.target.value })}
                        placeholder="e.g. ₹5,800/q"
                      />
                    </div>
                  </div>
                )}

                {/* 3. Form fields for MARKET PRICES */}
                {activeTab === 'market_prices' && (
                  <div className="space-y-4">
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase text-emerald-800 font-black">Trading Crop Name</label>
                      <input
                        type="text"
                        className="w-full bg-slate-50 border border-emerald-250 rounded-xl px-3 py-2.5 text-xs font-semibold focus:outline-none"
                        required
                        value={marketForm.crop}
                        onChange={(e) => setMarketForm({ ...marketForm, crop: e.target.value })}
                        placeholder="e.g. Green Gram"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] uppercase text-emerald-800 font-black">APMC Mandi Branch Center Location</label>
                      <input
                        type="text"
                        className="w-full bg-slate-50 border border-emerald-250 rounded-xl px-3 py-2.5 text-xs font-semibold focus:outline-none"
                        required
                        value={marketForm.market}
                        onChange={(e) => setMarketForm({ ...marketForm, market: e.target.value })}
                        placeholder="e.g. Akola APMC"
                      />
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                      <div className="space-y-1 font-mono">
                        <label className="text-[9px] uppercase text-emerald-800 font-black">Daily Min (q)</label>
                        <input
                          type="number"
                          className="w-full bg-slate-50 border border-emerald-250 rounded-xl px-2.5 py-2 text-xs font-semibold focus:outline-none font-bold"
                          required
                          value={marketForm.minPrice}
                          onChange={(e) => setMarketForm({ ...marketForm, minPrice: parseInt(e.target.value) || 0 })}
                        />
                      </div>
                      <div className="space-y-1 font-mono">
                        <label className="text-[9px] uppercase text-emerald-800 font-black">Daily Max (q)</label>
                        <input
                          type="number"
                          className="w-full bg-slate-50 border border-emerald-250 rounded-xl px-2.5 py-2 text-xs font-semibold focus:outline-none font-bold"
                          required
                          value={marketForm.maxPrice}
                          onChange={(e) => setMarketForm({ ...marketForm, maxPrice: parseInt(e.target.value) || 0 })}
                        />
                      </div>
                      <div className="space-y-1 font-mono">
                        <label className="text-[9px] uppercase text-emerald-800 font-black">Mid index (q)</label>
                        <input
                          type="number"
                          className="w-full bg-slate-50 border border-emerald-250 rounded-xl px-2.5 py-2 text-xs font-semibold focus:outline-none font-black text-emerald-700"
                          required
                          value={marketForm.currentPrice}
                          onChange={(e) => setMarketForm({ ...marketForm, currentPrice: parseInt(e.target.value) || 0 })}
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] uppercase text-emerald-800 font-black">Trading dynamic trend direction</label>
                      <select
                        className="w-full bg-white border border-emerald-250 rounded-xl px-3 py-2.5 text-xs font-bold"
                        value={marketForm.trend}
                        onChange={(e) => setMarketForm({ ...marketForm, trend: e.target.value })}
                      >
                        <option value="up">▲ Upward surge trend (Bullish)</option>
                        <option value="down">▼ Downward correction shift (Bearish)</option>
                        <option value="stable">● Flat Stable scale (Neutral)</option>
                      </select>
                    </div>
                  </div>
                )}

                {/* 4. Form fields for GOVERNMENT SCHEMES */}
                {activeTab === 'schemes' && (
                  <div className="space-y-4">
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase text-emerald-800 font-black">Scheme Name Title</label>
                      <input
                        type="text"
                        className="w-full bg-slate-50 border border-emerald-250 rounded-xl px-3 py-2.5 text-xs font-semibold focus:outline-none"
                        required
                        value={schemeForm.title}
                        onChange={(e) => setSchemeForm({ ...schemeForm, title: e.target.value })}
                        placeholder="e.g. PM Agri Infrastructure Fund"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] uppercase text-emerald-800 font-black">Benefits Matrix</label>
                      <input
                        type="text"
                        className="w-full bg-slate-50 border border-emerald-250 rounded-xl px-3 py-2.5 text-xs font-semibold focus:outline-none"
                        required
                        value={schemeForm.benefit}
                        onChange={(e) => setSchemeForm({ ...schemeForm, benefit: e.target.value })}
                        placeholder="e.g. 3% interest subvent loan support"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] uppercase text-emerald-800 font-black">Eligibility Requirements</label>
                      <input
                        type="text"
                        className="w-full bg-slate-50 border border-emerald-250 rounded-xl px-3 py-2.5 text-xs font-semibold focus:outline-none"
                        required
                        value={schemeForm.eligibility}
                        onChange={(e) => setSchemeForm({ ...schemeForm, eligibility: e.target.value })}
                        placeholder="e.g. Agri-tech startup groups, FPOs"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1 col-span-1">
                        <label className="text-[10px] uppercase text-emerald-800 font-black">Ministry Category</label>
                        <input
                          type="text"
                          className="w-full bg-slate-50 border border-emerald-250 rounded-xl px-3 py-2.5 text-xs font-semibold focus:outline-none"
                          required
                          value={schemeForm.category}
                          onChange={(e) => setSchemeForm({ ...schemeForm, category: e.target.value })}
                          placeholder="e.g. Infrastructure"
                        />
                      </div>
                      <div className="space-y-1 col-span-1">
                        <label className="text-[10px] uppercase text-emerald-800 font-black">Schedules active Status</label>
                        <select
                          className="w-full bg-white border border-emerald-250 rounded-xl px-3 py-2.5 text-xs font-bold"
                          value={schemeForm.status}
                          onChange={(e) => setSchemeForm({ ...schemeForm, status: e.target.value })}
                        >
                          <option value="Active">Active Published</option>
                          <option value="Inactive">Suspended Archive</option>
                        </select>
                      </div>
                    </div>
                  </div>
                )}

                {/* Submits and CTA controls */}
                <div className="pt-4 border-t border-emerald-100 flex items-center justify-end space-x-3 shrink-0">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="p-3 bg-slate-50 hover:bg-slate-100 text-slate-700/80 rounded-xl border border-slate-205 transition uppercase tracking-wider text-[11px]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="p-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow shadow-emerald-600/10 transition uppercase tracking-wider text-[11px]"
                  >
                    {editingItem ? 'Adjust settings parameters' : 'Confirm configure parameters'}
                  </button>
                </div>

              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
