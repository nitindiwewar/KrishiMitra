import React from 'react';
import { Leaf } from 'lucide-react';

interface LoadingSpinnerProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg';
}

export default function LoadingSpinner({ message = 'Loading...', size = 'md' }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'w-5 h-5',
    md: 'w-10 h-10',
    lg: 'w-16 h-16',
  };

  return (
    <div id="loading-spinner" className="flex flex-col items-center justify-center p-8 text-center animate-fade-in">
      <div className="relative flex items-center justify-center">
        {/* Outer glowing pulsing ring */}
        <div className="absolute inset-0 rounded-full bg-emerald-500/20 blur-xl animate-pulse"></div>
        {/* Spinner border */}
        <div className={`rounded-full border-4 border-emerald-100 border-t-emerald-600 animate-spin ${sizeClasses[size]}`}></div>
        {/* Center icon */}
        <Leaf className={`absolute text-emerald-600 ${size === 'lg' ? 'w-6 h-6 animate-bounce' : size === 'md' ? 'w-4 h-4' : 'w-2 h-2'}`} />
      </div>
      {message && (
        <p className="mt-4 text-emerald-800 font-medium text-sm animate-pulse tracking-wide">
          {message}
        </p>
      )}
    </div>
  );
}
