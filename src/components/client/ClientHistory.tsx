import React from 'react';
import {
  Calendar,
  Clock,
  MapPin,
  Car,
  Star,
  CheckCircle2,
  ChevronRight,
  Receipt,
  RotateCcw,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ServiceOrder } from '../../types';

export const ClientHistory: React.FC = () => {
  const { orders, setActiveOrder, setActiveTab, setRatingModalOrder } = useApp();

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'concluido':
        return (
          <span className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 text-[11px] font-bold border border-emerald-100 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" /> Concluido
          </span>
        );
      case 'iniciado':
        return (
          <span className="px-2.5 py-1 rounded-lg bg-orange-50 text-orange-700 text-[11px] font-bold border border-orange-100">
            En Proceso
          </span>
        );
      case 'en_camino':
        return (
          <span className="px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 text-[11px] font-bold border border-blue-100">
            En Camino
          </span>
        );
      case 'en_domicilio':
        return (
          <span className="px-2.5 py-1 rounded-lg bg-purple-50 text-purple-700 text-[11px] font-bold border border-purple-100">
            En Domicilio
          </span>
        );
      case 'asignada':
      default:
        return (
          <span className="px-2.5 py-1 rounded-lg bg-amber-50 text-amber-700 text-[11px] font-bold border border-amber-100">
            Asignada
          </span>
        );
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12 animate-in fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900">
            Mis Servicios y Pedidos
          </h2>
          <p className="text-xs text-slate-500">
            Consulta tus órdenes anteriores, recibos de pago y valoraciones
          </p>
        </div>
        <span className="text-xs font-bold text-slate-500 bg-white px-3 py-1.5 rounded-xl border border-slate-200">
          {orders.length} pedidos totales
        </span>
      </div>

      <div className="space-y-4">
        {orders.map(order => (
          <div
            key={order.id}
            className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-xs hover:shadow-md transition space-y-4"
          >
            {/* Order Top Bar */}
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold text-xs text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md">
                  {order.orderNumber}
                </span>
                <span className="text-xs text-slate-400">•</span>
                <span className="text-xs font-semibold text-slate-500 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  {order.scheduledDate} ({order.scheduledTimeSlot})
                </span>
              </div>
              <div>{getStatusBadge(order.status)}</div>
            </div>

            {/* Order Body Details */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Vehículo
                </span>
                <div className="font-extrabold text-slate-900 mt-0.5">{order.vehicle.name}</div>
                <div className="text-slate-500 text-[11px]">
                  {order.vehicle.brandModel} ({order.vehicle.color}) • {order.vehicle.plates}
                </div>
              </div>

              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Ubicación & Lavador
                </span>
                <div className="font-semibold text-slate-800 mt-0.5 truncate">
                  {order.address.address}
                </div>
                <div className="text-indigo-600 text-[11px] font-medium">
                  {order.washer ? `Lavador: ${order.washer.name}` : 'Asignación pendiente'}
                </div>
              </div>

              <div className="sm:text-right">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Total Pagado
                </span>
                <div className="font-black text-slate-900 text-base mt-0.5">
                  ${order.pricing.total.toFixed(2)} MXN
                </div>
                {order.pricing.discountAmount > 0 && (
                  <div className="text-emerald-600 text-[10px] font-bold">
                    Ahorraste ${order.pricing.discountAmount.toFixed(2)} MXN ({order.pricing.couponCodeApplied})
                  </div>
                )}
              </div>
            </div>

            {/* Review or Actions Footer */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100">
              {order.review ? (
                <div className="flex items-center gap-2 text-xs">
                  <div className="flex items-center gap-1 text-amber-500 font-bold">
                    <Star className="w-4 h-4 fill-amber-400" />
                    <span>{order.review.rating}/5</span>
                  </div>
                  <span className="text-slate-500 italic truncate max-w-xs">
                    "{order.review.comment || 'Servicio impecable'}"
                  </span>
                </div>
              ) : order.status === 'concluido' ? (
                <button
                  onClick={() => setRatingModalOrder(order)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 border border-amber-200 text-amber-800 rounded-xl text-xs font-bold hover:bg-amber-100 transition cursor-pointer"
                >
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span>Dejar valoración al lavador</span>
                </button>
              ) : (
                <div className="text-[11px] text-slate-400">
                  Servicio en desarrollo o activo
                </div>
              )}

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setActiveOrder(order);
                    setActiveTab('monitoreo');
                  }}
                  className="inline-flex items-center gap-1 px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-xl text-xs font-bold transition cursor-pointer"
                >
                  <span>Ver Seguimiento</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
