import React, { useState } from 'react';
import {
  Calendar,
  DollarSign,
  Star,
  CheckCircle2,
  TrendingUp,
  Award,
  Clock,
  Car,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const WasherHistory: React.FC = () => {
  const { orders, washers, activeWasherId } = useApp();
  const [filterPeriod, setFilterPeriod] = useState<'day' | 'week' | 'month'>('week');

  const currentWasher = washers.find(w => w.id === activeWasherId) || washers[0];

  const completedOrders = orders.filter(
    o => o.status === 'concluido' && (o.washer?.id === currentWasher.id || !o.washer)
  );

  // Commission calculation (45% commission per wash)
  const totalEarnings = completedOrders.reduce(
    (acc, curr) => acc + curr.pricing.total * 0.45,
    0
  );

  const tipsEstimated = completedOrders.length * 25; // average tip

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12 animate-in fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900">
            Historial de Servicios & Ganancias
          </h2>
          <p className="text-xs text-slate-500">
            Consulta los lavados completados y el desglose de comisiones acumuladas
          </p>
        </div>

        {/* Period Selector */}
        <div className="flex items-center gap-1 bg-white p-1 rounded-2xl border border-slate-200 shadow-2xs">
          {[
            { id: 'day', label: 'Hoy' },
            { id: 'week', label: 'Esta Semana' },
            { id: 'month', label: 'Este Mes' },
          ].map(p => (
            <button
              key={p.id}
              onClick={() => setFilterPeriod(p.id as any)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                filterPeriod === p.id
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Summary Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Total Earnings */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Comisiones Ganadas
            </span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900">
            ${(totalEarnings + tipsEstimated).toFixed(2)} MXN
          </div>
          <span className="text-[11px] text-emerald-600 font-bold block">
            + Incluye ${tipsEstimated} MXN en propinas
          </span>
        </div>

        {/* Services Completed */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Lavados Concluidos
            </span>
            <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900">
            {completedOrders.length} servicios
          </div>
          <span className="text-[11px] text-indigo-600 font-bold block">
            100% tasa de cumplimiento
          </span>
        </div>

        {/* Rating Score */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Satisfacción Clientes
            </span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Star className="w-4 h-4 fill-amber-400" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900">
            {currentWasher.rating} / 5.0
          </div>
          <span className="text-[11px] text-amber-600 font-bold block">
            Calificación sobresaliente
          </span>
        </div>
      </div>

      {/* Detailed Services Table / Cards */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-5 sm:p-6 shadow-xs space-y-4">
        <h3 className="text-sm font-extrabold text-slate-900">
          Detalle de Servicios Concluidos
        </h3>

        <div className="space-y-3">
          {completedOrders.map(order => {
            const comm = order.pricing.total * 0.45;
            return (
              <div
                key={order.id}
                className="p-4 rounded-2xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 transition flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-slate-800 bg-white border border-slate-200 px-2 py-0.5 rounded text-[11px]">
                      {order.orderNumber}
                    </span>
                    <span className="font-extrabold text-slate-900">{order.vehicle.name}</span>
                    <span className="text-slate-400">({order.vehicle.brandModel})</span>
                  </div>
                  <p className="text-slate-500 text-[11px]">
                    {order.address.address} • Cliente: {order.clientName}
                  </p>
                  <p className="text-slate-400 text-[10px]">
                    Fecha: {order.scheduledDate} ({order.scheduledTimeSlot})
                  </p>
                </div>

                <div className="flex items-center gap-4 self-end sm:self-auto">
                  {order.review && (
                    <div className="text-right">
                      <div className="flex items-center gap-1 text-amber-500 font-bold justify-end">
                        <Star className="w-3.5 h-3.5 fill-amber-400" />
                        <span>{order.review.rating} ★</span>
                      </div>
                      <span className="text-[10px] text-slate-400 italic">
                        "{order.review.tags[0] || 'Excelente'}"
                      </span>
                    </div>
                  )}

                  <div className="text-right pl-3 border-l border-slate-200">
                    <span className="text-[10px] text-slate-400 uppercase font-semibold block">
                      Tu Ganancia
                    </span>
                    <span className="text-sm font-black text-emerald-600">
                      +${comm.toFixed(2)} MXN
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
