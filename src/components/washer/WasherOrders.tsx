import React from 'react';
import {
  Car,
  MapPin,
  Phone,
  Clock,
  Play,
  CheckCircle2,
  AlertTriangle,
  Navigation,
  MessageSquare,
  Sparkles,
  ArrowRight,
  ShieldAlert,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { OrderStatus, ServiceOrder } from '../../types';

export const WasherOrders: React.FC = () => {
  const { orders, updateOrderStatus, setActiveTab, washers, activeWasherId } = useApp();

  const currentWasher = washers.find(w => w.id === activeWasherId) || washers[0];

  // Orders assigned to this washer or active in system
  const assignedOrders = orders.filter(
    o => o.washer?.id === currentWasher.id || o.status !== 'concluido'
  );

  const activeOrder = assignedOrders.find(
    o => o.status !== 'concluido' && o.status !== 'cancelado'
  );

  const getStatusButton = (order: ServiceOrder) => {
    switch (order.status) {
      case 'asignada':
        return (
          <button
            onClick={() => updateOrderStatus(order.id, 'en_camino')}
            className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs rounded-xl shadow-md shadow-blue-500/25 flex items-center justify-center gap-2 active:scale-98 transition cursor-pointer"
          >
            <Navigation className="w-4 h-4 animate-bounce" />
            <span>Actualizar: "Voy en camino"</span>
          </button>
        );
      case 'en_camino':
        return (
          <button
            onClick={() => updateOrderStatus(order.id, 'en_domicilio')}
            className="w-full py-3 px-4 bg-purple-600 hover:bg-purple-700 text-white font-extrabold text-xs rounded-xl shadow-md shadow-purple-500/25 flex items-center justify-center gap-2 active:scale-98 transition cursor-pointer"
          >
            <MapPin className="w-4 h-4" />
            <span>Actualizar: "Llegué al domicilio"</span>
          </button>
        );
      case 'en_domicilio':
        return (
          <button
            onClick={() => updateOrderStatus(order.id, 'iniciado')}
            className="w-full py-3 px-4 bg-amber-600 hover:bg-amber-700 text-white font-extrabold text-xs rounded-xl shadow-md shadow-amber-500/25 flex items-center justify-center gap-2 active:scale-98 transition cursor-pointer"
          >
            <Play className="w-4 h-4" />
            <span>Actualizar: "Iniciar lavado"</span>
          </button>
        );
      case 'iniciado':
        return (
          <button
            onClick={() => updateOrderStatus(order.id, 'concluido')}
            className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl shadow-md shadow-emerald-500/25 flex items-center justify-center gap-2 active:scale-98 transition cursor-pointer"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Actualizar: "Servicio terminado"</span>
          </button>
        );
      case 'concluido':
      default:
        return (
          <div className="w-full py-2.5 px-4 bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold rounded-xl text-center flex items-center justify-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Servicio Concluido Exitosamente</span>
          </div>
        );
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12 animate-in fade-in">
      {/* Top Washer Profile Card */}
      <div className="bg-gradient-to-r from-violet-600 via-indigo-600 to-indigo-700 p-5 rounded-3xl text-white shadow-xl shadow-indigo-600/20 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <img
            src={currentWasher.avatar}
            alt={currentWasher.name}
            className="w-14 h-14 rounded-2xl object-cover ring-2 ring-white/30 shadow-md shrink-0"
          />
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-violet-200">
              Operador en Turno
            </span>
            <h2 className="text-lg font-black">{currentWasher.name}</h2>
            <div className="text-xs text-indigo-100 flex items-center gap-2 mt-0.5">
              <span>{currentWasher.vehicleType}</span>
              <span>•</span>
              <span className="text-emerald-300 font-bold">Disponible en ruta</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/15">
          <div className="text-center">
            <span className="text-[10px] text-violet-200 uppercase font-bold block">
              Calificación
            </span>
            <span className="text-base font-black text-amber-300">★ {currentWasher.rating}</span>
          </div>
          <div className="w-px h-7 bg-white/20" />
          <div className="text-center">
            <span className="text-[10px] text-violet-200 uppercase font-bold block">
              Completados
            </span>
            <span className="text-base font-black">{currentWasher.completedServices}</span>
          </div>
        </div>
      </div>

      {/* Active Service Urgent Action Card (Recepción de Servicios) */}
      {activeOrder ? (
        <div className="bg-white rounded-3xl border-2 border-indigo-500/40 p-5 sm:p-6 shadow-md space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-indigo-600 animate-ping" />
              <span className="text-xs font-black uppercase tracking-wider text-indigo-600">
                Servicio Activo en Proceso
              </span>
              <span className="text-xs font-mono font-bold bg-slate-100 px-2 py-0.5 rounded text-slate-700">
                {activeOrder.orderNumber}
              </span>
            </div>
            <span className="text-xs font-bold px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full border border-indigo-100">
              Estado: {activeOrder.status.replace('_', ' ').toUpperCase()}
            </span>
          </div>

          {/* Vehicle and Client Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Vehicle info */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-2">
              <div className="flex items-center gap-2 text-indigo-600 font-bold text-xs uppercase tracking-wider">
                <Car className="w-4 h-4" />
                <span>Datos del Vehículo</span>
              </div>
              <div className="text-base font-black text-slate-900">
                {activeOrder.vehicle.name}
              </div>
              <div className="text-xs text-slate-600 space-y-0.5">
                <p>
                  <strong>Modelo:</strong> {activeOrder.vehicle.brandModel}
                </p>
                <p>
                  <strong>Color:</strong> {activeOrder.vehicle.color}
                </p>
                <p>
                  <strong>Placas:</strong>{' '}
                  <span className="font-mono font-bold bg-white px-2 py-0.5 rounded border border-slate-200">
                    {activeOrder.vehicle.plates}
                  </span>
                </p>
              </div>

              {activeOrder.extras.length > 0 && (
                <div className="pt-2 border-t border-slate-200">
                  <span className="text-[10px] font-bold uppercase text-indigo-600 block">
                    Servicios extras solicitados:
                  </span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {activeOrder.extras.map(e => (
                      <span
                        key={e.id}
                        className="text-[10px] bg-indigo-100 text-indigo-800 font-bold px-2 py-0.5 rounded-md"
                      >
                        +{e.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Address & Client Notes */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-2">
              <div className="flex items-center gap-2 text-indigo-600 font-bold text-xs uppercase tracking-wider">
                <MapPin className="w-4 h-4" />
                <span>Dirección del Cliente</span>
              </div>
              <div className="text-xs font-bold text-slate-900 leading-tight">
                {activeOrder.address.address}
              </div>
              <p className="text-xs text-slate-500 italic">
                {activeOrder.address.references || 'Sin referencias adicionales'}
              </p>

              {activeOrder.clientNotes && (
                <div className="p-2.5 bg-amber-50 rounded-xl border border-amber-200 text-amber-900 text-xs">
                  <span className="font-bold block text-[10px] uppercase text-amber-800">
                    Nota del cliente:
                  </span>
                  "{activeOrder.clientNotes}"
                </div>
              )}

              {/* Quick Communication & GPS Navigation */}
              <div className="flex gap-2 pt-2">
                <a
                  href={`tel:${activeOrder.clientPhone}`}
                  className="flex-1 py-2 px-3 bg-white hover:bg-slate-100 text-slate-700 rounded-xl border border-slate-200 text-xs font-bold flex items-center justify-center gap-1.5 transition"
                >
                  <Phone className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Llamar</span>
                </a>
                <button
                  type="button"
                  onClick={() => setActiveTab('ruta')}
                  className="flex-1 py-2 px-3 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-xl border border-indigo-200 text-xs font-bold flex items-center justify-center gap-1.5 transition cursor-pointer"
                >
                  <Navigation className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Ver en Ruta</span>
                </button>
              </div>
            </div>
          </div>

          {/* Action Button: Estado actual y botón de avance rápido */}
          <div className="pt-2">{getStatusButton(activeOrder)}</div>
        </div>
      ) : (
        <div className="p-8 bg-white rounded-3xl border border-slate-200 text-center space-y-3">
          <div className="w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-600 mx-auto flex items-center justify-center">
            <CheckCircle2 className="w-7 h-7 text-emerald-500" />
          </div>
          <h3 className="text-base font-extrabold text-slate-800">
            No tienes órdenes pendientes en este momento
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Todas tus órdenes han sido concluidas. Nuevas solicitudes se asignarán automáticamente cuando los clientes agenden.
          </p>
        </div>
      )}

      {/* Lista de otras órdenes asignadas / concluidas recientemente */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-xs space-y-4">
        <h3 className="text-sm font-extrabold text-slate-900">
          Historial de Servicios del Turno
        </h3>

        <div className="space-y-3">
          {assignedOrders.map(order => (
            <div
              key={order.id}
              className="p-4 rounded-2xl border border-slate-100 hover:border-slate-200 bg-slate-50/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs"
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-slate-800 bg-slate-200 px-2 py-0.5 rounded text-[10px]">
                    {order.orderNumber}
                  </span>
                  <span className="font-bold text-slate-900">{order.vehicle.name}</span>
                  <span className="text-slate-400">({order.vehicle.plates})</span>
                </div>
                <p className="text-slate-500 text-[11px] mt-1">{order.address.address}</p>
              </div>

              <div className="flex items-center gap-3 self-end sm:self-auto">
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block">
                    Comisión
                  </span>
                  <span className="font-black text-slate-900">
                    ${(order.pricing.total * 0.45).toFixed(2)} MXN
                  </span>
                </div>
                <span
                  className={`px-2.5 py-1 rounded-xl text-[10px] font-bold uppercase ${
                    order.status === 'concluido'
                      ? 'bg-emerald-50 text-emerald-700'
                      : 'bg-indigo-50 text-indigo-700'
                  }`}
                >
                  {order.status.replace('_', ' ')}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
