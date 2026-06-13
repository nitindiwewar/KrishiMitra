import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../auth/authContext';

import LanguageDropdown from '../components/LanguageDropdown';
import { ChevronLeft, AlertCircle, FileText, CheckCircle2, User, Phone, MapPin, Lock } from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';
import { useTranslation } from '../lib/translations';

export default function Register() {
  const { registerUser } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();

  // Field states
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [village, setVillage] = useState('');
  const [district, setDistrict] = useState('');
  const [state, setState] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // UI state
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [regError, setRegError] = useState('');
  const [localLoading, setLocalLoading] = useState(false);
  const [regSuccess, setRegSuccess] = useState(false);

  const validateForm = () => {
    let valid = true;
    const errors: Record<string, string> = {};

    if (!name.trim()) {
      errors.name = t('reg.errNameReq');
      valid = false;
    }

    if (!mobile.trim()) {
      errors.mobile = t('reg.errMobileReq');
      valid = false;
    } else if (!/^\d{10}$/.test(mobile.trim())) {
      errors.mobile = t('reg.errMobileDigits');
      valid = false;
    }

    if (!village.trim()) {
      errors.village = t('reg.errVillageReq');
      valid = false;
    }

    if (!district.trim()) {
      errors.district = t('reg.errDistrictReq');
      valid = false;
    }

    if (!state.trim()) {
      errors.state = t('reg.errStateReq');
      valid = false;
    }

    if (!password) {
      errors.password = t('reg.errPasswordReq');
      valid = false;
    } else if (password.length < 6) {
      errors.password = t('reg.errPasswordLength');
      valid = false;
    }

    if (password !== confirmPassword) {
      errors.confirmPassword = t('reg.errPasswordMatch');
      valid = false;
    }

    setValidationErrors(errors);
    return valid;
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegError('');
    setRegSuccess(false);

    if (!validateForm()) {
      return;
    }

    setLocalLoading(true);
    try {
      await registerUser({
        name: name.trim(),
        mobile: mobile.trim(),
        village: village.trim(),
        district: district.trim(),
        state: state.trim(),
        password: password,
      });

      setRegSuccess(true);
      // Wait shortly to let the user see success message before redirecting to login
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err: any) {
      setRegError(err.message || t('reg.errFailed'));
    } finally {
      setLocalLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-emerald-50 via-white to-emerald-50/40 min-h-screen py-12 px-4 flex flex-col justify-center font-sans" id="farmer-register-root">
      
      {/* Navigation breadcrumb and Language Selector */}
      <div className="max-w-lg w-full mx-auto mb-6 flex justify-between items-center bg-transparent">
        <Link to="/login" className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-850 hover:text-emerald-700 transition">
          <ChevronLeft className="w-4 h-4" />
          <span>{t('backToLogin')}</span>
        </Link>
        <LanguageDropdown />
      </div>

      <div className="max-w-lg w-full mx-auto bg-white border border-emerald-100 rounded-3xl shadow-xl overflow-hidden p-8 relative">
        
        {localLoading && (
          <div className="absolute inset-0 bg-white/95 backdrop-blur-sm z-50 flex flex-col items-center justify-center p-6 text-center animate-fade-in">
            <LoadingSpinner message={t('reg.spinner')} size="lg" />
          </div>
        )}

        {regSuccess && (
          <div className="absolute inset-0 bg-white/95 backdrop-blur-sm z-50 flex flex-col items-center justify-center p-6 text-center animate-fade-in">
            <div className="bg-emerald-100 text-emerald-700 p-4 rounded-full mb-4 animate-bounce">
              <CheckCircle2 className="w-12 h-12" />
            </div>
            <h3 className="text-xl font-bold text-emerald-950">{t('reg.successTitle')}</h3>
            <p className="text-sm text-emerald-900/60 mt-1 max-w-xs">
              {t('reg.successDesc').replace('{name}', name)}
            </p>
          </div>
        )}

        <div className="text-center mb-6">
          <div className="inline-flex justify-center bg-emerald-100 text-emerald-700 p-3 rounded-2xl mb-4 shadow-sm">
            <FileText className="w-7 h-7" />
          </div>
          <h2 className="text-2xl font-black text-emerald-950 tracking-tight">{t('kisanRegForm')}</h2>
          <p className="text-xs md:text-sm text-emerald-900/60 mt-1.5">{t('regSub')}</p>
        </div>

        {regError && (
          <div className="bg-red-50 border border-red-150 rounded-2xl p-4 mb-6 flex gap-3 text-red-900 animate-fade-in">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-bold uppercase tracking-wider">{t('reg.failed')}</p>
              <p className="text-xs text-red-700 mt-0.5">{regError}</p>
            </div>
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-4">
          
          {/* General info section card */}
          <div className="space-y-3">
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Full Name */}
              <div className="flex flex-col gap-1 w-full">
                <label className="text-xs font-bold text-emerald-955 flex items-center gap-1">
                  <User className="w-3.5 h-3.5 text-emerald-75 text-emerald-600" />
                  <span>{t('fullName')}</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Ramesh Kumawat"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (validationErrors.name) {
                      setValidationErrors({ ...validationErrors, name: '' });
                    }
                  }}
                  className={`w-full rounded-xl border px-3 py-2 text-xs md:text-sm outline-none transition bg-white text-emerald-950 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-500/10 ${
                    validationErrors.name ? 'border-red-400 focus:border-red-500' : 'border-emerald-200'
                  }`}
                />
                {validationErrors.name && (
                  <span className="text-[10px] font-semibold text-red-500 mt-0.5">{validationErrors.name}</span>
                )}
              </div>

              {/* Mobile */}
              <div className="flex flex-col gap-1 w-full">
                <label className="text-xs font-bold text-emerald-955 flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5 text-emerald-75 text-emerald-600" />
                  <span>{t('mobileNumber')}</span>
                </label>
                <input
                  type="text"
                  maxLength={10}
                  placeholder={t('enterMobilePlaceholder')}
                  value={mobile}
                  onChange={(e) => {
                    const cleanVal = e.target.value.replace(/\D/g, '');
                    setMobile(cleanVal);
                    if (validationErrors.mobile) {
                      setValidationErrors({ ...validationErrors, mobile: '' });
                    }
                  }}
                  className={`w-full rounded-xl border px-3 py-2 text-xs md:text-sm outline-none transition bg-white text-emerald-950 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-500/10 ${
                    validationErrors.mobile ? 'border-red-400 focus:border-red-500' : 'border-emerald-200'
                  }`}
                />
                {validationErrors.mobile && (
                  <span className="text-[10px] font-semibold text-red-500 mt-0.5">{validationErrors.mobile}</span>
                )}
              </div>
            </div>

            {/* Geography Details Header */}
            <p className="text-[10px] font-extrabold uppercase text-emerald-700 tracking-wider pt-2 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5" />
              <span>{t('reg.geoHeader')}</span>
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Village */}
              <div className="flex flex-col gap-1">
                <label className="text-[11px] font-semibold text-emerald-955">{t('village')}</label>
                <input
                  type="text"
                  placeholder={t('villagePlaceholder')}
                  value={village}
                  onChange={(e) => {
                    setVillage(e.target.value);
                    if (validationErrors.village) {
                      setValidationErrors({ ...validationErrors, village: '' });
                    }
                  }}
                  className={`w-full rounded-xl border px-3 py-2 text-xs outline-none transition bg-white text-emerald-950 focus:border-emerald-600 ${
                    validationErrors.village ? 'border-red-400 focus:border-red-500' : 'border-emerald-200'
                  }`}
                />
                {validationErrors.village && (
                  <span className="text-[10px] text-red-500">{validationErrors.village}</span>
                )}
              </div>

              {/* District */}
              <div className="flex flex-col gap-1">
                <label className="text-[11px] font-semibold text-emerald-955">{t('district')}</label>
                <input
                  type="text"
                  placeholder={t('districtPlaceholder')}
                  value={district}
                  onChange={(e) => {
                    setDistrict(e.target.value);
                    if (validationErrors.district) {
                      setValidationErrors({ ...validationErrors, district: '' });
                    }
                  }}
                  className={`w-full rounded-xl border px-3 py-2 text-xs outline-none transition bg-white text-emerald-950 focus:border-emerald-600 ${
                    validationErrors.district ? 'border-red-400 focus:border-red-500' : 'border-emerald-200'
                  }`}
                />
                {validationErrors.district && (
                  <span className="text-[10px] text-red-500">{validationErrors.district}</span>
                )}
              </div>

              {/* State */}
              <div className="flex flex-col gap-1">
                <label className="text-[11px] font-semibold text-emerald-955">{t('state')}</label>
                <input
                  type="text"
                  placeholder={t('statePlaceholder')}
                  value={state}
                  onChange={(e) => {
                    setState(e.target.value);
                    if (validationErrors.state) {
                      setValidationErrors({ ...validationErrors, state: '' });
                    }
                  }}
                  className={`w-full rounded-xl border px-3 py-2 text-xs outline-none transition bg-white text-emerald-950 focus:border-emerald-600 ${
                    validationErrors.state ? 'border-red-400 focus:border-red-500' : 'border-emerald-200'
                  }`}
                />
                {validationErrors.state && (
                  <span className="text-[10px] text-red-500">{validationErrors.state}</span>
                )}
              </div>
            </div>

            {/* Passwords Header */}
            <p className="text-[10px] font-extrabold uppercase text-emerald-700 tracking-wider pt-2 flex items-center gap-1">
              <Lock className="w-3.5 h-3.5" />
              <span>{t('reg.protectHeader')}</span>
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Password */}
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-emerald-955">{t('createPassword')}</label>
                <input
                  type="password"
                  placeholder="Minimum 6 chars"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (validationErrors.password) {
                      setValidationErrors({ ...validationErrors, password: '' });
                    }
                  }}
                  className={`w-full rounded-xl border px-3 py-2 text-xs outline-none transition bg-white text-emerald-950 focus:border-emerald-600 ${
                    validationErrors.password ? 'border-red-400 focus:border-red-500' : 'border-emerald-200'
                  }`}
                />
                {validationErrors.password && (
                  <strong className="text-[10px] text-red-500 font-normal">{validationErrors.password}</strong>
                )}
              </div>

              {/* Confirm Password */}
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-emerald-955">{t('confirmPassword')}</label>
                <input
                  type="password"
                  placeholder="Repeat same password"
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    if (validationErrors.confirmPassword) {
                      setValidationErrors({ ...validationErrors, confirmPassword: '' });
                    }
                  }}
                  className={`w-full rounded-xl border px-3 py-2 text-xs outline-none transition bg-white text-emerald-950 focus:border-emerald-600 ${
                    validationErrors.confirmPassword ? 'border-red-400 focus:border-red-500' : 'border-emerald-200'
                  }`}
                />
                {validationErrors.confirmPassword && (
                  <strong className="text-[10px] text-red-500 font-normal">{validationErrors.confirmPassword}</strong>
                )}
              </div>
            </div>

          </div>

          {/* Actions */}
          <div className="pt-4 space-y-2">
            <button
              type="submit"
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-5 rounded-xl transition duration-150 text-sm flex items-center justify-center shadow-sm cursor-pointer"
            >
              <span>{t('submitRegistration')}</span>
            </button>
            <div className="text-center text-xs text-emerald-900/60 pt-2">
              {t('alreadyHaveAccount')}{' '}
              <Link to="/login" className="font-extrabold text-emerald-75 text-emerald-700 hover:underline cursor-pointer">
                {t('loginWorkspace')}
              </Link>
            </div>
          </div>

        </form>

      </div>
    </div>
  );
}
