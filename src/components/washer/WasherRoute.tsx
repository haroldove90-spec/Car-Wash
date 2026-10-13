import React from 'react';
import {
  Navigation,
  MapPin,
  Phone,
  MessageSquare,
  Clock,
  Compass,
  ArrowRight,
  Shield,
  Car,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const WasherRoute: React.FC = () => {
  const { orders, updateOrderStatus, setActiveTab } = useApp();

  const activeOrder = orders.find(
    o => o.status !== 'concluido' && o.status !== 'cancelado'
  ) || orders[0];

  if (!activeOrder) {
    return (
      <div className="bg-white rounded-3xl p-8 border border-slate-200 text-center max-w-md mx-auto my-12">
        <MapPin className="w-12 h-12 text-slate-300 mx-auto mb-3" />
        <h3 className="text-base font-bold text-slate-800">Sin ruta activa</h3>
        <p className="text-xs text-slate-500 mt-1">
          No hay órdenes asignadas pendientes de navegación en este momento.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12 animate-in fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900">
            Navegación & Ruta GPS
          </h2>
          <p className="text-xs text-slate-500">
            Trayecto hacia el domicilio de {activeOrder.clientName}
          </p>
        </div>
        <span className="text-xs font-mono font-bold bg-indigo-50 text-indigo-700 px-3 py-1 rounded-xl border border-indigo-200">
          Orden {activeOrder.orderNumber}
        </span>
      </div>

      {/* Main Full-Width GPS Map Screen (inspired by the sample map with route lines) */}
      <div className="relative h-96 sm:h-[420px] rounded-3xl overflow-hidden border border-slate-200 bg-slate-900 shadow-lg flex flex-col justify-between p-4 sm:p-6">
        {/* Animated Map Graphic */}
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 600 420" fill="none">
          {/* Dark map terrain */}
          <rect width="600" height="420" fill="#0F172A" />

          {/* Grid street layout */}
          <path d="M 0 100 L 600 100" stroke="#1E293B" strokeWidth="8" />
          <path d="M 0 250 L 600 250" stroke="#1E293B" strokeWidth="8" />
          <path d="M 160 0 L 160 420" stroke="#1E293B" strokeWidth="8" />
          <path d="M 440 0 L 440 420" stroke="#1E293B" strokeWidth="8" />
          <path d="M 300 0 L 300 420" stroke="#1E293B" strokeWidth="5" />

          {/* Diagonal avenues */}
          <path d="M 0 350 L 600 150" stroke="#334155" strokeWidth="6" />

          {/* Vibrant Route Path (Violet / Indigo Gradient Glow) */}
          <path
            d="M 120 360 L 160 250 L 300 250 L 440 160 L 480 80"
            stroke="#8B5CF6"
            strokeWidth="8"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="filter drop-shadow-[0_0_8px_rgba(139,92,246,0.8)]"
          />

          {/* Washer icon / position */}
          <circle cx="260" cy="250" r="14" fill="#6366F1" />
          <circle cx="260" cy="250" r="26" stroke="#818CF8" strokeWidth="3" opacity="0.6" />
          <polygon points="260,240 268,258 252,258" fill="#FFFFFF" />

          {/* Destination Pin */}
          <circle cx="480" cy="80" r="12" fill="#10B981" />
          <circle cx="480" cy="80" r="22" stroke="#34D399" strokeWidth="3" opacity="0.6" />
        </svg>

        {/* Top Info Float Bar */}
        <div className="relative z-10 flex flex-wrap items-center justify-between gap-2 bg-slate-900/90 backdrop-blur-md p-3.5 rounded-2xl border border-slate-700 text-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white">
              <Navigation className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-bold block">
                Próxima Maniobra
              </span>
              <span className="text-xs font-bold">Girar a la derecha en Av. Insurgentes Sur a 250m</span>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs font-bold">
            <div>
              <span className="text-[10px] text-slate-400 uppercase block">Distancia</span>
              <span className="text-emerald-400">{activeOrder.address.distanceKm} km</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 uppercase block">Tiempo estimado</span>
              <span className="text-indigo-300">~12 min</span>
            </div>
          </div>
        </div>

        {/* Bottom Destination Card on Map */}
        <div className="relative z-10 bg-white/95 backdrop-blur-md p-4 rounded-2xl border border-slate-200 text-slate-900 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xl">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-indigo-600 shrink-0" />
              <span className="text-xs font-bold text-slate-900">{activeOrder.address.label}</span>
              <span className="text-[11px] text-slate-500 font-normal">({activeOrder.clientName})</span>
            </div>
            <p className="text-xs text-slate-600 line-clamp-1">{activeOrder.address.address}</p>
            <p className="text-[10px] text-slate-400 italic">{activeOrder.address.references}</p>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <a
              href={`tel:${activeOrder.clientPhone}`}
              className="py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold flex items-center gap-1.5 transition"
            >
              <Phone className="w-3.5 h-3.5 text-indigo-600" />
              <span>Llamar</span>
            </a>
            {activeOrder.status === 'en_camino' && (
              <button
                onClick={() => updateOrderStatus(activeOrder.id, 'en_domicilio')}
                className="py-2 px-4 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold shadow-md transition cursor-pointer"
              >
                Confirmar "Llegué al Domicilio"
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
