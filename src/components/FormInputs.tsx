import React from 'react';

interface SelectInputProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  options: { value: string; label: string }[];
  helperText?: string;
  error?: string;
  id?: string;
  required?: boolean;
  value?: any;
  onChange?: (e: any) => void;
}

export function SelectInput({ label, options, helperText, error, id, required, value, onChange, ...props }: SelectInputProps) {
  return (
    <div className="flex flex-col space-y-1.5 w-full">
      <label className="text-sm font-semibold text-emerald-950 flex items-center justify-between" htmlFor={id}>
        <span>{label}</span>
        {required && <span className="text-red-500 font-normal text-xs">* Required</span>}
      </label>
      <div className="relative">
        <select
          id={id}
          required={required}
          value={value}
          onChange={onChange}
          className={`w-full bg-white/70 backdrop-blur-sm border rounded-2xl px-4 py-3 text-emerald-950 shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-600 transition-all duration-200 cursor-pointer appearance-none ${
            error ? 'border-red-300 ring-2 ring-red-100' : 'border-emerald-200 hover:border-emerald-400'
          }`}
          {...props}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value} className="bg-white text-emerald-950">
              {opt.label}
            </option>
          ))}
        </select>
        {/* Custom Chevron icon */}
        <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none text-emerald-700">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
      {error ? (
        <span className="text-xs text-red-600 font-medium pl-1">{error}</span>
      ) : helperText ? (
        <span className="text-xs text-emerald-700/80 pl-1">{helperText}</span>
      ) : null}
    </div>
  );
}

interface TextInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  helperText?: string;
  error?: string;
  id?: string;
  required?: boolean;
  value?: any;
  onChange?: (e: any) => void;
  placeholder?: string;
}

export function TextInput({ label, helperText, error, id, required, value, onChange, placeholder, ...props }: TextInputProps) {
  return (
    <div className="flex flex-col space-y-1.5 w-full">
      <label className="text-sm font-semibold text-emerald-950 flex items-center justify-between" htmlFor={id}>
        <span>{label}</span>
        {required && <span className="text-red-500 font-normal text-xs">* Required</span>}
      </label>
      <input
        id={id}
        required={required}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`w-full bg-white/70 backdrop-blur-sm border rounded-2xl px-4 py-3 text-emerald-950 shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-600 transition-all duration-200 ${
          error ? 'border-red-300 ring-2 ring-red-100' : 'border-emerald-200 hover:border-emerald-400'
        }`}
        {...props}
      />
      {error ? (
        <span className="text-xs text-red-600 font-medium pl-1">{error}</span>
      ) : helperText ? (
        <span className="text-xs text-emerald-700/80 pl-1">{helperText}</span>
      ) : null}
    </div>
  );
}

interface NumberInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  minVal?: number;
  maxVal?: number;
  unit?: string;
  error?: string;
  id?: string;
  required?: boolean;
  value?: any;
  onChange?: (e: any) => void;
  placeholder?: string;
}

export function NumberInput({ label, minVal, maxVal, unit, error, id, required, value, onChange, placeholder, ...props }: NumberInputProps) {
  return (
    <div className="flex flex-col space-y-1.5 w-full">
      <label className="text-sm font-semibold text-emerald-950 flex items-center justify-between" htmlFor={id}>
        <span className="flex items-center gap-1.5">
          {label}
          {unit && <span className="text-xs text-emerald-700 font-normal bg-emerald-100/70 py-0.5 px-2 rounded-full">{unit}</span>}
        </span>
        {required && <span className="text-red-500 font-normal text-xs">*</span>}
      </label>
      <div className="relative">
        <input
          id={id}
          required={required}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          type="number"
          step="any"
          min={minVal}
          max={maxVal}
          className={`w-full bg-white/70 backdrop-blur-sm border rounded-2xl px-4 py-3 pr-12 text-emerald-950 shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-600 transition-all duration-200 ${
            error ? 'border-red-300 ring-2 ring-red-100' : 'border-emerald-200 hover:border-emerald-400'
          }`}
          {...props}
        />
        {minVal !== undefined && maxVal !== undefined && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-emerald-700 font-mono bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-100">
            {minVal}-{maxVal}
          </div>
        )}
      </div>
      {error && <span className="text-xs text-red-600 font-medium pl-1">{error}</span>}
    </div>
  );
}
