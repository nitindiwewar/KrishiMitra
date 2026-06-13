import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../auth/authContext';

import LanguageDropdown from '../components/LanguageDropdown';
import { Wheat, Phone, Lock, ChevronLeft, AlertCircle, HelpCircle } from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';
import { useTranslation } from '../lib/translations';

export default function Login() {
  const { loginUser } = useAuth();
  const { t } = useTranslation();
  
  const navigate = useNavigate();

  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [validationErrors, setValidationErrors] = useState<{ mobile?: string; password?: string }>({});
  const [authError, setAuthError] = useState('');
  const [localLoading, setLocalLoading] = useState(false);
  const [isForgotOpen, setIsForgotOpen] = useState(false);

  const validateForm = () => {
    let valid = true;
    const errors: { mobile?: string; password?: string } = {};

    if (!mobile.trim()) {
      errors.mobile = t('login.errMobileReq');
      valid = false;
    } else if (!/^\d{10}$/.test(mobile.trim())) {
      errors.mobile = t('login.errMobileDigits');
      valid = false;
    }

    if (!password) {
      errors.password = t('login.errPasswordReq');
      valid = false;
    } else if (password.length < 6) {
      errors.password = t('login.errPasswordLength');
      valid = false;
    }

    setValidationErrors(errors);
    return valid;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    
    if (!validateForm()) {
      return;
    }

    setLocalLoading(true);
    try {
      await loginUser(mobile.trim(), password);
      navigate('/dashboard');
    } catch (err: any) {
      setAuthError(err.message || t('login.errInvalid'));
    } finally {
      setLocalLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-emerald-50 via-white to-emerald-50/40 min-h-screen py-16 px-4 flex flex-col justify-center font-sans" id="farmer-login-root">
      
      {/* Back to auth select and Language Selector */}
      <div className="max-w-md w-full mx-auto mb-6 flex justify-between items-center bg-transparent">
        <Link to="/auth" className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-850 hover:text-emerald-700 transition">
          <ChevronLeft className="w-4 h-4" />
          <span>{t('login.roleSelection')}</span>
        </Link>
        <LanguageDropdown />
      </div>

      <div className="max-w-md w-full mx-auto bg-white border border-emerald-100 rounded-3xl shadow-xl overflow-hidden p-8 md:p-10 relative">
        
        {localLoading && (
          <div className="absolute inset-0 bg-white/95 backdrop-blur-sm z-50 flex flex-col items-center justify-center p-6 text-center animate-fade-in">
            <LoadingSpinner message={t('login.spinner')} size="lg" />
          </div>
        )}

        <div className="text-center mb-8">
          <div className="inline-flex justify-center bg-emerald-100 text-emerald-700 p-3 rounded-2xl mb-4 shadow-sm">
            <Wheat className="w-7 h-7" />
          </div>
          <h2 className="text-2xl font-black text-emerald-950 tracking-tight">{t('kisanLogin')}</h2>
          <p className="text-sm text-emerald-900/60 mt-1.5">{t('loginCredentialsSub')}</p>
        </div>

        {authError && (
          <div className="bg-red-50 border border-red-150 rounded-2xl p-4 mb-6 flex gap-3 text-red-900 animate-fade-in">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-bold uppercase tracking-wider">{t('login.failed')}</p>
              <p className="text-xs text-red-700 mt-0.5">{authError}</p>
            </div>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          
          {/* Mobile input */}
          <div className="flex flex-col gap-1.5 w-full">
            <label htmlFor="login-mobile" className="text-sm font-semibold text-emerald-955 flex items-center gap-2">
              <Phone className="w-4 h-4 text-emerald-700" />
              <span>{t('mobileNumber')}</span>
            </label>
            <input
              id="login-mobile"
              type="text"
              pattern="\d*"
              maxLength={10}
              placeholder={t('enterMobilePlaceholder')}
              value={mobile}
              onChange={(e) => {
                const val = e.target.value.replace(/\D/g, '');
                setMobile(val);
                if (validationErrors.mobile) {
                  setValidationErrors({ ...validationErrors, mobile: undefined });
                }
              }}
              className={`w-full rounded-xl border px-3.5 py-2.5 text-sm outline-none transition bg-white text-emerald-950 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/10 ${
                validationErrors.mobile ? 'border-red-400 focus:border-red-500' : 'border-emerald-250/80 border-emerald-200'
              }`}
            />
            {validationErrors.mobile && (
              <span className="text-xs font-semibold text-red-500 mt-1">{validationErrors.mobile}</span>
            )}
          </div>

          {/* Password input */}
          <div className="flex flex-col gap-1.5 w-full">
            <div className="flex justify-between items-center">
              <label htmlFor="login-password" className="text-sm font-semibold text-emerald-955 flex items-center gap-2">
                <Lock className="w-4 h-4 text-emerald-700" />
                <span>{t('password')}</span>
              </label>
              <button
                type="button"
                onClick={() => setIsForgotOpen(true)}
                className="text-xs font-bold text-emerald-600 hover:text-emerald-700 cursor-pointer"
              >
                {t('forgotPassword')}
              </button>
            </div>
            <input
              id="login-password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (validationErrors.password) {
                  setValidationErrors({ ...validationErrors, password: undefined });
                }
              }}
              className={`w-full rounded-xl border px-3.5 py-2.5 text-sm outline-none transition bg-white text-emerald-950 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/10 ${
                validationErrors.password ? 'border-red-400 focus:border-red-500' : 'border-emerald-250/80 border-emerald-200'
              }`}
            />
            {validationErrors.password && (
              <span className="text-xs font-semibold text-red-500 mt-1">{validationErrors.password}</span>
            )}
          </div>

          <div className="pt-4 space-y-3">
            <button
              type="submit"
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-5 rounded-xl transition duration-150 text-sm flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
            >
              <span>{t('loginWorkspace')}</span>
            </button>
            
            <Link
              to="/register"
              className="w-full bg-slate-50 hover:bg-slate-100 text-slate-800 font-bold py-3 px-5 rounded-xl border border-slate-200 transition duration-150 text-sm flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>{t('registerNewFarmer')}</span>
            </Link>
          </div>

        </form>

        {isForgotOpen && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-sm w-full p-6 text-center shadow-2xl relative animate-fade-in">
              <div className="bg-emerald-50 text-emerald-700 p-3 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
                <HelpCircle className="w-6 h-6" />
              </div>
              <h3 className="font-black text-emerald-950 text-lg mb-2">{t('login.forgotModalTitle')}</h3>
              <p className="text-emerald-900/70 text-xs md:text-sm leading-relaxed mb-6">
                {t('login.forgotModalDesc')}
              </p>
              <button
                type="button"
                onClick={() => setIsForgotOpen(false)}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 px-6 rounded-xl text-xs cursor-pointer"
              >
                {t('login.forgotModalBtn')}
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}


// import React, { useState } from "react";
// import { useNavigate, Link } from "react-router-dom";
// import { useAuth } from "../auth/authContext";

// export default function Login() {
//   const { loginUser } = useAuth();
//   const navigate = useNavigate();

//   const [mobile, setMobile] = useState("");
//   const [password, setPassword] = useState("");
//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(false);

//   const handleLogin = async (
//     e: React.FormEvent<HTMLFormElement>
//   ) => {
//     e.preventDefault();

//     setError("");

//     if (!mobile || !password) {
//       setError("Please enter mobile number and password");
//       return;
//     }

//     try {
//       setLoading(true);

//       await loginUser(
//         mobile.trim(),
//         password
//       );

//       navigate("/dashboard");
//     } catch (err: any) {
//       setError(
//         err.message || "Login Failed"
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-100">
//       <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
//         <h1 className="text-2xl font-bold text-center mb-6">
//           Farmer Login
//         </h1>

//         {error && (
//           <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
//             {error}
//           </div>
//         )}

//         <form onSubmit={handleLogin}>
//           <div className="mb-4">
//             <label className="block mb-2">
//               Mobile Number
//             </label>

//             <input
//               type="text"
//               maxLength={10}
//               value={mobile}
//               onChange={(e) =>
//                 setMobile(
//                   e.target.value.replace(/\D/g, "")
//                 )
//               }
//               className="w-full border p-2 rounded"
//               placeholder="Enter mobile number"
//             />
//           </div>

//           <div className="mb-4">
//             <label className="block mb-2">
//               Password
//             </label>

//             <input
//               type="password"
//               value={password}
//               onChange={(e) =>
//                 setPassword(e.target.value)
//               }
//               className="w-full border p-2 rounded"
//               placeholder="Enter password"
//             />
//           </div>

//           <button
//             type="submit"
//             disabled={loading}
//             className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
//           >
//             {loading
//               ? "Logging in..."
//               : "Login"}
//           </button>
//         </form>

//         <div className="text-center mt-4">
//           <Link
//             to="/register"
//             className="text-green-600"
//           >
//             Create New Account
//           </Link>
//         </div>
//       </div>
//     </div>
//   );
// }