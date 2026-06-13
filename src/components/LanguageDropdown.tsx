import React, { useState, useEffect, useRef } from 'react';
import { Globe, ChevronDown } from 'lucide-react';
import { useTranslation } from '../lib/translations';

export default function LanguageDropdown() {
  const { lang: currentLang, setLang } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const languages = [
    { code: 'en', label: 'English', flag: '🇬🇧' },
    { code: 'hi', label: 'Hindi', flag: '🇮🇳' },
    { code: 'mr', label: 'Marathi', flag: '🇮🇳' }
  ];

  const currentLanguageObj = languages.find(l => l.code === currentLang) || languages[0];

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLanguageChange = (code: string) => {
    setLang(code);
    localStorage.setItem('krishimitra_lang', code);
    setIsOpen(false);
    window.dispatchEvent(new Event('krishimitra_lang_changed'));
  };

  return (
    <div className="relative inline-block text-left" ref={dropdownRef} id="language-dropdown-wrapper">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-black bg-white hover:bg-emerald-50 border border-emerald-200 text-emerald-950 transition shadow-sm"
      >
        <Globe className="w-4 h-4 text-emerald-600" />
        <span>{currentLanguageObj.flag} {currentLanguageObj.label}</span>
        <ChevronDown className={`w-3.5 h-3.5 text-emerald-700/70 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-40 rounded-2xl bg-white border border-emerald-150 shadow-xl z-50 overflow-hidden py-1 animate-fade-in">
          {languages.map((lang) => (
            <button
              key={lang.code}
              type="button"
              onClick={() => handleLanguageChange(lang.code)}
              className={`w-full text-left px-4 py-2.5 text-xs font-black flex items-center gap-2 transition ${
                currentLang === lang.code
                  ? 'bg-emerald-600 text-white'
                  : 'text-emerald-950 hover:bg-emerald-50'
              }`}
            >
              <span className="text-base">{lang.flag}</span>
              <span>{lang.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
