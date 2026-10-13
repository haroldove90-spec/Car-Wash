import React, { useState } from 'react';
import { Star, Clock, Check, ArrowRight, Shield, Sparkles, Filter } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { VehicleIllustration } from '../common/VehicleIllustrations';
import { VehicleCategory } from '../../types';

interface ClientHomeProps {
  onSelectVehicle: (category: VehicleCategory) => void;
}

export const ClientHome: React.FC<ClientHomeProps> = ({ onSelectVehicle }) => {
  const { vehicles, setActiveTab } = useApp();
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'compact' | 'suv' | 'vip'>('all');

  const filteredVehicles = vehicles.filter(v => {
    if (selectedFilter === 'compact') return v.id === 'chico' || v.id === 'sedan';
    if (selectedFilter === 'suv') return v.id === 'suv' || v.id === 'pickup';
    if (selectedFilter === 'vip') return v.id === 'vip';
    return true;
  });

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* Hero Banner inspired by the clean gradient look in the sample */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-600 via-indigo-700 to-violet-700 p-6 sm:p-8 text-white shadow-xl shadow-indigo-500/20">
        <div className="relative z-10 max-w-xl space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-xs font-bold uppercase tracking-wider text-indigo-100">
            <Sparkles className="w-3.5 h-3.5 text-cyan-300" />
            Servicio Premium a Domicilio
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight leading-tight">
            Lavado profesional donde te encuentres
          </h1>
          <p className="text-xs sm:text-sm text-indigo-100 leading-relaxed max-w-md">
            Sin filas ni traslados. Llevamos agua tratada, energía y productos biodegradables directamente a tu casa u oficina.
          </p>

          <div className="pt-2 flex flex-wrap gap-4 text-xs font-semibold text-indigo-100">
            <span className="flex items-center gap-1">
              <Check className="w-4 h-4 text-emerald-400" /> Agua 100% propia
            </span>
            <span className="flex items-center gap-1">
              <Check className="w-4 h-4 text-emerald-400" /> Monitoreo en vivo
            </span>
            <span className="flex items-center gap-1">
              <Check className="w-4 h-4 text-emerald-400" /> Pago seguro
            </span>
          </div>
        </div>

        {/* Decorative background vehicle outline */}
        <div className="absolute -bottom-6 -right-6 w-72 h-44 opacity-20 sm:opacity-30 pointer-events-none">
          <VehicleIllustration type="sport" className="w-full h-full" />
        </div>
      </div>

      {/* Vehicle Category Filter Pills */}
      <div className="flex items-center justify-between gap-2 overflow-x-auto pb-1">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider hidden sm:inline">
            Filtrar:
          </span>
          {[
            { id: 'all', label: 'Todos los Autos' },
            { id: 'compact', label: 'Sedanes y Chicos' },
            { id: 'suv', label: 'SUVs & Pick-ups' },
            { id: 'vip', label: 'VIP / Deportivo' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setSelectedFilter(tab.id as any)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                selectedFilter === tab.id
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <span className="text-xs font-medium text-slate-400 whitespace-nowrap">
          {filteredVehicles.length} opciones
        </span>
      </div>

      {/* Grid of Vehicle Cards (matching the Car Booking sample cards from image.png) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredVehicles.map(vehicle => (
          <div
            key={vehicle.id}
            className="group relative bg-white rounded-3xl border border-indigo-100/70 p-5 shadow-xs hover:shadow-xl hover:border-indigo-300 transition-all duration-300 flex flex-col justify-between"
          >
            {/* Header of Card */}
            <div>
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="text-base sm:text-lg font-extrabold text-slate-900 group-hover:text-indigo-600 transition-colors">
                    {vehicle.name}
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">{vehicle.tagline}</p>
                </div>
                {/* Rating Badge */}
                <div className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-amber-50 border border-amber-100 text-amber-700 text-xs font-bold">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span>{vehicle.rating}</span>
                </div>
              </div>

              {/* Vehicle Vector Graphic Centerpiece */}
              <div className="my-4 py-3 bg-gradient-to-b from-indigo-50/40 via-purple-50/20 to-transparent rounded-2xl flex items-center justify-center relative overflow-hidden group-hover:scale-102 transition-transform duration-300">
                <VehicleIllustration
                  type={vehicle.imageSvgType}
                  className="w-44 h-24"
                />
              </div>

              {/* Feature Highlights */}
              <div className="space-y-1.5 mb-5">
                <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Incluye en este servicio:
                </div>
                {vehicle.features.slice(0, 3).map((feat, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-xs text-slate-600">
                    <Check className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                    <span className="truncate">{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom Footer of Card: Price & Action CTA */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">
                  Tarifa base
                </span>
                <div className="flex items-baseline gap-1">
                  <span className="text-xl sm:text-2xl font-black text-slate-900">
                    ${vehicle.basePrice}
                  </span>
                  <span className="text-xs font-bold text-slate-500">MXN</span>
                </div>
              </div>

              <button
                onClick={() => {
                  onSelectVehicle(vehicle.id);
                  setActiveTab('agendar');
                }}
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white rounded-xl text-xs sm:text-sm font-bold shadow-md shadow-indigo-500/25 active:scale-95 transition-all cursor-pointer"
              >
                <span>Reservar</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
