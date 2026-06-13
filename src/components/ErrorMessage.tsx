import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface ErrorMessageProps {
  title?: string;
  message: string;
  onRetry?: () => void;
}

export default function ErrorMessage({ title = 'Something went wrong', message, onRetry }: ErrorMessageProps) {
  return (
    <div id="error-message" className="p-6 bg-red-50/80 backdrop-blur-md border border-red-200 rounded-3xl max-w-lg mx-auto shadow-sm animate-fade-in">
      <div className="flex items-start space-x-4">
        <div className="p-3 bg-red-100 rounded-2xl text-red-600">
          <AlertTriangle className="w-6 h-6" />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-red-950">{title}</h3>
          <p className="mt-1 text-sm text-red-800 leading-relaxed">{message}</p>
          
          {onRetry && (
            <button
              id="error-retry-btn"
              onClick={onRetry}
              className="mt-4 flex items-center space-x-2 text-sm font-semibold text-red-700 hover:text-red-900 transition-colors py-2 px-4 bg-white/50 hover:bg-white rounded-xl border border-red-200"
            >
              <RefreshCw className="w-4 h-4 animate-spin-slow" />
              <span>Try Again</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
