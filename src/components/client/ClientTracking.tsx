import React, { useState } from 'react';
import {
  CheckCircle2,
  Clock,
  MapPin,
  Phone,
  MessageSquare,
  Shield,
  Star,
  Car,
  Navigation,
  Calendar,
  AlertCircle,
  Sparkles,
  ChevronRight,
  Play,
  RotateCcw,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { OrderStatus } from '../../types';
import { VehicleIllustration } from '../common/VehicleIllustrations';
import { GoogleMapLight } from '../common/GoogleMapLight';

export const ClientTracking: React.FC = () => {
  const {
    activeOrder,
    orders,
    setActiveOrder,
    updateOrderStatus,
    setRatingModalOrder,
    setActiveTab,
  } = useApp();

  // If no order is selected as active, take the latest one
  const currentOrder = activeOrder || orders[0];

  // 5 Status Steps (Semáforo de estatus)
  const steps: {
    key: OrderStatus;
    title: string;
    description: string;
    color: string;
    activeBg: string;
    dotColor: string;
  }[] = [
    {
      key: 'asignada',
      title: '1. Solicitud Asignada',
      description: 'Lavador asignado y orden programada',
      color: 'text-amber-600',
      activeBg: 'bg-amber-500',
      dotColor: 'bg-amber-400',
    },
    {
      key: 'en_camino',
      title: '2. Lavador en Camino',
      description: 'Unidad móvil en trayecto hacia tu ubicación',
      color: 'text-blue-600',
      activeBg: 'bg-blue-600',
      dotColor: 'bg-blue-500',
    },
    {
      key: 'en_domicilio',
      title: '3. Lavador en Domicilio',
      description: 'Llegó a la dirección y está preparando el equipo',
      color: 'text-purple-600',
      activeBg: 'bg-purple-600',
      dotColor: 'bg-purple-500',
    },
    {
      key: 'iniciado',
      title: '4. Lavado Iniciado',
      description: 'Espuma activa, aspirado y detallado en proceso',
      color: 'text-orange-600',
      activeBg: 'bg-orange-500',
      dotColor: 'bg-orange-400',
    },
    {
      key: 'concluido',
      title: '5. Lavado Concluido',
      description: 'Vehículo impecable listo para entrega',
      color: 'text-emerald-600',
      activeBg: 'bg-emerald-600',
      dotColor: 'bg-emerald-500',
    },
  ];

  if (!currentOrder) {
    return (
      <div className="bg-white rounded-3xl p-8 border border-slate-200 text-center space-y-4 max-w-md mx-auto my-12">
        <div className="w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-600 mx-auto flex items-center justify-center">
          <Car className="w-8 h-8" />
        </div>
        <h3 className="text-lg font-bold text-slate-800">No tienes servicios activos</h3>
        <p className="text-xs text-slate-500">
          Agenda un servicio a domicilio para ver el semáforo y monitoreo en tiempo real.
        </p>
        <button
          onClick={() => setActiveTab('vehiculos')}
          className="px-6 py-2.5 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-700 transition"
        >
          Elegir Vehículo
        </button>
      </div>
    );
  }

  const currentStatusIndex = steps.findIndex(s => s.key === currentOrder.status);

  // Status simulation quick test
  const handleSimulateNext = () => {
    if (currentStatusIndex < steps.length - 1) {
      const nextStatus = steps[currentStatusIndex + 1].key;
      updateOrderStatus(currentOrder.id, nextStatus);
    }
  };

  const handleResetOrder = () => {
    updateOrderStatus(currentOrder.id, 'asignada');
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-12 animate-in fade-in">
      {/* Header bar of active tracking */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 sm:p-5 rounded-3xl border border-slate-200/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-600">
              Monitoreo en Tiempo Real
            </span>
            <span className="px-2 py-0.5 rounded-md bg-slate-100 text-[10px] font-mono font-bold text-slate-600">
              {currentOrder.orderNumber}
            </span>
          </div>
          <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 mt-0.5">
            {currentOrder.vehicle.name} ({currentOrder.vehicle.brandModel})
          </h2>
        </div>

        {/* Status Quick Simulation Controls (for client/tester preview convenience) */}
        <div className="flex items-center gap-2">
          {currentStatusIndex < steps.length - 1 ? (
            <button
              onClick={handleSimulateNext}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 border border-indigo-200 text-indigo-700 hover:bg-indigo-100 rounded-xl text-xs font-bold transition active:scale-95 cursor-pointer"
              title="Avanzar estado del semáforo para simular progreso"
            >
              <Play className="w-3.5 h-3.5" />
              <span>Avanzar Estado</span>
            </button>
          ) : (
            <button
              onClick={handleResetOrder}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 border border-slate-200 text-slate-700 hover:bg-slate-200 rounded-xl text-xs font-bold transition active:scale-95 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reiniciar Simulación</span>
            </button>
          )}

          {currentOrder.status === 'concluido' && !currentOrder.review && (
            <button
              onClick={() => setRatingModalOrder(currentOrder)}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl text-xs font-bold shadow-md shadow-amber-500/25 animate-bounce cursor-pointer"
            >
              <Star className="w-3.5 h-3.5 fill-white" />
              <span>Calificar Servicio</span>
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Semáforo de Estatus Timeline (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Semáforo Interactive Stepper */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-5 sm:p-6 shadow-xs space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 block">
                  Semáforo de Estatus
                </span>
                <h3 className="text-base font-extrabold text-slate-900">
                  Progreso del Servicio
                </h3>
              </div>
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100">
                Paso {currentStatusIndex + 1} de {steps.length}
              </span>
            </div>

            {/* Stepper Vertical List */}
            <div className="relative pl-6 space-y-6 before:absolute before:left-[17px] before:top-2 before:bottom-2 before:w-1 before:bg-slate-100">
              {steps.map((step, idx) => {
                const isPassed = idx < currentStatusIndex;
                const isCurrent = idx === currentStatusIndex;
                const isPending = idx > currentStatusIndex;

                return (
                  <div key={step.key} className="relative flex items-start gap-4">
                    {/* Circle Indicator */}
                    <div
                      className={`absolute -left-6 w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs transition-all duration-300 ${
                        isPassed
                          ? 'bg-emerald-500 text-white ring-4 ring-emerald-100'
                          : isCurrent
                          ? `${step.activeBg} text-white ring-4 ring-indigo-100 scale-110 animate-pulse`
                          : 'bg-white border-2 border-slate-200 text-slate-400'
                      }`}
                    >
                      {isPassed ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
                    </div>

                    {/* Step Content Card */}
                    <div
                      className={`flex-1 p-3.5 rounded-2xl border transition-all ${
                        isCurrent
                          ? 'bg-gradient-to-r from-indigo-50/70 to-purple-50/40 border-indigo-200 shadow-2xs'
                          : isPassed
                          ? 'bg-slate-50/70 border-slate-200/60'
                          : 'bg-white border-slate-100 opacity-60'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span
                          className={`text-xs font-extrabold ${
                            isCurrent
                              ? step.color
                              : isPassed
                              ? 'text-slate-800'
                              : 'text-slate-400'
                          }`}
                        >
                          {step.title}
                        </span>
                        {isCurrent && (
                          <span className="text-[10px] uppercase font-bold text-indigo-600 bg-white px-2 py-0.5 rounded-md border border-indigo-100 shadow-2xs">
                            En curso
                          </span>
                        )}
                        {isPassed && (
                          <span className="text-[10px] font-semibold text-emerald-600">
                            Completado ✓
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 mt-1 leading-snug">
                        {step.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* If completed, prompt review */}
            {currentOrder.status === 'concluido' && (
              <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 text-emerald-900 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  <div className="text-xs">
                    <span className="font-extrabold block">¡Servicio concluido exitosamente!</span>
                    <span className="text-emerald-700">Tu vehículo ha quedado impecable.</span>
                  </div>
                </div>

                {currentOrder.review ? (
                  <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white rounded-xl border border-emerald-200 text-xs font-bold text-amber-600">
                    <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                    <span>Calificado: {currentOrder.review.rating} ★</span>
                  </div>
                ) : (
                  <button
                    onClick={() => setRatingModalOrder(currentOrder)}
                    className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold hover:bg-emerald-700 transition shrink-0 cursor-pointer"
                  >
                    Calificar al Lavador
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Status Updates Log */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-xs space-y-3">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
              Historial de Avisos y Notificaciones
            </h4>
            <div className="space-y-2">
              {currentOrder.statusHistory.map((item, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between text-xs p-2.5 rounded-xl bg-slate-50 border border-slate-100"
                >
                  <div className="flex items-center gap-2 text-slate-700">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                    <span className="font-medium">{item.note}</span>
                  </div>
                  <span className="text-[11px] font-mono text-slate-400 shrink-0">
                    {item.timestamp}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Washer Info & Route Map (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Assigned Washer Card */}
          {currentOrder.washer && (
            <div className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600">
                  Operador Asignado
                </span>
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-lg border border-amber-100">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span>{currentOrder.washer.rating} (340+ servicios)</span>
                </span>
              </div>

              <div className="flex items-center gap-3">
                <img
                  src={currentOrder.washer.avatar}
                  alt={currentOrder.washer.name}
                  className="w-14 h-14 rounded-2xl object-cover ring-2 ring-indigo-100 shadow-sm"
                />
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-extrabold text-slate-900 truncate">
                    {currentOrder.washer.name}
                  </h4>
                  <p className="text-xs text-slate-500 truncate">
                    {currentOrder.washer.vehicleType}
                  </p>
                  <p className="text-[11px] font-medium text-emerald-600 mt-0.5">
                    ● En servicio activo
                  </p>
                </div>
              </div>

              {/* Direct Communication Buttons */}
              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100">
                <a
                  href={`tel:${currentOrder.washer.phone}`}
                  className="flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-bold border border-slate-200 transition"
                >
                  <Phone className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Llamar</span>
                </a>
                <a
                  href={`https://wa.me/${currentOrder.washer.phone.replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-bold border border-emerald-200 transition"
                >
                  <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
                  <span>WhatsApp</span>
                </a>
              </div>
            </div>
          )}

          {/* Live Simulated Route Map Estilo Google Maps Claro */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Navigation className="w-4 h-4 text-blue-600" />
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-900">
                  Ruta en Vivo (Google Maps)
                </h4>
              </div>
              <span className="text-[11px] font-bold text-slate-500">
                ETA: ~12 minutos
              </span>
            </div>

            <GoogleMapLight
              heightClass="h-64 sm:h-72"
              originLabel="Lavador en Camino"
              destinationLabel={currentOrder.address.label}
              destinationAddress={currentOrder.address.address}
              distanceKm={currentOrder.address.distanceKm}
              etaMinutes={12}
              showTurnByTurnBanner={false}
              status={currentOrder.status}
            />

            <p className="text-[11px] text-slate-500 leading-relaxed italic">
              Dirección: {currentOrder.address.address} • Ref: {currentOrder.address.references}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
