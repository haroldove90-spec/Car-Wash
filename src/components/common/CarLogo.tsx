import React from 'react';

interface CarLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  lightText?: boolean;
}

export const CarLogo: React.FC<CarLogoProps> = ({
  className = '',
  size = 'md',
  showText = true,
  lightText = false,
}) => {
  const sizeMap = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-14 h-14',
    xl: 'w-20 h-20',
  };

  const textMap = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl',
    xl: 'text-3xl',
  };

  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      {/* Dynamic App Icon */}
      <div
        className={`${sizeMap[size]} relative rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-violet-500 p-2 shadow-md shadow-indigo-500/25 flex items-center justify-center flex-shrink-0 group overflow-hidden`}
      >
        <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
        
        {/* Bubbles / sparkles decor */}
        <div className="absolute -top-1 -right-1 w-3 h-3 bg-cyan-300 rounded-full blur-[1px] opacity-80 animate-pulse" />
        <div className="absolute top-1 left-1 w-1.5 h-1.5 bg-white rounded-full opacity-60" />

        {/* Minimal car + water droplets vector */}
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          className="w-full h-full text-white"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {/* Sparkle top */}
          <path d="M19 4v2m1-1h-2" stroke="#67e8f9" strokeWidth="2.5" />
          {/* Car body */}
          <path d="M4 15l1.5-4.5A2 2 0 0 1 7.4 9h9.2a2 2 0 0 1 1.9 1.5L20 15v4a1 1 0 0 1-1 1h-1a1 1 0 0 1-1-1v-1H7v1a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-4z" fill="#ffffff" fillOpacity="0.25" stroke="#ffffff" />
          <circle cx="7.5" cy="15.5" r="1.5" fill="#ffffff" />
          <circle cx="16.5" cy="15.5" r="1.5" fill="#ffffff" />
          {/* Wave spray under */}
          <path d="M2 19c2-1 4 0 6-1s4-1 6 0 4 1 6 0" stroke="#bae6fd" strokeWidth="1.5" />
        </svg>
      </div>

      {showText && (
        <div className="leading-tight">
          <div className={`font-black tracking-tight ${textMap[size]} ${lightText ? 'text-white' : 'text-slate-900'}`}>
            CAR <span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">WASH</span>
          </div>
          <div className="text-[10px] font-semibold uppercase tracking-widest text-indigo-500">
            A Domicilio
          </div>
        </div>
      )}
    </div>
  );
};
