import React, { useState, useEffect } from 'react';
import { NavLink, Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Leaf, Globe, ChevronDown, UserPlus } from 'lucide-react';
import { useTranslation } from '../lib/translations';

export default function Navbar() {
  const { t, lang: currentLang, setLang: setCurrentLang } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  
  const location = useLocation();
  const navigate = useNavigate();

  // Languages data
  const languages = [
    { code: 'en', label: 'English', flag: '🇬🇧' },
    { code: 'hi', label: 'Hindi', flag: '🇮🇳' },
    { code: 'mr', label: 'Marathi', flag: '🇮🇳' }
  ];

  // Scroll handler for glassmorphism styling
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 15) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Sync auth status and language setup
  const checkAuth = () => {
    const userStored = localStorage.getItem('krishimitra_user');
    setIsLoggedIn(!!userStored);
  };

  useEffect(() => {
    checkAuth();
    window.addEventListener('auth_updated', checkAuth);
    
    const savedLang = localStorage.getItem('krishimitra_lang') || 'en';
    setCurrentLang(savedLang);

    return () => {
      window.removeEventListener('auth_updated', checkAuth);
    };
  }, []);

  // Close mobile drawer on route changes
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  const handleLanguageChange = (code: string, label: string) => {
    setCurrentLang(code);
    localStorage.setItem('krishimitra_lang', code);
    setLangDropdownOpen(false);
    
    // Dispatch custom event so dynamic page sections can immediately adapt
    window.dispatchEvent(new Event('krishimitra_lang_changed'));
  };

  const navItems = [
    { name: t('navHome'), path: '/' },
    { name: t('navFeatures'), path: '/?scrollTo=features' },
    { name: t('navDashboard'), path: '/dashboard' },
    { name: t('navCrops'), path: '/crop-recommendation' },
    { name: t('navWeather'), path: '/weather' },
    { name: t('navMarket'), path: '/market-prices' },
    { name: t('navContact'), path: '/?scrollTo=main-footer' },
  ];

  // Smart active checker for custom home-anchors & regular pages
  const isItemActive = (path: string) => {
    if (path.includes('?scrollTo=')) {
      const scrollTarget = path.split('?scrollTo=')[1];
      return location.search.includes(`scrollTo=${scrollTarget}`);
    }
    if (path === '/') {
      return location.pathname === '/' && !location.search.includes('scrollTo');
    }
    const pathBase = path.split('?')[0];
    return location.pathname === pathBase;
  };

  const handleItemClick = (e: React.MouseEvent, path: string) => {
    if (path.includes('?scrollTo=') && (location.pathname === '/' || location.pathname === '')) {
      const id = path.split('?scrollTo=')[1];
      const element = document.getElementById(id);
      if (element) {
        e.preventDefault();
        element.scrollIntoView({ behavior: 'smooth' });
        navigate(path);
        setIsOpen(false);
      }
    } else {
      setIsOpen(false);
    }
  };

  return (
    <nav
      id="main-navbar"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-350 ${
        scrolled
          ? 'bg-white/80 backdrop-blur-md shadow-md shadow-emerald-950/2 border-b border-emerald-100/40 py-2'
          : 'bg-white/45 backdrop-blur-sm border-b border-transparent py-3.5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-5 xl:px-6">
        <div className="flex items-center justify-between h-14">
          
          {/* Logo Brand - Left */}
          <div className="flex-shrink-0">
            <Link
              to="/"
              className="flex items-center space-x-1.5 text-xl xl:text-3xl font-black text-emerald-950 tracking-tight"
            >
              <div className="p-2 bg-emerald-600 rounded-xl shadow-md text-white">
                <Leaf className="w-5 h-5 fill-white/10" />
              </div>
              <span className="font-sans leading-none">
                Krishi<span className="text-emerald-600">Mitra</span>
              </span>
            </Link>
          </div>

          {/* Desktop Single-Row Navigation - Center */}
          <div className="hidden lg:flex items-center space-x-1 bg-emerald-50/40 border border-emerald-100/40 p-1 rounded-full shrink-0 flex-nowrap overflow-x-visible">
            {navItems.map((item) => {
              const active = isItemActive(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={(e) => handleItemClick(e, item.path)}
                  className={`px-3 py-2 rounded-full text-[13px] xl:text-[14.5px] font-extrabold whitespace-nowrap tracking-wide leading-none transition-all duration-150 ${
                    active
                      ? 'bg-emerald-650 text-white shadow-xs shadow-emerald-655/10 scale-[1.01]'
                      : 'text-emerald-950 hover:text-emerald-700 hover:bg-emerald-100/50'
                  }`}
                >
                  {item.name}
                </Link>
              );
            })}
          </div>

          {/* Action buttons & Language Switcher - Right */}
          <div className="hidden lg:flex items-center space-x-2 shrink-0 flex-nowrap">
            
            {/* Language Switcher Dropdown */}
            <div className="relative">
              <button
                id="nav-language-switcher-btn"
                onClick={() => setLangDropdownOpen(!langDropdownOpen)}
                className="flex items-center space-x-1.5 px-3 py-2 rounded-full border border-emerald-250 hover:border-emerald-400 bg-white/70 text-emerald-950 text-[12.5px] xl:text-sm font-extrabold leading-none cursor-pointer transition duration-150 hover:bg-emerald-50/40"
              >
                <Globe className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="whitespace-nowrap">
                  {languages.find(l => l.code === currentLang)?.flag}{' '}
                  {languages.find(l => l.code === currentLang)?.label}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-emerald-600/70 shrink-0" />
              </button>

              {langDropdownOpen && (
                <div className="absolute right-0 mt-2 w-32 bg-white/95 backdrop-blur-md border border-emerald-150 rounded-2xl shadow-xl z-50 p-1 py-1.5 animate-fade-in divide-y divide-emerald-50">
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      id={`lang-select-${lang.code}`}
                      onClick={() => handleLanguageChange(lang.code, lang.label)}
                      className={`w-full flex items-center space-x-2 px-3 py-2 text-[12px] xl:text-xs font-bold rounded-xl text-left transition ${
                        currentLang === lang.code
                          ? 'bg-emerald-50 text-emerald-950 font-black'
                          : 'text-emerald-900 hover:bg-emerald-50/50'
                      }`}
                    >
                      <span className="text-sm leading-none">{lang.flag}</span>
                      <span>{lang.label}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {isLoggedIn ? (
              <Link
                to="/dashboard"
                id="nav-go-dashboard-btn"
                className="px-4 py-2.5 text-xs xl:text-sm font-black text-white bg-emerald-650 hover:bg-emerald-750 rounded-full shadow-md shadow-emerald-650/10 uppercase tracking-widest whitespace-nowrap transition-all duration-250 hover:-translate-y-0.5"
              >
                Dashboard
              </Link>
            ) : (
              <div className="flex items-center space-x-2 flex-nowrap">
                <Link
                  to="/login"
                  id="nav-login-btn"
                  className="px-4 py-2 text-[13px] xl:text-[14px] font-extrabold text-emerald-900 border border-emerald-150 hover:border-emerald-400 rounded-full hover:bg-white/45 whitespace-nowrap transition-all duration-200"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  id="nav-register-btn"
                  className="flex items-center space-x-1 px-4.5 py-2 text-[13px] xl:text-[14px] font-black text-white bg-gradient-to-r from-emerald-600 to-green-500 hover:from-emerald-700 hover:to-green-600 rounded-full shadow-md shadow-emerald-600/15 hover:shadow-lg hover:shadow-emerald-600/25 whitespace-nowrap transition-all duration-200 hover:-translate-y-0.5 transform"
                >
                  <UserPlus className="w-4 h-4 shrink-0" />
                  <span>Register</span>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Hamburger menu */}
          <div className="lg:hidden flex items-center">
            <button
              id="mobile-nav-toggle"
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-xl text-emerald-950 hover:bg-emerald-50 hover:text-emerald-700 focus:outline-none transition-colors duration-200"
              aria-label="Toggle Menu"
            >
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      <div
        className={`lg:hidden fixed inset-x-0 top-[60px] bg-white/95 backdrop-blur-lg border-b border-emerald-100 h-[calc(100vh-60px)] overflow-y-auto transition-all duration-300 ${
          isOpen ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0 pointer-events-none'
        }`}
      >
        <div className="px-4 py-5 space-y-4 flex flex-col h-full justify-between">
          <div className="space-y-1.5 animate-fade-in">
            <p className="text-xs font-black text-emerald-800/60 uppercase tracking-widest pl-3 mb-2">
              Menu Directory
            </p>
            {navItems.map((item) => {
              const active = isItemActive(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={(e) => handleItemClick(e, item.path)}
                  className={`flex items-center px-4 py-3 rounded-2xl text-base font-bold transition-all duration-200 ${
                    active
                      ? 'bg-emerald-600 text-white shadow-md'
                      : 'text-emerald-950 hover:bg-emerald-50 hover:text-emerald-700'
                  }`}
                >
                  {item.name}
                </Link>
              );
            })}

            {/* Mobile Language Switcher segment */}
            <div className="pt-4 border-t border-emerald-50 pl-2 pr-2">
              <p className="text-xs font-black text-emerald-800/60 uppercase tracking-widest mb-2 flex items-center">
                <Globe className="w-4 h-4 mr-1.5 text-emerald-600" />
                Select Language / भाषा चुनें
              </p>
              <div className="grid grid-cols-3 gap-2">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    id={`lang-mob-select-${lang.code}`}
                    onClick={() => handleLanguageChange(lang.code, lang.label)}
                    className={`py-3 px-2 rounded-xl text-xs font-bold text-center border transition-all ${
                      currentLang === lang.code
                        ? 'border-emerald-600 bg-emerald-600 text-white shadow-sm'
                        : 'border-emerald-150 text-emerald-950 bg-emerald-50/20'
                    }`}
                  >
                    <span className="block text-lg leading-none mb-1">{lang.flag}</span>
                    <span className="block tracking-tight text-[11px] leading-tight">{lang.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Drawer buttons */}
          <div className="space-y-3 pt-4 border-t border-emerald-50 pb-16">
            {isLoggedIn ? (
              <Link
                to="/dashboard"
                id="mob-dashboard-btn"
                onClick={() => setIsOpen(false)}
                className="w-full block text-center py-4 rounded-2xl text-sm font-black text-white bg-emerald-600 hover:bg-emerald-700 hover:shadow-lg transition-all"
              >
                Go to Dashboard
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  id="mob-login-btn"
                  onClick={() => setIsOpen(false)}
                  className="w-full block text-center py-4 rounded-2xl text-sm font-bold text-emerald-950 border border-emerald-200 bg-emerald-50/50 hover:bg-emerald-50 transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  id="mob-register-btn"
                  onClick={() => setIsOpen(false)}
                  className="w-full flex items-center justify-center space-x-2 py-4 rounded-2xl text-sm font-black text-white bg-gradient-to-r from-emerald-600 to-green-500 hover:from-emerald-700 hover:to-green-600 shadow-md shadow-emerald-600/15 hover:shadow-lg transition-all"
                >
                  <UserPlus className="w-5 h-5 shrink-0" />
                  <span>Register</span>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
