import React from 'react';

interface VehicleIllustrationProps {
  type: 'sport' | 'suv' | 'sedan' | 'pickup' | 'vip';
  className?: string;
}

export const VehicleIllustration: React.FC<VehicleIllustrationProps> = ({ type, className = 'w-36 h-20' }) => {
  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      {/* Soft gradient aura behind the vehicle */}
      <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 via-purple-500/15 to-cyan-500/10 rounded-full blur-xl -z-10" />

      {type === 'sport' && (
        <svg viewBox="0 0 200 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-md">
          <defs>
            <linearGradient id="sportGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#4F46E5" />
              <stop offset="60%" stopColor="#7C3AED" />
              <stop offset="100%" stopColor="#A855F7" />
            </linearGradient>
            <linearGradient id="windowSport" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#1E293B" stopOpacity="0.6" />
            </linearGradient>
          </defs>
          {/* Shadow */}
          <ellipse cx="100" cy="85" rx="80" ry="8" fill="#1E1B4B" fillOpacity="0.12" />
          {/* Main Body */}
          <path d="M25 65 C35 60 50 58 70 54 L95 38 C105 32 135 32 150 42 L175 58 C185 62 190 68 185 75 L20 75 C15 75 18 68 25 65 Z" fill="url(#sportGrad)" />
          {/* Aerodynamic spoiler */}
          <path d="M15 54 L28 54 L22 62 Z" fill="#4338CA" />
          {/* Windshield / Cab */}
          <path d="M78 52 L98 39 C106 35 130 35 142 43 L158 52 Z" fill="url(#windowSport)" stroke="#C7D2FE" strokeWidth="1.5" />
          {/* Headlight beam */}
          <polygon points="182,62 192,66 182,70" fill="#FDE047" />
          {/* Tail light */}
          <polygon points="18,60 22,60 20,67" fill="#EF4444" />
          {/* Wheels */}
          <circle cx="55" cy="74" r="14" fill="#0F172A" />
          <circle cx="55" cy="74" r="7" fill="#E2E8F0" />
          <circle cx="150" cy="74" r="14" fill="#0F172A" />
          <circle cx="150" cy="74" r="7" fill="#E2E8F0" />
        </svg>
      )}

      {type === 'suv' && (
        <svg viewBox="0 0 200 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-md">
          <defs>
            <linearGradient id="suvGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#4338CA" />
              <stop offset="50%" stopColor="#6366F1" />
              <stop offset="100%" stopColor="#8B5CF6" />
            </linearGradient>
            <linearGradient id="windowSuv" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#67E8F9" stopOpacity="0.85" />
              <stop offset="100%" stopColor="#0F172A" stopOpacity="0.7" />
            </linearGradient>
          </defs>
          <ellipse cx="100" cy="86" rx="80" ry="8" fill="#1E1B4B" fillOpacity="0.12" />
          {/* Roof rack */}
          <line x1="60" y1="28" x2="135" y2="28" stroke="#312E81" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="75" y1="28" x2="75" y2="32" stroke="#312E81" strokeWidth="2" />
          <line x1="120" y1="28" x2="120" y2="32" stroke="#312E81" strokeWidth="2" />
          {/* Body */}
          <path d="M22 68 C22 55 35 48 52 35 C60 30 135 30 148 35 L175 50 C185 55 188 65 185 75 L22 75 Z" fill="url(#suvGrad)" />
          {/* Windows */}
          <path d="M55 36 L142 36 L160 50 L55 50 Z" fill="url(#windowSuv)" stroke="#C7D2FE" strokeWidth="1.5" />
          <line x1="100" y1="36" x2="100" y2="50" stroke="#E0E7FF" strokeWidth="2" />
          {/* Headlight */}
          <rect x="180" y="56" width="6" height="8" rx="2" fill="#FDE047" />
          {/* Wheels */}
          <circle cx="55" cy="74" r="16" fill="#0F172A" />
          <circle cx="55" cy="74" r="8" fill="#CBD5E1" />
          <circle cx="145" cy="74" r="16" fill="#0F172A" />
          <circle cx="145" cy="74" r="8" fill="#CBD5E1" />
        </svg>
      )}

      {type === 'sedan' && (
        <svg viewBox="0 0 200 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-md">
          <defs>
            <linearGradient id="sedanGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#4F46E5" />
              <stop offset="50%" stopColor="#6366F1" />
              <stop offset="100%" stopColor="#06B6D4" />
            </linearGradient>
            <linearGradient id="windowSedan" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#BAE6FD" />
              <stop offset="100%" stopColor="#1E293B" stopOpacity="0.8" />
            </linearGradient>
          </defs>
          <ellipse cx="100" cy="85" rx="78" ry="8" fill="#1E1B4B" fillOpacity="0.12" />
          {/* Body */}
          <path d="M24 72 C28 58 45 56 65 46 C75 38 125 38 140 46 L170 56 C182 60 185 68 180 75 L22 75 Z" fill="url(#sedanGrad)" />
          {/* Windows */}
          <path d="M68 47 C75 41 128 41 135 47 L152 56 L55 56 Z" fill="url(#windowSedan)" stroke="#E0E7FF" strokeWidth="1.5" />
          <line x1="102" y1="42" x2="102" y2="56" stroke="#FFFFFF" strokeWidth="1.5" />
          {/* Headlights */}
          <polygon points="175,60 182,63 175,67" fill="#FDE047" />
          {/* Wheels */}
          <circle cx="55" cy="74" r="14" fill="#0F172A" />
          <circle cx="55" cy="74" r="7" fill="#E2E8F0" />
          <circle cx="145" cy="74" r="14" fill="#0F172A" />
          <circle cx="145" cy="74" r="7" fill="#E2E8F0" />
        </svg>
      )}

      {type === 'pickup' && (
        <svg viewBox="0 0 200 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-md">
          <defs>
            <linearGradient id="pickupGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#312E81" />
              <stop offset="60%" stopColor="#4F46E5" />
              <stop offset="100%" stopColor="#7C3AED" />
            </linearGradient>
          </defs>
          <ellipse cx="100" cy="86" rx="82" ry="8" fill="#1E1B4B" fillOpacity="0.12" />
          {/* Cargo bed behind */}
          <path d="M18 54 L75 54 L75 40 C75 35 140 35 150 42 L178 54 C185 58 188 66 186 75 L18 75 Z" fill="url(#pickupGrad)" />
          {/* Cab Window */}
          <path d="M80 42 L142 42 L162 54 L80 54 Z" fill="#38BDF8" fillOpacity="0.8" stroke="#C7D2FE" strokeWidth="1.5" />
          {/* Bed line */}
          <line x1="20" y1="54" x2="75" y2="54" stroke="#A5B4FC" strokeWidth="2" />
          <line x1="75" y1="54" x2="75" y2="72" stroke="#1E1B4B" strokeWidth="1.5" />
          {/* Wheels (larger high clearance) */}
          <circle cx="50" cy="74" r="17" fill="#0F172A" />
          <circle cx="50" cy="74" r="8" fill="#94A3B8" />
          <circle cx="150" cy="74" r="17" fill="#0F172A" />
          <circle cx="150" cy="74" r="8" fill="#94A3B8" />
        </svg>
      )}

      {type === 'vip' && (
        <svg viewBox="0 0 200 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-md">
          <defs>
            <linearGradient id="vipGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#18181B" />
              <stop offset="40%" stopColor="#4338CA" />
              <stop offset="100%" stopColor="#A855F7" />
            </linearGradient>
          </defs>
          <ellipse cx="100" cy="85" rx="82" ry="8" fill="#1E1B4B" fillOpacity="0.12" />
          {/* Luxury Limousine / Executive Sedan */}
          <path d="M18 68 C22 56 42 52 65 44 C80 36 142 36 158 44 L180 56 C190 62 192 70 188 75 L16 75 Z" fill="url(#vipGrad)" />
          {/* Tinted Luxury Windows */}
          <path d="M68 45 L152 45 L168 55 L58 55 Z" fill="#0284C7" fillOpacity="0.75" stroke="#FDE047" strokeWidth="1.5" />
          <line x1="110" y1="45" x2="110" y2="55" stroke="#FDE047" strokeWidth="1.5" />
          {/* Gold Trim / VIP Accent */}
          <path d="M26 66 L182 66" stroke="#FBBF24" strokeWidth="1.5" strokeDasharray="3 2" />
          {/* Wheels with Luxury rims */}
          <circle cx="52" cy="74" r="15" fill="#0F172A" />
          <circle cx="52" cy="74" r="8" fill="#FBBF24" />
          <circle cx="148" cy="74" r="15" fill="#0F172A" />
          <circle cx="148" cy="74" r="8" fill="#FBBF24" />
        </svg>
      )}
    </div>
  );
};
