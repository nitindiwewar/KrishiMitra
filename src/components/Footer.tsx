import React from 'react';
import { Link } from 'react-router-dom';
import { Leaf, Mail, Phone, MapPin, Globe, ArrowUp } from 'lucide-react';

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer id="main-footer" className="bg-emerald-950 text-white/90 border-t border-emerald-900 pt-16 pb-8 relative overflow-hidden">
      {/* Visual background leaf curves */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-emerald-800/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-emerald-700/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          
          {/* Brand and Mission */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center space-x-2 text-2xl font-black text-white tracking-tight">
              <div className="p-2 bg-emerald-600 rounded-2xl shadow-md text-white">
                <Leaf className="w-5 h-5 fill-white/15" />
              </div>
              <span className="font-sans">
                Krishi<span className="text-emerald-400">Mitra</span>
              </span>
            </Link>
            <p className="mt-4 text-emerald-100/70 text-sm leading-relaxed max-w-sm">
              KrishiMitra is a digital farming assistant helping farmers grow more with less effort using AI & modern technology.
            </p>
            <div className="mt-6 flex space-x-3">
              {['facebook', 'twitter', 'instagram', 'youtube'].map((soc) => (
                <a
                  key={soc}
                  href={`https://${soc}.com`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-xl bg-emerald-900 hover:bg-emerald-800 border border-emerald-800/60 hover:border-emerald-600 flex items-center justify-center transition-all group"
                  aria-label={soc}
                >
                  <span className="capitalize text-xs font-bold text-emerald-300 group-hover:text-emerald-100">{soc[0]}</span>
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links Column */}
          <div>
            <h4 className="border-b border-emerald-800/80 pb-2 text-sm font-extrabold text-emerald-400 uppercase tracking-widest">
              Quick Links
            </h4>
            <ul className="mt-4 space-y-2.5 text-sm font-semibold">
              <li><Link to="/" className="text-emerald-200/80 hover:text-white transition-colors">Home</Link></li>
              <li><Link to="/crop-recommendation" className="text-emerald-200/80 hover:text-white transition-colors">Recommendation</Link></li>
              <li><Link to="/disease-detection" className="text-emerald-200/80 hover:text-white transition-colors">Disease Detection</Link></li>
              <li><Link to="/weather" className="text-emerald-200/80 hover:text-white transition-colors">Weather Map</Link></li>
              <li><Link to="/market-prices" className="text-emerald-200/80 hover:text-white transition-colors">Market Rates</Link></li>
              <li><Link to="/admin" className="text-emerald-200/80 hover:text-amber-300 transition-colors flex items-center space-x-1"><span>Admin Dashboard ⚙️</span></Link></li>
            </ul>
          </div>

          {/* Government Schemes Column */}
          <div>
            <h4 className="border-b border-emerald-800/80 pb-2 text-sm font-extrabold text-emerald-400 uppercase tracking-widest">
              Agri Schemes
            </h4>
            <ul className="mt-4 space-y-2.5 text-sm font-semibold text-emerald-200/80">
              <li className="hover:text-white cursor-pointer transition-colors">PM-Kisan Samman Nidhi</li>
              <li className="hover:text-white cursor-pointer transition-colors">PM Fasal Bima Yojana</li>
              <li className="hover:text-white cursor-pointer transition-colors">Soil Health Card Portal</li>
              <li className="hover:text-white cursor-pointer transition-colors">Kisan Credit Card (KCC)</li>
              <li className="hover:text-white cursor-pointer transition-colors">National Agriculture Market (e-NAM)</li>
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h4 className="border-b border-emerald-800/80 pb-2 text-sm font-extrabold text-emerald-400 uppercase tracking-widest">
              Contact Us
            </h4>
            <ul className="mt-4 space-y-3.5 text-sm font-semibold">
              <li className="flex items-start space-x-3 text-emerald-200/80">
                <MapPin className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>Nagpur, Maharashtra, India</span>
              </li>
              <li className="flex items-center space-x-3 text-emerald-200/80">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>+91 12345 67890</span>
              </li>
              <li className="flex items-center space-x-3 text-emerald-200/80">
                <Mail className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>support@krishimitra.com</span>
              </li>
              <li className="flex items-center space-x-3 text-emerald-200/80">
                <Globe className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>www.krishimitra.com</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Separator */}
        <div className="mt-12 pt-8 border-t border-emerald-900/60 flex flex-col sm:flex-row justify-between items-center text-xs text-emerald-200/55 font-bold">
          <p>© 2026 KrishiMitra. All Rights Reserved. Designed for Indian Farmers.</p>
          <div className="flex space-x-4 mt-4 sm:mt-0">
            <span className="hover:text-emerald-200 cursor-pointer">Privacy Policy</span>
            <span>•</span>
            <span className="hover:text-emerald-200 cursor-pointer">Terms & Conditions</span>
          </div>
          <button
            onClick={scrollToTop}
            className="mt-4 sm:mt-0 bg-emerald-800 hover:bg-emerald-600 text-white p-2.5 rounded-xl transition-all shadow-md focus:outline-none focus:ring-2 focus:ring-emerald-400/50"
            aria-label="Scroll to top"
          >
            <ArrowUp className="w-4 h-4" />
          </button>
        </div>
      </div>
    </footer>
  );
}
