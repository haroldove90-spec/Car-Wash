import React, { useState } from 'react';
import {
  Layers,
  Search,
  Filter,
  Car,
  MapPin,
  Clock,
  UserCheck,
  CheckCircle2,
  AlertCircle,
  Sparkles,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { OrderStatus, ServiceOrder } from '../../types';

export const AdminOrders: React.FC = () => {
  const { orders, washers, assignOrderWasher, updateOrderStatus } = useApp();

  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredOrders = orders.filter(o => {
    if (filterStatus !== 'all' && o.status !== filterStatus) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        o.orderNumber.toLowerCase().includes(q) ||
        o.clientName.toLowerCase().includes(q) ||
        o.vehicle.plates.toLowerCase().includes(q) ||
        o.address.address.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6 pb-12 animate-in fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900">
            Gestión y Monitoreo de Solicitudes
          </h2>
          <p className="text-xs text-slate-500">
            Control en vivo de citas agendadas, asignación de lavadores y semáforo de estatus
          </p>
        </div>

        <span className="text-xs font-bold bg-white px-3 py-1.5 rounded-xl border border-slate-200 text-slate-600 self-start sm:self-auto">
          {filteredOrders.length} órdenes encontradas
        </span>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-2xs">
        {/* Search Input */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Buscar por orden, cliente, placa..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-indigo-600 focus:bg-white"
          />
        </div>

        {/* Status Filter Buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          {[
            { id: 'all', label: 'Todas' },
            { id: 'asignada', label: 'Asignadas' },
            { id: 'en_camino', label: 'En Camino' },
            { id: 'iniciado', label: 'En Lavado' },
            { id: 'concluido', label: 'Concluidas' },
          ].map(f => (
            <button
              key={f.id}
              onClick={() => setFilterStatus(f.id)}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                filterStatus === f.id
                  ? 'bg-indigo-600 text-white shadow-2xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Orders Table & Cards */}
      <div className="space-y-4">
        {filteredOrders.map(order => (
          <div
            key={order.id}
            className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-xs space-y-4 hover:border-slate-300 transition"
          >
            {/* Order Head */}
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold text-xs bg-indigo-50 text-indigo-700 border border-indigo-200 px-2 py-0.5 rounded-lg">
                  {order.orderNumber}
                </span>
                <span className="text-xs font-bold text-slate-900">{order.clientName}</span>
                <span className="text-xs text-slate-400">({order.clientPhone})</span>
              </div>

              {/* Status Selector Dropdown (Allows Admin to force or change status) */}
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase hidden sm:inline">
                  Estatus:
                </span>
                <select
                  value={order.status}
                  onChange={e => updateOrderStatus(order.id, e.target.value as OrderStatus)}
                  className={`text-xs font-bold rounded-xl px-2.5 py-1 border outline-none cursor-pointer ${
                    order.status === 'concluido'
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                      : order.status === 'iniciado'
                      ? 'bg-amber-50 text-amber-800 border-amber-200'
                      : 'bg-indigo-50 text-indigo-800 border-indigo-200'
                  }`}
                >
                  <option value="asignada">1. Asignada</option>
                  <option value="en_camino">2. En Camino</option>
                  <option value="en_domicilio">3. En Domicilio</option>
                  <option value="iniciado">4. Lavado Iniciado</option>
                  <option value="concluido">5. Lavado Concluido</option>
                  <option value="cancelado">Cancelado</option>
                </select>
              </div>
            </div>

            {/* Order Body Details Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Vehículo Solicitado
                </span>
                <div className="font-extrabold text-slate-900 mt-0.5">{order.vehicle.name}</div>
                <div className="text-slate-500 text-[11px]">
                  {order.vehicle.brandModel} • Placas: {order.vehicle.plates}
                </div>
              </div>

              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Fecha & Domicilio
                </span>
                <div className="font-semibold text-slate-800 mt-0.5">
                  {order.scheduledDate} ({order.scheduledTimeSlot})
                </div>
                <div className="text-slate-500 text-[11px] truncate">{order.address.address}</div>
              </div>

              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Lavador Asignado
                </span>
                <div className="mt-1">
                  <select
                    value={order.washer?.id || ''}
                    onChange={e => assignOrderWasher(order.id, e.target.value)}
                    className="w-full text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl p-1.5 outline-none focus:border-indigo-600 cursor-pointer"
                  >
                    {washers.map(w => (
                      <option key={w.id} value={w.id}>
                        {w.name} (★{w.rating})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="sm:text-right">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Cobro Total
                </span>
                <div className="font-black text-slate-900 text-base mt-0.5">
                  ${order.pricing.total.toFixed(2)} MXN
                </div>
                {order.pricing.discountAmount > 0 ? (
                  <span className="text-[10px] font-bold text-emerald-600 block">
                    Cupón {order.pricing.couponCodeApplied}: -${order.pricing.discountAmount.toFixed(2)}
                  </span>
                ) : (
                  <span className="text-[10px] text-slate-400 block">Sin cupón</span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
