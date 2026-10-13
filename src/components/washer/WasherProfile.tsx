import React from 'react';
import { User, Phone, Wrench, Star, ShieldCheck, CheckCircle } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const WasherProfile: React.FC = () => {
  const { washers, activeWasherId, setActiveWasherId } = useApp();
  const currentWasher = washers.find(w => w.id === activeWasherId) || washers[0];

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-12 animate-in fade-in">
      <div>
        <h2 className="text-xl sm:text-2xl font-black text-slate-900">
          Perfil del Operador
        </h2>
        <p className="text-xs text-slate-500">
          Credenciales profesionales y unidad asignada de servicio
        </p>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left">
          <img
            src={currentWasher.avatar}
            alt={currentWasher.name}
            className="w-24 h-24 rounded-3xl object-cover ring-4 ring-indigo-100 shadow-md"
          />
          <div className="space-y-1">
            <span className="px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold border border-indigo-100">
              Personal Certificado Car Wash
            </span>
            <h3 className="text-xl font-black text-slate-900">{currentWasher.name}</h3>
            <p className="text-xs text-slate-500">{currentWasher.vehicleType}</p>
            <p className="text-xs text-slate-600 font-semibold">{currentWasher.phone}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-slate-100 text-center">
          <div className="p-3 bg-slate-50 rounded-2xl">
            <span className="text-[10px] text-slate-400 font-bold uppercase block">
              Calificación
            </span>
            <span className="text-base font-black text-amber-500">★ {currentWasher.rating}</span>
          </div>
          <div className="p-3 bg-slate-50 rounded-2xl">
            <span className="text-[10px] text-slate-400 font-bold uppercase block">
              Servicios
            </span>
            <span className="text-base font-black text-slate-900">
              {currentWasher.completedServices}
            </span>
          </div>
          <div className="p-3 bg-slate-50 rounded-2xl">
            <span className="text-[10px] text-slate-400 font-bold uppercase block">
              Puntualidad
            </span>
            <span className="text-base font-black text-emerald-600">99.4%</span>
          </div>
          <div className="p-3 bg-slate-50 rounded-2xl">
            <span className="text-[10px] text-slate-400 font-bold uppercase block">
              Estado
            </span>
            <span className="text-base font-black text-indigo-600 capitalize">
              {currentWasher.status.replace('_', ' ')}
            </span>
          </div>
        </div>

        {/* Change Active Washer Simulator Switcher */}
        <div className="pt-4 border-t border-slate-100">
          <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
            Seleccionar Operador en Demostración:
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {washers.map(w => (
              <button
                key={w.id}
                onClick={() => setActiveWasherId(w.id)}
                className={`p-3 rounded-2xl border text-left flex items-center gap-3 transition cursor-pointer ${
                  activeWasherId === w.id
                    ? 'border-indigo-600 bg-indigo-50/70 shadow-2xs'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <img src={w.avatar} alt={w.name} className="w-9 h-9 rounded-xl object-cover" />
                <div className="min-w-0">
                  <div className="text-xs font-bold text-slate-900 truncate">{w.name}</div>
                  <div className="text-[10px] text-slate-500">★ {w.rating}</div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
