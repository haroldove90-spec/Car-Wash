import React, { useState } from 'react';
import {
  Navigation,
  MapPin,
  Layers,
  Plus,
  Minus,
  LocateFixed,
  Compass,
  CornerUpRight,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';

interface GoogleMapLightProps {
  heightClass?: string;
  originLabel?: string;
  destinationLabel: string;
  destinationAddress?: string;
  distanceKm: number;
  etaMinutes?: number;
  showTurnByTurnBanner?: boolean;
  driverName?: string;
  orderNumber?: string;
  status?: string;
}

export const GoogleMapLight: React.FC<GoogleMapLightProps> = ({
  heightClass = 'h-72 sm:h-96',
  originLabel = 'Unidad Móvil Car Wash',
  destinationLabel,
  destinationAddress,
  distanceKm,
  etaMinutes = 12,
  showTurnByTurnBanner = false,
  driverName,
  orderNumber,
  status,
}) => {
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [mapType, setMapType] = useState<'map' | 'transit'>('map');
  const [isCentered, setIsCentered] = useState(true);

  const handleZoomIn = () => setZoomLevel(prev => Math.min(prev + 0.15, 1.4));
  const handleZoomOut = () => setZoomLevel(prev => Math.max(prev - 0.15, 0.85));
  const handleRecenter = () => {
    setZoomLevel(1);
    setIsCentered(true);
  };

  return (
    <div
      className={`relative w-full ${heightClass} rounded-2xl sm:rounded-3xl overflow-hidden border border-slate-200/90 shadow-sm bg-[#F3F4F6] select-none flex flex-col justify-between`}
    >
      {/* Google Maps Realistic Vector Cartography Canvas */}
      <div
        className="absolute inset-0 w-full h-full transition-transform duration-300 origin-center"
        style={{ transform: `scale(${zoomLevel})` }}
      >
        <svg
          viewBox="0 0 800 500"
          className="w-full h-full preserve-3d"
          preserveAspectRatio="xMidYMid slice"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Base Land Background (Google Maps Off-White/Sand #F4F3F0) */}
          <rect width="800" height="500" fill="#F4F3F0" />

          {/* Urban District Zones (Subtle Land Blocks) */}
          <path d="M 0 0 L 280 0 L 260 160 L 0 140 Z" fill="#EBE9E4" />
          <path d="M 520 0 L 800 0 L 800 180 L 540 160 Z" fill="#EBE9E4" />
          <path d="M 0 320 L 320 340 L 300 500 L 0 500 Z" fill="#ECE9E2" />
          <path d="M 580 320 L 800 300 L 800 500 L 560 500 Z" fill="#ECE9E2" />

          {/* Parks & Green Reserves (Google Maps Sage Green #D4E9D7) */}
          {/* Parque Chapultepec / Parque Hundido */}
          <path
            d="M 60 40 Q 140 20 180 80 Q 220 140 140 180 Q 80 190 50 140 Z"
            fill="#D4E9D7"
            stroke="#C0DFCA"
            strokeWidth="1.5"
          />
          {/* Parque México */}
          <path
            d="M 580 140 Q 660 110 710 160 Q 730 220 670 240 Q 610 250 570 200 Z"
            fill="#D4E9D7"
            stroke="#C0DFCA"
            strokeWidth="1.5"
          />
          {/* Plaza / Jardín Local */}
          <rect x="360" y="320" width="90" height="70" rx="8" fill="#D4E9D7" stroke="#C0DFCA" strokeWidth="1" />

          {/* Water Bodies: River / Lake (Google Maps Sky Blue #AAD3DF) */}
          <path
            d="M 720 0 C 700 120 740 240 760 360 C 770 420 750 470 780 500 L 800 500 L 800 0 Z"
            fill="#AAD3DF"
          />
          <path
            d="M 0 460 Q 160 440 280 470 Q 340 485 400 500 L 0 500 Z"
            fill="#AAD3DF"
            opacity="0.9"
          />

          {/* Secondary City Streets (White lines #FFFFFF with subtle outline) */}
          <g stroke="#FFFFFF" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round">
            {/* Grid streets */}
            <path d="M 0 90 L 800 90" />
            <path d="M 0 180 L 800 180" />
            <path d="M 0 270 L 800 270" />
            <path d="M 0 360 L 800 360" />
            <path d="M 0 440 L 800 440" />

            <path d="M 120 0 L 120 500" />
            <path d="M 240 0 L 240 500" />
            <path d="M 380 0 L 380 500" />
            <path d="M 500 0 L 500 500" />
            <path d="M 640 0 L 640 500" />

            {/* Diagonals */}
            <path d="M 40 500 L 400 0" />
            <path d="M 400 500 L 760 0" />
          </g>

          {/* Major Avenues (Yellow/Cream Highway style #FEF3C7 with subtle amber casing #F59E0B) */}
          <g stroke="#FDE68A" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round">
            {/* Eje Central / Av. Insurgentes Sur */}
            <path d="M 290 0 L 310 170 L 360 310 L 420 500" />
            {/* Paseo de la Reforma / Periférico */}
            <path d="M 0 240 Q 250 200 490 220 Q 680 230 800 210" />
          </g>

          {/* Inner avenue white core */}
          <g stroke="#FFFFFF" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round">
            <path d="M 290 0 L 310 170 L 360 310 L 420 500" />
            <path d="M 0 240 Q 250 200 490 220 Q 680 230 800 210" />
          </g>

          {/* Real Google Maps Navigation Polyline (Vibrant Blue #1A73E8 / #4285F4) */}
          {/* Route Outer White Glow / Casing */}
          <path
            d="M 200 380 L 240 310 L 360 310 L 490 220 L 560 170 L 620 120"
            stroke="#FFFFFF"
            strokeWidth="12"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Active Navigation Route (Blue #1A73E8) */}
          <path
            d="M 200 380 L 240 310 L 360 310 L 490 220 L 560 170 L 620 120"
            stroke="#1A73E8"
            strokeWidth="8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Traffic Moderate Segment (Yellow #FBBC04 - classic Google Maps traffic color) */}
          <path
            d="M 360 310 L 430 260"
            stroke="#FBBC04"
            strokeWidth="8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Street Labels (Clean Google Maps Typography) */}
          <g fill="#5F6368" fontSize="11" fontFamily="system-ui, -apple-system, sans-serif" fontWeight="600">
            <text x="375" y="212" transform="rotate(3, 375, 212)">Av. Paseo de la Reforma</text>
            <text x="325" y="110" transform="rotate(78, 325, 110)">Av. Insurgentes Sur</text>
            <text x="75" y="115" fill="#2E7D32" fontSize="10">Parque Hundido</text>
            <text x="615" y="195" fill="#2E7D32" fontSize="10">Parque México</text>
            <text x="140" y="260">Viaducto Miguel Alemán</text>
            <text x="460" y="350">Av. Universidad</text>
          </g>

          {/* Origin: Washer Unit Marker (Google Navigation Blue Dot with Heading Pulse) */}
          <g transform="translate(200, 380)">
            {/* Accuracy Radius Halo */}
            <circle cx="0" cy="0" r="28" fill="#4285F4" fillOpacity="0.18" />
            <circle cx="0" cy="0" r="18" fill="#4285F4" fillOpacity="0.25" />
            {/* Outer White Ring */}
            <circle cx="0" cy="0" r="10" fill="#FFFFFF" filter="drop-shadow(0 2px 4px rgba(0,0,0,0.25))" />
            {/* Inner Core Blue Dot */}
            <circle cx="0" cy="0" r="7" fill="#1A73E8" />
            {/* Heading Pointer Arrow */}
            <polygon points="0,-13 4,-7 -4,-7" fill="#1A73E8" />
          </g>

          {/* Destination: Classic Google Maps Red Teardrop Marker Pin */}
          <g transform="translate(620, 120)">
            {/* Shadow under pin */}
            <ellipse cx="0" cy="3" rx="7" ry="3" fill="#000000" fillOpacity="0.3" />
            {/* Red Teardrop Body (#EA4335) */}
            <path
              d="M 0 0 C -8 -10 -12 -18 -12 -25 C -12 -33 -6 -39 0 -39 C 6 -39 12 -33 12 -25 C 12 -18 8 -10 0 0 Z"
              fill="#EA4335"
              filter="drop-shadow(0 3px 5px rgba(0,0,0,0.3))"
            />
            {/* White Center Dot */}
            <circle cx="0" cy="-25" r="4.5" fill="#FFFFFF" />
          </g>
        </svg>
      </div>

      {/* Top Floating Google Maps Widgets */}
      <div className="relative z-10 p-3 sm:p-4 space-y-2 pointer-events-none">
        {/* Turn-by-Turn Green HUD (Classic Google Maps Navigation header) */}
        {showTurnByTurnBanner && (
          <div className="pointer-events-auto bg-[#0F9D58] text-white p-3 sm:p-3.5 rounded-2xl shadow-lg shadow-emerald-950/20 flex items-center justify-between gap-3 animate-in fade-in slide-in-from-top-2">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-xs flex items-center justify-center shrink-0">
                <CornerUpRight className="w-6 h-6 text-white stroke-[2.5]" />
              </div>
              <div className="min-w-0">
                <div className="text-sm sm:text-base font-extrabold leading-tight truncate">
                  En 200 m gira a la derecha
                </div>
                <div className="text-xs text-emerald-100 font-medium truncate">
                  Hacia Av. Insurgentes Sur
                </div>
              </div>
            </div>

            <div className="text-right shrink-0 bg-white/15 px-3 py-1 rounded-xl">
              <span className="text-sm font-black block">{etaMinutes} min</span>
              <span className="text-[10px] text-emerald-100 font-bold">{distanceKm} km</span>
            </div>
          </div>
        )}

        {/* Minimal Search & Destination Pill (When turn-by-turn is off) */}
        {!showTurnByTurnBanner && (
          <div className="pointer-events-auto inline-flex items-center gap-2 bg-white/95 backdrop-blur-md px-3.5 py-2 rounded-2xl shadow-md border border-slate-200/80 text-xs font-bold text-slate-800">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
            <span className="truncate max-w-[200px] sm:max-w-xs">{destinationLabel}</span>
            <span className="text-slate-400 font-normal">({distanceKm} km)</span>
          </div>
        )}
      </div>

      {/* Bottom Floating Google Maps Controls & Info */}
      <div className="relative z-10 p-3 sm:p-4 flex items-end justify-between gap-3 pointer-events-none">
        {/* Left Bottom: Live ETA & Status Tag */}
        <div className="pointer-events-auto bg-white/95 backdrop-blur-md p-2.5 sm:p-3 rounded-2xl shadow-md border border-slate-200/80 flex items-center gap-3 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-blue-600 animate-ping" />
            <span className="font-extrabold text-slate-900">
              {etaMinutes} min
            </span>
            <span className="text-slate-400 font-medium">({distanceKm} km)</span>
          </div>
          <div className="h-4 w-px bg-slate-200" />
          <span className="text-[11px] font-bold text-blue-600 flex items-center gap-1">
            <Navigation className="w-3 h-3" />
            Ruta más rápida
          </span>
        </div>

        {/* Right Bottom: Standard Google Maps Floating Zoom & Recenter Controls */}
        <div className="pointer-events-auto flex flex-col items-center gap-2">
          {/* Recenter Button */}
          <button
            type="button"
            onClick={handleRecenter}
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-white shadow-md border border-slate-200/80 flex items-center justify-center text-slate-700 hover:text-blue-600 hover:bg-slate-50 transition active:scale-95 cursor-pointer"
            title="Centrar mi ubicación"
          >
            <LocateFixed className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
          </button>

          {/* Zoom In / Out Group */}
          <div className="bg-white rounded-xl shadow-md border border-slate-200/80 flex flex-col divide-y divide-slate-100 overflow-hidden">
            <button
              type="button"
              onClick={handleZoomIn}
              className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition active:scale-95 cursor-pointer"
              title="Acercar mapa"
            >
              <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
            <button
              type="button"
              onClick={handleZoomOut}
              className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition active:scale-95 cursor-pointer"
              title="Alejar mapa"
            >
              <Minus className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Google Legal & Watermark attribution bar */}
      <div className="absolute bottom-1 left-2.5 z-10 pointer-events-none text-[9px] font-semibold text-slate-400 select-none">
        Google <span className="font-normal opacity-70">| Datos del mapa ©2026</span>
      </div>
    </div>
  );
};
