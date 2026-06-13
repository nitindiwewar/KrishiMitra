import React, { useEffect, useState } from 'react';
import { HashRouter, Routes, Route, useLocation } from 'react-router-dom';

// Import Layout Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Loader from './components/Loader';

// Import Pages
import Home from './pages/Home';
import CropRecommendation from './pages/CropRecommendation';
import DiseaseDetection from './pages/DiseaseDetection';
import WeatherDashboard from './pages/WeatherDashboard';
import MarketPrices from './pages/MarketPrices';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import AdminDashboard from './pages/AdminDashboard';

// Scroll Restoration helper component
function ScrollToTop() {
  const { pathname, search } = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(search);
    const scrollToId = params.get('scrollTo');
    if (scrollToId) {
      setTimeout(() => {
        const element = document.getElementById(scrollToId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 150);
    } else {
      window.scrollTo({ top: 0, behavior: 'instant' });
    }
  }, [pathname, search]);

  return null;
}

// Inner App with Routing Context for Location Checks
function AppContent() {
  const location = useLocation();
  const [initialLoading, setInitialLoading] = useState(true);

  // Check if current page is the Dashboard workspace or administrative workspace to hide guest headers/footers
  const isDashboardRoute = location.pathname.startsWith('/dashboard') || location.pathname.startsWith('/admin');

  if (initialLoading) {
    return <Loader onComplete={() => setInitialLoading(false)} />;
  }

  return (
    <div
      id="krishimitra-app"
      className={`min-h-screen flex flex-col justify-between font-sans antialiased text-emerald-950 bg-[#fcfdfa] ${
        isDashboardRoute ? 'bg-[#f8faf6]' : ''
      }`}
    >
      {/* Hide guest navbar inside the dedicated Dashboard */}
      {!isDashboardRoute && <Navbar />}

      {/* Core application viewports */}
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/crop-recommendation" element={<CropRecommendation />} />
          <Route path="/disease-detection" element={<DiseaseDetection />} />
          <Route path="/weather" element={<WeatherDashboard />} />
          <Route path="/market-prices" element={<MarketPrices />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/admin" element={<AdminDashboard />} />
          
          {/* Fallback route */}
          <Route path="*" element={<Home />} />
        </Routes>
      </main>

      {/* Hide guest footer inside the dedicated Dashboard */}
      {!isDashboardRoute && <Footer />}
    </div>
  );
}

export default function App() {
  return (
    <HashRouter>
      <ScrollToTop />
      <AppContent />
    </HashRouter>
  );
}
