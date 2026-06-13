import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Leaf, Sprout } from 'lucide-react';

interface LoaderProps {
  onComplete: () => void;
}

export default function Loader({ onComplete }: LoaderProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // 0 to 100% in 2.2 seconds
    const duration = 2200; 
    const intervalTime = 30;
    const increment = 100 / (duration / intervalTime);

    const timer = setInterval(() => {
      setProgress((prev) => {
        const next = prev + increment;
        if (next >= 100) {
          clearInterval(timer);
          setTimeout(() => {
            onComplete();
          }, 300);
          return 100;
        }
        return next;
      });
    }, intervalTime);

    return () => clearInterval(timer);
  }, [onComplete]);

  return (
    <motion.div
      id="full-screen-loader"
      className="fixed inset-0 bg-[#022c22] z-[9999] flex flex-col items-center justify-center overflow-hidden"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.6, ease: 'easeInOut' } }}
    >
      {/* Moving field grids (Farming landscape simulation) */}
      <div className="absolute inset-0 opacity-15 overflow-hidden pointer-events-none">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="farming-grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#10b981" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#farming-grid)" />
          {/* Animated golden horizon lines */}
          <motion.path
            d="M -100 500 C 300 300, 700 700, 1500 500"
            fill="none"
            stroke="#f59e0b"
            strokeWidth="3"
            initial={{ pathLength: 0, opacity: 0.2 }}
            animate={{ pathLength: 1, opacity: 0.6 }}
            transition={{ duration: 2.5, ease: 'easeInOut', repeat: Infinity, repeatType: 'reverse' }}
          />
        </svg>
      </div>

      {/* Falling Leaves Background details */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-emerald-400/20"
            style={{
              top: `${Math.random() * 80}%`,
              left: `${Math.random() * 90}%`,
            }}
            animate={{
              y: [0, 80, 0],
              x: [0, 30, 0],
              rotate: [0, 360],
              scale: [0.8, 1.2, 0.8],
            }}
            transition={{
              duration: 4 + i * 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            <Leaf className="w-10 h-10 fill-current" />
          </motion.div>
        ))}
      </div>

      {/* Main Container */}
      <div className="relative flex flex-col items-center justify-center space-y-8 z-10">
        
        {/* Animated dynamic plant logo inside glowing ring */}
        <div className="relative w-44 h-44 flex items-center justify-center">
          
          {/* Outer circular spinner */}
          <svg className="absolute inset-0 w-full h-full transform -rotate-90">
            <circle
              cx="88"
              cy="88"
              r="78"
              stroke="rgba(16, 185, 129, 0.1)"
              strokeWidth="6"
              fill="transparent"
            />
            <motion.circle
              cx="88"
              cy="88"
              r="78"
              stroke="#10b981"
              strokeWidth="6"
              fill="transparent"
              strokeDasharray={490}
              strokeDashoffset={490 - (490 * progress) / 100}
              strokeLinecap="round"
            />
          </svg>

          {/* Plant growth sequence */}
          <div className="relative z-10 w-28 h-28 bg-emerald-950/60 rounded-full border border-emerald-500/40 flex items-center justify-center shadow-lg shadow-emerald-500/10">
            {/* The growing seed state mapped to loading percentage */}
            {progress < 40 ? (
              // Stage 1: Seed Cracking
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="flex flex-col items-center"
              >
                <div className="w-8 h-10 bg-amber-700 rounded-full relative overflow-hidden shadow-inner border border-amber-800">
                  <div className="absolute top-1/2 left-1/2 w-2 h-4 bg-lime-500 rounded-full origin-bottom rotate-12 -translate-x-1/2 -translate-y-1/2 animate-pulse" />
                </div>
                <span className="text-[10px] text-amber-500 font-extrabold uppercase tracking-wide mt-1">Cracking Seed</span>
              </motion.div>
            ) : progress < 75 ? (
              // Stage 2: Sprout Growing
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-emerald-400 flex flex-col items-center"
              >
                <Sprout className="w-14 h-14 animate-bounce" />
                <span className="text-[10px] text-emerald-400 font-extrabold uppercase tracking-wide mt-1">Sprouting</span>
              </motion.div>
            ) : (
              // Stage 3: Burst of leaves / Flower
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: [1, 1.2, 1], opacity: 1 }}
                className="text-lime-400 flex flex-col items-center"
              >
                <Leaf className="w-14 h-14 fill-lime-500/10 animate-pulse" />
                <span className="text-[10px] text-lime-400 font-extrabold uppercase tracking-wide mt-1">Ready</span>
              </motion.div>
            )}
          </div>
        </div>

        {/* Brand Name & Tagline */}
        <div className="text-center space-y-2 max-w-sm px-4">
          <motion.h1
            className="text-3xl font-black text-white tracking-widest uppercase"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            Krishi<span className="text-[#10b981]">Mitra</span>
          </motion.h1>
          
          <motion.p
            className="text-[11px] font-black uppercase text-emerald-300 tracking-widest"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            Empowering Farmers with Smart Technology
          </motion.p>
        </div>

        {/* Spinner progress details */}
        <div className="flex flex-col items-center">
          <span className="text-2xl font-black text-white font-mono tracking-wider">
            {Math.round(progress)}%
          </span>
          <span className="text-[9px] text-emerald-400 font-black uppercase tracking-wider mt-0.5">
            Synchronizing satellite telemetry...
          </span>
        </div>

      </div>
    </motion.div>
  );
}
