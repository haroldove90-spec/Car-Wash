import React, { useState } from 'react';
import { Sliders, DollarSign, Check, Navigation, Car, Sparkles } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { VehicleCategory } from '../../types';

export const AdminPricing: React.FC = () => {
  const { pricingSettings, updateBaseRate, updateDistanceRate, vehicles } = useApp();

  const [distanceRate, setDistanceRate] = useState<number>(pricingSettings.distanceRatePerKm);
  const [baseRates, setBaseRates] = useState<Record<VehicleCategory, number>>({
    ...pricingSettings.baseRates,
  });
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSavePricing = (e: React.FormEvent) => {
    e.preventDefault();
    updateDistanceRate(Number(distanceRate));
    Object.keys(baseRates).forEach(cat => {
      updateBaseRate(cat as VehicleCategory, Number(baseRates[cat as VehicleCategory]));
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-12 animate-in fade-in">
      <div>
        <h2 className="text-xl sm:text-2xl font-black text-slate-900">
          Configuración de Precios & Tarifas
        </h2>
        <p className="text-xs text-slate-500">
          Ajusta las tarifas base por categoría de vehículo y el cobro por kilómetro de traslado
        </p>
      </div>

      {savedSuccess && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-xs font-bold flex items-center gap-2 animate-in fade-in">
          <Check className="w-4 h-4 text-emerald-600" />
          <span>¡Tarifas actualizadas correctamente en todo el sistema!</span>
        </div>
      )}

      <form onSubmit={handleSavePricing} className="space-y-6">
        {/* Distance Pricing Card */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-5 sm:p-6 shadow-xs space-y-3">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
            <Navigation className="w-4 h-4 text-indigo-600" />
            <h3 className="text-sm font-extrabold text-slate-900">
              Costo por Traslado / Distancia
            </h3>
          </div>

          <div className="max-w-md">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Tarifa por Kilómetro ($ MXN / km)
            </label>
            <div className="relative mt-1">
              <DollarSign className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="number"
                min="0"
                step="1"
                value={distanceRate}
                onChange={e => setDistanceRate(Number(e.target.value))}
                className="w-full text-sm font-bold bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2.5 outline-none focus:border-indigo-600 focus:bg-white"
                required
              />
            </div>
            <p className="text-[11px] text-slate-500 mt-1.5 leading-relaxed">
              Se multiplica automáticamente por la distancia en km calculada entre la base y el domicilio del cliente.
            </p>
          </div>
        </div>

        {/* Base Rates per Vehicle Category */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-5 sm:p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
            <Car className="w-4 h-4 text-indigo-600" />
            <h3 className="text-sm font-extrabold text-slate-900">
              Tarifas Base por Categoría de Vehículo
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {vehicles.map(v => (
              <div key={v.id} className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/70 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900">{v.name}</span>
                  <span className="text-[10px] text-slate-400 font-mono">ID: {v.id}</span>
                </div>
                <div className="relative">
                  <DollarSign className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="number"
                    min="10"
                    step="5"
                    value={baseRates[v.id] || v.basePrice}
                    onChange={e =>
                      setBaseRates(prev => ({
                        ...prev,
                        [v.id]: Number(e.target.value),
                      }))
                    }
                    className="w-full text-xs font-black bg-white border border-slate-200 rounded-xl pl-8 pr-3 py-2 outline-none focus:border-indigo-600"
                    required
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <button
          type="submit"
          className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white font-bold text-xs rounded-xl shadow-md shadow-indigo-500/25 transition active:scale-95 cursor-pointer"
        >
          Guardar Nuevos Precios
        </button>
      </form>
    </div>
  );
};
