import React from 'react';
import {
  Navigation,
  MapPin,
  Phone,
  MessageSquare,
  Clock,
  Compass,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Car,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { GoogleMapLight } from '../common/GoogleMapLight';

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
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600">
              Navegación en Vivo Estilo Google Maps
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-0.5">
            Ruta al Domicilio de {activeOrder.clientName}
          </h2>
        </div>
        <span className="text-xs font-mono font-bold bg-blue-50 text-blue-700 px-3 py-1 rounded-xl border border-blue-200 self-start sm:self-auto">
          Orden {activeOrder.orderNumber}
        </span>
      </div>

      {/* Clear Google Maps Component with Turn-by-Turn HUD */}
      <div className="space-y-4">
        <GoogleMapLight
          heightClass="h-96 sm:h-[440px]"
          originLabel="Tu ubicación (Unidad Móvil)"
          destinationLabel={activeOrder.address.label}
          destinationAddress={activeOrder.address.address}
          distanceKm={activeOrder.address.distanceKm}
          etaMinutes={12}
          showTurnByTurnBanner={true}
          driverName={activeOrder.washer?.name}
          orderNumber={activeOrder.orderNumber}
          status={activeOrder.status}
        />

        {/* Destination & Action Details Card */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-rose-500" />
              <span className="text-sm font-extrabold text-slate-900">
                {activeOrder.address.label} ({activeOrder.clientName})
              </span>
              <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">
                {activeOrder.address.distanceKm} km
              </span>
            </div>
            <p className="text-xs text-slate-600">{activeOrder.address.address}</p>
            {activeOrder.address.references && (
              <p className="text-[11px] text-slate-400 italic">
                Ref: {activeOrder.address.references}
              </p>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto">
            <a
              href={`tel:${activeOrder.clientPhone}`}
              className="py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition"
            >
              <Phone className="w-4 h-4 text-blue-600" />
              <span>Llamar al Cliente</span>
            </a>

            <a
              href={`https://wa.me/${activeOrder.clientPhone.replace(/[^0-9]/g, '')}`}
              target="_blank"
              rel="noreferrer"
              className="py-2.5 px-4 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition border border-emerald-200"
            >
              <MessageSquare className="w-4 h-4 text-emerald-600" />
              <span>WhatsApp</span>
            </a>

            {activeOrder.status === 'en_camino' && (
              <button
                onClick={() => updateOrderStatus(activeOrder.id, 'en_domicilio')}
                className="py-2.5 px-5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl text-xs font-black shadow-md shadow-blue-500/25 transition cursor-pointer"
              >
                Confirmar "Llegué al Domicilio"
              </button>
            )}

            {activeOrder.status === 'en_domicilio' && (
              <button
                onClick={() => updateOrderStatus(activeOrder.id, 'iniciado')}
                className="py-2.5 px-5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white rounded-xl text-xs font-black shadow-md transition cursor-pointer"
              >
                "Iniciar Lavado"
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
