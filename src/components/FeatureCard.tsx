import React from 'react';
import { LucideIcon } from 'lucide-react';
import { Link } from 'react-router-dom';

interface FeatureCardProps {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  linkTo: string;
  badge?: string;
  iconBgColor?: string;
}

export default function FeatureCard({
  id,
  title,
  description,
  icon: Icon,
  linkTo,
  badge,
  iconBgColor = 'bg-emerald-100 text-emerald-700',
}: FeatureCardProps) {
  return (
    <div
      id={id}
      className="group relative bg-white/75 backdrop-blur-md rounded-3xl p-6 border border-emerald-100/80 shadow-sm hover:shadow-xl hover:shadow-emerald-900/5 hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between overflow-hidden"
    >
      {/* Decorative leaf backdrop glow on card hover */}
      <div className="absolute -right-16 -bottom-16 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500 pointer-events-none"></div>

      <div>
        {/* Top bar with Icon and Badge */}
        <div className="flex items-center justify-between mb-5">
          <div className={`p-4 ${iconBgColor} rounded-2xl shadow-sm transition-transform duration-300 group-hover:scale-110`}>
            <Icon className="w-6 h-6" />
          </div>
          {badge && (
            <span className="text-[11px] font-bold tracking-wider text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100/50 uppercase">
              {badge}
            </span>
          )}
        </div>

        {/* Content */}
        <h3 className="text-xl font-bold text-emerald-950 mb-2.5 tracking-tight group-hover:text-emerald-700 transition-colors duration-200">
          {title}
        </h3>
        <p className="text-sm text-emerald-800/80 leading-relaxed mb-6">
          {description}
        </p>
      </div>

      {/* Action link */}
      <div>
        <Link
          to={linkTo}
          className="inline-flex items-center text-sm font-semibold text-emerald-700 group-hover:text-emerald-900 transition-colors duration-200"
        >
          <span>Get Started</span>
          <svg
            className="w-4 h-4 ml-1.5 transform group-hover:translate-x-1.5 transition-transform duration-300"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>
    </div>
  );
}
